# App Store Preparation Package

App release is deferred. This package keeps store requirements ready without claiming approval.

## Current Release Blockers

- Worker and company account-deletion screens currently show a success alert without calling the backend deletion API.
- Company payment checkout, credits, premium, history, and summary screens still contain mock data or TODO payment flows.
- Public `https://jobchaja.com` legal/support URLs are unavailable because the production domain refuses HTTPS connections.
- Store submission must remain blocked until these issues are fixed and verified.

## Shared Requirements

- Privacy policy URL: `https://jobchaja.com/privacy-policy`
- Support URL: `https://jobchaja.com/worker/support/contact`
- Account deletion entry point: website and in-app request flow
- Reviewer account and notes: create only in the staging environment
- Actual SDK/data collection must match store declarations
- Social login, payment, and sensitive-data features are enabled in UAT; production approval and store declarations remain required

## Apple

- Prepare App Privacy Details, permissions purpose strings, age rating, export compliance, screenshots, metadata, and review notes.
- Verify in-app account deletion and crash-free release build.

## Google Play

- Prepare Data Safety, App Access, content rating, target API, signing, screenshots, and metadata.
- Verify in-app and website account deletion request paths.
- Use internal/closed testing, pre-launch report, staged rollout, and rollback.
