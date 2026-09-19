#!/bin/bash
# Serverdagi deploy skripti. GitHub Actions SSH orqali shu skriptga loyiha arxivini (tar.gz) yuboradi.
#
# Serverda /opt/vaqtim/deploy.sh sifatida turadi va GitHub deploy kaliti FAQAT shu skriptni ishga tushira oladi
# (authorized_keys'da command="/opt/vaqtim/deploy.sh" cheklovi bilan). Shu sababli repo'dagi nusxa o'zgarsa,
# serverdagisi o'z-o'zidan yangilanmaydi — xavfsizlik uchun uni qo'lda ko'chirish kerak:
#   cp /opt/vaqtim/deploy/server-deploy.sh /opt/vaqtim/deploy.sh

set -euo pipefail

VAQTINCHA=$(mktemp -d)
trap 'rm -rf "$VAQTINCHA"' EXIT

echo "==> Arxiv ochilmoqda"
tar -xzf - -C "$VAQTINCHA"

echo "==> Backend kodi yangilanmoqda"
rm -rf /opt/vaqtim/src
mv "$VAQTINCHA/src" /opt/vaqtim/src
# deploy papkasidagi .env (parollar) saqlanib qoladi, qolganlari yangilanadi
find /opt/vaqtim/deploy -mindepth 1 -maxdepth 1 ! -name .env -exec rm -rf {} +
cp -r "$VAQTINCHA/deploy/." /opt/vaqtim/deploy/

echo "==> Backend build qilinib, qayta ishga tushirilmoqda"
cd /opt/vaqtim/deploy
docker compose up -d --build

echo "==> Frontend almashtirilmoqda"
# Avval yangisini yonida tayyorlab, keyin bir zumda almashtiramiz: sayt yarim yangilangan holatda qolmaydi
rm -rf /var/www/vaqtim.yangi /var/www/vaqtim.eski
mv "$VAQTINCHA/dist" /var/www/vaqtim.yangi
chown -R www-data:www-data /var/www/vaqtim.yangi
mv /var/www/vaqtim /var/www/vaqtim.eski
mv /var/www/vaqtim.yangi /var/www/vaqtim
rm -rf /var/www/vaqtim.eski

echo "==> Eski Docker image'lari tozalanmoqda"
docker image prune -f > /dev/null

echo "==> API tekshirilmoqda"
for i in $(seq 1 30); do
  if curl -sf http://127.0.0.1:5100/api/mahsulotlar > /dev/null; then
    echo "Deploy muvaffaqiyatli yakunlandi"
    exit 0
  fi
  sleep 2
done

echo "XATO: API 60 soniya ichida javob bermadi. Oxirgi loglar:"
docker logs --tail 50 vaqtim-api-1
exit 1
