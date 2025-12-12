import Header from "@/components/header"
import HeroSection from "@/components/container/home/hero-section"
import FeaturesSection from "@/components/container/home/features-section"
import HowItWorks from "@/components/container/home/how-it-works"
import DepositSystem from "@/components/container/home/deposit-system"
import WhySystem from "@/components/container/home/why-system"
import TermsPolicies from "@/components/container/home/terms-policies"
import MobileApp from "@/components/container/home/mobile-app"
import Footer from "@/components/footer"

export const metadata = {
  title: "Jobchaja - Fair Job Interviews with Secure Deposits",
  description: "A platform connecting job seekers and corporate members with secure deposit system for fair interviews",
}

export default function Home() {
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
  )
}
