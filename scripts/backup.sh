#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/var/www/timax-website}"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
ARCHIVE="$BACKUP_DIR/timax-$TIMESTAMP.tar.gz"

mkdir -p "$BACKUP_DIR"

tar -czf "$ARCHIVE" \
  --exclude="$PROJECT_DIR/node_modules" \
  --exclude="$PROJECT_DIR/.next" \
  -C "$PROJECT_DIR" \
  prisma/dev.db public

find "$BACKUP_DIR" -type f -name 'timax-*.tar.gz' -mtime +7 -delete
printf 'Created backup: %s\n' "$ARCHIVE"
