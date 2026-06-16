# 胡了卜每日牌局第一版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first playable daily mode for Hu Le Bu with a fixed day seed and locally persisted best progress for the current day.

**Architecture:** Keep the Next.js shell responsible for daily entry, local persistence, summaries, and settlement. Keep the HTML prototype responsible for `mode=daily`, fixed seed generation, per-run progress, and shell messaging, reusing the current 20-level structure and reward pool.

**Tech Stack:** Next.js App Router, React client component, CSS modules, single-file HTML prototype, Vitest static tests.

---

### Task 1: Red Tests

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`

- [x] Add expectations for `开始今日牌局`, `dailyBestLevels`, `runMode: "daily"`, `mode: "daily"`, `dailySeed`, `isDailyMode`, `getDailyLevelIndex`, and `getDailyDifficultyProfile`.
- [x] Run `npm run test -w apps/web -- hulebu`.
- [x] Run `npm run test -w packages/shared -- mahjong-config-playable-prototype`.

### Task 2: Shell Implementation

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`

- [x] Add daily run state, `dailySeed`, and local `dailyBestLevels` persistence.
- [x] Add `buildDailyFrameSrc(sessionKey, upgrades, dailySeed)`.
- [x] Add `startDailyRun()` and wire it to the `每日` panel.
- [x] Update lobby copy, run summary, settlement, and recent-run text to show daily seed and daily best progress.

### Task 3: Prototype Implementation

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- Modify: `apps/web/public/games/hulebu-demo/index.html`

- [x] Parse `mode=daily` and `dailySeed`.
- [x] Add `isDailyMode`, `getDailyLevelIndex`, and `getDailyDifficultyProfile`.
- [x] Make daily mountain generation use fixed seed text based on `dailySeed`.
- [x] Make headers, HUD, progress payloads, and completion summaries expose daily mode context.
- [x] Keep mainline and endless behavior unchanged.

### Task 4: Docs And Verification

**Files:**
- Modify: `docs/tasks/items/T171-hulebu-daily-match.md`
- Modify: `docs/tasks/claims/T171-lee.md`
- Modify: `docs/status/CURRENT_STATUS.md`
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/progress/2026-06-15-lee.md`
- Create: `docs/completion/2026-06-15-task-171-hulebu-daily-match.md`

- [ ] Update task/docs status and module docs with T171 completion notes.
- [ ] Run `npm run docs:sync`.
- [ ] Run both Vitest commands, typecheck, build, both `node --check` extractions, placeholder scan, and `git diff --check`.
- [ ] Use the in-app browser to check `/games/hulebu` on desktop and 390px mobile.
