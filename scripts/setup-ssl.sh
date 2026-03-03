#!/bin/bash
# =============================================================================
# SSL 인증서 발급 및 자동 갱신 스크립트
# Let's Encrypt SSL Certificate Setup & Auto-Renewal
# =============================================================================
# 사용법 / Usage:
#   chmod +x scripts/setup-ssl.sh
#   sudo ./scripts/setup-ssl.sh
# =============================================================================

set -e

DOMAIN="jobchaja.com"
EMAIL="admin@jobchaja.com"
WEBROOT="/var/www/certbot"

echo "=========================================="
echo " JobChaja SSL Setup - Let's Encrypt"
echo "=========================================="

# Step 1: Certbot 설치 / Install Certbot
echo "[1/4] Certbot 설치 중..."
if ! command -v certbot &> /dev/null; then
    apt-get update
    apt-get install -y certbot
    echo "  ✓ Certbot 설치 완료"
else
    echo "  ✓ Certbot 이미 설치됨"
fi

# Step 2: ACME challenge 디렉토리 생성 / Create webroot directory
echo "[2/4] Webroot 디렉토리 생성 중..."
mkdir -p "$WEBROOT"
echo "  ✓ $WEBROOT 생성 완료"

# Step 3: SSL 인증서 발급 / Issue certificate
# 주의: Nginx가 80 포트에서 실행 중이어야 합니다 (HTTP → certbot challenge)
# Note: Nginx must be running on port 80 for ACME challenge
echo "[3/4] SSL 인증서 발급 중..."
echo "  도메인: $DOMAIN, www.$DOMAIN"
echo "  이메일: $EMAIL"
echo ""

certbot certonly \
    --webroot \
    --webroot-path="$WEBROOT" \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --non-interactive

echo "  ✓ SSL 인증서 발급 완료"
echo "  인증서 경로: /etc/letsencrypt/live/$DOMAIN/"

# Step 4: 자동 갱신 cron job 설정 / Setup auto-renewal cron
echo "[4/4] 자동 갱신 cron job 설정 중..."

CRON_JOB="0 3 * * * certbot renew --quiet --deploy-hook 'docker restart nginx-proxy' >> /var/log/certbot-renew.log 2>&1"

# 기존 cron job 중복 방지 / Prevent duplicate cron entries
(crontab -l 2>/dev/null | grep -v "certbot renew" ; echo "$CRON_JOB") | crontab -

echo "  ✓ Cron job 설정 완료 (매일 03:00 갱신 확인)"

echo ""
echo "=========================================="
echo " 설정 완료! / Setup Complete!"
echo "=========================================="
echo ""
echo "다음 단계 / Next steps:"
echo "  1. Nginx 컨테이너 재시작: docker compose restart nginx"
echo "  2. HTTPS 확인: curl -I https://$DOMAIN"
echo "  3. 인증서 확인: certbot certificates"
echo "  4. 갱신 테스트: certbot renew --dry-run"
echo ""
