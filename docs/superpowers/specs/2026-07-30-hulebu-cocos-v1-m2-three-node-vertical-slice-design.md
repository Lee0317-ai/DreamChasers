# 胡了卜 Cocos v1 M2 三节点完整纵切设计

- 日期：2026-07-30
- 负责人：Lee
- 任务：T246
- 状态：设计已在对话中确认，等待书面规格审阅
- 上游规格：`docs/superpowers/specs/2026-07-10-hulebu-cocos-v1-production-design.md`
- 上游实现：T242/T243 production build 基线、T244 M1 核心架构、T245 快照真实路径修复

## 1. 结论

M2 交付一个 8–12 分钟、从标题到结算完整可玩的三节点 Cocos 竖屏版本，用最小内容验证正式产品骨架：

1. 第一关教学自由牌、入槽和手动发动一次碰。
2. 第二关教学遮挡、吃、多候选和教学撤回。
3. 第二关后进行一次奖励三选一，选择后写入本轮唯一检查点。
4. 第三关是 mini Boss，强制完成一次杠并清空牌山；胡是可选高价值操作，不作为 M2 强制教学。
5. 玩家从 `Boot → Title → Game → Result` 完成闭环，支持继续、暂停、刷新恢复、失败重试、重新开始和再次游玩。

M2 采用正式 Scene、Prefab、App Flow、SaveService 和 AudioService 边界，但使用临时完整的视觉与音频素材。完整十节点内容后置到 M3；最终 UI、动效和音频后置到 M4；微信小游戏平台接入和发布治理后置到 M5。

## 2. 已确认决策

### 2.1 主要成功标准

- 第一优先级是新玩家不读外部说明也能完整玩通。
- 技术架构完整是硬门槛，不能用单场景动态拼页换取短期速度。
- M2 的 UI 必须功能完整、层级一致、可替换，但不追求 M4 最终美术品质。

### 2.2 选定结构

采用独立四场景闭环：

```text
Boot -> Title -> Game -> Result
```

奖励、多候选、Boss 介绍、暂停和设置使用 Game 或 Title 内的正式 Modal Prefab。拒绝以下两种方案：

- 单场景多层：实现较快，但会继续扩大 Controller、输入锁和恢复状态的耦合，M3/M4 必须再次拆分。
- 丰富局外首页：会把章节地图、成长入口和长期模式提前带回 M2，削弱纵切验证目标。

### 2.3 mini Boss 与胡

- mini Boss 目标固定为 `完成一次杠 + 清空牌山`。
- 胡可正常触发并获得更高分和更强反馈，但不影响 M2 通关资格。
- 强制胡教学、完整 Boss 三目标和更高组合压力进入 M3。

### 2.4 音频深度

- M2 实现真实 `AudioService`、设置持久化和 WebAudio 首次手势解锁。
- 使用 1 首临时但可循环、可替换且有许可记录的 BGM。
- 使用 8 类关键 SFX 验证完整调用链。
- M4 再交付 3 首最终 BGM、18 类 SFX 和最终许可证包。

### 2.5 发布视口

- M2 交互验收基准为 `390×844` 竖屏 production web-mobile。
- 横屏交互和横屏提示都不在 M2 范围；M2 不新增任何横屏适配，平台方向约束留给 M5 的真实微信发布配置决定。
- 微信小游戏构建、账号、分享、广告、审核和发布不属于 M2。

## 3. 玩家目标与验收指标

### 3.1 玩家目标

玩家第一次进入后，不阅读仓库文档或外部说明，可以完成以下行为：

- 从标题页开始新游戏。
- 理解自由牌、遮挡、8 格主槽和手动组合。
- 完成一次碰、一次吃或多候选选择、一次奖励选择和一次杠。
- 在失败后理解失败原因并继续或重开。
- 击败 mini Boss，看到结算并再次开始或返回标题。

### 3.2 可量化指标

- 标题页显示后 3 秒内能识别主开始按钮。
- 首次游玩 90 秒内完成第一次碰。
- 完整纵切目标时长为 8–12 分钟。
- 至少 3 名未参与开发的试玩者完成无外部讲解测试；至少 2 人首次尝试到达 Result，3 人都能在 90 秒内完成第一次碰。
- production E2E 能从 Boot 自动推进到 Result，并覆盖刷新恢复、失败恢复和再次开始。
- `390×844` 下不存在关键遮挡、横向溢出、不可点击按钮或需要页面滚动才能完成的操作。

## 4. 完整玩家旅程

```text
Boot
  -> 校验配置、内容、存档、资源和音频映射
  -> Title
      -> 开始攀山
      -> 继续攀山（有有效存档时）
      -> 新游戏（二级确认）
      -> 设置
  -> Game / 节点 1：碰教学
  -> Game / 节点 2：吃与多候选教学
  -> Reward Modal：三选一
  -> 写检查点
  -> Game / 节点 3：mini Boss
  -> Result / 通关
      -> 再来一次
      -> 返回标题
```

失败路径：

```text
Game 失败
  -> Result / 失败
      -> 从奖励后检查点继续（检查点存在时）
      -> 重新开始三节点纵切
      -> 返回标题
```

### 4.1 Boot

- 展示品牌、真实加载阶段和失败重试，不使用虚假百分比。
- 顺序固定为：基础资源 -> 内容 manifest -> UI/audio manifest -> settings -> active run/checkpoint。
- Boot 不创建牌局，不读取 Cocos 节点推断存档状态。
- 校验成功后进入 Title；失败按第 12 节错误策略处理。

### 4.2 Title

- 无存档时主按钮为 `开始攀山`。
- 有有效 active run 时主按钮为 `继续攀山`；`新游戏`放入次级入口并要求确认。
- 显示 `设置`、当前版本和本地存档状态。
- 不显示无尽、高阶、每日、成就、复杂成长或账号入口。

### 4.3 Game

- 玩家始终看见当前节点、目标、分数、余牌、记牌器、三工具、组合按钮和 8 格主槽。
- 牌山保持第一视觉焦点，教学不使用遮住牌山的长说明卡。
- 只有 Coordinator 接受命令后，Presentation 才更新 UI。
- Modal 打开时，除允许的选择、取消和暂停外，规则输入全部关闭。

### 4.4 Result

Result Scene 支持 `clear` 和 `failed` 两种模式：

- 通关：总分、用时、吃/碰/杠/胡次数、工具使用、失败重试、所选奖励、`再来一次 / 返回标题`。
- 失败：失败原因、最后 5 次关键操作、距检查点位置、`从检查点继续 / 重新开始 / 返回标题`。
- Result 只消费已冻结的 run summary，不重新计算胜负、奖励或分数。

## 5. 三节点内容

### 5.1 节点 1：碰教学

- 内容 ID：`m2_tutorial_peng`。
- 目标时长：1.5–2 分钟。
- 牌量：18 张，使用固定可解 seed。
- 教学顺序：高亮自由牌 -> 入槽 -> 显示 8 格容量 -> 形成碰候选 -> 玩家手动点击碰 -> 清台。
- 退出条件：至少成功发动一次碰，并清空牌山。
- 保护：首次无效点击只提示原因；教学不会因一次误触直接失败。

### 5.2 节点 2：吃与多候选

- 内容 ID：`m2_tutorial_chi_choice`。
- 目标时长：2.5–3 分钟。
- 牌量：30 张，使用固定可解 seed。
- 教学顺序：遮挡关系 -> 形成两个合法吃候选 -> 打开 ComboChoice -> 玩家选择 exact candidate -> 制造一次可恢复的槽位压力 -> 提供一次不消耗正式次数的教学撤回 -> 清台。
- 退出条件：至少成功发动一次吃或完成一次多候选 exact choice，并清空牌山。
- 第二关结束后进入奖励 Modal，不直接进入 Boss。

### 5.3 奖励三选一

M2 固定展示三个简单、可理解且不引入新被动系统的候选：

- `护山符`：本轮获得 1 次现有满槽保护。
- `再洗一山`：洗牌工具次数 +1。
- `回手余香`：撤回工具次数 +1。

要求：

- 同一候选不重复。
- 选择前显示精确效果，选择后立即应用并写检查点。
- 重载后恢复相同候选和 exact target node，不重新抽取。
- 奖励选择成功只提交一次；重复点击或刷新不能重复发放。

### 5.4 节点 3：mini Boss

- 内容 ID：`m2_mini_boss_gatekeeper`。
- 目标时长：4–5 分钟。
- 牌量：42 张，使用固定可解 seed。
- 目标：`完成一次杠`、`清空牌山`。
- Boss Intro 不超过 3 秒；重复挑战允许跳过。
- 杠目标完成时有独立目标完成反馈；胡保持可用并提供高分反馈，但不是通关条件。
- 牌山必须由同一生成器、同一 GameSession 和同一规则路径产生，禁止脚本直接判胜。

### 5.5 正式 seed 门槛

- 三个固定 seed 都必须通过自动可解性检查。
- 教学 seed 必须在目标步骤前提供所需候选，且不能起手直接暴露完整答案。
- mini Boss seed 必须保证存在至少一条完成杠后清台的合法路径。
- 实施计划不得用测试专用后门、直接塞槽或强制触发胜利来满足 E2E。

## 6. 场景职责

### 6.1 Boot Scene

负责：

- 启动依赖装配。
- 内容、UI、音频和存档版本校验。
- 可恢复/不可恢复错误分流。
- 跳转 Title。

不负责：创建 GameSession、计算继续位置、修改游戏规则。

### 6.2 Title Scene

负责：

- 展示新游戏、继续、设置和版本。
- 向 AppFlowController 提交开始/继续/设置命令。
- 新游戏覆盖确认。

不负责：直接读写 active run、创建关卡或计算奖励。

### 6.3 Game Scene

负责：

- 装配 Game Presentation Prefab。
- 将 UI 输入映射为 GameCommand 或 App Flow command。
- 幂等渲染 GameCoordinator snapshot。
- 消费一次性 domain/presentation events，播放动画和声音。
- 按 phase 显示或关闭 Modal。

不负责：查找组合、计算得分、判断清关、抽取奖励、直接修改存档。

### 6.4 Result Scene

负责：

- 展示不可变 run summary。
- 提交重试、重新开始、再来一次或返回标题命令。

不负责：重新结算、修改奖励、修补存档或创建牌山。

## 7. Prefab 边界

M2 建立以下第一版正式 Prefab：

- `Hud`
- `Tile`
- `MainSlot`
- `ReserveSlot`
- `ComboBar`
- `ToolDock`
- `TileCounter`
- `ObjectiveStrip`
- `TutorialCoach`
- `ModalFrame`
- `ComboChoice`
- `RewardCard`
- `BossIntro`
- `PauseMenu`
- `SettingsPanel`
- `Toast`

约束：

- Prefab 只接收 view model、发出语义输入，不持有规则状态。
- Prefab 不直接访问 localStorage、ContentRepository、SaveService 或 GameSession。
- Tile 可以池化；短命 FX 可以池化；完整页面不得继续由 Controller 运行时逐节点拼装。
- M2 允许使用临时皮肤，但 normal/pressed/disabled/active/loading/error 状态必须完整。
- 关键点击目标换算到 CSS 后不得小于 `44×44`。

## 8. 架构与组件

### 8.1 AppFlowController

负责：

- `Boot / Title / Game / Result` 合法路由。
- 新游戏、继续、暂停、返回标题、重试和再来一次。
- Scene transition payload 与返回路径。

不负责：牌局 phase、组合、目标、奖励效果或存档编码。

### 8.2 GameCoordinator

继续作为玩法唯一写入口：

- 接收版本化 GameCommand。
- 驱动 GameSession 与 RunStateMachine。
- 返回不可变 snapshot、phase flags 和一次性 events。
- 在稳定且可持久化 phase 请求保存。

M2 Scene/Prefab 不允许新增绕过 Coordinator 的玩法 mutation。

### 8.3 ContentRepository

新增 M2 内容包，但沿用 M1 的版本化加载和失败语义：

- 三节点定义。
- 三个正式 seed。
- 奖励候选与 effect 引用。
- 教学步骤与 copy key。
- UI/audio manifest key。

ContentRepository 启动时拒绝缺失 ID、重复 ID、坏引用、future schema 和不可解正式 seed，不在运行时补默认值。

### 8.4 SaveService

保存两种 M2 状态：

- `active run`：每次完整结算并回到允许持久化的稳定 phase 后保存。
- `checkpoint`：奖励选择成功、效果应用并确认后保存一次。

Settings 使用独立 settings storage，不与 active run envelope 混写。

### 8.5 AudioService

负责：

- `master / music / sfx` 三总线，范围 `0–100`。
- 首次玩家手势统一解锁。
- BGM 排队、切换、淡入淡出和页面隐藏恢复。
- SFX 并发上限、防重和短间隔节流。
- 音频失败降级，不影响规则命令结果。

AudioService 只消费 presentation event，不决定玩法 phase、目标或奖励。

### 8.6 Presentation

- `GameScenePresenter` 把 Coordinator snapshot 映射为 Prefab view model。
- `InputGateway` 把 Prefab 语义事件映射为命令。
- `PresentationEventRouter` 把 domain event 映射为动画、Toast 和 audio key。
- 渲染必须幂等；重复渲染相同 revision 不重复播放一次性反馈。

## 9. 命令、快照与数据流

一次点击链路固定为：

```text
Tile Prefab
  -> InputGateway: tile.select(tileId)
  -> Game Scene
  -> GameCoordinator.dispatch(command)
  -> GameSession / RunStateMachine
  -> CommandResult(snapshot, events, phase flags)
  -> GameScenePresenter 幂等渲染
  -> PresentationEventRouter 播放动画/SFX
  -> 稳定 phase 时 SaveService 保存
```

约束：

- UI 不乐观修改规则状态。
- 动画完成只解除输入锁，不提交第二次规则 mutation。
- domain event 不携带 Cocos Node、Sprite、AudioClip 或时间戳随机值。
- Scene 切换 payload 只包含版本化 ID 或不可变 summary，不传递 Cocos 对象。
- 刷新后从 snapshot 重新渲染，不从节点坐标、按钮高亮或 Modal 可见性反推规则。

## 10. phase、输入锁与 Modal

### 10.1 输入状态

- `playing.idle`：牌、合法组合和可用工具响应输入。
- `playing.tileEntering / playing.resolving / playing.dangerCheck`：短时锁定会改变规则的输入。
- `playing.comboChoosing`：只允许 exact candidate 选择、取消和暂停。
- `rewardChoice`：只允许 exact reward 选择和暂停。
- `paused`：所有规则输入关闭，保存 return phase。
- `encounterCleared / settlement / failed`：牌局输入关闭，只允许明确流程命令。

### 10.2 Modal 规则

- Modal 可见性由 phase/context 决定，不维护第二份布尔真相源。
- 关闭 Modal 不代表命令成功；只有 accepted result 才推进 UI。
- 刷新后 combo/reward Modal 恢复相同候选、顺序和目标节点。
- 暂停多候选或奖励时，恢复后回到原选择上下文。

## 11. 存档、检查点与恢复

### 11.1 active run

- 只保存 allowlist 中稳定且可持久化 phase。
- 每次玩法 mutation 完整结算后保存。
- 动画中、dangerCheck、无 return phase 的 paused 和 failed 不保存为 active run。
- 保存失败不覆盖最后有效 primary，也不更新内存中的 committed 标识。

### 11.2 检查点

检查点在奖励成功应用后写入，包含：

- content/save schema version。
- 当前目标节点 `m2_mini_boss_gatekeeper`。
- 已选奖励和效果结果。
- 分数、工具、保护次数和必要 run profile。
- 确定性 seed 与 replay 所需上下文。

M2 只有这一个章节检查点，不在每关新增检查点。

### 11.3 恢复优先级

```text
有效 active run
  -> 恢复 exact phase/context
active run 无效
  -> quarantine 原始字节
  -> 尝试奖励后 checkpoint
checkpoint 也无效
  -> 保留 settings
  -> 清理本轮状态
  -> 返回 Title 并显示可理解提示
```

### 11.4 失败与重试

- Boss 失败且 checkpoint 有效时，`从检查点继续`恢复奖励、工具、分数和 Boss 初始 seed。
- `重新开始`清除 active run/checkpoint，重新进入节点 1。
- `返回标题`不伪造成功结算；有效 checkpoint 保留，Title 主按钮显示继续。

## 12. 错误处理

### 12.1 Boot 错误

- 核心资源或 content manifest 无效：显示阻塞错误页、错误阶段、重试；不进入 Title/Game。
- UI/audio manifest 引用缺失：production build 门禁失败；运行时若仍发生，Boot 阻塞并报告稳定错误码。
- settings 损坏：隔离并恢复默认 settings，允许继续。
- active run/checkpoint 损坏：按第 11.3 节恢复，不阻塞进入 Title。

### 12.2 运行时错误

- 非法命令：state/revision 不变，给出短 Toast；production 不显示堆栈。
- 音频解锁或单个 clip 播放失败：游戏继续，当前会话对该 key 静音并记录一次错误。
- 保存失败：游戏可继续，但显示 `本轮暂时无法保存，刷新可能丢失进度`；后续稳定 phase 允许重试。
- Scene/Prefab 必需资源加载失败：暂停规则输入，进入可重试错误层；禁止无 UI 继续跑规则。

### 12.3 日志与隐私

- production 只记录稳定错误码、build ID、contentVersion、saveSchemaVersion 和 phase。
- 不记录完整存档、牌桌截图、用户标识或个人信息。
- 同一错误在一次会话中限频，避免日志洪泛。

## 13. UI 与交互

### 13.1 视觉基线

- 延续山路、漆木牌桌、玉质麻将、宣纸和克制金红反馈。
- 墨黑用于文字，象牙白用于牌面，青玉绿用于牌桌，漆红用于危险和关键动作，金色仅用于奖励和完成。
- M2 临时资产必须统一风格，不允许混入调试框、概念图或平台后台卡片样式。

### 13.2 竖屏布局

- 基准 `390×844`，考虑安全区和 Home Indicator。
- 顶部：节点、目标、分数。
- 中央：牌山，始终是最大区域。
- 左侧紧凑记牌器，右侧三工具。
- 底部：组合栏和固定 8 格主槽。
- 教学提示使用局部指向和一步一提示，不遮住当前目标牌。

### 13.3 动效层级

- 轻：按钮、入槽、被压提示，`100–220 ms`。
- 中：碰/吃、工具、奖励选择，`250–500 ms`。
- 重：杠、胡、Boss 目标和胜利，`500–1000 ms`。
- `减弱动效`关闭震屏、长位移和多段粒子，但保留状态变化反馈。
- 只有真正改变规则的结算段锁输入；纯装饰动画不得拖慢点击节奏。

## 14. 音频与设置

### 14.1 M2 音频 key

- BGM：`bgm.m2.main`。
- SFX：`ui.confirm`、`tile.enter`、`tile.blocked`、`combo.resolve`、`tool.use`、`reward.choose`、`boss.warning`、`run.outcome`。

`combo.resolve`按吃/碰/杠/胡使用参数或变体，不在 M2 扩成四套独立资产；`run.outcome`按胜利/失败使用变体。

### 14.2 设置项

- 主音量 `master`。
- 音乐 `music`。
- 音效 `sfx`。
- 减弱动效 `reducedMotion`。

设置在 Title 和 PauseMenu 使用同一 SettingsPanel；修改即时生效并独立保存。

### 14.3 许可与替换

- 临时音频也必须记录来源、作者、许可证、修改方式和项目可用范围。
- 代码只引用稳定 audio key，不引用磁盘文件名。
- M4 替换音频文件时不改变玩法、Scene 或调用方契约。

## 15. 测试策略

### 15.1 单元测试

- AppFlowController 合法/非法路由和重复命令。
- 三节点内容 ID、引用、目标、奖励和正式 seed。
- 教学步骤在固定 seed 的触发顺序。
- mini Boss 杠目标和清台条件。
- Settings round-trip、损坏恢复和范围归一化。
- AudioService 解锁、总线、限频、页面隐藏与播放失败降级。

### 15.2 集成测试

- `Boot -> Title -> New -> Game`。
- 节点 1 碰教学完成并只提交一次清关。
- 节点 2 多候选 exact choice、暂停/恢复和刷新恢复。
- 奖励 exact candidate、只发放一次并写检查点。
- Boss 失败后从检查点恢复。
- Boss 完成杠并清台后只生成一次 clear summary。
- Result 的再来一次和返回标题不重复结算。
- Scene/Prefab 扫描防止直接玩法 mutation 和 localStorage 写入。

### 15.3 production E2E

使用精确提交 production build，在 `390×844` 完成：

1. Boot 成功和 Title 主按钮。
2. 新游戏进入节点 1，完成碰并清台。
3. 节点 2 完成多候选选择；在选择态刷新并恢复 exact candidates。
4. 选择奖励，刷新后奖励和 Boss 目标保持一致。
5. mini Boss 完成杠和清台。
6. Result 显示正确 summary；分别验证再来一次和返回标题。
7. 单独制造一次失败，从检查点继续并再次进入 Boss。

门槛：未处理异常为 0，必需资源 404 为 0，missing class 为 0，调试文案/入口为 0。

### 15.4 手工新玩家测试

- 至少 3 名未参与开发者使用手机竖屏或等效视口。
- 不提供口头玩法说明，只告知“从开始按钮进入”。
- 记录首次碰用时、完成用时、卡住步骤、错误点击、工具使用和失败原因。
- 不满足第 3.2 节指标时，只调整教学、可见性和固定 seed；不在 M2 扩大规则范围。

## 16. 五个交付批次

### 批次 1：App Flow

产物：

- Boot、Title、Result Scene。
- AppFlowController、Scene transition payload、启动错误页。
- SettingsPanel 壳和 settings storage。

退出标准：可以从 Boot 到 Title，开始/继续进入 Game 占位入口，Result 可展示固定 summary 并返回；非法路由测试通过。

### 批次 2：Prefab 骨架

产物：

- Game Scene 第一版正式 Prefab 树。
- Presenter、InputGateway、PresentationEventRouter。
- 390×844 安全区和完整组件状态。

退出标准：现有 M1 runtime 可经 Coordinator 在 Prefab UI 中完成选牌、组合和工具；Scene/Prefab 不包含规则 fallback。

### 批次 3：三节点内容

产物：

- 三节点、三个正式 seed、教学步骤、奖励候选和 mini Boss 目标。
- TutorialCoach、ComboChoice、RewardCard 和 BossIntro 流程。

退出标准：无刷新时可从节点 1 玩到 Result；固定 seed 可解性和内容引用测试通过。

### 批次 4：存档与音频

产物：

- active run、奖励后 checkpoint 和 Result summary 恢复。
- AudioService、1 首 BGM、8 类 SFX、设置、减弱动效和许可证记录。

退出标准：多候选、奖励、暂停、刷新、Boss 失败和坏档 fallback 通过；音频失败不阻断规则。

### 批次 5：Production E2E

产物：

- 精确提交 production build/verify 证据。
- 390×844 完整 E2E、失败恢复和再次开始证据。
- 新玩家试玩记录与缺陷清单。

退出标准：第 17 节 Definition of Done 全部满足，P0/P1 缺陷为 0。

## 17. Definition of Done

只有同时满足以下条件，M2 才能标记完成：

### 17.1 产品闭环

- Boot、Title、Game、Result 四场景都是真实 production 路径。
- 新玩家可以完成两关教学、奖励、mini Boss、结算和再次开始。
- 失败、继续、重新开始和返回标题不存在流程死路。

### 17.2 玩法单路径

- 碰、吃、多候选、奖励、杠、胡、工具、目标和清关只通过 Coordinator/GameSession。
- 同一命令不重复发事件、奖励、清关或结算。
- Scene/Prefab 不重新引入规则 fallback。

### 17.3 恢复可靠

- 刷新、暂停、后台恢复、多候选和奖励上下文精确。
- active run 损坏回退检查点；检查点损坏回到 Title。
- 保存失败不覆盖最后有效档，玩家收到可理解提示。

### 17.4 结构可扩展

- 四 Scene、第一版正式 Prefab、AppFlowController、Presenter、InputGateway 和 AudioService 边界落地。
- M3 可以扩节点和内容，M4 可以替换资源和动效，而无需推倒 App Flow 或玩法写路径。

### 17.5 竖屏 production

- `390×844` 从 Boot 到 Result 完整可玩。
- 关键控件无重叠、越界或小于 `44×44` 的点击目标。
- 无未处理异常、必需资源 404、missing class、调试入口或占位错误文案。

### 17.6 验证与试玩

- scoped tests、Cocos TypeScript、真实 production build、verify-only、HTTP smoke 和 production E2E 全部通过。
- 三个固定 seed 可解。
- 新玩家试玩达到第 3.2 节指标。
- 最终独立评审为 `0 Critical / 0 Important`。

## 18. 明确不做

M2 不包含：

- 完整十节点章节、事件、精英、正式 Boss 和完整奖励平衡。
- 强制胡教学、三检查点和 20–30 分钟章节。
- 最终 UI、美术、字体、完整动画和正式品牌资源。
- 最终 3 首 BGM、18 类 SFX 和最终音频母带。
- 微信小游戏构建、登录、分享、广告、审核、线上部署和回滚。
- 包体裁剪、完整设备矩阵和线上埋点。
- 横屏交互。
- 无尽、高阶、每日、成就、复杂成长、账号同步、排行榜、付费或多人玩法。

## 19. 风险与控制

| 风险 | 早期信号 | 控制方式 |
| --- | --- | --- |
| Scene 拆分后规则出现双路径 | Prefab 或 Scene 直接调用 runtime mutation | 静态扫描 + 行为测试；所有输入经 Coordinator |
| M2 被最终 UI 拖慢 | 开始制作大量最终资源或字体方案 | Prefab 状态完整即可，最终资源明确留到 M4 |
| 教学过密 | 玩家在第二关无法解释当前目标 | M2 不强制胡；一步一提示；固定 seed；试玩数据驱动调整 |
| 奖励扩大被动系统 | 新增复杂触发器和冲突表 | 固定三个简单现有效果，不引入稀有度和装备槽 |
| 检查点与 active run 漂移 | 恢复后奖励或目标重复 | 同一 decoder/validator；exact target/candidates；一次性提交测试 |
| 临时音频变成无许可资产 | 只有文件，没有来源记录 | audio manifest 强制许可字段，缺失时 build 失败 |
| production 只测画面不测行为 | 截图正常但组合/恢复失败 | E2E 必须真实点击并走到 Result，截图不替代行为测试 |
| 微信发布范围提前侵入 | 开始接平台 SDK、登录或广告 | 明确后置到 M5，M2 只验证 web-mobile 竖屏正式包 |

## 20. 后续阶段接口

### 20.1 M3

在不改变四 Scene、Coordinator、Prefab 契约和存档模型的前提下：

- 把三节点扩展为十节点章节。
- 增加事件、精英、正式 Boss、三次奖励和三检查点。
- 正式教学胡，完成 20–30 分钟内容和平衡。

### 20.2 M4

在不改变玩法与 App Flow 的前提下：

- 替换最终 UI、字体、背景、图标和动画 Clip。
- 扩展到 3 首 BGM 和 18 类 SFX。
- 完成最终许可证清单、减弱动效和视听 QA。

### 20.3 M5

- 资源分组、引擎裁剪、包体和性能治理。
- 设备矩阵、后台恢复、埋点、发布清单和回滚。
- 微信小游戏平台构建、账号准备、分享/广告决策与审核。

## 21. 实施计划入口

本规格通过 Lee 的书面审阅后，下一步使用 `superpowers:writing-plans` 生成代码级实施计划。实施计划必须：

- 先读取 T244 最终代码和当前 Cocos Scene/Prefab 结构。
- 按第 16 节五个批次拆分任务，每批包含 RED、GREEN、production 验证和精确提交。
- 在创建实现任务前读取 `NEXT_ID.md`，登记任务分片和领取范围。
- 不在一个任务中同时修改全部 Scene、内容、存档、音频和 production E2E。
