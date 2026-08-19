# 胡了卜 T291 缺失 UI 与精灵动画生图清单

**用途**：供独立生图会话补齐“登入页 → 大厅 → 地图 → 牌局 → 结算”完整体验中仍缺少或正在临时复用的 UI 图片。

**正式风格**：暖象牙陶瓷、薄荷绿厚度、珊瑚粉描边、圆润玩具比例、柔和新中式荷塘背景。精灵是粉色球形胡萝卜，蓝色大眼睛、黑色弯嘴、绿色叶冠、小手小脚。

**现有身份参考**：

- `output/hulebu-ui-design-v2/component-pack-v3/normalized/mascot-idle.png`
- `output/hulebu-ui-design-v2/component-pack-v3/normalized/mascot-guide.png`
- `output/hulebu-ui-design-v2/component-pack-v3/normalized/mascot-think.png`
- `output/hulebu-ui-design-v2/component-pack-v3/normalized/mascot-happy.png`
- `output/hulebu-ui-design-v2/component-pack-v3/normalized/mascot-failed.png`
- 页面视觉参考：`output/hulebu-ui-design-v2/component-pack-v3/previews/page-title-lobby-v3.png`、`page-gameplay-v3.png`、`page-result-v3.png`。

## 1. 全局生产规则

- UI 组件输出透明 RGBA PNG；全屏背景才允许不透明。
- 基础按钮、面板、气泡、标签不烘焙中文、英文、数字或占位符，文字由 Cocos Label 渲染。
- 同一组件的普通、按下、禁用、加载状态必须保持相同画布、锚点、外轮廓和光照。
- 可拉伸面板需要明确九宫格安全边距，角花、描边、阴影不得进入中央拉伸区。
- 精灵动画遵循 `generate2dsprite`：每个动作单独生成，不把多个动作混在一张原始表；4 帧使用 2×2 网格；纯 `#FF00FF` 背景；主体保持在每格中央 60%–70% 安全区；统一中心/底部锚点和缩放。
- 原始生成稿、提示词、标准化结果和预览分别保存，不覆盖现有 v3。

建议新资源目录：

```text
output/hulebu-ui-design-v2/t291-missing-assets/
  images/
  prompts/
  normalized/
  previews/
  manifest.json
```

## 2. P0：登入页资源

当前登入页使用通用确认/取消按钮和 Toast 临时拼装，缺少微信登录语义和登录状态。

| 文件名 | 建议尺寸 | 类型 | 用途与要求 |
| --- | ---: | --- | --- |
| `login-wechat-normal.png` | 640×160 | 透明按钮 | 微信登录主按钮，无文字；左侧预留微信图标区，主体珊瑚粉/薄荷绿体系。 |
| `login-wechat-pressed.png` | 640×160 | 透明按钮 | 与 normal 完全同画布，轻微下压、阴影缩短。 |
| `login-wechat-disabled.png` | 640×160 | 透明按钮 | 登录中/不可用状态，降低饱和度但轮廓清晰。 |
| `login-guest-normal.png` | 640×140 | 透明按钮 | 游客试玩次按钮，无文字，视觉权重低于微信按钮。 |
| `login-guest-pressed.png` | 640×140 | 透明按钮 | 与 normal 同画布。 |
| `login-status-panel.png` | 720×180 | 九宫格面板 | 承载“正在登录 / 同步进度 / 登录失败”文字和重试按钮，不烘焙文案。 |
| `icon-wechat.png` | 160×160 | 透明图标 | 微信登录语义图标，保持项目玩具陶瓷质感；不要包含文字。 |
| `icon-cloud-sync.png` | 160×160 | 透明图标 | 云存档同步状态。 |
| `icon-login-error.png` | 160×160 | 透明图标 | 登录失败/网络失败状态。 |
| `loading-spinner-sheet.png` | 512×512，2×2 | 4 帧 FX | 小型薄荷绿/珊瑚粉加载旋转动画，纯洋红底原始表，透明成品。 |

登入页布局中还需要一个可选的精灵承托组件：

| 文件名 | 建议尺寸 | 类型 | 用途与要求 |
| --- | ---: | --- | --- |
| `mascot-login-pedestal.png` | 420×180 | 透明组件 | 精灵脚下的小型荷叶/云台，只作承托，不烘焙精灵和文字。 |

## 3. P0：精灵多帧动画

现有五张是静态状态图，当前 Cocos 仅做整体上下浮动。需要补成真正多帧动画。

每个动作单独生成原始 2×2 表，四格按左上 → 右上 → 左下 → 右下播放。

| 文件名 | 动作 | 循环 | 画面要求 |
| --- | --- | --- | --- |
| `mascot-idle-sheet.png` | idle | 循环 | 轻呼吸、叶冠小幅摆动、眨眼；脚底位置稳定。 |
| `mascot-guide-sheet.png` | guide | 循环/短播放 | 抬手指向左上方牌面或按钮，身体不横向移动。 |
| `mascot-think-sheet.png` | think | 循环 | 托腮、眼睛轻转、叶冠轻摆；不生成问号文字。 |
| `mascot-happy-sheet.png` | happy | 短播放 | 小跳、双手庆祝、笑眼；身体完整留在格内。 |
| `mascot-failed-sheet.png` | failed | 短播放 | 轻微泄气、低头后重新抬头；不做哭泣文字或大面积特效。 |
| `mascot-excited-sheet.png` | excited | 短播放 | 杠/胡高价值时刻使用，小幅兴奋跳跃，区别于普通 happy。 |

严格保持现有精灵身份：粉色球体、蓝色椭圆眼、黑色弯嘴、绿色叶冠、小手小脚。禁止改成橙色胡萝卜、人形角色、麻将牌精灵或带衣服的角色。

处理参数建议：

```text
asset_type=character
view=3/4
art_style=project-native / clean_hd
sheet=2x2
frames=4
anchor=bottom
scale_strategy=preserve
component_mode=largest
margin=safe
```

先用 idle 建立 scale profile，guide/think/happy/failed/excited 全部复用该 profile。

## 4. P0：精灵气泡资源

当前气泡由 Cocos Graphics 程序绘制，风格和 v3 图片不完全一致；需要独立组件。

| 文件名 | 建议尺寸 | 类型 | 用途与要求 |
| --- | ---: | --- | --- |
| `speech-bubble-left.png` | 720×260 | 九宫格 | 精灵在右侧、气泡尾巴朝右下；牌局主用。 |
| `speech-bubble-right.png` | 720×260 | 九宫格 | 精灵在左侧、气泡尾巴朝左下；适配不同安全区。 |
| `speech-bubble-top.png` | 640×240 | 九宫格 | 精灵在下方、尾巴朝下；登入/大厅使用。 |
| `speech-bubble-warning.png` | 720×260 | 九宫格 | 槽位危险、弃牌救场；珊瑚警示边但不要红色错误弹窗感。 |
| `speech-bubble-success.png` | 720×260 | 九宫格 | 组合完成、通关；薄荷绿成功边。 |

所有气泡内部为高对比暖象牙底，中央留足两行中文区域，不生成示例文字。

## 5. P1：大厅和模式入口专用组件

当前以下入口都临时复用同一张 `mode-card.png`，导致四个入口只有文字不同、识别度不足。

| 文件名 | 建议尺寸 | 类型 | 用途 |
| --- | ---: | --- | --- |
| `lobby-entry-mainline.png` | 440×300 | 透明卡片 | 主线闯关入口，预留运行时标题区。 |
| `lobby-entry-modes.png` | 440×300 | 透明卡片 | 各种模式入口。 |
| `lobby-entry-collection.png` | 440×300 | 透明卡片 | 成就图鉴入口。 |
| `lobby-entry-growth.png` | 440×300 | 透明卡片 | 局外成长入口。 |
| `mode-collection.png` | 280×280 | 透明图标 | 图鉴模式专用图标；当前临时复用星星。 |
| `lobby-continue-panel.png` | 760×170 | 九宫格 | 继续本轮专用横卡，当前临时复用 mode-card。 |

## 6. P1：地图状态组件

当前地图存在语义复用：当前节点使用奖励节点、锁定节点使用通用节点，空星/实星复用同一图标。

| 文件名 | 建议尺寸 | 类型 | 用途 |
| --- | ---: | --- | --- |
| `node-current.png` | 210×210 | 透明节点 | 当前可进入节点，需有明显但不刺眼的光环。 |
| `node-locked.png` | 190×190 | 透明节点 | 锁定节点，无文字/锁形文字。 |
| `star-empty.png` | 120×120 | 透明图标 | 空星。 |
| `star-filled.png` | 120×120 | 透明图标 | 实星。 |
| `chapter-switch-frame.png` | 360×120 | 九宫格 | 章节左右切换框，不复用章节标题牌。 |

## 7. P1：结算专用组件

当前胜利标题、失败标题、失败建议和解锁横幅分别临时复用 Toast 或奖励标签，尺寸与语义不匹配。

| 文件名 | 建议尺寸 | 类型 | 用途 |
| --- | ---: | --- | --- |
| `result-title-victory.png` | 760×190 | 九宫格/透明 | 通关标题牌，无文字。 |
| `result-title-failure.png` | 760×190 | 九宫格/透明 | 失败标题牌，无文字。 |
| `result-suggestion-panel.png` | 720×190 | 九宫格 | 失败建议，两行文字安全区。 |
| `result-unlock-ribbon.png` | 720×150 | 九宫格 | “下一层开启/资源已结算”信息横幅。 |
| `reward-title-panel.png` | 720×160 | 九宫格 | 奖励三选一标题。 |
| `event-title-panel.png` | 720×160 | 九宫格 | 关前事件标题。 |

## 8. P2：按钮交互状态补图

当前动作按钮只有单态，Cocos 通过 tint 表达不可用。最终品质需要状态补图：

- `action-chi-pressed.png`、`action-chi-disabled.png`
- `action-peng-pressed.png`、`action-peng-disabled.png`
- `action-gang-pressed.png`、`action-gang-disabled.png`
- `action-bugang-pressed.png`、`action-bugang-disabled.png`
- `action-hu-pressed.png`、`action-hu-disabled.png`
- `tool-shuffle-disabled.png`、`tool-undo-disabled.png`、`tool-vision-disabled.png`、`tool-discard-disabled.png`

状态图必须从现有 normal 母版编辑派生，不重新生成不同外壳。

## 9. 本轮不需要生成

以下资源已经存在且可用，不要重复生成：

- 5 张全屏背景。
- 35 张麻将牌面和牌背。
- HUD：关卡、分数、余牌、Boss、记牌器、货币、星级。
- 通用确认/取消/关闭/返回按钮的基础态。
- 吃、碰、杠、补杠、胡基础 normal 图。
- 手牌槽、已碰牌池、震落牌区。
- 暂停、设置、组合候选、弃牌救援、结算明细面板。
- 模式主线、无尽、每日、高阶四个图标。
- 吉祥物五张静态状态图。

## 10. 交付验收

- P0 资源必须先完成：登入按钮/状态、6 组精灵动画、5 张气泡。
- 每张资源提供原始图、透明标准化图、提示词和尺寸/alpha 记录。
- 精灵动画提供每帧 PNG、透明 sheet、GIF 和 `pipeline-meta.json`。
- 精灵所有动作不得出现主体缩放漂移、脚底/底部锚点漂移、跨格、裁切或透明残边。
- UI 拼版至少包含登入页和牌局提示两张预览，确认精灵和气泡不遮挡主要交互区。
