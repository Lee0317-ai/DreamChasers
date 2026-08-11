export interface HulebuPoint {
  x: number;
  y: number;
}

export type HulebuComboType = "hu" | "gang" | "peng" | "chi" | "bugang";

export interface HulebuBoardNodeModel {
  name: string;
  tileId: string;
  label: string;
  position: HulebuPoint;
  zIndex: number;
  interactable: boolean;
  dimmed: boolean;
  prefabKey: string;
  sourcePackage?: string;
  stackDepth?: number;
  visualScale?: number;
  displayZone?: "mountain" | "loose";
}

export interface HulebuCellNodeModel {
  name: string;
  index: number;
  tileId: string | null;
  label: string | null;
  occupied: boolean;
  prefabKey: string | null;
}

export interface HulebuOpenMeldNodeModel {
  name: string;
  index: number;
  type: "peng" | "gang" | "bugang";
  label: string;
  tileKey: string;
  tileIds: string[];
  count: number;
  prefabKey: string;
}

export interface HulebuRiverNodeModel {
  name: string;
  index: number;
  tileId: string | null;
  label: string | null;
  occupied: boolean;
  prefabKey: string | null;
}

export interface HulebuComboControlModel {
  name: string;
  combo: HulebuComboType;
  interactable: boolean;
  badgeText: string;
  candidateKey: string | null;
}

export interface HulebuTileCounterItemModel {
  label: string;
  prefabKey: string;
  count: number;
}

export interface HulebuTileCounterSuitModel {
  suit: "wan" | "tiao" | "tong" | "honor";
  label: string;
  total: number;
  tiles: HulebuTileCounterItemModel[];
}

export interface HulebuTileCounterModel {
  total: number;
  suits: HulebuTileCounterSuitModel[];
}

export interface HulebuHudModel {
  boardRemainingText: string;
  slotStatusText: string;
  scoreText: string;
  coinsText: string;
  toolText: string;
  tileCounter: HulebuTileCounterModel;
  bossText?: string;
}

export interface HulebuCocosSceneModel {
  boardNodes: HulebuBoardNodeModel[];
  slotNodes: HulebuCellNodeModel[];
  reserveNodes: HulebuCellNodeModel[];
  openMeldNodes: HulebuOpenMeldNodeModel[];
  riverNodes: HulebuRiverNodeModel[];
  comboControls: HulebuComboControlModel[];
  hud: HulebuHudModel;
}
