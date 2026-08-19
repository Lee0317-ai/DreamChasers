# T291：胡了卜登入页与牌局精灵引导体验

- 任务编号：T291
- 负责人：Lee
- 状态：进行中（静态 UI 接入完成，精灵多帧动画待接入）
- 优先级：P0
- 目标：从登入页开始收口完整 UI 体验，并把粉色球形胡萝卜精灵接入登入页、新手牌局和关键状态气泡。
- 认证边界：微信环境预留 `wx.login → 后端换取会话 → 云端进度恢复`；当前 Cocos Web 预览使用模拟认证适配器，游客试玩保留本地存档。
- 精灵边界：第一轮复用已确认的 idle/guide/think/happy/failed 透明 PNG，通过 Cocos tween 做轻量浮动；后续用 `generate2dsprite` 为每个状态生成独立 2x2 多帧动画表。
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**` 中登入/提示/表现层文件、`assets/resources/ui/hulebu/**` 的精灵与气泡资源映射、相关共享测试、T291 文档分片和模块进展。
- 禁止修改文件：麻将规则、关卡/奖励配置、微信 AppSecret、正式后端密钥、Web Demo 玩法逻辑。
- 验证命令：Cocos 项目测试、登入/大厅/牌局浏览器截图、气泡触发回归、`git diff --check`、exact-commit production build。
- 缺失生图资源：见 `docs/modules/mahjong-roguelike/UI_MISSING_ASSETS_T291.md`。另一个生图会话应优先完成 P0，不重复生成已有 v3 资源。
- 本阶段已接入：`output/hulebu-ui-design-v2/t291-missing-assets/normalized/` 30 张基础图和 `normalized/states/` 17 张状态图已复制到 Cocos `assets/resources/ui/hulebu/t291/`，并由 Creator 生成 `.meta`。
- 本阶段未完成：`mascot-*-sheet.png` 多帧动画尚未生成/接入，当前继续使用 5 张静态精灵状态和轻量 Tween。

## 2026-08-19 生图进展

- 已按 T291 清单生成 30 张 UI 母版，源稿位于 output/hulebu-ui-design-v2/t291-missing-assets/images/raw/，提示词位于 prompts/。
- 已完成软色键去背、暗色背景洪泛清理和固定尺寸标准化，成品位于 normalized/；当前通过 QC 的母版为 30 张。
- 已从登入按钮、吃/碰/杠/补杠/胡动作按钮和洗牌/撤回/看山/弃牌工具按钮派生 17 张 pressed/disabled 状态，位于 normalized/states/。
- 已生成预览：previews/t291-login-flow-preview.png、previews/t291-gameplay-bubble-preview.png、previews/t291-state-assets-preview.png。
- 精灵 2x2 动画尚未在本轮生成，按清单继续走 generate2dsprite；当前仍未接入 Cocos runtime。

## 2026-08-19 Cocos 首页收口

- 正式场景启动优先进入登入页，不再被编辑器样例牌局抢占首屏。
- 游客试玩和微信试玩按钮接入预览认证适配器；游客点击后可进入大厅。
- 大厅主线、各种模式、成就图鉴、局外成长和重玩新手入口继续复用 T291 资源。
- 动态登入/大厅/地图入口绑定 Cocos `Button`，桌面鼠标与移动触摸均使用同一点击路径。
- exact-commit 构建与 verify-only 已通过，当前构建提交为 `5631aeb0cce00622ea2977e04cd74adc9a3d81c6`。
- 遗留：主线地图节点视觉仍需单独做一次 390×844 细节验收；精灵多帧动画仍待 `generate2dsprite` 阶段接入。
