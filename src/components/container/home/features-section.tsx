"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function FeaturesSection() {
  const t = useTranslations("HomePage.FeaturesSection");

  const features = [
    {
      icon: "/home/firstIcon.png",
      title: t("features.twoWay.title"),
      description: t("features.twoWay.desc"),
    },
    {
      icon: "/home/secondIcon.png",
      title: t("features.refund.title"),
      description: t("features.refund.desc"),
    },
    {
      icon: "/home/thirdIcon.png",
      title: t("features.timeProtect.title"),
      description: t("features.timeProtect.desc"),
    },
    {
      icon: "/home/fourthIcon.png",
      title: t("features.mobile.title"),
      description: t("features.mobile.desc"),
    },
  ];

  return (
    <section className="padding-responsive-sm">
      {/* <div className="border border-gray-100 mb-6 sm:mb-8"></div> */}
      <div className="container-responsive">
        {/* Badge */}
        <div className="bg-[#5FA8FF4A] w-fit px-3 py-2 sm:py-3 rounded-xl text-sm sm:text-lg font-semibold text-primary mb-4 sm:mb-6 flex items-center gap-2">
          <Image
            src="/home/lock.png"
            alt="Icon"
            width={20}
            height={20}
            className="sm:w-6 sm:h-6"
          />
          <p>{t("badge")}</p>
        </div>

        {/* Title */}
        <h2 className="text-responsive-lg font-bold mb-4 sm:mb-6 text-foreground">
          {t("title")}
        </h2>

        {/* Description */}
        <p className="mb-8 sm:mb-12 max-w-3xl text-primary text-responsive-sm leading-relaxed">
          {t("description")}
        </p>

        {/* Features List */}
        <div className="grid-responsive-2">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-4 sm:p-6 bg-white border border-border"
            >
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 bg-[#5FA8FF] p-3 sm:p-4 lg:p-6 rounded-lg flex-shrink-0">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={32}
                    height={32}
                    className="sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed">
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
