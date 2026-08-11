export const HULEBU_META_FLOW_UI_VERSION = "hulebu-meta-flow-components-v1";

const base = "ui/formal-v1/meta-flow";
const sprite = (path: string): string => `${base}/${path}/spriteFrame`;

export const HULEBU_META_FLOW_UI = {
  common: {
    primaryButton: sprite("common/button-primary-blank"),
    secondaryButton: sprite("common/button-secondary-blank"),
    notePanel: sprite("common/note-panel-blank"),
  },
  title: {
    brandPlaque: sprite("title/title-brand-plaque"),
    jadeSeal: sprite("title/title-jade-seal"),
  },
  lobby: {
    avatarFrame: sprite("lobby/avatar-frame"),
    currencyPlaque: sprite("lobby/currency-plaque"),
    continuePanel: sprite("lobby/continue-panel"),
    progressTrack: sprite("lobby/progress-track"),
    mainEntry: sprite("lobby/entry-main-journey"),
    modesEntry: sprite("lobby/entry-modes"),
    collectionEntry: sprite("lobby/entry-collection"),
    growthEntry: sprite("lobby/entry-growth"),
    bottomNav: sprite("lobby/bottom-nav-frame"),
  },
  modes: {
    entryPanel: sprite("modes/mode-entry-panel"),
    stateTag: sprite("modes/mode-state-tag"),
    mainIcon: sprite("modes/icon-main"),
    endlessIcon: sprite("modes/icon-endless"),
    dailyIcon: sprite("modes/icon-daily"),
    advancedIcon: sprite("modes/icon-advanced"),
    collectionIcon: sprite("modes/icon-collection"),
  },
  map: {
    chapterPlaque: sprite("map/chapter-plaque"),
    starProgress: sprite("map/star-progress-plaque"),
    chapterSwitch: sprite("map/chapter-switch-frame"),
    pathSegment: sprite("map/path-segment-curved"),
    nodeNormal: sprite("map/node-normal"),
    nodeCurrent: sprite("map/node-current"),
    nodeLocked: sprite("map/node-locked"),
    nodeBoss: sprite("map/node-boss"),
    starEmpty: sprite("map/star-empty"),
    starFilled: sprite("map/star-filled"),
  },
  result: {
    victorySeal: sprite("result/seal-victory"),
    failureSeal: sprite("result/seal-failure"),
    victoryTitle: sprite("result/title-plaque-victory"),
    failureTitle: sprite("result/title-plaque-failure"),
    statPlaque: sprite("result/stat-plaque"),
    suggestionPanel: sprite("result/suggestion-panel"),
    unlockRibbon: sprite("result/unlock-ribbon"),
    primaryButton: sprite("result/button-primary"),
    secondaryButton: sprite("result/button-secondary"),
  },
} as const;

export type HulebuMetaFlowSpritePath =
  typeof HULEBU_META_FLOW_UI[keyof typeof HULEBU_META_FLOW_UI];
