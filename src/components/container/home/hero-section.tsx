"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("HomePage.HeroSection");
  return (
    <section className="bg-white py-5 md:py-10">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              {t("h1")}
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              <span className="text-primary">{t("span")}</span> {t("h2")}
            </h2>
            <p className="text-lg text-[#5FA8FF]">{t("description")}</p>
            {/* <button className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition">
              Explore Jobs
            </button> */}
            <Button className="bg-primary text-white py-6 font-medium hover:bg-opacity-90 transition text-[24px]">
              {t("btn")}
            </Button>
          </div>
          <div className="relative w-full h-96 md:h-[500px] lg:h-[600px]">
            {/* <Image
              src={"/home/heroImage.png"}
              alt="JobChaJa HeroSection Image"
              width={200}
              height={200}
              unoptimized
            /> */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Top right wavy shape */}
              <div
                className="absolute top-0 right-0 w-96 h-96  opacity-70 rounded-full mix-blend-multiply filter blur-3xl"
                style={{
                  borderRadius: "45% 55% 60% 40% / 55% 45% 40% 60%",
                }}
              ></div>

              {/* Bottom right curved shape */}
              <div
                className="absolute bottom-0 right-20 w-80 h-80  opacity-50 rounded-full mix-blend-multiply filter blur-3xl"
                style={{
                  borderRadius: "40% 60% 50% 50% / 45% 55% 55% 45%",
                }}
              ></div>

              {/* Middle right wavy accent */}
              <div
                className="absolute top-1/3 right-1/4 w-72 h-72  opacity-60 rounded-full mix-blend-multiply filter blur-3xl"
                style={{
                  borderRadius: "60% 40% 45% 55% / 50% 50% 55% 45%",
                }}
              ></div>
            </div>

            {/* SVG Circles Layer */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none pl-[500px]">
              {/* Large Circle */}
              <svg
                width="194"
                height="371"
                viewBox="0 0 194 371"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute w-96 h-96 lg:w-[450px] lg:h-[450px]"
              >
                <circle
                  cx="185.5"
                  cy="185.5"
                  r="163.5"
                  stroke="#5FA8FF"
                  strokeOpacity="0.35"
                  strokeWidth="44"
                />
              </svg>

              {/* Top Left Wavy Ring */}
              <svg
                width="237"
                height="165"
                viewBox="0 0 237 165"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute w-80 h-60 lg:w-96 lg:h-72 -top-20 -left-32 lg:-left-40 ml-[35px] pt-[50px]"
              >
                <mask id="path-1-inside-1_2145_2927" fill="white">
                  <path d="M237.01 7.62433C232.852 33.7927 223.138 58.7667 208.519 80.8655C193.9 102.964 174.717 121.675 152.26 135.738C129.804 149.801 104.595 158.889 78.3312 162.392C52.0673 165.895 25.3577 163.731 0.000405403 156.046L14.0962 109.539C32.8106 115.211 52.523 116.809 71.9065 114.223C91.29 111.638 109.895 104.93 126.468 94.5513C143.042 84.1725 157.2 70.3636 167.989 54.0541C178.778 37.7446 185.948 19.313 189.016 4.55348e-06L237.01 7.62433Z" />
                </mask>
                <path
                  d="M237.01 7.62433C232.852 33.7927 223.138 58.7667 208.519 80.8655C193.9 102.964 174.717 121.675 152.26 135.738C129.804 149.801 104.595 158.889 78.3312 162.392C52.0673 165.895 25.3577 163.731 0.000405403 156.046L14.0962 109.539C32.8106 115.211 52.523 116.809 71.9065 114.223C91.29 111.638 109.895 104.93 126.468 94.5513C143.042 84.1725 157.2 70.3636 167.989 54.0541C178.778 37.7446 185.948 19.313 189.016 4.55348e-06L237.01 7.62433Z"
                  stroke="#5FA8FF"
                  strokeOpacity="0.35"
                  strokeWidth="88"
                  mask="url(#path-1-inside-1_2145_2927)"
                />
              </svg>

              {/* Bottom Left Wavy Ring */}
              <svg
                width="186"
                height="211"
                viewBox="0 0 186 211"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute w-72 h-80 lg:w-96 lg:h-96 -bottom-32 -left-20 lg:-left-40 ml-[350px] pb-[100px]"
              >
                <mask id="path-1-inside-1_2145_2926" fill="white">
                  <path d="M0 0C26.4965 3.15967e-07 52.6854 5.67632 76.8041 16.6469C100.923 27.6174 122.411 43.6276 139.823 63.5997C157.235 83.5717 170.167 107.042 177.747 132.431C185.327 157.82 187.38 184.539 183.768 210.788L135.626 204.163C138.292 184.79 136.777 165.072 131.182 146.334C125.588 127.596 116.044 110.274 103.194 95.534C90.343 80.7941 74.4839 68.9781 56.6836 60.8815C38.8834 52.785 19.5551 48.5957 0 48.5957V0Z" />
                </mask>
                <path
                  d="M0 0C26.4965 3.15967e-07 52.6854 5.67632 76.8041 16.6469C100.923 27.6174 122.411 43.6276 139.823 63.5997C157.235 83.5717 170.167 107.042 177.747 132.431C185.327 157.82 187.38 184.539 183.768 210.788L135.626 204.163C138.292 184.79 136.777 165.072 131.182 146.334C125.588 127.596 116.044 110.274 103.194 95.534C90.343 80.7941 74.4839 68.9781 56.6836 60.8815C38.8834 52.785 19.5551 48.5957 0 48.5957V0Z"
                  stroke="#5FA8FF"
                  strokeOpacity="0.35"
                  strokeWidth="80"
                  mask="url(#path-1-inside-1_2145_2926)"
                />
              </svg>
            </div>

            {/* Professional Woman Image */}
            <div className="relative z-10 flex justify-center items-end">
              <Image
                src="/home/heroImage.png"
                alt="JobChaJa HeroSection Image"
                width={200}
                height={200}
                unoptimized
                className="w-[55%] object-cover mr-[220px] mt-3"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
