# 胡了卜 20 关完整主线 Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for code changes and superpowers:verification-before-completion before marking this complete.

**Goal:** 把默认站内胡了卜 Demo 从 10 关扩展到 20 关主线，并启用第 20 关终章 Boss。

**Architecture:** 继续以 HTML 试玩原型作为快速验证面。共享测试用静态扫描和 VM 行为测试锁定关卡数、奖励节点和 Boss helper；源 HTML 改完后机械同步到站内静态 Demo，保留静态 fetch 路径。

**Tech Stack:** 单文件 HTML 原型、Next public 静态 iframe、Vitest、Node inline script syntax check、Codex App 浏览器检查。

## File Structure

- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
  - 扩展默认可玩关卡数、后半段 difficulty profile、奖励节点和终章 Boss helper。
- Modify: `apps/web/public/games/hulebu-demo/index.html`
  - 同步源 HTML，保留 `/games/hulebu-demo/config/levels.json` 静态路径。
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`
  - 增加静态测试覆盖 20 关、奖励 checkpoint 和终章 Boss 标识。
- Modify: `packages/shared/src/mahjong-config.test.ts`
  - 增加 VM 行为测试覆盖 playable count、reward checkpoint、final Boss goals。
- Modify docs under `docs/tasks/**`, `docs/superpowers/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`.

## Task 1: Register And Claim T166

**Files:**
- Modify: `docs/tasks/CHANGE_INTAKE.md`
- Modify: `docs/tasks/NEXT_ID.md`
- Create: `docs/tasks/items/T166-hulebu-20-level-mainline-demo.md`
- Create: `docs/tasks/claims/T166-lee.md`
- Create: `docs/superpowers/specs/2026-06-13-hulebu-20-level-mainline-demo-design.md`
- Create: `docs/superpowers/plans/2026-06-13-hulebu-20-level-mainline-demo.md`

- [x] Add IDEA-20260613-04.
- [x] Create task item and claim.
- [x] Increment NEXT_ID to 167.
- [x] Write the scope spec and implementation plan.

## Task 2: Add Failing Tests

**Files:**
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`
- Modify: `packages/shared/src/mahjong-config.test.ts`

- [ ] Add a static assertion for `FRIEND_DEMO_LEVEL_COUNT = 20` or equivalent.
- [ ] Add reward checkpoint assertions for `[2, 5, 8, 12, 15, 18]`.
- [ ] Add final Boss assertions for level index `19` and visible `胡了卜王`.
- [ ] Run the targeted tests and confirm the new assertions fail before production code changes.

## Task 3: Implement 20-Level Mainline

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`

- [ ] Expand default playable count to 20.
- [ ] Add level 11-19 difficulty profiles without changing the first 10 levels' intended rhythm.
- [ ] Add final Boss helper so level 20 returns configured Boss goals.
- [ ] Expand reward checkpoints to level 3, 6, 9, 13, 16, 19.
- [ ] Keep level 10 as a mid-run trial.

## Task 4: Sync Static Demo

**Files:**
- Modify: `apps/web/public/games/hulebu-demo/index.html`

- [ ] Copy source HTML logic to the public static demo.
- [ ] Restore the static `levels.json` fetch path.
- [ ] Verify static inline script syntax.

## Task 5: Verify

**Files:**
- All modified code and docs.

- [ ] Run shared prototype tests.
- [ ] Run shared VM tests.
- [ ] Run web hulebu tests.
- [ ] Run both inline script syntax checks.
- [ ] Run `npm run docs:sync`.
- [ ] Run placeholder scan and `git diff --check`.
- [ ] Check `/games/hulebu` in desktop and 390px mobile browser views.

## Task 6: Complete Docs

**Files:**
- Modify: `docs/tasks/items/T166-hulebu-20-level-mainline-demo.md`
- Modify: `docs/tasks/claims/T166-lee.md`
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/progress/2026-06-13-lee.md`
- Create: `docs/completion/2026-06-13-task-166-hulebu-20-level-mainline-demo.md`

- [ ] Mark T166 complete after verification.
- [ ] Record modified files, validation commands, results, and remaining issues.
