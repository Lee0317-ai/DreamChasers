# T125 TimePick 搜索页 API 切换完成记录

- 完成时间：2026-06-04
- 负责人：Lee
- 任务编号：T125
- 任务名称：TimePick 搜索页 API 切换

## 修改文件

- `apps/web/src/lib/timepick/timepick-api-rules.ts`
- `apps/web/src/lib/timepick/timepick-api.ts`
- `apps/web/src/lib/timepick/__tests__/timepick-api.test.ts`
- `apps/web/src/app/api/timepick/search/route.ts`
- `apps/web/src/app/api/timepick/search/history/route.ts`
- `apps/web/src/app/api/timepick/search/history/[historyId]/route.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/pages/SearchPage.tsx`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T125-timepick-search-api-cutover.md`
- `docs/tasks/claims/T125-lee.md`
- `docs/progress/2026-06-04-lee.md`

## 实现内容

- 新增 TimePick 搜索规则：关键词规范化、资源字段匹配、搜索历史映射和历史删除 owner 校验。
- 新增 DreamChasers TimePick 搜索 API：
  - `GET /api/timepick/search`
  - `GET /api/timepick/search/history`
  - `POST /api/timepick/search/history`
  - `DELETE /api/timepick/search/history/[historyId]`
- 搜索资源仅返回当前用户资源，匹配 `name`、`notes`、`url`、`content` 和 `tags`。
- 搜索历史写入会规范化关键词，并先删除同用户同关键词旧记录再创建新记录，保持历史列表去重和最新排序。
- TimePick `SearchPage` 已改用 DreamChasers API client，不再直接调用 Supabase `resources` 或 `search_history`。

## 验证命令

- `npm run test -w apps/web -- timepick-api`：通过
- `npm run test -w apps/web -- timepick account`：通过
- `npm run typecheck -w apps/web`：通过
- `npm run build -w apps/web`：通过
- `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/pages/SearchPage.tsx','utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('search_history'\\)|\\.from\\('resources'\\)/.test(s)) process.exit(1)"`：通过
- `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/pages/SearchPage.tsx`（TimePick）：通过
- `npm run build`（TimePick）：通过
- Kimi WebBridge 真实浏览器联调：通过

## 验证结果

- 搜索 `t125-search-tag` 返回临时资源 `T125 搜索临时资源`。
- 网络确认 `POST /api/timepick/search/history` 201、`GET /api/timepick/search/history` 200、`GET /api/timepick/search?keyword=t125-search-tag` 200。
- 清空关键词后历史显示 `t125-search-tag`。
- 删除历史触发 `DELETE /api/timepick/search/history/cmpyu31sv00093si83x9pxfrj` 200，历史列表清空。
- 临时资源 `cmpyu2pnb00083si8zsgiv7rg` 已通过 DreamChasers resources API 删除清理。

## 遗留问题

- 本任务不迁移灵感、待办、抽签、Profile、上传/Storage、自动识别、角色选择或其他 Supabase 链路。
- 搜索仍是基础字段匹配，不做全文检索索引、排序权重或 AI 搜索。
