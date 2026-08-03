# T239：胡了卜 Cocos 逐层收拢牌山结构修正

- 优先级：P1
- 默认负责人：Lee
- 状态：进行中
- 依赖：T238
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuMountainGenerator.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/tasks/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`
- 禁止修改范围：`apps/web/**`, 非胡了卜 Cocos 模块、数据库和账号系统、PDF 工具箱、AI 修图工具
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; Cocos Web Mobile 非 debug 构建和 Playwright 截图检查；`npm run docs:sync`; `git diff --check`
- 背景：T238 的 `pyramid` 只是把牌集中成三角轮廓，层级仍按模板点循环铺开，实际观感像平面堆叠，不像目标图中底层宽、上层逐级收拢的麻将牌山。
- 目标：
  - 将 `pyramid` 改成逐层收拢模板，每一层有独立 footprint。
  - 底层更宽，上层更窄且视觉上略微上移，形成真实牌山坡度。
  - 保持遮挡关系来自生成器本身，不在渲染层硬挪牌。
- 不做：不改组合规则、不改奖励和经济、不替换牌面资源、不扩展到其他关卡模板。

## 进展记录

### 2026-07-01 文档续写

- 已确认问题根因：T238 的 `pyramid` 观感虽然集中成三角形，但旧生成方式仍是模板点循环加层号，层级不是几何结构上的逐层收拢，因此会像平面牌堆反复叠点。
- 当前修正方向：`pyramid` 不再复用通用 looped template path，而是走专用 `createLayeredPyramidNodes()`；底层、中层、顶层分别生成自己的 footprint，层数越高，列数和横向跨度越小，整体 y 方向略上移。
- 验收重点：
  - 至少有 3 层真实 layer，且每层节点带 `layer-<n>` 标签。
  - 底层横向跨度明显大于顶层，顶层不能与底层使用同一批循环点位。
  - 上层节点应真实覆盖下层节点并写入 `blockedBy`，遮挡关系来自生成器计算。
  - Cocos 局内截图中首局牌山应呈现“底宽、中收、顶窄”的坡面，而不是一团随机重叠牌。
- 并发备注：来源线程 `019f13f0-0881-75e0-9f77-2b0fcfaf3721` 仍显示 active/inProgress，本次只续写文档，不继续改 `HulebuMountainGenerator.ts`，避免和原线程并发覆盖同一代码文件。

## 建议补充测试

- 在 `packages/shared/src/mahjong-cocos-project.test.ts` 针对 `createLayeredPyramidNodes()` 的产物增加结构断言：
  - `pyramid` 的 layer 数量不少于 3。
  - layer 0 的 x span 大于最高层 x span。
  - 最高层平均 y 值高于底层平均 y 值。
  - 至少一部分低层节点存在 `blockedBy`，且 blocker 来自更高层。
- 保留一条静态扫描，避免 `pyramid` 回退到 `createLoopedTemplateNodes()` 的 cursor/cycle 轮转写法。

### 2026-07-04 Codex 接手遗留修复

- 本次接手范围追加两个实际落点：
  - `BoardLayerBinder.ts`：修复被压牌灰化后仍可能沿用复用节点旧点击事件的问题。
  - `HulebuLevelConfig.ts`：收紧 `enforceCocosInitialFreeMaximum()`，继续用同位置上层覆盖来压低首轮可点数，并避免补盖逻辑冒出当前最大层边界。
- 验收目标追加：
  - 被压牌节点即使残留旧 Button/触摸事件，也不能把旧 tileId 送入 controller。
  - 首关初始可点保持 5-6 张。
  - free 上限修正不能通过把目标牌自身挪位、挪到新高层来完成。

### 2026-07-05 点击错位回归修复

- 已复现 Lee 反馈的“点一张牌却出现另一张牌”：上一轮使用 `UITransform.getBoundingBoxToWorld()` 计算命中框，但 web-mobile 发布包里的 world rect 与 `EventTouch.getUILocation()` 不同口径，导致视觉位置、命中框和 tileId 错位。
- `BoardLayerBinder.ts` 已收口为 BoardRoot 统一 `TOUCH_END` + `getTileEventRect()`：从 `HulebuBoardNodeModel.position` 直接换算到触摸事件 UI 坐标。该阶段先按更高层 5% 覆盖率拒绝被压牌，最终已在下节收紧为 `0.001` 顶层-only。
- 验证补充：Playwright 手机视口早期实测 `graph_ring_node-005 / tile.tiao.1`、`graph_ring_node-015 / tile.tong.3`、`graph_ring_node-030 / tile.tong.5` 三张代表牌，点击后主槽中的 `tileId / prefabKey` 均与点击目标一致；最终模板已切到 `long-wall`，灰化被压牌直接点击入口仍保持 no-op。
- 后续禁止把牌山 hit-test 改回 `getBoundingBoxToWorld()`；若调整视觉锚点或牌山坐标，必须同步跑代表点击一致性检查。

### 2026-07-05 顶层-only 规则收紧

- 最新验收口径改为“只允许最上面的牌可点”：只要有更高层牌对当前牌产生实际覆盖，当前牌就必须灰化且不可点击，不再保留 5% 容差。
- 已将 Cocos blocker 生成、运行时交互刷新和 BoardRoot hit-test 的覆盖阈值统一收紧到 `0.001`。
- 被压牌 Sprite 增加灰色 tint，避免只靠透明度造成“看起来仍像可点亮牌”。
- 系统 Chrome 手机视口验收通过：首关 30 张、6 张亮牌、24 张灰牌，覆盖规则 0 违例；灰牌点击不入槽，亮牌点击入槽 tileId/prefabKey 一致。
