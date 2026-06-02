# T091：胡了卜玩家页正式 HUD 空间压缩

- 优先级：P1
- 默认负责人：Lee
- 状态：待验收
- 背景：T089/T090 后默认玩家页已经具备数百张小牌、随机堆叠、桥接堆、点击一致性和失败提示。Lee 继续反馈牌桌高度仍然偏高；正式游戏同一屏还需要顶部关卡和目标、顶部剩余卡牌统计、底部卡槽、右侧道具按钮等 HUD 内容，当前牌桌会挤占这些区域。
- 目标：压缩 `config-playable` 玩家页的牌桌高度和周边 UI 间距，建立正式 HUD 空间预算；保持牌面可读、随机堆叠、桥接堆、下层预览、34 牌面覆盖和首轮约 8-12 张可点不被破坏。
- 不做：不修改 Cocos 正式工程；不修改共享 Graph-based 生成器；不修改 Web 站入口；不改关卡/奖励 JSON；不新增正式 HUD 功能；不改失败提示逻辑；不扩大或缩小总牌数范围。
- 依赖：T049, T050, T085, T086, T087, T088, T089, T090
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T091-hulebu-compact-board-hud-budget.md`, `docs/tasks/claims/T091-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-31.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查桌面和移动端牌桌尺寸、可点数量与无横向溢出；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T091-hulebu-compact-board-hud-budget.md docs/tasks/claims/T091-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 进展：
  - 2026-05-31：Lee 反馈默认玩家页牌桌高度仍偏高，正式游戏需要为顶部目标/余牌统计、底部卡槽和右侧道具按钮保留空间；新增任务并领取。实现口径为压缩玩家页牌桌坐标高度和 CSS 视口高度预算，不改牌量、遮挡和首轮可点规则。
  - 2026-05-31：已把密集牌山坐标高度从 `560x720` 压到 `560x640`，玩家页牌桌使用 `width: min(100%, 430px, 48vh)`，并压缩顶部条、牌桌容器、卡槽、按钮和右侧面板间距。桌面 Kimi WebBridge 实测页面无整页滚动，牌桌 `332x379`，顶部 `69px`，卡槽 `130px`，右侧面板限制在视口内滚动；第 1 关仍为 41 张可见、8 张可点。
  - 2026-05-31：补移动端覆盖，`960px` 以下玩家页强制单列，390x844 受控浏览器实测牌桌 `344x393`，占视口高度 `46.6%`，卡槽在首屏可见，无横向溢出；右侧信息面板继续位于下方滚动，后续正式移动 HUD 需要单独重排。
