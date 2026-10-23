import React from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingOffers } from "@/components/landing/LandingOffers";
import { LandingAbout } from "@/components/landing/LandingAbout";
import { LandingOpening } from "@/components/landing/LandingOpening";
import { LandingServices } from "@/components/landing/LandingServices";
import { LandingProducts } from "@/components/landing/LandingProducts";
import { LandingGallery } from "@/components/landing/LandingGallery";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingBrands } from "@/components/landing/LandingBrands";
import { LandingWhyChoose } from "@/components/landing/LandingWhyChoose";
import { LandingStats } from "@/components/landing/LandingStats";
import { LandingNewsSection } from "@/components/landing/LandingNewsSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Header hai tầng phong cách main-header--three */}
      <LandingHeader />

      <main className="flex-1">
        {/* 2. Hero Slider Three: Tiêu đề lớn, khung bo góc nghệ thuật, vòng chữ xoay & play video */}
        <LandingHero />

        {/* 3. Offer One: 2 thẻ ưu đãi Cho nhận 0đ & Thanh lý thu hồi vốn */}
        <LandingOffers />

        {/* 4. About Three: Khung ảnh 3 cột hoa lá Solox, câu chuyện tuần hoàn, chữ ký Founder */}
        <LandingAbout />

        {/* 5. Opening Hours Three: Đồng hồ tiếp nhận, cam kết SLA 15 phút, hotline 24/7 */}
        <LandingOpening />

        {/* 6. Service Page Three: 4 thẻ dịch vụ với nền họa tiết service-bg-3.jpg */}
        <LandingServices />

        {/* 7. Product One: 4 nguồn vật liệu đang có sẵn quanh đây với đánh giá sao & khoảng cách GPS */}
        <LandingProducts />

        {/* 8. Gallery Two: 4 ảnh thực tế công trường & khối thông tin tin cậy nền gallery-info-bg.jpg */}
        <LandingGallery />

        {/* 9. Testimonials Three: Đánh giá khách hàng thực tế với ảnh đôi và hoa lá Solox */}
        <LandingTestimonials />

        {/* 10. Client Carousel: Dải logo đối tác nhà thầu & đơn vị tái chế */}
        <LandingBrands />

        {/* 11. Why Choose Three: BANNER PARALLAX LỚN - Lướt xuống ảnh nền giữ cố định và lộ dần */}
        <LandingWhyChoose />

        {/* 12. Funfact Three: 4 bộ đếm số ấn tượng nền funfact-bg-3.jpg */}
        <LandingStats />

        {/* 13. Blog One: 3 bài viết cẩm nang với ảnh Cloudinary thật & ngày tháng dạng badge */}
        <LandingNewsSection />
      </main>

      {/* 14. Main Footer: Chân trang tối màu sang trọng nền footer-bg-1-1.png & đăng ký nhận tin */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
