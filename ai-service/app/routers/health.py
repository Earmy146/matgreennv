from datetime import UTC, datetime
from fastapi import APIRouter
from app.config import settings

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
    has_key = bool(settings.groq_api_key)
    return {
        "status": "ok" if has_key else "ready_without_llm_key",
        "service": "matgreen-ai",
        "model": settings.groq_model,
        "has_groq_key": has_key,
    }
