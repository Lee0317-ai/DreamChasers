# T249：胡了卜正式 UI 第一版视觉样稿

- 优先级：P0
- 负责人：Lee
- 状态：已完成
- 依赖：T248 设计规格和实施计划已获用户批准
- 阻塞：无
- 允许修改文件：`output/hulebu-ui-assets/hulebu-formal-ui-v1/previews/**`、`docs/tasks/items/T249-hulebu-formal-ui-preview.md`、`docs/tasks/claims/T249-lee.md`、`docs/tasks/NEXT_ID.md`、`docs/tasks/TASK_BOARD.md`、`docs/tasks/CLAIMS.md`、`docs/status/CURRENT_STATUS.md`、`docs/tasks/claims/T248-lee.md`
- 禁止修改范围：Cocos 工程、正式 SpriteFrame、玩法规则、Web 试玩版、M2 App Flow/存档、横屏、微信小游戏 SDK、PDF、AI 修图和其他游戏模块
- 验证方式：主场景与控件状态板人工视觉审阅；PNG 可打开且尺寸正确；无水印、无品牌标识、无博彩/真钱元素；`npm run docs:sync`；`git diff --check`

## 目标

使用用户确认的参考图作为构图和材质基准，先生成两张可审阅样稿：

1. 青绿主场景：固定竖屏、主牌山、顶部 HUD、右侧工具列、底部牌河/手槽和动作栏。
2. 控件状态板：吃、碰、杠、补杠、胡，以及洗牌、撤回、提示、Buff 的普通、按下、禁用状态。

## 不做

- 不把样稿直接导入 Cocos。
- 不批量切出最终透明 PNG。
- 不同时生成四套风场皮肤。
- 不修改运行时代码、Prefab、Scene 或正式资源 manifest。

## 验收标准

- 整体视觉忠实参考图的青绿玉石、暖米色牌面、深木托盘和低饱和金边。
- 主场景信息层级清晰，牌山不被 HUD、工具列或动作栏遮挡。
- 同组控件三态几何尺寸一致，按下态使用暖橙火焰，禁用态降低亮度和饱和度。
- 不出现当前 v6 的零散拼贴感、错位文字或不统一边框。

## 2026-08-09 进展

- 已生成主场景样稿：`output/hulebu-ui-assets/hulebu-formal-ui-v1/previews/formal-ui-scene-v1.png`。
- 已生成动作按钮三态板：`output/hulebu-ui-assets/hulebu-formal-ui-v1/previews/formal-ui-actions-states-v1.png`。
- 工具按钮第一版禁用态误生成金色高亮，未纳入交付；已定向修正并生成 `output/hulebu-ui-assets/hulebu-formal-ui-v1/previews/formal-ui-tools-states-v2.png`。
- 三张候选图均为 `1024×1536` PNG，用于视觉方向审阅；不是最终切图或 Cocos SpriteFrame。
- 当前等待 Lee 确认主场景构图、材质、动作按钮三态和工具按钮三态是否可作为正式资源生成基线。
- 2026-08-09：Lee 已确认“这个版本可以”，三张样稿正式作为后续分层资源生成基线；T249 关闭，正式资源转入 T251。
