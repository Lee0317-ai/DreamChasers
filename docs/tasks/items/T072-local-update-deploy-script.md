# T072：本地一键更新部署脚本

- 优先级：P2
- 默认负责人：Codex / 开发 B
- 状态：已完成
- 依赖：T013, T014
- 背景：现有 `deploy/update-deploy.sh` 只能在服务器 `/root/app/dreamchasers` 内执行，用户在本地项目目录执行会因为缺少服务器目录报错。
- 目标：让用户在本地项目根目录执行 `bash deploy/update-deploy.sh` 即可完成打包、上传、远程构建、重启和健康检查。
- 不做：不把服务器密码写入脚本；不修改业务代码；不修改数据库数据；不引入新的部署平台。
- 主要文件范围：`deploy/update-deploy.sh`, `deploy/README.md`, `docs/operations/DEPLOYMENT.md`, `docs/tasks/**`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 验证方式：`bash -n deploy/update-deploy.sh`; `bash deploy/update-deploy.sh`; `curl -I http://47.90.180.92`; `git diff --check`; `npm run docs:sync`
- 当前风险：本地没有 SSH key 时需要按提示输入服务器密码；服务器 Docker 构建耗时取决于云主机性能。
- 下一步：无。
