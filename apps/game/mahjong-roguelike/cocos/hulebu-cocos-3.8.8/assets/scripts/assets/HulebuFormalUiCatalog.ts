export const HULEBU_FORMAL_UI_VERSION = "hulebu-formal-ui-v1";

export const HULEBU_FORMAL_UI_SPRITES = {
  background: "ui/formal-v1/background/scene-emerald-v1/spriteFrame",
  hud: {
    levelBadge: "ui/formal-v1/hud/level-badge/spriteFrame",
    scoreBadge: "ui/formal-v1/hud/score-badge/spriteFrame",
    tileCounter: "ui/formal-v1/hud/tile-counter/spriteFrame",
  },
  board: {
    discardSlots: "ui/formal-v1/board/discard-slots/spriteFrame",
    handSlots: "ui/formal-v1/board/hand-slots/spriteFrame",
  },
  actions: {
    chi: {
      normal: "ui/formal-v1/actions/chi-normal/spriteFrame",
      active: "ui/formal-v1/actions/chi-active/spriteFrame",
      disabled: "ui/formal-v1/actions/chi-disabled/spriteFrame",
    },
    peng: {
      normal: "ui/formal-v1/actions/peng-normal/spriteFrame",
      active: "ui/formal-v1/actions/peng-active/spriteFrame",
      disabled: "ui/formal-v1/actions/peng-disabled/spriteFrame",
    },
    gang: {
      normal: "ui/formal-v1/actions/gang-normal/spriteFrame",
      active: "ui/formal-v1/actions/gang-active/spriteFrame",
      disabled: "ui/formal-v1/actions/gang-disabled/spriteFrame",
    },
    hu: {
      normal: "ui/formal-v1/actions/hu-normal/spriteFrame",
      active: "ui/formal-v1/actions/hu-active/spriteFrame",
      disabled: "ui/formal-v1/actions/hu-disabled/spriteFrame",
    },
    bugang: {
      normal: "ui/formal-v1/actions/bugang-normal/spriteFrame",
      active: "ui/formal-v1/actions/bugang-active/spriteFrame",
      disabled: "ui/formal-v1/actions/bugang-disabled/spriteFrame",
    },
  },
  tools: {
    shuffle: "ui/formal-v1/tools/shuffle-normal/spriteFrame",
    undo: "ui/formal-v1/tools/undo-normal/spriteFrame",
    hint: "ui/formal-v1/tools/hint-normal/spriteFrame",
    buff: "ui/formal-v1/tools/buff-normal/spriteFrame",
    counter: "ui/formal-v1/tools/counter-normal/spriteFrame",
  },
  cards: {
    combo: "ui/formal-v1/cards/reward-combo/spriteFrame",
    score: "ui/formal-v1/cards/reward-score/spriteFrame",
    slot: "ui/formal-v1/cards/reward-slot/spriteFrame",
    wind: "ui/formal-v1/cards/wind-template/spriteFrame",
  },
  modals: {
    comboChoice: "ui/formal-v1/modals/combo-choice/spriteFrame",
    pause: "ui/formal-v1/modals/pause/spriteFrame",
    settings: "ui/formal-v1/modals/settings/spriteFrame",
    settlement: "ui/formal-v1/modals/settlement/spriteFrame",
    tutorial: "ui/formal-v1/modals/tutorial/spriteFrame",
  },
} as const;

export function getHulebuFormalMahjongSpritePath(fileName: string): string {
  return `ui/formal-v1/tiles/mahjong/${fileName}/spriteFrame`;
}
