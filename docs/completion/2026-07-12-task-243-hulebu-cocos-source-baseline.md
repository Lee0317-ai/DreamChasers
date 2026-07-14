# T243 胡了卜 Cocos 正式源码基线与构建溯源门禁完成记录

- 任务编号：T243
- 负责人：Lee
- 开始日期：2026-07-12
- 完成验证日期：2026-07-15
- 分支：`codex/t170-hulebu-endless-mountain`

## 修改文件

- Cocos 正式源码：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`
- Cocos v6 UI：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6/**`
- 发布配置与包装器：`apps/game/mahjong-roguelike/release/hulebu-v1.release.json`、`apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs`、`apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs`
- 回归测试：`packages/shared/src/hulebu-cocos-release.test.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`
- 任务、计划、进展、完成与麻将 Roguelike 模块交接文档

`settings/v2/packages/information.json`、Web Demo、HTML prototype、数据库、账号接口、共享山体生成器和其他现有工作区改动均未进入 T243 提交。

## 实现内容

- 正式 Cocos 运行时、绑定器、本地山体生成器、安全工具和 v6 UI 已进入可从干净 checkout 构建的源码 checkpoint。
- 工程契约不再把 `profiles/**` 本机编辑器状态当作源码前置条件；测试在缺少 Creator temp cache 时会创建并清理最小测试声明入口。
- production 构建会验证全部正式输入为普通 stage-0 文件、索引与精确提交 tree 一致，且工作区没有修改、删除、未跟踪、忽略或特殊索引状态。
- Creator 只读取受保护的精确 `HEAD` worktree 快照；版本和身份同时绑定 realpath、可执行文件 SHA-256、完整 `CocosCreator.app/Contents` SHA-256、bundle id、Info.plist 版本与唯一日志版本行，并在 Creator 前后复核。
- 构建先进入 inode 绑定的唯一 attempt；发布锁、promotion journal、幂等回滚、原子 owner marker、可重试 tombstone 和 stale claim 回收覆盖同步失败及下次启动崩溃恢复。PID 发布失败时会执行有界 `SIGTERM`/`SIGKILL` 并等待真实关闭；无法确认关闭时同时保留 attempt 与源码快照。普通目录替换不承诺跨平台零间隙原子交换。
- schema 6 manifest 绑定源码/config tree、完整 Creator bundle provenance、快照内 Cocos TypeScript、全产物禁用符号扫描、artifact SHA-256 和 5 条 HTTP smoke。

## 验证命令与结果

```bash
npm run test -w packages/shared -- hulebu-cocos-release
```

- 结果：通过，`189/189` 项测试。

```bash
npm run test -w packages/shared -- mahjong-cocos-project
```

- 结果：通过，`32/32` 项测试；干净 worktree 测试后最小 fallback tsconfig 已删除。

```bash
npm run game:hulebu:build
npm run game:hulebu:verify-build
```

- 结果：干净 worktree 真实 Creator 3.8.8 production build 与 verify-only 均通过；Creator 原始退出码 `36` 经 Finished、TypeScript、产物与 smoke 证据归一化。
- 5 条 HTTP smoke 均为 `200`：`/`、`/src/settings.json`、`/src/import-map.json`、`/assets/main/config.json`、`/assets/resources/config.json`。

```bash
git diff --check
```

- 结果：通过。

## 构建证据

- source commit：`f2f69913b8aa749590461bb3a11f815491ec83e3`
- build id：`f2f69913b8aa-20260714T195926Z`
- manifest schema：`6`
- source state：`clean`
- source tree SHA-256：`9e7ac7d231f7dd177b4c6431944e384c6773e0c10ec195f3039e2c6b6e4e9386`
- artifact SHA-256：`a466b2a4aa02c9e5bf110b0701d9a68a62e77d7fdc0efe8ea732bc1e64a3636c`
- file count：`566`
- total bytes：`135263593`
- Creator binary SHA-256：`3a8452496c03e85f2784e64679a1fd203701b0b245125efee02c7923f2bd3464`
- Creator Contents SHA-256：`4541ea999da1939e513e7115b6a1d19e7c3602f717fe08169ca655a6f2330ebe`
- `cocosTypecheckPassed`：`true`

## 评审与遗留问题

- 两轮独立评审覆盖 manifest/provenance 与文件系统锁/promotion/recovery；最终结果为 `0 Critical / 0 Important`。
- 非阻塞测试缺口：尚无完整 `runRelease` 集成测试断言未确认关闭时同时保留 attempt/源码快照，也没有真实操作系统子进程的 `SIGKILL` 测试；保留分支当前会删除临时 Creator 日志，失败现场的 stdout/stderr 可观测性仍可增强。
- 根工作区的本机 `information.json` 仍有用户改动，因此根工作区 production build 会在 Creator 启动前按设计拒绝；正式验证在干净 worktree 完成，没有修改或提交该文件。
- shared package 全量 TypeScript 仍有一个不属于 T243 的既有错误：`packages/shared/src/mahjong-config.test.ts:558` 以 4 个参数调用只接受 1-3 个参数的 API。本任务未修改该测试。
- 当前站点入口仍是旧 Web Demo；T243 不代表整款游戏已经完成或上线。GameSession/流程架构、UI、音效、宿主切换、设备 QA 和上线清单仍需后续任务完成。

## 下一步

T244 恢复 M1：建立 `GameSession`、`RunStateMachine`、命令/快照/事件契约、`ContentRepository`、`SaveService`，以 Coordinator 驱动逐步削薄 `GameSceneController`。之后再进入核心循环冻结、正式 UI/音效、站点宿主切换和上线 QA。
