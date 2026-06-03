# T106：AI 面试助手规划

- 优先级：P2
- 负责人：Lee
- 默认负责人：Lee
- 状态：待验收
- 依赖：T021, T025
- 提出来源：IDEA-20260603-02
- 涉及模块：AI 面试助手 / 网页工具频道 / AI 能力工具 / 虚拟面试 / HTML 下载报告
- 主要文件范围：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T106-ai-interview-coach-planning.md`, `docs/tasks/claims/T106-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-03-ai-interview-coach-design.md`, `docs/modules/ai-interview-coach/**`, `docs/progress/2026-06-03-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T106-ai-interview-coach-planning.md docs/tasks/claims/T106-lee.md docs/superpowers/specs/2026-06-03-ai-interview-coach-design.md docs/modules/ai-interview-coach/README.md docs/modules/ai-interview-coach/IMPLEMENTATION_PLAN.md docs/modules/ai-interview-coach/PROGRESS.md docs/modules/ai-interview-coach/DECISIONS.md docs/modules/ai-interview-coach/HANDOFF.md docs/progress/2026-06-03-lee.md`; `git diff --check`

## 背景

Lee 提出新增一个 AI 面试工具：用户输入岗位 JD、求职者简历和补充参数，支持上传简历图片，系统自动生成面试题和答案的 HTML 报告并可下载。该工具需要同时服务面试官和面试者，并进一步支持进入虚拟面试，由大模型根据用户回答动态追问和复盘。

## 目标

- 评估该功能是否适合挂在网页工具频道。
- 形成具体规划文档，供 Lee 评估。
- 明确双入口、虚拟面试、参数配置、HTML 下载报告和后续开发边界。
- 补充后续增强方向：简历优化、专业领域实战例子和行业用法说明。
- 建立独立模块文档目录。

## 不做

- 不开发业务代码。
- 不接入真实大模型 API。
- 不实现实时语音面试。
- 不实现简历优化改写。
- 不新增账号、历史记录、企业筛选或 ATS 接入。
- 不修改 PDF 工具箱、AI 修图、胡了卜游戏、部署或数据库模型。

## 验收标准

- 新想法已登记到 `CHANGE_INTAKE.md`。
- T106 任务分片和领取分片已创建。
- `docs/modules/ai-interview-coach/` 包含必备模块文档。
- 规划设计稿覆盖产品定位、MVP 范围、用户流程、差异化、AI 能力拆分、技术可行性、合规边界、商业化和阶段拆分。
- 文档同步、占位符扫描和 diff 检查通过。

## 进展

- 2026-06-03：已完成需求讨论和可行性评估。
- 2026-06-03：已创建 T106 规划任务、模块文档和评估设计稿。
- 2026-06-03：已补充后续增强方向：简历优化建议、专业领域实战例子和行业用法说明。
