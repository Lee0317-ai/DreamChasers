# 胡了卜网页版完整版路线重排 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把胡了卜后续路线正式调整为先完成 Web 版完整内容，再追平 Cocos 和补音乐美术资源。

**Architecture:** 本计划只做文档和任务体系更新，不修改游戏代码。路线规格记录 Web 完整版缺口和阶段顺序，模块文档、任务分片和交接文件统一改成 Web 优先，后续实现从 T176 起继续拆分。

**Tech Stack:** Markdown 文档、DreamChasers 任务分片、`npm run docs:sync` 文档同步。

---

## File Structure

- Create: `docs/tasks/items/T175-hulebu-web-full-version-roadmap.md`
  - T175 任务分片，记录目标、允许文件、禁止文件和验证方式。
- Create: `docs/tasks/claims/T175-lee.md`
  - T175 领取分片，确认负责人和文件边界。
- Create: `docs/superpowers/specs/2026-06-16-hulebu-web-full-version-roadmap-design.md`
  - Web 完整版优先路线设计，记录当前已完成、缺口、阶段和后续任务顺序。
- Create: `docs/superpowers/plans/2026-06-16-hulebu-web-full-version-roadmap.md`
  - 当前实施计划。
- Create: `docs/progress/2026-06-16-lee.md`
  - Lee 当天进展记录。
- Create: `docs/completion/2026-06-16-task-175-hulebu-web-full-version-roadmap.md`
  - T175 完成记录。
- Modify: `docs/tasks/CHANGE_INTAKE.md`
  - 新增 IDEA-20260616-01。
- Modify: `docs/tasks/NEXT_ID.md`
  - 从 `175` 推进到 `176`。
- Modify: `docs/modules/mahjong-roguelike/README.md`
  - 把下一步重点改为 Web 完整版优先。
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
  - 记录 T175 路线调整。
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
  - 更新交接建议和下一任务方向。
- Modify: `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
  - 增加 2026-06-16 路线调整说明。
- Modify: `docs/modules/mahjong-roguelike/DECISIONS.md`
  - 新增 D042 路线决策。

## Task 1: Register T175

**Files:**
- Modify: `docs/tasks/CHANGE_INTAKE.md`
- Create: `docs/tasks/items/T175-hulebu-web-full-version-roadmap.md`
- Create: `docs/tasks/claims/T175-lee.md`
- Modify: `docs/tasks/NEXT_ID.md`

- [x] Add IDEA-20260616-01 with Lee's route change.
- [x] Create the T175 task item with doc-only scope.
- [x] Create the T175 claim file for Lee.
- [x] Increment `docs/tasks/NEXT_ID.md` to `176`.

## Task 2: Write Route Spec

**Files:**
- Create: `docs/superpowers/specs/2026-06-16-hulebu-web-full-version-roadmap-design.md`

- [x] Document the route decision: Web full version first, then Cocos, then music/art.
- [x] Document what the current Web Demo already covers.
- [x] Document remaining full-version gaps.
- [x] Propose the follow-up task sequence from T176 onward.

## Task 3: Update Module Docs

**Files:**
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- Modify: `docs/modules/mahjong-roguelike/DECISIONS.md`
- Create: `docs/progress/2026-06-16-lee.md`

- [x] Replace the old Cocos-next recommendation with Web-full-version-first guidance.
- [x] Add the Web gap list and recommended next implementation order.
- [x] Add D042 to decisions.
- [x] Record daily progress.

## Task 4: Sync And Verify

**Files:**
- Modify generated summaries:
  - `docs/tasks/TASK_BOARD.md`
  - `docs/tasks/CLAIMS.md`
  - `docs/status/CURRENT_STATUS.md`

- [x] Run `npm run docs:sync`.
- [x] Run the placeholder scan for T175 files.
- [x] Run `git diff --check`.

## Follow-Up Implementation Sequence

1. T176：胡了卜高阶周目完整版。
2. T177：胡了卜 Boss 试炼第二版。
3. T178：胡了卜特殊事件池扩容。
4. T179：胡了卜成就图鉴扩容。
5. T180：胡了卜无尽和每日深度化。
6. T181：胡了卜路线奖励和局外能力深化。
7. T182：胡了卜 Web 数值平衡和内容冻结。
8. Cocos 正式表现层按冻结规格追平。
9. 音乐、美术、动效和发布资源补齐。

## Self Review

- Spec coverage: the plan covers route registration, design spec, module docs, decision log, progress, docs sync, placeholder scan, and diff check.
- Placeholder scan: the plan uses concrete file paths and has no placeholder requirements.
- Naming consistency: T175, T176-T182, file paths, spec name, plan name, and module slug match the task item and claim.
