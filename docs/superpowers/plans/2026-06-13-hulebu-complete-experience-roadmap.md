# 胡了卜 Demo 完整体验版推进方案 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把胡了卜从当前 10 关站内 Demo 推进到完整体验版路线，明确后续先落地 20 关主线、局外升级壳和第 20 关 Boss。

**Architecture:** 本计划只做文档和任务拆分，不修改玩法代码。先把完整设计拆成阶段路线，再为下一实现任务 T166 准备清晰边界，让 HTML Demo 继续承担快速验证，Cocos 正式工程后续按稳定体验承接。

**Tech Stack:** Markdown 文档、DreamChasers 任务分片、`npm run docs:sync` 文档同步。

---

## File Structure

- Create: `docs/tasks/items/T165-hulebu-complete-experience-roadmap.md`
  - T165 任务分片，记录目标、范围、禁止修改文件和验证方式。
- Create: `docs/tasks/claims/T165-lee.md`
  - T165 领取分片，锁定本任务只做文档规划。
- Create: `docs/superpowers/specs/2026-06-13-hulebu-complete-experience-roadmap-design.md`
  - 完整体验版设计规格，记录当前 Demo 差距、阶段路线和第一实现任务。
- Create: `docs/superpowers/plans/2026-06-13-hulebu-complete-experience-roadmap.md`
  - 当前实施计划。
- Create: `docs/completion/2026-06-13-task-165-hulebu-complete-experience-roadmap.md`
  - 完成记录。
- Modify: `docs/tasks/CHANGE_INTAKE.md`
  - 新增 IDEA-20260613-03。
- Modify: `docs/tasks/NEXT_ID.md`
  - 从 `165` 推进到 `166`。
- Modify: `docs/modules/mahjong-roguelike/README.md`
  - 补充完整体验版推进路线和下一步。
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
  - 记录 T165 完成。
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
  - 补充 T165 后的交接建议。
- Modify: `docs/progress/2026-06-13-lee.md`
  - 记录当天进展。

## Task 1: Register T165

**Files:**
- Modify: `docs/tasks/CHANGE_INTAKE.md`
- Create: `docs/tasks/items/T165-hulebu-complete-experience-roadmap.md`
- Create: `docs/tasks/claims/T165-lee.md`
- Modify: `docs/tasks/NEXT_ID.md`

- [x] Add IDEA-20260613-03 to `CHANGE_INTAKE.md` with the complete-experience-roadmap scope.
- [x] Create the T165 task item with allowed files, forbidden files, validation commands, and completion checklist.
- [x] Create the T165 claim file for Lee.
- [x] Increment `docs/tasks/NEXT_ID.md` to `166`.

## Task 2: Write Design Spec

**Files:**
- Create: `docs/superpowers/specs/2026-06-13-hulebu-complete-experience-roadmap-design.md`

- [x] Document what the current Demo already covers.
- [x] Document the missing parts from the complete game design.
- [x] Define the staged route: 20 关主线, 局外首页, 局外升级, 路线型奖励, 长期模式.
- [x] Define T166 as the recommended first implementation task.

## Task 3: Write Implementation Plan

**Files:**
- Create: `docs/superpowers/plans/2026-06-13-hulebu-complete-experience-roadmap.md`

- [x] Document file responsibilities.
- [x] Break the work into T165 documentation steps.
- [x] Include the follow-up implementation task sequence T166-T174.
- [x] Self-review for spec coverage, placeholders, and naming consistency.

## Task 4: Update Module Docs

**Files:**
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/progress/2026-06-13-lee.md`
- Create: `docs/completion/2026-06-13-task-165-hulebu-complete-experience-roadmap.md`

- [x] Add T165 to README current status and next steps.
- [x] Add a 2026-06-13 progress entry for T165.
- [x] Add handoff guidance: next implement T166 before long-term modes.
- [x] Append Lee daily progress.
- [x] Create the completion record with modified files, verification commands, result, and remaining issues.

## Task 5: Sync And Verify

**Files:**
- Modify generated summaries:
  - `docs/tasks/TASK_BOARD.md`
  - `docs/tasks/CLAIMS.md`
  - `docs/status/CURRENT_STATUS.md`

- [ ] Run `npm run docs:sync`.
  - Expected: sync completes and includes T165 in generated summaries.
- [ ] Run the placeholder scan:
  - `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T165-hulebu-complete-experience-roadmap.md docs/tasks/claims/T165-lee.md docs/superpowers/specs/2026-06-13-hulebu-complete-experience-roadmap-design.md docs/superpowers/plans/2026-06-13-hulebu-complete-experience-roadmap.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-13-lee.md docs/completion/2026-06-13-task-165-hulebu-complete-experience-roadmap.md`
  - Expected: no matches.
- [ ] Run `git diff --check`.
  - Expected: no whitespace errors.

## Follow-Up Implementation Sequence

T165 does not modify gameplay code. The recommended implementation sequence after T165 is:

1. T166：胡了卜 20 关完整主线 Demo。
2. T167：胡了卜局外首页和结算面板。
3. T168：胡了卜铜钱资产和 3 项局外升级。
4. T169：胡了卜路线型奖励池扩展。
5. T170：胡了卜无尽牌山第一版。
6. T171：胡了卜每日牌局本地 seed 版。
7. T172：胡了卜成就图鉴第一版。
8. T173：胡了卜高阶周目和词缀扩展。
9. T174：胡了卜 Cocos 正式表现层追平完整体验版。

## Self Review

- Spec coverage: the plan covers current Demo inventory, complete-design gaps, staged roadmap, T166 first implementation scope, module docs, task registration, sync, and verification.
- Placeholder scan: the plan contains no placeholder requirements.
- Naming consistency: T165, T166-T174, file paths, and spec names match the task item and claim.

