# 项目总入口

**最后更新**：2026-05-19  
**用途**：任何开发者或 AI 开始工作前，先读这个文件。

## 1. 当前项目一句话

我们要做一个免费工具/游戏门户。第一阶段先用免费、好用、更新快来拿流量和停留，后续再接 AI 能力、订阅、自带 API、API 中转等变现能力。

## 2. 当前阶段目标

第一阶段只做三个核心交付：

1. `PDF 工具箱`
   - 核心目标：搜索刚需。
   - 原则：不调用模型能力的 PDF 功能尽量免费。
   - 暂不做完整 PDF 原文在线编辑。

2. `AI 修图工具`
   - 核心目标：展示 AI 能力和付费空间。
   - 免费：基础修图、边框、滤镜、简单手动去水印。
   - 付费/限次：调用 AI 模型的美颜、重绘、智能去水印、高清增强等。

3. `麻将 Roguelike 消除小游戏`
   - 核心目标：提升停留时长和回访。
   - 玩法：麻将牌消除 + `碰 / 吃 / 杠 / 清一色 / 胡牌目标` + Roguelike 奖励。
   - 第一版不做完整麻将算法、不做多人、不做排行榜。

## 2.1 后续候选方向

- `AI 内容转换工具箱`
  - 来源参考：`qiaomu-anything-to-notebooklm` skill。
  - 定位：多源输入，结构化输出成知识包、播客脚本、PPT 大纲、思维导图等成品。
  - 起步：先只接用户自有资料和公开链接，先做单文件处理，再做多文件合并。
  - 边界：不做付费墙穿透，不做侵权导向抓取。
  - 状态：仅作为后续候选，不计入第一阶段三大交付。

## 3. 必读文档顺序

每个新会话或每个开发者开工前按顺序读：

1. `docs/PROJECT_CONTEXT.md`
2. `docs/status/CURRENT_STATUS.md`
3. `docs/tasks/TASK_BOARD.md`
4. `docs/tasks/CLAIMS.md`
5. `docs/tasks/CHANGE_INTAKE.md`
6. `docs/superpowers/specs/2026-05-19-tool-game-ai-platform-design.md`
7. `docs/plans/2026-05-19-tool-game-ai-platform-implementation.md`
8. `docs/workflow/dual-dev-ai-workflow.md`

如果只做某个模块，再读对应模块文档目录：

- PDF：`docs/modules/pdf-toolbox/`
- 修图：`docs/modules/photo-editor/`
- 游戏：`docs/modules/mahjong-roguelike/`

每个小工具或游戏都必须有独立模块文档文件夹，代码也必须放在独立模块目录；路由层只做入口。

模块文档目录规范：

- 文档目录：`docs/modules/<module-slug>/`
- 必备文件：`README.md`、`IMPLEMENTATION_PLAN.md`、`PROGRESS.md`、`DECISIONS.md`、`HANDOFF.md`

代码目录规范：

- Web 工具：`apps/web/src/modules/tools/<module-slug>/`
- Web 游戏接入：`apps/web/src/modules/games/<module-slug>/`
- 正式游戏工程：`apps/game/<module-slug>/`
- 路由入口：`apps/web/src/app/**` 只做页面入口、元数据和模块挂载，不写大量业务逻辑。

## 4. 文档位置规范

- 产品设计稿：`docs/superpowers/specs/`
- 实施计划：`docs/plans/`
- 当前状态：`docs/status/CURRENT_STATUS.md`
- 任务池：`docs/tasks/TASK_BOARD.md`
- 任务分片：`docs/tasks/items/`
- 任务领取和冲突：`docs/tasks/CLAIMS.md`
- 领取分片：`docs/tasks/claims/`
- 新想法和需求变更入口：`docs/tasks/CHANGE_INTAKE.md`
- 双人协作规范：`docs/workflow/dual-dev-ai-workflow.md`
- 文档同步与冲突规避：`docs/workflow/doc-sync-policy.md`
- 模块设计：`docs/modules/`
- 每日/阶段进展：`docs/progress/`
- 完成记录：`docs/completion/`
- 决策记录：`docs/decisions/`
- 运维手册：`docs/operations/`
- 上线清单：`docs/checklists/`

## 5. 双人开发模式

- 开发 A：先负责网站平台基础搭建。
  - Monorepo。
  - Next.js 主站。
  - 数据库和 Prisma。
  - 内容模型。
  - 后台管理。
  - PDF 工具箱基础能力。

- 开发 B：负责垂直模块和体验能力。
  - AI 搜索。
  - AI 修图工具。
  - 麻将 Roguelike 消除。
  - 游戏接入。
  - 埋点。
  - 部署协助。

如果实际人员调整，以 `docs/status/CURRENT_STATUS.md` 为准。

## 6. AI 开工规则

任何人的 AI 在开始执行前必须先确认：

- 当前要做的任务编号。
- 当前任务负责人。
- 允许修改的文件范围。
- 不允许修改的文件范围。
- 验证命令。
- 完成后要更新哪个状态文档。

如果这些信息不清楚，不要直接写代码，先补文档或向负责人确认。

## 7. 当前技术方向

- 网站：Next.js + TypeScript。
- 数据库：PostgreSQL。
- ORM：Prisma。
- 缓存/限流：Redis。
- 游戏：Cocos Creator 作为微信/抖音小游戏正式发布主线；GDevelop 可作为 Web H5 原型和轻量小游戏生产通道。
- 部署：Ubuntu 24.04 + Docker Compose + Nginx。

第一阶段不要做：

- 微服务。
- Kubernetes。
- 自建模型推理。
- 完整支付系统。
- 完整用户中心。
- API 转售市场。

## 8. 当前状态入口

所有“谁在做什么、做到哪里、下一步是什么、有没有阻塞”都记录在：

`docs/status/CURRENT_STATUS.md`

每完成一个完整任务，必须更新该文件。任务中的分步操作优先写任务分片、领取分片、模块进展或当天进展，不要反复修改主文档。

## 9. AI 自动入口文件

项目根目录有两个入口文件：

- `AGENTS.md`
- `CLAUDE.md`

用途：

- 让 Codex、Claude、Claude Code 或其他 AI 在任务开始前优先看到项目规则。
- 要求 AI 先读项目上下文、当前状态、协作规范和实施计划。
- 要求 AI 在任务完成后更新状态、进展和完成记录。

最佳实践：

- 每次开发都从 `D:\DreamChasers` 根目录启动 AI。
- 如果从子目录启动，先要求 AI 读取根目录的 `AGENTS.md` 或 `CLAUDE.md`。
- 不要只依赖口头说明，任务边界必须写进 `docs/status/CURRENT_STATUS.md`。
- 新想法必须先写入 `docs/tasks/CHANGE_INTAKE.md`，再写入任务池，不能直接实施。
