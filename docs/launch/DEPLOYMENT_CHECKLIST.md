# Full-Service Website Deployment Checklist

## Before Deployment

- Confirm `jobchaja.com` DNS, TLS certificate, reverse proxy and production service are healthy.
- Confirm all full-service external approval gates have signed evidence.
- Confirm paid, admin, social-login, and sensitive-data feature flags are `true`.
- Run `npm run launch:check`.
- Run backend `npm run launch:check`.
- Apply the reviewed consent-record migration in staging, then production.
- Record database backup ID and complete `BACKUP_RESTORE_EVIDENCE.md`.
- Record deployment owner, rollback tag, and on-call contact.

## After Deployment

1. Run `bash scripts/production-smoke.sh https://jobchaja.com`.
2. Confirm legal, privacy, refund, support and account-deletion URLs are publicly accessible.
3. Confirm auth, consent evidence, account deletion, and privacy request intake.
4. Run a low-value payment canary and verify webhook, cancellation and refund evidence.
5. Monitor errors, auth failures, abuse, complaints, privacy requests, registration, jobs, payments and sensitive-data access.
