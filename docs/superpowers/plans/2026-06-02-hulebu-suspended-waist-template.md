# 胡了卜悬台窄腰模板 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the `suspended-waist` mountain template to the Hu le Bu HTML prototype and station static tuner without changing the default friend-demo auto template pool.

**Architecture:** The current HTML prototype owns its local dense-mountain templates in `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`. This task extends that local template registry only, adds structural region metadata to generated positions for testing, then syncs the static station copy under `apps/web/public/games/hulebu-demo/`.

**Tech Stack:** HTML/CSS/JavaScript prototype, Vitest, Node script syntax check, Kimi WebBridge or browser automation.

---

### Task 1: Add Failing Tests For `suspended-waist`

**Files:**
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`
- Modify: `packages/shared/src/mahjong-config.test.ts`

- [x] **Step 1: Extend the static prototype test**

Add expectations inside the existing `密集牌山默认使用数百张小牌压力版参数` test:

```ts
expect(playHtml).toContain('"suspended-waist"');
expect(playHtml).toContain('"suspended-waist": "悬台窄腰"');
expect(playHtml).toContain("templateRegion");
expect(playHtml).toContain("function getSuspendedWaistTemplateAnchors");
expect(playHtml).toContain('"top-platform"');
expect(playHtml).toContain('"waist"');
expect(playHtml).toContain('"support-column"');
expect(playHtml).toContain('"side-scatter"');
```

- [x] **Step 2: Extend the VM summary types**

In `packages/shared/src/mahjong-config.test.ts`, add these fields to `PrototypeMountainSummary`:

```ts
templateRegions: string[];
autoTemplateIds: string[];
```

Then update the summary object in `readPrototypeMountainSummary` to return:

```ts
templateRegions: Array.from(new Set(generatedTiles.map((tile) => String(tile.templateRegion ?? "")).filter(Boolean))).sort(),
autoTemplateIds: MOUNTAIN_AUTO_TEMPLATE_IDS,
```

- [x] **Step 3: Add a VM behavior test for the fixed tuner template**

Add this test near the other dense-mountain template tests:

```ts
it("调牌器可以指定悬台窄腰模板且默认 auto 池暂不使用它", () => {
  const summary = readPrototypeMountainSummary(
    10,
    "?view=tuner&mode=mountain&level=10&template=suspended-waist&seed=waist-check",
  );

  expect(summary.tuning.templateId).toBe("suspended-waist");
  expect(summary.templateId).toBe("suspended-waist");
  expect(summary.templateLabel).toBe("悬台窄腰");
  expect(summary.count).toBe(240);
  expect(summary.initialAvailable).toBeGreaterThanOrEqual(3);
  expect(summary.initialAvailable).toBeLessThanOrEqual(8);
  expect(summary.initialMaxSolutionGroupAvailable).toBeLessThanOrEqual(2);
  expect(summary.initialCompleteSolutionGroups).toEqual([]);
  expect(summary.templateRegions).toEqual(["side-scatter", "support-column", "top-platform", "waist"]);
  expect(summary.autoTemplateIds).not.toContain("suspended-waist");
});
```

- [x] **Step 4: Run tests and verify they fail**

Run:

```bash
npm run test -w packages/shared -- mahjong-config-playable-prototype
npm run test -w packages/shared -- mahjong-config
```

Expected:
- Static test fails because `suspended-waist` and region markers are missing.
- VM test fails because `template=suspended-waist` normalizes to `auto` or an existing template.

### Task 2: Implement The Local Prototype Template

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`

- [x] **Step 1: Add the template ID and label**

Add `"suspended-waist"` to `MOUNTAIN_TEMPLATE_IDS`, but do not add it to `MOUNTAIN_AUTO_TEMPLATE_IDS`.

Add the label:

```js
"suspended-waist": "悬台窄腰",
```

- [x] **Step 2: Preserve template region metadata during stack generation**

In `createMountainPositions`, pass `templateRegion: anchor.templateRegion` into `addTemplateStackPositions`.

In `addTemplateStackPositions`, include:

```js
templateRegion: stack.templateRegion,
```

- [x] **Step 3: Add a dedicated anchor helper**

Add:

```js
function getSuspendedWaistTemplateAnchors() {
  return [
    [206, 122, 1.28, "top-platform"], [276, 116, 1.42, "top-platform"], [346, 120, 1.42, "top-platform"], [418, 134, 1.24, "top-platform"],
    [188, 214, 1.18, "top-platform"], [262, 220, 1.3, "top-platform"], [336, 224, 1.3, "top-platform"], [444, 226, 1.08, "top-platform"],
    [292, 318, 1.35, "waist"], [352, 342, 1.24, "waist"],
    [276, 438, 1.18, "waist"], [376, 456, 1.08, "waist"],
    [224, 578, 1.12, "support-column"], [314, 628, 1.22, "support-column"], [426, 588, 1.12, "support-column"],
    [116, 380, 0.74, "side-scatter"], [502, 374, 0.74, "side-scatter"], [130, 700, 0.68, "side-scatter"], [500, 724, 0.68, "side-scatter"],
  ];
}
```

- [x] **Step 4: Wire the helper into `getMountainTemplateAnchors`**

Inside the `templates` object, add:

```js
"suspended-waist": getSuspendedWaistTemplateAnchors(),
```

Update the `.map` destructuring to handle region:

```js
return (templates[templateId] ?? templates["center-tower"]).map(([x, y, weight, templateRegion], index) => ({
  id: `${templateId}-${index + 1}`,
  x: scaleMountainTemplateCoordinate(x, "x"),
  y: scaleMountainTemplateCoordinate(y, "y"),
  weight,
  templateRegion,
  stackBase: index * 700,
  row: index,
  col: index,
}));
```

- [x] **Step 5: Run the focused tests and verify they pass**

Run:

```bash
npm run test -w packages/shared -- mahjong-config-playable-prototype
npm run test -w packages/shared -- mahjong-config
```

Expected:
- Static and VM tests pass.

### Task 3: Sync Station Static Copy And Verify Browser Behavior

**Files:**
- Modify: `apps/web/public/games/hulebu-demo/index.html`
- Modify: `apps/web/public/games/hulebu-demo/tuner.html`
- Modify: `apps/web/public/games/hulebu-demo/config/levels.json` only if the source config changed
- Modify: `apps/web/public/games/hulebu-demo/config/rewards.json` only if the source config changed

- [x] **Step 1: Copy the source prototype to the station static folder**

Run:

```bash
cp apps/game/mahjong-roguelike/prototypes/config-playable/index.html apps/web/public/games/hulebu-demo/index.html
cp apps/game/mahjong-roguelike/prototypes/config-playable/tuner.html apps/web/public/games/hulebu-demo/tuner.html
```

- [x] **Step 2: Patch static fetch paths**

In `apps/web/public/games/hulebu-demo/index.html`, ensure the fetch calls are:

```js
fetch("/games/hulebu-demo/config/levels.json")
fetch("/games/hulebu-demo/config/rewards.json")
```

- [x] **Step 3: Run script syntax and web route tests**

Run:

```bash
perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js
npm run test -w apps/web -- hulebu
```

Expected:
- `node --check` exits 0.
- Web hulebu tests pass.

- [x] **Step 4: Browser check the tuner URL**

Use Kimi WebBridge or browser automation to open:

```text
http://127.0.0.1:3000/games/hulebu-demo/tuner.html?template=suspended-waist&level=10&seed=waist-check
```

Expected:
- The page loads.
- The active template is `悬台窄腰`.
- The generated board has no horizontal overflow.

### Task 4: Update Documentation And Final Verification

**Files:**
- Modify: `docs/tasks/items/T104-hulebu-suspended-waist-template.md`
- Modify: `docs/tasks/claims/T104-lee.md`
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/progress/2026-06-02-lee.md`
- Create: `docs/completion/2026-06-02-task-T104-hulebu-suspended-waist-template.md`

- [x] **Step 1: Update task and module docs**

Record that `suspended-waist` is implemented for the tuner only and default auto does not include it yet.

- [x] **Step 2: Mark T104 as待验收**

Update `docs/tasks/items/T104-hulebu-suspended-waist-template.md` and `docs/tasks/claims/T104-lee.md`.

- [x] **Step 3: Run docs sync and final checks**

Run:

```bash
npm run docs:sync
rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T104-hulebu-suspended-waist-template.md docs/tasks/claims/T104-lee.md docs/superpowers/plans/2026-06-02-hulebu-suspended-waist-template.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md docs/completion/2026-06-02-task-T104-hulebu-suspended-waist-template.md
git diff --check
```

Expected:
- `docs:sync` exits 0.
- Placeholder scan exits 1 with no matches.
- `git diff --check` exits 0.

---

## Self-Review

Spec coverage:
- Template ID and label: Task 1 and Task 2.
- Tuner URL support: Task 1 VM test and Task 3 browser check.
- Four structure regions: Task 1 tests and Task 2 metadata.
- Auto pool exclusion: Task 1 VM test and Task 2 implementation.
- Static station copy: Task 3.
- Docs and verification: Task 4.

No placeholder steps remain. Function names and field names are consistent across tasks: `suspended-waist`, `templateRegion`, and `getSuspendedWaistTemplateAnchors`.
