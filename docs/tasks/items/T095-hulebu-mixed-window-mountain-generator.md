# T095：胡了卜混合窗口牌山生成器

- 优先级：P1
- 负责人：Lee
- 默认负责人：Lee
- 状态：待验收
- 依赖：T093, T094
- 提出来源：IDEA-20260601-04
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 密集牌山生成器
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T095-hulebu-mixed-window-mountain-generator.md`, `docs/tasks/claims/T095-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页第 5 关后检查首轮窗口不是直接三张同组答案；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T095-hulebu-mixed-window-mountain-generator.md docs/tasks/claims/T095-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md`; `git diff --check`

## 背景

T093 朋友试玩 Demo 的密集牌山当前会按可解路径把“当前最上层可点击牌”直接切成 3 张一组，再给同一组分配 `碰 / 吃 / 杠` 模式。这样玩家可以机械地点击顶层三张并发动组合，下一层继续出现下一组三张答案，缺少选择压力。

## 目标

- 把密集牌山从顺序答案改成混合窗口。
- 保留理论可解路径，但不要把每一步答案直接铺在同一可点击窗口中。
- 让组合成员分散到不同堆、不同释放时机。
- 让首轮和后续窗口混入干扰牌、半成型牌、杠诱饵和吃碰冲突。
- 保持默认首轮可点击数量约 3-8 张。

## 不做

- 不实现 T094 的残局收官、牌引、牌河。
- 不修改 Cocos 工程。
- 不修改共享 Graph-based 生成器。
- 不修改正式关卡 JSON 或最终 UI 美术。
- 不扩大到 Web 站、PDF、AI 修图或部署范围。

## 验收标准

- 第 5 关后默认密集牌山首轮窗口中，任一 `solutionGroup` 最多只出现 2 张可点击牌，不能直接给出三张同组答案。
- 生成器仍能生成完整牌山，并保持默认首轮可点击数量在 3-8 张区间。
- 运行态存在至少一种混合/干扰信号，证明窗口中不只是完整答案组。
- 共享测试、HTML 脚本语法检查、浏览器检查、文档同步和 diff 检查通过。

## 完成内容

- 已把密集牌山可解路径拆成 `solutionGroup` 和 `solutionStep` 两层：答案组仍存在，但释放窗口会混入不同答案组的牌。
- 默认普通密集关会对首轮实际可点击窗口做重平衡，确保同一个答案组最多露出 2 张。
- 新增 `mixedWindowRole` 标记，用于识别 hold / lure / finish / direct 等窗口角色，后续可转成 UI 调试信息。
- 胡牌重点关和 Boss 目标关暂不做运行态重平衡，避免破坏胡牌包和 Boss 目标可解性。

## 验证结果

- `npm run test -w packages/shared -- mahjong-config-playable-prototype` 通过。
- `npm run test -w packages/shared -- mahjong-config` 通过，2 个测试文件 28 个测试通过。
- HTML 脚本 `node --check` 通过。
- 运行态抽样：第 1 关首轮 8 张可点、最大同组 2 张；Kimi WebBridge 打开真实页面第 5 关，首轮 7 张可点、最大同组 2 张。
- 本地 3031 服务返回 `HTTP/1.0 200 OK`。
