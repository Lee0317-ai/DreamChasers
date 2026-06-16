# 胡了卜 Boss 试炼第二版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把胡了卜 Boss 节点升级为有阶段、变体、奖励品质和结算复盘的第二版试炼。

**Architecture:** HTML 原型负责 Boss 变体判断、阶段目标池、奖励品质和 `bossReview` payload；Next.js `/games/hulebu` 壳层负责接收 `bossReview` 并在结算面板展示。静态 Demo 从源原型同步，测试用文本断言锁定核心结构。

**Tech Stack:** Next.js/React 客户端组件、单文件 HTML 原型、Vitest 文本测试、文档分片、`npm run docs:sync`。

---

## File Structure

- Create: `docs/tasks/items/T177-hulebu-boss-trial-second-pass.md`
- Create: `docs/tasks/claims/T177-lee.md`
- Create: `docs/superpowers/specs/2026-06-16-hulebu-boss-trial-second-pass-design.md`
- Create: `docs/superpowers/plans/2026-06-16-hulebu-boss-trial-second-pass.md`
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
  - 增加 `bossReview` payload 类型、结算状态和 Boss 复盘卡片。
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`
  - 增加 Boss 复盘卡片样式。
- Modify: `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`
  - 先写失败测试锁定外层 Boss 复盘结构。
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
  - 增加 Boss 阶段目标池、变体、奖励品质和复盘 payload。
- Modify: `apps/web/public/games/hulebu-demo/index.html`
  - 同步站内静态 Demo。
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`
  - 先写失败测试锁定内层 Boss 第二版结构。
- Modify: `docs/modules/mahjong-roguelike/**`
  - 同步 T177 进展和交接。
- Modify: `docs/progress/2026-06-16-lee.md`
- Create: `docs/completion/2026-06-16-task-177-hulebu-boss-trial-second-pass.md`

## Task 1: Register T177

**Files:**
- Modify: `docs/tasks/CHANGE_INTAKE.md`
- Modify: `docs/tasks/NEXT_ID.md`
- Create: `docs/tasks/items/T177-hulebu-boss-trial-second-pass.md`
- Create: `docs/tasks/claims/T177-lee.md`
- Create: `docs/superpowers/specs/2026-06-16-hulebu-boss-trial-second-pass-design.md`
- Create: `docs/superpowers/plans/2026-06-16-hulebu-boss-trial-second-pass.md`

- [x] Add IDEA-20260616-03.
- [x] Create T177 task and claim files.
- [x] Increment `NEXT_ID` to `178`.
- [x] Write the T177 design spec and implementation plan.

## Task 2: Lock Failing Tests First

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`

- [x] Add failing `apps/web` expectations for `bossReview`, `Boss 复盘`, `阶段目标`, `Boss 奖励品质`, and `高阶 Boss 变体`.
- [x] Run `npm run test -w apps/web -- hulebu` and confirm the new expectations fail for missing strings.
- [x] Add failing prototype expectations for `BOSS_TRIAL_PHASES`, `BOSS_TRIAL_VARIANTS`, `getBossTrialDeck`, `getBossReviewPayload`, and `bossReview`.
- [x] Run `npm run test -w packages/shared -- mahjong-config-playable-prototype` and confirm the new expectations fail.

## Task 3: Implement Inner Demo Boss Second Pass

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- Modify: `apps/web/public/games/hulebu-demo/index.html`

- [x] Add `BOSS_TRIAL_PHASES` and `BOSS_TRIAL_VARIANTS` constants near existing Boss constants.
- [x] Add `getBossTrialDeck` to select variant, phases and reward quality from current mode/tier/level.
- [x] Render phase targets and `Boss 奖励品质` in the active Boss panel.
- [x] Add `getBossReviewPayload` and include `bossReview` in complete/failure shell messages.
- [x] Sync the source prototype into the static demo.
- [x] Re-run `npm run test -w packages/shared -- mahjong-config-playable-prototype` and get back to green.

## Task 4: Implement Outer Shell Boss Review

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`

- [x] Add `BossReview` type and optional `bossReview` fields to iframe payload and settlement state.
- [x] Persist `bossReview` in the message handler when a run completes or fails.
- [x] Render a Boss review card in the settlement panel with phase, variant, reward quality, miss and next advice.
- [x] Re-run `npm run test -w apps/web -- hulebu` and get back to green.

## Task 5: Full Verification And Docs

**Files:**
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/modules/mahjong-roguelike/DECISIONS.md`
- Modify: `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- Modify: `docs/progress/2026-06-16-lee.md`
- Create: `docs/completion/2026-06-16-task-177-hulebu-boss-trial-second-pass.md`

- [x] Update module docs with T177 outcome and remaining follow-ups.
- [x] Run `npm run typecheck -w apps/web`.
- [x] Run `npm run build -w apps/web`.
- [x] Run the inline script syntax checks for source/static HTML.
- [x] Run `npm run docs:sync`.
- [x] Run `git diff --check`.
- [x] Run browser desktop and 390px mobile checks for `/games/hulebu`.

## Self Review

- Spec coverage: the plan covers Boss variants, phase goals, reward quality, `bossReview`, outer-shell settlement UI, static demo sync, docs and verification.
- Placeholder scan: no placeholder text remains.
- Naming consistency: `T177`, `boss-trial-second-pass`, `BOSS_TRIAL_PHASES`, `BOSS_TRIAL_VARIANTS`, `getBossTrialDeck`, `getBossReviewPayload` and `bossReview` are consistent across task, spec and plan.
