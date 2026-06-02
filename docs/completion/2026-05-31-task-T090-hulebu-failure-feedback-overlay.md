# T090 胡了卜失败提示弹层完成记录

- 任务编号：T090
- 负责人：Lee
- 完成日期：2026-05-31
- 修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T090-hulebu-failure-feedback-overlay.md`, `docs/tasks/claims/T090-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-31.md`

## 实现内容

- 新增 `failLevel` / `showLevelFailed`，统一处理本关失败状态和失败 overlay。
- 主槽满且没有可发动组合或救场资源时，弹出“本关失败”提示，显示失败原因并提供“重开本关”按钮。
- Boss 目标未完成导致失败时复用同一失败提示，不再只写底部状态文案。
- 失败后清空历史输入，牌面、组合按钮和工具按钮保持禁用。
- 新增 VM 回归测试覆盖满槽失败提示，并新增静态测试保护失败弹层函数、标题、文案和重开入口。

## 验证命令

- `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- `npm run test -w packages/shared -- mahjong-config`
- `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`
- Kimi WebBridge 打开默认玩家页并通过页面运行时模拟失败提示。
- `npm run docs:sync`
- `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T090-hulebu-failure-feedback-overlay.md docs/tasks/claims/T090-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`
- `git diff --check`

## 验证结果

- 自动化测试通过，HTML 脚本语法检查通过。
- Kimi WebBridge 模拟失败后确认：`phase=failed`，overlay 打开，标题为“本关失败”，正文包含“主槽已满，且当前没有可发动的组合或可用救场。”，按钮为“重开本关”。
- 验证截图保存到 `/tmp/hulebu-failure-feedback.png`。

## 遗留问题

- 本任务只改 HTML 配置试玩原型和共享测试，未同步 Cocos 正式工程。
- 失败提示文案和弹层尺寸仍可根据 Lee 试玩反馈继续微调。
