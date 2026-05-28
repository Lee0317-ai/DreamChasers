# Hulebu Mountain Generator Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an engine-agnostic graph-based mountain generator foundation for Hulebu before changing any Cocos presentation code.

**Architecture:** Add a shared TypeScript generator in `packages/shared` that creates a `MountainSkeleton`, builds a `SolutionTrace`, assigns mahjong faces, simulates the trace, and emits a `DifficultyReport`. Cocos remains a consumer of generated level config data and is not modified in this plan.

**Tech Stack:** TypeScript, Vitest, existing npm workspace scripts, existing Hulebu mahjong rule concepts.

---

## File Structure

- Create `packages/shared/src/mahjong-mountain-generator.ts`
  - Owns generator types, seeded random, skeleton templates, blocker graph calculation, solution trace, face assignment, simulation, and difficulty report.
- Create `packages/shared/src/mahjong-mountain-generator.test.ts`
  - Tests the generator without Cocos.
- Modify `packages/shared/src/index.ts`
  - Exports the generator API for future Cocos or HTML prototype consumers.
- Modify `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`
  - Records implementation status and how Cocos should consume generated output later.
- Modify the task and claim fragments for the implementation task created after T079 review.

## Task 1: Core Types And Blocker Graph

**Files:**
- Create: `packages/shared/src/mahjong-mountain-generator.ts`
- Create: `packages/shared/src/mahjong-mountain-generator.test.ts`

- [ ] **Step 1: Write the failing graph test**

Add this test to `packages/shared/src/mahjong-mountain-generator.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildBlockerGraph, getInitialFreeNodeIds, type MountainNode } from "./mahjong-mountain-generator";

describe("胡了卜 Graph-based 牌山生成器", () => {
  it("builds blocker graph and initial clickable window from overlapping higher layers", () => {
    const nodes: MountainNode[] = [
      { id: "bottom", x: 100, y: 100, layer: 0, width: 52, height: 70, blockedBy: [], blocks: [], tags: [] },
      { id: "top", x: 100, y: 100, layer: 1, width: 52, height: 70, blockedBy: [], blocks: [], tags: [] },
      { id: "side", x: 180, y: 100, layer: 0, width: 52, height: 70, blockedBy: [], blocks: [], tags: [] },
    ];

    const graph = buildBlockerGraph(nodes, 0.05);

    expect(graph.nodes.find((node) => node.id === "bottom")?.blockedBy).toEqual(["top"]);
    expect(graph.nodes.find((node) => node.id === "top")?.blocks).toEqual(["bottom"]);
    expect(getInitialFreeNodeIds(graph)).toEqual(["side", "top"]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
```

Expected: FAIL because `mahjong-mountain-generator.ts` does not exist.

- [ ] **Step 3: Implement the core graph helpers**

Create `packages/shared/src/mahjong-mountain-generator.ts`:

```ts
export type HulebuTileSuit = "wan" | "tiao" | "tong" | "honor";
export type HulebuComboType = "peng" | "chi" | "gang" | "hu";
export type DifficultyGrade = "easy" | "normal" | "hard" | "extreme";

export interface MountainNode {
  id: string;
  x: number;
  y: number;
  layer: number;
  width: number;
  height: number;
  blockedBy: string[];
  blocks: string[];
  tags: string[];
}

export interface MountainSkeleton {
  id: string;
  templateId: string;
  seed: string;
  nodes: MountainNode[];
}

export function buildBlockerGraph(nodes: MountainNode[], overlapThreshold: number): MountainSkeleton {
  const nextNodes = nodes.map((node) => ({
    ...node,
    blockedBy: [],
    blocks: [],
    tags: [...node.tags],
  }));

  nextNodes.forEach((node) => {
    nextNodes.forEach((candidate) => {
      if (candidate.id === node.id || candidate.layer <= node.layer) {
        return;
      }

      if (getOverlapRatio(node, candidate) > overlapThreshold) {
        node.blockedBy.push(candidate.id);
        candidate.blocks.push(node.id);
      }
    });
  });

  nextNodes.forEach((node) => {
    node.blockedBy.sort();
    node.blocks.sort();
  });

  return {
    id: "manual-skeleton",
    templateId: "manual",
    seed: "manual",
    nodes: nextNodes,
  };
}

export function getInitialFreeNodeIds(skeleton: Pick<MountainSkeleton, "nodes">): string[] {
  return skeleton.nodes
    .filter((node) => node.blockedBy.length === 0)
    .map((node) => node.id)
    .sort();
}

export function getOverlapRatio(base: Pick<MountainNode, "x" | "y" | "width" | "height">, blocker: Pick<MountainNode, "x" | "y" | "width" | "height">): number {
  const left = Math.max(base.x - base.width / 2, blocker.x - blocker.width / 2);
  const right = Math.min(base.x + base.width / 2, blocker.x + blocker.width / 2);
  const top = Math.max(base.y - base.height / 2, blocker.y - blocker.height / 2);
  const bottom = Math.min(base.y + base.height / 2, blocker.y + blocker.height / 2);
  const overlapWidth = Math.max(0, right - left);
  const overlapHeight = Math.max(0, bottom - top);
  return (overlapWidth * overlapHeight) / (base.width * base.height);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
```

Expected: PASS.

## Task 2: Template Skeleton Generator

**Files:**
- Modify: `packages/shared/src/mahjong-mountain-generator.ts`
- Modify: `packages/shared/src/mahjong-mountain-generator.test.ts`

- [ ] **Step 1: Write the failing template test**

Append this test:

```ts
import { createMountainSkeleton } from "./mahjong-mountain-generator";

it("creates a deterministic template-random center tower skeleton", () => {
  const skeleton = createMountainSkeleton({
    mode: "template-random",
    templateId: "center-tower",
    seed: "foundation-seed",
    tileCount: 48,
    maxLayer: 6,
    initialFreeRange: [6, 12],
    randomness: 0.35,
    crossCoverRate: 0.35,
    stackColumnRate: 0.45,
  });

  const second = createMountainSkeleton({
    mode: "template-random",
    templateId: "center-tower",
    seed: "foundation-seed",
    tileCount: 48,
    maxLayer: 6,
    initialFreeRange: [6, 12],
    randomness: 0.35,
    crossCoverRate: 0.35,
    stackColumnRate: 0.45,
  });

  expect(skeleton.nodes).toHaveLength(48);
  expect(skeleton.nodes).toEqual(second.nodes);
  expect(getInitialFreeNodeIds(skeleton).length).toBeGreaterThanOrEqual(6);
  expect(getInitialFreeNodeIds(skeleton).length).toBeLessThanOrEqual(12);
  expect(Math.max(...skeleton.nodes.map((node) => node.layer))).toBeLessThanOrEqual(5);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
```

Expected: FAIL because `createMountainSkeleton` is missing.

- [ ] **Step 3: Implement deterministic template generation**

Add these exports to `mahjong-mountain-generator.ts`:

```ts
export interface MountainSkeletonConfig {
  mode: "template-random" | "template-fixed";
  templateId: "center-tower" | "two-wings";
  seed: string;
  tileCount: number;
  maxLayer: number;
  initialFreeRange: [number, number];
  randomness: number;
  crossCoverRate: number;
  stackColumnRate: number;
}

export function createMountainSkeleton(config: MountainSkeletonConfig): MountainSkeleton {
  const random = createSeededRandom(config.seed);
  const normalizedTileCount = Math.max(12, Math.round(config.tileCount / 3) * 3);
  const columnCount = Math.max(8, Math.ceil(normalizedTileCount / Math.max(3, config.maxLayer - 1)));
  const centers = createTemplateCenters(config.templateId, columnCount);
  const nodes: MountainNode[] = [];

  centers.forEach((center, columnIndex) => {
    const remainingSlots = normalizedTileCount - nodes.length;
    const remainingColumns = centers.length - columnIndex;
    const baseDepth = Math.max(1, Math.floor(remainingSlots / remainingColumns));
    const randomDepth = random() < config.stackColumnRate ? 1 : 0;
    const depth = Math.min(config.maxLayer, Math.max(1, baseDepth + randomDepth));

    for (let layer = 0; layer < depth && nodes.length < normalizedTileCount; layer += 1) {
      const jitter = config.mode === "template-fixed" ? 0 : Math.round((random() - 0.5) * 10 * config.randomness);
      nodes.push({
        id: `n${String(nodes.length).padStart(3, "0")}`,
        x: center.x + jitter,
        y: center.y + Math.round((random() - 0.5) * 8 * config.randomness),
        layer,
        width: 52,
        height: 70,
        blockedBy: [],
        blocks: [],
        tags: [center.tag],
      });
    }
  });

  const graph = buildBlockerGraph(nodes, 0.05);
  return {
    ...graph,
    id: `${config.templateId}:${config.seed}`,
    templateId: config.templateId,
    seed: config.seed,
  };
}

function createTemplateCenters(templateId: MountainSkeletonConfig["templateId"], columnCount: number): Array<{ x: number; y: number; tag: string }> {
  if (templateId === "two-wings") {
    return Array.from({ length: columnCount }, (_, index) => {
      const side = index % 2 === 0 ? -1 : 1;
      const row = Math.floor(index / 2);
      return {
        x: 310 + side * (62 + (row % 3) * 24),
        y: 180 + row * 28,
        tag: side < 0 ? "left-wing" : "right-wing",
      };
    });
  }

  return Array.from({ length: columnCount }, (_, index) => {
    const angle = (index / columnCount) * Math.PI * 2;
    const radius = 34 + (index % 4) * 18;
    return {
      x: Math.round(310 + Math.cos(angle) * radius),
      y: Math.round(190 + Math.sin(angle) * radius),
      tag: index % 3 === 0 ? "center" : "tower-ring",
    };
  });
}

export function createSeededRandom(seed: string): () => number {
  let state = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    state ^= seed.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }

  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
```

- [ ] **Step 4: Run the test**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
```

Expected: PASS.

## Task 3: Solution Trace And Face Assignment

**Files:**
- Modify: `packages/shared/src/mahjong-mountain-generator.ts`
- Modify: `packages/shared/src/mahjong-mountain-generator.test.ts`

- [ ] **Step 1: Write the failing solution test**

Append this test:

```ts
import { assignFacesAlongSolution, createSolutionTrace } from "./mahjong-mountain-generator";

it("creates a solution trace and assigns matching mahjong faces to each step", () => {
  const skeleton = createMountainSkeleton({
    mode: "template-random",
    templateId: "two-wings",
    seed: "solution-seed",
    tileCount: 36,
    maxLayer: 5,
    initialFreeRange: [6, 12],
    randomness: 0.25,
    crossCoverRate: 0.25,
    stackColumnRate: 0.4,
  });

  const trace = createSolutionTrace(skeleton, { comboOrder: ["peng", "chi", "peng", "gang"] });
  const assignment = assignFacesAlongSolution(skeleton, trace, "face-seed");

  expect(trace.steps.length).toBeGreaterThanOrEqual(8);
  expect(trace.steps[0]?.nodeIds).toHaveLength(3);
  expect(assignment.facesByNodeId.size).toBe(skeleton.nodes.length);
  const firstStepFaces = trace.steps[0]!.nodeIds.map((nodeId) => assignment.facesByNodeId.get(nodeId));
  expect(new Set(firstStepFaces.map((face) => `${face?.suit}-${face?.rank}`)).size).toBe(1);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
```

Expected: FAIL because solution and assignment helpers are missing.

- [ ] **Step 3: Implement a first deterministic trace and assignment**

Add this implementation:

```ts
export interface SolutionTraceConfig {
  comboOrder: HulebuComboType[];
}

export interface SolutionStep {
  stepIndex: number;
  comboType: HulebuComboType;
  nodeIds: string[];
  unlockedNodeIds: string[];
}

export interface SolutionTrace {
  steps: SolutionStep[];
}

export interface TileFace {
  suit: HulebuTileSuit;
  rank: number;
}

export interface FaceAssignment {
  facesByNodeId: Map<string, TileFace>;
}

export function createSolutionTrace(skeleton: MountainSkeleton, config: SolutionTraceConfig): SolutionTrace {
  const remaining = new Set(skeleton.nodes.map((node) => node.id));
  const steps: SolutionStep[] = [];

  while (remaining.size >= 3) {
    const free = skeleton.nodes
      .filter((node) => remaining.has(node.id))
      .filter((node) => node.blockedBy.every((blockerId) => !remaining.has(blockerId)))
      .sort((a, b) => b.layer - a.layer || a.id.localeCompare(b.id));

    if (free.length < 3) {
      break;
    }

    const comboType = config.comboOrder[steps.length % config.comboOrder.length] ?? "peng";
    const takeCount = comboType === "gang" && free.length >= 4 ? 4 : 3;
    const picked = free.slice(0, takeCount);
    picked.forEach((node) => remaining.delete(node.id));
    const nextFree = skeleton.nodes
      .filter((node) => remaining.has(node.id))
      .filter((node) => node.blockedBy.every((blockerId) => !remaining.has(blockerId)))
      .map((node) => node.id);

    steps.push({
      stepIndex: steps.length,
      comboType,
      nodeIds: picked.map((node) => node.id),
      unlockedNodeIds: nextFree,
    });
  }

  return { steps };
}

export function assignFacesAlongSolution(skeleton: MountainSkeleton, trace: SolutionTrace, seed: string): FaceAssignment {
  const random = createSeededRandom(seed);
  const facesByNodeId = new Map<string, TileFace>();
  const suits: HulebuTileSuit[] = ["wan", "tiao", "tong"];

  trace.steps.forEach((step, stepIndex) => {
    const suit = suits[stepIndex % suits.length];
    const rank = 1 + Math.floor(random() * 7);
    const faces = createFacesForStep(step.comboType, suit, rank);
    step.nodeIds.forEach((nodeId, index) => {
      facesByNodeId.set(nodeId, faces[index] ?? faces[0]!);
    });
  });

  skeleton.nodes.forEach((node, index) => {
    if (!facesByNodeId.has(node.id)) {
      facesByNodeId.set(node.id, {
        suit: suits[index % suits.length],
        rank: 1 + (index % 9),
      });
    }
  });

  return { facesByNodeId };
}

function createFacesForStep(comboType: HulebuComboType, suit: HulebuTileSuit, rank: number): TileFace[] {
  if (comboType === "chi") {
    const start = Math.min(rank, 7);
    return [
      { suit, rank: start },
      { suit, rank: start + 1 },
      { suit, rank: start + 2 },
    ];
  }

  return Array.from({ length: comboType === "gang" ? 4 : 3 }, () => ({ suit, rank }));
}
```

- [ ] **Step 4: Run the test**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
```

Expected: PASS.

## Task 4: Difficulty Report And Public Generator API

**Files:**
- Modify: `packages/shared/src/mahjong-mountain-generator.ts`
- Modify: `packages/shared/src/mahjong-mountain-generator.test.ts`
- Modify: `packages/shared/src/index.ts`

- [ ] **Step 1: Write the failing API test**

Append:

```ts
import { generateHulebuMountain } from "./mahjong-mountain-generator";

it("generates skeleton, solution, face assignment, and difficulty report in one call", () => {
  const result = generateHulebuMountain({
    mode: "template-random",
    templateId: "center-tower",
    seed: "api-seed",
    tileCount: 48,
    maxLayer: 6,
    initialFreeRange: [6, 12],
    randomness: 0.35,
    crossCoverRate: 0.35,
    stackColumnRate: 0.45,
    comboOrder: ["peng", "chi", "peng", "gang"],
    targetDifficulty: "normal",
  });

  expect(result.skeleton.nodes).toHaveLength(48);
  expect(result.solution.steps.length).toBeGreaterThan(8);
  expect(result.assignment.facesByNodeId.size).toBe(48);
  expect(result.difficulty.initialFreeCount).toBeGreaterThanOrEqual(6);
  expect(result.difficulty.grade).toMatch(/easy|normal|hard|extreme/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
```

Expected: FAIL because `generateHulebuMountain` is missing.

- [ ] **Step 3: Implement difficulty report and generator API**

Add:

```ts
export interface HulebuMountainGeneratorConfig extends MountainSkeletonConfig {
  comboOrder: HulebuComboType[];
  targetDifficulty: DifficultyGrade;
}

export interface DifficultyReport {
  tileCount: number;
  maxLayer: number;
  initialFreeCount: number;
  solutionStepCount: number;
  maxStepWidth: number;
  score: number;
  grade: DifficultyGrade;
}

export interface HulebuMountainGenerationResult {
  skeleton: MountainSkeleton;
  solution: SolutionTrace;
  assignment: FaceAssignment;
  difficulty: DifficultyReport;
}

export function generateHulebuMountain(config: HulebuMountainGeneratorConfig): HulebuMountainGenerationResult {
  const skeleton = createMountainSkeleton(config);
  const solution = createSolutionTrace(skeleton, { comboOrder: config.comboOrder });
  const assignment = assignFacesAlongSolution(skeleton, solution, `${config.seed}:faces`);
  const difficulty = evaluateDifficulty(skeleton, solution);
  return {
    skeleton,
    solution,
    assignment,
    difficulty,
  };
}

export function evaluateDifficulty(skeleton: MountainSkeleton, solution: SolutionTrace): DifficultyReport {
  const initialFreeCount = getInitialFreeNodeIds(skeleton).length;
  const maxLayer = Math.max(...skeleton.nodes.map((node) => node.layer));
  const maxStepWidth = Math.max(...solution.steps.map((step) => step.nodeIds.length));
  const score = maxLayer * 12 + skeleton.nodes.length + Math.max(0, 10 - initialFreeCount) * 8;
  const grade: DifficultyGrade = score >= 130 ? "extreme" : score >= 100 ? "hard" : score >= 70 ? "normal" : "easy";

  return {
    tileCount: skeleton.nodes.length,
    maxLayer,
    initialFreeCount,
    solutionStepCount: solution.steps.length,
    maxStepWidth,
    score,
    grade,
  };
}
```

- [ ] **Step 4: Export the module**

Modify `packages/shared/src/index.ts`:

```ts
export * from "./mahjong-game";
export * from "./mahjong-presentation";
export * from "./mahjong-cocos-scene";
export * from "./mahjong-mountain-generator";
```

If `index.ts` currently exports fewer modules, preserve its existing exports and add only the new generator export.

- [ ] **Step 5: Run tests and typecheck**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
npm run typecheck -w packages/shared
```

Expected: both pass.

## Task 5: Documentation And Task Handoff

**Files:**
- Modify: `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`
- Modify: current implementation task fragment and claim fragment
- Modify: `docs/progress/YYYY-MM-DD.md`

- [ ] **Step 1: Update module generator foundation doc**

Add this section to `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`:

```md
## Implementation Status

The first shared generator foundation now exists in `packages/shared/src/mahjong-mountain-generator.ts`.

It can:

- Build a blocker graph from overlapping layered nodes.
- Generate deterministic `center-tower` and `two-wings` skeletons.
- Produce a first-pass theoretical `SolutionTrace`.
- Assign mahjong faces along that trace.
- Emit a `DifficultyReport`.

It does not yet replace Cocos level config. Cocos adoption should happen in a separate task after design review and generator tuning.
```

- [ ] **Step 2: Update task progress**

In the implementation task fragment, add:

```md
- 2026-05-28：已完成 `packages/shared` 引擎无关牌山生成器地基，覆盖骨架、遮挡图、理论解法、牌面发牌和难度报告；未修改 Cocos 表现层。
```

- [ ] **Step 3: Run documentation sync and diff check**

Run:

```bash
npm run docs:sync
git diff --check
```

Expected: both pass.

## Self-Review

- Spec coverage: The plan covers skeleton graph, templates, solution trace, face assignment, difficulty report, shared export, docs, and no Cocos edits.
- Placeholder scan: The plan uses concrete file paths, commands, expected results, and code snippets.
- Type consistency: `MountainSkeleton`, `MountainNode`, `SolutionTrace`, `FaceAssignment`, `DifficultyReport`, and `generateHulebuMountain` are introduced before later use.
