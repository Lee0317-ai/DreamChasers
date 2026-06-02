# T097：胡了卜教学关必须发动对应组合才通关

- 优先级：P1
- 负责人：Lee
- 默认负责人：Lee
- 状态：待验收
- 依赖：T093, T094, T096
- 提出来源：IDEA-20260601-06
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 10 关朋友 Demo / 教学关胜利条件
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T097-hulebu-tutorial-action-clear.md`, `docs/tasks/claims/T097-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查第 1-4 关教学：全放入卡槽不通关，点击对应 `碰 / 吃 / 杠 / 胡` 后通关；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T097-hulebu-tutorial-action-clear.md docs/tasks/claims/T097-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md`; `git diff --check`

## 背景

Lee 试玩 10 关朋友 Demo 时发现，前 4 关教学关把牌全部点进卡槽后就会通关，玩家不需要点击 `碰 / 吃 / 杠 / 胡` 按钮，教学目标没有被强制完成。

## 目标

- 第 1 关必须成功点击 `碰` 才算通关。
- 第 2 关必须成功点击 `吃` 才算通关。
- 第 3 关必须成功点击 `杠` 才算通关。
- 第 4 关必须成功点击 `胡` 才算通关。
- 教学关只暴露本关目标动作候选，避免误点其它组合破坏教学牌型。
- 第 5 关后的普通密集牌山仍按牌山清空、Boss 目标和奖励节点规则结算。

## 不做

- 不修改 Cocos 正式工程。
- 不修改正式关卡 JSON。
- 不实现丢弃选牌、记牌器或残局收官。
- 不修改第 5 关后的密集牌山生成规则。
- 不扩大到 Web 站、PDF、AI 修图或部署范围。

## 验收标准

- 前 4 关教学关全部点入卡槽但未点击对应组合按钮时不会通关。
- 点击本关对应 `碰 / 吃 / 杠 / 胡` 后立即通关。
- 第 4 关 `胡` 教学不会暴露 `吃 / 碰` 候选导致玩家误操作。
- 共享测试、HTML 脚本语法检查、浏览器验证、文档同步和 diff 检查通过。

## 进展

- 2026-06-01：已创建任务并领取，开始补教学动作通关回归测试。
- 2026-06-01：已完成 HTML 原型教学关通关判定修正，等待 Lee 试玩验收。

## 完成内容

- 前 4 关默认玩家 Demo 新增教学目标动作门槛：必须成功发动本关对应 `碰 / 吃 / 杠 / 胡` 后才允许通关。
- 单纯把教学牌全部点入卡槽时，页面会继续停留在本关，并提示“请点击对应动作完成本关”。
- 教学关候选组合会过滤为本关目标动作，第 4 关 `胡` 教学不会暴露 `吃 / 碰` 候选造成误操作。
- 前 3 关教学牌山收敛为最小教学包：`碰` 3 张、`吃` 3 张、`杠` 4 张，避免 6 格教学槽被非目标干扰牌占满。
- 教学门槛只作用于默认玩家试玩页的前 4 关，调牌器和配置联调视图不受影响。

## 验证结果

- `npm run test -w packages/shared -- mahjong-config-playable-prototype` 已通过，1 个测试文件 8 个测试通过。
- `npm run test -w packages/shared -- mahjong-config` 已通过，2 个测试文件 28 个测试通过。
- HTML 脚本 `node --check` 已通过。
- Kimi WebBridge 默认玩家页验证通过：第 1 关 3 张全入槽后仍停留本关并提示点击 `碰`，只有 `peng` 候选；点击 `碰` 后弹出第 1 关通关。第 4 关 8 张全入槽后仍停留本关并提示点击 `胡`，只有 `hu` 候选；点击 `胡` 后弹出第 4 关通关。
- `npm run docs:sync` 已通过，已同步 64 个任务分片和 63 个领取分片。
- 文档占位扫描无结果；`git diff --check` 已通过。
