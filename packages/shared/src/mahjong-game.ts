export type MahjongSuit = "wan" | "tiao" | "tong" | "honor";

export type MahjongRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type MahjongTileLocation = "board" | "slot" | "reserve" | "removed";

export type MahjongComboType = "chi" | "peng" | "gang" | "hu";

export type MahjongToolType = "shuffle" | "undo" | "vision";

export type SlotStatus =
  | "open"
  | "combo_available"
  | "reserve_available"
  | "shield_available"
  | "first_protect_available"
  | "failed";

export interface MahjongTile {
  id: string;
  suit: MahjongSuit;
  rank: MahjongRank;
  layer?: number;
  blockedBy?: string[];
  location: MahjongTileLocation;
}

export interface MahjongComboCandidate {
  type: MahjongComboType;
  tileIds: string[];
  labels: string[];
  key: string;
}

export interface MahjongGameState {
  tiles: MahjongTile[];
  slot: string[];
  reserve: string[];
  slotLimit: number;
  reserveLimit: number;
  shields: number;
  firstProtect: boolean;
  score: number;
  coins: number;
  tools: Record<MahjongToolType, number>;
  bonuses: Record<MahjongComboType, number>;
}

export type MahjongRewardEffect =
  | { type: "slot_limit_delta"; value: number }
  | { type: "reserve_limit_delta"; value: number }
  | { type: "shield_delta"; value: number }
  | { type: "coin_delta"; value: number }
  | { type: "tool_delta"; tool: MahjongToolType; value: number }
  | { type: "combo_score_bonus"; combo: MahjongComboType; value: number };

export interface MahjongReward {
  id: string;
  name: string;
  effects: MahjongRewardEffect[];
}

export interface SlotStatusResult {
  status: SlotStatus;
  candidates: MahjongComboCandidate[];
}

export interface RemainingSuitCount {
  total: number;
  ranks: Record<MahjongRank, number>;
}

export type RemainingTileCounts = Record<MahjongSuit, RemainingSuitCount>;

const SUIT_LABELS: Record<MahjongSuit, string> = {
  wan: "万",
  tiao: "条",
  tong: "筒",
  honor: "",
};

const HONOR_LABELS: Partial<Record<MahjongRank, string>> = {
  1: "东",
  2: "南",
  3: "西",
  4: "北",
  5: "中",
  6: "发",
  7: "白",
};

const MAX_SLOT_LIMIT = 8;

const COMBO_BASE_SCORE: Record<MahjongComboType, number> = {
  chi: 10,
  peng: 20,
  gang: 50,
  hu: 120,
};

const COMBO_COIN_REWARD: Record<MahjongComboType, number> = {
  chi: 3,
  peng: 3,
  gang: 6,
  hu: 12,
};

const COMBO_ORDER: Record<MahjongComboType, number> = {
  hu: 0,
  gang: 1,
  peng: 2,
  chi: 3,
};

export function createMahjongTile(
  id: string,
  suit: MahjongSuit,
  rank: MahjongRank,
  options: Partial<Pick<MahjongTile, "layer" | "blockedBy" | "location">> = {},
): MahjongTile {
  return {
    id,
    suit,
    rank,
    layer: options.layer ?? 0,
    blockedBy: options.blockedBy ? [...options.blockedBy] : [],
    location: options.location ?? "slot",
  };
}

export function createMahjongState(partial: Partial<MahjongGameState> = {}): MahjongGameState {
  return {
    tiles: partial.tiles ? cloneTiles(partial.tiles) : [],
    slot: partial.slot ? [...partial.slot] : [],
    reserve: partial.reserve ? [...partial.reserve] : [],
    slotLimit: clampSlotLimit(partial.slotLimit ?? MAX_SLOT_LIMIT),
    reserveLimit: partial.reserveLimit ?? 0,
    shields: partial.shields ?? 0,
    firstProtect: partial.firstProtect ?? false,
    score: partial.score ?? 0,
    coins: partial.coins ?? 0,
    tools: {
      shuffle: partial.tools?.shuffle ?? 0,
      undo: partial.tools?.undo ?? 0,
      vision: partial.tools?.vision ?? 0,
    },
    bonuses: {
      chi: partial.bonuses?.chi ?? 0,
      peng: partial.bonuses?.peng ?? 0,
      gang: partial.bonuses?.gang ?? 0,
      hu: partial.bonuses?.hu ?? 0,
    },
  };
}

export function getTileLabel(tile: Pick<MahjongTile, "rank" | "suit">): string {
  if (tile.suit === "honor") {
    return HONOR_LABELS[tile.rank] ?? `字${tile.rank}`;
  }

  return `${tile.rank}${SUIT_LABELS[tile.suit]}`;
}

export function findTile(state: MahjongGameState, tileId: string): MahjongTile | undefined {
  return state.tiles.find((tile) => tile.id === tileId);
}

export function isTileBlocked(state: MahjongGameState, tileId: string): boolean {
  const tile = findTile(state, tileId);
  if (!tile || tile.location !== "board") {
    return false;
  }

  return (tile.blockedBy ?? []).some((blockerId) => {
    const blocker = findTile(state, blockerId);
    return blocker?.location === "board";
  });
}

export function getAvailableBoardTiles(state: MahjongGameState): MahjongTile[] {
  return state.tiles.filter((tile) => tile.location === "board" && !isTileBlocked(state, tile.id));
}

export function isBoardClear(state: MahjongGameState): boolean {
  return state.tiles.every((tile) => tile.location !== "board");
}

export function getComboCandidates(state: MahjongGameState): MahjongComboCandidate[] {
  const slotTiles = state.slot
    .map((tileId) => findTile(state, tileId))
    .filter(isSlotTile);

  const candidates: MahjongComboCandidate[] = [];
  const huCandidate = getHuCandidate(state);
  if (huCandidate) {
    candidates.push(huCandidate);
  }
  const bySuitRank = new Map<string, MahjongTile[]>();

  for (const tile of slotTiles) {
    const key = `${tile.suit}-${tile.rank}`;
    const group = bySuitRank.get(key) ?? [];
    group.push(tile);
    bySuitRank.set(key, group);
  }

  for (const group of bySuitRank.values()) {
    if (group.length >= 4) {
      candidates.push(makeCandidate("gang", group.slice(0, 4)));
    }
    if (group.length >= 3) {
      candidates.push(makeCandidate("peng", group.slice(0, 3)));
    }
  }

  for (const suit of ["wan", "tiao", "tong"] satisfies MahjongSuit[]) {
    const byRank = new Map<MahjongRank, MahjongTile[]>();

    for (const tile of slotTiles) {
      if (tile.suit !== suit) {
        continue;
      }

      const group = byRank.get(tile.rank) ?? [];
      group.push(tile);
      byRank.set(tile.rank, group);
    }

    for (let rank = 1; rank <= 7; rank += 1) {
      const firstRank = rank as MahjongRank;
      const secondRank = (rank + 1) as MahjongRank;
      const thirdRank = (rank + 2) as MahjongRank;
      const first = byRank.get(firstRank)?.[0];
      const second = byRank.get(secondRank)?.[0];
      const third = byRank.get(thirdRank)?.[0];

      if (first && second && third) {
        candidates.push(makeCandidate("chi", [first, second, third]));
      }
    }
  }

  const seen = new Set<string>();
  return candidates
    .filter((candidate) => {
      if (seen.has(candidate.key)) {
        return false;
      }
      seen.add(candidate.key);
      return true;
    })
    .sort((a, b) => COMBO_ORDER[a.type] - COMBO_ORDER[b.type] || a.key.localeCompare(b.key));
}

export function getHuCandidate(state: MahjongGameState): MahjongComboCandidate | null {
  const slotTiles = state.slot
    .map((tileId) => findTile(state, tileId))
    .filter(isSlotTile);

  if (slotTiles.length !== MAX_SLOT_LIMIT) {
    return null;
  }

  const groups = findHuGroups(slotTiles);
  if (!groups) {
    return null;
  }

  const huTileIds = new Set(groups.flat().map((tile) => tile.id));
  return makeCandidate("hu", slotTiles.filter((tile) => huTileIds.has(tile.id)));
}

export function getSlotStatus(state: MahjongGameState): SlotStatusResult {
  const candidates = getComboCandidates(state);

  if (state.slot.length < state.slotLimit) {
    return { status: "open", candidates };
  }

  if (candidates.length > 0) {
    return { status: "combo_available", candidates };
  }

  if (state.reserve.length < state.reserveLimit) {
    return { status: "reserve_available", candidates };
  }

  if (state.shields > 0) {
    return { status: "shield_available", candidates };
  }

  if (state.firstProtect) {
    return { status: "first_protect_available", candidates };
  }

  return { status: "failed", candidates };
}

export function executeCombo(
  state: MahjongGameState,
  candidateOrKey: MahjongComboCandidate | string,
): MahjongGameState {
  const candidate = typeof candidateOrKey === "string"
    ? getComboCandidates(state).find((item) => item.key === candidateOrKey)
    : candidateOrKey;

  if (!candidate) {
    throw new Error("Cannot execute a missing mahjong combo candidate.");
  }

  const candidateIds = new Set(candidate.tileIds);
  const next = cloneState(state);

  next.tiles = next.tiles.map((tile) => (
    candidateIds.has(tile.id) ? { ...tile, location: "removed" } : tile
  ));
  next.slot = next.slot.filter((tileId) => !candidateIds.has(tileId));
  next.score += COMBO_BASE_SCORE[candidate.type] + next.bonuses[candidate.type];
  next.coins += COMBO_COIN_REWARD[candidate.type];

  return next;
}

export function moveTileToSlot(state: MahjongGameState, tileId: string): MahjongGameState {
  const tile = findTile(state, tileId);

  if (!tile) {
    throw new Error(`Tile ${tileId} does not exist.`);
  }

  if (tile.location !== "board") {
    throw new Error(`Tile ${tileId} is not on the board.`);
  }

  if (isTileBlocked(state, tileId)) {
    throw new Error(`Tile ${tileId} is blocked.`);
  }

  if (state.slot.length >= state.slotLimit) {
    throw new Error("Slot is full.");
  }

  const next = cloneState(state);
  next.tiles = next.tiles.map((item) => (
    item.id === tileId ? { ...item, location: "slot" } : item
  ));
  next.slot.push(tileId);
  return next;
}

export function getRemainingTileCounts(state: MahjongGameState): RemainingTileCounts {
  const counts = createEmptyCounts();

  for (const tile of state.tiles) {
    if (tile.location === "removed") {
      continue;
    }

    counts[tile.suit].total += 1;
    counts[tile.suit].ranks[tile.rank] += 1;
  }

  return counts;
}

export function applyReward(state: MahjongGameState, reward: MahjongReward): MahjongGameState {
  const next = cloneState(state);

  for (const effect of reward.effects) {
    switch (effect.type) {
      case "slot_limit_delta":
        next.slotLimit = clampSlotLimit(next.slotLimit + effect.value);
        break;
      case "reserve_limit_delta":
        next.reserveLimit = Math.max(0, next.reserveLimit + effect.value);
        break;
      case "shield_delta":
        next.shields = Math.max(0, next.shields + effect.value);
        break;
      case "coin_delta":
        next.coins = Math.max(0, next.coins + effect.value);
        break;
      case "tool_delta":
        next.tools[effect.tool] = Math.max(0, next.tools[effect.tool] + effect.value);
        break;
      case "combo_score_bonus":
        next.bonuses[effect.combo] += effect.value;
        break;
      default:
        assertNever(effect);
    }
  }

  return next;
}

function makeCandidate(type: MahjongComboType, tiles: MahjongTile[]): MahjongComboCandidate {
  const tileIds = tiles.map((tile) => tile.id);

  return {
    type,
    tileIds,
    labels: tiles.map(getTileLabel),
    key: `${type}:${tileIds.slice().sort().join(",")}`,
  };
}

function findHuGroups(tiles: MahjongTile[]): MahjongTile[][] | null {
  for (let pairStart = 0; pairStart < tiles.length - 1; pairStart += 1) {
    for (let pairEnd = pairStart + 1; pairEnd < tiles.length; pairEnd += 1) {
      if (!isSameTile(tiles[pairStart], tiles[pairEnd])) {
        continue;
      }

      const pairIds = new Set([tiles[pairStart].id, tiles[pairEnd].id]);
      const remaining = tiles.filter((tile) => !pairIds.has(tile.id));
      for (const firstSet of findMelds(remaining)) {
        const firstIds = new Set(firstSet.map((tile) => tile.id));
        const secondRemaining = remaining.filter((tile) => !firstIds.has(tile.id));
        const secondSet = findMelds(secondRemaining)[0];
        if (secondSet && secondSet.length === secondRemaining.length) {
          return [firstSet, secondSet, [tiles[pairStart], tiles[pairEnd]]];
        }
      }
    }
  }

  return null;
}

function findMelds(tiles: MahjongTile[]): MahjongTile[][] {
  const melds: MahjongTile[][] = [];

  for (const group of groupBySuitRank(tiles).values()) {
    if (group.length >= 3) {
      melds.push(group.slice(0, 3));
    }
  }

  for (const suit of ["wan", "tiao", "tong"] satisfies MahjongSuit[]) {
    const byRank = new Map<MahjongRank, MahjongTile[]>();
    for (const tile of tiles) {
      if (tile.suit !== suit) {
        continue;
      }

      const group = byRank.get(tile.rank) ?? [];
      group.push(tile);
      byRank.set(tile.rank, group);
    }

    for (let rank = 1; rank <= 7; rank += 1) {
      const first = byRank.get(rank as MahjongRank)?.[0];
      const second = byRank.get((rank + 1) as MahjongRank)?.[0];
      const third = byRank.get((rank + 2) as MahjongRank)?.[0];
      if (first && second && third) {
        melds.push([first, second, third]);
      }
    }
  }

  return melds;
}

function groupBySuitRank(tiles: MahjongTile[]): Map<string, MahjongTile[]> {
  const bySuitRank = new Map<string, MahjongTile[]>();

  for (const tile of tiles) {
    const key = `${tile.suit}-${tile.rank}`;
    const group = bySuitRank.get(key) ?? [];
    group.push(tile);
    bySuitRank.set(key, group);
  }

  return bySuitRank;
}

function isSameTile(a: MahjongTile, b: MahjongTile): boolean {
  return a.suit === b.suit && a.rank === b.rank;
}

function clampSlotLimit(value: number): number {
  return Math.max(1, Math.min(MAX_SLOT_LIMIT, value));
}

function isSlotTile(tile: MahjongTile | undefined): tile is MahjongTile {
  return tile?.location === "slot";
}

function cloneState(state: MahjongGameState): MahjongGameState {
  return {
    ...state,
    tiles: cloneTiles(state.tiles),
    slot: [...state.slot],
    reserve: [...state.reserve],
    tools: { ...state.tools },
    bonuses: { ...state.bonuses },
  };
}

function cloneTiles(tiles: MahjongTile[]): MahjongTile[] {
  return tiles.map((tile) => ({
    ...tile,
    blockedBy: tile.blockedBy ? [...tile.blockedBy] : [],
  }));
}

function createEmptyCounts(): RemainingTileCounts {
  return {
    wan: createEmptySuitCount(),
    tiao: createEmptySuitCount(),
    tong: createEmptySuitCount(),
    honor: createEmptySuitCount(),
  };
}

function createEmptySuitCount(): RemainingSuitCount {
  return {
    total: 0,
    ranks: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    },
  };
}

function assertNever(value: never): never {
  throw new Error(`Unhandled reward effect: ${JSON.stringify(value)}`);
}
