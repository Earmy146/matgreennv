require("dotenv").config();
const connectDB = require("../src/config/db");
const authService = require("../src/services/auth.service");
const User = require("../src/models/user.model");

async function runAuthFlowTest() {
  console.log("🚀 Bắt đầu kiểm thử luồng Đăng ký - Xác thực Gmail OTP - Đăng nhập...");

  await connectDB();

  const testEmail = "test_developer_" + Date.now() + "@gmail.com";
  const testPassword = "MatGreenPassword@123";
  const testName = "Nguyễn Văn Test";

  console.log(`\n1️⃣ Bước 1: Đăng ký tài khoản mới [${testEmail}]`);
  const registerResult = await authService.register({
    name: testName,
    email: testEmail,
    password: testPassword,
    phone: "0912345678",
    address: "Hà Nội",
  });
  console.log("   Kết quả đăng ký:", registerResult);

  // Tìm user trong database để lấy mã OTP vừa được tạo
  const createdUser = await User.findOne({ email: testEmail });
  if (!createdUser) {
    throw new Error("Không tìm thấy user trong database sau khi đăng ký");
  }
  const otpCode = createdUser.verificationOtp?.code;
  console.log(`\n2️⃣ Bước 2: Kiểm tra OTP trong Database & Hộp thư:`);
  console.log(`   👉 Mã OTP tạo ra: [ ${otpCode} ] (Hạn: ${createdUser.verificationOtp?.expiresAt})`);
  console.log(`   👉 Trạng thái isVerified hiện tại: [ ${createdUser.isVerified} ]`);

  console.log(`\n3️⃣ Bước 3: Thử đăng nhập khi CHƯA xác thực OTP (Kỳ vọng: needVerify = true)`);
  const preVerifyLogin = await authService.login({
    email: testEmail,
    password: testPassword,
  });
  console.log("   Kết quả đăng nhập trước kích hoạt:", preVerifyLogin);
  if (!preVerifyLogin.needVerify) {
    throw new Error("Lỗi: Tài khoản chưa kích hoạt nhưng lại cho phép đăng nhập!");
  }

  // Lấy mã OTP mới nhất sau khi đăng nhập trigger gửi lại mã
  const updatedUser = await User.findOne({ email: testEmail });
  const latestOtpCode = updatedUser.verificationOtp?.code;
  console.log(`\n4️⃣ Bước 4: Thực hiện xác thực OTP bằng mã mới nhất [${latestOtpCode}]`);
  const verifyResult = await authService.verifyEmail({
    email: testEmail,
    otp: latestOtpCode,
  });
  console.log("   Kết quả xác thực OTP:", {
    user: verifyResult.user,
    hasToken: Boolean(verifyResult.token),
    message: verifyResult.message,
  });

  if (!verifyResult.user.isVerified) {
    throw new Error("Lỗi: Sau khi xác thực, isVerified vẫn là false!");
  }

  console.log(`\n5️⃣ Bước 5: Đăng nhập chính thức sau khi tài khoản đã xác thực`);
  const loginResult = await authService.login({
    email: testEmail,
    password: testPassword,
  });
  console.log("   Kết quả đăng nhập:", {
    userId: loginResult.user.id,
    userEmail: loginResult.user.email,
    isVerified: loginResult.user.isVerified,
    tokenPreview: loginResult.token.substring(0, 20) + "...",
  });

  // Dọn dẹp dữ liệu test
  await User.deleteOne({ email: testEmail });
  console.log(`\n🧹 Đã dọn dẹp dữ liệu tài khoản test.`);

  console.log("\n🎉 HOÀN TẤT KIỂM THỬ: Tính năng Đăng ký, Xác thực Gmail OTP và Đăng nhập hoạt động CHUẨN XÁC 100%!");
  process.exit(0);
}

runAuthFlowTest().catch((err) => {
  console.error("❌ Lỗi kiểm thử:", err);
  process.exit(1);
});
