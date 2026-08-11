import assert from "node:assert/strict";
import { test } from "node:test";
// Node's built-in strip-types runner requires the explicit extension.
// @ts-expect-error allowImportingTsExtensions is intentionally disabled for app builds.
import {
  COMPANY_FAQ_COPY,
  COMPANY_FAQ_ITEMS,
  filterCompanyFaqItems,
  getCompanyFaqCounts,
} from "./company-faq-data.ts";

const locales = ["ko", "en", "vi", "th", "fil"] as const;

test("every FAQ has a stable id and complete launch-locale content", () => {
  const ids = new Set<string>();

  for (const item of COMPANY_FAQ_ITEMS) {
    assert.match(item.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(ids.has(item.id), false, `duplicate FAQ id: ${item.id}`);
    assert.match(item.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
    ids.add(item.id);

    for (const locale of locales) {
      const translation = item.translations[locale];
      assert.ok(
        translation.question.trim(),
        `${item.id}.${locale} question is empty`,
      );
      assert.ok(
        translation.answer.trim(),
        `${item.id}.${locale} answer is empty`,
      );
      assert.ok(COMPANY_FAQ_COPY[locale].title.trim());
      assert.ok(COMPANY_FAQ_COPY[locale].categoryLabels[item.category].trim());
    }
  }
});

test("category counts match the source list", () => {
  const counts = getCompanyFaqCounts(COMPANY_FAQ_ITEMS);

  assert.equal(counts.all, COMPANY_FAQ_ITEMS.length);
  assert.equal(counts.account, 2);
  assert.equal(counts["job-posting"], 2);
  assert.equal(counts.payment, 2);
  assert.equal(counts["visa-matching"], 3);
  assert.equal(counts.other, 1);
});

test("search uses the selected locale across questions and answers", () => {
  assert.deepEqual(
    filterCompanyFaqItems(COMPANY_FAQ_ITEMS, "en", "all", "refund").map(
      (item) => item.id,
    ),
    ["credit-refund"],
  );
  assert.deepEqual(
    filterCompanyFaqItems(COMPANY_FAQ_ITEMS, "vi", "all", "hoàn tiền").map(
      (item) => item.id,
    ),
    ["credit-refund"],
  );
  assert.deepEqual(
    filterCompanyFaqItems(COMPANY_FAQ_ITEMS, "th", "all", "การตีความ").map(
      (item) => item.id,
    ),
    ["visa-policy-updates"],
  );
  assert.deepEqual(
    filterCompanyFaqItems(COMPANY_FAQ_ITEMS, "fil", "all", "card number").map(
      (item) => item.id,
    ),
    ["technical-support"],
  );
});

test("category and query filters are applied together", () => {
  assert.deepEqual(
    filterCompanyFaqItems(
      COMPANY_FAQ_ITEMS,
      "ko",
      "visa-matching",
      "행정 해석",
    ).map((item) => item.id),
    ["visa-policy-updates"],
  );
  assert.deepEqual(
    filterCompanyFaqItems(COMPANY_FAQ_ITEMS, "ko", "payment", "행정 해석"),
    [],
  );
});
