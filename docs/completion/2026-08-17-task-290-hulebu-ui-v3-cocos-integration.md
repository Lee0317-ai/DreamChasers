# T290 胡了卜 UI v3 正式接入 Cocos 完成记录

- 任务编号：T290
- 负责人：Lee
- 完成日期：2026-08-17

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/hulebu/**`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuV3UiCatalog.ts`
- `assets/scripts/assets/HulebuFormalUiCatalog.ts`
- `assets/scripts/assets/HulebuMetaFlowUiCatalog.ts`
- `assets/scripts/assets/HulebuTileSpriteCatalog.ts`
- `assets/scripts/ComboBarBinder.ts`
- `assets/scripts/SlotLayerBinder.ts`
- `assets/scripts/MeldRiverLayerBinder.ts`
- `assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`

## 实现内容

- 接入 103 张 v3 正式资源及其 Creator `.meta`。
- 新增统一 v3 SpriteFrame catalog，并让局内、局外与麻将牌加载路径优先使用 v3。
- 适配动作按钮单态资源的亮暗反馈、手牌槽、记牌器、已碰牌池、弃牌工具和不同 phase 的全屏背景。
- 修正旧深色遮罩和浅色文字与新粉彩 UI 冲突的问题。
- 浏览器实测中发现并修复已碰牌池变量插入位置错误、meta-flow 背景色变量作用域错误。

## 验证命令与结果

- `npx vitest run packages/shared/src/mahjong-cocos-project.test.ts --reporter=dot`：44/44 通过。
- `npx vitest run packages/shared/src/mahjong-cocos-project.test.ts packages/shared/src/hulebu-cocos-domain.test.ts --reporter=dot`：163/164；仅既有领域导入边界测试失败。
- `git diff --check`：通过。
- `npm run game:hulebu:build`：通过，build ID `4cb1c029683b-20260817T120429Z`。
- `npm run game:hulebu:verify-build`：通过，HEAD `4cb1c029683bd476d5c0dbca723ddab397876b1c`。
- 390×844 内置浏览器：大厅、地图、牌局、记牌器、三牌入槽和动作按钮状态已完成截图检查，最终复测无新增控制台 error。

## 遗留问题

- `hulebu-cocos-domain.test.ts` 的“领域和 runtime 导入图不得包含 Cocos runtime 模块”仍将 `assets/scripts/bootstrap/HulebuPortraitLayout.ts` 列为 offender；该问题在 T290 开始前已存在，本任务未扩大范围处理。
- v3 动作按钮只有单张资源，当前通过颜色降级表达不可用态；后续若需要更精细的按下/禁用质感，应补独立状态图。
