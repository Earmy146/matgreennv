import json
import logging
from app.config import settings

logger = logging.getLogger("matgreen.ai.llm")


class LLMService:
    def __init__(self):
        self.api_key = settings.groq_api_key
        self.model = settings.groq_model
        self.client = None
        if self.api_key:
            try:
                from groq import Groq
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Không thể khởi tạo Groq client: {e}")

    async def analyze_demolition(self, description: str, address: str | None = None) -> dict:
        """
        Bóc tách tự động danh sách vật liệu tái sử dụng được từ mô tả công trình tháo dỡ
        """
        if not self.client:
            # Fallback stub nếu chưa có Groq API Key trong lúc phát triển ban đầu
            return {
                "summary": "Phân tích sơ bộ từ mô tả công trình tháo dỡ (Chế độ mô phỏng chưa gắn API key)",
                "materials": [
                    {
                        "title": "Sắt thép phi tái chế",
                        "category": "sat_thep",
                        "estimated_quantity": "Khoảng 500kg - 1 tấn",
                        "suggested_type": "sell",
                        "suggested_price": 7000,
                        "reuse_recommendation": "Bán thanh lý cho đội thu gom phế liệu hoặc xưởng cơ khí nhỏ",
                    },
                    {
                        "title": "Gạch thẻ và xà bần đập vụn",
                        "category": "xa_ban",
                        "estimated_quantity": "2-3 xe tải nhỏ",
                        "suggested_type": "free",
                        "suggested_price": 0,
                        "reuse_recommendation": "Tặng miễn phí cho các công trình cần nâng nền hoặc san lấp ao/hố",
                    },
                    {
                        "title": "Cửa đi nhôm kính",
                        "category": "cua_kinh",
                        "estimated_quantity": "2 bộ",
                        "suggested_type": "sell",
                        "suggested_price": 500000,
                        "reuse_recommendation": "Tái sử dụng làm cửa kho hoặc phòng trọ",
                    },
                ],
                "recycling_potential_score": 85,
            }

        prompt = f"""
        Bạn là chuyên gia tư vấn thu hồi và tái chế vật liệu xây dựng - công trình tháo dỡ tại Việt Nam.
        Hãy phân tích đoạn mô tả công trình sau và bóc tách các hạng mục vật liệu có thể tái sử dụng hoặc thanh lý:
        
        Mô tả công trình: "{description}"
        Địa điểm: "{address or 'Chưa rõ'}"

        Trả về kết quả dưới dạng JSON thuần túy có cấu trúc sau:
        {{
          "summary": "Tóm tắt tiềm năng vật liệu thừa",
          "materials": [
            {{
              "title": "Tên loại vật liệu",
              "category": "sat_thep|gach_ngoi|cua_kinh|thiet_bi_ve_sinh|go_copha|xa_ban|khac",
              "estimated_quantity": "Số lượng ước lượng",
              "suggested_type": "free hoặc sell",
              "suggested_price": số_tiền_ước_tính_hoặc_0,
              "reuse_recommendation": "Lời khuyên cách tái sử dụng hoặc đối tượng cần"
            }}
          ],
          "recycling_potential_score": 85
        }}
        """

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                response_format={"type": "json_object"},
            )
            raw_text = response.choices[0].message.content
            return json.loads(raw_text)
        except Exception as e:
            logger.error(f"Lỗi khi gọi LLM: {e}")
            raise e

    async def chat_advice(self, messages: list[dict], context: str | None = None) -> str:
        """
        Chat tư vấn phương án xử lý vật liệu thừa, tái chế và quy trình tháo dỡ
        """
        if not self.client:
            return "Chào bạn! Tôi là Trợ lý AI MatGreen. Hiện tại hệ thống đang chạy ở môi trường khởi tạo. Bạn có thể hỏi về cách phân loại xà bần, gạch vỡ, sắt vụn hoặc tìm vật liệu xây dựng quanh vị trí của bạn!"

        sys_prompt = "Bạn là trợ lý AI chuyên gia về kinh tế tuần hoàn và tái chế vật liệu xây dựng tháo dỡ tại Việt Nam (MatGreen AI). Hãy trả lời ngắn gọn, thiết thực, thân thiện bằng tiếng Việt."
        if context:
            sys_prompt += f"\nNgữ cảnh hiện tại: {context}"

        formatted_messages = [{"role": "system", "content": sys_prompt}]
        for m in messages:
            formatted_messages.append({"role": m["role"], "content": m["content"]})

        response = self.client.chat.completions.create(
            model=self.model,
            messages=formatted_messages,
            temperature=0.7,
        )
        return response.choices[0].message.content


llm_service = LLMService()
