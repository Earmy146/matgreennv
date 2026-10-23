require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Article = require("../src/models/article.model");
const { richTextNewsArticles } = require("./seed-news-data");

async function seedNews() {
  console.log("🌱 [Seed News] Bắt đầu kết nối MongoDB Atlas để seed tin tức rich text...");
  await connectDB();

  console.log("🗑️  Xóa dữ liệu tin tức cũ nếu có...");
  await Article.deleteMany({});

  console.log(`📝 Bắt đầu chèn ${richTextNewsArticles.length} bài viết chuẩn Rich Text HTML...`);
  const inserted = await Article.insertMany(richTextNewsArticles);
  
  console.log(`✅ Đã seed thành công ${inserted.length} bài tin tức vào collection 'articles' trong MongoDB!`);
  for (const art of inserted) {
    console.log(`   - [${art.category}] ${art.title} (Slug: ${art.slug})`);
  }

  process.exit(0);
}

seedNews().catch((err) => {
  console.error("❌ Lỗi khi seed tin tức:", err);
  process.exit(1);
});
