"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, Lang } from "@/i18n/LanguageProvider"; 
import { ChevronDown, Check } from "lucide-react"; 

/* =====================
 * Language Config
 * ===================== */

const LANGUAGES: {
  code: Lang;
  label: string;
  flag: string; // 국가 코드 (ISO 3166-1 alpha-2)
}[] = [
  { code: "en", label: "English", flag: "us" }, // 영어 (미국 국기 사용, 필요시 gb로 변경)
  { code: "ko", label: "한국어", flag: "kr" },
  { code: "ja", label: "日本語", flag: "jp" },
  { code: "vi", label: "Tiếng Việt", flag: "vn" },
  { code: "th", label: "ภาษาไทย", flag: "th" },
  { code: "tl", label: "Tagalog", flag: "ph" }, // Filipino -> Tagalog (자국어 표기)
];

/* =====================
 * Flag Icon Component (CDN 적용)
 * ===================== */

function FlagIcon({ code, className = "w-5 h-5" }: { code: string; className?: string }) {
  // FlagCDN 무료 이미지 사용 (w80 사이즈)
  const cdnUrl = `https://flagcdn.com/w80/${code.toLowerCase()}.png`;

  return (
    <img
      src={cdnUrl}
      alt={`${code} flag`}
      // object-cover와 rounded-full을 사용하여 직사각형 국기를 원형으로 깔끔하게 자름
      className={`rounded-full object-cover border border-slate-100 shadow-sm bg-slate-100 ${className}`}
    />
  );
}

/* =====================
 * Language Switcher
 * ===================== */

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  // 현재 선택된 언어 객체 찾기
  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 pl-2 pr-3 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-full shadow-sm transition-all duration-200 flex items-center gap-2 group"
          aria-label="Change language"
        >
          {/* 현재 선택된 국기 */}
          <FlagIcon code={currentLang.flag} />
          
          {/* 언어 이름 */}
          <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 pt-0.5">
            {currentLang.label}
          </span>

          {/* 화살표 아이콘 */}
          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        sideOffset={8}
        className="w-40 bg-white rounded-xl border border-slate-100 shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-200"
      >
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`
              flex items-center justify-between w-full px-3 py-2.5 rounded-lg cursor-pointer outline-none transition-colors
              ${l.code === lang ? "bg-slate-50" : "hover:bg-slate-50"}
            `}
          >
            <div className="flex items-center gap-3">
              <FlagIcon code={l.flag} className="w-4 h-4" />
              <span className={`text-sm pt-0.5 ${l.code === lang ? "font-bold text-slate-900" : "font-medium text-slate-600"}`}>
                {l.label}
              </span>
            </div>
            
            {/* 선택된 항목에만 체크 표시 */}
            {l.code === lang && (
              <Check className="w-3.5 h-3.5 text-sky-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}