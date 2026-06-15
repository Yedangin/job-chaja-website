# Launch UAT Matrix

Record tester, date, environment and evidence link for every result.

| Flow | Expected Result | Status |
|---|---|---|
| Public production domain | HTTPS connects, HTTP redirects, and public routes return expected status | BLOCKED - HTTPS refused; deployed HTTP build missing refund/robots/sitemap on 2026-06-15 |
| Local/UAT home/legal/job-list pages | Load successfully on mobile and desktop | PASS - production-mode local HTTP smoke |
| Email signup | Requires email verification, required consents and age-18 confirmation | PASS - local UAT |
| Optional marketing consent | Remains optional and independently changeable | READY TO TEST |
| International transfer consent | Opens Korean transfer section and records evidence | READY TO TEST |
| Company verification | No false phone-verification claim; consent evidence recorded | READY TO TEST |
| Account deletion/privacy request | Request accepted, identity verified, completion evidence retained | PENDING |
| Job posting/application | Correct authorization, validation and error handling | PENDING |
| Payment/refund | Payment pages/products/order creation work; real confirmation/refund requires provider credentials | PARTIAL - order creation PASS, provider confirmation BLOCKED |
| Admin routes | Require authenticated authorized admin and reject unauthorized access | READY TO TEST |
| Prototype/variant routes | Must return 404 in production | PASS - production HTTP smoke |
| Sensitive-data routes | Require separate consent, authentication, authorization, retention and deletion controls | READY TO TEST |
| Direct backend feature guard | Feature flags correctly enable/disable payment/admin/social/sensitive endpoints | PASS - unit tested |
| Backup/restore | Restore into isolated environment and validate | PENDING |
| Accessibility/browser matrix | Keyboard, screen reader basics, Chrome/Safari/Firefox/mobile | PENDING |
