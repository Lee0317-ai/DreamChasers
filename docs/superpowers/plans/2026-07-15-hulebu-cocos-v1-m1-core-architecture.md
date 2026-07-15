# 胡了卜 Cocos v1 M1 核心边界与状态机实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不重写现有玩法的前提下，为胡了卜建立唯一的纯 TypeScript 命令路径、显式 run 状态机、内容仓库和版本化存档服务，并删除 `GameSceneController` 中已迁移的规则 fallback。

**Architecture:** 采用 T241 已批准的绞杀式迁移。`GameSession` 组合现有 `HulebuRuntimeState`，不复制吃碰杠胡算法；`GameCoordinator` 是表现层唯一写入口，`RunStateMachine` 约束命令可用 phase；`ContentRepository` 和 `SaveService` 先包住现有硬编码内容与 active-run 本地档，再由后续任务迁移到 resources JSON 和完整 App Flow。

**Tech Stack:** Cocos Creator 3.8.8、TypeScript、Vitest 4、Node.js、现有 production build wrapper。

## Global Constraints

- Cocos 是唯一正式运行时；Web/demo/prototype 不参与本任务。
- 新核心模块不得导入 `cc`、`cc/env`、DOM 或浏览器全局。
- 不复制 `HulebuRuntimeState` 中的规则算法；GameSession 只编排既有唯一 runtime。
- Controller 仍可读取 runtime 生成 scene model，但所有已迁移状态修改必须通过 Coordinator。
- T239 的 `HulebuMountainGenerator.ts` 和 T240 的 Binder/UI 范围禁止修改。
- 不改变关卡、奖励、Boss、事件、成长或工具数值。
- 每个新增 Cocos 目录和 TypeScript 文件必须有已提交 `.meta`。
- 根工作区有大量无关改动；每个提交只暂存本计划 allowlist，并复核 staged diff。

---

### Task 1: GameCommand、GameSnapshot、DomainEvent 与 GameSession

**Files:**
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain.meta`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain/GameContracts.ts`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain/GameContracts.ts.meta`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain/GameSession.ts`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain/GameSession.ts.meta`
- Modify: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- Create: `packages/shared/src/hulebu-cocos-domain.test.ts`

**Interfaces:**
- Consumes: `HulebuRuntimeState`、`HulebuRuntimeSnapshot`、`HulebuRuntimeComboCandidateOption`。
- Produces: `GameCommand`、`GameSnapshot`、`DomainEvent`、`CommandResult`、`GameSession.dispatch()`。

- [ ] **Step 1: 写 GameSession RED 测试**

覆盖以下固定行为：相同 level + 相同命令序列得到完全相同 snapshot/events；非法或被压 tile 返回 `accepted: false` 且 revision 不变；多候选 `combo.execute` 只发 `combo.choice.required`，不改 runtime；`combo.choose` 按 exact candidate ID 才结算；`tool.use: discard` 在次数为 0 时拒绝，否则只要求选择、不扣次数；返回 snapshot 被外部修改后不污染下一次 snapshot；序列化/恢复后 undo history 与恢复前行为一致，旧 snapshot 缺 history 时显式迁移为空 history。

核心测试形状：

```ts
const first = new GameSession(new HulebuRuntimeState(level));
const second = new GameSession(new HulebuRuntimeState(level));
const commands: GameCommand[] = [
  { type: "tile.select", tileId: "tile-a" },
  { type: "tile.select", tileId: "tile-b" },
  { type: "tile.select", tileId: "tile-c" },
  { type: "combo.execute", combo: "peng" },
];

expect(commands.map((command) => first.dispatch(command)))
  .toEqual(commands.map((command) => second.dispatch(command)));
```

- [ ] **Step 2: 运行 RED**

Run: `npm run test -w packages/shared -- hulebu-cocos-domain`

Expected: FAIL because `domain/GameContracts.ts` / `domain/GameSession.ts` do not exist.

- [ ] **Step 3: 实现契约**

`GameContracts.ts` 固定公开形状：

```ts
export type GameCombo = "chi" | "peng" | "gang" | "bugang" | "hu";

export type GameCommand =
  | { type: "tile.select"; tileId: string }
  | { type: "combo.execute"; combo: GameCombo }
  | { type: "combo.choose"; candidateId: string }
  | { type: "tool.use"; tool: "shuffle" | "undo" | "discard" }
  | { type: "slot.discard"; slotIndex: number }
  | { type: "reward.choose"; rewardId: string }
  | { type: "event.choose"; optionId: string }
  | { type: "flow.pause" }
  | { type: "flow.resume" };

export interface GameSnapshot {
  readonly schemaVersion: 1;
  readonly revision: number;
  readonly levelOrder: number;
  readonly status: "playing" | "cleared";
  readonly runtime: HulebuRuntimeSnapshot;
}

export type DomainEvent =
  | { type: "tile.selected"; tileId: string }
  | { type: "combo.choice.required"; combo: GameCombo; candidates: readonly HulebuRuntimeComboCandidateOption[] }
  | { type: "combo.executed"; combo: GameCombo; candidateId: string }
  | { type: "tool.used"; tool: "shuffle" | "undo" }
  | { type: "discard.choice.required" }
  | { type: "slot.discarded"; slotIndex: number }
  | { type: "reward.chosen"; rewardId: string }
  | { type: "event.chosen"; optionId: string }
  | { type: "flow.paused" }
  | { type: "flow.resumed" }
  | { type: "level.cleared" }
  | { type: "command.rejected"; commandType: GameCommand["type"]; reason: string };

export interface CommandResult {
  readonly accepted: boolean;
  readonly changed: boolean;
  readonly snapshot: GameSnapshot;
  readonly events: readonly DomainEvent[];
}
```

- [ ] **Step 4: 实现 GameSession 最小编排**

`GameSession` 持有一个 `HulebuRuntimeState`，按玩法命令调用现有五个 mutation API；只有 mutation 成功才增加 revision。`combo.execute` 的候选数为 0/1/多时分别拒绝、直接执行、要求选择。`tool.use: discard` 通过 runtime capability 校验后只发 `discard.choice.required`，实际修改由 `slot.discard` 完成。`reward.choose`、`event.choose`、`flow.pause`、`flow.resume` 属于 Coordinator/App Flow 命令，GameSession 必须以 `command.rejected` 拒绝且不修改 runtime。每次返回前重新 `exportSnapshot()`，事件不携带时间戳或随机值。

`HulebuRuntimeSnapshot` 同批增加有界 history payload，`pushHistory()` 记录不含嵌套 history 的核心快照，`exportSnapshot()` 返回深拷贝 history，`fromSnapshot()` 恢复它。兼容旧快照时缺失 history 等价于空数组；不采用“恢复后仍显示 undo 次数但实际不可撤回”的隐式降级。

```ts
export class GameSession {
  constructor(private readonly runtime: HulebuRuntimeState, private revision = 0) {}

  dispatch(command: GameCommand): CommandResult {
    // switch command.type; never duplicate combo or scoring rules here
  }

  snapshot(): GameSnapshot {
    return {
      schemaVersion: 1,
      revision: this.revision,
      levelOrder: this.runtime.getLevelOrder(),
      status: this.runtime.isLevelCleared() ? "cleared" : "playing",
      runtime: this.runtime.exportSnapshot(),
    };
  }
}
```

- [ ] **Step 5: 运行 GREEN 与 Cocos typecheck**

Run: `npm run test -w packages/shared -- hulebu-cocos-domain`

Expected: PASS，GameSession 测试全部通过。

Run: `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`

Expected: exit 0。

- [ ] **Step 6: 精确提交**

```bash
git add -- \
  apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain.meta \
  apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain \
  apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts \
  packages/shared/src/hulebu-cocos-domain.test.ts
git commit -m "feat(hulebu): add deterministic game session"
```

### Task 2: RunStateMachine 与 GameCoordinator

**Files:**
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain/RunStateMachine.ts`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain/RunStateMachine.ts.meta`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/application.meta`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/application/GameCoordinator.ts`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/application/GameCoordinator.ts.meta`
- Modify: `packages/shared/src/hulebu-cocos-domain.test.ts`

**Interfaces:**
- Consumes: `GameSession.dispatch(command)` 和 Task 1 的契约。
- Produces: `RunStateMachine.transition()`、`isStable()`、`isPersistable()`、`RunSnapshot`、长生命周期 `GameCoordinator.dispatch()`。

- [ ] **Step 1: 写状态机与 Coordinator RED 测试**

测试合法路径 `encounterIntro -> playing.tileEntering -> playing.idle -> playing.resolving -> playing.comboChoosing/playing.discardChoosing -> playing.resolving -> playing.dangerCheck -> playing.idle/encounterCleared`；拒绝 `rewardChoice -> playing.resolving`；三个 transient phase 不稳定且不可保存；在选择 phase 时不相关 tile/tool 命令被拒绝；一次 combo/清关只产生一次事件。暂停测试必须覆盖从 `playing.idle`、`playing.comboChoosing` 和 `playing.discardChoosing` 分别进入 `paused` 后精确恢复原 phase；无恢复目标的 `flow.resume` 必须拒绝且不触碰 session。再覆盖 Coordinator 跨换关不重建、无 session 的奖励/事件 phase、RunSnapshot context round-trip，以及 event/reward target level 与候选 ID 恢复。

- [ ] **Step 2: 运行 RED**

Run: `npm run test -w packages/shared -- hulebu-cocos-domain`

Expected: FAIL because state machine and coordinator modules do not exist.

- [ ] **Step 3: 实现显式 phase 表**

```ts
export type RunPhase =
  | "encounterIntro"
  | "playing.tileEntering"
  | "playing.idle"
  | "playing.resolving"
  | "playing.comboChoosing"
  | "playing.discardChoosing"
  | "playing.dangerCheck"
  | "encounterCleared"
  | "rewardChoice"
  | "eventChoice"
  | "bossIntro"
  | "settlement"
  | "failed"
  | "paused";

const TRANSITIONS: Readonly<Record<RunPhase, readonly RunPhase[]>> = {
  encounterIntro: ["playing.tileEntering"],
  "playing.tileEntering": ["playing.idle", "failed"],
  "playing.idle": ["playing.resolving", "playing.discardChoosing", "paused", "failed"],
  "playing.resolving": ["playing.idle", "playing.comboChoosing", "playing.dangerCheck", "encounterCleared", "failed"],
  "playing.comboChoosing": ["playing.resolving", "playing.idle", "paused"],
  "playing.discardChoosing": ["playing.resolving", "playing.idle", "paused"],
  "playing.dangerCheck": ["playing.idle", "encounterCleared", "failed"],
  encounterCleared: ["rewardChoice", "eventChoice", "bossIntro", "settlement"],
  rewardChoice: ["encounterIntro", "settlement"],
  eventChoice: ["encounterIntro", "settlement"],
  bossIntro: ["encounterIntro"],
  settlement: ["encounterIntro"],
  failed: ["encounterIntro", "settlement"],
  paused: ["playing.idle", "playing.comboChoosing", "playing.discardChoosing"],
};
```

`StableRunPhase` 排除 `playing.tileEntering`、`playing.resolving`、`playing.dangerCheck`。`PersistableRunPhase` 只包含 `encounterIntro`、`playing.idle`、`playing.comboChoosing`、`playing.discardChoosing`、`encounterCleared`、`rewardChoice`、`eventChoice`、`bossIntro`、`settlement`，明确排除三个 transient phase、`paused` 和 `failed`。`RunStateMachine.pause()` 保存来源 phase，`resume()` 只恢复该来源；公开 `isStable()` 与 `isPersistable()`，不混用两个概念。

- [ ] **Step 4: 实现 Coordinator 同步事务**

Coordinator 生命周期绑定整轮 run，而不是绑定某个 `HulebuRuntimeState`。它持有可替换的 `GameSession | null` 和唯一 `RunStateMachine`，通过 `attachSession()` / `detachSession()` 换关；奖励、事件、清关等无 runtime phase 仍由同一状态机持有。玩法 mutation 前转入 `playing.resolving`，根据 `GameSession` 结果进入下一 phase。非法 phase 或缺 session 时不调用 GameSession。Coordinator 自行处理 `flow.pause` / `flow.resume` 并发出唯一一次对应事件；M1 尚未迁入选择效果时，`reward.choose` / `event.choose` 明确拒绝，不伪造成功。结果固定包含 phase flags 和可恢复 `RunSnapshot`，便于 Controller 只做渲染、消费事件和决定是否保存。

```ts
export interface CoordinatorResult extends CommandResult {
  readonly phase: RunPhase;
  readonly stable: boolean;
  readonly persistable: boolean;
  readonly runSnapshot: RunSnapshot;
}

export class GameCoordinator {
  constructor(
    private readonly run: RunStateMachine = new RunStateMachine("playing.idle"),
    private session: GameSession | null = null,
  ) {}

  attachSession(session: GameSession): void;
  detachSession(): void;
  snapshot(): RunSnapshot;
  dispatch(command: GameCommand): CoordinatorResult {
    // validate phase -> resolving -> session.dispatch -> stable phase
  }
}
```

`RunSnapshot` 包含 schema、phase、可空 GameSnapshot 和只读 phase context。context 至少保存目标关 order、reward candidate IDs、event option IDs 与 pause return phase；Controller 现有 advanced ability/archetype 恢复态通过显式 legacy adapter 映射，不用隐式猜测当前关。Coordinator restore 必须验证 phase/context/session 组合，禁止把无 session 的 playing phase 当有效档。

- [ ] **Step 5: 运行 GREEN、typecheck 与重复事件回归**

Run: `npm run test -w packages/shared -- hulebu-cocos-domain`

Expected: PASS。

Run: `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`

Expected: exit 0。

- [ ] **Step 6: 精确提交**

```bash
git add -- \
  apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/application.meta \
  apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/application \
  apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain/RunStateMachine.ts \
  apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain/RunStateMachine.ts.meta \
  packages/shared/src/hulebu-cocos-domain.test.ts
git commit -m "feat(hulebu): coordinate session run phases"
```

### Task 3: ContentRepository 现有内容适配与校验

**Files:**
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/content.meta`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/content/ContentRepository.ts`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/content/ContentRepository.ts.meta`
- Modify: `packages/shared/src/hulebu-cocos-domain.test.ts`

**Interfaces:**
- Consumes: 注入的 `ContentSource`；legacy source 才委托 `HULEBU_LEVEL_CONFIGS` 与 `createHulebuRuntimeLevelForRun()`。
- Produces: `ContentRepository.getLevelCount()`、`getLevelByIndex()`、`createRuntimeLevel()` 和只读 manifest。

- [ ] **Step 1: 写内容契约 RED 测试**

覆盖有效现有 level pack；空/重复 level id、tile id 与 order；manifest 引用不存在 level；`blockedBy`、initial slot、initial reserve 的悬空/自引用；reward pool 引用未知 reward id；空或不支持的 contentVersion；`saveSchemaVersion` 高于支持版本；越界索引显式失败；返回 manifest/level 被调用者改动后不污染仓库；注入 resolver 确实被调用且不回读全局配置。

- [ ] **Step 2: 运行 RED**

Run: `npm run test -w packages/shared -- hulebu-cocos-domain`

Expected: FAIL because `ContentRepository.ts` does not exist.

- [ ] **Step 3: 实现校验和现有配置适配**

```ts
export interface ContentManifest {
  readonly contentVersion: string;
  readonly saveSchemaVersion: number;
  readonly levelIds: readonly string[];
  readonly rewardIds: readonly string[];
}

export interface ContentSource {
  readonly manifest: ContentManifest;
  readonly levels: readonly HulebuRuntimeLevelConfig[];
  readonly rewardIds: readonly string[];
  resolveRuntimeLevel(index: number, profile: HulebuRunProfile, displayOrder?: number): HulebuRuntimeLevelConfig;
}

export class ContentRepository {
  constructor(
    source: ContentSource,
    supportedSaveSchemaVersion: number,
    supportedContentVersions: readonly string[],
  ) {
    // deep-clone/freeze, validate once, build id/index maps
  }

  getLevelCount(): number;
  getLevelByIndex(index: number): HulebuRuntimeLevelConfig;
  createRuntimeLevel(index: number, profile: HulebuRunProfile, displayOrder?: number): HulebuRuntimeLevelConfig;
}
```

M1 manifest 使用稳定常量 `contentVersion: "cocos-hardcoded-v1"`、`saveSchemaVersion: 1`，levelIds 从当前 `HULEBU_LEVEL_CONFIGS` 派生。legacy source 的 resolver 只委托现有 `createHulebuRuntimeLevelForRun()`，不复制无尽/每日/高阶算法；仓库内部深拷贝并冻结，所有 getter 返回副本。此任务不创建十节点 resources JSON。

- [ ] **Step 4: 运行 GREEN 与 Cocos typecheck**

Run: `npm run test -w packages/shared -- hulebu-cocos-domain`

Expected: PASS。

Run: `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`

Expected: exit 0。

- [ ] **Step 5: 精确提交**

```bash
git add -- \
  apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/content.meta \
  apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/content \
  packages/shared/src/hulebu-cocos-domain.test.ts
git commit -m "feat(hulebu): validate versioned game content"
```

### Task 4: SaveService 原子写入、迁移与 quarantine

**Files:**
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/persistence.meta`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/persistence/SaveService.ts`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/persistence/SaveService.ts.meta`
- Modify: `packages/shared/src/hulebu-cocos-domain.test.ts`

**Interfaces:**
- Consumes: 注入的 codec/validator、`canPersist(value)`、schema/content version、确定性 `now()` 和 `StoragePort`。
- Produces: `SaveService.save()`、`load()`、`clear()` 的判别联合结果。

- [ ] **Step 1: 写 SaveService RED 测试**

用可注入故障的内存 `StoragePort` 覆盖：当前 schema/content round-trip；兼容 `boardRevision` 的 legacy unwrapped v0 迁移到 schema 1；future schema、contentVersion 不兼容和 decoder/active-run 引用校验失败；`playing.resolving`、`paused`、`failed` 保存被拒绝且不写 temp；temp 写入/读回和 primary commit 失败时旧 primary 字节不变；temp cleanup 失败返回 committed-with-warning；坏 JSON/未知 schema/decoder 失败时原始字节进入唯一 quarantine key，逐字节读回确认后才清除 primary；quarantine 写入、确认或 primary remove 任一步失败均保留 primary；成功后不遗留 temp。

- [ ] **Step 2: 运行 RED**

Run: `npm run test -w packages/shared -- hulebu-cocos-domain`

Expected: FAIL because `SaveService.ts` does not exist.

- [ ] **Step 3: 实现存储端口与 envelope**

```ts
export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface SaveEnvelope<T> {
  readonly schemaVersion: number;
  readonly contentVersion: string;
  readonly savedAt: string;
  readonly value: T;
}

export type SaveResult =
  | { readonly status: "committed"; readonly warnings: readonly string[] }
  | { readonly status: "rejected"; readonly reason: string }
  | { readonly status: "error"; readonly stage: "temp-write" | "temp-readback" | "primary-write"; readonly error: unknown };

export type LoadResult<T> =
  | { readonly status: "loaded"; readonly value: T; readonly migrated: boolean }
  | { readonly status: "empty" }
  | { readonly status: "quarantined"; readonly key: string; readonly reason: string }
  | { readonly status: "error"; readonly stage: "read" | "quarantine-write" | "quarantine-verify" | "primary-remove"; readonly error: unknown };

export type ClearResult =
  | { readonly status: "cleared" }
  | { readonly status: "error"; readonly error: unknown };

export class SaveService<T> {
  save(value: T): SaveResult;
  load(): LoadResult<T>;
  clear(): ClearResult;
}
```

`save()` 顺序固定为：从 payload validator 取得并校验 phase/active-run 引用 -> `canPersist(value)` -> 序列化 envelope -> 写 `${key}.tmp` -> 逐字节读回并 decode -> 写 primary -> best-effort 删除 temp。`load()` 支持显式 migration map；无 envelope 只视为 v0，并继续校验现有 `boardRevision` 与 active-run 内的 run profile、正整数 order、runtime tile/slot 引用和 reward/event/ability content ID。失败时先写唯一 `${key}.quarantine.${now()}.${counter}`，逐字节确认后再删 primary。任何隔离失败都保留 primary 并返回明确 stage；不提供无法由端口实现的 quarantine 枚举。所有时间由注入的 `now(): string` 提供，测试不使用真实时钟。

- [ ] **Step 4: 运行 GREEN 与 Cocos typecheck**

Run: `npm run test -w packages/shared -- hulebu-cocos-domain`

Expected: PASS。

Run: `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`

Expected: exit 0。

- [ ] **Step 5: 精确提交**

```bash
git add -- \
  apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/persistence.meta \
  apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/persistence \
  packages/shared/src/hulebu-cocos-domain.test.ts
git commit -m "feat(hulebu): add versioned save service"
```

### Task 5: Controller 最小接线并删除规则 fallback

**Files:**
- Modify: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- Modify: `packages/shared/src/hulebu-cocos-domain.test.ts`
- Modify: `packages/shared/src/mahjong-cocos-project.test.ts`

**Interfaces:**
- Consumes: Tasks 1–4 的 `GameCoordinator`、`ContentRepository`、`SaveService`。
- Produces: 生产输入统一经 Coordinator；active run 统一经 SaveService；Controller 不再含选牌/组合/计分 fallback。

- [ ] **Step 1: 写 Controller 接线 RED 测试**

静态和行为测试必须同时断言：

```ts
expect(controllerText).toContain("new GameCoordinator(");
expect(controllerText).toContain('dispatch({ type: "tile.select"');
expect(controllerText).not.toContain("this.runtimeState.moveTileToSlot(");
expect(controllerText).not.toContain("this.runtimeState.executeComboByKey(");
expect(controllerText).not.toContain("this.runtimeState.discardSlotTile(");
expect(controllerText).not.toContain("this.runtimeState.useShuffleTool(");
expect(controllerText).not.toContain("this.runtimeState.useUndoTool(");
expect(controllerText).not.toContain("private refreshPlayableScene(");
expect(controllerText).not.toContain("private findComboCandidate(");
```

另外锁定：sample scene 没有 runtime 时点击为 no-op；多候选由 `combo.choice.required` 打开原有 overlay；选择候选按 exact candidate ID 后只执行一次；零 discard 次数不能进入选择 phase；level clear 只由唯一 `level.cleared` 事件打开一次 clear overlay；每个 `changed: true` 且回到可持久化 phase 的命令立即保存；刷新后点牌、组合、洗牌、撤回、打牌和 event/reward 目标关精确恢复；SaveService 只接收可持久化 phase；保存失败不更新 `activeRunSnapshot` 且不触发账号 push。

- [ ] **Step 2: 运行 RED**

Run: `npm run test -w packages/shared -- hulebu-cocos-domain mahjong-cocos-project`

Expected: FAIL on direct runtime mutations and fallback methods still present.

- [ ] **Step 3: 增加长生命周期 Coordinator 与 session attach/detach helper**

```ts
private attachRuntimeState(runtimeState: HulebuRuntimeState): void {
  this.runtimeState = runtimeState;
  this.gameCoordinator.attachSession(new GameSession(runtimeState));
}

private detachRuntimeState(): void {
  this.gameCoordinator.detachSession();
  this.runtimeState = null;
}
```

`gameCoordinator` 在整轮 run 创建时初始化一次。所有创建、恢复和清空 runtime 的位置必须成对维护 session；换关不重建状态机。现有 `currentPhase` / `discardSelecting` 只能变成 Coordinator phase 的只读映射或被删除，不能继续作为第二状态源。

- [ ] **Step 4: 把五类 mutation 改为 Coordinator 命令**

改造 `handleTileClick`、`handleComboClick`、`executeComboCandidateOption`、`handleSlotClick`、`startDiscardSelection`、`useShuffleTool`、`useUndoTool`。新增唯一 `applyCoordinatorResult(result)`：只绑定 snapshot、按事件打开/关闭原有 overlay、渲染，并在 `changed && persistable` 时保存。`refreshRuntimeScene()` 退化为纯渲染，不再判定清关或改 phase；Controller 不自行判断牌型、丢弃 exact candidate key、选 index 或加分。

- [ ] **Step 5: 删除旧 fallback 数据和 helper**

删除 `selectedSlots`、旧 `score`、`refreshPlayableScene()`、`createSlotModels()`、`createComboControls()`、`findComboCandidate()`、`findHuCandidate()`、`canHuLabels()`、`canMakeMeldLabels()`、`removeSelectedSlots()`、`getSlotStatusText()`、旧 `getComboScore()` 及只被它们使用的常量/类型。删除后用 `rg` 确认无引用，不保留死代码。

- [ ] **Step 6: 接入 ContentRepository 与 SaveService**

Controller 的 start/resume 用 ContentRepository 获取/创建 level；active-run 的本地 `setItem/getItem/removeItem` 全部改走一个 SaveService 实例。`load()` 的 empty、loaded、quarantined、error 分别处理，不能把存储故障当作“没有存档”。只有 `save()` 返回 committed 后才更新 `activeRunSnapshot` 并排队账号 push；账号 pull 后也先经 SaveService 成功提交再应用到内存，禁止再次直接写 active-run key。clear 失败同样显式保留内存态。其他 profile/achievement 存档留在后续任务，不扩大范围。

现有 local legacy 档和账号 `cocosSnapshot` 必须进入同一个 decoder/migration/validation gate。普通 encounter clear 与整轮 settlement 各自只提交一次；重复 dispatch、reload 或账号 hydrate 不重复发奖励、写成就或清档。

- [ ] **Step 7: 运行聚焦验证**

Run: `npm run test -w packages/shared -- hulebu-cocos-domain mahjong-cocos-project`

Expected: 两个测试文件全部通过。

Run: `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`

Expected: exit 0。

Run: `git diff --check`

Expected: no output。

- [ ] **Step 8: 精确提交 Controller 接线**

```bash
git add -- \
  apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts \
  packages/shared/src/hulebu-cocos-domain.test.ts \
  packages/shared/src/mahjong-cocos-project.test.ts
git commit -m "refactor(hulebu): route gameplay through coordinator"
```

### Task 6: 干净构建、独立评审与任务收口

**Files:**
- Modify: `docs/tasks/items/T244-hulebu-cocos-v1-m1-core-architecture.md`
- Modify: `docs/tasks/claims/T244-lee.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/DECISIONS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify/Create: `docs/progress/2026-07-15-lee.md`
- Create: `docs/completion/2026-07-15-task-244-hulebu-cocos-v1-m1-core-architecture.md`

- [ ] **Step 1: 在干净 worktree 重跑聚焦测试和 TypeScript**

Run: `npm run test -w packages/shared -- hulebu-cocos-domain mahjong-cocos-project`

Expected: PASS。

Run: `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`

Expected: exit 0。

- [ ] **Step 2: 运行真实 production build 与 verify-only**

Run: `npm run game:hulebu:build`

Expected: exact clean source snapshot、Creator 3.8.8、Cocos TypeScript、artifact scan、manifest 和 5 条 HTTP smoke 全部通过。

Run: `npm run game:hulebu:verify-build`

Expected: 不调用 Creator、不重写 manifest，现有正式包验证通过。

- [ ] **Step 3: 正式包交互 smoke**

使用 Step 2 的 production 包检查首关真实点击入槽、组合、刷新恢复、多候选 exact choice 与一次清关。

Expected: 交互路径可完成且控制台无未处理异常；字符串扫描只作为单路径负向门禁，不代替行为测试。

- [ ] **Step 4: 双独立评审**

一轮检查规则/phase/事件确定性，一轮检查 SaveService/ContentRepository 失败语义与 Controller 单路径。退出门槛为 0 Critical、0 Important；发现问题先修复并重跑受影响验证。

- [ ] **Step 5: 更新分片并同步摘要**

记录实际测试数、最终构建 id、source/artifact hash、已删除 fallback 和非阻塞遗留；运行 `npm run docs:sync`，但不暂存主摘要中的无关历史改动。

- [ ] **Step 6: 精确提交收口文档**

```bash
git add -- \
  docs/tasks/items/T244-hulebu-cocos-v1-m1-core-architecture.md \
  docs/tasks/claims/T244-lee.md \
  docs/superpowers/plans/2026-07-15-hulebu-cocos-v1-m1-core-architecture.md \
  docs/progress/2026-07-15-lee.md \
  docs/completion/2026-07-15-task-244-hulebu-cocos-v1-m1-core-architecture.md
git commit -m "docs(hulebu): close T244 core architecture"
```

## Plan Self-Review

- Spec coverage: 本计划覆盖 M1 的命令/快照/事件、GameSession、RunStateMachine、Coordinator、ContentRepository、SaveService、稳定 phase 恢复边界和至少一条 fallback 删除；Boot/Title/App Flow Scene 属于 M2，不在此任务。
- Scope: 未纳入 UI、音频、十节点内容、账号云同步、Web 宿主或数值调整。
- Type consistency: `GameCommand`、`GameSnapshot`、`DomainEvent`、`RunPhase`、`CoordinatorResult` 在前置任务定义，后续只消费同名接口；`ContentSource` 是仓库唯一数据源。
- Failure semantics: 内容构造时失败；命令非法时不触碰 session；状态机稳定与可持久化分别判断；存档结果区分 empty/quarantined/error/committed-warning；写失败保留旧 primary；坏档先逐字节确认 quarantine 后才删除 primary。
- Placeholder scan: 实现步骤均有具体文件、接口、命令和预期结果；没有未决占位项。
