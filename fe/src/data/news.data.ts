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
      avatar: "/assets/images/resources/about-author-1.png",
    },
    publishedAt: "2026-10-18",
    thumbnail: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728276/finance-lite/news/mat-mvkg4ktp-2a6bf9a482b9.png",
    bannerImage: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728276/finance-lite/news/mat-mvkg4ktp-2a6bf9a482b9.png",
    views: 1420,
    readTimeMinutes: 5,
    tags: ["Tháo dỡ", "Gạch cũ", "Xà bần", "Kinh nghiệm"],
    isFeatured: true,
    content: `<p>Khi cải tạo hoặc đập bỏ nhà cũ, một trong những khoản chi phí khiến gia chủ và nhà thầu đau đầu nhất chính là <strong>phí vận chuyển xà bần</strong> (đất, đá, vữa vụn, gạch vỡ). Tại các đô thị lớn như Hà Nội và TP.HCM, chi phí thuê một chuyến xe ba gác hoặc xe tải nhỏ chở xà bần ra bãi tập kết có thể dao động từ vài trăm nghìn đến tiền triệu cho mỗi chuyến.</p>

<p>Tuy nhiên, nếu biết cách xử lý và tận dụng nền tảng kết nối tuần hoàn vật liệu <strong>MatGreen</strong>, bạn hoàn toàn có thể biến khoản chi phí này về con số <strong>0 đồng</strong>, thậm chí còn hỗ trợ các công trình lân cận tiết kiệm ngân sách san lấp.</p>

<blockquote>"Phế thải của công trình này hoàn toàn có thể là tài nguyên quý giá của công trình khác nếu chúng ta kết nối đúng người, đúng thời điểm và đúng bán kính địa lý."</blockquote>

<h3>1. Phân loại xà bần ngay tại hiện trường</h3>
<p>Để tối ưu giá trị phế thải, nguyên tắc đầu tiên và quan trọng nhất là <em>phân loại tại chỗ</em> ngay trong quá trình tháo dỡ:</p>
<ul>
  <li><strong>Gạch còn nguyên hoặc nửa viên:</strong> Có thể làm sạch lớp vữa xi măng cũ để tái sử dụng xây tường bao, lát sân sau, làm bồn hoa tiểu cảnh hoặc phục vụ các hạng mục phụ trợ.</li>
  <li><strong>Xà bần vụn (đá dăm, bê tông vỡ hạt trung):</strong> Rất quý đối với những công trình lân cận đang cần đôn nền, tôn móng hoặc lót đường tạm chống lún cho xe tải trọng lớn vào công trường.</li>
  <li><strong>Đất cát đào móng sạch:</strong> Cực kỳ thích hợp cho các vườn ươm cây cảnh, hộ gia đình trồng rau sân thượng hoặc các dự án san lấp ao hồ sinh thái.</li>
</ul>

<h3>2. Kết nối với các công trình gần bạn qua MatGreen</h3>
<p>Thay vì vội vàng bỏ tiền thuê xe chở đi đổ trộm gây ô nhiễm cảnh quan đô thị, bạn chỉ cần thực hiện 3 thao tác đơn giản:</p>
<ul>
  <li>Mở ứng dụng hoặc website <strong>MatGreen</strong>.</li>
  <li>Chụp 2 - 3 bức ảnh rõ nét đống xà bần và bật định vị GPS vị trí công trình của mình.</li>
  <li>Đăng tin với trạng thái <strong>Cho Tặng Miễn Phí (0đ)</strong>.</li>
</ul>
<p>Hàng chục nhà thầu và đội thi công trong bán kính <strong>3 - 5km</strong> đang đào móng hoặc làm đường cần vật liệu tôn nền sẽ nhận được thông báo radar tự động và liên hệ ngay để tự điều xe đến bốc dỡ miễn phí cho bạn.</p>

<h3>3. Lợi ích đôi bên cùng có lợi (Win - Win)</h3>
<ul>
  <li><strong>Bên Cho (Chủ nhà tháo dỡ):</strong> Tiết kiệm 100% chi phí bốc dỡ và xe chở phế thải, mặt bằng thi công được giải phóng nhanh chóng, sạch sẽ.</li>
  <li><strong>Bên Nhận (Công trình đang làm móng):</strong> Tiết kiệm từ 40% đến 70% chi phí mua cát đá san lấp thương phẩm mới.</li>
  <li><strong>Môi trường đô thị:</strong> Giảm thiểu tối đa việc đổ trộm phế thải ra vỉa hè lòng đường, giảm phát thải khí nhà kính và bụi mịn PM2.5.</li>
</ul>`,
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
      avatar: "/assets/images/resources/about-author-2.png",
    },
    publishedAt: "2026-10-15",
    thumbnail: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728277/finance-lite/news/mat-mvkg4mfc-f1d945df1299.png",
    bannerImage: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728277/finance-lite/news/mat-mvkg4mfc-f1d945df1299.png",
    views: 980,
    readTimeMinutes: 7,
    tags: ["Kinh tế tuần hoàn", "Net Zero", "Bền vững", "ESG"],
    isFeatured: true,
    content: `<p>Ngành xây dựng hiện nay tiêu thụ khoảng <strong>40% nguồn tài nguyên thiên nhiên toàn cầu</strong> và phát sinh tới <strong>35% lượng chất thải rắn</strong> tại các khu vực đô thị. Mô hình kinh tế tuyến tính truyền thống <em>"Khai thác - Sản xuất - Sử dụng - Vứt bỏ"</em> đang bộc lộ những hạn chế nghiêm trọng về cạn kiệt tài nguyên và gia tăng chi phí xử lý môi trường.</p>

<blockquote>"Kinh tế tuần hoàn không đơn thuần là xử lý rác, mà là tư duy thiết kế giữ cho vật tư và tài nguyên luôn vận động trong chu trình giá trị cao nhất."</blockquote>

<h3>1. Bản chất của kinh tế tuần hoàn trong xây dựng</h3>
<p>Kinh tế tuần hoàn (Circular Economy) tập trung vào việc duy trì vòng đời vật liệu xây dựng thông qua ba trụ cột cốt lõi:</p>
<ul>
  <li><strong>Thiết kế để tái sử dụng (Design for Disassembly):</strong> Ưu tiên liên kết bu lông, khớp nối module thay vì đổ bê tông liền khối hay hàn chết, cho phép tháo dỡ hoàn trả nguyên vẹn cấu kiện khi hết thời hạn sử dụng.</li>
  <li><strong>Kéo dài tuổi thọ vật tư:</strong> Thép hình, xà gồ mạ kẽm, cốp pha nhôm/ván phủ phim chất lượng cao có thể luân chuyển qua hàng chục công trình khác nhau mà không suy giảm khả năng chịu tải.</li>
  <li><strong>Thị trường thứ cấp minh bạch:</strong> Xây dựng các sàn giao dịch trực tuyến như <strong>MatGreen</strong> làm cầu nối giữa các dự án thừa và dự án thiếu trong cự ly gần.</li>
</ul>

<h3>2. Vai trò then chốt của công nghệ định vị bán kính GPS</h3>
<p>Vật liệu xây dựng có đặc tính là <em>dung trọng lớn và cồng kềnh</em>, chi phí vận chuyển đường dài thường chiếm tỷ trọng lớn trong tổng giá thành. Do đó, việc định vị chính xác theo bán kính GPS (3km, 5km, 10km) là chìa khóa then chốt giúp việc tái sử dụng vật liệu tháo dỡ trở nên khả thi và sinh lời kinh tế thực sự.</p>
<p>Thông qua thuật toán tối ưu lộ trình xe tải và thông báo theo thời gian thực, MatGreen giúp hàng ngàn tấn vật tư tháo dỡ mỗi tuần tìm được công trình tiếp nhận mới ngay trong bán kính đô thị vệ tinh.</p>`,
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
      avatar: "/assets/images/resources/about-author-1.png",
    },
    publishedAt: "2026-10-10",
    thumbnail: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728277/finance-lite/news/mat-mvkg4mzi-a456fb843bf6.png",
    bannerImage: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728277/finance-lite/news/mat-mvkg4mzi-a456fb843bf6.png",
    views: 1850,
    readTimeMinutes: 4,
    tags: ["Nhôm kính", "Thép cũ", "Kỹ thuật", "Mẹo hay"],
    content: `<p>Cửa nhôm kính hệ Xingfa, cửa sắt lùa và kết cấu thép trong các công trình dân dụng cũ có giá trị thu hồi rất cao nếu biết cách tháo dỡ đúng kỹ thuật. Ngược lại, nếu dùng búa đập bừa bãi hoặc giật mạnh bằng xà beng, bạn chỉ có thể bán chúng dưới dạng phế liệu cân ký với giá rẻ mạt.</p>

<h3>1. Quy trình tháo dỡ cửa nhôm kính an toàn và nguyên vẹn:</h3>
<ul>
  <li><strong>Bước 1 - Tháo cánh trước, giữ khung sau:</strong> Dùng máy bắn vít mở ốc bản lề, nhấc rời cánh cửa ra khỏi khung bao. Đặt cánh nằm nghiêng trên tấm xốp mềm để tránh nứt vỡ kính cường lực.</li>
  <li><strong>Bước 2 - Rạch đứt liên kết keo silicone:</strong> Dùng dao rọc giấy chuyên dụng luồn lưỡi dao rạch toàn bộ đường keo silicone liên kết giữa khung nhôm và mép tường gạch trát.</li>
  <li><strong>Bước 3 - Khoét lớp vữa quanh tắc kê sắt:</strong> Tuyệt đối không dùng búa nện vào thanh nhôm vì sẽ làm móp thanh profile nhôm Xingfa. Hãy dùng đục dẹt khoét nhẹ lớp vữa xung quanh để tháo rời bu lông tắc kê.</li>
</ul>

<blockquote>"Một bộ cửa nhôm kính tháo dỡ nguyên vẹn có thể bán thanh lý được từ 1.200.000đ - 2.500.000đ/bộ, trong khi nếu bẹp méo thì phế liệu chỉ thu về khoảng 100.000đ - 200.000đ."</blockquote>

<h3>2. Thu hồi thép dầm sàn và xà gồ mái</h3>
<p>Đối với xà gồ thép hộp hoặc thép C, hãy dùng mỏ hàn cắt ngọt các mối hàn điểm hoặc dùng súng siết bu lông. Sau đó lau sạch bụi xi măng, phân loại theo độ dài và đường kính (phi 10, 14, 16, 18) trước khi chụp ảnh đăng lên MatGreen để thu hút người mua làm nhà kho, nhà tiền chế.</p>`,
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
      avatar: "/assets/images/resources/about-author-2.png",
    },
    publishedAt: "2026-10-05",
    thumbnail: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728278/finance-lite/news/mat-mvkg4np8-15f79c916a37.png",
    bannerImage: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728278/finance-lite/news/mat-mvkg4np8-15f79c916a37.png",
    views: 760,
    readTimeMinutes: 6,
    tags: ["AI", "Bóc tách", "Thẩm định", "Công nghệ"],
    content: `<p>Một trong những rào cản lớn nhất của thị trường vật liệu cũ và phế phẩm xây dựng là <strong>sự bất cân xứng thông tin</strong>. Đa số chủ nhà khi đập bỏ ngôi nhà cũ 2-3 tầng hoàn toàn không biết căn nhà sẽ cho ra bao nhiêu tấn gạch lành, bao nhiêu mét dài vì kèo sắt hộp và có thể thu hồi được bao nhiêu tiền.</p>

<h3>Trợ lý thông minh MatGreen AI Advisor hoạt động như thế nào?</h3>
<p>Hệ thống sử dụng các mô hình thị giác máy tính (Computer Vision) kết hợp công nghệ xử lý ngôn ngữ tự nhiên được tinh chỉnh riêng cho danh mục vật liệu xây dựng tại Việt Nam:</p>
<ul>
  <li><strong>Nhận diện tự động chủng loại qua ảnh:</strong> Phân biệt gạch thẻ đặc, gạch tuynel 2 lỗ, tôn lạnh mạ kẽm, đá dăm 1x2 hay bê tông khối lớn.</li>
  <li><strong>Dự phóng khối lượng chính xác:</strong> Dựa trên thông tin kích thước sàn và hình ảnh hiện trạng, AI tính toán ước lượng số lượng xe tải cần điều động.</li>
  <li><strong>Gợi ý biểu giá thị trường theo thời gian thực:</strong> Tự động cập nhật bảng giá phế liệu sắt thép, gạch cũ và phí vận chuyển xe ba gác theo từng quận huyện cụ thể.</li>
</ul>

<blockquote>"Công nghệ AI giúp biến người dùng phổ thông trở thành chuyên gia thẩm định, tránh tình trạng bị ép giá hoặc bỏ lãng phí tài sản còn giá trị sử dụng cao."</blockquote>`,
  },
  {
    id: "news-5",
    slug: "quy-dinh-quan-ly-phe-thai-xay-dung-va-trach-nhiem-chu-dau-tu",
    title: "Quy định pháp lý về quản lý phế thải xây dựng & trách nhiệm chủ đầu tư",
    excerpt: "Tìm hiểu các nghị định và quy chuẩn môi trường mới nhất về vận chuyển, đổ thải và tái chế phế thải từ các công trình dân dụng đô thị.",
    category: "Kinh Tế Tuần Hoàn",
    author: {
      name: "Luật sư Lê Minh Trí",
      role: "Chuyên gia Pháp chế Đô thị",
      avatar: "/assets/images/resources/about-author-1.png",
    },
    publishedAt: "2026-10-02",
    thumbnail: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728279/finance-lite/news/mat-mvkg4oaw-7442d2ab7bd2.png",
    bannerImage: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728279/finance-lite/news/mat-mvkg4oaw-7442d2ab7bd2.png",
    views: 640,
    readTimeMinutes: 5,
    tags: ["Pháp lý", "Quy chuẩn", "Môi trường", "Chính sách"],
    content: `<p>Chính quyền các đô thị lớn như Hà Nội, Đà Nẵng và TP.HCM đang siết chặt chế tài xử phạt đối với các hành vi đổ trộm phế thải xây dựng ra vỉa hè, lòng đường, kênh rạch và các khu đất trống chờ quy hoạch. Mức xử phạt hành chính đối với cá nhân vi phạm có thể lên đến <strong>20.000.000đ - 50.000.000đ</strong> kèm theo biện pháp khắc phục hậu quả buộc dọn sạch hiện trạng ban đầu.</p>

<h3>Trách nhiệm pháp lý của gia chủ và nhà thầu tháo dỡ:</h3>
<ul>
  <li>Phải có biện pháp che chắn bụi bặm bằng lưới chuyên dụng đạt tiêu chuẩn khi tiến hành đập phá công trình.</li>
  <li>Chỉ được phép hợp đồng vận chuyển với các đơn vị hoặc cá nhân có phương tiện đủ điều kiện và điểm tập kết xử lý rác thải xây dựng hợp pháp.</li>
  <li>Lưu giữ biên lai, chứng từ hoặc nhật ký bàn giao phế thải khi có yêu cầu kiểm tra của lực lượng trật tự xây dựng và thanh tra môi trường phường/xã.</li>
</ul>

<blockquote>"Nền tảng MatGreen cung cấp lịch sử giao dịch và định vị GPS rõ ràng cho từng chuyến vật liệu tái sử dụng, giúp chủ đầu tư an tâm 100% về tính minh bạch pháp lý."</blockquote>

<p>Bằng cách kết nối giao nhận vật tư trực tiếp cho các công trình san lấp có địa chỉ rõ ràng, bạn không chỉ tiết kiệm ngân sách mà còn tuân thủ nghiêm ngặt Luật Bảo vệ Môi trường 2020.</p>`,
  },
  {
    id: "news-6",
    slug: "mo-hinh-ket-noi-xe-ba-gac-xe-tai-dia-phuong-trong-chuoi-tuan-hoan",
    title: "Mô hình kết nối xe ba gác & xe tải địa phương trong chuỗi logistics xanh",
    excerpt: "Cách MatGreen tạo sinh kế ổn định cho hàng trăm tài xế xe tải nhỏ và đội thợ bốc xếp địa phương thông qua các đơn hàng vận chuyển vật liệu thừa ngắn tuyến.",
    category: "Hướng Dẫn & Mẹo",
    author: {
      name: "Nguyễn Văn Quân",
      role: "Đồng Sáng Lập MatGreen",
      avatar: "/assets/images/resources/about-author-2.png",
    },
    publishedAt: "2026-09-28",
    thumbnail: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728280/finance-lite/news/mat-mvkg4oyb-fa68d429e6da.png",
    bannerImage: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728280/finance-lite/news/mat-mvkg4oyb-fa68d429e6da.png",
    views: 1120,
    readTimeMinutes: 5,
    tags: ["Logistics", "Vận tải", "Xe ba gác", "Cộng đồng"],
    content: `<p>Logistics chặng cuối và cự ly ngắn (Hyper-local Logistics) là mắt xích quan trọng nhất quyết định sự thành bại của chuỗi tuần hoàn vật liệu xây dựng. Nếu khoảng cách giữa công trình đập phá và công trình tái sinh vượt quá 20km, chi phí xăng dầu và khấu hao phương tiện sẽ triệt tiêu toàn bộ lợi ích kinh tế của việc tái chế.</p>

<h3>1. Giải bài toán vận chuyển ngõ hẻm đô thị</h3>
<p>Đặc thù đô thị Việt Nam là hệ thống ngõ ngách chằng chịt, xe tải hạng nặng từ 10 tấn trở lên hoàn toàn không thể tiếp cận các ngôi nhà dân cư nhỏ cần cải tạo. Lúc này, <strong>đội ngũ xe ba gác máy và xe tải nhẹ 1.25 tấn</strong> là lực lượng vận tải cơ động và linh hoạt nhất.</p>
<ul>
  <li>Xe ba gác có thể luồn lách vào tận cửa từng căn nhà trong ngõ 2 - 3m.</li>
  <li>Thời gian bốc dỡ linh hoạt, không bị cấm giờ gắt gao như các dòng xe tải lớn.</li>
  <li>Chi phí chuyến hợp lý, tính theo cự ly ngắn từ 1km đến 5km.</li>
</ul>

<h3>2. Tạo sinh kế bền vững cho người lao động địa phương</h3>
<p>MatGreen không sở hữu bất kỳ đội xe nào, mà vận hành theo mô hình nền tảng kinh tế chia sẻ. Khi có công trình thông báo cần dọn xà bần hoặc chuyển giao gạch cũ, thông báo lập tức được phát tới các bác tài xế xe tải nhỏ và đội thợ bốc vác đang hoạt động ngay trong khu vực lân cận.</p>

<blockquote>"Nhờ tối ưu bán kính di chuyển, các tài xế có thể hoàn thành từ 4 - 6 cuốc vận chuyển ngắn mỗi ngày, tăng thu nhập từ 30% - 50% so với việc chờ đón khách vãng lai."</blockquote>`,
  },
];
