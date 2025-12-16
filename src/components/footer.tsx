"use client";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="text-white">
      <div className="bg-primary padding-responsive-md">
        <div className="container-responsive">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                {t("brand.title")}
              </h3>
              <p className="text-sm sm:text-base text-white text-opacity-80 leading-relaxed">
                {t("brand.description")}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                {t("platform.title")}
              </h4>
              <ul className="space-y-2 text-sm sm:text-base text-white text-opacity-90">
                {t.raw("platform.links").map((link: any, idx: number) => (
                  <li key={idx}>
                    <a
                      href={link.url}
                      className="hover:underline hover:text-opacity-100 transition-all"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                {t("support.title")}
              </h4>
              <ul className="space-y-2 text-sm sm:text-base text-white text-opacity-90">
                {t.raw("support.links").map((link: any, idx: number) => (
                  <li key={idx}>
                    <a
                      href={link.url}
                      className="hover:underline hover:text-opacity-100 transition-all"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                {t("legal.title")}
              </h4>
              <ul className="space-y-2 text-sm sm:text-base text-white text-opacity-90">
                {t.raw("legal.links").map((link: any, idx: number) => (
                  <li key={idx}>
                    <a
                      href={link.url}
                      className="hover:underline hover:text-opacity-100 transition-all"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white border-opacity-20 bg-gray-50 text-black py-4 sm:py-6">
        <div className="container-responsive">
          <div className="text-center space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm text-opacity-80">
              &copy; {new Date().getFullYear()} Jobchaja. All rights reserved. |
              Design by Jobchaja
            </p>
            <p className="text-xs sm:text-sm text-opacity-70 leading-relaxed max-w-4xl mx-auto">
              Deposit System: Job Seeker ₩50,000 per application (win ₩50,000
              when hired) | Corporate: ₩50,000 opening + ₩30,000 per post +
              ₩50,000 per interview
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
