# 胡了卜高阶周目第一版 Implementation Plan

**Goal:** Add the first ascension pass to `/games/hulebu`, with shell entry, local unlock state, and fixed ascension modifiers carried into the playable prototype.

**Architecture:** Keep the Next.js shell responsible for unlock state, entry, summaries, and panel copy. Keep the HTML prototype responsible for parsing ascension parameters, exposing the current ascension in HUD/shell payloads, and applying a small fixed modifier set on top of the existing 20-level structure.

**Tech Stack:** Next.js App Router, React client component, CSS modules, single-file HTML prototype, Vitest static tests.

---

### Task 1: Red Tests

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`

- [ ] Add expectations for ascension entry, ascension fields, fixed modifier copy, and prototype parsing.
- [ ] Run `npm run test -w apps/web -- hulebu`.
- [ ] Run `npm run test -w packages/shared -- mahjong-config-playable-prototype`.

### Task 2: Shell Implementation

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`

- [ ] Add local ascension unlock state and shell entry.
- [ ] Add panel copy, progress summary, and start action for ascension.
- [ ] Show current ascension name and modifier summary in lobby and active-run shell.

### Task 3: Prototype Implementation

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- Modify: `apps/web/public/games/hulebu-demo/index.html`

- [ ] Parse ascension params and expose current ascension in HUD/shell payloads.
- [ ] Apply a small fixed modifier set for the first 1-2 ascension levels.
- [ ] Keep mainline, endless, and daily flows intact.

### Task 4: Docs And Verification

**Files:**
- Modify: `docs/tasks/items/T173-hulebu-ascension-first-pass.md`
- Modify: `docs/tasks/claims/T173-lee.md`
- Modify: `docs/status/CURRENT_STATUS.md`
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/progress/2026-06-15-lee.md`
- Create: `docs/completion/2026-06-15-task-173-hulebu-ascension-first-pass.md`

- [ ] Update task/docs status and module docs with T173 notes.
- [ ] Run tests, typecheck, build, both `node --check` extractions, `npm run docs:sync`, placeholder scan, and `git diff --check`.
- [ ] Use the in-app browser to check `/games/hulebu` on desktop and 390px mobile.
