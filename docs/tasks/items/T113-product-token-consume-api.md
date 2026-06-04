# T113：产品型工具 token 消费接口

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T108, T110, T112
- 背景：T112 已能在账号中心为拾光/镜界生成 10 分钟有效的一次性产品 token。独立产品接入前，平台侧还需要提供消费 token 的接口，让产品后端用 token 换取平台用户身份声明，并防止 token 重复使用。
- 目标：新增产品 token consume API，验证 token hash、产品归属、过期时间和消费状态；成功后写入 `consumedAt`，返回最小用户身份声明。
- 不做：不修改拾光或镜界外部代码；不实现跨域 cookie；不签发产品自己的长期 session；不接 AI Gateway；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 主要文件范围：`apps/web/src/lib/account/**`, `apps/web/src/app/api/account/products/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 验证方式：`npm run test -w apps/web -- product-session account`; `npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`

## 实施范围

- 新增 token 消费规则：未过期、未消费、产品匹配才可消费。
- 新增 `POST /api/account/products/[productSlug]/sessions/consume`。
- 成功消费后返回 `userId`, `email`, `productSlug`, `consumedAt`。
- 失败时统一返回 400，不泄露 token 是否存在。

## 当前进展

- 2026-06-03：已实现产品 token 消费规则、公开 consume API 和消费后 `consumedAt` 更新。
- 2026-06-03：已手动验证拾光 TimePick token 首次消费返回用户声明，二次消费返回 400，token 不可重复使用。
- 2026-06-03：验证通过 `npm run test -w apps/web -- product-session account`、`npm run typecheck -w apps/web`、`npm run lint -w apps/web`、`npm run build -w apps/web` 和 `git diff --check`。
