# T062：胡了卜 Cocos Creator 3.8.8 工程接入

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：已完成
- 背景：用户已安装 Cocos Dashboard 和 Cocos Creator 3.8.8。T061 已完成 Cocos 场景视图模型、节点结构和绑定清单，下一步需要创建正式 Cocos 工程壳，让后续编辑器工作可以从真实项目目录开始。
- 目标：在 `apps/game/mahjong-roguelike/cocos/` 下创建 Cocos Creator 3.8.8 可接手的胡了卜工程壳，包含 `empty-2d` 风格项目结构、脚本边界、配置导入说明、场景占位和工程结构测试。
- 不做：不导入最终青瓷牌面，不生成完整可玩 `.scene`，不实现动画、音效、发布包、微信/抖音构建，不接 `apps/web/**`，不复制 HTML 原型 DOM 状态。
- 依赖：T061
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/docs/**`, `apps/game/mahjong-roguelike/README.md`, `packages/shared/src/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T062-hulebu-cocos-creator-project.md`, `docs/tasks/claims/T062-codex.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 进展：
  - 2026-05-25：开始任务，已确认本机 Cocos Creator 3.8.8 安装在 `/Applications/Cocos/Creator/3.8.8/CocosCreator.app`，并找到内置 `empty-2d` 模板。
  - 2026-05-25：已新增 `mahjong-cocos-project` 红灯测试，确认工程壳缺失时测试失败。
  - 2026-05-25：已创建 `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/`，包含 Creator `empty-2d` 风格项目结构、首场景脚本边界、场景占位说明和配置导入占位。
  - 2026-05-25：已通过工程结构测试、共享回归、类型检查、文档同步和 diff 检查，任务完成。
