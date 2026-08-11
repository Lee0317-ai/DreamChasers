# T267：胡了卜 Cocos 已碰牌池挂载与轻遮挡容差

- 任务编号：T267
- 负责人：Lee
- 状态：进行中
- 来源：Lee 反馈已碰牌池不可见，并要求轻微遮挡仍允许点击。
- 目标：确保 Cocos 运行时始终存在可渲染 `openMeldNodes` 的已碰牌池层；把牌面覆盖锁定口径统一为 8%。
- 允许修改：`GameSceneController.ts`、`BoardLayerBinder.ts`、`HulebuLevelConfig.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T267 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档。
- 禁止修改：副露/补杠数据、组合规则、关卡内容、其他 HUD、存档协议、正式原图、Web Demo、横屏、微信小游戏 SDK、其他模块。
- 验证命令：共享 Cocos 测试；Cocos TypeScript；精确提交 production build；verify-only；竖屏 production 已碰牌池与轻遮挡点击验收；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`。
- 验收标准：没有场景预制节点时控制器会创建 `MeldRiverRoot` 并挂载 binder；空态和碰/杠/补杠副露可见；覆盖率 `< 0.08` 的牌保持正面并可点击，覆盖率 `>= 0.08` 才显示牌背并禁止点击。

## 进展

- 2026-08-11：任务登记并由 Lee 领取；根因已确认是场景缺少 `MeldRiverRoot`，覆盖阈值过严则是生成层与点击层共同使用 `0.001`。
