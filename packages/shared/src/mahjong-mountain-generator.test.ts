import { describe, expect, it } from "vitest";
import {
  buildBlockerGraph,
  createMountainSkeleton,
  generateHulebuMountain,
  getHulebuMountainTemplateDefinition,
  getInitialFreeNodeIds,
  listHulebuMountainTemplateDefinitions,
  normalizeHulebuMountainGeneratorConfig,
  type HulebuMountainGeneratorConfig,
  type HulebuMountainNode,
  type HulebuMountainTemplateId,
} from "./mahjong-mountain-generator";

const CORE_TEMPLATE_IDS: HulebuMountainTemplateId[] = [
  "center-tower",
  "two-wings",
  "cross",
  "ring",
  "long-wall",
  "islands",
  "canyon",
  "staircase",
];

describe("胡了卜 Graph-based 牌山生成器", () => {
  it("按 5% 覆盖阈值生成高层阻挡关系", () => {
    const nodes: HulebuMountainNode[] = [
      { id: "base", x: 0, y: 0, layer: 0, width: 100, height: 100 },
      { id: "top", x: 10, y: 10, layer: 1, width: 100, height: 100 },
      { id: "side", x: 160, y: 0, layer: 0, width: 100, height: 100 },
    ];

    const graph = buildBlockerGraph(nodes, { overlapThreshold: 0.05 });

    expect(graph.nodes.find((node) => node.id === "base")).toEqual(expect.objectContaining({
      blockedBy: ["top"],
      blocks: [],
    }));
    expect(graph.nodes.find((node) => node.id === "top")).toEqual(expect.objectContaining({
      blockedBy: [],
      blocks: ["base"],
    }));
    expect(getInitialFreeNodeIds(graph)).toEqual(["top", "side"]);
  });

  it("按模板和 seed 生成稳定的多层牌山骨架，并限制初始可点窗口", () => {
    const config = {
      templateId: "center-tower" as const,
      seed: "hulebu-seed-42",
      tileCount: 48,
      maxLayer: 6,
      initialFreeRange: { min: 6, max: 12 },
      randomness: 0.4,
    };

    const first = createMountainSkeleton(config);
    const second = createMountainSkeleton(config);
    const initialFreeNodeIds = getInitialFreeNodeIds(first);

    expect(first).toEqual(second);
    expect(first.nodes).toHaveLength(48);
    expect(new Set(first.nodes.map((node) => node.id)).size).toBe(48);
    expect(first.templateId).toBe("center-tower");
    expect(first.metrics.maxLayer).toBeLessThan(6);
    expect(first.metrics.coverEdgeCount).toBeGreaterThan(0);
    expect(initialFreeNodeIds.length).toBeGreaterThanOrEqual(6);
    expect(initialFreeNodeIds.length).toBeLessThanOrEqual(12);
    expect(first.nodes.some((node) => node.tags?.includes("template:center-tower"))).toBe(true);

    const tiny = createMountainSkeleton({
      templateId: "center-tower",
      seed: "tiny-seed",
      tileCount: 3,
      maxLayer: 6,
      initialFreeRange: { min: 6, max: 12 },
    });
    expect(tiny.nodes).toHaveLength(3);
  });

  it("提供 8 个核心模板的注册表元数据和默认参数", () => {
    const definitions = listHulebuMountainTemplateDefinitions();
    const centerTower = getHulebuMountainTemplateDefinition("center-tower");
    const twoWings = getHulebuMountainTemplateDefinition("two-wings");
    const cross = getHulebuMountainTemplateDefinition("cross");
    const ring = getHulebuMountainTemplateDefinition("ring");
    const longWall = getHulebuMountainTemplateDefinition("long-wall");

    expect(definitions.map((definition) => definition.id)).toEqual(CORE_TEMPLATE_IDS);
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
    expect(cross.experienceTags).toEqual(expect.arrayContaining(["key-release"]));
    expect(ring.experienceTags).toEqual(expect.arrayContaining(["visible-locked"]));
    expect(longWall.experienceTags).toEqual(expect.arrayContaining(["warmup", "reward-calm"]));
  });

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
      templateId: "unknown-template" as HulebuMountainTemplateId,
      seed: "bad-template",
      tileCount: 48,
      maxLayer: 6,
    })).toThrow("Unknown Hulebu mountain template");
  });

  it.each(CORE_TEMPLATE_IDS)("核心模板 %s seed 稳定、理论可解并输出模板报告", (templateId) => {
    const config = {
      templateId,
      seed: `${templateId}-stable-seed`,
      tileCount: templateId === "long-wall" ? 48 : 54,
      maxLayer: 6,
      initialFreeRange: { min: 6, max: 14 },
      randomness: 0.42,
      comboOrder: ["peng", "chi", "gang", "hu"] as HulebuMountainGeneratorConfig["comboOrder"],
      targetDifficulty: "normal" as const,
    };

    const result = generateHulebuMountain(config);
    const skeletonAgain = createMountainSkeleton(config);

    expect(result.skeleton).toEqual(skeletonAgain);
    expect(result.skeleton.templateId).toBe(templateId);
    expect(result.skeleton.nodes).toHaveLength(config.tileCount);
    expect(result.solution.remainingNodeCount).toBe(0);
    expect(result.levelTiles).toHaveLength(config.tileCount);
    expect(result.skeleton.nodes.some((node) => node.tags?.includes(`template:${templateId}`))).toBe(true);
    expect(result.experience.template).toEqual(expect.objectContaining({
      id: templateId,
      parameterSnapshot: expect.objectContaining({
        tileCount: config.tileCount,
        maxLayer: config.maxLayer,
      }),
    }));
    expect(result.experience.validators.solvable.passed).toBe(true);
    expect(result.experience.windowCurve.length).toBe(result.solution.steps.length + 1);
  });

  it("生成理论解法并沿路径分配碰吃杠胡牌面", () => {
    const result = generateHulebuMountain({
      templateId: "two-wings",
      seed: "combo-path-seed",
      tileCount: 54,
      maxLayer: 6,
      initialFreeRange: { min: 8, max: 12 },
      randomness: 0.45,
      comboOrder: ["peng", "chi", "gang", "hu"],
      decoyRate: 0.16,
      targetDifficulty: "hard",
    });

    const comboTypes = result.solution.steps.map((step) => step.comboType);
    const pengStep = result.solution.steps.find((step) => step.comboType === "peng");
    const chiStep = result.solution.steps.find((step) => step.comboType === "chi");
    const gangStep = result.solution.steps.find((step) => step.comboType === "gang");
    const huStep = result.solution.steps.find((step) => step.comboType === "hu");

    expect(result.solution.remainingNodeCount).toBe(0);
    expect(comboTypes).toEqual(expect.arrayContaining(["peng", "chi", "gang", "hu"]));
    expect(pengStep?.nodeIds).toHaveLength(3);
    expect(gangStep?.nodeIds).toHaveLength(4);
    expect(huStep?.nodeIds).toHaveLength(8);

    const pengFaces = pengStep?.nodeIds.map((nodeId) => result.assignment.facesByNodeId[nodeId]);
    expect(new Set(pengFaces?.map((face) => `${face?.suit}-${face?.rank}`)).size).toBe(1);

    const chiFaces = chiStep?.nodeIds.map((nodeId) => result.assignment.facesByNodeId[nodeId]) ?? [];
    const chiRanks = chiFaces.map((face) => face.rank).sort((a, b) => a - b);
    expect(new Set(chiFaces.map((face) => face.suit)).size).toBe(1);
    expect(chiRanks).toEqual([chiRanks[0], chiRanks[0] + 1, chiRanks[0] + 2]);

    expect(Object.keys(result.assignment.facesByNodeId)).toHaveLength(54);
    expect(result.assignment.comboHintGroups.length).toBe(result.solution.steps.length);
    expect(result.assignment.decoyNodeIds.length).toBeGreaterThan(0);
    expect(result.levelTiles).toHaveLength(54);
    expect(result.levelTiles[0]).toEqual(expect.objectContaining({
      location: "board",
      blockedBy: expect.any(Array),
    }));
  });

  it("输出可用于调关卡的体验报告", () => {
    const result = generateHulebuMountain({
      templateId: "center-tower",
      seed: "experience-report-seed",
      tileCount: 60,
      maxLayer: 6,
      initialFreeRange: { min: 8, max: 12 },
      randomness: 0.5,
      comboOrder: ["peng", "chi", "gang", "hu"],
      decoyRate: 0.2,
      targetDifficulty: "hard",
    });

    expect(result.experience.difficulty).toEqual(expect.objectContaining({
      target: "hard",
      grade: expect.stringMatching(/normal|hard|expert/),
      tileCount: 60,
      solutionStepCount: result.solution.steps.length,
    }));
    expect(result.experience.template).toEqual(expect.objectContaining({
      id: "center-tower",
      label: "中心塔",
      family: "pressure",
      experienceTags: expect.arrayContaining(["slot-pressure", "key-release"]),
      parameterSnapshot: expect.objectContaining({
        tileCount: 60,
        maxLayer: 6,
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
    expect(result.experience.rhythm.phaseCounts).toEqual(expect.objectContaining({
      warmup: expect.any(Number),
      pressure: expect.any(Number),
      release: expect.any(Number),
      climax: expect.any(Number),
    }));
    expect(result.experience.rhythm.phaseCounts.pressure).toBeGreaterThan(0);
    expect(result.experience.rhythm.releaseStepIndices.length).toBeGreaterThan(0);
    expect(result.experience.slotPressure.peak).toBeGreaterThanOrEqual(7);
    expect(result.experience.slotPressure.dangerStepIndices.length).toBeGreaterThan(0);
    expect(result.experience.decoys.count).toBe(result.assignment.decoyNodeIds.length);
    expect(result.experience.comboHints.huCandidateStepIndices.length).toBeGreaterThan(0);
    expect(result.experience.recommendations.length).toBeGreaterThan(0);
  });
});
