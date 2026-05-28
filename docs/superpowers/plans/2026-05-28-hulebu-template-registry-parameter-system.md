# 胡了卜模板注册表和参数系统 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 T080 的 `center-tower` / `two-wings` 分支式牌山模板重构为可扩展的模板注册表和参数系统，同时保持当前生成结果的可解性、seed 稳定性和 Cocos 输出契约。

**Architecture:** 先在 `packages/shared/src/mahjong-mountain-generator.ts` 内建立模板 definition、参数归一化、模板注册表和通用校验器；现有两个模板只迁移到注册表，不在本计划内新增 8 个核心模板。`SolutionTrace`、`FaceAssignment`、`buildBlockerGraph` 和 `levelTiles` 继续复用 T080 的主链路，避免 Cocos 表现层提前变动。

**Tech Stack:** TypeScript、Vitest、npm workspaces、现有 `packages/shared` 模块。

---

## Scope

本计划是后续实现任务的执行手册，不是本次 T082 的代码变更。执行本计划时可以修改：

- `packages/shared/src/mahjong-mountain-generator.ts`
- `packages/shared/src/mahjong-mountain-generator.test.ts`
- `packages/shared/src/index.ts`
- `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`
- 当前实现任务对应的 `docs/tasks/items/`、`docs/tasks/claims/`、`docs/progress/`、`docs/completion/`

执行本计划时不修改：

- `apps/game/mahjong-roguelike/cocos/**`
- `apps/web/**`
- `apps/game/mahjong-roguelike/config/**`
- 美术资源、Cocos `.meta`、发布配置

## File Structure

- `packages/shared/src/mahjong-mountain-generator.ts`
  保持单文件实现，先不拆模块。新增模板 definition、注册表、参数归一化和校验器，与现有生成链路共处一处，便于 T083 再决定是否拆为 `mahjong-mountain-templates.ts`。
- `packages/shared/src/mahjong-mountain-generator.test.ts`
  扩展现有测试，覆盖注册表、默认参数、参数边界、seed 稳定性、现有两模板行为保留、ExperienceReport 新字段。
- `packages/shared/src/index.ts`
  继续从共享入口导出生成器类型和函数。若 `mahjong-mountain-generator.ts` 使用 `export *` 已被覆盖，只需验证无需改动。
- `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`
  记录模板注册表已落地后的接口边界、T083 可接的扩展点和仍未接 Cocos 的事实。

## Public API Shape

后续实现应保留现有调用：

```ts
generateHulebuMountain({
  templateId: "center-tower",
  seed: "hulebu-seed-42",
  tileCount: 48,
  maxLayer: 6,
  initialFreeRange: { min: 6, max: 12 },
  randomness: 0.4,
});
```

新增调用可以带模板参数：

```ts
generateHulebuMountain({
  templateId: "two-wings",
  seed: "route-choice-01",
  tileCount: 54,
  maxLayer: 6,
  templateParameters: {
    entranceCount: 10,
    branchSymmetry: 0.55,
    decoyRate: 0.16,
    releaseDensity: 0.5,
    jitter: 0.45,
  },
});
```

## Implementation Tasks

### Task 1: Add Template Registry Types

**Files:**
- Modify: `packages/shared/src/mahjong-mountain-generator.test.ts`
- Modify: `packages/shared/src/mahjong-mountain-generator.ts`

- [ ] **Step 1: Write the failing registry metadata test**

Append these imports to the existing import block:

```ts
import {
  getHulebuMountainTemplateDefinition,
  listHulebuMountainTemplateDefinitions,
} from "./mahjong-mountain-generator";
```

Add this test inside the existing `describe("胡了卜 Graph-based 牌山生成器", () => { ... })` block:

```ts
it("提供模板注册表元数据和默认参数", () => {
  const definitions = listHulebuMountainTemplateDefinitions();
  const centerTower = getHulebuMountainTemplateDefinition("center-tower");
  const twoWings = getHulebuMountainTemplateDefinition("two-wings");

  expect(definitions.map((definition) => definition.id)).toEqual(["center-tower", "two-wings"]);
  expect(centerTower).toEqual(expect.objectContaining({
    id: "center-tower",
    family: "pressure",
    experienceTags: expect.arrayContaining(["slot-pressure", "key-release"]),
  }));
  expect(centerTower.defaultParameters).toEqual(expect.objectContaining({
    entranceCount: 8,
    coreDepth: 0.75,
    jitter: 0.35,
  }));
  expect(twoWings).toEqual(expect.objectContaining({
    id: "two-wings",
    family: "route",
    experienceTags: expect.arrayContaining(["read-choice", "multi-route"]),
  }));
});
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
```

Expected: FAIL because `getHulebuMountainTemplateDefinition` and `listHulebuMountainTemplateDefinitions` are not exported yet.

- [ ] **Step 3: Add template registry types and definitions**

In `packages/shared/src/mahjong-mountain-generator.ts`, replace the current template id type:

```ts
export type HulebuMountainTemplateId = "center-tower" | "two-wings";
```

with:

```ts
export type HulebuMountainTemplateId = "center-tower" | "two-wings";

export type HulebuTemplateFamily = "core" | "route" | "pressure" | "recovery" | "boss";

export type HulebuExperienceTag =
  | "warmup"
  | "read-choice"
  | "multi-route"
  | "slot-pressure"
  | "key-release"
  | "visible-locked"
  | "recovery"
  | "boss-pressure"
  | "reward-calm";

export interface HulebuTemplateParameters {
  tileCount: number;
  maxLayer: number;
  entranceCount: number;
  coreDepth: number;
  branchSymmetry: number;
  crossCoverRate: number;
  decoyRate: number;
  releaseDensity: number;
  jitter: number;
}

export type HulebuTemplateParameterKey = keyof HulebuTemplateParameters;

export interface HulebuTemplateParameterBound {
  min: number;
  max: number;
}

export interface HulebuMountainTemplateDefinition {
  id: HulebuMountainTemplateId;
  label: string;
  family: HulebuTemplateFamily;
  experienceTags: HulebuExperienceTag[];
  defaultParameters: HulebuTemplateParameters;
  parameterBounds: Record<HulebuTemplateParameterKey, HulebuTemplateParameterBound>;
}
```

Add these constants after the existing defaults:

```ts
const DEFAULT_TEMPLATE_PARAMETER_BOUNDS: Record<HulebuTemplateParameterKey, HulebuTemplateParameterBound> = {
  tileCount: { min: 12, max: 96 },
  maxLayer: { min: 1, max: 8 },
  entranceCount: { min: 4, max: 16 },
  coreDepth: { min: 0, max: 1 },
  branchSymmetry: { min: 0, max: 1 },
  crossCoverRate: { min: 0, max: 1 },
  decoyRate: { min: 0, max: 0.5 },
  releaseDensity: { min: 0, max: 1 },
  jitter: { min: 0, max: 1 },
};

const HULEBU_MOUNTAIN_TEMPLATE_DEFINITIONS: Record<HulebuMountainTemplateId, HulebuMountainTemplateDefinition> = {
  "center-tower": {
    id: "center-tower",
    label: "中心塔",
    family: "pressure",
    experienceTags: ["slot-pressure", "key-release", "visible-locked"],
    defaultParameters: {
      tileCount: 48,
      maxLayer: 6,
      entranceCount: 8,
      coreDepth: 0.75,
      branchSymmetry: 0.35,
      crossCoverRate: 0.28,
      decoyRate: 0.08,
      releaseDensity: 0.45,
      jitter: 0.35,
    },
    parameterBounds: DEFAULT_TEMPLATE_PARAMETER_BOUNDS,
  },
  "two-wings": {
    id: "two-wings",
    label: "双翼",
    family: "route",
    experienceTags: ["read-choice", "multi-route", "slot-pressure"],
    defaultParameters: {
      tileCount: 54,
      maxLayer: 6,
      entranceCount: 10,
      coreDepth: 0.45,
      branchSymmetry: 0.7,
      crossCoverRate: 0.2,
      decoyRate: 0.1,
      releaseDensity: 0.5,
      jitter: 0.35,
    },
    parameterBounds: DEFAULT_TEMPLATE_PARAMETER_BOUNDS,
  },
};
```

Add exported helpers near the public functions:

```ts
export function listHulebuMountainTemplateDefinitions(): HulebuMountainTemplateDefinition[] {
  return Object.values(HULEBU_MOUNTAIN_TEMPLATE_DEFINITIONS);
}

export function getHulebuMountainTemplateDefinition(
  templateId: HulebuMountainTemplateId,
): HulebuMountainTemplateDefinition {
  const definition = HULEBU_MOUNTAIN_TEMPLATE_DEFINITIONS[templateId];

  if (!definition) {
    throw new Error(`Unknown Hulebu mountain template: ${templateId}`);
  }

  return definition;
}
```

- [ ] **Step 4: Run the focused test**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
```

Expected: PASS for the new metadata test and all existing tests.

### Task 2: Add Config Normalization and Parameter Bounds

**Files:**
- Modify: `packages/shared/src/mahjong-mountain-generator.test.ts`
- Modify: `packages/shared/src/mahjong-mountain-generator.ts`

- [ ] **Step 1: Write failing tests for parameter normalization**

Add these imports:

```ts
import { normalizeHulebuMountainGeneratorConfig } from "./mahjong-mountain-generator";
```

Add these tests:

```ts
it("将旧配置和模板参数归一化为稳定的内部配置", () => {
  const normalized = normalizeHulebuMountainGeneratorConfig({
    templateId: "center-tower",
    seed: "normalize-seed",
    tileCount: 120,
    maxLayer: 20,
    randomness: 0.9,
    decoyRate: 0.7,
    templateParameters: {
      entranceCount: 2,
      releaseDensity: 1.5,
    },
  });

  expect(normalized.tileCount).toBe(96);
  expect(normalized.maxLayer).toBe(8);
  expect(normalized.randomness).toBe(0.9);
  expect(normalized.decoyRate).toBe(0.5);
  expect(normalized.templateParameters).toEqual(expect.objectContaining({
    entranceCount: 4,
    releaseDensity: 1,
    jitter: 0.9,
  }));
});

it("拒绝未知模板，避免静默回落成错误牌山", () => {
  expect(() => normalizeHulebuMountainGeneratorConfig({
    templateId: "unknown-template" as "center-tower",
    seed: "bad-template",
    tileCount: 48,
    maxLayer: 6,
  })).toThrow("Unknown Hulebu mountain template");
});
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
```

Expected: FAIL because `templateParameters` and `normalizeHulebuMountainGeneratorConfig` are not implemented.

- [ ] **Step 3: Extend config types**

Update `HulebuMountainGeneratorConfig`:

```ts
export interface HulebuMountainGeneratorConfig {
  templateId: HulebuMountainTemplateId;
  seed: string;
  tileCount: number;
  maxLayer: number;
  templateParameters?: Partial<HulebuTemplateParameters>;
  initialFreeRange?: {
    min: number;
    max: number;
  };
  randomness?: number;
  tileSize?: {
    width: number;
    height: number;
  };
  overlapThreshold?: number;
  comboOrder?: MahjongComboType[];
  decoyRate?: number;
  targetDifficulty?: "easy" | "normal" | "hard";
}

interface NormalizedHulebuMountainGeneratorConfig extends HulebuMountainGeneratorConfig {
  templateParameters: HulebuTemplateParameters;
  randomness: number;
  decoyRate: number;
}
```

- [ ] **Step 4: Implement normalization**

Add this exported helper:

```ts
export function normalizeHulebuMountainGeneratorConfig(
  config: HulebuMountainGeneratorConfig,
): NormalizedHulebuMountainGeneratorConfig {
  const definition = getHulebuMountainTemplateDefinition(config.templateId);
  const requestedParameters = {
    ...definition.defaultParameters,
    ...config.templateParameters,
    tileCount: config.tileCount,
    maxLayer: config.maxLayer,
    jitter: config.randomness ?? config.templateParameters?.jitter ?? definition.defaultParameters.jitter,
    decoyRate: config.decoyRate ?? config.templateParameters?.decoyRate ?? definition.defaultParameters.decoyRate,
  };
  const templateParameters = clampTemplateParameters(requestedParameters, definition.parameterBounds);

  return {
    ...config,
    tileCount: templateParameters.tileCount,
    maxLayer: templateParameters.maxLayer,
    randomness: templateParameters.jitter,
    decoyRate: templateParameters.decoyRate,
    templateParameters,
  };
}

function clampTemplateParameters(
  parameters: HulebuTemplateParameters,
  bounds: Record<HulebuTemplateParameterKey, HulebuTemplateParameterBound>,
): HulebuTemplateParameters {
  return {
    tileCount: Math.round(clamp(parameters.tileCount, bounds.tileCount.min, bounds.tileCount.max)),
    maxLayer: Math.round(clamp(parameters.maxLayer, bounds.maxLayer.min, bounds.maxLayer.max)),
    entranceCount: Math.round(clamp(parameters.entranceCount, bounds.entranceCount.min, bounds.entranceCount.max)),
    coreDepth: clamp(parameters.coreDepth, bounds.coreDepth.min, bounds.coreDepth.max),
    branchSymmetry: clamp(parameters.branchSymmetry, bounds.branchSymmetry.min, bounds.branchSymmetry.max),
    crossCoverRate: clamp(parameters.crossCoverRate, bounds.crossCoverRate.min, bounds.crossCoverRate.max),
    decoyRate: clamp(parameters.decoyRate, bounds.decoyRate.min, bounds.decoyRate.max),
    releaseDensity: clamp(parameters.releaseDensity, bounds.releaseDensity.min, bounds.releaseDensity.max),
    jitter: clamp(parameters.jitter, bounds.jitter.min, bounds.jitter.max),
  };
}
```

- [ ] **Step 5: Wire normalization into generation**

At the start of `createMountainSkeleton`, replace direct config usage:

```ts
const normalizedConfig = normalizeHulebuMountainGeneratorConfig(config);
const tileSize = normalizedConfig.tileSize ?? DEFAULT_TILE_SIZE;
const maxLayer = normalizedConfig.maxLayer;
const tileCount = normalizedConfig.tileCount;
const random = createSeededRandom(`${normalizedConfig.templateId}:${normalizedConfig.seed}`);
const randomness = normalizedConfig.randomness;
const initialFreeRange = normalizedConfig.initialFreeRange ?? {
  min: Math.max(4, normalizedConfig.templateParameters.entranceCount - 2),
  max: normalizedConfig.templateParameters.entranceCount + 2,
};
```

Then use `normalizedConfig` for the rest of `createMountainSkeleton`.

At the start of `generateHulebuMountain`, normalize once and pass the normalized value forward:

```ts
export function generateHulebuMountain(config: HulebuMountainGeneratorConfig): HulebuMountainGenerationResult {
  const normalizedConfig = normalizeHulebuMountainGeneratorConfig(config);
  const skeleton = createMountainSkeleton(normalizedConfig);
  const random = createSeededRandom(`faces:${normalizedConfig.templateId}:${normalizedConfig.seed}`);
  const solution = createSolutionTrace(skeleton, normalizedConfig);
  const assignment = assignFacesAlongSolution(solution, normalizedConfig, random);
  const experience = createExperienceReport(skeleton, solution, assignment, normalizedConfig);
  // existing levelTiles mapping remains unchanged
}
```

- [ ] **Step 6: Run focused tests**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
```

Expected: PASS. Existing seed stability tests must still pass.

### Task 3: Move Existing Templates Behind Definitions

**Files:**
- Modify: `packages/shared/src/mahjong-mountain-generator.test.ts`
- Modify: `packages/shared/src/mahjong-mountain-generator.ts`

- [ ] **Step 1: Add behavior-preservation tests**

Add this test:

```ts
it("通过注册表生成现有中心塔和双翼模板，并保持 seed 稳定", () => {
  const baseConfig = {
    seed: "registry-stability-seed",
    tileCount: 48,
    maxLayer: 6,
    initialFreeRange: { min: 6, max: 12 },
    randomness: 0.4,
  };

  const centerTower = createMountainSkeleton({
    ...baseConfig,
    templateId: "center-tower",
  });
  const centerTowerAgain = createMountainSkeleton({
    ...baseConfig,
    templateId: "center-tower",
  });
  const twoWings = createMountainSkeleton({
    ...baseConfig,
    templateId: "two-wings",
  });

  expect(centerTower).toEqual(centerTowerAgain);
  expect(centerTower.nodes.some((node) => node.tags?.includes("role:center-tower"))).toBe(true);
  expect(twoWings.nodes.some((node) => node.tags?.includes("role:left-wing"))).toBe(true);
  expect(twoWings.nodes.some((node) => node.tags?.includes("role:right-wing"))).toBe(true);
  expect(centerTower.nodes.map((node) => `${node.x},${node.y},${node.layer}`)).not.toEqual(
    twoWings.nodes.map((node) => `${node.x},${node.y},${node.layer}`),
  );
});
```

- [ ] **Step 2: Run test before refactor**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
```

Expected: PASS before moving code, so the test protects current behavior.

- [ ] **Step 3: Add template shape callbacks**

Extend `HulebuMountainTemplateDefinition`:

```ts
export interface HulebuTemplateColumnPositionContext {
  columnIndex: number;
  columnCount: number;
  parameters: HulebuTemplateParameters;
}

export interface HulebuTemplateColumnRoleContext extends HulebuTemplateColumnPositionContext {}

export interface HulebuTemplateColumnWeightContext extends HulebuTemplateColumnPositionContext {}

export interface HulebuMountainTemplateDefinition {
  id: HulebuMountainTemplateId;
  label: string;
  family: HulebuTemplateFamily;
  experienceTags: HulebuExperienceTag[];
  defaultParameters: HulebuTemplateParameters;
  parameterBounds: Record<HulebuTemplateParameterKey, HulebuTemplateParameterBound>;
  getColumnWeight(context: HulebuTemplateColumnWeightContext): number;
  getColumnPosition(context: HulebuTemplateColumnPositionContext): { x: number; y: number };
  getColumnRole(context: HulebuTemplateColumnRoleContext): string;
}
```

In the `center-tower` definition, add:

```ts
getColumnWeight({ columnIndex, columnCount }) {
  const center = (columnCount - 1) / 2;
  return 2.2 - Math.abs(columnIndex - center) / Math.max(1, center);
},
getColumnPosition({ columnIndex, columnCount }) {
  const columnsPerRow = Math.min(5, Math.ceil(Math.sqrt(columnCount + 2)));
  const row = Math.floor(columnIndex / columnsPerRow);
  const col = columnIndex % columnsPerRow;
  const totalRows = Math.ceil(columnCount / columnsPerRow);

  return {
    x: (col - (columnsPerRow - 1) / 2) * 82,
    y: (row - (totalRows - 1) / 2) * 86,
  };
},
getColumnRole({ columnIndex, columnCount }) {
  const center = (columnCount - 1) / 2;
  return Math.abs(columnIndex - center) <= 1.5 ? "role:center-tower" : "role:outer-rim";
},
```

In the `two-wings` definition, add:

```ts
getColumnWeight({ columnIndex, columnCount }) {
  const center = (columnCount - 1) / 2;
  return 1 + Math.abs(columnIndex - center) / Math.max(1, center);
},
getColumnPosition({ columnIndex }) {
  const wingSide = columnIndex % 2 === 0 ? -1 : 1;
  const wingIndex = Math.floor(columnIndex / 2);
  const row = Math.floor(wingIndex / 3);
  const col = wingIndex % 3;

  return {
    x: wingSide * (88 + col * 58),
    y: (row - 1) * 74 + (wingSide === -1 ? 10 : -10),
  };
},
getColumnRole({ columnIndex }) {
  return columnIndex % 2 === 0 ? "role:left-wing" : "role:right-wing";
},
```

- [ ] **Step 4: Replace branch helpers with definition calls**

Update `distributeDepths` to receive a definition and parameters:

```ts
function distributeDepths(
  columnCount: number,
  tileCount: number,
  maxLayer: number,
  template: HulebuMountainTemplateDefinition,
  parameters: HulebuTemplateParameters,
  random: () => number,
): number[] {
  const depths = Array.from({ length: columnCount }, () => 1);
  let remaining = tileCount - columnCount;

  while (remaining > 0) {
    const candidates = depths
      .map((depth, index) => ({
        depth,
        index,
        weight: template.getColumnWeight({ columnIndex: index, columnCount, parameters }),
      }))
      .filter((candidate) => candidate.depth < maxLayer);

    if (candidates.length === 0) {
      break;
    }

    const pickedIndex = pickWeightedIndex(candidates, random);
    depths[pickedIndex] = (depths[pickedIndex] ?? 0) + 1;
    remaining -= 1;
  }

  return depths;
}
```

In `createMountainSkeleton`, get the template:

```ts
const template = getHulebuMountainTemplateDefinition(normalizedConfig.templateId);
const depths = distributeDepths(
  columnCount,
  tileCount,
  maxLayer,
  template,
  normalizedConfig.templateParameters,
  random,
);
```

Replace `getTemplateColumnPosition(...)` and `getColumnRole(...)` calls:

```ts
const basePosition = template.getColumnPosition({
  columnIndex,
  columnCount,
  parameters: normalizedConfig.templateParameters,
});
// ...
template.getColumnRole({
  columnIndex,
  columnCount,
  parameters: normalizedConfig.templateParameters,
}),
```

Remove the old `getColumnWeight`, `getTemplateColumnPosition`, and `getColumnRole` helpers only after all tests pass with the definition callbacks.

- [ ] **Step 5: Run tests**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
```

Expected: PASS. The two existing templates still generate stable skeletons and the same public output shape.

### Task 4: Extend ExperienceReport With Template and Validator Data

**Files:**
- Modify: `packages/shared/src/mahjong-mountain-generator.test.ts`
- Modify: `packages/shared/src/mahjong-mountain-generator.ts`

- [ ] **Step 1: Write failing report tests**

Add this test:

```ts
it("体验报告包含模板标签、参数快照和通用校验结果", () => {
  const result = generateHulebuMountain({
    templateId: "two-wings",
    seed: "template-report-seed",
    tileCount: 54,
    maxLayer: 6,
    initialFreeRange: { min: 8, max: 12 },
    randomness: 0.45,
    comboOrder: ["peng", "chi", "gang", "hu"],
    targetDifficulty: "hard",
    templateParameters: {
      branchSymmetry: 0.55,
      releaseDensity: 0.6,
    },
  });

  expect(result.experience.template).toEqual(expect.objectContaining({
    id: "two-wings",
    label: "双翼",
    family: "route",
    experienceTags: expect.arrayContaining(["read-choice", "multi-route"]),
    parameterSnapshot: expect.objectContaining({
      branchSymmetry: 0.55,
      releaseDensity: 0.6,
    }),
  }));
  expect(result.experience.validators).toEqual(expect.objectContaining({
    solvable: expect.objectContaining({ passed: true }),
    initialWindow: expect.objectContaining({ passed: true }),
    averageWindow: expect.objectContaining({ passed: expect.any(Boolean) }),
    coverDensity: expect.objectContaining({ passed: expect.any(Boolean) }),
  }));
  expect(result.experience.windowCurve.length).toBe(result.solution.steps.length + 1);
  expect(result.experience.releaseEvents.length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
```

Expected: FAIL because `template`, `validators`, `windowCurve`, and `releaseEvents` are missing.

- [ ] **Step 3: Extend report types**

Add these interfaces:

```ts
export interface HulebuTemplateExperienceSummary {
  id: HulebuMountainTemplateId;
  label: string;
  family: HulebuTemplateFamily;
  experienceTags: HulebuExperienceTag[];
  parameterSnapshot: HulebuTemplateParameters;
}

export interface HulebuExperienceValidatorResult {
  passed: boolean;
  value: number | boolean;
  expected: string;
}

export interface HulebuExperienceReleaseEvent {
  stepIndex: number;
  unlockedNodeIds: string[];
  releasedCount: number;
}
```

Extend `HulebuExperienceReport`:

```ts
export interface HulebuExperienceReport {
  template: HulebuTemplateExperienceSummary;
  validators: {
    solvable: HulebuExperienceValidatorResult;
    initialWindow: HulebuExperienceValidatorResult;
    averageWindow: HulebuExperienceValidatorResult;
    coverDensity: HulebuExperienceValidatorResult;
    peakSlotPressure: HulebuExperienceValidatorResult;
  };
  windowCurve: number[];
  releaseEvents: HulebuExperienceReleaseEvent[];
  difficulty: {
    target: NonNullable<HulebuMountainGeneratorConfig["targetDifficulty"]>;
    score: number;
    grade: "easy" | "normal" | "hard" | "expert";
    tileCount: number;
    maxLayer: number;
    initialFreeCount: number;
    coverEdgeCount: number;
    solutionStepCount: number;
  };
  rhythm: {
    phaseCounts: Record<HulebuMountainRhythmPhase, number>;
    releaseStepIndices: number[];
    pressureStepIndices: number[];
    climaxStepIndices: number[];
  };
  slotPressure: {
    peak: number;
    average: number;
    dangerStepIndices: number[];
  };
  decoys: {
    count: number;
    nodeIds: string[];
  };
  comboHints: {
    count: number;
    huCandidateStepIndices: number[];
    manualDecisionStepIndices: number[];
  };
  recommendations: string[];
}
```

- [ ] **Step 4: Add generic validator helpers**

Add:

```ts
function createValidatorResults(
  skeleton: HulebuMountainSkeleton,
  solution: HulebuSolutionTrace,
  slotPressure: { peak: number; average: number },
): HulebuExperienceReport["validators"] {
  const averageWindow = solution.steps.length > 0
    ? round(solution.steps.reduce((total, step) => total + step.availableBefore, 0) / solution.steps.length)
    : solution.initialFreeNodeIds.length;
  const coverDensity = round(skeleton.metrics.coverEdgeCount / Math.max(1, skeleton.metrics.tileCount));

  return {
    solvable: {
      passed: solution.remainingNodeCount === 0,
      value: solution.remainingNodeCount === 0,
      expected: "理论解法应清空全部节点",
    },
    initialWindow: {
      passed: solution.initialFreeNodeIds.length >= 4 && solution.initialFreeNodeIds.length <= 16,
      value: solution.initialFreeNodeIds.length,
      expected: "初始可点窗口应落在 4-16",
    },
    averageWindow: {
      passed: averageWindow >= 4,
      value: averageWindow,
      expected: "平均可点窗口不低于 4",
    },
    coverDensity: {
      passed: coverDensity >= 0.25 && coverDensity <= 4,
      value: coverDensity,
      expected: "遮挡边密度应避免接近平铺或过度混乱",
    },
    peakSlotPressure: {
      passed: slotPressure.peak <= 8,
      value: slotPressure.peak,
      expected: "最大槽压不超过 8 格主槽上限",
    },
  };
}

function createWindowCurve(solution: HulebuSolutionTrace): number[] {
  return [
    solution.initialFreeNodeIds.length,
    ...solution.steps.map((step) => Math.max(0, step.availableBefore + step.unlockedNodeIds.length - step.nodeIds.length)),
  ];
}

function createReleaseEvents(solution: HulebuSolutionTrace): HulebuExperienceReleaseEvent[] {
  return solution.steps
    .filter((step) => step.unlockedNodeIds.length > 0)
    .map((step) => ({
      stepIndex: step.stepIndex,
      unlockedNodeIds: [...step.unlockedNodeIds],
      releasedCount: step.unlockedNodeIds.length,
    }));
}
```

- [ ] **Step 5: Populate report fields**

At the top of `createExperienceReport`, normalize the config and get the template definition:

```ts
const normalizedConfig = normalizeHulebuMountainGeneratorConfig(config);
const template = getHulebuMountainTemplateDefinition(normalizedConfig.templateId);
```

After calculating slot pressures:

```ts
const validators = createValidatorResults(skeleton, solution, {
  peak: peakSlotPressure,
  average: averageSlotPressure,
});
```

Return the new fields at the top of the report:

```ts
return {
  template: {
    id: template.id,
    label: template.label,
    family: template.family,
    experienceTags: [...template.experienceTags],
    parameterSnapshot: { ...normalizedConfig.templateParameters },
  },
  validators,
  windowCurve: createWindowCurve(solution),
  releaseEvents: createReleaseEvents(solution),
  difficulty: {
    // existing fields
  },
  // existing report sections
};
```

- [ ] **Step 6: Run focused tests**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
```

Expected: PASS. Existing report consumers still receive all old fields plus the new template sections.

### Task 5: Export and Documentation Pass

**Files:**
- Modify: `packages/shared/src/index.ts`
- Modify: `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`
- Modify: task and completion docs for the implementation task

- [ ] **Step 1: Verify shared exports**

Open `packages/shared/src/index.ts`. If it already contains:

```ts
export * from "./mahjong-mountain-generator";
```

leave it unchanged. If it only exports named files, add:

```ts
export * from "./mahjong-mountain-generator";
```

- [ ] **Step 2: Add generator foundation note**

Add this section to `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`:

```md
## 模板注册表和参数系统已落地

共享生成器已从写死模板分支升级为模板注册表。当前已注册 `center-tower` 和 `two-wings`，并保留 T080 的理论解法、发牌、5% 遮挡图、体验报告和 `levelTiles` 输出。

当前任务只迁移现有两模板，不新增十字、环形、长墙、岛屿、峡谷、阶梯。第一期 8 个核心模板由后续任务继续实现。
```

- [ ] **Step 3: Update task completion docs**

For the implementation task that executes this plan, write completion docs with:

```md
- 实现内容：完成模板注册表、参数归一化、参数边界、模板体验标签、通用校验器和 ExperienceReport 模板字段；保留 `center-tower` 与 `two-wings` 当前行为，不接 Cocos。
- 遗留问题：8 个核心模板尚未全部实现；Cocos 默认关卡仍未消费 Graph-based 生成器输出。
```

### Task 6: Verification

**Files:**
- No source edits unless verification exposes an issue.

- [ ] **Step 1: Run focused generator tests**

Run:

```bash
npm run test -w packages/shared -- mahjong-mountain-generator
```

Expected: PASS.

- [ ] **Step 2: Run shared typecheck**

Run:

```bash
npm run typecheck -w packages/shared
```

Expected: PASS.

- [ ] **Step 3: Run docs sync**

Run:

```bash
npm run docs:sync
```

Expected: PASS and prints a synced task/claim count.

- [ ] **Step 4: Scan implementation docs for placeholders**

Run with the actual implementation task paths:

```bash
rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items docs/tasks/claims docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md
```

Expected: no output for the files changed by this implementation task.

- [ ] **Step 5: Check whitespace**

Run:

```bash
git diff --check
```

Expected: PASS with no output.

## T083 Handoff

After this plan is executed, T083 can add the first 8 core templates by adding new registered definitions and template-specific shape callbacks. T083 should not change `SolutionTrace`, `FaceAssignment`, or Cocos consumption unless the new templates expose a real limitation in the shared generator contract.
