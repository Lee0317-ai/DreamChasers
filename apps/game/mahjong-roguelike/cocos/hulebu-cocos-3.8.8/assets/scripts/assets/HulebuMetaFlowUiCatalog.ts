import { HULEBU_V3_UI_SPRITES, HULEBU_V3_UI_VERSION } from "./HulebuV3UiCatalog";

export const HULEBU_META_FLOW_UI_VERSION = HULEBU_V3_UI_VERSION;

export const HULEBU_META_FLOW_UI = {
  common: {
    primaryButton: HULEBU_V3_UI_SPRITES.buttons.confirm,
    secondaryButton: HULEBU_V3_UI_SPRITES.buttons.cancel,
    notePanel: HULEBU_V3_UI_SPRITES.misc.toast,
  },
  title: {
    brandPlaque: HULEBU_V3_UI_SPRITES.misc.titleBrand,
    jadeSeal: HULEBU_V3_UI_SPRITES.icons.amulet,
  },
  lobby: {
    avatarFrame: HULEBU_V3_UI_SPRITES.mascot.avatarFrame,
    currencyPlaque: HULEBU_V3_UI_SPRITES.hud.currency,
    continuePanel: HULEBU_V3_UI_SPRITES.cards.mode,
    progressTrack: HULEBU_V3_UI_SPRITES.hud.starProgress,
    mainEntry: HULEBU_V3_UI_SPRITES.cards.mode,
    modesEntry: HULEBU_V3_UI_SPRITES.cards.mode,
    collectionEntry: HULEBU_V3_UI_SPRITES.cards.mode,
    growthEntry: HULEBU_V3_UI_SPRITES.cards.mode,
    bottomNav: HULEBU_V3_UI_SPRITES.panels.bottomNav,
  },
  modes: {
    entryPanel: HULEBU_V3_UI_SPRITES.cards.mode,
    stateTag: HULEBU_V3_UI_SPRITES.misc.rewardTag,
    mainIcon: HULEBU_V3_UI_SPRITES.modes.mainline,
    endlessIcon: HULEBU_V3_UI_SPRITES.modes.endless,
    dailyIcon: HULEBU_V3_UI_SPRITES.modes.daily,
    advancedIcon: HULEBU_V3_UI_SPRITES.modes.advanced,
    collectionIcon: HULEBU_V3_UI_SPRITES.icons.star,
  },
  map: {
    chapterPlaque: HULEBU_V3_UI_SPRITES.map.chapterPlaque,
    starProgress: HULEBU_V3_UI_SPRITES.hud.starProgress,
    chapterSwitch: HULEBU_V3_UI_SPRITES.map.chapterPlaque,
    pathSegment: HULEBU_V3_UI_SPRITES.map.pathSegment,
    nodeNormal: HULEBU_V3_UI_SPRITES.map.normal,
    nodeCurrent: HULEBU_V3_UI_SPRITES.map.reward,
    nodeLocked: HULEBU_V3_UI_SPRITES.map.levelNode,
    nodeBoss: HULEBU_V3_UI_SPRITES.map.boss,
    starEmpty: HULEBU_V3_UI_SPRITES.icons.star,
    starFilled: HULEBU_V3_UI_SPRITES.icons.star,
  },
  result: {
    victorySeal: HULEBU_V3_UI_SPRITES.misc.victorySeal,
    failureSeal: HULEBU_V3_UI_SPRITES.misc.failureSeal,
    victoryTitle: HULEBU_V3_UI_SPRITES.misc.toast,
    failureTitle: HULEBU_V3_UI_SPRITES.misc.toast,
    statPlaque: HULEBU_V3_UI_SPRITES.panels.resultStats,
    suggestionPanel: HULEBU_V3_UI_SPRITES.misc.toast,
    unlockRibbon: HULEBU_V3_UI_SPRITES.misc.rewardTag,
    primaryButton: HULEBU_V3_UI_SPRITES.buttons.confirm,
    secondaryButton: HULEBU_V3_UI_SPRITES.buttons.cancel,
  },
} as const;

export type HulebuMetaFlowSpritePath =
  typeof HULEBU_META_FLOW_UI[keyof typeof HULEBU_META_FLOW_UI];
