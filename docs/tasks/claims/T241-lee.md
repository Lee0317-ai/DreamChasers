# T241：胡了卜 Cocos 正式游戏 v1 产品与技术重规划

- 任务编号：T241
- 任务名称：胡了卜 Cocos 正式游戏 v1 产品与技术重规划
- 领取人：Lee
- 状态：已完成
- 领取时间：2026-07-10
- 允许修改文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T241-hulebu-cocos-v1-production-design.md`, `docs/tasks/claims/T241-lee.md`, `docs/superpowers/specs/2026-07-10-hulebu-cocos-v1-production-design.md`, `docs/modules/mahjong-roguelike/HULEBU_COCOS_V1_ROADMAP.html`, 以及 `npm run docs:sync` 自动更新的任务主文档摘要区
- 禁止修改：`apps/**`, `packages/**`, 数据库与账号代码、非胡了卜模块；本任务不修改游戏代码
- 验证命令：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]|待[定]|implement l[a]ter|fill in d[e]tails" docs/superpowers/specs/2026-07-10-hulebu-cocos-v1-production-design.md docs/modules/mahjong-roguelike/HULEBU_COCOS_V1_ROADMAP.html docs/tasks/items/T241-hulebu-cocos-v1-production-design.md`; HTML 标签/锚点结构检查；Kimi WebBridge 1440x900 与 390x844 视口检查；`git diff --check`; UTF-8 无 BOM 检查
- 备注：T239/T240 仍有工作区改动；T241 只做规划文档，没有触碰两项任务的 Cocos 源码。2026-07-11 Lee 确认开始实施，T241 通过验收，后续实现由 T242 起按独立任务领取。
- 完成记录：`docs/completion/2026-07-11-task-241-hulebu-cocos-v1-production-design.md`
