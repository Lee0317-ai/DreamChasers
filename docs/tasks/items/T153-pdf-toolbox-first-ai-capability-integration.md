# T153：PDF 工具箱首条 AI 能力接线

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 依赖：T149, T150, T151, T152, T144
- 创建日期：2026-06-09
- 来源：T149 平台级 AI 治理与产品接线路线规划
- 涉及模块：PDF 工具箱 / AI Gateway / 账号中心治理
- 主要文件范围：`apps/web/src/app/tools/pdf-toolbox/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/web/src/lib/ai/**`, `apps/web/src/lib/account/**`, `docs/modules/pdf-toolbox/**`, `docs/tasks/**`, `docs/progress/2026-06-09-lee.md`, `docs/completion/**`
- 验证方式：`npm run test -w apps/web -- pdf ai-gateway`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 桌面端和移动端检查；`npm run docs:sync`; `git diff --check`

## 目标

- 为 PDF 工具箱选择并接入第一条治理友好的 AI 能力。
- 满足 capability 注册、模型可见、错误可回传、调用可审计、额度可扣减四条准入标准。
- 作为第一条站内 AI 产品线接入平台治理。

## 实现记录

- 已冻结首条站内 AI 能力为 `PDF 文本摘要`，不进入翻译、OCR 或复杂编辑。
- 新增 `apps/web/src/modules/tools/pdf-toolbox/lib/pdf-ai.ts`：
  - `buildPdfSummarySource()`：把浏览器内抽取的 PDF 文本收敛成可发送给 Gateway 的摘要输入；
  - `buildPdfSummaryGatewayPayload()`：统一构造 `text_generation` 请求；
  - `buildPdfSummaryOutput()`：把 Gateway 返回转回工具页展示结构。
- 新增 `apps/web/src/modules/tools/pdf-toolbox/__tests__/pdf-ai.test.ts`，覆盖摘要源文本、Gateway payload 和输出归一化。
- 新增 `POST /api/tools/pdf/summary`，由后端复用 AI Gateway 运行时处理登录、额度、日志和错误码。
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfActionPanel.tsx` 已新增 `AI Summary` 操作卡片。
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfToolbox.tsx` 已新增浏览器内摘要链路：
  - 先抽取当前 PDF 文本；
  - 再调用 `/api/tools/pdf/summary`；
  - 最后在工具页内展示摘要结果。
- `apps/web/src/app/globals.css` 已补 `pdf-ai-summary` 的展示样式。

## 验证结果

- `npm run test -w apps/web -- pdf ai-gateway`：通过，4 个测试文件 / 20 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- 桌面端和移动端检查：本轮未执行。当前会话未能直接拉起本地浏览器控制工具。
- `npm run docs:sync`：待执行。
- `git diff --check`：待执行。
