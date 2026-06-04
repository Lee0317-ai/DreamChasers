# T139：TimePick 工具站入口补齐

- 状态：已完成
- 负责人：Lee
- 创建日期：2026-06-04
- 优先级：P0
- 来源：Lee 反馈工具站看不到 TimePick 入口

## 背景

TimePick 已完成多条 DreamChasers API 接入任务，但工具站 `/tools` 的卡片列表仍没有 TimePick 入口，用户无法从 DreamChasers 门户发现并进入 TimePick。

## 文件范围

允许修改：

- `apps/web/src/components/portal-data.ts`
- `apps/web/src/app/tools/timepick/**`
- T139 相关文档

禁止修改：

- TimePick 外部仓库业务代码
- PDF 工具箱、AI 修图、游戏业务代码
- 账号认证和 AI Gateway 运行时代码

## 实现内容

- 在工具站卡片列表新增 TimePick。
- 新增 `/tools/timepick` 跳转页，本地默认跳转 `http://localhost:8080/home`。
- 预留 `TIMEPICK_APP_URL`，后续生产环境可通过环境变量指向正式 TimePick 地址。

## 验证结果

- `/tools` HTTP 检查返回 200，页面包含 `TimePick`。
- `/tools/timepick` HTTP 检查返回 307，`location=http://localhost:8080/home`。
- `npm run typecheck`：通过。
- `npm run docs:sync`：通过。
