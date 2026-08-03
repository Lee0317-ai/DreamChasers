# 胡了卜 Cocos UI 架构规格

**对应任务**：T240
**参考草图**：`apps/game/mahjong-roguelike/sketches/004-concept-layered/index.html`
**目标**：把参考概念图的空间秩序和层级感落进 Cocos，而不是继续把功能 HUD 平铺在 Canvas 上。

## 1. 总体布局秩序

Cocos 局内界面分成五层：

1. **顶部秩序层**：游戏名、关卡、当前风场/模式、退出、重开、暂停。
2. **牌桌主体层**：茶桌/牌桌背景，占满顶部与底部之间的剩余空间。
3. **牌桌挂件层**：记牌器、右侧工具按钮、牌河、明牌区等围绕牌堆悬浮。
4. **底部操作层**：组合动作按钮、手牌槽、备用槽。
5. **中心弹层层**：通关提示、奖励三选一、事件选择、Boss 提示、候选组合选择。

核心原则：顶部和底部固定，中间牌桌吃掉剩余空间；记牌器和工具按钮跟牌堆走，不跟屏幕角走。

## 2. 屏幕区域建议

以 390x844 竖屏为基准：

| 区域 | 建议位置 | 说明 |
| --- | --- | --- |
| 顶部秩序层 | y: 14-96 | 名称/关卡/退出操作，不放玩法细节 |
| 中间牌桌层 | y: 106-632 左右 | 由顶部和底部夹出的剩余空间，内部放牌山和挂件 |
| 底部动作栏 | y: 642-690 左右 | `胡 / 杠 / 碰 / 吃 / 补` |
| 手牌槽 | y: 706-822 左右 | 8 格主槽，后续备用槽可贴近主槽上沿或侧边 |
| 中心弹层 | 屏幕中心 | 不挤占牌桌布局，出现时覆盖在所有局内层之上 |

Cocos 中不要再用大量写死全屏绝对坐标。建议在 `GameSceneController` 里先计算：

```text
safeTop = 14
headerHeight = 82
bottomHandHeight = 116
comboHeight = 48
gap = 10
tableTop = safeTop + headerHeight + gap
tableBottom = bottomHandHeight + comboHeight + gap * 3
tableHeight = visibleHeight - tableTop - tableBottom
```

然后牌桌内元素基于 `tableRect` 定位。

## 3. 顶部秩序层

### 内容

- 左侧：退出按钮。
- 中间：`胡了卜` + `第 X 关 · 风场/模式`。
- 右侧：重开、暂停，也可后续放设置。

### Cocos 落点

建议在 `GameSceneController` 新增或整理：

- `TopOrderRoot`
- `ExitButton`
- `TitlePlaque`
- `RestartButton`
- `PauseButton`

如果继续程序化创建节点，至少把 top order 相关创建逻辑从普通 HUD 中拆出，不和 `HudBinder` 的余牌/工具文本混在一起。

## 4. 牌桌主体层

牌桌主体不是一块平面绿色底，而是“茶桌透视容器”。

### 表现要求

- 木质外框。
- 中央深绿桌布。
- 内圈细线或弱纹理。
- 桌面轻微透视：上窄下宽或通过阴影暗示纵深。
- 牌山位于桌面中心偏上，给底部牌河/明牌区留空间。

### Cocos 落点

当前 `GameSceneController` 已有 `VisualShellRoot` 和场景背景加载逻辑。T240 应把它整理成：

- `TableRoot`
- `TableBackgroundArt`
- `BoardRoot`
- `TableAttachmentRoot`

若使用现有背景图 `teahouse_table_background`，也要让牌桌区域按中间剩余空间裁切/适配，而不是简单铺满全屏。

## 5. 牌山层级

参考图最关键的不是牌面资源，而是“上层三张牌压在下面”。

### 表现要求

- 底层牌：更暗、更低饱和、阴影轻。
- 中层牌：正常亮度。
- 顶层牌：尺寸略大、阴影更重、金色边缘/光晕更明显。
- 顶层牌的 zIndex 必须显著高于底层。
- 顶层牌视觉上要真的覆盖下层，不只是逻辑上 `blockedBy`。

### 数据要求

优先消费 T239 产出的层级语义，例如：

```text
layerIndex: 0 | 1 | 2
layerRole: low | mid | top
isKeyTopTile: boolean
```

如果 T239 暂时没有输出这些字段，T240 可在展示层临时从 `stackDepth / zIndex / blockedBy` 推断，但后续必须回归显式语义。

### Cocos 落点

`BoardLayerBinder` 应根据层级调整：

- tile scale
- opacity
- brightness/tint
- shadow offset
- sibling index / zIndex
- top tile glow

不要只靠同一张 SpriteFrame 等比例堆上去。

## 6. 记牌器

记牌器是牌桌挂件，不是屏幕 HUD。

### 位置

- 锚定在牌山左上方。
- 随 `tableRect` 和 `mountainRect` 计算位置。
- 不贴屏幕左上角。

### 内容

第一版保留高价值信息：

- 标题：`记牌器`
- 余牌总数
- 关键牌剩余数
- 高亮当前听口/目标牌

### Cocos 落点

可从 `HudBinder` 中拆出独立 `CounterPanelBinder`，或先在 `GameSceneController` 程序化创建 `CounterPanelRoot`。

建议不要继续使用 `HudBinder.toolLabel` 拼字符串塞 Boss 和工具状态。

## 7. 右侧工具按钮

工具按钮是牌堆右侧挂件。

### 位置

- 锚定牌山右侧中线。
- 垂直三枚：洗牌 / 撤回 / 打牌。
- 不贴屏幕右侧边缘，也不贴底部操作层。

### Cocos 落点

当前工具按钮在 `GameSceneController` 的 `ToolOverlayRoot`。T240 应把定位逻辑改成基于 `tableRect`/`mountainRect`，而不是纯 Canvas 右侧。

## 8. 底部操作层

底部只做动作和手牌，不承担解释文案。

### 组合动作

- `胡 / 杠 / 碰 / 吃 / 补`
- 可用状态发火/高亮。
- 不可用状态低饱和。
- 位置固定在手牌槽上方。

### 手牌槽

- 8 格主槽固定在底部。
- 牌面和牌山使用同一套资源口径。
- 槽背景可使用木托盘视觉。

## 9. 中心弹层层

通关提示、奖励三选一、事件选择、候选组合选择都在屏幕中心，不挤占牌桌结构。

### 原则

- overlay root 位于所有局内层之上。
- 弹层居中，有半透明暗幕或局部光晕。
- 关闭/确认后回到原牌桌布局，不推动任何底层节点。

### Cocos 落点

统一使用或改造现有 `RewardOverlay`：

- `CenterOverlayRoot`
- `RewardChoicePanel`
- `ClearPanel`
- `EventPanel`
- `ComboChoicePanel`

不要每种弹层各自创建不同位置体系。

## 10. 实施顺序

建议分 5 步做，避免一次性把 3000 行 Controller 搅烂：

1. **布局骨架**：新增 top/table/bottom/center overlay 五层根节点和定位 helper。
2. **牌桌挂件**：移动记牌器和工具按钮到牌桌挂件层。
3. **牌山表现**：让低/中/顶层牌有不同 scale/tint/shadow/zIndex。
4. **底部整理**：组合栏和手牌槽固定到底部，不再被牌桌挤压。
5. **中心弹层统一**：奖励、通关、事件、候选组合统一走中心层。

## 11. 当前 blocker

`npm run test -w packages/shared -- mahjong-cocos-project` 当前失败在 T239 相关牌山生成断言：初始可点牌为 5，测试期望大于 6。

T240 正式实现前应先判断：

- 如果 T239 仍在进行，先不动 `HulebuMountainGenerator.ts`。
- 如果 T239 已交接，可先收口初始可点数量测试，再落 UI 表现层。

UI 草图本身不修这个测试，但正式 Cocos 落地验收必须处理它。
