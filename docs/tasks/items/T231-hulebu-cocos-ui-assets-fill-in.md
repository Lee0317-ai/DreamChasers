# T231 胡了卜 Cocos UI 素材补齐接入

- 状态：已完成
- 负责人：Lee
- 认领时间：2026-06-30
- 完成时间：2026-06-30
- 对应 intake：`CHANGE_INTAKE.md` 2026-06-30 T231 条目

## 目标

让胡了卜 Cocos 预览继续摆脱早期程序化占位壳，把 T181 v6 资源包里已经有的奖励卡、场景皮肤卡、弹层底板、面板和顶部 HUD 牌匾接进运行时。

## 允许修改范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6/**`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- 本任务相关文档分片

## 禁止修改范围

- Web 试玩页与站点路由
- 玩法规则、关卡、奖励效果和账号同步逻辑
- Cocos 场景文件和 prefab 文件

## 实现说明

1. 从 `output/hulebu-ui-assets/hulebu-ui-component-pack-v6-source-faithful-transparent-tiles/` 补齐 `cards / panels / combo-choice` 到 Cocos `assets/resources/ui/v6/`。
2. `GameSceneController` 新增顶部牌匾、奖励卡和弹层底板的 Sprite 映射，运行时优先加载真实 Sprite，失败时继续保留程序化 fallback。
3. 顶部 HUD 收敛为 `VisualShellRoot` 的大牌匾承载，避免 `HudBinder` 再叠一排小 badge 到首屏。
4. 共享测试补充新资源尺寸和 runtime 字符串约束，防止资源再次缺失。

## 验证

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `git diff --check -- apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts packages/shared/src/mahjong-cocos-project.test.ts apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6`

## 验证结果

- 通过。共享测试 29 项通过。
- 通过。Cocos TypeScript 编译无报错。
- 通过。相关 diff 未发现空白问题。

## 遗留

- 目标概念图里的茶壶、灯笼、桌面环境光等整屏场景背景仍缺少可直接接入的独立运行时背景切片；本任务先接已有组件级资源。
