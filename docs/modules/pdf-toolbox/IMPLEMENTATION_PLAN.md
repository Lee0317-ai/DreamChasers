# PDF 工具箱实施计划

**日期**：2026-05-21  
**对应任务**：T015  
**负责人**：Codex / 开发 A  
**状态**：进行中，核心处理和部分扩展已实现

## 1. 目标

实现一个可访问、可验证、浏览器内处理的 PDF 工具箱 MVP。第一轮以页面级处理为核心，后续继续补 PDF 转图片和基础压缩。

## 2. 当前前置状态

- `/tools` 已有 PDF 工具箱卡片和说明弹窗。
- 还没有真实工具页 `/tools/pdf-toolbox`。
- 还没有 PDF 独立代码模块 `apps/web/src/modules/tools/pdf-toolbox/`。
- `docs/modules/pdf-toolbox/README.md` 已补充模块边界。

## 3. 文件范围

允许修改：

- `apps/web/src/app/tools/pdf-toolbox/**`
- `apps/web/src/modules/tools/pdf-toolbox/**`
- `apps/web/src/components/portal-data.ts`
- `docs/modules/pdf-toolbox/**`
- `docs/tasks/**`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/2026-05-21.md`
- `docs/completion/**`

禁止修改：

- `packages/**`
- `apps/game/**`
- `apps/web/prisma/**`
- `apps/web/src/components/tools/photo/**`
- `apps/web/src/lib/tools/photo/**`
- `docker-compose.yml`
- `package.json`
- `package-lock.json`，除非后续新增 PDF 依赖并单独说明

## 4. 代码模块结构

PDF 工具箱必须使用独立代码模块：

```text
apps/web/src/modules/tools/pdf-toolbox/
  components/
  lib/
  types.ts
  index.ts
  __tests__/
```

路由入口：

```text
apps/web/src/app/tools/pdf-toolbox/page.tsx
```

路由入口只负责页面元数据和引入 `PdfToolbox`，不写 PDF 业务逻辑。

## 5. 实施阶段

### 阶段 0：依赖确认

检查是否已有 PDF 相关依赖。若缺少，计划安装：

- `pdf-lib`
- `pdfjs-dist`

安装依赖前需确认本地网络和锁文件改动，完成后把 `package.json` 与 `package-lock.json` 纳入 T015 修改范围。

### 阶段 1：纯逻辑和测试

新增：

- `apps/web/src/modules/tools/pdf-toolbox/types.ts`
- `apps/web/src/modules/tools/pdf-toolbox/lib/pdf-actions.ts`
- `apps/web/src/modules/tools/pdf-toolbox/__tests__/pdf-actions.test.ts`

先覆盖：

- 创建测试 PDF。
- 合并两个 PDF。
- 拆分指定页面。
- 删除页面。
- 旋转页面。
- 页面重新排序。

验收：

```bash
npm run test -w apps/web -- pdf
```

### 阶段 2：页面渲染和上传状态

新增：

- `apps/web/src/modules/tools/pdf-toolbox/lib/pdf-render.ts`
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfUploader.tsx`
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfFileList.tsx`
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfPageGrid.tsx`

能力：

- 支持拖拽和点击上传。
- 展示文件名、大小、页数。
- 渲染 PDF 页面缩略图。
- 标记选中页面、旋转角度和删除状态。

验收：

- 单页和多页 PDF 能显示页数。
- 缩略图失败时有备用状态。
- 移动端页面网格不溢出。

### 阶段 3：工具台交互

新增：

- `apps/web/src/modules/tools/pdf-toolbox/components/PdfActionPanel.tsx`
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfResultBar.tsx`
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfToolbox.tsx`
- `apps/web/src/modules/tools/pdf-toolbox/index.ts`
- `apps/web/src/app/tools/pdf-toolbox/page.tsx`

能力：

- 删除选中页面。
- 左旋/右旋选中页面。
- 上移/下移页面。
- 拆分并下载选中页面。
- 合并多个 PDF。
- 下载处理结果。

验收：

- `/tools/pdf-toolbox` 可访问。
- 所有按钮在无文件、无选择、处理中、处理完成时状态正确。
- 处理失败时不丢失用户当前文件状态。

### 阶段 4：入口联动

修改：

- `apps/web/src/components/portal-data.ts`

能力：

- PDF 工具箱卡片指向 `/tools/pdf-toolbox`。
- 搜索结果指向真实工具页。
- 保留 `/tools` 卡片介绍，但主要行动入口进入工具页。

验收：

- 从 `/tools` 能进入 PDF 工具页。
- 搜索下拉里的 PDF 结果能进入 PDF 工具页。

### 阶段 5：扩展能力

按风险从低到高补齐：

1. 文字水印。
2. 图片水印。
3. 签名图片。
4. 图片转 PDF。
5. PDF 转图片。
6. 基础压缩。
7. PDF 转 Word Beta。

如果时间不足，阶段 5 可以拆成后续任务，但页面要明确哪些功能是“即将上线”或“Beta”。

## 6. UI 结构

页面建议分为四个区：

- 顶部：工具标题、隐私说明、Beta 边界提示。
- 左侧或上方：上传区和文件列表。
- 中部：页面缩略图网格。
- 右侧或底部：操作面板和下载结果。

移动端：

- 上传区、文件列表、页面网格、操作面板纵向排列。
- 操作按钮使用固定尺寸，避免文字挤压。
- 处理结果栏跟随内容，不固定遮挡页面。

## 7. 验证命令

每个代码阶段至少运行：

```bash
npm run test -w apps/web -- pdf
npm run typecheck -w apps/web
```

最终验收运行：

```bash
npm run test -w apps/web -- pdf
npm run lint -w apps/web
npm run typecheck -w apps/web
npm run build -w apps/web
```

前端页面完成后还要检查：

- 桌面端。
- 移动端。
- 文案不溢出。
- 主要按钮可点击。
- 上传失败、处理失败和空状态可理解。

## 8. 完成记录要求

T015 完成后新增：

- `docs/completion/2026-05-21-task-15-pdf-toolbox-mvp.md`

完成记录必须包含：

- 任务编号。
- 负责人。
- 修改文件。
- 实现内容。
- 验证命令。
- 验证结果。
- 遗留问题。
