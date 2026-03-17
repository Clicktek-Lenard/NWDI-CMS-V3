# CMS v3 — Database Backup & Restore

## Prerequisites

- PostgreSQL `pg_dump` and `pg_restore` must be in `$PATH`
- Verify versions match: `pg_dump --version` should be >= your PostgreSQL server version
- `.env` file must contain valid `DATABASE_URL`

## Databases

| Database | Purpose |
|----------|---------|
| `cms_v2` | Main CMS database (patients, queue, transactions, etc.) |
| `cms_audit` | Audit trail (activity logs, kiosk logs) |

## Manual Backup

```bash
# Backup main database
./scripts/backup-db.sh --db cms_v2

# Backup audit database
./scripts/backup-db.sh --db cms_audit

# Backup both
./scripts/backup-db.sh --db all

# Custom backup directory
./scripts/backup-db.sh --db all --dir /path/to/backups

# Custom retention (default: 30 days)
./scripts/backup-db.sh --db all --retain 60
```

Backups are saved to `backups/` as `.dump` files (PostgreSQL custom format, compressed).

Filename pattern: `{database}_{YYYYMMDD_HHMMSS}.dump`

## Automated Backup (Cron / Task Scheduler)

### Linux (cron)

```bash
# Edit crontab
crontab -e

# Daily backup at 2:00 AM
0 2 * * * cd /path/to/CMS-v3 && ./scripts/backup-db.sh --db all >> backups/logs/cron.log 2>&1
```

### Windows (Task Scheduler)

1. Open Task Scheduler
2. Create Basic Task > "CMS Backup"
3. Trigger: Daily at 2:00 AM
4. Action: Start a Program
   - Program: `bash`
   - Arguments: `scripts/backup-db.sh --db all`
   - Start in: `C:\Clicktek\Projects\NWDI\CMS - Claude\CMS-v3`

## Admin API (Manual Trigger)

DEVTEAM users can trigger a backup via the API:

```bash
curl -X POST http://localhost:3000/api/admin/backup \
  -H "Content-Type: application/json" \
  -H "Cookie: <session-cookie>" \
  -d '{"db": "all"}'
```

## Restore

```bash
# Restore from a backup file (auto-detects database from filename)
./scripts/restore-db.sh backups/cms_v2_20260317_020000.dump

# Specify database explicitly
./scripts/restore-db.sh backups/my-backup.dump --db cms_v2

# Skip confirmation prompt
./scripts/restore-db.sh backups/cms_v2_20260317_020000.dump --yes
```

The restore script:
1. Drops and recreates all objects (`--clean --if-exists`)
2. Loads data from the backup
3. Verifies row counts for key tables (queue, transactions, patient, physician)

**Warning**: Restore overwrites existing data. Always verify you are targeting the correct database.

## Backup Retention

The backup script automatically cleans up `.dump` files older than the retention period (default: 30 days). Adjust with `--retain N` where N is the number of days to keep.

## Disaster Recovery Checklist

1. Identify the most recent backup in `backups/`
2. Stop the CMS application (`npm run dev` or production process)
3. Run the restore script: `./scripts/restore-db.sh <latest-backup.dump>`
4. Verify row counts in the restore output
5. Run `npx prisma generate` if schema has changed
6. Restart the application
7. Verify via Prisma Studio: `npx prisma studio`
