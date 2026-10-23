const Article = require("../models/article.model");
const { OK, CREATED } = require("../core/success.response");
const { NotFoundError, BadRequestError } = require("../core/error.response");

class ArticleController {
  async getAll(req, res, next) {
    try {
      const { category, tag, search } = req.query;
      const query = {};

      if (category) query.category = category;
      if (tag) query.tags = tag;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { excerpt: { $regex: search, $options: "i" } },
        ];
      }

      const articles = await Article.find(query).sort({ createdAt: -1 });

      new OK({
        message: "Lấy danh sách bài viết thành công",
        data: articles,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async getBySlugOrId(req, res, next) {
    try {
      const { slugOrId } = req.params;
      let article = await Article.findOne({ slug: slugOrId });
      if (!article && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
        article = await Article.findById(slugOrId);
      }

      if (!article) {
        throw new NotFoundError("Không tìm thấy bài viết");
      }

      new OK({
        message: "Lấy chi tiết bài viết thành công",
        data: article,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { title, excerpt, content, category, thumbnail, bannerImage, tags, author } = req.body;
      if (!title || !content || !thumbnail) {
        throw new BadRequestError("Tiêu đề, nội dung và ảnh đại diện là bắt buộc");
      }

      let slug = req.body.slug;
      if (!slug) {
        slug = title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[đĐ]/g, "d")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
      }

      const article = await Article.create({
        ...req.body,
        slug,
      });

      new CREATED({
        message: "Tạo bài viết thành công",
        data: article,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const article = await Article.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!article) {
        throw new NotFoundError("Không tìm thấy bài viết để cập nhật");
      }

      new OK({
        message: "Cập nhật bài viết thành công",
        data: article,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const article = await Article.findByIdAndDelete(id);

      if (!article) {
        throw new NotFoundError("Không tìm thấy bài viết để xóa");
      }

      new OK({
        message: "Xóa bài viết thành công",
        data: article,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async incrementViews(req, res, next) {
    try {
      const { id } = req.params;
      const article = await Article.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      );

      new OK({
        message: "Tăng lượt xem thành công",
        data: article,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticleController();
