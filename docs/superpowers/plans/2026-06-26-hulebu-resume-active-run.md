# Hulebu Resume Active Run Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refreshing `/games/hulebu` restores the unfinished run to the current level or endless layer instead of restarting from level 1.

**Architecture:** Persist a small `activeRun` resume snapshot in the existing shell localStorage record. On hydration, sanitize the snapshot and rebuild the iframe URL from current shell settings, adding `level` for finite modes and `startLayer` for endless mode. Clear the snapshot when a run fails or completes.

**Tech Stack:** Next.js client component, TypeScript, localStorage, iframe query parameters, Vitest string-regression tests.

---

### Task 1: Lock Resume Snapshot Behavior With Tests

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`
- Test: `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`

- [ ] **Step 1: Write the failing test**

Add assertions to the web shell test suite that require:

```ts
expect(component).toContain("type ActiveRunResumeState =");
expect(component).toContain("activeRun: ActiveRunResumeState | null;");
expect(component).toContain("function restoreActiveRunFromPersistedState");
expect(component).toContain("function buildRunFrameSrc(");
expect(component).toContain("resumeLevelOrder?: number");
expect(component).toContain('params.set("level", String(resumeLevelOrder));');
expect(component).toContain("resumeEndlessLayer?: number");
expect(component).toContain('startLayer: String(resumeEndlessLayer ?? ENDLESS_START_LAYER)');
expect(component).toContain("activeRun: activeRun ? toActiveRunResumeState(activeRun) : null");
expect(component).toContain("const restoredActiveRun = restoreActiveRunFromPersistedState(persisted, persisted.upgrades, persisted.selectedRouteFocus);");
expect(component).toContain("setActiveRun(restoredActiveRun);");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -w apps/web -- hulebu`

Expected: FAIL because `ActiveRunResumeState` and `restoreActiveRunFromPersistedState` do not exist yet.

### Task 2: Implement Shell Resume Snapshot

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- Test: `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`

- [ ] **Step 1: Add persisted resume types**

Add `ActiveRunResumeState`, include `activeRun` in `PersistedShellState`, and add default `activeRun: null` in every fallback return from `readPersistedShellState`.

- [ ] **Step 2: Add URL resume parameters**

Update frame builders:

```ts
function buildRunFrameSrc(..., resumeLevelOrder?: number) {
  ...
  if (resumeLevelOrder && resumeLevelOrder > 1) params.set("level", String(resumeLevelOrder));
}

function buildEndlessFrameSrc(..., resumeEndlessLayer?: number) {
  ...
  startLayer: String(resumeEndlessLayer ?? ENDLESS_START_LAYER),
}
```

Apply the same `resumeLevelOrder` pattern to daily and ascension builders.

- [ ] **Step 3: Add sanitizer and restore helper**

Implement:

```ts
function toActiveRunResumeState(activeRun: ActiveRun): ActiveRunResumeState
function restoreActiveRunFromPersistedState(
  persisted: PersistedShellState,
  upgrades: UpgradeState,
  selectedRouteFocus: RouteFocusId,
): ActiveRun | null
```

The restore helper clamps level order to at least 1, clamps endless layer to at least `ENDLESS_START_LAYER`, rebuilds `iframeSrc`, and chooses a readable `latestSummary`.

- [ ] **Step 4: Wire hydration and persistence**

During hydration, call `restoreActiveRunFromPersistedState(...)` and set `activeRun`. In the persistence effect, write:

```ts
activeRun: activeRun ? toActiveRunResumeState(activeRun) : null,
```

Add `activeRun` to the effect dependency list.

- [ ] **Step 5: Verify green**

Run: `npm run test -w apps/web -- hulebu`

Expected: PASS.

### Task 3: Document And Verify

**Files:**
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/progress/2026-06-26-lee.md`
- Modify: `docs/tasks/items/T187-hulebu-resume-active-run.md`
- Modify: `docs/tasks/claims/T187-lee.md`

- [ ] **Step 1: Update docs**

Record that T187 restores unfinished runs to the current level/layer after refresh, while full mid-board cloud saves remain out of scope.

- [ ] **Step 2: Run verification**

Run:

```bash
npm run test -w apps/web -- hulebu
npm run test -w packages/shared -- mahjong-config-playable-prototype
perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-inline.js && node --check /tmp/hulebu-config-playable-inline.js
perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/web/public/games/hulebu-demo/index.html > /tmp/hulebu-static-inline.js && node --check /tmp/hulebu-static-inline.js
npm run typecheck -w apps/web
npm run build -w apps/web
npm run docs:sync
git diff --check
```

Expected: all commands pass.
