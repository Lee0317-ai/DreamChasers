# T085：胡了卜玩家试玩页和调牌器分离

- 领取人：Lee
- 领取时间：2026-05-29
- 状态：待验收
- 预计完成：2026-05-30
- 允许修改文件：`AGENTS.md`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/prototypes/config-playable/tuner.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T085-hulebu-play-page-tuner-split.md`, `docs/tasks/claims/T085-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-30.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 依赖任务：T049, T050, T084
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `node --check /private/tmp/hulebu-config-playable-script.js`; 浏览器桌面端检查默认玩家页和调牌器入口；浏览器移动端检查默认玩家页首屏；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T085-hulebu-play-page-tuner-split.md docs/tasks/claims/T085-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 当前阻塞：Kimi WebBridge daemon 健康检查异常，浏览器自动截图/移动端复核需待 WebBridge 恢复后补做。
- 下一步：等待 Lee 体验验收默认玩家页和独立调牌器入口；后续若继续推进，另起任务处理 WebBridge 健康问题或正式接 Web 站内试玩入口。
- 备注：已完成默认玩家试玩页和调牌器视图分离；回归测试覆盖默认入口、新窗口调牌器入口和调参面板只在 `view=tuner` 显示。
