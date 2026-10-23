const SiteConfig = require("../models/site-config.model");

class SiteConfigService {
  async getConfig() {
    let configDoc = await SiteConfig.findOne({ key: "default" });
    if (!configDoc) {
      configDoc = await SiteConfig.create({ key: "default" });
    }

    let config = configDoc.toObject();

    // Tự động chuẩn hóa mapEmbedUrl nếu bị lỗi pb cũ
    if (
      config.contact?.mapEmbedUrl &&
      (config.contact.mapEmbedUrl.includes("!pb!") || config.contact.mapEmbedUrl.includes("embed?pb="))
    ) {
      config.contact.mapEmbedUrl =
        "https://maps.google.com/maps?q=C%E1%BA%A7u%20Gi%E1%BA%A5y%2C%20H%C3%A0%20N%E1%BB%99i%2C%20Vi%E1%BB%87t%20Nam&t=&z=15&ie=UTF8&iwloc=&output=embed";
      await SiteConfig.updateOne(
        { key: "default" },
        { $set: { "contact.mapEmbedUrl": config.contact.mapEmbedUrl } }
      );
    }

    // Đảm bảo các field trang mới luôn có giá trị defaults nếu DB là bản ghi cũ
    const defaults = new SiteConfig().toObject();
    if (!config.homePage) {
      config.homePage = defaults.homePage;
    } else {
      if (!config.homePage.offers) config.homePage.offers = defaults.homePage.offers;
      if (!config.homePage.products) config.homePage.products = defaults.homePage.products;
      if (!config.homePage.newsSection) config.homePage.newsSection = defaults.homePage.newsSection;
    }
    if (!config.aboutPage) config.aboutPage = defaults.aboutPage;
    if (!config.contactPage) config.contactPage = defaults.contactPage;
    if (!config.servicesPage) config.servicesPage = defaults.servicesPage;
    if (!config.newsPage) config.newsPage = defaults.newsPage;
    if (!config.general) config.general = defaults.general;
    if (!config.contact) config.contact = defaults.contact;

    return config;
  }

  async updateConfig(data, actorId) {
    let config = await SiteConfig.findOne({ key: "default" });
    if (!config) {
      config = new SiteConfig({ key: "default" });
    }

    // Merge các section chính
    if (data.general) {
      config.general = { ...((config.general && config.general.toObject) ? config.general.toObject() : config.general), ...data.general };
      config.markModified("general");
    }
    if (data.contact) {
      config.contact = { ...((config.contact && config.contact.toObject) ? config.contact.toObject() : config.contact), ...data.contact };
      config.markModified("contact");
    }
    if (Array.isArray(data.teamMembers)) {
      config.teamMembers = data.teamMembers;
      config.markModified("teamMembers");
    }
    if (Array.isArray(data.partners)) {
      config.partners = data.partners;
      config.markModified("partners");
    }
    if (data.partnersHeadline !== undefined) {
      config.partnersHeadline = data.partnersHeadline;
      config.markModified("partnersHeadline");
    }
    if (Array.isArray(data.testimonials)) {
      config.testimonials = data.testimonials;
      config.markModified("testimonials");
    }

    // Merge các trang theo cấu hình mới
    if (data.homePage) {
      config.homePage = data.homePage;
      config.markModified("homePage");
    }
    if (data.aboutPage) {
      config.aboutPage = data.aboutPage;
      config.markModified("aboutPage");
    }
    if (data.contactPage) {
      config.contactPage = data.contactPage;
      config.markModified("contactPage");
    }
    if (data.servicesPage) {
      config.servicesPage = data.servicesPage;
      config.markModified("servicesPage");
    }
    if (data.newsPage) {
      config.newsPage = data.newsPage;
      config.markModified("newsPage");
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
          reason: "Cập nhật cấu hình website toàn diện (Trang chủ, Giới thiệu, Liên hệ, Dịch vụ)",
        });
      }
    } catch (e) {
      // bỏ qua nếu audit service gặp lỗi nhỏ
    }

    return config.toObject();
  }
}

module.exports = new SiteConfigService();

