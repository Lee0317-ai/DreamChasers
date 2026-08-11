import { _decorator, BlockInputEvents, Button, Camera, Canvas, Color, Component, EventMouse, EventTouch, Graphics, input, Input, Label, Layers, Node, resources, Sprite, SpriteFrame, sys, UITransform, Vec3 } from "cc";
import { DEBUG } from "cc/env";
import { BoardLayerBinder } from "./BoardLayerBinder";
import { ComboBarBinder } from "./ComboBarBinder";
import { HudBinder } from "./HudBinder";
import { MeldRiverLayerBinder } from "./MeldRiverLayerBinder";
import { SlotLayerBinder } from "./SlotLayerBinder";
import { HulebuTileSpriteCatalog } from "./assets/HulebuTileSpriteCatalog";
import { safeApplySpriteFrame } from "./utils/HulebuSpriteSafety";
import { HULEBU_FORMAL_UI_SPRITES } from "./assets/HulebuFormalUiCatalog";
import { resolveHulebuPortraitZones } from "./bootstrap/HulebuPortraitLayout";
import { GameCoordinator, type CoordinatorResult } from "./application/GameCoordinator";
import { ContentRepository, HULEBU_LEGACY_CONTENT_SOURCE } from "./content/ContentRepository";
import { GameSession } from "./domain/GameSession";
import {
  RunStateMachine,
  type PendingComboContext,
  type RunPhase,
  type RunSnapshot,
} from "./domain/RunStateMachine";
import { SaveService, type StoragePort } from "./persistence/SaveService";
import {
  createHulebuAdvancedRunProfile,
  createHulebuDailyRunProfile,
  getHulebuDailyMutatorProfile,
  getHulebuAdvancedAbilityChoices,
  getHulebuAdvancedRunPressureConfig,
  getHulebuRewardChoicesForRun,
  getHulebuSpecialEventConfig,
  getHulebuSpecialEventChoices,
  getHulebuLevelIndexForRunOrder,
  HULEBU_EVENT_LEVEL_ORDERS,
  HULEBU_RUN_ARCHETYPES,
  HULEBU_MAINLINE_RUN_PROFILE,
  HULEBU_REWARD_LABELS,
  HULEBU_REWARD_LEVEL_ORDERS,
  HULEBU_SPECIAL_EVENT_DANGER_LABELS,
  HULEBU_SPECIAL_EVENT_LABELS,
  HULEBU_SPECIAL_EVENT_RARITY_LABELS,
  shouldCompleteHulebuRunAtOrder,
  type HulebuAdvancedAbilityConfig,
  type HulebuAdvancedRunTier,
  type HulebuRunArchetypeId,
  type HulebuRunProfile,
  type HulebuRuntimeLevelConfig,
} from "./config/HulebuLevelConfig";
import {
  HulebuRuntimeState,
  applyHulebuRewardToRunState,
  applyHulebuSpecialEventToLevelState,
  assertValidHulebuRuntimeSnapshot,
  createHulebuLevelModifierState,
  createHulebuMetaUpgradeState,
  createHulebuRunArchetypeState,
  createHulebuRunRewardState,
  mergeHulebuLevelModifierStates,
  normalizeHulebuRuntimeSnapshot,
  type HulebuLevelModifierState,
  type HulebuMetaUpgradeState,
  type HulebuRunArchetypeState,
  type HulebuRunRewardState,
  type HulebuRuntimeComboCandidateOption,
  type HulebuRuntimeSnapshot,
} from "./runtime/HulebuRuntimeState";
import {
  centerLayoutX,
  centerLayoutY,
  createHulebuSampleSceneModelForLayout,
  resolveHulebuRuntimeLayout,
  scaleLayoutValue,
} from "./bootstrap/HulebuSampleSceneModel";
import type { HulebuLayoutSize } from "./bootstrap/HulebuSampleSceneModel";
import type {
  HulebuCocosSceneModel,
  HulebuComboType,
  HulebuHudModel,
  HulebuTileCounterItemModel,
} from "./contracts/HulebuSceneModel";

const { ccclass, property } = _decorator;
type RuntimeLayout = Required<HulebuLayoutSize>;
type HulebuGamePhase = "lobby" | "meta" | "collection" | "advanced" | "advancedAbility" | "playing" | "cleared" | "reward" | "event" | "archetype";
type HulebuResumableRunPhase = "playing" | "cleared" | "reward" | "event" | "advancedAbility" | "archetype" | "settlement";
type HulebuMetaUpgradeAxis = keyof HulebuMetaUpgradeState;
type HulebuAccountSyncState = "local" | "syncing" | "ready" | "guest" | "error";
type HulebuAchievementId =
  | "mainline-first-clear"
  | "boss-hulebu-king"
  | "endless-first-step"
  | "endless-layer-25"
  | "daily-first-checkin"
  | "daily-clear"
  | "upgrade-first-buy"
  | "ascension-west-clear";

const RUNTIME_CAMERA_NAME = "RuntimeCamera";
const SHELL_ROOT_NAME = "VisualShellRoot";
const TOOL_OVERLAY_ROOT_NAME = "ToolOverlayRoot";
const CAMERA_Z = 1000;
const TABLE_FELT_FILL = new Color(33, 88, 69, 255);
const TABLE_FELT_SHADOW = new Color(16, 49, 41, 255);
const TABLE_RIM_FILL = new Color(92, 57, 36, 255);
const PLAQUE_FILL = new Color(248, 229, 191, 255);
const PLAQUE_STROKE = new Color(176, 126, 67, 255);
const PLAQUE_TEXT = new Color(70, 42, 24, 255);
const JADE_FILL = new Color(42, 134, 103, 255);
const WOOD_FILL = new Color(99, 59, 35, 255);
const WOOD_STROKE = new Color(177, 116, 65, 255);
const TOOL_FILL = new Color(49, 116, 87, 255);
const OVERLAY_BACKDROP = new Color(10, 25, 22, 220);
const REWARD_CHOICE_CARD_WIDTH = 106;
const REWARD_CHOICE_CARD_HEIGHT = 120;
const REWARD_CHOICE_CARD_GAP = 112;
const TOOL_BUTTON_SPRITES: Record<string, string> = {
  ToolButton_Wash: HULEBU_FORMAL_UI_SPRITES.tools.shuffle,
  ToolButton_Undo: HULEBU_FORMAL_UI_SPRITES.tools.undo,
  ToolButton_Hint: HULEBU_FORMAL_UI_SPRITES.tools.hint,
};
const TOP_PLAQUE_SPRITES: Record<string, string> = {
  LevelPlaque: HULEBU_FORMAL_UI_SPRITES.hud.levelBadge,
  ScorePlaque: HULEBU_FORMAL_UI_SPRITES.hud.scoreBadge,
  ProgressPlaque: HULEBU_FORMAL_UI_SPRITES.hud.tileCounter,
  CounterPlaque: HULEBU_FORMAL_UI_SPRITES.hud.tileCounter,
};
const HULEBU_SCENE_BACKGROUND_SPRITE = HULEBU_FORMAL_UI_SPRITES.background;
const OVERLAY_PANEL_BG_SPRITE = HULEBU_FORMAL_UI_SPRITES.modals.comboChoice;
const CLEAR_OVERLAY_PANEL_BG_SPRITE = HULEBU_FORMAL_UI_SPRITES.modals.settlement;
const REWARD_CARD_SPRITES: Record<string, string> = {
  reserve_plus_1: HULEBU_FORMAL_UI_SPRITES.cards.slot,
  advanced_south_stable_table: HULEBU_FORMAL_UI_SPRITES.cards.slot,
  advanced_west_tail_gate: HULEBU_FORMAL_UI_SPRITES.cards.slot,
  advanced_north_stable_life: HULEBU_FORMAL_UI_SPRITES.cards.slot,
  gang_score_plus_25: HULEBU_FORMAL_UI_SPRITES.cards.score,
  chi_score_plus_8: HULEBU_FORMAL_UI_SPRITES.cards.score,
  coin_plus_20: HULEBU_FORMAL_UI_SPRITES.cards.score,
  peng_score_plus_10: HULEBU_FORMAL_UI_SPRITES.cards.score,
  advanced_east_flow: HULEBU_FORMAL_UI_SPRITES.cards.score,
  advanced_east_probe: HULEBU_FORMAL_UI_SPRITES.cards.combo,
  first_protect_shield: HULEBU_FORMAL_UI_SPRITES.cards.combo,
  shield_plus_1: HULEBU_FORMAL_UI_SPRITES.cards.combo,
  undo_plus_1: HULEBU_FORMAL_UI_SPRITES.cards.combo,
  vision_plus_1: HULEBU_FORMAL_UI_SPRITES.cards.combo,
  shuffle_plus_1: HULEBU_FORMAL_UI_SPRITES.cards.combo,
  advanced_south_river_guard: HULEBU_FORMAL_UI_SPRITES.cards.combo,
  advanced_west_trial_audit: HULEBU_FORMAL_UI_SPRITES.cards.combo,
  advanced_north_kong_tide: HULEBU_FORMAL_UI_SPRITES.cards.combo,
};
const HULEBU_META_UPGRADE_OPTIONS: Array<{ axis: HulebuMetaUpgradeAxis; label: string; step: number }> = [
  { axis: "reserveBonus", label: "备用槽", step: 1 },
  { axis: "shieldBonus", label: "护符", step: 1 },
  { axis: "toolBonus", label: "工具", step: 1 },
  { axis: "riverBonus", label: "牌河", step: 1 },
  { axis: "startingCoins", label: "铜钱", step: 10 },
  { axis: "visionBonus", label: "看山", step: 1 },
];
const HULEBU_META_INITIAL_COINS = 200;
const HULEBU_RUN_COMPLETE_META_COIN_REWARD = 120;
const HULEBU_META_UPGRADE_COSTS: Record<HulebuMetaUpgradeAxis, number[]> = {
  reserveBonus: [80, 240],
  shieldBonus: [120, 260, 420],
  toolBonus: [100, 220, 360],
  riverBonus: [90, 210, 360],
  startingCoins: [70, 160, 300],
  visionBonus: [80, 180, 320],
};
const HULEBU_META_UPGRADE_MAX_LEVELS: Record<HulebuMetaUpgradeAxis, number> = {
  reserveBonus: HULEBU_META_UPGRADE_COSTS.reserveBonus.length,
  shieldBonus: HULEBU_META_UPGRADE_COSTS.shieldBonus.length,
  toolBonus: HULEBU_META_UPGRADE_COSTS.toolBonus.length,
  riverBonus: HULEBU_META_UPGRADE_COSTS.riverBonus.length,
  startingCoins: HULEBU_META_UPGRADE_COSTS.startingCoins.length,
  visionBonus: HULEBU_META_UPGRADE_COSTS.visionBonus.length,
};
const HULEBU_ACTIVE_RUN_STORAGE_KEY = "hulebu-cocos-active-run";
const HULEBU_LAST_SETTLEMENT_STORAGE_KEY = "hulebu-cocos-last-settlement";
const HULEBU_META_PROGRESS_STORAGE_KEY = "hulebu-cocos-meta-progress";
const HULEBU_META_PROFILE_STORAGE_KEY = "hulebu-cocos-meta-profile";
const HULEBU_ACHIEVEMENTS_STORAGE_KEY = "hulebu-cocos-achievements";
const HULEBU_ACCOUNT_PROGRESS_ENDPOINT = "/api/games/hulebu/progress";
const HULEBU_BOARD_REVISION = "overlap-eight-percent-2026-08-11";
const HULEBU_ACHIEVEMENTS: Array<{ id: HulebuAchievementId; title: string; description: string; hint: string }> = [
  { id: "mainline-first-clear", title: "主线首通", description: "完成一轮主线通关。", hint: "把 20 关主线打穿一次。" },
  { id: "boss-hulebu-king", title: "胡了卜王", description: "击破第 20 关终章 Boss。", hint: "在主线终章拿下胡了卜王。" },
  { id: "endless-first-step", title: "无尽起步", description: "首次进入无尽牌山。", hint: "把无尽面板点开并打到第 21 层起步。" },
  { id: "endless-layer-25", title: "冲到 25 层", description: "无尽最高层达到第 25 层。", hint: "继续往后冲到第 25 层。" },
  { id: "daily-first-checkin", title: "每日打卡", description: "第一次挑战每日牌局。", hint: "今天先开一局每日。" },
  { id: "daily-clear", title: "每日完成", description: "任意一天完成过每日牌局。", hint: "把当天的每日打穿一次。" },
  { id: "upgrade-first-buy", title: "第一次升级", description: "买下任意一项局外升级。", hint: "先花一次铜钱。" },
  { id: "ascension-west-clear", title: "西风立住", description: "把高阶推进到西风场并完成过结算。", hint: "先把高阶周目推进到第三档。" },
];

interface HulebuActiveRunSnapshot {
  boardRevision: string;
  runProfile: HulebuRunProfile;
  pendingRunProfile: HulebuRunProfile | null;
  currentDisplayLevelOrder: number;
  resumablePhase: HulebuResumableRunPhase;
  updatedAt: string;
  runRewards: HulebuRunRewardState;
  metaUpgrades: HulebuMetaUpgradeState;
  metaCoins: number;
  runArchetypeId: HulebuRunArchetypeId;
  selectedAdvancedAbilityId: string | null;
  eventSeenLevelOrders: number[];
  runtimeSnapshot: HulebuRuntimeSnapshot | null;
  coordinatorSnapshot: RunSnapshot;
}

interface HulebuSettlementSnapshot {
  runProfile: HulebuRunProfile;
  reachedLevelOrder: number;
  metaCoinsEarned: number;
  pickedRewards: number;
  summary: string;
}

interface HulebuMetaProgressSnapshot {
  bestMainlineLevel: number;
  bestEndlessLayer: number;
  dailyBestLevels: Record<string, number>;
  dailyStreak: number;
  lastDailySeed: string | null;
  bestAdvancedTier: HulebuAdvancedRunTier | null;
}

interface HulebuMetaProfileSnapshot {
  metaCoins: number;
  metaUpgrades: HulebuMetaUpgradeState;
}

type HulebuAchievementSnapshot = Partial<Record<HulebuAchievementId, string>>;

interface HulebuAccountProgressRecord {
  bankedCoins: number;
  bestEndlessLayer: number;
  bestAscensionLevel: number;
  dailyBestLevels: Record<string, number>;
  dailyStreak: number;
  lastDailySeed: string | null;
  achievements: Record<string, string>;
  upgrades: Record<string, number>;
  activeRun: Record<string, unknown> | null;
}

@ccclass("GameSceneController")
export class GameSceneController extends Component {
  @property(BoardLayerBinder)
  boardLayer: BoardLayerBinder | null = null;

  @property(SlotLayerBinder)
  slotLayer: SlotLayerBinder | null = null;

  @property(ComboBarBinder)
  comboBar: ComboBarBinder | null = null;

  @property(MeldRiverLayerBinder)
  meldRiverLayer: MeldRiverLayerBinder | null = null;

  @property(HudBinder)
  hud: HudBinder | null = null;

  @property(Node)
  rewardOverlay: Node | null = null;

  @property
  autoLoadSampleScene = true;

  @property
  loadConfiguredLevelOnStart = true;

  private latestSceneModel: HulebuCocosSceneModel | null = null;
  private latestLayout: RuntimeLayout | null = null;
  private runtimeState: HulebuRuntimeState | null = null;
  private runStateMachine = new RunStateMachine("bossIntro");
  private gameCoordinator = new GameCoordinator(this.runStateMachine);
  private readonly contentRepository = new ContentRepository(
    HULEBU_LEGACY_CONTENT_SOURCE,
    1,
    [HULEBU_LEGACY_CONTENT_SOURCE.manifest.contentVersion],
  );
  private readonly activeRunStorage: StoragePort = {
    getItem: (key) => sys.localStorage.getItem(key),
    setItem: (key, value) => sys.localStorage.setItem(key, value),
    removeItem: (key) => sys.localStorage.removeItem(key),
  };
  private readonly activeRunSaveService: SaveService<HulebuActiveRunSnapshot> = this.createActiveRunSaveService(this.activeRunStorage);
  private readonly tileSpriteCatalog = new HulebuTileSpriteCatalog();
  private readonly counterTouchEndHandler = (event: EventTouch): void => this.handleCounterInputEnd(event.getUILocation());
  private readonly counterMouseUpHandler = (event: EventMouse): void => this.handleCounterInputEnd(event.getUILocation());
  private counterExpanded = false;
  private lastCounterToggleAt = 0;
  private currentLevelIndex = 0;
  private currentDisplayLevelOrder = 1;
  private runProfile: HulebuRunProfile = HULEBU_MAINLINE_RUN_PROFILE;
  private gamePhase: HulebuGamePhase = "playing";
  private pendingRewardLevelIndex: number | null = null;
  private pendingEventLevelIndex: number | null = null;
  private pendingRunProfile: HulebuRunProfile | null = null;
  private selectedAdvancedAbility: HulebuAdvancedAbilityConfig | null = null;
  private readonly eventSeenLevelOrders = new Set<number>();
  private pendingComboChoice: { combo: HulebuComboType; options: HulebuRuntimeComboCandidateOption[] } | null = null;
  private runRewards: HulebuRunRewardState = createHulebuRunRewardState();
  private levelEventModifiers: HulebuLevelModifierState = createHulebuLevelModifierState();
  private metaUpgrades: HulebuMetaUpgradeState = createHulebuMetaUpgradeState();
  private metaCoins = HULEBU_META_INITIAL_COINS;
  private runArchetype: HulebuRunArchetypeState = createHulebuRunArchetypeState();
  private activeRunSnapshot: HulebuActiveRunSnapshot | null = null;
  private lastSettlementSnapshot: HulebuSettlementSnapshot | null = null;
  private metaProgress: HulebuMetaProgressSnapshot = createDefaultMetaProgressSnapshot();
  private achievements: HulebuAchievementSnapshot = {};
  private accountSyncState: HulebuAccountSyncState = "local";
  private accountSyncMessage = "账号：当前使用本地档案";
  private accountSyncPromise: Promise<void> | null = null;
  private accountSyncTimer: ReturnType<typeof setTimeout> | null = null;
  private suppressAccountSyncPush = false;
  private activeRunStorageBlocked = false;

  private createActiveRunSaveService(storage: StoragePort): SaveService<HulebuActiveRunSnapshot> {
    return new SaveService({
      key: HULEBU_ACTIVE_RUN_STORAGE_KEY,
      storage,
      codec: {
        encode: (value) => value,
        decode: (value) => value,
      },
      validate: (value) => this.validateActiveRunSnapshot(value),
      canPersist: (value) => isPersistableRunPhase(value.coordinatorSnapshot.phase),
      schemaVersion: 1,
      contentVersion: HULEBU_LEGACY_CONTENT_SOURCE.manifest.contentVersion,
      migrations: {
        0: (value) => this.migrateLegacyActiveRunSnapshot(value),
      },
      now: () => new Date().toISOString(),
    });
  }

  private validateActiveRunSnapshot(value: unknown): HulebuActiveRunSnapshot {
    if (!value || typeof value !== "object") {
      throw new Error("Active run snapshot must be an object.");
    }

    const snapshot = value as Partial<HulebuActiveRunSnapshot>;
    if (snapshot.boardRevision !== HULEBU_BOARD_REVISION) {
      throw new Error("Active run snapshot has an incompatible board revision.");
    }
    if (!isHulebuRunProfile(snapshot.runProfile)
      || (snapshot.pendingRunProfile !== null && !isHulebuRunProfile(snapshot.pendingRunProfile))
      || typeof snapshot.currentDisplayLevelOrder !== "number"
      || !Number.isInteger(snapshot.currentDisplayLevelOrder)
      || snapshot.currentDisplayLevelOrder < 1) {
      throw new Error("Active run snapshot is missing its run profile or level order.");
    }
    if (!isResumableRunPhase(snapshot.resumablePhase)
      || typeof snapshot.updatedAt !== "string"
      || snapshot.updatedAt.length === 0
      || !HULEBU_RUN_ARCHETYPES.some((archetype) => archetype.id === snapshot.runArchetypeId)
      || (snapshot.selectedAdvancedAbilityId !== null && typeof snapshot.selectedAdvancedAbilityId !== "string")) {
      throw new Error("Active run snapshot has invalid run context.");
    }
    const knownRewardIds = new Set(this.contentRepository.manifest.rewardIds);
    validateRunRewardState(snapshot.runRewards, knownRewardIds);
    validateMetaUpgradeState(snapshot.metaUpgrades);
    if (!Number.isInteger(snapshot.metaCoins) || (snapshot.metaCoins ?? -1) < 0) {
      throw new Error("Active run snapshot has invalid meta coins.");
    }
    if (!Array.isArray(snapshot.eventSeenLevelOrders)
      || snapshot.eventSeenLevelOrders.some((levelOrder) => !Number.isInteger(levelOrder) || levelOrder < 1)
      || new Set(snapshot.eventSeenLevelOrders).size !== snapshot.eventSeenLevelOrders.length) {
      throw new Error("Active run snapshot has invalid event history.");
    }
    const effectiveProfile = snapshot.pendingRunProfile ?? snapshot.runProfile;
    if (snapshot.selectedAdvancedAbilityId !== null
      && !getHulebuAdvancedAbilityChoices(effectiveProfile).some(
        (choice) => choice.id === snapshot.selectedAdvancedAbilityId,
      )) {
      throw new Error("Active run snapshot has an unknown advanced ability.");
    }
    const requiresRetainedRuntime = (snapshot.resumablePhase === "reward" || snapshot.resumablePhase === "event")
      || snapshot.resumablePhase === "cleared";
    if (requiresRetainedRuntime && !snapshot.runtimeSnapshot) {
      throw new Error("Resumable flow requires a retained runtime snapshot.");
    }

    if (!snapshot.coordinatorSnapshot || typeof snapshot.coordinatorSnapshot !== "object") {
      throw new Error("Active run snapshot has an invalid coordinator snapshot.");
    }
    if (!isResumableCoordinatorPhase(snapshot.resumablePhase, snapshot.coordinatorSnapshot.phase)) {
      throw new Error("Active run snapshot phases do not match.");
    }

    const levelIndex = getHulebuLevelIndexForRunOrder(snapshot.runProfile, snapshot.currentDisplayLevelOrder);
    const boundedLevelIndex = Math.min(Math.max(0, levelIndex), this.contentRepository.getLevelCount() - 1);
    const levelConfig = this.contentRepository.createRuntimeLevel(
      boundedLevelIndex,
      snapshot.runProfile,
      snapshot.currentDisplayLevelOrder,
    );
    validateCoordinatorChoiceContext(
      snapshot.coordinatorSnapshot,
      snapshot.runProfile,
      snapshot.currentDisplayLevelOrder,
      snapshot.runArchetypeId!,
      levelConfig,
      this.contentRepository.getLevelCount(),
      knownRewardIds,
    );
    if (snapshot.runtimeSnapshot) {
      assertValidHulebuRuntimeSnapshot(
        levelConfig,
        snapshot.runtimeSnapshot,
        snapshot.runRewards,
        snapshot.metaUpgrades,
      );
    }

    let session: GameSession | null = null;
    if (snapshot.coordinatorSnapshot.sessionSnapshot) {
      if (!snapshot.runtimeSnapshot) {
        throw new Error("Coordinator session requires a matching runtime snapshot.");
      }
      const runtimeState = HulebuRuntimeState.fromSnapshot(
        levelConfig,
        snapshot.runtimeSnapshot,
        snapshot.runRewards,
        createHulebuLevelModifierState(),
        snapshot.metaUpgrades,
        createHulebuRunArchetypeState(snapshot.runArchetypeId!),
      );
      session = new GameSession(runtimeState, snapshot.coordinatorSnapshot.sessionSnapshot.revision);
    }
    GameCoordinator.restore(snapshot.coordinatorSnapshot, session);

    return value as HulebuActiveRunSnapshot;
  }

  private migrateLegacyActiveRunSnapshot(value: unknown): unknown {
    if (!value || typeof value !== "object") {
      return value;
    }

    const legacy = value as Partial<HulebuActiveRunSnapshot>;
    if (legacy.coordinatorSnapshot) {
      return value;
    }

    if (!isHulebuRunProfile(legacy.runProfile)) {
      throw new Error("Legacy active run snapshot has an invalid run profile.");
    }
    const resumablePhase = resolveResumableRunPhase(legacy.resumablePhase);
    const coordinatorPhase = resumablePhase === "cleared"
      ? "encounterCleared"
      : resumablePhase === "reward"
        ? "rewardChoice"
        : resumablePhase === "event"
          ? "eventChoice"
          : resumablePhase === "advancedAbility" || resumablePhase === "archetype"
            ? "bossIntro"
            : resumablePhase === "settlement"
              ? "settlement"
            : "playing.idle";
    const currentDisplayLevelOrder = typeof legacy.currentDisplayLevelOrder === "number"
      ? legacy.currentDisplayLevelOrder
      : 1;

    const runArchetypeId = HULEBU_RUN_ARCHETYPES.some((archetype) => archetype.id === legacy.runArchetypeId)
      ? legacy.runArchetypeId!
      : "peng";
    const levelIndex = getHulebuLevelIndexForRunOrder(legacy.runProfile, currentDisplayLevelOrder);
    const boundedLevelIndex = Math.min(Math.max(0, levelIndex), this.contentRepository.getLevelCount() - 1);
    const levelConfig = this.contentRepository.createRuntimeLevel(
      boundedLevelIndex,
      legacy.runProfile,
      currentDisplayLevelOrder,
    );
    const legacyTargetLevelOrder = currentDisplayLevelOrder + 1;
    const legacyTargetFlowLevelOrder = getFlowLevelOrderForSnapshot(
      legacy.runProfile,
      legacyTargetLevelOrder,
      this.contentRepository.getLevelCount(),
    );
    const runRewards = cloneRunRewardState(legacy.runRewards);
    const metaUpgrades = cloneMetaUpgradeState(legacy.metaUpgrades);
    let runtimeSnapshot: HulebuRuntimeSnapshot | null = null;
    if (legacy.runtimeSnapshot !== null && legacy.runtimeSnapshot !== undefined) {
      assertValidHulebuRuntimeSnapshot(levelConfig, legacy.runtimeSnapshot, runRewards, metaUpgrades);
      runtimeSnapshot = normalizeHulebuRuntimeSnapshot(
        levelConfig,
        legacy.runtimeSnapshot,
        runRewards,
        createHulebuLevelModifierState(),
        metaUpgrades,
        createHulebuRunArchetypeState(runArchetypeId),
      );
    }
    const rewardChoices = coordinatorPhase === "rewardChoice"
      ? getHulebuRewardChoicesForRun(legacy.runProfile, levelConfig)
      : [];
    const eventChoices = coordinatorPhase === "eventChoice"
      ? getHulebuSpecialEventChoices(legacyTargetFlowLevelOrder, legacy.runProfile, runArchetypeId)
        .map((choice) => choice.id)
      : [];
    const requiresSession = coordinatorPhase === "playing.idle" || coordinatorPhase === "encounterCleared";

    return {
      boardRevision: legacy.boardRevision,
      runProfile: legacy.runProfile,
      pendingRunProfile: isHulebuRunProfile(legacy.pendingRunProfile) ? legacy.pendingRunProfile : null,
      currentDisplayLevelOrder,
      resumablePhase,
      updatedAt: typeof legacy.updatedAt === "string" && legacy.updatedAt ? legacy.updatedAt : new Date().toISOString(),
      runRewards,
      metaUpgrades,
      metaCoins: typeof legacy.metaCoins === "number" ? legacy.metaCoins : HULEBU_META_INITIAL_COINS,
      runArchetypeId,
      selectedAdvancedAbilityId: typeof legacy.selectedAdvancedAbilityId === "string" ? legacy.selectedAdvancedAbilityId : null,
      eventSeenLevelOrders: Array.isArray(legacy.eventSeenLevelOrders)
        ? Array.from(new Set(legacy.eventSeenLevelOrders.filter((levelOrder) => Number.isInteger(levelOrder) && levelOrder > 0)))
        : [],
      runtimeSnapshot,
      coordinatorSnapshot: {
        schemaVersion: 1,
        phase: coordinatorPhase,
        sessionSnapshot: requiresSession && runtimeSnapshot
          ? {
              schemaVersion: 1,
              revision: 0,
              levelOrder: currentDisplayLevelOrder,
              status: coordinatorPhase === "encounterCleared" ? "cleared" : "playing",
              runtime: runtimeSnapshot,
            }
          : null,
        context: {
          targetLevelOrder: coordinatorPhase === "rewardChoice"
            ? legacyTargetLevelOrder
            : coordinatorPhase === "eventChoice"
              ? legacyTargetLevelOrder
              : null,
          rewardCandidateIds: rewardChoices,
          eventOptionIds: eventChoices,
          pendingCombo: null,
          pauseReturnPhase: null,
        },
      },
    };
  }

  start(): void {
    this.exposeBrowserDebugApi();
    const visibleSize = this.ensureCanvasHost();
    this.bindCounterInputEvents();
    this.latestLayout = visibleSize;
    this.ensureVisualShell(visibleSize);
    this.ensureLayerReferences();
    this.rewardOverlay?.setPosition(0, 0, 0);
    if (this.rewardOverlay) {
      this.rewardOverlay.active = false;
    }

    if (this.latestSceneModel) {
      this.applySceneModel(this.latestSceneModel);
      return;
    }

    if (this.loadConfiguredLevelOnStart) {
      this.activeRunSnapshot = this.loadActiveRunSnapshot();
      this.lastSettlementSnapshot = this.readLastSettlementSnapshot();
      this.metaProgress = this.readMetaProgressSnapshot();
      const metaProfile = this.readMetaProfileSnapshot();
      this.metaCoins = metaProfile.metaCoins;
      this.metaUpgrades = cloneMetaUpgradeState(metaProfile.metaUpgrades);
      this.achievements = this.readAchievementSnapshot();
      this.enterDefaultTutorialLevel();
      if (!this.activeRunStorageBlocked) {
        this.syncAccountProgressOnLobbyEntry();
      }
      return;
    }

    if (this.autoLoadSampleScene) {
      this.applySceneModel(createHulebuSampleSceneModelForLayout(visibleSize));
    }
  }

  onDestroy(): void {
    this.unbindCounterInputEvents();
  }

  applySceneModel(sceneModel: HulebuCocosSceneModel): void {
    this.exposeBrowserDebugApi();
    this.ensureLayerReferences();
    this.bindInputHandlers();
    this.latestSceneModel = sceneModel;
    this.boardLayer?.applyBoardNodes(sceneModel.boardNodes);
    this.slotLayer?.applySlotNodes(sceneModel.slotNodes, sceneModel.reserveNodes);
    this.meldRiverLayer?.applyMeldRiverNodes(sceneModel.openMeldNodes, sceneModel.riverNodes);
    this.comboBar?.applyComboControls(sceneModel.comboControls);
    this.applyShellHud(sceneModel.hud);
    if (this.hud) {
      this.hud.node.active = false;
    }
  }

  private exposeBrowserDebugApi(): void {
    if (!DEBUG || typeof window === "undefined") {
      return;
    }

    (globalThis as unknown as {
      __HULEBU_DEBUG__?: {
        getSceneModel: () => HulebuCocosSceneModel | null;
        getPhase: () => HulebuGamePhase;
        startMainlineRun: () => void;
        startLevel: (displayLevelOrder: number) => void;
        selectTile: (tileId: string) => void;
      };
    }).__HULEBU_DEBUG__ = {
      getSceneModel: () => this.latestSceneModel,
      getPhase: () => this.gamePhase,
      startMainlineRun: () => this.startMainlineRun(),
      startLevel: (displayLevelOrder: number) => this.startLevel(displayLevelOrder),
      selectTile: (tileId: string) => this.handleTileClick(tileId),
    };
  }

  selectTile(tileId: string): void {
    this.handleTileClick(tileId);
    console.log(`[Hulebu] select tile: ${tileId}`);
  }

  executeCombo(candidateKey: string | null): void {
    if (!candidateKey) {
      return;
    }

    const combo = candidateKey.split(":")[0] as HulebuComboType;
    this.handleComboClick(combo);
    console.log(`[Hulebu] execute combo: ${candidateKey}`);
  }

  pickReward(rewardId: string): void {
    const context = this.gameCoordinator.snapshot().context;
    if (this.gamePhase === "reward" && context.rewardCandidateIds.includes(rewardId)) {
      console.log(`[Hulebu] pick reward: ${rewardId}`);
      this.runRewards = applyHulebuRewardToRunState(this.runRewards, rewardId);
      this.startNextLevel(this.pendingRewardLevelIndex ?? this.currentLevelIndex + 1);
      return;
    }

    console.log(`[Hulebu] pick reward: ${rewardId}`);
  }

  pickSpecialEvent(eventId: string): void {
    const context = this.gameCoordinator.snapshot().context;
    if (this.gamePhase === "event" && context.eventOptionIds.includes(eventId)) {
      console.log(`[Hulebu] pick event: ${eventId}`);
      this.levelEventModifiers = applyHulebuSpecialEventToLevelState(createHulebuLevelModifierState(), eventId);
      const nextDisplayOrder = this.pendingEventLevelIndex ?? this.currentDisplayLevelOrder;
      this.eventSeenLevelOrders.add(nextDisplayOrder);
      this.startLevel(nextDisplayOrder);
      return;
    }

    console.log(`[Hulebu] pick event: ${eventId}`);
  }

  startMainlineRun(): void {
    this.startRunWithProfile(HULEBU_MAINLINE_RUN_PROFILE);
  }

  startEndlessRun(): void {
    this.startRunWithProfile({
      mode: "endless",
      displayName: "无尽",
      startOrder: 21,
    });
  }

  startDailyRun(dailySeed = this.getTodaySeed()): void {
    this.persistDailyParticipation(dailySeed);
    this.persistAchievements({ "daily-first-checkin": this.createAchievementTimestamp() });
    this.startRunWithProfile(createHulebuDailyRunProfile(dailySeed));
  }

  startAdvancedRun(tier: HulebuAdvancedRunTier): void {
    this.startRunWithProfile(createHulebuAdvancedRunProfile(tier));
  }

  applyMetaUpgrades(upgrades: Partial<HulebuMetaUpgradeState>): void {
    this.metaUpgrades = {
      ...this.metaUpgrades,
      ...upgrades,
    };
    this.persistMetaProfile();
  }

  selectRunArchetype(archetypeId: HulebuRunArchetypeId): void {
    this.runArchetype = createHulebuRunArchetypeState(archetypeId);
  }

  openMetaUpgradePanel(): void {
    this.showMetaUpgradeOverlay();
  }

  pickRunArchetype(archetypeId: HulebuRunArchetypeId): void {
    console.log(`[Hulebu] pick run archetype: ${archetypeId}`);
    this.completeRunArchetypeSelection(archetypeId);
  }

  pickAdvancedAbility(abilityId: string): void {
    console.log(`[Hulebu] pick advanced ability: ${abilityId}`);
    const profile = this.pendingRunProfile ?? this.runProfile;
    const ability = getHulebuAdvancedAbilityChoices(profile).find((choice) => choice.id === abilityId) ?? null;
    if (!ability) {
      return;
    }

    this.selectedAdvancedAbility = ability;
    this.gamePhase = "archetype";
    this.showRunArchetypeOverlay();
  }

  returnToLobby(): void {
    this.detachRuntimeState();
    this.pendingRunProfile = null;
    this.selectedAdvancedAbility = null;
    this.pendingRewardLevelIndex = null;
    this.pendingEventLevelIndex = null;
    this.activeRunSnapshot = this.loadActiveRunSnapshot();
    this.lastSettlementSnapshot = this.readLastSettlementSnapshot();
    this.metaProgress = this.readMetaProgressSnapshot();
    const metaProfile = this.readMetaProfileSnapshot();
    this.metaCoins = metaProfile.metaCoins;
    this.metaUpgrades = cloneMetaUpgradeState(metaProfile.metaUpgrades);
    this.achievements = this.readAchievementSnapshot();
    this.gamePhase = "lobby";
    this.showLobbyOverlay();
    if (!this.activeRunStorageBlocked) {
      this.syncAccountProgressOnLobbyEntry();
    }
  }

  private enterDefaultTutorialLevel(): void {
    if (this.activeRunStorageBlocked) {
      this.accountSyncState = "error";
      this.accountSyncMessage = "账号：本地进行中存档读取失败，请重试";
      this.gamePhase = "lobby";
      this.showLobbyOverlay();
      return;
    }
    if (this.activeRunSnapshot) {
      this.resumeActiveRun();
      return;
    }

    this.startLevel(1);
  }

  resumeActiveRun(): void {
    const snapshot = this.activeRunSnapshot ?? this.loadActiveRunSnapshot();
    if (!snapshot) {
      this.showLobbyOverlay();
      return;
    }

    this.metaUpgrades = cloneMetaUpgradeState(snapshot.metaUpgrades);
    this.metaCoins = snapshot.metaCoins;
    this.runRewards = cloneRunRewardState(snapshot.runRewards);
    this.runProfile = snapshot.runProfile;
    this.runArchetype = createHulebuRunArchetypeState(snapshot.runArchetypeId);
    const effectiveRunProfile = snapshot.pendingRunProfile ?? snapshot.runProfile;
    this.selectedAdvancedAbility = this.resolveAdvancedAbilityById(effectiveRunProfile, snapshot.selectedAdvancedAbilityId);
    this.eventSeenLevelOrders.clear();
    snapshot.eventSeenLevelOrders.forEach((levelOrder) => this.eventSeenLevelOrders.add(levelOrder));
    this.pendingRunProfile = snapshot.pendingRunProfile ? { ...snapshot.pendingRunProfile } : null;
    if (snapshot.resumablePhase === "settlement") {
      this.resumeSettlementPhase(snapshot);
      return;
    }
    if (snapshot.resumablePhase === "advancedAbility") {
      this.resumeAdvancedAbilityPhase(snapshot);
      return;
    }
    if (snapshot.resumablePhase === "archetype") {
      this.resumeArchetypePhase(snapshot);
      return;
    }
    if (snapshot.resumablePhase === "event") {
      this.resumeEventPhase(snapshot);
      return;
    }
    if (snapshot.resumablePhase === "reward") {
      this.resumeRewardPhase(snapshot);
      return;
    }
    if (snapshot.resumablePhase === "cleared") {
      this.resumeClearedPhase(snapshot);
      return;
    }
    if (snapshot.runtimeSnapshot) {
      this.resumeRuntimeSnapshot(snapshot);
      return;
    }
    this.startLevel(snapshot.currentDisplayLevelOrder);
  }

  private ensureLayerReferences(): void {
    this.boardLayer = this.boardLayer ?? this.findComponent("BoardRoot", BoardLayerBinder);
    this.slotLayer = this.slotLayer ?? this.findComponent("SlotRoot", SlotLayerBinder);
    this.meldRiverLayer = this.meldRiverLayer ?? this.ensureMeldRiverLayer();
    this.comboBar = this.comboBar ?? this.findComponent("ComboRoot", ComboBarBinder);
    this.hud = this.hud ?? this.findComponent("HudRoot", HudBinder);
    this.rewardOverlay = this.rewardOverlay ?? this.node.getChildByName("RewardOverlay");
  }

  private bindInputHandlers(): void {
    this.boardLayer?.setTileClickHandler((tileId) => this.handleTileClick(tileId));
    this.slotLayer?.setSlotClickHandler((slotIndex) => this.handleSlotClick(slotIndex));
    this.comboBar?.setComboClickHandler((combo) => this.handleComboClick(combo));
  }

  private ensureMeldRiverLayer(): MeldRiverLayerBinder {
    const root = this.ensureChild(this.node, "MeldRiverRoot");
    root.active = true;
    root.layer = this.node.layer;
    root.setPosition(0, 0, 0);
    const boardRoot = this.node.getChildByName("BoardRoot");
    if (boardRoot) {
      root.setSiblingIndex(Math.min(this.node.children.length - 1, boardRoot.getSiblingIndex() + 1));
    }
    return root.getComponent(MeldRiverLayerBinder) ?? root.addComponent(MeldRiverLayerBinder);
  }

  private handleTileClick(tileId: string): void {
    if (this.gamePhase !== "playing" || !this.runtimeState) {
      return;
    }

    this.applyCoordinatorResult(this.gameCoordinator.dispatch({ type: "tile.select", tileId }));
  }

  private handleComboClick(combo: HulebuComboType): void {
    if (this.gamePhase !== "playing") {
      return;
    }

    if (!this.runtimeState) {
      return;
    }

    if (this.runStateMachine.phase === "playing.comboChoosing" && this.pendingComboChoice?.combo === combo) {
      this.closeComboChoiceOverlay();
      return;
    }

    this.applyCoordinatorResult(this.gameCoordinator.dispatch({ type: "combo.execute", combo }));
  }

  private handleSlotClick(slotIndex: number): void {
    if (this.gamePhase !== "playing" || !this.runtimeState) {
      return;
    }

    this.applyCoordinatorResult(this.gameCoordinator.dispatch({ type: "slot.discard", slotIndex }));
  }

  private startDiscardSelection(): void {
    if (this.gamePhase !== "playing" || !this.runtimeState) {
      return;
    }

    this.applyCoordinatorResult(this.gameCoordinator.dispatch({ type: "tool.use", tool: "discard" }));
  }

  private useShuffleTool(): void {
    if (this.gamePhase !== "playing" || !this.runtimeState) {
      return;
    }

    this.applyCoordinatorResult(this.gameCoordinator.dispatch({ type: "tool.use", tool: "shuffle" }));
  }

  private useUndoTool(): void {
    if (this.gamePhase !== "playing" || !this.runtimeState) {
      return;
    }

    this.applyCoordinatorResult(this.gameCoordinator.dispatch({ type: "tool.use", tool: "undo" }));
  }

  private refreshRuntimeScene(): void {
    if (!this.runtimeState) {
      return;
    }

    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    this.applySceneModel(this.runtimeState.toSceneModel(layout));
  }

  private attachRuntimeState(runtimeState: HulebuRuntimeState, revision = 0): void {
    this.runtimeState = runtimeState;
    this.gameCoordinator.attachSession(new GameSession(runtimeState, revision));
  }

  private restoreCoordinatorState(snapshot: RunSnapshot, runtimeState: HulebuRuntimeState | null): void {
    this.runStateMachine = RunStateMachine.restore(snapshot.phase, snapshot.context.pauseReturnPhase);
    const session = runtimeState && snapshot.sessionSnapshot
      ? new GameSession(runtimeState, snapshot.sessionSnapshot.revision)
      : null;
    this.gameCoordinator = new GameCoordinator(this.runStateMachine, session);
    this.gameCoordinator.updateContext({
      targetLevelOrder: snapshot.context.targetLevelOrder,
      rewardCandidateIds: snapshot.context.rewardCandidateIds,
      eventOptionIds: snapshot.context.eventOptionIds,
      pendingCombo: snapshot.context.pendingCombo,
    });
    this.runtimeState = runtimeState;
  }

  private detachRuntimeState(): void {
    if (!this.runtimeState) {
      return;
    }
    this.prepareCoordinatorForDetach();
    this.gameCoordinator.detachSession();
    this.runtimeState = null;
  }

  private prepareCoordinatorForDetach(): void {
    if (this.runStateMachine.phase === "playing.comboChoosing"
      || this.runStateMachine.phase === "playing.discardChoosing") {
      this.requireRunTransition("playing.idle");
    }
    if (this.runStateMachine.phase === "playing.idle") {
      this.requireRunTransition("failed");
    }
  }

  private prepareCoordinatorForLevel(): void {
    if (this.runStateMachine.phase === "encounterCleared") {
      this.requireRunTransition("bossIntro");
    }
    if (this.runStateMachine.phase === "bossIntro"
      || this.runStateMachine.phase === "rewardChoice"
      || this.runStateMachine.phase === "eventChoice"
      || this.runStateMachine.phase === "settlement"
      || this.runStateMachine.phase === "failed") {
      if (this.runtimeState) {
        this.gameCoordinator.detachSession();
        this.runtimeState = null;
      }
      this.requireRunTransition("encounterIntro");
    }
    if (this.runStateMachine.phase === "encounterIntro") {
      this.requireRunTransition("playing.tileEntering");
      this.requireRunTransition("playing.idle");
    }
  }

  private requireRunTransition(phase: RunPhase): void {
    if (!this.runStateMachine.transition(phase)) {
      throw new Error(`Invalid Controller run transition: ${this.runStateMachine.phase} -> ${phase}.`);
    }
  }

  private applyCoordinatorResult(result: CoordinatorResult): void {
    let openedFlowOverlay = false;
    for (const event of result.events) {
      if (event.type === "combo.choice.required") {
        this.showComboChoiceOverlay(event.combo, [...event.candidates]);
        openedFlowOverlay = true;
      }
      if (event.type === "level.cleared") {
        this.gamePhase = "cleared";
        this.showClearOverlay();
        openedFlowOverlay = true;
      }
    }

    if (result.changed && result.snapshot && this.runtimeState) {
      this.refreshRuntimeScene();
    }
    if (openedFlowOverlay && this.rewardOverlay?.active) {
      this.rewardOverlay.setSiblingIndex(this.node.children.length - 1);
    }
    if (!openedFlowOverlay && result.accepted && result.phase === "playing.idle") {
      this.pendingComboChoice = null;
      this.hideFlowOverlay();
    }
    if (result.changed && result.persistable) {
      this.persistActiveRun();
    }
  }

  private startLevel(displayLevelOrder: number): void {
    const nextLevelIndex = getHulebuLevelIndexForRunOrder(this.runProfile, displayLevelOrder);
    const maxIndex = this.contentRepository.getLevelCount() - 1;
    this.currentLevelIndex = Math.min(Math.max(0, nextLevelIndex), maxIndex);
    this.currentDisplayLevelOrder = displayLevelOrder;
    this.gamePhase = "playing";
    this.pendingRewardLevelIndex = null;
    this.pendingEventLevelIndex = null;
    this.hideFlowOverlay();

    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    const levelModifiers = mergeHulebuLevelModifierStates(
      this.createAdvancedRunLevelModifiers(),
      this.levelEventModifiers,
    );
    this.prepareCoordinatorForLevel();
    const runtimeState = new HulebuRuntimeState(
      this.contentRepository.createRuntimeLevel(
        this.currentLevelIndex,
        this.runProfile,
        displayLevelOrder,
      ),
      this.runRewards,
      levelModifiers,
      this.metaUpgrades,
      this.runArchetype,
    );
    this.levelEventModifiers = createHulebuLevelModifierState();
    this.attachRuntimeState(runtimeState);
    this.ensureVisualShell(layout, this.runtimeState.getLevelOrder());
    this.applySceneModel(this.runtimeState.toSceneModel(layout));
    this.persistActiveRun();
  }

  private createAdvancedRunLevelModifiers(): HulebuLevelModifierState {
    const pressure = getHulebuAdvancedRunPressureConfig(this.runProfile);
    const modifiers = createHulebuLevelModifierState();
    if (!pressure && !this.selectedAdvancedAbility) {
      return modifiers;
    }

    if (pressure) {
      modifiers.activeEventIds.push(`advanced_${pressure.tier}`);
      modifiers.coinBonus += pressure.coinBonus;
      modifiers.toolBonus.shuffle += pressure.toolBonus.shuffle ?? 0;
      modifiers.toolBonus.undo += pressure.toolBonus.undo ?? 0;
      modifiers.toolBonus.discard += pressure.toolBonus.discard ?? 0;
      modifiers.toolBonus.vision += pressure.toolBonus.vision ?? 0;
      modifiers.toolLocks = { ...pressure.toolLocks };
    }

    if (this.selectedAdvancedAbility) {
      modifiers.activeEventIds.push(`ability_${this.selectedAdvancedAbility.id}`);
      modifiers.coinBonus += this.selectedAdvancedAbility.coinBonus;
      modifiers.toolBonus.shuffle += this.selectedAdvancedAbility.toolBonus.shuffle ?? 0;
      modifiers.toolBonus.undo += this.selectedAdvancedAbility.toolBonus.undo ?? 0;
      modifiers.toolBonus.discard += this.selectedAdvancedAbility.toolBonus.discard ?? 0;
      modifiers.toolBonus.vision += this.selectedAdvancedAbility.toolBonus.vision ?? 0;
      modifiers.toolLocks = {
        ...modifiers.toolLocks,
        ...this.selectedAdvancedAbility.toolLocks,
      };
    }

    return modifiers;
  }

  private startNextLevel(displayLevelOrder = this.currentDisplayLevelOrder + 1): void {
    if (shouldCompleteHulebuRunAtOrder(this.runProfile, displayLevelOrder)) {
      this.showRunCompleteOverlay();
      return;
    }

    const levelOrder = this.getDisplayLevelOrderForFlow(displayLevelOrder);
    if (HULEBU_EVENT_LEVEL_ORDERS.has(levelOrder) && !this.eventSeenLevelOrders.has(displayLevelOrder)) {
      this.pendingEventLevelIndex = displayLevelOrder;
      this.gamePhase = "event";
      this.showEventOverlay();
      return;
    }

    this.startLevel(displayLevelOrder);
  }

  private continueAfterClear(): void {
    if (this.gamePhase !== "cleared") {
      return;
    }

    if (this.runtimeState && HULEBU_REWARD_LEVEL_ORDERS.has(this.getDisplayLevelOrderForFlow())) {
      this.pendingRewardLevelIndex = this.currentDisplayLevelOrder + 1;
      this.gamePhase = "reward";
      this.showRewardOverlay();
      return;
    }

    this.startNextLevel();
  }

  private showClearOverlay(): void {
    this.gamePhase = "cleared";
    const overlay = this.prepareFlowOverlay();
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    const level = this.runtimeState?.getLevelConfig();
    const title = `${this.getRunModeLabel()}第 ${this.currentDisplayLevelOrder} 层通关`;
    const subtitle = level ? `${level.name} · ${level.subtitle}` : "牌山已清空";
    const score = stripHudPrefix(this.latestSceneModel?.hud.scoreText ?? "分 0", "分");

    this.drawOverlayPanel(overlay, layout, 320, 220, CLEAR_OVERLAY_PANEL_BG_SPRITE);
    this.writeOverlayLabel(overlay, "OverlayTitle", title, 20, new Color(35, 76, 57, 255), 0);
    this.writeOverlayLabel(overlay, "OverlayScore", `本层得分 ${score}`, 16, new Color(111, 69, 34, 255), -28);
    this.writeOverlayLabel(overlay, "OverlaySubtitle", subtitle, 12, new Color(111, 86, 58, 255), -51);
    this.createOverlayButton(overlay, "ContinueButton", "继续", 0, -84, () => this.continueAfterClear(), 142, 40);
  }

  private showRewardOverlay(): void {
    this.gamePhase = "reward";
    const rewardCandidateIds = this.getCurrentRewardChoices();
    if (this.runtimeState) {
      this.detachRuntimeState();
    }
    if (this.runStateMachine.phase === "encounterCleared") {
      this.requireRunTransition("rewardChoice");
    }
    this.gameCoordinator.updateContext({
      targetLevelOrder: this.pendingRewardLevelIndex,
      rewardCandidateIds,
      eventOptionIds: [],
    });
    this.persistActiveRun();
    this.renderRewardOverlay();
  }

  private renderRewardOverlay(): void {
    this.gamePhase = "reward";
    const overlay = this.prepareFlowOverlay();
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    this.drawOverlayPanel(overlay, layout, 368, 328);
    this.writeOverlayLabel(overlay, "OverlayTitle", "选择本局获得的奖励", 20, new Color(255, 246, 216, 255), 118);
    this.writeOverlayLabel(overlay, "OverlaySubtitle", "三选一后进入下一关", 14, new Color(232, 207, 166, 255), 88);
    this.drawRewardChoices(overlay);
  }

  private showEventOverlay(): void {
    this.gamePhase = "event";
    const targetLevelOrder = this.pendingEventLevelIndex ?? this.currentDisplayLevelOrder;
    const eventOptionIds = getHulebuSpecialEventChoices(
      this.getDisplayLevelOrderForFlow(targetLevelOrder),
      this.runProfile,
      this.runArchetype.archetypeId,
    ).map((choice) => choice.id);
    if (this.runtimeState) {
      this.detachRuntimeState();
    }
    if (this.runStateMachine.phase === "encounterCleared") {
      this.requireRunTransition("eventChoice");
    }
    this.gameCoordinator.updateContext({
      targetLevelOrder,
      rewardCandidateIds: [],
      eventOptionIds,
    });
    this.persistActiveRun();
    this.renderEventOverlay();
  }

  private renderEventOverlay(): void {
    this.gamePhase = "event";
    const overlay = this.prepareFlowOverlay();
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    const displayOrder = this.gameCoordinator.snapshot().context.targetLevelOrder
      ?? this.pendingEventLevelIndex
      ?? this.currentDisplayLevelOrder;
    const levelIndex = getHulebuLevelIndexForRunOrder(this.runProfile, displayOrder);
    const level = this.contentRepository.getLevelByIndex(
      Math.min(Math.max(0, levelIndex), this.contentRepository.getLevelCount() - 1),
    );
    this.drawOverlayPanel(overlay, layout, 332, 266);
    this.writeOverlayLabel(overlay, "OverlayTitle", "关前事件", 20, new Color(255, 246, 216, 255), 94);
    this.writeOverlayLabel(
      overlay,
      "OverlaySubtitle",
      level ? `${this.getRunModeLabel()}第 ${displayOrder} 层前选择一项` : "选择一项进入下一关",
      14,
      new Color(232, 207, 166, 255),
      64,
    );
    this.drawEventChoices(overlay);
  }

  private showComboChoiceOverlay(combo: HulebuComboType, options: HulebuRuntimeComboCandidateOption[]): void {
    if (!this.runtimeState || options.length === 0) {
      return;
    }

    this.pendingComboChoice = { combo, options };
    const overlay = this.prepareFlowOverlay();
    this.drawComboChoiceOptions(overlay, combo, options);
  }

  private restorePendingComboChoiceOverlay(pendingCombo: PendingComboContext | null): void {
    this.pendingComboChoice = null;
    if (this.runStateMachine.phase !== "playing.comboChoosing") {
      this.hideFlowOverlay();
      return;
    }
    if (!pendingCombo) {
      throw new Error("Restored combo choice is missing its pending context.");
    }
    this.showComboChoiceOverlay(
      pendingCombo.combo,
      pendingCombo.candidates.map((candidate) => ({
        type: candidate.type,
        key: candidate.key,
        tileIds: [...candidate.tileIds],
        labels: [...candidate.labels],
        prefabKeys: [...candidate.prefabKeys],
      })),
    );
  }

  private drawComboChoiceOptions(
    overlay: Node,
    combo: HulebuComboType,
    options: HulebuRuntimeComboCandidateOption[],
  ): void {
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    const anchor = this.resolveComboChoiceMenuAnchor(combo, layout);
    const visibleOptions = options.slice(0, 3);
    visibleOptions.forEach((option, index) => {
      const labels = option.labels.join(" ");
      const button = this.createOverlayButton(
        overlay,
        `ComboChoice_${index}`,
        labels || this.getComboDisplayName(option.type),
        anchor.x,
        anchor.y + 56 + index * 56,
        () => this.executeComboCandidateOption(option),
        142,
        50,
      );
      this.drawComboChoiceTilePreview(button, option);
    });
  }

  private resolveComboChoiceMenuAnchor(combo: HulebuComboType, layout: RuntimeLayout): { x: number; y: number } {
    const comboOrder: HulebuComboType[] = ["hu", "gang", "peng", "chi", "bugang"];
    const comboIndex = Math.max(0, comboOrder.indexOf(combo));
    const rawX = -142 + comboIndex * 71;
    const maxX = Math.max(0, layout.cssWidth / 2 - 77);
    const comboY = resolveHulebuPortraitZones(layout).comboY;
    return {
      x: Math.max(-maxX, Math.min(maxX, rawX)),
      y: (comboY - layout.height / 2) / layout.scale,
    };
  }

  private drawComboChoiceTilePreview(button: Node, option: HulebuRuntimeComboCandidateOption): void {
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    const tileKeys = option.prefabKeys.slice(0, 4);
    const tileCount = Math.max(1, tileKeys.length);
    const tileWidth = scaleLayoutValue(22, layout.scale);
    const tileHeight = scaleLayoutValue(30, layout.scale);
    const gap = scaleLayoutValue(21, layout.scale);
    const startX = -((tileCount - 1) * gap) / 2;
    tileKeys.forEach((tileKey, index) => {
      const artNode = this.ensureChild(button, `ComboChoiceTileArt_${index}`);
      artNode.layer = button.layer;
      artNode.setPosition(new Vec3(startX + index * gap, scaleLayoutValue(9, layout.scale), 2));
      const uiTransform = artNode.getComponent(UITransform) ?? artNode.addComponent(UITransform);
      uiTransform.setContentSize(tileWidth, tileHeight);
      const sprite = artNode.getComponent(Sprite) ?? artNode.addComponent(Sprite);
      sprite.sizeMode = Sprite.SizeMode.CUSTOM;
      artNode.active = false;
      this.tileSpriteCatalog.loadTileSpriteFrame(tileKey, (spriteFrame) => {
        if (!spriteFrame) {
          artNode.active = false;
          return;
        }
        if (!safeApplySpriteFrame(artNode, sprite, spriteFrame)) {
          return;
        }
        artNode.active = true;
      });
    });
    const label = button.getChildByName("Label");
    if (label) {
      label.setPosition(new Vec3(0, -scaleLayoutValue(14, layout.scale), 1));
    }
  }

  private executeComboCandidateOption(option: HulebuRuntimeComboCandidateOption): void {
    if (!this.runtimeState || !this.pendingComboChoice) {
      return;
    }

    this.applyCoordinatorResult(this.gameCoordinator.dispatch({ type: "combo.choose", candidateId: option.key }));
  }

  private closeComboChoiceOverlay(): void {
    if (this.runStateMachine.phase === "playing.comboChoosing") {
      this.requireRunTransition("playing.idle");
      this.gameCoordinator.updateContext({ pendingCombo: null });
      this.persistActiveRun();
    }
    this.pendingComboChoice = null;
    this.hideFlowOverlay();
  }

  private getComboDisplayName(combo: HulebuComboType): string {
    const labels: Record<HulebuComboType, string> = {
      hu: "胡",
      gang: "杠",
      peng: "碰",
      chi: "吃",
      bugang: "补杠",
    };
    return labels[combo];
  }

  private showRunArchetypeOverlay(): void {
    this.gamePhase = "archetype";
    this.persistActiveRun();
    const overlay = this.prepareFlowOverlay();
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    this.drawOverlayPanel(overlay, layout, 340, 312);
    this.writeOverlayLabel(overlay, "OverlayTitle", "选择本局流派", 20, new Color(255, 246, 216, 255), 112);
    this.writeOverlayLabel(
      overlay,
      "OverlaySubtitle",
      "每局开局前决定本局打法",
      14,
      new Color(232, 207, 166, 255),
      82,
    );
    this.drawRunArchetypeChoices(overlay);
  }

  private showLobbyOverlay(): void {
    const overlay = this.prepareFlowOverlay();
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    this.gamePhase = "lobby";
    this.drawOverlayPanel(overlay, layout, 338, 360);
    this.writeOverlayLabel(overlay, "OverlayTitle", "胡了卜", 24, new Color(255, 246, 216, 255), 132);
    this.writeOverlayLabel(
      overlay,
      "OverlaySubtitle",
      this.getLobbySubtitle(),
      14,
      new Color(232, 207, 166, 255),
      98,
    );
    this.drawLobbyModeChoices(overlay);
  }

  private showMetaUpgradeOverlay(): void {
    const overlay = this.prepareFlowOverlay();
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    this.gamePhase = "meta";
    this.drawOverlayPanel(overlay, layout, 352, 374);
    this.writeOverlayLabel(overlay, "OverlayTitle", "局外成长", 20, new Color(255, 246, 216, 255), 142);
    this.writeOverlayLabel(
      overlay,
      "OverlaySubtitle",
      `铜钱 ${this.metaCoins} / 点击升级，下一局生效`,
      14,
      new Color(232, 207, 166, 255),
      112,
    );
    this.drawMetaUpgradeChoices(overlay);
    this.createOverlayButton(overlay, "MetaUpgrade_Back", "返回", 0, -146, () => this.returnToLobby(), 128, 38);
  }

  private showCollectionOverlay(): void {
    const overlay = this.prepareFlowOverlay();
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    this.gamePhase = "collection";
    this.drawOverlayPanel(overlay, layout, 352, 420);
    this.writeOverlayLabel(overlay, "OverlayTitle", "生涯总览", 20, new Color(255, 246, 216, 255), 164);
    this.writeOverlayLabel(
      overlay,
      "OverlaySubtitle",
      "查看本地累计进度与最近战绩",
      14,
      new Color(232, 207, 166, 255),
      134,
    );
    this.drawCollectionSummary(overlay);
    this.createOverlayButton(overlay, "Collection_Back", "返回", 0, -170, () => this.returnToLobby(), 128, 38);
  }

  private showAdvancedRunOverlay(): void {
    const overlay = this.prepareFlowOverlay();
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    this.gamePhase = "advanced";
    this.drawOverlayPanel(overlay, layout, 352, 342);
    this.writeOverlayLabel(overlay, "OverlayTitle", "高阶周目", 20, new Color(255, 246, 216, 255), 124);
    this.writeOverlayLabel(
      overlay,
      "OverlaySubtitle",
      "选择风场后进入本局流派",
      14,
      new Color(232, 207, 166, 255),
      94,
    );
    this.drawAdvancedRunChoices(overlay);
    this.createOverlayButton(overlay, "AdvancedRun_Back", "返回", 0, -128, () => this.returnToLobby(), 128, 38);
  }

  private showAdvancedAbilityOverlay(): void {
    this.gamePhase = "advancedAbility";
    this.persistActiveRun();
    const overlay = this.prepareFlowOverlay();
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    this.gamePhase = "advancedAbility";
    this.drawOverlayPanel(overlay, layout, 352, 336);
    this.writeOverlayLabel(overlay, "OverlayTitle", "高阶能力", 20, new Color(255, 246, 216, 255), 122);
    this.writeOverlayLabel(
      overlay,
      "OverlaySubtitle",
      "选择一项承压能力",
      14,
      new Color(232, 207, 166, 255),
      92,
    );
    this.drawAdvancedAbilityChoices(overlay);
    this.createOverlayButton(overlay, "AdvancedAbility_Back", "返回", 0, -126, () => this.showAdvancedRunOverlay(), 128, 38);
  }

  private showRunCompleteOverlay(): void {
    const isNewSettlement = this.runStateMachine.phase !== "settlement";
    if (isNewSettlement) {
      if (this.runStateMachine.phase !== "encounterCleared") {
        console.warn(`[Hulebu] cannot settle run from ${this.runStateMachine.phase}`);
        return;
      }
      if (this.runtimeState) {
        this.detachRuntimeState();
      }
      this.requireRunTransition("settlement");
    }

    const overlay = this.prepareFlowOverlay();
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    this.gamePhase = "cleared";
    this.drawOverlayPanel(overlay, layout);
    this.writeOverlayLabel(overlay, "OverlayTitle", `${this.runProfile.displayName}通关`, 24, new Color(255, 246, 216, 255), 38);
    this.writeOverlayLabel(
      overlay,
      "OverlaySubtitle",
      `获得铜钱 ${HULEBU_RUN_COMPLETE_META_COIN_REWARD}`,
      15,
      new Color(232, 207, 166, 255),
      2,
    );
    this.createOverlayButton(overlay, "ContinueButton", "回到局外", 0, -54, () => this.returnToLobby());
    if (!isNewSettlement) {
      this.clearActiveRun();
      return;
    }
    if (!this.commitActiveRun()) {
      return;
    }
    this.awardMetaCoinsForRun();
    this.persistLastSettlement();
    this.persistMetaProgress();
    this.persistAchievements(this.buildAchievementUnlocks());
    this.clearActiveRun();
  }

  private restartRun(): void {
    this.startRunWithProfile(this.runProfile);
  }

  private drawRewardChoices(overlay: Node): void {
    const choices = this.gameCoordinator.snapshot().context.rewardCandidateIds;
    const startX = -REWARD_CHOICE_CARD_GAP;
    choices.forEach((rewardId, index) => {
      const rewardName = HULEBU_REWARD_LABELS[rewardId] ?? rewardId;
      const button = this.createOverlayButton(
        overlay,
        `RewardChoice_${index}`,
        rewardName,
        startX + index * REWARD_CHOICE_CARD_GAP,
        -36,
        () => this.pickReward(rewardId),
        REWARD_CHOICE_CARD_WIDTH,
        REWARD_CHOICE_CARD_HEIGHT,
        this.getRewardDetailText(rewardId),
      );
      this.applyRewardCardSprite(button, rewardId);
    });
  }

  private getCurrentRewardChoices(): string[] {
    const levelConfig = this.runtimeState?.getLevelConfig();
    if (!levelConfig) {
      return [];
    }

    return getHulebuRewardChoicesForRun(this.runProfile, levelConfig);
  }

  private drawEventChoices(overlay: Node): void {
    const choices = this.gameCoordinator.snapshot().context.eventOptionIds;
    const startX = -102;
    choices.forEach((eventId, index) => {
      const eventConfig = getHulebuSpecialEventConfig(eventId);
      if (!eventConfig) {
        return;
      }
      const eventName = HULEBU_SPECIAL_EVENT_LABELS[eventConfig.id] ?? eventConfig.name;
      const eventMeta = this.formatSpecialEventMeta(eventConfig.rarity, eventConfig.dangerLevel, eventConfig.tags);
      this.createOverlayButton(
        overlay,
        `EventChoice_${index}`,
        eventName,
        startX + index * 102,
        -34,
        () => this.pickSpecialEvent(eventConfig.id),
        92,
        102,
        `${eventConfig.subtitle}\n${eventMeta}`,
      );
    });
  }

  private formatSpecialEventMeta(
    rarity: keyof typeof HULEBU_SPECIAL_EVENT_RARITY_LABELS,
    dangerLevel: keyof typeof HULEBU_SPECIAL_EVENT_DANGER_LABELS,
    tags: string[],
  ): string {
    const rarityText = HULEBU_SPECIAL_EVENT_RARITY_LABELS[rarity] ?? "普通";
    const dangerText = HULEBU_SPECIAL_EVENT_DANGER_LABELS[dangerLevel] ?? "无压";
    const tagText = tags.slice(0, 2).join("/");
    return tagText ? `${rarityText} · ${dangerText}\n${tagText}` : `${rarityText} · ${dangerText}`;
  }

  private drawRunArchetypeChoices(overlay: Node): void {
    const startX = -106;
    const startY = 22;
    HULEBU_RUN_ARCHETYPES.forEach((archetype, index) => {
      const column = index % 3;
      const row = Math.floor(index / 3);
      this.createOverlayButton(
        overlay,
        `RunArchetypeChoice_${archetype.id}`,
        archetype.name,
        startX + column * 106,
        startY - row * 86,
        () => this.pickRunArchetype(archetype.id),
        96,
        76,
        archetype.subtitle,
      );
    });
  }

  private drawLobbyModeChoices(overlay: Node): void {
    if (this.activeRunSnapshot) {
      this.createOverlayButton(overlay, "LobbyMode_Resume", "继续本轮", 0, 36, () => this.resumeActiveRun(), 300, 42);
      this.createOverlayButton(overlay, "LobbyMode_Mainline", "主线", -104, -28, () => this.startMainlineRun(), 92, 72, this.getMainlineProgressText());
      this.createOverlayButton(overlay, "LobbyMode_Endless", "无尽", 0, -28, () => this.startEndlessRun(), 92, 72, this.getEndlessProgressText());
      this.createOverlayButton(overlay, "LobbyMode_Daily", "每日", 104, -28, () => this.startDailyRun(), 92, 72, this.getDailyProgressText());
    } else {
      this.createOverlayButton(overlay, "LobbyMode_Mainline", "主线", -104, 4, () => this.startMainlineRun(), 92, 72, this.getMainlineProgressText());
      this.createOverlayButton(overlay, "LobbyMode_Endless", "无尽", 0, 4, () => this.startEndlessRun(), 92, 72, this.getEndlessProgressText());
      this.createOverlayButton(overlay, "LobbyMode_Daily", "每日", 104, 4, () => this.startDailyRun(), 92, 72, this.getDailyProgressText());
    }
    this.createOverlayButton(overlay, "LobbyMode_Advanced", "高阶", 0, -96, () => this.showAdvancedRunOverlay(), 300, 40, this.getAdvancedProgressText());
    this.createOverlayButton(overlay, "LobbyMode_Upgrade", "升级", -78, -144, () => this.showMetaUpgradeOverlay(), 144, 40);
    this.createOverlayButton(overlay, "LobbyMode_Collection", "生涯", 78, -144, () => this.showCollectionOverlay(), 144, 40);
  }

  private drawAdvancedRunChoices(overlay: Node): void {
    const east = getHulebuAdvancedRunPressureConfig(createHulebuAdvancedRunProfile("east"));
    const south = getHulebuAdvancedRunPressureConfig(createHulebuAdvancedRunProfile("south"));
    const west = getHulebuAdvancedRunPressureConfig(createHulebuAdvancedRunProfile("west"));
    const north = getHulebuAdvancedRunPressureConfig(createHulebuAdvancedRunProfile("north"));
    this.createOverlayButton(overlay, "AdvancedRun_East", "东风场", -86, 34, () => this.startAdvancedRun("east"), 122, 58, east.subtitle);
    this.createOverlayButton(overlay, "AdvancedRun_South", "南风场", 86, 34, () => this.startAdvancedRun("south"), 122, 58, south.subtitle);
    this.createOverlayButton(overlay, "AdvancedRun_West", "西风场", -86, -38, () => this.startAdvancedRun("west"), 122, 58, west.subtitle);
    this.createOverlayButton(overlay, "AdvancedRun_North", "北风场", 86, -38, () => this.startAdvancedRun("north"), 122, 58, north.subtitle);
  }

  private drawAdvancedAbilityChoices(overlay: Node): void {
    const profile = this.pendingRunProfile ?? this.runProfile;
    const choices = getHulebuAdvancedAbilityChoices(profile);
    const startX = -102;
    choices.forEach((ability, index) => {
      this.createOverlayButton(
        overlay,
        `AdvancedAbility_${ability.id}`,
        ability.name,
        startX + index * 102,
        -18,
        () => this.pickAdvancedAbility(ability.id),
        92,
        96,
        ability.subtitle,
      );
    });
  }

  private drawMetaUpgradeChoices(overlay: Node): void {
    const startX = -82;
    const startY = 62;
    HULEBU_META_UPGRADE_OPTIONS.forEach((option, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const value = this.getMetaUpgradeValue(option.axis);
      const priceText = this.getMetaUpgradeCost(option.axis) === null ? "满级" : `${this.getMetaUpgradeCost(option.axis)}铜`;
      this.createOverlayButton(
        overlay,
        `MetaUpgrade_${option.axis}`,
        `${option.label} Lv${value}`,
        startX + column * 164,
        startY - row * 62,
        () => this.upgradeMetaAxis(option.axis),
        148,
        52,
        this.getMetaUpgradeDetailText(option.axis, priceText),
      );
    });
  }

  private getRewardDetailText(rewardId: string): string {
    const details: Record<string, string> = {
      first_protect_shield: "首败保一手",
      reserve_plus_1: "备用槽 +1",
      shield_plus_1: "护符 +1",
      undo_plus_1: "撤回 +1",
      vision_plus_1: "看山 +1",
      gang_score_plus_25: "杠分 +25",
      chi_score_plus_8: "吃分 +8",
      coin_plus_20: "开局铜钱 +20",
      peng_score_plus_10: "碰分 +10",
      shuffle_plus_1: "洗牌 +1",
      advanced_east_probe: "看山 +1 / 吃分加成",
      advanced_east_flow: "胡分加成 / 顺手摸牌",
      advanced_south_river_guard: "打牌 +1 / 留手稳河",
      advanced_south_stable_table: "备用槽 +1 / 碰分加成",
      advanced_west_trial_audit: "撤回 +1 / 试锋读账",
      advanced_west_tail_gate: "护符 +1 / 尾门收口",
      advanced_north_kong_tide: "洗牌 +1 / 杠潮爆发",
      advanced_north_stable_life: "护符 +1 / 稳压续命",
    };
    return details[rewardId] ?? "本局即时生效";
  }

  private getMetaUpgradeDetailText(axis: HulebuMetaUpgradeAxis, priceText: string): string {
    const labels: Record<HulebuMetaUpgradeAxis, string> = {
      reserveBonus: "暗格容错",
      shieldBonus: "满槽护符",
      toolBonus: "初始工具",
      riverBonus: "牌河上限",
      startingCoins: "开局铜钱",
      visionBonus: "看山预置",
    };
    return `${labels[axis]} · ${priceText}`;
  }

  private drawCollectionSummary(overlay: Node): void {
    const currentRunText = this.activeRunSnapshot ? this.formatActiveRunSummary(this.activeRunSnapshot) : "当前无进行中本轮";
    const lastRunText = this.lastSettlementSnapshot ? this.formatLastSettlementSummary(this.lastSettlementSnapshot) : "最近一轮暂无记录";
    const growthText = this.formatMetaUpgradeSummary();
    const dailySummaryText = this.getDailyCollectionSummaryText();
    const unlockedCount = Object.keys(this.achievements).length;
    const nextAchievement = this.getNextLockedAchievement();
    this.writeOverlaySummaryLine(overlay, "Collection_CurrentRun", `本轮：${currentRunText}`, 92);
    this.writeOverlaySummaryLine(overlay, "Collection_LastRun", `最近：${lastRunText}`, 58);
    this.writeOverlaySummaryLine(overlay, "Collection_Coins", `铜钱：${this.metaCoins}`, 24);
    this.writeOverlaySummaryLine(overlay, "Collection_Growth", `成长：${growthText}`, -10);
    this.writeOverlaySummaryLine(overlay, "Collection_Mainline", `主线：${this.getMainlineProgressText()}`, -44);
    this.writeOverlaySummaryLine(overlay, "Collection_Endless", `无尽：${this.getEndlessProgressText()}`, -78);
    this.writeOverlaySummaryLine(overlay, "Collection_Daily", `每日：${dailySummaryText}`, -112);
    this.writeOverlaySummaryLine(overlay, "Collection_Advanced", `高阶：${this.getAdvancedProgressText()}`, -146);
    this.writeOverlaySummaryLine(overlay, "Collection_AchievementHeadline", `图鉴：${unlockedCount}/${HULEBU_ACHIEVEMENTS.length} 项已解锁`, -180);
    this.writeOverlaySummaryLine(
      overlay,
      "Collection_AchievementNext",
      `下一项：${nextAchievement ? `${nextAchievement.title} · ${nextAchievement.hint}` : "首批图鉴已齐"}`,
      -214,
    );
    this.writeOverlaySummaryLine(overlay, "Collection_AchievementList", this.formatAchievementListSummary(), -248);
    this.writeOverlaySummaryLine(overlay, "Collection_AccountSync", this.getAccountSyncStatusText(), -282);
  }

  private upgradeMetaAxis(axis: HulebuMetaUpgradeAxis): void {
    const option = HULEBU_META_UPGRADE_OPTIONS.find((upgradeOption) => upgradeOption.axis === axis);
    const step = option?.step ?? 1;
    const cost = this.getMetaUpgradeCost(axis);
    if (cost === null || this.metaCoins < cost) {
      this.showMetaUpgradeOverlay();
      return;
    }

    this.metaCoins -= cost;
    this.applyMetaUpgrades({ [axis]: this.getMetaUpgradeValue(axis) + step });
    this.persistAchievements({ "upgrade-first-buy": this.createAchievementTimestamp() });
    this.showMetaUpgradeOverlay();
  }

  private getMetaUpgradeValue(axis: HulebuMetaUpgradeAxis): number {
    return this.metaUpgrades[axis];
  }

  private getMetaUpgradeCost(axis: HulebuMetaUpgradeAxis): number | null {
    const value = this.getMetaUpgradeValue(axis);
    const option = HULEBU_META_UPGRADE_OPTIONS.find((upgradeOption) => upgradeOption.axis === axis);
    const step = option?.step ?? 1;
    const level = Math.floor(value / step);
    if (level >= HULEBU_META_UPGRADE_MAX_LEVELS[axis]) {
      return null;
    }

    return HULEBU_META_UPGRADE_COSTS[axis][level] ?? null;
  }

  private awardMetaCoinsForRun(): void {
    this.metaCoins += HULEBU_RUN_COMPLETE_META_COIN_REWARD;
    this.persistMetaProfile();
  }

  private startRunWithProfile(profile: HulebuRunProfile): void {
    this.detachRuntimeState();
    this.runStateMachine = new RunStateMachine("bossIntro");
    this.gameCoordinator = new GameCoordinator(this.runStateMachine);
    this.pendingRunProfile = profile;
    this.selectedAdvancedAbility = null;
    if (profile.mode === "advanced" && getHulebuAdvancedAbilityChoices(profile).length > 0) {
      this.gamePhase = "advancedAbility";
      this.showAdvancedAbilityOverlay();
      return;
    }

    this.gamePhase = "archetype";
    this.showRunArchetypeOverlay();
  }

  private completeRunArchetypeSelection(archetypeId: HulebuRunArchetypeId): void {
    const profile = this.pendingRunProfile ?? this.runProfile;
    this.selectRunArchetype(archetypeId);
    this.runProfile = profile;
    this.runRewards = createHulebuRunRewardState();
    this.applySelectedAdvancedAbilityRewards();
    this.levelEventModifiers = createHulebuLevelModifierState();
    this.eventSeenLevelOrders.clear();
    this.pendingRunProfile = null;
    this.startNextLevel(profile.startOrder);
  }

  private resumeRuntimeSnapshot(snapshot: HulebuActiveRunSnapshot): void {
    if (!snapshot.runtimeSnapshot) {
      this.startLevel(snapshot.currentDisplayLevelOrder);
      return;
    }

    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    const levelIndex = getHulebuLevelIndexForRunOrder(snapshot.runProfile, snapshot.currentDisplayLevelOrder);
    const boundedLevelIndex = Math.min(Math.max(0, levelIndex), this.contentRepository.getLevelCount() - 1);
    const levelConfig = this.contentRepository.createRuntimeLevel(
      boundedLevelIndex,
      snapshot.runProfile,
      snapshot.currentDisplayLevelOrder,
    );
    const levelModifiers = mergeHulebuLevelModifierStates(
      this.createAdvancedRunLevelModifiers(),
      this.levelEventModifiers,
    );

    const runtimeState = HulebuRuntimeState.fromSnapshot(
      levelConfig,
      snapshot.runtimeSnapshot,
      snapshot.runRewards,
      levelModifiers,
      snapshot.metaUpgrades,
      this.runArchetype,
    );
    this.restoreCoordinatorState(snapshot.coordinatorSnapshot, runtimeState);
    this.currentLevelIndex = boundedLevelIndex;
    this.currentDisplayLevelOrder = snapshot.currentDisplayLevelOrder;
    this.gamePhase = "playing";
    this.pendingRewardLevelIndex = null;
    this.pendingEventLevelIndex = null;
    this.levelEventModifiers = createHulebuLevelModifierState();
    this.ensureVisualShell(layout, runtimeState.getLevelOrder());
    this.applySceneModel(runtimeState.toSceneModel(layout));
    this.restorePendingComboChoiceOverlay(snapshot.coordinatorSnapshot.context.pendingCombo);
  }

  private resumeClearedPhase(snapshot: HulebuActiveRunSnapshot): void {
    this.resumeRuntimeSnapshot({
      ...snapshot,
      resumablePhase: "playing",
    });
    this.gamePhase = "cleared";
    this.showClearOverlay();
  }

  private resumeRewardPhase(snapshot: HulebuActiveRunSnapshot): void {
    this.currentDisplayLevelOrder = snapshot.currentDisplayLevelOrder;
    this.currentLevelIndex = Math.min(
      Math.max(0, getHulebuLevelIndexForRunOrder(snapshot.runProfile, snapshot.currentDisplayLevelOrder)),
      this.contentRepository.getLevelCount() - 1,
    );
    this.restoreCoordinatorState(snapshot.coordinatorSnapshot, null);
    this.pendingRewardLevelIndex = snapshot.coordinatorSnapshot.context.targetLevelOrder;
    this.pendingEventLevelIndex = null;
    this.gamePhase = "reward";
    this.renderRewardOverlay();
  }

  private resumeEventPhase(snapshot: HulebuActiveRunSnapshot): void {
    this.currentDisplayLevelOrder = snapshot.currentDisplayLevelOrder;
    this.currentLevelIndex = Math.min(
      Math.max(0, getHulebuLevelIndexForRunOrder(snapshot.runProfile, snapshot.currentDisplayLevelOrder)),
      this.contentRepository.getLevelCount() - 1,
    );
    this.restoreCoordinatorState(snapshot.coordinatorSnapshot, null);
    this.pendingEventLevelIndex = snapshot.coordinatorSnapshot.context.targetLevelOrder;
    this.pendingRewardLevelIndex = null;
    this.gamePhase = "event";
    this.renderEventOverlay();
  }

  private resumeAdvancedAbilityPhase(snapshot: HulebuActiveRunSnapshot): void {
    this.currentDisplayLevelOrder = snapshot.currentDisplayLevelOrder;
    this.pendingRunProfile = snapshot.pendingRunProfile ? { ...snapshot.pendingRunProfile } : { ...snapshot.runProfile };
    this.restoreCoordinatorState(snapshot.coordinatorSnapshot, null);
    this.gamePhase = "advancedAbility";
    this.showAdvancedAbilityOverlay();
  }

  private resumeArchetypePhase(snapshot: HulebuActiveRunSnapshot): void {
    this.currentDisplayLevelOrder = snapshot.currentDisplayLevelOrder;
    this.pendingRunProfile = snapshot.pendingRunProfile ? { ...snapshot.pendingRunProfile } : { ...snapshot.runProfile };
    this.restoreCoordinatorState(snapshot.coordinatorSnapshot, null);
    this.gamePhase = "archetype";
    this.showRunArchetypeOverlay();
  }

  private resumeSettlementPhase(snapshot: HulebuActiveRunSnapshot): void {
    this.currentDisplayLevelOrder = snapshot.currentDisplayLevelOrder;
    this.pendingRunProfile = null;
    this.restoreCoordinatorState(snapshot.coordinatorSnapshot, null);
    this.gamePhase = "cleared";
    this.showRunCompleteOverlay();
  }

  private persistActiveRun(): void {
    this.commitActiveRun();
  }

  private commitActiveRun(): boolean {
    if (this.activeRunStorageBlocked) {
      console.warn("[Hulebu] active run storage is blocked; refusing to overwrite unreadable primary bytes");
      return false;
    }
    const coordinatorSnapshot = this.gameCoordinator.snapshot();
    if (
      this.runProfile.mode === "mainline"
      && !this.runtimeState
      && !this.pendingRunProfile
      && this.currentDisplayLevelOrder <= 1
      && coordinatorSnapshot.phase === "bossIntro"
    ) {
      return false;
    }

    const pendingRunProfile = this.pendingRunProfile ? { ...this.pendingRunProfile } : null;
    const snapshot: HulebuActiveRunSnapshot = {
      boardRevision: HULEBU_BOARD_REVISION,
      runProfile: { ...(pendingRunProfile ?? this.runProfile) },
      pendingRunProfile,
      currentDisplayLevelOrder: this.currentDisplayLevelOrder,
      resumablePhase: this.getResumableRunPhase(),
      updatedAt: new Date().toISOString(),
      runRewards: cloneRunRewardState(this.runRewards),
      metaUpgrades: cloneMetaUpgradeState(this.metaUpgrades),
      metaCoins: this.metaCoins,
      runArchetypeId: this.runArchetype.archetypeId,
      selectedAdvancedAbilityId: this.selectedAdvancedAbility?.id ?? null,
      eventSeenLevelOrders: Array.from(this.eventSeenLevelOrders),
      runtimeSnapshot: this.runtimeState?.exportSnapshot()
        ?? (coordinatorSnapshot.phase === "rewardChoice"
          || coordinatorSnapshot.phase === "eventChoice"
          || coordinatorSnapshot.phase === "settlement"
          ? this.activeRunSnapshot?.runtimeSnapshot ?? null
          : null),
      coordinatorSnapshot,
    };
    const saveResult = this.activeRunSaveService.save(snapshot);
    if (saveResult.status !== "committed") {
      console.warn("[Hulebu] active run save failed", saveResult);
      return false;
    }
    this.activeRunStorageBlocked = false;
    this.activeRunSnapshot = snapshot;
    this.queueAccountProgressPush();
    return true;
  }

  private getResumableRunPhase(): HulebuResumableRunPhase {
    if (this.runStateMachine.phase === "settlement") {
      return "settlement";
    }
    if (this.gamePhase === "advancedAbility") {
      return "advancedAbility";
    }
    if (this.gamePhase === "archetype") {
      return "archetype";
    }
    if (this.gamePhase === "reward") {
      return "reward";
    }
    if (this.gamePhase === "event") {
      return "event";
    }
    if (this.gamePhase === "cleared") {
      return "cleared";
    }
    return "playing";
  }

  private clearActiveRun(): void {
    if (this.activeRunStorageBlocked) {
      console.warn("[Hulebu] active run storage is blocked; refusing to clear unreadable primary bytes");
      return;
    }
    const clearResult = this.activeRunSaveService.clear();
    if (clearResult.status !== "cleared") {
      console.warn("[Hulebu] active run clear failed", clearResult.error);
      return;
    }
    this.activeRunSnapshot = null;
    this.queueAccountProgressPush();
  }

  private persistLastSettlement(): void {
    const snapshot: HulebuSettlementSnapshot = {
      runProfile: { ...this.runProfile },
      reachedLevelOrder: this.currentDisplayLevelOrder,
      metaCoinsEarned: HULEBU_RUN_COMPLETE_META_COIN_REWARD,
      pickedRewards: this.runRewards.pickedRewards.length,
      summary: this.formatSettlementSummaryText(),
    };
    this.lastSettlementSnapshot = snapshot;
    sys.localStorage.setItem(HULEBU_LAST_SETTLEMENT_STORAGE_KEY, JSON.stringify(snapshot));
  }

  private persistMetaProgress(): void {
    const activeDailySeed = this.runProfile.mode === "daily" ? this.runProfile.dailySeed ?? this.getTodaySeed() : null;
    const nextProgress = {
      ...this.metaProgress,
      bestMainlineLevel:
        this.runProfile.mode === "mainline"
          ? Math.max(this.metaProgress.bestMainlineLevel, this.currentDisplayLevelOrder)
          : this.metaProgress.bestMainlineLevel,
      bestEndlessLayer:
        this.runProfile.mode === "endless"
          ? Math.max(this.metaProgress.bestEndlessLayer, this.currentDisplayLevelOrder)
          : this.metaProgress.bestEndlessLayer,
      dailyBestLevels:
        this.runProfile.mode === "daily" && activeDailySeed
          ? {
              ...this.metaProgress.dailyBestLevels,
              [activeDailySeed]: Math.max(this.metaProgress.dailyBestLevels[activeDailySeed] ?? 0, this.currentDisplayLevelOrder),
            }
          : this.metaProgress.dailyBestLevels,
      dailyStreak: this.metaProgress.dailyStreak,
      lastDailySeed: this.metaProgress.lastDailySeed,
      bestAdvancedTier:
        this.runProfile.mode === "advanced"
          ? getHigherAdvancedTier(this.metaProgress.bestAdvancedTier, this.runProfile.advancedTier ?? null)
          : this.metaProgress.bestAdvancedTier,
    };
    this.metaProgress = nextProgress;
    sys.localStorage.setItem(HULEBU_META_PROGRESS_STORAGE_KEY, JSON.stringify(nextProgress));
    this.queueAccountProgressPush();
  }

  private persistMetaProfile(): void {
    const snapshot: HulebuMetaProfileSnapshot = {
      metaCoins: this.metaCoins,
      metaUpgrades: cloneMetaUpgradeState(this.metaUpgrades),
    };
    sys.localStorage.setItem(HULEBU_META_PROFILE_STORAGE_KEY, JSON.stringify(snapshot));
    this.queueAccountProgressPush();
  }

  private persistAchievements(unlocks: HulebuAchievementSnapshot): void {
    const next = mergeAchievementSnapshot(this.achievements, unlocks);
    this.achievements = next;
    sys.localStorage.setItem(HULEBU_ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(next));
    this.queueAccountProgressPush();
  }

  private loadActiveRunSnapshot(): HulebuActiveRunSnapshot | null {
    const loadResult = this.activeRunSaveService.load();
    switch (loadResult.status) {
      case "loaded":
        this.activeRunStorageBlocked = false;
        return loadResult.value;
      case "empty":
        this.activeRunStorageBlocked = false;
        return null;
      case "quarantined":
        this.activeRunStorageBlocked = false;
        console.warn("[Hulebu] invalid active run quarantined", loadResult.key, loadResult.reason);
        return null;
      case "error":
        this.activeRunStorageBlocked = true;
        console.warn("[Hulebu] active run load failed", loadResult.stage, loadResult.error);
        return this.activeRunSnapshot;
    }
  }

  private readLastSettlementSnapshot(): HulebuSettlementSnapshot | null {
    const raw = sys.localStorage.getItem(HULEBU_LAST_SETTLEMENT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<HulebuSettlementSnapshot>;
      if (!parsed.runProfile || typeof parsed.reachedLevelOrder !== "number" || typeof parsed.metaCoinsEarned !== "number") {
        return null;
      }

      return {
        runProfile: parsed.runProfile,
        reachedLevelOrder: parsed.reachedLevelOrder,
        metaCoinsEarned: parsed.metaCoinsEarned,
        pickedRewards: typeof parsed.pickedRewards === "number" ? parsed.pickedRewards : 0,
        summary: typeof parsed.summary === "string" ? parsed.summary : "",
      };
    } catch {
      return null;
    }
  }

  private readMetaProgressSnapshot(): HulebuMetaProgressSnapshot {
    const raw = sys.localStorage.getItem(HULEBU_META_PROGRESS_STORAGE_KEY);
    if (!raw) {
      return createDefaultMetaProgressSnapshot();
    }

    try {
      const parsed = JSON.parse(raw) as Partial<HulebuMetaProgressSnapshot>;
      return {
        bestMainlineLevel:
          typeof parsed.bestMainlineLevel === "number" ? Math.max(0, parsed.bestMainlineLevel) : 0,
        bestEndlessLayer:
          typeof parsed.bestEndlessLayer === "number" ? Math.max(0, parsed.bestEndlessLayer) : 0,
        dailyBestLevels:
          parsed.dailyBestLevels && typeof parsed.dailyBestLevels === "object"
            ? Object.fromEntries(
                Object.entries(parsed.dailyBestLevels).flatMap(([seed, value]) =>
                  typeof value === "number" && value > 0 ? [[seed, value]] : [],
                ),
              )
            : {},
        dailyStreak:
          typeof parsed.dailyStreak === "number" ? Math.max(0, Math.floor(parsed.dailyStreak)) : 0,
        lastDailySeed:
          typeof parsed.lastDailySeed === "string" && parsed.lastDailySeed ? parsed.lastDailySeed : null,
        bestAdvancedTier:
          parsed.bestAdvancedTier === "east"
          || parsed.bestAdvancedTier === "south"
          || parsed.bestAdvancedTier === "west"
          || parsed.bestAdvancedTier === "north"
            ? parsed.bestAdvancedTier
            : null,
      };
    } catch {
      return createDefaultMetaProgressSnapshot();
    }
  }

  private readMetaProfileSnapshot(): HulebuMetaProfileSnapshot {
    const raw = sys.localStorage.getItem(HULEBU_META_PROFILE_STORAGE_KEY);
    if (!raw) {
      return createDefaultMetaProfileSnapshot();
    }

    try {
      const parsed = JSON.parse(raw) as Partial<HulebuMetaProfileSnapshot>;
      return {
        metaCoins: typeof parsed.metaCoins === "number" ? Math.max(0, parsed.metaCoins) : HULEBU_META_INITIAL_COINS,
        metaUpgrades: cloneMetaUpgradeState(parsed.metaUpgrades),
      };
    } catch {
      return createDefaultMetaProfileSnapshot();
    }
  }

  private readAchievementSnapshot(): HulebuAchievementSnapshot {
    const raw = sys.localStorage.getItem(HULEBU_ACHIEVEMENTS_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return Object.fromEntries(
        HULEBU_ACHIEVEMENTS.flatMap((achievement) => {
          const value = parsed[achievement.id];
          return typeof value === "string" && value ? [[achievement.id, value]] : [];
        }),
      ) as HulebuAchievementSnapshot;
    } catch {
      return {};
    }
  }

  private getLobbySubtitle(): string {
    if (this.activeRunSnapshot) {
      return this.formatActiveRunSummary(this.activeRunSnapshot);
    }

    if (this.lastSettlementSnapshot) {
      return this.formatLastSettlementSummary(this.lastSettlementSnapshot);
    }

    return "选择模式，或先升级局外成长";
  }

  private formatActiveRunSummary(snapshot: HulebuActiveRunSnapshot): string {
    const runLabel = snapshot.runProfile.displayName;
    return `${runLabel} · 第 ${snapshot.currentDisplayLevelOrder} 关 · 奖励 ${snapshot.runRewards.pickedRewards.length}`;
  }

  private formatLastSettlementSummary(snapshot: HulebuSettlementSnapshot): string {
    return snapshot.summary || this.formatSettlementSummaryText(snapshot);
  }

  private formatSettlementSummaryText(snapshot: HulebuSettlementSnapshot | null = null): string {
    const source = snapshot ?? {
      runProfile: this.runProfile,
      reachedLevelOrder: this.currentDisplayLevelOrder,
      metaCoinsEarned: HULEBU_RUN_COMPLETE_META_COIN_REWARD,
      pickedRewards: this.runRewards.pickedRewards.length,
      summary: "",
    };
    return `${source.runProfile.displayName} · 最近到第 ${source.reachedLevelOrder} 关 · 铜钱 +${source.metaCoinsEarned}`;
  }

  private getMainlineProgressText(): string {
    if (this.metaProgress.bestMainlineLevel > 0) {
      return `最高第 ${this.metaProgress.bestMainlineLevel} 关`;
    }

    return this.lastSettlementSnapshot?.runProfile.mode === "mainline"
      ? `最近第 ${this.lastSettlementSnapshot.reachedLevelOrder} 关`
      : "20 关";
  }

  private getEndlessProgressText(): string {
    return this.metaProgress.bestEndlessLayer > 0 ? `最高 ${this.metaProgress.bestEndlessLayer} 层` : "未冲层";
  }

  private getDailyProgressText(): string {
    const todaySeed = this.getTodaySeed();
    const bestToday = this.metaProgress.dailyBestLevels[todaySeed] ?? 0;
    const mutator = getHulebuDailyMutatorProfile(todaySeed);
    const streakText = this.metaProgress.dailyStreak > 0 ? `连 ${this.metaProgress.dailyStreak} 天` : "首日";
    if (bestToday > 0) {
      return `${mutator.rewardLabel} · 最佳 ${bestToday} 关 · ${streakText}`;
    }

    return `${mutator.label} · ${streakText}`;
  }

  private getDailyCollectionSummaryText(): string {
    const todaySeed = this.getTodaySeed();
    const bestToday = this.metaProgress.dailyBestLevels[todaySeed] ?? 0;
    const mutator = getHulebuDailyMutatorProfile(todaySeed);
    const streakText = this.metaProgress.dailyStreak > 0 ? `连 ${this.metaProgress.dailyStreak} 天` : "今天是第一天";
    if (bestToday > 0) {
      return `${mutator.label} / ${mutator.rewardLabel} / 最佳 ${bestToday} 关 / ${streakText}`;
    }

    return `${mutator.label} / ${mutator.rewardLabel} / ${streakText}`;
  }

  private getAdvancedProgressText(): string {
    if (!this.metaProgress.bestAdvancedTier) {
      return "尚未通关";
    }

    const label = this.metaProgress.bestAdvancedTier === "east"
      ? "东风"
      : this.metaProgress.bestAdvancedTier === "south"
        ? "南风"
        : this.metaProgress.bestAdvancedTier === "west"
          ? "西风"
          : "北风";
    return `已到 ${label}`;
  }

  private formatMetaUpgradeSummary(): string {
    return `槽${this.metaUpgrades.reserveBonus} 护${this.metaUpgrades.shieldBonus} 工${this.metaUpgrades.toolBonus} 河${this.metaUpgrades.riverBonus} 钱${this.metaUpgrades.startingCoins} 视${this.metaUpgrades.visionBonus}`;
  }

  private getAccountSyncStatusText(): string {
    return this.accountSyncMessage;
  }

  private getNextLockedAchievement(): typeof HULEBU_ACHIEVEMENTS[number] | null {
    return HULEBU_ACHIEVEMENTS.find((achievement) => !this.achievements[achievement.id]) ?? null;
  }

  private formatAchievementListSummary(): string {
    const unlockedTitles = HULEBU_ACHIEVEMENTS
      .filter((achievement) => Boolean(this.achievements[achievement.id]))
      .slice(0, 3)
      .map((achievement) => achievement.title);
    return unlockedTitles.length > 0 ? `首批图鉴：${unlockedTitles.join(" / ")}` : "首批图鉴：尚未解锁";
  }

  private buildAchievementUnlocks(): HulebuAchievementSnapshot {
    const unlocks: HulebuAchievementSnapshot = {};
    const now = this.createAchievementTimestamp();

    if (this.runProfile.mode === "mainline") {
      unlocks["mainline-first-clear"] = now;
      if (this.currentDisplayLevelOrder >= 20) {
        unlocks["boss-hulebu-king"] = now;
      }
    }

    if (this.runProfile.mode === "daily") {
      unlocks["daily-clear"] = now;
    }

    if (this.metaProgress.bestEndlessLayer >= 21 || (this.runProfile.mode === "endless" && this.currentDisplayLevelOrder >= 21)) {
      unlocks["endless-first-step"] = now;
    }

    if (this.metaProgress.bestEndlessLayer >= 25 || (this.runProfile.mode === "endless" && this.currentDisplayLevelOrder >= 25)) {
      unlocks["endless-layer-25"] = now;
    }

    if ((this.metaProgress.bestAdvancedTier === "west" || this.metaProgress.bestAdvancedTier === "north")
      || (this.runProfile.mode === "advanced" && (this.runProfile.advancedTier === "west" || this.runProfile.advancedTier === "north"))) {
      unlocks["ascension-west-clear"] = now;
    }

    return unlocks;
  }

  private createAchievementTimestamp(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private resolveAdvancedAbilityById(profile: HulebuRunProfile, abilityId: string | null): HulebuAdvancedAbilityConfig | null {
    if (!abilityId) {
      return null;
    }

    return getHulebuAdvancedAbilityChoices(profile).find((choice) => choice.id === abilityId) ?? null;
  }

  private applySelectedAdvancedAbilityRewards(): void {
    if (!this.selectedAdvancedAbility) {
      return;
    }

    this.selectedAdvancedAbility.rewardIds.forEach((rewardId) => {
      this.runRewards = applyHulebuRewardToRunState(this.runRewards, rewardId);
    });
  }

  private getDisplayLevelOrderForFlow(displayOrder = this.currentDisplayLevelOrder): number {
    if (this.runProfile.mode === "mainline") {
      return displayOrder;
    }

    return ((displayOrder - 1) % this.contentRepository.getLevelCount()) + 1;
  }

  private getRunModeLabel(): string {
    return this.runProfile.mode === "mainline" ? "" : `${this.runProfile.displayName} `;
  }

  private getTodaySeed(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private persistDailyParticipation(dailySeed: string): void {
    const previousSeed = this.metaProgress.lastDailySeed;
    const nextStreak = previousSeed === dailySeed
      ? Math.max(1, this.metaProgress.dailyStreak)
      : Math.max(1, this.metaProgress.dailyStreak + 1);
    this.metaProgress = {
      ...this.metaProgress,
      dailyStreak: nextStreak,
      lastDailySeed: dailySeed,
    };
    sys.localStorage.setItem(HULEBU_META_PROGRESS_STORAGE_KEY, JSON.stringify(this.metaProgress));
    this.queueAccountProgressPush();
  }

  private syncAccountProgressOnLobbyEntry(): void {
    if (!this.canUseAccountProgressSync()) {
      this.accountSyncState = "local";
      this.accountSyncMessage = "账号：当前使用本地档案";
      this.refreshAccountSyncOverlay();
      return;
    }

    if (this.accountSyncPromise) {
      return;
    }

    void this.hydrateAccountProgress();
  }

  private canUseAccountProgressSync(): boolean {
    return typeof fetch === "function" && typeof window !== "undefined";
  }

  private refreshAccountSyncOverlay(): void {
    if (this.gamePhase === "lobby") {
      this.showLobbyOverlay();
      return;
    }

    if (this.gamePhase === "collection") {
      this.showCollectionOverlay();
    }
  }

  private queueAccountProgressPush(immediate = false): void {
    if (this.suppressAccountSyncPush || !this.canUseAccountProgressSync()) {
      return;
    }

    if (this.accountSyncTimer) {
      globalThis.clearTimeout(this.accountSyncTimer);
    }

    this.accountSyncTimer = globalThis.setTimeout(() => {
      this.accountSyncTimer = null;
      void this.pushAccountProgress();
    }, immediate ? 0 : 320);
  }

  private async hydrateAccountProgress(): Promise<void> {
    this.accountSyncState = "syncing";
    this.accountSyncMessage = "账号：正在同步";
    this.refreshAccountSyncOverlay();

    const task = (async () => {
      try {
        const accountProgress = await this.fetchAccountProgress();
        if (accountProgress === "guest") {
          this.accountSyncState = "guest";
          this.accountSyncMessage = "账号：未登录，继续使用本地档";
          return;
        }
        if (!accountProgress) {
          this.accountSyncState = "local";
          this.accountSyncMessage = "账号：接口不可用，继续使用本地档";
          return;
        }

        const mergedProgress = this.mergeLocalAndAccountProgress(accountProgress);
        this.applyMergedAccountProgress(mergedProgress);
        this.accountSyncState = "ready";
        this.accountSyncMessage = "账号：已同步长期进度";
        this.queueAccountProgressPush(true);
      } catch (error) {
        console.warn("[Hulebu] account progress hydrate failed", error);
        this.accountSyncState = "error";
        this.accountSyncMessage = "账号：同步失败，继续使用本地档";
      } finally {
        this.accountSyncPromise = null;
        this.refreshAccountSyncOverlay();
      }
    })();

    this.accountSyncPromise = task;
    await task;
  }

  private async pushAccountProgress(): Promise<void> {
    if (this.suppressAccountSyncPush || !this.canUseAccountProgressSync()) {
      return;
    }

    try {
      const response = await fetch(HULEBU_ACCOUNT_PROGRESS_ENDPOINT, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify(this.createAccountProgressPayload()),
      });

      if (response.status === 401) {
        this.accountSyncState = "guest";
        this.accountSyncMessage = "账号：未登录，继续使用本地档";
        this.refreshAccountSyncOverlay();
        return;
      }

      if (!response.ok) {
        this.accountSyncState = "error";
        this.accountSyncMessage = "账号：同步失败，继续使用本地档";
        this.refreshAccountSyncOverlay();
        return;
      }

      this.accountSyncState = "ready";
      this.accountSyncMessage = "账号：已同步长期进度";
      this.refreshAccountSyncOverlay();
    } catch (error) {
      console.warn("[Hulebu] account progress push failed", error);
      this.accountSyncState = "error";
      this.accountSyncMessage = "账号：同步失败，继续使用本地档";
      this.refreshAccountSyncOverlay();
    }
  }

  private async fetchAccountProgress(): Promise<HulebuAccountProgressRecord | "guest" | null> {
    const response = await fetch(HULEBU_ACCOUNT_PROGRESS_ENDPOINT, {
      method: "GET",
      credentials: "include",
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (response.status === 401) {
      return "guest";
    }

    if (!response.ok) {
      return null;
    }

    return sanitizeAccountProgressRecord(await response.json().catch(() => null));
  }

  private createAccountProgressPayload(): HulebuAccountProgressRecord {
    return {
      bankedCoins: Math.max(0, this.metaCoins),
      bestEndlessLayer: Math.max(0, this.metaProgress.bestEndlessLayer),
      bestAscensionLevel: mapAdvancedTierToAccountLevel(this.metaProgress.bestAdvancedTier),
      dailyBestLevels: { ...this.metaProgress.dailyBestLevels },
      dailyStreak: Math.max(0, this.metaProgress.dailyStreak),
      lastDailySeed: this.metaProgress.lastDailySeed,
      achievements: { ...this.achievements },
      upgrades: {
        reserveBonus: this.metaUpgrades.reserveBonus,
        shieldBonus: this.metaUpgrades.shieldBonus,
        toolBonus: this.metaUpgrades.toolBonus,
        riverBonus: this.metaUpgrades.riverBonus,
        startingCoins: this.metaUpgrades.startingCoins,
        visionBonus: this.metaUpgrades.visionBonus,
      },
      activeRun: createCocosAccountActiveRunPayload(this.activeRunSnapshot),
    };
  }

  private mergeLocalAndAccountProgress(accountProgress: HulebuAccountProgressRecord): HulebuAccountProgressRecord {
    const localProgress = this.createAccountProgressPayload();
    return {
      bankedCoins: Math.max(localProgress.bankedCoins, accountProgress.bankedCoins),
      bestEndlessLayer: Math.max(localProgress.bestEndlessLayer, accountProgress.bestEndlessLayer),
      bestAscensionLevel: Math.max(localProgress.bestAscensionLevel, accountProgress.bestAscensionLevel),
      dailyBestLevels: mergeNumberMaps(accountProgress.dailyBestLevels, localProgress.dailyBestLevels),
      dailyStreak: Math.max(localProgress.dailyStreak, accountProgress.dailyStreak),
      lastDailySeed: localProgress.lastDailySeed ?? accountProgress.lastDailySeed,
      achievements: {
        ...accountProgress.achievements,
        ...localProgress.achievements,
      },
      upgrades: mergeNumberMaps(accountProgress.upgrades, localProgress.upgrades),
      activeRun: pickLatestAccountActiveRun(accountProgress.activeRun, localProgress.activeRun),
    };
  }

  private applyMergedAccountProgress(progress: HulebuAccountProgressRecord): void {
    this.suppressAccountSyncPush = true;
    try {
      this.metaCoins = progress.bankedCoins;
      this.metaUpgrades = {
        reserveBonus: progress.upgrades.reserveBonus ?? this.metaUpgrades.reserveBonus,
        shieldBonus: progress.upgrades.shieldBonus ?? this.metaUpgrades.shieldBonus,
        toolBonus: progress.upgrades.toolBonus ?? this.metaUpgrades.toolBonus,
        riverBonus: progress.upgrades.riverBonus ?? this.metaUpgrades.riverBonus,
        startingCoins: progress.upgrades.startingCoins ?? this.metaUpgrades.startingCoins,
        visionBonus: progress.upgrades.visionBonus ?? this.metaUpgrades.visionBonus,
      };
      this.metaProgress = {
        ...this.metaProgress,
        bestEndlessLayer: progress.bestEndlessLayer,
        dailyBestLevels: { ...progress.dailyBestLevels },
        dailyStreak: progress.dailyStreak,
        lastDailySeed: progress.lastDailySeed,
        bestAdvancedTier: getHigherAdvancedTier(
          this.metaProgress.bestAdvancedTier,
          mapAccountLevelToAdvancedTier(progress.bestAscensionLevel),
        ),
      };
      this.achievements = { ...progress.achievements };
      const mergedActiveRun = this.decodeAccountActiveRunSnapshot(progress.activeRun);
      if (mergedActiveRun) {
        const snapshot = mergedActiveRun;
        const saveResult = this.activeRunSaveService.save(snapshot);
        if (saveResult.status === "committed") {
          this.activeRunSnapshot = snapshot;
        }
      } else if (progress.activeRun === null) {
        const clearResult = this.activeRunSaveService.clear();
        if (clearResult.status === "cleared") {
          this.activeRunSnapshot = null;
        }
      }

      sys.localStorage.setItem(HULEBU_META_PROFILE_STORAGE_KEY, JSON.stringify({
        metaCoins: this.metaCoins,
        metaUpgrades: this.metaUpgrades,
      } satisfies HulebuMetaProfileSnapshot));
      sys.localStorage.setItem(HULEBU_META_PROGRESS_STORAGE_KEY, JSON.stringify(this.metaProgress));
      sys.localStorage.setItem(HULEBU_ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(this.achievements));
    } finally {
      this.suppressAccountSyncPush = false;
    }
  }

  private decodeAccountActiveRunSnapshot(activeRun: Record<string, unknown> | null): HulebuActiveRunSnapshot | null {
    if (!activeRun || typeof activeRun.cocosSnapshot !== "object" || !activeRun.cocosSnapshot) {
      return null;
    }
    const values = new Map<string, string>([
      [HULEBU_ACTIVE_RUN_STORAGE_KEY, JSON.stringify(activeRun.cocosSnapshot)],
    ]);
    const service = this.createActiveRunSaveService({
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => { values.delete(key); },
    });
    const loadResult = service.load();
    return loadResult.status === "loaded" ? loadResult.value : null;
  }

  private prepareFlowOverlay(): Node {
    const overlay = this.rewardOverlay ?? this.ensureChild(this.node, "RewardOverlay");
    this.rewardOverlay = overlay;
    overlay.active = true;
    overlay.layer = this.node.layer;
    overlay.setPosition(new Vec3(0, 0, 100));
    overlay.setSiblingIndex(this.node.children.length - 1);
    overlay.children.slice().forEach((child) => {
      child.removeFromParent();
      child.destroy();
    });
    return overlay;
  }

  private hideFlowOverlay(): void {
    if (this.rewardOverlay) {
      this.rewardOverlay.active = false;
    }
  }

  private drawOverlayPanel(
    overlay: Node,
    layout: RuntimeLayout,
    width = 300,
    height = 186,
    spritePath: string = OVERLAY_PANEL_BG_SPRITE,
  ): void {
    const backdrop = this.drawRoundedPanel(
      overlay,
      "OverlayBackdrop",
      layout.width / 2,
      layout.height / 2,
      layout.width,
      layout.height,
      0,
      OVERLAY_BACKDROP,
      OVERLAY_BACKDROP,
      0,
      layout,
    );
    backdrop.getComponent(BlockInputEvents) ?? backdrop.addComponent(BlockInputEvents);
    const panel = this.drawRoundedPanel(
      overlay,
      "OverlayPanel",
      layout.width / 2,
      layout.height / 2,
      scaleLayoutValue(width, layout.scale),
      scaleLayoutValue(height, layout.scale),
      scaleLayoutValue(16, layout.scale),
      PLAQUE_FILL,
      PLAQUE_STROKE,
      scaleLayoutValue(4, layout.scale),
      layout,
    );
    this.applyOverlayPanelSprite(panel, layout, width, height, spritePath);
  }

  private writeOverlayLabel(
    overlay: Node,
    name: string,
    text: string,
    fontSize: number,
    color: Color,
    yOffset: number,
  ): void {
    const labelNode = this.ensureChild(overlay, name);
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    labelNode.layer = overlay.layer;
    labelNode.setPosition(new Vec3(0, scaleLayoutValue(yOffset, layout.scale), 1));
    const labelTransform = labelNode.getComponent(UITransform) ?? labelNode.addComponent(UITransform);
    labelTransform.setContentSize(scaleLayoutValue(280, layout.scale), scaleLayoutValue(36, layout.scale));
    const label = labelNode.getComponent(Label) ?? labelNode.addComponent(Label);
    label.string = text;
    label.fontSize = scaleLayoutValue(fontSize, layout.scale);
    label.lineHeight = scaleLayoutValue(fontSize + 5, layout.scale);
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    label.color = color;
  }

  private writeOverlaySummaryLine(overlay: Node, name: string, text: string, yOffset: number): void {
    const labelNode = this.ensureChild(overlay, name);
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    labelNode.layer = overlay.layer;
    labelNode.setPosition(new Vec3(0, scaleLayoutValue(yOffset, layout.scale), 1));
    const labelTransform = labelNode.getComponent(UITransform) ?? labelNode.addComponent(UITransform);
    labelTransform.setContentSize(scaleLayoutValue(296, layout.scale), scaleLayoutValue(28, layout.scale));
    const label = labelNode.getComponent(Label) ?? labelNode.addComponent(Label);
    label.string = text;
    label.fontSize = scaleLayoutValue(12, layout.scale);
    label.lineHeight = scaleLayoutValue(17, layout.scale);
    label.horizontalAlign = Label.HorizontalAlign.LEFT;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    label.color = new Color(96, 64, 38, 255);
  }

  private createOverlayButton(
    overlay: Node,
    name: string,
    text: string,
    x: number,
    y: number,
    handler: () => void,
    width = 116,
    height = 44,
    secondaryText = "",
  ): Node {
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    const node = this.drawRoundedPanel(
      overlay,
      name,
      layout.width / 2 + scaleLayoutValue(x, layout.scale),
      layout.height / 2 + scaleLayoutValue(y, layout.scale),
      scaleLayoutValue(width, layout.scale),
      scaleLayoutValue(height, layout.scale),
      scaleLayoutValue(9, layout.scale),
      TOOL_FILL,
      PLAQUE_STROKE,
      scaleLayoutValue(3, layout.scale),
      layout,
    );
    node.getComponent(Button) ?? node.addComponent(Button);
    node.on(Node.EventType.TOUCH_END, handler, this);
    node.on(Button.EventType.CLICK, handler, this);
    if (secondaryText) {
      this.writeShellLabel(node, "Label", text, scaleLayoutValue(15, layout.scale), new Color(255, 246, 216, 255), scaleLayoutValue(15, layout.scale));
      this.writeShellLabel(node, "MetaLabel", secondaryText, scaleLayoutValue(10, layout.scale), new Color(238, 211, 158, 255), scaleLayoutValue(-20, layout.scale));
    } else {
      this.writeShellLabel(node, "Label", text, scaleLayoutValue(15, layout.scale), new Color(255, 246, 216, 255));
    }
    return node;
  }

  private ensureCanvasHost(): RuntimeLayout {
    const visibleSize = resolveHulebuRuntimeLayout();
    const width = visibleSize.width;
    const height = visibleSize.height;
    const uiTransform = this.node.getComponent(UITransform) ?? this.node.addComponent(UITransform);
    uiTransform.setContentSize(width, height);
    const canvas = this.node.getComponent(Canvas) ?? this.node.addComponent(Canvas);
    canvas.alignCanvasWithScreen = true;
    canvas.cameraComponent = this.ensureRuntimeCamera(visibleSize);
    return visibleSize;
  }

  private ensureRuntimeCamera(layout: RuntimeLayout): Camera {
    const cameraNode = this.ensureChild(this.node, RUNTIME_CAMERA_NAME);
    cameraNode.layer = this.node.layer;
    cameraNode.setPosition(new Vec3(0, 0, CAMERA_Z));

    const camera = cameraNode.getComponent(Camera) ?? cameraNode.addComponent(Camera);
    camera.projection = Camera.ProjectionType.ORTHO;
    camera.orthoHeight = layout.height / 2;
    camera.near = 1;
    camera.far = CAMERA_Z * 2;
    camera.clearFlags = Camera.ClearFlag.SOLID_COLOR;
    camera.clearColor = new Color(7, 18, 16, 255);
    camera.visibility = Layers.BitMask.ALL;
    return camera;
  }

  private findComponent<T extends Component>(nodeName: string, componentType: new () => T): T | null {
    const target = this.node.getChildByName(nodeName);
    if (!target) {
      return null;
    }

    return target.getComponent(componentType) ?? target.addComponent(componentType);
  }

  private ensureVisualShell(layout: RuntimeLayout, levelOrder = 1): void {
    const shellRoot = this.ensureChild(this.node, SHELL_ROOT_NAME);
    shellRoot.active = true;
    shellRoot.layer = this.node.layer;
    shellRoot.setSiblingIndex(0);

    const tableRect = this.resolveTableRect(layout);

    this.drawGreenTableFelt(shellRoot, layout);
    this.drawTopPlaques(shellRoot, layout, levelOrder, tableRect);
    const toolRoot = this.ensureToolOverlayRoot();
    this.drawCounterEntry(toolRoot, layout);
    this.drawRightToolButtons(toolRoot, layout, tableRect);
    this.drawExitButton(toolRoot, layout);
  }

  private resolveTableRect(layout: RuntimeLayout): { centerX: number; centerY: number; width: number; height: number; top: number; bottom: number } {
    const zones = resolveHulebuPortraitZones(layout);
    const top = zones.tableTop;
    const bottom = zones.tableBottom;
    const height = Math.max(200, layout.height - top - bottom);
    const width = layout.width;
    return {
      centerX: Math.round(width / 2),
      centerY: Math.round(top + height / 2),
      width,
      height,
      top,
      bottom,
    };
  }

  private ensureToolOverlayRoot(): Node {
    const toolRoot = this.ensureChild(this.node, TOOL_OVERLAY_ROOT_NAME);
    toolRoot.active = true;
    toolRoot.layer = this.node.layer;
    toolRoot.setSiblingIndex(this.node.children.length - 1);
    return toolRoot;
  }

  private drawCounterEntry(root: Node, layout: RuntimeLayout): void {
    const zones = resolveHulebuPortraitZones(layout);
    this.drawTopPlaque(
      root,
      "CounterPlaque",
      scaleLayoutValue(82, layout.scale),
      zones.topPlaqueY - scaleLayoutValue(58, layout.scale),
      162,
      52,
      "",
      layout,
    );
    const target = root.getChildByName("CounterPlaque");
    if (!target) {
      return;
    }
    target.active = true;
    target.getComponent(Button) ?? target.addComponent(Button);
    target.off(Node.EventType.TOUCH_END);
    target.off(Button.EventType.CLICK);
    target.on(Node.EventType.TOUCH_END, this.toggleTileCounterOverlay, this);
    target.setSiblingIndex(root.children.length - 1);
  }

  private drawGreenTableFelt(root: Node, layout: RuntimeLayout): void {
    const felt = this.drawRoundedPanel(
      root,
      "GreenTableFelt",
      layout.width / 2,
      layout.height / 2,
      layout.width,
      layout.height,
      0,
      TABLE_FELT_FILL,
      TABLE_FELT_FILL,
      0,
      layout,
    );

    const rim = this.drawRoundedPanel(
      root,
      "TableRim",
      layout.width / 2,
      scaleLayoutValue(layout.cssHeight * 0.49, layout.scale),
      scaleLayoutValue(Math.min(360, layout.cssWidth - 18), layout.scale),
      scaleLayoutValue(layout.cssHeight * 0.76, layout.scale),
      scaleLayoutValue(34, layout.scale),
      new Color(45, 107, 83, 255),
      TABLE_RIM_FILL,
      scaleLayoutValue(8, layout.scale),
      layout,
    );

    const lowerShade = this.drawRoundedPanel(
      root,
      "TableLowerShade",
      layout.width / 2,
      scaleLayoutValue(170, layout.scale),
      layout.width,
      scaleLayoutValue(260, layout.scale),
      0,
      TABLE_FELT_SHADOW,
      TABLE_FELT_SHADOW,
      0,
      layout,
    );

    this.applySceneBackgroundSprite(root, layout, [felt, rim, lowerShade]);
  }

  private drawTopPlaques(root: Node, layout: RuntimeLayout, levelOrder: number, tableRect: { centerX: number; centerY: number; width: number; height: number }): void {
    const zones = resolveHulebuPortraitZones(layout);
    const y = zones.topPlaqueY;
    this.drawTopPlaque(
      root,
      "LevelPlaque",
      scaleLayoutValue(58, layout.scale),
      y,
      108,
      54,
      `关卡\n${this.formatLevelLabel(levelOrder)}`,
      layout,
    );
    this.drawTopPlaque(root, "ScorePlaque", scaleLayoutValue(166, layout.scale), y, 94, 52, "分数\n0", layout);
    this.drawTopPlaque(
      root,
      "ProgressPlaque",
      scaleLayoutValue(274, layout.scale),
      y,
      112,
      52,
      "余牌 42",
      layout,
    );

    this.drawProgressDots(root, layout);
  }

  private applyShellHud(hud: HulebuHudModel): void {
    const shellRoot = this.node.getChildByName(SHELL_ROOT_NAME);
    if (!shellRoot?.active) {
      this.hud?.applyHud(hud);
      return;
    }

    this.updateScorePlaque(shellRoot, stripHudPrefix(hud.scoreText, "分"));
    this.updateProgressPlaque(shellRoot, hud.bossText ? hud.bossText : hud.boardRemainingText);
    const toolRoot = this.ensureToolOverlayRoot();
    this.drawCounterEntry(toolRoot, this.latestLayout ?? resolveHulebuRuntimeLayout());
    this.updateCounterPlaque(toolRoot);
    this.drawTileCounterOverlay(toolRoot, hud);
    this.updateShellToolBadges(toolRoot, hud.toolText);
  }

  private toggleTileCounterOverlay(): void {
    const now = Date.now();
    if (now - this.lastCounterToggleAt < 100) {
      return;
    }
    this.lastCounterToggleAt = now;
    this.counterExpanded = !this.counterExpanded;
    if (this.latestSceneModel) {
      this.applyShellHud(this.latestSceneModel.hud);
    }
  }

  private bindCounterInputEvents(): void {
    input.on(Input.EventType.TOUCH_END, this.counterTouchEndHandler, this);
    input.on(Input.EventType.MOUSE_UP, this.counterMouseUpHandler, this);
  }

  private unbindCounterInputEvents(): void {
    input.off(Input.EventType.TOUCH_END, this.counterTouchEndHandler, this);
    input.off(Input.EventType.MOUSE_UP, this.counterMouseUpHandler, this);
  }

  private handleCounterInputEnd(pointer: { x: number; y: number }): void {
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    const centerX = scaleLayoutValue(82, layout.scale);
    const centerY = resolveHulebuPortraitZones(layout).topPlaqueY - scaleLayoutValue(58, layout.scale);
    if (Math.abs(pointer.x - centerX) > scaleLayoutValue(81, layout.scale)
      || Math.abs(pointer.y - centerY) > scaleLayoutValue(26, layout.scale)) {
      return;
    }
    this.toggleTileCounterOverlay();
  }

  private drawTileCounterOverlay(root: Node, hud: HulebuHudModel): void {
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    const position = this.resolveTileCounterOverlayPosition(layout);
    const panel = this.drawRoundedPanel(
      root,
      "CounterExpandedPanel",
      position.x,
      position.y,
      scaleLayoutValue(342, layout.scale),
      scaleLayoutValue(238, layout.scale),
      scaleLayoutValue(16, layout.scale),
      new Color(7, 64, 50, 248),
      PLAQUE_STROKE,
      scaleLayoutValue(3, layout.scale),
      layout,
    );
    panel.active = this.counterExpanded;
    panel.setSiblingIndex(root.children.length - 1);
    panel.getComponent(BlockInputEvents) ?? panel.addComponent(BlockInputEvents);
    panel.getComponent(Button) ?? panel.addComponent(Button);
    panel.off(Node.EventType.TOUCH_END);
    panel.off(Button.EventType.CLICK);
    panel.on(Node.EventType.TOUCH_END, this.toggleTileCounterOverlay, this);

    this.writeShellLabel(
      panel,
      "Title",
      "记牌器",
      scaleLayoutValue(14, layout.scale),
      new Color(250, 226, 171, 255),
      scaleLayoutValue(98, layout.scale),
    );

    hud.tileCounter.suits.forEach((suit, suitIndex) => {
      const rowY = scaleLayoutValue(62 - suitIndex * 44, layout.scale);
      const label = this.writeShellLabel(
        panel,
        `SuitLabel_${suit.suit}`,
        suit.label,
        scaleLayoutValue(12, layout.scale),
        new Color(250, 226, 171, 255),
      );
      label.node.setPosition(new Vec3(-scaleLayoutValue(162, layout.scale), rowY, 1));
      const labelTransform = label.node.getComponent(UITransform) ?? label.node.addComponent(UITransform);
      labelTransform.setContentSize(scaleLayoutValue(42, layout.scale), scaleLayoutValue(30, layout.scale));

      suit.tiles.forEach((tile, tileIndex) => {
        this.drawCounterTileCell(panel, tile, tileIndex, rowY, layout);
      });
    });
  }

  private resolveTileCounterOverlayPosition(layout: RuntimeLayout): { x: number; y: number } {
    const zones = resolveHulebuPortraitZones(layout);
    const panelHalfWidth = scaleLayoutValue(171, layout.scale);
    const panelHalfHeight = scaleLayoutValue(119, layout.scale);
    const counterCenterY = zones.topPlaqueY - scaleLayoutValue(58, layout.scale);
    return {
      x: panelHalfWidth + scaleLayoutValue(4, layout.scale),
      y: counterCenterY - scaleLayoutValue(34, layout.scale) - panelHalfHeight,
    };
  }

  private drawCounterTileCell(
    panel: Node,
    tile: HulebuTileCounterItemModel,
    tileIndex: number,
    rowY: number,
    layout: RuntimeLayout,
  ): void {
    const cell = this.ensureChild(panel, `CounterTile_${tile.prefabKey}`);
    cell.setPosition(new Vec3(
      -scaleLayoutValue(122, layout.scale) + tileIndex * scaleLayoutValue(31, layout.scale),
      rowY,
      1,
    ));
    const cellTransform = cell.getComponent(UITransform) ?? cell.addComponent(UITransform);
    cellTransform.setContentSize(scaleLayoutValue(25, layout.scale), scaleLayoutValue(38, layout.scale));
    cell.getComponent(Graphics)?.clear();
    cell.active = true;
    cell.layer = panel.layer;

    const artNode = this.ensureChild(cell, "Art");
    artNode.layer = cell.layer;
    artNode.setPosition(new Vec3(0, scaleLayoutValue(3, layout.scale), 1));
    const artTransform = artNode.getComponent(UITransform) ?? artNode.addComponent(UITransform);
    artTransform.setContentSize(scaleLayoutValue(21, layout.scale), scaleLayoutValue(27, layout.scale));
    const sprite = artNode.getComponent(Sprite) ?? artNode.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    artNode.active = false;
    this.tileSpriteCatalog.loadTileSpriteFrame(tile.prefabKey, (spriteFrame) => {
      if (!spriteFrame) {
        artNode.active = false;
        return;
      }
      if (!safeApplySpriteFrame(artNode, sprite, spriteFrame)) {
        return;
      }
      artNode.active = true;
    });

    const countLabel = this.writeShellLabel(
      cell,
      "Count",
      String(tile.count),
      scaleLayoutValue(10, layout.scale),
      tile.count > 0 ? new Color(255, 239, 194, 255) : new Color(166, 158, 139, 255),
      -scaleLayoutValue(14, layout.scale),
    );
    const countTransform = countLabel.node.getComponent(UITransform) ?? countLabel.node.addComponent(UITransform);
    countTransform.setContentSize(scaleLayoutValue(24, layout.scale), scaleLayoutValue(12, layout.scale));
    countLabel.node.setSiblingIndex(cell.children.length - 1);
  }

  private updateShellPlaqueText(root: Node, plaqueName: string, text: string, fontSize = 15): void {
    const plaque = root.getChildByName(plaqueName);
    if (!plaque) {
      return;
    }

    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    this.writeShellLabel(plaque, "Label", text, scaleLayoutValue(fontSize, layout.scale), PLAQUE_TEXT);
  }

  private updateScorePlaque(root: Node, value: string): void {
    const plaque = root.getChildByName("ScorePlaque");
    if (!plaque) {
      return;
    }
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    this.drawScorePlaqueValue(plaque, value, layout);
  }

  private updateProgressPlaque(root: Node, value: string): void {
    const plaque = root.getChildByName("ProgressPlaque");
    if (!plaque) {
      return;
    }
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    this.drawProgressPlaqueValue(plaque, value, layout);
  }

  private updateCounterPlaque(root: Node): void {
    const plaque = root.getChildByName("CounterPlaque");
    if (!plaque) {
      return;
    }
    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    this.drawCounterPlaqueValue(plaque, layout);
  }

  private updateShellToolBadges(root: Node, toolText: string): void {
    const counts = parseToolCounts(toolText);
    this.updateShellToolBadge(root, "ToolButton_Wash", counts.wash);
    this.updateShellToolBadge(root, "ToolButton_Undo", counts.undo);
    this.updateShellToolBadge(root, "ToolButton_Hint", counts.discard);
  }

  private updateShellToolBadge(root: Node, toolName: string, count: string | null): void {
    if (count === null) {
      return;
    }

    const button = root.getChildByName(toolName);
    const badgeBack = button?.getChildByName("BadgeBack");
    if (!badgeBack) {
      return;
    }

    const layout = this.latestLayout ?? resolveHulebuRuntimeLayout();
    this.writeShellLabel(badgeBack, "Label", count, scaleLayoutValue(11, layout.scale), new Color(255, 248, 225, 255));
  }

  private formatLevelLabel(levelOrder: number): string {
    const chapter = Math.floor((levelOrder - 1) / 10) + 1;
    const stage = ((levelOrder - 1) % 10) + 1;
    return `${chapter}-${stage}`;
  }

  private drawTopPlaque(
    root: Node,
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    layout: RuntimeLayout,
  ): void {
    const node = this.drawRoundedPanel(
      root,
      name,
      x,
      y,
      scaleLayoutValue(width, layout.scale),
      scaleLayoutValue(height, layout.scale),
      scaleLayoutValue(12, layout.scale),
      PLAQUE_FILL,
      PLAQUE_STROKE,
      scaleLayoutValue(3, layout.scale),
      layout,
    );
    this.applyTopPlaqueSprite(node, name);
    if (name === "LevelPlaque") {
      this.drawLevelPlaqueValue(node, text, layout);
    } else if (name === "ScorePlaque") {
      this.drawScorePlaqueValue(node, "0", layout);
    } else if (name === "ProgressPlaque") {
      this.drawProgressPlaqueValue(node, text, layout);
    } else if (name === "CounterPlaque") {
      this.drawCounterPlaqueValue(node, layout);
    } else {
      this.writeShellLabel(node, "Label", text, scaleLayoutValue(15, layout.scale), PLAQUE_TEXT);
    }
  }

  private drawLevelPlaqueValue(plaque: Node, value: string, layout: RuntimeLayout): void {
    const face = this.drawRoundedPanel(
      plaque,
      "DynamicLevelFace",
      0,
      0,
      scaleLayoutValue(82, layout.scale),
      scaleLayoutValue(38, layout.scale),
      scaleLayoutValue(12, layout.scale),
      new Color(6, 63, 48, 255),
      new Color(6, 63, 48, 255),
      0,
    );
    face.setSiblingIndex(plaque.children.length - 1);
    this.writeShellLabel(face, "Value", value, scaleLayoutValue(14, layout.scale), new Color(250, 226, 171, 255));
  }

  private drawScorePlaqueValue(plaque: Node, value: string, layout: RuntimeLayout): void {
    const oldMask = plaque.getChildByName("DynamicScoreMask");
    oldMask?.destroy();
    const face = this.drawRoundedPanel(
      plaque,
      "DynamicScoreFace",
      0,
      0,
      scaleLayoutValue(70, layout.scale),
      scaleLayoutValue(38, layout.scale),
      scaleLayoutValue(9, layout.scale),
      new Color(241, 224, 188, 255),
      new Color(241, 224, 188, 255),
      0,
    );
    face.setSiblingIndex(plaque.children.length - 1);
    this.writeShellLabel(face, "Title", "分数", scaleLayoutValue(10, layout.scale), PLAQUE_TEXT, scaleLayoutValue(10, layout.scale));
    this.writeShellLabel(
      face,
      "DynamicScoreValue",
      value,
      scaleLayoutValue(17, layout.scale),
      new Color(18, 86, 65, 255),
      -scaleLayoutValue(9, layout.scale),
    ).node.setSiblingIndex(face.children.length - 1);
  }

  private drawProgressPlaqueValue(plaque: Node, value: string, layout: RuntimeLayout): void {
    const face = this.drawRoundedPanel(
      plaque,
      "DynamicProgressFace",
      0,
      0,
      scaleLayoutValue(92, layout.scale),
      scaleLayoutValue(36, layout.scale),
      scaleLayoutValue(9, layout.scale),
      new Color(8, 68, 52, 255),
      new Color(202, 156, 73, 255),
      scaleLayoutValue(1, layout.scale),
    );
    face.setSiblingIndex(plaque.children.length - 1);
    this.writeShellLabel(face, "Value", value, scaleLayoutValue(14, layout.scale), new Color(250, 226, 171, 255));
  }

  private drawCounterPlaqueValue(plaque: Node, layout: RuntimeLayout): void {
    const mask = this.drawRoundedPanel(
      plaque,
      "DynamicCounterMask",
      0,
      0,
      scaleLayoutValue(144, layout.scale),
      scaleLayoutValue(38, layout.scale),
      scaleLayoutValue(8, layout.scale),
      new Color(8, 68, 52, 255),
      new Color(202, 156, 73, 255),
      scaleLayoutValue(1, layout.scale),
    );
    mask.setSiblingIndex(plaque.children.length - 1);
    this.writeShellLabel(
      mask,
      "Value",
      "记牌器",
      scaleLayoutValue(17, layout.scale),
      new Color(250, 226, 171, 255),
    ).node.setSiblingIndex(mask.children.length - 1);
  }

  private drawProgressDots(root: Node, layout: RuntimeLayout): void {
    const y = resolveHulebuPortraitZones(layout).progressDotY;
    const startX = scaleLayoutValue(276, layout.scale);
    const gap = scaleLayoutValue(24, layout.scale);
    for (let index = 0; index < 4; index += 1) {
      const dot = this.drawRoundedPanel(
        root,
        `ProgressDot_${index}`,
        startX + index * gap,
        y,
        scaleLayoutValue(13, layout.scale),
        scaleLayoutValue(13, layout.scale),
        scaleLayoutValue(7, layout.scale),
        index === 0 ? JADE_FILL : new Color(218, 187, 137, 255),
        PLAQUE_STROKE,
        scaleLayoutValue(2, layout.scale),
        layout,
      );
      dot.setSiblingIndex(root.children.length - 1);
    }
  }

  private drawRightToolButtons(root: Node, layout: RuntimeLayout, tableRect: { centerX: number; centerY: number; width: number; height: number }): void {
    const x = tableRect.centerX + tableRect.width / 2 - scaleLayoutValue(30, layout.scale);
    const toolSpacing = scaleLayoutValue(68, layout.scale);
    const tools = [
      { name: "ToolButton_Wash", label: "洗牌", count: "3", offset: 1, handler: () => this.useShuffleTool() },
      { name: "ToolButton_Undo", label: "撤回", count: "3", offset: 0, handler: () => this.useUndoTool() },
      { name: "ToolButton_Hint", label: "打牌", count: "3", offset: -1, handler: () => this.startDiscardSelection() },
    ];

    tools.forEach((tool) => {
      this.drawToolButton(
        root,
        tool.name,
        x,
        tableRect.centerY + tool.offset * toolSpacing,
        tool.label,
        tool.count,
        tool.handler,
        layout,
      );
    });
  }

  private drawExitButton(root: Node, layout: RuntimeLayout): void {
    const node = this.drawRoundedPanel(
      root,
      "ExitButton",
      layout.width - scaleLayoutValue(18, layout.scale),
      resolveHulebuPortraitZones(layout).topPlaqueY,
      scaleLayoutValue(32, layout.scale),
      scaleLayoutValue(32, layout.scale),
      scaleLayoutValue(16, layout.scale),
      new Color(8, 68, 52, 245),
      new Color(202, 156, 73, 255),
      scaleLayoutValue(2, layout.scale),
      layout,
    );
    node.getComponent(Button) ?? node.addComponent(Button);
    node.off(Node.EventType.TOUCH_END);
    node.on(Node.EventType.TOUCH_END, this.returnToLobby, this);
    this.writeShellLabel(node, "Label", "×", scaleLayoutValue(22, layout.scale), new Color(250, 226, 171, 255));
    node.setSiblingIndex(root.children.length - 1);
  }

  private drawToolButton(
    root: Node,
    name: string,
    x: number,
    y: number,
    label: string,
    count: string,
    handler: (() => void) | null,
    layout: RuntimeLayout,
  ): void {
    const node = this.drawRoundedPanel(
      root,
      name,
      x,
      y,
      scaleLayoutValue(46, layout.scale),
      scaleLayoutValue(56, layout.scale),
      scaleLayoutValue(16, layout.scale),
      TOOL_FILL,
      PLAQUE_STROKE,
      scaleLayoutValue(3, layout.scale),
      layout,
    );
    node.setSiblingIndex(root.children.length - 1);
    if (handler) {
      node.getComponent(Button) ?? node.addComponent(Button);
      node.off(Node.EventType.TOUCH_END);
      node.off(Button.EventType.CLICK);
      node.on(Node.EventType.TOUCH_END, handler, this);
      node.on(Button.EventType.CLICK, handler, this);
    }
    const labelNode = this.writeShellLabel(node, "Label", label, scaleLayoutValue(12, layout.scale), new Color(255, 246, 216, 255), -8).node;
    this.applyToolButtonSprite(node, name, layout, labelNode);
    const badge = this.ensureChild(node, "Badge");
    badge.setPosition(new Vec3(scaleLayoutValue(20, layout.scale), -scaleLayoutValue(21, layout.scale), 0));
    this.drawRoundedPanel(
      node,
      "BadgeBack",
      badge.position.x,
      badge.position.y,
      scaleLayoutValue(18, layout.scale),
      scaleLayoutValue(18, layout.scale),
      scaleLayoutValue(9, layout.scale),
      new Color(174, 50, 44, 255),
      PLAQUE_FILL,
      scaleLayoutValue(2, layout.scale),
    );
    this.writeShellLabel(node.getChildByName("BadgeBack")!, "Label", count, scaleLayoutValue(11, layout.scale), new Color(255, 248, 225, 255));
  }

  private applyToolButtonSprite(node: Node, name: string, layout: RuntimeLayout, labelNode: Node): void {
    const spritePath = TOOL_BUTTON_SPRITES[name];
    if (!spritePath) {
      return;
    }

    const artNode = this.ensureChild(node, "ToolArt");
    artNode.layer = node.layer;
    artNode.setPosition(new Vec3(0, scaleLayoutValue(2, layout.scale), 1));
    const uiTransform = artNode.getComponent(UITransform) ?? artNode.addComponent(UITransform);
    uiTransform.setContentSize(scaleLayoutValue(54, layout.scale), scaleLayoutValue(54, layout.scale));
    const sprite = artNode.getComponent(Sprite) ?? artNode.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    artNode.active = false;
    labelNode.active = true;

    resources.load(spritePath, SpriteFrame, (error, spriteFrame) => {
      if (error || !spriteFrame) {
        artNode.active = false;
        labelNode.active = true;
        return;
      }

      if (!safeApplySpriteFrame(artNode, sprite, spriteFrame)) {
        return;
      }
      artNode.active = true;
      labelNode.active = false;
    });
  }

  private applySceneBackgroundSprite(root: Node, layout: RuntimeLayout, fallbackNodes: Node[]): void {
    const artNode = this.ensureChild(root, "SceneBackgroundArt");
    artNode.layer = root.layer;
    artNode.setPosition(new Vec3(0, 0, 0));
    artNode.setSiblingIndex(0);
    const uiTransform = artNode.getComponent(UITransform) ?? artNode.addComponent(UITransform);
    uiTransform.setContentSize(layout.width, layout.height);
    const sprite = artNode.getComponent(Sprite) ?? artNode.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    artNode.active = false;
    fallbackNodes.forEach((node) => {
      node.active = true;
    });

    resources.load(HULEBU_SCENE_BACKGROUND_SPRITE, SpriteFrame, (error, spriteFrame) => {
      if (error || !spriteFrame) {
        artNode.active = false;
        fallbackNodes.forEach((node) => {
          node.active = true;
        });
        return;
      }

      if (!safeApplySpriteFrame(artNode, sprite, spriteFrame)) {
        return;
      }
      artNode.active = true;
      artNode.setSiblingIndex(0);
      fallbackNodes.forEach((node) => {
        node.active = false;
      });
    });
  }

  private applyOverlayPanelSprite(
    node: Node,
    layout: RuntimeLayout,
    width: number,
    height: number,
    spritePath: string,
  ): void {
    const artNode = this.ensureChild(node, "OverlayPanelArt");
    artNode.layer = node.layer;
    artNode.setPosition(new Vec3(0, 0, 1));
    const uiTransform = artNode.getComponent(UITransform) ?? artNode.addComponent(UITransform);
    uiTransform.setContentSize(scaleLayoutValue(width, layout.scale), scaleLayoutValue(height, layout.scale));
    const sprite = artNode.getComponent(Sprite) ?? artNode.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    artNode.active = false;

    resources.load(spritePath, SpriteFrame, (error, spriteFrame) => {
      if (error || !spriteFrame) {
        artNode.active = false;
        return;
      }

      if (!safeApplySpriteFrame(artNode, sprite, spriteFrame)) {
        return;
      }
      node.getComponent(Graphics)?.clear();
      artNode.active = true;
    });
  }

  private applyTopPlaqueSprite(node: Node, name: string): void {
    const spritePath = TOP_PLAQUE_SPRITES[name];
    if (!spritePath) {
      return;
    }

    const artNode = this.ensureChild(node, "PlaqueArt");
    artNode.layer = node.layer;
    artNode.setPosition(new Vec3(0, 0, 1));
    const uiTransform = artNode.getComponent(UITransform) ?? artNode.addComponent(UITransform);
    const nodeTransform = node.getComponent(UITransform);
    uiTransform.setContentSize(nodeTransform?.width ?? 0, nodeTransform?.height ?? 0);
    const sprite = artNode.getComponent(Sprite) ?? artNode.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    artNode.active = false;

    resources.load(spritePath, SpriteFrame, (error, spriteFrame) => {
      if (error || !spriteFrame) {
        artNode.active = false;
        return;
      }

      if (!safeApplySpriteFrame(artNode, sprite, spriteFrame)) {
        return;
      }
      node.getComponent(Graphics)?.clear();
      artNode.active = true;
      artNode.setSiblingIndex(0);
    });
  }

  private applyRewardCardSprite(node: Node, rewardId: string): void {
    const spritePath = REWARD_CARD_SPRITES[rewardId];
    if (!spritePath) {
      return;
    }

    const artNode = this.ensureChild(node, "RewardCardArt");
    artNode.layer = node.layer;
    artNode.setPosition(new Vec3(0, 0, 1));
    const uiTransform = artNode.getComponent(UITransform) ?? artNode.addComponent(UITransform);
    const buttonTransform = node.getComponent(UITransform);
    uiTransform.setContentSize(buttonTransform?.width ?? 0, buttonTransform?.height ?? 0);
    const sprite = artNode.getComponent(Sprite) ?? artNode.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    artNode.active = false;

    const labelNode = node.getChildByName("Label");
    const metaNode = node.getChildByName("MetaLabel");
    resources.load(spritePath, SpriteFrame, (error, spriteFrame) => {
      if (error || !spriteFrame) {
        artNode.active = false;
        if (labelNode) {
          labelNode.active = true;
        }
        if (metaNode) {
          metaNode.active = true;
        }
        return;
      }

      if (!safeApplySpriteFrame(artNode, sprite, spriteFrame)) {
        return;
      }
      artNode.active = true;
      if (labelNode) {
        labelNode.active = false;
      }
      if (metaNode) {
        metaNode.active = false;
      }
    });
  }

  private drawSlotTray(root: Node, layout: RuntimeLayout): void {
    this.drawRoundedPanel(
      root,
      "SlotTray",
      layout.width / 2,
      scaleLayoutValue(Math.max(92, layout.cssHeight * 0.15), layout.scale),
      scaleLayoutValue(Math.min(362, layout.cssWidth - 28), layout.scale),
      scaleLayoutValue(86, layout.scale),
      scaleLayoutValue(18, layout.scale),
      WOOD_FILL,
      WOOD_STROKE,
      scaleLayoutValue(5, layout.scale),
      layout,
    );
  }

  private drawRoundedPanel(
    root: Node,
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillColor: Color,
    strokeColor: Color,
    lineWidth: number,
    layout?: RuntimeLayout,
  ): Node {
    const node = this.ensureChild(root, name);
    node.layer = root.layer;
    node.setPosition(new Vec3(layout ? centerLayoutX(x, layout) : Math.round(x), layout ? centerLayoutY(y, layout) : Math.round(y), 0));
    const uiTransform = node.getComponent(UITransform) ?? node.addComponent(UITransform);
    uiTransform.setContentSize(width, height);
    const graphics = node.getComponent(Graphics) ?? node.addComponent(Graphics);
    graphics.clear();
    graphics.fillColor = fillColor;
    graphics.strokeColor = strokeColor;
    graphics.lineWidth = lineWidth;
    graphics.roundRect(-width / 2, -height / 2, width, height, radius);
    graphics.fill();
    if (lineWidth > 0) {
      graphics.stroke();
    }
    return node;
  }

  private writeShellLabel(node: Node, name: string, text: string, fontSize: number, color: Color, yOffset = 0): Label {
    const labelNode = this.ensureChild(node, name);
    labelNode.layer = node.layer;
    labelNode.setPosition(new Vec3(0, yOffset, 0));
    const parentTransform = node.getComponent(UITransform);
    const labelTransform = labelNode.getComponent(UITransform) ?? labelNode.addComponent(UITransform);
    labelTransform.setContentSize(parentTransform?.width ?? 80, parentTransform?.height ?? 30);
    const label = labelNode.getComponent(Label) ?? labelNode.addComponent(Label);
    label.string = text;
    label.fontSize = fontSize;
    label.lineHeight = Math.round(fontSize * 1.18);
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    label.color = color;
    return label;
  }

  private ensureChild(parent: Node, name: string): Node {
    const existing = parent.getChildByName(name);
    if (existing) {
      return existing;
    }

    const node = new Node(name);
    node.layer = parent.layer;
    parent.addChild(node);
    return node;
  }
}

function cloneRunRewardState(state: Partial<HulebuRunRewardState> | undefined): HulebuRunRewardState {
  return {
    reserveBonus: state?.reserveBonus ?? 0,
    shieldBonus: state?.shieldBonus ?? 0,
    firstProtect: state?.firstProtect ?? false,
    startingCoins: state?.startingCoins ?? 0,
    toolBonus: {
      shuffle: state?.toolBonus?.shuffle ?? 0,
      undo: state?.toolBonus?.undo ?? 0,
      discard: state?.toolBonus?.discard ?? 0,
      vision: state?.toolBonus?.vision ?? 0,
    },
    scoreBonus: {
      hu: state?.scoreBonus?.hu ?? 0,
      gang: state?.scoreBonus?.gang ?? 0,
      peng: state?.scoreBonus?.peng ?? 0,
      chi: state?.scoreBonus?.chi ?? 0,
      bugang: state?.scoreBonus?.bugang ?? 0,
    },
    pickedRewards: [...(state?.pickedRewards ?? [])],
  };
}

function cloneMetaUpgradeState(state: Partial<HulebuMetaUpgradeState> | undefined): HulebuMetaUpgradeState {
  return {
    reserveBonus: state?.reserveBonus ?? 0,
    shieldBonus: state?.shieldBonus ?? 0,
    toolBonus: state?.toolBonus ?? 0,
    riverBonus: state?.riverBonus ?? 0,
    startingCoins: state?.startingCoins ?? 0,
    visionBonus: state?.visionBonus ?? 0,
  };
}

function createDefaultMetaProgressSnapshot(): HulebuMetaProgressSnapshot {
  return {
    bestMainlineLevel: 0,
    bestEndlessLayer: 0,
    dailyBestLevels: {},
    dailyStreak: 0,
    lastDailySeed: null,
    bestAdvancedTier: null,
  };
}

function createDefaultMetaProfileSnapshot(): HulebuMetaProfileSnapshot {
  return {
    metaCoins: HULEBU_META_INITIAL_COINS,
    metaUpgrades: createHulebuMetaUpgradeState(),
  };
}

function sanitizeAccountNumberMap(input: unknown): Record<string, number> {
  if (!input || typeof input !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(input).flatMap(([key, value]) =>
      typeof value === "number" && Number.isFinite(value) ? [[key, Math.max(0, value)]] : [],
    ),
  );
}

function sanitizeAccountStringMap(input: unknown): Record<string, string> {
  if (!input || typeof input !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(input).flatMap(([key, value]) =>
      typeof value === "string" && value ? [[key, value]] : [],
    ),
  );
}

function sanitizeAccountActiveRun(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const activeRun = input as Record<string, unknown>;
  return typeof activeRun.sessionKey === "string" && typeof activeRun.updatedAt === "string"
    ? activeRun
    : null;
}

function sanitizeAccountProgressRecord(input: unknown): HulebuAccountProgressRecord {
  const progress = input && typeof input === "object" ? input as Partial<HulebuAccountProgressRecord> : {};
  return {
    bankedCoins: typeof progress.bankedCoins === "number" ? Math.max(0, progress.bankedCoins) : 0,
    bestEndlessLayer: typeof progress.bestEndlessLayer === "number" ? Math.max(0, progress.bestEndlessLayer) : 0,
    bestAscensionLevel: typeof progress.bestAscensionLevel === "number" ? Math.max(1, Math.min(4, progress.bestAscensionLevel)) : 1,
    dailyBestLevels: sanitizeAccountNumberMap(progress.dailyBestLevels),
    dailyStreak: typeof progress.dailyStreak === "number" ? Math.max(0, progress.dailyStreak) : 0,
    lastDailySeed: typeof progress.lastDailySeed === "string" && progress.lastDailySeed ? progress.lastDailySeed : null,
    achievements: sanitizeAccountStringMap(progress.achievements),
    upgrades: sanitizeAccountNumberMap(progress.upgrades),
    activeRun: sanitizeAccountActiveRun(progress.activeRun),
  };
}

function mergeNumberMaps(base: Record<string, number>, incoming: Record<string, number>): Record<string, number> {
  const merged = { ...base };
  Object.entries(incoming).forEach(([key, value]) => {
    merged[key] = Math.max(value, merged[key] ?? 0);
  });
  return merged;
}

function mapAdvancedTierToAccountLevel(tier: HulebuAdvancedRunTier | null): number {
  if (tier === "north") {
    return 4;
  }
  if (tier === "west") {
    return 3;
  }
  if (tier === "south") {
    return 2;
  }
  return 1;
}

function mapAccountLevelToAdvancedTier(level: number): HulebuAdvancedRunTier | null {
  if (level >= 4) {
    return "north";
  }
  if (level === 3) {
    return "west";
  }
  if (level === 2) {
    return "south";
  }
  return null;
}

function pickLatestAccountActiveRun(
  accountActiveRun: Record<string, unknown> | null,
  localActiveRun: Record<string, unknown> | null,
): Record<string, unknown> | null {
  if (!accountActiveRun) {
    return localActiveRun;
  }
  if (!localActiveRun) {
    return accountActiveRun;
  }

  const accountTime = Date.parse(String(accountActiveRun.updatedAt ?? ""));
  const localTime = Date.parse(String(localActiveRun.updatedAt ?? ""));
  if (!Number.isFinite(accountTime)) {
    return localActiveRun;
  }
  if (!Number.isFinite(localTime)) {
    return accountActiveRun;
  }
  return localTime >= accountTime ? localActiveRun : accountActiveRun;
}

function createCocosAccountActiveRunPayload(snapshot: HulebuActiveRunSnapshot | null): Record<string, unknown> | null {
  if (!snapshot) {
    return null;
  }

  const effectiveProfile = snapshot.pendingRunProfile ?? snapshot.runProfile;
  const sessionParts = [
    "cocos",
    effectiveProfile.mode,
    String(snapshot.currentDisplayLevelOrder),
    effectiveProfile.dailySeed ?? effectiveProfile.advancedTier ?? snapshot.runArchetypeId,
  ];

  return {
    sessionKey: sessionParts.join(":"),
    updatedAt: snapshot.updatedAt,
    source: "cocos",
    cocosSnapshot: snapshot,
  };
}

function isHulebuRunProfile(value: unknown): value is HulebuRunProfile {
  if (!value || typeof value !== "object") {
    return false;
  }
  const profile = value as Partial<HulebuRunProfile>;
  if ((profile.mode !== "mainline" && profile.mode !== "endless" && profile.mode !== "daily" && profile.mode !== "advanced")
    || typeof profile.displayName !== "string"
    || profile.displayName.length === 0
    || !Number.isInteger(profile.startOrder)
    || (profile.startOrder ?? 0) < 1) {
    return false;
  }
  if (profile.mode === "daily" && (typeof profile.dailySeed !== "string" || profile.dailySeed.length === 0)) {
    return false;
  }
  return profile.mode !== "advanced"
    || profile.advancedTier === "east"
    || profile.advancedTier === "south"
    || profile.advancedTier === "west"
    || profile.advancedTier === "north";
}

function isResumableRunPhase(value: unknown): value is HulebuResumableRunPhase {
  return value === "playing"
    || value === "cleared"
    || value === "reward"
    || value === "event"
    || value === "advancedAbility"
    || value === "archetype"
    || value === "settlement";
}

function isResumableCoordinatorPhase(resumablePhase: HulebuResumableRunPhase, coordinatorPhase: RunPhase): boolean {
  if (resumablePhase === "playing") {
    return coordinatorPhase === "playing.idle"
      || coordinatorPhase === "playing.comboChoosing"
      || coordinatorPhase === "playing.discardChoosing";
  }
  if (resumablePhase === "cleared") {
    return coordinatorPhase === "encounterCleared";
  }
  if (resumablePhase === "reward") {
    return coordinatorPhase === "rewardChoice";
  }
  if (resumablePhase === "event") {
    return coordinatorPhase === "eventChoice";
  }
  if (resumablePhase === "settlement") {
    return coordinatorPhase === "settlement";
  }
  return coordinatorPhase === "bossIntro";
}

function validateRunRewardState(
  value: unknown,
  knownRewardIds: ReadonlySet<string>,
): asserts value is HulebuRunRewardState {
  if (!value || typeof value !== "object") {
    throw new Error("Active run snapshot has invalid rewards.");
  }
  const state = value as Partial<HulebuRunRewardState>;
  for (const [name, numericValue] of [
    ["reserveBonus", state.reserveBonus],
    ["shieldBonus", state.shieldBonus],
    ["startingCoins", state.startingCoins],
  ] as const) {
    requireSnapshotCount(numericValue, `runRewards.${name}`);
  }
  if (typeof state.firstProtect !== "boolean") {
    throw new Error("runRewards.firstProtect must be a boolean.");
  }
  validateSnapshotCountRecord(state.toolBonus, ["shuffle", "undo", "discard", "vision"], "runRewards.toolBonus");
  validateSnapshotCountRecord(state.scoreBonus, ["hu", "gang", "peng", "chi", "bugang"], "runRewards.scoreBonus");
  if (!Array.isArray(state.pickedRewards)
    || state.pickedRewards.some((rewardId) => typeof rewardId !== "string" || !knownRewardIds.has(rewardId))) {
    throw new Error("Active run snapshot contains an unknown picked reward.");
  }
}

function validateMetaUpgradeState(value: unknown): asserts value is HulebuMetaUpgradeState {
  validateSnapshotCountRecord(
    value,
    ["reserveBonus", "shieldBonus", "toolBonus", "riverBonus", "startingCoins", "visionBonus"],
    "metaUpgrades",
  );
}

function validateCoordinatorChoiceContext(
  snapshot: RunSnapshot,
  profile: HulebuRunProfile,
  currentDisplayLevelOrder: number,
  runArchetypeId: HulebuRunArchetypeId,
  levelConfig: HulebuRuntimeLevelConfig,
  levelCount: number,
  knownRewardIds: ReadonlySet<string>,
): void {
  const context = snapshot.context;
  if (!context || typeof context !== "object"
    || !Array.isArray(context.rewardCandidateIds)
    || !Array.isArray(context.eventOptionIds)) {
    throw new Error("Active run snapshot has invalid coordinator choice context.");
  }
  if (context.targetLevelOrder !== null
    && (!Number.isInteger(context.targetLevelOrder) || context.targetLevelOrder < 1)) {
    throw new Error("Active run snapshot has invalid target level order.");
  }
  if (context.rewardCandidateIds.some((rewardId) => !knownRewardIds.has(rewardId))) {
    throw new Error("Active run snapshot has an unknown reward candidate.");
  }
  if (context.eventOptionIds.some((eventId) => !getHulebuSpecialEventConfig(eventId))) {
    throw new Error("Active run snapshot has an unknown event option.");
  }

  const expectedTargetLevelOrder = currentDisplayLevelOrder + 1;
  const currentFlowLevelOrder = getFlowLevelOrderForSnapshot(profile, currentDisplayLevelOrder, levelCount);
  const targetFlowLevelOrder = getFlowLevelOrderForSnapshot(profile, expectedTargetLevelOrder, levelCount);
  if (snapshot.phase === "rewardChoice") {
    const expectedRewardIds = getHulebuRewardChoicesForRun(profile, levelConfig);
    if (snapshot.context.targetLevelOrder !== expectedTargetLevelOrder
      || !HULEBU_REWARD_LEVEL_ORDERS.has(currentFlowLevelOrder)
      || !stringArraysEqual(snapshot.context.rewardCandidateIds, expectedRewardIds)) {
      throw new Error("Active run snapshot has reward choices that do not match the cleared level.");
    }
  }
  if (snapshot.phase === "eventChoice") {
    const expectedEventIds = getHulebuSpecialEventChoices(targetFlowLevelOrder, profile, runArchetypeId)
      .map((event) => event.id);
    if (snapshot.context.targetLevelOrder !== expectedTargetLevelOrder
      || !HULEBU_EVENT_LEVEL_ORDERS.has(targetFlowLevelOrder)
      || !stringArraysEqual(snapshot.context.eventOptionIds, expectedEventIds)) {
      throw new Error("Active run snapshot has event choices that do not match the target level.");
    }
  }
}

function getFlowLevelOrderForSnapshot(
  profile: HulebuRunProfile,
  displayOrder: number,
  levelCount: number,
): number {
  return profile.mode === "mainline"
    ? displayOrder
    : ((displayOrder - 1) % levelCount) + 1;
}

function stringArraysEqual(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function validateSnapshotCountRecord<T extends string>(
  value: unknown,
  keys: readonly T[],
  path: string,
): void {
  if (!value || typeof value !== "object") {
    throw new Error(`${path} must be an object.`);
  }
  for (const key of keys) {
    requireSnapshotCount((value as Partial<Record<T, unknown>>)[key], `${path}.${key}`);
  }
}

function requireSnapshotCount(value: unknown, path: string): void {
  if (!Number.isInteger(value) || (value as number) < 0) {
    throw new Error(`${path} must be a non-negative integer.`);
  }
}

function isPersistableRunPhase(value: RunPhase): boolean {
  return value === "encounterIntro"
    || value === "playing.idle"
    || value === "playing.comboChoosing"
    || value === "playing.discardChoosing"
    || value === "encounterCleared"
    || value === "rewardChoice"
    || value === "eventChoice"
    || value === "bossIntro"
    || value === "settlement";
}

function resolveResumableRunPhase(value: unknown): HulebuResumableRunPhase {
  return isResumableRunPhase(value) ? value : "playing";
}

function stripHudPrefix(value: string, prefix: string): string {
  return value.startsWith(`${prefix} `) ? value.slice(prefix.length + 1) : value;
}

function parseToolCounts(toolText: string): { wash: string | null; undo: string | null; discard: string | null } {
  return {
    wash: parseToolCount(toolText, "洗"),
    undo: parseToolCount(toolText, "撤"),
    discard: parseToolCount(toolText, "打"),
  };
}

function parseToolCount(toolText: string, label: string): string | null {
  const match = new RegExp(`${label}\\s+(\\d+)`).exec(toolText);
  return match?.[1] ?? null;
}

function mergeAchievementSnapshot(
  current: HulebuAchievementSnapshot,
  unlocks: HulebuAchievementSnapshot,
): HulebuAchievementSnapshot {
  const next = { ...current };
  Object.entries(unlocks).forEach(([id, unlockedAt]) => {
    if (typeof unlockedAt === "string" && unlockedAt && !next[id as HulebuAchievementId]) {
      next[id as HulebuAchievementId] = unlockedAt;
    }
  });
  return next;
}

function getHigherAdvancedTier(
  current: HulebuAdvancedRunTier | null,
  next: HulebuAdvancedRunTier | null,
): HulebuAdvancedRunTier | null {
  if (!next) {
    return current;
  }

  const weight: Record<HulebuAdvancedRunTier, number> = {
    east: 1,
    south: 2,
    west: 3,
    north: 4,
  };
  if (!current) {
    return next;
  }

  return weight[next] >= weight[current] ? next : current;
}
