# T261：胡了卜 Cocos 八条、牌体底层与动作按钮底色修复

- 任务编号：T261
- 任务名称：胡了卜 Cocos 八条、牌体底层与动作按钮底色修复
- 领取人：Lee
- 状态：已完成
- 领取时间：2026-08-11
- 允许修改文件：formal v1 八条源/运行时资源及必要元数据、`HulebuTileSpriteCatalog`、`BoardLayerBinder.ts`、`ComboBarBinder.ts`、对应共享测试、T261 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档
- 禁止修改文件：玩法规则、关卡配置、存档协议、其他麻将牌资源、Web 试玩版、横屏、微信小游戏 SDK、其他模块
- 验证命令：Cocos `390×844` 场景检查；共享 Cocos 测试；Cocos TypeScript；精确提交 production build；verify-only；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`
- 当前阻塞：无
- 完成时间：2026-08-11
- 完成摘要：恢复已确认的 `W/M` 八条；正式牌面和动作按钮加载成功后清除程序化 fallback；重新裁切透明动作按钮三态；完成 Cocos 实机、共享测试、TypeScript、精确提交构建和 verify-only 验证。
