from __future__ import annotations

import json
import re
from typing import Any

from app.schemas.chat import RecommendedMaterialCard
from app.services.backend_client import backend_client

_HTML_TAG_RE = re.compile(r"<[^>]+>")


def _strip_html(text: str | None, max_len: int = 400) -> str:
    if not text:
        return ""
    cleaned = _HTML_TAG_RE.sub(" ", str(text))
    cleaned = " ".join(cleaned.split())
    return cleaned[:max_len]


def _compact_material(item: dict[str, Any]) -> tuple[dict[str, Any], RecommendedMaterialCard | None]:
    mat_id = str(item.get("_id") or item.get("id") or "")
    if not mat_id:
        return {}, None
    location = item.get("location") if isinstance(item.get("location"), dict) else {}
    address = str(location.get("address") or "")
    images = item.get("images") if isinstance(item.get("images"), list) else []
    first_image = str(images[0]) if images and isinstance(images[0], str) else None
    price = float(item.get("price") or 0)
    distance = item.get("distanceKm")
    distance_val = round(float(distance), 2) if isinstance(distance, (int, float)) else None

    compact = {
        "id": mat_id,
        "title": str(item.get("title") or ""),
        "category": str(item.get("category") or "khac"),
        "type": str(item.get("type") or "free"),
        "price_vnd": price,
        "unit": str(item.get("unit") or "gói"),
        "address": address,
        "distance_km": distance_val,
        "status": str(item.get("status") or "available"),
        "contact_hours": str(item.get("contactHours") or ""),
        "description": _strip_html(item.get("description"), 350),
    }
    card = RecommendedMaterialCard(
        id=mat_id,
        title=compact["title"],
        category=compact["category"],
        type=compact["type"],
        price=price,
        unit=compact["unit"],
        address=address,
        distance_km=distance_val,
        image=first_image,
        status=compact["status"],
    )
    return compact, card


async def execute_tool(
    *,
    name: str,
    arguments_raw: str,
    latitude: float | None,
    longitude: float | None,
    default_radius_km: float,
    token: str | None,
) -> tuple[str, list[RecommendedMaterialCard]]:
    try:
        args = json.loads(arguments_raw) if arguments_raw else {}
        if not isinstance(args, dict):
            args = {}
    except json.JSONDecodeError:
        args = {}

    cards: list[RecommendedMaterialCard] = []

    if name == "search_nearby_materials":
        if latitude is None or longitude is None:
            # Automatically fall back to all materials with a helpful note
            raw = await backend_client.search_all_materials(
                category=args.get("category"),
                material_type=args.get("type"),
                limit=int(args.get("limit") or 5),
            )
            items = raw.get("items", []) if isinstance(raw, dict) else []
            compacted = []
            for item in items:
                c, card = _compact_material(item)
                if card:
                    compacted.append(c)
                    cards.append(card)
            return json.dumps(
                {
                    "note": "Người dùng chưa bật GPS nên đã trả về danh sách vật liệu mới nhất trên toàn sàn.",
                    "count": len(compacted),
                    "items": compacted,
                },
                ensure_ascii=False,
            ), cards

        radius = float(args.get("radius_km") or default_radius_km or 10.0)
        raw = await backend_client.search_nearby_materials(
            latitude=latitude,
            longitude=longitude,
            radius_km=radius,
            category=args.get("category"),
            material_type=args.get("type"),
            search=args.get("search"),
            limit=int(args.get("limit") or 5),
            token=token,
        )
        if isinstance(raw, dict) and raw.get("error"):
            return json.dumps(raw, ensure_ascii=False), cards
        items = raw.get("items", []) if isinstance(raw, dict) else []
        compacted = []
        for item in items:
            c, card = _compact_material(item)
            if card:
                compacted.append(c)
                cards.append(card)
        return json.dumps(
            {
                "search_radius_km": radius,
                "count": len(compacted),
                "items": compacted,
            },
            ensure_ascii=False,
        ), cards

    if name == "search_all_materials":
        raw = await backend_client.search_all_materials(
            category=args.get("category"),
            material_type=args.get("type"),
            limit=int(args.get("limit") or 5),
        )
        if isinstance(raw, dict) and raw.get("error"):
            return json.dumps(raw, ensure_ascii=False), cards
        items = raw.get("items", []) if isinstance(raw, dict) else []
        compacted = []
        for item in items:
            c, card = _compact_material(item)
            if card:
                compacted.append(c)
                cards.append(card)
        return json.dumps({"count": len(compacted), "items": compacted}, ensure_ascii=False), cards

    if name == "get_material_detail":
        material_id = str(args.get("material_id") or "").strip()
        if not material_id:
            return json.dumps({"error": "Thiếu material_id"}, ensure_ascii=False), cards
        raw = await backend_client.get_material_detail(
            material_id,
            latitude=latitude,
            longitude=longitude,
        )
        if isinstance(raw, dict) and raw.get("error"):
            return json.dumps(raw, ensure_ascii=False), cards
        if isinstance(raw, dict):
            c, card = _compact_material(raw)
            if card:
                cards.append(card)
                return json.dumps(c, ensure_ascii=False), cards
        return json.dumps({"error": "Không tìm thấy bài đăng vật liệu này."}, ensure_ascii=False), cards

    if name == "list_news_articles":
        raw = await backend_client.list_articles(limit=int(args.get("limit") or 5))
        if isinstance(raw, dict) and raw.get("error"):
            return json.dumps(raw, ensure_ascii=False), cards
        items = raw.get("items", raw) if isinstance(raw, dict) else raw
        if not isinstance(items, list):
            items = []
        articles = [
            {
                "id": str(a.get("_id") or a.get("id") or ""),
                "title": str(a.get("title") or ""),
                "category": str(a.get("category") or ""),
                "excerpt": _strip_html(a.get("excerpt") or a.get("summary") or a.get("content"), 220),
            }
            for a in items[:8]
            if isinstance(a, dict)
        ]
        return json.dumps({"count": len(articles), "articles": articles}, ensure_ascii=False), cards

    return json.dumps({"error": f"Tool '{name}' không tồn tại."}, ensure_ascii=False), cards
