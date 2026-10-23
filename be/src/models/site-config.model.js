const mongoose = require("mongoose");

const officeSchema = new mongoose.Schema({
  city: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
}, { _id: false });

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  bio: { type: String, required: true },
}, { _id: false });

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  website: { type: String, default: "" },
}, { _id: false });

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  quote: { type: String, required: true },
  rating: { type: Number, default: 5 },
  avatar: { type: String, required: true },
  projectImage: { type: String, default: "" },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteConfig", siteConfigSchema);
