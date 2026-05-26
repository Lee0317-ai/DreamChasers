export interface HulebuPoint {
  x: number;
  y: number;
}

export type HulebuComboType = "hu" | "gang" | "peng" | "chi";

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
}

export interface HulebuCellNodeModel {
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

export interface HulebuHudModel {
  boardRemainingText: string;
  slotStatusText: string;
  scoreText: string;
  coinsText: string;
  toolText: string;
}

export interface HulebuCocosSceneModel {
  boardNodes: HulebuBoardNodeModel[];
  slotNodes: HulebuCellNodeModel[];
  reserveNodes: HulebuCellNodeModel[];
  comboControls: HulebuComboControlModel[];
  hud: HulebuHudModel;
}
