const SiteConfig = require("../models/site-config.model");

class SiteConfigService {
  async getConfig() {
    let config = await SiteConfig.findOne({ key: "default" }).lean();
    if (!config) {
      config = await SiteConfig.create({ key: "default" });
      config = config.toObject();
    }
    // Tự động chuẩn hóa mapEmbedUrl nếu bị lỗi pb cũ
    if (config.contact?.mapEmbedUrl && (config.contact.mapEmbedUrl.includes("!pb!") || config.contact.mapEmbedUrl.includes("embed?pb="))) {
      config.contact.mapEmbedUrl = "https://maps.google.com/maps?q=C%E1%BA%A7u%20Gi%E1%BA%A5y%2C%20H%C3%A0%20N%E1%BB%99i%2C%20Vi%E1%BB%87t%20Nam&t=&z=15&ie=UTF8&iwloc=&output=embed";
      await SiteConfig.updateOne({ key: "default" }, { $set: { "contact.mapEmbedUrl": config.contact.mapEmbedUrl } });
    }
    return config;
  }

  async updateConfig(data, actorId) {
    let config = await SiteConfig.findOne({ key: "default" });
    if (!config) {
      config = new SiteConfig({ key: "default" });
    }

    if (data.general) {
      config.general = { ...config.general.toObject(), ...data.general };
    }
    if (data.contact) {
      config.contact = { ...config.contact.toObject(), ...data.contact };
    }
    if (Array.isArray(data.teamMembers)) {
      config.teamMembers = data.teamMembers;
    }
    if (Array.isArray(data.partners)) {
      config.partners = data.partners;
    }
    if (data.partnersHeadline !== undefined) {
      config.partnersHeadline = data.partnersHeadline;
    }
    if (Array.isArray(data.testimonials)) {
      config.testimonials = data.testimonials;
    }

    await config.save();

    // Ghi log audit quản trị nếu có adminAuditService
    try {
      const adminAuditService = require("./admin-audit.service");
      if (adminAuditService && actorId) {
        await adminAuditService.record({
          actor: actorId,
          action: "update_site_config",
          targetType: "system",
          targetId: config._id,
          reason: "Cập nhật cấu hình website (Logo, Đối tác, Đội ngũ, Liên hệ)",
        });
      }
    } catch (e) {
      // bỏ qua nếu audit service gặp lỗi nhỏ
    }

    return config;
  }
}

module.exports = new SiteConfigService();
