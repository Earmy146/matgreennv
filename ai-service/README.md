# MatGreen AI Service (v2 — `cli-proxy-public`)

Microservice AI (FastAPI) phục vụ nền tảng **MatGreen**, kết nối trực tiếp tới `cli-proxy-public` nội bộ trên VPS thông qua Docker network dùng chung `cliproxyapi_default`.

## 1. Tính năng chính
- **Chat AI + Tool Calling (`POST /ai/chat`)**: Tự động gọi sang `matgreen_backend` để tìm vật liệu thừa/cho tặng/thanh lý quanh vị trí GPS hiện tại, đọc chi tiết bài đăng để thẩm định giá, và tra cứu cẩm nang tái chế.
- **Bóc tách công trình tháo dỡ (`POST /ai/materials/analyze-demolition`)**: Phân tích mô tả công trình, ước lượng thể tích xà bần, số chuyến xe, giá trị thu hồi, CO₂ tiết kiệm và trả về danh sách hạng mục sẵn sàng đăng tin.
- **Vision AI nội bộ bảo vệ HMAC (`POST /internal/vision/inspect-material`, `POST /internal/vision/analyze-demolition`)**: Chỉ nhận request đã ký HMAC-SHA256 từ `matgreen_backend` (đã trừ quota Redis), hỗ trợ nhận diện ảnh vật liệu để tự điền biểu mẫu đăng tin và bóc tách ảnh hiện trường công trình.
- **Kiểm tra sức khỏe (`GET /health/live`, `GET /health/ready`)**: Kiểm tra thực tế kết nối tới `cli-proxy-public` và `matgreen_redis`.

## 2. Triển khai trên VPS (cùng `cli-proxy-public`)

1. Đảm bảo container `cli-proxy-public` đã nằm trong network `cliproxyapi_default`:
   ```bash
   docker network connect cliproxyapi_default cli-proxy-public || true
   ```

2. Tạo/cập nhật file `ai-service/.env` trên VPS (copy từ `.env.example`), chú ý các biến quan trọng:
   ```env
   AI_PROXY_BASE_URL=http://cli-proxy-public:8317/v1
   AI_PROXY_API_KEY=<client_key_cua_cli_proxy_public>
   AI_CHAT_MODEL=gemini-3.1-flash-lite
   AI_FALLBACK_MODEL=gemini-3-flash
   AI_VISION_MODEL=gemini-3-flash
   JWT_SECRET=<phai_trung_khop_JWT_SECRET_trong_be/.env>
   REDIS_URL=redis://redis:6379
   ```

3. Build & chạy lại stack MatGreen:
   ```bash
   docker compose up -d --build
   ```

4. Kiểm tra kết nối nội bộ từ `matgreen_ai_service` tới `cli-proxy-public` và trạng thái sẵn sàng:
   ```bash
   docker exec matgreen_ai_service python -c 'import socket; s=socket.create_connection(("cli-proxy-public",8317),5); s.close(); print("cli-proxy-public reachable")'
   curl -s http://127.0.0.1:8082/ai-api/health/ready
   ```
   Đồng thời xác minh route nội bộ bị Nginx chặn từ ngoài (phải trả về `404`):
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8082/ai-api/internal/vision/inspect-material
   ```
