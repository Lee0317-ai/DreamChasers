# T227：胡了卜 Cocos 明牌区与槽位真实牌面补齐

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 来源：IDEA-20260629-15

## 背景

T190-T226 已让胡了卜 Cocos 正式工程具备 v6 牌面、组合按钮、牌河规则、局外大厅和长期进度链路，但 `明牌区 / 牌河 / 主槽 / 备用槽` 仍主要依赖文字标签。继续承接 Web 当前体验时，这些区域需要先补成真实麻将牌面显示。

## 目标

1. `MeldRiverLayerBinder` 为明牌区与牌河优先显示真实麻将牌面。
2. `SlotLayerBinder` 为主槽与备用槽优先显示真实麻将牌面。
3. 继续复用现有 `HulebuTileSpriteCatalog` 和 v6 牌面资源路径。
4. 资源缺失或加载失败时保留当前文字 fallback。
5. 不改规则层与运行态快照结构。

## 不做

- 不修改 Web 原型、站内静态 Demo 或账号接口。
- 不重建 Cocos 项目或改场景树。
- 不补最终动效、音效、人物 cut-in 或奖励卡重做。
- 不追 Boss、事件、无尽、每日和高阶的新增规则。

## 允许修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/MeldRiverLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/SlotLayerBinder.ts`
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

## 完成情况

- 已将 `MeldRiverLayerBinder` 从纯文字 chip 改为优先显示真实麻将牌面：明牌区按 `碰 / 杠 / 补杠` 展示 3-4 张同牌，牌河优先显示单张弃牌。
- 已将 `SlotLayerBinder` 的主槽与备用槽从纯文字补成优先显示真实麻将牌面，同时保留现有槽位背板和文字 fallback。
- 已补齐验证链路：共享静态测试通过，Cocos TypeScript 编译通过，空白检查通过。
