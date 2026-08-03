# Hulebu Account Active Run Save Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Save the unfinished Hulebu active run snapshot to the signed-in account as well as localStorage.

**Architecture:** Add nullable `activeRun` JSON to `HulebuProgress`. Reuse the T187 resume snapshot with an `updatedAt` timestamp. Account progress sanitize/merge keeps the newer snapshot, API accepts the field, and the page initial sync restores whichever snapshot is newer.

**Tech Stack:** Prisma, PostgreSQL JSONB, Next.js route handlers, TypeScript, localStorage, Vitest string-regression tests.

---

### Task 1: Add Failing Regression Tests

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`

- [ ] Add a test requiring `activeRun Json?` in Prisma schema, migration SQL, account progress type, API payload, `pushAccountProgress`, and remote merge in `HulebuGamePage.tsx`.
- [ ] Run `npm run test -w apps/web -- hulebu`; expect failure because account `activeRun` is not implemented yet.

### Task 2: Persist Active Run In Account Progress

**Files:**
- Modify: `apps/web/prisma/schema.prisma`
- Create: `apps/web/prisma/migrations/20260627103000_add_hulebu_active_run/migration.sql`
- Modify: `apps/web/src/lib/account/hulebu-progress.ts`
- Modify: `apps/web/src/app/api/games/hulebu/progress/route.ts`

- [ ] Add nullable `activeRun Json?` to `HulebuProgress`.
- [ ] Add migration SQL: `ALTER TABLE "HulebuProgress" ADD COLUMN IF NOT EXISTS "activeRun" JSONB;`.
- [ ] Add `activeRun` to `HulebuProgressRecord`, stored record, default progress, sanitize, merge, get, upsert create/update, and returned payload.
- [ ] Add `activeRun?: Record<string, unknown> | null` to the route POST payload.

### Task 3: Sync Remote Active Run In Shell

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`

- [ ] Add `updatedAt` to `ActiveRunResumeState`.
- [ ] Stamp `updatedAt: new Date().toISOString()` in `toActiveRunResumeState`.
- [ ] Include `activeRun` in `RemoteProgressState`, `fetchAccountProgress`, `pushAccountProgress`.
- [ ] Add helper `chooseLatestActiveRunResume(local, remote)` and use it during account initial sync.
- [ ] Restore selected remote/local snapshot via `restoreActiveRunFromPersistedState`.

### Task 4: Verify And Document

**Files:**
- Modify docs listed in T188.

- [ ] Run `npm exec prisma validate -w apps/web`.
- [ ] Run `npm run test -w apps/web -- hulebu`.
- [ ] Run `npm run typecheck -w apps/web`.
- [ ] Run `npm run build -w apps/web`.
- [ ] Run `npm run docs:sync`.
- [ ] Run placeholder scan and `git diff --check`.
