# T260 领取记录

- 任务编号：T260
- 任务名称：胡了卜 Cocos 锁牌暗态与顶部 HUD 精修
- 领取人：Lee
- 状态：进行中
- 领取时间：2026-08-10
- 允许修改文件：Cocos `BoardLayerBinder.ts`、顶部 HUD/记牌器相关 `GameSceneController.ts` 与必要布局 helper、对应共享回归测试、T260 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档
- 禁止修改文件：玩法规则、关卡配置、正式图片原文件、Web 试玩版、横屏、微信小游戏 SDK、其他工具与游戏模块
- 验证命令：Cocos Creator 竖屏检查；共享 Cocos 测试；Cocos TypeScript；精确提交 production build；锁牌点击与顶部 HUD 浏览器视觉检查；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`
- 当前阻塞：无
- 下一步：定位锁牌子 Sprite 未被可靠变暗、分数多行 Label 和紧凑记牌器长文本的实际渲染链路。
