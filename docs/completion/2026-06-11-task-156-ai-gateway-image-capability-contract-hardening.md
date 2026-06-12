# T156 AI Gateway 图片能力契约与输入校验收口完成记录

- 完成时间：2026-06-11
- 负责人：Lee
- 任务编号：T156
- 任务名称：AI Gateway 图片能力契约与输入校验收口

## 修改文件

- `apps/web/src/lib/ai/ai-gateway.ts`
- `apps/web/src/lib/ai/error-display.ts`
- `apps/web/src/lib/ai/__tests__/ai-gateway.test.ts`
- `apps/web/src/lib/ai/__tests__/error-display.test.ts`
- `docs/tasks/items/T156-ai-gateway-image-capability-contract-hardening.md`
- `docs/tasks/claims/T156-lee.md`
- `docs/progress/2026-06-11-lee.md`

## 实现内容

- 在平台 AI Gateway 层新增图片能力输入契约校验，不再把无效图片任务留给 provider 自己报错。
- `image_edit` 现在要求：
  - 非空 `imageBase64`
  - 支持的 `contentType`
  - 非空 `prompt`
- `image_generation` 现在要求非空 `prompt`。
- `image_understanding` 现在要求 `url` 或 `imageBase64` 至少存在一个。
- 新增标准错误码 `input_invalid`，并接入统一可读翻译层。

## 验证命令

```bash
npm run test -w apps/web -- ai-gateway error-display
npm run test -w apps/web -- ai-gateway error-display model-catalog
npm run typecheck -w apps/web
npm run build -w apps/web
npm run docs:sync
git diff --check
```

## 验证结果

- `npm run test -w apps/web -- ai-gateway error-display`：通过，2 个测试文件 / 9 个测试。
- `npm run test -w apps/web -- ai-gateway error-display model-catalog`：通过，3 个测试文件 / 13 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- `npm run docs:sync`：通过。
- `git diff --check`：未通过。阻塞来自仓库内既有 Prisma generated 文件尾随空格噪音，不是本次平台契约加固新增。

## 遗留问题

- 真实桌面端和移动端浏览器检查不在本次平台任务范围内。
- 结果类型、临时资产生命周期和 provider 更细粒度能力差异仍可继续下钻为后续平台任务。
