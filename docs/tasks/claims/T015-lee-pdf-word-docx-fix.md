# T015：PDF 工具箱 PDF 转 Word Beta 导出格式修复

- 领取人：Lee
- 领取时间：2026-06-03
- 状态：待验收
- 预计完成：2026-06-03
- 允许修改文件：`apps/web/src/modules/tools/pdf-toolbox/**`, `apps/web/src/app/tools/pdf-toolbox/**`, `apps/web/package.json`, `package-lock.json`, `docs/modules/pdf-toolbox/**`, `docs/tasks/claims/T015-lee-pdf-word-docx-fix.md`, `docs/progress/2026-06-03-lee.md`
- 禁止修改文件：`packages/**`, `apps/game/**`, `apps/web/prisma/**`, `apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**`, `docker-compose.yml`, `package.json`
- 验证命令：`npm run test -w apps/web -- pdf`; `npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 桌面端和移动端检查按本次代码修复风险择机执行
- 当前阻塞：无
- 下一步：已修复 `.doc` 实际为 HTML 的问题，改为生成真实 `.docx` OOXML 包并补回归测试；等待验收。
- 备注：本次只修 PDF 转 Word Beta 的导出文件格式，不扩展 OCR、复杂版式还原或 PDF 转图片/压缩能力。
