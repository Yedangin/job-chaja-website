# Website Launch Operations Runbook

## Owners

| Area | Primary | Backup |
|---|---|---|
| Release / rollback | Engineering Lead | DevOps |
| Security incident | Security/Privacy Lead | CEO |
| Customer complaint | Operations Lead | CEO |
| Privacy request | Privacy Lead | Operations |
| Payment issue | Finance | Engineering |

## Release

1. Confirm `PAID_FEATURES_ENABLED=false` and `ADMIN_ROUTES_ENABLED=false`.
2. Run `npm run launch:check`.
3. Back up production databases and record backup ID.
4. Tag the approved commit and record deployment ID.
5. Deploy to staging, run UAT, then deploy to a small allowlisted audience.
6. Monitor HTTP errors, auth failures, complaints and privacy requests.

## Rollback

1. Stop rollout and preserve logs.
2. Redeploy the previous approved tag.
3. Restore database only when schema/data corruption is confirmed.
4. Notify Privacy Lead if personal data may be affected.
5. Record timeline, impact, root cause and corrective action.

## Incident Response

1. Triage severity and contain access.
2. Rotate affected credentials and revoke sessions.
3. Preserve audit evidence.
4. Assess notification obligations with Privacy Lead/counsel.
5. Notify affected users/regulators when required.
6. Complete post-incident review within seven days.

## Monitoring Schedule

- D0/D+1: errors, auth, abuse, complaints, privacy requests.
- D+7: incident/compliance review.
- D+30: vendor, access, retention and deletion review.

