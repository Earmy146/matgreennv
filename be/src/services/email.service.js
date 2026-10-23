const axios = require("axios");
const logger = require("../utils/logger");

const log = logger.child({ component: "email-service" });

/**
 * Email Service — dùng Brevo Transactional Email API v3
 * Docs: https://developers.brevo.com/reference/sendtransacemail
 */
class EmailService {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY || null;
    this.fromEmail =
      process.env.MAIL_FROM_ADDRESS || "no-reply@matgreen.vn";
    this.fromName =
      process.env.MAIL_FROM_NAME || "MatGreen - Vật Liệu Tuần Hoàn";
    this.apiUrl = "https://api.brevo.com/v3/smtp/email";

    if (this.apiKey) {
      log.info(
        `Brevo Email Service khởi tạo thành công — from: ${this.fromName} <${this.fromEmail}>`
      );
    } else {
      log.warn(
        "BREVO_API_KEY chưa được cấu hình trong .env. Email sẽ chạy ở chế độ giả lập (OTP in ra console)."
      );
    }
  }

  /**
   * Gửi email qua Brevo API
   * @param {object} opts
   * @param {string} opts.toEmail
   * @param {string} opts.toName
   * @param {string} opts.subject
   * @param {string} opts.html
   */
  async _send({ toEmail, toName = "Bạn", subject, html }) {
    if (!this.apiKey) {
      // Chế độ giả lập — log ra console
      log.info(
        `[SIMULATION MODE] Gửi email tới ${toEmail} | Tiêu đề: "${subject}"`
      );
      return { success: true, simulated: true };
    }

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          sender: { name: this.fromName, email: this.fromEmail },
          to: [{ email: toEmail, name: toName }],
          subject,
          htmlContent: html,
        },
        {
          headers: {
            "api-key": this.apiKey,
            "Content-Type": "application/json",
            accept: "application/json",
          },
          timeout: 10000,
        }
      );
      log.info(
        `Đã gửi email qua Brevo tới ${toEmail} — MessageId: ${response.data?.messageId}`
      );
      return { success: true, messageId: response.data?.messageId };
    } catch (err) {
      const detail =
        err.response?.data?.message || err.message;
      log.error(
        { err: detail },
        `Lỗi khi gửi email qua Brevo tới ${toEmail}:`
      );
      throw new Error(`Không thể gửi email qua Brevo: ${detail}`);
    }
  }

  /**
   * Gửi OTP xác thực đăng ký tài khoản
   */
  async sendVerificationOtp({ toEmail, otpCode, userName = "Bạn" }) {
    const subject = `[MatGreen] Mã xác thực đăng ký tài khoản: ${otpCode}`;
    const html = `
      <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:580px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#065f46 0%,#047857 100%);padding:32px 24px;text-align:center;color:#ffffff;">
          <h1 style="margin:0;font-size:26px;font-weight:800;letter-spacing:-0.5px;">MatGreen</h1>
          <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">Nền tảng kết nối &amp; tái sử dụng vật liệu xây dựng tháo dỡ</p>
        </div>

        <div style="padding:32px 28px;">
          <h2 style="color:#0f172a;font-size:18px;margin-top:0;">Xin chào ${userName},</h2>
          <p style="color:#475569;font-size:14px;line-height:1.6;">
            Cảm ơn bạn đã tham gia cộng đồng <strong>MatGreen</strong>. Để hoàn tất kích hoạt tài khoản, vui lòng nhập mã OTP 6 số dưới đây:
          </p>

          <div style="margin:28px 0;text-align:center;">
            <span style="display:inline-block;padding:14px 32px;background:#ecfdf5;border:2px dashed #10b981;border-radius:12px;font-size:32px;font-weight:900;letter-spacing:8px;color:#047857;font-family:monospace;">
              ${otpCode}
            </span>
          </div>

          <p style="color:#64748b;font-size:13px;line-height:1.5;">
            ⏳ Mã OTP có hiệu lực trong vòng <strong>10 phút</strong>. Vì lý do bảo mật, vui lòng không chia sẻ mã này cho bất kỳ ai.
          </p>

          <hr style="border:none;border-top:1px solid #f1f5f9;margin:28px 0;" />

          <p style="color:#94a3b8;font-size:12px;margin:0;">
            Nếu bạn không thực hiện yêu cầu đăng ký này trên MatGreen, vui lòng bỏ qua email này.
          </p>
        </div>

        <div style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #f1f5f9;">
          <p style="color:#94a3b8;font-size:11px;margin:0;">
            © ${new Date().getFullYear()} MatGreen. Giải pháp kinh tế tuần hoàn vì môi trường xanh.
          </p>
        </div>
      </div>
    `;

    if (!this.apiKey) {
      log.info(
        `[SIMULATION MODE] Mã OTP xác thực gửi tới ${toEmail}: 👉 [ ${otpCode} ] 👈`
      );
      return { success: true, simulated: true, otp: otpCode };
    }

    return this._send({ toEmail, toName: userName, subject, html });
  }

  /**
   * Gửi OTP đặt lại mật khẩu
   */
  async sendPasswordResetOtp({ toEmail, otpCode, userName = "Bạn" }) {
    const subject = `[MatGreen] Mã đặt lại mật khẩu: ${otpCode}`;
    const html = `
      <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:580px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#065f46 0%,#047857 100%);padding:32px 24px;text-align:center;color:#ffffff;">
          <h1 style="margin:0;font-size:26px;font-weight:800;">MatGreen</h1>
          <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">Nền tảng kết nối &amp; tái sử dụng vật liệu xây dựng tháo dỡ</p>
        </div>

        <div style="padding:32px 28px;">
          <h2 style="color:#0f172a;font-size:18px;margin-top:0;">Xin chào ${userName},</h2>
          <p style="color:#475569;font-size:14px;line-height:1.6;">
            Bạn đã yêu cầu đặt lại mật khẩu tài khoản <strong>MatGreen</strong>. Vui lòng nhập mã OTP dưới đây:
          </p>

          <div style="margin:28px 0;text-align:center;">
            <span style="display:inline-block;padding:14px 32px;background:#fffbeb;border:2px dashed #f59e0b;border-radius:12px;font-size:32px;font-weight:900;letter-spacing:8px;color:#b45309;font-family:monospace;">
              ${otpCode}
            </span>
          </div>

          <p style="color:#64748b;font-size:13px;line-height:1.5;">
            ⏳ Mã có hiệu lực trong <strong>10 phút</strong>. Nếu bạn không yêu cầu, hãy bỏ qua email này.
          </p>
        </div>

        <div style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #f1f5f9;">
          <p style="color:#94a3b8;font-size:11px;margin:0;">
            © ${new Date().getFullYear()} MatGreen. Giải pháp kinh tế tuần hoàn vì môi trường xanh.
          </p>
        </div>
      </div>
    `;

    if (!this.apiKey) {
      log.info(
        `[SIMULATION MODE] Mã OTP đặt lại mật khẩu gửi tới ${toEmail}: [ ${otpCode} ]`
      );
      return { success: true, simulated: true, otp: otpCode };
    }

    return this._send({ toEmail, toName: userName, subject, html });
  }
}

module.exports = new EmailService();
