# 胡了卜高阶周目完整版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把胡了卜高阶周目扩展为四档轮回，并接入局外可装备能力、高阶专属奖励和能力槽限制。

**Architecture:** 外层 `/games/hulebu` 壳层负责高阶入口、解锁链、局外高阶配置和存档；内层 HTML 原型负责解析高阶档位与已装备能力，并把限制、高阶奖励和 HUD 呈现到运行逻辑里。普通局外升级与高阶配置分开存储，避免普通模式被高阶系统污染。

**Tech Stack:** Next.js/React 客户端组件、单文件 HTML 原型、Vitest 文本测试、文档分片、`npm run docs:sync`。

---

## File Structure

- Create: `docs/tasks/items/T176-hulebu-full-ascension.md`
- Create: `docs/tasks/claims/T176-lee.md`
- Create: `docs/superpowers/specs/2026-06-16-hulebu-full-ascension-design.md`
- Create: `docs/superpowers/plans/2026-06-16-hulebu-full-ascension.md`
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
  - 扩展四档高阶、局外高阶配置面板、本地存档和 iframe 参数。
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`
  - 扩展高阶配置面板和高阶能力展示样式。
- Modify: `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`
  - 先写失败测试锁定四档高阶与高阶配置能力字段。
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
  - 扩展四档高阶参数、能力槽限制和高阶专属奖励。
- Modify: `apps/web/public/games/hulebu-demo/index.html`
  - 同步站内静态 Demo。
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`
  - 先写失败测试锁定内层高阶常量、能力参数和专属奖励逻辑入口。
- Modify: `docs/modules/mahjong-roguelike/**`
  - 同步高阶完整版进展和交接。
- Create: `docs/progress/2026-06-16-lee.md`
- Create: `docs/completion/2026-06-16-task-176-hulebu-full-ascension.md`

## Task 1: Register T176

**Files:**
- Modify: `docs/tasks/CHANGE_INTAKE.md`
- Modify: `docs/tasks/NEXT_ID.md`
- Create: `docs/tasks/items/T176-hulebu-full-ascension.md`
- Create: `docs/tasks/claims/T176-lee.md`
- Create: `docs/superpowers/specs/2026-06-16-hulebu-full-ascension-design.md`
- Create: `docs/superpowers/plans/2026-06-16-hulebu-full-ascension.md`

- [x] Add IDEA-20260616-02.
- [x] Create T176 task and claim files.
- [x] Increment `NEXT_ID` to `177`.
- [x] Write the T176 design spec and implementation plan.

## Task 2: Lock Failing Tests First

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`

- [x] Add failing `apps/web` expectations for `西风场`, `北风场`, `高阶配置`, `高阶能力`, and dedicated high-ascension fields.
- [x] Run `npm run test -w apps/web -- hulebu` and confirm the new expectations fail for the missing strings.
- [x] Add failing prototype expectations for four-tier ascension configs, equipped perk params, slot limits, and ascension reward helpers.
- [x] Run `npm run test -w packages/shared -- mahjong-config-playable-prototype` and confirm the new expectations fail.

## Task 3: Implement Outer Shell High-Ascension Config

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`

- [x] Extend ascension types/configs from 2 tiers to 4 tiers.
- [x] Add persisted high-ascension loadout fields and sanitizers.
- [x] Add a lobby panel section for `高阶配置`.
- [x] Add a minimal fixed perk pool with slot-count rules tied to each ascension tier.
- [x] Pass equipped perks and limit parameters into the iframe URL.
- [x] Re-run `npm run test -w apps/web -- hulebu` and get back to green.

## Task 4: Implement Inner Demo High-Ascension Logic

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- Modify: `apps/web/public/games/hulebu-demo/index.html`

- [x] Extend `ASCENSION_CONFIGS` to four tiers.
- [x] Parse equipped ascension perks and slot-limit parameters from URL/search params.
- [x] Apply perk effects to tools, rewards, and ascension pressure.
- [x] Add high-ascension-only reward helpers and presentation copy.
- [x] Add HUD/status text for equipped perks and slot limits.
- [x] Sync the source prototype into the static demo.
- [x] Re-run `npm run test -w packages/shared -- mahjong-config-playable-prototype` and get back to green.

## Task 5: Full Verification And Docs

**Files:**
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/modules/mahjong-roguelike/DECISIONS.md`
- Modify: `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- Create: `docs/progress/2026-06-16-lee.md`
- Create: `docs/completion/2026-06-16-task-176-hulebu-full-ascension.md`

- [x] Update module docs with T176 outcome and remaining follow-ups.
- [x] Run `npm run typecheck -w apps/web`.
- [x] Run `npm run build -w apps/web`.
- [x] Run the inline script syntax checks for source/static HTML.
- [x] Run `npm run docs:sync`.
- [x] Run `git diff --check`.
- [x] Run browser desktop and 390px mobile checks for `/games/hulebu`.

## Self Review

- Spec coverage: the plan covers four ascension tiers, outer-shell loadout, inner-demo perks and rewards, slot limits, docs, and verification.
- Placeholder scan: no placeholder text remains.
- Naming consistency: `T176`, `full-ascension`, `equippedAscensionLoadout`, and four-tier ascension wording are consistent across task, spec, and plan.
