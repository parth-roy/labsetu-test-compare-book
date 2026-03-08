import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import TrustBadges from "@/components/home/TrustBadges";
import HealthConcerns from "@/components/home/HealthConcerns";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import PopularTests from "@/components/home/PopularTests";
import TestCategories from "@/components/home/TestCategories";
import FeaturedLabs from "@/components/home/FeaturedLabs";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <TrustBadges />
      <HealthConcerns />
      <FeaturedPackages />
      <PopularTests />
      <TestCategories />
      <FeaturedLabs />
      <CTASection />
    </Layout>
  );
};

export default Index;
