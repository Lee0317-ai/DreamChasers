# T148：TimePick URL 自动识别接入平台 AI Gateway

- 状态：已完成
- 负责人：Lee
- 创建日期：2026-06-08
- 优先级：P0
- 来源：IDEA-20260608-03

## 背景

T122 只完成了 TimePick 自动识别平台 AI 重做的规划入口，现有 `ResourceDialog` 和 `ResourceCard` 的“自动识别”仍走本地 `buildLocalRecognition()` 占位逻辑，不会进入账号、积分、日志和平台 AI Gateway。由于本地未配置图片模型，当前最适合先把 URL 自动识别这条 mock 可跑链路接到 Gateway。

## 文件范围

允许修改：

- `apps/web/src/lib/ai/**`
- `apps/web/src/app/api/ai/**`
- `apps/web/src/lib/timepick/**`
- `apps/web/src/app/api/timepick/**`
- `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceDialog.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`
- T148 相关文档

禁止修改：

- `apps/web/prisma/**`
- PDF 工具箱、AI 修图正式接线、游戏和部署脚本
- 真实网页抓取、OCR、Storage、Key Vault、支付、订阅和用户 provider key 持久化

## 验证方式

- `npm run test -w apps/web -- ai-gateway timepick-recognition`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- `npm run build`（TimePick）
- `npm run docs:sync`
- `git diff --check`

## 目标

- 新增 DreamChasers URL 自动识别 API，并内部走 AI Gateway `structured_extraction`。
- 新增 TimePick 自动识别 gateway 映射层，统一输入输出结构。
- 替换 TimePick `ResourceDialog` / `ResourceCard` 的本地识别按钮调用。
- 让第二条真实产品链路进入账号积分和 AI Gateway 请求日志。

## 实现记录

- 新增 `apps/web/src/lib/timepick/timepick-recognition.ts`：
  - `buildTimePickUrlRecognitionGatewayInput()` 统一构造 TimePick URL 自动识别的 `structured_extraction` 请求。
  - `buildTimePickUrlRecognitionOutput()` 把 Gateway 结果收敛回 TimePick 既有的 `title/content/img` 结构，并在结果缺字段时回退到 hostname 与来源链接。
- 新增 `POST /api/timepick/recognition/url`，复用 TimePick CORS、登录态校验和 `AiGatewayError` 返回格式。
- `apps/web/src/lib/ai/providers/mock-provider.ts` 已补 URL 识别场景的 `structured_extraction` mock 输出，可稳定返回基于 hostname 的标题和摘要。
- 新增 `apps/web/src/lib/timepick/__tests__/timepick-recognition.test.ts`，覆盖 Gateway 输入、识别输出和缺字段回退逻辑。
- TimePick 前端已新增 `recognizeTimePickUrl()`，并把以下入口从本地 `buildLocalRecognition()` 切到 DreamChasers API：
  - `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceDialog.tsx`
  - `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`

## 当前验证结果

- `npm run test -w apps/web -- ai-gateway mock-provider timepick-recognition timepick-fortune-chat`：通过，4 个测试文件 / 11 个测试。
- `npm run test -w apps/web -- account-ai-overview model-catalog ai-gateway account-ai-config mock-provider timepick-fortune-chat timepick-recognition`：通过，7 个测试文件 / 19 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过；路由清单中可见 `ƒ /api/timepick/recognition/url`。
- `npm run build`（TimePick）：通过。
- `npm run docs:sync`：通过。
- `git diff --check`（DreamChasers / TimePick）：通过。
- HTTP 烟测：
  - 未登录 `POST http://localhost:3100/api/timepick/recognition/url` 返回 `401 {"error":"请先登录。"}`。
- 真实成功烟测：
  - 桌面端 `ResourceDialog` 点击“自动识别”后，名称与内容描述会回填。
  - 移动端 `ResourceDialog` 点击“自动识别”后，名称与内容描述会回填。
  - 移动端 `ResourceCard` 点击“识别”后，会出现“已生成基础识别信息” toast。
  - 数据库验证最近三条 `AiGatewayRequestLog(timepick-url-recognition)` 为成功记录，平台积分账本按账本汇总从 `20` 扣减到 `17`。

## 后续可选扩展

- 如需更像真实识别结果，可再把 mock 输出替换为网页元信息抓取或真实 provider。
