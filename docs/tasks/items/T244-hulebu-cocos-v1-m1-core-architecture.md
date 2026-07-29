# T244：胡了卜 Cocos v1 M1 核心边界与状态机

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T243
- 阻塞：无。Lee 已确认正式发布方向按微信小程序常见竖屏验收，横屏布局不属于当前目标，也不再登记 T246。
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain/**`、`assets/scripts/application/**`、`assets/scripts/content/**`、`assets/scripts/persistence/**`、`assets/scripts/GameSceneController.ts` 的最小 Coordinator 接线、必要的 `assets/scripts/runtime/HulebuRuntimeState.ts` 适配、`tsconfig.domain.json`、对应 `.meta`、`packages/shared/src/hulebu-cocos-domain.test.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、本任务计划/领取/进展/完成与模块交接文档
- 禁止修改范围：`BoardLayerBinder.ts`、`HudBinder.ts`、`SlotLayerBinder.ts`、`ComboBarBinder.ts`、`MeldRiverLayerBinder.ts`、`assets/resources/**`、`HulebuMountainGenerator.ts`、Web/demo/prototype、正式内容数值、UI、音效、账号/数据库、production release 配置与构建脚本、Cocos `settings/**`、`profiles/**`、`temp/**`、`library/**`、`build/**` 和其他模块
- 验证方式：`npm run test -w packages/shared -- hulebu-cocos-domain mahjong-cocos-project`; `npx tsc -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.domain.json`; 干净 worktree 的 `npm run game:hulebu:build` 与 `npm run game:hulebu:verify-build`; production 包在 `390×844` 竖屏完成点击入槽、组合、刷新恢复、多候选 exact choice 与一次清关；`git diff --check`

## 背景

T242/T243 已把 Cocos 3.8.8 正式源码和 production build 变成可复现基线，但 `GameSceneController` 仍同时承担命令入口、规则 fallback、run phase、内容选择和本地存档。代码图确认点击链路会在 `HulebuRuntimeState` 与 `refreshPlayableScene()` fallback 之间分叉，继续堆 UI 或内容会放大回归风险。

T241 已批准采用绞杀式迁移：保留现有可玩行为，先建立不依赖 `cc` 的纯 TypeScript 会话核心、状态机、内容仓库和存档服务，再让 Controller 只负责场景装配与转发。T239/T240 的正式源码结果已在 T243 checkpoint 中冻结；本任务不回改牌山生成和 Binder 表现。

## 目标

- 建立版本化 `GameCommand`、不可变 `GameSnapshot` 和一次性 `DomainEvent` 契约。
- 用 `GameSession` 统一承接牌选择、组合、工具和牌局快照，Controller 不再保留同一规则的第二套 fallback。
- 用 `RunStateMachine` 显式区分 transient、稳定和可持久化 phase，并约束合法/非法转移。
- 用长生命周期 `GameCoordinator` 串联命令、可替换会话、run phase、可恢复上下文、快照和事件，作为 Cocos 表现层唯一写入口。
- 建立 `ContentRepository` 的加载/校验边界；M1 先适配现有正式配置，不在运行时修补坏数据。
- 建立 `SaveService` 的版本化稳定态 round-trip、原子写入与坏档隔离边界；不保存 Cocos 节点或动画中间态。
- 用固定输入测试证明同一命令序列可复现，并至少删除 Controller 中一条正式规则 fallback。

## 不做

- 不创建 Boot/Title/Result Scene 或 Prefab，不重做局内 HUD。
- 不新增十节点章节内容、奖励卡、事件、Boss 数值或正式 seed。
- 不接 UI/音频资产，不实现 AudioService。
- 不接账号云存档、排行榜、付费或 Web 宿主协议。
- 不一次性重写整个 Controller，也不把现有 runtime 复制成第二套规则实现。

## 验收标准

- 纯 TypeScript 核心不导入 `cc`，可在 Vitest 中直接运行。
- 表现层只通过 Coordinator 提交已迁移命令；同一命令序列生成相同 snapshot 和事件顺序。
- 状态机拒绝非法 phase 转移；只有明确列入 allowlist 的稳定 phase 可持久化，`paused` / `failed` 不因稳定而自动允许保存。
- ContentRepository 对缺 ID、重复 ID、坏引用和版本不兼容显式失败。
- SaveService 当前 schema 可 round-trip，写入失败不覆盖最后有效存档，坏档进入 quarantine。
- 刷新后恢复 exact combo choice、event/reward 目标关与 undo history；普通清关和整轮结算不重复提交。
- Controller 的已迁移规则 fallback 被删除，工程扫描能防止重新引入。
- 聚焦测试、Cocos TypeScript、真实 production build、verify-only 和 diff 校验通过。

## 2026-07-29 进展

- M1 纯 TypeScript 核心、Coordinator、ContentRepository、SaveService 和 Controller 最小接线均已完成；最后一轮恢复加固提交为 `1bc4867c`。
- 修复连续撤回次数回滚、combo choice 恢复后弹层丢失、reward/event 恢复重算候选、v0 runtime 双份归一化不一致等问题。
- active-run 校验已覆盖 exact level tile IDs、牌面多重集、牌山掉落几何、遮挡拓扑、区域容量、明牌面子一致性、history 深层快照，以及 reward/event 目标关和候选集合。
- 双独立复审最终为 `0 Critical / 0 Important`；聚焦测试 `158/158`、领域 TypeScript、`git diff --check` 通过，发布测试 `189/189` 通过。
- 精确提交 production build 和 verify-only 通过：build ID `1bc4867cf569-20260729T150509Z`，Creator `3.8.8`，source tree SHA-256 `69077b638241d0213957351cd7954a09edefb3ac2f92449d6c1fe9f82e9e3194`，artifact SHA-256 `0124635db2711a0b752c05be796d1232593cc71385fb6e00ed15a2048d3dc5b6`。
- 内置浏览器确认正式包非黑屏、无 warn/error；全新 origin 选牌后刷新能恢复同一局面，`390×844` 可完整显示 HUD、组合栏和槽位。
- Lee 已确认后续较大概率发布微信小程序，`1280×720` 横屏不属于目标发布方向，也不再作为阻塞；不登记 T246，T244 仍不修改 Binder/UI/布局。
- 既有 `390×844` production 验证已覆盖完整 UI 可见、选牌与刷新恢复；本轮内置浏览器拒绝重新访问本地 production 地址，因此未新增组合、多候选与一次清关的端到端证据。T244 保持待验收，不提前标记完成。
