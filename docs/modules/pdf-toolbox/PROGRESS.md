# PDF 工具箱过程记录

## 2026-05-21

- 已领取 T015。
- 已完成 PDF 工具箱模块规划。
- 已按 T026 规范迁移为独立模块文档目录：`docs/modules/pdf-toolbox/`。
- 已将计划代码范围调整为独立模块目录：`apps/web/src/modules/tools/pdf-toolbox/`。
- 已安装 `pdf-lib` 和 `pdfjs-dist`。
- 已完成核心页面级处理第一轮：
  - 新增 `/tools/pdf-toolbox` 真实工具页。
  - 新增独立代码模块 `apps/web/src/modules/tools/pdf-toolbox/`。
  - 支持上传 PDF、读取页数、渲染缩略图。
  - 支持页面选择、右旋/左旋、上移/下移、删除选中页面。
  - 支持下载当前 PDF 和拆分下载选中页面。
  - 支持从工具站 PDF 卡片和搜索结果进入真实工具页。
- 已完成验证：
  - `npm run test -w apps/web -- pdf`
  - `npm run lint -w apps/web`
  - `npm run typecheck -w apps/web`
  - `npm run build -w apps/web`
  - 桌面端和移动端浏览器检查。
- 遗留扩展：
  - PDF 转图片。
  - 基础压缩。
- 已完成阶段 5 部分扩展：
  - 文字水印。
  - 签名图片。
  - PDF 转 Word Beta，浏览器内抽取普通文本并下载 `.doc`，扫描件仍提示需要后续 OCR。
  - 区域遮盖：用白色矩形遮盖自己 PDF 中不需要的水印、遮挡或局部元素，不用于移除他人版权标识。
  - 图片扫描成 PDF：支持上传 PNG/JPG 拍照或扫描图片，按 A4 页面合成为 PDF 输出。
- 已完成验证：
  - `npm run test -w apps/web -- pdf`：通过，11 个测试通过。
  - `npm run typecheck -w apps/web`：通过。
  - `npm run lint -w apps/web`：通过，存在 Prisma 生成文件既有 warning。
  - `npm run build -w apps/web`：通过。
  - 浏览器检查：`http://127.0.0.1:3018/tools/pdf-toolbox` 已显示“遮盖区域”和“图片扫描成 PDF”；当前视窗无横向溢出；内置浏览器本轮未暴露文件选择器上传接口，下载动作由底层单测覆盖。
- 遗留扩展：
  - PDF 转图片。
  - 基础压缩。
- 下一步：继续补 PDF 转图片和基础压缩。

## 2026-06-03

- 修复 PDF 转 Word Beta 导出格式问题。
- 根因：旧实现抽取 PDF 文本后生成 HTML，并以 `.doc` / `application/msword` 下载；部分编辑器会直接把它识别为 HTML，且不符合用户预期的 Word 文档包。
- 修复：新增浏览器端最小 OOXML `.docx` 生成器，输出真实 ZIP/DOCX 包，包含 `[Content_Types].xml`、`_rels/.rels` 和 `word/document.xml`。
- 下载结果改为 `dreamchasers-pdf-to-word-beta.docx`，MIME 改为 `application/vnd.openxmlformats-officedocument.wordprocessingml.document`。
- 新增回归测试，断言生成结果以 DOCX ZIP 文件头 `PK` 开头，避免再次回退为 HTML 文档。
- 已完成验证：
  - `npm run test -w apps/web -- pdf`：通过，12 个测试通过。
  - `npm run typecheck -w apps/web`：通过。
  - `npm run lint -w apps/web`：通过，仍存在 Prisma 生成文件既有 warning。
  - `npm run build -w apps/web`：通过。
- 遗留：PDF 转 Word 仍是普通文本抽取 Beta，不做 OCR 和复杂版式还原。
