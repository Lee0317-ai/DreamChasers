import type {
  CommandResult,
  DomainEvent,
  GameCommand,
  GameSnapshot,
} from "../domain/GameContracts";
import { GameSession } from "../domain/GameSession";
import {
  RunStateMachine,
  isPauseReturnPhase,
  isRunPhase,
  type RunPhase,
  type RunPhaseContext,
  type RunSnapshot,
} from "../domain/RunStateMachine";

export interface CoordinatorResult extends Omit<CommandResult, "snapshot"> {
  readonly snapshot: GameSnapshot | null;
  readonly phase: RunPhase;
  readonly stable: boolean;
  readonly persistable: boolean;
  readonly runSnapshot: RunSnapshot;
}

export interface RunContextUpdate {
  readonly targetLevelOrder?: number | null;
  readonly rewardCandidateIds?: readonly string[];
  readonly eventOptionIds?: readonly string[];
}

interface MutableRunContext {
  targetLevelOrder: number | null;
  rewardCandidateIds: string[];
  eventOptionIds: string[];
}

const PLAYING_PHASES: ReadonlySet<RunPhase> = new Set([
  "playing.tileEntering",
  "playing.idle",
  "playing.resolving",
  "playing.comboChoosing",
  "playing.discardChoosing",
  "playing.dangerCheck",
  "paused",
]);

export class GameCoordinator {
  private readonly context: MutableRunContext = {
    targetLevelOrder: null,
    rewardCandidateIds: [],
    eventOptionIds: [],
  };

  constructor(
    private readonly run: RunStateMachine = new RunStateMachine("playing.idle"),
    private session: GameSession | null = null,
  ) {}

  static restore(
    snapshot: RunSnapshot,
    session: GameSession | null = null,
  ): GameCoordinator {
    validateRunSnapshot(snapshot);

    const requiresSession = PLAYING_PHASES.has(snapshot.phase);
    if (requiresSession && (!session || !snapshot.sessionSnapshot)) {
      throw new Error("Playing run snapshot requires an attached session snapshot.");
    }
    if ((session === null) !== (snapshot.sessionSnapshot === null)) {
      throw new Error("Run snapshot and attached session do not match.");
    }
    if (session && snapshot.sessionSnapshot
      && !gameSnapshotsEqual(session.snapshot(), snapshot.sessionSnapshot)) {
      throw new Error("Attached session does not match the run snapshot.");
    }

    const run = RunStateMachine.restore(
      snapshot.phase,
      snapshot.context.pauseReturnPhase,
    );
    const coordinator = new GameCoordinator(run, session);
    coordinator.updateContext({
      targetLevelOrder: snapshot.context.targetLevelOrder,
      rewardCandidateIds: snapshot.context.rewardCandidateIds,
      eventOptionIds: snapshot.context.eventOptionIds,
    });
    return coordinator;
  }

  attachSession(session: GameSession): void {
    this.session = session;
  }

  detachSession(): void {
    this.session = null;
  }

  updateContext(update: RunContextUpdate): void {
    if (update.targetLevelOrder !== undefined) {
      validateTargetLevelOrder(update.targetLevelOrder);
      this.context.targetLevelOrder = update.targetLevelOrder;
    }
    if (update.rewardCandidateIds !== undefined) {
      this.context.rewardCandidateIds = validateIds(
        update.rewardCandidateIds,
        "reward candidate",
      );
    }
    if (update.eventOptionIds !== undefined) {
      this.context.eventOptionIds = validateIds(update.eventOptionIds, "event option");
    }
  }

  snapshot(): RunSnapshot {
    return {
      schemaVersion: 1,
      phase: this.run.phase,
      sessionSnapshot: this.session?.snapshot() ?? null,
      context: this.snapshotContext(),
    };
  }

  dispatch(command: GameCommand): CoordinatorResult {
    if (command.type === "flow.pause") {
      return this.pause(command);
    }
    if (command.type === "flow.resume") {
      return this.resume(command);
    }
    if (command.type === "reward.choose") {
      return this.run.phase === "rewardChoice"
        ? this.reject(command, "Reward effects are not available in M1.")
        : this.reject(command, `Command is not allowed during ${this.run.phase}.`);
    }
    if (command.type === "event.choose") {
      return this.run.phase === "eventChoice"
        ? this.reject(command, "Event effects are not available in M1.")
        : this.reject(command, `Command is not allowed during ${this.run.phase}.`);
    }
    if (!this.isSessionCommandAllowed(command)) {
      return this.reject(command, `Command is not allowed during ${this.run.phase}.`);
    }
    if (!this.session) {
      return this.reject(command, "No game session is attached.");
    }

    return this.dispatchToSession(command, this.session);
  }

  private pause(command: Extract<GameCommand, { type: "flow.pause" }>): CoordinatorResult {
    if (!this.session) {
      return this.reject(command, "No game session is attached.");
    }
    if (!this.run.pause()) {
      return this.reject(command, `Run cannot pause during ${this.run.phase}.`);
    }
    return this.flowResult({ type: "flow.paused" });
  }

  private resume(command: Extract<GameCommand, { type: "flow.resume" }>): CoordinatorResult {
    if (this.run.phase !== "paused" || this.run.pauseReturnPhase === null) {
      return this.reject(command, "Paused run has no return phase.");
    }
    if (!this.session) {
      return this.reject(command, "No game session is attached.");
    }
    if (!this.run.resume()) {
      return this.reject(command, "Paused run cannot resume.");
    }
    return this.flowResult({ type: "flow.resumed" });
  }

  private dispatchToSession(command: GameCommand, session: GameSession): CoordinatorResult {
    if (command.type === "tool.use" && command.tool === "discard") {
      const result = session.dispatch(command);
      if (result.accepted
        && result.events.some((event) => event.type === "discard.choice.required")) {
        this.requireTransition("playing.discardChoosing");
      }
      return this.fromSessionResult(result);
    }

    const originPhase = this.run.phase;
    this.requireTransition("playing.resolving");
    const result = session.dispatch(command);
    const comboChoiceRequired = result.events.some(
      (event) => event.type === "combo.choice.required",
    );

    if (comboChoiceRequired) {
      this.requireTransition("playing.comboChoosing");
    } else if (!result.accepted) {
      this.requireTransition(
        originPhase === "playing.comboChoosing" ? "playing.comboChoosing" : "playing.idle",
      );
    } else if (result.changed) {
      this.requireTransition("playing.dangerCheck");
      this.requireTransition(
        result.events.some((event) => event.type === "level.cleared")
          ? "encounterCleared"
          : "playing.idle",
      );
    } else {
      this.requireTransition("playing.idle");
    }

    return this.fromSessionResult(result);
  }

  private isSessionCommandAllowed(command: GameCommand): boolean {
    switch (command.type) {
      case "tile.select":
      case "combo.execute":
      case "tool.use":
        return this.run.phase === "playing.idle";
      case "combo.choose":
        return this.run.phase === "playing.comboChoosing";
      case "slot.discard":
        return this.run.phase === "playing.discardChoosing";
      case "reward.choose":
      case "event.choose":
      case "flow.pause":
      case "flow.resume":
        return false;
    }
  }

  private requireTransition(phase: RunPhase): void {
    if (!this.run.transition(phase)) {
      throw new Error(`Invalid coordinator transition: ${this.run.phase} -> ${phase}.`);
    }
  }

  private flowResult(event: DomainEvent): CoordinatorResult {
    return this.decorate({
      accepted: true,
      changed: false,
      snapshot: this.session?.snapshot() ?? null,
      events: [event],
    });
  }

  private reject(command: GameCommand, reason: string): CoordinatorResult {
    return this.decorate({
      accepted: false,
      changed: false,
      snapshot: this.session?.snapshot() ?? null,
      events: [{ type: "command.rejected", commandType: command.type, reason }],
    });
  }

  private fromSessionResult(result: CommandResult): CoordinatorResult {
    return this.decorate(result);
  }

  private decorate(result: {
    readonly accepted: boolean;
    readonly changed: boolean;
    readonly snapshot: GameSnapshot | null;
    readonly events: readonly DomainEvent[];
  }): CoordinatorResult {
    return {
      ...result,
      phase: this.run.phase,
      stable: this.run.isStable(),
      persistable: this.run.isPersistable(),
      runSnapshot: this.snapshot(),
    };
  }

  private snapshotContext(): RunPhaseContext {
    return {
      targetLevelOrder: this.context.targetLevelOrder,
      rewardCandidateIds: [...this.context.rewardCandidateIds],
      eventOptionIds: [...this.context.eventOptionIds],
      pauseReturnPhase: this.run.pauseReturnPhase,
    };
  }
}

function validateRunSnapshot(snapshot: RunSnapshot): void {
  if (snapshot.schemaVersion !== 1) {
    throw new Error("Unsupported run snapshot schema.");
  }
  if (!isRunPhase(snapshot.phase)) {
    throw new Error("Run snapshot has an unknown phase.");
  }
  validateTargetLevelOrder(snapshot.context.targetLevelOrder);
  validateIds(snapshot.context.rewardCandidateIds, "reward candidate");
  validateIds(snapshot.context.eventOptionIds, "event option");
  if (snapshot.context.pauseReturnPhase !== null
    && !isPauseReturnPhase(snapshot.context.pauseReturnPhase)) {
    throw new Error("Run snapshot has an invalid pause return phase.");
  }
  if (snapshot.sessionSnapshot !== null) {
    validateGameSnapshot(snapshot.sessionSnapshot);
  }
}

function validateTargetLevelOrder(value: number | null): void {
  if (value !== null && (!Number.isInteger(value) || value < 1)) {
    throw new Error("Target level order must be a positive integer or null.");
  }
}

function validateIds(ids: readonly string[], label: string): string[] {
  if (!Array.isArray(ids)
    || ids.some((id) => typeof id !== "string" || id.trim().length === 0)
    || new Set(ids).size !== ids.length) {
    throw new Error(`Run snapshot has invalid ${label} ids.`);
  }
  return [...ids];
}

function validateGameSnapshot(snapshot: GameSnapshot): void {
  if (snapshot.schemaVersion !== 1
    || !Number.isInteger(snapshot.revision)
    || snapshot.revision < 0
    || !Number.isInteger(snapshot.levelOrder)
    || snapshot.levelOrder < 1
    || (snapshot.status !== "playing" && snapshot.status !== "cleared")
    || !snapshot.runtime) {
    throw new Error("Run snapshot contains an invalid game snapshot.");
  }
}

function gameSnapshotsEqual(left: GameSnapshot, right: GameSnapshot): boolean {
  return valuesEqual(left, right);
}

function valuesEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) {
    return true;
  }
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left)
      && Array.isArray(right)
      && left.length === right.length
      && left.every((value, index) => valuesEqual(value, right[index]));
  }
  if (!left || !right || typeof left !== "object" || typeof right !== "object") {
    return false;
  }

  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;
  const leftKeys = Object.keys(leftRecord);
  const rightKeys = Object.keys(rightRecord);
  return leftKeys.length === rightKeys.length
    && leftKeys.every((key) => Object.prototype.hasOwnProperty.call(rightRecord, key)
      && valuesEqual(leftRecord[key], rightRecord[key]));
}
