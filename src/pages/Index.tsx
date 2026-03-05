import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import TrustBadges from "@/components/home/TrustBadges";
import TestCategories from "@/components/home/TestCategories";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import PopularTests from "@/components/home/PopularTests";
import FeaturedLabs from "@/components/home/FeaturedLabs";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <TrustBadges />
      <FeaturedPackages />
      <TestCategories />
      <PopularTests />
      <FeaturedLabs />
      <CTASection />
    </Layout>
  );
};

export default Index;
