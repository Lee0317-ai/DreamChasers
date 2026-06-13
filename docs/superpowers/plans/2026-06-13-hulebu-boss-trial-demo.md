# 胡了卜 Boss 试炼 Demo 第一版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在胡了卜朋友试玩 Demo 第 10 关加入轻量 Boss 试炼终点。

**Architecture:** 复用现有单 HTML 原型状态机和 Boss 目标系统。新增朋友 Demo 试炼 helper，让第 10 关返回本地试炼目标、试炼标题和奖励；不改正式关卡 JSON，不改 Cocos 工程。

**Tech Stack:** HTML/CSS/Vanilla JavaScript 原型、Vitest 静态/VM 测试、Next.js 静态 iframe 接入。

---

## File Structure

- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`
  - 静态检查 Boss 试炼常量、helper、文案和奖励函数。
- Modify: `packages/shared/src/mahjong-config.test.ts`
  - VM 行为测试第 10 关试炼目标、HUD、目标栏、奖励结算和目标失败提示。
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
  - 源 HTML Demo 的试炼目标、标题、HUD 和奖励结算。
- Modify: `apps/web/public/games/hulebu-demo/index.html`
  - 站内静态发布副本，同步源 Demo，仅保留静态配置 fetch 路径。
- Modify docs:
  - `docs/tasks/items/T164-hulebu-boss-trial-demo.md`
  - `docs/tasks/claims/T164-lee.md`
  - `docs/modules/mahjong-roguelike/README.md`
  - `docs/modules/mahjong-roguelike/PROGRESS.md`
  - `docs/modules/mahjong-roguelike/HANDOFF.md`
  - `docs/progress/2026-06-13-lee.md`
  - `docs/completion/2026-06-13-task-164-hulebu-boss-trial-demo.md`

## Task 1: Red Tests

**Files:**
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`
- Modify: `packages/shared/src/mahjong-config.test.ts`

- [ ] Add a static test asserting the HTML contains `FRIEND_DEMO_BOSS_TRIAL_LEVEL_INDEX`, `FRIEND_DEMO_BOSS_TRIAL_GOALS`, `FRIEND_DEMO_BOSS_TRIAL_REWARD_COINS`, `function isFriendDemoBossTrialLevel`, `function getFriendDemoBossTrialGoals`, `function getBossGoalTitleText`, `function claimBossTrialReward`, `终局试炼`, `试炼奖励`, `试炼`.
- [ ] Add a VM helper that loads level index `9` in play/mountain mode and returns boss goals, HUD text, boss title text, generated solution source packages, failed-clear message, and reward result.
- [ ] Run `npm run test -w packages/shared -- mahjong-config-playable-prototype` and `npm run test -w packages/shared -- mahjong-config`; both should fail before implementation.

## Task 2: Implement Trial Goals And UI Text

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`

- [ ] Add constants:
  - `FRIEND_DEMO_BOSS_TRIAL_LEVEL_INDEX = 9`
  - `FRIEND_DEMO_BOSS_TRIAL_TITLE = "终局试炼"`
  - `FRIEND_DEMO_BOSS_TRIAL_REWARD_COINS = 180`
  - `FRIEND_DEMO_BOSS_TRIAL_GOALS` with `gang 1`, `hu 1`, and `score_target 180`
- [ ] Add helper functions:
  - `isFriendDemoBossTrialLevel(levelIndex)`
  - `getFriendDemoBossTrialGoals(levelIndex)`
  - `getBossGoalTitleText()`
  - `getBossHudLabelText()`
- [ ] Update `getActiveBossGoals(levelIndex)` so the friend demo第 10 关 returns trial goals before falling back to normal config logic.
- [ ] Update `renderBossGoal()` and `getHudGoalText()` to show `终局试炼` and `试炼 x/y` for this level.

## Task 3: Implement Trial Reward

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`

- [ ] Add `bossTrialRewardClaimed: false` to level state.
- [ ] Add `claimBossTrialReward()` that only triggers when all goals are complete and reward is not yet claimed.
- [ ] Call it inside `completeCurrentLevel()` alongside existing modifier reward.
- [ ] Make the status message include `试炼奖励 +180 铜钱`.
- [ ] Keep existing final run summary compatible.

## Task 4: Sync Static Demo And Verify

**Files:**
- Modify: `apps/web/public/games/hulebu-demo/index.html`

- [ ] Copy source HTML to static HTML.
- [ ] Restore static `fetch("/games/hulebu-demo/config/levels.json")` and `fetch("/games/hulebu-demo/config/rewards.json")` paths.
- [ ] Run:
  - `npm run test -w packages/shared -- mahjong-config-playable-prototype`
  - `npm run test -w packages/shared -- mahjong-config`
  - HTML 内联脚本语法检查
  - `npm run test -w apps/web -- hulebu`
  - Browser desktop check
  - Browser 390px mobile check

## Task 5: Docs And Completion

**Files:**
- Modify module docs and T164 task docs.
- Create completion record.

- [ ] Mark T164 item and claim as complete.
- [ ] Update README/PROGRESS/HANDOFF with Boss 试炼第一版.
- [ ] Append T164 to `docs/progress/2026-06-13-lee.md`.
- [ ] Create `docs/completion/2026-06-13-task-164-hulebu-boss-trial-demo.md`.
- [ ] Run `npm run docs:sync`.
- [ ] Run `git diff --check`.

## Self Review

- Spec coverage: the plan covers trial goals, HUD/title, reward, static sync, tests, browser verification, and docs.
- Placeholder scan: no placeholders or incomplete sections remain.
- Type consistency: function and constant names match the intended static and VM tests.
