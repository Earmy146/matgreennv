from collections import defaultdict, deque
from datetime import datetime, timezone
from time import monotonic
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from fastapi import HTTPException, status

from app.config import settings
from app.core.security import ActorContext
from app.services.redis_client import execute_redis_command, is_redis_configured

_minute_requests: dict[str, deque[float]] = defaultdict(deque)
_global_requests: deque[float] = deque()
_daily_counts: dict[str, int] = defaultdict(int)

LUA_RATE_LIMIT = (
    "local current = redis.call('INCR', KEYS[1]); "
    "local ttl = redis.call('TTL', KEYS[1]); "
    "if current == 1 or ttl < 0 then "
    "redis.call('EXPIRE', KEYS[1], ARGV[1]); "
    "end; "
    "return current;"
)

LUA_DAILY_LIMIT = (
    "local current = tonumber(redis.call('GET', KEYS[1]) or '0'); "
    "if current >= tonumber(ARGV[1]) then return current + 1; end; "
    "local next_val = redis.call('INCR', KEYS[1]); "
    "local ttl = redis.call('TTL', KEYS[1]); "
    "if next_val == 1 or ttl < 0 then "
    "redis.call('EXPIRE', KEYS[1], ARGV[2]); "
    "end; "
    "return next_val;"
)


def _today_vn() -> str:
    try:
        tz = ZoneInfo("Asia/Ho_Chi_Minh")
    except ZoneInfoNotFoundError:
        tz = timezone.utc
    return datetime.now(tz).strftime("%Y-%m-%d")


def _enforce_memory_limits(actor: ActorContext, per_min: int, per_day: int) -> None:
    now = monotonic()
    while _global_requests and now - _global_requests[0] >= 60:
        _global_requests.popleft()
    if len(_global_requests) >= settings.max_global_requests_per_minute:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Hệ thống AI đang có nhiều lượt truy cập. Vui lòng thử lại sau ít phút.",
        )
    _global_requests.append(now)

    if actor.is_unlimited:
        return

    window = _minute_requests[actor.actor_id]
    while window and now - window[0] >= 60:
        window.popleft()
    if len(window) >= per_min:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Bạn gửi yêu cầu AI hơi nhanh. Vui lòng chờ 1 phút rồi thử lại nhé.",
        )

    day_key = f"{_today_vn()}:{actor.actor_id}"
    if _daily_counts[day_key] >= per_day:
        msg = (
            "Bạn đã dùng hết lượt dùng thử AI hôm nay. Hãy đăng nhập tài khoản MatGreen để nhận tới "
            f"{settings.max_daily_requests_user} lượt/ngày nhé!"
            if not actor.is_authenticated
            else f"Bạn đã sử dụng hết {per_day} lượt AI hôm nay. Hạn mức sẽ tự làm mới vào ngày mai."
        )
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=msg)

    window.append(now)
    _daily_counts[day_key] += 1


def enforce_ai_rate_limit(actor: ActorContext) -> dict:
    per_min = (
        settings.max_requests_per_minute
        if actor.is_authenticated
        else settings.max_requests_per_minute_guest
    )
    per_day = (
        settings.max_daily_requests_user
        if actor.is_authenticated
        else settings.max_daily_requests_guest
    )

    if not is_redis_configured():
        _enforce_memory_limits(actor, per_min, per_day)
        day_key = f"{_today_vn()}:{actor.actor_id}"
        used = _daily_counts.get(day_key, 0)
        return {
            "daily_limit": -1 if actor.is_unlimited else per_day,
            "daily_used": used,
            "daily_remaining": -1 if actor.is_unlimited else max(0, per_day - used),
        }

    prefix = settings.rate_limit_key_prefix
    minute_bucket = int(datetime.now(timezone.utc).timestamp() // 60)
    global_key = f"{prefix}:global:min:{minute_bucket}"
    global_count = execute_redis_command(["EVAL", LUA_RATE_LIMIT, "1", global_key, "90"])
    if global_count is None:
        _enforce_memory_limits(actor, per_min, per_day)
        return {"daily_limit": -1 if actor.is_unlimited else per_day, "daily_used": 0, "daily_remaining": -1}

    if int(global_count) > settings.max_global_requests_per_minute:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Hệ thống AI đang quá tải tạm thời. Vui lòng thử lại sau ít phút.",
        )

    if actor.is_unlimited:
        return {"daily_limit": -1, "daily_used": 0, "daily_remaining": -1}

    user_min_key = f"{prefix}:min:{minute_bucket}:{actor.actor_id}"
    user_min_count = execute_redis_command(["EVAL", LUA_RATE_LIMIT, "1", user_min_key, "90"])
    if user_min_count is not None and int(user_min_count) > per_min:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Bạn gửi yêu cầu AI hơi nhanh. Vui lòng chờ 1 phút rồi thử lại nhé.",
        )

    day_str = _today_vn()
    user_day_key = f"{prefix}:day:{day_str}:{actor.actor_id}"
    user_day_count = execute_redis_command(
        ["EVAL", LUA_DAILY_LIMIT, "1", user_day_key, str(per_day), "172800"]
    )
    if user_day_count is not None:
        used = int(user_day_count)
        if used > per_day:
            msg = (
                "Bạn đã dùng hết lượt dùng thử AI hôm nay. Hãy đăng nhập tài khoản MatGreen để nhận tới "
                f"{settings.max_daily_requests_user} lượt/ngày nhé!"
                if not actor.is_authenticated
                else f"Bạn đã sử dụng hết {per_day} lượt AI hôm nay. Hạn mức sẽ tự làm mới vào ngày mai."
            )
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=msg)
        return {
            "daily_limit": per_day,
            "daily_used": used,
            "daily_remaining": max(0, per_day - used),
        }

    return {"daily_limit": per_day, "daily_used": 0, "daily_remaining": per_day}


def get_chat_quota_snapshot(actor: ActorContext) -> dict:
    if actor.is_unlimited:
        return {"daily_limit": -1, "daily_used": 0, "daily_remaining": -1}

    per_day = (
        settings.max_daily_requests_user
        if actor.is_authenticated
        else settings.max_daily_requests_guest
    )
    used = 0
    if is_redis_configured():
        key = f"{settings.rate_limit_key_prefix}:day:{_today_vn()}:{actor.actor_id}"
        raw = execute_redis_command(["GET", key])
        if raw is not None:
            try:
                used = int(raw)
            except (TypeError, ValueError):
                used = 0
    else:
        used = _daily_counts.get(f"{_today_vn()}:{actor.actor_id}", 0)

    return {
        "daily_limit": per_day,
        "daily_used": used,
        "daily_remaining": max(0, per_day - used),
    }
