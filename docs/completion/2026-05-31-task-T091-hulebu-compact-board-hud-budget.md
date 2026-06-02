# T091 胡了卜玩家页正式 HUD 空间压缩完成记录

- 任务编号：T091
- 负责人：Lee
- 完成日期：2026-05-31
- 修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T091-hulebu-compact-board-hud-budget.md`, `docs/tasks/claims/T091-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-31.md`

## 实现内容

- 将密集牌山坐标高度从 `560x720` 压缩为 `560x640`，降低默认玩家页牌桌纵向占用。
- 玩家页牌桌增加 `430px / 48vh` 显示预算，移动端增加 `380px / 46vh` 单列覆盖。
- 收紧顶部条、牌桌容器、卡槽、组合按钮、工具按钮和右侧面板间距。
- 桌面右侧面板限制在视口内滚动，避免信息面板撑高整页。
- 保持默认 240 张牌、34 牌面覆盖、随机桥接堆、下层预览和首轮约 8-12 张可点规则不变。
- 新增静态和 VM 回归测试，保护压缩坐标系、玩家页 HUD 预算、移动单列覆盖和首轮可点范围。

## 验证命令

- `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- `npm run test -w packages/shared -- mahjong-config`
- `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`
- Kimi WebBridge 打开默认玩家页做桌面 DOM 尺寸和截图检查。
- 390x844 受控浏览器检查移动端布局。
- `npm run docs:sync`
- `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T091-hulebu-compact-board-hud-budget.md docs/tasks/claims/T091-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`
- `git diff --check`

## 验证结果

- 自动化测试通过，HTML 脚本语法检查通过。
- Kimi WebBridge 桌面实测：3031 页面无整页滚动，牌桌 `332x379`，顶部 `69px`，卡槽 `130px`，第 1 关 41 张可见、8 张可点、无横向溢出。截图保存到 `/tmp/hulebu-t091-desktop.png`。
- 390x844 移动检查：牌桌 `344x393`，占视口高度约 `46.6%`，卡槽在首屏可见，无横向溢出。截图保存到 `/tmp/hulebu-t091-mobile.png`。
- 本地 `3031` 静态服务已恢复为项目根目录服务，默认玩家页可继续从原地址访问。

## 遗留问题

- 本任务只改 HTML 配置试玩原型和共享测试，未同步 Cocos 正式工程。
- 移动端右侧信息面板仍在下方滚动；正式游戏若要一屏内同时容纳顶部目标、余牌统计、右侧道具和底部卡槽，需要另开任务做正式移动 HUD 重排。
