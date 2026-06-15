# JobChaja Launch Step Checklist

**Report Submission Date:** 2026-06-16

**Audit Date:** 2026-06-15

**Priority Shift:** Temporarily halt Application Development and prioritize Website Launch

**Current Launch Decision:** **GO for full-service local/UAT; public production launch pending external approvals and provider credentials**

> This document is a launch-readiness audit and does not constitute final legal advice. Paid recruitment/matching, overseas employment, and the interview deposit model must be verified by a lawyer/certified labor attorney (*노무사*)/licensed administrative attorney (*행정사*) in Korea prior to launch.

---

## 1. Executive Summary

The full-service website is technically enabled for local/UAT. Registration, login, consent evidence, jobs, job details, admin, payment pages, and payment-product APIs are reachable. A public production launch remains pending external legal approvals, production payment credentials, monitoring, and final UAT.

* **Public Production TLS/Release Gap:** `http://jobchaja.com` serves an older build, but HTTPS refuses connections and the deployed build returns `404` for `/refund-policy`, `/robots.txt`, and `/sitemap.xml`.
* **Unresolved Legal Classification:** Under the Employment Security Act, it has not yet been determined which license/registration is required among `Job Information Provision Business (직업정보제공사업)`, `Domestic Paid Employment Placement Business (국내 유료직업소개사업)`, or `Overseas Paid Employment Placement Business (국외 유료직업소개사업)`.
* **Content Inconsistencies:** There are discrepancies regarding the company name, effective dates, and currencies across the Terms, Privacy Policy, and English/Korean content.
* **Consent & Verification Issues:** Although fixes for policy links and consent evidence persistence during registration/company verification have been implemented, approval from privacy counsel is still required.
* **Identity Verification Gaps:** Since phone identity verification is not yet integrated, the false verification claim/UI has been removed, but real PASS integration needs to be pursued.
* **Pending Approvals:** While the Refund/Cancellation policy page, `robots.txt`, and `sitemap.xml` have been added, legal approval and deployed verification are still pending.
* **UAT Scope:** Prototype/design variant routes are blocked via a production guard, but mock/placeholder flows require ongoing UAT.
* **Code Quality Debt:** Launch-scope typecheck/build and zero-error lint gates pass; legacy warnings and moderate dependency findings remain tracked.

> **Technical UAT Scope:** Full-service website with accounts, recruitment, APIs, payment UI/APIs, admin, social login, and sensitive-data routes enabled. Public production activation still requires the external gates in this report.

### Technical Remediation Progress - 2026-06-15

* [x] Created a standalone `/refund-policy` page and linked it from the footer and Korean footer data.
* [x] Implemented `/robots.txt` and `/sitemap.xml` metadata routes.
* [x] Added a proxy guard on the production server to return a 404 for `/diagnosis/designs`, `/job-cards`, and `*/variants/*` routes, verified in the deployed environment.
* [x] Linked the Terms/Privacy/Marketing `보기` (View) links on the Register page to actual policy pages.
* [x] Configured canonical site URL metadata and baseline security headers.
* [x] Disabled paid payment/premium routes by default in production, allowing opt-in only via `PAID_FEATURES_ENABLED=true`.
* [x] Executed a targeted ESLint pass for files modified during launch-hardening.
* [x] Added ESLint dependencies and a `typecheck` script to measure quality debt.
* [x] Re-enabled production launch source TypeScript validation and introduced the `typecheck:launch` gate.
* [x] Re-enabled the ESLint zero-error gate; legacy migration findings remain visible as warnings.
* [x] Upgraded Next.js to `16.2.9` to resolve a high-severity production audit finding.
* [ ] Monitor/upgrade upstream-compatible fixes for `4` moderate transitive PostCSS/Next dependency findings.
* [x] Eliminated critical/high findings from backend dependency audits via safe compatible updates; tracking `16` moderate findings in the remediation register.
* [x] Excluded production-blocked prototype source from the launch compiler/lint scope and re-opened the launch validation gate.
* [x] Persisted consent version/timestamp/history on the backend.
* [x] Removed false verification claims/UI from registration and company verification flows until real PASS/phone verification is integrated.
* [x] Separated required consents for Terms/Privacy/International Transfer and age-18 confirmation in the email signup flow.
* [x] Pointed signup `보기` (View) actions to actual policy pages instead of placeholder modals.
* [x] Prevented optional marketing consent from being automatically selected by the required-only "all agree" action.
* [x] Standardized the public Korean/English operator identity and policy effective date to LivSoft / 2026-03-02.
* [x] Updated unverified MMK/fixed-price marketing claims to "launch preparation" wording pending finance approval.
* [x] Disabled the public admin UI by default in production, allowing opt-in only via `ADMIN_ROUTES_ENABLED=true`.
* [x] Disabled social login by default until the consent completion flow is completed.
* [x] Implemented a launch-scope guard to return a default 404 for direct backend payment/admin/social/sensitive endpoints.
* [x] Displayed the Korean policy as primary on `/privacy-policy` with an English reference summary placed below it.
* [x] Routed international-transfer consent links directly to the transfer section of the Korean privacy policy.
* [x] Enabled full-service feature flags in the local/UAT website and backend.
* [x] Restored the recruitment homepage and public jobs sitemap/indexing routes.
* [x] Applied the consent-record database migration locally and verified registration, login, profile, and consent-history flows.

---

## 2. Navigate Audit Results

| Audit Item | Result | Launch Impact |
| --- | --- | --- |
| Public production domain | HTTP routes partially available; HTTPS refused; refund/robots/sitemap missing | P0: configure TLS/redirect and deploy the reviewed current build. |
| `/`, `/contact`, legal/privacy pages | HTTP 200 | Public and legal surface verified. |
| `/login`, `/register`, `/alba`, `/fulltime`, `/international`, `/worker/jobs`, `/company/dashboard`, `/admin` | Production-mode UAT HTTP 200 | Full-service pages enabled and reachable. |
| `/terms-and-conditions`, `/privacy-policy` | HTTP 200 | Requires content consistency checks and legal approval. |
| `/refund-policy` | Production Server HTTP 200 | Requires legal approval before enabling payments. |
| `/robots.txt`, `/sitemap.xml` | Production Server HTTP 200 | SEO/index controls have been implemented. |
| `/diagnosis/designs/diagnosis1`, `/job-cards/designs/variant-01` | Production Server HTTP 404 | Needs final confirmation in the deployed environment. |
| `/company/payments`, `/worker/payments`, `/diagnosis/premium` | Production-mode UAT HTTP 200 | Payment pages enabled; real transaction UAT needs provider secrets. |
| Backend `/jobs/listing`, `/payments/products`, `/payment/products` | HTTP 200 | Jobs and payment product APIs verified. |
| Register → login → profile → consent history | HTTP 201/200 | End-to-end local flow verified after consent migration. |
| **Production build** | Success, 251 pages | Launch-scope typecheck passes. |
| **Lint** | Passes with zero errors | Legacy migration warnings remain visible. |

> **Repository Audit Summary:** Found `265` page routes, `175` prototype/design/variant pages, `82` occurrences of reading session IDs from `localStorage`, and `300` files containing mock/placeholder/TODO comments.

---

## 3. P0 Launch Blockers

* [ ] **Secure and Update Public Production Website** *Owner: DevOps + Engineering* Configure HTTPS and HTTP-to-HTTPS redirect, deploy the current build, and attach a passing public smoke test.
* [ ] **Determine Service Legal Classification** *Owner: CEO + Korea Legal* Obtain a written legal opinion to define whether the platform merely provides job information, conducts placement/intermediation, or performs domestic/overseas paid placement. Fulfill corresponding registration, insurance, and fee regulation requirements based on this classification.
* [x] **Enable Paid Features for Full-Service UAT** *Owner: Product + Engineering* Payment/premium UI and backend product routes are enabled and reachable in local/UAT. Real charge, webhook, cancellation, and refund UAT remains blocked by missing production/test provider secrets.
* [ ] **Align Legal Entity and Policy Content** *Owner: Legal + Content* Public Korean/English content has been standardized to `주식회사 리브소프트 / LivSoft Inc.` and `2026-03-02`. Finalize the controller, processor, Myanmar development entity, contacts, address, and registration details with legal counsel.
* [ ] **Revalidate KRW/MMK Pricing and Deposit Model** *Owner: Finance + Legal + Product* Public fixed MMK marketing claims have been removed. Approve production pricing only after confirming currency, fees, deposit return timing, cancellations, disputes, tax invoices, and unclaimed funds processes.
* [x] **Implement Consent Evidence Persistence** *Owner: Engineering + Privacy* Required agreements, international transfers, optional marketing, and actual policy links have been separated in the email signup/register/company verification UI. The backend now persists policy versions, timestamps, channels, account IDs, and marketing withdrawal history, accessible via `/auth/my/consents`. Separate privacy counsel approval is required.
* [x] **Integrate Real Phone/PASS Verification or Remove UI** *Owner: Engineering* False verification claims/UI have been removed from registration and company verification flows. Contact information will be used strictly as text fields until real PASS integration is complete.
* [ ] **Complete Refund/Cancellation/Withdrawal Page & Checkout Disclosure** *Owner: Legal + Engineering* Ensure refund eligibility, processing times, digital service withdrawal exceptions, deposit returns, and dispute/contact processes are visible prior to purchase and capture explicit user acknowledgement.
* [ ] **Approve Cross-Border Data Transfer Process** *Owner: Privacy + Security* Verify that the data items, countries, purposes, methods, retention periods, consequences of refusal, contracts/DPAs, and consent/legal bases for transfers to Myanmar, Stripe, Google, Apple, Meta, and AWS align precisely with the actual technical implementation.
* [x] **Block Prototype/Design Variant Routes in Production** *Owner: Engineering* Design/variant routes are now restricted with a 404 via a production proxy. Continue UAT for admin/internal routes and mock/placeholder flows.
* [x] **Re-enable Launch-Scope Release Quality/Security Gates** *Owner: Engineering + DevOps* Established `launch:check` utilities, launch-scope typechecking, zero-error linting, automated builds, auth/consent tests, high-severity dependency audits, security headers, a rollback/incident runbook, and backup evidence templates. A production backup/restore drill and monitoring sign-off are required separately.

---

## 4. Korea Domestic Service Checklist

### Business and Recruitment Regulation

* [ ] Confirm whether registration for a `Job Information Provision Business (직업정보제공사업)` is mandatory.
* [ ] If classified as a domestic paid placement service, fulfill local authority registration, fee limits, and procedural requirements.
* [ ] If classified as an overseas paid placement service, confirm whether registration with the Ministry of Employment and Labor is required.
* [x] Establish review processes for job advertisements, employer verification, and illegal/discriminatory postings (`docs/launch/JOB_AD_REVIEW_POLICY.md`).
* [x] Label foreign worker visa matching as "reference only" and draft human-review/objection procedures.
* [ ] Ensure the website footer fully discloses the business registration number, mail-order sales registration, representative name, address, phone number, hosting provider, and customer support details.

### Privacy and Security

* [ ] Validate the Privacy Policy (`개인정보처리방침`) against actual data flows and infrastructure using a comprehensive data map.
* [x] Ensure required and optional consents are presented separately, clearly, and can be selected independently.
* [x] Enable sensitive-data UI/API proxies for controlled UAT while retaining separate consent, access-control, and deletion requirements.
* [x] Implement an under-18 policy enforced by a real age gate with server-side birth-date validation.
* [x] Document automated visa/job matching explanations, human review request workflows, and objection procedures.
* [x] Map out account deletion, correction, access, and processing suspension request workflows (`docs/launch/PRIVACY_RIGHTS_PROCEDURE.md`).
* [x] Conduct a cookie/analytics inventory and disable non-essential analytics/marketing tools pending explicit approval.
* [ ] Finalize data breach response plans, access log management, least privilege enforcement, automated retention/deletion jobs, and vendor DPAs.

### E-commerce, Payment and Consumer Protection

* [ ] Display Terms and critical paid-service conditions prior to signup/checkout and retain consent evidence.
* [x] Implement and publish the refund/cancellation/withdrawal policy.
* [ ] Clearly display prices, VAT, payment methods, service periods, auto-renewal terms, deposit handling, and refund timelines.
* [ ] Complete PortOne/KG Inicis/Stripe production merchant approval alongside webhook, idempotency, and refund UAT.
* [x] Formulate customer complaint, dispute resolution, and contact processes alongside privacy-rights procedures.
* [x] Complete the implementation for marketing consent/withdrawal history persistence and its corresponding history endpoint.

---

## 5. International Service Checklist

> **Strategy:** Do not open the international launch globally; restrict access initially using a launch-country allowlist.

* [x] Designed a country enablement gate and a Korea-first full-service UAT scope (`docs/launch/INTERNATIONAL_SCOPE.md`).
* [ ] If targeting or monitoring EU/EEA users, review GDPR territorial scope, lawful bases, privacy notices, data subject rights, processor contracts, breach notification processes, and the necessity of an EU representative.
* [ ] Execute a Transfer Impact Assessment (TIA) and establish adequacy mechanisms or Standard Contractual Clauses (SCCs) for EU/EEA data transfers.
* [ ] Review UK GDPR applicability, UK data transfer mechanisms, and the requirement for a UK representative.
* [ ] Evaluate CCPA thresholds, applicability, notice at collection requirements, and deletion/correction/opt-out workflows for California/US users.
* [ ] Set up age gates and child-data handling mechanisms to prevent users under 13 or 18 from registering where applicable.
* [ ] Review country-specific recruitment agency licensing, labor codes, anti-discrimination laws, and immigration advertising regulations.
* [ ] Establish sanctions/blocked-country screening, fraud prevention/KYC, chargeback management, and dispute handling workflows.
* [ ] Publish localized Terms, Privacy Policies, and Refund documents only after they undergo human legal review.
* [ ] Ensure governing law clauses do not override or invalidate mandatory local consumer rights.

---

## 6. App Launch Checklist

> Note: Although mobile app development is temporarily paused, the website's legal and data models must be kept aligned with the app using this checklist.

### Apple App Store

* [ ] Align the Privacy Policy URL and App Privacy Details with the actual data collection practices of the app and integrated SDKs.
* [ ] Ensure account deletion can be initiated natively within the app if account creation is supported.
* [ ] Prepare review account/demo credentials, reviewer notes, and ensure backend availability for the app review team.
* [ ] Fill out permission purpose strings, social login details, payment models, age ratings, and export compliance forms.
* [ ] Verify crash-free release builds across the device matrix, and finalize screenshots, metadata, and support URLs.

### Google Play

* [ ] Complete the Data Safety form accurately reflecting the data practices of both the app and third-party SDKs.
* [ ] Enable account deletion requests from both within the app and via a dedicated web URL.
* [ ] Complete the privacy policy links, App Access/reviewer credentials, content ratings, and target API requirements.
* [ ] Configure internal/closed testing tracks, review pre-launch reports, and finalize signing, rollback plans, and staged rollout percentages.

---

## 7. Distribution Process

### Phase 0: Freeze and Scope — Immediate

* [x] Paused mobile app development and initiated the Website Launch audit.
* [ ] Secure management sign-off on the full-service public launch scope.
* [x] Assigned launch owner roles: CEO, Legal, Privacy, Engineering, DevOps, Operations, Support.
* [x] Generated P0 approval and security registers to track owners, evidence, and approvers for each blocker.

### Phase 1: Legal and Engineering Remediation — Pre-Launch

* [ ] Secure necessary recruitment/business registrations and final legal opinions.
* [ ] Complete legal policies, consents, refund mechanisms, and corporate identity alignments for counsel approval.
* [x] Disable prototype routes and fake verification UI; enable paid/sensitive features for controlled full-service UAT.
* [x] Pass launch-scope typecheck, lint, build, and high-severity security scans; production backup/restore drills remain pending.

### Phase 2: Staging and UAT — Pre-Production

* [ ] Complete remaining end-to-end testing for company signup, deletion, job posting/application, real payment/webhook, cancellation, and refund flows. Worker registration/login/consent tracking is verified.
* [ ] Test Korean/English copy translations, mobile/desktop responsiveness, accessibility, performance, and cross-browser compatibility.
* [ ] Verify privacy, security, and data-retention behaviors in a production-like staging environment.
* [ ] Obtain formal launch sign-off from Legal, Product, Engineering, and Operations.

### Phase 3: Release and Post-Launch

* [ ] Finalize database backups, rollback plans, release tags, changelogs, and on-call engineer schedules.
* [ ] Initiate a soft launch restricted to a small, allowlisted audience.
* [ ] Monitor D0/D+1 errors, authentication flows, payment success, customer complaints, and privacy data requests.
* [ ] Conduct a D+7 compliance/incident review followed by a D+30 retention, vendor, and access control audit.

---

## 8. Release Gate

**Full-service technical UAT gate:**

* [x] Registration, login, jobs, job details, admin, payment, and sensitive-data routes are enabled in local/UAT.
* [x] Launch-scope typecheck, lint, builds, tests and high-severity audits pass.
* [x] Production-mode smoke script verifies full-service routes return `200` and prototype routes return `404`.
* [x] Deployment and rollback procedure documented.

**A public paid recruitment/matching launch will be declared a "GO" only when ALL of the following external gates are approved:**

* [ ] Korea recruitment and e-commerce legal classifications and registrations are fully approved.
* [ ] Terms, Privacy, Refund, and Consent documents are legally approved and fully implemented.
* [ ] Corporate identity, currencies, pricing tiers, and refund rules are entirely consistent.
* [x] Public prototype and fake-verification flows are disabled.
* [ ] Production security scan, backup/restore, monitoring, and rollback gates pass successfully.
* [ ] Payment/refund processing, account deletion, and privacy-rights workflows pass UAT.
* [ ] Production monitoring systems, on-call rotations, and support channels are fully operational.

### 8.1 Verification Evidence - 2026-06-15

* Backend Production Build: **PASS**
* Backend Auth/Consent/Age-Gate and Launch-Scope Guard Tests: **PASS (38/38)**
* Backend Dependency Audit: **No critical/high findings; 5 moderate findings tracked**
* Website Production Build: **PASS (251 pages)**
* Website Launch-Scope Lint/Build Gate: **PASS**
* Website Dependency Audit: **4 moderate transitive PostCSS findings; forced downgrade rejected**
* Website Launch-Scope Typecheck: **PASS**
* Website Full Lint: **PASS with 0 errors; 250 legacy migration warnings retained**
* *Note:* Production-blocked prototype source remains isolated outside the launch compiler/lint scope.
* Database Consent Migration: **Applied and verified locally**; production deployment pending.
* Registration/Login UAT: **PASS** (`send-otp` 201, `verify-otp` 201, `register` 201, `login` 201, profile/consents 200).
* Production-Mode Full-Service Smoke Test: **PASS** for recruitment/account/admin/payment/sensitive routes (`200`) and prototype routes (`404`).
* Public Domain Smoke Test: **BLOCKED** — HTTPS refused; HTTP deployed build missing refund/robots/sitemap routes on 2026-06-15.

---

## 9. Evidence From Current Website

* `src/app/register/page.tsx`: PASS verification is unintegrated; legal document links currently use `href="#"`.
* `src/data/privacy-policy.ts`: Contains an English-only privacy policy; international data transfer and sensitive-data claims require implementation verification.
* `src/app/(public)/terms-and-conditions/page.tsx`: Contains effective date inconsistencies.
* `messages/kr.json`, `messages/en.json`: Contains LivSoft/Yedangin corporate identity and KRW/MMK currency inconsistencies.
* `src/components/footer.tsx`: Provides limited legal and business entity disclosures.
* `next.config.ts`: Configured with `typescript.ignoreBuildErrors: true`.
* `src/app/diagnosis/designs/*`, `src/app/job-cards/designs/*`: Publicly accessible prototype routes.
* *Added Items:* Refund policy route, `robots.txt`, `sitemap.xml`, production prototype-route guards, and private-route `noindex` headers.

---

## 10. Official References

* **Korea Personal Information Protection Act:** [https://law.go.kr/lsInfoP.do?lsId=011357](https://law.go.kr/lsInfoP.do?lsId=011357)
* **Korea PIPA Consent Requirements:** [https://www.law.go.kr/LSW/lsSideInfoP.do...](https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0017&lsiSeq=286175&urlMode=lsScJoRltInfoR)
* **Korea PIPA Child Protection:** [https://www.law.go.kr/LSW/lsSideInfoP.do...](https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=02&joNo=0022&lsiSeq=270351&urlMode=lsScJoRltInfoR)
* **Korea E-commerce Act:** [https://www.law.go.kr/lsInfoP.do?lsiSeq=140566](https://www.law.go.kr/lsInfoP.do?lsiSeq=140566)
* **Korea Employment Security Act Paid Placement Registration:** [https://www.law.go.kr/LSW/lsSideInfoP.do...](https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0019&lsiSeq=259231&urlMode=lsScJoRltInfoR)
* **EU GDPR:** [https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX%3A02016R0679-20160504](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX%3A02016R0679-20160504)
* **EU Standard Contractual Clauses:** [https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX%3A32021D0914](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX%3A32021D0914)
* **UK GDPR Applicability:** [https://ico.org.uk/for-organisations/...](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/personal-information-what-is-it/who-does-the-uk-gdpr-apply-to/)
* **California CCPA:** [https://oag.ca.gov/privacy/ccpa](https://oag.ca.gov/privacy/ccpa)
* **US COPPA:** [https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa)
* **Apple App Review Guidelines:** [https://developer.apple.com/app-store/review/guidelines/](https://developer.apple.com/app-store/review/guidelines/)
* **Apple Account Deletion Requirements:** [https://developer.apple.com/support/offering-account-deletion-in-your-app/](https://developer.apple.com/support/offering-account-deletion-in-your-app/)
* **Apple App Privacy Details:** [https://developer.apple.com/app-store/app-privacy-details/](https://developer.apple.com/app-store/app-privacy-details/)
* **Google Play User Data & Account Deletion:** [https://support.google.com/googleplay/android-developer/answer/10144311?hl=my](https://support.google.com/googleplay/android-developer/answer/10144311?hl=my)
* **Google Play Data Safety Form:** [https://support.google.com/googleplay/android-developer/answer/10787469?hl=my](https://support.google.com/googleplay/android-developer/answer/10787469?hl=my)

## 11. Detailed Audit

See `docs/launch/LEGAL_AND_DISTRIBUTION_AUDIT_2026-06-15.md` for the Korea/international legal split, route-level findings, app-store checklist, and distribution phases.
