# T286 完成记录：胡了卜死局失败提示

- 负责人：Lee
- 修改文件：Cocos `GameContracts.ts`、`GameSession.ts`、`GameCoordinator.ts`、`HulebuRuntimeState.ts`、`GameSceneController.ts`；共享定向测试。
- 实现内容：识别牌槽已满、无组合、河牌已满且弃牌次数为 0 的死局，转入 `failed` 阶段并显示正式失败资源和“重新开始”按钮。
- 验证命令：`npx vitest run packages/shared/src/hulebu-cocos-domain.test.ts -t 'transitions to failed' --reporter=verbose`；`npm run game:hulebu:verify-build`。
- 验证结果：死局定向测试通过；构建验证待执行。
- 遗留问题：现有仓库中另有一项历史导入图测试失败，与本次改动无关。
