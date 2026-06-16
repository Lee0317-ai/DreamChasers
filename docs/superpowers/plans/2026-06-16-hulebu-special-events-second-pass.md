# 胡了卜特殊事件池扩容 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把胡了卜特殊事件从第一版固定弹窗扩成带稀有度、风险层次、构筑联动和高阶事件的第二版池子。

**Architecture:** HTML 原型负责第二版事件常量、事件挑选逻辑、事件说明和 HUD 文案；Next.js `/games/hulebu` 壳层只承接新的事件摘要展示；静态 Demo 从源原型同步，测试用文本断言锁定核心结构。

**Tech Stack:** Next.js/React 客户端组件、单文件 HTML 原型、Vitest 文本测试、文档分片、`npm run docs:sync`。

---

## File Structure

- Create: `docs/tasks/items/T178-hulebu-special-events-second-pass.md`
- Create: `docs/tasks/claims/T178-lee.md`
- Create: `docs/superpowers/specs/2026-06-16-hulebu-special-events-second-pass-design.md`
- Create: `docs/superpowers/plans/2026-06-16-hulebu-special-events-second-pass.md`
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
  - 视情况补最近事件摘要展示。
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`
  - 如需补事件摘要样式则最小改动。
- Modify: `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`
  - 先写失败测试锁定第二版事件结构。
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
  - 增加事件稀有度、类型、构筑联动、高阶事件和说明。
- Modify: `apps/web/public/games/hulebu-demo/index.html`
  - 同步站内静态 Demo。
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`
  - 先写失败测试锁定内层事件第二版结构。
- Modify: `docs/modules/mahjong-roguelike/**`
  - 同步 T178 进展和交接。
- Modify: `docs/progress/2026-06-16-lee.md`
- Create: `docs/completion/2026-06-16-task-178-hulebu-special-events-second-pass.md`

## Task 1: Register T178

**Files:**
- Modify: `docs/tasks/CHANGE_INTAKE.md`
- Modify: `docs/tasks/NEXT_ID.md`
- Create: `docs/tasks/items/T178-hulebu-special-events-second-pass.md`
- Create: `docs/tasks/claims/T178-lee.md`
- Create: `docs/superpowers/specs/2026-06-16-hulebu-special-events-second-pass-design.md`
- Create: `docs/superpowers/plans/2026-06-16-hulebu-special-events-second-pass.md`

- [x] Add IDEA-20260616-04.
- [x] Create T178 task and claim files.
- [x] Increment `NEXT_ID` to `179`.
- [x] Write the T178 design spec and implementation plan.

## Task 2: Lock Failing Tests First

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`

- [ ] Add failing `apps/web` expectations for event rarity, build-linked text and ascension event copy.
- [ ] Run `npm run test -w apps/web -- hulebu` and confirm the new expectations fail.
- [ ] Add failing prototype expectations for `SPECIAL_EVENT_RARITIES`, `SPECIAL_EVENT_TAGS`, `EVENT_BUILD_LINKS`, and second-pass event labels.
- [ ] Run `npm run test -w packages/shared -- mahjong-config-playable-prototype` and confirm the new expectations fail.

## Task 3: Implement Inner Demo Event Second Pass

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- Modify: `apps/web/public/games/hulebu-demo/index.html`

- [ ] Add second-pass event rarity/tag/build-link constants near existing event constants.
- [ ] Add event picking helpers that can react to run mode, ascension tier and build profile.
- [ ] Expand normal and ascension event pools with new copy and existing effect/modifier payloads.
- [ ] Render rarity/type/build cues in the overlay or status text.
- [ ] Sync the source prototype into the static demo.
- [ ] Re-run `npm run test -w packages/shared -- mahjong-config-playable-prototype` and get back to green.

## Task 4: Update Outer Shell Event Summary

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`

- [ ] Decide whether current settlement surface only needs richer event text or a small new summary block.
- [ ] Implement the minimal shell change needed to expose second-pass event signals.
- [ ] Re-run `npm run test -w apps/web -- hulebu` and get back to green.

## Task 5: Full Verification And Docs

**Files:**
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/modules/mahjong-roguelike/DECISIONS.md`
- Modify: `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- Modify: `docs/progress/2026-06-16-lee.md`
- Create: `docs/completion/2026-06-16-task-178-hulebu-special-events-second-pass.md`

- [ ] Update module docs with T178 outcome and remaining follow-ups.
- [ ] Run `npm run typecheck -w apps/web`.
- [ ] Run `npm run build -w apps/web`.
- [ ] Run the inline script syntax checks for source/static HTML.
- [ ] Run `npm run docs:sync`.
- [ ] Run `git diff --check`.
- [ ] Run browser desktop and 390px mobile checks for `/games/hulebu`.

## Self Review

- Spec coverage: the plan covers rarity, risk/build/ascension event layers, static demo sync, shell visibility, docs and verification.
- Placeholder scan: no placeholder text remains.
- Naming consistency: `T178`, `special-events-second-pass`, `SPECIAL_EVENT_RARITIES`, `SPECIAL_EVENT_TAGS` and `EVENT_BUILD_LINKS` are consistent across task, spec and plan.
