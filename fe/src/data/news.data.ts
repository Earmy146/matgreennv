import type { NewsArticle } from "@/types/news.types";

export const initialNewsList: NewsArticle[] = [
  {
    id: "news-1",
    slug: "giai-phap-tai-su-dung-xat-ban-va-gach-vo-khi-thao-do-nha",
    title: "Giải pháp tái sử dụng xà bần và gạch vỡ khi tháo dỡ nhà ở đô thị",
    excerpt: "Hàng trăm tấn phế thải xây dựng mỗi ngày có thể biến thành cốt liệu tái chế, vật liệu tôn nền giá rẻ thay vì tốn tiền thuê xe chở đi đổ trộm.",
    category: "Kinh Nghiệm Tháo Dỡ",
    author: {
      name: "KS. Trần Đình Trọng",
      role: "Chuyên gia Kết cấu & Xây dựng Bền vững",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    publishedAt: "2026-10-18",
    thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80",
    views: 1420,
    readTimeMinutes: 5,
    tags: ["Tháo dỡ", "Gạch cũ", "Xà bần", "Kinh nghiệm"],
    isFeatured: true,
    content: `
Khi cải tạo hoặc đập bỏ nhà cũ, một trong những khoản chi phí khiến gia chủ và nhà thầu đau đầu nhất chính là phí vận chuyển xà bần (đất, đá, vữa vụn, gạch vỡ). Tại các đô thị lớn như Hà Nội và TP.HCM, chi phí thuê một chuyến xe ba gác hoặc xe tải nhỏ chở xà bần ra bãi tập kết có thể dao động từ vài trăm nghìn đến tiền triệu.

### 1. Phân loại xà bần ngay tại hiện trường
Để tối ưu giá trị phế thải, nguyên tắc đầu tiên là phân loại tại chỗ:
- **Gạch còn nguyên hoặc nửa viên**: Có thể làm sạch vữa cũ để xây tường bao, lát sân sau, làm bồn hoa hoặc tái sử dụng cho các hạng mục phụ trợ.
- **Xà bần vụn (đá, bê tông vỡ)**: Rất quý đối với những công trình lân cận đang cần đôn nền, tôn móng hoặc lót đường tạm cho xe tải vào công trường.

### 2. Kết nối với các công trình gần bạn qua MatGreen
Thay vì vội vàng bỏ tiền thuê xe chở đi, bạn chỉ cần mở ứng dụng MatGreen, chụp ảnh đống xà bần và định vị vị trí công trình của mình. Rất nhiều nhà thầu trong bán kính 3-5km đang đào móng hoặc làm đường cần vật liệu tôn nền sẽ liên hệ ngay để tự điều xe đến bốc dỡ miễn phí cho bạn.

### 3. Lợi ích đôi bên cùng có lợi
- **Bên Cho (Nhà A)**: Tiết kiệm 100% chi phí bốc dỡ và xe chở phế thải, mặt bằng được dọn sạch nhanh chóng.
- **Bên Nhận (Nhà B)**: Tiết kiệm từ 40% - 70% chi phí mua cát đá san lấp mới.
- **Môi trường**: Giảm thiểu việc đổ trộm phế thải ra đường phố, giảm phát thải khí nhà kính.
    `,
  },
  {
    id: "news-2",
    slug: "kinh-te-tuan-hoan-trong-nganh-xay-dung-xu-huong-tat-yeu",
    title: "Kinh tế tuần hoàn trong xây dựng: Xu hướng tất yếu của tương lai",
    excerpt: "Việt Nam đặt mục tiêu cắt giảm phát thải ròng bằng 0 (Net Zero). Ngành xây dựng đang chứng kiến sự chuyển dịch mạnh mẽ sang mô hình tái sử dụng tài nguyên.",
    category: "Kinh Tế Tuần Hoàn",
    author: {
      name: "ThS. Nguyễn Quỳnh Nga",
      role: "Viện Nghiên cứu Kinh tế Môi trường",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    },
    publishedAt: "2026-10-15",
    thumbnail: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=800&auto=format&fit=crop&q=80",
    views: 980,
    readTimeMinutes: 7,
    tags: ["Kinh tế tuần hoàn", "Net Zero", "Bền vững", "ESG"],
    isFeatured: true,
    content: `
Ngành xây dựng tiêu thụ khoảng 40% nguồn tài nguyên thiên nhiên toàn cầu và phát sinh tới 35% lượng chất thải rắn. Mô hình kinh tế tuyến tính truyền thống "Khai thác - Sử dụng - Vứt bỏ" đang dần bộc lộ những hạn chế nghiêm trọng.

### Bản chất của kinh tế tuần hoàn trong xây dựng
Kinh tế tuần hoàn (Circular Economy) tập trung vào việc giữ cho vật liệu và tài nguyên luôn ở trong chu trình sử dụng với giá trị cao nhất có thể:
1. **Thiết kế để tái sử dụng**: Ưu tiên liên kết bu lông thay vì hàn chết, giúp tháo dỡ nguyên vẹn.
2. **Kéo dài tuổi thọ vật tư**: Thép hình, xà gồ, giàn giáo, ván cốp pha chất lượng cao có thể luân chuyển qua hàng chục công trình.
3. **Thị trường thứ cấp minh bạch**: Các nền tảng số như MatGreen đóng vai trò như cây cầu kết nối cung - cầu theo bán kính địa lý.

### Vai trò của công nghệ định vị GPS
Vật liệu xây dựng có đặc tính là nặng và cồng kềnh, chi phí vận chuyển đường dài rất lớn. Do đó, việc định vị chính xác theo bán kính GPS (5km, 10km, 20km) là chìa khóa then chốt để kinh tế tuần hoàn vật liệu tháo dỡ trở nên khả thi và mang lại hiệu quả kinh tế cao nhất.
    `,
  },
  {
    id: "news-3",
    slug: "huong-dan-thao-do-thu-hoi-cua-nhom-kinh-va-sat-thep-nguyen-ven",
    title: "Hướng dẫn kỹ thuật tháo dỡ thu hồi cửa nhôm kính & sắt thép còn nguyên vẹn",
    excerpt: "Bí quyết giúp đội thợ và gia chủ tháo dỡ hệ thống cửa sổ, cửa đi và cốt thép mà không bị cong vênh hay vỡ kính, bán lại được giá cao.",
    category: "Hướng Dẫn & Mẹo",
    author: {
      name: "Bác Ba Thợ Cả",
      role: "Trưởng Đội Tháo Dỡ Chuyên Nghiệp",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    publishedAt: "2026-10-10",
    thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
    views: 1850,
    readTimeMinutes: 4,
    tags: ["Nhôm kính", "Thép cũ", "Kỹ thuật", "Mẹo hay"],
    content: `
Cửa nhôm kính Xingfa, cửa sắt lùa và cốt thép công trình tháo dỡ thường có giá trị rất cao nếu biết cách thu hồi cẩn thận. Ngược lại, nếu dùng búa đập bừa bãi, bạn chỉ có thể bán chúng dưới dạng sắt vụn phế liệu với giá rẻ mạt.

### Quy trình tháo dỡ cửa nhôm kính an toàn:
1. **Tháo cánh trước, khung sau**: Dùng tua vít hoặc máy bắn vít tháo bản lề để nhấc rời cánh cửa ra trước.
2. **Rạch keo silicon**: Dùng dao rọc giấy chuyên dụng rạch đứt mép keo silicone giữa khung nhôm và tường gạch.
3. **Đục tường quanh vít tắc kê**: Tuyệt đối không dùng xà beng bẩy mạnh làm cong thanh nhôm. Đục tỉa lớp vữa xung quanh để tháo ốc vít một cách êm ái.

Sau khi tháo dỡ, hãy lau sạch bụi bẩn, chụp ảnh rõ nét và đăng lên MatGreen với giá bán thanh lý hoặc tặng cho những ai đang làm nhà tạm, nhà kho.
    `,
  },
  {
    id: "news-4",
    slug: "ung-dung-ai-trong-dinh-gia-va-boc-tach-khoi-luong-vat-lieu-cu",
    title: "Ứng dụng AI trong thẩm định giá & bóc tách khối lượng vật liệu cũ",
    excerpt: "Trợ lý trí tuệ nhân tạo MatGreen AI Advisor hỗ trợ các chủ nhà không chuyên ước tính chính xác khối lượng phế liệu thu hồi được chỉ bằng một bức ảnh.",
    category: "Vật Liệu Xanh",
    author: {
      name: "Vũ Hải Đăng",
      role: "Kỹ sư AI & Dữ liệu Xây dựng",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    publishedAt: "2026-10-05",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
    views: 760,
    readTimeMinutes: 6,
    tags: ["AI", "Bóc tách", "Thẩm định", "Công nghệ"],
    content: `
Một trong những rào cản lớn nhất của thị trường vật liệu cũ là sự bất cân xứng thông tin. Gia chủ thường không biết ngôi nhà cấp 4 cũ 60m² sắp đập đi sẽ cho ra bao nhiêu tấn gạch, bao nhiêu mét vuông vì kèo sắt và bán được bao nhiêu tiền.

Trợ lý **MatGreen AI Advisor** sử dụng các mô hình thị giác máy tính và phân tích ngôn ngữ tự nhiên được huấn luyện riêng cho danh mục vật liệu xây dựng tại Việt Nam:
- Tự động nhận diện chủng loại: Gạch ống, gạch thẻ, tôn mạ kẽm, sắt hộp 40x80, xà gồ C...
- Bóc tách khối lượng ước tính dựa trên diện tích sàn và số tầng.
- Đề xuất mức giá tham khảo theo thời giá phế liệu và đồ cũ tại địa phương.
    `,
  },
];
