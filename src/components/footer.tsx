"use client";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="text-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 bg-primary py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">{t("brand.title")}</h3>
            <p className="text-sm text-opacity-80">{t("brand.description")}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("platform.title")}</h4>
            <ul className="space-y-2 text-sm text-opacity-90">
              {t.raw("platform.links").map((link: any, idx: number) => (
                <li key={idx}>
                  <a href={link.url} className="hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("support.title")}</h4>
            <ul className="space-y-2 text-sm text-opacity-90">
              {t.raw("support.links").map((link: any, idx: number) => (
                <li key={idx}>
                  <a href={link.url} className="hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("legal.title")}</h4>
            <ul className="space-y-2 text-sm text-opacity-90">
              {t.raw("legal.links").map((link: any, idx: number) => (
                <li key={idx}>
                  <a href={link.url} className="hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white border-opacity-20 pt-8 text-center text-sm text-opacity-80 text-black py-5 ">
        <p>
          &copy; {new Date().getFullYear()} Jobchaja. All rights reserved. |
          Design by Jobchaja
        </p>
        <p>
          Deposit System: Job Seeker ₩50,000 per application (win ₩50,000 when
          hired) | Corporate: ₩50,000 opening + ₩30,000 per post + ₩50,000 per
          interview
        </p>
      </div>
    </footer>
  );
}
