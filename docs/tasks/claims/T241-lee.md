# T241：胡了卜 Cocos 正式游戏 v1 产品与技术重规划

- 任务编号：T241
- 任务名称：胡了卜 Cocos 正式游戏 v1 产品与技术重规划
- 领取人：Lee
- 状态：待验收
- 领取时间：2026-07-10
- 允许修改文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T241-hulebu-cocos-v1-production-design.md`, `docs/tasks/claims/T241-lee.md`, `docs/superpowers/specs/2026-07-10-hulebu-cocos-v1-production-design.md`, `docs/modules/mahjong-roguelike/HULEBU_COCOS_V1_ROADMAP.html`, 以及 `npm run docs:sync` 自动更新的任务主文档摘要区
- 禁止修改：`apps/**`, `packages/**`, 数据库与账号代码、非胡了卜模块；本任务不修改游戏代码
- 验证命令：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]|待[定]|implement l[a]ter|fill in d[e]tails" docs/superpowers/specs/2026-07-10-hulebu-cocos-v1-production-design.md docs/modules/mahjong-roguelike/HULEBU_COCOS_V1_ROADMAP.html docs/tasks/items/T241-hulebu-cocos-v1-production-design.md`; HTML 标签/锚点结构检查；Kimi WebBridge 1440x900 与 390x844 视口检查；`git diff --check`; UTF-8 无 BOM 检查
- 备注：T239/T240 仍有工作区改动；T241 只做规划文档，不触碰两项任务的 Cocos 源码。规划文档已完成并自审，等待 Lee 书面审阅；后续实现必须按新任务重新领取精确文件范围。
