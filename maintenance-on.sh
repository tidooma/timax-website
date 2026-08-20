#!/usr/bin/env bash
set -euo pipefail

FLAG_PATH="/var/www/timax-website/public/maintenance.flag"
mkdir -p "$(dirname "$FLAG_PATH")"
printf 'maintenance\n' > "$FLAG_PATH"
echo "Maintenance mode ON"
