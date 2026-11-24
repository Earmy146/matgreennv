from pydantic import BaseModel, Field


class VisionImagePayload(BaseModel):
    image_base64: str = Field(..., min_length=16, max_length=7_500_000)
    mime_type: str = Field(..., pattern="^image/(jpeg|png|webp)$")


class InternalInspectMaterialRequest(BaseModel):
    user_id: str = Field(..., min_length=1, max_length=128)
    images: list[VisionImagePayload] = Field(..., min_length=1, max_length=4)
    note: str = Field(default="", max_length=1500)
    address: str | None = Field(default=None, max_length=300)


class MaterialPostDraft(BaseModel):
    title: str
    category: str
    type: str  # 'free' or 'sell'
    price: float = 0
    unit: str = "gói"
    description: str
    condition_score: int = Field(default=75, ge=0, le=100)
    estimated_quantity: str = ""
    reuse_tips: list[str] = Field(default_factory=list)
    confidence: float = Field(default=0.75, ge=0, le=1)


class InspectMaterialResponse(BaseModel):
    summary: str
    draft: MaterialPostDraft
    warnings: list[str] = Field(default_factory=list)
    model: str | None = None
    usage: dict | None = None


class InternalDemolitionVisionRequest(BaseModel):
    user_id: str = Field(..., min_length=1, max_length=128)
    images: list[VisionImagePayload] = Field(..., min_length=1, max_length=4)
    description: str = Field(default="", max_length=4000)
    address: str | None = Field(default=None, max_length=300)
