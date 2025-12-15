"use client";
import HeroSection from "@/components/container/home/hero-section";
import FeaturesSection from "@/components/container/home/features-section";
import HowItWorks from "@/components/container/home/how-it-works";
import DepositSystem from "@/components/container/home/deposit-system";
import WhySystem from "@/components/container/home/why-system";
import TermsPolicies from "@/components/container/home/terms-policies";
import MobileApp from "@/components/container/home/mobile-app";

export default function HomeClient() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <DepositSystem />
      <WhySystem />
      <TermsPolicies />
      <MobileApp />
    </>
  );
}
