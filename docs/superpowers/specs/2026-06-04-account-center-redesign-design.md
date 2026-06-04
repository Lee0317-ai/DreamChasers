# 账号统一中心页面体系重规划设计稿

**日期**：2026-06-04  
**状态**：评估稿  
**任务编号**：T133  
**负责人**：Lee  
**设计来源**：Open Design 项目 `9bf531c6-e521-4b0c-b23e-430e44751483`

## 1. 目标和原则

账号统一中心要承接三个角色：

1. 平台账号入口：统一登录、资料、安全、会话和审计。
2. 产品型工具中枢：让 TimePick、镜界等独立产品通过主站账号和产品 token 接入。
3. AI 能力入口：统一展示积分、订阅、模型来源和开发者接入状态。

本次规划采用“完整蓝图 + 第一阶段可落地”：

- 完整蓝图按 Open Design 覆盖账号、设备、AI 积分、充值、订阅和 LLM 配置。
- 第一阶段只落地当前后端已经支撑的能力，登录方式先用邮箱验证。
- 第二阶段模型配置承接 T108 AI Gateway 规划，不把用户自带模型能力简化为“平台保存用户 API Key”。

## 2. 已有依据

### 2.1 Open Design 页面

Open Design 已提供以下页面：

- 登录：`desktop-login.html`
- 注册：`desktop-register.html`
- 账号概览：`desktop-dashboard.html`
- 个人信息：`desktop-profile.html`
- 账号安全：`desktop-security.html`
- 登录设备：`desktop-devices.html`
- AI 积分管理：`desktop-ai-credits.html`
- AI 充值中心：`desktop-ai-recharge.html`
- AI 订阅管理：`desktop-ai-subscription.html`
- LLM 配置：`desktop-ai-llm-config.html`
- 移动端参考：`mobile-ios.html`, `mobile-android.html`

视觉系统使用冷白背景、深蓝强调、轻边框、弱阴影、6-14px 圆角和高信息密度。实现时应复用这些 token，并用 lucide 图标替换导出稿中的文字占位图标。

### 2.2 当前代码能力

当前 DreamChasers 已有：

- Auth.js 邮箱 magic link 登录。
- `User`, `UserProfile`, `Session`, `EmailLoginRequest`。
- `CreditWallet`, `CreditLedger`。
- `PlatformApiKey`。
- `Product`, `ProductMembership`, `ProductSession`。
- `CredentialReference`。
- `AccountAuditLog`。
- `/login`, `/account`, `/account/ai`, `/account/billing`, `/account/security`, `/account/api-keys`。

当前不具备完整能力：

- 密码登录和密码修改。
- 手机号登录和短信验证码。
- OAuth 登录。
- 实名认证。
- TOTP / SMS 二步验证。
- 设备强制下线和多设备列表管理。
- 真实充值、支付、订阅扣费。
- AI Gateway 真实模型调用、模型偏好持久化和模型来源管理。

## 3. 信息架构

### 3.1 路由结构

```text
/login
/login/check-email
/login/error

/account
/account/profile
/account/security
/account/devices

/account/ai/credits
/account/ai/recharge
/account/ai/subscription
/account/ai/llm-config

/account/api-keys
/account/products
```

现有 `/account/billing` 可在实现时迁移为 `/account/ai/credits`，或保留为兼容重定向。

### 3.2 导航分组

侧边栏分为三组：

```text
账号
  - 账号概览
  - 个人信息
  - 账号安全
  - 登录设备

AI 能力
  - 积分管理
  - 充值中心
  - 订阅管理
  - LLM 配置

开发者和产品
  - API Key
  - 产品型工具接入
```

桌面端使用左侧固定侧边栏。移动端使用底部导航和分组列表，第一阶段不做独立 iOS/Android 原生应用，只把移动端设计转译为响应式 Web。

## 4. 页面设计

### 4.1 登录页

第一阶段登录方式只保留邮箱验证：

- 主标题沿用设计稿“欢迎回来”。
- 表单项只有邮箱。
- 主按钮为“发送登录邮件”。
- 清晰展示邮件已发送、重复发送冷却、无 SMTP 本地调试提示和错误页。
- 密码登录、短信登录、社交登录不出现在第一阶段主表单中，避免给用户错误预期。

后续阶段再增加密码、短信或 OAuth 时，才启用设计稿中的 tab 结构。

### 4.2 账号概览

账号概览是进入账号中心后的默认页：

- 欢迎区：头像首字、昵称、邮箱、账号状态。
- 状态卡：安全等级、注册时间、登录设备、AI 积分余额。
- 快捷操作：编辑资料、查看安全、查看积分、生成产品 token。
- 最近记录：最近登录、退出、API Key 创建/停用、产品 token 生成。

第一阶段安全等级按已支持能力计算：

```text
邮箱已验证 = 基础
有近期登录审计 = 正常
有 API Key 或产品接入记录 = 高风险提示补充
```

不要展示“密码 + 手机 + 实名均已绑定”这类未实现状态。

### 4.3 个人信息

个人信息页分为：

- 头像和昵称。
- 基础资料：昵称、语言、时区。
- 联系方式：邮箱；手机号为未绑定占位。
- 实名信息：后续能力，占位为“未开放”。

第一阶段可读为主，昵称编辑可拆单独实现任务。手机号和实名不做假绑定。

### 4.4 账号安全

账号安全页展示真实状态和后续入口：

- 邮箱验证：已启用。
- 登录邮件冷却：已启用。
- 密码：未设置，后续开放。
- 手机号：未绑定，后续开放。
- 二步验证：未开放。
- API Key 风险提示：跳转 `/account/api-keys`。
- 退出当前会话：可用。
- 审计日志：可用。

安全页不直接承诺短信、TOTP 或密码已可用。

### 4.5 登录设备

设备页第一阶段以 session 和 audit log 做轻量呈现：

- 当前会话：浏览器、时间、邮箱账号。
- 历史登录记录：来自 audit log。
- 其他设备强制下线：后续能力，按钮禁用或显示“即将开放”。

后续要支持强制下线时，需要补充 session 管理 API 和可识别的设备指纹摘要。

### 4.6 AI 积分管理

积分页复用 `CreditWallet` 和 `CreditLedger`：

- 当前余额。
- 本月使用量和配额：第一阶段可显示为账本统计，占位订阅配额。
- 使用明细：`CreditLedger`。
- 入口：充值中心、订阅管理。

第一阶段不产生真实充值，只展示真实账本余额和后续入口。

### 4.7 充值中心

充值中心第一阶段作为商业化占位：

- 展示套餐结构和支付方式设计。
- 主按钮状态为“暂未开放”或“即将开放”。
- 明确第一阶段不接真实支付，不生成订单。

后续实现时再新增订单、支付渠道、回调、对账和风控任务。

### 4.8 订阅管理

订阅页第一阶段展示套餐蓝图：

- Free：基础免费额度和非模型工具。
- Pro：更多 AI 积分、常用模型优先级、批量任务额度。
- Team：团队成员、共享额度、审计导出。

第一阶段只展示当前状态，不允许真实升级或自动续费。

### 4.9 LLM 配置

LLM 配置页是第二阶段重点，但它只负责用户可见配置和入口，不直接承接模型调用实现。

页面分三块：

1. 模型偏好
   - 默认任务模式：快速文本、深度推理、图片编辑、结构化提取。
   - 默认模型展示为策略结果，不直接让用户绑定具体 provider key。
   - 参数偏好：流式输出、温度、输出格式偏好。

2. 模型来源
   - 平台额度 `platform_pool`。
   - 临时 Key `user_ephemeral_key`。
   - 外部 Gateway BYOK `external_gateway_byok`。
   - 加密 Key Vault `user_encrypted_vault`。
   - 本地连接器 `local_connector`。

3. 开发者接入
   - 平台 API Key 管理入口。
   - 产品型工具 token 入口。
   - 请求日志和用量日志入口。

LLM 配置页不得把平台 API Key 和用户模型 API Key 混为一类。`PlatformApiKey` 用于调用 DreamChasers 平台 API；用户模型来源进入 AI Gateway 的 Credential Source。

## 5. 第二阶段模型配置策略

第二阶段只建议实现三类能力：

### 5.1 平台额度

用户不需要配置模型密钥，直接按平台额度调用 AI 能力。账号中心展示：

- 当前可用额度。
- 支持的任务能力。
- 预计消耗。
- 使用记录。

真实 provider、key 池、健康状态和失败切换由 AI Gateway 管理。

### 5.2 临时 Key

高级用户在单次请求中输入自己的 API Key：

- Key 只存在请求内存中。
- 不入库。
- 不写日志。
- 不在浏览器长期保存。
- 请求结束后不可恢复。

账号中心只展示说明和入口，不展示持久化列表。

### 5.3 外部 Gateway BYOK

长期推荐的 BYOK 方式是外部 Gateway：

- 用户把 provider key 托管在第三方 Gateway。
- DreamChasers 只保存 gateway reference、route id、credential id、key hint 和状态。
- 用户可测试连接、停用、删除引用。
- 不保存用户 provider key 明文。

### 5.4 后置能力

`user_encrypted_vault` 和 `local_connector` 放到后续阶段：

- Key Vault 需要 KMS、密文存储、轮换、删除、审计和日志脱敏。
- Local Connector 需要本地服务、浏览器插件或桌面端，不适合作为 Web 第一版默认能力。

## 6. 与 T108 / T122 的关系

T108 是平台级总规划，T133 是账号中心页面体系规划。T133 不替代 T108 的 AI Gateway，只把 T108 的模型来源体系映射到账号中心 UI。

T122 是 TimePick 自动识别平台 AI 重做规划。T122 后续应使用 T108/T133 的 AI Gateway 和模型来源，不再恢复旧 Coze/Supabase Edge Function 直连。

## 7. 实现拆分建议

后续建议拆为：

1. 账号中心布局和导航重构。
2. 登录页按邮箱验证重做视觉。
3. 账号概览、个人信息、安全和设备页接现有数据。
4. AI 积分页接 `CreditWallet` / `CreditLedger`。
5. 充值和订阅占位页。
6. LLM 配置第二阶段占位和说明页。
7. LLM 配置 MVP：平台额度 + 临时 Key。
8. 外部 Gateway BYOK 引用管理。
9. 设备强制下线和更细 session 管理。
10. 密码、短信、OAuth、MFA 和实名能力。

每个实现任务必须单独领取，并明确是否允许修改 `apps/web/src/app/account/**`, `apps/web/src/components/account/**`, `apps/web/src/lib/account/**`, `apps/web/src/app/api/account/**`, `apps/web/src/app/login/**` 和 `apps/web/src/app/globals.css`。

## 8. 验证要求

前端实现任务至少验证：

- `npm run lint -w apps/web`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- 账号相关测试。
- 桌面端 `/login`, `/account`, `/account/profile`, `/account/security`, `/account/devices`, `/account/ai/credits`, `/account/ai/llm-config`。
- 移动端 390x844 和 430x932。
- 无横向滚动。
- 文字不溢出。
- 不可用能力必须有明确禁用态或后续说明。

文档任务验证：

- `npm run docs:sync`
- 占位符扫描。
- `git diff --check`

## 9. 风险

- 如果第一阶段直接照搬密码、短信、实名和支付 UI，会让用户误以为能力已上线。
- 如果 LLM 配置直接保存用户 provider key，会违背 T108 的隐私和安全原则。
- 如果账号中心和 TimePick 各自配置模型来源，后续自动识别、运势聊天、AI 修图和镜界对话会出现多套计费和日志。
- 如果充值和订阅页面没有明确占位状态，会制造支付合规和客服风险。

## 10. 推荐结论

账号中心应先完成统一信息架构和视觉重构，第一阶段坚持邮箱验证登录。AI 能力页先展示积分、订阅蓝图和 LLM 配置入口；第二阶段模型配置只落平台额度、临时 Key 和外部 Gateway BYOK，不保存用户 provider key 明文。真实模型调用、扣费、日志、provider 协议和失败切换统一归 AI Gateway 实现。
