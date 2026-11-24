import hashlib
import hmac
import logging
import time
from dataclasses import dataclass

import httpx
from fastapi import Header, HTTPException, Request, status
from jose import JWTError, jwt

from app.config import settings

logger = logging.getLogger("matgreen.ai.security")


@dataclass
class ActorContext:
    actor_id: str
    is_authenticated: bool
    role: str = "guest"
    token: str | None = None
    name: str | None = None

    @property
    def is_unlimited(self) -> bool:
        return self.is_authenticated and self.role.lower() in settings.unlimited_role_set


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        first = forwarded.split(",")[0].strip()
        if first:
            return first
    real_ip = request.headers.get("x-real-ip")
    if real_ip and real_ip.strip():
        return real_ip.strip()
    return request.client.host if request.client else "unknown"


def decode_jwt_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
        ) from exc

    if not payload.get("id"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token đăng nhập không hợp lệ.",
        )
    return payload


async def _verify_with_backend(token: str, claims: dict) -> dict:
    """Confirm user account is not suspended via backend /api/auth/me."""
    url = f"{settings.backend_base_url.rstrip('/')}/api/auth/me"
    try:
        async with httpx.AsyncClient(timeout=min(8.0, float(settings.request_timeout_seconds))) as client:
            resp = await client.get(url, headers={"Authorization": f"Bearer {token}"})
    except httpx.HTTPError:
        # If backend is temporarily unreachable for a valid signed JWT, keep JWT claims
        # so text advice doesn't fail unnecessarily.
        logger.warning("Không thể kết nối backend /api/auth/me để kiểm tra trạng thái tài khoản.")
        return claims

    if resp.status_code in {401, 403}:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Phiên đăng nhập đã hết hạn hoặc tài khoản bị tạm khóa.",
        )
    if resp.status_code == 200:
        try:
            body = resp.json()
            profile = body.get("data", body)
            if isinstance(profile, dict):
                merged = dict(claims)
                if profile.get("role"):
                    merged["role"] = profile["role"]
                if profile.get("name"):
                    merged["name"] = profile["name"]
                return merged
        except ValueError:
            pass
    return claims


async def get_optional_actor(
    request: Request,
    authorization: str | None = Header(default=None),
) -> ActorContext:
    """
    Allow both authenticated users (higher quota) and guest visitors (tight IP quota).
    If an Authorization header IS provided, it must be valid.
    """
    if not authorization or not authorization.strip():
        return ActorContext(
            actor_id=f"ip:{_client_ip(request)}",
            is_authenticated=False,
            role="guest",
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Định dạng Authorization header không hợp lệ.",
        )

    token = authorization.removeprefix("Bearer ").strip()
    claims = decode_jwt_token(token)
    claims = await _verify_with_backend(token, claims)
    return ActorContext(
        actor_id=str(claims["id"]),
        is_authenticated=True,
        role=str(claims.get("role") or "user"),
        token=token,
        name=claims.get("name"),
    )


def verify_internal_hmac(
    *,
    purpose: str,
    user_id: str,
    timestamp: str,
    signature: str,
    raw_body: bytes,
    max_skew_seconds: int = 60,
) -> None:
    try:
        req_ts = int(timestamp)
    except ValueError as exc:
        raise HTTPException(status_code=401, detail="Unauthorized") from exc

    if abs(int(time.time()) - req_ts) > max_skew_seconds:
        raise HTTPException(status_code=401, detail="Unauthorized")

    digest = hashlib.sha256(raw_body).hexdigest()
    signed = f"{purpose}:{user_id}:{timestamp}:{digest}".encode("utf-8")
    expected = hmac.new(
        settings.jwt_secret.encode("utf-8"),
        signed,
        hashlib.sha256,
    ).hexdigest()
    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=401, detail="Unauthorized")
