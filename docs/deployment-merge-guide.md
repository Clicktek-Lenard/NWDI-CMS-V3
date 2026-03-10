# CMS v3 — Deployment & Merge Guide

Standard procedure for merging a feature branch into `main` and deploying.
Follow these steps in order every time.

---

## 1. Finish your work on the feature branch

```bash
# Confirm you are on your feature branch
git branch

# Stage only the files you changed (never git add -A blindly)
git add src/... docs/...

# Commit with a clear message
git commit -m "feat(module): short description of what changed"
```

---

## 2. Push the feature branch

```bash
git push origin <feature-branch-name>
```

---

## 3. Pull the latest main (check for upstream changes)

```bash
git fetch origin
git log HEAD..origin/main --oneline   # Should be empty if no one pushed to main
```

If there are upstream changes on main, rebase your branch before merging:

```bash
git rebase origin/main
# Fix any conflicts, then:
git rebase --continue
git push origin <feature-branch-name> --force-with-lease
```

---

## 4. Merge into main (no fast-forward — keeps history clean)

```bash
git checkout main
git pull origin main

git merge <feature-branch-name> --no-ff -m "merge: <feature-branch-name> → main

Includes:
- <bullet summary of changes>

Co-Authored-By: <Your Name> <email>"

git push origin main
```

---

## 5. Verify the merge

```bash
git log --oneline -8
# Should show the merge commit at the top followed by the feature commits
```

---

## 6. Deploy (server)

```bash
# On the production/staging server:
git pull origin main
npm install           # or: bun install
npx prisma generate   # regenerate Prisma client if schema changed
npm run build         # Next.js production build
pm2 restart cms-v3    # or your process manager command
```

---

## Conflict Resolution

If `git merge` reports conflicts:

```bash
# See which files conflict
git status

# Open each conflicted file, resolve the <<<<< / ===== / >>>>> markers, then:
git add <resolved-file>

# After all conflicts resolved:
git commit -m "merge: <feature-branch-name> → main (conflict resolved)"
git push origin main
```

**Never use `--force` on main.** If you need to undo a bad merge:

```bash
git revert -m 1 <merge-commit-hash>
git push origin main
```

---

## Branch naming conventions

| Purpose | Name pattern |
|---|---|
| New feature | `feature/<module>-<short-desc>` |
| Bug fix | `fix/<short-desc>` |
| Hotfix on prod | `hotfix/<short-desc>` |
| Release staging | `release/v<major>.<minor>` |

---

## Merge history (this project)

| Date | Branch | What it added |
|---|---|---|
| 2026-03-10 | `feature/card-management` | Full card enrollment lifecycle (API + UI) |
| 2026-03-10 | `feature/table-sorting` | Column sorting, Physician Accreditation, Toast notifications, uniqueness validation, Doctor rename |

---

## Notes

- **Do not commit** `Auth.txt`, `*.sql`, `*.txt`, `scripts/` unless explicitly needed.
- **Do not push** `.env` or any secrets.
- Run `npx prisma generate` after any `prisma/schema.prisma` change — the generated client at `src/generated/prisma/client` must be committed.
- The `prisma db push --accept-data-loss` command is used for schema sync (no migrations folder).
