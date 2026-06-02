# T090：胡了卜失败提示弹层

- 优先级：P1
- 默认负责人：Lee
- 状态：待验收
- 背景：T089 已完成密集牌山视觉点击一致性和桌面密度调优。Lee 继续反馈“失败也需要提示”，当前原型在进入失败时只更新底部状态文案，缺少显眼的本关失败弹层和重开入口。
- 目标：让 `config-playable` 默认玩家页和调牌器在失败时显示统一弹层，说明失败原因，并提供重开本关按钮；失败后牌面、组合按钮和道具按钮保持禁用。
- 不做：不修改 Cocos 正式工程；不修改共享 Graph-based 生成器；不修改 Web 站入口；不改关卡/奖励 JSON；不做完整复活/救场系统；不改牌山生成、牌面大小、模板轮换或首轮可点数量。
- 依赖：T049, T050, T085, T086, T087, T088, T089
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T090-hulebu-failure-feedback-overlay.md`, `docs/tasks/claims/T090-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-31.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页并触发/模拟失败提示；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T090-hulebu-failure-feedback-overlay.md docs/tasks/claims/T090-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 进展：
  - 2026-05-31：Lee 反馈失败也需要提示；新增任务并领取。实现口径为失败时弹出“本关失败”提示，说明满槽无组合或 Boss 目标未完成等原因，并提供重开本关入口。
  - 2026-05-31：已新增 `failLevel` / `showLevelFailed` 统一失败弹层。主槽满且没有可发动组合或救场资源时弹出“本关失败”，说明原因并提供“重开本关”；Boss 目标未完成导致失败时复用同一弹层。自动化测试、脚本语法检查和 Kimi WebBridge 模拟失败验证均通过。
