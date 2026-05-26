# T060：胡了卜 Cocos/GDevelop 正式表现层桥接

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：T059 已把随机牌山调参能力补进 HTML 配置试玩页。用户要求开始进入 Cocos/GDevelop 正式表现层承接，而既有架构明确 Cocos Creator 是正式发布主线、GDevelop 是 Web H5 原型和轻量通道。因此当前任务先做引擎无关表现层桥接，避免后续把 HTML 原型状态直接复制进两个引擎。
- 目标：新增共享表现层快照契约，让 Cocos/GDevelop 都能从同一份规则状态读取牌山、卡槽、备用槽、组合按钮、余牌、工具和 HUD 信息；补充正式承接文档，说明 Cocos 场景结构、GDevelop 对象变量、输入回传和资源替换边界。
- 不做：不安装 Cocos Creator，不创建完整 Cocos 工程，不制作 GDevelop 成品工程，不导入最终美术/音效，不接 `apps/web/**`，不做排行榜、支付、埋点或发布包。
- 依赖：T059
- 主要文件范围：`packages/shared/src/**`, `apps/game/mahjong-roguelike/docs/**`, `apps/game/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T060-hulebu-formal-presentation-bridge.md`, `docs/tasks/claims/T060-codex.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 进展：
  - 2026-05-25：开始任务，先登记变更和领取记录，再用测试定义正式表现层快照契约。
  - 2026-05-25：已新增 `packages/shared/src/mahjong-presentation.ts` 和测试，输出牌山、槽位、备用槽、组合按钮、余牌和 HUD 快照。
  - 2026-05-25：已新增 `apps/game/mahjong-roguelike/docs/formal-presentation-bridge.md`，明确 Cocos/GDevelop 消费快照的场景结构和对象变量映射。
  - 2026-05-25：已通过共享测试、类型检查、文档同步和 diff 检查，进入待验收。
