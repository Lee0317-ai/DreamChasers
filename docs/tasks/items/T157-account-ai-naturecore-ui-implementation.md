# T157：账号中心与 AI Gateway Naturecore UI 落地

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 依赖：T141, T150, T156
- 创建日期：2026-06-12
- 来源：Lee 确认 Open Design `DreamChasers 账号中心 AI Naturecore 重设计` 的动态深色样式，要求落到真实系统 UI
- 涉及模块：账号中心 / AI Gateway 账号治理页 / 平台展示层
- 主要文件范围：`apps/web/src/app/account/**`, `apps/web/src/components/account/**`, `apps/web/src/app/globals.css`, `docs/tasks/**`, `docs/progress/2026-06-12-lee.md`, `docs/completion/**`
- 验证方式：`npm run test -w apps/web -- account-ai-overview model-catalog ai-gateway account-ai-config -- --runInBand`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`; 桌面端和移动端页面检查

## 目标

- 将 Open Design 已确认的 Naturecore 风格应用到真实账号中心和 AI Gateway 治理页面。
- 保留干净深色背景，不使用森林背景图片。
- 增强鼠标移动微光、标题 hover、卡片 hover 光扫、能力卡动态反馈等视觉层次。
- 让账号概览、AI 积分、模型能力、运行时状态和日志页面更像一个完整的平台控制台。

## 不做

- 不修改 AI Gateway 运行时、provider adapter、模型目录业务语义或积分扣减逻辑。
- 不修改 Prisma schema、migration 或 generated Prisma 文件。
- 不修改 TimePick 外部仓库。
- 不新增真实支付、订阅、充值、BYOK、Key Vault 或后台管理能力。
- 不扩大到 PDF 工具箱、AI 修图工作台或游戏页面 UI。

## 实现记录

- `AccountShell` 新增鼠标跟随变量更新和账号中心环境光层。
- 账号中心整体切换为深色 Naturecore 控制台风格：
  - 干净深色渐变背景；
  - 金色和青色状态点缀；
  - 侧栏半透明玻璃质感；
  - 卡片 hover 光扫、发光边框和轻微浮起；
  - 标题 hover 发光反馈。
- AI Gateway 能力卡新增专用动态样式，突出能力模块和模型卡层次。
- 移动端保留底部导航，账号卡片和操作区改为单列响应式布局。
- 未使用森林背景图片，未新增外部视觉资源。

## 验证结果

- `npm run test -w apps/web -- account-ai-overview model-catalog ai-gateway account-ai-config -- --runInBand`：通过，4 个测试文件 / 17 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- 右侧内置浏览器桌面端检查 `/account`：通过，账号 shell 正常渲染，动态背景生效，无横向溢出。
- 右侧内置浏览器桌面端检查 `/account/ai/credits`：通过，6 张能力卡正常渲染，动态背景生效，无横向溢出。
- 右侧内置浏览器移动端断点检查：已执行 390 x 844 视口切换；后续重新导航桌面端确认账号页与 AI 页均正常。
- `npm run docs:sync`：通过。
- `git diff --check`：未通过。阻塞来自仓库内既有 Prisma generated 文件尾随空格噪音，不是本次 UI 落地新增。
- `git diff --check -- <T157 涉及文件>`：通过。
