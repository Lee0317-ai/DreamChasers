# 胡了卜 Cocos 正式源码基线与构建溯源门禁实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans task-by-task. Follow the exact staging allowlist because the root worktree contains unrelated user changes.

**Goal:** 把当前真实可玩的 Cocos 运行时与 v6 UI 资源变成可从干净 checkout 复现的正式源码，并让 production 构建拒绝未提交的正式输入。

**Architecture:** 保持 T242 的单一 Creator CLI 构建入口。源码 checkpoint 只接纳经干净快照证明必要的 Cocos `assets` 增量；发布包装器在启动 Creator 前用 Git porcelain 状态检查一组显式正式输入根，并在 manifest 写入 `sourceState: "clean"` 与输入根。编辑器本机状态、缓存和其他产品目录不进入检查范围。

**Tech Stack:** Cocos Creator 3.8.8、TypeScript、Node.js CommonJS、Vitest 4、Git worktree、静态 HTTP smoke。

## Global Constraints

- 根工作区包含大量无关改动；所有提交必须使用精确路径暂存并复核 staged diff。
- 正式源码 checkpoint 允许接纳当前已有的 Cocos 运行时增量，但必须先在干净 worktree 证明不依赖未纳入文件。
- `settings/v2/packages/information.json` 含本机编辑器/账号性质的状态，且干净默认值已经能构建，禁止提交与禁止作为正式输入。
- `profiles/**`、`temp/**`、`library/**`、`build/**` 不是源码。
- 不处理 Web/demo/shared prototype 的既有测试失败。

---

### Task 1: Freeze Scope and Fix the Clean-checkout Contract

**Files:**
- Modify: `packages/shared/src/mahjong-cocos-project.test.ts`
- Create: `docs/tasks/items/T243-hulebu-cocos-source-baseline.md`
- Modify: `docs/tasks/claims/T243-lee.md`

- [ ] 保留干净 worktree 中“Creator 构建成功、工程测试仅因 `profiles/v2/packages/scene.json` 缺失而失败”的 RED 证据。
- [ ] 删除对该本机文件存在性的断言，改为锁定项目 `.gitignore` 与 README 对 `profiles/**` 的本机状态定义。
- [ ] 在根工作区与干净 worktree 运行 `npm run test -w packages/shared -- mahjong-cocos-project`，期望 31/31。
- [ ] 运行 Cocos TypeScript 检查，期望退出码 0。

### Task 2: Audit and Checkpoint the Formal Cocos Source

**Files:**
- Modify: current tracked Cocos `assets/scripts/**` runtime increment
- Create: `assets/scripts/MeldRiverLayerBinder.ts` and `.meta`
- Create: `assets/scripts/config/HulebuMountainGenerator.ts` and `.meta`
- Create: `assets/scripts/utils.meta`, `assets/scripts/utils/HulebuSpriteSafety.ts` and `.meta`
- Create: `assets/resources/ui/v6.meta` and `assets/resources/ui/v6/**`
- Modify: `packages/shared/src/mahjong-cocos-project.test.ts`

- [ ] 列出精确候选文件，确认不存在缓存、构建产物、秘密、绝对本机路径、超大异常文件或缺失 `.meta`。
- [ ] 把候选文件同步到从当前 HEAD 创建的临时 worktree；不复制 `information.json`、Web/demo 或共享山体生成器。
- [ ] 在临时 worktree 运行工程测试、TypeScript、`npm run game:hulebu:build`；要求真实 Creator 结束标记、产物校验和 5 条 HTTP smoke 全部通过。
- [ ] 精确暂存并检查 `git diff --cached --stat`、`git diff --cached --check` 和路径 allowlist。
- [ ] 提交源码 checkpoint：`feat(hulebu): checkpoint production Cocos source`。

### Task 3: Reject Dirty Formal Build Inputs

**Files:**
- Modify: `apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs`
- Modify: `apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs`
- Modify: `packages/shared/src/hulebu-cocos-release.test.ts`

- [ ] 先写失败测试：已修改、删除和未跟踪的正式输入都必须在调用 Creator 前被拒绝；无关 Web 文件与 `information.json` 不应阻断 Cocos build；verify-only 保持只读。
- [ ] 实现显式输入根、Git porcelain 解析和稳定错误信息；不执行自动清理或自动暂存。
- [ ] manifest schema 新增 `sourceState: "clean"` 与规范化 `sourceInputs`，校验器必须拒绝缺失或非 clean 值。
- [ ] 运行 focused test；用临时受控仓库验证真实 Git 状态路径；运行 `git diff --check`。
- [ ] 提交构建门禁：`fix(hulebu): bind production build to clean sources`。

### Task 4: End-to-end Verification and Closure

**Files:**
- Modify: T243 task/claim
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify/Create: `docs/progress/2026-07-12-lee.md`
- Create: `docs/completion/2026-07-12-task-243-hulebu-cocos-source-baseline.md`

- [ ] 在包含 checkpoint 与门禁提交的干净 worktree 运行 31 项工程测试、Cocos TypeScript、真实 production build 和 verify-only。
- [ ] 启动本地静态 HTTP 并复核 5 个 smoke path 均为 200；核对 manifest 提交、`sourceState`、文件数和字节数。
- [ ] 在根工作区确认只有允许路径进入 T243 提交，无关工作区改动仍存在且未被覆盖。
- [ ] 独立代码评审要求 0 Critical、0 Important；发现问题先修复并重跑相应验证。
- [ ] 更新任务/领取/模块/进展/完成分片，运行 `npm run docs:sync`，但不把主摘要文件中的无关历史改动混入提交。
- [ ] 删除临时 worktree；记录 T244 恢复 GameSession 组合命令边界。

## Plan Self-Review

- 修复的是 T242 产物可追溯性的真实缺口，不扩展玩法范围。
- checkpoint 与门禁分两次提交，便于审计既有源码和新发布逻辑。
- 干净 worktree 是最终事实来源；根工作区构建只作兼容复核。
- 路径 allowlist 明确排除了当前所有已知无关改动。
