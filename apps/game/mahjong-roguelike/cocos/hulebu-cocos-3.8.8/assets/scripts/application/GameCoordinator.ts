import type {
  CommandResult,
  DomainEvent,
  GameCombo,
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
  type PendingComboContext,
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
  readonly pendingCombo?: PendingComboContext | null;
}

interface MutableRunContext {
  targetLevelOrder: number | null;
  rewardCandidateIds: string[];
  eventOptionIds: string[];
  pendingCombo: PendingComboContext | null;
}

const GAME_COMBOS: ReadonlySet<GameCombo> = new Set([
  "chi",
  "peng",
  "gang",
  "bugang",
  "hu",
]);

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
    pendingCombo: null,
  };

  constructor(
    private readonly run: RunStateMachine = new RunStateMachine("playing.idle"),
    private session: GameSession | null = null,
  ) {}

  static restore(
    snapshot: RunSnapshot,
    session: GameSession | null = null,
  ): GameCoordinator {
    validateRestorableState(snapshot, session);

    const run = RunStateMachine.restore(
      snapshot.phase,
      snapshot.context.pauseReturnPhase,
    );
    const coordinator = new GameCoordinator(run, session);
    coordinator.updateContext({
      targetLevelOrder: snapshot.context.targetLevelOrder,
      rewardCandidateIds: snapshot.context.rewardCandidateIds,
      eventOptionIds: snapshot.context.eventOptionIds,
      pendingCombo: snapshot.context.pendingCombo,
    });
    return coordinator;
  }

  attachSession(session: GameSession): void {
    const snapshot = this.createSnapshot(session, this.context);
    validateRestorableState(snapshot, session);
    this.session = session;
  }

  detachSession(): void {
    const snapshot = this.createSnapshot(null, this.context);
    validateRestorableState(snapshot, null);
    this.session = null;
  }

  updateContext(update: RunContextUpdate): void {
    const nextContext: MutableRunContext = {
      targetLevelOrder: this.context.targetLevelOrder,
      rewardCandidateIds: [...this.context.rewardCandidateIds],
      eventOptionIds: [...this.context.eventOptionIds],
      pendingCombo: clonePendingCombo(this.context.pendingCombo),
    };
    if (update.targetLevelOrder !== undefined) {
      validateTargetLevelOrder(update.targetLevelOrder);
      nextContext.targetLevelOrder = update.targetLevelOrder;
    }
    if (update.rewardCandidateIds !== undefined) {
      nextContext.rewardCandidateIds = validateIds(
        update.rewardCandidateIds,
        "reward candidate",
      );
    }
    if (update.eventOptionIds !== undefined) {
      nextContext.eventOptionIds = validateIds(update.eventOptionIds, "event option");
    }
    if (update.pendingCombo !== undefined) {
      nextContext.pendingCombo = validatePendingCombo(update.pendingCombo);
    }
    const snapshot = this.createSnapshot(this.session, nextContext);
    validateRestorableState(snapshot, this.session);
    this.context.targetLevelOrder = nextContext.targetLevelOrder;
    this.context.rewardCandidateIds = nextContext.rewardCandidateIds;
    this.context.eventOptionIds = nextContext.eventOptionIds;
    this.context.pendingCombo = nextContext.pendingCombo;
  }

  snapshot(): RunSnapshot {
    const snapshot = this.createSnapshot(this.session, this.context);
    validateRestorableState(snapshot, this.session);
    return snapshot;
  }

  private createSnapshot(
    session: GameSession | null,
    context: MutableRunContext,
  ): RunSnapshot {
    return {
      schemaVersion: 1,
      phase: this.run.phase,
      sessionSnapshot: session?.snapshot() ?? null,
      context: this.snapshotContext(context),
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
    if (command.type === "combo.choose"
      && !this.context.pendingCombo?.candidates.some(
        (candidate) => candidate.key === command.candidateId,
      )) {
      return this.reject(command, "Combo candidate is not part of the pending choice.");
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
    const before = this.snapshot();
    if (command.type === "tool.use" && command.tool === "discard") {
      const result = session.dispatch(command);
      if (result.accepted
        && result.events.some((event) => event.type === "discard.choice.required")) {
        this.requireTransition("playing.discardChoosing");
      }
      return this.fromSessionResult(result, before);
    }

    const originPhase = this.run.phase;
    this.requireTransition("playing.resolving");
    const result = session.dispatch(command);
    const comboChoice = result.events.find(
      (event): event is Extract<DomainEvent, { type: "combo.choice.required" }> =>
        event.type === "combo.choice.required",
    );

    if (comboChoice) {
      this.requireTransition("playing.comboChoosing");
      this.context.pendingCombo = clonePendingCombo(comboChoice);
    } else if (!result.accepted) {
      if (originPhase === "playing.comboChoosing") {
        this.requireTransition("playing.comboChoosing");
      } else {
        this.requireTransition("playing.idle");
        if (originPhase === "playing.discardChoosing") {
          this.requireTransition("playing.discardChoosing");
        }
      }
    } else if (result.changed) {
      this.requireTransition("playing.dangerCheck");
      this.requireTransition(
        result.events.some((event) => event.type === "level.cleared")
          ? "encounterCleared"
          : result.events.some((event) => event.type === "level.failed")
            ? "failed"
          : "playing.idle",
      );
    } else {
      this.requireTransition("playing.idle");
    }

    if (this.run.phase !== "playing.comboChoosing") {
      this.context.pendingCombo = null;
    }
    return this.fromSessionResult(result, before);
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
      changed: true,
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

  private fromSessionResult(result: CommandResult, before: RunSnapshot): CoordinatorResult {
    const after = this.snapshot();
    return this.decorate({
      ...result,
      changed: result.changed || !valuesEqual(before, after),
    }, after);
  }

  private decorate(result: {
    readonly accepted: boolean;
    readonly changed: boolean;
    readonly snapshot: GameSnapshot | null;
    readonly events: readonly DomainEvent[];
  }, runSnapshot: RunSnapshot = this.snapshot()): CoordinatorResult {
    return {
      ...result,
      phase: this.run.phase,
      stable: this.run.isStable(),
      persistable: this.run.isPersistable(),
      runSnapshot,
    };
  }

  private snapshotContext(context: MutableRunContext = this.context): RunPhaseContext {
    return {
      targetLevelOrder: context.targetLevelOrder,
      rewardCandidateIds: [...context.rewardCandidateIds],
      eventOptionIds: [...context.eventOptionIds],
      pendingCombo: clonePendingCombo(context.pendingCombo),
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
  validatePendingCombo(snapshot.context.pendingCombo);
  if (snapshot.context.pauseReturnPhase !== null
    && !isPauseReturnPhase(snapshot.context.pauseReturnPhase)) {
    throw new Error("Run snapshot has an invalid pause return phase.");
  }
  if (snapshot.sessionSnapshot !== null) {
    validateGameSnapshot(snapshot.sessionSnapshot);
  }
  validateSnapshotSemantics(snapshot);
}

function validateRestorableState(
  snapshot: RunSnapshot,
  session: GameSession | null,
): void {
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
  validateSessionCapabilities(snapshot, session);
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

function validatePendingCombo(
  pendingCombo: PendingComboContext | null,
): PendingComboContext | null {
  if (pendingCombo === null) {
    return null;
  }
  if (!pendingCombo
    || typeof pendingCombo !== "object"
    || !GAME_COMBOS.has(pendingCombo.combo)
    || !Array.isArray(pendingCombo.candidates)
    || pendingCombo.candidates.length < 2) {
    throw new Error("Run snapshot has invalid pending combo context.");
  }

  const keys = new Set<string>();
  const candidates = pendingCombo.candidates.map((candidate) => {
    if (!candidate
      || typeof candidate !== "object"
      || candidate.type !== pendingCombo.combo
      || typeof candidate.key !== "string"
      || candidate.key.trim().length === 0
      || keys.has(candidate.key)
      || !isNonEmptyStringArray(candidate.tileIds)
      || !isNonEmptyStringArray(candidate.labels)
      || !isNonEmptyStringArray(candidate.prefabKeys)
      || candidate.labels.length !== candidate.tileIds.length
      || candidate.prefabKeys.length !== candidate.tileIds.length) {
      throw new Error("Run snapshot has invalid pending combo candidates.");
    }
    keys.add(candidate.key);
    return {
      type: candidate.type,
      key: candidate.key,
      tileIds: [...candidate.tileIds],
      labels: [...candidate.labels],
      prefabKeys: [...candidate.prefabKeys],
    };
  });

  return { combo: pendingCombo.combo, candidates };
}

function clonePendingCombo(
  pendingCombo: PendingComboContext | null,
): PendingComboContext | null {
  if (pendingCombo === null) {
    return null;
  }
  return {
    combo: pendingCombo.combo,
    candidates: pendingCombo.candidates.map((candidate) => ({
      type: candidate.type,
      key: candidate.key,
      tileIds: [...candidate.tileIds],
      labels: [...candidate.labels],
      prefabKeys: [...candidate.prefabKeys],
    })),
  };
}

function isNonEmptyStringArray(value: readonly string[]): boolean {
  return Array.isArray(value)
    && value.length > 0
    && value.every((entry) => typeof entry === "string" && entry.trim().length > 0);
}

function validateSnapshotSemantics(snapshot: RunSnapshot): void {
  const { phase, sessionSnapshot, context } = snapshot;
  if (PLAYING_PHASES.has(phase)) {
    if (!sessionSnapshot) {
      throw new Error("Playing run snapshot requires an attached session snapshot.");
    }
    if (sessionSnapshot.status === "cleared") {
      throw new Error("Active playing phase cannot restore a cleared session.");
    }
  }
  if (phase === "encounterCleared"
    && sessionSnapshot !== null
    && sessionSnapshot.status !== "cleared") {
    throw new Error("encounterCleared requires a cleared session.");
  }
  if ((phase === "rewardChoice" || phase === "eventChoice") && sessionSnapshot !== null) {
    throw new Error(`${phase} must restore without an attached session.`);
  }

  const needsPendingCombo = phase === "playing.comboChoosing"
    || (phase === "paused" && context.pauseReturnPhase === "playing.comboChoosing");
  if (needsPendingCombo && context.pendingCombo === null) {
    throw new Error(`${phase} requires pending combo context.`);
  }
  if (!needsPendingCombo && context.pendingCombo !== null) {
    throw new Error(`Pending combo context is not allowed during ${phase}.`);
  }

  if (phase === "rewardChoice") {
    if (context.targetLevelOrder === null) {
      throw new Error("Reward choice requires a target level.");
    }
    if (context.rewardCandidateIds.length === 0) {
      throw new Error("Reward choice requires at least one reward candidate.");
    }
    if (context.eventOptionIds.length > 0) {
      throw new Error("Event option ids are not allowed during rewardChoice.");
    }
  } else if (context.rewardCandidateIds.length > 0) {
    throw new Error(`Reward candidate ids are not allowed during ${phase}.`);
  }

  if (phase === "eventChoice") {
    if (context.targetLevelOrder === null) {
      throw new Error("Event choice requires a target level.");
    }
    if (context.eventOptionIds.length === 0) {
      throw new Error("Event choice requires at least one event option.");
    }
    if (context.rewardCandidateIds.length > 0) {
      throw new Error("Reward candidate ids are not allowed during eventChoice.");
    }
  } else if (context.eventOptionIds.length > 0) {
    throw new Error(`Event option ids are not allowed during ${phase}.`);
  }
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

function validateSessionCapabilities(
  snapshot: RunSnapshot,
  session: GameSession | null,
): void {
  if (session && snapshot.context.pendingCombo
    && !valuesEqual(
      session.getComboCandidateOptions(snapshot.context.pendingCombo.combo),
      snapshot.context.pendingCombo.candidates,
    )) {
    throw new Error("Pending combo context does not match the attached session.");
  }

  const needsDiscard = snapshot.phase === "playing.discardChoosing"
    || (snapshot.phase === "paused"
      && snapshot.context.pauseReturnPhase === "playing.discardChoosing");
  if (needsDiscard && session && !session.canUseDiscardTool()) {
    throw new Error("Discard choice requires discard to be available in the attached session.");
  }
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
