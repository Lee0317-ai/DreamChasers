# T251：胡了卜正式 UI 资源 Batch A+B

- 优先级：P0
- 负责人：Lee
- 状态：已完成
- 依赖：T248 规格；T249 视觉样稿已获 Lee 确认
- 阻塞：无
- 允许修改文件：`output/hulebu-ui-assets/hulebu-formal-ui-v1/background/**`、`output/hulebu-ui-assets/hulebu-formal-ui-v1/hud/**`、`output/hulebu-ui-assets/hulebu-formal-ui-v1/board/**`、`output/hulebu-ui-assets/hulebu-formal-ui-v1/actions/**`、`output/hulebu-ui-assets/hulebu-formal-ui-v1/tools/**`、`output/hulebu-ui-assets/hulebu-formal-ui-v1/master-sources/**`、`output/hulebu-ui-assets/hulebu-formal-ui-v1/manifest.json`、`output/hulebu-ui-assets/hulebu-formal-ui-v1/validation-report.json`、`output/hulebu-ui-assets/scripts/build_formal_ui_batch_ab.py`、T248/T249/T251 任务与领取分片、麻将模块文档、当天进展/完成记录及 `npm run docs:sync` 自动生成主文档
- 禁止修改范围：Cocos 工程、卡片/弹窗/麻将牌面正式资源、玩法规则、Web 试玩版、M2 App Flow/存档、横屏、微信小游戏 SDK、PDF、AI 修图和其他游戏模块
- 验证方式：PNG 尺寸/mode/alpha/边界检查；同组三态尺寸一致检查；manifest 路径与 key 唯一性检查；预览板人工审阅；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`

## 目标

以 T249 已通过样稿作为唯一视觉母版，输出可由 Cocos SpriteFrame 消费的 Batch A+B 正式资源：

1. 一张不含牌山、按钮和文字 HUD 的青绿主场景背景。
2. 关卡牌匾、分数牌匾、余牌计数器、牌河底板和 8 格手槽。
3. 吃、碰、杠、补杠、胡的 normal/active/disabled 三态。
4. 洗牌、撤回、提示、Buff、记牌器的 normal/active/disabled 三态。
5. 完整 manifest、alpha/尺寸校验结果和整包预览板。

## 实现方式

- 背景使用 PPTOKEN 新站 edit 接口，以已通过主场景为参考，移除运行时牌山和控件，保留青绿圆桌、环境装饰与安全区。
- HUD、牌槽和控件从已通过母版按固定坐标裁切，使用边缘连通背景去除算法输出 RGBA 单件资源。
- 同组三态统一到相同画布尺寸和锚点，不重新生成文字或几何边界。

## 不做

- 不接入 Cocos。
- 不生成奖励卡、教学/多候选/结算弹窗和麻将牌面。
- 不把带牌山和控件的整张样稿作为运行时背景。
- 不保存或提交真实 API Key。

## 完成结果

- 通过 PPTOKEN 新站 edit 接口生成干净青绿主场景母版，并裁切为 `780×1688` 的 2x 竖屏背景资源，对应 `390×844` 设计视口。
- 从 T249 已通过母版输出 5 个 HUD/牌槽资源、15 个动作三态资源和 15 个工具三态资源；连同背景共 36 个 manifest 资源。
- 新增可重复构建脚本、主场景组合预览和透明棋盘三态预览。
- `validation-report.json` 状态为 `passed`：36 个唯一 key、全部 RGBA、同组三态画布一致。
- 本批未修改 Cocos 工程；卡片、弹窗和麻将牌面留给下一批。
