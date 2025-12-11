import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import HowItWorks from "@/components/how-it-works"
import DepositSystem from "@/components/deposit-system"
import WhySystem from "@/components/why-system"
import TermsPolicies from "@/components/terms-policies"
import MobileApp from "@/components/mobile-app"
import Footer from "@/components/footer"

export const metadata = {
  title: "Jobchaja - Fair Job Interviews with Secure Deposits",
  description: "A platform connecting job seekers and corporate members with secure deposit system for fair interviews",
}

export default function Home() {
  return (
    <main className="w-full">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <DepositSystem />
      <WhySystem />
      <TermsPolicies />
      <MobileApp />
      <Footer />
    </main>
  )
}
