import logging
from typing import Any

from app.config import settings

logger = logging.getLogger("matgreen.ai.redis")

_cached_tcp_client = None
_warned_redis_failure = False


def is_redis_configured() -> bool:
    return bool(settings.redis_url and settings.redis_url.strip())


def _get_tcp_client():
    global _cached_tcp_client
    if _cached_tcp_client is None and is_redis_configured():
        try:
            import redis

            _cached_tcp_client = redis.from_url(
                settings.redis_url,
                socket_timeout=2.0,
                socket_connect_timeout=2.0,
                decode_responses=True,
            )
        except Exception as exc:
            logger.warning("Không thể khởi tạo kết nối Redis: %s", exc)
            return None
    return _cached_tcp_client


def execute_redis_command(command: list[Any]) -> Any | None:
    global _warned_redis_failure
    if not is_redis_configured():
        return None
    client = _get_tcp_client()
    if client is None:
        return None
    try:
        result = client.execute_command(*command)
        _warned_redis_failure = False
        return result
    except Exception as exc:
        if not _warned_redis_failure:
            logger.warning("Lỗi thực thi lệnh Redis (%s); tạm fallback sang bộ nhớ cục bộ", exc)
            _warned_redis_failure = True
        return None


def check_redis_health() -> tuple[bool, str]:
    if not is_redis_configured():
        return True, "memory_mode"
    try:
        res = execute_redis_command(["PING"])
        if res in ("PONG", b"PONG", True) or str(res).upper() == "PONG":
            return True, "connected"
        return False, f"unexpected_ping_response:{res}"
    except Exception as exc:
        return False, f"error:{exc}"
