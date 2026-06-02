# T091：胡了卜玩家页正式 HUD 空间压缩

- 领取人：Lee
- 领取时间：2026-05-31
- 状态：待验收
- 预计完成：2026-05-31
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T091-hulebu-compact-board-hud-budget.md`, `docs/tasks/claims/T091-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-31.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 依赖任务：T049, T050, T085, T086, T087, T088, T089, T090
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查桌面和移动端牌桌尺寸、可点数量与无横向溢出；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T091-hulebu-compact-board-hud-budget.md docs/tasks/claims/T091-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 当前阻塞：无。
- 完成内容：已压缩默认玩家页密集牌山高度预算。牌山坐标系从 `560x720` 调整为 `560x640`，玩家页牌桌限制为 `430px / 48vh`，并收紧顶部条、牌桌容器、卡槽、组合按钮、工具按钮和右侧面板间距；桌面右侧面板限制在视口内滚动，避免撑高整页。
- 验证结果：`mahjong-config-playable-prototype`、`mahjong-config` 和 HTML 脚本语法检查通过；Kimi WebBridge 桌面实测 3031 页面无整页滚动、牌桌 `332x379`、第 1 关 41 张可见/8 张可点、无横向溢出，截图为 `/tmp/hulebu-t091-desktop.png`；受控 390x844 移动检查牌桌 `344x393`、卡槽首屏可见、无横向溢出，截图为 `/tmp/hulebu-t091-mobile.png`。
- 下一步：等待 Lee 在右侧内置浏览器中试玩验收，重点确认牌桌缩小后牌面可读性、顶部/底部 HUD 空间和移动端信息面板后续重排方向。
