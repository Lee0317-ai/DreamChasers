# T189：胡了卜 Cocos 旧工程复用和 Web 冻结追平计划

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 来源：IDEA-20260628-01

## 背景

用户确认胡了卜 Web 玩法差不多后，提出先查看已有 Cocos 工程是否可以复用。当前仓库已有 Cocos Creator 3.8.8 工程：

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/`

该工程已经具备项目壳、场景脚本、Board/Slot/Combo/HUD Binder、牌面资源目录、20 关轻量流程、随机牌山、遮挡判定、点击入槽、基础组合和共享测试。它可以作为正式 Cocos 承接基座，但落后于当前 Web 完整版内容。

## 目标

1. 明确旧 Cocos 工程哪些部分直接复用、哪些部分需要改造、哪些内容暂缓。
2. 给出 Web 冻结后 Cocos 追平的阶段计划。
3. 为后续 Cocos 实施任务准备清晰文件范围、验证命令和验收口径。

## 不做

- 不直接修改 Cocos 工程代码、资源或场景。
- 不重建 Cocos Creator 项目。
- 不追平全部 Web 玩法。
- 不改 Web 玩法、账号、Prisma、PDF、AI 修图、TimePick 或部署。

## 允许修改文件

- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T189-hulebu-cocos-reuse-catchup-plan.md`
- `docs/tasks/claims/T189-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-28-lee.md`

## 禁止修改文件

- `apps/game/mahjong-roguelike/cocos/**`
- `apps/game/mahjong-roguelike/prototypes/**`
- `apps/web/**`
- `packages/shared/**`
- `apps/web/prisma/**`
- PDF、AI 修图、TimePick、部署相关文件

## 复用结论

建议复用：

- Cocos Creator 3.8.8 工程壳和项目目录结构。
- `GameSceneController`、Board/Slot/Combo/HUD Binder 的分层方式。
- `HulebuSceneModel` / `HulebuRuntimeState` 的最小运行时接口作为迁移起点。
- `HulebuTileSpriteCatalog` 和 `assets/resources/ui/mahjong-tiles/` 资源加载方式。
- `packages/shared/src/mahjong-cocos-project.test.ts` 的工程结构回归测试。
- `packages/shared/src/mahjong-cocos-scene.ts` 的表现层快照转换思路。

需要改造：

- Cocos runtime 仍是旧版轻量规则，缺当前 Web 的有限牌河、明牌组、补杠、震落、满槽救场、听牌/难度提示和更完整的 combo 状态。
- UI 资源仍停在旧 Cocos 留白版牌面，需要对齐 Web 当前 v6 视觉和透明按钮/槽位资源。
- 关卡流只覆盖最小 20 关与奖励节点，未追平 Boss 第二版、特殊事件、无尽章节、每日词缀、高阶和局外成长。
- 旧 Cocos 奖励只推进流程，尚未真正落地到运行时效果。

暂缓：

- 完整音乐、音效、动画、图集打包、发布包和商店接入。
- 多人、排行榜、完整麻将算法和复杂番型。
- 完整中局云存档。

## 追平计划

阶段 0：工程复核

- 在 Cocos Dashboard 打开旧工程，确认 Creator 3.8.8 能正常加载。
- 跑通现有 Cocos 共享测试和 TypeScript 检查。
- 记录当前资源缺图、脚本报错和 Web Preview 视觉差异。

阶段 1：视觉资源同步

- 将 Web 当前 v6 牌面、按钮、卡槽、操作按钮和右侧工具 UI 映射到 Cocos resources。
- 检查 `1-9万 / 1-9条 / 1-9筒 / 东南西北中发白` 全量牌面，避免再次出现 `6条` 误用 `4条` 的资源问题。
- 保持 Cocos 自绘牌体或 prefab 牌体统一，避免图片自带背景、灰杠和多余角标。

阶段 2：核心局内规则追平

- 迁移有限牌河、明牌组、补杠、震落、满槽救场和提示状态。
- 让 `吃 / 碰 / 杠 / 补杠 / 胡` 与 Web 当前行为一致。
- 把 Cocos runtime 逐步改成消费共享冻结规格，而不是继续复制旧 HTML 临时逻辑。

阶段 3：内容系统追平

- 接 Boss 第二版、特殊事件第二版、无尽章节、每日词缀和高阶模式。
- 奖励效果从“只推进流程”改成真正影响运行时。
- 局外成长、流派选择和账号进度保持与 Web 壳层规格一致。

阶段 4：正式发布准备

- 补音效、动效、图集、启动加载、性能检查和移动端适配。
- 明确 Cocos 包体、资源压缩和发布平台。

## 后续实施任务建议

T189 完成后，建议新开一个 Cocos 代码任务，范围只覆盖：

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/**`
- 必要的 `packages/shared/src/mahjong-cocos-*.test.ts`

首个代码任务的验收目标应控制为：Cocos 首屏视觉对齐 Web 当前牌面和按钮，且核心点击入槽、组合消除、遮挡解锁不回退。

## 验证命令

```bash
npm run docs:sync
git diff --check
```

后续代码任务再补：

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
```

## 完成记录

- 完成时间：2026-06-28
- 完成内容：确认旧 Cocos 工程可复用，并形成 Web 冻结后 Cocos 追平计划。
- 验证结果：`npm run docs:sync` 通过；`git diff --check` 通过。
