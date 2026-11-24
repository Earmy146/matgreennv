import base64
import binascii
import logging
from fastapi import APIRouter, Header, HTTPException, Request
from pydantic import ValidationError

from app.core.security import verify_internal_hmac
from app.schemas.materials import DemolitionAnalysisResponse
from app.schemas.vision import (
    InspectMaterialResponse,
    InternalDemolitionVisionRequest,
    InternalInspectMaterialRequest,
    VisionImagePayload,
)
from app.services.llm_service import llm_service
from app.services.proxy_llm import ProxyLLMError, proxy_llm

logger = logging.getLogger("matgreen.ai.router.vision_internal")

router = APIRouter(prefix="/internal/vision", tags=["Internal Vision AI"])

MAX_RAW_BODY_BYTES = 32 * 1024 * 1024
MAX_SINGLE_IMAGE_BYTES = 5 * 1024 * 1024
MAX_TOTAL_IMAGES_BYTES = 20 * 1024 * 1024


def _is_valid_image_bytes(data: bytes, mime_type: str) -> bool:
    if not data or len(data) > MAX_SINGLE_IMAGE_BYTES:
        return False
    if mime_type == "image/jpeg":
        return data.startswith(b"\xff\xd8\xff")
    if mime_type == "image/png":
        return data.startswith(b"\x89PNG\r\n\x1a\n")
    if mime_type == "image/webp":
        return len(data) >= 12 and data.startswith(b"RIFF") and data[8:12] == b"WEBP"
    return False


def _validate_images(images: list[VisionImagePayload]) -> None:
    total = 0
    for img in images:
        try:
            decoded = base64.b64decode(img.image_base64, validate=True)
        except (binascii.Error, ValueError) as exc:
            raise HTTPException(status_code=422, detail="Dữ liệu ảnh base64 không hợp lệ.") from exc
        if not _is_valid_image_bytes(decoded, img.mime_type):
            raise HTTPException(status_code=422, detail="Định dạng hoặc kích thước ảnh không hợp lệ.")
        total += len(decoded)
    if total > MAX_TOTAL_IMAGES_BYTES:
        raise HTTPException(status_code=413, detail="Tổng dung lượng ảnh vượt quá 20 MB.")


@router.post("/inspect-material", response_model=InspectMaterialResponse)
async def internal_inspect_material(
    request: Request,
    user_id: str = Header(..., alias="X-Internal-User-Id"),
    timestamp: str = Header(..., alias="X-Internal-Timestamp"),
    signature: str = Header(..., alias="X-Internal-Signature"),
):
    raw_body = await request.body()
    if len(raw_body) > MAX_RAW_BODY_BYTES:
        raise HTTPException(status_code=413, detail="Dữ liệu ảnh quá lớn.")

    verify_internal_hmac(
        purpose="vision-inspect",
        user_id=user_id,
        timestamp=timestamp,
        signature=signature,
        raw_body=raw_body,
    )

    try:
        payload = InternalInspectMaterialRequest.model_validate_json(raw_body)
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail="Yêu cầu phân tích ảnh không hợp lệ.") from exc

    if payload.user_id != user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    _validate_images(payload.images)

    if not proxy_llm.is_vision_configured():
        raise HTTPException(status_code=503, detail="Dịch vụ Vision AI chưa được cấu hình.")

    try:
        return await llm_service.inspect_material_images(
            images=payload.images,
            note=payload.note,
            address=payload.address,
        )
    except ProxyLLMError as exc:
        logger.warning("Vision inspect proxy error status=%s", exc.status_code)
        status_code = 429 if exc.status_code == 429 else 503 if exc.status_code in {503, 504} else 502
        raise HTTPException(status_code=status_code, detail="Không thể phân tích ảnh lúc này.") from exc
    except ValueError as exc:
        logger.warning("Vision inspect parse error: %s", exc)
        raise HTTPException(status_code=502, detail="AI chưa đọc rõ nội dung vật liệu từ ảnh.") from exc


@router.post("/analyze-demolition", response_model=DemolitionAnalysisResponse)
async def internal_analyze_demolition(
    request: Request,
    user_id: str = Header(..., alias="X-Internal-User-Id"),
    timestamp: str = Header(..., alias="X-Internal-Timestamp"),
    signature: str = Header(..., alias="X-Internal-Signature"),
):
    raw_body = await request.body()
    if len(raw_body) > MAX_RAW_BODY_BYTES:
        raise HTTPException(status_code=413, detail="Dữ liệu ảnh quá lớn.")

    verify_internal_hmac(
        purpose="vision-demolition",
        user_id=user_id,
        timestamp=timestamp,
        signature=signature,
        raw_body=raw_body,
    )

    try:
        payload = InternalDemolitionVisionRequest.model_validate_json(raw_body)
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail="Yêu cầu bóc tách ảnh công trình không hợp lệ.") from exc

    if payload.user_id != user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    _validate_images(payload.images)

    if not proxy_llm.is_vision_configured():
        raise HTTPException(status_code=503, detail="Dịch vụ Vision AI chưa được cấu hình.")

    try:
        return await llm_service.analyze_demolition_images(
            images=payload.images,
            description=payload.description,
            address=payload.address,
        )
    except ProxyLLMError as exc:
        logger.warning("Vision demolition proxy error status=%s", exc.status_code)
        status_code = 429 if exc.status_code == 429 else 503 if exc.status_code in {503, 504} else 502
        raise HTTPException(status_code=status_code, detail="Không thể bóc tách ảnh công trình lúc này.") from exc
    except ValueError as exc:
        logger.warning("Vision demolition parse error: %s", exc)
        raise HTTPException(status_code=502, detail="AI chưa bóc tách rõ vật liệu từ ảnh hiện trường.") from exc
