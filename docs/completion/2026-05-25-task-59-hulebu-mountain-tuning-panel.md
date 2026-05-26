# T059 完成记录：胡了卜随机牌山调参面板

- 任务编号：T059
- 负责人：Codex / 开发 B
- 完成日期：2026-05-25

## 修改文件

- `packages/shared/src/mahjong-config.test.ts`
- `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- `apps/game/mahjong-roguelike/docs/tile-mountain-generator.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/DECISIONS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T059-hulebu-mountain-tuning-panel.md`
- `docs/tasks/claims/T059-codex.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/2026-05-25.md`

## 实现内容

- 在配置试玩页的密集牌山模式新增开发用 `牌山调参` 面板。
- 支持 `seed`、`tiles`、`stack`、`hu`、`honor` URL 参数初始化调参状态。
- 生成器支持按参数调整随机种子、目标牌量、同列堆叠深度、`胡` 包数量和字牌权重。
- `重新生成牌山` 会读取面板当前值并刷新当前关卡。
- 补充第 20 关调参生成回归测试，确认调参参数会改变牌量、同列堆叠、胡包数量和字牌数量。

## 验证命令

- `npm run test -w packages/shared -- mahjong`
- `npm run typecheck -w packages/shared`
- `node --check /private/tmp/hulebu-config-playable-script.js`
- 浏览器桌面端检查调参面板和第 20 关密集牌山。
- 浏览器 472px 窄屏检查。
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 共享测试通过：2 个测试文件、29 个测试通过。
- 类型检查通过。
- 原型脚本语法检查通过。
- 浏览器桌面端通过：`?level=20&mode=mountain&seed=calibrate&tiles=58&stack=6&hu=2&honor=90` 显示调参面板，字段值正确，页面无横向溢出。
- 浏览器窄屏通过：472px 宽度无横向溢出，8 格主槽和调参面板可显示。
- 文档同步通过。
- `git diff --check` 通过。

## 遗留问题

- 当前调参面板只服务 HTML 原型试玩，不是正式玩家 UI。
- 当前默认参数不是最终平衡，后续需要根据人工试玩继续调牌量、字牌权重、胡包数量和 Boss 强度。
- 正式 Cocos/GDevelop 工程应把这些参数沉淀为配置或编辑器字段，不直接照搬 HTML 面板。
