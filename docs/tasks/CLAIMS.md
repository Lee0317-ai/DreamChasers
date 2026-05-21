# 任务领取与冲突登记

**最后更新**：2026-05-21
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

### T025：拆分独立工具站和游戏站入口体验

- 领取人：Codex / 开发 A
- 领取时间：2026-05-21
- 状态：已完成
- 预计完成：2026-05-21
- 允许修改文件：`apps/web/src/app/**`, `apps/web/src/components/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**`
- 禁止修改文件：`packages/**`, `apps/game/**`, `apps/web/prisma/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：T022
- 验证命令：`npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 桌面端和移动端检查
- 当前风险：无。
- 备注：已按 `docs/网站UI/` 的 `index.html`、`tools.html`、`games.html` 适配；只调整现有 Next.js 单应用内的体验和视觉区分，不拆部署、不实现具体工具或游戏逻辑。

### T024：修复 Vercel 子目录 Next.js 识别失败

- 领取人：Codex / 开发 A
- 领取时间：2026-05-20
- 状态：已完成
- 预计完成：2026-05-20
- 允许修改文件：`apps/web/package.json`, `package-lock.json`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/src/**`, `apps/web/prisma/**`, `packages/**`, `apps/game/**`, `docker-compose.yml`
- 依赖任务：T002
- 验证命令：`npm run build -w apps/web`
- 当前风险：Vercel Root Directory 设置为 `apps/web` 时，只读取子应用依赖声明，缺少 `next`、`react`、`react-dom` 会导致框架识别失败。
- 备注：只补 Web 子应用运行依赖和 lockfile，不调整业务代码。

### T023：补充 Supabase 数据库交接文档

- 领取人：Codex / 开发 A
- 领取时间：2026-05-20
- 状态：已完成
- 预计完成：2026-05-20
- 允许修改文件：`docs/handoffs/**`, `docs/decisions/**`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`
- 依赖任务：T004
- 验证命令：文档自审；连接参数说明完整
- 当前风险：文档只应保留交接所需内容，不应把数据库密码明文写入仓库。
- 备注：仅补数据库交接说明，不改业务代码。

### T004：添加数据库和 Prisma 模型（Supabase PostgreSQL）

- 领取人：Codex / 开发 A
- 领取时间：2026-05-20
- 状态：已完成
- 预计完成：2026-05-20
- 允许修改文件：`apps/web/prisma/**`, `apps/web/src/lib/db.ts`, `docker-compose.yml`, `.env.example`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/src/app/**`, `apps/web/src/components/**`, `packages/**`, `apps/game/**`
- 依赖任务：T002, T003
- 验证命令：`npm exec prisma validate -w apps/web`
- 当前风险：需要确认 Supabase 项目可用并获取连接串；后续还要保持 Prisma schema 与标准 PostgreSQL 兼容，避免绑定 Supabase 专有能力。
- 备注：数据库底座先使用 Supabase 托管 PostgreSQL，后续可迁移到自有 PostgreSQL。

### T022：按 `docs/网站UI.zip` 适配前端门户 UI

- 领取人：Codex / 开发 A
- 领取时间：2026-05-20
- 状态：已完成
- 预计完成：2026-05-20
- 允许修改文件：`apps/web/src/app/**`, `apps/web/src/components/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**`
- 禁止修改文件：`packages/**`, `apps/game/**`, `docker-compose.yml`, `apps/web/prisma/**`
- 依赖任务：T002
- 验证命令：`npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 桌面端和移动端检查
- 当前风险：任务文档曾被覆盖，需按已有完成记录和仓库实际文件修正 T001/T002 状态；`T019` 编号存在历史复用记录，当前新增任务使用 T022 避免继续冲突。
- 备注：设计来源为 `docs/网站UI.zip`，重点迁移 `index.html`, `tools.html`, `games.html`, `styles.css` 的视觉和交互。

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

### T021：AI 内容转换工具箱规划

- 领取人：Codex / 两人协作
- 领取时间：2026-05-20
- 状态：已完成
- 预计完成：2026-05-20
- 允许修改文件：`docs/PROJECT_CONTEXT.md`, `docs/plans/2026-05-19-tool-game-ai-platform-implementation.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/2026-05-20-task-21-ai-content-conversion-toolbox-planning.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `tsconfig.base.json`
- 依赖任务：无
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：无。
- 备注：来源参考 `qiaomu-anything-to-notebooklm` skill；当前只写规划，不进入实现。

### T019：确认 GDevelop 游戏模块定位

- 领取人：Codex / 开发 B
- 领取时间：2026-05-20
- 状态：已完成
- 预计完成：2026-05-20
- 允许修改文件：`docs/PROJECT_CONTEXT.md`, `docs/plans/2026-05-19-tool-game-ai-platform-implementation.md`, `docs/superpowers/specs/2026-05-19-tool-game-ai-platform-design.md`, `docs/decisions/2026-05-20-gdevelop-game-engine-role.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/2026-05-20-task-19-gdevelop-game-engine-role.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `tsconfig.base.json`
- 依赖任务：无
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：无。
- 备注：只确认 GDevelop 的定位，不实现游戏代码。Cocos Creator 仍是微信/抖音小游戏正式发布主线。

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
