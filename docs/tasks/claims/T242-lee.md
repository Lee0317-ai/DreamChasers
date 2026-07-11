# T242：胡了卜 Cocos v1 M0 production build 基线

- 任务编号：T242
- 任务名称：胡了卜 Cocos v1 M0 production build 基线
- 领取人：Lee
- 状态：进行中
- 领取时间：2026-07-11
- 允许修改文件：`apps/game/mahjong-roguelike/release/hulebu-v1.release.json`, `apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs`, `apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/README.md`, `apps/game/mahjong-roguelike/prototypes/config-playable/LEGACY.md`, `apps/web/public/games/hulebu-demo/LEGACY.md`, `packages/shared/src/hulebu-cocos-release.test.ts`, `package.json`, `docs/superpowers/plans/2026-07-11-hulebu-cocos-v1-m0-production-baseline.md`, `docs/tasks/items/T242-hulebu-cocos-v1-m0-production-baseline.md`, `docs/tasks/claims/T242-lee.md`, `docs/progress/2026-07-11-lee.md`, `docs/completion/2026-07-11-task-242-hulebu-cocos-v1-m0-production-baseline.md`, 以及 `npm run docs:sync` 自动更新的任务主文档摘要区
- 禁止修改：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/**`, Cocos `settings/**`, `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`, `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`, `apps/web/prisma/**`, 账号 API、非胡了卜模块
- 验证命令：`npm run test -w packages/shared -- hulebu-cocos-release mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run game:hulebu:build`; `npm run docs:sync`; `git diff --check`
- 备注：`git pull origin main` 仍因分支分叉且未配置策略失败；为保留当前未提交 Cocos 基线，本任务在现有专用分支原地执行，只新增发布基础设施，不修改 T239/T240 的 Cocos 源码。
