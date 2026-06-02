# T097：胡了卜教学关必须发动对应组合才通关

- 领取人：Lee
- 领取时间：2026-06-01
- 状态：待验收
- 预计完成：2026-06-01
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T097-hulebu-tutorial-action-clear.md`, `docs/tasks/claims/T097-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `apps/web/**`, `deploy/**`, PDF 工具箱、AI 修图、AI 搜索、埋点和平台部署相关文件
- 依赖任务：T093, T094, T096
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查第 1-4 关教学：全放入卡槽不通关，点击对应 `碰 / 吃 / 杠 / 胡` 后通关；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T097-hulebu-tutorial-action-clear.md docs/tasks/claims/T097-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md`; `git diff --check`
- 当前阻塞：无。
- 完成内容：已完成默认玩家 Demo 前 4 关教学动作通关判定。第 1-4 关分别必须成功发动 `碰 / 吃 / 杠 / 胡` 后才通关；全部点入卡槽但未点击对应动作时会停留本关并提示教学目标。教学关候选已过滤为本关目标动作，前 3 关教学牌山收敛为目标牌型本身。
- 验证结果：`npm run test -w packages/shared -- mahjong-config-playable-prototype` 通过；`npm run test -w packages/shared -- mahjong-config` 通过；HTML 脚本 `node --check` 通过；Kimi WebBridge 验证第 1 关和第 4 关均为全入槽不通关、点击目标动作后通关；`npm run docs:sync` 通过；文档占位扫描无结果；`git diff --check` 通过。
- 下一步：等待 Lee 刷新默认试玩页，实际验收前 4 关教学是否符合预期。
