# T096：胡了卜玩家页布局、牌面放大和模板随机调参

- 领取人：Lee
- 领取时间：2026-06-01
- 状态：待验收
- 预计完成：2026-06-01
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T096-hulebu-play-layout-larger-random-template.md`, `docs/tasks/claims/T096-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `apps/web/**`, `deploy/**`, PDF 工具箱、AI 修图、AI 搜索、埋点和平台部署相关文件
- 依赖任务：T092, T093, T095
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查桌面布局、第 5 关牌面大小、首轮可点和模板随机；390px 移动视口检查无横向溢出；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T096-hulebu-play-layout-larger-random-template.md docs/tasks/claims/T096-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md`; `git diff --check`
- 当前阻塞：无。
- 完成内容：已完成玩家页布局压缩、密集牌山牌面放大和默认 auto 模板随机。玩家页 `auto` 会按 seed/重开选择候选模板，并在候选生成失败或首轮可点超过 8 时回退到下一个安全模板；调牌器仍可手动指定完整 8 个模板。规则牌尺寸已从 `45x60` 放大到 `52x70`，玩家页实测牌面约 `37x49`。
- 验证结果：`npm run test -w packages/shared -- mahjong-config-playable-prototype` 通过；`npm run test -w packages/shared -- mahjong-config` 通过，2 个测试文件 28 个测试通过；HTML 脚本 `node --check` 通过；Kimi WebBridge 第 5 关 `seed=epsilon` 验证 1512x682 下无横向/纵向溢出、首轮可点 8 张、生成 240 张、可见 43 张、随机回退到 `环形` 模板。
- 下一步：等待 Lee 试玩新版默认玩家页，继续确认牌面可读性、起手选择压力和模板随机体感。
