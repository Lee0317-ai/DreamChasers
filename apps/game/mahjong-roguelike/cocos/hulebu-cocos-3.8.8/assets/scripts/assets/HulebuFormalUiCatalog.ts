import { HULEBU_V3_UI_SPRITES, HULEBU_V3_UI_VERSION } from "./HulebuV3UiCatalog";

export const HULEBU_FORMAL_UI_VERSION = HULEBU_V3_UI_VERSION;

export const HULEBU_FORMAL_UI_SPRITES = {
  background: HULEBU_V3_UI_SPRITES.backgrounds.gameplay,
  hud: {
    levelBadge: HULEBU_V3_UI_SPRITES.hud.level,
    scoreBadge: HULEBU_V3_UI_SPRITES.hud.score,
    tileCounter: HULEBU_V3_UI_SPRITES.hud.remaining,
    counterToggle: HULEBU_V3_UI_SPRITES.hud.counterToggle,
  },
  board: {
    discardSlots: HULEBU_V3_UI_SPRITES.playfield.looseDropZone,
    handSlots: HULEBU_V3_UI_SPRITES.playfield.handSlot,
  },
  actions: {
    chi: {
      normal: HULEBU_V3_UI_SPRITES.actions.chi,
      active: HULEBU_V3_UI_SPRITES.actions.chi,
      disabled: HULEBU_V3_UI_SPRITES.actions.chi,
    },
    peng: {
      normal: HULEBU_V3_UI_SPRITES.actions.peng,
      active: HULEBU_V3_UI_SPRITES.actions.peng,
      disabled: HULEBU_V3_UI_SPRITES.actions.peng,
    },
    gang: {
      normal: HULEBU_V3_UI_SPRITES.actions.gang,
      active: HULEBU_V3_UI_SPRITES.actions.gang,
      disabled: HULEBU_V3_UI_SPRITES.actions.gang,
    },
    hu: {
      normal: HULEBU_V3_UI_SPRITES.actions.hu,
      active: HULEBU_V3_UI_SPRITES.actions.hu,
      disabled: HULEBU_V3_UI_SPRITES.actions.hu,
    },
    bugang: {
      normal: HULEBU_V3_UI_SPRITES.actions.bugang,
      active: HULEBU_V3_UI_SPRITES.actions.bugang,
      disabled: HULEBU_V3_UI_SPRITES.actions.bugang,
    },
  },
  tools: {
    shuffle: HULEBU_V3_UI_SPRITES.tools.shuffle,
    undo: HULEBU_V3_UI_SPRITES.tools.undo,
    hint: HULEBU_V3_UI_SPRITES.tools.discard,
    buff: HULEBU_V3_UI_SPRITES.icons.amulet,
    counter: HULEBU_V3_UI_SPRITES.hud.counterToggle,
  },
  cards: {
    combo: HULEBU_V3_UI_SPRITES.cards.reward,
    score: HULEBU_V3_UI_SPRITES.cards.reward,
    slot: HULEBU_V3_UI_SPRITES.cards.upgrade,
    wind: HULEBU_V3_UI_SPRITES.cards.event,
  },
  modals: {
    comboChoice: HULEBU_V3_UI_SPRITES.panels.comboChoice,
    pause: HULEBU_V3_UI_SPRITES.panels.pause,
    settings: HULEBU_V3_UI_SPRITES.panels.settings,
    settlement: HULEBU_V3_UI_SPRITES.panels.resultStats,
    tutorial: HULEBU_V3_UI_SPRITES.misc.tutorialFrame,
  },
} as const;

export function getHulebuFormalMahjongSpritePath(fileName: string): string {
  return `ui/formal-v1/tiles/mahjong/${fileName}/spriteFrame`;
}
