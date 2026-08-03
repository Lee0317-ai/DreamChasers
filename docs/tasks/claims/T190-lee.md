# T190 领取记录：胡了卜 Cocos 首轮视觉资源接入

- 任务编号：T190
- 任务名称：胡了卜 Cocos 首轮视觉资源接入
- 负责人：Lee
- 领取时间：2026-06-28
- 状态：已完成

## 文件范围

允许修改：

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6/**`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-28-lee.md`
- `docs/superpowers/plans/2026-06-28-hulebu-cocos-v6-visual-assets.md`

禁止修改：

- `apps/web/**`，除非只读取资源来源。
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
- 结果：已完成 Cocos 首轮 v6 视觉资源接入。
