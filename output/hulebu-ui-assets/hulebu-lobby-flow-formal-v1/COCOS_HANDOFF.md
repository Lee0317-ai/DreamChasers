# 胡了卜局外流程视觉母稿 Cocos 接入清单

## 1. 接入原则

- `masters/*.png` 是视觉母稿，不是运行时背景。
- 正式接入必须拆成透明 PNG 组件、背景层、图标层、Sprite/Label/Button 节点。
- 运行时保持 `390×844` 设计画布和安全区适配。
- 可伸缩长条、牌匾、卡框和按钮必须提供九宫格边距；圆形徽章、节点和印章使用 `Simple` Sprite。
- 所有文本由 Label 渲染；字体、字号和多语言长度在 Cocos 中验收。

## 2. 建议目录

```text
assets/resources/ui/formal-v1/meta-flow/
  title/
  lobby/
  modes/
  map/
  result/
  common/
```

## 3. SpriteFrame key

### 标题与登录

| Key | 组件 | 状态 |
| --- | --- | --- |
| `meta.title.brandPlaque` | 胡了卜品牌牌匾 | 默认 |
| `meta.title.jadeSeal` | 中央玉印 | 默认 |
| `meta.title.primaryButton` | 游客试玩主按钮框 | normal / pressed / disabled |
| `meta.title.secondaryButton` | 账号类次按钮框 | normal / pressed / disabled |
| `meta.title.saveNotePanel` | 存档说明底板 | 默认 |

### 局外大厅

| Key | 组件 | 状态 |
| --- | --- | --- |
| `meta.lobby.avatarFrame` | 玩家头像框 | 默认 |
| `meta.lobby.currencyPlaque` | 铜钱/体力牌匾 | 默认 |
| `meta.lobby.continuePanel` | 继续本轮主板 | default / active |
| `meta.lobby.progressTrack` | 本轮进度底轨 | 默认 |
| `meta.lobby.entry.main` | 主线入口图标 | normal / notice |
| `meta.lobby.entry.modes` | 模式入口图标 | normal / notice |
| `meta.lobby.entry.collection` | 图鉴入口图标 | normal / claimable |
| `meta.lobby.entry.growth` | 成长入口图标 | normal / affordable |
| `meta.lobby.bottomNav` | 底部导航底板 | 默认 |

### 模式选择

| Key | 组件 | 状态 |
| --- | --- | --- |
| `meta.mode.entryPanel` | 模式入口长卡 | normal / active / locked |
| `meta.mode.mainIcon` | 主线山路徽章 | normal / active |
| `meta.mode.endlessIcon` | 无尽牌环徽章 | normal / active |
| `meta.mode.dailyIcon` | 每日日历徽章 | normal / claimable |
| `meta.mode.advancedIcon` | 高阶四风徽章 | locked / unlocked |
| `meta.mode.collectionIcon` | 图鉴书徽章 | normal / claimable |
| `meta.mode.stateTag` | 右侧状态牌 | normal / active / locked / claimable |

### 主线地图

| Key | 组件 | 状态 |
| --- | --- | --- |
| `meta.map.chapterPlaque` | 章节标题牌匾 | 默认 |
| `meta.map.starProgress` | 章节星级牌匾 | 默认 |
| `meta.map.pathSegment` | 地图路径 | 默认 |
| `meta.map.node.normal` | 普通关节点 | available / completed |
| `meta.map.node.current` | 当前关节点 | active |
| `meta.map.node.locked` | 锁定关节点 | locked |
| `meta.map.node.boss` | Boss 关节点 | locked / available / completed |
| `meta.map.star` | 节点星 | empty / filled |
| `meta.map.chapterSwitch` | 章节切换底栏 | 默认 |

### 结算

| Key | 组件 | 状态 |
| --- | --- | --- |
| `meta.result.seal` | 结算印章 | victory / failure |
| `meta.result.titlePlaque` | 结果标题牌匾 | victory / failure |
| `meta.result.statPlaque` | 三项统计卡 | 默认 |
| `meta.result.suggestionPanel` | 失败建议面板 | 默认 |
| `meta.result.unlockRibbon` | 新解锁横幅 | default / claimable |
| `meta.result.secondaryButton` | 返回类按钮框 | normal / pressed |
| `meta.result.primaryButton` | 下一关/重试按钮框 | normal / pressed / disabled |

## 4. 复用既有 formal-v1

- 教程：`modals/tutorial.png`。
- 暂停：`modals/pause.png`。
- 设置：`modals/settings.png`。
- 结算内容底板参考：`modals/settlement.png`。
- 奖励三选一：`cards/reward-combo.png`、`reward-score.png`、`reward-slot.png`。
- 牌面缩略图：`tiles/mahjong/**`。
- 通用背景：`background/scene-emerald-v1.png`。

## 5. 后续任务边界

1. 先生成/裁切 `common + title + lobby` 透明资源并验收 alpha、锚点和九宫格。
2. 再生成 `modes + map`，由运行时动态组合节点和状态。
3. 最后生成 `result` 双态组件并接入不可变结算摘要。
4. 每批都单独建立任务；不得在一个任务中同时修改所有 Scene 和 Prefab。
