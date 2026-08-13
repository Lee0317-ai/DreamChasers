# T284 完成记录：河牌复用底部两格

- 任务编号：T284
- 负责人：Lee
- 修改文件：`SlotLayerBinder.ts`、`MeldRiverLayerBinder.ts`、`GameSceneController.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`。
- 实现内容：河牌直接绑定底部原备用槽位置，运行时最多两格；删除牌桌中部重复河牌格，只保留河牌救场状态提示；弃牌选择仍只允许点击主槽已占用牌。
- 验证命令：`npm exec vitest run packages/shared/src/mahjong-cocos-project.test.ts`、`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`、`git diff --check`。
- 验证结果：共享 Cocos 静态测试 43/43 通过，TypeScript 检查通过，差异检查通过。production build 暂未执行：构建脚本要求正式输入工作树干净，当前存在用户已有 `information.json` 修改，等本轮提交后再跑 exact-commit build。
- 遗留问题：提交后需要按 exact-commit 流程重新生成 production build，并在浏览器目视确认底部两格河牌展示与“弃牌 → 选主槽牌 → 进入底部两格”流程。
