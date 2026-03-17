#!/usr/bin/env bash
#
# CMS v3 — PostgreSQL Database Restore Script
# Usage: ./scripts/restore-db.sh <backup-file> [--db cms_v2] [--yes]
#
set -euo pipefail

# ── Defaults ──────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_FILE=""
DB_NAME=""
SKIP_CONFIRM=false

# ── Parse arguments ──────────────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
  case "$1" in
    --db)    DB_NAME="$2"; shift 2 ;;
    --yes)   SKIP_CONFIRM=true; shift ;;
    --help|-h)
      echo "Usage: $0 <backup-file.dump> [--db database_name] [--yes]"
      exit 0
      ;;
    *)
      if [[ -z "$BACKUP_FILE" ]]; then
        BACKUP_FILE="$1"; shift
      else
        echo "Unknown option: $1"; exit 1
      fi
      ;;
  esac
done

if [[ -z "$BACKUP_FILE" ]]; then
  echo "ERROR: No backup file specified."
  echo "Usage: $0 <backup-file.dump> [--db database_name] [--yes]"
  exit 1
fi

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "ERROR: Backup file not found: $BACKUP_FILE"
  exit 1
fi

# ── Infer database name from filename if not specified ───────────────────────

if [[ -z "$DB_NAME" ]]; then
  BASENAME=$(basename "$BACKUP_FILE")
  if [[ "$BASENAME" == cms_v2_* ]]; then
    DB_NAME="cms_v2"
  elif [[ "$BASENAME" == cms_audit_* ]]; then
    DB_NAME="cms_audit"
  else
    echo "ERROR: Cannot infer database name from filename. Use --db to specify."
    exit 1
  fi
fi

# ── Load DATABASE_URL from .env ──────────────────────────────────────────────

ENV_FILE="${PROJECT_DIR}/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: .env file not found at $ENV_FILE"
  exit 1
fi

DATABASE_URL=$(grep '^DATABASE_URL=' "$ENV_FILE" | head -1 | cut -d'=' -f2- | tr -d '"' | tr -d "'")
PGUSER=$(echo "$DATABASE_URL" | sed -E 's|postgresql://([^:]+):.*|\1|')
PGPASSWORD=$(echo "$DATABASE_URL" | sed -E 's|postgresql://[^:]+:([^@]+)@.*|\1|')
PGHOST=$(echo "$DATABASE_URL" | sed -E 's|postgresql://[^@]+@([^:]+):.*|\1|')
PGPORT=$(echo "$DATABASE_URL" | sed -E 's|postgresql://[^@]+@[^:]+:([0-9]+)/.*|\1|')

export PGPASSWORD

# ── Confirmation ─────────────────────────────────────────────────────────────

echo ""
echo "  Restore Target:  $DB_NAME"
echo "  Backup File:     $BACKUP_FILE"
echo "  Server:          $PGHOST:$PGPORT"
echo ""
echo "  WARNING: This will overwrite existing data in $DB_NAME."
echo ""

if [[ "$SKIP_CONFIRM" != true ]]; then
  read -rp "  Continue? (yes/no): " CONFIRM
  if [[ "$CONFIRM" != "yes" ]]; then
    echo "  Restore cancelled."
    exit 0
  fi
fi

# ── Restore ──────────────────────────────────────────────────────────────────

echo "[$(date)] Starting restore of $DB_NAME from $BACKUP_FILE..."

pg_restore \
  --host="$PGHOST" \
  --port="$PGPORT" \
  --username="$PGUSER" \
  --dbname="$DB_NAME" \
  --clean \
  --if-exists \
  --verbose \
  "$BACKUP_FILE" 2>&1 || true

# ── Post-restore verification ────────────────────────────────────────────────

echo ""
echo "[$(date)] Verifying restore — row counts for key tables:"
echo ""

for TABLE in queue transactions patient physician; do
  COUNT=$(psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM $TABLE;" 2>/dev/null | tr -d ' ' || echo "N/A")
  printf "  %-20s %s rows\n" "$TABLE" "$COUNT"
done

echo ""
echo "[$(date)] Restore complete."
