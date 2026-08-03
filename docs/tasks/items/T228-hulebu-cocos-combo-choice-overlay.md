# T228：胡了卜 Cocos 候选组合选择弹层基础

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 来源：IDEA-20260629-16

## 背景

T190-T227 已让胡了卜 Cocos 正式工程具备 v6 牌面、主槽/备用槽真实牌面、牌河、明牌区和长期进度链路，但组合按钮当前仍默认执行第一组候选。继续承接 Web 当前体验时，`吃 / 碰 / 杠 / 补杠 / 胡` 在多组候选成立时需要先让玩家自己选。

## 目标

1. `GameSceneController` 在同一组合类型存在多组候选时先弹出候选组合选择面板。
2. `HulebuRuntimeState` 提供按组合类型读取全部候选的接口，不再只暴露第一组 key。
3. 候选面板内优先显示真实麻将小牌面，并保留文本 fallback。
4. 单一候选仍维持一键直结算，不增加多余点击。
5. 不改 Web 现有行为，不重做最终弹层美术。

## 不做

- 不修改 Web 原型、站内静态 Demo 或账号接口。
- 不重建 Cocos 项目或改场景树。
- 不把 `comboChoice` 单独做成完整可恢复中局 phase。
- 不补人物 cut-in、最终奖励卡美术或完整动画。

## 允许修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`

## 禁止修改文件

- `apps/web/**`
- `apps/game/mahjong-roguelike/prototypes/**`
- `apps/web/public/games/hulebu-demo/**`
- `apps/web/prisma/**`
- PDF、AI 修图、TimePick、部署相关文件

## 验证命令

```bash
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
npm run test -w packages/shared -- mahjong-cocos-project
npm run docs:sync
git diff --check
```

## 当前进展

- 已完成 Cocos 候选组合选择弹层基础。`HulebuRuntimeState` 可按组合类型返回全部候选；`GameSceneController` 在同类候选超过 1 组时会弹出候选选择面板，单候选仍直接结算。
- 候选面板会优先加载真实麻将小牌面，并保留候选文字 fallback；选择后按用户点中的 `candidate key` 执行，不再默认执行第一组。

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
