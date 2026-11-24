import logging
from fastapi import APIRouter, Depends, HTTPException

from app.core.security import ActorContext, get_optional_actor
from app.schemas.materials import DemolitionAnalysisRequest, DemolitionAnalysisResponse
from app.services.llm_service import llm_service
from app.services.proxy_llm import ProxyLLMError
from app.services.rate_limit import enforce_ai_rate_limit

logger = logging.getLogger("matgreen.ai.router.materials")

router = APIRouter(prefix="/ai/materials", tags=["Materials AI"])


@router.post("/analyze-demolition", response_model=DemolitionAnalysisResponse)
async def analyze_demolition(
    req: DemolitionAnalysisRequest,
    actor: ActorContext = Depends(get_optional_actor),
):
    enforce_ai_rate_limit(actor)
    try:
        return await llm_service.analyze_demolition(
            description=req.description,
            address=req.address,
        )
    except ProxyLLMError as exc:
        logger.warning("Demolition proxy error status=%s", exc.status_code)
        if exc.status_code == 429:
            raise HTTPException(
                status_code=429,
                detail="Máy chủ AI đang bận. Vui lòng thử lại sau ít giây.",
            ) from exc
        raise HTTPException(
            status_code=503 if exc.status_code in {503, 504} else 502,
            detail="Dịch vụ AI bóc tách tạm thời không khả dụng. Vui lòng thử lại sau.",
        ) from exc
    except ValueError as exc:
        logger.warning("Invalid AI demolition JSON: %s", exc)
        raise HTTPException(
            status_code=502,
            detail="AI chưa phân tích được đầy đủ cấu trúc vật liệu. Vui lòng mô tả cụ thể hơn và thử lại.",
        ) from exc
    except Exception as exc:
        logger.exception("Unexpected error in /ai/materials/analyze-demolition")
        raise HTTPException(
            status_code=500,
            detail="Đã xảy ra lỗi trong quá trình bóc tách công trình.",
        ) from exc
