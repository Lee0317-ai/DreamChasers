# T260：胡了卜 Cocos 锁牌暗态与顶部 HUD 精修

- 任务编号：T260
- 任务名称：胡了卜 Cocos 锁牌暗态与顶部 HUD 精修
- 领取人：Lee
- 状态：已完成
- 领取时间：2026-08-10
- 允许修改文件：Cocos `BoardLayerBinder.ts`、顶部 HUD/记牌器相关 `GameSceneController.ts` 与必要布局 helper、对应共享回归测试、T260 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档
- 禁止修改文件：玩法规则、关卡配置、正式图片原文件、Web 试玩版、横屏、微信小游戏 SDK、其他工具与游戏模块
- 验证命令：Cocos Creator 竖屏检查；共享 Cocos 测试；Cocos TypeScript；精确提交 production build；锁牌点击与顶部 HUD 浏览器视觉检查；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`
- 完成时间：2026-08-11
- 完成结果：锁牌暗态与点击判定已统一；分数和紧凑记牌器改为独立动态值层；`390×844` Cocos 预览已验证暗牌 no-op、亮牌入槽及余牌 `23 -> 22`。
- 验证结果：共享测试 `40/40`、Cocos TypeScript、精确提交 production build、verify-only、5 条 HTTP smoke、UTF-8 无 BOM 与 `git diff --check` 均通过。
- 当前阻塞：无。
- 下一步：T260 已完成，等待 Lee 继续试玩验收整体视觉。
