# T088 完成记录：胡了卜原型散乱可见压叠层

- 任务编号：T088
- 负责人：Lee
- 状态：待验收
- 完成日期：2026-05-30

## 修改文件

- `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- `packages/shared/src/mahjong-config-playable-prototype.test.ts`
- `packages/shared/src/mahjong-config.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T088-hulebu-visible-scattered-stack-preview.md`
- `docs/tasks/claims/T088-lee.md`
- `docs/tasks/NEXT_ID.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-05-30.md`
- `docs/completion/2026-05-30-task-T088-hulebu-visible-scattered-stack-preview.md`

## 实现内容

- 新增 `MOUNTAIN_STACK_PREVIEW_DEPTH = 4`，密集牌山每个堆叠渲染顶牌和 4 张下层预览牌。
- 新增栈预览可见性和深度计算函数，生成器 VM 测试和真实 DOM 渲染使用同一套“下层可见但不可点”规则。
- 下层预览牌使用 `stack-preview` 类和 `data-stack-preview-depth` 标记，显示真实牌面、错位露出，但保持 blocked/disabled。
- 默认玩家页把栈顶深度数字降噪为小圆点，减少视觉干扰；调牌器页仍显示数字深度提示，便于调关。
- 保持首轮约 8-12 张可点击顶牌，不扩大初始选择数量。

## 验证命令

- `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- `npm run test -w packages/shared -- mahjong-config`
- `node --check /tmp/hulebu-config-playable-script.js`
- Kimi WebBridge 打开默认玩家页和调牌器页检查桌面端 DOM 与截图。
- 临时 headless Chrome 390x844 截图检查移动端。
- `npm run docs:sync`
- `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T088-hulebu-visible-scattered-stack-preview.md docs/tasks/claims/T088-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`
- `git diff --check`

## 验证结果

- 共享包静态测试通过：1 个测试文件、4 个测试。
- 共享包配置/VM 测试通过：2 个测试文件、21 个测试。
- JS 语法检查通过。
- Kimi WebBridge 默认玩家页检查通过：50 张可见牌、10 张可点击、40 张 `stack-preview` 全部 disabled，预览深度为 1-4，截图 `/tmp/hulebu-t088-player-board-v2.png`。
- Kimi WebBridge 调牌器检查通过：50 张可见牌、10 张可点击、40 张预览全部 disabled，调牌器仍显示数字深度，截图 `/tmp/hulebu-t088-tuner-board.png`。
- 移动端 390x844 截图通过：牌桌完整显示，无横向截断，截图 `/tmp/hulebu-t088-mobile.png`。

## 遗留问题

- 当前只改 HTML 配置试玩原型，不修改 Cocos 正式工程。
- 后续需要 Lee 在右侧内置浏览器试玩确认 4 层下层预览露出量、顶层小圆点和首轮 10 张入口难度是否需要继续微调。
