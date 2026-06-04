# T121 TimePick 资源卡片自动识别更新 API 切换完成记录

- 完成时间：2026-06-04
- 负责人：Lee
- 任务编号：T121

## 修改文件

- `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T121-timepick-resource-card-recognize-update-api-cutover.md`
- `docs/tasks/claims/T121-lee.md`
- `docs/tasks/NEXT_ID.md`
- `docs/progress/2026-06-04-lee.md`

## 实现内容

- TimePick API client 新增 `buildTimePickResourcePayload`，从现有 `Resource` 合成 DreamChasers `updateTimePickResource` 所需完整 payload。
- TimePick `ResourceCard.handleAutoRecognize` 的最终资源 metadata 写回改用 DreamChasers API client。
- 保留 Supabase Edge Function `auto-recognize`、识别图片下载和 Supabase Storage 上传，不在本任务内迁移。

## 验证命令

- `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx','utf8'); if (/\\.from\\('resources'\\)\\s*\\.update/.test(s)) process.exit(1)"`
- `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/ResourceCard.tsx`（TimePick）
- `npm run build`（TimePick）
- Kimi WebBridge 浏览器联调：创建临时资源、清理临时资源；旧 Coze 自动识别工作流已关闭，不要求识别成功。

## 验证结果

- 静态红灯：实现前 `ResourceCard` 存在 Supabase `.from('resources').update`，检查命令退出码 1。
- 静态绿灯：实现后检查命令退出码 0。
- TimePick 定向 ESLint 通过。
- TimePick build 通过，仅保留既有 large chunk warning。
- 浏览器联调中，临时资源 `T121 自动识别临时资源` 创建成功；Lee 确认旧识别能力依赖的 Coze 工作流已关闭，因此不继续要求旧 `auto-recognize` 成功或触发后续 DreamChasers PATCH。
- 临时资源 `cmpys15ie0004l3i8qe3kmbn4` 已通过 DreamChasers DELETE 清理，返回 200。

## 遗留问题

- `ResourceCard` 自动识别的 Edge Function 和识别图片 Storage 上传仍在 Supabase，后续需要单独拆任务迁移。
- 旧自动识别能力依赖的 Coze 工作流已关闭；后续需要单独拆任务，把自动识别重做为平台系统 AI 能力。
- 图片生成能力后续单独做 skill，不并入 T121。
