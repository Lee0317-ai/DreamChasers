# T050 完成记录：胡了卜牌山生成器和密集堆叠布局

- 任务编号：T050
- 负责人：Codex / 开发 B
- 完成日期：2026-05-23

## 修改文件

- `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- `apps/game/mahjong-roguelike/README.md`
- `apps/game/mahjong-roguelike/docs/tile-mountain-generator.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/DECISIONS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T050-hulebu-tile-mountain-generator.md`
- `docs/tasks/claims/T050-codex.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/2026-05-23.md`

## 实现内容

- 在配置试玩页新增 `配置关卡 / 密集牌山` 模式切换。
- 新增确定性牌山生成器，按关卡 `id/order` 生成稳定牌山。
- 新增组合包铺牌逻辑，从当前关卡收集 `吃 / 碰 / 杠` 模式生成更多牌。
- 新增 4 层坐标模板和自动 `blockedBy` 计算。
- 修正高牌量下的 z-index 层级命中问题。
- 补充密集牌山生成器说明文档和模块交接记录。

## 验证命令

- 浏览器密集模式检查。
- 浏览器配置模式回归。
- 窄宽度布局检查。
- `npm run test -w packages/shared -- mahjong`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 浏览器密集模式检查通过：第 1 关生成 50 张牌，42 张被压住；点击顶层三张 `2万` 后 `碰 1` 亮起，下层牌可继续解锁。
- 浏览器配置模式回归通过：切回配置关卡后，点击三张 `9筒` 仍可触发 `碰 1`。
- 窄宽度检查通过：当前 546px 浏览器宽度下无横向溢出。

## 遗留问题

- 当前生成器仍是 HTML 原型层，不是最终 Cocos/GDevelop 工程。
- 当前不做完整可解路径搜索，后续需要根据试玩反馈调整组合包比例、层数、初始可点击牌和失败压力。
- 视觉、动画、音效和正式输入手感仍需在正式工程中重做。
