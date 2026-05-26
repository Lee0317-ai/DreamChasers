import {
  getComboCandidates,
  getRemainingTileCounts,
  getSlotStatus,
  getTileLabel,
  isTileBlocked,
  type MahjongComboCandidate,
  type MahjongComboType,
  type MahjongGameState,
  type MahjongTile,
  type RemainingTileCounts,
  type SlotStatus,
} from "./mahjong-game";

export interface MahjongTileLayoutHint {
  x?: number;
  y?: number;
  sourcePackage?: string;
  stackDepth?: number;
}

export interface MahjongPresentationOptions {
  layoutByTileId?: Record<string, MahjongTileLayoutHint | undefined>;
}

export interface MahjongBoardRenderItem extends MahjongTileLayoutHint {
  id: string;
  label: string;
  suit: MahjongTile["suit"];
  rank: MahjongTile["rank"];
  layer: number;
  blocked: boolean;
  available: boolean;
  blockers: string[];
}

export interface MahjongPresentationCell {
  index: number;
  tileId: string | null;
  label: string | null;
  suit: MahjongTile["suit"] | null;
  rank: MahjongTile["rank"] | null;
}

export interface MahjongPresentationZone {
  capacity: number;
  used: number;
  cells: MahjongPresentationCell[];
}

export interface MahjongComboButtonSnapshot {
  type: MahjongComboType;
  enabled: boolean;
  candidateCount: number;
  firstCandidateKey: string | null;
  candidates: MahjongComboCandidate[];
}

export interface MahjongHudSnapshot {
  boardRemaining: number;
  slotStatus: SlotStatus;
  score: number;
  coins: number;
  shields: number;
  firstProtect: boolean;
  tools: MahjongGameState["tools"];
}

export interface MahjongPresentationSnapshot {
  board: MahjongBoardRenderItem[];
  slot: MahjongPresentationZone;
  reserve: MahjongPresentationZone;
  comboButtons: MahjongComboButtonSnapshot[];
  remaining: RemainingTileCounts;
  hud: MahjongHudSnapshot;
}

const COMBO_BUTTON_ORDER: MahjongComboType[] = ["hu", "gang", "peng", "chi"];

export function createMahjongPresentationSnapshot(
  state: MahjongGameState,
  options: MahjongPresentationOptions = {},
): MahjongPresentationSnapshot {
  const candidates = getComboCandidates(state);
  const slotStatus = getSlotStatus(state);

  return {
    board: createBoardSnapshot(state, options),
    slot: createZoneSnapshot(state, state.slot, state.slotLimit),
    reserve: createZoneSnapshot(state, state.reserve, state.reserveLimit),
    comboButtons: createComboButtonSnapshots(candidates),
    remaining: getRemainingTileCounts(state),
    hud: {
      boardRemaining: state.tiles.filter((tile) => tile.location === "board").length,
      slotStatus: slotStatus.status,
      score: state.score,
      coins: state.coins,
      shields: state.shields,
      firstProtect: state.firstProtect,
      tools: { ...state.tools },
    },
  };
}

function createBoardSnapshot(
  state: MahjongGameState,
  options: MahjongPresentationOptions,
): MahjongBoardRenderItem[] {
  const tileById = createTileMap(state);

  return state.tiles
    .filter((tile) => tile.location === "board")
    .map((tile) => {
      const layout = options.layoutByTileId?.[tile.id] ?? {};
      const blockers = (tile.blockedBy ?? []).filter((blockerId) => (
        tileById.get(blockerId)?.location === "board"
      ));
      const blocked = isTileBlocked(state, tile.id);

      return {
        id: tile.id,
        label: getTileLabel(tile),
        suit: tile.suit,
        rank: tile.rank,
        layer: tile.layer ?? 0,
        x: layout.x,
        y: layout.y,
        sourcePackage: layout.sourcePackage,
        stackDepth: layout.stackDepth,
        blocked,
        available: !blocked,
        blockers,
      };
    })
    .sort((a, b) => a.layer - b.layer || a.id.localeCompare(b.id));
}

function createZoneSnapshot(
  state: MahjongGameState,
  tileIds: string[],
  capacity: number,
): MahjongPresentationZone {
  const tileById = createTileMap(state);

  return {
    capacity,
    used: tileIds.length,
    cells: Array.from({ length: capacity }, (_, index) => {
      const tileId = tileIds[index] ?? null;
      const tile = tileId ? tileById.get(tileId) : undefined;

      return {
        index,
        tileId,
        label: tile ? getTileLabel(tile) : null,
        suit: tile?.suit ?? null,
        rank: tile?.rank ?? null,
      };
    }),
  };
}

function createComboButtonSnapshots(candidates: MahjongComboCandidate[]): MahjongComboButtonSnapshot[] {
  return COMBO_BUTTON_ORDER.map((type) => {
    const matching = candidates.filter((candidate) => candidate.type === type);

    return {
      type,
      enabled: matching.length > 0,
      candidateCount: matching.length,
      firstCandidateKey: matching[0]?.key ?? null,
      candidates: matching,
    };
  });
}

function createTileMap(state: MahjongGameState): Map<string, MahjongTile> {
  return new Map(state.tiles.map((tile) => [tile.id, tile]));
}
