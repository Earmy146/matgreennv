from fastapi import APIRouter, HTTPException
from app.schemas.materials import DemolitionAnalysisRequest, DemolitionAnalysisResponse
from app.services.llm_service import llm_service

router = APIRouter(prefix="/ai/materials", tags=["Materials AI"])


@router.post("/analyze-demolition", response_model=DemolitionAnalysisResponse)
async def analyze_demolition(req: DemolitionAnalysisRequest):
    try:
        result = await llm_service.analyze_demolition(req.description, req.address)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
