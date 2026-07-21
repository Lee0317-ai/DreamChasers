# T245：修复胡了卜 Cocos 精确快照真实路径构建

- 优先级：P0
- 负责人：Lee
- 状态：进行中
- 依赖：T243
- 阻塞：T244 production 浏览器验收
- 主要文件范围：`apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs`、`packages/shared/src/hulebu-cocos-release.test.ts`、本任务/领取/进展/完成与麻将模块交接文档
- 禁止修改范围：Cocos `assets/**`、`settings/**`、`profiles/**`、`temp/**`、`library/**`、`build/**`，release 配置、`hulebu-cocos-release.cjs`、玩法代码、Web/demo/prototype、数据库、账号、其他模块
- 验证方式：`npm run test -w packages/shared -- hulebu-cocos-release`; 干净 worktree 的 `npm run game:hulebu:build` 与 `npm run game:hulebu:verify-build`; production 浏览器加载与控制台检查；`git diff --check`

## 背景

T244 的真实 production 浏览器验收发现产物黑屏，场景中的 `BoardLayerBinder`、`SlotLayerBinder`、`ComboBarBinder`、`HudBinder` 和 `GameSceneController` 被 Cocos 以 missing class 移除。构建产物包含这些模块，但用户脚本没有 `_RF.push(script UUID)` 注册。

两个同提交隔离实验给出单变量证据：从 `/tmp/...` 构建会复现类缺失，而从其真实路径 `/private/tmp/...` 构建不再报 missing class，并能正常渲染游戏。T243 的精确快照默认建在 `os.tmpdir()`；macOS 上该路径经 `/var` 或 `/tmp` 符号链接进入 `/private/...`，使资产库与脚本编译器使用不同的项目 URL。

## 目标

- 精确提交快照必须创建在 `temporaryRoot` 的真实路径下。
- 回归测试覆盖符号链接临时根，并证明 `checkoutRoot`、`projectRoot` 和清理操作仍指向同一真实目录。
- 不改变精确提交、输入清洁、Creator provenance、attempt promotion 或 manifest 语义。
- 真实 production build 不再包含 missing class，页面能加载正式场景。

## 不做

- 不修改 Cocos 场景、组件脚本、资源或工程配置。
- 不扩大 T244 的玩法和持久化范围。
- 不处理与路径身份无关的 UI、存档或交互问题。

## 验收标准

- 发布测试新增真实路径断言并通过。
- `npm run game:hulebu:build` 与 verify-only 通过。
- 构建日志无用户脚本 missing class；production 浏览器画面非黑屏，控制台无组件损坏错误。
- 修改仅限任务允许文件，`git diff --check` 通过。
