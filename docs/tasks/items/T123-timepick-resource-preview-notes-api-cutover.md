# T123：TimePick 资源预览心得保存 API 切换

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T120, T121
- 提出来源：IDEA-20260604-07
- 背景：T120 已提供 DreamChasers 资源基础编辑 API，`ResourcePreview` 预览弹窗中的“保存心得”仍直接调用 Supabase `.from('resources').update({ notes })`。
- 目标：让 TimePick `ResourcePreview` 保存心得走 DreamChasers API client。
- 不做：不改预览渲染；不替换资源文件打开/图片/视频预览；不迁移上传、自动识别、Storage、灵感、待办、抽签、标签管理、搜索或 Profile 统计；不导入历史数据；不修改 Prisma schema。
- 主要文件范围：`/Users/lee/Desktop/Lee/TimePick/src/components/ResourcePreview.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/components/ResourcePreview.tsx','utf8'); if (/from\\('resources'\\)\\s*\\.update/.test(s)) process.exit(1)"`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/ResourcePreview.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查资源预览保存心得；`npm run docs:sync`; `git diff --check`

## 实施范围

- 扩展 TimePick `buildTimePickResourcePayload`，允许覆盖 `notes`。
- TimePick `ResourcePreview.handleSaveNotes` 改用 DreamChasers `updateTimePickResource`。
- 移除 `ResourcePreview` 的 Supabase import。

## 完成记录

- 完成时间：2026-06-04
- 实现内容：`ResourcePreview` 保存心得不再直连 Supabase，改用 `updateTimePickResource(resource.id, buildTimePickResourcePayload(resource, { notes }))` 写回 DreamChasers API。
- 浏览器联调：Kimi WebBridge 打开 `http://localhost:8080/home`，在预览弹窗保存 `T123 浏览器联调心得：通过 ResourcePreview 保存，确认写入 DreamChasers API。`；最终有效请求 `PATCH http://localhost:3000/api/timepick/resources/cmpyslay20004wxi8bv44n3lm` 返回 200，响应体 `notes` 为保存文本；刷新后资源列表显示该心得；临时资源随后通过 `DELETE /api/timepick/resources/cmpyslay20004wxi8bv44n3lm` 返回 200 清理。
- 验证状态：静态检查、TimePick 定向 ESLint、TimePick build 已通过；文档同步和 diff 检查收尾执行。
