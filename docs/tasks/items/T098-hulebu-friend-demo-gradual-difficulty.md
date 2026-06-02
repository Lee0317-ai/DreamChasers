# T098：胡了卜朋友 Demo 第 5-10 关渐进难度曲线

- 优先级：P1
- 负责人：Lee
- 默认负责人：Lee
- 状态：待验收
- 依赖：T093, T095, T096, T097
- 提出来源：IDEA-20260601-07
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 10 关朋友 Demo / 难度曲线
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T098-hulebu-friend-demo-gradual-difficulty.md`, `docs/tasks/claims/T098-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查第 5 关牌量、标题提示、首轮可点和第 10 关高压恢复；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T098-hulebu-friend-demo-gradual-difficulty.md docs/tasks/claims/T098-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md`; `git diff --check`

## 背景

朋友试玩反馈第 5 关开始太难。当前默认 Demo 前 4 关是小牌量教学，第 5 关直接进入 240 张高压密集牌山，难度从“理解规则”跳到“正式地狱”，缺少练习坡道。

## 目标

- 采用方案 B：前 4 关教学不变，第 5-10 关逐步提高牌量、堆叠深度和干扰强度。
- 第 5 关定位为“正式入门”，牌量约 72 张。
- 第 6-8 关逐步提高到中等压力。
- 第 9-10 关恢复接近当前高压密集牌山。
- 保持首轮可点 3-8 张，且任一答案组首轮最多露出 2 张。
- 调牌器继续使用开发者手动调参，不受朋友 Demo profile 限制。

## 不做

- 不修改 Cocos 正式工程。
- 不修改正式关卡 JSON。
- 不实现动态失败降难。
- T098 本身不实现丢弃选牌、记牌器或残局收官；记牌器和满槽显示问题已由同轮新增 T099 承接。
- 不扩大到 Web 站、PDF、AI 修图或部署范围。

## 验收标准

- 默认玩家 Demo 第 5-10 关使用渐进难度 profile。
- 第 5 关不再直接生成 240 张，目标约 72 张。
- 第 6-10 关牌量逐步提高到 240 张。
- 每关首轮可点保持 3-8 张，任一答案组首轮最多露出 2 张。
- 第 5 关标题或提示明确“正式入门”。
- 共享测试、HTML 脚本语法检查、浏览器验证、文档同步和 diff 检查通过。

## 进展

- 2026-06-01：已创建任务并领取，开始补渐进难度 profile 回归测试。
- 2026-06-02：已实现默认玩家 Demo 第 5-10 关渐进 profile。第 5-10 关牌量为 `72 / 96 / 132 / 168 / 210 / 240`，堆叠深度为 `3 / 3 / 4 / 5 / 6 / 6`，字牌权重为 `12 / 18 / 24 / 30 / 35 / 40`。第 10 关在朋友 Demo 中定位为“综合高压”压力关，不叠正式 Boss 目标和胡包，避免试玩最后一关重新变成额外目标劝退；调牌器和正式配置仍保留原 Boss 配置。
- 2026-06-02：回归测试和 Kimi WebBridge 验证通过：第 5 关生成 72 张、标题为“正式入门”、首轮可点 8 张、最大同组 2；第 10 关生成 240 张、首轮可点 7 张、最大同组 2。
