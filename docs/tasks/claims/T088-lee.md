# T088：胡了卜原型散乱可见压叠层

- 领取人：Lee
- 领取时间：2026-05-30
- 状态：待验收
- 预计完成：2026-05-30
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T088-hulebu-visible-scattered-stack-preview.md`, `docs/tasks/claims/T088-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-30.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 依赖任务：T049, T050, T059, T083, T085, T086, T087
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页和调牌器页检查；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T088-hulebu-visible-scattered-stack-preview.md docs/tasks/claims/T088-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 当前阻塞：无。
- 完成内容：已在配置试玩原型中新增 4 层栈预览渲染，默认玩家页和调牌器会显示顶牌加下层预览牌；下层预览牌显示真实牌面、错位露出、保持 blocked/disabled，不扩大首轮可点击数量。默认玩家页的栈深数字已降噪为小圆点，调牌器仍显示数字深度便于调关。
- 验证结果：`npm run test -w packages/shared -- mahjong-config-playable-prototype` 通过；`npm run test -w packages/shared -- mahjong-config` 通过；`node --check /tmp/hulebu-config-playable-script.js` 通过；Kimi WebBridge 默认玩家页检查为 50 张可见牌、10 张可点、40 张 `stack-preview` 全部 disabled、深度 1-4；Kimi WebBridge 调牌器检查同为 50 张可见牌、10 张可点、40 张预览全部 disabled，且深度数字仍显示；临时 headless Chrome 390x844 截图 `/tmp/hulebu-t088-mobile.png` 显示移动端无横向截断。
- 下一步：等待 Lee 在右侧内置浏览器确认散乱压叠观感，重点看下层露出量、顶层小圆点和 10 张入口难度是否需要继续微调。
