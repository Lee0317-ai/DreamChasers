# T247：胡了卜 Cocos v1 M2 代码级实施计划

- 优先级：P0
- 负责人：Lee
- 状态：已完成
- 依赖：T246
- 阻塞：无
- 主要文件范围：`docs/tasks/CHANGE_INTAKE.md`、`docs/tasks/NEXT_ID.md`、`docs/tasks/items/T246-hulebu-cocos-v1-m2-three-node-vertical-slice-design.md`、`docs/tasks/claims/T246-lee.md`、T246 完成记录、`docs/tasks/items/T247-hulebu-cocos-v1-m2-implementation-plan.md`、`docs/tasks/claims/T247-lee.md`、`docs/superpowers/plans/2026-07-30-hulebu-cocos-v1-m2-three-node-vertical-slice.md`、`docs/modules/mahjong-roguelike/PROGRESS.md`、`docs/modules/mahjong-roguelike/HANDOFF.md`、`docs/progress/2026-07-30-lee.md`、本任务完成记录及 `npm run docs:sync` 自动生成摘要
- 禁止修改范围：`apps/**`、`packages/**`、Cocos 工程与资源、Web/demo/prototype、构建脚本与发布配置、数据库与账号、PDF、AI 修图、其他游戏模块；本任务不执行实现计划
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|implement l[a]ter|fill in d[e]tails|Add appropriate error handling|Write tests for the above|Similar to Task" docs/superpowers/plans/2026-07-30-hulebu-cocos-v1-m2-three-node-vertical-slice.md`; UTF-8 无 BOM 检查；`git diff --check`

## 背景

T246 已冻结 M2 三节点完整纵切规格。M2 同时涉及 App Flow、Scene/Prefab、三节点内容、存档检查点、AudioService 和 production E2E；这些子系统有依赖关系，但不应在同一个实现任务中一次修改和验收。

## 目标

- 映射现有 Cocos 源码、测试、场景、资源和构建结构。
- 把 T246 全部要求拆成可独立评审的实现任务，并锁定文件职责和接口。
- 每个任务提供精确 RED/GREEN、验证命令、production 门槛和提交边界。
- 明确执行时的项目任务登记与文件领取顺序，避免跨任务文件冲突。

## 不做

- 不修改任何实现代码、Cocos 场景、Prefab、资源或构建配置。
- 不执行测试驱动实现或 production build。
- 不新增 T246 规格外功能，不重新设计玩家流程或最终 UI。
- 不预先领取后续实现文件；执行每个实现任务前单独读取 `NEXT_ID.md` 并登记。

## 验收标准

- 计划覆盖 T246 的每项产品、架构、恢复、音频、错误和测试要求。
- 每个代码步骤都有实际接口/代码骨架、失败预期和通过命令，没有未定义类型或模糊占位。
- 任务边界能独立评审；前后任务的接口、类型和文件路径一致。
- 计划明确 implementation 不得在一个项目任务中同时修改全部五个批次。

## 2026-07-30 完成

- 已完成代码、测试、场景、资源与正式构建结构映射，并依据 T246 规格生成五批、十七项可独立评审的实施计划。
- 已自查跨批接口：AudioKey 在 Batch 2 固定、ContentPack 消费其类型、Coordinator 使用兼容的 options 边界、奖励 checkpoint 保存失败回滚、满槽救场与失败结果均进入单一 Coordinator 路径。
- 未修改 Cocos、shared、资源、构建配置或 Web 代码。
- 下一步：先关闭 T244 的 `390x844` production 组合、多候选 exact choice 与清关 smoke，再为 Batch 1 单独分配任务、领取文件并按计划执行。
- 完成记录：`docs/completion/2026-07-30-task-247-hulebu-cocos-v1-m2-implementation-plan.md`
