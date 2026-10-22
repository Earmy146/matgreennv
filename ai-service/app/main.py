import logging
import uuid
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.config import settings
from app.routers.health import router as health_router
from app.routers.materials_ai import router as materials_ai_router
from app.routers.chat import router as chat_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
app = FastAPI(
    title="MatGreen AI Service",
    description="Microservice AI tư vấn và phân tích bóc tách vật liệu xây dựng/tháo dỡ",
    version="1.0.0",
)


class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
        request.state.request_id = request_id
        response: Response = await call_next(request)
        response.headers["X-Request-Id"] = request_id
        return response


# CORS config
origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
if "*" not in origins:
    origins.extend(["http://localhost:5173", "http://127.0.0.1:5173"])

app.add_middleware(RequestIdMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include Routers
app.include_router(health_router)
app.include_router(materials_ai_router)
app.include_router(chat_router)


@app.get("/")
async def root():
    return {
        "message": "MatGreen AI Service is operational",
        "docs": "/docs",
        "health": "/health/live",
    }
