# T089：胡了卜原型随机组合堆遮挡

- 优先级：P1
- 默认负责人：Lee
- 状态：待验收
- 背景：T088 已让密集牌山显示顶牌加下层预览牌，但堆叠形态仍偏固定。Lee 反馈希望牌山随机出现多个堆结合、顶面只看到一张、移走后露出多个选择，以及 5%-100% 的不同遮挡比例。
- 目标：让 `config-playable` 默认玩家页和调牌器的密集牌山支持随机组合堆/桥接堆、完全覆盖堆、轻微遮挡堆和当前错位预览堆；部分顶层牌移走后应能解锁一个或多个下层入口，同时保持首轮约 8-12 张可点击牌。
- 不做：不修改 Cocos 正式工程；不修改共享 Graph-based 生成器；不修改 Web 站入口；不改关卡/奖励 JSON；不做最终美术资源替换；不复制外部游戏源码；不放大首轮可点击数量。
- 依赖：T049, T050, T059, T083, T085, T086, T087, T088
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T089-hulebu-random-merged-stack-overlap.md`, `docs/tasks/claims/T089-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-31.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开 `http://127.0.0.1:3031/apps/game/mahjong-roguelike/prototypes/config-playable/index.html` 检查默认玩家页；打开 `http://127.0.0.1:3031/apps/game/mahjong-roguelike/prototypes/config-playable/index.html?view=tuner&mode=mountain&level=1` 检查调牌器；点击一个组合堆顶牌后确认下方可选入口增加；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T089-hulebu-random-merged-stack-overlap.md docs/tasks/claims/T089-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 进展：
  - 2026-05-30：Lee 确认需要随机组合堆、移走顶牌后可能出现多个选择，并需要 5%-100% 的不同遮挡比例；新增任务并领取。
  - 2026-05-31：已在 `config-playable` 密集牌山中加入随机组合/桥接堆、`full / partial / loose` 三类遮挡形态和 5%-100% 遮挡比例；默认第 1 关玩家页实测 43 张可见、8 张可点、2 个桥接顶牌，桥接顶牌各压住 2 个下层入口，点击后可选入口从 8 增至 9。
  - 2026-05-31：调牌器页实测 43 张可见、8 张可点、31 张下层预览全部 disabled，遮挡比例覆盖 `0.05 / 0.33 / 0.41 / 0.75 / 1.00`，同一局内同时出现完全覆盖、轻微遮挡和错位预览。
  - 2026-05-31：根据 Lee 验收反馈补明确规则：密集牌山永远只能点击最上层；任意更高层牌只要与下层牌相交，下层牌即判定为 blocked/disabled，避免小面积压住的下层白牌被误判为可点。
  - 2026-05-31：根据 Lee 反馈继续收紧空旷感：密集牌山坐标系由 `640x860` 调为 `560x720`，规则牌尺寸由 `38x52` 调为 `42x56`，桌面玩家页主栏收敛到 `500px`，山形棋盘使用 `width: min(100%, 64vh)`；Kimi WebBridge 实测棋盘 `442x569`、牌面约 `33x44`、首轮仍为 8 张可点。
  - 2026-05-31：补桥牌避让逻辑，避免新牌尺寸下两个桥接顶牌彼此小面积相交、互相压住导致首轮可点数从 8 掉到 7；回归测试新增桥牌自身不可开局 blocked 的保护。
  - 2026-05-31：根据 Lee 截图反馈修正运行态点击口径：`blockedBy` 会按实际渲染后的视觉矩形再次过滤，视觉上已经没有更高层遮挡的顶牌不再保持 disabled；桥牌角标也改为模拟移走后实际新增可点入口数。Kimi WebBridge 最终实测第 1 关 41 张可见、9 张可点、露出但 disabled 的顶牌 0、桥牌真实压住 2 个入口。
