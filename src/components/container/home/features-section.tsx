import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function FeaturesSection() {
  const features = [
    {
      icon: "/home/firstIcon.png",
      title: "Two-Way Deposit",
      description: "Both parties deposit equally",
    },
    {
      icon: "/home/secondIcon.png",
      title: "Full-Refund",
      description: "100% refund after interview",
    },
    {
      icon: "/home/thirdIcon.png",
      title: "Time Protection",
      description: "Prevent no-shows",
    },
    {
      icon: "/home/fourthIcon.png",
      title: "Mobile App",
      description: "Easy management",
    },
  ];

  return (
    <section>
      <div className="border border-gray-100 mb-4"></div>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#5FA8FF4A] w-fit px-3 py-3 rounded-xl text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          <Image src="/home/lock.png" alt="Icon" width={24} height={24} />
          <p>Fair & Secure Interview Platform</p>
        </div>

        <h2 className="text-[38px] font-bold mb-4 text-foreground">
          Fair Interviews with Secure Deposit System
        </h2>

        <p className="mb-12 max-w-3xl text-primary text-[18px] leading-8">
          Both job seekers and employers deposit 50,000 MMK each to ensure
          commitment to the interview process. Full refund after interview
          completion regardless of outcome.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-white border border-border">
              <div className="flex items-center gap-6">
                {/* Updated icon rendering */}
                <div className="mb-4 flex items-center h-[120px] w-fit bg-[#5FA8FF] p-9 rounded-lg">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={48}
                    height={48}
                  />
                </div>

                <div>
                  <h3 className="text-[25px] font-[600] text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground font-[400] text-[18px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
