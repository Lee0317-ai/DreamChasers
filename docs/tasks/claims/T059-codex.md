# T059：胡了卜随机牌山调参面板

- 领取人：Codex / 开发 B
- 领取时间：2026-05-25
- 状态：待验收
- 预计完成：2026-05-25
- 允许修改文件：`packages/shared/src/mahjong-config.test.ts`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/docs/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T059-hulebu-mountain-tuning-panel.md`, `docs/tasks/claims/T059-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-25.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T058
- 验证命令：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /private/tmp/hulebu-config-playable-script.js`; 浏览器桌面端检查调参面板和第 20 关密集牌山；浏览器 390px 移动端检查；`npm run docs:sync`; `git diff --check`
- 当前风险：调参面板只服务原型验证，不能让团队误认为这些数值已经是正式平衡；后续正式工程应抽成配置或关卡编辑能力。
- 完成说明：已新增密集牌山调参面板和 URL 参数，生成器可读取随机种子、牌量、同列堆叠深度、`胡` 包数量和字牌权重；已补回归测试覆盖参数进入生成器。
- 备注：本任务不新增正式引擎工程，也不把当前默认参数视为最终平衡。
