"use client";

import { useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export const locales = ["en", "kr"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "🇺🇸  English",
  kr: "🇰🇷  Korea",
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale || "en";

  const changeLanguage = (locale: string) => {
    // Get the current path segments
    const pathSegments = pathname.split("/").filter(Boolean);

    // Check if the first segment is a locale
    const isFirstSegmentLocale = locales.includes(pathSegments[0] as Locale);

    // Get the path without the current locale prefix
    const pathWithoutLocale = isFirstSegmentLocale
      ? pathSegments.slice(1).join("/")
      : pathSegments.join("/");

    // Create the new path with the selected locale
    const newPath = `/${locale}${
      pathWithoutLocale ? `/${pathWithoutLocale}` : ""
    }`;

    // Set the NEXT_LOCALE cookie
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`; // 1 year

    // Use window.location for a full page reload to ensure translations are applied
    window.location.href = newPath;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="language-button flex items-center gap-2 px-6 rounded-lg"
        >
          {/* <Globe className="icon h-4 w-4" /> */}
          {localeNames[currentLocale as Locale] || "Language"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => changeLanguage(locale)}
            className={`animated-menu-item language-button ${
              locale === currentLocale ? "font-bold" : ""
            }`}
          >
            <span className="menu-icon inline-flex items-center">
              {localeNames[locale]}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
