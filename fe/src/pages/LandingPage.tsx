import React from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingAbout } from "@/components/landing/LandingAbout";
import { LandingServices } from "@/components/landing/LandingServices";
import { LandingCategories } from "@/components/landing/LandingCategories";
import { LandingAiAdvisor } from "@/components/landing/LandingAiAdvisor";
import { LandingStats } from "@/components/landing/LandingStats";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingNewsSection } from "@/components/landing/LandingNewsSection";
import { LandingContactSection } from "@/components/landing/LandingContactSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 2-tier Navbar */}
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Banner with GPS Quick Radar */}
        <LandingHero />

        {/* About Section: Story of House A & House B */}
        <LandingAbout />

        {/* 6 Core Services & Capabilities */}
        <LandingServices />

        {/* Material Categories Showcase */}
        <LandingCategories />

        {/* AI Advisor Demolition Breakdown Feature */}
        <LandingAiAdvisor />

        {/* Live Counters & Statistics */}
        <LandingStats />

        {/* Community Testimonials */}
        <LandingTestimonials />

        {/* News & Circular Economy Insights */}
        <LandingNewsSection />

        {/* Contact & Support Section */}
        <LandingContactSection />
      </main>

      {/* Global Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
