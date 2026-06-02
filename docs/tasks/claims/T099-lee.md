# T099：胡了卜试玩页卡槽满槽显示修复和记牌器

- 领取人：Lee
- 领取时间：2026-06-02
- 状态：待验收
- 预计完成：2026-06-02
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T099-hulebu-slot-visible-counter.md`, `docs/tasks/claims/T099-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `apps/web/**`, `deploy/**`, PDF 工具箱、AI 修图、AI 搜索、埋点和平台部署相关文件
- 依赖任务：T092, T093, T097, T098
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查满 8 格卡槽和记牌器刷新；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T099-hulebu-slot-visible-counter.md docs/tasks/claims/T099-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`; `git diff --check`
- 当前阻塞：无。
- 下一步：等待 Lee 试玩验收满槽提示、卡槽显示和记牌器位置；后续“丢弃时选择卡槽任意一张”仍按 T094 后续实现，不在本任务内。
