#!/usr/bin/env bash
set -euo pipefail

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

echo "Checking launch configuration..."

for flag in PAID_FEATURES_ENABLED ADMIN_ROUTES_ENABLED NEXT_PUBLIC_SOCIAL_LOGIN_ENABLED SENSITIVE_DATA_FEATURES_ENABLED; do
  if [[ "${!flag:-false}" != "true" ]]; then
    echo "ERROR: ${flag} must be true for a full-service launch." >&2
    exit 1
  fi
done

npx eslint \
  src/app/robots.ts src/app/sitemap.ts src/app/layout.tsx src/proxy.ts \
  src/app/register/page.tsx src/app/company/verification/page.tsx \
  src/app/identity-verification/complete/page.tsx \
  src/app/identity-verification/mobile/page.tsx \
  src/components/identity-verification-panel.tsx \
  src/lib/identity-verification-client.ts \
  src/i18n/use-identity-translations.ts \
  'src/app/api/identity-verifications/[...path]/route.ts' \
  src/app/company/payments/checkout/page.tsx \
  src/app/company/payments/credits/page.tsx \
  src/app/company/payments/premium/page.tsx \
  'src/app/api/payments/[...path]/route.ts' \
  src/lib/portone-payment.ts \
  'src/app/(public)/privacy-policy/page.tsx' \
  'src/app/(public)/privacy-request/page.tsx' \
  'src/app/(public)/terms-and-conditions/page.tsx' \
  'src/app/(public)/refund-policy/page.tsx' \
  'src/app/api/visa-verification/[[...path]]/route.ts' \
  src/features/auth/components/signup-form.tsx \
  src/features/auth/components/social-login-buttons.tsx \
  src/features/auth/components/terms-agreement.tsx \
  src/features/auth/hooks/use-signup.ts src/features/auth/types/auth.types.ts \
  src/lib/legal.ts next.config.ts

npm run typecheck:launch
npm run build
echo "Full-service launch checks passed."
