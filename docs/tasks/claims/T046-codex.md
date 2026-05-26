# T046：胡了卜验证场景配置草案

- 领取人：Codex / 开发 B
- 领取时间：2026-05-23
- 状态：已完成
- 预计完成：2026-05-23
- 允许修改文件：`apps/game/mahjong-roguelike/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T046-hulebu-validation-configs.md`, `docs/tasks/claims/T046-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `packages/shared/**`, `apps/web/src/components/portal-data.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`
- 依赖任务：T045
- 验证命令：`node -e "for (const f of ['apps/game/mahjong-roguelike/config/tiles.json','apps/game/mahjong-roguelike/config/levels.json','apps/game/mahjong-roguelike/config/rewards.json']) JSON.parse(require('fs').readFileSync(f, 'utf8')); console.log('configs ok')"`; `npm run docs:sync`; `git diff --check`
- 当前风险：配置草案只承接验证场景，不代表最终 20 关数值；后续 Cocos/GDevelop 表现层仍需单独实现加载和渲染。
- 备注：已把 T044 的 5 个 HTML 验证场景沉淀为引擎无关配置。
