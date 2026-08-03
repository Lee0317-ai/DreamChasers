# T235 领取记录

- 任务编号：T235
- 任务名称：胡了卜 Cocos 局内布局截图 QA 和修正
- 负责人：Lee
- 领取时间：2026-06-30
- 状态：已完成
- 允许修改：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/tasks/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`
- 禁止修改：`apps/web/**`, 非胡了卜 Cocos 模块、数据库和账号系统、PDF 工具箱、AI 修图工具
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; Cocos Web Mobile 构建和 Playwright 截图检查；`npm run docs:sync`; `git diff --check`
- 备注：`git pull origin main` 因本地与远端分支分叉且未配置 pull 策略失败，本次不强行 merge/rebase。
- 完成记录：2026-06-30 已完成 Cocos 局内布局 QA 和修正，截图验证主牌区、茶室背景、右侧工具和底部槽位进入同一视觉坐标系。
