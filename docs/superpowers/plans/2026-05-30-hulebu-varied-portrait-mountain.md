# Hulebu Varied Portrait Mountain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the HTML config-playable mountain prototype vary by template, use every Mahjong tile identity, and render as a portrait-first board.

**Architecture:** Keep the change local to the HTML prototype and its tests. Add a lightweight prototype template registry that mirrors the existing 8 shared template names without touching the shared Graph-based generator or Cocos. Preserve the existing solvable group pipeline and first-clickable target.

**Tech Stack:** Single-file HTML/CSS/JavaScript prototype, Vitest VM/static tests, Kimi WebBridge or Codex App browser verification.

---

### Task 1: Register T087

**Files:**
- Create: `docs/tasks/items/T087-hulebu-varied-portrait-mountain.md`
- Create: `docs/tasks/claims/T087-lee.md`
- Modify: `docs/tasks/CHANGE_INTAKE.md`
- Modify: `docs/tasks/NEXT_ID.md`

- [x] **Step 1: Add task and claim files**

Create T087 task and claim files with file scope, forbidden scope, and verification commands.

- [x] **Step 2: Add change-intake card and bump next ID**

Add `IDEA-20260530-01` for the prototype template/portrait/full-tile coverage change and update `docs/tasks/NEXT_ID.md` from `087` to `088`.

### Task 2: Red Tests

**Files:**
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`
- Modify: `packages/shared/src/mahjong-config.test.ts`

- [x] **Step 1: Add static prototype assertions**

Assert that the prototype declares template IDs, `template` URL/form handling, portrait coordinate system, portrait board aspect ratio, and stack-depth badge support.

- [x] **Step 2: Add VM behavior assertions**

Assert that default level 1 has 240 tiles, 8-12 initial available tiles, all 34 tile identities, a template ID, and portrait coordinate dimensions. Assert that level 1 and level 2 use different auto templates.

- [x] **Step 3: Run tests and verify they fail**

Run `npm run test -w packages/shared -- mahjong-config-playable-prototype` and `npm run test -w packages/shared -- mahjong-config`. Expected: failures mention missing template constants, missing tile identities, or landscape coordinate system.

### Task 3: Prototype Implementation

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`

- [x] **Step 1: Add portrait board CSS and coordinate constants**

Change the mountain coordinate system to portrait dimensions, update board aspect ratio, and keep tile dimensions small.

- [x] **Step 2: Add template tuning**

Add `template` to URL/form tuning with `auto` default and an 8-template select in the tuner panel.

- [x] **Step 3: Add prototype template registry**

Implement 8 local template builders that create stacks and lanes for center tower, two wings, cross, ring, long wall, islands, canyon, and staircase.

- [x] **Step 4: Guarantee full tile identity coverage**

Replace suit-only coverage with a 34-identity queue where every `wan/tiao/tong` rank 1-9 and every honor rank 1-7 appears at least three times when the board has enough tiles.

- [x] **Step 5: Add visible stack depth badge**

Set `data-stack-depth` on visible stack-top tiles and render it with CSS so deep piles are readable without adding bulky text.

### Task 4: Verification And Docs

**Files:**
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/progress/2026-05-30.md`
- Create: `docs/completion/2026-05-30-task-T087-hulebu-varied-portrait-mountain.md`

- [x] **Step 1: Run automated checks**

Run both Vitest commands, JS syntax check from extracted script, docs sync, placeholder scan, and `git diff --check`.

- [x] **Step 2: Browser check**

Use Kimi WebBridge or Codex App browser to inspect default player page and tuner page. Confirm portrait board, varied templates, full tile coverage in counts, and around 8-12 initial clickables.

- [x] **Step 3: Update task and module docs**

Record implementation, verification, screenshot path, and remaining tuning risks.
