const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

const log = logger.child({ component: "email-service" });

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  initTransporter() {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT) || 587;
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
      });
      log.info(`SMTP Transporter đã cấu hình cho: ${user} (${host}:${port})`);
    } else {
      log.warn(
        "Chưa điền SMTP_USER / SMTP_PASS trong .env. Email sẽ chạy ở chế độ giả lập (OTP in ra console)."
      );
    }
  }

  /**
   * Gửi email mã OTP xác thực tài khoản khi đăng ký
   */
  async sendVerificationOtp({ toEmail, otpCode, userName = "Bạn" }) {
    const from =
      process.env.SMTP_FROM ||
      '"MatGreen - Vật Liệu Tuần Hoàn" <no-reply@matgreen.vn>';

    const subject = `[MatGreen] Mã xác thực đăng ký tài khoản: ${otpCode}`;

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">MatGreen</h1>
          <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">Nền tảng kết nối & tái sử dụng vật liệu xây dựng tháo dỡ</p>
        </div>
        
        <div style="padding: 32px 28px;">
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Xin chào ${userName},</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Cảm ơn bạn đã tham gia cộng đồng <strong>MatGreen</strong>. Để hoàn tất việc kích hoạt tài khoản của bạn, vui lòng nhập mã xác thực OTP 6 số dưới đây:
          </p>

          <div style="margin: 28px 0; text-align: center;">
            <span style="display: inline-block; padding: 14px 32px; background-color: #ecfdf5; border: 2px dashed #10b981; border-radius: 12px; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #047857; font-family: monospace;">
              ${otpCode}
            </span>
          </div>

          <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
            ⏳ Mã OTP này có hiệu lực trong vòng <strong>10 phút</strong>. Vì lý do bảo mật, vui lòng không chia sẻ mã này cho bất kỳ ai.
          </p>

          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 28px 0;" />

          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            Nếu bạn không thực hiện yêu cầu đăng ký này trên MatGreen, vui lòng bỏ qua email này.
          </p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            © ${new Date().getFullYear()} MatGreen. Giải pháp kinh tế tuần hoàn vì môi trường xanh.
          </p>
        </div>
      </div>
    `;

    // Nếu có SMTP Transporter, gửi thật qua email
    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from,
          to: toEmail,
          subject,
          html,
        });
        log.info(`Đã gửi email OTP xác thực tới ${toEmail} (MessageId: ${info.messageId})`);
        return { success: true, messageId: info.messageId };
      } catch (err) {
        log.error({ err: err.message }, `Lỗi khi gửi email qua SMTP tới ${toEmail}:`);
        throw new Error(`Không thể gửi email xác thực qua SMTP: ${err.message}`);
      }

      async sendPasswordResetOtp({ toEmail, otpCode, userName = "Bạn" }) {
        const from = process.env.SMTP_FROM || '"MatGreen" <no-reply@matgreen.vn>';
        const subject = `[MatGreen] Mã đặt lại mật khẩu: ${otpCode}`;
        const html = `<div style="font-family:Arial;max-width:580px;margin:auto"><h2>Xin chào ${userName},</h2><p>Mã OTP đặt lại mật khẩu MatGreen của bạn là:</p><p style="font-size:30px;font-weight:700;letter-spacing:8px;color:#047857">${otpCode}</p><p>Mã có hiệu lực trong 10 phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p></div>`;
        if (this.transporter) {
          const info = await this.transporter.sendMail({ from, to: toEmail, subject, html });
          return { success: true, messageId: info.messageId };
        }
        log.info(`[SIMULATION MODE] Mã OTP đặt lại mật khẩu gửi tới ${toEmail} là: [ ${otpCode} ]`);
        return { success: true, simulated: true, otp: otpCode };
      }
    }

    // Chế độ mô phỏng khi chưa nhập mật khẩu SMTP
    log.info(`[SIMULATION MODE] Mã OTP xác thực gửi tới ${toEmail} là: 👉 [ ${otpCode} ] 👈`);
    return {
      success: true,
      simulated: true,
      otp: otpCode,
    };
  }
}

module.exports = new EmailService();
