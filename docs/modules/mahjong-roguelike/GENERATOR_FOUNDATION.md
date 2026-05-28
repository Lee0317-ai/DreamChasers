# 胡了卜牌山生成器地基

**对应任务**：T079, T080, T081, T082, T083  
**状态**：共享层第一版已实现；地图模板语法系统已完成设计；模板注册表、参数系统和 8 个核心模板已在共享层落地，待 Cocos 接入  
**范围**：底层生成器地基，不改 Cocos 表现层。

## 1. 当前判断

当前 Cocos 牌山生成器已经解决了“看得见层级”和“被遮挡不可点”，但它的生成主脑仍是随机柱子。它先随机出空间，再按顶层顺序每 3 张塞同牌，最后计算 `blockedBy`。

这个方式适合快速恢复密度，但不适合作为长期地基。原因是它没有先设计解锁路径，也没有在牌面分配时理解玩家的槽位压力。

## 2. 新地基

后续生成器应改为：

`牌山骨架图 -> 理论解法路径 -> 牌面发牌 -> 难度评估`

这比“随机柱子 -> 发牌”多了两层关键能力：

- 解法路径：保证至少有一条可通路。
- 难度评估：解释这局为什么简单、正常或困难。

## 3. 四个核心单元

### MountainSkeleton

只描述牌位、层级和遮挡关系，不描述麻将牌面。

### SolutionTrace

描述理论通关路径，包括每一步拿哪些牌、触发什么组合、释放哪些后续牌。

### FaceAssignment

把 `碰 / 吃 / 杠 / 胡` 组合包分配到骨架节点，并插入诱导牌和干扰牌。

### ExperienceReport

输出牌量、层数、初始窗口、遮挡边数量、理论路径步数、节奏阶段、槽位压力、干扰牌、胡牌候选步骤和调参建议。

## 5. T080 已落地内容

共享模块已新增 `packages/shared/src/mahjong-mountain-generator.ts` 和测试：

- `buildBlockerGraph`：按 5% 覆盖阈值生成 `blockedBy` / `blocks` 关系。
- `createMountainSkeleton`：支持 `center-tower`、`two-wings` 两个模板，并用 seed 控制局部扰动。
- `generateHulebuMountain`：输出 `skeleton`、`solution`、`assignment`、`experience` 和 Cocos 后续可消费的 `levelTiles`。
- `SolutionTrace`：记录理论解法步骤、组合类型、释放节点和槽位压力。
- `FaceAssignment`：沿理论路径分配 `碰 / 吃 / 杠 / 胡` 组合牌面，并标记干扰节点。
- `ExperienceReport`：包含难度评分、节奏波形、危险槽压步骤、干扰牌数量和调参建议。

## 6. 随机性的定位

随机性仍然需要保留，因为胡了卜需要难度和复玩。

但随机性应该用于：

- 模板局部扰动。
- 堆叠深度变化。
- 跨列遮挡比例。
- 牌面洗牌。
- 干扰牌强度。

随机性不应该单独决定整局是否好玩或是否可通。

## 7. 与 Cocos 的边界

本地基不要求 Cocos 立刻改。

后续共享模块只需要输出兼容现有 Cocos 的关卡数据：

- `id`
- `suit`
- `rank`
- `x`
- `y`
- `layer`
- `blockedBy`
- `location`

Cocos 继续负责渲染、点击、入槽、HUD 和组合按钮。生成器负责生成、校验和评分。

## 8. 地图模板语法系统

T081 已确认胡了卜后续不应只追加几个写死模板，而应建立长期可扩展的地图模板语法系统：

`TemplateArchetype -> Footprint -> LayerProfile -> OcclusionGrammar -> MountainSkeleton -> SolutionTrace -> FaceAssignment -> ExperienceReport`

第一期采用“8 个核心模板 + 第二批 backlog 预留”：

- 核心模板：中心塔、双翼、十字、环形、长墙、岛屿、峡谷、阶梯。
- 第二批 backlog：花瓣、堡垒、棋盘、迷雾外圈。

模板必须带参数、体验标签和校验指标。后续实现应优先做模板注册表，不要继续扩大 `if templateId === ...` 的分支式生成。

详细设计见：`docs/superpowers/specs/2026-05-28-hulebu-map-template-grammar-design.md`。

## 9. T082 已完成内容

T082 已完成模板注册表和参数系统实施计划，计划文件为：

`docs/superpowers/plans/2026-05-28-hulebu-template-registry-parameter-system.md`

计划明确后续实现应先做：

- 模板 definition、注册表和默认参数。
- 旧配置与新 `templateParameters` 的归一化。
- 参数边界裁剪和未知模板错误。
- 将 `center-tower` / `two-wings` 从分支式逻辑迁移到模板 definition。
- `ExperienceReport` 增加模板标签、参数快照、窗口曲线、释放事件和通用校验结果。
- 保留当前 `SolutionTrace`、`FaceAssignment`、5% 遮挡图和 `levelTiles` 输出。

本计划不修改 `packages/shared` 代码，也不接入 Cocos。8 个核心模板的代码实现仍留给后续任务。

## 10. T083 已完成内容

共享生成器已从写死模板分支升级为模板注册表。当前已注册并可生成 8 个核心模板：

- `center-tower`
- `two-wings`
- `cross`
- `ring`
- `long-wall`
- `islands`
- `canyon`
- `staircase`

T083 已落地：

- 模板 definition、模板注册表和查询 API。
- `templateParameters` 参数默认值、边界裁剪和旧配置归一化。
- 未知模板错误，避免静默回落成错误牌山。
- 8 个核心模板的列权重、坐标布局和角色标签回调。
- `ExperienceReport` 的模板摘要、参数快照、窗口曲线、释放事件和通用校验器。
- 现有 `SolutionTrace`、`FaceAssignment`、5% 遮挡图和 `levelTiles` 输出继续保留。

本任务仍不接 Cocos。Cocos 默认关卡尚未消费 Graph-based 生成器输出，后续应另起任务把 `levelTiles` 转为现有 Cocos `HulebuLevelTileConfig`。

## 11. 下一步

后续另起任务接回 Cocos：

- 将 `levelTiles` 转为现有 Cocos `HulebuLevelTileConfig`。
- 保留当前 Cocos 渲染、点击、槽位和组合按钮逻辑。
- 基于 `ExperienceReport` 调首关窗口、槽位压力和干扰强度。
- 用 Cocos Web Preview 验证桌面和手机视口的读牌压力。
