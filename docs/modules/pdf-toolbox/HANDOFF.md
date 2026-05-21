# PDF 工具箱交接说明

## 当前状态

- 任务：T015
- 状态：进行中
- 当前阶段：核心页面级处理、文字水印、签名、PDF 转 Word Beta、区域遮盖和图片扫描成 PDF 已完成，扩展能力继续补齐。

## 下一位开发者需要先读

1. `docs/modules/pdf-toolbox/README.md`
2. `docs/modules/pdf-toolbox/IMPLEMENTATION_PLAN.md`
3. `docs/modules/pdf-toolbox/PROGRESS.md`
4. `docs/tasks/CLAIMS.md`
5. `docs/status/CURRENT_STATUS.md`

## 关键边界

- 不做完整 PDF 原文在线编辑。
- 不做 OCR。
- 不上传用户 PDF 到服务器。
- PDF 转 Word 只能标记为 Beta。
- PDF 去水印只表达为自有 PDF 的区域遮盖，不破解权限，不移除他人版权标识，不做 AI 智能去水印。
- 路由层只做入口，业务代码必须放在 `apps/web/src/modules/tools/pdf-toolbox/`。

## 当前风险

- PDF.js worker 与 Next.js 构建可能需要额外配置。
- 浏览器内处理大文件可能受内存限制。
- 后续新增依赖会改 `package.json` 和 `package-lock.json`，需要先同步 T015 文件范围。

## 已完成实现

- `/tools/pdf-toolbox` 真实工具页。
- `apps/web/src/modules/tools/pdf-toolbox/` 独立代码模块。
- PDF 上传、页数读取和缩略图预览。
- 页面选择、旋转、排序、删除。
- 下载当前 PDF。
- 拆分并下载选中页面。
- 工具站 PDF 卡片和搜索结果指向真实工具页。

## 已完成扩展

- 文字水印。
- 签名图片。
- PDF 转 Word Beta，当前只做普通文本抽取，不做 OCR。
- 区域遮盖，用于处理自己 PDF 中不需要的水印、遮挡或局部元素。
- 图片扫描成 PDF，支持 PNG/JPG 按 A4 页面合成为 PDF。

## 待做扩展

- PDF 转图片。
- 基础压缩。
