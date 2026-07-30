# T246：胡了卜 Cocos v1 M2 三节点完整纵切设计

- 优先级：P0
- 负责人：Lee
- 状态：已完成
- 依赖：T244 代码实现与竖屏验收结论
- 阻塞：无
- 主要文件范围：`.gitignore`、`docs/tasks/CHANGE_INTAKE.md`、`docs/tasks/NEXT_ID.md`、`docs/tasks/items/T244-hulebu-cocos-v1-m1-core-architecture.md`、`docs/tasks/items/T246-hulebu-cocos-v1-m2-three-node-vertical-slice-design.md`、`docs/tasks/claims/T246-lee.md`、`docs/superpowers/specs/2026-07-30-hulebu-cocos-v1-m2-three-node-vertical-slice-design.md`、`docs/modules/mahjong-roguelike/PROGRESS.md`、`docs/modules/mahjong-roguelike/DECISIONS.md`、`docs/modules/mahjong-roguelike/HANDOFF.md`、`docs/progress/2026-07-29-lee.md`、`docs/progress/2026-07-30-lee.md`、本任务完成记录及 `npm run docs:sync` 自动生成的任务主摘要
- 禁止修改范围：`apps/**`、`packages/**`、Cocos 工程与资源、Web/demo/prototype、数据库与账号、PDF、AI 修图、其他游戏模块；本任务不写实施代码或最终资产
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]|待[定]|implement l[a]ter|fill in d[e]tails" docs/superpowers/specs/2026-07-30-hulebu-cocos-v1-m2-three-node-vertical-slice-design.md docs/tasks/items/T246-hulebu-cocos-v1-m2-three-node-vertical-slice-design.md docs/tasks/claims/T246-lee.md`; UTF-8 无 BOM 检查；`git diff --check`

## 背景

M0 已建立可重复 production build，M1 已建立 GameSession、RunStateMachine、GameCoordinator、ContentRepository 与 SaveService，并完成 Controller 的核心单路径接线。正式 Cocos 仍缺 Boot、标题、教学、奖励、mini Boss、失败恢复和结算组成的纵向产品闭环，现有 UI 也仍主要是程序化壳。

## 目标

- 冻结一个 8–12 分钟、无需外部说明即可从标题玩到结算的 M2 三节点纵切。
- 第一关教学自由牌、入槽和手动碰；第二关教学遮挡、吃、多候选和教学撤回；之后进行一次奖励三选一并写检查点。
- mini Boss 强制完成一次杠并清空牌山；胡为可选高价值操作，正式强制教学后置到 M3。
- 明确 Boot、Title、Game、Result 四 Scene，第一版正式 Prefab，App Flow、输入锁、数据流、存档/坏档恢复和 AudioService 边界。
- 明确 M2 必须交付、不做项、五个实施批次和可验证 Definition of Done。

## 不做

- 不实施任何 Cocos、Web 或 shared 代码。
- 不设计完整十节点内容细节、事件、精英、正式 Boss、12 张最终奖励或最终平衡。
- 不制作最终 UI、美术、动画、3 首 BGM 或 18 类 SFX。
- 不接微信小游戏构建、登录、分享、广告、审核、包体裁剪、线上埋点、部署或回滚。
- 不把横屏交互、无尽、高阶、每日、成就、复杂局外成长或账号同步带回 v1 阻塞路径。

## 验收标准

- 规格覆盖产品目标、玩家旅程、内容、Scene/Prefab、架构、数据流、输入锁、存档、AudioService、错误处理、测试、交付批次和完成标准。
- 规格中的每个组件都有单一职责、依赖与对外契约，不让 Scene/Prefab 绕过 Coordinator 改规则。
- M2 与 M3/M4/M5 边界明确，没有未决占位或模糊验收措辞。
- Lee 审阅并批准书面规格后，才调用 writing-plans 生成代码级实施计划。

## 已确认决策

- 主要成功标准：新玩家无需说明即可完整玩通；技术架构完整是硬门槛，最终视觉品质后置。
- 结构：采用独立 `Boot → Title → Game → Result` 场景闭环，不用单场景多层，也不扩建丰富局外首页。
- 三节点：碰教学、吃/多候选教学、奖励、mini Boss；mini Boss 强制杠与清台，不强制胡。
- 音频：实现真实 AudioService 和设置边界；M2 使用 1 首临时 BGM 与约 8 类关键 SFX，M4 再补最终 3 首 BGM 与 18 类 SFX。
- 发布方向：以 `390×844` 竖屏 production web-mobile 验收；微信小游戏平台接入属于 M5。

## 2026-07-30 进展

- Lee 已确认主要成功标准、mini Boss 不强制胡、真实 AudioService + 临时素材，以及独立四 Scene 结构。
- 可视化伴侣已完成产品结构、玩家流程、关键界面、架构恢复和交付范围三轮确认。
- 正式规格已完成并通过占位、内部一致性、范围和歧义自查；当前等待 Lee 审阅书面版本。
- 本任务没有修改 Cocos、Web、shared 或资源代码，也没有开始代码级实施计划。
- Lee 已审阅并批准书面规格；T246 完成，后续代码级计划由 T247 承接。
