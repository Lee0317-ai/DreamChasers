# T243：胡了卜 Cocos 正式源码基线与构建溯源门禁

- 优先级：P0
- 负责人：Lee
- 状态：进行中
- 依赖：T242
- 主要文件范围：Cocos `assets/scripts/**` 中当前正式运行时增量、`assets/resources/ui/v6.meta`、`assets/resources/ui/v6/**`、`apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs`、`apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs`、`packages/shared/src/hulebu-cocos-release.test.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、本任务计划/领取/进展/完成与模块交接文档
- 禁止修改范围：Cocos `settings/v2/packages/information.json`、`profiles/**`、`temp/**`、`library/**`、`build/**`，Web 版与 `hulebu-demo`、prototype、数据库、账号、共享山体生成器、非 Cocos 配置测试及其他模块
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run game:hulebu:build`; 干净 worktree 同命令；`git diff --check`

## 背景

T242 建立了 production 构建、产物清单和 HTTP smoke，但随后从干净 worktree 复核发现：清单只记录 `HEAD`，没有验证实际构建输入是否已提交。当前正式 Cocos 运行时和 v6 UI 资源仍有大量必要增量留在工作区，因此 `7f012b...` 不能单独重建当时产物。

同时，Cocos 工程契约测试把被 Git 忽略的本机 `profiles/v2/packages/scene.json` 当成必备源码，导致干净 checkout 在 Creator 构建成功后仍有 1 项伪失败。

## 目标

- 逐文件审查并接纳能从干净 checkout 独立构建的 Cocos 正式运行时、绑定器、配置、工具和 v6 UI 资源。
- 修正工程契约：`profiles/**` 是本机编辑器状态，不是正式源码或干净 checkout 前置条件。
- production 构建前检查正式输入路径；存在已修改、删除或未跟踪输入时立即失败，避免产物清单把脏源码归属于错误提交。
- 清单继续记录提交，并新增可机器读取的源码清洁度证据。
- 在干净 worktree 完成测试、类型检查、真实 Creator 构建、产物校验和 5 条 HTTP smoke。

## 不做

- 不开始 GameSession、RunStateMachine、ContentRepository、SaveService 或 M1 Controller 接线。
- 不顺手修 Web/demo/shared prototype 的既有失败。
- 不提交 Cocos 账号/编辑器本机配置或缓存产物。
- 不改变玩法数值、存档结构、UI 设计或音效内容。

## 验收标准

- 干净 checkout 不依赖 `profiles/**` 即可通过 31 项 Cocos 工程测试。
- 本任务的正式源码集合在干净 worktree 中通过 Cocos TypeScript 和真实 production 构建。
- 任一正式构建输入被修改、删除或新增未跟踪文件时，构建在启动 Creator 前失败并列出路径。
- Web、prototype、数据库、`information.json` 和共享山体生成器的现有工作区改动不进入提交。
- 最终 production 清单对应一个包含全部正式构建输入的可复现提交。
