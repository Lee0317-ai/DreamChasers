# T085：胡了卜玩家试玩页和调牌器分离

- 优先级：P1
- 默认负责人：Lee
- 状态：待验收
- 背景：胡了卜配置试玩原型目前把玩家牌桌、关卡切换、密集牌山模式和调参/调牌控件放在同一窗口。评估中确认默认玩家窗口不应该先展示调牌器，调牌器应作为开发工具独立打开，避免移动端首屏被配置面板占用。
- 目标：让 `index.html` 默认呈现干净的玩家试玩页；保留开发调牌能力，但通过独立入口打开调牌器视图；为这条分离边界增加回归测试。
- 不做：不修改 Cocos 正式工程、不重做奖励效果、不改 Boss 目标逻辑、不改共享牌山生成器、不接 Web 站内 iframe、不做最终 UI 美术。
- 依赖：T049, T050, T084
- 主要文件范围：`AGENTS.md`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/prototypes/config-playable/tuner.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T085-hulebu-play-page-tuner-split.md`, `docs/tasks/claims/T085-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-30.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `node --check /private/tmp/hulebu-config-playable-script.js`; 浏览器桌面端检查默认玩家页和调牌器入口；浏览器移动端检查默认玩家页首屏；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T085-hulebu-play-page-tuner-split.md docs/tasks/claims/T085-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 进展：
  - 2026-05-29：新增任务并领取；范围锁定为配置试玩原型的玩家页/调牌器分离、回归测试和模块文档。
  - 2026-05-29：按 Lee 反馈补充本地 AGENTS 浏览器使用偏好，后续浏览器任务优先走 Kimi WebBridge 或 Codex App 右侧内置浏览器。
  - 2026-05-30：新增回归测试，确认默认入口是玩家试玩页、调牌器独立新窗口打开，并且脚本区分 `play` / `tuner` 视图。
  - 2026-05-30：`index.html` 默认进入 `play` 视图和密集牌山模式，隐藏顶部配置/关卡切换和调参面板；玩家页只保留“调牌器”新窗口入口。
  - 2026-05-30：新增 `tuner.html` 独立入口，进入 `index.html?view=tuner&mode=mountain` 并保留原 URL 参数。
  - 2026-05-30：移动端玩家页不再把右侧信息面板排到牌桌前，首屏优先展示牌桌和主流程。

- 验证结果：`npm run test -w packages/shared -- mahjong-config-playable-prototype` 通过，1 个测试文件、3 个测试；`npm run test -w packages/shared -- mahjong-config` 通过，2 个测试文件、17 个测试；`node --check /private/tmp/hulebu-config-playable-script.js` 和 `node --check /private/tmp/hulebu-config-playable-tuner-script.js` 通过；`npm run docs:sync` 通过，同步 52 个任务分片和 51 个领取分片；T085 文档占位符扫描无匹配；`git diff --check` 通过。Kimi WebBridge `start` 返回 daemon 已在运行，但 `status` 仍返回 `running:false` 和 HTTP probe 失败，因此浏览器自动截图/移动端实际页面复核未完成。

- 遗留问题：Kimi WebBridge 当前 daemon 健康检查异常，浏览器自动截图/移动端复核需要在 WebBridge 恢复后补做；奖励效果真实生效、Boss 目标进度、槽位同款图片、Cocos Web Preview 多模板目检和最终动效继续后置。
