# T095：胡了卜混合窗口牌山生成器

- 领取人：Lee
- 领取时间：2026-06-01
- 状态：待验收
- 预计完成：2026-06-01
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T095-hulebu-mixed-window-mountain-generator.md`, `docs/tasks/claims/T095-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `apps/web/**`, `deploy/**`, PDF 工具箱、AI 修图、AI 搜索、埋点和平台部署相关文件
- 依赖任务：T093, T094
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页第 5 关后检查首轮窗口不是直接三张同组答案；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T095-hulebu-mixed-window-mountain-generator.md docs/tasks/claims/T095-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md`; `git diff --check`
- 当前阻塞：无。
- 完成内容：已完成混合窗口生成器改造。密集牌山现在保留答案组，但首轮和释放窗口会混入不同答案组的 hold / lure / finish 牌；默认普通密集关首轮同一 `solutionGroup` 最多露出 2 张，避免玩家直接点三张同组牌发动组合。胡牌重点关和 Boss 目标关暂不做运行态重平衡，避免破坏目标包可解性。
- 验证结果：`npm run test -w packages/shared -- mahjong-config-playable-prototype` 通过；`npm run test -w packages/shared -- mahjong-config` 通过，2 个测试文件 28 个测试通过；HTML 脚本 `node --check` 通过；运行态抽样确认第 1 关首轮 8 张可点且最大同组 2 张，Kimi WebBridge 打开真实页面第 5 关首轮 7 张可点且最大同组 2 张；本地 3031 服务返回 `HTTP/1.0 200 OK`。
- 下一步：等待 Lee 在默认玩家页试玩第 5 关后的混合窗口手感，再决定是否继续加入更强的吃碰冲突、碰杠诱饵和记牌器。
