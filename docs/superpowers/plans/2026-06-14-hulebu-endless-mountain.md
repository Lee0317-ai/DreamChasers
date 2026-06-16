# 胡了卜无尽牌山第一版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first playable endless mountain mode for Hu Le Bu, starting at layer 21 and recording the local best layer.

**Architecture:** Keep the Next.js shell responsible for mode selection, local persistence, settlement, and iframe parameters. Keep the HTML prototype responsible for run progression and generated layers, reusing the existing mountain generator and reward pool without new config files.

**Tech Stack:** Next.js App Router, React client component, CSS modules, single-file HTML prototype, Vitest static tests.

---

### Task 1: Red Tests

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`

- [ ] Add expectations for `开始无尽`, `bestEndlessLayer`, `runMode`, `mode=endless`, `startLayer=21`, `ENDLESS_START_LAYER`, `isEndlessMode`, `getEndlessLayerOrder`, `advanceAfterEndlessClear`.
- [ ] Run `npm run test -w apps/web -- hulebu` and confirm it fails on the new missing strings.
- [ ] Run `npm run test -w packages/shared -- mahjong-config-playable-prototype` and confirm it fails on the new missing strings.

### Task 2: Shell Implementation

**Files:**
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- Modify: `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`

- [ ] Add `runMode` and optional `endlessLayer` to `ActiveRun`, `SettlementState`, shell messages, and persisted state.
- [ ] Add `buildEndlessFrameSrc(sessionKey, upgrades)` with `mode=endless`, `startLayer=21`, and existing upgrade params.
- [ ] Add `startEndlessRun()` and wire it to the `endless` panel.
- [ ] Update panel copy, top summary, settlement title, and metrics to show current and best endless layer.
- [ ] Persist `bestEndlessLayer` and update it on endless settlement.

### Task 3: Prototype Implementation

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- Modify: `apps/web/public/games/hulebu-demo/index.html`

- [ ] Add `ENDLESS_START_LAYER = 21` and `runMode: "mainline"` defaults.
- [ ] Parse `mode=endless` and `startLayer`.
- [ ] Add `isEndlessMode`, `getEndlessLayerOrder`, `getEndlessLevelIndex`, `getEndlessDifficultyProfile`, and `advanceAfterEndlessClear`.
- [ ] Make headers, HUD, shell payloads, boss goals, rewards, and next-layer flow use endless layer data.
- [ ] Keep mainline behavior unchanged.
- [ ] Copy the source prototype to the static web demo.

### Task 4: Docs And Verification

**Files:**
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/progress/2026-06-14-lee.md`
- Create: `docs/completion/2026-06-14-task-170-hulebu-endless-mountain.md`

- [ ] Update module docs with T170 completion notes.
- [ ] Run `npm run docs:sync`.
- [ ] Run both Vitest commands, typecheck, build, both `node --check` script extractions, placeholder scan, and `git diff --check`.
- [ ] Use the in-app browser to check `/games/hulebu` on desktop and 390px mobile.
