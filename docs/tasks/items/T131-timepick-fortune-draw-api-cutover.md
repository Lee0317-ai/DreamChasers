# T131：TimePick 首页每日抽签弹窗 API 切换

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T114, T115, T130
- 提出来源：IDEA-20260604-15
- 背景：T115 已让 TimePick 使用 DreamChasers 登录态，T130 已把 Profile 资料和出生日期保存切到 DreamChasers API。首页 `FortuneDrawDialog` 仍直接读取 Supabase `profiles`、更新 `profiles.birth_date`，并调用 Supabase Edge Function `draw-fortune`。
- 目标：让首页每日抽签弹窗的出生日期检查、出生日期保存、每日抽签读取/生成和缓存走 DreamChasers API，并复用 `TimePickProfile` 与 `TimePickFortuneDraw` 模型。
- 不做：不迁移 `/fortune` 运势聊天页；不接入 Supabase Edge Function `fortune-agent`；不接真实 AI 模型、图片生成、Storage 或上传；不修改 Prisma schema；不导入历史抽签数据；不重做抽签弹窗 UI。
- 主要文件范围：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/fortune/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/FortuneDrawDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Fortune.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ModuleDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceTree.tsx`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/components/FortuneDrawDialog.tsx','utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('profiles'\\)|functions\\.invoke\\('draw-fortune'\\)/.test(s)) process.exit(1);"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/timepick-api.ts src/components/FortuneDrawDialog.tsx`（TimePick）；`npm run build`（TimePick）；真实浏览器检查未设置生日提示、保存生日、抽签结果和同日缓存；`npm run docs:sync`; `git diff --check`

## 实施范围

- DreamChasers 增加每日抽签规则、服务函数和 `POST /api/timepick/fortune/draw`。
- TimePick API client 增加每日抽签方法。
- TimePick `FortuneDrawDialog` 移除 Supabase profile 和 `draw-fortune` Edge Function 直连，改用 DreamChasers profile/fortune API。

## 当前记录

- 开始时间：2026-06-04
- 当前状态：待验收。
- 完成记录：
  - DreamChasers 已新增每日抽签规则、服务函数和 `POST /api/timepick/fortune/draw`，未设置生日返回 409，已设置生日时按当天 `drawDate` 读取或创建 `TimePickFortuneDraw`。
  - TimePick `FortuneDrawDialog` 已移除 Supabase profile 和 `draw-fortune` Edge Function 直连；生日读取/保存复用 DreamChasers profile API，抽签结果使用 DreamChasers fortune API。
  - 浏览器/API 联调确认：未设置生日抽签返回 409；保存临时生日返回 200；首次抽签返回 201 且 `cached: false`；同日再次抽签返回 200 且 `cached: true`，两次 draw id 一致；首页点击抽签按钮显示每日运势弹窗。临时 session、抽签记录和生日已清理。
- 下一步：等待验收；`/fortune` 运势聊天页、上传/Storage、自动识别和模块树仍待后续单独迁移。
