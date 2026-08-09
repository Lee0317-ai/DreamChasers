# T258 完成记录：胡了卜正式 UI Batch D Cocos 接入

- 完成时间：2026-08-10
- 负责人：Lee
- 任务编号：T258

## 修改文件

- Cocos `assets/resources/ui/formal-v1/**` 正式资源与 Creator 元数据。
- `HulebuFormalUiCatalog.ts`、`HulebuTileSpriteCatalog.ts`、`GameSceneController.ts`、`ComboBarBinder.ts`、`HudBinder.ts`、`SlotLayerBinder.ts`。
- `packages/shared/src/mahjong-cocos-project.test.ts`。
- T248/T258 任务、领取、模块、进展和完成记录。

## 实现内容

- 导入 formal v1 全量 80 项资源和 Cocos Creator 3.8.8 权威 `.meta`。
- 集中维护正式 SpriteFrame 路径，切换局内正式视觉资源。
- 正式牌面优先加载，历史 v6 仅在资源失败时回退。
- 增加 80 项 manifest 完整性、图片尺寸、元数据和主运行时无 v6 主引用检查。

## 验证命令与结果

- `npm run test -w packages/shared -- mahjong-cocos-project`：40/40 通过。
- `npx tsc -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.domain.json`：通过。
- `npm run game:hulebu:build`：精确提交 production build 通过，build ID `1eb7f00e2b2e-20260809T164755Z`，5 个 smoke 路径均为 200。
- `390×844` 内置浏览器：画布尺寸正确，正式资源可见，控制台 0 warning/error，点击顶层牌后余牌 24→23 且牌进入手槽。
- `npm run docs:sync`、`git diff --check`：通过。

## 遗留问题

- 本任务未处理动效、声音、横屏或微信小游戏 SDK；后续需独立立项。
