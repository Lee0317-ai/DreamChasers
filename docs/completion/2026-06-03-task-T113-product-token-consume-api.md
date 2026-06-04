# T113 产品型工具 token 消费接口完成记录

- 完成时间：2026-06-03
- 负责人：Lee
- 任务编号：T113
- 任务名称：产品型工具 token 消费接口

## 修改文件

- `apps/web/src/lib/account/**`
- `apps/web/src/app/api/account/products/[productSlug]/sessions/consume/route.ts`
- `docs/tasks/items/T113-product-token-consume-api.md`
- `docs/tasks/claims/T113-lee.md`
- `docs/progress/2026-06-03-lee.md`
- `docs/completion/2026-06-03-task-T113-product-token-consume-api.md`

## 实现内容

- 新增产品 session token 消费规则：必须未过期、未消费，并且产品 slug 匹配。
- 新增公开消费 API：`POST /api/account/products/[productSlug]/sessions/consume`。
- 消费成功后写入 `consumedAt`，返回 `userId`, `email`, `productSlug`, `consumedAt` 的最小用户声明。
- 消费失败统一返回 400，避免泄露 token 是否存在、是否过期或是否属于其他产品。

## 验证命令

- `npm run test -w apps/web -- product-session account`
- `npm run typecheck -w apps/web`
- `npm run lint -w apps/web`
- `npm run build -w apps/web`
- 手动生成拾光 TimePick token 后调用 consume API，并重复调用同一 token
- `git diff --check`

## 验证结果

- 产品 session 和账号测试通过：2 个测试文件，10 个测试用例。
- TypeScript 类型检查通过。
- ESLint 通过；Prisma 生成文件仍有 unused eslint-disable 警告，退出码为 0。
- 生产构建通过，并包含 `/api/account/products/[productSlug]/sessions/consume` 动态路由。
- 手动检查通过：拾光 TimePick token 首次消费返回用户声明，二次消费返回 400，token 不可重复使用。
- `git diff --check` 通过。

## 遗留问题

- 当前只完成平台侧 consume API；拾光 TimePick 和镜界 Wonderland 的外部产品侧接入需要新任务继续。
- 后续真实接入时需由产品后端把该用户声明换成产品自己的短期 session，并补充跨域回跳安全策略。
