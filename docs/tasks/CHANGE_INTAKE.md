# 新想法与需求变更入口

**最后更新**：2026-05-21
**用途**：当任意一方有新想法，或让 AI 帮忙规划新功能时，必须先走本流程，再进入实施。

## 1. 核心规则

- 新想法不能直接进入开发。
- 新想法必须先记录到本文件。
- AI 可以帮助补全方案，但必须先把结果写入 `docs/tasks/TASK_BOARD.md`。
- 没有任务编号、负责人、文件范围和验证方式，不允许进入实施。
- 如果新想法会影响另一方文件范围，必须先在 `docs/tasks/CLAIMS.md` 登记冲突或交接。

## 2. 新想法处理流程

1. 记录想法到本文件的“待评估想法”区域。
2. AI 或负责人把想法整理成变更卡。
3. 判断影响范围：
   - 是否影响现有任务。
   - 是否影响另一方负责文件。
   - 是否需要新增模块文档。
   - 是否需要新增决策记录。
4. 如果值得做，写入 `docs/tasks/TASK_BOARD.md`，状态设为 `待拆分` 或 `待领取`。
5. 如果涉及文件冲突，写入 `docs/tasks/CLAIMS.md` 的冲突登记。
6. 只有当任务进入 `待领取`，并且有人在 `CLAIMS.md` 领取后，才能实施。

## 3. 变更卡模板

```md
### IDEA-YYYYMMDD-XX：想法标题

- 提出人：
- 提出时间：
- 背景：
- 目标：
- 不做：
- 用户价值：
- 涉及模块：
- 可能影响文件：
- 是否影响另一方任务：是 / 否
- 是否需要新增任务：是 / 否
- 建议优先级：P0 / P1 / P2 / P3
- 验收标准：
- AI 初步方案：
- 处理结论：待评估 / 已入任务池 / 暂不做 / 合并到已有任务
- 对应任务编号：
```

## 4. 待评估想法

暂无。

### IDEA-20260521-01：工具站和游戏站改为相互独立

- 提出人：Lee
- 提出时间：2026-05-21
- 背景：2026-05-20 提出网站不应继续表现为单一“工具游戏门户”，而应该拆成独立工具站和独立游戏站；两边只保留一个可以互相跳转的路口，并且 UI 需要明显区分。
- 目标：首页改为两个独立站点入口；工具站专注效率、文档、图片和 AI 工具；游戏站专注轻量游戏、关卡、停留和回访；两边保留明确但克制的互跳入口。
- 不做：不实现具体 PDF 处理、AI 修图处理、真实游戏逻辑、后台、数据库查询或多应用部署拆分。
- 用户价值：让工具用户和游戏用户进入后获得更聚焦的体验，降低“工具”和“游戏”混在一起造成的定位模糊。
- 涉及模块：Web 首页、工具频道、游戏频道、全局导航、全局样式、协作文档。
- 可能影响文件：`apps/web/src/app/**`, `apps/web/src/components/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**`
- 是否影响另一方任务：是，影响共享前端信息架构和后续开发 A/B 进入各自模块的页面基准。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：首页只作为工具站和游戏站的分流入口；`/tools` 和 `/games` 页面有独立叙事、导航和视觉气质；两边仅保留一个互跳路口；桌面端和移动端无明显溢出；lint/typecheck/build 通过。
- AI 初步方案：新增 T025；复用现有 Next.js 单应用和静态数据，调整首页、频道页参数和 CSS 主题，工具站使用更克制的效率型 UI，游戏站使用更有沉浸感和玩法感的 UI。
- 处理结论：已入任务池
- 对应任务编号：T025

### IDEA-20260520-03：按 `docs/网站UI.zip` 适配前端视觉

- 提出人：Lee
- 提出时间：2026-05-20
- 背景：用户提供 `docs/网站UI.zip`，要求当前前端 UI 做成该设计包的样式；同时发现最新文档曾被覆盖，任务状态与仓库实际文件不一致。
- 目标：识别 UI 包中的静态设计导出，将首页、工具频道、游戏频道迁移到导出稿的视觉系统和交互结构，并同步修正基础任务状态。
- 不做：不实现具体 PDF 处理、AI 修图处理、真实 AI 搜索、真实游戏运行和后台数据管理。
- 用户价值：让当前站点第一眼接近目标设计，后续模块开发有统一视觉基准。
- 涉及模块：Web 首页、工具频道、游戏频道、全局导航、全局样式、协作文档。
- 可能影响文件：`apps/web/src/app/**`, `apps/web/src/components/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**`
- 是否影响另一方任务：是，影响共享页面和后续开发 A/B 都会复用的门户视觉基准。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：首页、工具页、游戏页使用 `docs/网站UI.zip` 的视觉 token、导航、搜索、卡片、筛选和弹窗结构；桌面端和移动端无明显溢出；lint/typecheck/build 通过；文档状态修正。
- AI 初步方案：读取 `DESIGN-HANDOFF.md`、`DESIGN-MANIFEST.json`、`index.html`、`tools.html`、`games.html` 和 `styles.css`，提取 token 后迁入 Next.js；新增 `/tools` 和 `/games` 路由；用客户端组件承载搜索下拉、筛选、抽屉和弹窗。
- 处理结论：已入任务池
- 对应任务编号：T022

### IDEA-20260520-04：数据库先使用 Supabase 托管 PostgreSQL

- 提出人：Lee
- 提出时间：2026-05-20
- 背景：当前阶段需要尽快上线数据库层，但后期希望可以平迁到自有服务器，不想一开始深度绑定云厂商专有能力。
- 目标：第一阶段优先使用 Supabase 托管 PostgreSQL 作为数据库底座，业务代码保持 Prisma + 标准 PostgreSQL 兼容，后续可迁移到自有 PostgreSQL。
- 不做：不把 Supabase Auth、Storage、RLS、Edge Functions 作为第一阶段必选依赖。
- 用户价值：降低初期运维成本，同时保留后续自建迁移空间。
- 涉及模块：数据库、Prisma、环境变量、部署文档。
- 可能影响文件：`docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/decisions/**`, `docs/plans/**`, `apps/web/prisma/**`, `apps/web/src/lib/db.ts`, `.env.example`, `docker-compose.yml`
- 是否影响另一方任务：否
- 是否需要新增任务：否
- 建议优先级：P1
- 验收标准：T004 的数据库方案明确写为 Supabase PostgreSQL；Prisma schema 不依赖 Supabase 专有扩展；迁移到自有 PostgreSQL 时只需更换连接配置和执行迁移。
- AI 初步方案：把 Supabase 当托管 PostgreSQL 使用，业务层只接 Prisma 和标准 SQL；如需本地开发，继续保留可替换的本地数据库配置说明。
- 处理结论：已确认
- 对应任务编号：T004

### IDEA-20260520-05：补充 Supabase 数据库交接文档

- 提出人：Lee
- 提出时间：2026-05-20
- 背景：朋友需要接手并修改数据库内容，需要一份明确写出项目连接方式、环境变量和使用步骤的文档。
- 目标：新增数据库交接文档，说明 Supabase 项目、连接参数、Prisma 使用方式和本地修改流程，方便朋友直接接手。
- 不做：不修改业务逻辑，不新增数据库表，不调整前端页面。
- 用户价值：朋友可以按文档直接连接数据库并继续维护内容。
- 涉及模块：文档、数据库交接、团队协作。
- 可能影响文件：`docs/handoffs/**`, `docs/decisions/**`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/**`, `docs/progress/2026-05-20.md`, `docs/completion/**`
- 是否影响另一方任务：否
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：仓库内存在可交接的数据库说明文档，包含项目标识、连接串格式、环境变量名、Prisma 使用方式和注意事项；文档不泄露多余内容。
- AI 初步方案：新增一份 Supabase 数据库交接手册，补充 `DATABASE_URL`、`DIRECT_DATABASE_URL`、`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY` 的含义与来源，并说明朋友如何在自己的环境中修改内容。
- 处理结论：已入任务池
- 对应任务编号：T023

### IDEA-20260520-02：首页门户视觉与信息架构优化

- 提出人：Lee
- 提出时间：2026-05-20
- 背景：当前首页已可访问，但首屏和信息架构仍偏骨架，门户感不够强。
- 目标：优化首页首屏、频道入口和分类展示，让页面更像可直接使用的工具游戏门户。
- 不做：不扩展到后台、数据库或具体工具详情页。
- 用户价值：提升第一眼的产品感和可点击性，方便后续继续接入内容。
- 涉及模块：Web 首页、基础样式。
- 可能影响文件：`apps/web/src/app/page.tsx`, `apps/web/src/app/globals.css`, `apps/web/src/components/AppHeader.tsx`, `apps/web/src/components/AppFooter.tsx`
- 是否影响另一方任务：否
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：首页更完整，具备明确首屏、分类入口和内容卡片，不影响构建与类型检查。
- AI 初步方案：增加更有层次的首屏、搜索栏占位、频道卡片和分类区块，保留简洁风格。
- 处理结论：待评估
- 对应任务编号：T019

## 5. 已处理想法

### IDEA-20260520-02：AI 内容转换工具箱

- 提出人：Lee
- 提出时间：2026-05-20
- 背景：调研 `qiaomu-anything-to-notebooklm` skill 后，发现“多源输入 -> 成品输出”的工具形态很适合工具站后续扩展。
- 目标：规划一个独立的 AI 内容转换工具箱，支持把文章、PDF、视频、音频、文档转换成 NotebookLM 知识包、播客脚本、PPT 大纲和思维导图等成品。
- 不做：不做付费墙穿透，不做侵权导向抓取，不把它塞进现有 PDF / 修图 / 游戏任务里。
- 用户价值：把零散资料直接变成可复用成品，适合学生、办公和内容创作者。
- 涉及模块：未来 AI 工具、内容整理、知识加工。
- 可能影响文件：`docs/PROJECT_CONTEXT.md`, `docs/plans/**`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/**`, `docs/decisions/**`, `docs/progress/2026-05-20.md`, 后续可能影响 `apps/web/**`
- 是否影响另一方任务：否
- 是否需要新增任务：是
- 建议优先级：P2
- 验收标准：规划中明确 skill 来源、输入输出边界、起步顺序和不做事项。
- AI 初步方案：先把它作为后续候选方向写入项目规划，再拆成独立任务池条目，第一版优先做 NotebookLM 知识包、播客脚本和 PPT 大纲三种输出。
- 处理结论：已入任务池
- 对应任务编号：T021

### IDEA-20260520-01：引入 GDevelop 优化 Web 小游戏原型通道

- 提出人：Lee
- 提出时间：2026-05-20
- 背景：用户关注开源项目 `4ian/GDevelop` 是否可以优化当前游戏模块。调研结论是：GDevelop 适合 Web H5 原型和轻量小游戏快速生产，但不应替代 Cocos Creator 的微信/抖音小游戏正式发布位置。
- 目标：把 GDevelop 定位写入项目规划，并新增后续可领取任务，用于接入 GDevelop Web 游戏原型通道。
- 不做：不替换 Cocos Creator，不直接导入 GDevelop 工程，不实现麻将游戏代码，不承诺 GDevelop 支持微信/抖音小游戏发布。
- 用户价值：降低 Web 小游戏试错成本，让非开发成员更容易参与玩法和关卡验证，同时保留 Cocos 的小程序发布能力。
- 涉及模块：游戏频道、游戏发布、麻将 Roguelike 消除、Web 游戏嵌入。
- 可能影响文件：`docs/PROJECT_CONTEXT.md`, `docs/plans/**`, `docs/superpowers/specs/**`, `docs/decisions/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**`, 后续可能影响 `apps/game/**`, `apps/web/src/components/game/**`, `packages/shared/**`
- 是否影响另一方任务：是，影响开发 B 的 `T011` 和 `T017` 游戏相关任务规划。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：当前规划明确“Cocos 正式小程序主线 + GDevelop Web H5 原型通道”；任务池新增后续接入任务；不产生游戏代码改动。
- AI 初步方案：先完成 `T019` 文档定位决策，再由开发 B 后续领取 `T020` 接入 GDevelop Web 原型通道。
- 处理结论：已入任务池
- 对应任务编号：T019, T020

### IDEA-20260519-01：建立 Git 忽略规则和协作入口

- 提出人：Lee
- 提出时间：2026-05-19
- 背景：GitHub 仓库已创建，需要避免上传依赖、构建产物、本地环境和编辑器状态文件，并方便朋友加入协作。
- 目标：新增 `.gitignore`，补充 README 协作入口，并在任务池记录本次仓库基础协作任务。
- 不做：不搭建 Monorepo，不安装依赖，不提交或推送远端。
- 用户价值：降低仓库污染和协作冲突，让另一位开发者 clone 后能快速找到任务池和领取规则。
- 涉及模块：仓库基础、双人协作。
- 可能影响文件：`.gitignore`, `README.md`, `.claude/settings.local.json`, `.obsidian/workspace.json`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-19.md`, `docs/completion/**`
- 是否影响另一方任务：否
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：`.gitignore` 存在且覆盖 Node/Next/Cocos/环境变量/构建产物/本地编辑器状态；已跟踪的本地状态文件从 Git 索引移除；README 有协作入口；状态文档已同步。
- AI 初步方案：作为 `T018` 独立任务处理，文件范围限定在仓库忽略规则、本地状态文件取消跟踪和协作文档。
- 处理结论：已入任务池
- 对应任务编号：T018

## 6. AI 处理新想法时必须输出

当用户对 AI 说“我有个新想法”“帮我规划这个功能”“顺便实现一下”时，AI 必须先输出：

```md
我会先把这个想法登记为变更卡，评估是否影响现有任务和文件范围，再写入任务池。没有任务编号和领取记录前，不会开始实现。
```

然后更新：

1. `docs/tasks/CHANGE_INTAKE.md`
2. `docs/tasks/TASK_BOARD.md`
3. 必要时更新 `docs/tasks/CLAIMS.md`
4. 必要时更新 `docs/status/CURRENT_STATUS.md`
