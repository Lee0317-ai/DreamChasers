# 统一账号中心、产品型工具入口和 AI Gateway 规划设计稿

**日期**：2026-06-03
**状态**：评估稿
**任务编号**：T108
**负责人**：Lee

## 1. 总体定位

DreamChasers 不再只是单个小工具集合，而是 `工具站主门户 + 站内网页小工具 + 独立产品型工具 + 统一账号中心 + 统一 AI Gateway` 的平台。

`拾光 TimePick` 和 `镜界 Wonderland` 归属工具站，但不应完全塞进主站代码。它们属于 `独立产品型工具`：在工具站展示、推荐、统计和承接权益，实际运行可以保留独立前端、独立后端和独立部署。

## 2. 工具站分类

工具站内部拆成两类：

```text
工具站
  ├─ 站内网页小工具
  │   ├─ PDF 工具箱
  │   ├─ AI 修图
  │   └─ AI 面试助手
  └─ 独立产品型工具
      ├─ 拾光 TimePick
      └─ 镜界 Wonderland
```

站内网页小工具由 `apps/web` 直接承载。独立产品型工具保留独立部署，通过工具站入口页、产品登录入口、统一账号中心和统一 AI Gateway 与主站连接。

## 3. 账号中心设计

推荐路线是自建账号中心，使用 `Next.js + Prisma/Postgres + Auth.js`。Supabase 继续优先作为托管 PostgreSQL 使用，不把 Supabase Auth 作为平台身份系统的必需依赖。

账号中心支持多处登录：

```text
主站登录页
拾光登录入口
镜界登录入口
```

用户感知上可以在任意产品内登录；底层仍然统一为同一个平台用户。

### 3.1 登录流程

```text
用户在拾光点击登录
  → 跳到平台账号中心，带 returnUrl
  → 登录成功
  → 回到拾光
  → 拾光通过 session/token exchange 获取产品会话
```

镜界同理。FastAPI 后端不再长期维护独立主身份 JWT，而是验证平台签发的产品 token。镜界自己的数字分身、画像和对话数据继续保留在镜界业务库中，但 owner 使用平台 `userId`。

### 3.2 核心数据模型

账号基础：

```text
User
Account
Session
VerificationToken
UserProfile
```

产品权益：

```text
Product
ProductMembership
Entitlement
CreditWallet
CreditLedger
ApiKey
ProductSession
AuditLog
```

`ApiKey` 指平台 API Key，不等同于用户自带模型 API Key。用户模型密钥要单独进入 Credential Manager。

## 4. AI Gateway 总体设计

现有 AI 修图中的 provider adapter 应升级为平台级 AI Gateway。业务模块不直接写死具体模型，而是发起任务请求，由 Gateway 根据任务、用户、权益、模型来源和 provider 状态解析。

```text
AI Task
  → Model Policy
  → Credential Source
  → Provider Adapter
  → Real API Call
```

业务只声明任务意图：

```text
fast_text
deep_reasoning
cheap_summary
image_edit
portrait_beauty
interview_simulation
wonderland_dialogue
```

Gateway 再解析到具体 provider、协议和模型。

## 5. 模型来源设计

用户可以免费使用网站。AI 能力分为平台额度模式和用户自带模型能力模式。

```text
Credential Source
  ├─ platform_pool
  ├─ user_ephemeral_key
  ├─ external_gateway_byok
  ├─ user_encrypted_vault
  └─ local_connector
```

### 5.1 platform_pool

平台自己的模型账号池。第一版先只预留口，不实现复杂号池。后续可支持：

- 多 provider key 池。
- 每个 key 的额度、健康状态、失败率。
- provider 自动切换。
- 预算和成本统计。

### 5.2 user_ephemeral_key

用户临时输入自己的 API Key。Key 只在本次请求中使用，不入库，不进入日志。适合作为第一版 BYOK。

优点：

- 隐私压力低。
- 实现成本低。
- 适合高级用户临时试用。

缺点：

- 每次需要填写。
- 不能形成长期自动任务。

### 5.3 external_gateway_byok

用户在第三方 AI Gateway 中托管自己的 provider key，例如 Cloudflare AI Gateway 的 BYOK。平台只保存 gateway reference、route id 或 credential id，不直接保存 provider API Key。

这是长期推荐路线，原因：

- 减少平台直接接触用户模型密钥。
- 更容易做 key 轮换、预算限制和 provider 路由。
- 比自建密钥保险箱更快落地。

### 5.4 user_encrypted_vault

用户选择把 provider key 加密保存在平台。该方案需要后置，不能作为第一版默认能力。

必须满足：

- 明文 key 不进入日志。
- 数据库只保存密文和 key hint。
- 单独密钥管理或 KMS。
- 支持删除、轮换、测试连接和审计。
- 高权限后台也不能直接查看明文。

### 5.5 local_connector

高级用户本地运行连接器，连接器读取用户本地环境变量并代理模型请求。网页本身无法读取用户本机环境变量，因此必须通过本地服务、浏览器插件或桌面客户端实现。

该方案隐私最好，但使用门槛最高，只适合后期高级模式。

## 6. Provider 协议适配

Provider Registry 不应只记录模型名，而应记录协议能力。

```text
Provider
  - id
  - displayName
  - protocol
  - baseUrl
  - capabilities
  - authType
  - supportsStreaming
  - supportsStructuredOutput
  - supportsImageInput
  - supportsImageOutput
```

第一批协议建议：

```text
openai_responses
openai_chat_compatible
anthropic_messages
moonshot_openai_compatible
zhipu_glm
image_generation
image_edit
```

第一版优先支持 `openai_chat_compatible` 和现有 `image_edit`，再扩展文本、视觉和结构化输出。

## 7. 请求和扣费流程

```text
产品发起 AI 请求
  → 识别 userId 和 productId
  → 选择 credential source
  → 检查免费额度、订阅或用户自带 key
  → 解析 model policy
  → 调 provider adapter
  → 写 request log 和 cost log
  → 扣减或记录用量
  → 返回结果
```

用户自带 Key 的调用也要记录基础元数据，但不能记录明文 key、完整敏感 prompt 或私密文件内容。日志要做脱敏和长度限制。

## 8. 阶段拆分

### 阶段 1：规划和入口

- 建立 T108 规划。
- 工具站分类增加 `独立产品型工具` 概念。
- 明确拾光、镜界后续迁移路线。

### 阶段 2：账号中心 MVP

- 主站登录、注册、退出。
- 用户资料。
- 基础 session。
- 产品 token exchange 设计。

### 阶段 3：AI Gateway MVP

- 把现有 AI 图片 provider 抽象为 Gateway 的 image capability。
- 支持 platform_pool 和 user_ephemeral_key。
- 不保存用户 provider key。

### 阶段 4：独立产品接入

- 拾光先接入统一账号中心。
- 镜界再接入平台 token 和 AI Gateway。

### 阶段 5：BYOK 增强

- 支持 external_gateway_byok。
- 评估是否需要 user_encrypted_vault。
- 预留 local_connector。

### 阶段 6：商业化和治理

- 免费额度。
- 积分充值。
- 订阅。
- provider 成本统计。
- 账号池健康监控。
- 滥用检测和风控。

## 9. 风险和原则

- 不要让每个产品维护独立账号体系。
- 不要让每个产品保存模型 API Key。
- 不要把用户自带 API 简化成“平台保存用户 key”。
- 不要在浏览器中长期保存高价值 API Key 作为默认方案。
- 不要在第一版做复杂模型账号池。
- 不要把完整 prompt、简历、画像、私密对话默认写入长期日志。
- 对镜界的用户画像和对话数据，要单独设计删除、导出和隔离策略。

## 10. 推荐第一版范围

第一版只做：

```text
平台账号中心规划
产品型工具入口规划
AI Gateway 规划
platform_pool 预留
user_ephemeral_key 预留
external_gateway_byok 预留
```

进入实现时，第一批真实能力建议只做：

```text
主站账号 MVP
站内 AI 修图 Gateway 化
用户临时 API Key
拾光入口页和账号接入试点
```

镜界因为涉及 FastAPI、JWT、画像和多模型对话，应在拾光验证后再迁移。
