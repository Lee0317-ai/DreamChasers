# T014 完成记录：上线清单和运营手册

- 完成时间：2026-05-27
- 任务编号：T014
- 负责人：Codex / 开发 A

## 修改文件

- `docs/operations/DEPLOYMENT.md`
- `docs/tasks/items/T014-deployment-runbook.md`
- `docs/tasks/claims/T014-codex.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/2026-05-27.md`

## 实现内容

- 新增完整部署流程文档，记录从拉取最新 `main` 到服务器上线的实际步骤。
- 文档覆盖本地打包、服务器解包、环境变量、Docker 构建、Compose 启动、数据库初始化、Nginx 反代、验证和更新部署。
- 文档补充了本次真实部署踩到的坑：`package-lock.json` 不一致、Dockerfile workspace 复制缺失、Prisma 构建阶段 `DATABASE_URL` 缺失。

## 验证命令

- `git diff --check`
- `npm run docs:sync`

## 验证结果

- 文档已落盘。
- 任务分片和领取分片已创建。
- 后续需要同步主文档摘要区。

## 遗留问题

- 还未执行 `npm run docs:sync` 更新主文档摘要区。
- `docs/status/CURRENT_STATUS.md` 和 `docs/tasks/CLAIMS.md` 仍需同步收尾。
