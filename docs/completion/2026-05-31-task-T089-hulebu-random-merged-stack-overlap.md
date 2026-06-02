# T089 胡了卜原型随机组合堆遮挡完成记录

- 任务编号：T089
- 负责人：Lee
- 完成日期：2026-05-31
- 修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T089-hulebu-random-merged-stack-overlap.md`, `docs/tasks/claims/T089-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-31.md`

## 实现内容

- 在 `config-playable` 密集牌山生成中加入随机桥接组合堆，桥接顶牌可同时压住多个下层堆顶入口。
- 为堆叠加入 `full / partial / loose` 三类遮挡形态和 5%-100% 遮挡比例，混合呈现只看到一张、轻微露出和错位预览。
- 渲染层新增桥接顶牌样式和解锁数量提示；下层预览牌继续保持真实牌面、blocked/disabled，不会点击入槽。
- 验收补丁明确点击规则：密集牌山永远只能点击最上层；任意更高层牌只要与下层牌相交，下层牌即 blocked/disabled。
- 密度补丁把密集牌山坐标系从 `640x860` 收到 `560x720`，规则牌尺寸从 `38x52` 放到 `42x56`，桌面玩家页主栏收敛到 `500px`，棋盘宽度使用 `min(100%, 64vh)`，降低横向空旷感。
- 桥牌生成新增避让，防止两个桥接顶牌在新尺寸下互相小面积压住，导致首轮可点入口少于预期。
- 运行态点击判定按实际渲染后的视觉矩形过滤 `blockedBy`，视觉上已经没有更高层遮挡的顶牌不再保持 disabled；桥牌角标按移走后实际新增可点入口数显示。
- 回归测试覆盖桥接堆常量、DOM 标记、遮挡比例、遮挡模式、预览不可点和桥接牌移走后释放多个入口。

## 验证命令

- `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- `npm run test -w packages/shared -- mahjong-config`
- `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`
- Kimi WebBridge 打开默认玩家页和调牌器页做 DOM/截图检查。
- 临时 headless Chrome 390x844 移动端截图检查。
- `npm run docs:sync`
- `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T089-hulebu-random-merged-stack-overlap.md docs/tasks/claims/T089-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`
- `git diff --check`

## 验证结果

- 自动化测试通过，HTML 脚本语法检查通过。
- 默认玩家页最终实测：41 张可见、9 张可点、1 个桥接顶牌；露出但 disabled 的顶牌为 0，桥接顶牌真实压住 2 个入口。
- 调牌器页实测：43 张可见、8 张可点、31 张下层预览全部 disabled；遮挡比例覆盖 `0.05 / 0.33 / 0.41 / 0.75 / 1.00`，遮挡模式覆盖 `full / partial / loose`。
- 密度补丁后 Kimi WebBridge 桌面实测：玩家页左栏 `500px`，棋盘 `442x569`，截图为 `/tmp/hulebu-visual-click-rule-final.png`。
- 移动端 390x844 截图通过，牌山竖向可见，主槽和牌桌没有互相压住。

## 遗留问题

- 本任务只改 HTML 原型和共享测试，未同步 Cocos 正式工程。
- 桥接堆数量、首轮 8-12 张入口和 5%-100% 露出比例仍需 Lee 试玩后继续调参。
