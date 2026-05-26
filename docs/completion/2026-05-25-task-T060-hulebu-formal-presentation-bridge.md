# T060 完成记录：胡了卜 Cocos/GDevelop 正式表现层桥接

- 任务编号：T060
- 负责人：Codex / 开发 B
- 完成日期：2026-05-25

## 修改文件

- `packages/shared/src/mahjong-presentation.ts`
- `packages/shared/src/mahjong-presentation.test.ts`
- `packages/shared/src/index.ts`
- `apps/game/mahjong-roguelike/docs/formal-presentation-bridge.md`
- `apps/game/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/DECISIONS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T060-hulebu-formal-presentation-bridge.md`
- `docs/tasks/claims/T060-codex.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/2026-05-25.md`

## 实现内容

- 新增 `createMahjongPresentationSnapshot`，把 `MahjongGameState` 转成引擎无关表现层快照。
- 快照覆盖牌山渲染项、可点击/遮挡状态、8 格主槽、备用槽、`胡 / 杠 / 碰 / 吃` 按钮、余牌统计和 HUD 状态。
- 支持通过 `layoutByTileId` 给 Cocos/GDevelop 传入逻辑坐标、来源包和同列堆叠深度。
- 新增测试保护正式表现层契约，确保 Cocos/GDevelop 能消费稳定的数据结构。
- 新增正式表现层桥接文档，说明 Cocos 场景结构、GDevelop 对象变量映射、输入回传和当前边界。

## 验证命令

- `npm run test -w packages/shared -- mahjong-presentation`
- `npm run test -w packages/shared -- mahjong`
- `npm run typecheck -w packages/shared`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 红灯测试通过：缺少 `mahjong-presentation` 时测试失败，确认测试能抓到缺失实现。
- 单项表现层测试通过。
- 共享麻将测试通过：3 个测试文件、30 个测试通过。
- 类型检查通过。
- 文档同步通过。
- `git diff --check` 通过。

## 遗留问题

- 本任务只完成正式表现层桥接契约，不创建完整 Cocos Creator 或 GDevelop 工程。
- Cocos 下一步需要建立实际场景骨架，并把 snapshot diff、动画、资源加载和输入锁定接进去。
- GDevelop 下一步只应映射 snapshot 对象变量，不要重新实现规则判断。
