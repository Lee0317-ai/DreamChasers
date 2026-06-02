# T097 胡了卜教学关必须发动对应组合才通关完成记录

- 完成时间：2026-06-01
- 负责人：Lee
- 任务编号：T097
- 修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T097-hulebu-tutorial-action-clear.md`, `docs/tasks/claims/T097-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/completion/2026-06-01-task-T097-hulebu-tutorial-action-clear.md`
- 实现内容：默认玩家 Demo 前 4 关必须分别成功点击 `碰 / 吃 / 杠 / 胡` 后才通关；全部点入卡槽但未点击目标动作时停留本关并提示教学目标；教学候选过滤为本关目标动作；前 3 关教学牌山改为最小目标牌型包。
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; Kimi WebBridge 默认玩家页手动验证；`npm run docs:sync`; 文档占位扫描；`git diff --check`
- 验证结果：`npm run test -w packages/shared -- mahjong-config-playable-prototype` 通过，1 个测试文件 8 个测试通过；`npm run test -w packages/shared -- mahjong-config` 通过，2 个测试文件 28 个测试通过；HTML 脚本 `node --check` 通过；Kimi WebBridge 验证第 1 关和第 4 关均为全入槽不通关、点击目标动作后通关；`npm run docs:sync` 通过；文档占位扫描无结果；`git diff --check` 通过。
- 遗留问题：丢弃选择、记牌器和残局收官仍按 T094 设计后续单独实现。
