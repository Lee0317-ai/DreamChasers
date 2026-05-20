# 当前项目状态

**最后更新**：2026-05-20
**状态维护人**：开发者每次开工和收工时共同维护
**必读**：每个 AI 会话开始前必须读取本文件

## 1. 当前阶段

阶段：规划完成，准备进入基础搭建。

当前总目标：

- 建立项目基础结构。
- 明确双人开发边界。
- 第一阶段实现 `PDF 工具箱`、`AI 修图工具`、`麻将 Roguelike 消除`。

## 2. 当前任务看板

权威任务池是 `docs/tasks/TASK_BOARD.md`。本节只作为快照摘要，可能落后于任务池；领取任务和判断文件冲突时，以 `TASK_BOARD.md` 和 `docs/tasks/CLAIMS.md` 为准。

| 任务 | 名称 | 负责人 | 状态 | 允许修改范围 | 下一步 |
| --- | --- | --- | --- | --- | --- |
| 1 | 创建 Monorepo 外壳 | 开发 A | 已完成 | `package.json`, `tsconfig.base.json`, `apps/**`, `packages/**` | 已完成基础 workspace |
| 2 | 搭建 Web 应用 | 开发 A | 已完成 | `apps/web/**` | 已完成 Next.js 基础应用 |
| 3 | 添加共享领域类型 | 开发 B | 未开始 | `packages/shared/**` | 建立内容类型和使用模式类型 |
| 4 | 添加数据库和 Prisma 模型 | 开发 A | 已完成 | `apps/web/prisma/**`, `apps/web/src/lib/db.ts`, `docker-compose.yml` | 建立内容模型 |
| 5 | 添加第一批种子内容 | 开发 A | 未开始 | `apps/web/src/lib/content/**`, `apps/web/prisma/seed.ts` | 准备工具/游戏初始数据 |
| 6 | 实现内容查询层 | 开发 A | 未开始 | `apps/web/src/lib/content/**` | 实现热门、星标、最近更新 |
| 7 | 实现公开门户页面 | 开发 A | 未开始 | `apps/web/src/app/**`, `apps/web/src/components/content/**` | 首页和频道页 |
| 8 | 添加 AI 搜索 MVP | 开发 B | 未开始 | `apps/web/src/lib/ai/**`, `apps/web/src/components/ai/**`, `apps/web/src/app/api/ai/**` | 本地匹配搜索 |
| 9 | 添加后台 MVP | 开发 A | 未开始 | `apps/web/src/app/admin/**`, `apps/web/src/lib/admin/**` | 内容后台 |
| 10 | 添加使用模式和变现基础 | 开发 A | 未开始 | `apps/web/src/lib/billing/**`, `apps/web/src/components/billing/**` | 免费/限次/订阅展示 |
| 11 | 添加游戏发布基础 | 开发 B | 未开始 | `apps/game/**`, `apps/web/src/components/game/**` | Cocos 发布文档和 Web 嵌入 |
| 12 | 添加埋点和热门排序 | 开发 B | 未开始 | `apps/web/src/lib/analytics/**`, `apps/web/src/app/api/events/**` | 点击统计 |
| 13 | 添加部署文件 | 开发 B | 未开始 | `deploy/**`, `apps/web/Dockerfile`, `docker-compose.yml` | Docker/Nginx |
| 14 | 添加上线清单和运营手册 | 两人协作 | 未开始 | `docs/checklists/**`, `docs/operations/**` | 补齐上线流程 |
| 15 | 实现 PDF 工具箱 MVP | 开发 A | 未开始 | `apps/web/src/app/tools/pdf-toolbox/**`, `apps/web/src/components/tools/pdf/**`, `apps/web/src/lib/tools/pdf/**` | PDF 预览和转换 |
| 16 | 实现 AI 修图工具 MVP | 开发 B | 未开始 | `apps/web/src/app/tools/ai-photo-editor/**`, `apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**` | 基础修图和 AI 占位 |
| 17 | 实现麻将 Roguelike 消除 MVP | 开发 B | 未开始 | `apps/game/mahjong-roguelike/**`, `packages/shared/src/mahjong-game.ts` | 规则模型和游戏文档 |
| 18 | 建立 Git 忽略规则和协作入口 | 开发 A | 已完成 | `.gitignore`, `README.md`, `.claude/settings.local.json`, `.obsidian/workspace.json`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-19.md`, `docs/completion/**` | 提交后本地状态文件不再上传 |
| 19 | 确认 GDevelop 游戏模块定位 | 开发 B | 已完成 | `docs/**` | 后续由 T020 接入 Web 原型通道 |
| 20 | 添加 GDevelop Web 游戏原型通道 | 开发 B | 未开始 | `apps/game/gdevelop/**`, `apps/game/publishing/gdevelop-web-export.md`, `apps/web/src/components/game/**`, `apps/web/src/app/games/**`, `packages/shared/src/game-engine.ts`, `docs/modules/mahjong-roguelike.md` | 领取后实现统一嵌入和导出规范 |
| 21 | AI 内容转换工具箱规划 | 两人协作 | 已完成 | `docs/PROJECT_CONTEXT.md`, `docs/plans/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**` | 规划完成，后续再拆实现任务 |
| 22 | 按 `docs/网站UI.zip` 适配前端门户 UI | 开发 A | 已完成 | `apps/web/src/app/**`, `apps/web/src/components/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**` | 迁移静态设计导出的视觉和交互 |
| 23 | 补充 Supabase 数据库交接文档 | 开发 A | 进行中 | `docs/handoffs/**`, `docs/decisions/**`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/**`, `docs/progress/2026-05-20.md`, `docs/completion/**` | 写清连接方式和接手流程 |

## 3. 当前活跃任务

### 当前任务

- 任务编号：T023
- 任务名称：补充 Supabase 数据库交接文档
- 负责人：Codex / 开发 A
- 状态：进行中
- 开始时间：2026-05-20
- 允许修改文件：`docs/handoffs/**`, `docs/decisions/**`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/**`, `docs/progress/2026-05-20.md`, `docs/completion/**`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`
- 验证命令：文档自审；连接参数说明完整
- 当前阻塞：无
- 下一步：补充 Supabase 数据库交接手册。

领取任务后填写：

```md
### 当前任务

- 任务编号：
- 任务名称：
- 负责人：
- 状态：进行中
- 开始时间：
- 允许修改文件：
- 禁止修改文件：
- 验证命令：
- 当前阻塞：
- 下一步：
```

## 4. 已完成事项

- 已确认产品定位：免费工具游戏门户，后续扩展 AI 能力平台。
- 已确认工具和游戏平级。
- 已确认 AI 搜索只做辅助发现，返回推荐列表。
- 已确认第一阶段三个交付：PDF 工具箱、AI 修图工具、麻将 Roguelike 消除。
- 已确认不调用模型的能力尽量免费。
- 已确认双人开发模式和默认负责人边界。
- 已新增根目录 `AGENTS.md` 和 `CLAUDE.md`，要求 AI 每次任务前读取项目上下文、当前状态、协作规范和实施计划。
- 已新增 `.gitignore` 和 README 协作入口，减少依赖、构建产物、本地环境和编辑器状态文件误上传。
- 已从 Git 索引移除 `.claude/settings.local.json` 和 `.obsidian/workspace.json`，本地文件仍保留。
- 已确认 GDevelop 的游戏模块定位：作为 Web H5 原型和轻量小游戏通道；Cocos Creator 仍作为微信/抖音小游戏正式发布主线。
- 已识别后续候选方向：AI 内容转换工具箱，来源参考 `qiaomu-anything-to-notebooklm` skill。

## 5. 当前阻塞

暂无。

## 6. 关键决策

### 决策 1：收费原则

不调用模型能力、不产生明显高成本的功能，第一阶段尽量免费。

### 决策 2：PDF 编辑边界

第一版不做完整 PDF 原文在线编辑，只做页面级处理和转换。

### 决策 3：AI 修图边界

基础修图免费，调用 AI 模型的能力收费或限次。

### 决策 4：游戏方向

小游戏不是简单换皮，而是麻将消除 + Roguelike 奖励构筑。

### 决策 5：协作方式

每个开发者和各自 AI 必须通过文档同步，状态统一记录在本文件。

### 决策 6：游戏引擎定位

Cocos Creator 负责正式小游戏发布路径，尤其是微信小游戏和抖音小游戏。GDevelop 只作为 Web H5 原型、站内试玩和轻量小游戏快速生产通道，不替代 Cocos。

## 7. 下一步建议

1. 开发 A 领取任务 1：创建 Monorepo 外壳。
2. 开发 B 并行领取任务 3：添加共享领域类型。
3. 开发 B 在游戏发布基础任务前关注 `T020`，把 GDevelop Web 原型通道纳入游戏模块。
4. 已补充 `T021`：AI 内容转换工具箱规划，后续再拆实现任务。
5. 两人完成后同步更新本文件。
6. 再进入任务 2、4、8、17。

## 8. 任务池和领取入口

所有可领取任务记录在：

`docs/tasks/TASK_BOARD.md`

所有正在进行的任务、文件锁定、冲突和交接记录在：

`docs/tasks/CLAIMS.md`

所有新想法和需求变更先记录在：

`docs/tasks/CHANGE_INTAKE.md`

没有在 `docs/tasks/CLAIMS.md` 领取任务前，不要修改代码。
