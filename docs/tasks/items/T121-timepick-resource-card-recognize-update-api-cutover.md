# T121：TimePick 资源卡片自动识别更新 API 切换

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T119, T120
- 提出来源：IDEA-20260604-05
- 背景：T119 已把 `ResourceCard` 删除资源切到 DreamChasers API，T120 已把 `ResourceDialog` 基础新增/编辑保存切到 DreamChasers API。`ResourceCard` 自动识别成功后的资源标题、内容和缩略图写回仍直接调用 Supabase `resources.update`。Lee 确认旧自动识别 AI 能力之前依赖 Coze 工作流，但该工作流已经关闭，后续会重新优化并嵌入平台系统 AI 能力。
- 目标：让 TimePick `ResourceCard` 自动识别后的资源 metadata 更新走 DreamChasers API client。
- 不做：不替换 Supabase Edge Function `auto-recognize`；不替换识别图片下载上传和 Supabase Storage；不迁移上传、灵感、待办、抽签、标签管理、搜索或 Profile 统计；不导入历史数据；不修改 Prisma schema；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 主要文件范围：`/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx','utf8'); if (/\\.from\\('resources'\\)\\s*\\.update/.test(s)) process.exit(1)"`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/ResourceCard.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器只检查临时资源创建/清理，不要求旧 Coze 自动识别成功；`npm run docs:sync`; `git diff --check`

## 实施范围

- TimePick API client 新增从现有 `Resource` 合成完整更新 payload 的 helper。
- TimePick `ResourceCard.handleAutoRecognize` 的最终资源写回改用 DreamChasers `updateTimePickResource`。
- 保留 `auto-recognize` Edge Function、识别图片下载和 Supabase Storage 上传，后续单独拆任务。

## 当前进展

- 2026-06-04：任务创建并领取；准备先运行静态红灯检查，确认旧 Supabase update 仍存在。
- 2026-06-04：完成 `ResourceCard` 自动识别结果写回切换；Supabase Edge Function 和 Storage 上传仍保留旧链路。

## 完成记录

- 完成时间：2026-06-04
- TimePick API client 新增 `buildTimePickResourcePayload`，用于从现有 `Resource` 合成 DreamChasers 更新 payload，避免写回识别结果时丢失 section、folder、url、notes、tags、source inspiration、file size 等字段。
- TimePick `ResourceCard.handleAutoRecognize` 的最终资源写回改为 `updateTimePickResource(resource.id, buildTimePickResourcePayload(resource, updateData))`。
- 保留 Supabase Edge Function `auto-recognize`、识别图片下载和 Supabase Storage 上传，后续单独拆任务。
- 静态红绿检查确认：实现前 `ResourceCard` 存在 `.from('resources').update`，检查失败；实现后检查通过。
- Kimi WebBridge 浏览器联调确认：临时资源 `T121 自动识别临时资源` 创建成功。Lee 确认旧识别能力依赖的 Coze 工作流已关闭，因此不继续要求旧 `auto-recognize` 成功或触发后续 PATCH；临时资源 `cmpys15ie0004l3i8qe3kmbn4` 已通过 DreamChasers DELETE 清理，返回 200。
- 验证结果：静态红绿检查、TimePick 定向 ESLint、TimePick `npm run build` 已通过。
