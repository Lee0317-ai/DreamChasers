import fs from "node:fs";
import path from "node:path";
import { rolldown } from "rolldown";
import { beforeAll, describe, expect, test } from "vitest";
import type {
  HulebuRunProfile,
  HulebuRuntimeLevelConfig,
  HulebuTileSuit,
} from "../../../apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig";
import type {
  HulebuRuntimeComboCandidateOption,
  HulebuRuntimeState as HulebuRuntimeStateClass,
  HulebuRuntimeLegacySnapshot,
  HulebuRuntimeSnapshot,
} from "../../../apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState";
import type { GameCommand, GameSnapshot } from "../../../apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain/GameContracts";
import type { GameSession as GameSessionClass } from "../../../apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain/GameSession";
import type {
  RunPhase,
  RunSnapshot,
  RunStateMachine as RunStateMachineClass,
} from "../../../apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain/RunStateMachine";
import type { GameCoordinator as GameCoordinatorClass } from "../../../apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/application/GameCoordinator";
import type {
  ContentRepository as ContentRepositoryClass,
  ContentSource,
} from "../../../apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/content/ContentRepository";
import type {
  SaveCodec,
  SaveService as SaveServiceClass,
  SaveServiceOptions,
  StoragePort,
} from "../../../apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/persistence/SaveService";

const workspaceRoot = path.resolve(__dirname, "../../..");
const cocosRoot = path.join(
  workspaceRoot,
  "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8",
);
const domainTsconfigPath = path.join(cocosRoot, "tsconfig.domain.json");
let HulebuRuntimeState: typeof HulebuRuntimeStateClass;
let GameSession: typeof GameSessionClass;
let RunStateMachine: typeof RunStateMachineClass;
let GameCoordinator: typeof GameCoordinatorClass;
let ContentRepository: typeof ContentRepositoryClass;
let SaveService: typeof SaveServiceClass;
let HULEBU_LEGACY_CONTENT_SOURCE: ContentSource;

beforeAll(async () => {
  const virtualEntryId = "\0hulebu-domain-test-entry";
  const bundle = await rolldown({
    input: virtualEntryId,
    tsconfig: domainTsconfigPath,
    plugins: [{
      name: "hulebu-domain-test-entry",
      resolveId: (id) => id === virtualEntryId ? virtualEntryId : null,
      load: (id) => id === virtualEntryId
        ? [
          `export { HulebuRuntimeState } from ${JSON.stringify(path.join(cocosRoot, "assets/scripts/runtime/HulebuRuntimeState.ts"))};`,
          `export { GameSession } from ${JSON.stringify(path.join(cocosRoot, "assets/scripts/domain/GameSession.ts"))};`,
          `export { RunStateMachine } from ${JSON.stringify(path.join(cocosRoot, "assets/scripts/domain/RunStateMachine.ts"))};`,
          `export { GameCoordinator } from ${JSON.stringify(path.join(cocosRoot, "assets/scripts/application/GameCoordinator.ts"))};`,
          `export { ContentRepository, HULEBU_LEGACY_CONTENT_SOURCE } from ${JSON.stringify(path.join(cocosRoot, "assets/scripts/content/ContentRepository.ts"))};`,
          `export { SaveService } from ${JSON.stringify(path.join(cocosRoot, "assets/scripts/persistence/SaveService.ts"))};`,
        ].join("\n")
        : null,
    }],
  });
  const generated = await bundle.generate({ format: "esm" });
  await bundle.close();
  const chunk = generated.output.find((item) => item.type === "chunk");
  if (!chunk) throw new Error("Hulebu domain test bundle did not produce an ESM chunk.");

  const moduleUrl = `data:text/javascript;base64,${Buffer.from(chunk.code).toString("base64")}`;
  const domainModule = await import(/* @vite-ignore */ moduleUrl) as {
    HulebuRuntimeState: typeof HulebuRuntimeStateClass;
    GameSession: typeof GameSessionClass;
    RunStateMachine: typeof RunStateMachineClass;
    GameCoordinator: typeof GameCoordinatorClass;
    ContentRepository: typeof ContentRepositoryClass;
    SaveService: typeof SaveServiceClass;
    HULEBU_LEGACY_CONTENT_SOURCE: ContentSource;
  };
  HulebuRuntimeState = domainModule.HulebuRuntimeState;
  GameSession = domainModule.GameSession;
  RunStateMachine = domainModule.RunStateMachine;
  GameCoordinator = domainModule.GameCoordinator;
  ContentRepository = domainModule.ContentRepository;
  SaveService = domainModule.SaveService;
  HULEBU_LEGACY_CONTENT_SOURCE = domainModule.HULEBU_LEGACY_CONTENT_SOURCE;
});

type LevelTile = HulebuRuntimeLevelConfig["tiles"][number];

function createTile(
  id: string,
  suit: HulebuTileSuit,
  rank: number,
  location: LevelTile["location"] = "board",
  blockedBy: string[] = [],
): LevelTile {
  return {
    id,
    suit,
    rank,
    x: 0,
    y: 0,
    layer: 0,
    blockedBy,
    location,
  };
}

function createLevel(options: {
  tiles: LevelTile[];
  id?: string;
  initialSlotOrder?: string[];
  initialReserveOrder?: string[];
  rewardPool?: string[];
  slotLimit?: number;
  shuffle?: number;
  undo?: number;
  discard?: number;
  order?: number;
}): HulebuRuntimeLevelConfig {
  return {
    id: options.id ?? "domain-test-level",
    order: options.order ?? 7,
    name: "Domain test",
    subtitle: "Deterministic fixture",
    rewardPool: options.rewardPool ?? [],
    bossGoals: [],
    defaults: {
      slotLimit: options.slotLimit ?? 8,
      reserveLimit: 0,
      shields: 0,
      firstProtect: false,
      tools: {
        shuffle: options.shuffle ?? 1,
        undo: options.undo ?? 1,
        discard: options.discard ?? 1,
        vision: 0,
      },
    },
    initialSlotOrder: options.initialSlotOrder ?? [],
    initialReserveOrder: options.initialReserveOrder ?? [],
    tiles: options.tiles,
  };
}

function createContentSource(options: {
  contentVersion?: string;
  saveSchemaVersion?: number;
  manifestLevelIds?: string[];
  manifestRewardIds?: string[];
  levels?: HulebuRuntimeLevelConfig[];
  rewardIds?: string[];
  resolver?: ContentSource["resolveRuntimeLevel"];
} = {}): ContentSource {
  const levels = options.levels ?? [
    createLevel({
      id: "level-a",
      order: 1,
      tiles: [createTile("board-a", "wan", 1)],
    }),
  ];
  const rewardIds = options.rewardIds ?? ["reward-a"];
  return {
    manifest: {
      contentVersion: options.contentVersion ?? "test-v1",
      saveSchemaVersion: options.saveSchemaVersion ?? 1,
      levelIds: options.manifestLevelIds ?? levels.map((level) => level.id),
      rewardIds: options.manifestRewardIds ?? rewardIds,
    },
    levels,
    rewardIds,
    resolveRuntimeLevel: options.resolver ?? ((index) => levels[index]),
  };
}

function createPengLevel(): HulebuRuntimeLevelConfig {
  return createLevel({
    tiles: [
      createTile("tile-a", "wan", 1),
      createTile("tile-b", "wan", 1),
      createTile("tile-c", "wan", 1),
      createTile("tile-d", "tong", 9),
    ],
  });
}

function createMultiChiLevel(): HulebuRuntimeLevelConfig {
  return createLevel({
    initialSlotOrder: ["wan-1", "wan-2", "wan-3", "wan-4"],
    tiles: [
      createTile("wan-1", "wan", 1, "slot"),
      createTile("wan-2", "wan", 2, "slot"),
      createTile("wan-3", "wan", 3, "slot"),
      createTile("wan-4", "wan", 4, "slot"),
      createTile("board-anchor", "tong", 9),
    ],
  });
}

function createMultiTypeComboLevel(): HulebuRuntimeLevelConfig {
  return createLevel({
    initialSlotOrder: [
      "wan-1",
      "wan-2",
      "wan-3",
      "wan-4",
      "tong-7-a",
      "tong-7-b",
      "tong-7-c",
    ],
    slotLimit: 12,
    tiles: [
      createTile("wan-1", "wan", 1, "slot"),
      createTile("wan-2", "wan", 2, "slot"),
      createTile("wan-3", "wan", 3, "slot"),
      createTile("wan-4", "wan", 4, "slot"),
      createTile("tong-7-a", "tong", 7, "slot"),
      createTile("tong-7-b", "tong", 7, "slot"),
      createTile("tong-7-c", "tong", 7, "slot"),
      createTile("board-anchor", "honor", 1),
    ],
  });
}

function collectRelativeImportGraph(entryPaths: string[]): Set<string> {
  const visited = new Set<string>();
  const pending = [...entryPaths];
  const importPattern = /\b(?:import|export)\s+(?:type\s+)?(?:[^'\"]*?\s+from\s+)?["']([^"']+)["']/g;

  while (pending.length > 0) {
    const currentPath = pending.pop();
    if (!currentPath || visited.has(currentPath)) continue;

    visited.add(currentPath);
    const source = fs.readFileSync(currentPath, "utf8");
    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1];
      if (!specifier.startsWith(".")) continue;

      const resolvedBase = path.resolve(path.dirname(currentPath), specifier);
      const resolvedPath = [resolvedBase, `${resolvedBase}.ts`, path.join(resolvedBase, "index.ts")]
        .find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
      if (resolvedPath) pending.push(resolvedPath);
    }
  }

  return visited;
}

function observeSessionDispatch(session: GameSessionClass): () => number {
  const dispatch = session.dispatch.bind(session);
  let callCount = 0;
  session.dispatch = (command) => {
    callCount += 1;
    return dispatch(command);
  };
  return () => callCount;
}

describe("Hulebu Cocos content repository", () => {
  test("accepts the current legacy level pack with a stable versioned manifest", () => {
    const repository = new ContentRepository(
      HULEBU_LEGACY_CONTENT_SOURCE,
      1,
      ["cocos-hardcoded-v1"],
    );

    expect(repository.manifest).toMatchObject({
      contentVersion: "cocos-hardcoded-v1",
      saveSchemaVersion: 1,
    });
    expect(repository.manifest.levelIds).toHaveLength(repository.getLevelCount());
    expect(repository.getLevelByIndex(0).id).toBe(repository.manifest.levelIds[0]);
  });

  test.each([
    {
      name: "empty level id",
      levels: [createLevel({
        id: "",
        order: 1,
        tiles: [createTile("tile-a", "wan", 1)],
      })],
      levelIds: [""],
      error: /level id/i,
    },
    {
      name: "duplicate level id",
      levels: [
        createLevel({ id: "same", order: 1, tiles: [createTile("tile-a", "wan", 1)] }),
        createLevel({ id: "same", order: 2, tiles: [createTile("tile-b", "wan", 2)] }),
      ],
      levelIds: ["same", "same"],
      error: /duplicate level id/i,
    },
    {
      name: "duplicate level order",
      levels: [
        createLevel({ id: "level-a", order: 1, tiles: [createTile("tile-a", "wan", 1)] }),
        createLevel({ id: "level-b", order: 1, tiles: [createTile("tile-b", "wan", 2)] }),
      ],
      levelIds: ["level-a", "level-b"],
      error: /duplicate level order/i,
    },
    {
      name: "non-positive level order",
      levels: [createLevel({
        id: "level-a",
        order: 0,
        tiles: [createTile("tile-a", "wan", 1)],
      })],
      levelIds: ["level-a"],
      error: /level.*order.*positive/i,
    },
    {
      name: "empty tile id",
      levels: [createLevel({
        id: "level-a",
        order: 1,
        tiles: [createTile("", "wan", 1)],
      })],
      levelIds: ["level-a"],
      error: /tile id/i,
    },
    {
      name: "duplicate tile id",
      levels: [createLevel({
        id: "level-a",
        order: 1,
        tiles: [
          createTile("same", "wan", 1),
          createTile("same", "wan", 2),
        ],
      })],
      levelIds: ["level-a"],
      error: /duplicate tile id/i,
    },
  ])("rejects $name", ({ levels, levelIds, error }) => {
    expect(() => new ContentRepository(
      createContentSource({ levels, manifestLevelIds: levelIds }),
      1,
      ["test-v1"],
    )).toThrow(error);
  });

  test("rejects a manifest that references a missing level", () => {
    expect(() => new ContentRepository(
      createContentSource({ manifestLevelIds: ["level-a", "missing-level"] }),
      1,
      ["test-v1"],
    )).toThrow(/manifest.*missing-level/i);
  });

  test("rejects manifest level ids whose order diverges from loaded level indexes", () => {
    const levels = [
      createLevel({ id: "level-a", order: 1, tiles: [createTile("tile-a", "wan", 1)] }),
      createLevel({ id: "level-b", order: 2, tiles: [createTile("tile-b", "wan", 2)] }),
    ];

    expect(() => new ContentRepository(
      createContentSource({
        levels,
        manifestLevelIds: ["level-b", "level-a"],
      }),
      1,
      ["test-v1"],
    )).toThrow(/manifest level id.*index 0.*level-a/i);
  });

  test.each([
    {
      name: "dangling blocker",
      level: createLevel({
        id: "level-a",
        order: 1,
        tiles: [createTile("tile-a", "wan", 1, "board", ["missing-tile"])],
      }),
      error: /blockedBy.*missing-tile/i,
    },
    {
      name: "self blocker",
      level: createLevel({
        id: "level-a",
        order: 1,
        tiles: [createTile("tile-a", "wan", 1, "board", ["tile-a"])],
      }),
      error: /blockedBy.*itself/i,
    },
    {
      name: "dangling initial slot",
      level: createLevel({
        id: "level-a",
        order: 1,
        initialSlotOrder: ["missing-tile"],
        tiles: [createTile("tile-a", "wan", 1)],
      }),
      error: /initialSlotOrder.*missing-tile/i,
    },
    {
      name: "duplicate initial slot reference",
      level: createLevel({
        id: "level-a",
        order: 1,
        initialSlotOrder: ["tile-a", "tile-a"],
        tiles: [createTile("tile-a", "wan", 1, "slot")],
      }),
      error: /initialSlotOrder.*duplicate/i,
    },
    {
      name: "dangling initial reserve",
      level: createLevel({
        id: "level-a",
        order: 1,
        initialReserveOrder: ["missing-tile"],
        tiles: [createTile("tile-a", "wan", 1)],
      }),
      error: /initialReserveOrder.*missing-tile/i,
    },
    {
      name: "duplicate initial reserve reference",
      level: createLevel({
        id: "level-a",
        order: 1,
        initialReserveOrder: ["tile-a", "tile-a"],
        tiles: [createTile("tile-a", "wan", 1, "reserve")],
      }),
      error: /initialReserveOrder.*duplicate/i,
    },
    {
      name: "slot and reserve overlap",
      level: createLevel({
        id: "level-a",
        order: 1,
        initialSlotOrder: ["tile-a"],
        initialReserveOrder: ["tile-a"],
        tiles: [createTile("tile-a", "wan", 1, "slot")],
      }),
      error: /initial.*tile-a.*both/i,
    },
  ])("rejects $name references", ({ level, error }) => {
    expect(() => new ContentRepository(
      createContentSource({ levels: [level] }),
      1,
      ["test-v1"],
    )).toThrow(error);
  });

  test("rejects a reward pool entry that is absent from loaded reward ids", () => {
    const level = createLevel({
      id: "level-a",
      order: 1,
      rewardPool: ["missing-reward"],
      tiles: [createTile("tile-a", "wan", 1)],
    });

    expect(() => new ContentRepository(
      createContentSource({ levels: [level], rewardIds: ["reward-a"] }),
      1,
      ["test-v1"],
    )).toThrow(/rewardPool.*missing-reward/i);
  });

  test("rejects loaded reward ids omitted from the versioned manifest", () => {
    const level = createLevel({
      id: "level-a",
      order: 1,
      rewardPool: ["reward-b"],
      tiles: [createTile("tile-a", "wan", 1)],
    });

    expect(() => new ContentRepository(
      createContentSource({
        levels: [level],
        rewardIds: ["reward-a", "reward-b"],
        manifestRewardIds: ["reward-a"],
      }),
      1,
      ["test-v1"],
    )).toThrow(/loaded reward id reward-b.*manifest/i);
  });

  test.each([
    {
      name: "empty content version",
      source: createContentSource({ contentVersion: "" }),
      supportedSaveSchemaVersion: 1,
      supportedContentVersions: ["test-v1"],
      error: /contentVersion.*empty/i,
    },
    {
      name: "unsupported content version",
      source: createContentSource({ contentVersion: "future-v2" }),
      supportedSaveSchemaVersion: 1,
      supportedContentVersions: ["test-v1"],
      error: /unsupported contentVersion.*future-v2/i,
    },
    {
      name: "future save schema",
      source: createContentSource({ saveSchemaVersion: 2 }),
      supportedSaveSchemaVersion: 1,
      supportedContentVersions: ["test-v1"],
      error: /saveSchemaVersion.*2.*supported.*1/i,
    },
  ])("rejects $name", ({
    source,
    supportedSaveSchemaVersion,
    supportedContentVersions,
    error,
  }) => {
    expect(() => new ContentRepository(
      source,
      supportedSaveSchemaVersion,
      supportedContentVersions,
    )).toThrow(error);
  });

  test("fails explicitly for out-of-range level indexes", () => {
    const repository = new ContentRepository(
      createContentSource(),
      1,
      ["test-v1"],
    );
    const profile: HulebuRunProfile = {
      mode: "mainline",
      displayName: "Test",
      startOrder: 1,
    };

    expect(() => repository.getLevelByIndex(-1)).toThrow(/level index.*-1.*out of range/i);
    expect(() => repository.getLevelByIndex(1)).toThrow(/level index.*1.*out of range/i);
    expect(() => repository.createRuntimeLevel(1, profile)).toThrow(/level index.*1.*out of range/i);
  });

  test("defensive copies keep source and returned mutations out of repository state", () => {
    const source = createContentSource();
    const repository = new ContentRepository(source, 1, ["test-v1"]);

    (source.manifest.levelIds as string[])[0] = "source-mutated";
    source.levels[0].defaults.tools.shuffle = 99;
    const manifest = repository.manifest as { levelIds: string[] };
    const level = repository.getLevelByIndex(0);
    manifest.levelIds[0] = "caller-mutated";
    level.defaults.tools.shuffle = 88;
    level.tiles[0].blockedBy.push("caller-mutated");

    expect(repository.manifest.levelIds).toEqual(["level-a"]);
    expect(repository.getLevelByIndex(0).defaults.tools.shuffle).toBe(1);
    expect(repository.getLevelByIndex(0).tiles[0].blockedBy).toEqual([]);
  });

  test("uses only the injected resolver for runtime levels", () => {
    const calls: Array<{
      index: number;
      profile: HulebuRunProfile;
      displayOrder?: number;
    }> = [];
    const resolvedLevel = createLevel({
      id: "resolved-custom-level",
      order: 42,
      tiles: [createTile("resolved-tile", "honor", 1)],
    });
    const source = createContentSource({
      resolver: (index, profile, displayOrder) => {
        calls.push({ index, profile, displayOrder });
        return resolvedLevel;
      },
    });
    const repository = new ContentRepository(source, 1, ["test-v1"]);
    const profile: HulebuRunProfile = {
      mode: "daily",
      displayName: "Injected",
      startOrder: 1,
      dailySeed: "repository-test",
    };

    const first = repository.createRuntimeLevel(0, profile, 42);
    first.tiles[0].id = "caller-mutated";
    const second = repository.createRuntimeLevel(0, profile, 42);

    expect(calls).toEqual([
      { index: 0, profile, displayOrder: 42 },
      { index: 0, profile, displayOrder: 42 },
    ]);
    expect(second.id).toBe("resolved-custom-level");
    expect(second.tiles[0].id).toBe("resolved-tile");
  });
});

describe("Hulebu Cocos domain session", () => {
  test("produces identical results for the same level and command sequence", () => {
    const level = createPengLevel();
    const first = new GameSession(new HulebuRuntimeState(level));
    const second = new GameSession(new HulebuRuntimeState(level));
    const commands: GameCommand[] = [
      { type: "tile.select", tileId: "tile-a" },
      { type: "tile.select", tileId: "tile-b" },
      { type: "tile.select", tileId: "tile-c" },
      { type: "combo.execute", combo: "peng" },
    ];

    expect(commands.map((command) => first.dispatch(command)))
      .toEqual(commands.map((command) => second.dispatch(command)));
    expect(first.snapshot()).toEqual(second.snapshot());
  });

  test("rejects an unknown tile without changing the revision", () => {
    const session = new GameSession(new HulebuRuntimeState(createPengLevel()));
    const before = session.snapshot();

    const result = session.dispatch({ type: "tile.select", tileId: "missing" });

    expect(result).toMatchObject({ accepted: false, changed: false });
    expect(result.events).toEqual([
      expect.objectContaining({ type: "command.rejected", commandType: "tile.select" }),
    ]);
    expect(result.snapshot).toEqual(before);
  });

  test("rejects a blocked tile without changing the revision", () => {
    const level = createLevel({
      tiles: [
        createTile("lower", "wan", 1, "board", ["upper"]),
        createTile("upper", "tong", 2),
      ],
    });
    const session = new GameSession(new HulebuRuntimeState(level));

    const result = session.dispatch({ type: "tile.select", tileId: "lower" });

    expect(result).toMatchObject({ accepted: false, changed: false });
    expect(result.snapshot.revision).toBe(0);
    expect(result.snapshot.runtime.slot).toEqual([]);
  });

  test("emits a clear event when a successful mutation clears the level", () => {
    const level = createLevel({ tiles: [createTile("last", "wan", 1)] });
    const session = new GameSession(new HulebuRuntimeState(level));

    const result = session.dispatch({ type: "tile.select", tileId: "last" });

    expect(result).toMatchObject({ accepted: true, changed: true });
    expect(result.snapshot).toMatchObject({ revision: 1, status: "cleared" });
    expect(result.events).toEqual([
      { type: "tile.selected", tileId: "last" },
      { type: "level.cleared" },
    ]);
  });

  test("rejects combo execution when there is no candidate", () => {
    const session = new GameSession(new HulebuRuntimeState(createPengLevel()));
    const before = session.snapshot();

    const result = session.dispatch({ type: "combo.execute", combo: "peng" });

    expect(result).toMatchObject({ accepted: false, changed: false });
    expect(result.snapshot).toEqual(before);
    expect(result.events).toEqual([
      expect.objectContaining({ type: "command.rejected", commandType: "combo.execute" }),
    ]);
  });

  test("executes a single combo candidate directly", () => {
    const session = new GameSession(new HulebuRuntimeState(createPengLevel()));
    for (const tileId of ["tile-a", "tile-b", "tile-c"]) {
      expect(session.dispatch({ type: "tile.select", tileId }).accepted).toBe(true);
    }

    const result = session.dispatch({ type: "combo.execute", combo: "peng" });

    expect(result).toMatchObject({ accepted: true, changed: true });
    expect(result.snapshot.revision).toBe(4);
    expect(result.events).toEqual([
      { type: "combo.executed", combo: "peng", candidateId: "peng:tile-a,tile-b,tile-c" },
    ]);
  });

  test("requests an exact choice for a combo with multiple candidates", () => {
    const level = createMultiChiLevel();
    const runtime = new HulebuRuntimeState(level);
    const before = runtime.exportSnapshot();
    const options = runtime.getComboCandidateOptions("chi");
    const session = new GameSession(runtime);

    const result = session.dispatch({ type: "combo.execute", combo: "chi" });

    expect(options).toHaveLength(2);
    expect(result).toMatchObject({ accepted: true, changed: false });
    expect(result.snapshot.revision).toBe(0);
    expect(result.snapshot.runtime).toEqual(before);
    expect(result.events).toEqual([
      { type: "combo.choice.required", combo: "chi", candidates: options },
    ]);
  });

  test("settles only the exact candidate id supplied to combo.choose", () => {
    const level = createMultiChiLevel();
    const runtime = new HulebuRuntimeState(level);
    const options = runtime.getComboCandidateOptions("chi");
    const session = new GameSession(runtime);

    const rejected = session.dispatch({ type: "combo.choose", candidateId: `${options[0].key}-wrong` });
    const accepted = session.dispatch({ type: "combo.choose", candidateId: options[1].key });

    expect(rejected).toMatchObject({ accepted: false, changed: false });
    expect(rejected.snapshot.revision).toBe(0);
    expect(accepted).toMatchObject({ accepted: true, changed: true });
    expect(accepted.snapshot.revision).toBe(1);
    expect(accepted.events).toEqual([
      { type: "combo.executed", combo: "chi", candidateId: options[1].key },
    ]);
    expect(accepted.snapshot.runtime.slot).toEqual(["wan-1"]);
  });

  test("rejects a discard prompt when no slot tile can be discarded", () => {
    const runtime = new HulebuRuntimeState(createLevel({
      discard: 1,
      tiles: [createTile("board-a", "wan", 1)],
    }));
    const session = new GameSession(runtime);

    expect(runtime.canUseDiscardTool()).toBe(false);
    expect(session.dispatch({ type: "tool.use", tool: "discard" }))
      .toMatchObject({ accepted: false, changed: false });
  });

  test("shares discard capability prerequisites with the runtime mutation", () => {
    const noUsesLevel = createLevel({
      discard: 0,
      initialSlotOrder: ["slot-a"],
      tiles: [createTile("slot-a", "wan", 1, "slot"), createTile("board-a", "tong", 2)],
    });
    const noUsesRuntime = new HulebuRuntimeState(noUsesLevel);
    const noUsesBefore = noUsesRuntime.exportSnapshot();
    expect(noUsesRuntime.canUseDiscardTool()).toBe(false);
    expect(noUsesRuntime.discardSlotTile(0)).toBe(false);
    expect(noUsesRuntime.exportSnapshot()).toEqual(noUsesBefore);

    const clearedRuntime = new HulebuRuntimeState(createLevel({
      discard: 1,
      initialSlotOrder: ["slot-a"],
      tiles: [createTile("slot-a", "wan", 1, "slot")],
    }));
    expect(clearedRuntime.canUseDiscardTool()).toBe(false);
    expect(clearedRuntime.discardSlotTile(0)).toBe(false);

    const fullRiverLevel = createLevel({
      discard: 1,
      initialSlotOrder: ["slot-a"],
      tiles: [
        createTile("slot-a", "wan", 1, "slot"),
        createTile("board-a", "tong", 2),
        createTile("river-a", "tiao", 3, "river"),
        createTile("river-b", "tiao", 4, "river"),
        createTile("river-c", "tiao", 5, "river"),
      ],
    });
    const fullRiverSnapshot = new HulebuRuntimeState(fullRiverLevel).exportSnapshot();
    fullRiverSnapshot.river = ["river-a", "river-b", "river-c"];
    const fullRiverRuntime = HulebuRuntimeState.fromSnapshot(fullRiverLevel, fullRiverSnapshot);
    expect(fullRiverRuntime.canUseDiscardTool()).toBe(false);
    expect(fullRiverRuntime.discardSlotTile(0)).toBe(false);
  });

  test("rejects discard selection when no discard use remains", () => {
    const level = createLevel({
      discard: 0,
      initialSlotOrder: ["slot-a"],
      tiles: [createTile("slot-a", "wan", 1, "slot"), createTile("board-a", "tong", 2)],
    });
    const session = new GameSession(new HulebuRuntimeState(level));

    const toolResult = session.dispatch({ type: "tool.use", tool: "discard" });
    const discardResult = session.dispatch({ type: "slot.discard", slotIndex: 0 });

    expect(toolResult).toMatchObject({ accepted: false, changed: false });
    expect(discardResult).toMatchObject({ accepted: false, changed: false });
    expect(discardResult.snapshot).toMatchObject({ revision: 0 });
    expect(discardResult.snapshot.runtime.slot).toEqual(["slot-a"]);
  });

  test("requests a discard choice without spending the use until a slot is discarded", () => {
    const level = createLevel({
      discard: 1,
      initialSlotOrder: ["slot-a"],
      tiles: [createTile("slot-a", "wan", 1, "slot"), createTile("board-a", "tong", 2)],
    });
    const session = new GameSession(new HulebuRuntimeState(level));

    const requested = session.dispatch({ type: "tool.use", tool: "discard" });
    const discarded = session.dispatch({ type: "slot.discard", slotIndex: 0 });

    expect(requested).toMatchObject({ accepted: true, changed: false });
    expect(requested.events).toEqual([{ type: "discard.choice.required" }]);
    expect(requested.snapshot).toMatchObject({ revision: 0 });
    expect(requested.snapshot.runtime.tools.discard).toBe(1);
    expect(discarded).toMatchObject({ accepted: true, changed: true });
    expect(discarded.events).toEqual([{ type: "slot.discarded", slotIndex: 0 }]);
    expect(discarded.snapshot).toMatchObject({ revision: 1 });
    expect(discarded.snapshot.runtime.tools.discard).toBe(0);
  });

  test("maps shuffle and undo tool mutations to deterministic events", () => {
    const level = createLevel({
      tiles: [
        createTile("board-a", "wan", 1),
        createTile("board-b", "tong", 2),
        createTile("board-c", "tiao", 3),
      ],
    });
    const session = new GameSession(new HulebuRuntimeState(level));

    const shuffled = session.dispatch({ type: "tool.use", tool: "shuffle" });
    const undone = session.dispatch({ type: "tool.use", tool: "undo" });

    expect(shuffled).toMatchObject({ accepted: true, changed: true });
    expect(shuffled.events).toEqual([{ type: "tool.used", tool: "shuffle" }]);
    expect(undone).toMatchObject({ accepted: true, changed: true });
    expect(undone.events).toEqual([{ type: "tool.used", tool: "undo" }]);
    expect(undone.snapshot.revision).toBe(2);
  });

  test.each<GameCommand>([
    { type: "reward.choose", rewardId: "reward-a" },
    { type: "event.choose", optionId: "option-a" },
    { type: "flow.pause" },
    { type: "flow.resume" },
  ])("rejects coordinator command $type without changing runtime", (command) => {
    const session = new GameSession(new HulebuRuntimeState(createPengLevel()));
    const before = session.snapshot();

    const result = session.dispatch(command);

    expect(result).toMatchObject({ accepted: false, changed: false });
    expect(result.events).toEqual([
      expect.objectContaining({ type: "command.rejected", commandType: command.type }),
    ]);
    expect(result.snapshot).toEqual(before);
  });

  test("returns snapshots whose nested state cannot mutate the session", () => {
    const session = new GameSession(new HulebuRuntimeState(createPengLevel()));
    const result = session.dispatch({ type: "tile.select", tileId: "tile-a" });

    result.snapshot.runtime.tiles[0].blockedBy.push("external-blocker");
    result.snapshot.runtime.slot.push("external-slot");
    result.snapshot.runtime.history[0]?.slot.push("external-history-slot");

    const fresh = session.snapshot();
    expect(fresh.runtime.tiles[0].blockedBy).not.toContain("external-blocker");
    expect(fresh.runtime.slot).not.toContain("external-slot");
    expect(fresh.runtime.history[0]?.slot).not.toContain("external-history-slot");
  });

  test("serializes and restores undo history without changing undo behavior", () => {
    const level = createLevel({
      tiles: [createTile("board-a", "wan", 1), createTile("board-b", "tong", 2)],
    });
    const original = new GameSession(new HulebuRuntimeState(level));
    original.dispatch({ type: "tile.select", tileId: "board-a" });
    const serialized = JSON.parse(JSON.stringify(original.snapshot())) as GameSnapshot;
    const restored = new GameSession(
      HulebuRuntimeState.fromSnapshot(level, serialized.runtime),
      serialized.revision,
    );

    expect(restored.dispatch({ type: "tool.use", tool: "undo" }))
      .toEqual(original.dispatch({ type: "tool.use", tool: "undo" }));
  });

  test("migrates a legacy runtime snapshot to empty disabled undo history", () => {
    const level = createLevel({
      tiles: [createTile("board-a", "wan", 1), createTile("board-b", "tong", 2)],
    });
    const currentSnapshot: HulebuRuntimeSnapshot = new HulebuRuntimeState(level).exportSnapshot();
    const { history: _history, ...legacyCore } = currentSnapshot;
    const legacySnapshot: HulebuRuntimeLegacySnapshot = legacyCore;

    const restored = HulebuRuntimeState.fromSnapshot(level, legacySnapshot);

    expect(currentSnapshot.history).toEqual([]);
    expect(restored.exportSnapshot().history).toEqual([]);
    expect(restored.exportSnapshot().tools.undo).toBe(0);
    expect(restored.useUndoTool()).toBe(false);
  });

  test("keeps runtime history bounded and free of nested history payloads", () => {
    const tiles = Array.from({ length: 15 }, (_, index) =>
      createTile(`board-${index}`, "wan", (index % 9) + 1));
    const session = new GameSession(new HulebuRuntimeState(createLevel({ tiles, slotLimit: 16 })));

    for (let index = 0; index < 14; index += 1) {
      expect(session.dispatch({ type: "tile.select", tileId: `board-${index}` }).accepted).toBe(true);
    }

    const snapshot = session.snapshot();
    expect(snapshot.runtime.history).toHaveLength(12);
    expect(snapshot.runtime.history.every((entry) => !("history" in entry))).toBe(true);
  });

  test("exposes read-only combo and discard capability queries to application flow", () => {
    const runtime = new HulebuRuntimeState(createMultiChiLevel());
    const session = new GameSession(runtime);

    expect(session.getComboCandidateOptions("chi"))
      .toEqual(runtime.getComboCandidateOptions("chi"));
    expect(session.canUseDiscardTool()).toBe(true);

    const unavailableDiscard = new GameSession(new HulebuRuntimeState(createLevel({
      discard: 0,
      initialSlotOrder: ["slot-a"],
      tiles: [
        createTile("slot-a", "wan", 1, "slot"),
        createTile("board-a", "tong", 2),
      ],
    })));
    expect(unavailableDiscard.canUseDiscardTool()).toBe(false);
  });

  test("keeps the domain and runtime import graph free of Cocos runtime modules", () => {
    const entries = [
      "assets/scripts/domain/GameContracts.ts",
      "assets/scripts/domain/GameSession.ts",
      "assets/scripts/domain/RunStateMachine.ts",
      "assets/scripts/application/GameCoordinator.ts",
      "assets/scripts/runtime/HulebuRuntimeState.ts",
    ].map((relativePath) => path.join(cocosRoot, relativePath));
    const graph = collectRelativeImportGraph(entries);
    const offenders = [...graph].flatMap((filePath) => {
      const source = fs.readFileSync(filePath, "utf8");
      const relativePath = path.relative(cocosRoot, filePath);
      return relativePath.includes("assets/scripts/bootstrap/")
        || /\b(?:from\s+|import\s*)["']cc(?:\/env)?["']/.test(source)
        || /\bimport\s*\(\s*["']cc(?:\/env)?["']\s*\)/.test(source)
        || /\b(?:window|document|navigator|localStorage)\b/.test(source)
        ? [relativePath]
        : [];
    });

    expect(offenders).toEqual([]);
  });

  test("ships a standalone strict domain tsconfig and valid Cocos metadata", () => {
    const tsconfig = JSON.parse(
      fs.readFileSync(path.join(cocosRoot, "tsconfig.domain.json"), "utf8"),
    ) as { extends?: string; compilerOptions?: { strict?: boolean; noEmit?: boolean }; include?: string[] };
    const directoryMeta = JSON.parse(
      fs.readFileSync(path.join(cocosRoot, "assets/scripts/domain.meta"), "utf8"),
    ) as { importer?: string; uuid?: string };
    const applicationDirectoryMeta = JSON.parse(
      fs.readFileSync(path.join(cocosRoot, "assets/scripts/application.meta"), "utf8"),
    ) as { importer?: string; uuid?: string };

    expect(tsconfig.extends).toBeUndefined();
    expect(tsconfig.compilerOptions).toMatchObject({ strict: true, noEmit: true });
    expect(tsconfig.include).toEqual(expect.arrayContaining([
      "assets/scripts/runtime/**/*.ts",
      "assets/scripts/domain/**/*.ts",
      "assets/scripts/application/**/*.ts",
      "assets/scripts/content/**/*.ts",
      "assets/scripts/persistence/**/*.ts",
    ]));
    expect(directoryMeta).toMatchObject({ importer: "directory" });
    expect(directoryMeta.uuid).toMatch(/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/);
    expect(applicationDirectoryMeta).toMatchObject({ importer: "directory" });
    expect(applicationDirectoryMeta.uuid).toMatch(/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/);

    for (const [directory, fileName] of [
      ["domain", "GameContracts.ts.meta"],
      ["domain", "GameSession.ts.meta"],
      ["domain", "RunStateMachine.ts.meta"],
      ["application", "GameCoordinator.ts.meta"],
    ] as const) {
      const meta = JSON.parse(
        fs.readFileSync(path.join(cocosRoot, "assets/scripts", directory, fileName), "utf8"),
      ) as { importer?: string; uuid?: string };
      expect(meta).toMatchObject({ importer: "typescript" });
      expect(meta.uuid).toMatch(/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/);
    }

    const coordinatorSource = fs.readFileSync(
      path.join(cocosRoot, "assets/scripts/application/GameCoordinator.ts"),
      "utf8",
    );
    expect(coordinatorSource).not.toContain("session as unknown");
  });
});

describe("Hulebu Cocos run coordinator", () => {
  test("allows the explicit run phase paths and rejects an illegal reward transition", () => {
    const run = new RunStateMachine("encounterIntro");
    const path: RunPhase[] = [
      "playing.tileEntering",
      "playing.idle",
      "playing.resolving",
      "playing.comboChoosing",
      "playing.resolving",
      "playing.dangerCheck",
      "playing.idle",
      "playing.discardChoosing",
      "playing.resolving",
      "playing.dangerCheck",
      "encounterCleared",
      "rewardChoice",
    ];

    for (const phase of path) {
      expect(run.transition(phase)).toBe(true);
      expect(run.phase).toBe(phase);
    }

    expect(run.transition("playing.resolving")).toBe(false);
    expect(run.phase).toBe("rewardChoice");
  });

  test("distinguishes stable phases from the narrower persistable allowlist", () => {
    for (const phase of [
      "playing.tileEntering",
      "playing.resolving",
      "playing.dangerCheck",
    ] as const) {
      const run = new RunStateMachine(phase);
      expect(run.isStable()).toBe(false);
      expect(run.isPersistable()).toBe(false);
    }

    expect(new RunStateMachine("playing.comboChoosing").isStable()).toBe(true);
    expect(new RunStateMachine("playing.comboChoosing").isPersistable()).toBe(true);
    expect(new RunStateMachine("paused").isStable()).toBe(true);
    expect(new RunStateMachine("paused").isPersistable()).toBe(false);
    expect(new RunStateMachine("failed").isStable()).toBe(true);
    expect(new RunStateMachine("failed").isPersistable()).toBe(false);
  });

  test("rejects the non-plan resolving to discard choice transition", () => {
    const run = new RunStateMachine("playing.resolving");

    expect(run.transition("playing.discardChoosing")).toBe(false);
    expect(run.phase).toBe("playing.resolving");
  });

  test.each([
    "playing.idle",
    "playing.comboChoosing",
    "playing.discardChoosing",
  ] as const)("pauses and resumes exactly to %s without dispatching to the session", (phase) => {
    const run = new RunStateMachine(phase === "playing.comboChoosing" ? "playing.idle" : phase);
    const session = new GameSession(new HulebuRuntimeState(
      phase === "playing.comboChoosing"
        ? createMultiChiLevel()
        : phase === "playing.discardChoosing"
          ? createLevel({
            initialSlotOrder: ["slot-a"],
            tiles: [
              createTile("slot-a", "wan", 1, "slot"),
              createTile("board-a", "tong", 2),
            ],
          })
          : createPengLevel(),
    ));
    const dispatchCount = observeSessionDispatch(session);
    const coordinator = new GameCoordinator(run, session);
    const setupDispatches = phase === "playing.comboChoosing" ? 1 : 0;
    if (phase === "playing.comboChoosing") {
      expect(coordinator.dispatch({ type: "combo.execute", combo: "chi" }).phase).toBe(phase);
    }

    const paused = coordinator.dispatch({ type: "flow.pause" });
    expect(paused).toMatchObject({ accepted: true, changed: true, phase: "paused" });
    expect(paused.events).toEqual([{ type: "flow.paused" }]);
    expect(paused.runSnapshot.context.pauseReturnPhase).toBe(phase);

    const resumed = coordinator.dispatch({ type: "flow.resume" });
    expect(resumed).toMatchObject({ accepted: true, changed: true, phase });
    expect(resumed.events).toEqual([{ type: "flow.resumed" }]);
    expect(resumed.runSnapshot.context.pauseReturnPhase).toBeNull();
    expect(dispatchCount()).toBe(setupDispatches);
  });

  test("rejects resume without a saved return phase and leaves the session untouched", () => {
    const run = new RunStateMachine("paused");
    const session = new GameSession(new HulebuRuntimeState(createPengLevel()));
    const dispatchCount = observeSessionDispatch(session);
    const coordinator = new GameCoordinator(run, session);
    const before = coordinator.snapshot();

    const restored = GameCoordinator.restore(before, session);
    expect(restored.snapshot()).toEqual(before);

    const result = restored.dispatch({ type: "flow.resume" });

    expect(result).toMatchObject({ accepted: false, changed: false, phase: "paused" });
    expect(result.events).toEqual([
      expect.objectContaining({ type: "command.rejected", commandType: "flow.resume" }),
    ]);
    expect(result.runSnapshot).toEqual(before);
    expect(dispatchCount()).toBe(0);
  });

  test.each([
    ["playing.discardChoosing", null],
    ["paused", "playing.discardChoosing"],
  ] as const)("rejects %s restore when discard is unavailable", (phase, pauseReturnPhase) => {
    const session = new GameSession(new HulebuRuntimeState(createLevel({
      discard: 0,
      initialSlotOrder: ["slot-a"],
      tiles: [
        createTile("slot-a", "wan", 1, "slot"),
        createTile("board-a", "tong", 2),
      ],
    })));
    const idleSnapshot = new GameCoordinator(
      new RunStateMachine("playing.idle"),
      session,
    ).snapshot();
    const invalidSnapshot: RunSnapshot = {
      ...idleSnapshot,
      phase,
      context: {
        ...idleSnapshot.context,
        pauseReturnPhase,
      },
    };

    expect(() => GameCoordinator.restore(invalidSnapshot, session))
      .toThrow(/discard.*available/i);
  });

  test("runs ordinary mutations through resolving and danger check before returning idle", () => {
    const tileRun = new RunStateMachine("playing.idle");
    const tileTransitions: RunPhase[] = [];
    const tileTransition = tileRun.transition.bind(tileRun);
    tileRun.transition = (phase) => {
      const accepted = tileTransition(phase);
      if (accepted) tileTransitions.push(phase);
      return accepted;
    };
    const tileCoordinator = new GameCoordinator(
      tileRun,
      new GameSession(new HulebuRuntimeState(createLevel({
        tiles: [createTile("board-a", "wan", 1), createTile("board-b", "tong", 2)],
      }))),
    );

    expect(tileCoordinator.dispatch({ type: "tile.select", tileId: "board-a" }))
      .toMatchObject({ accepted: true, changed: true, phase: "playing.idle" });
    expect(tileTransitions).toEqual([
      "playing.resolving",
      "playing.dangerCheck",
      "playing.idle",
    ]);

    const toolRun = new RunStateMachine("playing.idle");
    const toolTransitions: RunPhase[] = [];
    const toolTransition = toolRun.transition.bind(toolRun);
    toolRun.transition = (phase) => {
      const accepted = toolTransition(phase);
      if (accepted) toolTransitions.push(phase);
      return accepted;
    };
    const toolCoordinator = new GameCoordinator(
      toolRun,
      new GameSession(new HulebuRuntimeState(createLevel({
        tiles: [
          createTile("board-a", "wan", 1),
          createTile("board-b", "tong", 2),
          createTile("board-c", "tiao", 3),
        ],
      }))),
    );

    expect(toolCoordinator.dispatch({ type: "tool.use", tool: "shuffle" }))
      .toMatchObject({ accepted: true, changed: true, phase: "playing.idle" });
    expect(toolTransitions).toEqual([
      "playing.resolving",
      "playing.dangerCheck",
      "playing.idle",
    ]);
    toolTransitions.length = 0;
    expect(toolCoordinator.dispatch({ type: "tool.use", tool: "undo" }))
      .toMatchObject({ accepted: true, changed: true, phase: "playing.idle" });
    expect(toolTransitions).toEqual([
      "playing.resolving",
      "playing.dangerCheck",
      "playing.idle",
    ]);
  });

  test("keeps combo choice exact and rejects unrelated commands without duplicate execution", () => {
    const runtime = new HulebuRuntimeState(createMultiChiLevel());
    const candidates = runtime.getComboCandidateOptions("chi");
    const candidate = candidates[1];
    const session = new GameSession(runtime);
    const dispatchCount = observeSessionDispatch(session);
    const coordinator = new GameCoordinator(new RunStateMachine("playing.idle"), session);

    const prompted = coordinator.dispatch({ type: "combo.execute", combo: "chi" });
    expect(prompted).toMatchObject({
      accepted: true,
      changed: true,
      persistable: true,
      phase: "playing.comboChoosing",
    });
    expect(prompted.changed && prompted.persistable).toBe(true);
    expect(prompted.events).toEqual([
      expect.objectContaining({ type: "combo.choice.required", combo: "chi" }),
    ]);
    expect(prompted.events.filter((event) => event.type === "combo.choice.required")).toHaveLength(1);

    const beforeIllegal = coordinator.snapshot();
    const illegal = coordinator.dispatch({ type: "tile.select", tileId: "board-anchor" });
    expect(illegal).toMatchObject({ accepted: false, changed: false, phase: "playing.comboChoosing" });
    expect(illegal.runSnapshot).toEqual(beforeIllegal);
    expect(dispatchCount()).toBe(1);

    const chosen = coordinator.dispatch({ type: "combo.choose", candidateId: candidate.key });
    expect(chosen).toMatchObject({ accepted: true, changed: true, phase: "playing.idle" });
    expect(chosen.events).toEqual([
      { type: "combo.executed", combo: "chi", candidateId: candidate.key },
    ]);
    expect(chosen.runSnapshot.context.pendingCombo).toBeNull();

    const repeated = coordinator.dispatch({ type: "combo.choose", candidateId: candidate.key });
    expect(repeated).toMatchObject({ accepted: false, changed: false, phase: "playing.idle" });
    expect(repeated.events.filter((event) => event.type === "combo.executed")).toHaveLength(0);
    expect(dispatchCount()).toBe(2);
  });

  test("rejects a live candidate outside the exact pending combo prompt", () => {
    const runtime = new HulebuRuntimeState(createMultiTypeComboLevel());
    const foreignCandidate = runtime.getComboCandidateOptions("peng")[0];
    const session = new GameSession(runtime);
    const dispatchCount = observeSessionDispatch(session);
    const coordinator = new GameCoordinator(new RunStateMachine("playing.idle"), session);

    expect(coordinator.dispatch({ type: "combo.execute", combo: "chi" }).phase)
      .toBe("playing.comboChoosing");
    const before = coordinator.snapshot();
    const rejected = coordinator.dispatch({
      type: "combo.choose",
      candidateId: foreignCandidate.key,
    });

    expect(rejected).toMatchObject({
      accepted: false,
      changed: false,
      phase: "playing.comboChoosing",
    });
    expect(rejected.runSnapshot).toEqual(before);
    expect(rejected.events).toEqual([
      expect.objectContaining({ type: "command.rejected", commandType: "combo.choose" }),
    ]);
    expect(dispatchCount()).toBe(1);
  });

  test("round-trips and isolates the exact pending combo candidates", () => {
    const runtime = new HulebuRuntimeState(createMultiChiLevel());
    const expectedCandidates = JSON.parse(JSON.stringify(
      runtime.getComboCandidateOptions("chi"),
    )) as HulebuRuntimeComboCandidateOption[];
    const session = new GameSession(runtime);
    const coordinator = new GameCoordinator(new RunStateMachine("playing.idle"), session);

    const prompted = coordinator.dispatch({ type: "combo.execute", combo: "chi" });
    expect(prompted.runSnapshot.context.pendingCombo).toEqual({
      combo: "chi",
      candidates: expectedCandidates,
    });

    const persisted = JSON.parse(JSON.stringify(coordinator.snapshot())) as RunSnapshot;
    expect(GameCoordinator.restore(persisted, session).snapshot().context.pendingCombo)
      .toEqual({ combo: "chi", candidates: expectedCandidates });

    const exposedPending = prompted.runSnapshot.context.pendingCombo;
    if (!exposedPending) throw new Error("Expected pending combo context.");
    const exposedCandidates = exposedPending.candidates as HulebuRuntimeComboCandidateOption[];
    exposedCandidates[0].tileIds.push("external-tile");
    exposedCandidates.push({
      ...expectedCandidates[0],
      key: "external-candidate",
      tileIds: [...expectedCandidates[0].tileIds],
      labels: [...expectedCandidates[0].labels],
      prefabKeys: [...expectedCandidates[0].prefabKeys],
    });
    expect(coordinator.snapshot().context.pendingCombo).toEqual({
      combo: "chi",
      candidates: expectedCandidates,
    });
  });

  test("keeps discard selection exact and blocks unrelated tile and tool commands", () => {
    const session = new GameSession(new HulebuRuntimeState(createLevel({
      discard: 1,
      initialSlotOrder: ["slot-a"],
      tiles: [createTile("slot-a", "wan", 1, "slot"), createTile("board-a", "tong", 2)],
    })));
    const dispatchCount = observeSessionDispatch(session);
    const coordinator = new GameCoordinator(new RunStateMachine("playing.idle"), session);

    const prompted = coordinator.dispatch({ type: "tool.use", tool: "discard" });
    expect(prompted).toMatchObject({
      accepted: true,
      changed: true,
      persistable: true,
      phase: "playing.discardChoosing",
    });
    expect(prompted.changed && prompted.persistable).toBe(true);
    expect(prompted.events).toEqual([{ type: "discard.choice.required" }]);

    expect(coordinator.dispatch({ type: "tile.select", tileId: "board-a" }))
      .toMatchObject({ accepted: false, changed: false, phase: "playing.discardChoosing" });
    expect(coordinator.dispatch({ type: "tool.use", tool: "shuffle" }))
      .toMatchObject({ accepted: false, changed: false, phase: "playing.discardChoosing" });
    expect(dispatchCount()).toBe(1);

    const stale = coordinator.dispatch({ type: "slot.discard", slotIndex: 99 });
    expect(stale).toMatchObject({
      accepted: false,
      changed: false,
      phase: "playing.discardChoosing",
    });
    expect(dispatchCount()).toBe(2);

    const discarded = coordinator.dispatch({ type: "slot.discard", slotIndex: 0 });
    expect(discarded).toMatchObject({ accepted: true, changed: true, phase: "playing.idle" });
    expect(discarded.events).toEqual([{ type: "slot.discarded", slotIndex: 0 }]);
    expect(dispatchCount()).toBe(3);
  });

  test("keeps discard choice active after a stale index so a valid choice can retry", () => {
    const session = new GameSession(new HulebuRuntimeState(createLevel({
      discard: 1,
      initialSlotOrder: ["slot-a"],
      tiles: [createTile("slot-a", "wan", 1, "slot"), createTile("board-a", "tong", 2)],
    })));
    const coordinator = new GameCoordinator(new RunStateMachine("playing.idle"), session);
    expect(coordinator.dispatch({ type: "tool.use", tool: "discard" }).accepted).toBe(true);

    expect(coordinator.dispatch({ type: "slot.discard", slotIndex: 99 }))
      .toMatchObject({ accepted: false, changed: false, phase: "playing.discardChoosing" });
    expect(coordinator.dispatch({ type: "slot.discard", slotIndex: 0 }))
      .toMatchObject({ accepted: true, changed: true, phase: "playing.idle" });
  });

  test("emits level clear once and never re-dispatches after encounter clear", () => {
    const session = new GameSession(new HulebuRuntimeState(createLevel({
      tiles: [createTile("last", "wan", 1)],
    })));
    const dispatchCount = observeSessionDispatch(session);
    const coordinator = new GameCoordinator(new RunStateMachine("playing.idle"), session);

    const cleared = coordinator.dispatch({ type: "tile.select", tileId: "last" });
    expect(cleared).toMatchObject({ accepted: true, changed: true, phase: "encounterCleared" });
    expect(cleared.events.filter((event) => event.type === "level.cleared")).toHaveLength(1);

    const beforeRepeated = coordinator.snapshot();
    const repeated = coordinator.dispatch({ type: "tile.select", tileId: "last" });
    expect(repeated).toMatchObject({ accepted: false, changed: false, phase: "encounterCleared" });
    expect(repeated.events.filter((event) => event.type === "level.cleared")).toHaveLength(0);
    expect(repeated.runSnapshot).toEqual(beforeRepeated);
    expect(dispatchCount()).toBe(1);
  });

  test.each([
    ["rewardChoice", { type: "reward.choose", rewardId: "reward-a" } as const],
    ["eventChoice", { type: "event.choose", optionId: "event-a" } as const],
  ] as const)("rejects unimplemented %s effects without an attached session", (phase, command) => {
    const coordinator = new GameCoordinator(new RunStateMachine(phase));
    coordinator.updateContext(phase === "rewardChoice"
      ? { targetLevelOrder: 8, rewardCandidateIds: ["reward-a", "reward-b"] }
      : { targetLevelOrder: 8, eventOptionIds: ["event-a", "event-b"] });
    const before = coordinator.snapshot();

    const result = coordinator.dispatch(command);

    expect(result).toMatchObject({ accepted: false, changed: false, phase });
    expect(result.events).toEqual([
      expect.objectContaining({ type: "command.rejected", commandType: command.type }),
    ]);
    expect(result.events.some((event) => event.type === "reward.chosen" || event.type === "event.chosen"))
      .toBe(false);
    expect(result.runSnapshot).toEqual(before);
  });

  test("keeps one coordinator and state machine alive while sessions are replaced between levels", () => {
    const run = new RunStateMachine("playing.idle");
    const firstSession = new GameSession(new HulebuRuntimeState(createLevel({
      order: 7,
      tiles: [createTile("last-7", "wan", 1)],
    })));
    const coordinator = new GameCoordinator(run, firstSession);

    expect(coordinator.dispatch({ type: "tile.select", tileId: "last-7" }).phase)
      .toBe("encounterCleared");
    coordinator.detachSession();
    expect(run.transition("rewardChoice")).toBe(true);
    coordinator.updateContext({ targetLevelOrder: 8, rewardCandidateIds: ["reward-a"] });
    expect(coordinator.snapshot()).toMatchObject({
      phase: "rewardChoice",
      sessionSnapshot: null,
      context: { targetLevelOrder: 8, rewardCandidateIds: ["reward-a"] },
    });

    expect(run.transition("encounterIntro")).toBe(true);
    coordinator.updateContext({ rewardCandidateIds: [] });
    const secondSession = new GameSession(new HulebuRuntimeState(createLevel({
      order: 8,
      tiles: [createTile("board-8-a", "wan", 1), createTile("board-8-b", "tong", 2)],
    })));
    coordinator.attachSession(secondSession);
    expect(run.transition("playing.tileEntering")).toBe(true);
    expect(run.transition("playing.idle")).toBe(true);

    const result = coordinator.dispatch({ type: "tile.select", tileId: "board-8-a" });
    expect(result).toMatchObject({ accepted: true, phase: "playing.idle" });
    expect(result.snapshot?.levelOrder).toBe(8);
    expect(run.phase).toBe("playing.idle");
  });

  test("round-trips reward and event targets without requiring a session", () => {
    const rewardCoordinator = new GameCoordinator(new RunStateMachine("rewardChoice"));
    rewardCoordinator.updateContext({
      targetLevelOrder: 12,
      rewardCandidateIds: ["reward-a", "reward-b", "reward-c"],
    });
    const rewardSnapshot = JSON.parse(JSON.stringify(rewardCoordinator.snapshot())) as RunSnapshot;
    expect(GameCoordinator.restore(rewardSnapshot).snapshot()).toEqual(rewardSnapshot);

    const eventCoordinator = new GameCoordinator(new RunStateMachine("eventChoice"));
    eventCoordinator.updateContext({
      targetLevelOrder: 13,
      eventOptionIds: ["event-left", "event-right"],
    });
    const eventSnapshot = JSON.parse(JSON.stringify(eventCoordinator.snapshot())) as RunSnapshot;
    expect(GameCoordinator.restore(eventSnapshot).snapshot()).toEqual(eventSnapshot);
  });

  test("round-trips paused context and validates that playing restores have a matching session", () => {
    const session = new GameSession(new HulebuRuntimeState(createMultiChiLevel()));
    const coordinator = new GameCoordinator(new RunStateMachine("playing.idle"), session);
    coordinator.updateContext({ targetLevelOrder: 7 });
    expect(coordinator.dispatch({ type: "combo.execute", combo: "chi" }).accepted).toBe(true);
    expect(coordinator.dispatch({ type: "flow.pause" }).accepted).toBe(true);
    const pausedSnapshot = JSON.parse(JSON.stringify(coordinator.snapshot())) as RunSnapshot;

    expect(GameCoordinator.restore(pausedSnapshot, session).snapshot()).toEqual(pausedSnapshot);
    expect(pausedSnapshot.context.pauseReturnPhase).toBe("playing.comboChoosing");
    expect(pausedSnapshot.context.pendingCombo).toBeDefined();
    expect(pausedSnapshot.context.pendingCombo?.candidates.length ?? 0).toBeGreaterThan(1);

    const playingSnapshot: RunSnapshot = {
      ...pausedSnapshot,
      phase: "playing.idle",
      context: {
        ...pausedSnapshot.context,
        pauseReturnPhase: null,
        pendingCombo: null,
      },
    };
    expect(() => GameCoordinator.restore({ ...playingSnapshot, sessionSnapshot: null }))
      .toThrow(/session/i);
    expect(() => GameCoordinator.restore(playingSnapshot))
      .toThrow(/session/i);
    expect(GameCoordinator.restore(playingSnapshot, session).snapshot()).toEqual(playingSnapshot);
  });

  test("rejects phase and session status mismatches during restore", () => {
    const playingSession = new GameSession(new HulebuRuntimeState(createPengLevel()));
    const playingSnapshot = new GameCoordinator(
      new RunStateMachine("playing.idle"),
      playingSession,
    ).snapshot();
    expect(() => GameCoordinator.restore({
      ...playingSnapshot,
      phase: "encounterCleared",
    }, playingSession)).toThrow(/cleared session/i);

    const clearedSession = new GameSession(new HulebuRuntimeState(createLevel({
      tiles: [createTile("last", "wan", 1)],
    })));
    expect(clearedSession.dispatch({ type: "tile.select", tileId: "last" }).accepted).toBe(true);
    const clearedSnapshot = new GameCoordinator(
      new RunStateMachine("encounterCleared"),
      clearedSession,
    ).snapshot();
    expect(() => GameCoordinator.restore({
      ...clearedSnapshot,
      phase: "playing.idle",
    }, clearedSession)).toThrow(/active playing phase.*cleared/i);
  });

  test("requires complete reward and event choice context during restore", () => {
    const rewardCoordinator = new GameCoordinator(new RunStateMachine("rewardChoice"));
    rewardCoordinator.updateContext({ targetLevelOrder: 5, rewardCandidateIds: ["reward-a"] });
    const rewardSnapshot = rewardCoordinator.snapshot();
    expect(() => GameCoordinator.restore({
      ...rewardSnapshot,
      context: { ...rewardSnapshot.context, rewardCandidateIds: [] },
    })).toThrow(/reward candidate/i);
    expect(() => GameCoordinator.restore({
      ...rewardSnapshot,
      context: { ...rewardSnapshot.context, targetLevelOrder: null },
    })).toThrow(/target level/i);
    expect(() => GameCoordinator.restore({
      ...rewardSnapshot,
      context: { ...rewardSnapshot.context, eventOptionIds: ["stale-event"] },
    })).toThrow(/event option.*rewardChoice/i);

    const eventCoordinator = new GameCoordinator(new RunStateMachine("eventChoice"));
    eventCoordinator.updateContext({ targetLevelOrder: 6, eventOptionIds: ["event-a"] });
    const eventSnapshot = eventCoordinator.snapshot();
    expect(() => GameCoordinator.restore({
      ...eventSnapshot,
      context: { ...eventSnapshot.context, eventOptionIds: [] },
    })).toThrow(/event option/i);
    expect(() => GameCoordinator.restore({
      ...eventSnapshot,
      context: { ...eventSnapshot.context, targetLevelOrder: null },
    })).toThrow(/target level/i);
    expect(() => GameCoordinator.restore({
      ...eventSnapshot,
      context: { ...eventSnapshot.context, rewardCandidateIds: ["stale-reward"] },
    })).toThrow(/reward candidate.*eventChoice/i);
  });

  test.each([
    ["rewardChoice", { targetLevelOrder: 5, rewardCandidateIds: ["reward-a"] }],
    ["eventChoice", { targetLevelOrder: 6, eventOptionIds: ["event-a"] }],
  ] as const)("restores %s only without an attached game session", (phase, context) => {
    const session = new GameSession(new HulebuRuntimeState(createPengLevel()));
    const coordinator = new GameCoordinator(new RunStateMachine(phase));
    coordinator.updateContext(context);
    const snapshot = coordinator.snapshot();

    expect(() => GameCoordinator.restore({
      ...snapshot,
      sessionSnapshot: session.snapshot(),
    }, session)).toThrow(new RegExp(`${phase}.*without.*session`, "i"));
  });

  test("requires pending combo context only while combo choice is active", () => {
    const session = new GameSession(new HulebuRuntimeState(createMultiChiLevel()));
    const coordinator = new GameCoordinator(new RunStateMachine("playing.idle"), session);
    const prompted = coordinator.dispatch({ type: "combo.execute", combo: "chi" });
    const choosingSnapshot = prompted.runSnapshot;

    expect(() => GameCoordinator.restore({
      ...choosingSnapshot,
      context: { ...choosingSnapshot.context, pendingCombo: null },
    }, session)).toThrow(/pending combo/i);
    expect(() => GameCoordinator.restore({
      ...choosingSnapshot,
      phase: "playing.idle",
    }, session)).toThrow(/pending combo.*playing.idle/i);
  });

  test("rejects restored pending combo records that do not match current candidates", () => {
    const runtime = new HulebuRuntimeState(createMultiChiLevel());
    const session = new GameSession(runtime);
    const coordinator = new GameCoordinator(new RunStateMachine("playing.idle"), session);
    const choosingSnapshot = coordinator.dispatch({
      type: "combo.execute",
      combo: "chi",
    }).runSnapshot;
    const pending = choosingSnapshot.context.pendingCombo;
    if (!pending) throw new Error("Expected pending combo context.");

    expect(() => GameCoordinator.restore({
      ...choosingSnapshot,
      context: {
        ...choosingSnapshot.context,
        pendingCombo: {
          ...pending,
          candidates: pending.candidates.map((candidate, index) => index === 0
            ? { ...candidate, labels: ["tampered", ...candidate.labels.slice(1)] }
            : candidate),
        },
      },
    }, session)).toThrow(/pending combo.*session/i);
  });

  test("keeps session and context updates atomic against snapshot restore invariants", () => {
    const session = new GameSession(new HulebuRuntimeState(createPengLevel()));
    const rewardCoordinator = new GameCoordinator(new RunStateMachine("rewardChoice"));

    expect(() => rewardCoordinator.snapshot()).toThrow(/reward choice/i);
    rewardCoordinator.updateContext({
      targetLevelOrder: 8,
      rewardCandidateIds: ["reward-a", "reward-b"],
    });
    const validRewardSnapshot = rewardCoordinator.snapshot();
    expect(GameCoordinator.restore(validRewardSnapshot).snapshot()).toEqual(validRewardSnapshot);

    expect(() => rewardCoordinator.updateContext({ eventOptionIds: ["event-a"] }))
      .toThrow(/event option.*rewardChoice/i);
    expect(rewardCoordinator.snapshot()).toEqual(validRewardSnapshot);
    expect(() => rewardCoordinator.attachSession(session)).toThrow(/rewardChoice.*without.*session/i);
    expect(rewardCoordinator.snapshot()).toEqual(validRewardSnapshot);

    const eventCoordinator = new GameCoordinator(new RunStateMachine("eventChoice"));
    expect(() => eventCoordinator.snapshot()).toThrow(/event choice/i);
    eventCoordinator.updateContext({
      targetLevelOrder: 9,
      eventOptionIds: ["event-a", "event-b"],
    });
    const validEventSnapshot = eventCoordinator.snapshot();
    expect(GameCoordinator.restore(validEventSnapshot).snapshot()).toEqual(validEventSnapshot);
    expect(() => eventCoordinator.updateContext({ rewardCandidateIds: ["reward-a"] }))
      .toThrow(/reward candidate.*eventChoice/i);
    expect(eventCoordinator.snapshot()).toEqual(validEventSnapshot);

    const playingCoordinator = new GameCoordinator(
      new RunStateMachine("playing.idle"),
      session,
    );
    const validPlayingSnapshot = playingCoordinator.snapshot();
    expect(() => playingCoordinator.updateContext({ rewardCandidateIds: ["stale-reward"] }))
      .toThrow(/reward candidate.*playing.idle/i);
    expect(() => playingCoordinator.detachSession()).toThrow(/playing.*session/i);
    expect(playingCoordinator.snapshot()).toEqual(validPlayingSnapshot);
  });

  test("round-trips every public coordinator result snapshot", () => {
    const assertRoundTrip = (
      snapshot: RunSnapshot,
      session: GameSessionClass | null = null,
    ) => {
      expect(GameCoordinator.restore(snapshot, session).snapshot()).toEqual(snapshot);
    };

    const idleSession = new GameSession(new HulebuRuntimeState(createPengLevel()));
    const idleCoordinator = new GameCoordinator(new RunStateMachine("playing.idle"), idleSession);
    assertRoundTrip(idleCoordinator.dispatch({ type: "tile.select", tileId: "missing" }).runSnapshot, idleSession);
    assertRoundTrip(idleCoordinator.dispatch({ type: "flow.pause" }).runSnapshot, idleSession);
    assertRoundTrip(idleCoordinator.dispatch({ type: "flow.resume" }).runSnapshot, idleSession);

    const comboSession = new GameSession(new HulebuRuntimeState(createMultiChiLevel()));
    const comboCoordinator = new GameCoordinator(new RunStateMachine("playing.idle"), comboSession);
    const prompted = comboCoordinator.dispatch({ type: "combo.execute", combo: "chi" });
    assertRoundTrip(prompted.runSnapshot, comboSession);
    assertRoundTrip(comboCoordinator.dispatch({
      type: "combo.choose",
      candidateId: "missing-candidate",
    }).runSnapshot, comboSession);
    const candidateId = prompted.runSnapshot.context.pendingCombo?.candidates[0]?.key;
    if (!candidateId) throw new Error("Expected combo candidate id.");
    assertRoundTrip(comboCoordinator.dispatch({
      type: "combo.choose",
      candidateId,
    }).runSnapshot, comboSession);

    const discardSession = new GameSession(new HulebuRuntimeState(createLevel({
      discard: 1,
      initialSlotOrder: ["slot-a"],
      tiles: [
        createTile("slot-a", "wan", 1, "slot"),
        createTile("board-a", "tong", 2),
      ],
    })));
    const discardCoordinator = new GameCoordinator(
      new RunStateMachine("playing.idle"),
      discardSession,
    );
    assertRoundTrip(discardCoordinator.dispatch({
      type: "tool.use",
      tool: "discard",
    }).runSnapshot, discardSession);
    assertRoundTrip(discardCoordinator.dispatch({
      type: "slot.discard",
      slotIndex: 99,
    }).runSnapshot, discardSession);
    assertRoundTrip(discardCoordinator.dispatch({
      type: "slot.discard",
      slotIndex: 0,
    }).runSnapshot, discardSession);

    const clearSession = new GameSession(new HulebuRuntimeState(createLevel({
      tiles: [createTile("last", "wan", 1)],
    })));
    const clearCoordinator = new GameCoordinator(new RunStateMachine("playing.idle"), clearSession);
    assertRoundTrip(clearCoordinator.dispatch({ type: "tile.select", tileId: "last" }).runSnapshot, clearSession);

    for (const [phase, context, command] of [
      ["rewardChoice", { targetLevelOrder: 8, rewardCandidateIds: ["reward-a"] }, { type: "reward.choose", rewardId: "reward-a" }],
      ["eventChoice", { targetLevelOrder: 9, eventOptionIds: ["event-a"] }, { type: "event.choose", optionId: "event-a" }],
    ] as const) {
      const coordinator = new GameCoordinator(new RunStateMachine(phase));
      coordinator.updateContext(context);
      assertRoundTrip(coordinator.dispatch(command).runSnapshot);
    }
  });

  test("matches restored session snapshots by value instead of object key order", () => {
    const session = new GameSession(new HulebuRuntimeState(createPengLevel()));
    const snapshot = new GameCoordinator(
      new RunStateMachine("playing.idle"),
      session,
    ).snapshot();
    const original = snapshot.sessionSnapshot;
    if (!original) throw new Error("Expected an attached session snapshot.");
    const reordered: GameSnapshot = {
      runtime: original.runtime,
      status: original.status,
      levelOrder: original.levelOrder,
      revision: original.revision,
      schemaVersion: original.schemaVersion,
    };

    expect(GameCoordinator.restore({ ...snapshot, sessionSnapshot: reordered }, session).snapshot())
      .toEqual({ ...snapshot, sessionSnapshot: original });
  });

  test("returns detached immutable run snapshots", () => {
    const coordinator = new GameCoordinator(new RunStateMachine("rewardChoice"));
    coordinator.updateContext({
      targetLevelOrder: 9,
      rewardCandidateIds: ["reward-a", "reward-b"],
    });
    const snapshot = coordinator.snapshot();

    (snapshot.context.rewardCandidateIds as string[]).push("external-reward");

    expect(coordinator.snapshot().context.rewardCandidateIds).toEqual(["reward-a", "reward-b"]);
    expect(coordinator.snapshot().context.eventOptionIds).toEqual([]);
  });
});

interface SaveFixtureActiveRun {
  readonly runProfile: {
    readonly id: string;
  };
  readonly order: number;
  readonly runtime: {
    readonly tiles: readonly {
      readonly id: string;
    }[];
    readonly slot: readonly string[];
  };
  readonly rewardIds: readonly string[];
  readonly eventIds: readonly string[];
  readonly abilityIds: readonly string[];
}

interface SaveFixture {
  readonly boardRevision: string;
  readonly phase: RunPhase;
  readonly activeRun: SaveFixtureActiveRun | null;
}

interface LegacySaveFixtureV0 {
  readonly boardRevision: string;
  readonly resumablePhase: RunPhase;
  readonly activeRun: SaveFixtureActiveRun | null;
}

type StorageOperation =
  | { readonly type: "get"; readonly key: string }
  | { readonly type: "set"; readonly key: string; readonly value: string }
  | { readonly type: "remove"; readonly key: string };

class FaultInjectingStorage implements StoragePort {
  readonly values = new Map<string, string>();
  readonly operations: StorageOperation[] = [];
  onGet: ((key: string, value: string | null) => string | null) | null = null;
  onSet: ((key: string, value: string) => void) | null = null;
  onRemove: ((key: string) => void) | null = null;

  getItem(key: string): string | null {
    this.operations.push({ type: "get", key });
    const value = this.values.get(key) ?? null;
    return this.onGet ? this.onGet(key, value) : value;
  }

  setItem(key: string, value: string): void {
    this.operations.push({ type: "set", key, value });
    this.onSet?.(key, value);
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.operations.push({ type: "remove", key });
    this.onRemove?.(key);
    this.values.delete(key);
  }
}

const SAVE_KEY = "hulebu-save-test";
const SAVE_TEMP_KEY = `${SAVE_KEY}.tmp`;
const SAVE_SCHEMA_VERSION = 1;
const SAVE_CONTENT_VERSION = "content-v1";
const SAVE_BOARD_REVISION = "board-v1";
const SAVE_RUN_PROFILE_ID = "mainline";
const SAVE_REWARD_IDS = new Set(["reward-a"]);
const SAVE_EVENT_IDS = new Set(["event-a"]);
const SAVE_ABILITY_IDS = new Set(["ability-a"]);
const SAVE_RUN_PHASES = new Set<RunPhase>([
  "encounterIntro",
  "playing.tileEntering",
  "playing.idle",
  "playing.resolving",
  "playing.comboChoosing",
  "playing.discardChoosing",
  "playing.dangerCheck",
  "encounterCleared",
  "rewardChoice",
  "eventChoice",
  "bossIntro",
  "settlement",
  "failed",
  "paused",
]);
const SAVE_PERSISTABLE_PHASES = new Set<RunPhase>([
  "encounterIntro",
  "playing.idle",
  "playing.comboChoosing",
  "playing.discardChoosing",
  "encounterCleared",
  "rewardChoice",
  "eventChoice",
  "bossIntro",
  "settlement",
]);

function createSaveFixture(overrides: Partial<SaveFixture> = {}): SaveFixture {
  return {
    boardRevision: SAVE_BOARD_REVISION,
    phase: "playing.idle",
    activeRun: {
      runProfile: { id: SAVE_RUN_PROFILE_ID },
      order: 3,
      runtime: {
        tiles: [{ id: "tile-a" }, { id: "tile-b" }],
        slot: ["tile-a"],
      },
      rewardIds: ["reward-a"],
      eventIds: ["event-a"],
      abilityIds: ["ability-a"],
    },
    ...overrides,
  };
}

function requireSaveRecord(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function requireSaveIdList(
  value: unknown,
  allowed: ReadonlySet<string>,
  label: string,
): readonly string[] {
  if (!Array.isArray(value) || value.some((id) => typeof id !== "string")) {
    throw new Error(`${label} must be a string array.`);
  }
  for (const id of value) {
    if (!allowed.has(id)) {
      throw new Error(`${label} references unknown content id ${id}.`);
    }
  }
  return value;
}

function validateSaveFixture(value: unknown): SaveFixture {
  const root = requireSaveRecord(value, "save");
  if (root.boardRevision !== SAVE_BOARD_REVISION) {
    throw new Error(`Unsupported boardRevision: ${String(root.boardRevision)}.`);
  }
  if (typeof root.phase !== "string" || !SAVE_RUN_PHASES.has(root.phase as RunPhase)) {
    throw new Error(`Unknown run phase: ${String(root.phase)}.`);
  }
  if (root.activeRun === null) {
    return {
      boardRevision: root.boardRevision,
      phase: root.phase as RunPhase,
      activeRun: null,
    };
  }

  const activeRun = requireSaveRecord(root.activeRun, "active run");
  const runProfile = requireSaveRecord(activeRun.runProfile, "run profile");
  if (runProfile.id !== SAVE_RUN_PROFILE_ID) {
    throw new Error(`Unknown run profile: ${String(runProfile.id)}.`);
  }
  if (!Number.isInteger(activeRun.order) || (activeRun.order as number) < 1) {
    throw new Error("Active run order must be a positive integer.");
  }

  const runtime = requireSaveRecord(activeRun.runtime, "runtime");
  if (!Array.isArray(runtime.tiles)) {
    throw new Error("Runtime tiles must be an array.");
  }
  const tileIds = new Set<string>();
  for (const tileValue of runtime.tiles) {
    const tile = requireSaveRecord(tileValue, "runtime tile");
    if (typeof tile.id !== "string" || tile.id.length === 0 || tileIds.has(tile.id)) {
      throw new Error(`Invalid runtime tile id: ${String(tile.id)}.`);
    }
    tileIds.add(tile.id);
  }
  if (!Array.isArray(runtime.slot) || runtime.slot.some((id) => typeof id !== "string")) {
    throw new Error("Runtime slot must be a string array.");
  }
  for (const tileId of runtime.slot) {
    if (!tileIds.has(tileId)) {
      throw new Error(`Runtime slot references unknown tile ${tileId}.`);
    }
  }

  const rewardIds = requireSaveIdList(activeRun.rewardIds, SAVE_REWARD_IDS, "Reward");
  const eventIds = requireSaveIdList(activeRun.eventIds, SAVE_EVENT_IDS, "Event");
  const abilityIds = requireSaveIdList(activeRun.abilityIds, SAVE_ABILITY_IDS, "Ability");
  return {
    boardRevision: root.boardRevision,
    phase: root.phase as RunPhase,
    activeRun: {
      runProfile: { id: runProfile.id },
      order: activeRun.order as number,
      runtime: {
        tiles: runtime.tiles.map((tile) => {
          const record = requireSaveRecord(tile, "runtime tile");
          return { id: record.id as string };
        }),
        slot: [...runtime.slot],
      },
      rewardIds: [...rewardIds],
      eventIds: [...eventIds],
      abilityIds: [...abilityIds],
    },
  };
}

function createSaveCodec(overrides: Partial<SaveCodec<SaveFixture>> = {}): SaveCodec<SaveFixture> {
  return {
    encode: (value) => value,
    decode: (value) => value,
    ...overrides,
  };
}

function createSaveService(
  storage: FaultInjectingStorage,
  overrides: Partial<SaveServiceOptions<SaveFixture>> = {},
): InstanceType<typeof SaveService<SaveFixture>> {
  return new SaveService<SaveFixture>({
    key: SAVE_KEY,
    storage,
    codec: createSaveCodec(),
    validate: validateSaveFixture,
    canPersist: (value) => SAVE_PERSISTABLE_PHASES.has(value.phase),
    schemaVersion: SAVE_SCHEMA_VERSION,
    contentVersion: SAVE_CONTENT_VERSION,
    migrations: {
      0: (value) => {
        const legacy = requireSaveRecord(value, "legacy save") as unknown as LegacySaveFixtureV0;
        return {
          boardRevision: legacy.boardRevision,
          phase: legacy.resumablePhase,
          activeRun: legacy.activeRun,
        };
      },
    },
    now: () => "2026-07-18T08:00:00.000Z",
    ...overrides,
  });
}

function createEnvelope(
  value: unknown,
  overrides: Partial<{
    schemaVersion: number;
    contentVersion: string;
    savedAt: string;
  }> = {},
): string {
  return JSON.stringify({
    schemaVersion: SAVE_SCHEMA_VERSION,
    contentVersion: SAVE_CONTENT_VERSION,
    savedAt: "2026-07-18T07:00:00.000Z",
    value,
    ...overrides,
  });
}

describe("Hulebu Cocos SaveService", () => {
  test("round-trips the current schema and content version in the required save order", () => {
    const storage = new FaultInjectingStorage();
    const order: string[] = [];
    const service = createSaveService(storage, {
      codec: createSaveCodec({
        encode: (value) => {
          order.push("encode");
          return value;
        },
        decode: (value) => {
          order.push("decode");
          return value;
        },
      }),
      validate: (value) => {
        order.push("validate");
        return validateSaveFixture(value);
      },
      canPersist: (value) => {
        order.push("canPersist");
        return SAVE_PERSISTABLE_PHASES.has(value.phase);
      },
    });
    storage.onSet = (key) => order.push(`set:${key}`);
    storage.onGet = (key, value) => {
      order.push(`get:${key}`);
      return value;
    };
    storage.onRemove = (key) => order.push(`remove:${key}`);
    const value = createSaveFixture();

    expect(service.save(value)).toEqual({ status: "committed", warnings: [] });
    expect(order).toEqual([
      "validate",
      "canPersist",
      "encode",
      `set:${SAVE_TEMP_KEY}`,
      `get:${SAVE_TEMP_KEY}`,
      "decode",
      "validate",
      `get:${SAVE_KEY}`,
      `set:${SAVE_KEY}`,
      `remove:${SAVE_TEMP_KEY}`,
    ]);
    expect(storage.values.has(SAVE_TEMP_KEY)).toBe(false);

    const primaryBytes = storage.values.get(SAVE_KEY);
    expect(primaryBytes).toBeDefined();
    expect(JSON.parse(primaryBytes!)).toEqual({
      schemaVersion: SAVE_SCHEMA_VERSION,
      contentVersion: SAVE_CONTENT_VERSION,
      savedAt: "2026-07-18T08:00:00.000Z",
      value,
    });
    expect(service.load()).toEqual({ status: "loaded", value, migrated: false });
  });

  test("migrates only an unwrapped v0 payload with a compatible boardRevision", () => {
    const storage = new FaultInjectingStorage();
    const legacy: LegacySaveFixtureV0 = {
      boardRevision: SAVE_BOARD_REVISION,
      resumablePhase: "rewardChoice",
      activeRun: createSaveFixture().activeRun,
    };
    storage.values.set(SAVE_KEY, JSON.stringify(legacy));

    expect(createSaveService(storage).load()).toEqual({
      status: "loaded",
      value: {
        boardRevision: SAVE_BOARD_REVISION,
        phase: "rewardChoice",
        activeRun: legacy.activeRun,
      },
      migrated: true,
    });
    expect(storage.values.get(SAVE_KEY)).toBe(JSON.stringify(legacy));
  });

  test.each([
    ["future schema", createEnvelope(createSaveFixture(), { schemaVersion: 2 }), /schema/i],
    ["incompatible contentVersion", createEnvelope(createSaveFixture(), { contentVersion: "content-v2" }), /contentVersion/i],
    ["unknown schema", createEnvelope(createSaveFixture(), { schemaVersion: -1 }), /schema/i],
    [
      "malformed savedAt",
      JSON.stringify({
        schemaVersion: SAVE_SCHEMA_VERSION,
        contentVersion: SAVE_CONTENT_VERSION,
        savedAt: 42,
        value: createSaveFixture(),
      }),
      /savedAt/i,
    ],
    ["bad JSON", "{bad-json", /JSON/i],
    [
      "legacy boardRevision mismatch",
      JSON.stringify({
        boardRevision: "old-board",
        resumablePhase: "playing.idle",
        activeRun: createSaveFixture().activeRun,
      }),
      /boardRevision/i,
    ],
  ])("quarantines %s without repairing it", (_name, raw, reason) => {
    const storage = new FaultInjectingStorage();
    storage.values.set(SAVE_KEY, raw);

    const result = createSaveService(storage).load();

    expect(result).toMatchObject({
      status: "quarantined",
      key: `${SAVE_KEY}.quarantine.2026-07-18T08:00:00.000Z.0`,
      reason: expect.stringMatching(reason),
    });
    if (result.status !== "quarantined") throw new Error("Expected quarantine result.");
    expect(storage.values.get(result.key)).toBe(raw);
    expect(storage.values.has(SAVE_KEY)).toBe(false);
  });

  test("quarantines codec decoder failures with the original bytes", () => {
    const storage = new FaultInjectingStorage();
    const raw = createEnvelope(createSaveFixture());
    storage.values.set(SAVE_KEY, raw);
    const service = createSaveService(storage, {
      codec: createSaveCodec({
        decode: () => {
          throw new Error("decoder rejected payload");
        },
      }),
    });

    const result = service.load();

    expect(result).toMatchObject({
      status: "quarantined",
      reason: "decoder rejected payload",
    });
    if (result.status !== "quarantined") throw new Error("Expected quarantine result.");
    expect(storage.values.get(result.key)).toBe(raw);
  });

  test.each([
    ["run profile", { runProfile: { id: "missing-profile" } }, /run profile/i],
    ["positive order", { order: 0 }, /positive integer/i],
    ["runtime tile", { runtime: { tiles: [{ id: "" }], slot: [] } }, /runtime tile/i],
    ["runtime slot", { runtime: { tiles: [{ id: "tile-a" }], slot: ["missing-tile"] } }, /runtime slot/i],
    ["reward content", { rewardIds: ["missing-reward"] }, /reward/i],
    ["event content", { eventIds: ["missing-event"] }, /event/i],
    ["ability content", { abilityIds: ["missing-ability"] }, /ability/i],
  ])("quarantines active-run validation failure for %s", (_name, activeRunOverride, reason) => {
    const storage = new FaultInjectingStorage();
    const current = createSaveFixture();
    const raw = createEnvelope({
      ...current,
      activeRun: {
        ...current.activeRun,
        ...activeRunOverride,
      },
    });
    storage.values.set(SAVE_KEY, raw);

    const result = createSaveService(storage).load();

    expect(result).toMatchObject({
      status: "quarantined",
      reason: expect.stringMatching(reason),
    });
    expect(storage.values.has(SAVE_KEY)).toBe(false);
  });

  test.each([
    "playing.resolving",
    "paused",
    "failed",
  ] as const)("rejects non-persistable phase %s before writing temp", (phase) => {
    const storage = new FaultInjectingStorage();
    storage.values.set(SAVE_KEY, "old-primary-bytes");

    expect(createSaveService(storage).save(createSaveFixture({ phase }))).toMatchObject({
      status: "rejected",
      reason: expect.stringMatching(/persist/i),
    });
    expect(storage.operations.some((operation) =>
      operation.type === "set" && operation.key === SAVE_TEMP_KEY)).toBe(false);
    expect(storage.values.get(SAVE_KEY)).toBe("old-primary-bytes");
  });

  test("rejects validator and serializer failures before writing temp", () => {
    const validationStorage = new FaultInjectingStorage();
    validationStorage.values.set(SAVE_KEY, "old-primary-bytes");
    const validationResult = createSaveService(validationStorage).save(
      createSaveFixture({ boardRevision: "wrong-board" }),
    );
    expect(validationResult).toMatchObject({
      status: "rejected",
      reason: expect.stringMatching(/boardRevision/i),
    });
    expect(validationStorage.values.has(SAVE_TEMP_KEY)).toBe(false);
    expect(validationStorage.values.get(SAVE_KEY)).toBe("old-primary-bytes");

    const serializationStorage = new FaultInjectingStorage();
    serializationStorage.values.set(SAVE_KEY, "old-primary-bytes");
    const serializationResult = createSaveService(serializationStorage, {
      codec: createSaveCodec({
        encode: () => {
          throw new Error("encode failed");
        },
      }),
    }).save(createSaveFixture());
    expect(serializationResult).toMatchObject({
      status: "rejected",
      reason: "encode failed",
    });
    expect(serializationStorage.values.has(SAVE_TEMP_KEY)).toBe(false);
    expect(serializationStorage.values.get(SAVE_KEY)).toBe("old-primary-bytes");
  });

  test.each([
    {
      name: "temp write",
      stage: "temp-write",
      configure(storage: FaultInjectingStorage) {
        storage.onSet = (key) => {
          if (key === SAVE_TEMP_KEY) throw new Error("temp write failed");
        };
      },
    },
    {
      name: "temp byte readback",
      stage: "temp-readback",
      configure(storage: FaultInjectingStorage) {
        storage.onGet = (key, value) => key === SAVE_TEMP_KEY ? `${value}-corrupt` : value;
      },
    },
    {
      name: "primary commit",
      stage: "primary-write",
      configure(storage: FaultInjectingStorage) {
        let shouldFail = true;
        storage.onSet = (key, value) => {
          if (key === SAVE_KEY && shouldFail) {
            shouldFail = false;
            storage.values.set(key, value);
            throw new Error("primary write failed after mutation");
          }
        };
      },
    },
  ] as const)("preserves old primary bytes when $name fails", ({ stage, configure }) => {
    const storage = new FaultInjectingStorage();
    storage.values.set(SAVE_KEY, "old-primary-bytes");
    configure(storage);

    expect(createSaveService(storage).save(createSaveFixture())).toMatchObject({
      status: "error",
      stage,
    });
    expect(storage.values.get(SAVE_KEY)).toBe("old-primary-bytes");
  });

  test("commits with a warning when temp cleanup fails", () => {
    const storage = new FaultInjectingStorage();
    storage.onRemove = (key) => {
      if (key === SAVE_TEMP_KEY) throw new Error("cleanup failed");
    };

    const result = createSaveService(storage).save(createSaveFixture());

    expect(result).toMatchObject({
      status: "committed",
      warnings: [expect.stringMatching(/cleanup failed/i)],
    });
    expect(storage.values.has(SAVE_KEY)).toBe(true);
    expect(storage.values.has(SAVE_TEMP_KEY)).toBe(true);
  });

  test("uses deterministic unique quarantine keys for repeated failures", () => {
    const storage = new FaultInjectingStorage();
    const service = createSaveService(storage);
    storage.values.set(SAVE_KEY, "first-bad-json");
    const first = service.load();
    storage.values.set(SAVE_KEY, "second-bad-json");
    const second = service.load();

    expect(first).toMatchObject({
      status: "quarantined",
      key: `${SAVE_KEY}.quarantine.2026-07-18T08:00:00.000Z.0`,
    });
    expect(second).toMatchObject({
      status: "quarantined",
      key: `${SAVE_KEY}.quarantine.2026-07-18T08:00:00.000Z.1`,
    });
  });

  test.each([
    {
      name: "quarantine write",
      stage: "quarantine-write",
      configure(storage: FaultInjectingStorage) {
        storage.onSet = (key) => {
          if (key.includes(".quarantine.")) throw new Error("quarantine write failed");
        };
      },
    },
    {
      name: "quarantine verification read",
      stage: "quarantine-verify",
      configure(storage: FaultInjectingStorage) {
        storage.onGet = (key, value) =>
          key.includes(".quarantine.") ? `${value}-corrupt` : value;
      },
    },
    {
      name: "primary removal",
      stage: "primary-remove",
      configure(storage: FaultInjectingStorage) {
        storage.onRemove = (key) => {
          if (key === SAVE_KEY) throw new Error("primary remove failed");
        };
      },
    },
  ] as const)("retains primary when $name fails", ({ stage, configure }) => {
    const storage = new FaultInjectingStorage();
    const raw = "bad-json";
    storage.values.set(SAVE_KEY, raw);
    configure(storage);

    expect(createSaveService(storage).load()).toMatchObject({
      status: "error",
      stage,
    });
    expect(storage.values.get(SAVE_KEY)).toBe(raw);
  });

  test("verifies quarantine bytes before removing primary", () => {
    const storage = new FaultInjectingStorage();
    storage.values.set(SAVE_KEY, "bad-json");

    const result = createSaveService(storage).load();

    expect(result.status).toBe("quarantined");
    const quarantineSetIndex = storage.operations.findIndex((operation) =>
      operation.type === "set" && operation.key.includes(".quarantine."));
    const quarantineVerifyIndex = storage.operations.findIndex((operation) =>
      operation.type === "get" && operation.key.includes(".quarantine."));
    const primaryRemoveIndex = storage.operations.findIndex((operation) =>
      operation.type === "remove" && operation.key === SAVE_KEY);
    expect(quarantineSetIndex).toBeGreaterThan(-1);
    expect(quarantineVerifyIndex).toBeGreaterThan(quarantineSetIndex);
    expect(primaryRemoveIndex).toBeGreaterThan(quarantineVerifyIndex);
  });

  test("distinguishes empty, read failure, and clear failure", () => {
    const emptyStorage = new FaultInjectingStorage();
    expect(createSaveService(emptyStorage).load()).toEqual({ status: "empty" });

    const readStorage = new FaultInjectingStorage();
    readStorage.onGet = (key, value) => {
      if (key === SAVE_KEY) throw new Error("read failed");
      return value;
    };
    expect(createSaveService(readStorage).load()).toMatchObject({
      status: "error",
      stage: "read",
      error: expect.any(Error),
    });

    const clearStorage = new FaultInjectingStorage();
    clearStorage.values.set(SAVE_KEY, "primary");
    clearStorage.onRemove = (key) => {
      if (key === SAVE_KEY) throw new Error("clear failed");
    };
    expect(createSaveService(clearStorage).clear()).toMatchObject({
      status: "error",
      error: expect.any(Error),
    });
    expect(clearStorage.values.get(SAVE_KEY)).toBe("primary");
  });

  test("clears the primary save explicitly", () => {
    const storage = new FaultInjectingStorage();
    storage.values.set(SAVE_KEY, createEnvelope(createSaveFixture()));

    expect(createSaveService(storage).clear()).toEqual({ status: "cleared" });
    expect(storage.values.has(SAVE_KEY)).toBe(false);
  });

  test("keeps SaveService pure TypeScript and ships valid unique Cocos metadata", () => {
    const sourcePath = path.join(
      cocosRoot,
      "assets/scripts/persistence/SaveService.ts",
    );
    const source = fs.readFileSync(sourcePath, "utf8");
    expect(source).not.toMatch(/\b(?:from\s+|import\s*)["']cc(?:\/env)?["']/);
    expect(source).not.toMatch(/\b(?:window|document|navigator|localStorage)\b/);

    const directoryMeta = JSON.parse(
      fs.readFileSync(path.join(cocosRoot, "assets/scripts/persistence.meta"), "utf8"),
    ) as { importer?: string; uuid?: string };
    const sourceMeta = JSON.parse(
      fs.readFileSync(path.join(cocosRoot, "assets/scripts/persistence/SaveService.ts.meta"), "utf8"),
    ) as { importer?: string; uuid?: string };
    expect(directoryMeta).toMatchObject({ importer: "directory" });
    expect(sourceMeta).toMatchObject({ importer: "typescript" });
    expect(directoryMeta.uuid).toMatch(/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/);
    expect(sourceMeta.uuid).toMatch(/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/);
    expect(sourceMeta.uuid).not.toBe(directoryMeta.uuid);
  });
});
