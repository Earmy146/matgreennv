"""OpenAI-compatible tool declarations for MatGreen AI Assistant."""

MATGREEN_TOOLS: list[dict] = [
    {
        "type": "function",
        "function": {
            "name": "search_nearby_materials",
            "description": (
                "Tìm danh sách vật liệu xây dựng thừa/tháo dỡ đang có thật trên sàn MatGreen quanh vị trí GPS "
                "của người dùng. Luôn ưu tiên dùng tool này khi người dùng hỏi tìm xà bần, sắt thép, gạch ngói, "
                "cửa kính, gỗ cốp pha, thiết bị vệ sinh gần đây hoặc hỏi trên sàn đang có gì."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "radius_km": {
                        "type": "number",
                        "description": "Bán kính tìm kiếm tính bằng km (mặc định 10, tối đa 100).",
                    },
                    "category": {
                        "type": "string",
                        "enum": [
                            "sat_thep",
                            "gach_ngoi",
                            "cua_kinh",
                            "thiet_bi_ve_sinh",
                            "go_copha",
                            "xa_ban",
                            "khac",
                        ],
                        "description": "Danh mục vật liệu cần lọc (tùy chọn).",
                    },
                    "type": {
                        "type": "string",
                        "enum": ["free", "sell"],
                        "description": "'free' cho vật liệu tặng 0đ, 'sell' cho vật liệu bán thanh lý (tùy chọn).",
                    },
                    "search": {
                        "type": "string",
                        "description": "Từ khóa tìm kiếm trong tiêu đề, mô tả hoặc địa chỉ (tùy chọn).",
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Số lượng kết quả tối đa (1 đến 8, mặc định 5).",
                    },
                },
                "required": [],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "search_all_materials",
            "description": (
                "Tra cứu danh sách bài đăng vật liệu mới nhất trên toàn sàn MatGreen khi người dùng chưa bật GPS "
                "hoặc muốn xem tổng quan vật liệu theo danh mục/hình thức."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string",
                        "enum": [
                            "sat_thep",
                            "gach_ngoi",
                            "cua_kinh",
                            "thiet_bi_ve_sinh",
                            "go_copha",
                            "xa_ban",
                            "khac",
                        ],
                    },
                    "type": {
                        "type": "string",
                        "enum": ["free", "sell"],
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Số lượng kết quả tối đa (1 đến 8, mặc định 5).",
                    },
                },
                "required": [],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_material_detail",
            "description": (
                "Đọc thông tin chi tiết một bài đăng vật liệu cụ thể trên MatGreen theo material_id "
                "(giá, đơn vị, địa chỉ, khoảng cách, mô tả, khung giờ lấy hàng) để thẩm định giá hoặc tư vấn bốc xếp."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "material_id": {
                        "type": "string",
                        "description": "MongoDB ObjectId của bài đăng vật liệu.",
                    },
                },
                "required": ["material_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_news_articles",
            "description": (
                "Tra cứu danh sách bài viết cẩm nang, tin tức tái chế và quy định tháo dỡ đang đăng trên MatGreen."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "limit": {
                        "type": "integer",
                        "description": "Số bài viết tối đa (1 đến 8, mặc định 5).",
                    },
                },
                "required": [],
            },
        },
    },
]
