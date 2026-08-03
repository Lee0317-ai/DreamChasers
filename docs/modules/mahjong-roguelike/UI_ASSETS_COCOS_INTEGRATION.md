# 胡了卜 UI 资产 Cocos 接入说明

**用途**：记录 T181 / T182 产出的 UI、牌面和操作演出资源，供后续 Cocos Creator 接入时直接定位、复制、建立 SpriteFrame 映射和检查风险。
**状态**：资源说明文档，不代表已接入 Cocos runtime。
**最后更新**：2026-06-22

## 1. 资源包入口

当前优先可用资源有两组：

| 资源包 | 路径 | 用途 | 当前口径 |
| --- | --- | --- | --- |
| T181 v6 UI 透明资源包 | `output/hulebu-ui-assets/hulebu-ui-component-pack-v6-source-faithful-transparent-tiles/` | HUD、按钮、右侧工具、槽位、奖励卡、场景皮肤卡、组合选择弹层、34 张透明麻将正面和 1 张背面 | 可作为 Cocos 接入候选资源 |
| T182 v1 操作演出概念包 | `output/hulebu-ui-assets/hulebu-action-fx-character-concept-v1/` | `杠 / 补杠 / 胡` 操作贴图、碰/吃轻贴图、四风场人物 cut-in 占位、演出层级预览 | 贴图可做概念验证；人物 cut-in 只作占位 |

预览图：

- T181 总览：`output/hulebu-ui-assets/hulebu-ui-component-pack-v6-source-faithful-transparent-tiles/preview/contact-sheet.png`
- T181 麻将牌面总览：`output/hulebu-ui-assets/hulebu-ui-component-pack-v6-source-faithful-transparent-tiles/preview/mahjong-tile-contact-sheet.png`
- T182 操作演出概念板：`output/hulebu-ui-assets/hulebu-action-fx-character-concept-v1/preview/action-fx-character-concept-board.png`
- T182 透明贴图预览：`output/hulebu-ui-assets/hulebu-action-fx-character-concept-v1/preview/transparent-sticker-sheet.png`

## 2. Cocos 目录建议

正式接入时，不要让 Cocos runtime 直接读取 `output/`。建议复制到 Cocos 工程的 `resources` 下，让 Cocos 生成 `.meta` 和 SpriteFrame：

```text
apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/hulebu/
  ui-pack-v6/
    hud/
    buttons/
    slots/
    panels/
    cards/
    combo-choice/
    tiles/mahjong/
  action-fx-v1/
    stickers/
    characters/
```

接入前保留 `output/` 作为来源目录；接入后以 Cocos `assets/resources/ui/hulebu/**` 为运行时目录。

## 3. T181 v6 组件清单

### HUD

| 组件 | 源文件 | 建议 key | 用法 |
| --- | --- | --- | --- |
| 关卡牌匾 | `hud/level_badge.png` | `ui.hud.levelBadge` | 顶部关卡、章节、风场显示底 |
| 分数牌匾 | `hud/score_badge.png` | `ui.hud.scoreBadge` | 顶部分数 / 货币数值显示底 |
| 记牌器宽条 | `hud/tile_counter_wide.png` | `ui.hud.tileCounterWide` | 记牌器外框；文本和小牌由 runtime 叠加 |

### 组合按钮

| 动作 | 普通态 | 强调态 | 建议 key |
| --- | --- | --- | --- |
| 吃 | `buttons/combo/action_chi_normal.png` | `buttons/combo/action_chi_fire.png` | `ui.combo.chi.normal` / `ui.combo.chi.fire` |
| 碰 | `buttons/combo/action_peng_normal.png` | `buttons/combo/action_peng_fire.png` | `ui.combo.peng.normal` / `ui.combo.peng.fire` |
| 杠 | `buttons/combo/action_gang_normal.png` | `buttons/combo/action_gang_fire.png` | `ui.combo.gang.normal` / `ui.combo.gang.fire` |
| 补杠 | `buttons/combo/action_bugang_normal.png` | `buttons/combo/action_bugang_fire.png` | `ui.combo.bugang.normal` / `ui.combo.bugang.fire` |

注意：T181 v6 暂无正式 `胡` 操作按钮。`胡` 的运行时按钮不要直接拿 T182 的 `action_hu_callout.png` 当按钮底，那张更适合做爆发贴图。后续如果 Cocos 需要同风格 `胡` 按钮，应单独补一张 `action_hu_normal/fire`。

### 右侧工具按钮

| 工具 | 源文件 | 建议 key |
| --- | --- | --- |
| 洗牌 | `buttons/tools/tool_shuffle.png` | `ui.tool.shuffle` |
| 撤回 | `buttons/tools/tool_undo.png` | `ui.tool.undo` |
| 提示 / 看山 | `buttons/tools/tool_hint.png` | `ui.tool.hint` |
| Buff | `buttons/tools/tool_buff.png` | `ui.tool.buff` |
| 记牌器 | `buttons/tools/tool_counter.png` | `ui.tool.counter` |

### 槽位和面板

| 组件 | 源文件 | 建议 key | 用法 |
| --- | --- | --- | --- |
| 主槽 8 格 | `slots/hand_slots_8.png` | `ui.slot.hand8` | 底部 8 格主槽背景，牌面独立叠加 |
| 弃牌区 | `slots/discard_slots.png` | `ui.slot.discard` | 牌河 / 弃牌区背景 |
| Buff 抽屉面板 | `panels/buff_drawer_panel.png` | `ui.panel.buffDrawer` | 右侧 Buff 列表外框 |
| 组合选择弹层底 | `combo-choice/panel_bg.png` | `ui.comboChoice.panelBg` | Runtime 叠加 3 张或 4 张麻将图片 |

### 奖励卡和场景皮肤卡

| 组件 | 源文件 | 建议 key |
| --- | --- | --- |
| 连消强化奖励卡 | `cards/reward_combo_strength.png` | `ui.reward.comboStrength` |
| 得分加成奖励卡 | `cards/reward_score_bonus.png` | `ui.reward.scoreBonus` |
| 槽位扩展奖励卡 | `cards/reward_slot_expand.png` | `ui.reward.slotExpand` |
| 东风场皮肤卡 | `cards/scene_skin_east_card.png` | `ui.sceneSkin.east` |
| 南风场皮肤卡 | `cards/scene_skin_south_card.png` | `ui.sceneSkin.south` |
| 西风场皮肤卡 | `cards/scene_skin_west_card.png` | `ui.sceneSkin.west` |
| 北风场皮肤卡 | `cards/scene_skin_north_card.png` | `ui.sceneSkin.north` |

奖励卡当前是静态示意图。正式奖励系统若需要动态标题、等级、数值和图标，建议只参考视觉风格，另做可拼装卡框；不要把静态卡内文字当作运行时数据源。

## 4. 透明麻将牌面映射

T181 v6 的麻将牌面是完整透明 PNG，外部画布为 alpha，牌体、奶白牌面和绿色底部都保留。路径：

```text
output/hulebu-ui-assets/hulebu-ui-component-pack-v6-source-faithful-transparent-tiles/tiles/mahjong/
  wan/tile_wan_01.png ... tile_wan_09.png
  bamboo/tile_bamboo_01.png ... tile_bamboo_09.png
  dot/tile_dot_01.png ... tile_dot_09.png
  honor/tile_honor_east.png
  honor/tile_honor_south.png
  honor/tile_honor_west.png
  honor/tile_honor_north.png
  honor/tile_honor_red.png
  honor/tile_honor_green.png
  honor/tile_honor_whiteboard.png
  back/tile_back_default.png
```

Cocos 当前已有 `HulebuTileSpriteCatalog` 使用 `tile.tiao.* / tile.tong.* / tile.wan.* / tile.honor.*` key。后续若换用 v6 完整牌面，建议保持现有逻辑 key 不变，只替换资源路径：

| 逻辑 key | v6 文件 |
| --- | --- |
| `tile.wan.1` - `tile.wan.9` | `tiles/mahjong/wan/tile_wan_01.png` - `tile_wan_09.png` |
| `tile.tiao.1` - `tile.tiao.9` | `tiles/mahjong/bamboo/tile_bamboo_01.png` - `tile_bamboo_09.png` |
| `tile.tong.1` - `tile.tong.9` | `tiles/mahjong/dot/tile_dot_01.png` - `tile_dot_09.png` |
| `tile.honor.1` | `tiles/mahjong/honor/tile_honor_east.png` |
| `tile.honor.2` | `tiles/mahjong/honor/tile_honor_south.png` |
| `tile.honor.3` | `tiles/mahjong/honor/tile_honor_west.png` |
| `tile.honor.4` | `tiles/mahjong/honor/tile_honor_north.png` |
| `tile.honor.5` | `tiles/mahjong/honor/tile_honor_red.png` |
| `tile.honor.6` | `tiles/mahjong/honor/tile_honor_green.png` |
| `tile.honor.7` | `tiles/mahjong/honor/tile_honor_whiteboard.png` |

命名口径：`bamboo` 对应中文 `条`，`dot` 对应中文 `筒`。Cocos 逻辑层继续用 `tiao / tong`，避免影响已有配置和测试。

## 5. T182 操作演出资源

贴图资源：

| 资源 | 源文件 | 建议 key | 用途 |
| --- | --- | --- | --- |
| 杠字贴图 | `stickers/action_gang_callout.png` | `fx.action.gang.callout` | 杠中强演出，约 0.55 秒 |
| 补杠字贴图 | `stickers/action_bugang_callout.png` | `fx.action.bugang.callout` | 补杠升级演出，约 0.45 秒 |
| 胡字贴图 | `stickers/action_hu_callout.png` | `fx.action.hu.callout` | 胡最大演出，约 1.0 - 1.3 秒 |
| 碰/吃轻贴图 | `stickers/action_mini_碰_callout.png`, `stickers/action_mini_吃_callout.png` | `fx.action.peng.mini`, `fx.action.chi.mini` | 轻演出，可选接入 |

人物 cut-in：

| 风场 | 源文件 | 建议 key | 当前口径 |
| --- | --- | --- | --- |
| 东风 | `characters/east_court_lady_cutin.png` | `fx.character.eastCourtLady` | 程序化占位 |
| 南风 | `characters/south_court_lady_cutin.png` | `fx.character.southCourtLady` | 程序化占位 |
| 西风 | `characters/west_court_lady_cutin.png` | `fx.character.westCourtLady` | 程序化占位 |
| 北风 | `characters/north_court_lady_cutin.png` | `fx.character.northCourtLady` | 程序化占位 |

人物 cut-in 目前只表达位置、节奏和气质方向，不应直接进入正式商用包。正式接入前需要替换为生成或手绘的透明立绘，并重新做 alpha 边缘检查。

推荐演出层级：

| 动作 | 强度 | 建议时长 | 人物 cut-in | 说明 |
| --- | --- | --- | --- | --- |
| 吃 / 碰 | light | 250 - 350ms | 否 | 小贴图吸附，不打断连续操作 |
| 杠 | medium | 500 - 650ms | 可选 | 四张牌合拢、金波扫过、轻震屏 |
| 补杠 | medium-light | 400 - 500ms | 可选 | 明碰区升格，贴图小于杠 |
| 胡 | high | 1000 - 1300ms | 是 | 短暂停顿、右侧人物、牌面亮起、胡字贴图 |

## 6. SpriteFrame 加载建议

Cocos 3.x 当前工程已有类似路径：

```ts
resources.load("ui/mahjong-tiles/tiles/refreshed/numbered/wan/wan-01/spriteFrame", SpriteFrame, callback);
```

新 UI 资源可沿用同一口径。复制到 `assets/resources/ui/hulebu/ui-pack-v6/` 后，建议路径形态如下：

```text
ui/hulebu/ui-pack-v6/hud/level_badge/spriteFrame
ui/hulebu/ui-pack-v6/buttons/combo/action_chi_normal/spriteFrame
ui/hulebu/ui-pack-v6/slots/hand_slots_8/spriteFrame
ui/hulebu/ui-pack-v6/tiles/mahjong/wan/tile_wan_01/spriteFrame
ui/hulebu/action-fx-v1/stickers/action_hu_callout/spriteFrame
```

后续可以新增 `HulebuUiSpriteCatalog.ts`，只做 key 到 SpriteFrame path 的映射，不把路径散落在各个 Binder 里。建议初始结构：

```ts
export const HULEBU_UI_SPRITE_PATHS = {
  "ui.hud.levelBadge": "ui/hulebu/ui-pack-v6/hud/level_badge/spriteFrame",
  "ui.combo.chi.normal": "ui/hulebu/ui-pack-v6/buttons/combo/action_chi_normal/spriteFrame",
  "ui.combo.chi.fire": "ui/hulebu/ui-pack-v6/buttons/combo/action_chi_fire/spriteFrame",
  "ui.tool.shuffle": "ui/hulebu/ui-pack-v6/buttons/tools/tool_shuffle/spriteFrame",
  "ui.slot.hand8": "ui/hulebu/ui-pack-v6/slots/hand_slots_8/spriteFrame",
  "fx.action.hu.callout": "ui/hulebu/action-fx-v1/stickers/action_hu_callout/spriteFrame",
} as const;
```

## 7. 导入设置建议

- PNG 必须保持透明 alpha；不要在导入或压缩时补白底。
- HUD、按钮、卡片、贴图先用 `Sprite Type = Simple` 接入，避免九宫格切坏金边和纹理。
- `combo-choice/panel_bg.png`、`slots/hand_slots_8.png`、`slots/discard_slots.png`、`tile_counter_wide.png` 后续可评估 `Sliced`，但必须先在 390x844 竖屏检查边角不变形。
- 早期接入建议使用松散 SpriteFrame，待最终资源确认后再打 SpriteAtlas。优先拆两个 atlas：`hulebu-ui-common` 和 `hulebu-mahjong-tiles`。
- 贴图滤波优先保持 Cocos 默认；如果小牌在移动端发虚，再单独比较双线性和 point/nearest，不要全局改。
- 不要直接把 `preview/`、`source/`、`drafts/`、`alpha-report.json`、`manifest.json` 当运行时资源导入；这些只供人工检查和脚本追溯。

## 8. 接入顺序建议

1. 先接 `tiles/mahjong/` 或保留现有 `refreshed` 牌面，二选一，不要混用两套牌体。
2. 接 `slots/hand_slots_8.png` 和 `slots/discard_slots.png`，确认牌面入槽尺寸和锚点。
3. 接组合按钮普通态和强调态，按钮顺序保持 `胡 / 杠 / 碰 / 吃` 的 runtime 逻辑；T181 只提供 `吃 / 碰 / 杠 / 补杠` 视觉资源。
4. 接右侧工具按钮和顶部 HUD，先保证 390x844 手机竖屏不遮挡牌山和卡槽。
5. 接组合选择弹层：底板用 `combo-choice/panel_bg.png`，候选牌运行时用透明麻将小图叠加。
6. 接奖励卡、Buff 面板和场景皮肤卡。若要动态内容，优先拆成框体 + 文本 + 图标，不直接使用静态卡内文字。
7. 最后接操作演出贴图和人物 cut-in；`胡` 优先做，`杠 / 补杠` 次之，`吃 / 碰` 保持轻量。

## 9. 验收检查

Cocos 接入后至少检查：

- 390x844 手机竖屏：牌山、顶部 HUD、动作栏、主槽、右侧工具不互相遮挡。
- 所有 PNG 角落 alpha 透明，不能出现米色整图背景或绿色毛边。
- `tile.tiao / tile.tong / tile.wan / tile.honor` 逻辑 key 与实际牌面一致。
- 组合按钮 disabled / enabled / fire 状态切换清楚。
- 组合选择弹层使用真实麻将小图，不回退到文字牌名。
- `胡` 演出不遮挡玩家下一步必须点击的牌；第二次以后应允许点击跳过或加速。
- 人物 cut-in 如仍是 T182 程序化占位，只能用于内部验证，不进入发布包。

## 10. 当前风险和待补

- T181 v6 没有正式 `胡` 按钮，需要后续补同风格按钮资源。
- T182 人物 cut-in 不是最终立绘；正式美术需要替换。
- T181 v6 是 output 资源包，尚未进入 Cocos assets，也没有 Cocos `.meta`。
- 静态奖励卡和场景卡包含示意文字，动态系统接入时应拆框体，避免文案写死。
- T175 后路线仍是 Web 完整版优先，Cocos 接入应等 Web 内容和数值进一步冻结后再追平。
