export const HULEBU_V3_UI_VERSION = "hulebu-component-pack-v3";

const base = "ui/hulebu";
const sprite = (path: string): string => `${base}/${path}/spriteFrame`;

export const HULEBU_V3_UI_SPRITES = {
  backgrounds: {
    titleLobby: sprite("backgrounds/title-lobby"),
    map: sprite("backgrounds/map"),
    gameplay: sprite("backgrounds/gameplay"),
    result: sprite("backgrounds/result"),
    loading: sprite("backgrounds/loading"),
  },
  actions: {
    chi: sprite("component-pack-v3/actions/action-chi"),
    peng: sprite("component-pack-v3/actions/action-peng"),
    gang: sprite("component-pack-v3/actions/action-gang"),
    bugang: sprite("component-pack-v3/actions/action-bugang"),
    hu: sprite("component-pack-v3/actions/action-hu"),
  },
  buttons: {
    confirm: sprite("component-pack-v3/buttons/btn-confirm"),
    cancel: sprite("component-pack-v3/buttons/btn-cancel"),
    close: sprite("component-pack-v3/buttons/btn-close"),
    back: sprite("component-pack-v3/buttons/btn-back"),
  },
  hud: {
    level: sprite("component-pack-v3/hud/hud-level"),
    score: sprite("component-pack-v3/hud/hud-score"),
    remaining: sprite("component-pack-v3/hud/hud-remaining"),
    boss: sprite("component-pack-v3/hud/hud-boss"),
    bossHealth: sprite("component-pack-v3/hud/boss-health-bar"),
    counterPanel: sprite("component-pack-v3/hud/counter-panel"),
    counterToggle: sprite("component-pack-v3/hud/counter-toggle"),
    currency: sprite("component-pack-v3/hud/currency-plaque"),
    starProgress: sprite("component-pack-v3/hud/star-progress"),
  },
  panels: {
    comboChoice: sprite("component-pack-v3/panels/combo-choice-panel"),
    discardRescue: sprite("component-pack-v3/panels/discard-rescue-panel"),
    pause: sprite("component-pack-v3/panels/pause-panel"),
    settings: sprite("component-pack-v3/panels/settings-panel"),
    resultStats: sprite("component-pack-v3/panels/result-stats-panel"),
    bottomNav: sprite("component-pack-v3/panels/bottom-nav-frame"),
  },
  cards: {
    archetype: sprite("component-pack-v3/cards/archetype-card"),
    event: sprite("component-pack-v3/cards/event-card"),
    reward: sprite("component-pack-v3/cards/reward-card"),
    upgrade: sprite("component-pack-v3/cards/upgrade-card"),
    mode: sprite("component-pack-v3/cards/mode-card"),
  },
  map: {
    chapterPlaque: sprite("component-pack-v3/map/chapter-plaque"),
    levelNode: sprite("component-pack-v3/map/level-node"),
    normal: sprite("component-pack-v3/map/node-normal"),
    event: sprite("component-pack-v3/map/node-event"),
    reward: sprite("component-pack-v3/map/node-reward"),
    boss: sprite("component-pack-v3/map/node-boss"),
    pathSegment: sprite("component-pack-v3/map/path-segment"),
  },
  modes: {
    mainline: sprite("component-pack-v3/modes/mode-mainline"),
    endless: sprite("component-pack-v3/modes/mode-endless"),
    daily: sprite("component-pack-v3/modes/mode-daily"),
    advanced: sprite("component-pack-v3/modes/mode-advanced"),
  },
  icons: {
    coin: sprite("component-pack-v3/icons/icon-coin"),
    star: sprite("component-pack-v3/icons/icon-star"),
    amulet: sprite("component-pack-v3/icons/icon-amulet"),
  },
  playfield: {
    handSlot: sprite("component-pack-v3/playfield/hand-slot"),
    meldPool: sprite("component-pack-v3/playfield/meld-pool-panel"),
    looseDropZone: sprite("component-pack-v3/playfield/loose-drop-zone"),
  },
  tools: {
    shuffle: sprite("component-pack-v3/tools/tool-shuffle"),
    undo: sprite("component-pack-v3/tools/tool-undo"),
    vision: sprite("component-pack-v3/tools/tool-vision"),
    discard: sprite("component-pack-v3/tools/tool-discard"),
  },
  mascot: {
    idle: sprite("component-pack-v3/mascot/mascot-idle"),
    happy: sprite("component-pack-v3/mascot/mascot-happy"),
    think: sprite("component-pack-v3/mascot/mascot-think"),
    failed: sprite("component-pack-v3/mascot/mascot-failed"),
    guide: sprite("component-pack-v3/mascot/mascot-guide"),
    avatarFrame: sprite("component-pack-v3/mascot/avatar-frame"),
  },
  misc: {
    titleBrand: sprite("component-pack-v3/misc/title-brand"),
    toast: sprite("component-pack-v3/misc/toast-banner"),
    rewardTag: sprite("component-pack-v3/misc/tag-reward"),
    riskTag: sprite("component-pack-v3/misc/tag-risk"),
    victorySeal: sprite("component-pack-v3/misc/victory-seal"),
    failureSeal: sprite("component-pack-v3/misc/failure-seal"),
    tutorialFrame: sprite("component-pack-v3/misc/tutorial-highlight-frame"),
  },
} as const;

export function getHulebuV3TileSpritePath(fileName: string): string {
  return sprite(`tiles-v3/${fileName}`);
}
