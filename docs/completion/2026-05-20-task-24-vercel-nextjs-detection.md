# T024：修复 Vercel 子目录 Next.js 识别失败完成记录

- 任务编号：T024
- 负责人：Codex / 开发 A
- 完成时间：2026-05-20
- 修改文件：`apps/web/package.json`, `package-lock.json`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`
- 实现内容：在 Web 子应用依赖中补充 `next`、`react`、`react-dom`，让 Vercel Root Directory 设置为 `apps/web` 时可以直接从子目录识别 Next.js 框架和构建输出。
- 验证命令：`npm install --package-lock-only`; `npm run build -w apps/web`
- 验证结果：通过。Prisma Client 生成成功，Next.js 16.2.6 生产构建成功，`/`、`/tools`、`/games` 均完成静态生成。
- 遗留问题：`npm install --package-lock-only` 提示 5 个 moderate vulnerabilities，本次未处理，后续可单独安排依赖安全升级任务。
