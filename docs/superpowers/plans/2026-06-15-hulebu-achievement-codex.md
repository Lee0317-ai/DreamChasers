# 胡了卜成就图鉴第一版 Implementation Plan

**Goal:** Add the first local achievement codex to `/games/hulebu`, using existing shell state and local persistence to surface long-term progress.

**Architecture:** Keep the achievement codex entirely in the Next.js shell. Reuse existing settlement, endless best layer, daily best progress, and upgrade state as unlock signals. Do not change the HTML prototype, reward config, or level config in this task.

**Tech Stack:** Next.js App Router, React client component, CSS modules, Vitest static tests.

---

### Task 1: Red Tests

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`

- [ ] Add expectations for the codex panel copy, achievement storage field, and representative achievement ids.
- [ ] Run `npm run test -w apps/web -- hulebu`.

### Task 2: Shell Implementation

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`

- [ ] Add local achievement persistence and safe hydration for old storage.
- [ ] Add achievement definitions, derived progress text, and unlock helpers.
- [ ] Replace the collection placeholder with a real codex panel and summary.
- [ ] Update settlement and purchase flows to refresh codex unlocks from new progress.

### Task 3: Docs And Verification

**Files:**
- Modify: `docs/tasks/items/T172-hulebu-achievement-codex.md`
- Modify: `docs/tasks/claims/T172-lee.md`
- Modify: `docs/status/CURRENT_STATUS.md`
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/progress/2026-06-15-lee.md`
- Create: `docs/completion/2026-06-15-task-172-hulebu-achievement-codex.md`

- [ ] Update task/docs status and module docs with T172 notes.
- [ ] Run `npm run docs:sync`.
- [ ] Run web tests, typecheck, build, placeholder scan, and `git diff --check`.
- [ ] Use the in-app browser to check `/games/hulebu` on desktop and 390px mobile.
