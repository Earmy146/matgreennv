from pydantic import BaseModel, Field


class DemolitionAnalysisRequest(BaseModel):
    description: str = Field(..., description="Mô tả công trình cần tháo dỡ hoặc vật liệu cần thanh lý")
    address: str | None = Field(None, description="Địa chỉ công trình")


class ExtractedMaterialItem(BaseModel):
    title: str
    category: str
    estimated_quantity: str
    suggested_type: str  # 'free' or 'sell'
    suggested_price: float | None = None
    reuse_recommendation: str


class DemolitionAnalysisResponse(BaseModel):
    summary: str
    materials: list[ExtractedMaterialItem]
    recycling_potential_score: int = Field(..., ge=0, le=100)
