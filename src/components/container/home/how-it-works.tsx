import Image from "next/image";
import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("HomePage.HowItWorksSection");

  const steps = [
    {
      number: 1,
      title: t("steps.one.title"),
      description: t("steps.one.desc"),
      bg: "#D5E6FF",
      image: "/home/phone.png",
      imageW: 220,
      imageH: 330,
    },
    {
      number: 2,
      title: t("steps.two.title"),
      description: t("steps.two.desc"),
      bg: "#CFF5FF",
      image: "/home/searchBar.png",
      imageW: 300,
      imageH: 100,
    },
    {
      number: 3,
      title: t("steps.three.title"),
      description: t("steps.three.desc"),
      bg: "#F4E4FF",
      image: "/home/orangeSquare.png",
      imageW: 300,
      imageH: 100,
    },
  ];

  return (
    <section className="bg-white py-3 md:py-10">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Localized heading with span */}
        <h2 className="text-[52px] font-bold text-center mb-12 text-foreground">
          {t("titleBefore")}
          <span className="text-primary">Jobchaja</span>
          {t("titleAfter")}
        </h2>

        <div className="flex gap-3 max-w-5xl mx-auto">
          {/* FIRST COLUMN */}
          <div className="bg-[#D5E6FF] rounded-2xl">
            <div className="p-10">
              <h2 className="font-[700] text-[24px] mb-5">
                1. {steps[0].title}
              </h2>
              <p className="max-w-sm leading-6 mb-[60px]">
                {steps[0].description}
              </p>

              <div className="flex items-center justify-center">
                <Image
                  src={steps[0].image}
                  alt="StepOneImage"
                  width={steps[0].imageW}
                  height={steps[0].imageH}
                  unoptimized
                  className="w-[220px] h-[330px]"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            {/* STEP 2 */}
            <div className="bg-[#CFF5FF] rounded-2xl mb-3">
              <div className="p-10">
                <h2 className="font-[700] text-[24px] mb-5">
                  2. {steps[1].title}
                </h2>
                <p className="max-w-sm leading-6 mb-5">
                  {steps[1].description}
                </p>

                <div className="flex items-center justify-center">
                  <Image
                    src={steps[1].image}
                    alt="StepTwoImage"
                    width={steps[1].imageW}
                    height={steps[1].imageH}
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="bg-[#F4E4FF] rounded-2xl">
              <div className="p-10">
                <h2 className="font-[700] text-[24px] mb-5">
                  3. {steps[2].title}
                </h2>
                <p className="max-w-sm leading-6 mb-5">
                  {steps[2].description}
                </p>

                <div className="flex items-center justify-center">
                  <Image
                    src={steps[2].image}
                    alt="StepThreeImage"
                    width={steps[2].imageW}
                    height={steps[2].imageH}
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
