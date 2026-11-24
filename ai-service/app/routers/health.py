from datetime import UTC, datetime
from fastapi import APIRouter

from app.config import settings
from app.services.proxy_llm import proxy_llm
from app.services.redis_client import check_redis_health

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/live")
async def health_live():
    return {
        "status": "ok",
        "service": "matgreen-ai",
        "timestamp": datetime.now(UTC).isoformat(),
    }


@router.get("/ready")
async def health_ready():
    redis_ok, redis_state = check_redis_health()
    proxy_ok, proxy_state = await proxy_llm.probe_proxy()
    return {
        "status": "ok" if (redis_ok and proxy_ok) else "degraded",
        "service": "matgreen-ai",
        "chat_model": settings.ai_chat_model,
        "fallback_model": settings.ai_fallback_model,
        "vision_model": settings.ai_vision_model,
        "proxy_configured": proxy_llm.is_chat_configured(),
        "proxy_status": proxy_state,
        "redis_status": redis_state,
    }
