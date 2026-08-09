# T251：胡了卜正式 UI 资源 Batch A+B

- 任务编号：T251
- 任务名称：胡了卜正式 UI 资源 Batch A+B
- 领取人：Lee
- 状态：已完成
- 领取时间：2026-08-09
- 允许修改文件：`output/hulebu-ui-assets/hulebu-formal-ui-v1/{background,hud,board,actions,tools,master-sources}/**`、该资源包 manifest/validation、`output/hulebu-ui-assets/scripts/build_formal_ui_batch_ab.py`、T248/T249/T251 相关分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档
- 禁止修改：Cocos 工程、卡片/弹窗/麻将牌面正式资源、玩法规则、Web 试玩版、M2 App Flow/存档、横屏、微信小游戏 SDK、PDF、AI 修图和其他游戏模块
- 验证命令：资源构建脚本；PNG/alpha/三态/manifest 校验；预览板人工检查；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`
- 当前阻塞：无
- 下一步：登记 Batch C，生成奖励卡、教学/多候选/暂停/设置/结算弹窗和正式麻将牌面；之后再进入 Cocos 接入批次。
