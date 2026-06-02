# Hulebu Friend Playtest Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build a 10-level HTML friend-playtest run for 胡了卜 before investing further in Cocos UI work.

**Architecture:** Keep the implementation inside the existing `config-playable` prototype. Add a small demo-run layer that overrides runtime level flow, tutorial slot limits, early teaching tile sets, the first fixed reward, and the right-side tools while preserving the current mountain generator for level 5 onward.

**Tech Stack:** Plain HTML/CSS/JavaScript prototype, Vitest static and VM tests in `packages/shared`, Kimi WebBridge or Codex App browser for playtest checks.

---

### Task 1: Register T093 And Scope

**Files:**
- Create: `docs/tasks/items/T093-hulebu-friend-playtest-demo.md`
- Create: `docs/tasks/claims/T093-lee.md`
- Modify: `docs/tasks/NEXT_ID.md`
- Modify: `docs/tasks/CHANGE_INTAKE.md`

- [x] **Step 1: Add the task and claim files**

Create T093 with owner Lee, status `进行中`, allowed files limited to the HTML prototype, shared tests, and related docs.

- [x] **Step 2: Increment NEXT_ID**

Change `docs/tasks/NEXT_ID.md` from `093` to `094`.

- [x] **Step 3: Record the product decision**

Add a CHANGE_INTAKE card for “先做 10 关朋友试玩 Demo，再上 Cocos UI” and mark it as T093.

### Task 2: Add Failing Tests

**Files:**
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`
- Modify: `packages/shared/src/mahjong-config.test.ts`

- [x] **Step 1: Static test for demo run constants and UI**

Add assertions that `index.html` contains:

```ts
expect(playHtml).toContain("const FRIEND_DEMO_LEVEL_COUNT = 10;");
expect(playHtml).toContain("const FRIEND_DEMO_TUTORIAL_SLOT_LIMIT = 6;");
expect(playHtml).toContain("const FRIEND_DEMO_FULL_SLOT_LIMIT = 8;");
expect(playHtml).toContain("const FRIEND_DEMO_FIRST_REWARD_ID = \"demo_slot_plus_2\";");
expect(playHtml).toContain("function createFriendDemoTutorialTiles");
expect(playHtml).toContain("function getFriendDemoSlotLimit");
expect(playHtml).toContain("function useDiscardTool");
expect(playHtml).toContain("<strong>丢弃</strong>");
expect(playHtml).toContain("view.discardButton");
```

- [x] **Step 2: VM test for behavior**

Add a VM summary test that loads the prototype script and asserts:

```ts
expect(summary.demoLevels).toBe(10);
expect(summary.slotLimits.slice(0, 4)).toEqual([6, 6, 6, 8]);
expect(summary.featuredCombos.slice(0, 4)).toEqual([["peng"], ["chi"], ["gang"], ["hu"]]);
expect(summary.firstReward.id).toBe("demo_slot_plus_2");
expect(summary.firstReward.slotDelta).toBe(2);
expect(summary.toolLabels).toEqual(["洗牌", "撤回", "丢弃"]);
expect(summary.level5.mode).toBe("mountain");
expect(summary.level5.tileCount).toBeGreaterThanOrEqual(120);
```

- [x] **Step 3: Run tests and confirm RED**

Run:

```bash
npm run test -w packages/shared -- mahjong-config-playable-prototype mahjong-config
```

Expected: FAIL because T093 constants and discard tool do not exist yet.

### Task 3: Implement Demo Run Layer

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`

- [x] **Step 1: Add demo constants**

Add constants:

```js
const FRIEND_DEMO_LEVEL_COUNT = 10;
const FRIEND_DEMO_TUTORIAL_SLOT_LIMIT = 6;
const FRIEND_DEMO_FULL_SLOT_LIMIT = 8;
const FRIEND_DEMO_FIRST_REWARD_ID = "demo_slot_plus_2";
const FRIEND_DEMO_TUTORIAL_COMBOS = ["peng", "chi", "gang", "hu"];
```

- [x] **Step 2: Add tutorial tile generation**

Implement `createFriendDemoTutorialTiles(levelOrder)` so levels 1-4 generate small, readable tutorial boards:

- level 1: two `peng` sets, no more than 12 visible tiles
- level 2: two `chi` sets, no more than 12 visible tiles
- level 3: one `gang` set plus one small follow-up set
- level 4: exactly an 8-card `hu` pattern using two melds and one pair

- [x] **Step 3: Add slot limit override**

Implement `getFriendDemoSlotLimit(levelIndex)`:

```js
if (levelIndex <= 2) return FRIEND_DEMO_TUTORIAL_SLOT_LIMIT;
if (levelIndex === 3) return FRIEND_DEMO_FULL_SLOT_LIMIT;
return FRIEND_DEMO_FULL_SLOT_LIMIT;
```

Load levels 1-3 with 6 slots and level 4+ with 8 slots.

- [x] **Step 4: Add fixed first reward**

Create a virtual reward:

```js
{
  id: FRIEND_DEMO_FIRST_REWARD_ID,
  name: "主槽扩容",
  description: "主槽 +2，达到 8 格上限。",
  effects: [{ type: "slot_limit_delta", value: 2 }]
}
```

After clearing level 3, show only this reward and apply it before level 4.

### Task 4: Replace Tool Set

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`

- [x] **Step 1: Replace visible tool labels**

Change right-side tools to:

```html
<strong>洗牌</strong>
<strong>撤回</strong>
<strong>丢弃</strong>
```

- [x] **Step 2: Wire discard button**

Add `discardButton` and `discardCount` to `view`, add a click listener, and implement `useDiscardTool()`.

- [x] **Step 3: Implement discard behavior**

`useDiscardTool()` should:

- require `phase === "playing"`
- require `tools.discard > 0`
- require at least one tile in slot
- decrement `tools.discard`
- remove the most recently added slot tile by default
- set that tile location to `removed`
- clear history
- render status `丢弃：移除 ${tileLabel(tile)}`

### Task 5: Verify Browser And Docs

**Files:**
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/progress/2026-06-01.md`

- [x] **Step 1: Run focused tests**

```bash
npm run test -w packages/shared -- mahjong-config-playable-prototype mahjong-config
```

Expected: PASS.

- [x] **Step 2: Check script syntax**

```bash
perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js
```

Expected: no output.

- [x] **Step 3: Browser smoke**

Open the default player page in Kimi WebBridge or Codex App browser. Verify:

- level 1 title says tutorial/peng
- slot count is 6
- right tools show `洗牌 / 撤回 / 丢弃`
- level 3 reward offers `主槽扩容`
- level 4 slot count is 8
- level 5 uses dense mountain mode

- [x] **Step 4: Docs and final checks**

Run:

```bash
npm run docs:sync
rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T093-hulebu-friend-playtest-demo.md docs/tasks/claims/T093-lee.md docs/superpowers/plans/2026-06-01-hulebu-friend-playtest-demo.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md
git diff --check
```

Expected: docs sync succeeds, placeholder scan prints nothing, diff check prints nothing.
