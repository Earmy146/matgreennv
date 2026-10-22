from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(..., description="'user', 'assistant', or 'system'")
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    context: str | None = Field(None, description="Ngữ cảnh bổ sung về vật liệu hoặc công trình")


class ChatResponse(BaseModel):
    reply: str
    usage: dict | None = None
