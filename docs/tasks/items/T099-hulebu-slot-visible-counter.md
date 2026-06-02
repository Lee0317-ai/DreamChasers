# T099：胡了卜试玩页卡槽满槽显示修复和记牌器

- 优先级：P1
- 负责人：Lee
- 默认负责人：Lee
- 状态：待验收
- 依赖：T092, T093, T097, T098
- 提出来源：IDEA-20260602-01
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 10 关朋友 Demo / 玩家页 HUD
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T099-hulebu-slot-visible-counter.md`, `docs/tasks/claims/T099-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查满 8 格卡槽和记牌器刷新；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T099-hulebu-slot-visible-counter.md docs/tasks/claims/T099-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`; `git diff --check`

## 背景

试玩反馈有两个直接影响理解的问题：

- 点击第 8 张牌时，卡槽没有显示；点击第 9 张时又像是出现了上一张。初步排查为朋友 Demo 沿用旧的备用槽自动救场，但玩家页隐藏备用槽，导致牌被挪到不可见区域。
- 玩家不知道牌山里还剩哪些花色和数量，无法基于剩余信息做决策。

## 目标

- 默认玩家 Demo 满 8 格时，不再把牌静默移入隐藏备用槽。
- 卡槽满且无可发动组合时，保留可见 8 张，并提示玩家发动组合或使用丢弃。
- 玩家页显示记牌器，按万、条、筒、字展示剩余未移除牌总数和点数数量。
- 记牌器随入槽、组合移除、丢弃移除、洗牌等状态刷新。

## 不做

- 不实现“丢弃时任选卡槽某张牌”。
- 不重做完整 HUD。
- 不修改 Cocos 正式工程。
- 不修改正式关卡 JSON。
- 不扩大到 Web 站、PDF、AI 修图、AI 搜索或部署范围。

## 验收标准

- VM 测试覆盖朋友 Demo 第 8 张入槽后仍留在主槽，备用槽为空。
- 静态测试覆盖玩家页可见记牌器区块。
- VM 测试覆盖记牌器统计在移除牌后减少。
- 浏览器检查默认玩家页能看到记牌器，且满槽不再隐藏第 8 张。
- 共享测试、HTML 脚本语法检查、文档同步、占位符扫描和 diff 检查通过。

## 进展

- 2026-06-02：已创建任务并领取，开始补卡槽和记牌器回归测试。
- 2026-06-02：已修复朋友 Demo 隐藏备用槽问题。默认玩家页 `reserveLimit` 为 0，第 8 张入槽后保留在可见主槽；主槽满且无组合时提示“请先发动组合，或使用丢弃救场”，不再把牌静默移到隐藏备用槽。
- 2026-06-02：已把记牌器移到牌桌和卡槽之间，默认玩家页首屏可见，按 `万 / 条 / 筒 / 字` 展示剩余未移除牌总数和点数数量；入槽、组合、丢弃、洗牌后随 `renderAll` 刷新。
- 2026-06-02：回归测试和 Kimi WebBridge 验证通过：满槽采样中 `slotLength=8`、`reserveLength=0`、第 8 张仍为 `slot`、无失败弹层；记牌器在第 5/10 关均可见。
