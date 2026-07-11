# T242 胡了卜 Cocos v1 M0 production build 基线完成记录

- 任务编号：T242
- 负责人：Lee
- 开始日期：2026-07-11
- 完成验证日期：2026-07-12
- 分支：`codex/t170-hulebu-endless-mountain`

## 修改文件

- `apps/game/mahjong-roguelike/release/hulebu-v1.release.json`
- `apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs`
- `apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/README.md`
- `apps/game/mahjong-roguelike/prototypes/config-playable/LEGACY.md`
- `apps/web/public/games/hulebu-demo/LEGACY.md`
- `packages/shared/src/hulebu-cocos-release.test.ts`
- `package.json`
- `docs/superpowers/plans/2026-07-11-hulebu-cocos-v1-m0-production-baseline.md`
- `docs/tasks/items/T242-hulebu-cocos-v1-m0-production-baseline.md`
- `docs/tasks/claims/T242-lee.md`
- `docs/progress/2026-07-11-lee.md`
- `docs/completion/2026-07-11-task-242-hulebu-cocos-v1-m0-production-baseline.md`

`npm run docs:sync` 还会刷新 `TASK_BOARD.md`、`CLAIMS.md` 与 `CURRENT_STATUS.md` 的自动摘要区。三份主文档在 T242 开始前已有其他本地改动，因此本任务只同步工作树视图，不把无关改动混入 T242 的收尾提交。

## 实现内容

- 用版本化 JSON 固定 Cocos Creator `3.8.8`、`web-mobile`、`debug=false`、内容版本、存档 schema、Finished 标记、必需产物和 HTTP smoke 路径。
- 发布库校验缺失/空文件、JSON、HTML 启动标记和路径安全；通过仅绑定 `127.0.0.1` 临时端口的真实 HTTP 服务验包，并原子写入 `hulebu-build.json`。
- production CLI 使用严格参数、`shell: false` Creator 调用、每输出目录独占锁、受限 `web-mobile` 清理、原子日志发布、失败 manifest 清理和构建门禁。
- Creator 原始退出码 `36` 不是无条件成功：只有日志包含精确 Finished 标记、产物零错误且 HTTP smoke 全通过时才归一化；任何其他非零退出码失败。
- verify-only 不启动 Creator，不创建、删除或改写 Creator 日志/manifest，只校验现有产物并执行 HTTP smoke。
- Cocos README 已明确为 v1 唯一正式运行时；两套 HTML 实现仅保留为 prospective Legacy Reference，禁止继续扩展玩法、平衡、模式、存档或 UI。

## 验证命令与结果

```bash
npm run test -w packages/shared -- hulebu-cocos-release mahjong-cocos-project
```

- 结果：通过，`2` 个测试文件、`139/139` 项测试。

```bash
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
```

- 结果：通过，退出码 `0`。

```bash
npm run game:hulebu:build
```

- 结果：包装器退出码 `0`；Creator 原始退出码 `36`，规范化标记为 `true`。
- 5 条 HTTP smoke 均返回 `200`：`/`、`/src/settings.json`、`/src/import-map.json`、`/assets/main/config.json`、`/assets/resources/config.json`。

```bash
npm run game:hulebu:verify-build
```

- 结果：通过；摘要记录 `creatorInvoked=false`、`manifestWritten=false`。
- 前后 manifest SHA-256 均为 `f8522a83cbaf810702dcabb1ed1bafd631bc8b903734a511cf61e101eacb1496`，日志 SHA-256 均为 `8c544943309abea1bb62c2c998257863a18636bc81ea846e8a53e940d881feb7`，两者 mtime 也保持不变。

## 构建证据

- build id：`7f012b5282aa-20260711T173146Z`
- source commit：`7f012b5282aa`
- content version：`0.1.0-m0`
- save schema version：`1`
- creator exit code：`36`
- creator exit normalized：`true`
- file count：`566`
- total bytes：`135266376`
- `du -sh`：`131M`
- 正式产物：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/build/production/web-mobile`

构建目录受 Cocos 项目 `.gitignore` 管理，仅作为本机验证证据，不进入 Git。

## 评审与遗留问题

- Task 1–4 均经过独立复核；最终聚焦回归为 `139/139`。发布路径的已知残余风险主要是同一恶意本机用户可制造的极端文件系统竞态，以及崩溃后需要人工清理的旧锁；不影响当前单用户、不可变 build 目录的 M0 操作模型。
- `git pull origin main` 已按项目规则尝试，但分支分叉且未配置 pull 策略，Git 在 fetch 后停止。本任务没有擅自 merge/rebase，也没有覆盖工作树中的 T239/T240 或其他用户改动。
- 当前 Next.js `/games/hulebu` 仍指向 Web Demo。M0 只建立可信正式产物，未宣称已经切换线上宿主。
- `131M` 是当前基线，包体优化属于后续性能里程碑。

## 下一步

M1 建立 `GameSession`、`RunStateMachine`、命令/快照/事件契约、`ContentRepository`、`SaveService` 和 Coordinator 驱动的 Controller 迁移；之后再依次完成核心循环、UI、音效、站点宿主切换和真实上线 QA。
