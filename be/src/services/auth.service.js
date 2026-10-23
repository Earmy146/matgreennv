const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const emailService = require("./email.service");
const env = require("../config/env");
const {
  BadRequestError,
  AuthFailureError,
  ConflictRequestError,
  NotFoundError,
} = require("../core/error.response");

class AuthService {
  /**
   * Tạo mã OTP ngẫu nhiên 6 chữ số
   */
  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Đăng ký tài khoản mới & gửi mã xác thực qua Gmail (SMTP)
   */
  async register({ name, email, password, phone, address }) {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });

    // Nếu tài khoản đã tồn tại và đã xác thực thành công
    if (existing && existing.isVerified) {
      throw new ConflictRequestError("Email này đã được đăng ký trên hệ thống");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    let user;
    if (existing && !existing.isVerified) {
      // Cập nhật lại thông tin và gửi lại OTP nếu trước đó chưa xác thực
      existing.name = name;
      existing.password = hashedPassword;
      existing.phone = phone || existing.phone;
      existing.address = address || existing.address;
      existing.verificationOtp = { code: otpCode, expiresAt };
      user = await existing.save();
    } else {
      user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        address,
        isVerified: false,
        verificationOtp: {
          code: otpCode,
          expiresAt,
        },
      });
    }

    // Gửi email chứa OTP qua SMTP
    await emailService.sendVerificationOtp({
      toEmail: user.email,
      otpCode,
      userName: user.name,
    });

    return {
      email: user.email,
      needVerify: true,
      message: "Mã OTP 6 số đã được gửi tới Gmail của bạn để xác thực",
    };
  }

  /**
   * Xác thực mã OTP để kích hoạt tài khoản
   */
  async verifyEmail({ email, otp }) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new NotFoundError("Không tìm thấy thông tin tài khoản");
    }

    if (user.isVerified) {
      const token = this.generateToken(user);
      return {
        user: this.sanitizeUser(user),
        token,
        message: "Tài khoản này đã được xác thực trước đó",
      };
    }

    const { code, expiresAt } = user.verificationOtp || {};
    if (!code || code !== String(otp).trim()) {
      throw new BadRequestError("Mã OTP không chính xác");
    }

    if (new Date() > new Date(expiresAt)) {
      throw new BadRequestError("Mã OTP đã hết hạn (chỉ có hiệu lực trong 10 phút). Vui lòng yêu cầu gửi lại mã mới.");
    }

    // Kích hoạt tài khoản thành công
    user.isVerified = true;
    user.verificationOtp = undefined;
    await user.save();

    const token = this.generateToken(user);
    return {
      user: this.sanitizeUser(user),
      token,
      message: "Xác thực tài khoản thành công! Chào mừng bạn đến với MatGreen.",
    };
  }

  /**
   * Gửi lại mã OTP xác thực
   */
  async resendOtp({ email }) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new NotFoundError("Không tìm thấy tài khoản với email này");
    }

    if (user.isVerified) {
      throw new BadRequestError("Tài khoản này đã được xác thực, bạn có thể đăng nhập ngay.");
    }

    const otpCode = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationOtp = { code: otpCode, expiresAt };
    await user.save();

    await emailService.sendVerificationOtp({
      toEmail: user.email,
      otpCode,
      userName: user.name,
    });

    return {
      email: user.email,
      message: "Mã OTP mới đã được gửi lại vào hòm thư Gmail của bạn",
    };
  }

  /**
   * Đăng nhập tài khoản
   */
  async login({ email, password }) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new AuthFailureError("Email hoặc mật khẩu không chính xác");
    }

    async updateProfile(userId, { name, phone, address, bio }) {
      const updates = {};
      if (typeof name === "string" && name.trim()) updates.name = name.trim();
      if (typeof phone === "string") updates.phone = phone.trim();
      if (typeof address === "string") updates.address = address.trim();
      if (typeof bio === "string") updates.bio = bio.trim().slice(0, 500);

      if (!Object.keys(updates).length) {
        throw new BadRequestError("Vui lòng nhập ít nhất một thông tin cần cập nhật");
      }

      const user = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
      });
      if (!user) throw new NotFoundError("Không tìm thấy tài khoản");
      return this.sanitizeUser(user);
    }

    async changePassword(userId, { currentPassword, newPassword }) {
      if (!currentPassword || !newPassword || newPassword.length < 8) {
        throw new BadRequestError("Mật khẩu mới phải có ít nhất 8 ký tự");
      }
      const user = await User.findById(userId);
      if (!user) throw new NotFoundError("Không tìm thấy tài khoản");
      if (!(await bcrypt.compare(currentPassword, user.password))) {
        throw new AuthFailureError("Mật khẩu hiện tại không chính xác");
      }
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      return { message: "Đổi mật khẩu thành công" };
    }

    async forgotPassword({ email }) {
      const normalizedEmail = email.toLowerCase().trim();
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) throw new NotFoundError("Không tìm thấy tài khoản với email này");
      const otpCode = this.generateOtp();
      user.resetPasswordOtp = { code: otpCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
      await user.save();
      await emailService.sendPasswordResetOtp({ toEmail: user.email, otpCode, userName: user.name });
      return { email: user.email, message: "Mã OTP đặt lại mật khẩu đã được gửi tới email của bạn" };
    }

    async resetPassword({ email, otp, newPassword }) {
      if (!newPassword || newPassword.length < 8) {
        throw new BadRequestError("Mật khẩu mới phải có ít nhất 8 ký tự");
      }
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) throw new NotFoundError("Không tìm thấy tài khoản");
      const reset = user.resetPasswordOtp || {};
      if (!reset.code || reset.code !== String(otp).trim()) throw new BadRequestError("Mã OTP không chính xác");
      if (!reset.expiresAt || new Date() > new Date(reset.expiresAt)) {
        throw new BadRequestError("Mã OTP đã hết hạn, vui lòng yêu cầu mã mới");
      }
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordOtp = undefined;
      await user.save();
      return { message: "Đặt lại mật khẩu thành công" };
    }

    async requestPhoneVerification(userId, note) {
      const user = await User.findById(userId);
      if (!user) throw new NotFoundError("Không tìm thấy tài khoản");
      if (!user.phone) throw new BadRequestError("Vui lòng cập nhật số điện thoại trước");
      if (user.phoneVerified) throw new BadRequestError("Số điện thoại đã được xác minh");
      user.phoneVerificationRequestedAt = new Date();
      user.phoneVerificationNote = typeof note === "string" ? note.trim().slice(0, 500) : undefined;
      await user.save();
      return this.sanitizeUser(user);
    }

    async publicProfile(userId) {
      const user = await User.findById(userId).select("name email phone address avatar bio phoneVerified role createdAt");
      if (!user) throw new NotFoundError("Không tìm thấy người dùng");
      return this.sanitizeUser(user);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthFailureError("Email hoặc mật khẩu không chính xác");
    }

    // Kiểm tra tài khoản đã kích hoạt qua Gmail chưa
    if (!user.isVerified) {
      const otpCode = this.generateOtp();
      user.verificationOtp = {
        code: otpCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      };
      await user.save();

      await emailService.sendVerificationOtp({
        toEmail: user.email,
        otpCode,
        userName: user.name,
      });

      return {
        needVerify: true,
        email: user.email,
        message: "Tài khoản của bạn chưa được xác thực. Chúng tôi đã gửi lại mã OTP tới Gmail của bạn.",
      };
    }

    const token = this.generateToken(user);
    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  generateToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );
  }

  sanitizeUser(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
      avatar: user.avatar,
      phoneVerified: user.phoneVerified,
      role: user.role,
      isVerified: user.isVerified,
    };
  }
}

module.exports = new AuthService();
