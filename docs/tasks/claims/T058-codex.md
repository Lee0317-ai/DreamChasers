# T058：胡了卜 20 关节奏骨架和第二 Boss

- 领取人：Codex / 开发 B
- 领取时间：2026-05-25
- 状态：待验收
- 预计完成：2026-05-25
- 允许修改文件：`packages/shared/**`, `apps/game/mahjong-roguelike/config/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/docs/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T058-hulebu-20-level-skeleton.md`, `docs/tasks/claims/T058-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-25.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T057
- 验证命令：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /private/tmp/hulebu-config-playable-script.js`; 浏览器桌面端检查第 20 关配置模式和密集牌山模式；浏览器 390px 移动端检查；`npm run docs:sync`; `git diff --check`
- 当前风险：第 11-20 关本轮只做节奏骨架，不做最终平衡；第 20 关复合目标还需要人工试玩判断是否过硬或过乱。
- 完成说明：已扩展 20 关配置骨架，加入 3/6/9/13/16/19 奖励节点、10/20 Boss 节点和第 20 关 `胡` 复合 Boss 目标；原型目标栏和生成器校验已识别 `hu` 目标；第 20 关密集牌山已补回归测试并支持 `?level=20&mode=mountain` 直达。
- 备注：本任务不新增正式引擎工程，也不把 20 关草案视为最终内容。
