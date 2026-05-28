# 胡了卜牌山生成器地基设计

**日期**：2026-05-28  
**状态**：待评审  
**对应任务**：T079  
**范围**：只设计底层生成器地基，不修改 Cocos 表现层。

## 1. 背景

胡了卜当前 Cocos 牌山已经具备多层、铺开、跨列遮挡、5% 覆盖不可点和 42-60 张随机牌山。但当前生成器的主链路仍是：

`随机生成堆叠柱 -> 从顶层到下层展开位置 -> 每 3 张分配同一牌面 -> 按矩形重叠计算 blockedBy`

这条链路可以生成“看起来有层”的牌山，但不真正理解玩家如何一步步解开牌山。它缺少三件事：

- 牌山骨架的关卡设计意图。
- 理论可解路径。
- 难度评分和失败原因解释。

因此它容易出现两种偏差：要么三张同牌暴露得太早，导致太简单；要么牌面和解锁顺序没有设计感，导致体验像随机堆料。

## 2. 目标

建立一个引擎无关的 Graph-based Generator 地基，后续由 Cocos、HTML 原型或 GDevelop 消费同一份生成结果。

目标包括：

- 用图结构表达牌山骨架：每张牌的位置、层级、尺寸、遮挡关系和模板来源。
- 在骨架上生成理论解法路径：每一步拿哪些牌、触发什么组合、释放哪些后续牌。
- 沿解法路径分配麻将牌面：支持 `碰 / 吃 / 杠 / 胡`，并插入诱导牌和干扰牌。
- 生成难度报告：初始窗口、平均窗口、最高槽位压力、关键牌埋深、可解路径长度、风险分支数量。
- 保留随机性，但把随机性放在模板扰动、牌面洗牌和干扰牌强度上，而不是让随机柱子单独决定整局。

## 3. 非目标

- 不在本任务修改 Cocos 场景、Binder、Prefab、资源、动画或点击链路。
- 不把当前 Cocos 关卡立刻切到新生成器。
- 不做完整最优解搜索。
- 不保证玩家任意选择都能通关。
- 不做完整麻将番型和听牌算法。
- 不做最终关卡数值平衡。

## 4. 核心模型

### 4.1 MountainSkeleton

`MountainSkeleton` 是牌山空间骨架，只描述“哪里有牌”和“谁压谁”，不关心牌面。

字段建议：

- `nodes`：所有牌位。
- `edges`：遮挡边，`blocker -> blocked`。
- `templateId`：骨架模板来源。
- `seed`：生成种子。
- `bounds`：坐标范围。
- `metrics`：牌量、层数、初始窗口等骨架指标。

单张牌位 `MountainNode` 应包含：

- `id`
- `x`
- `y`
- `layer`
- `width`
- `height`
- `blockedBy`
- `blocks`
- `tags`

`tags` 用于标记 `center`, `wing`, `tower`, `bridge`, `decoy`, `key-path` 等关卡语义。

### 4.2 SkeletonTemplate

模板负责让牌山“像羊了个羊”，而不是像随机柱子集合。

第一批模板建议：

- `center-tower`：中心高塔，两侧少量辅堆。
- `two-wings`：左右翼展开，中间深层关键牌。
- `cross-bridge`：十字桥结构，横纵交错遮挡。
- `islands`：多个小岛，窗口看似多但组合分散。

模板必须支持随机扰动：

- `jitter`
- `extraColumns`
- `depthVariance`
- `crossCoverRate`
- `initialFreeTileRange`

### 4.3 SolutionTrace

`SolutionTrace` 是理论通关路径。它不是玩家提示，而是生成器自检和难度评分的依据。

每一步 `SolutionStep` 包含：

- `stepIndex`
- `comboType`: `peng | chi | gang | hu`
- `nodeIds`
- `slotBefore`
- `slotAfter`
- `unlockedNodeIds`
- `riskNote`

解法路径的作用：

- 保证至少存在一条可通路径。
- 控制关键组合何时出现。
- 控制槽位压力峰值。
- 让难度来自“先拿哪张”，不是来自纯死局。

### 4.4 FaceAssignment

`FaceAssignment` 把麻将牌面分配给骨架节点。

基本策略：

- 先给解法路径分配主组合包。
- 再给路径附近插入诱导牌。
- 最后给非关键节点填充干扰牌。

组合包类型：

- `pengPack`：三张相同。
- `chiPack`：同花色连续三张。
- `gangPack`：四张相同，其中三张可先形成碰，第四张制造取舍。
- `huPack`：8 张组成 `3 + 3 + 2`。
- `decoyPack`：看似有用但短期会占槽的牌。

### 4.5 DifficultyReport

难度报告用于调参和验收。

第一版指标：

- `tileCount`
- `maxLayer`
- `initialFreeCount`
- `averageFreeCount`
- `minFreeCount`
- `solutionStepCount`
- `maxSlotPressure`
- `earlyAutoClearCount`
- `decoyCount`
- `keyTileAverageDepth`
- `riskBranchCount`
- `score`
- `grade`: `easy | normal | hard | extreme`

## 5. 生成流程

推荐主流程：

1. 根据 `GeneratorConfig` 选择模板。
2. 模板生成基础节点和层级。
3. 扰动坐标、局部加深、制造跨列遮挡。
4. 计算 `blockedBy` 和初始窗口。
5. 在骨架上反推或构造理论解法路径。
6. 沿解法路径分配组合包牌面。
7. 插入诱导牌和干扰牌。
8. 运行模拟器验证理论路径。
9. 输出难度报告。
10. 若报告不符合目标区间，换种子或降低扰动重试。

## 6. 配置口径

示例配置：

```ts
export interface MountainGeneratorConfig {
  mode: "template-random" | "full-random" | "template-fixed";
  templateId: "center-tower" | "two-wings" | "cross-bridge" | "islands";
  seed: string;
  tileCount: number;
  maxLayer: number;
  initialFreeRange: [number, number];
  randomness: number;
  crossCoverRate: number;
  stackColumnRate: number;
  comboMix: {
    peng: number;
    chi: number;
    gang: number;
    hu: number;
  };
  decoyRate: number;
  targetDifficulty: "easy" | "normal" | "hard" | "extreme";
  deadlockPolicy: "must-have-solution" | "allow-risky-branches";
}
```

当前推荐默认：

```ts
const defaultConfig: MountainGeneratorConfig = {
  mode: "template-random",
  templateId: "center-tower",
  seed: "hulebu-foundation-001",
  tileCount: 48,
  maxLayer: 6,
  initialFreeRange: [6, 12],
  randomness: 0.35,
  crossCoverRate: 0.35,
  stackColumnRate: 0.45,
  comboMix: {
    peng: 0.45,
    chi: 0.3,
    gang: 0.15,
    hu: 0.1,
  },
  decoyRate: 0.18,
  targetDifficulty: "normal",
  deadlockPolicy: "must-have-solution",
};
```

## 7. 与现有 Cocos 的关系

Cocos 当前不需要改。

后续新生成器应输出与现有 `HulebuLevelTileConfig` 兼容的数据：

- `id`
- `suit`
- `rank`
- `x`
- `y`
- `layer`
- `blockedBy`
- `location`

Cocos 只消费结果，不参与生成。这样 Cocos 仍然负责：

- 渲染牌山。
- 判断当前 `blockedBy` 是否仍在 board。
- 点击入槽。
- 刷新 HUD、槽位和组合按钮。

生成器负责：

- 生成可玩牌山。
- 解释难度。
- 给后续关卡调参提供指标。

## 8. 验收标准

设计层验收：

- 能清楚解释为什么旧随机柱方案不够。
- 能定义后续共享模块的核心类型。
- 能说明随机性如何保留，但不再作为生成主脑。
- 能说明如何保证至少一条理论可解路径。
- 能说明 Cocos 为什么暂时不需要改。

实现层验收留给后续任务：

- 共享模块能生成至少 2 个模板牌山。
- 每个生成结果都有 `SolutionTrace` 和 `DifficultyReport`。
- 测试能证明理论路径可走通。
- 测试能证明初始窗口、槽位压力和难度评分落在配置范围内。
