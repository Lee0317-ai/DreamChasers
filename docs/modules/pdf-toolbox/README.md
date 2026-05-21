# PDF 工具箱模块说明

**最后更新**：2026-05-21  
**对应任务**：T015  
**负责人**：Codex / 开发 A  
**状态**：进行中，核心处理和部分扩展已实现

## 1. 模块目标

PDF 工具箱是第一阶段工具站的核心搜索刚需模块，目标是提供一组浏览器内完成的免费 PDF 页面级处理能力。

第一版优先解决这些场景：

- 用户上传一个或多个 PDF 后，可以看到文件和页数。
- 用户可以对页面做排序、删除、旋转、拆分和合并。
- 用户可以把处理结果下载到本地。
- 用户可以看到后续扩展能力入口，但不被误导为已经支持完整原文编辑。

## 2. 免费和付费边界

第一阶段免费：

- PDF 预览。
- PDF 合并。
- PDF 拆分。
- 删除页面。
- 页面排序。
- 页面旋转。
- PDF 转图片。
- 图片转 PDF。
- PDF 转 Word（Beta）。
- 添加水印。
- 添加签名。
- 区域遮盖：用于处理自己 PDF 中不需要的水印、遮挡或局部元素。
- 基础压缩。

后续限次或付费：

- 扫描版 PDF 转 Word 所需 OCR。
- 批量超大文件处理。
- 更高质量的版式还原。
- 需要服务端计算或 AI 模型的能力。

## 3. 暂时不做

- 不做完整 PDF 原文在线编辑。
- 不修改 PDF 内已有文字。
- 不修改 PDF 内已有图片。
- 不接商业 PDF SDK。
- 不上传用户文件到服务器。
- 不在第一版做 OCR。
- 不破解 PDF 权限，不移除他人版权标识，不做 AI 智能去水印。
- 不承诺 PDF 转 Word 对复杂版式、扫描件和表格的高质量还原。

## 4. MVP 分阶段范围

### 阶段 1：核心页面级处理

目标：先做最稳定、最常用、最容易验收的本地处理能力。

- 上传一个或多个 PDF。
- 展示文件名、大小、页数和基础状态。
- 预览页面缩略图。
- 页面选择。
- 删除页面。
- 页面排序。
- 页面旋转。
- 从选中页面生成新 PDF。
- 多文件合并。
- 下载处理结果。

### 阶段 2：水印、签名和图片互转

目标：补齐轻量办公刚需。

- 添加文字水印。
- 添加图片水印。
- 添加签名图片。
- 区域遮盖，用于处理自己文件中的水印、遮挡或不需要的局部元素。
- PDF 页面导出为图片。
- 图片合成为 PDF。

### 阶段 3：压缩和 PDF 转 Word Beta

目标：提供可见入口，但保持质量边界。

- 基础压缩，优先通过图片重采样和移除部分冗余对象实现。
- PDF 转 Word Beta，优先支持普通文本 PDF 的基础文本抽取和简单段落输出。
- 扫描版识别提示进入 OCR 后续能力，不在当前阶段实现。

## 5. 技术路线

- `PDF.js`：用于 PDF 解析、页数读取、页面渲染和缩略图预览。
- `pdf-lib`：用于合并、拆分、复制页面、旋转、添加水印和签名。
- 浏览器 `Canvas`：用于页面转图片、缩略图和后续基础压缩辅助。
- 浏览器 `Blob` / `URL.createObjectURL`：用于本地下载。
- Vitest：验证纯函数和 PDF 操作。

第一版实现原则：

- 处理逻辑放在 `apps/web/src/modules/tools/pdf-toolbox/lib/**`。
- React 组件放在 `apps/web/src/modules/tools/pdf-toolbox/components/**`。
- `apps/web/src/app/tools/pdf-toolbox/page.tsx` 只做路由入口和元数据。
- 文件读取和下载都在浏览器端完成。
- 对失败情况给出明确提示，例如文件损坏、加密 PDF、页数过多或浏览器内存不足。

## 6. 主要文件

计划新增：

- `apps/web/src/app/tools/pdf-toolbox/page.tsx`
- `apps/web/src/modules/tools/pdf-toolbox/index.ts`
- `apps/web/src/modules/tools/pdf-toolbox/types.ts`
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfToolbox.tsx`
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfUploader.tsx`
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfFileList.tsx`
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfPageGrid.tsx`
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfActionPanel.tsx`
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfResultBar.tsx`
- `apps/web/src/modules/tools/pdf-toolbox/lib/pdf-actions.ts`
- `apps/web/src/modules/tools/pdf-toolbox/lib/pdf-render.ts`
- `apps/web/src/modules/tools/pdf-toolbox/__tests__/pdf-actions.test.ts`

计划修改：

- `apps/web/src/components/portal-data.ts`

模块文档：

- `docs/modules/pdf-toolbox/README.md`
- `docs/modules/pdf-toolbox/IMPLEMENTATION_PLAN.md`
- `docs/modules/pdf-toolbox/PROGRESS.md`
- `docs/modules/pdf-toolbox/DECISIONS.md`
- `docs/modules/pdf-toolbox/HANDOFF.md`

协作文档：

- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/2026-05-21.md`
- `docs/completion/2026-05-21-task-15-pdf-toolbox-mvp.md`

## 7. 验证方式

开发验证命令：

```bash
npm run test -w apps/web -- pdf
npm run lint -w apps/web
npm run typecheck -w apps/web
npm run build -w apps/web
```

页面验收：

- `/tools/pdf-toolbox` 可以访问。
- 桌面端和移动端无明显溢出。
- 上传区域、页面缩略图、操作面板和下载结果状态清晰。
- 至少使用 1 个单页 PDF、1 个多页 PDF、2 个 PDF 合并样例做手动检查。
- 加密、损坏或不支持的文件有错误提示。

## 8. 遗留风险

- 浏览器内处理大 PDF 可能受内存限制，需要在 UI 上限制文件大小和页数。
- PDF 转 Word Beta 的质量不可控，必须保留明显 Beta 标识。
- PDF.js worker 配置和 Next.js 构建可能需要单独处理。
- `pdf-lib` 对压缩和复杂编辑能力有限，不能扩展成完整编辑器。
