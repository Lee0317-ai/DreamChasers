# AGENTS.md

本文件是 `D:\DreamChasers` 项目的 AI 开工入口。任何 AI 或开发者在执行任务前必须先读本文件。

## 1. 文件编码规范

- 新增或修改文件时必须使用 UTF-8 无 BOM 编码。
- 禁止提交包含不可读字符或 GBK/ANSI 等本地编码的内容。
- 若发现既有文件编码不符，需在提交前转换为 UTF-8 无 BOM。

## 2. 每次任务前必须读取

开始任何开发、修改、重构、调试、文档更新前，按顺序读取：

1. `docs/PROJECT_CONTEXT.md`
2. `docs/status/CURRENT_STATUS.md`
3. `docs/tasks/TASK_BOARD.md`
4. `docs/tasks/CLAIMS.md`
5. `docs/tasks/CHANGE_INTAKE.md`
6. `docs/workflow/dual-dev-ai-workflow.md`
7. `docs/plans/2026-05-19-tool-game-ai-platform-implementation.md`
8. `docs/superpowers/specs/2026-05-19-tool-game-ai-platform-design.md`

如果只做某个模块，还要读取对应模块文档：

- `docs/modules/pdf-toolbox.md`
- `docs/modules/photo-editor.md`
- `docs/modules/mahjong-roguelike.md`

模块文档不存在时，先查看实施计划中的对应任务，不要擅自扩大范围。

## 3. 每次任务前必须确认

动手前必须明确：

- 当前任务编号。
- 当前任务负责人。
- 允许修改的文件范围。
- 禁止修改的文件范围。
- 验证命令。
- 完成后要更新的文档。

如果这些信息不清楚，先更新或询问，不要直接写代码。

领取任务前必须在 `docs/tasks/CLAIMS.md` 新增领取记录。没有领取记录，不要改代码。

如果用户提出新想法、新功能、需求变更，或要求 AI “先规划再实现”，必须先写入 `docs/tasks/CHANGE_INTAKE.md`，再进入 `docs/tasks/TASK_BOARD.md`。没有任务编号、文件范围和领取记录，不要实施。

## 4. 每次任务后必须更新

完成任何开发或文档任务后，必须更新：

1. `docs/status/CURRENT_STATUS.md`
2. `docs/tasks/TASK_BOARD.md`
3. `docs/tasks/CLAIMS.md`
4. 如有新想法或需求变更，更新 `docs/tasks/CHANGE_INTAKE.md`
5. 当天进展：`docs/progress/YYYY-MM-DD.md`
6. 如果任务完成，新增完成记录：`docs/completion/YYYY-MM-DD-task-<number>-<short-name>.md`

完成记录必须包含：

- 任务编号。
- 负责人。
- 修改文件。
- 实现内容。
- 验证命令。
- 验证结果。
- 遗留问题。

## 5. 双人开发边界

默认分工以 `docs/status/CURRENT_STATUS.md` 为准。

- 开发 A：平台基础、Next.js、数据库、内容模型、后台、PDF 工具箱。
- 开发 B：AI 搜索、AI 修图、麻将 Roguelike 消除、游戏接入、埋点、部署协助。

共享文件修改前，必须先在 `docs/status/CURRENT_STATUS.md` 中说明计划。

## 6. 第一阶段范围

第一阶段只做：

1. PDF 工具箱。
2. AI 修图工具。
3. 麻将 Roguelike 消除小游戏。

不做：

- 完整 PDF 原文在线编辑。
- 完整支付系统。
- 完整用户中心。
- API 转售市场。
- 微服务。
- Kubernetes。
- 自建模型推理。
- 完整麻将算法。
- 多人游戏和排行榜。

## 7. 免费和付费原则

- 不调用模型能力、不产生明显高成本的功能，第一阶段尽量免费。
- 调用 AI 模型、OCR、高成本高清增强、批量 AI 处理等能力，后续进入免费限次、积分或订阅。
- 去水印文案必须避免侵权导向，只能表达为处理自己图片中的遮挡、瑕疵、水印或不需要的局部元素。

## 8. 实施原则

- 不做超出当前任务的功能。
- 不做无需求的抽象。
- 不改不属于当前任务的文件。
- 不覆盖他人或其他 AI 的改动。
- 每次修改后必须运行计划中对应的验证命令。
- 前端页面完成后必须检查桌面端和移动端。

## 9. 如果从子目录启动

如果当前工作目录不是 `D:\DreamChasers`，先回到项目根目录再读取文档。

旧目录 `D:\DreamChasers\tools-hub` 是之前的草稿项目，可以参考但允许推倒重来。
