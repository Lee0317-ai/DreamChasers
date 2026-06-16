# 胡了卜成就图鉴扩容 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `/games/hulebu` 的成就图鉴从第一版 8 张基础卡扩成带分类摘要、隐藏目标和 Boss/事件/高阶目标的第二版。

**Architecture:** 继续只改 web 壳层，不碰原型与共享规则。通过扩展 `HulebuGamePage.tsx` 内的成就配置、补算逻辑和图鉴渲染结构，让旧存档在 hydration 后自动补算新增成就；CSS 只做局部布局扩展，保持现有局外风格。

**Tech Stack:** Next.js client component, React state, TypeScript, CSS Modules, Vitest string-level publish tests

---

### Task 1: 登记任务与文档范围

**Files:**
- Create: `docs/tasks/items/T179-hulebu-achievement-codex-expansion.md`
- Create: `docs/tasks/claims/T179-lee.md`
- Create: `docs/superpowers/specs/2026-06-16-hulebu-achievement-codex-expansion-design.md`
- Create: `docs/superpowers/plans/2026-06-16-hulebu-achievement-codex-expansion.md`

- [ ] **Step 1: 写任务卡、领取卡、规格与计划**

补齐任务范围、允许文件、禁止文件、验证命令与设计口径。

- [ ] **Step 2: 自查任务范围**

确认范围只落在 `apps/web/src/modules/games/hulebu/**` 与文档，不扩到原型、静态 Demo、共享包或 Prisma。

### Task 2: 写失败测试锁定图鉴第二版

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`

- [ ] **Step 1: 写失败测试**

在 `hulebu-publish.test.ts` 中新增对第二版图鉴文本与字段的断言，例如：

```ts
expect(component).toContain("图鉴总览");
expect(component).toContain("隐藏目标");
expect(component).toContain("Boss 纪录");
expect(component).toContain("事件见闻");
expect(component).toContain("高阶征途");
expect(component).toContain("mainline-master");
expect(component).toContain("ascension-west-clear");
expect(component).toContain("event-rare-encounter");
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -w apps/web -- hulebu`

Expected: FAIL，指出新增图鉴第二版文案或成就 id 尚不存在。

### Task 3: 实现第二版成就配置与补算逻辑

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`

- [ ] **Step 1: 写最小实现**

在 `HulebuGamePage.tsx` 中：

1. 扩展 `AchievementId`。
2. 为 `AchievementConfig` 增加分组和隐藏标记。
3. 扩展 `ACHIEVEMENTS`。
4. 在 hydration / settlement / upgrade 驱动的解锁逻辑中补算新增成就。

- [ ] **Step 2: 运行测试确认通过**

Run: `npm run test -w apps/web -- hulebu`

Expected: PASS

### Task 4: 改造图鉴 UI

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`

- [ ] **Step 1: 改图鉴结构**

把平铺卡片改成：
- 顶部总览卡
- 分类摘要卡
- 分组列表
- 隐藏目标占位卡

- [ ] **Step 2: 补样式**

新增分组标题、摘要栅格、隐藏目标态样式，保持现有局外页密度与层次一致。

- [ ] **Step 3: 再跑测试**

Run: `npm run test -w apps/web -- hulebu`

Expected: PASS

### Task 5: 文档、验证与提交

**Files:**
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/modules/mahjong-roguelike/DECISIONS.md`
- Modify: `docs/progress/2026-06-16-lee.md`
- Create: `docs/completion/2026-06-16-task-179-hulebu-achievement-codex-expansion.md`

- [ ] **Step 1: 更新模块文档与完成记录**

写清 T179 的范围、实现内容、验证命令和遗留问题。

- [ ] **Step 2: 跑完整验证**

Run:
- `npm run test -w apps/web -- hulebu`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- `npm run docs:sync`
- `git diff --check`

Expected: 全部通过。

- [ ] **Step 3: 浏览器检查**

检查 `/games/hulebu` 桌面端与 390px 移动端，确认图鉴分组和隐藏目标没有挤坏布局。

- [ ] **Step 4: 提交**

```bash
git add apps/web/src/modules/games/hulebu docs
git commit -m "feat: expand hulebu achievement codex"
```
