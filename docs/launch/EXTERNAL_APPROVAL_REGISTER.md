# External Approval Register

These items cannot be truthfully completed by engineering alone and remain release gates for a public full-service launch.

| ID | Decision / Evidence Required | Owner | Approver | Status |
|---|---|---|---|---|
| WEB-01 | Configure `jobchaja.com` HTTPS + redirect, deploy current build, and pass production smoke test | DevOps | Engineering Lead | BLOCKED - HTTPS REFUSED; HTTP BUILD STALE |
| WEB-02 | Approve and implement public-vs-private admin routing; current Nginx blocks every `admin` URI | DevOps | Security + Engineering Lead | PENDING |
| LEGAL-01 | Written classification: job-information provider vs domestic/overseas paid placement | CEO | Korea counsel / labor specialist | PENDING |
| LEGAL-02 | Required recruitment registrations, guarantees, and permitted fee model | CEO | Relevant Korean authority / counsel | PENDING |
| LEGAL-03 | Terms, Privacy, Refund and international-transfer final review | Privacy Lead | Korea privacy counsel | PENDING |
| LEGAL-04 | LivSoft controller / Myanmar processor agreement and vendor DPAs | Privacy Lead | CEO + counsel | PENDING |
| FIN-01 | KRW price, VAT, deposit custody, refund and unclaimed-funds model | Finance | CEO + counsel | PENDING |
| PAY-01 | PortOne/KG Inicis/Stripe production merchant and refund approval | Finance | Payment providers | PENDING |
| INTL-01 | Approved launch-country allowlist and country-specific licensing | CEO | International counsel | PENDING |
| STORE-01 | Apple/Google declarations, credentials and store approval | Product | Apple / Google | PENDING |
| SEC-01 | Production backup/restore drill evidence | DevOps | Engineering Lead | PENDING |
| SEC-02 | Production monitoring, alerting, access review and on-call roster | DevOps | Security/Privacy Lead | PENDING |
| UAT-01 | Staging end-to-end signup, deletion, job posting/application and privacy-rights UAT | QA / Operations | Product + Privacy Lead | PENDING |
| UAT-02 | Accessibility, browser, mobile and Korean/English content UAT | QA | Product | PENDING |
| OPS-01 | Full-service launch deployment sign-off | CEO | CEO + Operations | PENDING |
| OPS-02 | Production migration, backup ID, release tag, deployment ID and rollback evidence | DevOps | Engineering Lead | PENDING |
| OPS-03 | D0/D+1, D+7 and D+30 monitoring/review records | Operations | CEO + Privacy Lead | PENDING |
| DATA-01 | Actual infrastructure/data map, retention jobs, vendor contracts and DPAs | Privacy Lead | Counsel + Security | PENDING |
| ID-01 | Business/mail-order registration details and hosting disclosure for footer | Operations | CEO + Counsel | PENDING |
| INTL-02 | GDPR/UK/US/country-specific scope and transfer assessment before targeting | Privacy Lead | International counsel | PENDING |

## Launch Scope Decision

- Current UAT scope: **Full-service website**
- Engineering UAT status: **GO**
- Public production launch status: **PENDING external approvals and production credentials**
- Full service, paid, and admin routes: enabled in local/UAT
- App launch: deferred
- Overseas paid placement: disabled
- Social login: enabled in local/UAT; production provider configuration and consent UAT remain required

## Required Sign-off

| Role | Name | Date | Signature / Ticket |
|---|---|---|---|
| CEO |  |  |  |
| Korea Legal |  |  |  |
| Privacy Lead |  |  |  |
| Engineering Lead |  |  |  |
| Operations Lead |  |  |  |

## Engineering Completion Boundary

Engineering-owned launch controls are implemented and verified. Remaining `PENDING` items require production credentials/evidence, management decisions, regulator/provider action, or qualified legal approval. They must not be marked complete without the named approver and attached evidence.
