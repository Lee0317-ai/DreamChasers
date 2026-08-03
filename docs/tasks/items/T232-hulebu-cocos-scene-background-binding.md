# T232 胡了卜 Cocos 茶室场景背景接入

- 状态：已完成
- 负责人：Lee
- 认领时间：2026-06-30
- 完成时间：2026-06-30
- 对应需求：继续对齐 `mahjong-roguelike-ui-concept-v1.png` 的首屏场景氛围

## 目标

给胡了卜 Cocos 首屏补一张独立的茶室桌面背景图，让当前纯绿色程序化底板接近目标概念图里的茶具、灯笼、木桌和绿植氛围，同时避免把带麻将牌和 UI 的整张概念图直接贴进 runtime。

## 允许修改范围

- `output/hulebu-ui-assets/hulebu-scene-background-v1/**`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6/backgrounds/**`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- 本任务相关文档分片

## 禁止修改范围

- Web 试玩页、站内静态 Demo、账号同步和 Prisma
- 玩法规则、关卡、奖励数值和 Cocos 场景文件
- 已有牌面、按钮、HUD 资源的路径口径

## 实现说明

1. 生成并归档一张 1024x1536 竖屏茶室桌面背景，只包含背景环境，不包含麻将牌、HUD、按钮、文字或奖励卡。
2. 将背景复制到 Cocos `resources/ui/v6/backgrounds/teahouse_table_background.png`，并补齐 `.meta`，供 `resources.load(.../spriteFrame)` 使用。
3. `GameSceneController` 新增 `SceneBackgroundArt` 背景层；背景加载成功后隐藏旧 `GreenTableFelt / TableRim / TableLowerShade` 程序化底板，加载失败时继续使用旧底板兜底。
4. 共享静态测试锁定背景资源路径、尺寸、色彩类型和 runtime 加载字符串。

## 验证

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `git diff --check -- apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts packages/shared/src/mahjong-cocos-project.test.ts apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6/backgrounds docs/tasks/items/T232-hulebu-cocos-scene-background-binding.md docs/tasks/claims/T232-lee.md docs/completion/2026-06-30-task-232-hulebu-cocos-scene-background-binding.md docs/progress/2026-06-29-lee.md docs/modules/mahjong-roguelike/PROGRESS.md`

## 验证结果

- 通过。共享测试 29 项通过。
- 通过。Cocos TypeScript 编译无报错。
- 通过。相关 diff 未发现空白问题。

## 遗留

- 尚未在 Cocos Creator Web Preview 中做桌面和 390px 真机比例截图核对；本轮先完成资源与 runtime 绑定。
