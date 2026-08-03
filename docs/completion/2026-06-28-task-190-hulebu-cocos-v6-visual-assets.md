# T190 完成记录：胡了卜 Cocos 首轮视觉资源接入

- 任务编号：T190
- 负责人：Lee
- 完成时间：2026-06-28

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6/**`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/ComboBarBinder.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-28-lee.md`
- `docs/superpowers/plans/2026-06-28-hulebu-cocos-v6-visual-assets.md`

## 实现内容

- 复制 Web v6 的牌面、组合按钮、工具按钮、HUD 和槽位 PNG 到 Cocos resources。
- 为新增资源生成 Cocos directory/image meta。
- 将 `HulebuTileSpriteCatalog` 从旧 `refreshed` 牌面切到 `ui/v6/tiles/mahjong/**`。
- 调整 BoardLayer 堆叠提示层级，避免压在 v6 牌面上。
- 让 `ComboBarBinder` 优先加载 v6 组合按钮图片，资源缺失时保留文字 fallback。
- 共享测试新增 v6 牌面、关键 UI 资源和 `6条` 路径检查。

## 验证命令

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
npm run docs:sync
git diff --check
```

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`npm run docs:sync`
- 通过：`git diff --check`

## 遗留问题

- 本轮只做首轮视觉资源接入，槽位、工具按钮和 HUD 仍可继续做真实 Sprite 绑定。
- Boss、事件、无尽、每日、高阶和局外成长仍待后续 Cocos 追平任务。
