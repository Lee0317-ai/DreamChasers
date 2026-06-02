# T090：胡了卜失败提示弹层

- 领取人：Lee
- 领取时间：2026-05-31
- 状态：待验收
- 预计完成：2026-05-31
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T090-hulebu-failure-feedback-overlay.md`, `docs/tasks/claims/T090-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-31.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 依赖任务：T049, T050, T085, T086, T087, T088, T089
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页并触发/模拟失败提示；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T090-hulebu-failure-feedback-overlay.md docs/tasks/claims/T090-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 当前阻塞：无。
- 完成内容：已为 `config-playable` 增加统一失败弹层，满槽无组合/无救场资源和 Boss 目标未完成失败都会显示“本关失败”，说明原因并提供“重开本关”；失败后输入保持禁用。
- 验证结果：`mahjong-config-playable-prototype`、`mahjong-config`、HTML 脚本语法检查和 Kimi WebBridge 模拟失败提示检查已通过；截图保存到 `/tmp/hulebu-failure-feedback.png`。
- 下一步：等待 Lee 在默认玩家页中试玩验收，确认失败提示文案和弹层尺寸是否需要继续调整。
