# T243：胡了卜 Cocos 正式源码基线与构建溯源门禁

- 优先级：P0
- 负责人：Lee
- 状态：已完成
- 依赖：T242
- 主要文件范围：Cocos `assets/scripts/**` 中当前正式运行时增量、`assets/resources/ui/v6.meta`、`assets/resources/ui/v6/**`、`apps/game/mahjong-roguelike/release/hulebu-v1.release.json`、`apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs`、`apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs`、`packages/shared/src/hulebu-cocos-release.test.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、本任务计划/领取/进展/完成与模块交接文档
- 禁止修改范围：Cocos `settings/v2/packages/information.json`、`profiles/**`、`temp/**`、`library/**`、`build/**`，Web 版与 `hulebu-demo`、prototype、数据库、账号、共享山体生成器、非 Cocos 配置测试及其他模块
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; 根工作区可运行 `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run game:hulebu:build` 会在精确 Creator 快照中内建运行同等 Cocos TypeScript 检查；干净 worktree 再运行 build、verify-only 与 `git diff --check`

## 背景

T242 建立了 production 构建、产物清单和 HTTP smoke，但随后从干净 worktree 复核发现：清单只记录 `HEAD`，没有验证实际构建输入是否已提交。当前正式 Cocos 运行时和 v6 UI 资源仍有大量必要增量留在工作区，因此 `7f012b...` 不能单独重建当时产物。

同时，Cocos 工程契约测试把被 Git 忽略的本机 `profiles/v2/packages/scene.json` 当成必备源码，导致干净 checkout 在 Creator 构建成功后仍有 1 项伪失败。

## 目标

- 逐文件审查并接纳能从干净 checkout 独立构建的 Cocos 正式运行时、绑定器、配置、工具和 v6 UI 资源。
- 修正工程契约：`profiles/**` 是本机编辑器状态，不是正式源码或干净 checkout 前置条件。
- production 构建前后检查正式输入路径；存在已修改、删除或未跟踪输入时立即失败，避免产物清单把脏源码归属于错误提交。`information.json` 虽禁止直接纳入本任务提交，但因 Creator 可能读取，仍属于必须保持 clean 的受控输入。
- 清单继续记录提交，并新增可机器读取的源码清洁度证据。
- production 产物必须通过禁用调试符号扫描；Creator 必须同时通过 realpath、二进制 SHA-256、bundle id、Info.plist 版本和唯一进程日志版本行校验。
- Creator 必须读取精确 `HEAD` 快照；构建先进入唯一 attempt，全部门禁通过后再 promote。同步异常回滚到上一份有效包；进程崩溃由持久 journal 在下次拿锁后恢复。跨平台固定普通目录不承诺零间隙交换。
- production manifest 必须记录 `cocosTypecheckPassed: true`；该检查在 Creator 已为精确提交快照生成真实 `cc` declarations 后执行，不依赖调用 worktree 的 `temp/**` 缓存。
- 在干净 worktree 完成测试、类型检查、真实 Creator 构建、产物校验和 5 条 HTTP smoke。

## 不做

- 不开始 GameSession、RunStateMachine、ContentRepository、SaveService 或 M1 Controller 接线。
- 不顺手修 Web/demo/shared prototype 的既有失败。
- 不提交 Cocos 账号/编辑器本机配置或缓存产物。
- 不改变玩法数值、存档结构、UI 设计或音效内容。

## 验收标准

- 干净 checkout 不依赖 `profiles/**` 即可通过 32 项 Cocos 工程测试。
- 本任务的正式源码集合在干净 worktree 中通过 Cocos TypeScript 和真实 production 构建。
- 任一正式构建输入被修改、删除或新增未跟踪文件时，构建在启动 Creator 前失败并列出路径；构建期间发生变化也必须在写 manifest 前失败。
- Web、prototype、数据库、`information.json` 和共享山体生成器的现有工作区改动不进入提交。
- 最终 production 清单对应一个包含全部正式构建输入的可复现提交。

## 完成摘要

- 已用 `64824e47` 收口正式 Cocos 运行时、绑定器、工程内山体生成器、安全工具和 v6 UI 资源；干净 checkout 不再依赖 `profiles/**`。
- 已用 `569ef4d9` 与 `03455a1c` 建立正式输入清洁门禁、精确提交源码快照、全产物禁用符号扫描、隔离 attempt、持久 promotion journal 和 schema 5 基线；`2297f5d8`、`0725f31d`、`f2f69913` 继续补齐 snapshot 防写/复核、完整 Creator bundle provenance、原子 PID 状态、孤儿 attempt/tombstone 恢复和 post-commit 所有权失败语义，manifest 升为 schema 6。
- 干净 worktree 通过发布测试 `189/189`、Cocos 工程测试 `32/32`、Creator 快照内 TypeScript、真实 Creator 3.8.8 production build、verify-only 和 5 条 HTTP smoke；manifest 记录 `566` 个文件、`135263593` 字节。
- 最终构建证据绑定源码提交 `f2f69913b8aa749590461bb3a11f815491ec83e3`，该提交包含全部正式构建输入。GameSession、玩法架构迁移、UI/音效与站点上线继续由 T244 及后续里程碑承接。
