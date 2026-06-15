# JobChaja Legal and Distribution Audit

**Audit date:** 2026-06-15  
**Scope:** Full-service website, Korea-first launch, international expansion, iOS/Android preparation  
**Decision:** Local/UAT is operational. Public production launch is **NO-GO** until the P0 gates below are closed.

> This is an engineering and product compliance audit, not a legal opinion. Korea recruitment-service classification, paid placement, overseas placement, interview deposits, and final policy text require written approval from qualified Korean counsel and the relevant authorities.

## 1. Public Navigation Result

The production domain was tested directly on 2026-06-15.

| Route group | Result | Impact |
|---|---|---|
| `http://jobchaja.com/` | HTTP `200` | An older build is available over insecure HTTP |
| `https://jobchaja.com/` | Connection refused (`HTTP 000`) | P0: TLS/public secure service is unavailable |
| HTTP `/terms-and-conditions`, `/privacy-policy` | HTTP `200` | Accessible only over insecure HTTP |
| HTTP `/refund-policy` | HTTP `404` | Required refund policy is missing from deployed build |
| HTTP `/register`, `/login`, `/alba`, `/fulltime`, `/international` | HTTP `200` | Deployed routes exist but must be served over HTTPS |
| HTTP `/company/payments/checkout` | HTTP `200` | Payment page must not launch without HTTPS/provider/legal gates |
| HTTP `/robots.txt`, `/sitemap.xml` | HTTP `404` | SEO/indexing controls are missing from deployed build |

**Required closure:** Configure TLS/HTTPS and HTTP-to-HTTPS redirect, deploy the reviewed current build, then run `scripts/production-smoke.sh https://jobchaja.com` and attach the output to the release ticket.

## 2. Repository Navigation Findings

### Implemented

- Terms, Privacy Policy, Refund Policy, contact, and privacy-rights request pages exist.
- Registration separates required terms/privacy/international-transfer consent from optional marketing consent.
- Backend records policy version, timestamp, channel, user, IP/user agent, and withdrawal history.
- Worker registration, email OTP, login, profile, consent history, jobs list/detail, payment products, and payment order creation passed local UAT.
- Business verification collects business-registration evidence and consent.
- Production proxy blocks prototype/design routes.
- Checkout now requires acknowledgement of purchase terms and refund/withdrawal restrictions before payment.

### P0/P1 Gaps Found

| ID | Finding | Severity | Required action |
|---|---|---|---|
| WEB-01 | HTTPS refuses connections; deployed HTTP build is missing refund/robots/sitemap routes | P0 | Configure TLS and redirect, deploy current build, then verify all routes and APIs |
| WEB-02 | Nginx attack-pattern rule blocks every URL containing `admin`, including legitimate `/admin` routes | P1 | Replace broad URI match with explicit exploit paths or keep admin on a separately controlled host |
| LEGAL-01 | No written classification for job-information provider vs domestic/overseas paid placement | P0 | Obtain written Korean legal/authority determination before public recruitment/payment launch |
| LEGAL-02 | Footer lacks mail-order sales registration number, receiving authority, job-information/placement registration number, and hosting provider | P0 | Obtain registrations and publish verified details; do not invent placeholders |
| PAY-01 | Stripe/PortOne server secrets and merchant approval are missing | P0 | Configure test/production credentials; pass charge, webhook, cancellation, refund, duplicate-event, and failure UAT |
| PAY-02 | Interview-deposit claims conflict across homepage/messages/terms and include a 50% forfeiture/distribution model | P0 | Disable the deposit model until finance/legal approval and one consistent policy |
| PAY-03 | Currency and refund claims differ across KRW, MMK, and USD/Stripe surfaces | P0 | Create one approved price/VAT/refund matrix by product and country |
| PRIV-01 | Actual data map/vendor DPA/overseas-transfer evidence is incomplete | P0 | Confirm controller/processor roles, transferred fields, country, purpose, method, retention, refusal consequence, and safeguards |
| PRIV-02 | Visa documents, business documents, resumes, and applicant data need retention/deletion/access-control evidence | P0 | Approve retention schedule, deletion jobs, role audit, and sensitive-data handling procedure |
| OPS-01 | Backup/restore drill, monitoring, alerts, and on-call evidence are not complete | P0 | Execute production-like restore drill and record monitoring/on-call sign-off |
| CONTENT-01 | Terms, privacy, FAQ, messages, website, and app contain inconsistent effective dates and refund rules | P1 | Complete bilingual content matrix and legal review |
| AUTH-01 | Many routes still read session identifiers from `localStorage` | P1 | Complete migration to secure HttpOnly cookie/session handling |
| APP-01 | App payment screens still contain mock/TODO payment flows | P0 for app | Replace mock success navigation with real payment and server verification |
| APP-02 | App privacy/terms URLs depend on the unavailable public website | P0 for app | Restore public legal URLs before store submission |
| APP-03 | Worker/company account-deletion screens only display a success alert and do not call the deletion API | P0 for app | Connect both screens to authenticated backend deletion, handle re-authentication, and verify deletion evidence |

## 3. Korea Domestic Service Requirements

### Recruitment and Placement Classification

The current product does more than publish job advertisements: it verifies employers, matches visa/job eligibility, accepts applications, coordinates interviews, and supports paid products/deposits. Counsel must classify each function separately.

- A job-information provider generally requires a `직업정보제공사업` filing under Employment Security Act Article 23.
- Domestic paid placement requires local-government registration under Article 19.
- Overseas paid placement requires registration with the Minister of Employment and Labor under Article 19.
- Confirm permitted fees, guarantees/insurance, qualified counselor requirements, advertisement review duties, record retention, and reporting obligations.
- Keep visa results clearly labeled as reference information; never represent JobChaja as the immigration authority.

### E-commerce and Payment

- Complete mail-order sales registration and publish verified operator identity and registration information.
- Before payment, show product, price, VAT, service period, activation point, payment method, cancellation/refund rules, and customer-support contact.
- Preserve the exact checkout disclosure and consent evidence associated with each order.
- For digital content or immediately-started services, obtain the legally required acknowledgement before relying on withdrawal restrictions.
- Preserve payment/contract/refund/complaint records for the legally required periods.
- Do not launch interview deposits or forfeiture/distribution until counsel approves custody, damages, refund, tax, and unclaimed-funds treatment.

### Privacy and Security

- Finalize a Korean privacy policy matching actual vendors and data flows.
- Maintain separate consent for overseas transfer where required and publish all required transfer details.
- Document controller/processor roles for LivSoft, Myanmar support, AWS, SES, PortOne/KG Inicis, Stripe, Google, Apple, Meta, and Kakao.
- Complete access review, breach response, retention/deletion automation, vendor DPAs, and sensitive-document controls.
- Verify privacy-rights requests and account deletion end to end.

## 4. International Service Requirements

**Recommended launch model:** Korea-only production allowlist first. Do not market or offer placement/payment globally until each target country is approved.

### Every Country

- Obtain country-specific recruitment/placement licensing analysis.
- Approve language, currency, tax, payment, cancellation, refund, dispute, and customer-support rules.
- Approve privacy notice, lawful basis, processor contracts, and international-transfer mechanism.
- Implement sanctions/blocked-country screening, fraud controls, age policy, and chargeback process.
- Verify whether local consumer law overrides Korean governing-law clauses.

### EU/EEA

- Assess GDPR territorial scope before offering services to or monitoring people in the EU/EEA.
- If applicable, document lawful bases, data-subject rights, DPIA needs, processor contracts, EU representative, and breach handling.
- Use an approved transfer mechanism such as SCCs where needed and complete a transfer-impact assessment.

### United Kingdom

- Assess UK GDPR targeting and representative requirements.
- Approve UK transfer mechanism and processor contracts before targeting UK users.

### United States

- Assess CCPA/CPRA applicability and implement notice-at-collection, deletion/correction/opt-out/limit processes where applicable.
- Do not target children; preserve the neutral age gate. COPPA obligations apply to child-directed services and services with actual knowledge of under-13 collection.
- Review state recruitment, consumer, privacy, tax, and money-transmission/custody implications before deposits.

## 5. App Launch Checklist

### Shared App Gate

- [ ] Public Privacy Policy, Terms, Refund Policy, support, and account-deletion URLs return HTTPS `200`.
- [ ] Remove mock data, fake success states, and TODO payment flows from release build.
- [ ] Pass worker/company registration, login, deletion, jobs, application, notification, and payment/refund UAT.
- [ ] Reconcile app disclosures with website/backend data collection and vendors.
- [ ] Prepare reviewer account, reviewer notes, support contact, screenshots, localized metadata, and incident contact.
- [ ] Complete crash, accessibility, device, network-loss, upgrade, and rollback testing.

### Apple App Store

- [ ] Complete App Privacy details for JobChaja and every integrated third-party SDK.
- [ ] Allow account-deletion initiation inside the app.
- [ ] Verify Sign in with Apple configuration if third-party/social login is offered.
- [ ] Complete age rating, export compliance, permission-purpose strings, and review notes.
- [ ] Confirm whether any digital service requires Apple in-app purchase; document why external payment is permitted where used.

### Google Play

- [ ] Complete Data Safety and account-deletion declarations accurately.
- [ ] Provide an accessible web account-deletion URL and in-app deletion path.
- [ ] Target Android 15 / API level 35 or higher for new app/update submission.
- [ ] Review photo/media and notification permissions; request only the minimum required permissions.
- [ ] Complete content rating, app access/reviewer credentials, signing, closed testing, and staged rollout.

## 6. Distribution Process Started

### Phase A: Restore and Freeze

- [ ] Restore `jobchaja.com` production HTTPS service.
- [ ] Correct the Nginx `admin` URI block according to the approved admin deployment model.
- [ ] Freeze public pricing/deposit claims until finance/legal approval.
- [ ] Keep international production countries disabled.
- [ ] Create release ticket and attach this audit, external approval register, and UAT matrix.

### Phase B: External Approvals

- [ ] Obtain recruitment-service classification and registration evidence.
- [ ] Obtain mail-order sales registration and merchant/provider approval.
- [ ] Obtain final Korean legal/privacy/finance sign-off.
- [ ] Approve one bilingual product-price-refund matrix.

### Phase C: Production-Like UAT

- [ ] Deploy reviewed build to staging with production-like integrations.
- [ ] Apply migrations after backup and complete restore drill.
- [ ] Pass registration, deletion, job posting/application, payment/webhook/refund, privacy request, and admin UAT.
- [ ] Pass security, access-control, browser/mobile, accessibility, and localization checks.

### Phase D: Controlled Release

- [ ] Obtain signed GO/NO-GO decision.
- [ ] Deploy to Korea-only allowlisted production.
- [ ] Run public smoke test and payment canary.
- [ ] Monitor D0/D+1, then review D+7 and D+30.

## 7. Official Sources

- Korea Employment Security Act, paid placement Article 19: https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0019&lsiSeq=259231&urlMode=lsScJoRltInfoR
- Korea Employment Security Act, job-information-provider filing Article 23: https://www.law.go.kr/
- Korea Electronic Commerce Consumer Protection Act: https://www.law.go.kr/lsInfoP.do?ancYnChk=0&lsId=009318
- Korea PIPA, overseas transfers Article 28-8: https://law.go.kr/lsInfoP.do?lsId=011357
- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Apple account deletion: https://developer.apple.com/support/offering-account-deletion-in-your-app/
- Apple App Privacy details: https://developer.apple.com/app-store/app-privacy-details/
- Google Play account deletion: https://support.google.com/googleplay/android-developer/answer/13327111
- Google Play Data Safety: https://support.google.com/googleplay/android-developer/answer/10787469
- Google Play target API requirements: https://support.google.com/googleplay/android-developer/answer/11926878
- EU GDPR: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX%3A02016R0679-20160504
- UK GDPR scope: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/personal-information-what-is-it/who-does-the-uk-gdpr-apply-to/
- California CCPA: https://oag.ca.gov/privacy/ccpa
- US COPPA: https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa
