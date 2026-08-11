# T269：胡了卜 Cocos 多组合按钮上方候选菜单

- 任务编号：T269
- 负责人：Lee
- 状态：进行中
- 来源：Lee 指出多组“碰”应显示在“碰”按钮上方，而不是打开全屏弹框。
- 目标：把多候选组合改成锚定对应动作按钮、向上展开的局部二级菜单。
- 允许修改：`GameSceneController.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T269 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档。
- 禁止修改：组合判定、计分、副露、关卡、其他流程弹层、存档协议、正式原图、Web Demo、横屏、微信小游戏 SDK、其他模块。
- 验证命令：共享 Cocos 测试；Cocos TypeScript；精确提交 production build；verify-only；竖屏 production 多候选菜单定位和点击验收；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`。
- 验收标准：多组候选不产生全屏遮罩或大面板；候选纵向出现在对应组合按钮上方；选中后立即执行并收起；再次点击同按钮可取消；刷新恢复仍展示相同候选。

## 进展

- 2026-08-11：任务登记并由 Lee 领取，确认只替换 `playing.comboChoosing` 的表现层。
- 2026-08-11：已移除多组合候选的全屏遮罩、面板、标题和返回按钮；候选改为锚定对应组合按钮并向上排列，同一组合按钮可再次点击收起。
- 2026-08-11：共享 Cocos 结构测试 40 项通过，Cocos TypeScript 校验通过；待精确提交 production build 和竖屏验收。
