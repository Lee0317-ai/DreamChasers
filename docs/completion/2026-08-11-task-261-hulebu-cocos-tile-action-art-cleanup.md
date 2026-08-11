# T261 完成记录：胡了卜 Cocos 八条、牌体底层与动作按钮底色修复

- 任务编号：T261
- 负责人：Lee
- 完成日期：2026-08-11

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/ComboBarBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/formal-v1/`
- `output/hulebu-ui-assets/hulebu-formal-ui-v1/`
- `output/hulebu-ui-assets/scripts/build_formal_ui_batch_ab.py`
- `output/hulebu-ui-assets/scripts/build_formal_ui_batch_c.py`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- T261 任务、领取、模块与进展文档

## 实现内容

- 恢复此前确认的上下 `W/M` 形八条，并用测试锁定正式 Cocos 文件与已确认源图一致。
- 正式麻将 Sprite 加载成功后清空程序化牌体，避免每张牌下方重复一层；资源失败时仍保留 fallback。
- 重新裁切吃、碰、杠、补杠、胡的 normal、active、disabled 资源，使按钮外部透明。
- 正式动作按钮 Sprite 加载成功后清空程序化底板，避免叠出错误底色。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.domain.json`
- `npm run game:hulebu:build`
- `npm run game:hulebu:verify-build`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 共享测试：`40/40` 通过。
- Cocos TypeScript：通过。
- Cocos `390×844` 实机预览：八条、正式牌体和动作按钮禁用态正确；真实下层牌继续保持深暗且不可点击。
- production build：通过，build ID `f35f07e3cd44-20260811T005150Z`，精确提交 `f35f07e3cd44acff05bdbe03cffa8ec96bf72483`。
- verify-only：通过；5 个 smoke 路径均返回 `200`。

## 遗留问题

- 无。本任务未修改玩法规则、关卡配置、存档、Web Demo、横屏或微信小游戏 SDK。
