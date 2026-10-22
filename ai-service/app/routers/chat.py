from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm_service import llm_service

router = APIRouter(prefix="/ai/chat", tags=["AI Chat"])


@router.post("", response_model=ChatResponse)
async def chat_advice(req: ChatRequest):
    try:
        reply = await llm_service.chat_advice(
            [m.model_dump() for m in req.messages], req.context
        )
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
