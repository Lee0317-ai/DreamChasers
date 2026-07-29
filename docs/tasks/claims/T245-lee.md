# T245：修复胡了卜 Cocos 精确快照真实路径构建

- 任务编号：T245
- 任务名称：修复胡了卜 Cocos 精确快照真实路径构建
- 领取人：Lee
- 状态：已完成
- 领取时间：2026-07-22
- 允许修改文件：`apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs`、`packages/shared/src/hulebu-cocos-release.test.ts`、本任务/领取/进展/完成与麻将模块交接文档
- 禁止修改：Cocos `assets/**`、`settings/**`、`profiles/**`、`temp/**`、`library/**`、`build/**`，release 配置、`hulebu-cocos-release.cjs`、玩法代码、Web/demo/prototype、数据库、账号和其他模块
- 验证命令：`npm run test -w packages/shared -- hulebu-cocos-release`; 干净 worktree `npm run game:hulebu:build`; `npm run game:hulebu:verify-build`; production 浏览器与控制台检查；`git diff --check`
- 当前阻塞：无。
- 并发说明：T245 仅修复 T243 发布脚本路径身份，不触碰 T244 玩法文件；完成后继续 T244 最终验收。
- 下一步：任务已完成；后续 production 横屏布局阻塞不属于 T245。
