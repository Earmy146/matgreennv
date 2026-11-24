import base64
import hashlib
import hmac
import json
import time
import unittest
from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from app.config import settings
from app.main import app
from app.services.llm_service import extract_json_object, normalize_category
from app.services.proxy_llm import CompletionResult, ToolCallItem


def _sign_headers(purpose: str, user_id: str, body: bytes, ts: int | None = None) -> dict[str, str]:
    timestamp = str(ts if ts is not None else int(time.time()))
    digest = hashlib.sha256(body).hexdigest()
    sig = hmac.new(
        settings.jwt_secret.encode("utf-8"),
        f"{purpose}:{user_id}:{timestamp}:{digest}".encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return {
        "Content-Type": "application/json",
        "X-Internal-User-Id": user_id,
        "X-Internal-Timestamp": timestamp,
        "X-Internal-Signature": sig,
    }


# Minimal valid 1x1 PNG bytes
_TINY_PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
)


class MatGreenAIServiceTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_category_normalization_and_json_extract(self):
        self.assertEqual(normalize_category("sat_thep"), "sat_thep")
        self.assertEqual(normalize_category("nhom kinh"), "cua_kinh")
        self.assertEqual(normalize_category("unknown_xyz"), "khac")

        parsed = extract_json_object("```json\n{\"summary\": \"ok\", \"materials\": []}\n```")
        self.assertEqual(parsed["summary"], "ok")

    def test_health_live(self):
        res = self.client.get("/health/live")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "ok")

    def test_analyze_demolition_parses_structured_output(self):
        mock_completion = CompletionResult(
            content=json.dumps(
                {
                    "summary": "Công trình nhà cấp 4 có tôn và xà bần tái chế tốt",
                    "recycling_potential_score": 88,
                    "estimated_volume_m3": 14.5,
                    "estimated_truck_trips": 3,
                    "estimated_co2_saved_kg": 920,
                    "estimated_recovery_value_vnd": 2500000,
                    "dismantle_tips": ["Tháo mái tôn nguyên tấm trước khi đập tường"],
                    "materials": [
                        {
                            "title": "Mái tôn lạnh 70m2 còn mới 80%",
                            "category": "ton",
                            "estimated_quantity": "70m2",
                            "unit": "m2",
                            "suggested_type": "sell",
                            "suggested_price": 2500000,
                            "reuse_recommendation": "Làm mái che xưởng hoặc nhà trọ",
                            "post_description": "<p>Tôn lạnh tháo nguyên tấm.</p>",
                        },
                        {
                            "title": "Xà bần gạch vỡ san lấp",
                            "category": "xa_ban",
                            "estimated_quantity": "3 xe tải",
                            "unit": "xe",
                            "suggested_type": "free",
                            "suggested_price": 500000,  # phải tự ép về 0 khi free
                            "reuse_recommendation": "Tặng 0đ cho công trình tôn nền",
                            "post_description": "<p>Xà bần sạch không lẫn rác.</p>",
                        },
                    ],
                },
                ensure_ascii=False,
            ),
            tool_calls=[],
            model="gemini-3.1-flash-lite",
            usage={"prompt_tokens": 120, "completion_tokens": 220, "total_tokens": 340},
        )

        with patch("app.services.llm_service.proxy_llm.chat_completion", new=AsyncMock(return_value=mock_completion)):
            res = self.client.post(
                "/ai/materials/analyze-demolition",
                json={"description": "Nhà cấp 4 70m2 mái tôn lạnh và 3 xe xà bần gạch vỡ", "address": "Hà Nội"},
            )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["recycling_potential_score"], 88)
        self.assertEqual(len(data["materials"]), 2)
        self.assertEqual(data["materials"][0]["category"], "sat_thep")
        self.assertEqual(data["materials"][1]["suggested_price"], 0.0)

    def test_chat_with_tool_calling_returns_live_material_cards(self):
        first_round = CompletionResult(
            content="",
            tool_calls=[
                ToolCallItem(
                    id="call_1",
                    name="search_nearby_materials",
                    arguments=json.dumps({"category": "xa_ban", "type": "free", "radius_km": 5}),
                )
            ],
            model="gemini-3.1-flash-lite",
            usage={"prompt_tokens": 100, "completion_tokens": 30, "total_tokens": 130},
        )
        second_round = CompletionResult(
            content="Mình tìm thấy 1 lô **xà bần tặng 0đ** ngay gần bạn ở Cầu Giấy.",
            tool_calls=[],
            model="gemini-3.1-flash-lite",
            usage={"prompt_tokens": 200, "completion_tokens": 45, "total_tokens": 245},
        )
        fake_backend = {
            "items": [
                {
                    "_id": "660000000000000000000001",
                    "title": "Tặng 2 xe xà bần sạch",
                    "category": "xa_ban",
                    "type": "free",
                    "price": 0,
                    "unit": "xe",
                    "images": ["/uploads/sample.webp"],
                    "location": {"address": "Cầu Giấy, Hà Nội"},
                    "distanceKm": 1.4,
                    "status": "available",
                }
            ]
        }

        with (
            patch(
                "app.services.llm_service.proxy_llm.chat_completion",
                new=AsyncMock(side_effect=[first_round, second_round]),
            ),
            patch(
                "app.llm.tool_router.backend_client.search_nearby_materials",
                new=AsyncMock(return_value=fake_backend),
            ),
        ):
            res = self.client.post(
                "/ai/chat",
                json={
                    "messages": [{"role": "user", "content": "Tìm xà bần miễn phí quanh tôi"}],
                    "latitude": 21.03,
                    "longitude": 105.79,
                    "radius_km": 5,
                },
            )

        self.assertEqual(res.status_code, 200)
        body = res.json()
        self.assertIn("search_nearby_materials", body["tools_used"])
        self.assertEqual(len(body["recommended_materials"]), 1)
        self.assertEqual(body["recommended_materials"][0]["id"], "660000000000000000000001")

    def test_internal_vision_hmac_and_valid_response(self):
        payload = {
            "user_id": "user123",
            "images": [
                {"image_base64": base64.b64encode(_TINY_PNG).decode("ascii"), "mime_type": "image/png"}
            ],
            "note": "Cửa nhôm cũ",
            "address": "Đống Đa, Hà Nội",
        }
        raw = json.dumps(payload).encode("utf-8")

        # 1) Invalid signature must be rejected with 401
        bad_headers = _sign_headers("vision-inspect", "user123", raw)
        bad_headers["X-Internal-Signature"] = "0" * 64
        res_bad = self.client.post("/internal/vision/inspect-material", content=raw, headers=bad_headers)
        self.assertEqual(res_bad.status_code, 401)

        # 2) Valid signature + mocked vision proxy succeeds
        mock_vision = CompletionResult(
            content=json.dumps(
                {
                    "summary": "Nhận diện bộ cửa nhôm kính Xingfa còn mới khoảng 85%.",
                    "warnings": ["Nên đo lại kích thước khung bao thực tế."],
                    "draft": {
                        "title": "Thanh lý bộ cửa đi nhôm kính còn mới 85%",
                        "category": "cua_kinh",
                        "type": "sell",
                        "price": 1200000,
                        "unit": "bộ",
                        "estimated_quantity": "1 bộ",
                        "condition_score": 85,
                        "description": "<p>Cửa nhôm kính nguyên vẹn, kính không nứt vỡ.</p>",
                        "reuse_tips": ["Phù hợp làm cửa phòng trọ hoặc nhà kho"],
                        "confidence": 0.9,
                    },
                },
                ensure_ascii=False,
            ),
            tool_calls=[],
            model="gemini-3-flash",
            usage={"prompt_tokens": 350, "completion_tokens": 180, "total_tokens": 530},
        )

        good_headers = _sign_headers("vision-inspect", "user123", raw)
        with (
            patch("app.routers.vision_internal.proxy_llm.is_vision_configured", return_value=True),
            patch("app.services.llm_service.proxy_llm.vision_completion", new=AsyncMock(return_value=mock_vision)),
        ):
            res_ok = self.client.post("/internal/vision/inspect-material", content=raw, headers=good_headers)

        self.assertEqual(res_ok.status_code, 200)
        data = res_ok.json()
        self.assertEqual(data["draft"]["category"], "cua_kinh")
        self.assertEqual(data["draft"]["type"], "sell")
        self.assertEqual(data["draft"]["price"], 1200000.0)


if __name__ == "__main__":
    unittest.main()
