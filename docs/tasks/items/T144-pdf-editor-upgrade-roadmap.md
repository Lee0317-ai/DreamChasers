# T144：PDF 工具箱升级规划和待办落档

- 优先级：P1
- 负责人：Lee
- 状态：待验收
- 依赖：T015, T142, T143
- 创建日期：2026-06-06
- 来源：IDEA-20260606-01
- 涉及模块：PDF 工具箱 / PDF 阅读器 / PDF 标注编辑 / AI Gateway 翻译 / OCR 后续能力
- 主要文件范围：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T144-pdf-editor-upgrade-roadmap.md`, `docs/tasks/claims/T144-lee.md`, `docs/modules/pdf-toolbox/PDF_EDITOR_UPGRADE_ROADMAP.md`, `docs/modules/pdf-toolbox/PROGRESS.md`, `docs/superpowers/plans/2026-06-06-pdf-editor-upgrade-roadmap.md`, `docs/progress/2026-06-06-lee.md`, `docs/completion/2026-06-06-task-144-pdf-editor-upgrade-roadmap.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 禁止修改文件：`apps/**`, `packages/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `package.json`, `package-lock.json`
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T144-pdf-editor-upgrade-roadmap.md docs/tasks/claims/T144-lee.md docs/modules/pdf-toolbox/PDF_EDITOR_UPGRADE_ROADMAP.md docs/superpowers/plans/2026-06-06-pdf-editor-upgrade-roadmap.md docs/progress/2026-06-06-lee.md docs/completion/2026-06-06-task-144-pdf-editor-upgrade-roadmap.md`; `git diff --check`

## 背景

Lee 参考 Microsoft Edge 内置 PDF 阅读器、批注编辑和翻译能力后，确认需要重新规划 PDF 工具箱升级路线。当前 PDF 工具箱已经具备页面级处理、文字水印、签名、遮盖、图片转 PDF 和 PDF 转 Word Beta，但尚不支持修改 PDF 内已有文字和图片。

## 目标

- 明确 PDF 工具箱后续升级路线。
- 优先规划 Edge 类免费阅读标注体验。
- 区分免费、本地处理、AI/翻译限次、OCR/大文件付费和商业 SDK 原文编辑。
- 记录 Lee 后续可以领取执行的待办拆分。

## 不做

- 不修改应用代码。
- 不接商业 PDF SDK。
- 不接真实翻译、OCR 或 AI 模型。
- 不实现 PDF 原文编辑。
- 不扩大 T015 当前实现范围。

## 交付内容

- 新增升级规划：`docs/modules/pdf-toolbox/PDF_EDITOR_UPGRADE_ROADMAP.md`。
- 新增实施待办计划：`docs/superpowers/plans/2026-06-06-pdf-editor-upgrade-roadmap.md`。
- 明确后续任务可按 `Edge-like 标注编辑`、`文本与翻译`、`转换增强`、`商业 SDK 评估` 四段拆分。

## 验证结果

- `npm run docs:sync`：通过。
- 占位符扫描：通过。
- `git diff --check`：通过。
