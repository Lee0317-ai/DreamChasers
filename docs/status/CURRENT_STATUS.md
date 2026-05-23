# 当前项目状态

**最后更新**：2026-05-23
**状态维护人**：开发者每次开工和收工时共同维护
**必读**：每个 AI 会话开始前必须读取本文件

## 1. 当前阶段

阶段：规划完成，准备进入基础搭建。

当前总目标：

- 建立项目基础结构。
- 明确双人开发边界。
- 第一阶段实现 `PDF 工具箱`、`AI 修图工具`、`麻将 Roguelike 消除`。

## 2. 当前任务看板

权威任务池是 `docs/tasks/TASK_BOARD.md`。本节只作为快照摘要，可能落后于任务池；领取任务和判断文件冲突时，以 `TASK_BOARD.md` 和 `docs/tasks/CLAIMS.md` 为准。

| 任务 | 名称 | 负责人 | 状态 | 允许修改范围 | 下一步 |
| --- | --- | --- | --- | --- | --- |
| 1 | 创建 Monorepo 外壳 | 开发 A | 已完成 | `package.json`, `tsconfig.base.json`, `apps/**`, `packages/**` | 已完成基础 workspace |
| 2 | 搭建 Web 应用 | 开发 A | 已完成 | `apps/web/**` | 已完成 Next.js 基础应用 |
| 3 | 添加共享领域类型 | 开发 B | 未开始 | `packages/shared/**` | 建立内容类型和使用模式类型 |
| 4 | 添加数据库和 Prisma 模型 | 开发 A | 已完成 | `apps/web/prisma/**`, `apps/web/src/lib/db.ts`, `docker-compose.yml` | 建立内容模型 |
| 5 | 添加第一批种子内容 | 开发 A | 未开始 | `apps/web/src/lib/content/**`, `apps/web/prisma/seed.ts` | 准备工具/游戏初始数据 |
| 6 | 实现内容查询层 | 开发 A | 未开始 | `apps/web/src/lib/content/**` | 实现热门、星标、最近更新 |
| 7 | 实现公开门户页面 | 开发 A | 未开始 | `apps/web/src/app/**`, `apps/web/src/components/content/**` | 首页和频道页 |
| 8 | 添加 AI 搜索 MVP | 开发 B | 未开始 | `apps/web/src/lib/ai/**`, `apps/web/src/components/ai/**`, `apps/web/src/app/api/ai/**` | 本地匹配搜索 |
| 9 | 添加后台 MVP | 开发 A | 未开始 | `apps/web/src/app/admin/**`, `apps/web/src/lib/admin/**` | 内容后台 |
| 10 | 添加使用模式和变现基础 | 开发 A | 未开始 | `apps/web/src/lib/billing/**`, `apps/web/src/components/billing/**` | 免费/限次/订阅展示 |
| 11 | 添加游戏发布基础 | 开发 B | 未开始 | `apps/game/**`, `apps/web/src/components/game/**` | Cocos 发布文档和 Web 嵌入 |
| 12 | 添加埋点和热门排序 | 开发 B | 未开始 | `apps/web/src/lib/analytics/**`, `apps/web/src/app/api/events/**` | 点击统计 |
| 13 | 添加部署文件 | 开发 B | 未开始 | `deploy/**`, `apps/web/Dockerfile`, `docker-compose.yml` | Docker/Nginx |
| 14 | 添加上线清单和运营手册 | 两人协作 | 未开始 | `docs/checklists/**`, `docs/operations/**` | 补齐上线流程 |
| 15 | 实现 PDF 工具箱 MVP | Codex / 开发 A | 进行中 | `apps/web/src/app/tools/pdf-toolbox/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/web/src/components/portal-data.ts`, `docs/modules/pdf-toolbox/**`, `apps/web/package.json`, `package-lock.json` | 已完成核心页面处理、文字水印、签名、PDF 转 Word Beta、区域遮盖和图片扫描成 PDF；下一步补 PDF 转图片和基础压缩 |
| 16 | 实现 AI 修图工具 MVP | 开发 B | 未开始 | `apps/web/src/app/tools/ai-photo-editor/**`, `apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**` | 基础修图和 AI 占位 |
| 17 | 实现麻将 Roguelike 消除 MVP | 开发 B | 未开始 | `apps/game/mahjong-roguelike/**`, `packages/shared/src/mahjong-game.ts` | 规则模型和游戏文档 |
| 18 | 建立 Git 忽略规则和协作入口 | 开发 A | 已完成 | `.gitignore`, `README.md`, `.claude/settings.local.json`, `.obsidian/workspace.json`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-19.md`, `docs/completion/**` | 提交后本地状态文件不再上传 |
| 19 | 确认 GDevelop 游戏模块定位 | 开发 B | 已完成 | `docs/**` | 后续由 T020 接入 Web 原型通道 |
| 20 | 添加 GDevelop Web 游戏原型通道 | 开发 B | 未开始 | `apps/game/gdevelop/**`, `apps/game/publishing/gdevelop-web-export.md`, `apps/web/src/modules/games/**`, `apps/web/src/app/games/**`, `packages/shared/src/game-engine.ts`, `docs/modules/mahjong-roguelike/**` | 领取后实现统一嵌入和导出规范 |
| 21 | AI 内容转换工具箱规划 | 两人协作 | 已完成 | `docs/PROJECT_CONTEXT.md`, `docs/plans/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**` | 规划完成，后续再拆实现任务 |
| 22 | 按 `docs/网站UI.zip` 适配前端门户 UI | 开发 A | 已完成 | `apps/web/src/app/**`, `apps/web/src/components/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**` | 迁移静态设计导出的视觉和交互 |
| 23 | 补充 Supabase 数据库交接文档 | 开发 A | 已完成 | `docs/handoffs/**`, `docs/decisions/**`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/**`, `docs/progress/2026-05-20.md`, `docs/completion/**` | 已完成数据库交接文档 |
| 24 | 修复 Vercel 子目录 Next.js 识别失败 | 开发 A | 已完成 | `apps/web/package.json`, `package-lock.json`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**` | 已补齐 Web 子应用框架依赖 |
| 25 | 拆分独立工具站和游戏站入口体验 | 开发 A | 已完成 | `apps/web/src/app/**`, `apps/web/src/components/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**` | 已按 `docs/网站UI/` 拆分入口、工具站和游戏站体验 |
| 26 | 建立工具/游戏独立模块归档规范 | 两人协作 | 已完成 | `docs/modules/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**` | 已明确每个工具/游戏独立文档文件夹和独立代码模块规则 |
| 27 | 补充 AGENTS.md 文档输出格式规则 | Codex / 开发 A | 已完成 | `AGENTS.md`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**` | 已补充 Markdown / HTML 输出格式选择规则 |
| 28 | 将独立模块归档规则写入整体架构 | 两人协作 | 已完成 | `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/PROJECT_CONTEXT.md`, `docs/superpowers/specs/**`, `docs/plans/**`, `docs/workflow/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**` | 已把模块归档和独立代码目录规则写入入口与整体架构文档 |
| 29 | 麻将 Roguelike 消除框架调研和规划 | Codex / 开发 B | 已完成 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**` | 已补齐麻将模块文档目录和框架规划，供后续讨论玩法细节 |
| 30 | 麻将 Roguelike 手动组合和成长系统规划 | Codex / 开发 B | 已完成 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 已明确手动组合、按钮状态、槽位成长、货币、奖励和道具体系 |
| 31 | 麻将 Roguelike 最终模式结构定稿 | Codex / 开发 B | 已完成 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 已确认闯关、无尽、高阶周目、每日牌局、成就图鉴的最终结构 |
| 32 | 麻将 Roguelike 高阶挑战系统规划 | Codex / 开发 B | 已完成 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 已规划词缀、随机事件、卡槽压缩和 Boss 试炼 |
| 33 | 麻将 Roguelike 组合提示和牌堆生成规则 | Codex / 开发 B | 已完成 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 已明确组合提示、组合选择、手动选牌挑战、孤张处理和受控随机牌堆 |
| 34 | 麻将 Roguelike 牌谱记牌器规划 | Codex / 开发 B | 已完成 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 已明确顶部余牌系统、详细点数、实时减少和透视分工 |
| 35 | 麻将 Roguelike 局内能力池规划 | Codex / 开发 B | 已完成 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 已规划孤张、补牌、换牌、杠流等局内能力池 |
| 36 | 降低多人协作文档冲突的分片同步规范 | Codex / 两人协作 | 已完成 | `AGENTS.md`, `CLAUDE.md`, `docs/PROJECT_CONTEXT.md`, `docs/workflow/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 已建立分步写分片、完整任务完成后汇总主文档的规则 |
| 37 | 新增 docs:sync 自动汇总脚本 | Codex / 两人协作 | 已完成 | `package.json`, `scripts/docs-sync.mjs`, `docs/workflow/doc-sync-policy.md`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 已建立自动汇总主文档摘要区的脚本 |
| 38 | 麻将 Roguelike 永久固化能力和卡槽系统规划 | Codex / 开发 B | 已完成 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 已区分基础成长、固化能力、起局能力和道具强化，并明确手牌槽位与能力卡槽分离 |
| 39 | 条件启用 Next.js standalone 自托管构建 | Codex / 开发 A | 已完成 | `apps/web/next.config.ts`, `apps/web/package.json`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 已通过环境变量条件启用 standalone 构建，默认构建保持 Vercel 兼容 |
| 40 | 麻将 Roguelike 完整牌局规则、经济体力和失败救场规划 | Codex / 开发 B | 已完成 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 已明确输入锁定、组合候选、局内积分、铜钱、体力、满槽救场和新手引导 |
| 41 | 麻将 Roguelike 团队评审版玩法方案 | Codex / 开发 B | 已完成 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 已产出 Markdown 玩法方案和 HTML 可视化评审稿 |
| 42 | 麻将 Roguelike MVP 玩法验证计划 | Codex / 开发 B | 已完成 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**` | 已明确最小验证闭环、核心假设、观察指标和 MVP 冻结线 |
| 43 | 麻将 Roguelike 最小可玩闭环和 MVP 开发拆分计划 | Codex / 开发 B | 已完成 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**` | 已明确验证原型、受控随机、观察记录、正式 MVP 拆分和下一步 T044 |
| 44 | 麻将 Roguelike 最小可玩验证原型 | Codex / 开发 B | 已完成 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**` | 已完成可试玩 HTML 原型，覆盖 5 个验证场景和桌面/移动端检查 |

## 3. 当前活跃任务

### 当前任务

- 任务编号：T015
- 任务名称：实现 PDF 工具箱 MVP
- 负责人：Codex / 开发 A
- 状态：进行中
- 开始时间：2026-05-21
- 允许修改文件：`apps/web/src/app/tools/pdf-toolbox/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/web/src/components/portal-data.ts`, `apps/web/package.json`, `package-lock.json`, `docs/modules/pdf-toolbox/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**`
- 禁止修改文件：`packages/**`, `apps/game/**`, `apps/web/prisma/**`, `apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**`, `docker-compose.yml`, `package.json`
- 验证命令：`npm run test -w apps/web -- pdf`; `npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 桌面端和移动端检查
- 当前阻塞：无
- 下一步：按 `docs/modules/pdf-toolbox/IMPLEMENTATION_PLAN.md` 继续补 PDF 转图片和基础压缩。

领取任务后填写：

```md
### 当前任务

- 任务编号：
- 任务名称：
- 负责人：
- 状态：进行中
- 开始时间：
- 允许修改文件：
- 禁止修改文件：
- 验证命令：
- 当前阻塞：
- 下一步：
```

## 4. 已完成事项

- 已确认产品定位：免费工具游戏门户，后续扩展 AI 能力平台。
- 已确认工具和游戏平级。
- 已确认 AI 搜索只做辅助发现，返回推荐列表。
- 已确认第一阶段三个交付：PDF 工具箱、AI 修图工具、麻将 Roguelike 消除。
- 已确认不调用模型的能力尽量免费。
- 已确认双人开发模式和默认负责人边界。
- 已新增根目录 `AGENTS.md` 和 `CLAUDE.md`，要求 AI 每次任务前读取项目上下文、当前状态、协作规范和实施计划。
- 已新增 `.gitignore` 和 README 协作入口，减少依赖、构建产物、本地环境和编辑器状态文件误上传。
- 已从 Git 索引移除 `.claude/settings.local.json` 和 `.obsidian/workspace.json`，本地文件仍保留。
- 已确认 GDevelop 的游戏模块定位：作为 Web H5 原型和轻量小游戏通道；Cocos Creator 仍作为微信/抖音小游戏正式发布主线。
- 已识别后续候选方向：AI 内容转换工具箱，来源参考 `qiaomu-anything-to-notebooklm` skill。
- 已修复 Vercel 子目录部署识别问题：`apps/web/package.json` 已声明 `next`、`react`、`react-dom`。
- 已按 `docs/网站UI/` 最新设计把首页改为工具站/游戏站左右分流入口，并让 `/tools` 与 `/games` 保持独立导航、独立视觉和顶部单一互跳入口。
- 已领取 `T015`，并补充 PDF 工具箱模块说明与实施计划：`docs/modules/pdf-toolbox/README.md`、`docs/modules/pdf-toolbox/IMPLEMENTATION_PLAN.md`。
- 已完成 `T026`：以后每个小工具和游戏都必须有独立模块文档文件夹；代码实现也必须放在独立模块目录，路由层只做入口。
- 已完成 `T027`：在根目录 `AGENTS.md` 中补充文档输出格式规则，明确人工维护和需要 Git diff 的文档用 Markdown，AI 生成方案、调研、汇报、交互或一次性阅读材料用 HTML。
- 已完成 `T028`：将独立模块归档规则同步到 `AGENTS.md`、`CLAUDE.md`、`README.md`、项目上下文、整体设计稿、实施计划和协作规范。
- 已完成 `T029`：补齐 `docs/modules/mahjong-roguelike/` 必备文档，并形成麻将 Roguelike 消除的框架调研与规划，明确 Cocos 正式工程、GDevelop Web 原型、Next.js 站内嵌入和共享配置优先路线。
- 已完成 `T030`：将麻将消除改为手动组合触发，规划 `吃 / 碰 / 杠` 按钮状态、槽位成长属性、货币升级、局内奖励和道具体系。
- 已完成 `T031`：确认麻将 Roguelike 最终结构为 `闯关模式`、`无尽牌山`、`高阶周目`、`每日牌局`、`成就图鉴`。
- 已完成 `T032`：确认高阶挑战由牌山层数增长、词缀系统、随机事件、卡槽压缩和 Boss 试炼组成。
- 已完成 `T033`：确认吃碰杠合法组合提示、组合选择、后续手动选牌挑战、碰掉杠后的孤张处理和受控随机牌堆生成规则。
- 已完成 `T034`：确认顶部 `余牌/牌谱记牌器`，用于显示本局剩余花色和点数数量，辅助玩家判断是否等待吃碰杠和孤张补牌。
- 已完成 `T035`：规划局内 Roguelike 能力池，重点覆盖孤张处理、补牌、换牌、杠流、吃碰花色、槽位、道具和信息流派。
- 已完成 `T036`：建立文档同步与冲突规避规则，后续分步操作优先写任务分片、领取分片、模块进展或当天进展；完整任务完成后再由 AI 汇总 `TASK_BOARD.md`、`CLAIMS.md` 和 `CURRENT_STATUS.md`。
- 已完成 `T037`：新增 `npm run docs:sync`，从任务分片和领取分片自动生成 `TASK_BOARD.md`、`CLAIMS.md` 和 `CURRENT_STATUS.md` 的摘要区。
- 已完成 `T038`：确认麻将 Roguelike 永久能力分为基础成长、固化能力、起局能力和道具强化四层，并明确 `手牌槽位` 与 `能力卡槽` 分开管理。
- 已完成 `T042`：新增麻将 Roguelike MVP 玩法验证计划，明确先用最小可玩闭环验证手动吃碰杠、槽位压力、余牌、奖励和失败救场，再冻结正式 MVP 范围。
- 已完成 `T043`：新增麻将 Roguelike 最小可玩闭环和 MVP 开发拆分计划，明确后续先拆 T044 验证原型，验证通过后再回到 T017 正式开发。
- 已完成 `T044`：新增麻将 Roguelike 最小可玩验证原型 HTML，支持 5 个验证场景、手动吃碰杠、余牌、奖励选择和满槽救场。
- `T015` 已完成 PDF 工具箱核心页面级处理第一轮：上传、预览、选择、旋转、排序、删除、拆分和下载。
- `T015` 已补充文字水印、签名图片、PDF 转 Word Beta、区域遮盖和图片扫描成 PDF；扫描件 OCR 仍按规划留到后续 AI/OCR 能力。

## 5. 当前阻塞

暂无。

## 6. 关键决策

### 决策 1：收费原则

不调用模型能力、不产生明显高成本的功能，第一阶段尽量免费。

### 决策 2：PDF 编辑边界

第一版不做完整 PDF 原文在线编辑，只做页面级处理和转换。

### 决策 3：AI 修图边界

基础修图免费，调用 AI 模型的能力收费或限次。

### 决策 4：游戏方向

小游戏不是简单换皮，而是麻将消除 + Roguelike 奖励构筑。

### 决策 5：协作方式

每个开发者和各自 AI 必须通过文档同步，状态统一记录在本文件。

### 决策 6：游戏引擎定位

Cocos Creator 负责正式小游戏发布路径，尤其是微信小游戏和抖音小游戏。GDevelop 只作为 Web H5 原型、站内试玩和轻量小游戏快速生产通道，不替代 Cocos。

## 7. 下一步建议

1. 开发 A 领取任务 1：创建 Monorepo 外壳。
2. 开发 B 并行领取任务 3：添加共享领域类型。
3. 开发 B 在游戏发布基础任务前关注 `T020`，把 GDevelop Web 原型通道纳入游戏模块。
4. 已补充 `T021`：AI 内容转换工具箱规划，后续再拆实现任务。
5. 两人完成后同步更新本文件。
6. 再进入任务 2、4、8、17。

## 8. 任务池和领取入口

所有可领取任务记录在：

`docs/tasks/TASK_BOARD.md`

任务详情分片记录在：

`docs/tasks/items/`

所有正在进行的任务、文件锁定、冲突和交接记录在：

`docs/tasks/CLAIMS.md`

领取分片记录在：

`docs/tasks/claims/`

文档同步规则记录在：

`docs/workflow/doc-sync-policy.md`

所有新想法和需求变更先记录在：

`docs/tasks/CHANGE_INTAKE.md`

没有在 `docs/tasks/CLAIMS.md` 领取任务前，不要修改代码。

<!-- DOCS_SYNC_STATUS_START -->
## 9. 自动生成分片同步摘要

> 本节由 `npm run docs:sync` 生成。请修改 `docs/tasks/items/` 和 `docs/tasks/claims/` 中的分片文件，不要手工编辑本节。

### 任务分片

- 已扫描任务分片：10 个。
- 已扫描领取分片：10 个。

### 当前未完成领取

- 暂无未完成领取分片。

### 最近完成任务分片

- T040：麻将 Roguelike 完整牌局规则、经济体力和失败救场规划，负责人：Codex / 开发 B
- T041：麻将 Roguelike 团队评审版玩法方案，负责人：Codex / 开发 B
- T042：麻将 Roguelike MVP 玩法验证计划，负责人：Codex / 开发 B
- T043：麻将 Roguelike 最小可玩闭环和 MVP 开发拆分计划，负责人：Codex / 开发 B
- T044：麻将 Roguelike 最小可玩验证原型，负责人：Codex / 开发 B
<!-- DOCS_SYNC_STATUS_END -->
