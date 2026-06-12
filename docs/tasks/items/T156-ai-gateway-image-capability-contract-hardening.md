# T156：AI Gateway 图片能力契约与输入校验收口

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 依赖：T146, T151, T152, T155
- 创建日期：2026-06-11
- 来源：平台 AI 接入继续推进，当前只负责 AI 接入层，不继续做修图产品任务
- 涉及模块：AI Gateway / 图片能力契约 / 标准错误码 / provider 输入治理
- 主要文件范围：`apps/web/src/lib/ai/**`, `apps/web/src/app/api/ai/**`, `docs/tasks/**`, `docs/progress/2026-06-11-lee.md`, `docs/completion/**`
- 验证方式：`npm run test -w apps/web -- ai-gateway error-display model-catalog`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`

## 目标

- 为 `image_edit`、`image_generation`、`image_understanding` 增加平台级输入契约校验。
- 在 Gateway 层提前拦截空图片 payload、缺失 prompt、错误 content type 等无效请求。
- 统一这些失败的错误码和可读展示，不让 provider 才去兜底报错。

## 不做

- 不实现新的修图产品能力。
- 不改 AI 修图工作台交互。
- 不接新的产品链路。
- 不引入长期资产存储、批处理或任务编排。

## 实现记录

- 在 `AI Gateway` 层新增图片能力输入契约校验。
- `image_edit` 现在会在 Gateway 内先校验：
  - `imageBase64` 非空；
  - `contentType` 必须是支持格式；
  - `prompt` 非空。
- `image_generation` 现在要求非空 `prompt`。
- `image_understanding` 现在至少要求 `url` 或 `imageBase64` 之一存在。
- 新增标准错误码 `input_invalid` 的展示语义，避免无效图片任务拖到 provider 才失败。
- 新增测试覆盖：
  - `image_edit` 缺失图片 payload 时被平台直接拦截；
  - `image_generation` 缺失 prompt 时被平台直接拦截；
  - `input_invalid` 的统一翻译。

## 完成摘要

- 平台图片能力现在有了最小可用的统一输入契约。
- 无效图片任务会在 Gateway 入口直接失败，不会进入扣积分后的 provider 执行阶段。
- 这次改动只属于 AI 接入层加固，不涉及修图产品功能扩展。

## 验证结果

- `npm run test -w apps/web -- ai-gateway error-display`：通过，2 个测试文件 / 9 个测试。
- `npm run test -w apps/web -- ai-gateway error-display model-catalog`：通过，3 个测试文件 / 13 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- `npm run docs:sync`：通过。
- `git diff --check`：未通过。阻塞来自仓库内既有 Prisma generated 文件尾随空格噪音，不是本次平台契约加固新增。
