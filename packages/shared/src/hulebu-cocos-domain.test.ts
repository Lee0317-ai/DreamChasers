import fs from "node:fs";
import path from "node:path";
import { rolldown } from "rolldown";
import { beforeAll, describe, expect, test } from "vitest";
import type { HulebuRuntimeLevelConfig, HulebuTileSuit } from "../../../apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig";
import type {
  HulebuRuntimeState as HulebuRuntimeStateClass,
  HulebuRuntimeLegacySnapshot,
  HulebuRuntimeSnapshot,
} from "../../../apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState";
import type { GameCommand, GameSnapshot } from "../../../apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain/GameContracts";
import type { GameSession as GameSessionClass } from "../../../apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain/GameSession";

const workspaceRoot = path.resolve(__dirname, "../../..");
const cocosRoot = path.join(
  workspaceRoot,
  "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8",
);
const domainTsconfigPath = path.join(cocosRoot, "tsconfig.domain.json");
let HulebuRuntimeState: typeof HulebuRuntimeStateClass;
let GameSession: typeof GameSessionClass;

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
  };
  HulebuRuntimeState = domainModule.HulebuRuntimeState;
  GameSession = domainModule.GameSession;
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
  initialSlotOrder?: string[];
  slotLimit?: number;
  shuffle?: number;
  undo?: number;
  discard?: number;
  order?: number;
}): HulebuRuntimeLevelConfig {
  return {
    id: "domain-test-level",
    order: options.order ?? 7,
    name: "Domain test",
    subtitle: "Deterministic fixture",
    rewardPool: [],
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
    initialReserveOrder: [],
    tiles: options.tiles,
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

  test("keeps the domain and runtime import graph free of Cocos runtime modules", () => {
    const entries = [
      "assets/scripts/domain/GameContracts.ts",
      "assets/scripts/domain/GameSession.ts",
      "assets/scripts/runtime/HulebuRuntimeState.ts",
    ].map((relativePath) => path.join(cocosRoot, relativePath));
    const graph = collectRelativeImportGraph(entries);
    const offenders = [...graph].flatMap((filePath) => {
      const source = fs.readFileSync(filePath, "utf8");
      const relativePath = path.relative(cocosRoot, filePath);
      return relativePath.includes("assets/scripts/bootstrap/")
        || /\b(?:from\s+|import\s*)["']cc(?:\/env)?["']/.test(source)
        || /\bimport\s*\(\s*["']cc(?:\/env)?["']\s*\)/.test(source)
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

    for (const fileName of ["GameContracts.ts.meta", "GameSession.ts.meta"]) {
      const meta = JSON.parse(
        fs.readFileSync(path.join(cocosRoot, "assets/scripts/domain", fileName), "utf8"),
      ) as { importer?: string; uuid?: string };
      expect(meta).toMatchObject({ importer: "typescript" });
      expect(meta.uuid).toMatch(/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/);
    }
  });
});
