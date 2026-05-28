import type { MahjongComboType, MahjongRank, MahjongSuit, MahjongTileLocation } from "./mahjong-game";

export interface HulebuMountainNode {
  id: string;
  x: number;
  y: number;
  layer: number;
  width: number;
  height: number;
  tags?: string[];
  blockedBy?: string[];
  blocks?: string[];
}

export interface HulebuMountainSkeleton {
  id: string;
  templateId: string;
  seed: string;
  nodes: HulebuMountainNode[];
  metrics: {
    tileCount: number;
    maxLayer: number;
    initialFreeCount: number;
    coverEdgeCount: number;
  };
}

export type HulebuMountainTemplateId =
  | "center-tower"
  | "two-wings"
  | "cross"
  | "ring"
  | "long-wall"
  | "islands"
  | "canyon"
  | "staircase";

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

export interface HulebuTemplateColumnPositionContext {
  columnIndex: number;
  columnCount: number;
  parameters: HulebuTemplateParameters;
}

export interface HulebuTemplateColumnWeightContext extends HulebuTemplateColumnPositionContext {}

export interface HulebuTemplateColumnRoleContext extends HulebuTemplateColumnPositionContext {}

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
  tileCount: number;
  maxLayer: number;
  templateParameters: HulebuTemplateParameters;
  randomness: number;
  decoyRate: number;
}

export interface HulebuBlockerGraphOptions {
  overlapThreshold?: number;
  id?: string;
  templateId?: string;
  seed?: string;
}

export type HulebuMountainRhythmPhase = "warmup" | "pressure" | "release" | "climax";

export interface HulebuSolutionStep {
  stepIndex: number;
  comboType: MahjongComboType;
  nodeIds: string[];
  phase: HulebuMountainRhythmPhase;
  availableBefore: number;
  slotPressure: number;
  unlockedNodeIds: string[];
}

export interface HulebuSolutionTrace {
  steps: HulebuSolutionStep[];
  initialFreeNodeIds: string[];
  remainingNodeCount: number;
  solvable: boolean;
}

export interface HulebuTileFace {
  suit: MahjongSuit;
  rank: MahjongRank;
  label: string;
}

export interface HulebuComboHintGroup {
  id: string;
  comboType: MahjongComboType;
  nodeIds: string[];
  phase: HulebuMountainRhythmPhase;
  labels: string[];
}

export interface HulebuFaceAssignment {
  facesByNodeId: Record<string, HulebuTileFace>;
  comboHintGroups: HulebuComboHintGroup[];
  decoyNodeIds: string[];
}

export interface HulebuGeneratedLevelTile {
  id: string;
  suit: MahjongSuit;
  rank: MahjongRank;
  x: number;
  y: number;
  layer: number;
  blockedBy: string[];
  location: Extract<MahjongTileLocation, "board">;
  width: number;
  height: number;
  tags: string[];
}

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

export interface HulebuMountainGenerationResult {
  skeleton: HulebuMountainSkeleton;
  solution: HulebuSolutionTrace;
  assignment: HulebuFaceAssignment;
  experience: HulebuExperienceReport;
  levelTiles: HulebuGeneratedLevelTile[];
}

const DEFAULT_OVERLAP_THRESHOLD = 0.05;
const DEFAULT_TILE_SIZE = { width: 72, height: 98 };
const DEFAULT_COMBO_ORDER: MahjongComboType[] = ["peng", "chi", "gang", "hu"];
const NUMERIC_SUITS: MahjongSuit[] = ["wan", "tiao", "tong"];
const HONOR_RANKS: MahjongRank[] = [1, 2, 3, 4, 5, 6, 7];
const COMBO_SIZE: Record<MahjongComboType, number> = {
  chi: 3,
  peng: 3,
  gang: 4,
  hu: 8,
};
const DEFAULT_TEMPLATE_PARAMETER_BOUNDS: Record<HulebuTemplateParameterKey, HulebuTemplateParameterBound> = {
  tileCount: { min: 1, max: 96 },
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
    getColumnWeight({ columnIndex, columnCount }) {
      const center = (columnCount - 1) / 2;
      return 2.2 - Math.abs(columnIndex - center) / Math.max(1, center);
    },
    getColumnPosition({ columnIndex, columnCount }) {
      return getCenteredGridPosition(columnIndex, columnCount, {
        maxColumnsPerRow: 5,
        spacingX: 82,
        spacingY: 86,
      });
    },
    getColumnRole({ columnIndex, columnCount }) {
      const center = (columnCount - 1) / 2;
      return Math.abs(columnIndex - center) <= 1.5 ? "role:center-tower" : "role:outer-rim";
    },
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
  },
  cross: {
    id: "cross",
    label: "十字",
    family: "core",
    experienceTags: ["key-release", "multi-route", "slot-pressure"],
    defaultParameters: {
      tileCount: 54,
      maxLayer: 6,
      entranceCount: 8,
      coreDepth: 0.68,
      branchSymmetry: 0.5,
      crossCoverRate: 0.4,
      decoyRate: 0.12,
      releaseDensity: 0.62,
      jitter: 0.32,
    },
    parameterBounds: DEFAULT_TEMPLATE_PARAMETER_BOUNDS,
    getColumnWeight({ columnIndex }) {
      if (columnIndex === 0) {
        return 2.4;
      }

      return 1.7 - Math.min(0.7, Math.floor((columnIndex - 1) / 4) * 0.18);
    },
    getColumnPosition({ columnIndex }) {
      if (columnIndex === 0) {
        return { x: 0, y: 0 };
      }

      const directionIndex = (columnIndex - 1) % 4;
      const distance = Math.floor((columnIndex - 1) / 4) + 1;
      const spacing = 66;
      const directions = [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
      ];
      const direction = directions[directionIndex] ?? directions[0];

      return {
        x: direction.x * distance * spacing,
        y: direction.y * distance * spacing,
      };
    },
    getColumnRole({ columnIndex }) {
      if (columnIndex === 0) {
        return "role:cross-center";
      }

      return `role:cross-arm-${(columnIndex - 1) % 4}`;
    },
  },
  ring: {
    id: "ring",
    label: "环形",
    family: "pressure",
    experienceTags: ["visible-locked", "read-choice", "slot-pressure"],
    defaultParameters: {
      tileCount: 54,
      maxLayer: 6,
      entranceCount: 9,
      coreDepth: 0.62,
      branchSymmetry: 0.6,
      crossCoverRate: 0.34,
      decoyRate: 0.12,
      releaseDensity: 0.48,
      jitter: 0.3,
    },
    parameterBounds: DEFAULT_TEMPLATE_PARAMETER_BOUNDS,
    getColumnWeight({ columnIndex }) {
      return columnIndex % 4 === 0 ? 1.2 : 1.7;
    },
    getColumnPosition({ columnIndex, columnCount }) {
      const angle = (Math.PI * 2 * columnIndex) / Math.max(1, columnCount);
      const radiusX = 142;
      const radiusY = 92;

      return {
        x: round(Math.cos(angle) * radiusX),
        y: round(Math.sin(angle) * radiusY),
      };
    },
    getColumnRole({ columnIndex }) {
      return columnIndex % 4 === 0 ? "role:ring-gate" : "role:ring-wall";
    },
  },
  "long-wall": {
    id: "long-wall",
    label: "长墙",
    family: "recovery",
    experienceTags: ["warmup", "reward-calm", "recovery"],
    defaultParameters: {
      tileCount: 48,
      maxLayer: 5,
      entranceCount: 12,
      coreDepth: 0.35,
      branchSymmetry: 0.8,
      crossCoverRate: 0.18,
      decoyRate: 0.06,
      releaseDensity: 0.72,
      jitter: 0.24,
    },
    parameterBounds: DEFAULT_TEMPLATE_PARAMETER_BOUNDS,
    getColumnWeight({ columnIndex }) {
      return columnIndex % 3 === 0 ? 1.35 : 1.1;
    },
    getColumnPosition({ columnIndex, columnCount }) {
      const center = (columnCount - 1) / 2;
      return {
        x: (columnIndex - center) * 58,
        y: (columnIndex % 2 === 0 ? -1 : 1) * 16,
      };
    },
    getColumnRole({ columnIndex }) {
      return columnIndex % 3 === 0 ? "role:wall-release" : "role:wall-body";
    },
  },
  islands: {
    id: "islands",
    label: "岛屿",
    family: "recovery",
    experienceTags: ["multi-route", "recovery", "read-choice"],
    defaultParameters: {
      tileCount: 54,
      maxLayer: 5,
      entranceCount: 11,
      coreDepth: 0.42,
      branchSymmetry: 0.55,
      crossCoverRate: 0.16,
      decoyRate: 0.08,
      releaseDensity: 0.56,
      jitter: 0.38,
    },
    parameterBounds: DEFAULT_TEMPLATE_PARAMETER_BOUNDS,
    getColumnWeight({ columnIndex }) {
      return columnIndex % 4 === 0 ? 1.55 : 1.25;
    },
    getColumnPosition({ columnIndex, parameters }) {
      const islandCount = Math.max(3, Math.min(5, Math.round(parameters.entranceCount / 3)));
      const islandIndex = columnIndex % islandCount;
      const localIndex = Math.floor(columnIndex / islandCount);
      const angle = (Math.PI * 2 * islandIndex) / islandCount - Math.PI / 2;
      const centerX = Math.cos(angle) * 118;
      const centerY = Math.sin(angle) * 76;

      return {
        x: round(centerX + (localIndex % 2 === 0 ? -18 : 18)),
        y: round(centerY + Math.floor(localIndex / 2) * 24),
      };
    },
    getColumnRole({ columnIndex, parameters }) {
      const islandCount = Math.max(3, Math.min(5, Math.round(parameters.entranceCount / 3)));
      return `role:island-${(columnIndex % islandCount) + 1}`;
    },
  },
  canyon: {
    id: "canyon",
    label: "峡谷",
    family: "pressure",
    experienceTags: ["slot-pressure", "read-choice", "boss-pressure"],
    defaultParameters: {
      tileCount: 54,
      maxLayer: 6,
      entranceCount: 7,
      coreDepth: 0.7,
      branchSymmetry: 0.45,
      crossCoverRate: 0.38,
      decoyRate: 0.16,
      releaseDensity: 0.42,
      jitter: 0.3,
    },
    parameterBounds: DEFAULT_TEMPLATE_PARAMETER_BOUNDS,
    getColumnWeight({ columnIndex }) {
      return columnIndex % 3 === 1 ? 1.1 : 1.9;
    },
    getColumnPosition({ columnIndex, columnCount }) {
      const row = Math.floor(columnIndex / 3);
      const lane = columnIndex % 3;
      const totalRows = Math.ceil(columnCount / 3);
      const x = lane === 0 ? -82 : lane === 1 ? 0 : 82;

      return {
        x,
        y: (row - (totalRows - 1) / 2) * 64,
      };
    },
    getColumnRole({ columnIndex }) {
      return columnIndex % 3 === 1 ? "role:canyon-path" : "role:canyon-wall";
    },
  },
  staircase: {
    id: "staircase",
    label: "阶梯",
    family: "core",
    experienceTags: ["warmup", "key-release", "recovery"],
    defaultParameters: {
      tileCount: 54,
      maxLayer: 6,
      entranceCount: 10,
      coreDepth: 0.52,
      branchSymmetry: 0.65,
      crossCoverRate: 0.24,
      decoyRate: 0.08,
      releaseDensity: 0.68,
      jitter: 0.26,
    },
    parameterBounds: DEFAULT_TEMPLATE_PARAMETER_BOUNDS,
    getColumnWeight({ columnIndex, columnCount }) {
      return 1 + (columnIndex / Math.max(1, columnCount - 1)) * 0.9;
    },
    getColumnPosition({ columnIndex, columnCount }) {
      const center = (columnCount - 1) / 2;
      return {
        x: (columnIndex - center) * 58,
        y: (center - columnIndex) * 24,
      };
    },
    getColumnRole({ columnIndex }) {
      return columnIndex % 3 === 2 ? "role:stair-release" : "role:stair-step";
    },
  },
};

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

export function normalizeHulebuMountainGeneratorConfig(
  config: HulebuMountainGeneratorConfig,
): NormalizedHulebuMountainGeneratorConfig {
  const definition = getHulebuMountainTemplateDefinition(config.templateId);
  const requestedParameters: HulebuTemplateParameters = {
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

export function buildBlockerGraph(
  nodes: HulebuMountainNode[],
  options: HulebuBlockerGraphOptions = {},
): HulebuMountainSkeleton {
  const overlapThreshold = options.overlapThreshold ?? DEFAULT_OVERLAP_THRESHOLD;
  const nextNodes = nodes.map((node) => ({
    ...node,
    blockedBy: [] as string[],
    blocks: [] as string[],
  }));

  for (const lowerNode of nextNodes) {
    for (const higherNode of nextNodes) {
      if (higherNode.layer <= lowerNode.layer) {
        continue;
      }

      if (getOverlapRatio(lowerNode, higherNode) <= overlapThreshold) {
        continue;
      }

      lowerNode.blockedBy.push(higherNode.id);
      higherNode.blocks.push(lowerNode.id);
    }
  }

  for (const node of nextNodes) {
    node.blockedBy.sort();
    node.blocks.sort();
  }

  return {
    id: options.id ?? "manual-skeleton",
    templateId: options.templateId ?? "manual",
    seed: options.seed ?? "manual",
    nodes: nextNodes,
    metrics: {
      tileCount: nextNodes.length,
      maxLayer: nextNodes.reduce((maxLayer, node) => Math.max(maxLayer, node.layer), 0),
      initialFreeCount: nextNodes.filter((node) => node.blockedBy.length === 0).length,
      coverEdgeCount: nextNodes.reduce((total, node) => total + node.blocks.length, 0),
    },
  };
}

export function createMountainSkeleton(config: HulebuMountainGeneratorConfig): HulebuMountainSkeleton {
  const normalizedConfig = normalizeHulebuMountainGeneratorConfig(config);
  const template = getHulebuMountainTemplateDefinition(normalizedConfig.templateId);
  const tileSize = normalizedConfig.tileSize ?? DEFAULT_TILE_SIZE;
  const maxLayer = normalizedConfig.maxLayer;
  const tileCount = normalizedConfig.tileCount;
  const random = createSeededRandom(`${normalizedConfig.templateId}:${normalizedConfig.seed}`);
  const randomness = normalizedConfig.randomness;
  const initialFreeRange = normalizedConfig.initialFreeRange ?? {
    min: Math.max(4, normalizedConfig.templateParameters.entranceCount - 2),
    max: normalizedConfig.templateParameters.entranceCount + 2,
  };
  const columnCount = chooseColumnCount(tileCount, maxLayer, initialFreeRange);
  const depths = distributeDepths(
    columnCount,
    tileCount,
    maxLayer,
    template,
    normalizedConfig.templateParameters,
    random,
  );
  const nodes: HulebuMountainNode[] = [];

  for (let columnIndex = 0; columnIndex < depths.length; columnIndex += 1) {
    const depth = depths[columnIndex] ?? 0;
    const basePosition = template.getColumnPosition({
      columnIndex,
      columnCount,
      parameters: normalizedConfig.templateParameters,
    });
    const jitterX = (random() - 0.5) * randomness * 16;
    const jitterY = (random() - 0.5) * randomness * 18;

    for (let layer = 0; layer < depth; layer += 1) {
      const stackOffset = layer * 4;
      nodes.push({
        id: `node-${String(nodes.length + 1).padStart(3, "0")}`,
        x: round(basePosition.x + jitterX + stackOffset),
        y: round(basePosition.y + jitterY - stackOffset),
        layer,
        width: tileSize.width,
        height: tileSize.height,
        tags: [
          `template:${normalizedConfig.templateId}`,
          `column:${String(columnIndex + 1).padStart(2, "0")}`,
          template.getColumnRole({
            columnIndex,
            columnCount,
            parameters: normalizedConfig.templateParameters,
          }),
        ],
      });
    }
  }

  return buildBlockerGraph(nodes, {
    id: `hulebu-${normalizedConfig.templateId}-${normalizedConfig.seed}`,
    templateId: normalizedConfig.templateId,
    seed: normalizedConfig.seed,
    overlapThreshold: normalizedConfig.overlapThreshold,
  });
}

export function generateHulebuMountain(config: HulebuMountainGeneratorConfig): HulebuMountainGenerationResult {
  const normalizedConfig = normalizeHulebuMountainGeneratorConfig(config);
  const skeleton = createMountainSkeleton(normalizedConfig);
  const random = createSeededRandom(`faces:${normalizedConfig.templateId}:${normalizedConfig.seed}`);
  const solution = createSolutionTrace(skeleton, normalizedConfig);
  const assignment = assignFacesAlongSolution(solution, normalizedConfig, random);
  const experience = createExperienceReport(skeleton, solution, assignment, normalizedConfig);
  const levelTiles = skeleton.nodes.map((node) => {
    const face = assignment.facesByNodeId[node.id] ?? createNumberFace(random, 0);

    return {
      id: node.id,
      suit: face.suit,
      rank: face.rank,
      x: node.x,
      y: node.y,
      layer: node.layer,
      blockedBy: [...(node.blockedBy ?? [])],
      location: "board" as const,
      width: node.width,
      height: node.height,
      tags: [...(node.tags ?? [])],
    };
  });

  return {
    skeleton,
    solution,
    assignment,
    experience,
    levelTiles,
  };
}

export function getInitialFreeNodeIds(skeleton: Pick<HulebuMountainSkeleton, "nodes">): string[] {
  return skeleton.nodes
    .filter((node) => (node.blockedBy ?? []).length === 0)
    .map((node) => node.id);
}

function getOverlapRatio(baseNode: HulebuMountainNode, coverNode: HulebuMountainNode): number {
  const baseLeft = baseNode.x - baseNode.width / 2;
  const baseRight = baseNode.x + baseNode.width / 2;
  const baseTop = baseNode.y - baseNode.height / 2;
  const baseBottom = baseNode.y + baseNode.height / 2;
  const coverLeft = coverNode.x - coverNode.width / 2;
  const coverRight = coverNode.x + coverNode.width / 2;
  const coverTop = coverNode.y - coverNode.height / 2;
  const coverBottom = coverNode.y + coverNode.height / 2;

  const overlapWidth = Math.max(0, Math.min(baseRight, coverRight) - Math.max(baseLeft, coverLeft));
  const overlapHeight = Math.max(0, Math.min(baseBottom, coverBottom) - Math.max(baseTop, coverTop));
  const baseArea = baseNode.width * baseNode.height;

  if (baseArea <= 0) {
    return 0;
  }

  return (overlapWidth * overlapHeight) / baseArea;
}

function createSolutionTrace(
  skeleton: HulebuMountainSkeleton,
  config: HulebuMountainGeneratorConfig,
): HulebuSolutionTrace {
  const comboOrder = normalizeComboOrder(config.comboOrder);
  const remainingNodeIds = new Set(skeleton.nodes.map((node) => node.id));
  const totalNodeCount = skeleton.nodes.length;
  const initialFreeNodeIds = getAvailableNodeIds(skeleton, remainingNodeIds);
  const steps: HulebuSolutionStep[] = [];
  let guard = totalNodeCount * 2;

  while (remainingNodeIds.size > 0 && guard > 0) {
    guard -= 1;
    const availableBeforeIds = getAvailableNodeIds(skeleton, remainingNodeIds);
    const comboType = pickComboType(
      comboOrder,
      steps.length,
      remainingNodeIds.size,
      availableBeforeIds.length,
    );
    const comboSize = COMBO_SIZE[comboType];

    if (availableBeforeIds.length === 0) {
      break;
    }

    const nodeIds = pickNodeIdsForCombo(skeleton, remainingNodeIds, comboSize);
    if (nodeIds.length < comboSize) {
      break;
    }
    const unavailableBefore = getUnavailableRemainingIds(skeleton, remainingNodeIds, availableBeforeIds);

    for (const nodeId of nodeIds) {
      remainingNodeIds.delete(nodeId);
    }

    const availableAfterIds = getAvailableNodeIds(skeleton, remainingNodeIds);
    const phase = getRhythmPhase(totalNodeCount - remainingNodeIds.size, totalNodeCount);

    steps.push({
      stepIndex: steps.length + 1,
      comboType,
      nodeIds,
      phase,
      availableBefore: availableBeforeIds.length,
      slotPressure: estimateSlotPressure(comboType, phase, config.targetDifficulty ?? "normal"),
      unlockedNodeIds: availableAfterIds.filter((nodeId) => unavailableBefore.has(nodeId)),
    });
  }

  return {
    steps,
    initialFreeNodeIds,
    remainingNodeCount: remainingNodeIds.size,
    solvable: remainingNodeIds.size === 0,
  };
}

function assignFacesAlongSolution(
  solution: HulebuSolutionTrace,
  config: HulebuMountainGeneratorConfig,
  random: () => number,
): HulebuFaceAssignment {
  const facesByNodeId: Record<string, HulebuTileFace> = {};
  const comboHintGroups: HulebuComboHintGroup[] = [];

  for (const step of solution.steps) {
    const faces = createFacePack(step.comboType, step.stepIndex, random);

    for (let index = 0; index < step.nodeIds.length; index += 1) {
      const nodeId = step.nodeIds[index];
      const face = faces[index];

      if (nodeId && face) {
        facesByNodeId[nodeId] = face;
      }
    }

    comboHintGroups.push({
      id: `combo-${String(step.stepIndex).padStart(2, "0")}`,
      comboType: step.comboType,
      nodeIds: [...step.nodeIds],
      phase: step.phase,
      labels: step.nodeIds.map((nodeId) => facesByNodeId[nodeId]?.label ?? ""),
    });
  }

  return {
    facesByNodeId,
    comboHintGroups,
    decoyNodeIds: chooseDecoyNodeIds(solution, config.decoyRate ?? 0.08, random),
  };
}

function createExperienceReport(
  skeleton: HulebuMountainSkeleton,
  solution: HulebuSolutionTrace,
  assignment: HulebuFaceAssignment,
  config: HulebuMountainGeneratorConfig,
): HulebuExperienceReport {
  const normalizedConfig = normalizeHulebuMountainGeneratorConfig(config);
  const template = getHulebuMountainTemplateDefinition(normalizedConfig.templateId);
  const initialFreePenalty = Math.max(0, 14 - solution.initialFreeNodeIds.length) * 2;
  const layerPressure = skeleton.metrics.maxLayer * 8;
  const coverPressure = Math.round(skeleton.metrics.coverEdgeCount / Math.max(1, skeleton.metrics.tileCount) * 24);
  const score = clamp(Math.round(layerPressure + coverPressure + initialFreePenalty), 1, 100);
  const slotPressures = solution.steps.map((step) => step.slotPressure);
  const peakSlotPressure = Math.max(0, ...slotPressures);
  const averageSlotPressure = slotPressures.length > 0
    ? round(slotPressures.reduce((total, pressure) => total + pressure, 0) / slotPressures.length)
    : 0;
  const phaseCounts = createEmptyPhaseCounts();
  const recommendations: string[] = [];
  const validators = createValidatorResults(skeleton, solution, {
    peak: peakSlotPressure,
    average: averageSlotPressure,
  });

  for (const step of solution.steps) {
    phaseCounts[step.phase] += 1;
  }

  if (solution.initialFreeNodeIds.length > 12) {
    recommendations.push("初始可点窗口偏大，后续接 Cocos 时可增加跨列遮挡或减少外圈浅层列。");
  } else {
    recommendations.push("初始可点窗口已被压住，适合作为偏羊了个羊的读牌压力起点。");
  }

  if (peakSlotPressure >= 7) {
    recommendations.push("存在高槽压步骤，适合保留为中后段决策峰值。");
  }

  if (assignment.decoyNodeIds.length > 0) {
    recommendations.push("已插入干扰节点，后续应在试玩中确认干扰是诱导选择而不是纯死局感。");
  }

  if (!solution.solvable) {
    recommendations.push("理论路径未完整走通，需要降低遮挡密度或调整组合包顺序。");
  }

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
      target: normalizedConfig.targetDifficulty ?? "normal",
      score,
      grade: score >= 78 ? "expert" : score >= 58 ? "hard" : score >= 36 ? "normal" : "easy",
      tileCount: skeleton.metrics.tileCount,
      maxLayer: skeleton.metrics.maxLayer,
      initialFreeCount: solution.initialFreeNodeIds.length,
      coverEdgeCount: skeleton.metrics.coverEdgeCount,
      solutionStepCount: solution.steps.length,
    },
    rhythm: {
      phaseCounts,
      releaseStepIndices: getStepIndicesByPhase(solution, "release"),
      pressureStepIndices: getStepIndicesByPhase(solution, "pressure"),
      climaxStepIndices: getStepIndicesByPhase(solution, "climax"),
    },
    slotPressure: {
      peak: peakSlotPressure,
      average: averageSlotPressure,
      dangerStepIndices: solution.steps
        .filter((step) => step.slotPressure >= 7)
        .map((step) => step.stepIndex),
    },
    decoys: {
      count: assignment.decoyNodeIds.length,
      nodeIds: [...assignment.decoyNodeIds],
    },
    comboHints: {
      count: assignment.comboHintGroups.length,
      huCandidateStepIndices: solution.steps
        .filter((step) => step.comboType === "hu")
        .map((step) => step.stepIndex),
      manualDecisionStepIndices: solution.steps
        .filter((step) => step.comboType === "chi" || step.comboType === "gang" || step.comboType === "hu")
        .map((step) => step.stepIndex),
    },
    recommendations,
  };
}

function createEmptyPhaseCounts(): Record<HulebuMountainRhythmPhase, number> {
  return {
    warmup: 0,
    pressure: 0,
    release: 0,
    climax: 0,
  };
}

function getStepIndicesByPhase(
  solution: HulebuSolutionTrace,
  phase: HulebuMountainRhythmPhase,
): number[] {
  return solution.steps
    .filter((step) => step.phase === phase)
    .map((step) => step.stepIndex);
}

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

function getAvailableNodeIds(skeleton: HulebuMountainSkeleton, remainingNodeIds: Set<string>): string[] {
  return skeleton.nodes
    .filter((node) => remainingNodeIds.has(node.id))
    .filter((node) => (node.blockedBy ?? []).every((blockerId) => !remainingNodeIds.has(blockerId)))
    .map((node) => node.id);
}

function getUnavailableRemainingIds(
  skeleton: HulebuMountainSkeleton,
  remainingNodeIds: Set<string>,
  availableNodeIds: string[],
): Set<string> {
  const available = new Set(availableNodeIds);
  return new Set(
    skeleton.nodes
      .filter((node) => remainingNodeIds.has(node.id) && !available.has(node.id))
      .map((node) => node.id),
  );
}

function pickComboType(
  comboOrder: MahjongComboType[],
  stepIndex: number,
  remainingCount: number,
  availableCount: number,
): MahjongComboType {
  const desiredType = comboOrder[stepIndex % comboOrder.length] ?? "peng";
  if (canUseCombo(desiredType, remainingCount, availableCount)) {
    return desiredType;
  }

  const orderedCandidates = [
    ...comboOrder.slice(stepIndex % comboOrder.length),
    ...comboOrder.slice(0, stepIndex % comboOrder.length),
  ];

  return orderedCandidates.find((comboType) => canUseCombo(comboType, remainingCount, availableCount))
    ?? orderedCandidates.find((comboType) => COMBO_SIZE[comboType] <= availableCount)
    ?? "peng";
}

function canUseCombo(comboType: MahjongComboType, remainingCount: number, availableCount: number): boolean {
  const size = COMBO_SIZE[comboType];
  return availableCount > 0 && size <= remainingCount && canComposeComboRemainder(remainingCount - size);
}

function canComposeComboRemainder(remainingCount: number): boolean {
  if (remainingCount === 0) {
    return true;
  }

  const reachable = new Set<number>([0]);
  for (let total = 0; total <= remainingCount; total += 1) {
    if (!reachable.has(total)) {
      continue;
    }

    for (const size of Object.values(COMBO_SIZE)) {
      if (total + size <= remainingCount) {
        reachable.add(total + size);
      }
    }
  }

  return reachable.has(remainingCount);
}

function pickNodeIdsForCombo(
  skeleton: HulebuMountainSkeleton,
  remainingNodeIds: Set<string>,
  comboSize: number,
): string[] {
  const pickedNodeIds: string[] = [];
  const localRemainingNodeIds = new Set(remainingNodeIds);

  while (pickedNodeIds.length < comboSize) {
    const available = new Set(getAvailableNodeIds(skeleton, localRemainingNodeIds));
    const [bestNode] = skeleton.nodes
      .filter((node) => available.has(node.id))
      .sort((left, right) => {
        const blockDelta = (right.blocks?.length ?? 0) - (left.blocks?.length ?? 0);
        if (blockDelta !== 0) {
          return blockDelta;
        }

        const layerDelta = right.layer - left.layer;
        if (layerDelta !== 0) {
          return layerDelta;
        }

        return left.id.localeCompare(right.id);
      });

    if (!bestNode) {
      break;
    }

    pickedNodeIds.push(bestNode.id);
    localRemainingNodeIds.delete(bestNode.id);
  }

  return pickedNodeIds;
}

function getRhythmPhase(removedCount: number, totalCount: number): HulebuMountainRhythmPhase {
  const progress = removedCount / Math.max(1, totalCount);

  if (progress < 0.22) {
    return "warmup";
  }

  if (progress < 0.66) {
    return "pressure";
  }

  if (progress < 0.84) {
    return "release";
  }

  return "climax";
}

function estimateSlotPressure(
  comboType: MahjongComboType,
  phase: HulebuMountainRhythmPhase,
  targetDifficulty: NonNullable<HulebuMountainGeneratorConfig["targetDifficulty"]>,
): number {
  const phaseBase: Record<HulebuMountainRhythmPhase, number> = {
    warmup: 3,
    pressure: 6,
    release: 4,
    climax: 6,
  };
  const difficultyDelta = targetDifficulty === "hard" ? 1 : targetDifficulty === "easy" ? -1 : 0;
  const comboDelta = comboType === "hu" ? 2 : comboType === "gang" ? 1 : 0;

  return clamp(phaseBase[phase] + difficultyDelta + comboDelta, 1, 8);
}

function createFacePack(
  comboType: MahjongComboType,
  stepIndex: number,
  random: () => number,
): HulebuTileFace[] {
  if (comboType === "chi") {
    const suit = NUMERIC_SUITS[stepIndex % NUMERIC_SUITS.length] ?? "wan";
    const startRank = toMahjongRank(1 + Math.floor(random() * 7));

    return [
      createFace(suit, startRank),
      createFace(suit, toMahjongRank(startRank + 1)),
      createFace(suit, toMahjongRank(startRank + 2)),
    ];
  }

  if (comboType === "hu") {
    const chiSuit = NUMERIC_SUITS[stepIndex % NUMERIC_SUITS.length] ?? "wan";
    const chiStart = toMahjongRank(1 + Math.floor(random() * 7));
    const pengFace = createNumberFace(random, stepIndex);
    const pairFace = createHonorFace(stepIndex);

    return [
      createFace(chiSuit, chiStart),
      createFace(chiSuit, toMahjongRank(chiStart + 1)),
      createFace(chiSuit, toMahjongRank(chiStart + 2)),
      pengFace,
      pengFace,
      pengFace,
      pairFace,
      pairFace,
    ];
  }

  const face = comboType === "peng" && stepIndex % 4 === 0
    ? createHonorFace(stepIndex)
    : createNumberFace(random, stepIndex);

  return Array.from({ length: COMBO_SIZE[comboType] }, () => face);
}

function createNumberFace(random: () => number, salt: number): HulebuTileFace {
  const suit = NUMERIC_SUITS[salt % NUMERIC_SUITS.length] ?? "wan";
  const rank = toMahjongRank(1 + Math.floor(random() * 9));

  return createFace(suit, rank);
}

function createHonorFace(salt: number): HulebuTileFace {
  return createFace("honor", HONOR_RANKS[salt % HONOR_RANKS.length] ?? 1);
}

function createFace(suit: MahjongSuit, rank: MahjongRank): HulebuTileFace {
  return {
    suit,
    rank,
    label: getFaceLabel(suit, rank),
  };
}

function getFaceLabel(suit: MahjongSuit, rank: MahjongRank): string {
  if (suit === "honor") {
    const labels: Record<number, string> = {
      1: "东",
      2: "南",
      3: "西",
      4: "北",
      5: "中",
      6: "发",
      7: "白",
    };

    return labels[rank] ?? `字${rank}`;
  }

  const suitLabels: Record<Exclude<MahjongSuit, "honor">, string> = {
    wan: "万",
    tiao: "条",
    tong: "筒",
  };

  return `${rank}${suitLabels[suit]}`;
}

function chooseDecoyNodeIds(
  solution: HulebuSolutionTrace,
  decoyRate: number,
  random: () => number,
): string[] {
  const candidates = solution.steps
    .filter((step) => step.phase === "pressure" || step.phase === "climax")
    .flatMap((step) => step.nodeIds);
  const decoyCount = Math.min(candidates.length, Math.round(solution.initialFreeNodeIds.length * clamp(decoyRate, 0, 0.5) * 3));
  const picked = new Set<string>();

  while (picked.size < decoyCount && picked.size < candidates.length) {
    const index = Math.floor(random() * candidates.length);
    const candidate = candidates[index];

    if (candidate) {
      picked.add(candidate);
    }
  }

  return [...picked].sort();
}

function normalizeComboOrder(comboOrder: MahjongComboType[] | undefined): MahjongComboType[] {
  const normalized = (comboOrder?.length ? comboOrder : DEFAULT_COMBO_ORDER)
    .filter((comboType, index, source) => comboType in COMBO_SIZE && source.indexOf(comboType) === index);

  return normalized.length > 0 ? normalized : DEFAULT_COMBO_ORDER;
}

function toMahjongRank(rank: number): MahjongRank {
  return clamp(Math.round(rank), 1, 9) as MahjongRank;
}

function chooseColumnCount(
  tileCount: number,
  maxLayer: number,
  initialFreeRange: NonNullable<HulebuMountainGeneratorConfig["initialFreeRange"]>,
): number {
  const capacityMinimum = Math.ceil(tileCount / maxLayer);
  const ideal = Math.round(tileCount / Math.max(4, maxLayer - 1));
  return Math.min(
    tileCount,
    Math.max(capacityMinimum, clamp(ideal, initialFreeRange.min, initialFreeRange.max)),
  );
}

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

function pickWeightedIndex(
  candidates: Array<{ index: number; weight: number }>,
  random: () => number,
): number {
  const totalWeight = candidates.reduce((total, candidate) => total + candidate.weight, 0);
  let cursor = random() * totalWeight;

  for (const candidate of candidates) {
    cursor -= candidate.weight;
    if (cursor <= 0) {
      return candidate.index;
    }
  }

  return candidates[candidates.length - 1]?.index ?? 0;
}

function getCenteredGridPosition(
  columnIndex: number,
  columnCount: number,
  options: {
    maxColumnsPerRow: number;
    spacingX: number;
    spacingY: number;
  },
): { x: number; y: number } {
  const columnsPerRow = Math.min(options.maxColumnsPerRow, Math.ceil(Math.sqrt(columnCount + 2)));
  const row = Math.floor(columnIndex / columnsPerRow);
  const col = columnIndex % columnsPerRow;
  const totalRows = Math.ceil(columnCount / columnsPerRow);

  return {
    x: (col - (columnsPerRow - 1) / 2) * options.spacingX,
    y: (row - (totalRows - 1) / 2) * options.spacingY,
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

function createSeededRandom(seed: string): () => number {
  let state = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    state ^= seed.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
