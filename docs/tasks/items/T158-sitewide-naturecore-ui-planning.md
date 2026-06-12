# T158：全站 Naturecore 视觉统一规划与落地

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 依赖：T022, T025, T141, T157
- 创建日期：2026-06-12
- 来源：Lee 在 T157 账号中心视觉确认后，要求整个网站都按该风格优化，并允许首页加入背景
- 涉及模块：公开门户 / 首页 / 工具频道 / 游戏频道 / 认证页 / 账号中心 / 全站视觉系统
- 主要文件范围：`apps/web/src/app/**`, `apps/web/src/components/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/web/src/modules/games/hulebu/**`, `apps/web/src/app/globals.css`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/progress/2026-06-12-lee.md`, `docs/completion/**`
- 验证方式：`npm run test -w apps/web -- account-ai-overview model-catalog ai-gateway account-ai-config pdf hulebu`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`; 桌面端和移动端浏览器检查首页、工具页、游戏页、登录页、账号页

## 目标

- 将 T157 确认的 Naturecore 动态深色风格扩展到全站。
- 首页可以使用更强的背景图、动态背景或沉浸式首屏。
- 工具、游戏、账号、登录注册等页面保持统一的深色、金色/青色点缀、鼠标反馈和卡片层次。
- 保留工具工作台和游戏页的可用性，不为了视觉统一破坏核心操作效率。

## 不做

- 不修改 AI Gateway 运行时、provider、积分扣减和 Prisma schema。
- 不新增真实支付、订阅、后台管理或模型接入。
- 不重做 PDF 工具箱和 AI 修图工具的业务逻辑。
- 不改 TimePick 外部仓库。
- 不做完整品牌系统手册，只完成本轮可落地的页面视觉方案和实现计划。

## 当前计划

- 先通过浏览器可视化伴随展示 2-3 个全站视觉方向。
- Lee 确认方向后，写入设计稿和实施计划。
- 再进入真实代码落地与浏览器验收。

## 实现记录

- Lee 已确认可视化方案 C：`Hybrid Portal`。
- 已新增正式设计稿 `docs/superpowers/specs/2026-06-12-sitewide-naturecore-ui-design.md`。
- 已新增实施计划 `docs/superpowers/plans/2026-06-12-sitewide-naturecore-ui.md`。
- 首页 `/` 已从左右分栏改为沉浸式 Naturecore Portal：
  - 深色背景；
  - 月环 / portal 主视觉；
  - 森林层次背景；
  - 工具站和游戏馆双入口玻璃卡片。
- 公开站内页已统一为深色控制台：
  - 顶部导航玻璃化；
  - `/tools` 和 `/games` 频道页统一为深色金青视觉；
  - 搜索框、筛选 tabs、卡片、tag、modal 统一到 Naturecore 组件风格。
- 认证页 `/login`、`/register`、找回密码、重置密码沿用原表单逻辑，统一为深色玻璃面板。
- 账号中心保留 T157 控制台样式，并补齐移动端长 provider 文案换行。
- 未修改 AI Gateway 运行时、Prisma schema、TimePick 外部仓库、PDF 业务逻辑或游戏 runtime。

## 验证结果

- `npm run test -w apps/web -- account-ai-overview model-catalog ai-gateway account-ai-config pdf hulebu`：通过，8 个测试文件 / 35 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- 右侧内置浏览器桌面端检查 `/`、`/tools`、`/games`、`/login`、`/account/ai/credits`：通过。
- 右侧内置浏览器移动端检查 `/`、`/tools`、`/games`、`/login`、`/account/ai/credits`：通过。
- 移动端复查 `/` 与 `/account/ai/credits`：无横向溢出。
- `npm run docs:sync`：通过。
- `git diff --check`：未通过。阻塞来自仓库内既有 Prisma generated 文件尾随空格噪音，不是本次全站 UI 统一新增。
- `git diff --check -- <T158 涉及文件>`：通过。
