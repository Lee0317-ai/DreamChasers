# T098 胡了卜朋友 Demo 第 5-10 关渐进难度曲线完成记录

- 任务编号：T098
- 负责人：Lee
- 完成日期：2026-06-02
- 修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/items/T098-hulebu-friend-demo-gradual-difficulty.md`, `docs/tasks/claims/T098-lee.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`

## 实现内容

- 新增 `FRIEND_DEMO_DIFFICULTY_PROFILES` 和默认玩家页专用 `getEffectiveMountainTuningForLevel`。
- 第 5-10 关牌量改为 `72 / 96 / 132 / 168 / 210 / 240`，堆叠深度逐步从 `3` 到 `6`，字牌权重逐步提高。
- 第 5 关标题显示“正式入门”；第 10 关在朋友 Demo 中作为“综合高压”压力关，不叠正式 Boss 目标和胡包。
- 调牌器和正式配置仍使用原调参值与 Boss 配置，不受朋友 Demo profile 限制。

## 验证命令

- `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- `npm run test -w packages/shared -- mahjong-config`
- `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`
- Kimi WebBridge 打开默认玩家页检查第 5 关和第 10 关。

## 验证结果

- 共享测试通过。
- HTML 脚本语法检查通过。
- Kimi WebBridge 验证：第 5 关 72 张、首轮可点 8、最大同组 2；第 10 关 240 张、首轮可点 7、最大同组 2。

## 遗留问题

- 仍需 Lee 试玩确认第 5-10 关坡度是否舒适。
- 动态失败降难、残局收官和丢弃选择槽位任意一张继续按后续任务处理。
