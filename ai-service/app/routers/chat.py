import logging
from fastapi import APIRouter, Depends, HTTPException

from app.core.security import ActorContext, get_optional_actor
from app.schemas.chat import ChatQuotaInfo, ChatRequest, ChatResponse
from app.services.llm_service import llm_service
from app.services.proxy_llm import ProxyLLMError
from app.services.rate_limit import enforce_ai_rate_limit, get_chat_quota_snapshot

logger = logging.getLogger("matgreen.ai.router.chat")

router = APIRouter(prefix="/ai/chat", tags=["AI Chat"])


@router.get("/quota", response_model=ChatQuotaInfo)
async def chat_quota(actor: ActorContext = Depends(get_optional_actor)):
    snapshot = get_chat_quota_snapshot(actor)
    return ChatQuotaInfo(**snapshot)


@router.post("", response_model=ChatResponse)
async def chat_advice(
    req: ChatRequest,
    actor: ActorContext = Depends(get_optional_actor),
):
    quota = enforce_ai_rate_limit(actor)
    try:
        reply, cards, tools_used, model, usage = await llm_service.chat_advice(
            messages=[m.model_dump() for m in req.messages],
            context=req.context,
            latitude=req.latitude,
            longitude=req.longitude,
            radius_km=req.radius_km or 10.0,
            material_id=req.material_id,
            token=actor.token,
        )
        return ChatResponse(
            reply=reply,
            recommended_materials=cards,
            tools_used=tools_used,
            model=model,
            usage=usage or None,
            quota=ChatQuotaInfo(**quota),
        )
    except ProxyLLMError as exc:
        logger.warning("Chat proxy error status=%s body=%s", exc.status_code, exc.body[:200])
        if exc.status_code == 429:
            raise HTTPException(
                status_code=429,
                detail="Máy chủ AI đang quá tải tạm thời. Vui lòng thử lại sau ít giây.",
            ) from exc
        if exc.status_code in {503, 504}:
            raise HTTPException(
                status_code=503,
                detail="Trợ lý AI tạm thời không khả dụng. Vui lòng thử lại sau.",
            ) from exc
        raise HTTPException(
            status_code=502,
            detail="Không thể nhận phản hồi từ máy chủ AI lúc này.",
        ) from exc
    except Exception as exc:
        logger.exception("Unexpected error in /ai/chat")
        raise HTTPException(
            status_code=500,
            detail="Đã xảy ra lỗi khi xử lý yêu cầu tư vấn AI.",
        ) from exc
