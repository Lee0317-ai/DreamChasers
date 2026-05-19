# AI 交接文档

**日期**：2026-05-19  
**用途**：给新的 AI 会话快速接手项目使用。

## 1. 先读这些文件

1. `docs/PROJECT_CONTEXT.md`
2. `docs/status/CURRENT_STATUS.md`
3. `docs/tasks/TASK_BOARD.md`
4. `docs/tasks/CLAIMS.md`
5. `docs/tasks/CHANGE_INTAKE.md`
6. `docs/superpowers/specs/2026-05-19-tool-game-ai-platform-design.md`
7. `docs/plans/2026-05-19-tool-game-ai-platform-implementation.md`
8. `docs/workflow/dual-dev-ai-workflow.md`

不要跳过状态文档。当前谁在做什么，以 `docs/status/CURRENT_STATUS.md` 为准。
不要跳过任务池和领取记录。当前可做任务以 `docs/tasks/TASK_BOARD.md` 为准，正在进行和文件锁定以 `docs/tasks/CLAIMS.md` 为准。

## 2. 当前共识

- 产品是免费工具/游戏门户。
- 工具和游戏平级。
- 第一阶段不做 AI 能力平台主叙事。
- AI 搜索只做辅助发现，返回推荐列表。
- 后续才做订阅、自带 API、AI 能力池、API 中转。

## 3. 第一阶段交付

### PDF 工具箱

- 免费：预览、合并、拆分、删除页面、排序、旋转、PDF 转图片、图片转 PDF、PDF 转 Word、水印、签名、基础压缩。
- 暂不做：完整 PDF 原文在线编辑。
- OCR 后续再做。

### AI 修图工具

- 免费：基础修图、边框、滤镜、文字、马赛克、手动去水印。
- 收费/限次：所有调用 AI 模型的能力。
- 去水印文案必须避免侵权导向。

### 麻将 Roguelike 消除

- 基础：碰、吃、杠、清一色、胡牌目标。
- Roguelike：每关后 3 选 1 奖励。
- 第一版不做完整麻将算法、不做多人、不做排行榜。

## 4. 双人开发默认分工

- 开发 A：平台基础、Next.js、数据库、内容模型、后台、PDF 工具箱。
- 开发 B：AI 搜索、AI 修图、麻将游戏、游戏接入、埋点、部署协助。

共享文件改动前必须看 `docs/workflow/dual-dev-ai-workflow.md`。

## 5. 下一个推荐动作

如果还没开始编码：

1. 开发 A 在 `docs/tasks/CLAIMS.md` 领取 `T001`：创建 Monorepo 外壳。
2. 开发 B 在 `docs/tasks/CLAIMS.md` 领取 `T003`：添加共享领域类型。
3. 双方更新 `docs/status/CURRENT_STATUS.md`。

如果已经开始编码：

1. 先读 `docs/status/CURRENT_STATUS.md`。
2. 再读 `docs/tasks/TASK_BOARD.md` 和 `docs/tasks/CLAIMS.md`。
3. 找到当前进行中的任务。
4. 只处理该任务允许修改的文件范围。
5. 完成后写进展和完成记录。

如果用户提出新想法或需求变更：

1. 先写入 `docs/tasks/CHANGE_INTAKE.md`。
2. 再写入 `docs/tasks/TASK_BOARD.md`。
3. 如有文件冲突，再写入 `docs/tasks/CLAIMS.md`。
4. 没有任务编号和领取记录前，不要实施。

## 6. 推荐技能

后续 AI 会话建议：

- 写计划：使用 `writing-plans`。
- 执行计划：使用 `superpowers:executing-plans`。
- 做前端页面：遵守项目 UI/UX 要求，并用浏览器检查。
- 遇到 bug：使用系统化调试流程。
