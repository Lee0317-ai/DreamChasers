import {
  type MahjongComboType,
  type SlotStatus,
} from "./mahjong-game";
import {
  type MahjongBoardRenderItem,
  type MahjongPresentationCell,
  type MahjongPresentationSnapshot,
} from "./mahjong-presentation";

export interface MahjongCocosPoint {
  x: number;
  y: number;
}

export interface MahjongCocosSize {
  width: number;
  height: number;
}

export interface MahjongCocosSceneOptions {
  boardOrigin?: MahjongCocosPoint;
  tileSize?: MahjongCocosSize;
  boardScale?: number;
}

export interface MahjongCocosTileNodeModel {
  name: string;
  tileId: string;
  label: string;
  position: MahjongCocosPoint;
  zIndex: number;
  interactable: boolean;
  dimmed: boolean;
  prefabKey: string;
  sourcePackage?: string;
  stackDepth?: number;
}

export interface MahjongCocosCellNodeModel {
  name: string;
  index: number;
  tileId: string | null;
  label: string | null;
  occupied: boolean;
  prefabKey: string | null;
}

export interface MahjongCocosComboControlModel {
  name: string;
  combo: MahjongComboType;
  interactable: boolean;
  badgeText: string;
  candidateKey: string | null;
}

export interface MahjongCocosHudModel {
  boardRemainingText: string;
  slotStatusText: string;
  scoreText: string;
  coinsText: string;
  toolText: string;
}

export interface MahjongCocosSceneModel {
  boardNodes: MahjongCocosTileNodeModel[];
  slotNodes: MahjongCocosCellNodeModel[];
  reserveNodes: MahjongCocosCellNodeModel[];
  comboControls: MahjongCocosComboControlModel[];
  hud: MahjongCocosHudModel;
}

const DEFAULT_BOARD_ORIGIN: MahjongCocosPoint = { x: 0, y: 0 };
const COMBO_CONTROL_NAMES: Record<MahjongComboType, string> = {
  hu: "Combo_Hu",
  gang: "Combo_Gang",
  peng: "Combo_Peng",
  chi: "Combo_Chi",
};
const SLOT_STATUS_TEXT: Record<SlotStatus, string> = {
  open: "可继续",
  combo_available: "可消除",
  reserve_available: "可救场",
  shield_available: "护符可用",
  first_protect_available: "首败保护",
  failed: "失败",
};

export function createMahjongCocosSceneModel(
  snapshot: MahjongPresentationSnapshot,
  options: MahjongCocosSceneOptions = {},
): MahjongCocosSceneModel {
  return {
    boardNodes: snapshot.board.map((tile) => createBoardNode(tile, options)),
    slotNodes: snapshot.slot.cells.map((cell) => createCellNode("Slot", cell)),
    reserveNodes: snapshot.reserve.cells.map((cell) => createCellNode("Reserve", cell)),
    comboControls: snapshot.comboButtons.map((button) => ({
      name: COMBO_CONTROL_NAMES[button.type],
      combo: button.type,
      interactable: button.enabled,
      badgeText: String(button.candidateCount),
      candidateKey: button.firstCandidateKey,
    })),
    hud: {
      boardRemainingText: `余牌 ${snapshot.hud.boardRemaining}`,
      slotStatusText: SLOT_STATUS_TEXT[snapshot.hud.slotStatus],
      scoreText: `分 ${snapshot.hud.score}`,
      coinsText: `铜钱 ${snapshot.hud.coins}`,
      toolText: `洗 ${snapshot.hud.tools.shuffle} / 撤 ${snapshot.hud.tools.undo} / 透 ${snapshot.hud.tools.vision}`,
    },
  };
}

function createBoardNode(
  tile: MahjongBoardRenderItem,
  options: MahjongCocosSceneOptions,
): MahjongCocosTileNodeModel {
  return {
    name: `Tile_${tile.id}`,
    tileId: tile.id,
    label: tile.label,
    position: toCocosPosition(tile, options),
    zIndex: tile.layer * 100,
    interactable: tile.available,
    dimmed: tile.blocked,
    prefabKey: createPrefabKey(tile.suit, tile.rank),
    sourcePackage: tile.sourcePackage,
    stackDepth: tile.stackDepth,
  };
}

function createCellNode(prefix: "Slot" | "Reserve", cell: MahjongPresentationCell): MahjongCocosCellNodeModel {
  return {
    name: `${prefix}_${cell.index}`,
    index: cell.index,
    tileId: cell.tileId,
    label: cell.label,
    occupied: cell.tileId !== null,
    prefabKey: cell.suit && cell.rank ? createPrefabKey(cell.suit, cell.rank) : null,
  };
}

function toCocosPosition(
  tile: MahjongBoardRenderItem,
  options: MahjongCocosSceneOptions,
): MahjongCocosPoint {
  const origin = options.boardOrigin ?? DEFAULT_BOARD_ORIGIN;
  const scale = options.boardScale ?? 1;
  const x = tile.x ?? 0;
  const y = tile.y ?? 0;

  return {
    x: Math.round(origin.x + x * scale),
    y: Math.round(origin.y - y * scale),
  };
}

function createPrefabKey(suit: string, rank: number): string {
  return `tile.${suit}.${rank}`;
}
