# 胡了卜 UI v3 资源包 Cocos 接入手册

**用途**：对应 T287 产出的 component-pack-v3 全量 UI 资源，供其他会话在 Cocos Creator 接入时直接定位文件、建立 SpriteFrame 映射、配置九宫格和验收。
**状态**：资源说明文档。资源尚未接入 Cocos runtime，接入前需按仓库流程领取新任务。
**风格口径**：暖象牙陶瓷 + 薄荷绿厚度 + 珊瑚粉描边，圆润玩具比例，粉色球形胡萝卜吉祥物。所有面板和按钮均不烘焙文字数字，运行时叠加 Label。
**最后更新**：2026-08-17

## 1. 资源包入口

本轮接入只认以下三个目录，其他目录为历史版本或过程稿：

| 类别 | 源路径 | 内容 |
| --- | --- | --- |
| UI 组件 | `output/hulebu-ui-design-v2/component-pack-v3/normalized/` | 63 张透明 PNG，已去背、裁边、统一命名 |
| 全屏背景 | `output/hulebu-ui-design-v2/component-pack-v3/backgrounds/images/` | 5 张 1024x1536 不透明全出血图 |
| 麻将牌面 | `output/hulebu-ui-design-v2/tile-pack-v1/generated-v3/normalized/` | 35 张 1024x1024 透明 PNG（34 正面 + 1 背面） |

缺口组件的机器可读清单：`output/hulebu-ui-design-v2/component-pack-v3/gap-components-manifest.json`（仅 11 张透明缺口组件，非全量）。

预览总览（先看图再复制文件）：

- 全量 UI 盘点：`output/hulebu-ui-design-v2/component-pack-v3/previews/all-ui-inventory.png`
- 缺口组件拼版：`output/hulebu-ui-design-v2/component-pack-v3/previews/gap-components-v3.png`
- 页面级组合预览：同目录下 `page-title-lobby-v3.png`、`page-mode-map-v3.png`、`page-gameplay-v3.png`、`page-result-v3.png`

历史资源包（T181/T182）说明见 `UI_ASSETS_COCOS_INTEGRATION.md`。v3 已覆盖其全部 UI 用途，除非对照旧风格，否则接入时不再使用旧包。

## 2. Cocos 目录与命名建议

不要让 Cocos 工程直接引用 `output/`。接入时复制到：

```text
apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/hulebu/
  component-pack-v3/
    actions/      吃碰杠胡补杠按钮
    buttons/      确认取消关闭返回
    hud/          顶部信息条与计数
    panels/       弹层面板
    cards/        卡牌类
    map/          地图节点与路径
    playfield/    牌槽与牌池
    mascot/       吉祥物与头像框
    misc/         标题横幅、toast、标签、印章、教程框
    tools/        右侧道具按钮
  backgrounds/    5 张全屏背景
  tiles-v3/       35 张麻将牌
```

建议 SpriteFrame key 规则：组件用 `ui.<分组>.<名称>`（如 `ui.buttons.confirm`），牌面用 `tile.<花色>.<序号>`（如 `tile.wan.07`），背景用 `bg.<场景>`（如 `bg.gameplay`）。文件名即 kebab-case 源名，复制时不要改名。

## 3. UI 组件清单（63 张）

以下尺寸为源 PNG 真实像素。标"九宫格"的组件建议在 Cocos 中配置 Slice 后拉伸。

### 动作按钮（5 张）

| 文件 | 尺寸 | 建议 key | 备注 |
| --- | --- | --- | --- |
| action-chi.png | 512x512 | `ui.actions.chi` | 无普通/强调双态，双态需 runtime 叠加或后续补图 |
| action-peng.png | 512x512 | `ui.actions.peng` | 同上 |
| action-gang.png | 512x512 | `ui.actions.gang` | 同上 |
| action-bugang.png | 768x512 | `ui.actions.bugang` | 宽幅版，注意与吃碰杠视觉对齐 |
| action-hu.png | 512x512 | `ui.actions.hu` | 胡按钮底图，可直接作按钮，区别于旧包 callout |

### 通用按钮（4 张）

| 文件 | 尺寸 | 建议 key | 备注 |
| --- | --- | --- | --- |
| btn-confirm.png | 300x130 | `ui.buttons.confirm` | 九宫格；文字运行时叠加 |
| btn-cancel.png | 300x130 | `ui.buttons.cancel` | 九宫格 |
| btn-close.png | 140x140 | `ui.buttons.close` | 图标按钮，等比缩放 |
| btn-back.png | 140x140 | `ui.buttons.back` | 图标按钮 |

### HUD（9 张）

| 文件 | 尺寸 | 建议 key | 备注 |
| --- | --- | --- | --- |
| hud-level.png | 320x120 | `ui.hud.level` | 九宫格 |
| hud-score.png | 320x120 | `ui.hud.score` | 九宫格 |
| hud-remaining.png | 420x120 | `ui.hud.remaining` | 余牌数条，九宫格 |
| hud-boss.png | 680x120 | `ui.hud.boss` | Boss 名条，九宫格 |
| boss-health-bar.png | 860x260 | `ui.hud.bossHp` | 含外框+槽体，血量填充需 runtime 裁切或叠层 |
| counter-panel.png | 900x280 | `ui.hud.counterPanel` | 记牌器面板，九宫格 |
| counter-toggle.png | 320x170 | `ui.hud.counterToggle` | 记牌器开关 |
| currency-plaque.png | 360x120 | `ui.hud.currency` | 货币牌匾，九宫格 |
| star-progress.png | 420x140 | `ui.hud.starProgress` | 星星进度条底 |

### 面板（6 张）

| 文件 | 尺寸 | 建议 key | 备注 |
| --- | --- | --- | --- |
| combo-choice-panel.png | 900x900 | `ui.panels.comboChoice` | 吃碰杠选择弹层，选项运行时生成 |
| discard-rescue-panel.png | 860x640 | `ui.panels.discardRescue` | 弃牌救援弹层，九宫格 |
| pause-panel.png | 560x700 | `ui.panels.pause` | 暂停面板 |
| settings-panel.png | 560x700 | `ui.panels.settings` | 设置面板 |
| result-stats-panel.png | 680x760 | `ui.panels.resultStats` | 结算统计面板 |
| bottom-nav-frame.png | 900x170 | `ui.panels.bottomNav` | 底部导航框，九宫格 |

### 卡牌（5 张）

| 文件 | 尺寸 | 建议 key | 备注 |
| --- | --- | --- | --- |
| archetype-card.png | 340x480 | `ui.cards.archetype` | 流派卡，内容运行时叠加 |
| event-card.png | 340x480 | `ui.cards.event` | 事件卡 |
| reward-card.png | 340x480 | `ui.cards.reward` | 奖励卡 |
| upgrade-card.png | 340x480 | `ui.cards.upgrade` | 升级卡 |
| mode-card.png | 440x300 | `ui.cards.mode` | 模式横卡 |

### 地图（7 张）

| 文件 | 尺寸 | 建议 key | 备注 |
| --- | --- | --- | --- |
| chapter-plaque.png | 520x140 | `ui.map.chapterPlaque` | 章节牌匾，九宫格 |
| level-node.png | 190x190 | `ui.map.levelNode` | 通用关卡节点 |
| node-normal.png | 190x190 | `ui.map.node.normal` | 普通节点 |
| node-event.png | 190x190 | `ui.map.node.event` | 事件节点 |
| node-reward.png | 190x190 | `ui.map.node.reward` | 奖励节点 |
| node-boss.png | 230x230 | `ui.map.node.boss` | Boss 节点，略大突出 |
| path-segment.png | 320x160 | `ui.map.pathSegment` | 路径段，可旋转/平铺 |

### 模式图标（4 张）

| 文件 | 尺寸 | 建议 key |
| --- | --- | --- |
| mode-mainline.png | 280x280 | `ui.modes.mainline` |
| mode-endless.png | 280x280 | `ui.modes.endless` |
| mode-daily.png | 280x280 | `ui.modes.daily` |
| mode-advanced.png | 280x280 | `ui.modes.advanced` |

### 通用图标（3 张）

| 文件 | 尺寸 | 建议 key |
| --- | --- | --- |
| icon-coin.png | 160x160 | `ui.icons.coin` |
| icon-star.png | 160x160 | `ui.icons.star` |
| icon-amulet.png | 160x160 | `ui.icons.amulet` |

### 场内组件（3 张）

| 文件 | 尺寸 | 建议 key | 备注 |
| --- | --- | --- | --- |
| hand-slot.png | 150x220 | `ui.playfield.handSlot` | 单个手牌槽，按槽位平铺 |
| meld-pool-panel.png | 620x250 | `ui.playfield.meldPool` | 副露池底板，九宫格 |
| loose-drop-zone.png | 620x250 | `ui.playfield.looseDropZone` | 散牌放置区，九宫格 |

### 道具按钮（4 张）

| 文件 | 尺寸 | 建议 key |
| --- | --- | --- |
| tool-shuffle.png | 180x180 | `ui.tools.shuffle` |
| tool-undo.png | 180x180 | `ui.tools.undo` |
| tool-vision.png | 180x180 | `ui.tools.vision` |
| tool-discard.png | 180x180 | `ui.tools.discard` |

### 吉祥物（6 张）

| 文件 | 尺寸 | 建议 key | 备注 |
| --- | --- | --- | --- |
| mascot-idle.png | 320x400 | `ui.mascot.idle` | 待机 |
| mascot-happy.png | 320x400 | `ui.mascot.happy` | 开心 |
| mascot-think.png | 320x400 | `ui.mascot.think` | 思考 |
| mascot-failed.png | 320x400 | `ui.mascot.failed` | 失败 |
| mascot-guide.png | 320x400 | `ui.mascot.guide` | 引导 |
| avatar-frame.png | 240x240 | `ui.mascot.avatarFrame` | 头像框，叠在头像上 |

### 杂项（7 张）

| 文件 | 尺寸 | 建议 key | 备注 |
| --- | --- | --- | --- |
| title-brand.png | 760x190 | `ui.misc.titleBrand` | 标题字牌，等比缩放 |
| toast-banner.png | 720x180 | `ui.misc.toast` | 九宫格，文字运行时叠加 |
| tag-reward.png | 240x90 | `ui.misc.tagReward` | 奖励标签，九宫格 |
| tag-risk.png | 240x90 | `ui.misc.tagRisk` | 风险标签，九宫格 |
| victory-seal.png | 280x280 | `ui.misc.victorySeal` | 胜利印章 |
| failure-seal.png | 280x280 | `ui.misc.failureSeal` | 失败印章 |
| tutorial-highlight-frame.png | 520x520 | `ui.misc.tutorialFrame` | 教程高亮框，可九宫格拉伸成矩形 |

分组小计：actions 5 + buttons 4 + hud 9 + panels 6 + cards 5 + map 7 + modes 4 + icons 3 + playfield 3 + tools 4 + mascot 6 + misc 7 = 63。若后续增补组件，以 `normalized/` 目录枚举为唯一事实源。

## 4. 背景清单（5 张）

全部为 1024x1536 竖版全出血图，按设计分辨率 720x1280 或 750x1334 等比铺满使用。

| 文件 | 建议 key | 用途 |
| --- | --- | --- |
| title-lobby.png | `bg.titleLobby` | 标题/大厅 |
| map.png | `bg.map` | 模式地图 |
| gameplay.png | `bg.gameplay` | 对局 |
| result.png | `bg.result` | 结算 |
| loading.png | `bg.loading` | 加载页 |

## 5. 麻将牌面映射（35 张）

全部 1024x1024 透明 PNG，图案居中含立体厚度。源文件名即最终名。

| 花色 | 文件 | 建议 key |
| --- | --- | --- |
| 万 | `wan-01.png` 至 `wan-09.png` | `tile.wan.01` ... `tile.wan.09` |
| 筒 | `tong-01.png` 至 `tong-09.png` | `tile.tong.01` ... `tile.tong.09` |
| 条 | `tiao-01.png` 至 `tiao-09.png` | `tile.tiao.01` ... `tile.tiao.09` |
| 风牌 | `honor-east/south/west/north.png` | `tile.honor.east` 等 |
| 箭牌 | `honor-red/green/white.png` | `tile.honor.red` 等 |
| 背面 | `tile-back.png` | `tile.back` |

牌面在 Cocos 中作为普通 Sprite 使用，不做九宫格。手牌槽 `hand-slot.png` 与牌面分层叠加。

## 6. 接入顺序建议

1. 复制资源到 Cocos 目录，让 Creator 生成 meta 与 SpriteFrame。
2. 先接静态层：背景 5 张 -> 牌面 35 张 -> 手牌槽/牌池。
3. 再接 HUD 与按钮，绑定 Label 叠加位。
4. 再接面板、卡牌、地图节点。
5. 最后接吉祥物、toast、教程框等演出元素。

## 7. 验收检查

- 目录内 PNG 总数：组件 63 + 背景 5 + 牌 35 = 103 张。
- 抽查 `btn-confirm`、`combo-choice-panel`、`tile-back` 三张的透明边与拉伸表现。
- 所有面板按钮无烘焙文字；数值与文案全部来自 runtime Label。
- `boss-health-bar` 血量填充方案（裁切或叠层）已在实现任务中明确。
- 动作按钮单态问题已记录：如需强调态，补图而非拉伸变色。

## 8. 已知边界

- 牌山（牌堆）方案 Lee 已确认暂停，v3 不含牌山资产。`previews/page-gameplay-v3-mountain-*.png` 仅为概念稿，接入时不要使用。
- `images/batch-gap/` 为生成原始稿，`images/rejected/` 为废稿，均不接入。
- 动作按钮只有单态；记牌器内容、Boss 血量数值均为 runtime 叠加。
