# T092 胡了卜玩家页正式一屏 HUD 重排完成记录

- 任务编号：T092
- 负责人：Lee
- 完成日期：2026-06-01
- 修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T092-hulebu-one-screen-play-hud.md`, `docs/tasks/claims/T092-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01.md`

## 实现内容

- 默认玩家页新增顶部 `play-hud`，动态显示关卡、目标、余牌、积分和铜钱。
- 默认玩家页右侧从完整信息面板压缩为 `洗山 / 回手 / 看山` 道具栏，完整信息继续保留在调牌器视图。
- 移动端保持主栏 + 64px 右侧道具栏双列结构，不再把侧栏推到下方滚动。
- 玩家页牌桌预算收紧为 `414px / 45vh`，390px 移动端收紧为 `360px / 42vh`，让顶部 HUD、牌桌、卡槽和右侧道具在首屏共存。
- 根据 Lee 验收反馈完成密集牌山调参：轻微遮挡阈值统一为 `8%`，低于 8% 可点击，达到 8% 才阻塞；规则牌尺寸调整为 `45x60`，CSS 宽度调整为 `8.0357142857%`。
- 模板锚点向中心收拢，并给前 4 个主堆增加权重，让大多数牌继续集中在主牌山堆里；第 1-8 关默认首轮可点稳定在 5-8 张，符合当前起手 3-8 张目标，同时继续覆盖 34 个具体牌面。
- 补充静态回归测试，保护顶部 HUD、右侧工具栏、移动端双列结构和调牌器分离。
- 补充 VM 回归测试，保护 `8%` 遮挡阈值、`45x60` 规则尺寸、8 模板轮换、3-8 张起手范围、主堆集中度和桥接堆单入口/多入口随机变化。

## 验证命令

- `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- `npm run test -w packages/shared -- mahjong-config`
- `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`
- Kimi WebBridge 打开默认玩家页做桌面 DOM 尺寸和截图检查。
- Kimi WebBridge 打开调牌器页检查完整侧栏仍可用。
- 390x844 受控移动视口检查默认玩家页。
- `npm run docs:sync`
- `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T092-hulebu-one-screen-play-hud.md docs/tasks/claims/T092-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`
- `git diff --check`

## 验证结果

- 自动化测试通过，HTML 脚本语法检查通过。
- Kimi WebBridge 桌面实测：1512x682 视口无整页滚动，牌桌 `307x351`，HUD `460x61`，卡槽 `460x114`，右侧道具栏 `76x204`，第 1 关 41 张可见、8 张可点、无横向溢出。截图保存到 `/tmp/hulebu-t092-desktop.png`。
- 验收调参后 Kimi WebBridge 实测：第 1 关 41 张可见、8 张可点，牌面约 `24.5x32.7`，截图保存到 `/tmp/hulebu-t092-8pct-larger-tiles.png`；运行态遮挡探针验证 `0.9%` 视觉覆盖不阻塞、`11.1%` 视觉覆盖阻塞。
- 调牌器实测：`view=tuner&mode=mountain&level=1` 下调参面板、余牌统计、奖励、工具和控制按钮继续显示，顶部 `play-hud` 隐藏。
- 390x844 移动检查：初始 HUD 重排时页面无横向溢出且不滚动，牌桌 `276x315`，卡槽底部 `719px`，右侧道具栏 `64x204` 位于首屏，截图保存到 `/tmp/hulebu-t092-mobile.png`；验收调参后受控移动检查牌桌 `254x290`，卡槽首屏可见。

## 遗留问题

- 本任务只改 HTML 配置试玩原型和共享测试，未同步 Cocos 正式工程。
- 右侧道具栏暂时仍是文字按钮；正式 Cocos 承接时应改为图标按钮、触控态和可用/禁用反馈。
- 桥接堆现在允许单入口和多入口混合，符合“随机随机随机”的当前方向；如果后续要把“移走一张后必然释放多个选择”设为硬规则，需要另开平衡任务。
