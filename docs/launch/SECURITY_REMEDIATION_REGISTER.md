# Security Remediation Register

| ID | Finding | Current Control | Required Closure | Status |
|---|---|---|---|---|
| SEC-01 | Website project-wide type validation is skipped | Launch-scope lint and production build | Remove `ignoreBuildErrors`; resolve legacy errors | OPEN |
| SEC-02 | Website project-wide lint debt | Targeted launch-file lint | Resolve remaining lint findings and enforce CI | OPEN |
| SEC-03 | Website has 4 moderate transitive dependency findings | Next upgraded; no unsafe forced downgrade | Apply upstream-compatible patched release | MONITOR |
| SEC-04 | Backend dependency audit initially reported 5 critical and 49 high findings | Compatible safe updates applied; no critical/high findings remain | Review 16 moderate findings without unsafe forced downgrades | MONITOR |
| SEC-05 | Backup/restore evidence not recorded | Runbook defines procedure | Execute restore drill and attach evidence | OPEN |
| SEC-06 | Production monitoring/on-call evidence not recorded | Runbook defines escalation | Configure alerts and sign on-call roster | OPEN |

Local full-service UAT may proceed while these controls are being closed. Public production launch requires security-owner acceptance, backup/restore evidence, monitoring, and on-call readiness.
