# TimePick PostgreSQL Migration Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first DreamChasers-owned TimePick data foundation using the same DreamChasers account `User.id`.

**Architecture:** Keep TimePick as a product surface, but move its data ownership into DreamChasers PostgreSQL. T114 adds Prisma `TimePick*` models and a protected bootstrap API; later tasks replace the standalone TimePick frontend data calls and import historical Supabase data.

**Tech Stack:** Next.js App Router, Auth.js database sessions, Prisma 7, PostgreSQL, Vitest.

---

### Task 1: TimePick Domain Rules

**Files:**
- Create: `apps/web/src/lib/timepick/timepick-model.ts`
- Test: `apps/web/src/lib/timepick/__tests__/timepick-model.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from "vitest";
import { canAccessTimePickOwnerRecord, defaultTimePickSections } from "../timepick-model";

describe("timepick model rules", () => {
  it("keeps the four legacy TimePick sections in stable order", () => {
    expect(defaultTimePickSections.map((section) => section.type)).toEqual(["webpage", "document", "image", "video"]);
    expect(defaultTimePickSections.map((section) => section.sortOrder)).toEqual([1, 2, 3, 4]);
  });

  it("allows records only for the same DreamChasers user id", () => {
    expect(canAccessTimePickOwnerRecord({ ownerUserId: "user_a", requesterUserId: "user_a" })).toBe(true);
    expect(canAccessTimePickOwnerRecord({ ownerUserId: "user_a", requesterUserId: "user_b" })).toBe(false);
  });
});
```

- [ ] **Step 2: Run red test**

Run: `npm run test -w apps/web -- timepick-model`

Expected: FAIL because `../timepick-model` does not exist.

- [ ] **Step 3: Implement rules**

Create `timepick-model.ts` exporting `defaultTimePickSections` and `canAccessTimePickOwnerRecord`.

- [ ] **Step 4: Run green test**

Run: `npm run test -w apps/web -- timepick-model`

Expected: PASS.

### Task 2: Prisma TimePick Schema

**Files:**
- Modify: `apps/web/prisma/schema.prisma`
- Generated: `apps/web/src/generated/prisma/**`

- [ ] **Step 1: Add models**

Add `TimePickProfile`, `TimePickUserRole`, `TimePickSection`, `TimePickFolder`, `TimePickResource`, `TimePickInspiration`, `TimePickSearchHistory`, `TimePickTagGroup`, `TimePickLearningFocus`, `TimePickTryQueueLink`, and `TimePickFortuneDraw`. Private tables use `userId String` with `User` relation and cascade delete.

- [ ] **Step 2: Validate schema**

Run: `npm exec prisma validate -w apps/web`

Expected: Prisma schema is valid.

- [ ] **Step 3: Generate client**

Run: `npm exec prisma generate -w apps/web`

Expected: Generated Prisma client includes `timePickProfile` and related delegates.

### Task 3: Bootstrap API

**Files:**
- Create: `apps/web/src/lib/timepick/timepick-data.ts`
- Create: `apps/web/src/app/api/timepick/bootstrap/route.ts`

- [ ] **Step 1: Implement service**

Add `getTimePickBootstrapForUser(userId, email)` that upserts a `TimePickProfile`, upserts the four default sections, and returns `{ profile, sections }`.

- [ ] **Step 2: Implement route**

Add `GET /api/timepick/bootstrap`. It calls `auth()`, rejects anonymous users with 401, and returns the bootstrap payload for `session.user.id`.

- [ ] **Step 3: Verify route types**

Run: `npm run typecheck -w apps/web`

Expected: no TypeScript errors.

### Task 4: Final Verification and Docs

**Files:**
- Modify: `docs/tasks/items/T114-timepick-postgres-migration-foundation.md`
- Modify: `docs/tasks/claims/T114-lee.md`
- Modify: `docs/progress/2026-06-03-lee.md`
- Create: `docs/completion/2026-06-03-task-T114-timepick-postgres-migration-foundation.md`

- [ ] **Step 1: Run validation**

Run:

```bash
npm exec prisma validate -w apps/web
npm run test -w apps/web -- timepick account
npm run typecheck -w apps/web
npm run lint -w apps/web
npm run build -w apps/web
npm run docs:sync
git diff --check
```

Expected: all commands exit 0. ESLint may report generated Prisma warnings with exit 0.

- [ ] **Step 2: Update docs**

Mark T114 as `待验收`, write completion record, and note that TimePick frontend rewiring and historical data import remain separate follow-up tasks.
