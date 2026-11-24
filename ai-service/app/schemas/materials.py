from pydantic import BaseModel, Field


VALID_CATEGORIES = {
    "sat_thep",
    "gach_ngoi",
    "cua_kinh",
    "thiet_bi_ve_sinh",
    "go_copha",
    "xa_ban",
    "khac",
}


class DemolitionAnalysisRequest(BaseModel):
    description: str = Field(..., min_length=10, max_length=4000)
    address: str | None = Field(default=None, max_length=300)


class ExtractedMaterialItem(BaseModel):
    title: str
    category: str
    estimated_quantity: str
    unit: str = "gói"
    suggested_type: str  # 'free' or 'sell'
    suggested_price: float = 0
    reuse_recommendation: str
    post_description: str = ""


class DemolitionAnalysisResponse(BaseModel):
    summary: str
    materials: list[ExtractedMaterialItem]
    recycling_potential_score: int = Field(..., ge=0, le=100)
    estimated_volume_m3: float | None = None
    estimated_truck_trips: int | None = None
    estimated_co2_saved_kg: float | None = None
    estimated_recovery_value_vnd: float | None = None
    dismantle_tips: list[str] = Field(default_factory=list)
    model: str | None = None
    usage: dict | None = None
