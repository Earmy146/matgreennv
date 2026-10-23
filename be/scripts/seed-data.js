require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../src/config/db");
const User = require("../src/models/user.model");
const Material = require("../src/models/material.model");

async function seedData() {
  console.log("🌱 Bắt đầu quá trình SEED DỮ LIỆU THẬT vào MongoDB Atlas...");

  await connectDB();

  // 1. Dọn dẹp dữ liệu cũ nếu muốn làm mới (hoặc upsert)
  console.log("1️⃣ Chuẩn bị tài khoản người dùng...");
  const hashedPasswordAdmin = await bcrypt.hash("MatGreen@Admin2026", 10);
  const hashedPasswordUser = await bcrypt.hash("MatGreen@123456", 10);

  // Xóa tài khoản cũ nếu có để tạo lại chuẩn
  await User.deleteMany({
    email: {
      $in: [
        "admin@matgreen.vn",
        "nhaa.thao.do@gmail.com",
        "nhab.xaydung@gmail.com",
        "thothao.do.hanoi@gmail.com",
      ],
    },
  });

  const adminUser = await User.create({
    name: "Quản Trị Viên Hệ Thống",
    email: "admin@matgreen.vn",
    password: hashedPasswordAdmin,
    phone: "19008899",
    address: "Tòa nhà Sông Đà, Mỹ Đình, Nam Từ Liêm, Hà Nội",
    role: "admin",
    isVerified: true,
  });

  const userNhaA = await User.create({
    name: "Bác Ba Thợ Cả (Chủ Tháo Dỡ)",
    email: "nhaa.thao.do@gmail.com",
    password: hashedPasswordUser,
    phone: "0988776655",
    address: "Ngõ 175 Cầu Giấy, Hà Nội",
    role: "user",
    isVerified: true,
  });

  const userNhaB = await User.create({
    name: "Kỹ Sư Hoàng Nam (Bên Nhận)",
    email: "nhab.xaydung@gmail.com",
    password: hashedPasswordUser,
    phone: "0912345678",
    address: "KĐT Mỗ Lao, Hà Đông, Hà Nội",
    role: "user",
    isVerified: true,
  });

  const userTho = await User.create({
    name: "Đội Phá Dỡ & Vận Chuyển 247",
    email: "thothao.do.hanoi@gmail.com",
    password: hashedPasswordUser,
    phone: "0904112233",
    address: "Ngã Tư Sở, Đống Đa, Hà Nội",
    role: "user",
    isVerified: true,
  });

  console.log(`   ✅ Đã tạo thành công 4 tài khoản thật:`);
  console.log(`      - Admin: admin@matgreen.vn | MatGreen@Admin2026`);
  console.log(`      - Nhà A (Cho/Phá dỡ): nhaa.thao.do@gmail.com | MatGreen@123456`);
  console.log(`      - Nhà B (Nhận/Xây dựng): nhab.xaydung@gmail.com | MatGreen@123456`);
  console.log(`      - Đội Thợ: thothao.do.hanoi@gmail.com | MatGreen@123456`);

  // 2. Xóa các bài đăng cũ để nạp danh sách 15 tin đăng thực tế
  console.log("\n2️⃣ Khởi tạo 15 bài đăng vật liệu thật với tọa độ GPS tại Hà Nội...");
  await Material.deleteMany({});

  const realMaterials = [
    {
      title: "Tặng miễn phí 4 xe xà bần, vữa vụn gạch vỡ đập tường nhà phố",
      description: "Cải tạo nhà 4 tầng chia phòng trọ, cần giải phóng gấp khoảng 4 xe ba gác xà bần hạt trung thích hợp tôn nền xưởng, lấp ao móng. Miễn phí 100%, ai đến bốc tự chở đi sớm ưu tiên.",
      category: "xa_ban",
      type: "free",
      price: 0,
      unit: "xe ba gác",
      images: [
        "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      ],
      location: {
        type: "Point",
        coordinates: [105.7952, 21.0335], // Cầu Giấy
        address: "Ngõ 175 Đường Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội",
      },
      contactName: "Bác Ba Thợ Cả",
      contactPhone: "0988776655",
      contactZalo: "0988776655",
      contactHours: "7h00 - 18h30 hàng ngày, gọi trước 20 phút",
      status: "available",
      owner: userNhaA._id,
    },
    {
      title: "1.8 Tấn thép dầm sàn phi 14, 16, 18 tháo dỡ còn thẳng",
      description: "Đập bỏ nhà cấp 4 khung thép, thu hồi được gần 2 tấn thép xây dựng còn rất thẳng và đẹp, chưa bị rỉ sét sâu. Thanh lý giá rẻ cho anh em thợ làm xưởng cơ khí hoặc đổ móng phụ.",
      category: "sat_thep",
      type: "sell",
      price: 9500,
      unit: "kg",
      images: [
        "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=800&q=80",
      ],
      location: {
        type: "Point",
        coordinates: [105.8285, 21.0182], // Đống Đa
        address: "Số 82 Ngõ Chợ Khâm Thiên, Phường Trung Phụng, Quận Đống Đa, Hà Nội",
      },
      contactName: "Anh Dũng Thầu Xây",
      contactPhone: "0912345678",
      contactZalo: "0912345678",
      contactHours: "Cả ngày, xe tải 2.5T vào tận chân công trình",
      status: "available",
      owner: userTho._id,
    },
    {
      title: "Bộ 3 bộ cửa nhôm Xingfa hệ 55 (4 cánh mặt tiền & 2 cánh ban công)",
      description: "Chủ nhà thay đổi thiết kế sang cửa kính trượt tự động nên tháo ra thanh lý bộ cửa nhôm Xingfa nhập khẩu màu ghi xám, kính dán an toàn 8.38mm, phụ kiện Kinlong nguyên bộ.",
      category: "cua_kinh",
      type: "sell",
      price: 1850000,
      unit: "bộ",
      images: [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      ],
      location: {
        type: "Point",
        coordinates: [105.8423, 21.0315], // Ba Đình
        address: "Số 25 Phố Kim Mã, Phường Kim Mã, Quận Ba Đình, Hà Nội",
      },
      contactName: "Chị Lan Anh",
      contactPhone: "0904112233",
      contactZalo: "0904112233",
      contactHours: "Sau 17h hoặc Thứ 7 & Chủ Nhật",
      status: "available",
      owner: userNhaA._id,
    },
    {
      title: "Cho tặng ~3,000 viên gạch thẻ đỏ cổ tháo dỡ còn lành lặn",
      description: "Đập bỏ nhà biệt thự kiểu Pháp cũ, gạch đặc đỏ chất lượng nung đanh chắc, đã gõ bớt vữa xi măng. Tặng miễn phí cho ai cần xây tường rào, lát lối đi sân vườn biệt thự.",
      category: "gach_ngoi",
      type: "free",
      price: 0,
      unit: "viên",
      images: [
        "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
      ],
      location: {
        type: "Point",
        coordinates: [105.8192, 21.0605], // Tây Hồ
        address: "Đường Xuân Diệu, Phường Quảng An, Quận Tây Hồ, Hà Nội",
      },
      contactName: "Bác Hùng Kiến Trúc",
      contactPhone: "0977889900",
      contactZalo: "0977889900",
      contactHours: "8h00 - 17h00",
      status: "available",
      owner: userNhaA._id,
    },
    {
      title: "50 Tấm ván cốp pha phủ phim 15mm đã qua 2 nước đổ sàn",
      description: "Công trình vừa đổ xong dầm sàn tầng thượng, ván phim còn phẳng, mép chưa sứt mẻ nhiều, khổ 1220x2440mm. Bán rẻ cho đội thợ tiếp theo để đỡ mất công chuyển về kho.",
      category: "go_copha",
      type: "sell",
      price: 120000,
      unit: "tấm",
      images: [
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
      ],
      location: {
        type: "Point",
        coordinates: [105.7725, 21.0125], // Nam Từ Liêm
        address: "Đường Mễ Trì Hạ, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội",
      },
      contactName: "Anh Tuấn Đội Trưởng",
      contactPhone: "0982334455",
      contactZalo: "0982334455",
      contactHours: "Gặp trực tiếp tại chân công trình",
      status: "available",
      owner: userTho._id,
    },
    {
      title: "Thanh lý 2 bồn cầu liền khối Inax + 2 lavabo chân lửng còn mới 85%",
      description: "Khách sạn sửa chữa nâng cấp nội thất sang thiết bị thông minh, dỡ ra bộ sứ vệ sinh men nano sáng bóng, xả xoáy êm, nắp êm không nứt vỡ.",
      category: "thiet_bi_ve_sinh",
      type: "sell",
      price: 650000,
      unit: "bộ",
      images: [
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      ],
      location: {
        type: "Point",
        coordinates: [105.8542, 21.0285], // Hoàn Kiếm / Hai Bà Trưng
        address: "Phố Bà Triệu, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội",
      },
      contactName: "A. Quang Quản Lý",
      contactPhone: "0966554433",
      contactZalo: "0966554433",
      contactHours: "9h - 18h",
      status: "available",
      owner: userNhaA._id,
    },
    {
      title: "Cho 2 xe tải 5T bê tông đục tỉa làm kè ao hoặc lót đường tạm",
      description: "Đục sàn tầng hầm ra nhiều mảng bê tông khối đặc kích thước 20-50cm, cực kỳ phù hợp cho nhà vườn đắp bờ ao, kè sạt lở hoặc rải đường xe công trường chống lún.",
      category: "xa_ban",
      type: "free",
      price: 0,
      unit: "chuyến xe tải",
      images: [
        "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
      ],
      location: {
        type: "Point",
        coordinates: [105.7812, 20.9754], // Hà Đông
        address: "KĐT Văn Phú, Phường Phú La, Quận Hà Đông, Hà Nội",
      },
      contactName: "Kỹ Sư Nam",
      contactPhone: "0912345678",
      contactZalo: "0912345678",
      contactHours: "Sáng 7h - 11h, Chiều 13h30 - 17h",
      status: "available",
      owner: userNhaB._id,
    },
    {
      title: "Xà gồ thép C150x50 dày 1.8mm dài 6m (khoảng 35 cây)",
      description: "Dỡ xưởng may cũ, xà gồ mạ kẽm Hòa Phát còn rất cứng cáp, không bị rỉ mọt, lỗ bắt vít chuẩn. Giá thanh lý bằng 40% giá sắt mới đại lý.",
      category: "sat_thep",
      type: "sell",
      price: 180000,
      unit: "cây 6m",
      images: [
        "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
      ],
      location: {
        type: "Point",
        coordinates: [105.8115, 20.9982], // Thanh Xuân
        address: "Đường Nguyễn Trãi, Phường Thượng Đình, Quận Thanh Xuân, Hà Nội",
      },
      contactName: "Bác Ba Thợ Cả",
      contactPhone: "0988776655",
      contactZalo: "0988776655",
      contactHours: "Gọi trước để bảo vệ mở cổng kho",
      status: "available",
      owner: userNhaA._id,
    },
    {
      title: "Cho tặng 500 viên gạch hoa thông gió xi măng xám",
      description: "Tháo dỡ vách ngăn ban công, gạch thông gió bánh ú xi măng còn nguyên vẹn 90%, đã xếp gọn gàng thành từng chồng trước cửa nhà, ai cần ghé chở.",
      category: "gach_ngoi",
      type: "free",
      price: 0,
      unit: "viên",
      images: [
        "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
      ],
      location: {
        type: "Point",
        coordinates: [105.8012, 21.0452], // Cầu Giấy / Tây Hồ
        address: "Đường Hoàng Hoa Thám, Phường Bưởi, Quận Tây Hồ, Hà Nội",
      },
      contactName: "Cô Nga Chủ Nhà",
      contactPhone: "0934567890",
      contactZalo: "0934567890",
      contactHours: "Giờ hành chính",
      status: "available",
      owner: userNhaA._id,
    },
    {
      title: "Cửa cuốn Ausdoor tấm liền kéo tay 3.2m x 2.8m kèm khóa",
      description: "Trả mặt bằng cửa hàng kinh doanh, nhượng lại bộ cửa cuốn tôn lò xo Ausdoor kéo nhẹ nhàng, ray dẫn hướng và trục lò xo đầy đủ.",
      category: "cua_kinh",
      type: "sell",
      price: 1250000,
      unit: "bộ",
      images: [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      ],
      location: {
        type: "Point",
        coordinates: [105.8612, 21.0025], // Hai Bà Trưng / Hoàng Mai
        address: "Phố Minh Khai, Phường Vĩnh Tuy, Quận Hai Bà Trưng, Hà Nội",
      },
      contactName: "Anh Thắng",
      contactPhone: "0944332211",
      contactZalo: "0944332211",
      contactHours: "Cả ngày",
      status: "available",
      owner: userTho._id,
    },
    {
      title: "Bồn nước Inox Sơn Hà 1500L ngang còn sáng loáng",
      description: "Nhà lắp hệ thống nước nóng năng lượng mặt trời dung tích lớn nên thanh lý bồn Inox 304 Sơn Hà, không rò rỉ, chân đế sắt V mạ kẽm chắc chắn.",
      category: "thiet_bi_ve_sinh",
      type: "sell",
      price: 1600000,
      unit: "chiếc",
      images: [
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      ],
      location: {
        type: "Point",
        coordinates: [105.8345, 21.0112], // Đống Đa
        address: "Đường Xã Đàn, Phường Nam Đồng, Quận Đống Đa, Hà Nội",
      },
      contactName: "Bác Ba Thợ Cả",
      contactPhone: "0988776655",
      contactZalo: "0988776655",
      contactHours: "Gặp xem bồn tại tầng thượng",
      status: "available",
      owner: userNhaA._id,
    },
    {
      title: "Cho tặng 1 xe tải đất cát đào móng sạch không lẫn rác",
      description: "Đào hố móng nhà dân, dư khoảng 1 xe tải đất đồi pha cát vàng rất mịn, phù hợp cho ai làm vườn cây cảnh, trồng rau sân thượng hoặc san nền.",
      category: "xa_ban",
      type: "free",
      price: 0,
      unit: "xe tải 2.5T",
      images: [
        "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
      ],
      location: {
        type: "Point",
        coordinates: [105.7612, 20.9854], // Hà Đông
        address: "KĐT Dương Nội, Phường Dương Nội, Quận Hà Đông, Hà Nội",
      },
      contactName: "Kỹ Sư Hoàng Nam",
      contactPhone: "0912345678",
      contactZalo: "0912345678",
      contactHours: "Gọi trước 30 phút để xe múc hỗ trợ xúc lên thùng",
      status: "available",
      owner: userNhaB._id,
    },
  ];

  await Material.insertMany(
    realMaterials.map((material) => ({
      ...material,
      location: {
        ...material.location,
        source: "seed",
        verificationStatus: "unverified",
      },
    }))
  );
  console.log(`   ✅ Đã seed thành công ${realMaterials.length} bài đăng vật liệu thật vào MongoDB Atlas!`);

  console.log("\n🎉 HOÀN TẤT SEED DỮ LIỆU: Toàn bộ database đã sẵn sàng cho trải nghiệm thực tế 100%!");
  process.exit(0);
}

seedData().catch((err) => {
  console.error("❌ Lỗi khi seed dữ liệu:", err);
  process.exit(1);
});
