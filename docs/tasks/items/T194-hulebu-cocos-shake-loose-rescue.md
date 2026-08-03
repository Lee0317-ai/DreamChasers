# T194：胡了卜 Cocos 杠胡震落和满槽救场

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 来源：IDEA-20260628-06

## 背景

T192/T193 已将 Cocos 的牌河、明牌、补杠和打牌入河交互接起来。本任务继续迁移 Web 当前局内手感：`杠 / 补杠 / 胡` 后震落开山，以及主槽满时的牌河救场提示。

## 目标

1. `杠 / 补杠` 后震落最多 2 张压顶牌。
2. `胡` 后震落最多 3 张压顶牌，并沿用已接入的清牌河行为。
3. 被震落的牌回到可点 board 状态，清除 blocker 和高层压顶。
4. 主槽满且牌河有空间时 HUD 提示可打牌入河。

## 不做

- 不做完整震落动画。
- 不实现完整失败弹层。
- 不追 Boss、事件、无尽、每日、高阶和账号局外成长。
- 不改 Web 玩法或原型逻辑。

## 允许修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-28-lee.md`

## 禁止修改文件

- `apps/web/**`
- `apps/game/mahjong-roguelike/prototypes/**`
- `apps/web/prisma/**`
- PDF、AI 修图、TimePick、部署相关文件

## 验证命令

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
npm run docs:sync
git diff --check
```

## 完成记录

- 完成时间：2026-06-28
- 完成内容：Cocos runtime 已支持 `杠 / 补杠 / 胡` 基础震落开山和满槽牌河救场提示。
- 验证结果：全部验证命令通过。
