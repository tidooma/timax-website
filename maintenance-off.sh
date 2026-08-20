#!/usr/bin/env bash
set -euo pipefail

FLAG_PATH="/var/www/timax-website/public/maintenance.flag"
rm -f "$FLAG_PATH"
echo "Maintenance mode OFF"
if command -v nginx >/dev/null 2>&1; then
  nginx -s reload || service nginx reload || systemctl reload nginx
fi
