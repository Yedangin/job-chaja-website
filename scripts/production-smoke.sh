#!/usr/bin/env bash
set -euo pipefail

base_url="${1:-http://localhost:3100}"

check_status() {
  local expected="$1"
  local path="$2"
  local actual
  actual="$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' "${base_url}${path}")"
  if [[ "$actual" != "$expected" ]]; then
    echo "ERROR: ${path} returned ${actual}; expected ${expected}" >&2
    exit 1
  fi
  printf 'PASS %-42s %s\n' "$path" "$actual"
}

for path in / /login /register /alba /fulltime /international /diagnosis /recruit-info /contact /privacy-policy /privacy-request /terms-and-conditions /refund-policy /robots.txt /sitemap.xml; do
  check_status 200 "$path"
done

for path in /worker/jobs /company/dashboard /admin /company/payments /diagnosis/premium /worker/visa-verification; do
  check_status 200 "$path"
done

for path in /diagnosis/designs/diagnosis1 /job-cards/designs/variant-01; do
  check_status 404 "$path"
done

echo "Full-service production smoke checks passed."
