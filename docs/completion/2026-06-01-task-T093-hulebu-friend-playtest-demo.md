# T093 胡了卜 10 关朋友试玩 Demo 完成记录

- 任务编号：T093
- 负责人：Lee
- 完成日期：2026-06-01
- 修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T093-hulebu-friend-playtest-demo.md`, `docs/tasks/claims/T093-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-06-01-hulebu-friend-playtest-demo.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01.md`

## 实现内容

- 默认玩家页只展示 10 关小 run。
- 第 1-4 关分别教学 `碰 / 吃 / 杠 / 胡`，前 4 关使用小牌量教学牌山。
- 第 1-3 关使用 6 格主槽，第 3 关通关后奖励固定为 `卡槽 +2`，第 4 关起使用 8 格主槽。
- 第 5 关开始恢复 240 张密集牌山高压模式。
- 右侧道具改为 `洗牌 / 撤回 / 丢弃`。
- 新增 `useDiscardTool()`：丢弃会移除主槽末尾牌、消耗 1 次道具、清空撤回历史并刷新局面。
- 主槽已满且无组合时，如果还有丢弃次数，会提示可用丢弃救场，不立即失败。
- 移动端默认玩家页改为底部横排三道具，保证 390 CSS 像素下卡槽和工具栏完整可见。
- 新增/更新静态和 VM 回归测试，覆盖 10 关 Demo、前 4 关教学、6/8 卡槽、固定奖励、三道具、第 5 关高压牌山和丢弃行为。

## 验证命令

- `npm run test -w packages/shared -- mahjong-config-playable-prototype mahjong-config`
- `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`
- Kimi WebBridge 打开默认玩家页做桌面运行态检查。
- Chrome CDP 设置 390x844 移动视口做布局截图和尺寸检查。
- `npm run docs:sync`
- `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T093-hulebu-friend-playtest-demo.md docs/tasks/claims/T093-lee.md docs/superpowers/plans/2026-06-01-hulebu-friend-playtest-demo.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`
- `git diff --check`

## 验证结果

- 自动化测试通过：2 个测试文件、28 个测试通过。
- HTML 脚本语法检查通过。
- Kimi WebBridge 桌面默认页验证：10 个关卡 tab，第一关 6 张教学牌、6 格卡槽，HUD 显示 `重点 碰`，右侧道具为 `洗牌 / 撤回 / 丢弃`。
- 运行态验证：第三关奖励只显示 `卡槽 +2`；丢弃会从主槽移除牌并消耗次数。
- 390x844 移动 CDP 验证：`innerWidth=390`、`scrollWidth=390`，卡槽宽 `350`，底部工具栏宽 `370`，无横向溢出；截图保存到 `tmp/hulebu-t093-mobile-cdp.png`。

## 遗留问题

- 本任务只改 HTML 配置试玩原型，未同步 Cocos 正式工程。
- 丢弃当前默认移除主槽末尾牌；若朋友试玩反馈希望更强控制感，可另开任务改为选择主槽任意一张。
- 第 5 关从教学直接进入 240 张牌山，难度跨度需要用朋友试玩反馈验证。
