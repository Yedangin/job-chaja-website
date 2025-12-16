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
    <section className="bg-white padding-responsive-sm">
      <div className="container-responsive">
        {/* Localized heading with span */}
        <h2 className="text-responsive-lg font-bold text-center mb-8 sm:mb-12 text-foreground">
          {t("titleBefore")}
          <span className="text-primary">Jobchaja</span>
          {t("titleAfter")}
        </h2>

        {/* Mobile: Stack vertically, Desktop: Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 max-w-5xl mx-auto">
          {/* FIRST COLUMN - Step 1 */}
          <div className="bg-[#D5E6FF] rounded-xl sm:rounded-2xl flex-1">
            <div className="p-4 sm:p-6 lg:p-10">
              <h3 className="font-bold text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-5">
                1. {steps[0].title}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 lg:mb-[60px] max-w-sm">
                {steps[0].description}
              </p>

              <div className="flex items-center justify-center">
                <Image
                  src={steps[0].image}
                  alt="StepOneImage"
                  width={steps[0].imageW}
                  height={steps[0].imageH}
                  unoptimized
                  className="w-32 h-48 sm:w-40 sm:h-60 lg:w-[220px] lg:h-[330px] object-contain"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Steps 2 & 3 */}
          <div className="flex-1 space-y-3 sm:space-y-4">
            {/* STEP 2 */}
            <div className="bg-[#CFF5FF] rounded-xl sm:rounded-2xl">
              <div className="p-4 sm:p-6 lg:p-10">
                <h3 className="font-bold text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-5">
                  2. {steps[1].title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed mb-4 sm:mb-5 max-w-sm">
                  {steps[1].description}
                </p>

                <div className="flex items-center justify-center">
                  <Image
                    src={steps[1].image}
                    alt="StepTwoImage"
                    width={steps[1].imageW}
                    height={steps[1].imageH}
                    unoptimized
                    className="w-48 h-16 sm:w-60 sm:h-20 lg:w-[300px] lg:h-[100px] object-contain"
                  />
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="bg-[#F4E4FF] rounded-xl sm:rounded-2xl">
              <div className="p-4 sm:p-6 lg:p-10">
                <h3 className="font-bold text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-5">
                  3. {steps[2].title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed mb-4 sm:mb-5 max-w-sm">
                  {steps[2].description}
                </p>

                <div className="flex items-center justify-center">
                  <Image
                    src={steps[2].image}
                    alt="StepThreeImage"
                    width={steps[2].imageW}
                    height={steps[2].imageH}
                    unoptimized
                    className="w-48 h-16 sm:w-60 sm:h-20 lg:w-[300px] lg:h-[100px] object-contain"
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
