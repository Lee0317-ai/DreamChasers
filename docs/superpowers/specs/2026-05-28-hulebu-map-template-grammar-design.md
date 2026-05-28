# 胡了卜地图模板语法系统设计

**日期**：2026-05-28  
**对应任务**：T081  
**状态**：设计定稿，待用户复核  
**范围**：底层地图模板系统设计，不修改生成器代码，不接 Cocos。

## 1. 设计结论

胡了卜的牌山生成器不应只继续追加几个写死模板。完整游戏需要一套地图模板语法系统，让每一关都能解释：

- 它属于什么地图家族。
- 它通过哪些参数变成不同关卡。
- 它制造什么体验压力。
- 它是否通过理论解法和体验校验。

本设计采用用户已确认的路线：

`模板语法系统 -> 8 个核心模板先落地 -> 第二批模板 backlog 预留`

第一期不追求一次实现所有地图，而是先做 8 个高复用家族，每个家族 2-3 个参数变体。第二批模板先进入设计 backlog，类型和文档预留扩展口，代码实现后置。

## 2. 与 T080 的关系

T080 已实现共享层第一版 Graph-based 生成器：

- `buildBlockerGraph`
- `createMountainSkeleton`
- `generateHulebuMountain`
- `SolutionTrace`
- `FaceAssignment`
- `ExperienceReport`

T081 在此基础上升级模板层。后续实现不应推翻 T080，而应把当前 `center-tower / two-wings` 的分支式模板生成，重构为模板注册表和模板语法。

推荐后续数据流：

```text
TemplateArchetype
  -> Footprint
  -> LayerProfile
  -> OcclusionGrammar
  -> MountainSkeleton
  -> SolutionTrace
  -> FaceAssignment
  -> ExperienceReport
  -> levelTiles
```

## 3. 核心概念

### 3.1 TemplateArchetype

模板家族，负责定义这类地图的读图方式。

示例：

- 中心塔：核心深埋，入口少，越拆越紧。
- 双翼：左右分路，玩家判断先拆哪边。
- 十字：中心节点锁多路，强调关键释放。
- 环形：外圈包内核，制造看得到但拿不到。

模板家族不直接等于具体坐标。一个家族可以通过参数生成多个变体。

### 3.2 Footprint

平面轮廓，负责生成 x/y 基础布局。

它回答：

- 牌山铺多宽。
- 入口在哪些方向。
- 是中心聚合、两翼展开、环形包围，还是线性推进。

### 3.3 LayerProfile

层高曲线，负责分配每个区域的堆叠深度。

它回答：

- 哪些区域更深。
- 哪些区域是浅入口。
- 关键牌应该埋在第几层。

### 3.4 OcclusionGrammar

遮挡语法，负责制造跨列遮挡和可点窗口。

它回答：

- 哪些高层牌应该压住低层牌。
- 初始可点窗口控制在多少。
- 是否需要钥匙节点释放多个区域。

所有遮挡最终仍必须走 T080 的 5% 几何覆盖规则，不能另起一套和 runtime 不一致的判定。

### 3.5 ExperienceTags

体验标签，用于关卡编排和报告解释。

第一批标签：

- `warmup`：暖场。
- `read-choice`：读图选择。
- `multi-route`：多路线并行。
- `slot-pressure`：槽位压力。
- `key-release`：关键释放。
- `visible-locked`：看得到但暂时拿不到。
- `recovery`：恢复局。
- `boss-pressure`：Boss 前或 Boss 内压迫。
- `reward-calm`：奖励节点前后降压。

### 3.6 Validators

模板生成后必须过校验。模板不是只要“看起来像”就算成立。

第一批校验指标：

- 理论可解：`SolutionTrace.remainingNodeCount` 必须为 0。
- 初始可点窗口：低关 8-14，中关 6-12，高关 4-10。
- 平均可点窗口：不能长期过低，避免憋死。
- 遮挡边密度：不能低到接近平铺，也不能高到读图混乱。
- 最大槽压：必须与目标难度匹配。
- 关键牌埋深：Boss 和压迫关可以更深，教学关不能过深。
- 释放点数量：每局至少有 1-3 个可感知的释放点。
- 节奏波形：暖场、压力、释放、高潮不能全局平直。

## 4. 第一批 8 个核心模板

### 4.1 中心塔 `center-tower`

职责：主压迫骨干。

体验：

- 核心区域堆叠深。
- 外圈是入口，中心是压力来源。
- 玩家会感到越拆越接近核心。

参数重点：

- `coreDepth`
- `outerRingCount`
- `entranceCount`
- `centerCoverRate`

适用：

- 主线中段。
- Boss 前压迫。
- 中高难普通关。

风险：

- 太频繁会疲劳。
- 如果入口太少，会像系统不给活路。

### 4.2 双翼 `two-wings`

职责：路线选择骨干。

体验：

- 左右两翼同时可拆。
- 玩家需要判断先拆哪边更利于槽位组合。
- 适合教学“不要只点眼前可点牌”。

参数重点：

- `wingDepth`
- `branchSymmetry`
- `bridgeCount`
- `leftRightDecoyBias`

适用：

- 低中难主线。
- 路线选择教学。
- 普通关的稳定骨架。

风险：

- 完全对称会变无聊。
- 两边互不影响时策略感不足。

### 4.3 十字 `cross`

职责：关键释放骨干。

体验：

- 中心节点锁住四路。
- 解开中心后会释放多个方向。
- 适合制造明确爽点。

参数重点：

- `armLength`
- `centerDepth`
- `armCoverRate`
- `keyReleaseCount`

适用：

- 关键释放教学。
- 中段高潮关。
- Boss 目标包承接。

风险：

- 中心钥匙太深会卡。
- 四路同时释放过多会让槽位压力突然失控。

### 4.4 环形 `ring`

职责：可见锁定骨干。

体验：

- 外圈先拆，内圈后开。
- 玩家看得到内核，但必须按外圈路径推进。
- 适合制造“差一点拿到”的吸引力。

参数重点：

- `ringRadius`
- `innerCoreDepth`
- `outerGateCount`
- `loopBreakCount`

适用：

- 中后段压迫关。
- 需要明显目标感的普通关。

风险：

- 外圈太长会拖节奏。
- 内核如果奖励不足，会觉得白忙。

### 4.5 长墙 `long-wall`

职责：节奏稳定器。

体验：

- 入口线性推进。
- 释放关系清楚。
- 难度不高，但能稳定提供手感。

参数重点：

- `wallLength`
- `wallThickness`
- `stepOverlap`
- `releaseInterval`

适用：

- 暖场关。
- 奖励节点前后。
- 高压关后的恢复局。

风险：

- 决策少。
- 太多会像纯流程关。

### 4.6 岛屿 `islands`

职责：恢复与多堆判断。

体验：

- 多个小堆并行。
- 玩家可以在几个局部之间切换。
- 比中心塔轻，但比长墙更有变化。

参数重点：

- `islandCount`
- `islandDepth`
- `interIslandCoverRate`
- `safeIslandRatio`

适用：

- 低压变化局。
- 恢复局。
- 奖励节点承接。

风险：

- 难度上限低。
- 岛屿完全独立时像多个小关拼一起。

### 4.7 峡谷 `canyon`

职责：槽压教学。

体验：

- 两侧高墙，中间窄路。
- 初始窗口不大。
- 玩家需要谨慎选择先开哪侧，避免主槽被干扰牌塞满。

参数重点：

- `corridorWidth`
- `wallDepth`
- `sidePressure`
- `gateInterval`

适用：

- 槽位压力教学。
- 中高难主线。
- Boss 前压迫。

风险：

- 入口太窄会憋。
- 干扰过强会像死局。

### 4.8 阶梯 `staircase`

职责：学习与释放反馈。

体验：

- 层层下探。
- 每一步释放关系清楚。
- 玩家能直观看到自己正在打开下一层。

参数重点：

- `stairLength`
- `stepDepth`
- `slopeDirection`
- `releaseCadence`

适用：

- 新机制教学。
- 低中难主线。
- 需要清晰反馈的早期关。

风险：

- 太规整。
- 后期使用需要加入扰动和干扰分支。

## 5. 第二批 backlog

第二批先进入设计 backlog，不在第一期实现。

### 5.1 花瓣 `petals`

用途：主题关、奖励关、视觉记忆点。

价值：外瓣并行，中心奖励，适合做关卡主题包装。

后置原因：视觉复杂，第一期先保证核心读图体验。

### 5.2 堡垒 `fortress`

用途：Boss 关。

价值：外壳包核心，压迫感强，适合阶段 Boss。

后置原因：需要更强校验器，否则容易变成纯卡关。

### 5.3 棋盘 `checkerboard`

用途：高手关、每日挑战。

价值：交错遮挡，多点判断，读图复杂。

后置原因：读牌负担高，不适合第一期就大量使用。

### 5.4 迷雾外圈 `fog-ring`

用途：中后段诱导误选、词缀关。

价值：外浅内深，诱导玩家提前拿错分支。

后置原因：干扰设计必须很克制，否则会显得不公平。

## 6. 参数体系

后续 `HulebuMountainGeneratorConfig` 应拆为两层：

```ts
type TemplateId =
  | "center-tower"
  | "two-wings"
  | "cross"
  | "ring"
  | "long-wall"
  | "islands"
  | "canyon"
  | "staircase";

interface TemplateParameters {
  tileCount: number;
  maxLayer: number;
  entranceCount: number;
  coreDepth: number;
  branchSymmetry: number;
  crossCoverRate: number;
  decoyRate: number;
  releaseDensity: number;
  jitter: number;
}
```

模板可以声明自己支持哪些参数。调用方不应该直接知道某个模板内部如何生成坐标。

## 7. 模板注册表

后续实现应增加模板注册表，而不是继续扩大 `if templateId === ...`。

建议接口：

```ts
interface MountainTemplateDefinition {
  id: TemplateId;
  label: string;
  family: "core" | "route" | "pressure" | "recovery" | "boss";
  tags: ExperienceTag[];
  defaultParameters: TemplateParameters;
  parameterBounds: Record<string, { min: number; max: number }>;
  createFootprint(context: TemplateContext): FootprintNode[];
  createLayerProfile(context: TemplateContext, footprint: FootprintNode[]): LayerProfile;
  applyOcclusionGrammar(context: TemplateContext, nodes: HulebuMountainNode[]): HulebuMountainNode[];
}
```

每个模板定义只负责结构生成，不负责牌面发牌和组合路径。牌面和路径继续由 T080 的 `SolutionTrace` 和 `FaceAssignment` 承担。

## 8. ExperienceReport 扩展

T080 的 `ExperienceReport` 已有难度、节奏、槽压、干扰和推荐信息。模板系统落地后应继续扩展：

- `templateId`
- `templateFamily`
- `experienceTags`
- `parameterSnapshot`
- `windowCurve`
- `releaseEvents`
- `keyNodeDepths`
- `validatorResults`

这样调关卡时能回答：

- 这局为什么难。
- 这局像哪个模板。
- 它的难点来自槽压、埋深、干扰，还是窗口太窄。
- 哪个参数应该调整。

## 9. 关卡编排建议

第一期 20 关可按模板职责编排：

| 阶段 | 目标 | 推荐模板 |
| --- | --- | --- |
| 1-3 | 教遮挡、释放、手动组合 | 阶梯、长墙、双翼轻量 |
| 4-6 | 路线选择和轻压 | 双翼、岛屿、中心塔轻量 |
| 7-9 | 槽位压力和可见锁定 | 峡谷、环形、十字轻量 |
| 10 | 第一 Boss | 中心塔 + 十字 |
| 11-13 | 恢复与新变化 | 长墙、岛屿、双翼扰动 |
| 14-16 | 中后段压力 | 环形、峡谷、中心塔标准 |
| 17-19 | Boss 前压迫 | 十字、环形、峡谷 |
| 20 | 第二 Boss | 中心塔 + 环形 + 十字 |

这只是编排建议，不要求 T081 实现。

## 10. 后续任务拆分

### T082：模板注册表和参数系统重构

目标：把 T080 当前模板生成重构为模板注册表。

范围：

- `packages/shared/src/mahjong-mountain-generator.ts`
- `packages/shared/src/mahjong-mountain-generator.test.ts`
- `packages/shared/src/index.ts`

验收：

- 保留现有 `center-tower`、`two-wings` 行为。
- 新增模板 definition 结构。
- 测试覆盖注册表、参数默认值、参数边界和 seed 稳定性。

### T083：第一期 8 个核心模板实现

目标：实现中心塔、双翼、十字、环形、长墙、岛屿、峡谷、阶梯。

验收：

- 每个模板至少有一个稳定快照测试。
- 每个模板能生成理论可解路径。
- 每个模板输出正确体验标签。
- 初始窗口、遮挡边密度和槽压指标落在预期范围。

### T084：Cocos 接入 Graph-based 生成器

目标：让 Cocos 默认关卡消费共享生成器输出。

验收：

- `levelTiles` 可转换为现有 Cocos tile config。
- 保留当前点击、入槽、遮挡和组合按钮逻辑。
- Cocos Web Preview 手机视口可看到模板牌山。
- 用 ExperienceReport 调首关压力。

### T085：模板调参面板或样本图库

目标：给后续调关提供可视化工具。

验收：

- 能选择模板、seed、牌量、层数、干扰率。
- 展示初始窗口、槽压、释放点和理论解法摘要。
- 可导出推荐配置或 seed。

## 11. 不做事项

T081 不做：

- 不修改共享生成器代码。
- 不新增模板实现。
- 不修改 Cocos。
- 不替换当前默认关卡。
- 不做完整关卡编辑器。
- 不做美术、动效、音效。

## 12. 验收标准

本设计通过的标准：

- 明确采用模板语法系统，而不是孤立模板函数。
- 第一批 8 个核心模板职责清楚。
- 第二批 backlog 明确后置原因。
- 参数、体验标签、校验器和注册表接口清楚。
- 后续任务拆分能直接进入 T082 计划编写。
