# 平台能力、用户资产留存和工作流自动化第一阶段规划

**日期**：2026-06-05
**状态**：规划稿
**任务编号**：T142
**负责人**：Lee

## 1. 定位

DreamChasers 下一阶段不应只做单个 AI 功能，而要先建立平台底座。这个底座要同时支持：

- 账号资产和权益留存。
- 小工具历史记录留存。
- 游戏进度和存档留存。
- AI Gateway 和能力资源池。
- 非 AI 的工具工作流自动化。

这意味着平台要从“工具和游戏入口”升级为“用户持续使用的资产中心”。AI 是其中一类能力，但不是唯一能力。PDF 加水印、图片加 logo、TimePick 自动整理、游戏存档同步，都应能进入统一的平台规则。

## 2. 设计原则

- 平台优先：先定义统一资产、记录、存档和能力调用契约，再让各工具和游戏接入。
- 轻量第一版：第一阶段只做可落地的最小模型和接口规划，不做复杂编辑器、支付和模型账号池。
- 工具和游戏分层：工具历史、游戏存档和 AI 请求日志不能混成一张表，但都要归属同一个平台用户。
- AI 和非 AI 并列：工作流可以调用 AI，也可以只复用传统工具动作。
- 模块可扩展：不同工具和游戏可以有自己的扩展 JSON，但必须遵守平台通用字段。
- 隐私优先：不保存用户 provider key，不把完整 prompt、图片、简历、游戏行为明细默认长期写入日志。

## 3. 五层架构

```text
平台能力与留存底座
  ├─ 账号资产层
  ├─ 工具历史留存层
  ├─ 游戏进度留存层
  ├─ AI Gateway / 能力资源池层
  └─ 工作流自动化层
```

### 3.1 账号资产层

账号资产层负责回答“用户是谁、拥有什么、能调用什么”。

第一阶段承接现有账号中心模型：

- `User`
- `UserProfile`
- `Product`
- `ProductMembership`
- `Entitlement`
- `CreditWallet`
- `CreditLedger`
- `PlatformApiKey`
- `ProductSession`
- `AccountAuditLog`

后续新增平台资产时，不应直接塞进用户表，而应通过业务表归属 `userId`。工具历史、游戏存档、工作流和 AI 请求都必须可追溯到平台用户。

### 3.2 工具历史留存层

工具历史层负责保存用户在各工具里的可复用结果和最近行为。

建议通用模型：

```text
ToolRun
  - id
  - userId
  - toolSlug
  - title
  - status
  - inputSummary
  - outputSummary
  - artifactRefs
  - workflowId
  - createdAt
  - updatedAt
  - expiresAt
  - metadata
```

第一阶段只保留轻量历史：

- 最近使用记录。
- 用户主动保存的结果。
- 导出记录摘要。
- 与工作流关联的执行记录。

不默认长期保存大文件、完整图片、完整 PDF、完整 prompt 或隐私内容。文件型结果后续需要单独对象存储和过期策略。

不同工具的留存建议：

- PDF 工具箱：保留操作类型、页数、导出文件名和最近导出，不默认保存原 PDF。
- AI 修图：保留编辑参数、滤镜、logo 工作流引用和导出记录，不默认保存用户原图。
- TimePick：继续以资源、文件夹、标签、灵感、任务等业务模型为主，`ToolRun` 只记录自动化和 AI 调用摘要。
- AI 面试助手：保留报告元数据和用户主动保存的 HTML 报告引用，不默认长期保存完整简历。

### 3.3 游戏进度留存层

游戏进度层负责保存不同游戏的进度、存档、成就和版本。

建议通用模型：

```text
GameSave
  - id
  - userId
  - gameSlug
  - slotKey
  - progressState
  - currentLevel
  - score
  - softCurrency
  - hardCurrency
  - achievements
  - configVersion
  - lastPlayedAt
  - metadata
```

设计口径：

- `gameSlug` 区分胡了卜、打工人弹射等不同游戏。
- `slotKey` 支持一个游戏多个存档槽。
- `progressState` 用于通用状态，例如 `active`, `completed`, `failed`, `paused`。
- `metadata` 承载游戏自己的扩展字段，例如牌局状态、关卡种子、奖励池、Boss 状态。
- 游戏配置必须带 `configVersion`，避免规则更新后旧存档无法解释。

第一阶段不做排行榜、多人同步、真钱激励和复杂反作弊。游戏侧先保证用户能恢复进度、记录最近游玩、沉淀成就。

### 3.4 AI Gateway / 能力资源池层

AI Gateway 层负责统一 AI 能力，而不是让每个工具直接调用 provider。

能力注册建议：

```text
AiCapability
  - text_generation
  - structured_extraction
  - image_understanding
  - image_generation
  - image_edit
  - ocr
  - moderation
```

请求记录建议：

```text
AiRequest
  - id
  - userId
  - productSlug
  - toolSlug
  - capability
  - credentialSource
  - status
  - inputSummary
  - outputSummary
  - estimatedCost
  - creditDelta
  - provider
  - model
  - errorCode
  - createdAt
  - metadata
```

第一阶段只做：

- 能力注册表规划。
- provider registry 规划。
- request log 规划。
- credit / quota 检查规划。
- `platform_pool` 预留。
- `user_ephemeral_key` 预留。
- `external_gateway_byok` 预留。

第一阶段不做：

- 复杂模型账号池。
- provider 自动路由。
- 用户 provider key 持久化。
- Key Vault。
- 真实支付扣费。
- 自建模型推理。

第一批落地业务建议：

1. TimePick 自动识别重做。
2. AI 修图 provider adapter Gateway 化。
3. AI 面试助手文本结构化输出。

### 3.5 工作流自动化层

工作流层负责保存用户常用操作，让工具可以一键复用。

工作流可以调用 AI，也可以完全不调用 AI。它不是“AI 工作流”，而是“平台操作自动化”。

建议通用模型：

```text
WorkflowTemplate
  - id
  - userId
  - scope
  - toolSlug
  - name
  - description
  - triggerType
  - steps
  - defaultParams
  - createdAt
  - updatedAt
  - metadata

WorkflowRun
  - id
  - userId
  - workflowId
  - toolSlug
  - status
  - inputSummary
  - outputSummary
  - artifactRefs
  - createdAt
  - metadata
```

第一阶段只做单工具内的一键动作模板：

- 图片工具：加固定 logo、套固定边框、统一裁剪比例、加固定水印文字。
- PDF 工具箱：加固定文字水印、加固定签名、压缩后导出。
- TimePick：按规则打标签、放入指定文件夹、生成资源摘要。

第一阶段不做：

- 可视化节点编辑器。
- 跨工具多步骤编排。
- 条件分支。
- 定时任务。
- 批量长任务队列。
- 面向第三方的 webhook / trigger。

工作流保存的是“操作配置”，不是保存原始用户数据。比如图片加 logo 工作流保存 logo 引用、位置、大小、透明度、边距和导出设置；用户上传的具体图片仍属于本次 ToolRun。

## 4. 第一阶段 MVP 范围

第一阶段只规划和后续实现这些最小能力：

1. 平台资产契约
   - 明确用户、产品、工具、游戏、工作流和 AI 请求之间的归属关系。

2. 工具历史 MVP
   - 每个登录用户能看到最近工具使用记录。
   - 工具可选择写入 `ToolRun`。
   - 用户可主动保存重要结果。

3. 游戏存档 MVP
   - 每个游戏可保存一个或多个存档槽。
   - 胡了卜优先接入最近进度和关卡状态。

4. AI Gateway MVP
   - 建立 capability / provider / request log / quota check 的最小结构。
   - 不接复杂 provider 池。
   - 不持久化用户模型 key。

5. 工作流模板 MVP
   - 只做单工具内的一键动作模板。
   - 第一个样例建议是 AI 修图或图片工具的“加固定 logo”。
   - 第二个样例建议是 PDF 工具箱的“加固定水印”。

## 5. 后续扩展路线

### 阶段 A：规划和数据契约

- 完成 T142 规划。
- 拆分平台资产 schema 设计任务。
- 明确工具、游戏、AI 和工作流的最小字段。

### 阶段 B：工具历史和游戏存档

- 实现 `ToolRun`。
- 实现 `GameSave`。
- 先接一个工具和一个游戏做验证。

### 阶段 C：AI Gateway MVP

- 实现 capability registry。
- 实现 request log。
- 实现 quota check。
- 接 TimePick 自动识别或 AI 修图作为第一个 AI 用例。

### 阶段 D：工作流模板 MVP

- 实现 `WorkflowTemplate` 和 `WorkflowRun`。
- 在图片工具中接“加 logo”模板。
- 在 PDF 工具箱中接“加水印”模板。

### 阶段 E：跨工具和高级自动化

后置支持：

- 跨工具串联。
- 批量处理。
- 条件分支。
- 定时任务。
- webhook。
- 用户自定义节点。
- 团队共享工作流。

## 6. 推荐任务拆分

后续建议拆成这些任务，不要在 T142 内实现：

1. `T143` 平台资产和留存 schema 设计。
2. `T144` 工具历史 ToolRun MVP。
3. `T145` 游戏存档 GameSave 契约和胡了卜试点。
4. `T146` AI Gateway capability / provider / request log MVP。
5. `T147` 工作流模板 WorkflowTemplate / WorkflowRun MVP。
6. `T148` 图片加 logo 工作流试点。
7. `T149` PDF 加水印工作流试点。
8. `T150` TimePick 自动识别接 AI Gateway 试点。

具体编号以 `docs/tasks/NEXT_ID.md` 后续分配为准。

## 7. 风险

- 如果先做具体工具功能，平台资产边界会不断返工。
- 如果 AI Gateway 和工作流混成一层，会误以为所有自动化都要调用模型，导致成本和复杂度上升。
- 如果工具历史默认保存完整文件，会带来隐私、存储和清理压力。
- 如果游戏存档没有 `configVersion`，后续关卡和规则更新会破坏旧存档。
- 如果第一版就做跨工具编排，会拖慢真正有价值的一键模板落地。
- 如果保存用户 provider key，会提前进入安全、合规和密钥治理重负担。

## 8. 推荐结论

下一阶段应采用 `平台优先` 路线，先把账号资产、工具历史、游戏存档、AI Gateway 和工作流模板的边界定清楚。第一阶段实现时只做轻量留存和单工具工作流，不做复杂跨工具编排、不做真实支付、不保存用户模型密钥。

最推荐的首个验证组合是：

```text
ToolRun + WorkflowTemplate + 图片加 logo 工作流
GameSave + 胡了卜最近进度
AiRequest + TimePick 自动识别
```

这三个试点分别覆盖工具、游戏和 AI，能验证平台底座是否足够通用。

