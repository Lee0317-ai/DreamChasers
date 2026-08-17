# 胡了卜 UI v3 Cocos 接入实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 component-pack-v3 的 63 张组件、5 张背景和 tiles-v3 的 35 张麻将牌接入正式 Cocos 工程，并替换当前可玩流程中的旧 UI 资源。

**Architecture:** 保留现有运行时与场景控制逻辑，只新增一个 v3 资源目录和统一目录映射；现有 Binder 与 `GameSceneController` 继续负责布局、交互和动态 Label。旧 formal-v1/v6 资源保留作为加载失败兜底，不参与新的主路径。

**Tech Stack:** Cocos Creator 3.8.8、TypeScript、Cocos `resources.load`、Vitest、exact-commit 构建脚本。

## Global Constraints

- 所有新增或修改文本文件必须为 UTF-8 无 BOM。
- 竖屏为唯一正式布局目标，不新增横屏适配。
- 不修改玩法规则、关卡配置、奖励配置或存档结构。
- UI 文案与数字使用运行时 Label，不烘焙进图片。
- 不直接引用 `output/`；正式运行时只引用 Cocos `assets/resources/`。

---

### Task 1：复制和校验 v3 正式资源

**Files:**
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/hulebu/component-pack-v3/**`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/hulebu/backgrounds/**`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/hulebu/tiles-v3/**`

**Interfaces:**
- Consumes: `output/hulebu-ui-design-v2/component-pack-v3/normalized/*.png`、背景和 tiles-v3。
- Produces: Cocos `resources.load` 可寻址的 103 张 PNG。

- [ ] **Step 1:** 按接入手册分组复制 63 张组件，并复制 5 张背景和 35 张麻将牌。
- [ ] **Step 2:** 用文件计数断言组件 63、背景 5、麻将牌 35，总计 103。
- [ ] **Step 3:** 检查 PNG 可解码、透明组件保持 RGBA、背景保持 1024×1536。

### Task 2：建立 v3 资源目录并切换主加载路径

**Files:**
- Create: `assets/scripts/assets/HulebuV3UiCatalog.ts`
- Modify: `assets/scripts/assets/HulebuFormalUiCatalog.ts`
- Modify: `assets/scripts/assets/HulebuMetaFlowUiCatalog.ts`
- Modify: `assets/scripts/assets/HulebuTileSpriteCatalog.ts`
- Test: `packages/shared/src/hulebu-cocos-project.test.ts`

**Interfaces:**
- Produces: `HULEBU_V3_UI_SPRITES`、`getHulebuV3TileSpritePath()`；路径均以 `ui/hulebu/` 开头并以 `/spriteFrame` 结尾。
- Consumes: 现有 Binder 对 formal/meta-flow catalog 的引用，不改变调用方接口。

- [ ] **Step 1:** 先增加测试，断言 v3 目录、103 张资源和关键 catalog 路径存在。
- [ ] **Step 2:** 运行测试并确认因 v3 catalog 缺失而失败。
- [ ] **Step 3:** 新增 v3 catalog，覆盖背景、HUD、动作按钮、工具、面板、地图、结算和麻将牌。
- [ ] **Step 4:** 将 formal/meta-flow/tile catalog 的主路径切到 v3；保留旧牌面 fallback。
- [ ] **Step 5:** 运行测试并确认通过。

### Task 3：适配 v3 单态按钮与场景组件

**Files:**
- Modify: `assets/scripts/ComboBarBinder.ts`
- Modify: `assets/scripts/HudBinder.ts`
- Modify: `assets/scripts/SlotLayerBinder.ts`
- Modify: `assets/scripts/GameSceneController.ts`

**Interfaces:**
- Consumes: v3 单态动作按钮和工具按钮。
- Produces: 可点击态保持原色，不可点击态通过节点透明度/颜色降级；HUD、槽位、记牌器、碰池/震落区、弹层和结算均使用 v3 图片。

- [ ] **Step 1:** 让动作按钮使用同一张 v3 图片，通过颜色和透明度表达 active/disabled，不生成不存在的变体路径。
- [ ] **Step 2:** 调整 HUD Label 前景色和内边距，保证象牙/薄荷底上清晰可读且分数不重叠。
- [ ] **Step 3:** 用 `hand-slot.png` 替换程序化空槽底板，同时保持牌面和弃牌高亮在上层。
- [ ] **Step 4:** 将牌局背景、记牌器、碰池/震落区、组合候选、弃牌救援、通关与失败弹层映射到 v3 组件。
- [ ] **Step 5:** 检查 390×844 竖屏下不遮挡牌山、组合按钮和底部 8 格。

### Task 4：构建、实测与文档收尾

**Files:**
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/progress/2026-08-17-lee.md`
- Create: `docs/completion/2026-08-17-task-290-hulebu-ui-v3-cocos-integration.md`
- Modify: T290 任务与领取分片。

**Interfaces:**
- Produces: 可复现的测试、构建 ID、浏览器截图与任务完成记录。

- [ ] **Step 1:** 运行相关 Vitest、TypeScript/资源项目检查和 `git diff --check`。
- [ ] **Step 2:** 提交正式构建输入后运行 exact-commit verify/build。
- [ ] **Step 3:** 启动 127.0.0.1 预览并在桌面与 390px 竖屏检查大厅、地图、牌局、通关和失败态。
- [ ] **Step 4:** 更新任务分片、模块进展、当天进展和完成记录，运行 `npm run docs:sync`。
