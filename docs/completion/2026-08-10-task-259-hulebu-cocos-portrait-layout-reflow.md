# T259 完成记录：胡了卜 Cocos 竖屏正式 UI 布局重排

- 完成时间：2026-08-10
- 负责人：Lee
- 任务编号：T259

## 修改文件

- Cocos 竖屏布局、牌山/槽位/动作栏/明牌区 Binder、运行时场景模型与牌面目录映射。
- `packages/shared/src/mahjong-cocos-project.test.ts`。
- T259 任务、领取、变更登记、模块、进展和完成记录。

## 实现内容

- 重排固定竖屏 HUD、牌桌、工具列、动作栏、备用槽和 8 格手牌槽，放大稀疏牌阵并隐藏空河牌格。
- 八条固定使用 formal v1 正确牌面；被遮挡牌使用深暗态，不可执行动作使用 disabled Sprite。
- 放大牌点击矩形同步视觉缩放，保持可见牌面和命中区域一致。
- 保留碰牌区真实副露显示，并验证第四张同牌触发补杠、三张碰升级为四张补杠。

## 验证命令与结果

- `npm run test -w packages/shared -- mahjong-cocos-project`：40/40 通过。
- `npx tsc -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.domain.json`：通过。
- Cocos Creator `390×844` 预览：正式资源加载、八条显示、牌点击入槽和 HUD 刷新正常；不可执行按钮显示暗态。
- `npm run game:hulebu:build`：精确提交 production build 通过，build ID `6a4a9cd3f5f5-20260810T145136Z`，5 个 smoke 路径均为 200。
- `npm run game:hulebu:verify-build`：同一 build ID 验证通过。
- `git diff --check`：通过。

## 遗留问题

- 本任务未处理横屏、微信小游戏 SDK、音效或新玩法规则。
