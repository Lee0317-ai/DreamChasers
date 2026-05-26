import { game, screen, view } from "cc";
import type { HulebuCocosSceneModel } from "../contracts/HulebuSceneModel";

const SCREEN_WIDTH = 390;
const SCREEN_HEIGHT = 844;
const DEFAULT_LAYOUT = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};

const SAMPLE_SLOT_NAMES = [
  "Slot_0",
  "Slot_1",
  "Slot_2",
  "Slot_3",
  "Slot_4",
  "Slot_5",
  "Slot_6",
  "Slot_7",
] as const;

export interface HulebuLayoutSize {
  width: number;
  height: number;
  cssWidth?: number;
  cssHeight?: number;
  scale?: number;
}

export function createHulebuSampleSceneModel(): HulebuCocosSceneModel {
  return createHulebuSampleSceneModelForLayout(DEFAULT_LAYOUT);
}

export function scaleLayoutValue(value: number, scale: number): number {
  return Math.round(value * scale);
}

export function centerLayoutX(x: number, layout: HulebuLayoutSize): number {
  return Math.round(x - layout.width / 2);
}

export function centerLayoutY(y: number, layout: HulebuLayoutSize): number {
  return Math.round(y - layout.height / 2);
}

export function resolveHulebuRuntimeLayout(): Required<HulebuLayoutSize> {
  const visibleSize = view.getVisibleSize();
  const frameSize = view.getFrameSize();
  const canvas = game.canvas;
  const cssWidth = Math.max(320, canvas?.clientWidth ?? frameSize.width / screen.devicePixelRatio);
  const cssHeight = Math.max(568, canvas?.clientHeight ?? frameSize.height / screen.devicePixelRatio);
  const scale = Math.max(1, screen.devicePixelRatio, visibleSize.width / cssWidth, visibleSize.height / cssHeight);

  return {
    width: Math.round(cssWidth * scale),
    height: Math.round(cssHeight * scale),
    cssWidth: Math.round(cssWidth),
    cssHeight: Math.round(cssHeight),
    scale,
  };
}

export function createHulebuSampleSceneModelForLayout(layout: HulebuLayoutSize): HulebuCocosSceneModel {
  const layoutScale = Math.max(1, layout.scale ?? 1);
  const screenWidth = Math.max(320, Math.round(layout.cssWidth ?? layout.width / layoutScale));
  const screenHeight = Math.max(568, Math.round(layout.cssHeight ?? layout.height / layoutScale));
  const boardCenterX = scaleLayoutValue(screenWidth / 2, layoutScale);
  const boardCenterY = scaleLayoutValue(screenHeight * 0.58, layoutScale);
  const tileGapX = scaleLayoutValue(Math.max(40, Math.min(48, screenWidth * 0.12)), layoutScale);
  const tileGapY = scaleLayoutValue(Math.max(52, Math.min(66, screenHeight * 0.08)), layoutScale);

  return {
    boardNodes: [
      createBoardNode("sample-01", "1万", boardCenterX - tileGapX * 2, boardCenterY + tileGapY, 0, true, false, "starter", 1),
      createBoardNode("sample-02", "2万", boardCenterX - tileGapX, boardCenterY + tileGapY, 0, false, true, "starter", 2),
      createBoardNode("sample-03", "3万", boardCenterX, boardCenterY + tileGapY, 0, false, true, "starter", 2),
      createBoardNode("sample-04", "4筒", boardCenterX + tileGapX, boardCenterY + tileGapY, 0, true, false, "starter", 1),
      createBoardNode("sample-05", "5筒", boardCenterX + tileGapX * 2, boardCenterY + tileGapY, 0, true, false, "starter", 1),
      createBoardNode("sample-06", "6筒", boardCenterX - tileGapX * 2.5, boardCenterY, 0, false, true, "starter", 2),
      createBoardNode("sample-07", "东", boardCenterX - tileGapX * 1.5, boardCenterY, 100, true, false, "upper", 1),
      createBoardNode("sample-08", "南", boardCenterX - tileGapX * 0.5, boardCenterY, 100, true, false, "upper", 1),
      createBoardNode("sample-09", "西", boardCenterX + tileGapX * 0.5, boardCenterY, 100, false, true, "upper", 2),
      createBoardNode("sample-10", "中", boardCenterX + tileGapX * 1.5, boardCenterY, 100, true, false, "upper", 1),
      createBoardNode("sample-11", "发", boardCenterX + tileGapX * 2.5, boardCenterY, 100, true, false, "upper", 1),
      createBoardNode("sample-12", "白", boardCenterX - tileGapX * 1.5, boardCenterY - tileGapY, 200, true, false, "top", 1),
      createBoardNode("sample-13", "7条", boardCenterX - tileGapX * 0.5, boardCenterY - tileGapY, 200, true, false, "top", 1),
      createBoardNode("sample-14", "8条", boardCenterX + tileGapX * 0.5, boardCenterY - tileGapY, 200, true, false, "top", 1),
      createBoardNode("sample-15", "9条", boardCenterX + tileGapX * 1.5, boardCenterY - tileGapY, 200, true, false, "top", 1),
    ],
    slotNodes: SAMPLE_SLOT_NAMES.map((name, index) => ({
      name,
      index,
      tileId: null,
      label: null,
      occupied: false,
      prefabKey: null,
    })),
    reserveNodes: [],
    comboControls: [
      {
        name: "Combo_Hu",
        combo: "hu",
        interactable: false,
        badgeText: "0",
        candidateKey: null,
      },
      {
        name: "Combo_Gang",
        combo: "gang",
        interactable: false,
        badgeText: "0",
        candidateKey: null,
      },
      {
        name: "Combo_Peng",
        combo: "peng",
        interactable: false,
        badgeText: "0",
        candidateKey: null,
      },
      {
        name: "Combo_Chi",
        combo: "chi",
        interactable: false,
        badgeText: "0",
        candidateKey: null,
      },
    ],
    hud: {
      boardRemainingText: "余牌 15",
      slotStatusText: "可继续",
      scoreText: "分 0",
      coinsText: "铜钱 0",
      toolText: "洗 1 / 撤 1 / 透 1",
    },
  };
}

function createBoardNode(
  tileId: string,
  label: string,
  x: number,
  y: number,
  zIndex: number,
  interactable: boolean,
  dimmed: boolean,
  sourcePackage: string,
  stackDepth: number,
) {
  return {
    name: `Tile_${tileId}`,
    tileId,
    label,
    position: { x, y },
    zIndex,
    interactable,
    dimmed,
    prefabKey: `sample.${label}`,
    sourcePackage,
    stackDepth,
  };
}
