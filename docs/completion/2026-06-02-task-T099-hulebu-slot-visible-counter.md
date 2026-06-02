# T099 胡了卜试玩页卡槽满槽显示修复和记牌器完成记录

- 任务编号：T099
- 负责人：Lee
- 完成日期：2026-06-02
- 修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T099-hulebu-slot-visible-counter.md`, `docs/tasks/claims/T099-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`

## 实现内容

- 默认朋友 Demo `reserveLimit` 改为 0，避免第 8 张牌被自动移入隐藏备用槽。
- `checkDanger()` 返回提示文本，由 `renderAll()` 统一渲染，满槽提示不再被“入槽”消息覆盖。
- 玩家页记牌器移到牌桌和卡槽之间，按 `万 / 条 / 筒 / 字` 展示剩余未移除牌总数和点数数量。
- 回归测试覆盖第 8 张留在主槽、备用槽为空、记牌器静态存在和移除牌后数量刷新。

## 验证命令

- `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- `npm run test -w packages/shared -- mahjong-config`
- `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`
- Kimi WebBridge 打开默认玩家页检查记牌器和满槽状态。

## 验证结果

- 共享测试通过。
- HTML 脚本语法检查通过。
- Kimi WebBridge 满槽采样：`slotLength=8`、`reserveLength=0`、第 8 张位置为 `slot`、无失败弹层，提示为“主槽已满，请先发动组合，或使用丢弃救场。”。
- Kimi WebBridge 截图确认记牌器在牌桌和卡槽之间首屏可见。

## 遗留问题

- `丢弃` 当前仍丢弃主槽末尾牌；“玩家选择卡槽任意一张丢弃”按 T094 后续任务实现。
- 记牌器样式仍是 demo 级信息带，进入 Cocos 后需要重做正式 UI。
