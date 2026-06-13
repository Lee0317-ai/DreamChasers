# 胡了卜特殊事件 Demo 第一版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在胡了卜朋友试玩 Demo 中加入第 6、8、10 关前的特殊事件选择，并让事件选择影响下一关。

**Architecture:** 继续沿用单 HTML 原型的现有状态机，不拆新模块。新增 run 级 special event 状态，关卡加载前先判断是否需要事件 overlay；玩家选择事件后写入下一关 modifier，再由 `loadLevel` 应用到工具次数、铜钱、工具禁用和牌山生成参数。

**Tech Stack:** HTML/CSS/Vanilla JavaScript 原型、Vitest 静态/VM 测试、Next.js 静态 iframe 接入。

---

## File Structure

- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`
  - 静态检查特殊事件常量、触发关卡、状态字段、函数名和 UI 文案。
- Modify: `packages/shared/src/mahjong-config.test.ts`
  - VM 行为测试事件触发、铜钱/道具收益、禁洗牌、禁透视和高压 modifier。
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
  - 源 HTML Demo 的事件池、状态、overlay、modifier 应用和 HUD 提示。
- Modify: `apps/web/public/games/hulebu-demo/index.html`
  - 站内静态发布副本，同步源 Demo，仅保留静态配置 fetch 路径。
- Modify docs:
  - `docs/tasks/items/T163-hulebu-special-events-demo.md`
  - `docs/tasks/claims/T163-lee.md`
  - `docs/modules/mahjong-roguelike/README.md`
  - `docs/modules/mahjong-roguelike/PROGRESS.md`
  - `docs/modules/mahjong-roguelike/HANDOFF.md`
  - `docs/progress/2026-06-13-lee.md`
  - `docs/completion/2026-06-13-task-163-hulebu-special-events-demo.md`

## Task 1: Red Tests For Event Contract

**Files:**
- Modify: `packages/shared/src/mahjong-config-playable-prototype.test.ts`
- Modify: `packages/shared/src/mahjong-config.test.ts`

- [ ] **Step 1: Add static checks for event contract**

Add a test that reads the prototype HTML and asserts these strings/functions exist:

```ts
expect(html).toContain("SPECIAL_EVENT_TRIGGER_LEVELS");
expect(html).toContain("SPECIAL_EVENT_POOL");
expect(html).toContain("maybeShowSpecialEventBeforeLevel");
expect(html).toContain("chooseSpecialEventOption");
expect(html).toContain("activeLevelModifier");
expect(html).toContain("pendingLevelModifier");
expect(html).toContain("路遇老雀");
expect(html).toContain("旧牌匣");
expect(html).toContain("加注一局");
expect(html).toContain("暗灯牌局");
expect(html).toContain("禁洗牌");
expect(html).toContain("禁透视");
expect(html).toContain("高压牌山");
```

- [ ] **Step 2: Add VM behavior helper**

Expose a helper from `packages/shared/src/mahjong-config.test.ts` that loads the HTML VM, calls `resetRun()`, `loadLevel(5)`, and returns:

```ts
{
  levelIndex: model.levelIndex,
  phase: model.levelState.phase,
  overlayTitle: document.querySelector("#rewardTitle")?.textContent?.trim(),
  overlayButtons: [...document.querySelectorAll("#rewardOptions button")].map((button) => button.textContent?.trim()),
  eventText: document.querySelector("#statusText")?.textContent?.trim(),
}
```

- [ ] **Step 3: Add VM tests for event effects**

Add tests that assert:

```ts
expect(readSpecialEventSummary(5).overlayTitle).toBe("路遇老雀");
chooseSpecialEventOption("old-tile-box", "discard");
expect(model.run.tools.discard).toBeGreaterThan(previousDiscard);
loadLevel(7);
chooseSpecialEventOption("dark-table", "disable-shuffle");
expect(model.run.pendingLevelModifier?.type).toBe("disableTool");
expect(model.run.pendingLevelModifier?.tool).toBe("shuffle");
loadLevel(7);
expect(model.levelState.activeLevelModifier?.tool).toBe("shuffle");
expect(canUseTool("shuffle")).toBe(false);
loadLevel(9);
chooseSpecialEventOption("raise-stakes", "high-pressure");
loadLevel(9);
expect(model.levelState.activeLevelModifier?.type).toBe("highPressure");
```

- [ ] **Step 4: Run red tests**

Run:

```bash
npm run test -w packages/shared -- mahjong-config-playable-prototype
npm run test -w packages/shared -- mahjong-config
```

Expected: tests fail because the event constants, functions and state fields are not implemented.

## Task 2: Implement Event State And Overlay

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`

- [ ] **Step 1: Add constants**

Add:

```js
const SPECIAL_EVENT_TRIGGER_LEVELS = [5, 7, 9];
const SPECIAL_EVENT_POOL = [
  {
    id: "old-sparrow",
    title: "路遇老雀",
    summary: "老雀递来几句牌桌门道。稳稳拿钱，或者赌下一关更肥。",
    options: [
      { id: "coins", label: "收下 80 铜钱", effect: { type: "coins", amount: 80 } },
      { id: "discard", label: "补 1 次丢弃", effect: { type: "tool", tool: "discard", amount: 1 } },
      { id: "pressure", label: "下一关高压，通关 +120 铜钱", effect: { type: "modifier", modifier: { type: "highPressure", rewardCoins: 120, label: "高压牌山" } } },
    ],
  },
  {
    id: "old-tile-box",
    title: "旧牌匣",
    summary: "牌匣里有旧道具，也可能藏着一局硬仗。",
    options: [
      { id: "shuffle", label: "补 1 次洗牌", effect: { type: "tool", tool: "shuffle", amount: 1 } },
      { id: "undo", label: "补 1 次撤回", effect: { type: "tool", tool: "undo", amount: 1 } },
      { id: "disable-peek", label: "下一关禁透视，通关 +100 铜钱", effect: { type: "modifier", modifier: { type: "disableTool", tool: "peek", rewardCoins: 100, label: "禁透视" } } },
    ],
  },
  {
    id: "raise-stakes",
    title: "加注一局",
    summary: "桌面风向变急。可以保守拿补给，也可以主动加压。",
    options: [
      { id: "coins", label: "先拿 60 铜钱", effect: { type: "coins", amount: 60 } },
      { id: "discard", label: "补 1 次丢弃", effect: { type: "tool", tool: "discard", amount: 1 } },
      { id: "high-pressure", label: "下一关高压，通关 +140 铜钱", effect: { type: "modifier", modifier: { type: "highPressure", rewardCoins: 140, label: "高压牌山" } } },
    ],
  },
  {
    id: "dark-table",
    title: "暗灯牌局",
    summary: "灯暗一半，手感全靠记牌。接受限制，收益更高。",
    options: [
      { id: "avoid", label: "花 40 铜钱避开", effect: { type: "coins", amount: -40 } },
      { id: "disable-shuffle", label: "下一关禁洗牌，通关 +120 铜钱", effect: { type: "modifier", modifier: { type: "disableTool", tool: "shuffle", rewardCoins: 120, label: "禁洗牌" } } },
      { id: "disable-peek", label: "下一关禁透视，通关 +120 铜钱", effect: { type: "modifier", modifier: { type: "disableTool", tool: "peek", rewardCoins: 120, label: "禁透视" } } },
    ],
  },
];
```

- [ ] **Step 2: Add run and level state fields**

Add to reset/run state:

```js
specialEventsSeen: [],
pendingSpecialEvent: null,
pendingLevelModifier: null,
lastSpecialEventMessage: "",
```

Add to level state:

```js
activeLevelModifier: null,
specialEventMessage: "",
```

- [ ] **Step 3: Add event trigger function**

Implement:

```js
function maybeShowSpecialEventBeforeLevel(levelIndex) {
  if (!isPlayView()) return false;
  if (!SPECIAL_EVENT_TRIGGER_LEVELS.includes(levelIndex)) return false;
  if (model.run.specialEventsSeen.includes(levelIndex)) return false;
  const event = SPECIAL_EVENT_POOL[model.run.specialEventsSeen.length % SPECIAL_EVENT_POOL.length];
  model.run.pendingSpecialEvent = event;
  model.run.specialEventsSeen.push(levelIndex);
  model.levelState.phase = "event";
  showSpecialEventOverlay(event);
  renderAll();
  return true;
}
```

- [ ] **Step 4: Add overlay functions**

Implement `showSpecialEventOverlay(event)` and `chooseSpecialEventOption(eventId, optionId)` using the existing reward overlay DOM. Button click should apply the effect, close overlay, and call `loadLevel(model.levelIndex)`.

- [ ] **Step 5: Apply immediate effects**

For `coins`, clamp at 0:

```js
model.run.coins = Math.max(0, model.run.coins + amount);
```

For `tool`, increment `model.run.tools[tool]`.

For `modifier`, set `model.run.pendingLevelModifier`.

## Task 3: Apply Modifiers To Level

**Files:**
- Modify: `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`

- [ ] **Step 1: Apply pending modifier during level load**

In `loadLevel`, move `model.run.pendingLevelModifier` into `levelState.activeLevelModifier` after creating fresh level state, then clear pending.

- [ ] **Step 2: Disable tools**

Update tool availability checks so:

```js
function isToolDisabledByModifier(tool) {
  return model.levelState.activeLevelModifier?.type === "disableTool" && model.levelState.activeLevelModifier.tool === tool;
}
```

`useTool("shuffle")` and `useTool("peek")` should show a status message and return early when disabled.

- [ ] **Step 3: High pressure modifier**

When `activeLevelModifier.type === "highPressure"`, increase generated tile count by a small amount for the current level and prefer high pressure auto templates without changing teaching levels. Keep existing first-window safety fallback.

- [ ] **Step 4: Reward coins on level clear**

When a level with `activeLevelModifier.rewardCoins` completes, add those coins once and include the label in the status message.

- [ ] **Step 5: HUD/status display**

Add modifier text to HUD goal/status:

```js
const modifier = model.levelState.activeLevelModifier;
if (modifier) parts.push(`事件 ${modifier.label}`);
```

## Task 4: Sync Static Demo

**Files:**
- Modify: `apps/web/public/games/hulebu-demo/index.html`

- [ ] **Step 1: Copy source HTML to static demo**

Run:

```bash
cp apps/game/mahjong-roguelike/prototypes/config-playable/index.html apps/web/public/games/hulebu-demo/index.html
```

- [ ] **Step 2: Restore static fetch paths**

Ensure static demo uses:

```js
fetch("/games/hulebu-demo/config/levels.json")
fetch("/games/hulebu-demo/config/rewards.json")
```

- [ ] **Step 3: Compare source/static except fetch paths**

Run a small diff script that normalizes those two fetch paths and confirms there are no other differences.

## Task 5: Browser And Docs Verification

**Files:**
- Modify docs listed in T163 task file.

- [ ] **Step 1: Run full test suite for T163**

Run:

```bash
npm run test -w packages/shared -- mahjong-config-playable-prototype
npm run test -w packages/shared -- mahjong-config
npm run test -w apps/web -- hulebu
```

- [ ] **Step 2: Run HTML script syntax check**

Parse inline scripts for both HTML files with `vm.Script`.

- [ ] **Step 3: Browser desktop check**

Start `npm run dev -w apps/web -- --hostname 127.0.0.1 --port 3000`, open `/games/hulebu`, and verify the iframe renders. Open `/games/hulebu-demo/index.html`, jump to event trigger levels, and confirm the event overlay appears.

- [ ] **Step 4: Browser 390px check**

At 390 x 844, confirm the event overlay buttons fit and do not collide with card slot or fixed tool bar.

- [ ] **Step 5: Update docs**

Update task, claim, module README/PROGRESS/HANDOFF, daily progress and completion record with implementation and verification results.

- [ ] **Step 6: Final checks**

Run:

```bash
npm run docs:sync
rg -n "T\\[B\\]D|T\\[O\\]DO|待\\[补\\]" docs/tasks/items/T163-hulebu-special-events-demo.md docs/tasks/claims/T163-lee.md docs/superpowers/specs/2026-06-13-hulebu-special-events-demo-design.md docs/superpowers/plans/2026-06-13-hulebu-special-events-demo.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-13-lee.md docs/completion/2026-06-13-task-163-hulebu-special-events-demo.md
git diff --check
```

Expected: `docs:sync` succeeds, placeholder scan has no matches, diff check exits 0.

---

## Self-Review

- Spec coverage: trigger levels, event categories, modifier state, UI, non-goals and verification are covered.
- Placeholder scan: this plan contains no placeholder markers.
- Type consistency: event ids, function names and modifier fields are consistent across tasks.
