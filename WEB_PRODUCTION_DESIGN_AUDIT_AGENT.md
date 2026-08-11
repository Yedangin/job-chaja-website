# JobChaja Web Production Design Audit (Current)

## Post-Verification Repairs

The focused verifier below found several live-link and gated-state problems. They were repaired
and recaptured after that agent run.

- Latest evidence: `.codex-artifacts/full-design-audit-final-fixed/`
- Scope: `/`, `/admin`, `/worker/mypage`, `/worker/profile/setup`
- Result: 4 routes / 8 captures, HTTP 200 for all, PASS 6, P0 0, P1 0, P2 2.
- `/guide`, `/worker/applications`, `/worker/profile/setup`, and `/worker/mypage` all return 200.
- Home no longer links to dead `/visa-manager` or `/worker/visa-guide`; it exposes the valid
  guest-safe `/diagnosis` and `/guide` journeys.
- Worker dashboard application links now use `/worker/applications`. Variant A is exposed only
  through the production route `/worker/profile/setup`; release UI no longer links to a
  `*/variants/*` URL. Public/header dashboard links use canonical `/worker/mypage`.
- When admin routes are gated off, the dashboard no longer fetches a known-disabled stats API or
  shows authoritative-looking zero metrics; it renders a deliberate unavailable state.
- When sensitive-data features are gated off, profile completion no longer probes the disabled
  visa-verification endpoint.

The two remaining P2 home findings are the expected signed-out profile 401 probe and mobile job
title clipping. End-to-end `ko/en/vi/th/fil` localization remains a release blocker, so the overall
product verdict is still **NOT READY** even though the repaired focused routes have no P0/P1
visual or routing verdict.

## Final Focused Verification

- Verification date: 2026-08-03
- Repository: `Jobchaja_local/job-chaja-website`
- Live frontend: `http://localhost:3000` (HTTP 200 at run time)
- Focus: `/`, `/login`, `/admin`, and `/worker/dashboard`
- Roles: guest, authenticated admin, authenticated worker
- Viewports: mobile `390x844`; desktop `1440x1000`
- Release judgment: **NOT READY.** The recent BrandLogo and responsive-shell repairs are verified, but dead primary links, mixed-language production copy, non-canonical worker routes, and gated/missing API behavior still block sign-off.

This focused run supplements the existing 108-route/216-capture baseline. It does not claim that every route was recaptured after the fixes, and it does not claim full localization.

### Current Evidence

| Artifact | Contents |
|---|---|
| `.codex-artifacts/full-design-audit-final-focused-v2/report.json` | DOM, final URL, API errors, visible links, GET link checks, clipping, landmarks, and screenshot paths for all 8 captures |
| `.codex-artifacts/full-design-audit-final-focused-v2/summary.json` | Focused aggregate: 4 routes, 8 captures |
| `.codex-artifacts/full-design-audit-final-focused-v2/screenshots/**` | Current 390x844 and 1440x1000 Chromium captures |
| `.codex-artifacts/full-design-audit/report.json` | Earlier full canonical baseline: 108 routes, 216 captures |
| `.codex-artifacts/full-design-audit-regression-2/REPORT.md` | Earlier post-admin/mobile repair check for home and admin |

The final focused run produced 8/8 HTTP 200 page responses, 0 page errors, 0 horizontal overflows, 0 broken images, and 0 placeholder (`#` or `javascript:`) links. It executed 85 visible same-origin GET link checks across the two viewports: 79 passed and 6 failed, representing 3 unique dead destinations repeated at both sizes.

### Focused Page Matrix

| Route | Current result | Verified improvements | Remaining finding | Release status |
|---|---|---|---|---|
| `/` | 200 at both sizes; no overflow or broken image | Shared BrandLogo renders; compact mobile header fits; guest header no longer shows the design gallery or admin entry; prior placeholder links are gone | Primary `Visa manager` routes `/visa-manager` and `/worker/visa-guide` both return 404. English locale still renders mostly Korean hero, navigation, notices, and jobs. Guest profile probing emits 401. Two mobile job-title headings were mechanically clipped. | **BLOCKED** |
| `/login` | 200 at both sizes; no overflow, broken image, dead visible link, or page error | BrandLogo is consistent; mobile/desktop compositions are stable; terms and privacy links resolve; the sampled English social-login availability notice is user-facing | Only the English default state was verified here. This run does not prove Korean, Vietnamese, Thai, Filipino, recovery, invalid-login, locked, or return-URL states. Guest profile probing still emits 401. | **FOCUSED VISUAL PASS; LOCALIZATION/STATE SIGN-OFF PENDING** |
| `/admin` | Authenticated admin remains on `/admin`; 200 at both sizes; no overflow | New BrandLogo/admin mark renders; mobile navigation button and two-column metrics fit 390px; the former mobile horizontal overflow is fixed | `/api/auth/admin/stats` returns 404 at both sizes, so the dashboard presents zero values. With `lang=en`, almost all admin labels remain Korean. Drawer interaction and permission-denial states were not exercised by this GET-only run. | **BLOCKED** |
| `/worker/dashboard` | 200 but final URL is `/worker/mypage` at both sizes; no overflow | Worker header/sidebar/bottom navigation share the BrandLogo; prior mobile width overflow is fixed | Dashboard is not canonical: sidebar `Dashboard` also targets `/worker/mypage`. `Applications` summary targets dead `/worker/mypage/applications` (404). Profile CTAs target excluded experiment `/worker/wizard/variants/a`. `/api/visa-verification/me` returns 404. English shell and Korean body/footer are mixed; desktop footer company text is visually cut at the sidebar boundary. | **BLOCKED** |

### Link Regression

| Destination | Source | Result | Required correction |
|---|---|---:|---|
| `/visa-manager` | Home primary visa-manager CTA | 404 at mobile and desktop | Implement the canonical route or point the CTA to an existing production visa flow before release. |
| `/worker/visa-guide` | Home visa guidance links | 404 at mobile and desktop | Replace with a valid guest-safe guide route; a worker-only destination is also the wrong ownership boundary for a guest home CTA. |
| `/worker/mypage/applications` | Worker dashboard application summary | 404 at mobile and desktop | Use the existing `/worker/applications` canonical route. |
| `/worker/wizard/variants/a` | Worker complete-profile banner/cards | 200, but excluded experiment route | Promote one production profile flow and remove all variant-route links from release UI. |
| `/jobs` | Public job link | 200, redirects to `/alba` | Decide and document the canonical public job URL; this is not an HTTP failure but remains route drift. |

### API And Runtime Findings

The 8 recorded API errors are one per capture:

- Guest home/login: `/api/auth/profile` returns 401. This is expected for a guest session but should be handled without error-level console noise.
- Admin: `/api/auth/admin/stats` returns 404 while the admin launch gate is disabled. The UI must show a deliberate unavailable state or remain release-gated, not silently render authoritative-looking zero metrics.
- Worker: `/api/visa-verification/me` returns 404. Distinguish “no verification record” from missing/gated endpoint behavior and render the matching user state.

### Fixes Verified After The Earlier Audit

1. `BrandLogo` is present on the sampled public, auth, admin, and worker shells with the same blue briefcase mark and JobChaja wordmark.
2. The public guest header no longer visibly exposes the design-gallery menu, variant list, or admin route. The code retains an `/admin` link only inside the authenticated `ADMIN` branch.
3. The compact mobile header no longer wraps the language control and login/signup actions incoherently at 390px.
4. Admin mobile no longer has the horizontal overflow found in the first regression run.
5. Worker mobile no longer has shell-level horizontal overflow.
6. Home placeholder links detected in the first regression are gone; current focused captures contain zero placeholder links.
7. Login legal links resolve, and the current sampled social-login notice is localized in English; it remains temporary availability copy rather than proof of a connected social provider.

### Remaining Production Blockers

| ID | Severity | Verified blocker |
|---|---|---|
| F-01 | Critical | Home sends foreign-user primary visa journeys to two 404 routes. |
| F-02 | Critical | English selection is not end-to-end localized. Home, admin, worker content, and footer remain substantially Korean. No five-language production claim is supportable. |
| F-03 | Critical | Worker release UI links directly to `/worker/wizard/variants/a`, which the release inventory excludes as an experiment. |
| F-04 | High | Worker dashboard/application routing is inconsistent: `/worker/dashboard` resolves to `/worker/mypage`, and `/worker/mypage/applications` is dead despite `/worker/applications` existing. |
| F-05 | High | Admin stats and worker visa-verification requests return 404; the resulting zero/empty UI does not communicate a gated or unavailable backend state. |
| F-06 | High | Root document language is still statically `<html lang="en">`; locale-specific accessibility and SEO signals are not verified. |
| F-07 | Medium | Brand use is visually closer, but tokens remain split: `globals.css` still defines `--brand-500: #0ea5e9`, while BrandLogo and repaired shells use `#0066FF` and Header still uses `sky-*`. |
| F-08 | Medium | Home mobile reports two clipped job-card `h3` titles; provide an intentional two-line clamp plus accessible full title or revise the card height. |

### Sign-Off Conditions

Production design approval requires all F-01 through F-06 items to be closed, followed by a role-seeded recapture of affected canonical routes at `390x844` and `1440x1000`. Five-language sign-off must separately cover `ko/en/vi/th/fil` with visible shell, form, error, empty, loading, legal, and CMS content states. Screenshots alone are not sufficient where a surface depends on authorization, payment, sensitive documents, or a launch flag.

### Commands Executed

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:3000 -TimeoutSec 5
node .codex-artifacts/final-focused-regression.cjs
Get-Content -Raw -Encoding utf8 .codex-artifacts/full-design-audit-final-focused-v2/report.json | ConvertFrom-Json
rg -n "BrandLogo|visa-manager|worker/visa-guide|worker/mypage/applications|wizard/variants/a|<html" src
```

The focused runner was temporary and removed after successful execution. No application source file was edited by this verification pass.

## Archived Pre-Fix Audit

The material below is retained as historical context from before the latest BrandLogo/header/admin/mobile changes. Where it conflicts with the focused verification above, the focused verification is authoritative.

<details>
<summary>Show archived audit</summary>

- Audit date: 2026-08-03
- Scope: release-candidate web routes only. The 176 `/diagnosis/designs/**`, `/job-cards/**`, and `*/variants/**` routes are excluded per `WEB_RELEASE_PAGE_INVENTORY.md`.
- Roles: guest, worker, company, admin. App (Expo native) screens are out of this repository's scope and therefore not represented as app-screen proof.
- Release judgment: **NOT READY for a full web release.** The implemented P0 verticals are visually viable, but global navigation, localization, canonical-route, and gated-surface work remains.

## Audit Method And Evidence

| Check | Evidence / command | Result |
|---|---|---|
| Inventory boundary | `Get-Content WEB_RELEASE_PAGE_INVENTORY.md`; `Get-ChildItem src/app -Recurse -Filter page.tsx` | 277 route files found; 101 release candidates and 176 explicitly excluded experiments/variants. |
| Code design system | `Get-Content src/app/globals.css`, `src/components/{header,footer}.tsx`, `src/components/layouts/*` | Shared foundation exists, but public, worker/company, and admin frames are not one consistent design system. |
| Existing browser proof | `.codex-artifacts/runtime-web-qa/report.json` and `.codex-artifacts/runtime-auth-web-qa/report.json` | Previous Chromium QA: public 42/42 and authenticated 46/46 for the listed P0 routes, 390/768/1440 plus five-locale mobile checks. |
| Visual review | Opened existing real Chromium captures through the local artifact set | Reviewed planner, notices, guides, worker resume, company jobs, part-time/full-time creation, and admin CMS in this report. |
| Read-only live browser attempt | Puppeteer against `127.0.0.1:3000` / `127.0.0.1:8000` | Guest batch did not finish in the allotted 240 seconds; authenticated batch was blocked by the backend's login throttle after a prior login attempt. No files, screenshots, or source were changed. |

### Existing Real Capture Set

The following captures already exist and were inspected. They are real local Chromium pages, not mockups.

| Surface | Existing captures | Finding |
|---|---|---|
| Planner | `runtime-web-qa/diagnosis-{en,ko,vi,th,fil}-390.png`, `diagnosis-en-{768,1440}.png` | Good responsive hierarchy and blue action treatment; guest API 401 console noise needs suppression/intentional handling. |
| Notice / guide | `notice-*`, `guide-*` in `runtime-web-qa` | No horizontal overflow; English chrome is mixed with Korean footer/nav and Korean seeded article titles. |
| Worker resume | `runtime-auth-web-qa/worker-resume-*` | Clean empty state, stable bottom navigation; profile-completion banner and action hierarchy are sound. |
| Company jobs / talent | `company-jobs-*`, `company-talents-*`, bookmarks/viewed captures | Desktop sidebar is dense but legible; P0 route QA had no overflow or API/page error. |
| Company creation | `company-alba-create-en-{390,1440}.png`, `company-fulltime-create-en-{390,1440}.png` | Forms fit mobile after the repair. They still use a different top/header and fixed-action convention from the rest of company pages. |
| Admin CMS | `admin-guide-*` | Actual form, locale tabs, upload control, and list render correctly. The mobile locale tab strip is visually clipped/partially hidden and admin chrome still has Korean logout text in English. |

## High-Severity Findings

| ID | Severity | Evidence | Production impact | Recommended correction |
|---|---|---|---|---|
| D-01 | Critical | `src/components/header.tsx` exposes `시안 모음`, direct `/admin`, and variant links to every public visitor; `src/proxy.ts` only blocks them in production | Development-only routes are discoverable in local/staging navigation and the public header does not present a trustworthy foreign-user product surface | Remove design/admin menus from `Header`; expose role-appropriate links only after authorization. Keep server gates as the enforcement layer. |
| D-02 | Critical | `src/components/header.tsx` and `footer.tsx` hard-code Korean; `I18N_QA_REPORT.md` reports 2,259 Korean candidates in 138 affected release files | Overseas users see mixed-language navigation, legal links, login copy, and footer information. This invalidates a five-language launch claim. | Move all shell text to the canonical `ko/en/vi/th/fil` catalog. Require approved translations for legal text and CMS content, not English/Korean fallback. |
| D-03 | Critical | `WEB_RELEASE_PAGE_INVENTORY.md` marks worker/company guide fallback, public job lists/details, support, messages, team, coupons, and several payment surfaces as `MOCK`, `PARTIAL`, or `BLOCKED` | A polished shell can lead users into incomplete, non-canonical, or legally disabled flows | Hide/gate these links until their listed acceptance criteria are complete. Do not render mock fallback as live operational content. |
| D-04 | High | `globals.css` defines `--brand-500: #0ea5e9` while product components use `#0066FF`; header continues to use `sky-*`; admin uses dark/yellow | The visual identity drifts among cyan, primary blue, dark admin, and ad hoc Tailwind colors | Create one semantic token map: brand `#0066FF`, hover `#0052CC`, ink `#191F28`, surface `#F9FAFB`, border `#E5E7EB`, success/warning/error tokens. Consume tokens rather than raw colors. |
| D-05 | High | Root `<html lang="en">` never follows selected language; public QA proves locale body copy while document language remains static in the root layout | Screen-reader language, typography selection, and SEO language signals are incorrect | Bind document `lang` to the locale strategy or locale route. Add `hreflang` only after canonical translated URLs/content are complete. |
| D-06 | High | Authenticated `/company/talents`, `/company/jobs`, and `/worker/resume` QA has valid sessions; the public run correctly redirects them to login. Login/recovery still has Korean social-login notice in every foreign locale. | Role guard behavior is substantially sound, but the first experience after a protected CTA is not production-grade multilingual UX | Localize recovery, social availability, error, privacy/terms consent, and return URL states. Do not advertise a social provider before the consent/auth connection exists. |

## Page-Group Audit Matrix

`Capture` lists required production evidence for each group: `390/768/1440` means all three web viewports with the stated role session; `5L-390` additionally means `ko/en/vi/th/fil` on mobile. Existing proof is noted separately above.

| Page group and routes | Role | Current state | Design / connection finding | Severity | Recommended correction | Required capture |
|---|---|---|---|---|---|---|
| Home and international: `/`, `/international`, `/contact`, `/recruit-info` | guest | `/` and `/international` PARTIAL; recruit hub MOCK | Home must be the brand reference, but it inherits the public header that exposes internal designs/admin. Hero uses real product sections but some fallback/legacy content remains. | Critical | Establish home shell as canonical, use verified CMS/job data, hide incomplete hubs, and test all hero/slider CTAs. | 390/768/1440, 5L-390, guest CTA path test |
| Login, registration, recovery: `/login`, `/register`; protected-route redirects | guest -> worker/company | PARTIAL | Login is visually more polished than surrounding pages, but header/footer are not shared consistently. `register` is company-centric; recovery and social availability are not a complete localized flow. | Critical | Separate worker/company onboarding, localize all auth states, preserve `returnUrl`, and add account-enumeration-safe errors. | 390/768/1440, 5L-390, invalid/locked/recovery states |
| Legal pages: `/privacy-policy`, `/privacy-request`, `/refund-policy`, `/terms-and-conditions`, worker/company terms | guest/worker/company | PARTIAL | Footer links are present on public pages, but footer/legal documents are Korean-first and content is not legally approved for five locales. | Critical | Versioned approved content, locale approval state, foreign-transfer/retention details, and a translated footer. | 390/768/1440, 5L-390, footer-link navigation |
| Visa planner: `/diagnosis`, `/diagnosis/result`, `/diagnosis/result/[pathwayId]`, `/diagnosis/history` | guest/worker | P0 PARTIAL | Best current visual standard: restrained blue, clear five-step progress, coherent fields and empty state. Existing QA found no overflow. Result/history need direct-entry, policy-version, deletion and ownership proof. | High | Use this surface's density, type scale, and progress rules as the product form standard. Add all error/empty/loading and saved-history captures. | Existing 390/768/1440 + 5L-390; add result/detail/history authenticated |
| Information / sliders / posts: `/notice`, `/notice/[id]`, `/guide`, `/guide/[id]`, `/board/posts`, `/board/posts1`-`/board/posts8` | guest | Canonical notice/guide P0; legacy board PARTIAL | List, search, empty state, card borders, and CTA are sound. English page has Korean global nav/footer and Korean seed titles. Legacy eight detail routes fragment content ownership. | Critical | 301 legacy posts to canonical details; translate/approve content; make slider/card links canonical; test no-content, image failure, long title, and 404. | Existing list captures; add 390/768/1440 for canonical detail and slider-linked post, 5L-390 |
| Worker core: `/worker/dashboard`, `/worker/mypage`, `/worker/resume`, `/worker/profile`, `/worker/visa`, `/worker/notifications` | worker | PARTIAL; resume P0 | Worker mobile structure is strong: compact top bar, task banner, and stable bottom nav. Desktop/worker frame needs the same token and icon spacing rules as company. Several forms remain Korean only. | High | Standardize shell, locale strings, icon button tooltips, success/error/zero states, and profile image upload. | Existing resume; add all listed routes 390/768/1440, 5L-390 |
| Worker jobs / lifecycle: `/worker/jobs`, `/worker/alba`, `/worker/alba/[id]`, `/worker/regular`, `/worker/regular/[id]`, `/worker/applications`, `/worker/interviews`, `/worker/scraps` | worker/guest | PARTIAL | Multiple overlapping canonical routes and application flows. Some links may lead into gate-disabled application functionality. | Critical | Choose `/jobs/[id]` or type-specific canonical detail, remove duplicate destinations, and disable apply affordances until legal gate/API are active. | 390/768/1440, 5L-390, job filter/detail/apply blocked state |
| Worker security/support: `/worker/visa-verification`, `/worker/payments`, `/worker/coupons`, `/worker/settings/notifications`, `/worker/settings/password`, `/worker/settings/withdraw`, `/worker/support/contact`, `/worker/support/terms` | worker | Mixed PARTIAL/BLOCKED/MOCK | Password and withdrawal are P0 but need the production errors/re-auth states; sensitive visa and payment must remain inaccessible until their gates are approved. | Critical | Keep sensitive/paid routes 404 in production; capture password/withdrawal confirmation, rate limit, session revocation, support submit failure/success. | 390/768/1440, 5L-390, re-auth and blocked states |
| Company dashboard/profile/verification: `/company/dashboard`, `/company/verification`, `/company/profile`, `/company/profile/edit`, `/company/mypage`, `/company/mypage/manager`, `/company/mypage/team`, `/company/notifications` | company | PARTIAL/MOCK | Company desktop shell is operational and dense. Verification/profile uploads and team/notification surfaces lack a consistent production data contract. | High | Use the company layout only after company authorization; define page header, side navigation, mobile bottom nav, form action bar and audit-state patterns. | 390/768/1440, 5L-390, approved/pending/rejected verification |
| Company jobs: `/company/jobs`, `/company/jobs/[id]`, `/company/jobs/create`, `/company/alba/create`, `/company/fulltime/create`, `/company/applicants`, `/company/jobs/[id]/applicants`, `/company/interviews` | company | Jobs P0 partially complete; creation P0 rendered | Existing desktop job management looks coherent, with status tabs and an empty state. Creation pages are individually good at 390 but part-time and full-time use different step/top/fixed-CTA compositions. Applicant/interview backends remain partial. | High | Merge both creation flows into one Job Composer pattern: same header, progress, validation summary, sticky action bar, preview and review-state language. | Existing create/jobs captures; add edit/detail/applicant/interview and 5L-390 |
| Talent, visa, messaging: `/company/talents`, `/company/talents/bookmarks`, `/company/talents/viewed`, `/company/visa-guide`, `/company/visa-status`, `/company/messages` | company | Talent P0; guide/messages MOCK/PARTIAL | Talent search frame was QA clean. Messages and visa guide should not resemble production features while API/legal rules are absent; status data is sensitive. | Critical | Keep mock features hidden or clearly unavailable; maintain private-by-default resume and visibility/audit context in all talent screens. | Existing talent captures; add view/detail/empty/error 390/768/1440, 5L-390 |
| Company payment/settings/support: `/company/payments/**`, `/company/settings/**`, `/company/support/{faq,guide,inquiry,notices,terms}` | company | Payment BLOCKED; others PARTIAL/MOCK | Sidebar has billing grouping but payment release is correctly gated. Setting/support designs are not proven as a group and terminology may diverge from public/legal pages. | High | Do not show purchasable language or checkout CTA with the flag OFF. Audit settings destructive states and source support/FAQ from CMS. | 390/768/1440, 5L-390; production-flag 404 proof for payment |
| Admin: `/admin`, `/admin/guide`, `/admin/payments` | admin | Admin/payment BLOCKED in production; guide P0 local | CMS form is usable; mobile locale tabs are too wide, and the admin shell uses a separate dark/yellow theme with mixed English/Korean labels. The giant `/admin` remains a monolithic console. | High | Use a deliberately separate but token-related admin theme; fix horizontal tab behavior; split console into permission-scoped modules before enabling. | Existing guide; add 390/768/1440, admin success/error/empty/upload/RBAC denial |

## Common Shell, Icon, And Motion Direction

### Shell rules

1. One public header/footer, one worker shell, one company shell, and one admin shell. They may differ in navigation density but must use the same token palette, type scale, focus ring, button heights, radius (8px maximum for cards), and icon weight.
2. Public header must contain only product navigation, locale, login, and sign-up. Internal design variants and admin navigation do not belong in guest chrome.
3. Every authenticated shell must have the same mobile contract: 56px header, a reserved safe-area bottom navigation or fixed action bar, never both competing for the same vertical space. Long labels must wrap or truncate intentionally.
4. Use the brand icon/wordmark at the left of every shell, with one compact monochrome admin variant. Avoid separate improvised text logos.

### Icon system

- Retain `lucide-react` as the single UI icon system. Use `BriefcaseBusiness`, `FileSearch`, `ShieldCheck`, `Landmark`, `Bell`, `CircleUserRound`, `CircleHelp`, `Search`, `Plus`, `ArrowRight`, and `ExternalLink` by semantic purpose, not decorative substitution.
- The logo can be a compact route/bridge mark plus `JobChaja` wordmark: one blue path entering a dark outlined document/briefcase. It should communicate verified work-and-entry guidance, not travel.
- Use 18px navigation icons, 20px primary actions, and 24px empty-state icons. Every icon-only control needs an accessible name and visible tooltip on pointer devices.

### Restrained motion

- Use 150-200ms opacity/translate transitions for page section entry, menu open, locale switch, status change, and card hover. Preserve the existing loader/skeleton motion only while a request is active.
- Use a 1.5-2px route-line animation in the planner progress indicator only after a user completes a step. Use subtle checkmark draw/scale for successfully saved profile, CMS publish, or job submission.
- Do not autoplay marquees, confetti, bouncing icons, parallax, or After-Effects-style looping logo effects on employment, visa, legal, payment, or admin surfaces. They reduce trust and violate `prefers-reduced-motion` expectations.
- Add a global `prefers-reduced-motion: reduce` treatment before adding any new animation. Motion must never be the only confirmation of a status change.

## Cross-Cutting State Checklist

| State | Required rule | Current audit result |
|---|---|---|
| Loading | Skeletal content must preserve final layout; no full-page jump | Present in many screens, but token/color variants vary. |
| Empty | One domain icon, one explanation, one next action; no dead CTA | Resume, notice, and company jobs are good references. |
| Error | Explain what failed, preserve input, offer retry/support; no mock fallback | Existing public QA includes expected guest 401 console messages; CMS/job error coverage is incomplete across all routes. |
| Destructive | Re-auth, explicit consequence, pending-state lock, success evidence | Password/withdrawal routes require dedicated production proof. |
| Upload | MIME/size/progress, failure/retry, private document disclosure | CMS screen has image control; verification/resume evidence flows remain incomplete. |
| CTA navigation | Every primary CTA must resolve to a canonical route or a deliberate gated state | Legacy post and duplicate job-detail routes remain unresolved. |

## Verification Gaps And Next Capture Run

No source code was changed by this audit. This report deliberately does not claim that every 101 release candidate has a new screenshot: the supplied QA artifacts cover the P0 surfaces listed above, while the requested fresh all-route live batch could not be completed because it exceeded the 240-second browser limit and then hit local authentication throttling.

Before production design sign-off, run a role-seeded Playwright/Puppeteer matrix that writes a separate review artifact outside the app source tree:

1. For every release-candidate route in the inventory, capture `390x844`, `768x1024`, and `1440x900` under the correct guest/worker/company/admin session.
2. For every P0 user-facing route, capture `ko/en/vi/th/fil` at 390px, including long Thai and Vietnamese labels.
3. Record final URL, redirect chain, HTTP status, console/page/API error, horizontal overflow, clipped text, visible header/footer, primary CTA target, empty/loading/error state.
4. Run a separate production-flag matrix proving `/admin/**`, paid routes, sensitive-document routes, and all 176 experiment routes resolve to 404 when disabled.
5. Repeat after canonical i18n and header/footer work. A screenshot alone is not approval: it must be paired with role, API, and state evidence.

## Exact Files Reviewed

- `WEB_RELEASE_PAGE_INVENTORY.md`
- `src/app/**/page.tsx` route inventory
- `src/app/layout.tsx`, `src/app/globals.css`, `src/proxy.ts`
- `src/components/header.tsx`, `src/components/footer.tsx`, `src/components/hero-section.tsx`, `src/components/hero-slider.tsx`
- `src/components/layouts/{public,worker,company,admin}-layout.tsx`
- `.codex-artifacts/runtime-web-qa/report.json`
- `.codex-artifacts/runtime-auth-web-qa/report.json`
- `I18N_QA_REPORT.md`

</details>
