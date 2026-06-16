# 胡了卜无尽和每日深度化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `/games/hulebu` 的无尽与每日补上章节、周期 Boss、每日词缀、每日奖励和连续参与目标。

**Architecture:** 继续沿用现有 runMode 与 shell message 协议，在 HTML 原型增加无尽章节 / 每日词缀的派生函数与 payload 摘要，再让 React 壳层把这些摘要沉到局外与结算。存档保持向后兼容，只扩充本地字段。

**Tech Stack:** HTML prototype script, Next.js client component, TypeScript, CSS Modules, Vitest string-level publish tests

---

### Task 1: 登记 T180 文档范围

**Files:**
- Create: `docs/tasks/items/T180-hulebu-endless-daily-depth.md`
- Create: `docs/tasks/claims/T180-lee.md`
- Create: `docs/superpowers/specs/2026-06-16-hulebu-endless-daily-depth-design.md`
- Create: `docs/superpowers/plans/2026-06-16-hulebu-endless-daily-depth.md`

- [ ] **Step 1: 写任务卡、领取卡、规格与计划**
- [ ] **Step 2: 确认范围只在 Web 壳层、原型、静态 Demo 和文档**

### Task 2: 写失败测试

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`

- [ ] **Step 1: 给 web 壳层加失败断言**
- [ ] **Step 2: 给原型加失败断言**
- [ ] **Step 3: 运行测试确认失败**

### Task 3: 实现原型第二层模式内容

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- Modify: `apps/web/public/games/hulebu-demo/index.html`

- [ ] **Step 1: 实现无尽章节与周期 Boss 摘要**
- [ ] **Step 2: 实现每日词缀、每日奖励和 streak 摘要 payload**
- [ ] **Step 3: 同步静态 Demo**

### Task 4: 实现 web 壳层显示

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`

- [ ] **Step 1: 扩本地存档字段与 hydration**
- [ ] **Step 2: 在局外页和结算页显示无尽 / 每日深化摘要**
- [ ] **Step 3: 跑测试确认通过**

### Task 5: 文档、验证与提交

**Files:**
- Modify: `docs/modules/mahjong-roguelike/**`
- Modify: `docs/progress/2026-06-16-lee.md`
- Create: `docs/completion/2026-06-16-task-180-hulebu-endless-daily-depth.md`

- [ ] **Step 1: 更新模块文档与完成记录**
- [ ] **Step 2: 跑完整验证**
- [ ] **Step 3: 浏览器检查桌面端与 390px 移动端**
- [ ] **Step 4: 提交 git**
