# 任务领取与冲突登记

**最后更新**：2026-05-20  
**用途**：记录谁正在做什么，锁定文件范围，避免两个人和各自 AI 冲突。

## 1. 领取规则

领取任务前必须：

1. 读取 `docs/tasks/TASK_BOARD.md`。
2. 读取 `docs/tasks/CHANGE_INTAKE.md`。
3. 确认任务状态是 `待领取` 或负责人同意接手。
4. 在本文档新增领取记录。
5. 在 `docs/status/CURRENT_STATUS.md` 更新当前任务。
6. 只修改领取记录中的文件范围。

如果这是一个新想法或需求变更，必须先在 `docs/tasks/CHANGE_INTAKE.md` 登记并进入 `docs/tasks/TASK_BOARD.md`，不要直接领取临时口头任务。

## 2. 当前领取

### T019：优化首页门户视觉与信息架构

- 领取人：Codex / 开发 A
- 领取时间：2026-05-20
- 状态：进行中
- 预计完成：2026-05-20
- 允许修改文件：`apps/web/src/app/page.tsx`, `apps/web/src/app/globals.css`, `apps/web/src/components/AppHeader.tsx`, `apps/web/src/components/AppFooter.tsx`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/progress/2026-05-20.md`, `docs/completion/2026-05-20-task-19-homepage-optimization.md`
- 禁止修改文件：`packages/**`, `apps/game/**`, `docker-compose.yml`, `apps/web/prisma/**`, `apps/web/src/lib/**`
- 依赖任务：T002
- 验证命令：`npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`
- 当前风险：首页信息增多后需要控制首屏密度和移动端换行。
- 备注：在已完成 Web 应用基础上进行首页门户优化。

领取后按此格式添加：

```md
### TXXX：任务名称

- 领取人：
- 领取时间：
- 状态：进行中
- 预计完成：
- 允许修改文件：
- 禁止修改文件：
- 依赖任务：
- 验证命令：
- 当前风险：
- 备注：
```

## 3. 冲突登记

暂无。

发生冲突时按此格式添加：

```md
### 冲突：简短说明

- 时间：
- 涉及任务：
- 涉及人员：
- 冲突文件：
- 当前状态：
- 处理方案：
- 谁先改：
- 谁后改：
- 是否已解决：
```

## 4. 交接记录

暂无。

任务从一个人交给另一个人时按此格式添加：

```md
### TXXX 交接

- 原负责人：
- 新负责人：
- 交接时间：
- 已完成：
- 未完成：
- 风险：
- 新负责人需要先读：
```

## 5. 领取历史

### T001：创建 Monorepo 外壳

- 领取人：Codex / 开发 A
- 领取时间：2026-05-20
- 状态：已完成
- 预计完成：2026-05-20
- 允许修改文件：`package.json`, `package-lock.json`, `tsconfig.base.json`, `.env.example`, `apps/**`, `packages/**`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/progress/2026-05-20.md`, `docs/completion/2026-05-20-task-1-monorepo-shell.md`
- 禁止修改文件：`apps/web/**` 中除 `.gitkeep` 以外的内容, `docker-compose.yml`, `README.md`, `.gitignore`
- 依赖任务：无
- 验证命令：`npm install`; `npm run test`
- 当前风险：无。
- 备注：已创建根 npm workspaces 配置、基础 TypeScript 配置、环境变量样例和空目录骨架。

### T018：建立 Git 忽略规则和协作入口

- 领取人：Codex / 开发 A
- 领取时间：2026-05-19
- 状态：已完成
- 预计完成：2026-05-19
- 允许修改文件：`.gitignore`, `README.md`, `.claude/settings.local.json`, `.obsidian/workspace.json`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-19.md`, `docs/completion/2026-05-19-task-18-gitignore-collaboration.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `tsconfig.base.json`
- 依赖任务：无
- 验证命令：`git status --porcelain=v1 -uall`; `git check-ignore`; UTF-8 无 BOM 检查
- 当前风险：无。
- 备注：已执行 `git rm --cached .claude/settings.local.json .obsidian/workspace.json`，本地文件保留，仓库提交后将停止跟踪这两个本地状态文件。

### T002：搭建 Web 应用

- 领取人：Codex / 开发 A
- 领取时间：2026-05-20
- 状态：已完成
- 预计完成：2026-05-20
- 允许修改文件：`apps/web/**`, `package-lock.json`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/progress/2026-05-20.md`, `docs/completion/2026-05-20-task-2-web-app.md`
- 禁止修改文件：`packages/**`, `apps/game/**`, `docker-compose.yml`
- 依赖任务：T001
- 验证命令：`npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`
- 当前风险：Next.js 首次安装会引入依赖和锁文件变更，需要确认构建可通过。
- 备注：在已完成 Monorepo 外壳基础上创建最小可访问 Web 应用。
