# 工具游戏 AI 平台实施计划

> **给 Claude：** 必需子技能：使用 `superpowers:executing-plans` 按任务逐步执行本计划。

**目标：** 搭建第一版免费工具/游戏门户，让 `工具` 和 `游戏` 两个频道平级展示，并提供 AI 辅助搜索、内容后台、未来订阅/自带 API/AI 能力池的基础结构。

**架构：** 使用 TypeScript Monorepo。`apps/web` 负责 Next.js 门户、工具、游戏、AI 搜索和后台；`apps/game` 负责 Cocos Creator 真小游戏工程、GDevelop Web H5 原型工程和发布文档；`packages/shared` 负责共享类型和通用逻辑。第一阶段只保留一个 Web 应用、一个数据库和一个 Redis，不拆微服务。

**技术栈：** Next.js、TypeScript、Tailwind CSS、Prisma、PostgreSQL、Redis、Cocos Creator、GDevelop、Docker Compose、Nginx、Vitest、Playwright。

---

## 0. 前提假设

- 现有 `tools-hub` 代码可以推倒重来，只保留仍然有价值的文件。
- 新项目根目录建议放在 `D:\DreamChasers`。
- 最终目录结构建议如下：
  - `apps/web`：主站、工具频道、游戏频道、AI 搜索、后台管理。
  - `apps/game`：Cocos Creator 游戏工程、GDevelop Web H5 原型工程和发布文档。
  - `packages/shared`：共享类型、枚举、工具函数、埋点定义。
  - `docs`：产品文档、计划、上线清单、运营手册。
- 第一版目标是验证流量、内容更新速度和用户停留，不做完整支付系统。
- AI 搜索第一版可以先做本地匹配：标题、描述、分类、标签、别名、关键词；真实 LLM 接入后续通过同一个接口扩展。

## 0.1 第一阶段实际交付模块

第一阶段只做两个工具和一个游戏：

1. `PDF 工具箱`
   - 免费范围：预览、合并、拆分、删除页面、页面排序、旋转、PDF 转图片、图片转 PDF、PDF 转 Word、加水印、加签名、基础压缩。
   - 暂不做：真正在线编辑 PDF 原文、修改 PDF 内已有文字、修改 PDF 内已有图片。
   - 特别说明：PDF 转 Word 免费，但第一版标记为 Beta；扫描版 PDF 需要 OCR 时，后续归入 AI/OCR 能力。

2. `AI 修图工具`
   - 免费范围：亮度、对比度、饱和度、色温、裁剪、旋转、缩放、滤镜、边框、贴纸、文字、马赛克、裁剪/遮盖/模糊/手动涂抹式简单去水印。
   - 收费或限次范围：文字指令修图、AI 美颜、AI 细节修复、AI 局部重绘、AI 智能去水印、AI 换背景、高清增强、批量 AI 处理。
   - 文案限制：去水印应表达为“去除自己图片中的遮挡、瑕疵、水印或不需要的局部元素”，避免引导侵权。

3. `麻将 Roguelike 消除`
   - 基础规则：点击麻将进入槽位，满足 `碰 / 吃 / 杠` 后消除，槽位满失败，清空牌面过关。
   - Roguelike：每过一关从 3 个随机奖励里选择 1 个，奖励改变本轮规则。
   - 引擎策略：Web 原型可先用 GDevelop 快速验证；微信/抖音小游戏正式发布优先走 Cocos Creator。
   - 第一版范围：`万 / 条 / 筒` 三类牌、20 个关卡、20 个奖励、不做完整麻将算法、不做多人、不做排行榜。

## 1. 成功标准

- 用户进入首页后，能明确看到 `工具` 和 `游戏` 两个平级入口。
- 用户可以按分类、标签、热门、星标、最近更新浏览全部工具和全部游戏。
- 用户可以输入自然语言需求，AI 搜索返回一组可点击的工具/游戏推荐。
- 团队成员可以通过后台新增和编辑工具/游戏，不必每次改代码发布。
- 游戏内容同时支持 Web 试玩入口，并预留微信小游戏、抖音小游戏发布路径。
- 代码结构预留免费次数、订阅、积分、自带 API、平台 AI 能力池。
- PDF 工具箱、AI 修图工具、麻将 Roguelike 消除三个模块都有清晰可访问入口。
- 上线前 `npm run lint`、`npm run test`、`npm run build` 必须通过。

## 2. 里程碑

### M0：项目基础

- 建立 Monorepo 结构。
- 添加共享类型包。
- 添加测试工具。
- 添加本地 PostgreSQL 和 Redis 的 Docker Compose。

### M1：内容门户 MVP

- 完成首页、工具频道、游戏频道、详情页。
- 添加 Prisma 数据模型和种子数据。
- 实现热门、星标、最近更新查询。

### M2：后台和 AI 搜索

- 添加轻量后台。
- 支持内容新增和编辑。
- 添加 AI 搜索接口和前端搜索框。
- 记录搜索日志。

### M3：游戏发布基础

- 添加 Cocos 工作区说明。
- 添加 GDevelop Web H5 原型通道说明。
- 定义 Web 游戏嵌入方式。
- 添加微信小游戏、抖音小游戏发布清单。

### M4：上线基础

- 添加基础埋点。
- 添加广告位占位。
- 添加部署配置。
- 添加上线检查清单和运营手册。

## 3. 团队分工

- 开发 A：网站平台基础搭建。
  - Monorepo。
  - Next.js 主站。
  - 数据库和 Prisma。
  - 内容模型。
  - 后台管理。
  - PDF 工具箱基础能力。
- 开发 B：垂直模块和体验能力。
  - AI 搜索。
  - AI 修图工具。
  - 麻将 Roguelike 消除。
  - 游戏接入。
  - 埋点。
  - 部署协助。
- 两位提意见/想法成员：
  - 维护第一批工具和游戏选题。
  - 检查首页是否容易理解。
  - 校验分类和标签是否符合办公人群、学生的真实需求。
  - 测试用户是否能在没有说明的情况下找到想用的东西。

双方开发原则：

- 每个人领取任务前先更新 `docs/status/CURRENT_STATUS.md`。
- 每次开始新会话时，各自 AI 必须先读 `docs/PROJECT_CONTEXT.md`。
- 修改范围尽量按模块隔离，避免两个人同时改同一批文件。
- 完成任务后必须更新状态文档，并写清楚验证结果。

## 4. 实施任务

任务编号有两套表达：

- 本计划中的 `任务 1` 到 `任务 17` 用于阅读实施步骤。
- 实际领取和协作时，必须使用 `docs/tasks/TASK_BOARD.md` 中的 `T001` 到 `T017`。

开始任何任务前，先在 `docs/tasks/CLAIMS.md` 领取对应 `Txxx` 任务。

如果实施过程中出现新想法或需求变更，先写入 `docs/tasks/CHANGE_INTAKE.md`，再决定是否加入 `docs/tasks/TASK_BOARD.md`，不要直接扩大当前任务范围。

### 任务 1：创建 Monorepo 外壳

**文件：**
- 新建：`package.json`
- 新建：`tsconfig.base.json`
- 新建：`.gitignore`
- 新建：`.env.example`
- 新建：`apps/web/.gitkeep`
- 新建：`apps/game/.gitkeep`
- 新建：`packages/shared/.gitkeep`

**步骤 1：创建根目录工作区配置**

使用 npm workspaces，保持工具链简单。

```json
{
  "name": "dreamchasers-platform",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev -w apps/web",
    "build": "npm run build -w apps/web",
    "lint": "npm run lint -w apps/web",
    "test": "npm run test --workspaces --if-present",
    "typecheck": "npm run typecheck --workspaces --if-present"
  }
}
```

**步骤 2：添加共享 TypeScript 配置**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true
  }
}
```

**步骤 3：验证**

运行：

```bash
npm install
npm run test
```

预期：

- `npm install` 成功。
- `npm run test` 即使暂时没有测试，也能正常结束。

**步骤 4：提交**

```bash
git add package.json tsconfig.base.json .gitignore .env.example apps packages
git commit -m "chore: create monorepo shell"
```

### 任务 2：搭建 Web 应用

**文件：**
- 新建：`apps/web/package.json`
- 新建：`apps/web/next.config.ts`
- 新建：`apps/web/tsconfig.json`
- 新建：`apps/web/src/app/layout.tsx`
- 新建：`apps/web/src/app/page.tsx`
- 新建：`apps/web/src/app/globals.css`
- 新建：`apps/web/src/components/AppHeader.tsx`
- 新建：`apps/web/src/components/AppFooter.tsx`

**步骤 1：创建最小 Next.js 页面**

第一版只做清晰可用，不做复杂视觉。

```tsx
export default function HomePage() {
  return (
    <main>
      <h1>免费工具和小游戏</h1>
      <p>快速找到好用工具，顺手玩点轻量小游戏。</p>
    </main>
  );
}
```

**步骤 2：添加脚本**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  }
}
```

**步骤 3：验证**

```bash
npm run lint -w apps/web
npm run typecheck -w apps/web
npm run build -w apps/web
```

预期：

- 没有 lint 错误。
- 没有 TypeScript 错误。
- Next.js 构建成功。

**步骤 4：提交**

```bash
git add apps/web
git commit -m "chore: scaffold web app"
```

### 任务 3：添加共享领域类型

**文件：**
- 新建：`packages/shared/package.json`
- 新建：`packages/shared/src/content.ts`
- 新建：`packages/shared/src/content.test.ts`
- 新建：`packages/shared/src/index.ts`
- 新建：`packages/shared/tsconfig.json`

**步骤 1：先写失败测试**

```ts
import { getContentTypeLabel, isAiMode } from "./content";

it("返回内容类型中文名", () => {
  expect(getContentTypeLabel("tool")).toBe("工具");
  expect(getContentTypeLabel("game")).toBe("游戏");
});

it("判断哪些使用模式依赖 AI 能力", () => {
  expect(isAiMode("free")).toBe(false);
  expect(isAiMode("subscription")).toBe(true);
  expect(isAiMode("bring_api_key")).toBe(true);
});
```

**步骤 2：运行测试确认失败**

```bash
npm run test -w packages/shared
```

预期：

- 测试失败，因为函数还不存在。

**步骤 3：实现最小代码**

```ts
export type ContentType = "tool" | "game";

export type MonetizationMode =
  | "free"
  | "free_quota"
  | "subscription"
  | "bring_api_key"
  | "platform_ai_pool";

export function getContentTypeLabel(type: ContentType): string {
  return type === "tool" ? "工具" : "游戏";
}

export function isAiMode(mode: MonetizationMode): boolean {
  return mode === "subscription" || mode === "bring_api_key" || mode === "platform_ai_pool";
}
```

**步骤 4：验证**

```bash
npm run test -w packages/shared
npm run typecheck -w packages/shared
```

预期：

- 测试通过。
- 类型检查通过。

**步骤 5：提交**

```bash
git add packages/shared
git commit -m "feat: add shared content domain types"
```

### 任务 4：添加数据库和 Prisma 模型

**文件：**
- 新建：`docker-compose.yml`
- 新建：`apps/web/prisma/schema.prisma`
- 新建：`apps/web/src/lib/db.ts`
- 修改：`apps/web/package.json`
- 修改：`.env.example`

**步骤 1：添加本地基础设施**

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: dreamchasers
      POSTGRES_PASSWORD: dreamchasers
      POSTGRES_DB: dreamchasers
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

**步骤 2：创建 Prisma 模型**

先建内容和统计，不急着做支付。

模型包括：

- `ContentItem`
- `Category`
- `Tag`
- `ContentTag`
- `ClickEvent`
- `UpdateLog`
- `AiRequestLog`
- `UsageQuota`
- `ApiCredential`

**步骤 3：校验 schema**

```bash
npm exec prisma validate -w apps/web
```

预期：

- Prisma schema 校验通过。

**步骤 4：执行本地迁移**

```bash
docker compose up -d postgres redis
npm exec prisma migrate dev --name init_content_schema -w apps/web
```

预期：

- 数据库创建成功。
- 迁移文件生成到 `apps/web/prisma/migrations`。

**步骤 5：提交**

```bash
git add docker-compose.yml .env.example apps/web/prisma apps/web/src/lib/db.ts apps/web/package.json
git commit -m "feat: add content database schema"
```

### 任务 5：添加第一批种子内容

**文件：**
- 新建：`apps/web/prisma/seed.ts`
- 修改：`apps/web/package.json`
- 新建：`apps/web/src/lib/content/seed-content.ts`

**步骤 1：准备第一批内容**

至少包含：

- 20 个工具。
- 5 个游戏。
- 分类包括办公、学生、开发、图片、PDF、文本、休闲游戏。

**步骤 2：添加 seed 脚本**

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

**步骤 3：运行 seed**

```bash
npm exec prisma db seed -w apps/web
```

预期：

- seed 执行完成。
- 内容数据插入或 upsert 成功。

**步骤 4：提交**

```bash
git add apps/web/prisma/seed.ts apps/web/src/lib/content/seed-content.ts apps/web/package.json
git commit -m "feat: add initial content seed"
```

### 任务 6：实现内容查询层

**文件：**
- 新建：`apps/web/src/lib/content/queries.ts`
- 新建：`apps/web/src/lib/content/queries.test.ts`
- 新建：`apps/web/src/lib/content/ranking.ts`
- 新建：`apps/web/src/lib/content/ranking.test.ts`

**步骤 1：先写排序测试**

```ts
import { getHotScore } from "./ranking";

it("优先展示星标和高点击内容", () => {
  expect(getHotScore({ featured: true, clicks: 10, updatedAtDaysAgo: 1 })).toBeGreaterThan(
    getHotScore({ featured: false, clicks: 1, updatedAtDaysAgo: 30 })
  );
});
```

**步骤 2：运行测试确认失败**

```bash
npm run test -w apps/web -- ranking
```

预期：

- 测试失败，因为排序代码还不存在。

**步骤 3：实现最小排序规则**

排序权重只需要：

- 星标加权。
- 点击数加权。
- 最近更新加权。

**步骤 4：实现查询函数**

函数包括：

- `listFeaturedContent`
- `listHotContent`
- `listRecentContent`
- `listContentByType`
- `getContentBySlug`
- `listCategories`

**步骤 5：验证**

```bash
npm run test -w apps/web
npm run typecheck -w apps/web
```

预期：

- 测试通过。
- 类型检查通过。

**步骤 6：提交**

```bash
git add apps/web/src/lib/content
git commit -m "feat: add content query layer"
```

### 任务 7：实现公开门户页面

**文件：**
- 新建：`apps/web/src/app/tools/page.tsx`
- 新建：`apps/web/src/app/games/page.tsx`
- 新建：`apps/web/src/app/tools/[slug]/page.tsx`
- 新建：`apps/web/src/app/games/[slug]/page.tsx`
- 修改：`apps/web/src/app/page.tsx`
- 新建：`apps/web/src/components/content/ContentCard.tsx`
- 新建：`apps/web/src/components/content/ContentGrid.tsx`
- 新建：`apps/web/src/components/content/CategoryFilter.tsx`
- 新建：`apps/web/src/components/content/MonetizationBadge.tsx`

**步骤 1：添加页面冒烟测试**

测试目标：

- 首页同时展示 `工具` 和 `游戏`。
- `/tools` 展示工具列表。
- `/games` 展示游戏列表。
- 详情页展示名称、分类、使用模式、操作按钮。

**步骤 2：运行测试确认失败**

```bash
npm run test:e2e -w apps/web
```

预期：

- 测试失败，因为页面还没有实现。

**步骤 3：实现页面**

首页区块：

- AI 搜索框。
- 工具和游戏两个平级入口。
- 星标工具。
- 星标游戏。
- 最近更新。

**步骤 4：验证**

```bash
npm run lint -w apps/web
npm run typecheck -w apps/web
npm run test:e2e -w apps/web
```

预期：

- 全部检查通过。

**步骤 5：提交**

```bash
git add apps/web/src/app apps/web/src/components/content
git commit -m "feat: build public content portal"
```

### 任务 8：添加 AI 搜索 MVP

**文件：**
- 新建：`apps/web/src/lib/ai/search.ts`
- 新建：`apps/web/src/lib/ai/search.test.ts`
- 新建：`apps/web/src/app/api/ai/search/route.ts`
- 新建：`apps/web/src/components/ai/AiSearchBox.tsx`
- 修改：`apps/web/src/app/page.tsx`

**步骤 1：先写搜索测试**

```ts
import { rankSearchResults } from "./search";

it("能把自然语言需求匹配到内容", () => {
  const results = rankSearchResults("压缩图片", [
    { slug: "image-compressor", title: "图片压缩", keywords: ["图片", "压缩"] },
    { slug: "json-formatter", title: "JSON 格式化", keywords: ["JSON"] }
  ]);

  expect(results[0]?.slug).toBe("image-compressor");
});
```

**步骤 2：运行测试确认失败**

```bash
npm run test -w apps/web -- ai
```

预期：

- 测试失败，因为搜索代码还不存在。

**步骤 3：实现本地搜索**

第一版只做确定性本地排序：

- 标题精确匹配。
- 关键词匹配。
- 分类匹配。
- 标签匹配。
- 描述匹配。

本任务不接真实 LLM。

**步骤 4：添加 API 路由**

输入：

```json
{
  "query": "我想把pdf转成word"
}
```

输出：

```json
{
  "items": [
    {
      "slug": "pdf-to-word",
      "type": "tool",
      "title": "PDF 转 Word",
      "reason": "匹配 PDF、Word、转换"
    }
  ]
}
```

**步骤 5：验证**

```bash
npm run test -w apps/web -- ai
npm run build -w apps/web
```

预期：

- AI 搜索单测通过。
- 构建成功。

**步骤 6：提交**

```bash
git add apps/web/src/lib/ai apps/web/src/app/api/ai apps/web/src/components/ai apps/web/src/app/page.tsx
git commit -m "feat: add local AI-assisted search"
```

### 任务 9：添加后台 MVP

**文件：**
- 新建：`apps/web/src/app/admin/page.tsx`
- 新建：`apps/web/src/app/admin/content/page.tsx`
- 新建：`apps/web/src/app/admin/content/actions.ts`
- 新建：`apps/web/src/lib/admin/auth.ts`
- 修改：`.env.example`

**步骤 1：添加后台鉴权辅助函数**

第一版使用一个环境变量：

- `ADMIN_TOKEN`

这不是最终账号系统，只是为了先让内容更新跑起来。

**步骤 2：添加内容编辑表单**

字段包括：

- 类型。
- 标题。
- slug。
- 简介。
- 分类。
- 标签。
- 是否星标。
- 状态。
- 使用模式。
- 入口 URL。

**步骤 3：手动验证**

运行：

```bash
npm run dev -w apps/web
```

预期：

- `/admin` 没有 token 时不能访问。
- 授权后可以创建或编辑内容。
- 新内容能出现在公开列表中。

**步骤 4：添加冒烟测试**

至少覆盖后台访问限制。

**步骤 5：提交**

```bash
git add apps/web/src/app/admin apps/web/src/lib/admin .env.example
git commit -m "feat: add admin content MVP"
```

### 任务 10：添加使用模式和变现基础

**文件：**
- 新建：`apps/web/src/lib/billing/modes.ts`
- 新建：`apps/web/src/lib/billing/modes.test.ts`
- 新建：`apps/web/src/components/billing/UsageModePanel.tsx`
- 修改：`apps/web/src/app/tools/[slug]/page.tsx`
- 修改：`apps/web/src/app/games/[slug]/page.tsx`

**步骤 1：先写测试**

```ts
import { getUsageModeCopy } from "./modes";

it("解释免费模式", () => {
  expect(getUsageModeCopy("free")).toContain("免费");
});

it("解释自带 API 模式", () => {
  expect(getUsageModeCopy("bring_api_key")).toContain("自带 API");
});
```

**步骤 2：运行测试确认失败**

```bash
npm run test -w apps/web -- billing
```

预期：

- 测试失败，因为 billing helper 还不存在。

**步骤 3：只实现展示，不接支付**

第一版只展示模式：

- 免费。
- 免费限次。
- 订阅。
- 自带 API。
- 平台 AI 能力池。

**步骤 4：验证**

```bash
npm run test -w apps/web -- billing
npm run build -w apps/web
```

预期：

- 测试通过。
- 构建成功。

**步骤 5：提交**

```bash
git add apps/web/src/lib/billing apps/web/src/components/billing apps/web/src/app/tools apps/web/src/app/games
git commit -m "feat: add usage mode foundation"
```

### 任务 11：添加游戏发布基础

**文件：**
- 新建：`apps/game/README.md`
- 新建：`apps/game/publishing/wechat-mini-game.md`
- 新建：`apps/game/publishing/douyin-mini-game.md`
- 新建：`apps/game/publishing/web-export.md`
- 新建：`apps/game/publishing/gdevelop-web-export.md`
- 新建：`apps/web/src/components/game/GameEmbed.tsx`
- 修改：`apps/web/src/app/games/[slug]/page.tsx`

**步骤 1：写清楚游戏工作区规则**

需要包含：

- Cocos Creator 版本。
- GDevelop 推荐版本和项目导出规则。
- 项目命名规范。
- 素材大小限制。
- Web 导出路径。
- 微信小游戏发布清单。
- 抖音小游戏发布清单。

**步骤 2：添加 Web 游戏嵌入组件**

只有当游戏内容存在 Web 试玩 URL 时，才渲染 iframe 或启动面板。

**步骤 3：验证**

```bash
npm run build -w apps/web
```

预期：

- 构建成功。
- 游戏详情页在没有 Web 试玩 URL 时也不会崩。

**步骤 4：提交**

```bash
git add apps/game apps/web/src/components/game apps/web/src/app/games
git commit -m "docs: add game publishing foundation"
```

### 任务 12：添加埋点和热门排序

**文件：**
- 新建：`apps/web/src/app/api/events/click/route.ts`
- 新建：`apps/web/src/lib/analytics/events.ts`
- 新建：`apps/web/src/lib/analytics/events.test.ts`
- 修改：`apps/web/src/lib/content/ranking.ts`
- 修改：`apps/web/src/components/content/ContentCard.tsx`

**步骤 1：先写埋点测试**

```ts
import { normalizeClickEvent } from "./events";

it("规范化点击事件", () => {
  expect(normalizeClickEvent({ slug: "json-formatter", source: "home" })).toEqual({
    slug: "json-formatter",
    source: "home"
  });
});
```

**步骤 2：运行测试确认失败**

```bash
npm run test -w apps/web -- analytics
```

预期：

- 测试失败，因为埋点代码还不存在。

**步骤 3：实现点击事件接口**

规则：

- 接收内容 slug 和来源。
- 写入一条 `ClickEvent`。
- 埋点失败不能阻断用户跳转。

**步骤 4：验证**

```bash
npm run test -w apps/web -- analytics
npm run build -w apps/web
```

预期：

- 测试通过。
- 构建成功。

**步骤 5：提交**

```bash
git add apps/web/src/app/api/events apps/web/src/lib/analytics apps/web/src/lib/content apps/web/src/components/content
git commit -m "feat: add click analytics and ranking"
```

### 任务 13：添加部署文件

**文件：**
- 新建：`apps/web/Dockerfile`
- 新建：`deploy/nginx.conf`
- 新建：`deploy/README.md`
- 修改：`docker-compose.yml`
- 修改：`.env.example`

**步骤 1：添加生产 Dockerfile**

使用标准 Node 构建阶段和运行阶段。

**步骤 2：添加 Nginx 配置**

路由：

- `/` 转发到 Next.js 应用。
- `/games-static/` 指向导出的 Web 游戏文件或对象存储/CDN。

**步骤 3：添加部署文档**

内容包括：

- Ubuntu 24.04 初始化。
- Docker 安装。
- 环境变量。
- 数据库迁移命令。
- 回滚命令。

**步骤 4：验证**

```bash
docker compose config
npm run build -w apps/web
```

预期：

- Docker Compose 配置有效。
- Web 构建成功。

**步骤 5：提交**

```bash
git add apps/web/Dockerfile deploy docker-compose.yml .env.example
git commit -m "chore: add deployment foundation"
```

### 任务 14：添加上线清单和运营手册

**文件：**
- 新建：`docs/checklists/v1-launch-checklist.md`
- 新建：`docs/operations/content-update-playbook.md`
- 新建：`docs/operations/game-release-playbook.md`
- 新建：`docs/operations/ai-search-playbook.md`

**步骤 1：添加上线清单**

清单包括：

- 内容数量。
- SEO 基础。
- 首页 QA。
- 移动端 QA。
- 工具详情页 QA。
- 游戏详情页 QA。
- AI 搜索 QA。
- 后台 QA。
- 埋点 QA。
- 备份和回滚。

**步骤 2：添加运营手册**

每份手册都回答：

- 谁负责。
- 什么时候做。
- 具体步骤。
- 如何验证。
- 如何回滚。

**步骤 3：验证**

检查所有文档：

- 没有占位符。
- 没有互相矛盾的描述。
- 命令可执行。
- 路径一致。

**步骤 4：提交**

```bash
git add docs/checklists docs/operations
git commit -m "docs: add launch and operations playbooks"
```

### 任务 15：实现 PDF 工具箱 MVP

**负责人建议：** 开发 A

**文件：**
- 新建：`apps/web/src/app/tools/pdf-toolbox/page.tsx`
- 新建：`apps/web/src/components/tools/pdf/PdfUploader.tsx`
- 新建：`apps/web/src/components/tools/pdf/PdfPagePreview.tsx`
- 新建：`apps/web/src/components/tools/pdf/PdfActionPanel.tsx`
- 新建：`apps/web/src/lib/tools/pdf/pdf-actions.ts`
- 新建：`apps/web/src/lib/tools/pdf/pdf-actions.test.ts`
- 修改：`apps/web/src/lib/content/seed-content.ts`

**步骤 1：先写 PDF 操作测试**

测试至少覆盖：

- 合并 PDF。
- 拆分 PDF。
- 旋转页面。
- 图片转 PDF。
- PDF 转图片。

**步骤 2：实现纯前端/本地处理能力**

第一版优先使用：

- `PDF.js` 做预览。
- `pdf-lib` 做页面级处理。

不做 PDF 原文在线编辑。

**步骤 3：实现工具页 UI**

页面能力：

- 上传 PDF。
- 预览页数。
- 选择处理动作。
- 执行处理。
- 下载结果。

**步骤 4：加入内容系统**

把 `PDF 工具箱` 加入工具频道、首页推荐和 AI 搜索索引。

**步骤 5：验证**

```bash
npm run test -w apps/web -- pdf
npm run build -w apps/web
```

预期：

- PDF 相关测试通过。
- 构建成功。
- 工具页可以通过入口访问。

**步骤 6：提交**

```bash
git add apps/web/src/app/tools/pdf-toolbox apps/web/src/components/tools/pdf apps/web/src/lib/tools/pdf apps/web/src/lib/content
git commit -m "feat: add pdf toolbox mvp"
```

### 任务 16：实现 AI 修图工具 MVP

**负责人建议：** 开发 B

**文件：**
- 新建：`apps/web/src/app/tools/ai-photo-editor/page.tsx`
- 新建：`apps/web/src/components/tools/photo/PhotoUploader.tsx`
- 新建：`apps/web/src/components/tools/photo/PhotoCanvasEditor.tsx`
- 新建：`apps/web/src/components/tools/photo/PhotoAdjustmentPanel.tsx`
- 新建：`apps/web/src/components/tools/photo/AiEditPanel.tsx`
- 新建：`apps/web/src/lib/tools/photo/adjustments.ts`
- 新建：`apps/web/src/lib/tools/photo/adjustments.test.ts`
- 新建：`apps/web/src/lib/ai/image-provider.ts`
- 修改：`apps/web/src/lib/content/seed-content.ts`

**步骤 1：先写基础修图测试**

测试至少覆盖：

- 亮度参数归一化。
- 对比度参数归一化。
- 饱和度参数归一化。
- 边框配置生成。
- 简单马赛克区域配置。

**步骤 2：实现免费基础编辑**

第一版免费能力：

- 调色。
- 裁剪。
- 旋转。
- 缩放。
- 滤镜。
- 边框。
- 文字。
- 马赛克。
- 手动涂抹/遮盖式简单去水印。

**步骤 3：实现 AI 能力占位**

AI 面板第一版可以先显示：

- 文字指令输入。
- 免费次数/付费提示占位。
- 暂不强制接真实模型。

真实模型接入必须通过 `image-provider.ts`，不能直接写死在组件里。

**步骤 4：加入内容系统**

把 `AI 修图工具` 加入工具频道、首页推荐和 AI 搜索索引。

**步骤 5：验证**

```bash
npm run test -w apps/web -- photo
npm run build -w apps/web
```

预期：

- 修图相关测试通过。
- 构建成功。
- 工具页可以上传图片并导出基础编辑结果。

**步骤 6：提交**

```bash
git add apps/web/src/app/tools/ai-photo-editor apps/web/src/components/tools/photo apps/web/src/lib/tools/photo apps/web/src/lib/ai apps/web/src/lib/content
git commit -m "feat: add photo editor mvp"
```

### 任务 17：实现麻将 Roguelike 消除 MVP

**负责人建议：** 开发 B

**文件：**
- 新建：`apps/game/mahjong-roguelike/README.md`
- 新建：`apps/game/mahjong-roguelike/config/levels.json`
- 新建：`apps/game/mahjong-roguelike/config/relics.json`
- 新建：`apps/game/mahjong-roguelike/docs/rules.md`
- 新建：`packages/shared/src/mahjong-game.ts`
- 新建：`packages/shared/src/mahjong-game.test.ts`
- 修改：`apps/web/src/lib/content/seed-content.ts`

**步骤 1：先写规则测试**

测试至少覆盖：

- 三张相同牌可以 `碰`。
- 同花色连续三张可以 `吃`。
- 四张相同牌可以 `杠`。
- 非法组合不能消除。
- Roguelike 奖励能修改槽位或倍率。

**步骤 2：实现共享规则模型**

先把核心规则放在 `packages/shared`：

- 牌类型。
- 花色。
- 组合判断。
- 奖励类型。
- 关卡目标。

**步骤 3：准备 Cocos 工程规则文档**

写清楚：

- 关卡配置格式。
- 奖励配置格式。
- Web 导出目录。
- 微信/抖音小游戏发布前置条件。
- 如果先用 GDevelop 做 Web 原型，需保持关卡和奖励配置可迁移到 Cocos 正式工程。

**步骤 4：加入内容系统**

把 `麻将 Roguelike 消除` 加入游戏频道、首页推荐和 AI 搜索索引。

**步骤 5：验证**

```bash
npm run test -w packages/shared -- mahjong
npm run build -w apps/web
```

预期：

- 麻将规则测试通过。
- 构建成功。
- 游戏详情页可以展示玩法、规则和 Web 试玩入口占位。

**步骤 6：提交**

```bash
git add apps/game/mahjong-roguelike packages/shared/src/mahjong-game.ts packages/shared/src/mahjong-game.test.ts apps/web/src/lib/content
git commit -m "feat: add mahjong roguelike game foundation"
```

## 5. 30 / 60 / 90 天路线

### 第 1-7 天

- 完成任务 1-4。
- 确认第一批 20 个工具和 5 个游戏。
- 确认 Cocos Creator 版本和微信/抖音发布账号准备情况。

### 第 8-14 天

- 完成任务 5-8。
- 首页、工具、游戏、详情页、AI 搜索 MVP 可以使用。
- 开始内部每日内容评审。

### 第 15-30 天

- 完成任务 9-12。
- 非开发成员可以通过后台更新内容。
- 点击埋点和热门排序生效。
- 至少一个 Web 游戏可以在站内试玩。

### 第 31-60 天

- 完成任务 13-14。
- 部署 staging 和 production。
- 添加第一批广告位。
- 跑通微信/抖音小游戏发布流程。
- 建立每周内容更新节奏。

### 第 61-90 天

- 如果留存数据成立，再添加用户账号。
- 给 AI 工具添加免费次数和使用日志。
- 在安全审查后添加用户自带 API Key 存储。
- 开始设计订阅和 AI 能力池价格。

## 6. 暂时不要做

- 支付系统接入。
- 完整用户中心。
- API 转售市场。
- 复杂 LLM 路由。
- 微服务。
- Kubernetes。
- 自建模型推理。

这些都应该等门户证明有使用量和内容更新能力后再做。

## 7. 后续候选方向

### AI 内容转换工具箱

- 来源参考：`qiaomu-anything-to-notebooklm` skill。
- 核心定位：把多源内容转换成可直接使用的成品，而不是只给摘要。
- 第一版成品输出优先级：
  1. NotebookLM 知识包。
  2. 播客脚本。
  3. PPT 大纲。
  4. 思维导图。
- 起步方式：
  1. 先只接用户自有资料和公开链接。
  2. 先做单文件处理，再做多文件合并。
  3. 先定义统一输入输出 schema，再做渲染和导出。
  4. 不做付费墙穿透，不做侵权导向抓取。
- 如果后续要做成产品，优先把它拆成独立工具页，而不是塞进 PDF 工具箱或 AI 修图工具里。

## 8. 上线前验证

上线前运行：

```bash
npm run lint
npm run typecheck
npm run test
npm run build
docker compose config
```

预期：

- 全部检查通过。
- 首页在桌面端和移动端都能正常使用。
- 工具和游戏列表有真实内容。
- AI 搜索对至少 30 个常见需求能返回有用列表。
- 后台可以不改代码新增内容。
- 至少一个游戏有 Web 试玩路径。
