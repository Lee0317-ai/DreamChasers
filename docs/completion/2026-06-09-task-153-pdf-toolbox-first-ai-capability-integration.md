# T153 PDF 工具箱首条 AI 能力接线完成记录

- 完成时间：2026-06-09
- 负责人：Lee
- 任务编号：T153
- 任务名称：PDF 工具箱首条 AI 能力接线

## 修改文件

- `apps/web/src/modules/tools/pdf-toolbox/lib/pdf-ai.ts`
- `apps/web/src/modules/tools/pdf-toolbox/__tests__/pdf-ai.test.ts`
- `apps/web/src/app/api/tools/pdf/summary/route.ts`
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfActionPanel.tsx`
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfToolbox.tsx`
- `apps/web/src/app/globals.css`
- `docs/modules/pdf-toolbox/PROGRESS.md`
- `docs/tasks/items/T153-pdf-toolbox-first-ai-capability-integration.md`
- `docs/tasks/claims/T153-lee.md`
- `docs/progress/2026-06-09-lee.md`

## 实现内容

- 选择 `PDF 文本摘要` 作为第一条站内 AI 能力。
- 保持浏览器内文本抽取，避免新增文件上传型后端处理。
- 新增 `/api/tools/pdf/summary`，由后端复用 AI Gateway `text_generation`、账号登录态、积分扣减、请求日志和统一错误结构。
- 在 PDF 工具页新增 `AI Summary` 操作卡片和摘要结果展示区块。

## 验证命令

```bash
npm run test -w apps/web -- pdf ai-gateway
npm run typecheck -w apps/web
npm run build -w apps/web
npm run docs:sync
git diff --check
```

## 验证结果

- DreamChasers 测试通过：4 个测试文件 / 20 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- 桌面端和移动端检查：本轮未执行，当前会话未能直接拉起本地浏览器控制工具。
- `npm run docs:sync`：待执行。
- `git diff --check`：待执行。

## 遗留问题

- 真实桌面端和移动端浏览器检查仍需补跑。
- 扫描件 OCR、翻译和复杂摘要导出继续留在后续任务，不在本次范围内。
