# T227 领取记录：胡了卜 Cocos 明牌区与槽位真实牌面补齐

- 任务编号：T227
- 任务名称：胡了卜 Cocos 明牌区与槽位真实牌面补齐
- 负责人：Lee
- 领取时间：2026-06-29
- 状态：已完成

## 文件范围

允许修改：

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/MeldRiverLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/SlotLayerBinder.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`

禁止修改：

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

## 当前记录

- 已完成第一批代码迁移：明牌区、牌河、主槽和备用槽都已优先显示真实麻将牌面，并保留文字 fallback。
- 已完成本任务验证：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`、`npm run test -w packages/shared -- mahjong-cocos-project`、`git diff --check` 通过。
