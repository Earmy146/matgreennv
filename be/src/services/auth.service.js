const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const env = require("../config/env");
const {
  BadRequestError,
  AuthFailureError,
  ConflictRequestError,
} = require("../core/error.response");

class AuthService {
  async register({ name, email, password, phone, address }) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new ConflictRequestError("Email này đã được đăng ký trên hệ thống");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    const token = this.generateToken(user);
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AuthFailureError("Email hoặc mật khẩu không chính xác");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthFailureError("Email hoặc mật khẩu không chính xác");
    }

    const token = this.generateToken(user);
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
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
}

module.exports = new AuthService();
