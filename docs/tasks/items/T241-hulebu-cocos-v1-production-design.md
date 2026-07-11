# T241：胡了卜 Cocos 正式游戏 v1 产品与技术重规划

- 优先级：P0
- 默认负责人：Lee
- 状态：已完成
- 依赖：方向确认完成；实现阶段需先核对 T239、T240 的收口状态
- 主要文件范围：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T241-hulebu-cocos-v1-production-design.md`, `docs/tasks/claims/T241-lee.md`, `docs/superpowers/specs/2026-07-10-hulebu-cocos-v1-production-design.md`, `docs/modules/mahjong-roguelike/HULEBU_COCOS_V1_ROADMAP.html`, 以及 `npm run docs:sync` 自动更新的任务主文档摘要区
- 禁止修改范围：`apps/**`, `packages/**`, 数据库与账号代码、PDF 工具箱、AI 修图工具、其他游戏模块；本任务不实施游戏功能
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]|待[定]|implement l[a]ter|fill in d[e]tails" docs/superpowers/specs/2026-07-10-hulebu-cocos-v1-production-design.md docs/modules/mahjong-roguelike/HULEBU_COCOS_V1_ROADMAP.html docs/tasks/items/T241-hulebu-cocos-v1-production-design.md`; HTML 标签/锚点结构检查；Kimi WebBridge 1440x900 与 390x844 视口检查；`git diff --check`; UTF-8 无 BOM 检查

## 背景

当前 Cocos 工程已经包含牌山、槽位、吃碰杠胡、奖励、事件、Boss、长期成长和本地存档等大量能力，但实现与 Web demo 已经分叉，入口、流程、UI、音频、构建和验收没有共同的上线定义。继续逐功能补丁会进一步扩大控制器职责和双运行时漂移。

## 目标

- 确认 Cocos 为胡了卜唯一正式游戏运行时，Web 只负责承载、启动和站点集成。
- 冻结一个可上线的 v1 产品合同：20–30 分钟单章、8–12 个遭遇、教学、奖励、Boss、结算、失败恢复和本地继续。
- 明确规则/流程/渲染/UI/存档/内容/音频的代码边界及迁移顺序。
- 明确正式 UI、声音、资源、性能、构建、浏览器与真机 QA 的可验收门槛。
- 给后续实现拆分提供唯一设计基线，避免继续堆叠不相干功能。

## 不做

- 不在本任务中改 Cocos、Web 或 shared 代码。
- 不把无尽、高阶周目、每日、成就图鉴和账号跨端同步列为 v1 上线阻塞项。
- 不引入第二个正式运行时，也不继续维护 Cocos 与 Web demo 的功能对等。
- 不扩展为完整麻将算法、多人玩法、排行榜、支付或商业化系统。

## 验收标准

- 正式设计规格覆盖产品范围、玩家旅程、核心循环、失败/恢复、架构、数据流、UI、音频、存档、错误处理、性能、测试、发布和迁移策略。
- 路线图将工作拆成有顺序的阶段，每阶段都有输入、产物、退出标准和明确不做项。
- 所有上线门槛可验证，不保留未决标记或模糊的“后续完善”。
- 规划明确纠正构建现状：Cocos 3.8.8 fresh web-mobile build 能生成 `index.html`，但命令行在日志显示 Finished 后返回 36，需要发布包装器按产物和日志判定并继续定位退出码。
- 用户完成书面规格审阅后，才进入代码级实施计划与实现。

## 交付物

- 可版本审阅的 Markdown 设计规格：`docs/superpowers/specs/2026-07-10-hulebu-cocos-v1-production-design.md`。
- 便于一次性阅读和汇报的 HTML 路线图：`docs/modules/mahjong-roguelike/HULEBU_COCOS_V1_ROADMAP.html`。

## 进展记录

### 2026-07-10

- 已完成 Web/Cocos 代码结构、资源、音频、测试和 fresh build 现状审计。
- Lee 已确认“Cocos 唯一正式运行时、冻结 Web demo、先做一个完整章节”的方向。
- 已完成正式设计规格和可视化路线图，并通过无未决标记、结构、桌面/手机视口、UTF-8 无 BOM 与 diff 空白检查。
- 2026-07-11 Lee 已确认开始实施，书面规格通过验收；后续代码工作从 T242 的 M0 发布基线开始。
