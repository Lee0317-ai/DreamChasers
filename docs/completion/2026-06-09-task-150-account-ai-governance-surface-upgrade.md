# T150 账号中心 AI 治理面升级完成记录

- 完成时间：2026-06-09
- 负责人：Lee
- 任务编号：T150
- 任务名称：账号中心 AI 治理面升级

## 修改文件

- `apps/web/src/app/account/ai/credits/page.tsx`
- `apps/web/src/lib/ai/account-ai-overview.ts`
- `apps/web/src/lib/ai/__tests__/account-ai-overview.test.ts`
- `docs/tasks/items/T150-account-ai-governance-surface-upgrade.md`
- `docs/tasks/claims/T150-lee.md`
- `docs/progress/2026-06-09-lee.md`

## 实现内容

- 把 `/account/ai/credits` 从静态总览升级为第一阶段 AI 治理面。
- 新增 provider 运行时状态区块，区分 `已就绪`、`仅 Dry Run` 和 `配置不完整`。
- 新增最近请求的 `全部 / 成功 / 失败` 轻量筛选。
- 为失败请求补充可读失败原因，避免只看到原始状态或空白错误。
- 保持账号中心为“观察台 + 解释台”，没有提前扩成可编辑 provider 配置或复杂运维后台。

## 验证命令

```bash
npm run test -w apps/web -- account-ai-overview model-catalog ai-gateway account-ai-config
npm run typecheck -w apps/web
npm run build -w apps/web
npm run docs:sync
git diff --check
```

## 验证结果

- DreamChasers 测试通过：4 个测试文件 / 14 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- `npm run docs:sync`：待执行。
- `git diff --check`：待执行。

## 遗留问题

- 当前 provider 状态仍是治理展示级判断，完整 readiness 与环境变量治理留到 `T151`。
- 错误码集合和请求日志语义的进一步收口留到 `T152`。
