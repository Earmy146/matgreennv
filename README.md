# MatGreen - Nền Tảng Kết Nối Vật Liệu Xây Dựng & Tái Sử Dụng Tháo Dỡ

MatGreen là nền tảng giải quyết bài toán lãng phí tài nguyên xây dựng: kết nối các công trình chuẩn bị tháo dỡ/xây dựng có vật liệu thừa (sắt cũ, cửa gỗ, gạch vỡ, thiết bị vệ sinh cũ...) với người dân, thầu phụ hoặc đội thu gom có nhu cầu tái sử dụng hoặc mua lại với giá rẻ quanh khu vực lân cận.

---

## 🏛️ Kiến Trúc Hệ Thống (Mô Hình 3-Tier Chuẩn)

Dự án được kế thừa và chuẩn hóa theo kiến trúc hệ thống hiện đại tương tự như dự án quản lý tài chính:

```
matgreen/
├── be/                 # Backend REST API & Realtime Socket.IO (Node.js/Express + MongoDB + Redis)
├── fe/                 # Frontend Single Page Application (React 19 + Vite + TypeScript + Tailwind CSS)
├── ai-service/         # Microservice AI phân tích, định giá & gợi ý vật liệu (Python FastAPI + LLM)
├── docker-compose.yml  # Triển khai toàn bộ cụm dịch vụ cục bộ hoặc trên VPS
└── README.md
```

---

## 🚀 Các Dịch Vụ Chính

### 1. Backend (`be/`)
- **Ngôn ngữ & Framework:** Node.js, Express 5, Mongoose (MongoDB).
- **Tính năng cốt lõi:**
  - Quản lý bài đăng vật liệu (Phân loại: Miễn phí / Cho tặng vs. Bán thanh lý).
  - Tìm kiếm theo bán kính vị trí địa lý (GeoJSON 2dsphere + công thức Haversine).
  - Xác thực người dùng (JWT, Bcrypt).
  - Chat thời gian thực (Socket.IO).
  - Tích hợp Redis cho cache và rate limiting.

### 2. Frontend (`fe/`)
- **Ngôn ngữ & Framework:** React 19, TypeScript, Vite, Tailwind CSS v4.
- **Tính năng cốt lõi:**
  - Định vị vị trí hiện tại bằng HTML5 Geolocation API (hoàn toàn miễn phí, không phát sinh chi phí Maps).
  - Lọc vật liệu theo bán kính (ví dụ: 1km, 3km, 5km, 10km) và danh mục.
  - Giao diện đăng bài trực quan kèm ảnh, địa chỉ và giá/tặng miễn phí.
  - Cửa sổ chat kết nối trực tiếp giữa bên có và bên cần.

### 3. AI Service (`ai-service/`)
- **Ngôn ngữ & Framework:** Python 3.12, FastAPI, Uvicorn, Pydantic.
- **Mục tiêu tương lai:**
  - Trợ lý AI tư vấn tái chế / tái sử dụng vật liệu xây dựng.
  - Tự động bóc tách danh mục vật liệu từ mô tả công trình tháo dỡ (Demolition Breakdown).
  - Ước tính giá trị thanh lý vật liệu dựa trên tình trạng và khối lượng.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Thử Nghiệm

### Cách 1: Chạy bằng Docker Compose (Khuyên dùng khi triển khai VPS)
```bash
docker compose up -d --build
```

### Cách 2: Chạy cục bộ từng phần (Development)

1. **Backend**:
   ```bash
   cd be
   npm install
   cp .env.example .env
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd fe
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **AI Service**:
   ```bash
   cd ai-service
   python -m venv .venv
   source .venv/bin/activate  # Trên Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   uvicorn app.main:app --reload --port 8000
   ```
