# Hulebu Cocos v1 M2 Three-Node Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an 8-12 minute portrait-only Cocos Creator 3.8.8 production vertical slice that runs `Boot -> Title -> Game -> Result`, teaches peng and exact chi choice, applies one exact reward, restores from one post-reward checkpoint, and ends with a gang-gated mini Boss.

**Architecture:** Preserve M1's pure TypeScript `GameSession`, `RunStateMachine`, `GameCoordinator`, `ContentRepository`, and `SaveService` boundaries. Add a pure application flow and run service above them, keep every gameplay mutation inside `GameCoordinator.dispatch(...)`/`GameSession.dispatch(...)`, and make four Cocos scenes thin adapters over versioned snapshots, semantic input, prefab view models, storage ports, and audio ports. Replace the current monolithic runtime page construction with serialized scenes/prefabs; retain exact-commit production build attestation.

**Tech Stack:** TypeScript 6, Cocos Creator 3.8.8, Vitest 4, Rolldown test bundling, Cocos Web Mobile production build, Kimi WebBridge or the Codex in-app browser for real `390x844` canvas playtesting.

## Global Constraints

- Upstream product contract: `docs/superpowers/specs/2026-07-30-hulebu-cocos-v1-m2-three-node-vertical-slice-design.md`.
- Formal runtime root: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/`.
- Production viewport is only `390x844` portrait. Do not add landscape layout, landscape prompts, WeChat SDK code, login, sharing, ads, or publication configuration.
- M2 content version is `0.2.0-m2`; the M2 save envelope schema is `2`. M1 `0.1.0-m0` active-run bytes are incompatible test data and must be quarantined without damaging settings.
- The three content IDs are fixed: `m2_tutorial_peng`, `m2_tutorial_chi_choice`, and `m2_mini_boss_gatekeeper`.
- The three seeds are fixed: `hulebu-m2-peng-v1`, `hulebu-m2-chi-choice-v1`, and `hulebu-m2-gatekeeper-v1`.
- The exact reward IDs are fixed: `m2_protection_plus_1`, `m2_shuffle_plus_1`, and `m2_undo_plus_1`.
- Do not let a Cocos scene, prefab component, presenter, or audio component import `HulebuRuntimeState` to mutate it, call `sys.localStorage` for run data, calculate a combo, apply a reward, or decide clear/failure.
- `GameSceneController.ts` is currently 3,781 lines. Replace it with a thin M2 adapter; do not append M2 features to the current implementation. Git history is the archive for removed legacy page-flow code.
- Create `.scene`, `.prefab`, and their `.meta` files in Cocos Creator 3.8.8. Do not hand-author complex serialized Cocos JSON.
- Every implementation batch is a separate project task. Before editing a batch, run `git pull origin main`, read the mandatory project documents, allocate the number currently shown in `docs/tasks/NEXT_ID.md`, create one task item and one claim owned by `Lee`, declare exact allow/deny lists and verification commands, then run `npm run docs:sync`.
- Do not pre-claim files for later batches. Stop a batch after its reviewable commit and documentation updates.
- Use `superpowers:test-driven-development` for each behavior change and `superpowers:verification-before-completion` before claiming a batch complete.
- Production builds require a clean exact commit. Unit/type/project tests run before the commit; `npm run game:hulebu:build` and `npm run game:hulebu:verify-build` run after the commit.

## Baseline And Preflight Gate

Current reusable boundaries:

- `GameContracts.ts:8-17` contains versioned semantic commands.
- `RunStateMachine.ts:3-17` contains gameplay phases; `RunStateMachine.ts:151-186` owns legal transitions and persistability.
- `GameCoordinator.ts:153-184` is the current command write entry; M1 deliberately rejects reward/event effects at `GameCoordinator.ts:160-168`.
- `ContentRepository.ts:9-25` defines the current manifest/source contract and `ContentRepository.ts:90-206` validates content references.
- `SaveService.ts:1-24` defines storage/codec options; `SaveService.ts:53-156` provides atomic save/load/clear semantics.
- `GameSceneController.ts:540-574` currently bootstraps directly into gameplay; `GameSceneController.ts:628-648` applies rewards/events outside the Coordinator; `GameSceneController.ts:2515-2580` constructs full overlays at runtime. These are the three M2 replacement seams.
- `settings/v2/packages/project.json` already pins `390x844`.
- `assets/scenes/HulebuGameScene.scene` is the only tracked scene and no prefab exists.
- The release wrapper attests the entire formal `assets/` tree but currently does not pin a four-scene build list.

- [ ] Before Batch 1, close T244's remaining portrait production acceptance: execute a peng, open and resolve an exact multi-candidate choice, and clear the current production level at `390x844`.
- [ ] Record the T244 evidence and require `0 Critical / 0 Important` for the M1 boundary. If this fails, fix and finish T244 in its own task before starting M2.
- [ ] Confirm the implementation worktree is clean and based on the latest `main` after the T244 integration point.

---

## Batch 1: Versioned App Flow, Settings, And Four Tracked Scenes

**Project-task boundary:** one task covering only app flow contracts, settings, the shared SettingsPanel shell, scene navigation, Boot/Title/Result scenes, formal scene build selection, focused tests, and related documentation. Do not create gameplay prefabs, M2 content, checkpoint code, or audio assets in this batch.

### Task 1: Register The Batch And Lock The RED Test Surface

**Files:**

- Create: `packages/shared/src/hulebu-cocos-m2-app-flow.test.ts`
- Modify: `packages/shared/src/mahjong-cocos-project.test.ts:78-145`
- Create: the allocated task/claim/progress documentation required by `AGENTS.md`

- [ ] Allocate and claim the current `NEXT_ID.md` value with owner `Lee`; include only Batch 1 paths in the allowlist.
- [ ] Add a Rolldown helper in `hulebu-cocos-m2-app-flow.test.ts` using the existing pattern from `hulebu-cocos-domain.test.ts:37-89` so pure Cocos-side TypeScript can execute without importing `cc`.
- [ ] Write failing tests for these exact behaviors:

```ts
expect(new AppFlowController().snapshot()).toMatchObject({
  route: "boot",
  status: "initializing",
  pendingConfirmation: null,
});

expect(flow.dispatch({
  type: "boot.succeeded",
  availability: { activeRun: "none", checkpoint: "none" },
}).transition?.route).toBe("title");

expect(flow.dispatch({ type: "title.start" }).transition).toMatchObject({
  route: "game",
  payload: { kind: "new-run" },
});

expect(flow.dispatch({ type: "title.continue" }).accepted).toBe(false);
expect(flow.dispatch({ type: "game.finished", summary: clearSummary }).transition?.route).toBe("result");
expect(flow.dispatch({ type: "result.replay" }).transition?.payload).toEqual({ kind: "new-run" });
```

- [ ] Cover illegal/repeated transitions, Boot retry, active-run continue, checkpoint continue, overwrite confirmation, failed summary retry, replay, and return-to-title.
- [ ] Extend the project test with failing assertions that four scene files exist, Boot is the formal start scene, and scene selection is derived from tracked release configuration rather than a local `profiles/**` file.
- [ ] Run `npm run test -w packages/shared -- hulebu-cocos-m2-app-flow mahjong-cocos-project`.

Expected: FAIL because `AppFlowController`, the three new scenes, and tracked scene-build configuration do not exist.

- [ ] Commit only the RED tests and task registration:

```bash
git add packages/shared/src/hulebu-cocos-m2-app-flow.test.ts packages/shared/src/mahjong-cocos-project.test.ts docs
git commit -m "test(hulebu): define M2 app flow contract"
```

### Task 2: Implement The Pure App Flow

**Files:**

- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/application/AppFlowContracts.ts`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/application/AppFlowController.ts`
- Create: matching `.meta` files through Creator import
- Test: `packages/shared/src/hulebu-cocos-m2-app-flow.test.ts`

- [ ] Define these contracts without importing `cc`, storage, runtime, or scene objects:

```ts
export type AppRoute = "boot" | "title" | "game" | "result";
export type ResumeKind = "none" | "active-run" | "checkpoint";
export type RunOutcome = "clear" | "failed";

export interface ResumeAvailability {
  readonly activeRun: "none" | "valid" | "quarantined";
  readonly checkpoint: "none" | "valid" | "quarantined";
}

export interface M2RunSummary {
  readonly schemaVersion: 1;
  readonly runId: string;
  readonly outcome: RunOutcome;
  readonly totalScore: number;
  readonly elapsedMs: number;
  readonly combos: Readonly<Record<"chi" | "peng" | "gang" | "hu", number>>;
  readonly toolsUsed: Readonly<Record<"shuffle" | "undo" | "discard", number>>;
  readonly retryCount: number;
  readonly selectedRewardId: string | null;
  readonly failureReason: string | null;
  readonly recentActions: readonly string[];
}

export type SceneTransitionPayload =
  | { readonly kind: "title" }
  | { readonly kind: "new-run" }
  | { readonly kind: "resume"; readonly source: Exclude<ResumeKind, "none"> }
  | { readonly kind: "result"; readonly summary: M2RunSummary };

export interface SceneTransition {
  readonly route: AppRoute;
  readonly payload: SceneTransitionPayload;
}

export type AppFlowStatus = "initializing" | "ready" | "blocked";

export interface AppFlowSnapshot {
  readonly route: AppRoute;
  readonly status: AppFlowStatus;
  readonly availability: ResumeAvailability;
  readonly pendingConfirmation: "overwrite-run" | null;
  readonly error: { readonly code: string; readonly retryable: boolean } | null;
  readonly summary: M2RunSummary | null;
}

export interface AppFlowResult {
  readonly accepted: boolean;
  readonly snapshot: AppFlowSnapshot;
  readonly transition: SceneTransition | null;
  readonly reason: string | null;
}
```

- [ ] Define `AppFlowCommand` as the exact union below:

```ts
export type AppFlowCommand =
  | { type: "boot.succeeded"; availability: ResumeAvailability }
  | { type: "boot.failed"; code: string; retryable: boolean }
  | { type: "boot.retry" }
  | { type: "title.start" }
  | { type: "title.continue" }
  | { type: "title.requestOverwrite" }
  | { type: "title.confirmOverwrite" }
  | { type: "title.cancelOverwrite" }
  | { type: "game.finished"; summary: M2RunSummary }
  | { type: "result.retryCheckpoint" }
  | { type: "result.restart" }
  | { type: "result.replay" }
  | { type: "result.returnTitle" };
```

- [ ] Implement `AppFlowController.dispatch(command): AppFlowResult` as a table-driven state machine. A rejected command returns the same immutable snapshot and no transition. An accepted command returns one transition at most; repeating the command after the route changes is rejected.
- [ ] Keep overwrite confirmation in `AppFlowSnapshot.pendingConfirmation`, not in Title node visibility. `title.continue` chooses `active-run` before `checkpoint`.
- [ ] Run `npm run test -w packages/shared -- hulebu-cocos-m2-app-flow`.

Expected: PASS for pure app-flow tests.

- [ ] Commit:

```bash
git add apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/application packages/shared/src/hulebu-cocos-m2-app-flow.test.ts
git commit -m "feat(hulebu): add versioned M2 app flow"
```

### Task 3: Implement Independent Settings Storage

**Files:**

- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/settings/SettingsContracts.ts`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/settings/SettingsService.ts`
- Create: matching directory/file `.meta` files
- Test: `packages/shared/src/hulebu-cocos-m2-app-flow.test.ts`

- [ ] Add failing tests for default load, round-trip, `0-100` clamping, non-finite rejection, malformed-byte quarantine, and `reducedMotion` persistence. Assert the settings key is `hulebu-cocos-settings-v1` and differs from active/checkpoint keys.
- [ ] Run the focused test and confirm it fails on missing settings modules.
- [ ] Implement these exact contracts:

```ts
export interface HulebuSettings {
  readonly schemaVersion: 1;
  readonly master: number;
  readonly music: number;
  readonly sfx: number;
  readonly reducedMotion: boolean;
}

export const DEFAULT_HULEBU_SETTINGS: HulebuSettings = {
  schemaVersion: 1,
  master: 80,
  music: 70,
  sfx: 80,
  reducedMotion: false,
};

export type SettingsLoadResult =
  | { status: "loaded"; value: HulebuSettings }
  | { status: "defaulted"; value: HulebuSettings; quarantined: boolean };
```

- [ ] Inject the existing `StoragePort`; do not import `sys`. Normalize finite volumes with `Math.round(Math.min(100, Math.max(0, value)))`. On invalid bytes, copy the original bytes to `hulebu-cocos-settings-v1.quarantine`, remove only the bad settings primary, and return defaults.
- [ ] Run `npm run test -w packages/shared -- hulebu-cocos-m2-app-flow`.

Expected: PASS including settings corruption recovery.

- [ ] Commit:

```bash
git add apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/settings packages/shared/src/hulebu-cocos-m2-app-flow.test.ts
git commit -m "feat(hulebu): persist M2 settings independently"
```

### Task 4: Pin The Four Scenes In The Exact-Commit Build

**Files:**

- Modify: `apps/game/mahjong-roguelike/release/hulebu-v1.release.json`
- Modify: `apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs`
- Modify: `apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs`
- Test: `packages/shared/src/hulebu-cocos-release.test.ts:552-625,2168-2257`

- [ ] Add failing release tests for this tracked configuration:

```json
"sceneBuild": {
  "startSceneUrl": "db://assets/scenes/HulebuBootScene.scene",
  "sceneUrls": [
    "db://assets/scenes/HulebuBootScene.scene",
    "db://assets/scenes/HulebuTitleScene.scene",
    "db://assets/scenes/HulebuGameScene.scene",
    "db://assets/scenes/HulebuResultScene.scene"
  ]
}
```

- [ ] Assert `startSceneUrl` is the first unique item, every URL is under `db://assets/scenes/`, every `.scene` and `.scene.meta` exists, and every meta UUID is a non-empty unique string.
- [ ] Confirm the focused release test fails because schema 4 does not recognize `sceneBuild`.
- [ ] Extend release config validation and add `resolveSceneBuildOptions(projectRoot, sceneBuild)` that returns Cocos `IBuildSceneItem`-shaped records `{ url, uuid }` by reading the exact snapshot's `.scene.meta` files.
- [ ] Add `writeEphemeralBuilderProfile(projectRoot, buildOptions)` that materializes the resolved `scenes` and Boot `startScene` under the ignored snapshot-local `profiles/v2/packages/builder.json` immediately before Creator runs. Do not read a developer's root-worktree profile and do not add `profiles/**` to formal source inputs.
- [ ] Preserve the current source-attestation order: resolve from the exact snapshot, write only ignored profile state, run Creator, and re-attest all formal source inputs before promotion.
- [ ] Run `npm run test -w packages/shared -- hulebu-cocos-release`.

Expected: PASS with scene-list validation and exact Creator argv tests still green.

- [ ] Commit:

```bash
git add apps/game/mahjong-roguelike/release/hulebu-v1.release.json apps/game/mahjong-roguelike/scripts packages/shared/src/hulebu-cocos-release.test.ts
git commit -m "build(hulebu): pin M2 scene selection"
```

### Task 5: Create Boot, Title, And Result Scene Adapters

**Files:**

- Create: `assets/scripts/bootstrap/HulebuAppRuntime.ts`
- Create: `assets/scripts/navigation/CocosSceneNavigator.ts`
- Create: `assets/scripts/scenes/BootSceneController.ts`
- Create: `assets/scripts/scenes/TitleSceneController.ts`
- Create: `assets/scripts/scenes/ResultSceneController.ts`
- Create: `assets/scripts/diagnostics/ProductionErrorReporter.ts`
- Create: `assets/scripts/presentation/components/SettingsPanelView.ts`
- Create: all matching directory/file `.meta` files
- Create: `assets/prefabs/modal/SettingsPanel.prefab` and `.meta`
- Create: `assets/scenes/HulebuBootScene.scene` and `.meta`
- Create: `assets/scenes/HulebuTitleScene.scene` and `.meta`
- Create: `assets/scenes/HulebuResultScene.scene` and `.meta`
- Modify: `assets/scenes/HulebuGameScene.scene` only if its root name/reference must be normalized
- Modify: `assets/scenes/README.md`
- Test: `packages/shared/src/mahjong-cocos-project.test.ts`

- [ ] In Cocos Creator, create the scenes with these exact root trees:

```text
HulebuBootScene/Canvas/SafeArea/{Brand,StageLabel,RetryButton,BlockingError}
HulebuTitleScene/Canvas/SafeArea/{Brand,SaveStatus,PrimaryButton,NewGameButton,SettingsButton,VersionLabel,ConfirmModalHost,SettingsPanelHost}
HulebuGameScene/Canvas/SafeArea/{GameViewHost,ModalHost,ToastHost}
HulebuResultScene/Canvas/SafeArea/{OutcomeTitle,Summary,PrimaryButton,RestartButton,TitleButton}
```

- [ ] Give every interactive button a stable node name, disabled/loading visual state, and a `44x44` or larger UITransform in the `390x844` design resolution.
- [ ] Implement `HulebuAppRuntime` as the single persist-root dependency owner. It owns `AppFlowController`, `SettingsService`, the current `SceneTransitionPayload`, and injected storage/navigation ports; it does not own or create `GameSession` during Boot.
- [ ] Implement `CocosSceneNavigator` with the fixed map `boot -> HulebuBootScene`, `title -> HulebuTitleScene`, `game -> HulebuGameScene`, `result -> HulebuResultScene`. Store only the versioned payload before `director.loadScene(...)`; never pass a Node or Component.
- [ ] Boot stages are exactly `core-assets`, `content-manifest`, `ui-audio-manifests`, `settings`, `run-storage`. Render stage names, not fake percentages. Batch 1 may use validators that return valid empty availability; Batch 3/4 replaces those ports with real content/run validators.
- [ ] Title derives its primary label from `ResumeAvailability`: `开始攀山` for none, `继续攀山` otherwise. A valid run/checkpoint requires secondary `新游戏` plus confirmation.
- [ ] Instantiate the shared `SettingsPanel.prefab` under `SettingsPanelHost`; bind `master/music/sfx` sliders and `reducedMotion` toggle to the Batch 1 `SettingsService`. Batch 2 reuses this same prefab from PauseMenu.
- [ ] Result renders the immutable `M2RunSummary` from the transition payload. Failed outcome exposes checkpoint retry only when runtime availability says a valid checkpoint exists.
- [ ] `ProductionErrorReporter` accepts only stable error code, build ID, content version, save schema version, and phase. It drops arbitrary objects/stack payloads and rate-limits the same code to one report per session. Boot and navigation failures use it; later batches reuse it for resource/save/audio failures.
- [ ] Run `npm run test -w packages/shared -- hulebu-cocos-m2-app-flow mahjong-cocos-project` and Cocos typecheck via the existing release wrapper test path.

Expected: PASS; four serialized scenes and thin adapters are present.

- [ ] Update Batch 1 task/module/progress documents, run `npm run docs:sync`, `git diff --check`, and UTF-8-without-BOM validation.
- [ ] Commit the completed batch:

```bash
git add apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8 packages/shared/src docs
git commit -m "feat(hulebu): add M2 four-scene app shell"
```

---

## Batch 2: Formal Prefabs And Thin Game Presentation

**Project-task boundary:** one new task covering presentation contracts, formal prefab assets, the thin Game Scene adapter, current Binder conversion, and static boundary tests. Do not add M2 levels, reward effects, checkpoint restoration, or audio clips.

### Task 6: Define Presenter, Input, And One-Shot Effect Contracts

**Files:**

- Create: `packages/shared/src/hulebu-cocos-m2-presentation.test.ts`
- Create: `assets/scripts/presentation/GamePresentationContracts.ts`
- Create: `assets/scripts/presentation/GameScenePresenter.ts`
- Create: `assets/scripts/presentation/InputGateway.ts`
- Create: `assets/scripts/presentation/PresentationEventRouter.ts`
- Create: `assets/scripts/audio/AudioContracts.ts`
- Create: matching `.meta` files

- [ ] Register and claim a new project task for Batch 2.
- [ ] Write failing pure tests for idempotent rendering, input-mode mapping, exact candidate mapping, rejected-command stability, and one-shot effect deduplication.
- [ ] Define these central contracts:

```ts
export type GameInputMode =
  | "locked"
  | "playing"
  | "combo-choice"
  | "reward-choice"
  | "paused"
  | "settled";

export type AudioKey =
  | "bgm.m2.main"
  | "ui.confirm"
  | "tile.enter"
  | "tile.blocked"
  | "combo.resolve"
  | "tool.use"
  | "reward.choose"
  | "boss.warning"
  | "run.outcome";

export type SemanticGameInput =
  | { type: "tile.select"; tileId: string }
  | { type: "combo.execute"; combo: GameCombo }
  | { type: "combo.choose"; candidateId: string }
  | { type: "combo.cancel" }
  | { type: "tool.use"; tool: "shuffle" | "undo" | "discard" }
  | { type: "slot.discard"; slotIndex: number }
  | { type: "reward.choose"; rewardId: string }
  | { type: "flow.pause" }
  | { type: "flow.resume" };

export interface GamePresentationModel {
  readonly renderKey: string;
  readonly inputMode: GameInputMode;
  readonly board: readonly HulebuBoardNodeModel[];
  readonly slots: readonly HulebuCellNodeModel[];
  readonly reserve: readonly HulebuCellNodeModel[];
  readonly melds: readonly HulebuOpenMeldNodeModel[];
  readonly river: readonly HulebuRiverNodeModel[];
  readonly combos: readonly HulebuComboControlModel[];
  readonly hud: HulebuHudModel;
  readonly objective: ObjectiveStripModel;
  readonly tutorial: TutorialCoachModel | null;
  readonly modal: GameModalModel | null;
}

export type PresentationEffect =
  | { type: "audio"; key: AudioKey; variant?: string }
  | { type: "toast"; key: string }
  | { type: "animation"; key: string; targetId?: string };

export interface ObjectiveStripModel {
  readonly titleKey: string;
  readonly items: readonly { readonly key: string; readonly current: number; readonly target: number; readonly complete: boolean }[];
}

export interface TutorialCoachModel {
  readonly stepId: string;
  readonly copyKey: string;
  readonly anchor: { readonly kind: "tile" | "slot" | "combo" | "tool" | "objective"; readonly targetId: string };
}

export type GameModalModel =
  | { readonly kind: "combo-choice"; readonly candidateIds: readonly string[] }
  | { readonly kind: "reward-choice"; readonly rewardIds: readonly string[] }
  | { readonly kind: "boss-intro"; readonly skippable: boolean }
  | { readonly kind: "pause" }
  | { readonly kind: "blocking-error"; readonly code: string; readonly retryable: boolean };
```

- [ ] Put the `AudioKey` union above in `AudioContracts.ts` now. This contract has no driver or Cocos imports; Task 13 adds service/driver types without moving the key definition.
- [ ] `GameScenePresenter.present(...)` returns a detached model and the same `renderKey` for the same coordinator phase, session revision, tutorial step, and modal context.
- [ ] `InputGateway.toCommand(input, mode)` returns a `GameCommand` only when the mode permits it. Exact choices preserve the candidate/reward ID byte-for-byte.
- [ ] `PresentationEventRouter.route(result)` forms one-shot keys from `phase`, session revision, event index, event type, and exact target ID. Re-routing the same result emits no duplicate effect; rendering the same snapshot emits none.
- [ ] Run `npm run test -w packages/shared -- hulebu-cocos-m2-presentation`.

Expected: PASS.

- [ ] Commit:

```bash
git add apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/presentation packages/shared/src/hulebu-cocos-m2-presentation.test.ts docs
git commit -m "feat(hulebu): define M2 presentation boundaries"
```

### Task 7: Create The Fifteen Formal Prefabs

**Files:**

- Create: `assets/prefabs/game/Hud.prefab`
- Create: `assets/prefabs/game/Tile.prefab`
- Create: `assets/prefabs/game/MainSlot.prefab`
- Create: `assets/prefabs/game/ReserveSlot.prefab`
- Create: `assets/prefabs/game/ComboBar.prefab`
- Create: `assets/prefabs/game/ToolDock.prefab`
- Create: `assets/prefabs/game/TileCounter.prefab`
- Create: `assets/prefabs/game/ObjectiveStrip.prefab`
- Create: `assets/prefabs/game/TutorialCoach.prefab`
- Create: `assets/prefabs/modal/ModalFrame.prefab`
- Create: `assets/prefabs/modal/ComboChoice.prefab`
- Create: `assets/prefabs/modal/RewardCard.prefab`
- Create: `assets/prefabs/modal/BossIntro.prefab`
- Create: `assets/prefabs/modal/PauseMenu.prefab`
- Create: `assets/prefabs/modal/Toast.prefab`
- Create: all parent/file `.meta` files
- Create: `assets/scripts/presentation/components/GameViewRoot.ts`
- Create: `assets/scripts/presentation/components/SemanticButton.ts`
- Create: `assets/scripts/presentation/components/ModalHost.ts`
- Create: matching `.meta` files
- Modify: existing `BoardLayerBinder.ts`, `SlotLayerBinder.ts`, `MeldRiverLayerBinder.ts`, `ComboBarBinder.ts`, and `HudBinder.ts`
- Test: `packages/shared/src/mahjong-cocos-project.test.ts`

- [ ] Add failing project tests that enumerate the fifteen new prefab paths above plus Batch 1's `SettingsPanel.prefab`, parse all sixteen `.meta` UUIDs, and scan prefab JSON for matching component UUID references after Creator import.
- [ ] Add failing static assertions that prefab/component scripts contain no `localStorage`, `ContentRepository`, `SaveService`, `GameSession`, reward reducer, score formula, clear decision, or direct runtime mutation.
- [ ] In Creator, build the prefab trees from serialized nodes and existing v6 UI/tile SpriteFrames. Each control has normal/pressed/disabled/active plus loading/error where relevant.
- [ ] Convert the existing Binders to bind serialized roots and instantiate only repeated `Tile`, `MainSlot`, `ReserveSlot`, and short-lived Toast instances. Remove methods that construct complete page sections or modal panels.
- [ ] `GameViewRoot.render(model)` compares `renderKey`, applies all view-model fields, and drives modal visibility from `model.modal`; it never infers phase from active nodes.
- [ ] `SemanticButton` emits a typed semantic callback and owns no gameplay state. `ModalHost` disables the underlying semantic input surface whenever a modal model is non-null.
- [ ] Verify all gameplay click targets are at least `44x44` at `390x844`; Tile hit areas may exceed their visible SpriteFrame bounds.
- [ ] Run `npm run test -w packages/shared -- mahjong-cocos-project hulebu-cocos-m2-presentation`.

Expected: PASS with serialized prefab references and boundary scans.

- [ ] Commit:

```bash
git add apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/prefabs apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts packages/shared/src
git commit -m "feat(hulebu): add formal M2 game prefabs"
```

### Task 8: Replace The Monolithic Game Scene Controller

**Files:**

- Replace: `assets/scripts/GameSceneController.ts`
- Modify: `assets/scenes/HulebuGameScene.scene`
- Modify: `packages/shared/src/mahjong-cocos-project.test.ts`
- Test: `packages/shared/src/hulebu-cocos-m2-presentation.test.ts`

- [ ] Add a failing static test that requires `GameSceneController.ts` to import `GameScenePresenter`, `InputGateway`, `PresentationEventRouter`, and `HulebuAppRuntime`, and rejects `sys.localStorage`, `new HulebuRuntimeState`, `applyHulebuRewardToRunState`, `drawRoundedPanel`, `ensureChild`, account endpoints, meta modes, daily/endless/advanced UI, and `__HULEBU_DEBUG__`.
- [ ] Add a line-count guard of at most 350 lines for the replacement controller.
- [ ] Replace the file with a thin adapter whose only responsibilities are:

```ts
@ccclass("GameSceneController")
export class GameSceneController extends Component {
  @property(GameViewRoot) view: GameViewRoot | null = null;

  start(): void;                       // resolve runtime/run service and render snapshot
  onSemanticInput(input: SemanticGameInput): void; // map, dispatch, render result
  onDisable(): void;                   // unsubscribe lifecycle listeners
}
```

- [ ] For Batch 2, inject an `M1PresentationRunAdapter` that wraps the existing M1 `GameCoordinator` and first level. It may assemble a session outside the Scene component, but it must expose only `snapshot()` and `dispatch(command)` to the Scene.
- [ ] Bind the scene's serialized `GameViewRoot`, `ModalHost`, and `ToastHost`. Remove runtime full-page construction from the production scene path.
- [ ] Keep legacy runtime/config/domain modules because Batch 3 consumes them; remove only superseded page-flow/controller methods and obsolete tests that asserted excluded lobby/meta/account UI inside the controller.
- [ ] Run `npm run test -w packages/shared -- hulebu-cocos-domain hulebu-cocos-m2-presentation mahjong-cocos-project`.

Expected: PASS; M1 selection/combo/tool behavior still travels through `GameCoordinator`, while the production Game scene is prefab-driven.

- [ ] Update Batch 2 documentation, run `npm run docs:sync`, UTF-8 validation, and `git diff --check`.
- [ ] Commit:

```bash
git add apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8 packages/shared/src docs
git commit -m "refactor(hulebu): make M2 game scene a thin adapter"
```

---

## Batch 3: Three Fixed Nodes, Tutorial Progress, Reward Transaction, And Boss Gate

**Project-task boundary:** one new task covering M2 content schema/generation, solver validation, Coordinator reward/flow commands, tutorial state, mini Boss goal, and a headless complete journey. Do not add audio files or final storage recovery in this batch.

### Task 9: Add A Versioned M2 Content Pack And Deterministic Solver Gate

**Files:**

- Create: `packages/shared/src/hulebu-cocos-m2-content.test.ts`
- Create: `apps/game/mahjong-roguelike/scripts/generate-hulebu-m2-content.ts`
- Create: `assets/resources/config/m2-content.json` and `.meta`
- Create: `assets/resources/config/m2-ui-manifest.json` and `.meta`
- Create: `assets/scripts/content/M2ContentContracts.ts`
- Create: `assets/scripts/content/M2ContentLoader.ts`
- Create: `assets/scripts/content/M2SolutionVerifier.ts`
- Create: matching `.meta` files
- Modify: `assets/scripts/content/ContentRepository.ts`
- Modify: `apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs:29-39`

- [ ] Register and claim a new project task for Batch 3.
- [ ] Add the generator script as an exact formal release source input; the generated JSON remains tracked under the already-attested `assets/` tree.
- [ ] Write failing tests requiring content version `0.2.0-m2`, schema `1`, exact IDs/seeds/rewards, tile counts `18/30/42`, unique references, exact tutorial copy keys, and Boss goals `gang >= 1` plus board clear.
- [ ] Define `M2ContentPack` with these required sections:

```ts
export interface M2ContentPack {
  readonly schemaVersion: 1;
  readonly contentVersion: "0.2.0-m2";
  readonly run: {
    readonly nodeIds: readonly ["m2_tutorial_peng", "m2_tutorial_chi_choice", "m2_mini_boss_gatekeeper"];
    readonly rewardAfterNodeId: "m2_tutorial_chi_choice";
    readonly checkpointTargetNodeId: "m2_mini_boss_gatekeeper";
  };
  readonly levels: readonly M2LevelDefinition[];
  readonly rewards: readonly M2RewardDefinition[];
  readonly tutorials: readonly M2TutorialDefinition[];
  readonly solutionTraces: Readonly<Record<M2NodeId, readonly GameCommand[]>>;
  readonly requiredUiKeys: readonly string[];
  readonly requiredAudioKeys: readonly AudioKey[];
}
```

- [ ] Define the referenced content types in `M2ContentContracts.ts` as follows: `M2NodeId` is the exact three-ID union; `M2RewardId` is the exact three-reward union; `M2LevelDefinition` contains the runtime level plus fixed `seed`, `tileCount`, and required combo objective; `M2RewardDefinition` contains one `shieldBonus` or `toolBonus` delta; `M2TutorialDefinition` contains ordered step IDs, copy keys, trigger predicates, and semantic anchors.
- [ ] Lock tutorial step order to `free-tile -> slot-capacity -> peng-ready -> peng-manual -> clear` for node 1; `blocked -> chi-setup -> chi-choice -> slot-pressure -> tutorial-undo -> clear` for node 2; and `boss-intro -> gang-goal -> clear-goal` for the Boss.
- [ ] Store tutorial completion requirements as ordinary runtime objectives: node 1 requires `peng >= 1`, node 2 requires `chi >= 1`, and Boss requires `gang >= 1`. The runtime still also requires the board to be empty before clear.
- [ ] The generation script must deterministically write the same UTF-8 JSON for the three fixed seeds. It may tune curated tile groups and positions, but it must never store a direct-win flag, prefilled slot shortcut, or forced clear event.
- [ ] `M2SolutionVerifier` replays each `solutionTrace` through real `HulebuRuntimeState -> GameSession -> GameCoordinator`, asserts every command accepted, and requires:

```text
m2_tutorial_peng: peng count >= 1, board empty
m2_tutorial_chi_choice: at least one combo.choice.required with >= 2 candidates, exact chosen candidate accepted, undo accepted, board empty
m2_mini_boss_gatekeeper: gang count >= 1 before level.cleared, board empty
```

- [ ] Assert node 1 does not begin with a complete answer in the slot; node 2's two exact chi candidates occur at the declared tutorial step; Boss clear is impossible before its gang objective is complete.
- [ ] Extend `ContentRepository` to accept the parsed M2 pack and reject missing/duplicate IDs, invalid copy/UI/audio references, future schema, changed tile counts, or failed solution verification. Never substitute legacy content on failure.
- [ ] Run the generator twice and byte-compare the output, then run `npm run test -w packages/shared -- hulebu-cocos-m2-content hulebu-cocos-domain`.

Expected: PASS; all three seeds are replayably solvable through the real rules.

- [ ] Commit:

```bash
git add apps/game/mahjong-roguelike/scripts/generate-hulebu-m2-content.ts apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets packages/shared/src
git commit -m "feat(hulebu): add validated M2 content pack"
```

### Task 10: Move Reward And Encounter Flow Into The Coordinator Path

**Files:**

- Modify: `assets/scripts/domain/GameContracts.ts:8-39`
- Modify: `assets/scripts/domain/GameSession.ts:15-168`
- Modify: `assets/scripts/domain/RunStateMachine.ts:3-112`
- Modify: `assets/scripts/application/GameCoordinator.ts:19-331`
- Modify: `assets/scripts/runtime/HulebuRuntimeState.ts`
- Modify: `packages/shared/src/hulebu-cocos-domain.test.ts:1155-1888`
- Test: `packages/shared/src/hulebu-cocos-m2-content.test.ts`

- [ ] Add failing tests showing `reward.choose` accepts only an exact candidate during `rewardChoice`, applies exactly one reducer result, transitions toward the exact Boss target, and rejects duplicate/replayed choices without changing state.
- [ ] Add failing danger tests for the existing shared-rule priority: a full slot with a combo remains playable; otherwise move the newest slot tile to reserve; otherwise consume one shield and remove the oldest slot tile; otherwise consume first-protect and remove the oldest slot tile; otherwise remain playable when discard is available; otherwise emit one failure. Assert each rescue is serialized and cannot fire twice after restore.
- [ ] Add these internal flow commands to the versioned `GameCommand` union:

```ts
| { type: "flow.encounter.start"; targetLevelOrder: number }
| { type: "flow.encounter.continue"; target: "encounter" | "reward" | "boss" | "settlement" }
| { type: "combo.cancel" }
```

- [ ] Add `runId`, `runRewards`, `selectedRewardId`, and `rewardCommitId` to `RunPhaseContext`; bump `RunSnapshot.schemaVersion` from `1` to `2`. `rewardCommitId` is deterministic: `${runId}:reward:m2_tutorial_chi_choice`.
- [ ] Add this backward-compatible options boundary. Existing M1 constructors continue to compile by omitting `options`; M1 tests that assert serialized values pass `{ runId: "m1-test" }`, while M2 passes `M2RunSnapshot.runId`. `GameCoordinator.restore(...)` requires an options run ID that matches the snapshot:

```ts
export interface GameCoordinatorOptions {
  readonly runId?: string;
  readonly rewardReducer?: RewardReducer;
  readonly initialRewards?: HulebuRunRewardState;
}

constructor(
  run: RunStateMachine,
  session: GameSession | null,
  options?: GameCoordinatorOptions,
);
```
- [ ] Extend `GameSnapshot.status` to `"playing" | "cleared" | "failed"` and add domain events `danger.resolved` plus `run.failed`. Persist `shieldsRemaining`, `firstProtectAvailable`, and failed status in `HulebuRuntimeSnapshot`; deep-validate them in every live/history snapshot.
- [ ] Add `HulebuRuntimeState.resolveDanger(): DangerResolution` and call it inside `GameSession.dispatchMutation(...)` after a successful mutation but before building the result snapshot. The exact resolution union is `none`, `combo-available`, `moved-to-reserve`, `shield-consumed`, `first-protect-consumed`, `discard-available`, or `failed`.
- [ ] On `failed`, `GameCoordinator` completes `playing.dangerCheck -> failed`, emits no clear event, detaches no data prematurely, and returns `persistable: false`. `M2RunService` freezes a failed summary from that result and App Flow routes to Result.
- [ ] Extend `PauseReturnPhase` and transitions to support `rewardChoice -> paused -> rewardChoice` without an attached `GameSession`. Keep paused non-persistable; the previously committed exact reward-choice snapshot remains the refresh restore point. Preserve the same candidate IDs/order across in-memory pause/resume.
- [ ] Inject a pure `RewardReducer` into `GameCoordinator`:

```ts
export type RewardReducer = (
  current: HulebuRunRewardState,
  rewardId: string,
) => HulebuRunRewardState;
```

- [ ] Implement the three effects against the existing `HulebuRunRewardState` exactly: `m2_protection_plus_1` increments `shieldBonus`; `m2_shuffle_plus_1` increments `toolBonus.shuffle`; `m2_undo_plus_1` increments `toolBonus.undo`; every success appends the exact ID to `pickedRewards` once. Return a new detached state and leave every other field byte-equal.
- [ ] Validate the entire transition and candidate before assigning reduced state. After success, clear candidates, preserve the exact target level, set selection/commit ID, emit one `reward.chosen`, and make the phase persistable. A duplicate command in the new phase returns `accepted: false`, no event, and byte-equal reward state.
- [ ] Route encounter start/continue and combo cancel through Coordinator transitions so the new Game Scene never calls `RunStateMachine.transition(...)` directly.
- [ ] Add an explicit schema-1-to-schema-2 coordinator snapshot migration used only by tests/diagnostics; M2 active save compatibility is governed by Batch 4's content version.
- [ ] Run `npm run test -w packages/shared -- mahjong-game hulebu-cocos-domain hulebu-cocos-m2-content`.

Expected: PASS; the old Controller-side `applyHulebuRewardToRunState` path is no longer needed by production M2.

- [ ] Commit:

```bash
git add apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/application packages/shared/src
git commit -m "feat(hulebu): coordinate exact M2 rewards and flow"
```

### Task 11: Implement Tutorial And Complete Headless Journey

**Files:**

- Create: `assets/scripts/application/M2RunContracts.ts`
- Create: `assets/scripts/application/M2RunService.ts`
- Create: `assets/scripts/tutorial/TutorialDirector.ts`
- Create: matching `.meta` files
- Modify: `assets/scripts/bootstrap/HulebuAppRuntime.ts`
- Modify: `assets/scripts/GameSceneController.ts`
- Modify: `assets/scripts/presentation/GameScenePresenter.ts`
- Test: `packages/shared/src/hulebu-cocos-m2-content.test.ts`
- Test: `packages/shared/src/hulebu-cocos-m2-presentation.test.ts`

- [ ] Write a failing headless test that drives the exact content solution traces from new run through node 1, node 2, reward, Boss, frozen clear summary, replay, and return-to-title.
- [ ] In the same headless suite, drive one full-slot/no-rescue failure, assert one failed summary with the last five semantic actions, then retry the Boss from the post-reward checkpoint and finish successfully.
- [ ] Define `M2RunSnapshot` as a versioned aggregate containing `runId`, exact `nodeId/seed`, `RunSnapshot`, tutorial progress, accumulated metrics, elapsed active milliseconds, retry count, selected reward, and the last five semantic action keys.
- [ ] Implement `TutorialDirector` as a pure event/phase reducer. Its steps are data-driven from content; it exposes one `TutorialCoachModel` and one highlighted semantic target at a time. It does not dispatch commands or change runtime state.
- [ ] Node 2's free tutorial undo uses the level's one tutorial-provided undo charge and the ordinary `{ type: "tool.use", tool: "undo" }` path. Assert the cross-node reward bonus state is unchanged by using that charge.
- [ ] Implement `M2RunService` with only these public operations:

```ts
startNew(): M2RunResult;
restore(snapshot: M2RunSnapshot): M2RunResult;
snapshot(): M2RunSnapshot;
dispatch(command: GameCommand): M2RunResult;
advanceAfterClear(): M2RunResult;
buildSummary(outcome: RunOutcome, failureReason?: string): M2RunSummary;
```

- [ ] `M2RunService` creates/replaces `GameSession`, aggregates accepted events, advances the declared node graph, and delegates every gameplay/reward/flow mutation to `GameCoordinator`. It never calls a mutable method on `HulebuRuntimeState` after session construction.
- [ ] Present Boss intro from `bossIntro`; first display lasts no more than three seconds and repeated retry exposes skip immediately. ObjectiveStrip derives gang completion and clear readiness from the Coordinator/session snapshot.
- [ ] Build summary once at settlement/failed and freeze it. Result Scene receives that object; it never reads runtime state.
- [ ] Wire `HulebuAppRuntime` to own one `M2RunService`. The Game Scene gets only the service interface and semantic results.
- [ ] Run `npm run test -w packages/shared -- hulebu-cocos-domain hulebu-cocos-m2-content hulebu-cocos-m2-presentation mahjong-cocos-project`.

Expected: PASS; the complete no-refresh M2 journey reaches a frozen Result summary without a Cocos rule fallback.

- [ ] Update Batch 3 documentation, run `npm run docs:sync`, UTF-8 validation, and `git diff --check`.
- [ ] Commit:

```bash
git add apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8 packages/shared/src docs
git commit -m "feat(hulebu): complete M2 three-node run"
```

---

## Batch 4: Exact Recovery, One Checkpoint, Real Audio, And Reduced Motion

**Project-task boundary:** one new task covering active/checkpoint repositories, Boot restore priority, reward-save transaction, Result retry, AudioService/driver, generated temporary audio, settings wiring, and licenses. Do not change node content or production E2E tooling here.

### Task 12: Implement Active Run And Checkpoint Recovery

**Files:**

- Create: `packages/shared/src/hulebu-cocos-m2-recovery.test.ts`
- Create: `assets/scripts/persistence/M2SaveContracts.ts`
- Create: `assets/scripts/persistence/M2RunRepository.ts`
- Create: matching `.meta` files
- Modify: `assets/scripts/application/M2RunService.ts`
- Modify: `assets/scripts/bootstrap/HulebuAppRuntime.ts`
- Modify: `assets/scripts/scenes/BootSceneController.ts`
- Modify: `assets/scripts/scenes/TitleSceneController.ts`
- Modify: `assets/scripts/scenes/ResultSceneController.ts`
- Modify: `apps/game/mahjong-roguelike/release/hulebu-v1.release.json`

- [ ] Register and claim a new project task for Batch 4.
- [ ] Add failing tests for exact combo/reward modal restore, paused return phase, active-run precedence, corrupt active fallback to checkpoint, corrupt-both return to Title, Boss failure retry, restart clearing both, return-title retaining checkpoint, and SaveService failure preserving the last committed primary.
- [ ] Use these keys and envelope policy:

```ts
export const M2_ACTIVE_RUN_KEY = "hulebu-cocos-m2-active-run";
export const M2_CHECKPOINT_KEY = "hulebu-cocos-m2-checkpoint";
export const M2_SAVE_SCHEMA_VERSION = 2;
export const M2_CONTENT_VERSION = "0.2.0-m2";
```

- [ ] Define checkpoint data with exact target `m2_mini_boss_gatekeeper`, Boss seed, Coordinator reward state/commit ID, accumulated score/metrics, elapsed time, retry count, and replay context. It must not store Cocos objects, coordinates as truth, or UI visibility.
- [ ] `M2RunRepository` owns two existing generic `SaveService` instances and returns:

```ts
export interface M2ResumeProbe {
  readonly activeRun: "none" | "valid" | "quarantined";
  readonly checkpoint: "none" | "valid" | "quarantined";
  readonly source: "active-run" | "checkpoint" | null;
  readonly warningCode: string | null;
}
```

- [ ] Implement restore priority exactly: valid active; otherwise quarantine active and try checkpoint; otherwise quarantine checkpoint, preserve settings, clear only run keys, and return Title warning `RUN_RECOVERY_RESET`.
- [ ] Make reward selection transactional at the application boundary: capture the pre-command Coordinator snapshot, dispatch exact reward, save the resulting checkpoint before exposing `reward.chosen`, and restore the pre-command Coordinator if checkpoint commit fails. The returned result remains on the same reward candidates with warning `CHECKPOINT_SAVE_FAILED`, so retry cannot double-award.
- [ ] Persist active run only after a complete accepted mutation reaches `CoordinatorResult.persistable === true`. A failed save does not update in-memory committed state and emits `ACTIVE_SAVE_FAILED` once per stable revision.
- [ ] Update release `contentVersion` to `0.2.0-m2` and `saveSchemaVersion` to `2`. Assert M1 content bytes are quarantined, while independent settings survive.
- [ ] Run `npm run test -w packages/shared -- hulebu-cocos-m2-recovery hulebu-cocos-domain hulebu-cocos-release`.

Expected: PASS across exact and corrupt recovery paths.

- [ ] Commit:

```bash
git add apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts apps/game/mahjong-roguelike/release/hulebu-v1.release.json packages/shared/src docs
git commit -m "feat(hulebu): add exact M2 checkpoint recovery"
```

### Task 13: Implement AudioService And Project-Owned Temporary Audio

**Files:**

- Create: `packages/shared/src/hulebu-cocos-m2-audio.test.ts`
- Create: `apps/game/mahjong-roguelike/scripts/generate-hulebu-m2-audio.cjs`
- Modify: `assets/scripts/audio/AudioContracts.ts`
- Create: `assets/scripts/audio/AudioService.ts`
- Create: `assets/scripts/audio/CocosAudioDriver.ts`
- Create: matching `.meta` files
- Create: `assets/resources/audio/m2/audio-manifest.json` and `.meta`
- Create: `assets/resources/audio/m2/bgm-m2-main.wav` and `.meta`
- Create: `assets/resources/audio/m2/ui-confirm.wav` and `.meta`
- Create: `assets/resources/audio/m2/tile-enter.wav` and `.meta`
- Create: `assets/resources/audio/m2/tile-blocked.wav` and `.meta`
- Create: `assets/resources/audio/m2/combo-resolve.wav` and `.meta`
- Create: `assets/resources/audio/m2/tool-use.wav` and `.meta`
- Create: `assets/resources/audio/m2/reward-choose.wav` and `.meta`
- Create: `assets/resources/audio/m2/boss-warning.wav` and `.meta`
- Create: `assets/resources/audio/m2/run-outcome.wav` and `.meta`
- Create: `assets/resources/audio/m2/LICENSES.md` and `.meta`
- Modify: `apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs:29-39`
- Modify: `assets/scripts/bootstrap/HulebuAppRuntime.ts`
- Modify: `assets/scripts/presentation/PresentationEventRouter.ts`
- Modify: `assets/scripts/presentation/components/GameViewRoot.ts`

- [ ] Add the audio generator as an exact formal release source input.
- [ ] Write failing pure tests for first-gesture unlock, queued BGM, `master/music/sfx` multiplication, BGM fade/crossfade requests, SFX concurrency cap, same-key throttle, visibility pause/resume, clip failure mute-by-key, and no propagation of driver errors into gameplay results.
- [ ] Keep the `AudioKey` union defined in Task 6 exactly; Task 13 may add only audio-service and driver contracts to `AudioContracts.ts`.

- [ ] Keep `AudioService` pure by injecting an `AudioDriver` with unlock/load/play/stop/setGain/visibility operations. Cap SFX at 8 concurrent voices, throttle the same key for 50 ms, and log one stable error code per failed key per session.
- [ ] Implement `CocosAudioDriver` with Cocos `AudioSource`/`AudioClip` and browser first-gesture unlock. Audio failure resolves to a result value; it never throws through `M2RunService.dispatch`.
- [ ] Generate one deterministic 24-second seamlessly loopable, low-density pentatonic WAV and eight short WAV cues. The generator writes PCM WAV with project-authored synthesis only, so `LICENSES.md` records `source: project-generated original`, generator commit, parameters, modifications `none`, and project-wide use grant for each file.
- [ ] The manifest maps stable keys to resource paths, SHA-256, bus, loop flag, default gain, allowed variants, and complete license fields. Boot rejects missing clips, hashes, or license fields.
- [ ] Map `combo.resolve` variants `chi/peng/gang/hu` and `run.outcome` variants `clear/failed` without adding new keys.
- [ ] Bind SettingsPanel sliders/toggle to the same `SettingsService` from Title and Pause. Apply settings immediately. `reducedMotion` disables shake, long travel, and multi-stage particles while preserving state changes and input completion.
- [ ] Run the audio generator twice and compare hashes, then run `npm run test -w packages/shared -- hulebu-cocos-m2-audio hulebu-cocos-m2-app-flow hulebu-cocos-m2-presentation mahjong-cocos-project`.

Expected: PASS; audio errors are contained and generated assets/manifests are complete.

- [ ] Update Batch 4 documentation, run `npm run docs:sync`, UTF-8 validation, and `git diff --check`.
- [ ] Commit:

```bash
git add apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8 apps/game/mahjong-roguelike/scripts/generate-hulebu-m2-audio.cjs apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs packages/shared/src docs
git commit -m "feat(hulebu): add M2 recovery audio and settings"
```

---

## Batch 5: Exact-Commit Production E2E, Visual QA, And New-Player Acceptance

**Project-task boundary:** one final task covering release assertions, production build/verify, real browser automation, screenshots/canvas pixels, recovery run, player evidence, defect closure, independent review, and M2 completion documents. Functional defects discovered here are fixed in narrowly scoped commits within this task only when their files are declared in the claim before editing.

### Task 14: Add Production Contract Gates

**Files:**

- Create: `packages/shared/src/hulebu-cocos-m2-production.test.ts`
- Modify: `packages/shared/src/hulebu-cocos-release.test.ts`
- Modify: `packages/shared/src/mahjong-cocos-project.test.ts`
- Modify: `apps/game/mahjong-roguelike/release/hulebu-v1.release.json`

- [ ] Register and claim a new project task for Batch 5.
- [ ] Add failing gates that require four scene UUIDs in the built `src/settings.json`, Boot as launch scene, all sixteen prefabs, three content nodes, nine audio assets, content/save versions, no missing manifest references, and no source/controller debug entry.
- [ ] Add source scans rejecting page-level runtime node construction, Scene/Prefab direct storage, Scene/Prefab runtime mutation, reward application outside Coordinator, `window.__HULEBU_DEBUG__`, landscape copy, WeChat SDK imports, and M2-excluded mode buttons.
- [ ] Extend `requiredFiles` only for stable generated artifacts whose exact paths are guaranteed by Creator. Do not add hashed bundle filenames; validate those by parsed asset config and manifest references.
- [ ] Run all focused tests:

```bash
npm run test -w packages/shared -- hulebu-cocos-domain hulebu-cocos-m2-app-flow hulebu-cocos-m2-presentation hulebu-cocos-m2-content hulebu-cocos-m2-recovery hulebu-cocos-m2-audio hulebu-cocos-m2-production mahjong-cocos-project hulebu-cocos-release
```

Expected: PASS with no focused regression.

- [ ] Run `git diff --check`, UTF-8-without-BOM validation, task/module docs sync, and commit the exact production candidate:

```bash
git add apps/game/mahjong-roguelike packages/shared/src docs package.json package-lock.json
git commit -m "test(hulebu): gate M2 production journey"
```

### Task 15: Build And Verify The Exact Commit

**Files:**

- Generated/ignored: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/build/production/**`
- Record: `docs/modules/mahjong-roguelike/evidence/m2/<full-commit>/build-summary.json`

- [ ] Confirm `git status --short` is empty.
- [ ] Run `npm run game:hulebu:build`.

Expected: production Web Mobile build succeeds (Creator exit `0`, or `36` only with all existing normalization gates), writes schema-6 manifest evidence, and uses Boot as the start scene.

- [ ] Run `npm run game:hulebu:verify-build`.

Expected: verify-only returns valid artifact/source/Creator/HTTP smoke evidence for the same full commit.

- [ ] Copy only compact, non-generated evidence fields into `build-summary.json`: full commit, build ID, content/save versions, Creator digest, source tree digest, artifact tree digest, file count/bytes, normalized exit evidence, four scene URLs, and smoke results.

### Task 16: Run The Real Portrait Production Journey

**Files:**

- Record: `docs/modules/mahjong-roguelike/evidence/m2/<full-commit>/journey.json`
- Record: `docs/modules/mahjong-roguelike/evidence/m2/<full-commit>/screenshots/*.png`
- Record: `docs/modules/mahjong-roguelike/evidence/m2/<full-commit>/console.json`

- [ ] Use `game-studio:game-playtest` for the production browser QA. Per project policy, control Kimi WebBridge or the Codex in-app browser; do not open a separate system Chrome GUI first.
- [ ] Serve the exact build on loopback:

```bash
python3 -m http.server 4173 --directory apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/build/production/web-mobile
```

- [ ] Set the browser viewport to `390x844`, open `http://127.0.0.1:4173/`, and confirm canvas pixels are nonblank before interacting.
- [ ] Automate real coordinate/pointer input through the visible production canvas and capture evidence at these checkpoints:

```text
01 Boot stage -> Title
02 Title primary button -> node 1
03 first free tile guidance
04 accepted peng -> node 1 clear
05 node 2 blocked tile feedback
06 exact multi-candidate ComboChoice
07 refresh while ComboChoice is open -> same candidates/order
08 tutorial undo -> node 2 clear
09 exact reward cards -> choose one
10 refresh -> same applied reward and Boss target
11 Boss gang objective completes
12 Boss clear -> Result clear summary
13 Result replay -> fresh node 1
14 Result return-title path
15 manufactured Boss failure -> Result failed
16 checkpoint continue -> same reward/tool/score and Boss seed
```

- [ ] For each checkpoint, store visible labels, click coordinates, screenshot name, canvas nonblank pixel result, console error count, resource failure count, and observed phase/outcome. Do not use a debug API or inject runtime state.
- [ ] Assert no horizontal scrolling, no clipped critical label/button, no overlap that blocks input, no target smaller than `44x44`, no missing class, no required-resource 404, no unhandled rejection/exception, and no debug/placeholder copy.
- [ ] Repeat Title/Game/Result at one smaller portrait viewport (`360x780`) only as a containment check. This is not a landscape adaptation task.
- [ ] Stop the loopback server after evidence is complete.

### Task 17: Run New-Player Acceptance And Close M2

**Files:**

- Create: `docs/modules/mahjong-roguelike/evidence/m2/<full-commit>/new-player-test.html`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: current task item/claim and daily progress
- Create: current task completion record

- [ ] Test with three people who did not implement M2. Tell them only to start from the visible primary button; do not explain the rules.
- [ ] Record anonymous participant labels, first-peng time, total time, furthest point, stuck step, invalid clicks, tool use, failure reason, and whether Result was reached on first attempt.
- [ ] Require all three to complete the first peng within 90 seconds, at least two to reach Result on the first attempt, and successful complete runs to land within 8-12 minutes.
- [ ] If metrics fail, create and claim a narrowly scoped defect task for tutorial visibility, copy, click target, or fixed-seed tuning. Do not add new rules or M3/M4 scope. Rebuild and repeat affected production evidence after the fix commit.
- [ ] Run an independent final review and require `0 Critical / 0 Important`. Address every validated finding, rerun its focused tests, create a new exact production commit/build, and refresh evidence paths to that commit.
- [ ] Run the full M2 verification set again plus `npm run game:hulebu:verify-build`.
- [ ] Mark the Batch 5 task and M2 milestone complete only when the product, recovery, production, and player gates all pass. Update task/claim/module/daily/completion docs and run `npm run docs:sync`.
- [ ] Final documentation commit:

```bash
git add docs
git commit -m "docs(hulebu): record M2 production acceptance"
```

## Final Acceptance Matrix

| Requirement | Automated evidence | Production evidence |
| --- | --- | --- |
| Four-scene legal flow | `hulebu-cocos-m2-app-flow.test.ts` | Boot/Title/Game/Result screenshots and journey log |
| Prefab-only formal UI boundary | project/presentation scans | `390x844` interaction screenshots |
| Peng/chi/exact choice/gang | domain/content journey tests | real canvas click journey |
| One exact reward, no double grant | domain/recovery tests | reward refresh checkpoint |
| Exact active/checkpoint restore | recovery tests | ComboChoice refresh and Boss retry |
| Frozen clear/failed summaries | app-flow/content tests | Result screenshots |
| Settings and reduced motion | app-flow/audio tests | Title/Pause shared SettingsPanel |
| 1 BGM + 8 SFX with records | audio/manifest tests | audible call-chain observation and zero blocking errors |
| Fixed seed solvability | solution replay tests | no-backdoor complete production run |
| Portrait only | static landscape exclusion | `390x844` plus `360x780` containment |
| Exact-commit release | release/production tests | build manifest and verify-only summary |
| New-player comprehension | timing/assertion checks in evidence review | three-person acceptance report |

## Implementation Handoff

Use **Subagent-Driven Development** when executing this plan in the same task: one fresh worker per implementation task, then specification review followed by code-quality review before moving on. Use **Inline Execution** only when agent concurrency is unavailable; preserve every project-task boundary and checkpoint commit exactly as written.
