from __future__ import annotations

import logging
from typing import Any

import httpx

from app.config import settings

logger = logging.getLogger("matgreen.ai.backend_client")


class BackendClient:
    def __init__(self) -> None:
        self._timeout = max(5.0, float(settings.request_timeout_seconds))

    def _base(self) -> str:
        return settings.backend_base_url.rstrip("/")

    async def _get(
        self,
        path: str,
        *,
        params: dict[str, Any] | None = None,
        token: str | None = None,
    ) -> Any:
        headers: dict[str, str] = {"Accept": "application/json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"

        clean_params = {k: v for k, v in (params or {}).items() if v is not None and v != ""}
        url = f"{self._base()}{path}"
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                resp = await client.get(url, params=clean_params, headers=headers)
        except httpx.HTTPError as exc:
            logger.warning("Backend GET %s failed: %s", path, exc)
            return {"error": f"Không thể kết nối dữ liệu MatGreen ({type(exc).__name__})."}

        if resp.status_code >= 400:
            logger.warning("Backend GET %s returned %s", path, resp.status_code)
            return {"error": f"Backend trả về mã lỗi {resp.status_code}."}

        try:
            payload = resp.json()
            return payload.get("data", payload)
        except ValueError:
            return {"error": "Dữ liệu trả về từ Backend không hợp lệ."}

    async def search_nearby_materials(
        self,
        *,
        latitude: float,
        longitude: float,
        radius_km: float = 10.0,
        category: str | None = None,
        material_type: str | None = None,
        search: str | None = None,
        limit: int = 6,
        token: str | None = None,
    ) -> dict[str, Any]:
        return await self._get(
            "/api/materials/nearby",
            params={
                "latitude": latitude,
                "longitude": longitude,
                "radiusKm": min(max(radius_km, 1.0), 100.0),
                "category": category,
                "type": material_type,
                "search": search,
                "limit": max(1, min(limit, 10)),
            },
            token=token,
        )

    async def search_all_materials(
        self,
        *,
        category: str | None = None,
        material_type: str | None = None,
        limit: int = 6,
    ) -> dict[str, Any]:
        return await self._get(
            "/api/materials",
            params={
                "category": category,
                "type": material_type,
                "limit": max(1, min(limit, 10)),
            },
        )

    async def get_material_detail(
        self,
        material_id: str,
        *,
        latitude: float | None = None,
        longitude: float | None = None,
    ) -> dict[str, Any]:
        return await self._get(
            f"/api/materials/{material_id}",
            params={"lat": latitude, "lng": longitude},
        )

    async def list_articles(self, *, limit: int = 5) -> Any:
        return await self._get(
            "/api/articles",
            params={"limit": max(1, min(limit, 10))},
        )


backend_client = BackendClient()
