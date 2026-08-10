# T259 胡了卜 Cocos 竖屏正式 UI 布局重排

- 优先级：P0
- 负责人：Lee
- 状态：进行中
- 依赖：T258
- 阻塞：无
- 允许修改文件：Cocos 竖屏运行时布局与 Binder、对应共享回归测试、T259 分片、麻将模块文档、当天进展/完成记录及 `npm run docs:sync` 自动生成主文档
- 禁止修改文件：正式图片资源、玩法规则、关卡配置、Web 试玩版、横屏、微信小游戏 SDK、其他工具与游戏模块

## 目标

- 修正 Cocos 高 DPR 画布中内部像素尺寸与 CSS 逻辑尺寸混用造成的整体缩小。
- 在竖屏内明确划分顶部 HUD、牌桌、右侧工具列、动作栏和 8 格手牌槽，消除裁切、压叠和遮挡。
- 保持牌面点击、入槽、组合按钮和工具按钮交互不回归。

## 验收

- 使用 Cocos Creator 实际检查场景和运行时节点。
- `390×844` 标准竖屏与较短竖屏均无 HUD 裁切、动作栏/槽位重叠和横向溢出。
- 牌阵视觉占比明显提高，仍完整位于牌桌安全区内。
- `npm run test -w packages/shared -- mahjong-cocos-project` 通过。
- Cocos TypeScript、production build、浏览器交互与控制台检查通过。
- `npm run docs:sync`、UTF-8 无 BOM和 `git diff --check` 通过。
