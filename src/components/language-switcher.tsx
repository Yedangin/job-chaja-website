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

// --- Configuration ---
export const locales = ["en", "kr", "my"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  kr: "Korean",
  my: "Myanmar",
};

// Base path for flags in the public directory (Assumes /public/flags/...)
const FLAG_BASE_PATH = "/flag";

// 🚩 UPDATED MAPPING: 'en' now maps to 'gb' (Great Britain/UK flag)
const localeToFlagCode: Record<Locale, string> = {
  en: "gb", // Assuming you've changed the English flag from 'us' to 'gb'
  kr: "kr",
  my: "mm",
};
// --- End Configuration ---

// 🚩 FlagIcon Component using the standard <img> tag
// This assumes your files are at /public/flags/gb.png and /public/flags/kr.png
const FlagIcon = ({ code }: { code: string }) => {
  const src = `${FLAG_BASE_PATH}/${code}.png`;

  return (
    <img
      src={src}
      alt={`${code.toUpperCase()} Flag`}
      className="w-5 h-5 rounded-sm shadow-sm object-cover flex-shrink-0"
      width={20}
      height={20}
      // Added a small border for visibility, especially if the flag has white edges
      style={{ border: "1px solid #e5e7eb" }}
      onError={(e) => {
        // Optional: Handle case where flag image is missing
        const target = e.target as HTMLImageElement;
        target.onerror = null; // prevents looping
        target.src = "placeholder.png"; // Replace with a generic placeholder image if needed
        target.alt = "Flag not found";
      }}
    />
  );
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params.locale as string) || "en";
  const activeLocale = currentLocale as Locale;

  const changeLanguage = (locale: string) => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const isFirstSegmentLocale = locales.includes(pathSegments[0] as Locale);

    const pathWithoutLocale = isFirstSegmentLocale
      ? pathSegments.slice(1).join("/")
      : pathSegments.join("/");

    const newPath = `/${locale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ""
      }`;

    // Set the NEXT_LOCALE cookie
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; Secure; SameSite=Lax`;

    window.location.href = newPath;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Button Style: Clean, round, icon-only */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-8 w-8 sm:h-9 sm:w-9 border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          aria-label={`Current language: ${localeNames[activeLocale]}`}
        >
          <Globe className="h-4 w-4 sm:h-[1.1rem] sm:w-[1.1rem] text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36 sm:w-40">
        <div className="py-1 px-2 text-xs sm:text-sm font-medium text-gray-500 border-b dark:text-gray-400 dark:border-gray-700">
          Select Language
        </div>
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => changeLanguage(locale)}
            className={`cursor-pointer flex items-center gap-2 sm:gap-3 py-2 ${locale === activeLocale
                ? "bg-gray-100 font-semibold dark:bg-gray-800 text-primary"
                : "text-gray-700 dark:text-gray-200"
              }`}
          >
            {/* Display the Flag Icon */}
            <FlagIcon code={localeToFlagCode[locale]} />

            {/* Display the Language Name */}
            <span className="flex-grow text-sm sm:text-base">
              {localeNames[locale]}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
