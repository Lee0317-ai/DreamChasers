# 胡了卜游戏配置草案

本目录用于沉淀 `胡了卜` 的正式游戏工程资料。当前阶段已经包含引擎无关配置、HTML 试玩原型、Cocos/GDevelop 表现层桥接文档、Cocos 场景骨架说明和 Cocos Creator 3.8.8 工程壳。

## 文件说明

- `config/tiles.json`：基础牌、花色、点数和组合类型定义。
- `config/levels.json`：20 个 MVP 骨架关卡，前 5 个来自 HTML 验证原型，后 15 个用于主线内容调试。
- `config/rewards.json`：10 个局内奖励草案，effect 类型与 `packages/shared/src/mahjong-game.ts` 对齐。
- `docs/content-plan.md`：MVP 关卡曲线和奖励路线说明。
- `docs/tile-mountain-generator.md`：密集牌山生成器原型说明。
- `docs/formal-presentation-bridge.md`：Cocos/GDevelop 正式表现层承接说明。
- `cocos/README.md`：Cocos 场景骨架、节点结构和脚本分工。
- `cocos/scene-binding.md`：Cocos 场景节点和资源 key 绑定清单。
- `cocos/scripts/README.md`：后续 Cocos 组件脚本的边界说明。
- `cocos/hulebu-cocos-3.8.8/`：Cocos Creator 3.8.8 工程壳，可在 Cocos Dashboard 中添加/打开。
- `prototypes/config-playable/index.html`：配置驱动试玩原型，用于验证 20 关配置的表现层加载、基础操作和密集牌山生成手感。

## 当前边界

- 配置目标是承接 T044 验证原型、T045 规则模型和 T047 MVP 内容草案。
- 关卡坐标沿用 HTML demo 的 620px 宽基准坐标，后续表现层可自行缩放。
- 配置驱动试玩原型已有 `配置关卡 / 密集牌山` 两种模式；前者用于校验手写配置，后者用于验证牌山生成密度、遮挡和解锁节奏。
- 第 6/10/12/16/20 关已通过 `featuredCombos` 标记 `胡`，试玩页会展示“本关重点”，密集牌山模式会优先生成一个可胡的 8 张组合包。
- 第 3/6/9/13/16/19 关作为奖励节点，第 10/20 关作为 Boss 节点；第 20 关 Boss 已加入 `胡` 复合目标。
- 试玩页支持调试深链接，例如 `prototypes/config-playable/index.html?level=20&mode=mountain` 可直接打开第 20 关密集牌山。
- 密集牌山生成器仍属于 HTML 原型层，不代表最终 Cocos/GDevelop 工程结构和美术效果。
- 正式表现层桥接已通过 `packages/shared/src/mahjong-presentation.ts` 输出牌山、槽位、备用槽、组合按钮、余牌和 HUD 快照，供后续 Cocos/GDevelop 消费。
- Cocos 场景骨架已通过 `packages/shared/src/mahjong-cocos-scene.ts` 输出 Cocos 友好的节点、控件和 HUD 视图模型，当前不依赖 Cocos Creator 编辑器运行。
- Cocos Creator 3.8.8 工程壳已建立在 `cocos/hulebu-cocos-3.8.8/`，包含 `empty-2d` 风格结构、首场景脚本边界、配置导入占位和打开说明；真实 `.scene` 仍建议由 Creator 编辑器生成和维护。
- 本目录暂不包含最终美术、已绑定完成的 Cocos 场景、GDevelop 工程或 Web 导出产物。
- 后续正式 MVP 可在这 20 个骨架关卡基础上继续调参，并扩展奖励池与美术表现。
