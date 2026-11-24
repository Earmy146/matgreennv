from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(..., min_length=1, max_length=30)
    context: str | None = Field(default=None, max_length=2000)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    radius_km: float | None = Field(default=10.0, gt=0, le=200)
    material_id: str | None = Field(default=None, max_length=64)


class RecommendedMaterialCard(BaseModel):
    id: str
    title: str
    category: str
    type: str
    price: float = 0
    unit: str = "gói"
    address: str = ""
    distance_km: float | None = None
    image: str | None = None
    status: str = "available"


class ChatQuotaInfo(BaseModel):
    daily_limit: int
    daily_used: int
    daily_remaining: int


class ChatResponse(BaseModel):
    reply: str
    recommended_materials: list[RecommendedMaterialCard] = Field(default_factory=list)
    tools_used: list[str] = Field(default_factory=list)
    model: str | None = None
    usage: dict | None = None
    quota: ChatQuotaInfo | None = None
