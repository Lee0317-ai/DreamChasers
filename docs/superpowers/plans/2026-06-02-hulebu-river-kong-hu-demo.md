# Hulebu River Kong Hu Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first playable HTML demo version of finite river, open melds, supplemental kong, direct kong mountain opening, and Hu river cleanup.

**Architecture:** Keep the current single-file HTML prototype structure. Add small state fields to the existing `model.state`, reuse existing combo detection and render functions, and expose behavior through VM tests before editing production code.

**Tech Stack:** Plain HTML/CSS/JavaScript prototype, Node test runner in `packages/shared`, VM-based script extraction tests, Kimi WebBridge or Codex App browser for smoke checks.

---

### Task 1: Register Scope

**Files:**
- Modify: `docs/tasks/CHANGE_INTAKE.md`
- Create: `docs/tasks/items/T101-hulebu-river-kong-hu-demo.md`
- Create: `docs/tasks/claims/T101-lee.md`
- Modify: `docs/tasks/NEXT_ID.md`

- [x] **Step 1: Create T101 task and claim**

Use `T101` for the demo implementation and set `docs/tasks/NEXT_ID.md` to `102`.

- [x] **Step 2: Confirm allowed files**

Allowed production files are only `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, and `packages/shared/src/mahjong-config.test.ts`, plus T101 documentation files.

### Task 2: Write Failing Tests

**Files:**
- Modify: `packages/shared/src/mahjong-config.test.ts`
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`

- [ ] **Step 1: Add VM tests for finite river and meld behavior**

Add tests that load `index.html`, initialize a playable level, then assert these behaviors:

```ts
test('finite river lets the player choose a slot tile to discard', () => {
  const context = createPrototypeContext();
  context.loadLevel('friend', 5);
  context.model.state.slot = [
    { key: 'wan-1', suit: 'wan', rank: 1 },
    { key: 'wan-2', suit: 'wan', rank: 2 },
  ];
  context.startDiscardSelection();
  context.discardSlotTile(0);
  assert.equal(context.model.state.slot.length, 1);
  assert.equal(context.model.state.river.length, 1);
  assert.equal(context.model.state.river[0].key, 'wan-1');
});
```

```ts
test('peng creates an open meld and the fourth matching tile can supplement kong', () => {
  const context = createPrototypeContext();
  context.loadLevel('friend', 5);
  context.model.state.slot = [
    { key: 'wan-5', suit: 'wan', rank: 5 },
    { key: 'wan-5', suit: 'wan', rank: 5 },
    { key: 'wan-5', suit: 'wan', rank: 5 },
  ];
  context.executeCombo({ type: 'peng', tileKey: 'wan-5', label: '碰 5万' });
  context.model.state.slot = [{ key: 'wan-5', suit: 'wan', rank: 5 }];
  const candidates = context.getAvailableCombos().map((combo) => combo.type);
  assert.ok(candidates.includes('bugang'));
  context.executeCombo({ type: 'bugang', tileKey: 'wan-5', label: '补杠 5万' });
  assert.equal(context.model.state.slot.length, 0);
  assert.equal(context.model.state.openMelds[0].type, 'gang');
  assert.equal(context.model.state.openMelds[0].source, 'supplemental');
});
```

```ts
test('direct kong opens the mountain and hu clears one river tile', () => {
  const context = createPrototypeContext();
  context.loadLevel('friend', 5);
  const beforeRemoved = context.model.state.tiles.filter((tile) => tile.removed).length;
  context.model.state.slot = [
    { key: 'tong-7', suit: 'tong', rank: 7 },
    { key: 'tong-7', suit: 'tong', rank: 7 },
    { key: 'tong-7', suit: 'tong', rank: 7 },
    { key: 'tong-7', suit: 'tong', rank: 7 },
  ];
  context.executeCombo({ type: 'gang', tileKey: 'tong-7', label: '杠 7筒' });
  const afterRemoved = context.model.state.tiles.filter((tile) => tile.removed).length;
  assert.ok(afterRemoved > beforeRemoved);
  context.model.state.river = [{ key: 'zi-zhong', suit: 'zi', rank: 'zhong' }];
  context.model.state.slot = [
    { key: 'wan-1', suit: 'wan', rank: 1 },
    { key: 'wan-1', suit: 'wan', rank: 1 },
    { key: 'wan-1', suit: 'wan', rank: 1 },
    { key: 'tiao-2', suit: 'tiao', rank: 2 },
    { key: 'tiao-2', suit: 'tiao', rank: 2 },
    { key: 'tiao-2', suit: 'tiao', rank: 2 },
    { key: 'tong-9', suit: 'tong', rank: 9 },
    { key: 'tong-9', suit: 'tong', rank: 9 },
  ];
  context.executeCombo({ type: 'hu', label: '胡' });
  assert.equal(context.model.state.slot.length, 0);
  assert.equal(context.model.state.river.length, 0);
});
```

- [ ] **Step 2: Add static prototype checks**

Assert the HTML contains `river`, `openMelds`, `startDiscardSelection`, `discardSlotTile`, and `补杠`.

- [ ] **Step 3: Run focused tests and verify they fail**

Run:

```bash
npm run test -w packages/shared -- mahjong-config
npm run test -w packages/shared -- mahjong-config-playable-prototype
```

Expected result before implementation: tests fail because the new demo functions or state fields do not exist.

### Task 3: Implement Demo Rules

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`

- [ ] **Step 1: Add state fields**

Initialize `river`, `riverLimit`, `discardSelecting`, `openMelds`, and `lastActionEffect` in level setup.

- [ ] **Step 2: Add UI sections**

Render a compact visible river and open meld area near the slot/combos HUD without covering the board.

- [ ] **Step 3: Replace automatic discard with selectable discard**

`startDiscardSelection()` enters selection mode. `discardSlotTile(index)` moves the selected slot tile into river when capacity allows.

- [ ] **Step 4: Add open meld and supplemental kong**

`peng` moves three matching tiles into `openMelds`. `bugang` removes the matching fourth tile from slot and upgrades the meld to supplemental kong without strong mountain opening.

- [ ] **Step 5: Add direct kong and Hu rewards**

Direct `gang` removes four slot tiles, opens two or three blocked mountain tiles, and adds a direct kong meld. `hu` clears slot, opens four or five blocked mountain tiles, and removes one river tile.

- [ ] **Step 6: Update fail checks**

When slot is full and no combo exists, allow play to continue if river has capacity; fail only when river is full and no rescue remains.

### Task 4: Verify and Document

**Files:**
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/progress/2026-06-02-lee.md`
- Create: `docs/completion/2026-06-02-task-T101-hulebu-river-kong-hu-demo.md`

- [ ] **Step 1: Run automated verification**

Run the two shared test commands, HTML script `node --check`, `npm run docs:sync`, placeholder scan, and `git diff --check`.

- [ ] **Step 2: Run browser smoke test**

Use Kimi WebBridge or the Codex App browser to open the default player page and verify river, discard selection, open melds, supplemental kong, direct kong, and Hu reward states.

- [ ] **Step 3: Update docs**

Mark T101 as `待验收`, append module progress, and create a completion record with commands and results.
