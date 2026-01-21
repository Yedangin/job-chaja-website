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
          <div className="text-center space-y-3 sm:space-y-4">

            <p className="text-xs sm:text-sm text-opacity-70 leading-relaxed max-w-4xl mx-auto">
              <span className="font-medium">{t("company.name")}</span> <br />
              {t("company.ceo")} <br />
              {t("company.address")} <br />
              {t("company.registration")} | {t("company.contact")}
            </p>

            {/* <p className="text-xs sm:text-sm text-opacity-70 leading-relaxed max-w-4xl mx-auto">
              {t("depositInfo")}
            </p> */}
            <p className="text-xs sm:text-sm text-opacity-80">
              {t("copyright", { year: new Date().getFullYear() })}
            </p>

          </div>
        </div>
      </div>

    </footer>
  );
}
