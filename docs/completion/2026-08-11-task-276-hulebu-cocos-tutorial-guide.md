# T276 胡了卜 Cocos 新手引导正式接入完成记录

- 完成时间：2026-08-11
- 负责人：Lee
- 任务编号：T276
- 状态：已完成

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- T276 任务、领取、模块交接和进展文档

## 实现内容

- 为 `1-1` 到 `1-5` 增加选牌与碰、吃、杠、多组合和满槽救场五段动态教学。
- 教学条根据槽位数量和动作候选实时更新，位于顶部信息区下方，不阻断牌山、槽位或动作按钮输入。
- 展开记牌器、打开通关/奖励等流程弹层时自动隐藏教学条。
- 大厅新增“新手教学”入口；重玩流程不写 active run，第五关完成或中途退出后恢复原进行中存档。
- 教学第五关使用“新手教学完成 / 回到大厅”收口，普通主线通关流程保持不变。

## 验证命令与结果

- `npm run test -w packages/shared -- mahjong-cocos-project`：通过，40/40。
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`：通过。
- `npm run game:hulebu:build`：通过，精确提交 `dec5351f00576abcb4fdc4222bc2609ff85eec00`，build ID `dec5351f0057-20260811T144015Z`。
- `npm run game:hulebu:verify-build`：通过，5 个 smoke 路径均为 200。
- 内置浏览器 `390×844`：通过；确认现有 `1-3` 显示杠教学、大厅入口可见、进入后为 `1-1`、选入第一张牌后文案更新，控制台无错误或警告。
- `git diff --check`：通过。
- UTF-8 无 BOM：通过。

## 遗留问题

- 本任务使用轻量动态教学条，没有增加手指箭头动画或局部聚光遮罩；如后续需要更强引导，应单独作为表现层任务评估，避免遮挡牌山输入。
