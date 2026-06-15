# Production Data Map

| Data | Purpose | System / Recipient | Location | Retention | Launch Control |
|---|---|---|---|---|---|
| Account email, password hash, role | Authentication | JobChaja backend/PostgreSQL | Korea deployment | Account lifetime plus approved deletion schedule | Required consent evidence stored |
| Consent type, policy version, timestamp, IP, user agent | Legal evidence and withdrawal history | `user_consent_records` | Korea deployment | Counsel-approved period | Backend migration required |
| Worker profile, resume, visa data | Job matching | JobChaja backend and selected employer | Korea deployment | Policy-defined | Sensitive collection must remain minimized |
| Company profile and verification documents | Employer verification | JobChaja backend/admin reviewers | Korea deployment | Policy-defined | Admin route disabled publicly |
| Payment metadata | Payment/refund | PortOne/KG Inicis/Stripe | Vendor locations | Statutory period | Enabled in UAT; provider credential and production approval pending |
| OAuth identifiers | Authentication | Google/Kakao/Apple/Meta | Provider locations | Provider/account lifetime | Social signup requires consent completion before release |
| Logs, IP, device data | Security and incident response | Backend/logging provider | Confirm before launch | 90-180 days proposed | Access review required |
| Development support access | Maintenance | Myanmar processor | Remote access | Contract/project period | DPA, access log and least privilege required |

## Before Production

- Confirm every vendor, country, transfer method and retention period.
- Execute DPAs and cross-border transfer documents.
- Verify scheduled deletion and account-rights workflows.
- Do not collect criminal/health information until separate consent and deletion evidence are implemented.
