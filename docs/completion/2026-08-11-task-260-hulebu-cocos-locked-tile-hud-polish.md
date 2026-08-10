# T260 胡了卜 Cocos 锁牌暗态与顶部 HUD 精修完成记录

- 任务编号：T260
- 负责人：Lee
- 完成日期：2026-08-11

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- T260 任务、领取、麻将模块、当天进展与完成记录文档

## 实现内容

- 统一被遮挡牌的点击和视觉判定，让不可点击下层牌稳定显示为暗色。
- 为异步牌面加载增加状态请求键，防止旧回调覆盖最新锁定态。
- 将分数和记牌器改成贴图上方的独立动态数值层，消除旧文字重叠和四门长串挤压。
- 将紧凑记牌器放回顶部 HUD 功能带，保留原有展开详情模型与浮层。

## 验证命令

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npx tsc -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.domain.json
npm run game:hulebu:build
npm run game:hulebu:verify-build
npm run docs:sync
git diff --check
```

## 验证结果

- 共享测试：`40/40` 通过。
- Cocos TypeScript：通过。
- 精确提交 production build：通过，build ID `9f423dd1fb0c-20260810T160923Z`。
- verify-only：5 个 smoke 路径均返回 `200`。
- Cocos `390×844` 预览：暗牌点击后槽位和余牌不变；亮牌点击后进入手牌且余牌 `23 -> 22`；分数 `106` 和记牌器数值清楚、不重叠。

## 遗留问题

- 无 T260 范围内遗留问题；整体正式 UI 继续由 Lee 试玩验收。
