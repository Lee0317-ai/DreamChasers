import type { GameCombo, GameSnapshot } from "./GameContracts";

export type RunPhase =
  | "encounterIntro"
  | "playing.tileEntering"
  | "playing.idle"
  | "playing.resolving"
  | "playing.comboChoosing"
  | "playing.discardChoosing"
  | "playing.dangerCheck"
  | "encounterCleared"
  | "rewardChoice"
  | "eventChoice"
  | "bossIntro"
  | "settlement"
  | "failed"
  | "paused";

export type StableRunPhase = Exclude<
  RunPhase,
  "playing.tileEntering" | "playing.resolving" | "playing.dangerCheck"
>;

export type PersistableRunPhase =
  | "encounterIntro"
  | "playing.idle"
  | "playing.comboChoosing"
  | "playing.discardChoosing"
  | "encounterCleared"
  | "rewardChoice"
  | "eventChoice"
  | "bossIntro"
  | "settlement";

export type PauseReturnPhase =
  | "playing.idle"
  | "playing.comboChoosing"
  | "playing.discardChoosing";

export interface RunComboCandidateSnapshot {
  readonly type: GameCombo;
  readonly key: string;
  readonly tileIds: readonly string[];
  readonly labels: readonly string[];
  readonly prefabKeys: readonly string[];
}

export interface PendingComboContext {
  readonly combo: GameCombo;
  readonly candidates: readonly RunComboCandidateSnapshot[];
}

export interface RunPhaseContext {
  readonly targetLevelOrder: number | null;
  readonly rewardCandidateIds: readonly string[];
  readonly eventOptionIds: readonly string[];
  readonly pendingCombo: PendingComboContext | null;
  readonly pauseReturnPhase: PauseReturnPhase | null;
}

export interface RunSnapshot {
  readonly schemaVersion: 1;
  readonly phase: RunPhase;
  readonly sessionSnapshot: GameSnapshot | null;
  readonly context: RunPhaseContext;
}

export const TRANSITIONS: Readonly<Record<RunPhase, readonly RunPhase[]>> = {
  encounterIntro: ["playing.tileEntering"],
  "playing.tileEntering": ["playing.idle", "failed"],
  "playing.idle": ["playing.resolving", "playing.discardChoosing", "paused", "failed"],
  "playing.resolving": [
    "playing.idle",
    "playing.comboChoosing",
    "playing.discardChoosing",
    "playing.dangerCheck",
    "encounterCleared",
    "failed",
  ],
  "playing.comboChoosing": ["playing.resolving", "playing.idle", "paused"],
  "playing.discardChoosing": ["playing.resolving", "playing.idle", "paused"],
  "playing.dangerCheck": ["playing.idle", "encounterCleared", "failed"],
  encounterCleared: ["rewardChoice", "eventChoice", "bossIntro", "settlement"],
  rewardChoice: ["encounterIntro", "settlement"],
  eventChoice: ["encounterIntro", "settlement"],
  bossIntro: ["encounterIntro"],
  settlement: ["encounterIntro"],
  failed: ["encounterIntro", "settlement"],
  paused: ["playing.idle", "playing.comboChoosing", "playing.discardChoosing"],
};

const RUN_PHASES: ReadonlySet<RunPhase> = new Set(Object.keys(TRANSITIONS) as RunPhase[]);
const TRANSIENT_PHASES: ReadonlySet<RunPhase> = new Set([
  "playing.tileEntering",
  "playing.resolving",
  "playing.dangerCheck",
]);
const PERSISTABLE_PHASES: ReadonlySet<RunPhase> = new Set([
  "encounterIntro",
  "playing.idle",
  "playing.comboChoosing",
  "playing.discardChoosing",
  "encounterCleared",
  "rewardChoice",
  "eventChoice",
  "bossIntro",
  "settlement",
]);
const PAUSE_RETURN_PHASES: ReadonlySet<RunPhase> = new Set([
  "playing.idle",
  "playing.comboChoosing",
  "playing.discardChoosing",
]);

export class RunStateMachine {
  private currentPhase: RunPhase;
  private returnPhase: PauseReturnPhase | null;

  constructor(initialPhase: RunPhase = "encounterIntro") {
    this.currentPhase = initialPhase;
    this.returnPhase = null;
  }

  static restore(
    phase: RunPhase,
    pauseReturnPhase: PauseReturnPhase | null,
  ): RunStateMachine {
    if (!isRunPhase(phase)) {
      throw new Error("Run snapshot has an unknown phase.");
    }
    if (phase === "paused") {
      if (!pauseReturnPhase || !isPauseReturnPhase(pauseReturnPhase)) {
        throw new Error("Paused run snapshot requires a valid return phase.");
      }
    } else if (pauseReturnPhase !== null) {
      throw new Error("Only a paused run snapshot may retain a return phase.");
    }

    const run = new RunStateMachine(phase);
    run.returnPhase = pauseReturnPhase;
    return run;
  }

  get phase(): RunPhase {
    return this.currentPhase;
  }

  get pauseReturnPhase(): PauseReturnPhase | null {
    return this.returnPhase;
  }

  transition(nextPhase: RunPhase): boolean {
    if (!TRANSITIONS[this.currentPhase].includes(nextPhase)) {
      return false;
    }

    if (nextPhase === "paused") {
      if (!isPauseReturnPhase(this.currentPhase)) {
        return false;
      }
      this.returnPhase = this.currentPhase;
    } else if (this.currentPhase === "paused") {
      if (this.returnPhase !== nextPhase) {
        return false;
      }
      this.returnPhase = null;
    }

    this.currentPhase = nextPhase;
    return true;
  }

  pause(): boolean {
    return this.transition("paused");
  }

  resume(): boolean {
    return this.returnPhase !== null && this.transition(this.returnPhase);
  }

  isStable(): boolean {
    return !TRANSIENT_PHASES.has(this.currentPhase);
  }

  isPersistable(): boolean {
    return PERSISTABLE_PHASES.has(this.currentPhase);
  }
}

export function isRunPhase(value: unknown): value is RunPhase {
  return typeof value === "string" && RUN_PHASES.has(value as RunPhase);
}

export function isPauseReturnPhase(value: unknown): value is PauseReturnPhase {
  return typeof value === "string" && PAUSE_RETURN_PHASES.has(value as RunPhase);
}
