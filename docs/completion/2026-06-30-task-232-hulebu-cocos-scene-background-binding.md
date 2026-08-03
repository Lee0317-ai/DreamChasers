# T232 胡了卜 Cocos 茶室场景背景接入完成记录

- 完成时间：2026-06-30
- 负责人：Lee

## 修改文件

- `output/hulebu-ui-assets/hulebu-scene-background-v1/teahouse_table_background.png`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6/backgrounds/teahouse_table_background.png`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6/backgrounds.meta`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6/backgrounds/teahouse_table_background.png.meta`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T232-hulebu-cocos-scene-background-binding.md`
- `docs/tasks/claims/T232-lee.md`
- `docs/tasks/NEXT_ID.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 新增茶室桌面背景图，中心留白用于承载运行时牌山和 UI，四周提供灯笼、茶具、绿植、木桌和玉坠氛围。
- 背景图归档到 `output/hulebu-ui-assets/hulebu-scene-background-v1/`，运行时资源复制到 Cocos `resources/ui/v6/backgrounds/`。
- `GameSceneController` 新增 `HULEBU_SCENE_BACKGROUND_SPRITE` 和 `SceneBackgroundArt` 背景层；资源加载成功时隐藏旧程序化绿桌底板，失败时保留旧底板兜底。
- 共享静态测试新增背景路径、尺寸、色彩类型和加载字符串约束。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `git diff --check -- apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts packages/shared/src/mahjong-cocos-project.test.ts apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6/backgrounds docs/tasks/items/T232-hulebu-cocos-scene-background-binding.md docs/tasks/claims/T232-lee.md docs/completion/2026-06-30-task-232-hulebu-cocos-scene-background-binding.md docs/progress/2026-06-29-lee.md docs/modules/mahjong-roguelike/PROGRESS.md`
- `npm run docs:sync`

## 验证结果

- 通过。共享测试 29 项通过。
- 通过。Cocos TypeScript 编译无报错。
- 通过。相关 diff 未发现空白问题。

## 遗留问题

- 尚未使用 Cocos Creator Web Preview 做真实截图核对；后续需要看背景与牌山、HUD、底部槽位是否在桌面透视上足够协调。
