·# T014：上线清单和运营手册

- 领取人：Codex / 开发 A
- 领取时间：2026-05-27
- 状态：已完成
- 预计完成：2026-05-27
- 允许修改文件：`docs/operations/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `package.json`, `package-lock.json`, `deploy/**`
- 依赖任务：T001
- 验证命令：文档自审；`git diff --check`; `npm run docs:sync`
- 当前风险：如果把一次性部署命令写成泛化模板，容易遗漏 workspace、锁文件和 Prisma 构建阶段变量等实际坑位。
- 备注：基于 2026-05-27 的真实部署过程整理部署流程文档，已完成状态和收尾同步。
