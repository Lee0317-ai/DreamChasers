# Hulebu Cocos Real Config Level Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Cocos preview load Hulebu level 1 from real configuration instead of the local handwritten sample scene.

**Architecture:** Add a small Cocos-local runtime adapter that embeds the MVP level-1 data shape, converts it into a Cocos scene model, and keeps a minimal rules state for click and combo actions. `GameSceneController` will default to the real-config adapter while retaining the old sample model as a fallback.

**Tech Stack:** Cocos Creator 3.8.8 TypeScript scripts, existing `HulebuSceneModel` contracts, Vitest structure checks in `packages/shared`, existing shared mahjong rules as the behavior reference.

---

### Task 1: Protect The Real-Config Cocos Contract

**Files:**
- Modify: `packages/shared/src/mahjong-cocos-project.test.ts`

- [ ] **Step 1: Write the failing test**

Add assertions that require:

```ts
expect(files).toContain("assets/scripts/config/HulebuLevelConfig.ts");
expect(files).toContain("assets/scripts/runtime/HulebuRuntimeState.ts");
expect(files).toContain("assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts");
expect(gameSceneController).toContain("loadConfiguredLevelOnStart");
expect(gameSceneController).toContain("createHulebuConfiguredSceneModelForLayout");
expect(gameSceneController).toContain("this.runtimeState");
expect(gameSceneController).toContain("moveTileToSlot");
expect(gameSceneController).toContain("executeComboByKey");
```

- [ ] **Step 2: Run the red test**

Run:

```bash
npm run test -w packages/shared -- mahjong-cocos-project
```

Expected: fail because the new files and controller strings do not exist yet.

### Task 2: Add Cocos-Local Level Config And Runtime State

**Files:**
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`

- [ ] **Step 1: Implement minimal config types and level-1 data**

Create Cocos-local level config types and embed the real first level from `apps/game/mahjong-roguelike/config/levels.json`.

- [ ] **Step 2: Implement minimal runtime state**

Implement a focused runtime state that supports board/slot/reserve/defaults from level config, tile label creation, blocked-by availability, `moveTileToSlot(tileId)`, `getComboControls()`, `executeComboByKey(candidateKey)`, and `toSceneModel(layout)`.

- [ ] **Step 3: Keep this runtime scoped**

Do not implement rewards, Boss goals, level switching, animation, or final SpriteFrame loading in this task.

### Task 3: Wire Real Config Into The Controller

**Files:**
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts`
- Modify: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`

- [ ] **Step 1: Add configured scene bootstrap**

Expose `createHulebuConfiguredSceneModelForLayout(layout)`, returning both `sceneModel` and `runtimeState`.

- [ ] **Step 2: Make GameSceneController default to real config**

Add a `loadConfiguredLevelOnStart` property defaulting to `true`. When enabled, `start()` loads configured level 1; otherwise it falls back to the previous sample scene.

- [ ] **Step 3: Route clicks through runtime state**

Update tile clicks and combo clicks so the runtime state mutates first and then regenerates the scene model. Keep old sample-scene behavior as fallback when no runtime state exists.

### Task 4: Verify And Document

**Files:**
- Modify: `docs/tasks/items/T072-hulebu-cocos-real-config-level.md`
- Modify: `docs/tasks/claims/T072-codex.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Create: `docs/progress/2026-05-27.md`
- Create: `docs/completion/2026-05-27-task-T072-hulebu-cocos-real-config-level.md`

- [ ] **Step 1: Run verification commands**

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
npm run test -w packages/shared -- mahjong
npm run typecheck -w packages/shared
npm run docs:sync
git diff --check
```

- [ ] **Step 2: Manually verify Cocos Web Preview**

In mobile preview, confirm level 1 shows real `9筒` and `2万` config tiles, clicking three `9筒` fills slots and enables `碰`, and executing `碰` reveals/unlocks the lower `2万` tiles.

- [ ] **Step 3: Update docs**

Mark T072 as `待验收`, add verification evidence, and update module handoff with the next recommended step.
