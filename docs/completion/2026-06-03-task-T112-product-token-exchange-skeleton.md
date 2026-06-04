# T112 产品型工具 token exchange 骨架完成记录

- 完成时间：2026-06-03
- 负责人：Lee
- 任务编号：T112
- 任务名称：产品型工具 token exchange 骨架

## 修改文件

- `apps/web/src/lib/account/**`
- `apps/web/src/app/api/account/products/**`
- `apps/web/src/components/account/ProductSessionManager.tsx`
- `apps/web/src/app/account/page.tsx`
- `docs/tasks/**`
- `docs/progress/2026-06-03-lee.md`
- `docs/completion/2026-06-03-task-T112-product-token-exchange-skeleton.md`

## 实现内容

- 新增默认产品定义：拾光 TimePick 和镜界 Wonderland。
- 新增产品 session token 规则：`dc_product_` 前缀、hash 存储、10 分钟过期。
- 新增受保护 API：`POST /api/account/products/[productSlug]/sessions`。
- 账号中心产品区新增生成 token 按钮，明文 token 只展示一次。
- 产品 session 创建后写入 `product_session_created` 审计记录。

## 验证命令

- `npm run test -w apps/web -- product-session account`
- `npm run typecheck -w apps/web`
- `npm run lint -w apps/web`
- `npm run build -w apps/web`
- Kimi WebBridge 打开 `/account` 并点击拾光 TimePick 的生成 token
- `git diff --check`

## 验证结果

- 产品 session 和账号测试通过：2 个测试文件，9 个测试用例。
- TypeScript 类型检查通过。
- ESLint 通过；Prisma 生成文件仍有 unused eslint-disable 警告，退出码为 0。
- 生产构建通过，并包含 `/api/account/products/[productSlug]/sessions` 动态路由。
- 浏览器检查通过：账号中心可生成拾光 TimePick token，显示 10 分钟过期时间，明文只展示一次。
- `git diff --check` 通过。

## 遗留问题

- 当前只是主站 token exchange 骨架，拾光/镜界尚未实现消费 token、回调和产品会话落地。
- token 消费接口、一次性消费状态更新和跨域安全策略需要在拾光真实接入任务中继续实现。
