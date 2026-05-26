# T070：胡了卜 Cocos 点击后遮挡解锁和槽位牌名显示

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：T069 已跑通点击入槽和基础组合消除，但点击上层牌后下层牌仍保持灰色不可点；进入下方槽位的牌也没有显示牌名。
- 目标：在 Cocos 测试首屏中补齐 `点击上层牌 -> 剩余牌重新计算遮挡和可点态 -> 入槽牌显示牌名` 的反馈链路。
- 不做：不接真实 20 关配置，不导入最终 Sprite prefab，不做完整可解路径搜索，不做动画、音效、奖励、Boss 目标或下一关流转。
- 依赖：T069
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T070-hulebu-cocos-unlock-slot-labels.md`, `docs/tasks/claims/T070-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/progress/2026-05-26.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`; Cocos Web Preview 手机视口手动点击检查。
- 进展：
  - 2026-05-26：新增任务，目标是修复点击上层牌后下层牌不解锁，以及主槽不显示已选牌名的问题。
  - 2026-05-26：已补充 Cocos 工程结构测试，要求 `GameSceneController` 在点击后按剩余牌重新计算 5% 遮挡阈值，并要求 `SlotLayerBinder` 稳定创建槽位 Label。
  - 2026-05-26：已实现点击入槽后的剩余牌遮挡重算；移走上层牌后，下层牌会重新变亮并恢复可点态。
  - 2026-05-26：已修复主槽牌名显示；入槽牌会在对应 8 格槽位中显示当前牌名。
  - 2026-05-26：已修正 Cocos `resources.meta` 的 Asset Bundle 配置，避免 Web Preview 查询 settings 时触发 `Cannot read properties of undefined (reading 'value')`。
  - 2026-05-26：已在 Cocos Web Preview 手机视口手动验证 `7条 / 8条 / 9条` 入槽显示、`吃` 消除后下层 `西` 解锁并可继续入槽。
- 完成摘要：已完成 Cocos 测试首屏点击后遮挡解锁和槽位牌名显示修复；当前仍是本地测试 scene model，下一步应切到真实配置和最终牌面 prefab。
