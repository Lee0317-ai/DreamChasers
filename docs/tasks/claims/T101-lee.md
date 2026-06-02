# T101：胡了卜有限牌河、补杠和胡牌奖励试玩 Demo

- 领取人：Lee
- 领取时间：2026-06-02
- 状态：待验收
- 预计完成：2026-06-02
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T101-hulebu-river-kong-hu-demo.md`, `docs/tasks/claims/T101-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-06-02-hulebu-river-kong-hu-demo.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `apps/web/**`, `deploy/**`, PDF 工具箱、AI 修图、AI 搜索、埋点和平台部署相关文件
- 依赖任务：T093, T097, T098, T099, T100
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查牌河、任选打牌、明牌区、补杠、明杠开山和胡后清河；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T101-hulebu-river-kong-hu-demo.md docs/tasks/claims/T101-lee.md docs/superpowers/plans/2026-06-02-hulebu-river-kong-hu-demo.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`; `git diff --check`
- 当前阻塞：无。
- 下一步：等待 Lee 继续试玩默认玩家 Demo 和 `/games/hulebu` 静态发布版，重点确认第 5 关是否能自然感知至少 2 条明杠路线、`杠` 震落 1 张和 `胡` 震落 3 张的难度是否合适、记牌器只统计牌山是否符合直觉、动作按钮/卡槽/道具一屏布局是否足够顺手，以及有限牌河容量、补杠爽点、明杠开山和胡后清河是否形成有效恢复路线。
