# T107：AI 面试助手 MVP

- 优先级：P2
- 负责人：待领取
- 默认负责人：待定
- 状态：待领取
- 依赖：T106
- 提出来源：IDEA-20260603-02
- 涉及模块：AI 面试助手 / 网页工具频道 / AI 能力工具 / 虚拟面试 / HTML 下载报告
- 主要文件范围：`apps/web/src/app/tools/ai-interview-coach/**`, `apps/web/src/modules/tools/ai-interview-coach/**`, `apps/web/src/app/api/tools/ai-interview-coach/**`, `apps/web/src/components/portal-data.ts`, `docs/modules/ai-interview-coach/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T107-ai-interview-coach-mvp.md`, `docs/tasks/claims/T107-<owner>.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/**`, `docs/completion/**`
- 验证方式：`npm run test -w apps/web -- ai-interview-coach`; `npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 桌面端和移动端浏览器检查；`npm run docs:sync`; `git diff --check`

## 背景

T106 已完成 AI 面试助手规划评估，确认该功能适合作为网页工具频道下的 AI 能力工具。Lee 希望将它记录为一个后续可领取的具体开发任务，等排期确认后由合适负责人领取实现。

## 目标

- 在工具频道新增 `AI 面试助手` 网页小工具入口。
- 支持用户输入岗位 JD、简历文本和补充参数。
- 支持简历图片上传入口，并在实现时根据实际 AI 能力决定解析方式。
- 支持 `我是面试官`、`我是面试者`、`双视角` 三种输出模式。
- 生成结构化面试作战包，并支持下载 HTML。
- 支持文本虚拟面试：AI 根据用户回答动态追问。
- 虚拟面试结束后生成复盘 HTML。
- 预留后续增强：简历优化建议、专业领域实战例子、行业用法说明、语音虚拟面试。

## MVP 范围

第一版应优先完成：

1. 参数表单。
2. JD / 简历输入。
3. 结构化报告生成。
4. HTML 报告预览和下载。
5. 文本虚拟面试。
6. 面试复盘报告。
7. 敏感问题规避和辅助用途提示。

## 不做

- 不做实时语音面试。
- 不做用户账号、云端历史报告库或简历库。
- 不做企业 ATS 接入。
- 不做批量候选人筛选。
- 不做自动录用、淘汰或候选人排名。
- 不做真实面试中的实时作弊辅助。
- 不把简历优化改写放入第一版 MVP。

## 验收标准

- `/tools/ai-interview-coach` 可访问。
- `/tools` 工具频道有 AI 面试助手入口。
- 用户可填写 JD、简历和参数。
- 面试官 / 面试者 / 双视角模式输出不同内容。
- 生成的报告包含岗位能力地图、简历证据矩阵、面试题、参考答案、追问链、评分卡、风险提醒和反问建议。
- 用户可下载 HTML 报告。
- 用户可进入文本虚拟面试，完成至少 5 轮问答。
- 虚拟面试可根据回答继续追问，而不是只按固定题库输出。
- 面试结束后可生成复盘 HTML。
- 页面包含简历隐私和面试辅助用途说明。
- 相关测试、lint、typecheck、build、桌面端和移动端检查通过。

## 后续增强

- 简历优化建议：关键词补强、项目表达优化、成果量化和简历风险提示。
- 专业实战素材增强：在题纲中补充专业领域简单实战例子、行业用法说明和可迁移回答素材。
- 图片简历解析质量优化。
- 英文面试。
- 语音虚拟面试。
- 历史报告库。

## 领取说明

该任务当前不指定负责人。后续谁领取，谁需要先创建 `docs/tasks/claims/T107-<owner>.md`，并在领取前确认是否会与 AI 修图、AI 搜索、工具频道入口或平台 API 文件范围产生冲突。
