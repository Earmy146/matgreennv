const mongoose = require("mongoose");

const officeSchema = new mongoose.Schema({
  city: { type: String, default: "" },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
}, { _id: false });

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  role: { type: String, default: "" },
  image: { type: String, default: "" },
  bio: { type: String, default: "" },
}, { _id: false });

const partnerSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  logo: { type: String, default: "" },
  website: { type: String, default: "" },
}, { _id: false });

const testimonialSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  role: { type: String, default: "" },
  quote: { type: String, default: "" },
  rating: { type: Number, default: 5 },
  avatar: { type: String, default: "" },
  projectImage: { type: String, default: "" },
}, { _id: false });

const serviceItemSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  desc: { type: String, default: "" },
  image: { type: String, default: "" },
  tag: { type: String, default: "" },
  link: { type: String, default: "" },
}, { _id: false });

const galleryItemSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  tag: { type: String, default: "" },
  image: { type: String, default: "" },
}, { _id: false });

const statItemSchema = new mongoose.Schema({
  num: { type: String, default: "" },
  label: { type: String, default: "" },
  sub: { type: String, default: "" },
}, { _id: false });

const packageItemSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  target: { type: String, default: "" },
  price: { type: String, default: "" },
  period: { type: String, default: "" },
  badge: { type: String, default: "" },
  highlight: { type: Boolean, default: false },
  features: { type: [String], default: [] },
  btnText: { type: String, default: "" },
  btnLink: { type: String, default: "" },
}, { _id: false });

const faqItemSchema = new mongoose.Schema({
  q: { type: String, default: "" },
  a: { type: String, default: "" },
}, { _id: false });

const stepItemSchema = new mongoose.Schema({
  num: { type: String, default: "" },
  title: { type: String, default: "" },
  desc: { type: String, default: "" },
}, { _id: false });

const featureItemSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  desc: { type: String, default: "" },
}, { _id: false });

const offerCardSchema = new mongoose.Schema({
  badge: { type: String, default: "" },
  title: { type: String, default: "" },
  desc: { type: String, default: "" },
  bgImage: { type: String, default: "" },
  shapeImage: { type: String, default: "" },
  buttonText: { type: String, default: "" },
  buttonLink: { type: String, default: "" },
  subText: { type: String, default: "" },
}, { _id: false });

const productSampleSchema = new mongoose.Schema({
  id: { type: String, default: "" },
  title: { type: String, default: "" },
  category: { type: String, default: "" },
  price: { type: String, default: "" },
  isFree: { type: Boolean, default: false },
  unit: { type: String, default: "" },
  distance: { type: String, default: "" },
  address: { type: String, default: "" },
  image: { type: String, default: "" },
  rating: { type: Number, default: 5 },
}, { _id: false });

const siteConfigSchema = new mongoose.Schema(
  {
    key: { type: String, default: "default", unique: true },
    general: {
      siteName: { type: String, default: "MatGreen - Vật Liệu Xây Dựng Tuần Hoàn" },
      siteTagline: { type: String, default: "Kết Nối Cung Cầu Vật Liệu & Tái Sử Dụng Tháo Dỡ Toàn Quốc" },
      logoUrl: {
        type: String,
        default: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728276/finance-lite/news/mat-mvkg4ktp-2a6bf9a482b9.png",
      },
      faviconUrl: {
        type: String,
        default: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728276/finance-lite/news/mat-mvkg4ktp-2a6bf9a482b9.png",
      },
      socialFacebook: { type: String, default: "https://facebook.com" },
      socialYoutube: { type: String, default: "https://youtube.com" },
      socialZalo: { type: String, default: "https://zalo.me" },
      socialInstagram: { type: String, default: "https://instagram.com" },
      footerDesc: {
        type: String,
        default:
          "Nền tảng công nghệ tiên phong tuần hoàn vật liệu xây dựng tháo dỡ tại Việt Nam. Kết nối cung cầu theo bán kính định vị GPS, giảm thiểu phế thải đô thị.",
      },
      footerBgPattern: {
        type: String,
        default: "/assets/images/shapes/footer-bg-1-1.png",
      },
      copyrightText: {
        type: String,
        default: "© 2026 MatGreen Platform. All rights reserved. Tiên phong tuần hoàn vật liệu xây dựng số.",
      },
    },
    contact: {
      hotline: { type: String, default: "1900 8899 / 0988 776 655" },
      email: { type: String, default: "hotro@matgreen.vn" },
      workingHours: { type: String, default: "Thứ 2 - Thứ 7: 07:00 – 19:00 | Chủ Nhật: 08:00 – 16:00" },
      mapEmbedUrl: {
        type: String,
        default:
          "https://maps.google.com/maps?q=C%E1%BA%A7u%20Gi%E1%BA%A5y%2C%20H%C3%A0%20N%E1%BB%99i%2C%20Vi%E1%BB%87t%20Nam&t=&z=15&ie=UTF8&iwloc=&output=embed",
      },
      offices: {
        type: [officeSchema],
        default: [
          {
            city: "Trụ Sở Hà Nội (Miền Bắc)",
            address: "Tòa Nhà Innovation, Cầu Giấy, Hà Nội",
            phone: "0988 776 655",
            email: "hanoi@matgreen.vn",
          },
          {
            city: "Chi Nhánh TP.HCM (Miền Nam)",
            address: "Đường Nguyễn Hữu Thọ, Quận 7, TP. Hồ Chí Minh",
            phone: "0912 345 678",
            email: "hcm@matgreen.vn",
          },
          {
            city: "Chi Nhánh Đà Nẵng (Miền Trung)",
            address: "Đường Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng",
            phone: "0905 112 233",
            email: "danang@matgreen.vn",
          },
        ],
      },
    },
    teamMembers: {
      type: [teamMemberSchema],
      default: [
        {
          name: "Nguyễn Văn Quân",
          role: "Nhà Sáng Lập & Kỹ Sư Hệ Thống",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          bio: "10 năm kinh nghiệm thi công công trình và đam mê công nghệ số hóa tuần hoàn phế thải xây dựng đô thị.",
        },
        {
          name: "TS. Lê Hoàng Mai",
          role: "Cố Vấn Khoa Học & Môi Trường",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
          bio: "Chuyên gia nghiên cứu tái chế cốt liệu bê tông phế thải hướng tới Net Zero carbon trong xây dựng.",
        },
        {
          name: "KTS. Vũ Hải Đăng",
          role: "Giám Đốc Kỹ Thuật & Giám Sát",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
          bio: "Kiến trúc sư trưởng với hơn 15 năm thiết kế kết cấu tái sử dũng vật liệu khung thép và gạch ngói cổ.",
        },
      ],
    },
    partners: {
      type: [partnerSchema],
      default: [
        {
          name: "Hiệp Hội Bê Tông & Tái Chế Việt Nam",
          logo: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=200&q=80",
        },
        {
          name: "Tập Đoàn Hạ Tầng Đô Thị Xanh",
          logo: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=200&q=80",
        },
        {
          name: "Tổng Công Ty Vận Tải Công Trình 24/7",
          logo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=200&q=80",
        },
        {
          name: "Liên Minh Thầu Phá Dỡ & Tôn Nền",
          logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=200&q=80",
        },
        {
          name: "Mạng Lưới Thợ Xây Dựng Miền Bắc",
          logo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80",
        },
        {
          name: "Viện Nghiên Cứu Vật Liệu Xanh Eco",
          logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=200&q=80",
        },
      ],
    },
    partnersHeadline: {
      type: String,
      default: "Được Đồng Hành & Tin Cậy Bởi Hơn 500+ Nhà Thầu & Đơn Vị Tái Chế",
    },
    testimonials: {
      type: [testimonialSchema],
      default: [
        {
          name: "Kỹ sư Trần Mạnh Cường",
          role: "Chỉ huy trưởng dự án Biệt Thự Vườn Cầu Giấy",
          quote:
            "Tôi đập căn nhà cấp 4 cũ thừa hơn 6 xe tải gạch đỏ đặc và xà bần. Đăng lên MatGreen lúc 9h sáng thì đến 11h trưa đã có một đội thợ đang làm đường cách 2km điều xe tải đến bốc sạch sẽ. Vừa không mất đồng phí đổ phế thải nào, vừa bàn giao mặt bằng đúng tiến độ!",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
          projectImage: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=500&q=80",
        },
        {
          name: "Anh Hoàng Văn Tuấn",
          role: "Chủ thầu thi công nhà phố Hoàng Mai",
          quote:
            "Tôi mua được hơn 30 cây sắt hộp 40x80 và 8 bộ cửa nhôm kính Xingfa của một ngôi nhà sắp cải tạo với giá chỉ bằng một nửa hàng mới. Cửa còn nguyên vẹn, sơn còn bóng loáng. MatGreen thực sự là cứu cánh giúp tiết kiệm ngân sách xây dựng!",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
          projectImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80",
        },
        {
          name: "Bác Ba Thợ Nề",
          role: "Đội trưởng đội thợ hoàn thiện Thanh Xuân",
          quote:
            "Trước đây nhận được tin báo gạch cũ toàn phải gọi điện hỏi quanh các bãi. Giờ mở bản đồ MatGreen ra là thấy ngay điểm nào gần, có ảnh thật, số điện thoại chủ nhà bấm gọi trực tiếp rất tiện lợi.",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
          projectImage: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=500&q=80",
        },
      ],
    },
    // 1. CẤU HÌNH TRANG CHỦ (Home Page)
    homePage: {
      hero: {
        badge: { type: String, default: "Sàn Tuần Hoàn Vật Liệu Xây Dựng Số 1 Việt Nam" },
        titleLine1: { type: String, default: "Khám Phá Nơi Biến" },
        titleHighlight: { type: String, default: "Vật Liệu Tháo Dỡ" },
        titleLine2: { type: String, default: "Thành Tài Nguyên Tái Sinh" },
        subtitle: {
          type: String,
          default:
            "Kết nối trực tiếp Nhà A (cần giải phóng mặt bằng, thừa xà bần, gạch, sắt thép tháo dỡ) với Nhà B (đang xây dựng cần mua rẻ hoặc nhận vật liệu miễn phí) theo bán kính định vị GPS gần bạn nhất.",
        },
        imageUrl: {
          type: String,
          default: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
        },
        youtubeVideoUrl: {
          type: String,
          default: "https://www.youtube-nocookie.com/embed/h9MbznbxlLc?autoplay=1",
        },
        highlights: {
          type: [String],
          default: ["Cho nhận 0đ & Bán rẻ", "Radar GPS bán kính", "AI bóc tách tự động"],
        },
      },
      about: {
        badge: { type: String, default: "Cân Bằng Sinh Thái & Kinh Tế" },
        title: { type: String, default: "Giải Pháp Tuần Hoàn Tài Nguyên Xây Dựng Số 1" },
        descShort: {
          type: String,
          default:
            "MatGreen sinh ra để nối liền khoảng cách giữa người thừa không biết bỏ đâu và người thiếu không biết tìm ở đâu.",
        },
        descLong: {
          type: String,
          default:
            "Tại các đô thị lớn, hàng ngàn ngôi nhà đập đi mỗi ngày tạo ra lượng xà bần khổng lồ gây áp lực lên bãi rác và môi trường. Trong khi đó, ngay tại các phường xã lân cận, nhiều gia đình đang cần đôn nền, làm nhà tạm, lót sân mà phải mua cát đá mới với giá đắt đỏ. Chúng tôi ứng dụng công nghệ định vị và mạng lưới vận chuyển địa phương để giải quyết bài toán này trong 15 phút.",
        },
        imageUrl: {
          type: String,
          default: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=1000&q=80",
        },
        statNumber: { type: String, default: "15k" },
        statLabel: { type: String, default: "Tấn phế thải Được tái sinh mỗi ngày" },
        benefits: {
          type: [String],
          default: [
            "Tiết kiệm 100% chi phí đổ xà bần",
            "Minh bạch tọa độ vị trí công trình qua GPS",
            "Xác thực chéo ảnh hiện trường công trường",
            "Kết nối xe ba gác & xe tải chở hàng siêu tốc",
            "Trợ lý AI bóc tách khối lượng và phân loại",
            "Chung tay vì mục tiêu Net Zero & Giảm rác thải",
          ],
        },
        founderName: { type: String, default: "Nguyễn Văn Quân" },
        founderRole: { type: String, default: "Nhà Sáng Lập & Kỹ Sư Hệ Thống" },
        founderAvatar: {
          type: String,
          default: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        },
      },
      services: {
        badge: { type: String, default: "Dịch Vụ Tuần Hoàn Toàn Diện" },
        title: { type: String, default: "Giải Pháp MatGreen Cung Cấp" },
        desc: {
          type: String,
          default:
            "Hỗ trợ toàn diện từ khâu khảo sát, định vị GPS, bóc tách khối lượng đến điều phối đội xe vận chuyển tận chân công trình.",
        },
        items: {
          type: [serviceItemSchema],
          default: [
            {
              title: "Điều Phối Xà Bần & Tôn Nền",
              desc: "Giải phóng hàng trăm tấn gạch vỡ, bê tông và vữa cũ từ công trình đập phá đến các dự án san lấp mặt bằng trong bán kính 5km.",
              image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
              tag: "Miễn Phí / Giá Rẻ",
              link: "/dashboard?category=Gạch & Bê tông",
            },
            {
              title: "Thu Hồi Nhôm Kính & Sắt Thép",
              desc: "Bảo toàn nguyên vẹn khung cửa nhôm Xingfa, cửa sắt lùa và xà gồ thép chữ C để gia chủ thu hồi vốn tới 40% chi phí tháo dỡ.",
              image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
              tag: "Thanh Lý Thu Vốn",
              link: "/dashboard?category=Sắt thép",
            },
            {
              title: "Tái Sinh Gỗ Cốp Pha & Ván Sàn",
              desc: "Gỗ cốp pha phủ phim, xà gồ gỗ thông và ván ép còn tái sử dụng được luân chuyển ngay cho các đội thợ làm nhà tạm, bồn cây.",
              image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80",
              tag: "Tuần Hoàn Gỗ",
              link: "/dashboard?category=Gỗ & Ván cốp pha",
            },
            {
              title: "Trợ Lý Bóc Tách Tự Động AI",
              desc: "Chụp một bức ảnh công trường đập phá, AI Advisor sẽ tự động nhận diện chủng loại vật liệu, ước tính khối lượng và gợi ý giá thanh lý.",
              image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
              tag: "Công Nghệ Độc Quyền",
              link: "/ai-advisor",
            },
          ],
        },
      },
      whyChoose: {
        badge: { type: String, default: "Lợi Thế Vượt Trội" },
        title: { type: String, default: "Vì Sao Hàng Ngàn Chủ Thầu Tin Chọn?" },
        desc: {
          type: String,
          default:
            "Chúng tôi kết hợp sức mạnh của Bản đồ GIS định vị, Thuật toán tối ưu quãng đường và Trợ lý thị giác AI để giải quyết triệt để vấn đề rác thải xây dựng cồng kềnh tại Việt Nam.",
        },
        bgImageUrl: {
          type: String,
          default: "https://res.cloudinary.com/dwcuijzvd/image/upload/v1792728313/finance-lite/banners/mat-mvkg5d78-9782a01c0068.jpg",
        },
        items: {
          type: [featureItemSchema],
          default: [
            {
              title: "Định Vị Radar Bán Kính Siêu Tốc",
              desc: "Chỉ cần chọn bán kính 3km, 5km hoặc 10km, hệ thống tự động quét và lọc mọi nguồn vật liệu tháo dỡ đang có sẵn xung quanh bạn.",
            },
            {
              title: "Tiết Kiệm Tới 40% Chi Phí Vật Tư",
              desc: "Nhà B có thể mua được sắt thép, ván cốp pha, cửa nhôm kính chất lượng cao với giá rẻ hơn 40% hoặc nhận gạch xà bần hoàn toàn 0 đồng.",
            },
            {
              title: "Giảm 80% Phế Thải Ra Môi Trường",
              desc: "Thay vì đổ trộm xà bần ra vỉa hè hay bờ sông, tài nguyên được tuần hoàn ngay lập tức cho các công trình san lấp và tôn nền.",
            },
            {
              title: "Giao Dịch An Toàn & Minh Bạch GPS",
              desc: "Mọi bài đăng đều phải xác thực tọa độ GPS thật qua trình duyệt. Không lo tin ảo, tin môi giới trung gian ăn chênh lệch.",
            },
          ],
        },
      },
      gallery: {
        badge: { type: String, default: "Minh Bạch Hiện Trường 100%" },
        title: { type: String, default: "Thư Viện Công Trình Đã Kết Nối Thành Công" },
        desc: {
          type: String,
          default:
            "Mỗi hình ảnh trên MatGreen đều được đính kèm tọa độ GPS và thời điểm chụp thực tế tại công trường. Nói không với ảnh mạng và tin ảo.",
        },
        items: {
          type: [galleryItemSchema],
          default: [
            {
              image: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=800&q=80",
              title: "Công trình tháo dỡ nhà phố Hoàng Mai",
              tag: "Thu hồi gạch cổ",
            },
            {
              image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
              title: "Bốc dỡ sắt hộp & xà gồ C tại Cầu Giấy",
              tag: "Tái sử dụng thép",
            },
            {
              image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
              title: "Tập kết cửa nhôm Xingfa còn mới 95%",
              tag: "Thanh lý cửa",
            },
            {
              image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
              title: "Điều xe tải chở ván cốp pha tôn móng",
              tag: "Logistics xanh",
            },
          ],
        },
      },
      stats: {
        bgImageUrl: { type: String, default: "/assets/images/shapes/funfact-bg-3.jpg" },
        items: {
          type: [statItemSchema],
          default: [
            { num: "28+", label: "Quận/Huyện Phủ Sóng", sub: "Hà Nội, TP.HCM & Đà Nẵng" },
            { num: "5.200+", label: "Tấn Vật Liệu Tái Sinh", sub: "Gạch, bê tông, sắt thép, gỗ" },
            { num: "1.450+", label: "Công Trình Đã Kết Nối", sub: "Nhà phố, biệt thự & dự án" },
            { num: "98.6%", label: "Đánh Giá 5 Sao Hài Lòng", sub: "Từ chủ nhà & đội thợ thi công" },
          ],
        },
      },
      offers: {
        card1: {
          type: offerCardSchema,
          default: {
            badge: "Miễn Phí 100% (0đ)",
            title: "Nhận Vật Liệu Thừa Cho & Tặng Công Trình",
            desc: "Hàng ngàn tấn xà bần, gạch cũ nguyên vẹn, ván cốp pha và đất đá tôn nền từ các công trình đập phá đang chờ bạn đến chở miễn phí.",
            bgImage: "/assets/images/backgrounds/offer-1-1-bg.png",
            shapeImage: "/assets/images/shapes/offer-s-1-1.png",
            buttonText: "Tìm Tin Cho Tặng Gần Bạn",
            buttonLink: "/dashboard?type=free",
            subText: "Tự điều xe chở",
          },
        },
        card2: {
          type: offerCardSchema,
          default: {
            badge: "Tiết Kiệm Tới 40%",
            title: "Thanh Lý Kho & Thu Hồi Vốn Tháo Dỡ",
            desc: "Sắt hộp, xà gồ thép, cửa nhôm kính Xingfa và thiết bị vệ sinh tháo dỡ còn đẹp 85-95% với mức giá chỉ bằng một nửa vật liệu mới.",
            bgImage: "/assets/images/backgrounds/offer-1-2-bg.png",
            shapeImage: "/assets/images/shapes/offer-s-1-1.png",
            buttonText: "Xem Vật Tư Thanh Lý",
            buttonLink: "/dashboard?type=sell",
            subText: "Bốc dỡ ngay tại bãi",
          },
        },
      },
      products: {
        badge: { type: String, default: "Nguồn Cung Cập Nhật Mới Nhất" },
        title: { type: String, default: "Vật Liệu Đang Chờ Bốc Dỡ" },
        desc: {
          type: String,
          default: "Xem nhanh các lô vật liệu tháo dỡ còn nguyên vẹn trong khu vực bạn sinh sống và làm việc.",
        },
        items: {
          type: [productSampleSchema],
          default: [
            {
              id: "mat-prod-1",
              title: "Gạch Đỏ Đặc Cũ Tháo Dỡ Nhà Phố",
              category: "Gạch & Bê tông",
              price: "0đ (Cho Tặng)",
              isFree: true,
              unit: "viên",
              distance: "1.2 km",
              address: "Đống Đa, Hà Nội",
              image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80",
              rating: 5,
            },
            {
              id: "mat-prod-2",
              title: "Sắt Hộp 40x80 & Xà Gồ Mạ Kẽm 1.8mm",
              category: "Sắt thép",
              price: "45.000đ",
              isFree: false,
              unit: "cây",
              distance: "2.8 km",
              address: "Thanh Xuân, Hà Nội",
              image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
              rating: 5,
            },
            {
              id: "mat-prod-3",
              title: "Bộ Cửa Đi Nhôm Kính Xingfa 4 Cánh",
              category: "Cửa & Nhôm kính",
              price: "1.800.000đ",
              isFree: false,
              unit: "bộ",
              distance: "3.5 km",
              address: "Cầu Giấy, Hà Nội",
              image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80",
              rating: 5,
            },
            {
              id: "mat-prod-4",
              title: "Ván Cốp Pha Phủ Phim 15mm Còn Đẹp",
              category: "Gỗ & Ván sàn",
              price: "60.000đ",
              isFree: false,
              unit: "tấm",
              distance: "4.1 km",
              address: "Nam Từ Liêm, Hà Nội",
              image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80",
              rating: 5,
            },
          ],
        },
      },
      newsSection: {
        badge: { type: String, default: "Cẩm Nang & Xu Hướng" },
        title: { type: String, default: "Tin Tức & Bài Viết Mới Nhất" },
        desc: {
          type: String,
          default:
            "Cập nhật xu hướng kinh tế tuần hoàn, kinh nghiệm tháo dỡ công trình và giải pháp xử lý phế phẩm xây dựng tối ưu.",
        },
      },
    },

    // 2. CẤU HÌNH TRANG GIỚI THIỆU (About Page)
    aboutPage: {
      header: {
        title: { type: String, default: "Về Dự Án MatGreen" },
        subtitle: { type: String, default: "Sàn Kết Nối & Tái Sử Dụng Vật Liệu Tháo Dỡ Toàn Quốc" },
        bgImageUrl: {
          type: String,
          default: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=1920&q=80",
        },
      },
      story: {
        badge: { type: String, default: "Sứ Mệnh Xanh" },
        title: { type: String, default: "Tái Sinh Tài Nguyên Tháo Dỡ Vì Một Đô Thị Không Rác Thải" },
        desc1: {
          type: String,
          default:
            "Mỗi năm tại Việt Nam có hàng chục triệu tấn vật liệu xây dựng bị chôn lấp lãng phí, trong khi hàng ngàn công trình khác lại khai thác cạn kiệt tài nguyên mới.",
        },
        desc2: {
          type: String,
          default:
            "MatGreen ra đời từ mong muốn ứng dụng công nghệ định vị bán kính để biến 'rác của người này thành vàng của người khác'. Chúng tôi giúp các gia chủ sắp đập phá nhà tìm được những người đang cần vật liệu ngay trong khu vực lân cận, giúp tiết kiệm chi phí bốc dỡ và bảo vệ cảnh quan đô thị.",
        },
        image1: {
          type: String,
          default: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
        },
        image2: {
          type: String,
          default: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
        },
      },
      steps: {
        badge: { type: String, default: "Quy Trình Hoạt Động" },
        title: { type: String, default: "Tuần Hoàn Vật Liệu Trong 4 Bước" },
        items: {
          type: [stepItemSchema],
          default: [
            {
              num: "01",
              title: "Chụp Ảnh & Định Vị GPS",
              desc: "Gia chủ hoặc đội thợ nhà A chụp 2-3 tấm ảnh đống vật liệu thừa, bấm lấy vị trí GPS hiện tại trên công trường.",
            },
            {
              num: "02",
              title: "AI Bóc Tách & Kích Hoạt Radar",
              desc: "Hệ thống tự động phân loại xà bần, gạch, sắt thép và thông báo ngay đến các công trình trong bán kính 3-10km.",
            },
            {
              num: "03",
              title: "Kết Nối Đôi Bên Trực Tiếp",
              desc: "Nhà B xem ảnh thật, liên hệ gọi điện hoặc chat qua MatGreen để chốt khối lượng và hẹn giờ bốc dỡ.",
            },
            {
              num: "04",
              title: "Giải Phóng Mặt Bằng 0 Đồng",
              desc: "Mặt bằng nhà A được dọn sạch tinh tươm. Nhà B có vật liệu tôn nền giá rẻ, giảm thiểu phế thải đổ trộm.",
            },
          ],
        },
      },
    },

    // 3. CẤU HÌNH TRANG LIÊN HỆ (Contact Page)
    contactPage: {
      header: {
        title: { type: String, default: "Liên Hệ Đội Ngũ MatGreen" },
        subtitle: { type: String, default: "Hỗ Trợ Nhanh Chóng 24/7 - Giải Phóng Mặt Bằng Siêu Tốc" },
        bgImageUrl: {
          type: String,
          default: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=1600&q=80",
        },
      },
      opening: {
        badge: { type: String, default: "Điều Phối Siêu Tốc" },
        title: { type: String, default: "Thời Gian Tiếp Nhận & Hỗ Trợ" },
        weekdayHours: { type: String, default: "07:00 Sáng – 19:00 Tối" },
        sundayHours: { type: String, default: "08:00 Sáng – 16:00 Chiều" },
        hotlineNote: { type: String, default: "Hỗ trợ điều phối xe ba gác & xe tải 24/7" },
        slaText: { type: String, default: "SLA phản hồi trong 15 phút" },
      },
    },

    // 4. CẤU HÌNH TRANG DỊCH VỤ (Services Page)
    servicesPage: {
      header: {
        title: { type: String, default: "Dịch Vụ & Giải Pháp Toàn Diện" },
        subtitle: { type: String, default: "Kết Nối Xuyên Suốt Vòng Đời Vật Liệu Xây Dựng Đô Thị" },
        bgImageUrl: {
          type: String,
          default: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=1920&q=80",
        },
      },
      packages: {
        items: {
          type: [packageItemSchema],
          default: [
            {
              name: "Gia Chủ / Cá Nhân (Nhà A)",
              target: "Dành cho nhà sắp sửa chữa, đập phá",
              price: "0đ",
              period: "Miễn phí vĩnh viễn",
              badge: "Phổ Biến Nhất",
              highlight: true,
              features: [
                "Đăng tin cho tặng / thanh lý không giới hạn",
                "Tự động định vị GPS công trình chính xác",
                "Trợ lý AI bóc tách khối lượng tự động",
                "Hiển thị trên bản đồ Radar bán kính",
                "Chat thời gian thực & gọi điện trực tiếp",
              ],
              btnText: "Đăng Tin Miễn Phí",
              btnLink: "/post",
            },
            {
              name: "Nhà Thầu / Đội Thợ (Nhà B)",
              target: "Dành cho đội thi công, hoàn thiện",
              price: "0đ",
              period: "Miễn phí trải nghiệm",
              badge: "Tiết Kiệm Chi Phí",
              highlight: false,
              features: [
                "Quét radar tìm vật liệu trong bán kính 20km",
                "Lọc danh mục gạch, sắt thép, gỗ, cát đá",
                "Lưu tin yêu thích để theo dõi công trình",
                "Xem ảnh hiện trường đã kiểm định GPS",
                "Nhận thông báo khi có nguồn cung mới",
              ],
              btnText: "Mở Radar Quét Ngay",
              btnLink: "/dashboard",
            },
            {
              name: "Đội Xe / Đối Tác Logistics",
              target: "Dành cho tài xế xe tải & ba gác",
              price: "Liên hệ",
              period: "Hợp tác đối tác",
              badge: "Thu Nhập Cao",
              highlight: false,
              features: [
                "Nhận đơn chở hàng cự ly ngắn 3-10km",
                "Hỗ trợ ghép chuyến tăng thu nhập mỗi ngày",
                "Tích hợp danh bạ đội xe trên hệ thống",
                "Quyền lợi đối tác vận chuyển ưu tiên",
              ],
              btnText: "Đăng Ký Đội Xe",
              btnLink: "/contact",
            },
          ],
        },
      },
      faqs: {
        items: {
          type: [faqItemSchema],
          default: [
            {
              q: "Đăng tin cho tặng vật liệu (Nhà A) có mất phí dịch vụ không?",
              a: "Hoàn toàn miễn phí 100%. MatGreen không thu bất kỳ khoản phí nào khi bạn đăng tin cho tặng xà bần hoặc thanh lý vật liệu cũ.",
            },
            {
              q: "Ai sẽ là người chịu trách nhiệm vận chuyển vật liệu?",
              a: "Thông thường, bên nhận (Nhà B) hoặc đội thợ sẽ tự điều xe ba gác, xe tải đến bốc dỡ và chở đi theo thỏa thuận trực tiếp giữa 2 bên.",
            },
            {
              q: "Làm sao để biết vật liệu đăng trên sàn có thật hay không?",
              a: "MatGreen yêu cầu mọi bài đăng phải có ảnh chụp thực tế tại công trình (được lưu trữ trên Cloudinary), kèm tọa độ GPS và số điện thoại, Zalo chính chủ.",
            },
            {
              q: "Trợ lý AI bóc tách khối lượng có chính xác không?",
              a: "Mô hình AI của MatGreen được huấn luyện dựa trên định mức xây dựng Việt Nam, độ chính xác đạt khoảng 85-92% đối với các công trình nhà phố, nhà cấp 4 và biệt thự.",
            },
          ],
        },
      },
    },

    // 5. CẤU HÌNH TRANG TIN TỨC (News Page)
    newsPage: {
      header: {
        title: { type: String, default: "Tin Tức & Cẩm Nang Tái Sinh Vật Liệu" },
        subtitle: {
          type: String,
          default:
            "Nơi chia sẻ kiến thức thực tế về tháo dỡ công trình, kỹ thuật thu hồi vật tư nguyên vẹn và các giải pháp xây dựng bền vững vì môi trường.",
        },
        bgImageUrl: {
          type: String,
          default: "/assets/images/backgrounds/page-header-bg-1-1.jpg",
        },
      },
    },
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model("SiteConfig", siteConfigSchema);

