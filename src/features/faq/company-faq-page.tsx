"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronDown,
  HelpCircle,
  MessageSquare,
  Search,
  X,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { normalizeLocale } from "@/i18n/locales";
import {
  COMPANY_FAQ_COPY,
  COMPANY_FAQ_ITEMS,
  FAQ_CATEGORIES,
  filterCompanyFaqItems,
  getCompanyFaqCounts,
  getCompanyFaqTranslation,
  type CompanyFaqItem,
  type FaqCategory,
} from "./company-faq-data";

const FAQ_HASH_PREFIX = "#faq-";

function faqHash(id: string) {
  return `${FAQ_HASH_PREFIX}${id}`;
}

function getFaqIdFromHash(hash: string) {
  if (!hash.startsWith(FAQ_HASH_PREFIX)) return null;
  const id = decodeURIComponent(hash.slice(FAQ_HASH_PREFIX.length));
  return COMPANY_FAQ_ITEMS.some((item) => item.id === id) ? id : null;
}

function replaceHash(id: string | null) {
  const nextUrl = id
    ? `${window.location.pathname}${window.location.search}${faqHash(id)}`
    : `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, "", nextUrl);
}

type AccordionItemProps = {
  item: CompanyFaqItem;
  locale: ReturnType<typeof normalizeLocale>;
  categoryLabel: string;
  answerLabel: string;
  reviewedAtLabel: string;
  isOpen: boolean;
  openLabel: string;
  closeLabel: string;
  onToggle: () => void;
};

function AccordionItem({
  item,
  locale,
  categoryLabel,
  answerLabel,
  reviewedAtLabel,
  isOpen,
  openLabel,
  closeLabel,
  onToggle,
}: AccordionItemProps) {
  const text = getCompanyFaqTranslation(item, locale);
  const triggerId = `faq-trigger-${item.id}`;
  const panelId = `faq-panel-${item.id}`;

  return (
    <li
      id={`faq-${item.id}`}
      className={`scroll-mt-24 overflow-hidden rounded-lg border bg-white transition-colors ${
        isOpen ? "border-blue-300" : "border-gray-200 hover:border-blue-200"
      }`}
    >
      <h2>
        <button
          id={triggerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={isOpen ? closeLabel : openLabel}
          onClick={onToggle}
          className="flex min-h-16 w-full items-start gap-3 px-4 py-4 text-left outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 sm:px-5"
        >
          <span
            aria-hidden="true"
            className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-[#0066FF]"
          >
            Q
          </span>
          <span className="min-w-0 flex-1">
            <span className="mb-1 block text-xs font-medium text-blue-700">
              {categoryLabel}
            </span>
            <span className="block text-sm font-semibold leading-6 text-gray-950 sm:text-base">
              {text.question}
            </span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`mt-1 size-5 shrink-0 text-gray-500 transition-transform motion-reduce:transition-none ${
              isOpen ? "rotate-180 text-blue-600" : ""
            }`}
          />
        </button>
      </h2>

      {isOpen ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className="border-t border-blue-100 bg-blue-50/40 px-4 py-4 sm:px-5"
        >
          <div className="flex items-start gap-3">
            <span
              aria-label={answerLabel}
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700"
            >
              A
            </span>
            <div className="min-w-0">
              <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
                {text.answer}
              </p>
              <p className="mt-3 text-xs text-gray-500">{reviewedAtLabel}</p>
            </div>
          </div>
        </div>
      ) : null}
    </li>
  );
}

export default function CompanyFaqPageContent() {
  const { lang } = useLanguage();
  const locale = normalizeLocale(lang);
  const copy = COMPANY_FAQ_COPY[locale];
  const counts = useMemo(() => getCompanyFaqCounts(COMPANY_FAQ_ITEMS), []);
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const syncHash = () => setOpenId(getFaqIdFromHash(window.location.hash));
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const filteredItems = useMemo(
    () =>
      filterCompanyFaqItems(
        COMPANY_FAQ_ITEMS,
        locale,
        activeCategory,
        searchQuery,
      ),
    [activeCategory, locale, searchQuery],
  );

  const changeCategory = (category: FaqCategory) => {
    setActiveCategory(category);
    setOpenId(null);
    replaceHash(null);
  };

  const changeSearch = (value: string) => {
    setSearchQuery(value);
    setOpenId(null);
    replaceHash(null);
  };

  const resetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setOpenId(null);
    replaceHash(null);
  };

  const toggleItem = (id: string) => {
    const next = openId === id ? null : id;
    setOpenId(next);
    replaceHash(next);
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-950">{copy.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          {copy.subtitle}
        </p>
      </header>

      <section aria-label={copy.searchLabel} className="mb-6">
        <label htmlFor="company-faq-search" className="sr-only">
          {copy.searchLabel}
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400"
          />
          <input
            id="company-faq-search"
            type="search"
            value={searchQuery}
            onChange={(event) => changeSearch(event.target.value)}
            placeholder={copy.searchPlaceholder}
            autoComplete="off"
            className="min-h-12 w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-12 text-base text-gray-950 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {searchQuery ? (
            <button
              type="button"
              aria-label={copy.clearSearch}
              title={copy.clearSearch}
              onClick={() => changeSearch("")}
              className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 outline-none hover:bg-gray-100 hover:text-gray-800 focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          ) : null}
        </div>
      </section>

      <div
        role="group"
        aria-label={copy.categoriesLabel}
        className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {FAQ_CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => changeCategory(category)}
              className={`min-h-11 shrink-0 rounded-lg border px-3.5 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                isActive
                  ? "border-[#0066FF] bg-[#0066FF] text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-700"
              }`}
            >
              {copy.categoryLabels[category]}
              <span
                className={`ml-1.5 text-xs ${isActive ? "text-blue-100" : "text-gray-500"}`}
              >
                {counts[category]}
              </span>
            </button>
          );
        })}
      </div>

      <p
        aria-live="polite"
        aria-atomic="true"
        className="mb-3 text-sm text-gray-600"
      >
        {copy.resultCount(filteredItems.length)}
      </p>

      {filteredItems.length ? (
        <ul className="space-y-3">
          {filteredItems.map((item) => {
            const text = getCompanyFaqTranslation(item, locale);
            return (
              <AccordionItem
                key={item.id}
                item={item}
                locale={locale}
                categoryLabel={copy.categoryLabels[item.category]}
                answerLabel={copy.answerLabel}
                reviewedAtLabel={copy.reviewedAt(item.reviewedAt)}
                isOpen={openId === item.id}
                openLabel={copy.openAnswer(text.question)}
                closeLabel={copy.closeAnswer(text.question)}
                onToggle={() => toggleItem(item.id)}
              />
            );
          })}
        </ul>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white px-5 py-12 text-center">
          <HelpCircle
            aria-hidden="true"
            className="mx-auto size-8 text-gray-300"
          />
          <h2 className="mt-4 text-base font-semibold text-gray-900">
            {copy.emptyTitle(searchQuery.trim())}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
            {copy.emptyBody}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 min-h-11 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 outline-none hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {copy.reset}
          </button>
        </div>
      )}

      <aside
        className="mt-8 border-y border-amber-200 bg-amber-50 px-4 py-5"
        aria-labelledby="faq-policy-title"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-amber-700"
          />
          <div>
            <h2
              id="faq-policy-title"
              className="text-sm font-semibold text-amber-950"
            >
              {copy.policyNoticeTitle}
            </h2>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              {copy.policyNoticeBody}
            </p>
          </div>
        </div>
      </aside>

      <section className="mt-8 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0066FF]">
            <MessageSquare aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-gray-950">
              {copy.contactTitle}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {copy.contactBody}
            </p>
          </div>
        </div>
        <Link
          href="/company/support/inquiry"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0066FF] px-5 py-2 text-sm font-semibold text-white outline-none hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <MessageSquare aria-hidden="true" className="size-4" />
          {copy.contactAction}
        </Link>
      </section>
    </main>
  );
}
