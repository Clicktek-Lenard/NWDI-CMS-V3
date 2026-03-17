#!/usr/bin/env bash
#
# CMS v3 — PostgreSQL Database Backup Script
# Usage: ./scripts/backup-db.sh [--db cms_v2|cms_audit|all] [--dir /path/to/backups] [--retain 30]
#
set -euo pipefail

# ── Defaults ──────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${PROJECT_DIR}/backups"
DB_NAME="cms_v2"
RETAIN_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# ── Parse arguments ──────────────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
  case "$1" in
    --db)      DB_NAME="$2"; shift 2 ;;
    --dir)     BACKUP_DIR="$2"; shift 2 ;;
    --retain)  RETAIN_DAYS="$2"; shift 2 ;;
    --help|-h)
      echo "Usage: $0 [--db cms_v2|cms_audit|all] [--dir /path] [--retain days]"
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ── Load DATABASE_URL from .env ──────────────────────────────────────────────

ENV_FILE="${PROJECT_DIR}/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: .env file not found at $ENV_FILE"
  exit 1
fi

# Extract connection details from DATABASE_URL
DATABASE_URL=$(grep '^DATABASE_URL=' "$ENV_FILE" | head -1 | cut -d'=' -f2- | tr -d '"' | tr -d "'")
if [[ -z "$DATABASE_URL" ]]; then
  echo "ERROR: DATABASE_URL not found in .env"
  exit 1
fi

# Parse: postgresql://user:pass@host:port/dbname
PGUSER=$(echo "$DATABASE_URL" | sed -E 's|postgresql://([^:]+):.*|\1|')
PGPASSWORD=$(echo "$DATABASE_URL" | sed -E 's|postgresql://[^:]+:([^@]+)@.*|\1|')
PGHOST=$(echo "$DATABASE_URL" | sed -E 's|postgresql://[^@]+@([^:]+):.*|\1|')
PGPORT=$(echo "$DATABASE_URL" | sed -E 's|postgresql://[^@]+@[^:]+:([0-9]+)/.*|\1|')

export PGPASSWORD

# ── Create backup directory ──────────────────────────────────────────────────

mkdir -p "$BACKUP_DIR"
LOG_DIR="${BACKUP_DIR}/logs"
mkdir -p "$LOG_DIR"

# ── Backup function ──────────────────────────────────────────────────────────

backup_database() {
  local db="$1"
  local outfile="${BACKUP_DIR}/${db}_${TIMESTAMP}.dump"
  local logfile="${LOG_DIR}/${db}_${TIMESTAMP}.log"

  echo "[$(date)] Starting backup of $db..."

  if pg_dump \
    --host="$PGHOST" \
    --port="$PGPORT" \
    --username="$PGUSER" \
    --dbname="$db" \
    --format=custom \
    --compress=6 \
    --verbose \
    --file="$outfile" \
    2>"$logfile"; then

    local size
    size=$(du -h "$outfile" | cut -f1)
    echo "[$(date)] SUCCESS: $db → $outfile ($size)"
    echo "SUCCESS: $outfile ($size)" >> "$logfile"
  else
    echo "[$(date)] FAILED: $db backup — see $logfile"
    return 1
  fi
}

# ── Execute backup ───────────────────────────────────────────────────────────

if [[ "$DB_NAME" == "all" ]]; then
  backup_database "cms_v2"
  backup_database "cms_audit"
else
  backup_database "$DB_NAME"
fi

# ── Cleanup old backups ─────────────────────────────────────────────────────

echo "[$(date)] Cleaning backups older than $RETAIN_DAYS days..."
find "$BACKUP_DIR" -name "*.dump" -type f -mtime "+$RETAIN_DAYS" -delete 2>/dev/null || true
find "$LOG_DIR" -name "*.log" -type f -mtime "+$RETAIN_DAYS" -delete 2>/dev/null || true

echo "[$(date)] Backup complete."
