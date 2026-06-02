# T094：胡了卜残局收官与试玩反馈设计

- 优先级：P1
- 负责人：Lee
- 状态：待验收
- 默认负责人：Lee
- 依赖：T093
- 提出来源：IDEA-20260601-03
- 涉及模块：胡了卜 / 朋友试玩 Demo / 残牌处理 / 教学流程 / 记牌器
- 主要文件范围：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T094-hulebu-endgame-settlement-design.md`, `docs/tasks/claims/T094-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-01-hulebu-endgame-settlement-design.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T094-hulebu-endgame-settlement-design.md docs/tasks/claims/T094-lee.md docs/superpowers/specs/2026-06-01-hulebu-endgame-settlement-design.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/DECISIONS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md`; `git diff --check`

## 背景

T093 的 10 关朋友试玩 Demo 已能跑通前 4 关教学和第 5 关后的密集牌山，但 Lee 试玩后确认存在几个核心体验问题：

- 前几关把牌点进卡槽就结束，没有要求玩家真正发动 `碰 / 吃 / 杠 / 胡`，教学意义不足。
- 麻将牌面偏小，看不清且容易误点。
- `丢弃` 自动丢弃末尾槽位牌，缺少玩家选择。
- 玩家页缺少可见记牌器，玩家不知道剩余牌型，无法判断是否等待、追顺子或处理孤张。
- 如果胜利条件强制要求卡槽清空，孤张会导致玩家觉得关卡被生成器判死局。

双方讨论后确认采用 `残局收官` 方向：清空牌桌但卡槽仍有残张时，不直接失败或简单过关，而是进入一个短决策，把孤张转成胡了卜的特色系统。

## 目标

- 完成一份可执行的 `残局收官` 设计规格。
- 明确 Demo 第一阶段实现范围和后续正式工程扩展边界。
- 明确前 4 关教学关的过关条件必须绑定对应组合发动。
- 明确正式关卡对卡槽残张的处理方式：普通关允许残张进入收官，Boss 或特殊契约可单独要求清槽。
- 明确 `丢弃`、`记牌器` 和牌面可读性在下一轮实现中的行为要求。

## 不做

- 不修改 HTML 原型代码。
- 不修改 Cocos 工程、共享规则代码、关卡 JSON 或正式 UI 资源。
- 不实现牌河兑换、完整牌引生成器倾斜、正式结算评分或最终美术。
- 不引入完整麻将听牌、番型或真实牌局算法。

## 允许修改文件

- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T094-hulebu-endgame-settlement-design.md`
- `docs/tasks/claims/T094-lee.md`
- `docs/tasks/NEXT_ID.md`
- `docs/superpowers/specs/2026-06-01-hulebu-endgame-settlement-design.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/DECISIONS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-01-lee.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`

## 禁止修改文件

- `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- `apps/game/mahjong-roguelike/cocos/**`
- `apps/game/mahjong-roguelike/config/**`
- `packages/shared/**`
- `apps/web/**`
- `deploy/**`
- PDF 工具箱、AI 修图、AI 搜索、埋点和平台部署相关文件

## 验证命令

```bash
npm run docs:sync
rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T094-hulebu-endgame-settlement-design.md docs/tasks/claims/T094-lee.md docs/superpowers/specs/2026-06-01-hulebu-endgame-settlement-design.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/DECISIONS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md
git diff --check
```

## 验收标准

- 设计规格清楚定义 `残局收官` 的触发时机、选择项、短期 Demo 范围和长期扩展方向。
- 教学关、普通关、Boss 关和特殊契约的胜利/失败条件边界明确。
- `弃牌通关`、`选作牌引`、`收入牌河` 三个方向的用户价值、代价和实现阶段清楚。
- 下一轮实现任务可以直接根据规格拆分，不需要重新讨论基础规则。
- 文档同步、占位符扫描和 diff 检查通过。

## 进展

- 2026-06-01：已完成 T094 设计规格、模块决策 D040、模块进展、交接说明和 Lee 当天进展记录；等待 Lee 评审设计后进入下一轮实现任务。
