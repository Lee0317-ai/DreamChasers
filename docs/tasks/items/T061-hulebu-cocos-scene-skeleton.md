# T061：胡了卜 Cocos 场景骨架第一版

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：T060 已完成共享表现层快照和 Cocos/GDevelop 承接文档。用户要求继续推进正式表现层，因此下一步进入 Cocos 场景骨架，但当前不确认本机已有 Cocos Creator 编辑器，先做不依赖编辑器运行的可测试骨架。
- 目标：在共享包中新增 Cocos 友好的场景视图模型适配器，并在 `apps/game/mahjong-roguelike/cocos/` 下建立场景骨架说明、脚本边界和节点绑定清单，为后续 Cocos Creator 工程接入做准备。
- 不做：不安装 Cocos Creator，不生成完整 `.scene`、`.prefab` 或 `.meta`，不接最终青瓷牌面，不做动画/音效/发布包，不接 `apps/web/**`。
- 依赖：T060
- 主要文件范围：`packages/shared/src/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/docs/**`, `apps/game/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T061-hulebu-cocos-scene-skeleton.md`, `docs/tasks/claims/T061-codex.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 进展：
  - 2026-05-25：开始任务，先登记变更和领取记录，再用测试定义 Cocos 场景视图模型。
  - 2026-05-25：已新增 `packages/shared/src/mahjong-cocos-scene.ts` 和测试，把表现层快照转换为 Cocos 节点、控件和 HUD 绑定模型。
  - 2026-05-25：已新增 `apps/game/mahjong-roguelike/cocos/` 场景骨架说明、脚本边界和节点绑定清单。
  - 2026-05-25：已通过共享测试、类型检查、文档同步和 diff 检查，进入待验收。
