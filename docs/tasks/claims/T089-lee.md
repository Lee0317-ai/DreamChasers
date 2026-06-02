# T089：胡了卜原型随机组合堆遮挡

- 领取人：Lee
- 领取时间：2026-05-30
- 状态：待验收
- 预计完成：2026-05-31
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T089-hulebu-random-merged-stack-overlap.md`, `docs/tasks/claims/T089-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-31.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 依赖任务：T049, T050, T059, T083, T085, T086, T087, T088
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页和调牌器页检查；点击一个组合堆顶牌后确认下方可选入口增加；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T089-hulebu-random-merged-stack-overlap.md docs/tasks/claims/T089-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 当前阻塞：无。
- 完成内容：已实现随机组合/桥接堆、`full / partial / loose` 三类遮挡形态、5%-100% 遮挡比例和桥接顶牌解锁多个下层入口；默认玩家页与调牌器首轮入口仍控制在 8-12 张。验收补丁已明确“只能点击最上层”：运行态会按实际渲染后的视觉矩形过滤 `blockedBy`，视觉上已经没有更高层遮挡的顶牌不再保持 disabled；桥牌角标也改为模拟移走后实际新增可点入口数。后续密度补丁已把密集牌山改为 `560x720` 坐标、`42x56` 规则牌面、桌面主栏 `500px`，并加入桥牌避让，减少桌面空旷感。
- 验证结果：`mahjong-config-playable-prototype`、`mahjong-config`、HTML 脚本语法检查、Kimi WebBridge 默认玩家页/调牌器检查和 390x844 移动端截图检查已通过；Kimi WebBridge 最终桌面实测棋盘 `442x569`、玩家页主栏 `500px`、第 1 关 41 张可见、9 张可点、露出但 disabled 的顶牌 0、桥牌真实压住 2 个入口，截图保存到 `/tmp/hulebu-visual-click-rule-final.png`。
- 下一步：等待 Lee 在默认玩家页和调牌器中试玩验收，重点确认桥接堆数量、露出比例、桌面牌桌尺寸和首轮 8 张入口是否继续微调。
