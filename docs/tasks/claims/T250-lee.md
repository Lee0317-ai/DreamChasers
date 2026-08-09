# T250：PPTOKEN 图片生成切换新站

- 任务编号：T250
- 任务名称：PPTOKEN 图片生成切换新站
- 领取人：Lee
- 状态：已完成
- 领取时间：2026-08-09
- 允许修改文件：`.env.example`、`apps/web/src/lib/ai/__tests__/provider-readiness.test.ts`、`docs/tasks/CHANGE_INTAKE.md`、`docs/tasks/NEXT_ID.md`、`docs/tasks/items/T250-pptoken-new-site-migration.md`、`docs/tasks/claims/T250-lee.md`、`docs/progress/2026-08-09-lee.md`、`docs/completion/2026-08-09-task-250-pptoken-new-site-migration.md` 及 `npm run docs:sync` 自动生成的主文档
- 禁止修改：真实 API Key、本地 `.env`、图片 provider 业务逻辑、AI 修图工作流、Cocos 工程、正式 UI 资源和历史事实记录
- 验证命令：`npm run test -w apps/web -- provider-readiness`；旧域名残留扫描；`npm run docs:sync`；UTF-8 无 BOM 检查；`git diff --check`
- 当前阻塞：无
- 下一步：后续图片生成统一通过更新后的 `pptoken-imagegen` 技能执行；需要网页代理时显式使用 `--transport proxy`。
