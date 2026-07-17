import {
  HulebuRuntimeState,
  type HulebuRuntimeComboCandidateOption,
} from "../runtime/HulebuRuntimeState";
import type {
  CommandResult,
  DomainEvent,
  GameCombo,
  GameCommand,
  GameSnapshot,
} from "./GameContracts";

const GAME_COMBOS: readonly GameCombo[] = ["chi", "peng", "gang", "bugang", "hu"];

export class GameSession {
  constructor(
    private readonly runtime: HulebuRuntimeState,
    private revision = 0,
  ) {}

  dispatch(command: GameCommand): CommandResult {
    switch (command.type) {
      case "tile.select":
        return this.dispatchMutation(
          command,
          () => this.runtime.moveTileToSlot(command.tileId),
          { type: "tile.selected", tileId: command.tileId },
          "Tile cannot be selected.",
        );
      case "combo.execute":
        return this.executeCombo(command);
      case "combo.choose":
        return this.chooseCombo(command);
      case "tool.use":
        return this.useTool(command);
      case "slot.discard":
        if (!this.runtime.canUseDiscardTool()) {
          return this.reject(command, "Discard is not available.");
        }
        return this.dispatchMutation(
          command,
          () => this.runtime.discardSlotTile(command.slotIndex),
          { type: "slot.discarded", slotIndex: command.slotIndex },
          "Slot tile cannot be discarded.",
        );
      case "reward.choose":
      case "event.choose":
      case "flow.pause":
      case "flow.resume":
        return this.reject(command, "Command belongs to the application flow coordinator.");
    }
  }

  snapshot(): GameSnapshot {
    return {
      schemaVersion: 1,
      revision: this.revision,
      levelOrder: this.runtime.getLevelOrder(),
      status: this.runtime.isLevelCleared() ? "cleared" : "playing",
      runtime: this.runtime.exportSnapshot(),
    };
  }

  getComboCandidateOptions(combo: GameCombo): readonly HulebuRuntimeComboCandidateOption[] {
    return this.runtime.getComboCandidateOptions(combo);
  }

  canUseDiscardTool(): boolean {
    return this.runtime.canUseDiscardTool();
  }

  private executeCombo(command: Extract<GameCommand, { type: "combo.execute" }>): CommandResult {
    const candidates = this.runtime.getComboCandidateOptions(command.combo);
    if (candidates.length === 0) {
      return this.reject(command, "No matching combo candidate.");
    }
    if (candidates.length > 1) {
      return this.acceptWithoutMutation({
        type: "combo.choice.required",
        combo: command.combo,
        candidates: cloneCandidates(candidates),
      });
    }

    const candidate = candidates[0];
    return this.dispatchMutation(
      command,
      () => this.runtime.executeComboByKey(candidate.key),
      { type: "combo.executed", combo: command.combo, candidateId: candidate.key },
      "Combo candidate can no longer be executed.",
    );
  }

  private chooseCombo(command: Extract<GameCommand, { type: "combo.choose" }>): CommandResult {
    const candidate = GAME_COMBOS
      .flatMap((combo) => this.runtime.getComboCandidateOptions(combo))
      .find((option) => option.key === command.candidateId);
    if (!candidate) {
      return this.reject(command, "Combo candidate id is not available.");
    }

    return this.dispatchMutation(
      command,
      () => this.runtime.executeComboByKey(candidate.key),
      { type: "combo.executed", combo: candidate.type, candidateId: candidate.key },
      "Combo candidate can no longer be executed.",
    );
  }

  private useTool(command: Extract<GameCommand, { type: "tool.use" }>): CommandResult {
    if (command.tool === "discard") {
      return this.runtime.canUseDiscardTool()
        ? this.acceptWithoutMutation({ type: "discard.choice.required" })
        : this.reject(command, "Discard is not available.");
    }

    return this.dispatchMutation(
      command,
      command.tool === "shuffle"
        ? () => this.runtime.useShuffleTool()
        : () => this.runtime.useUndoTool(),
      { type: "tool.used", tool: command.tool },
      `${command.tool === "shuffle" ? "Shuffle" : "Undo"} is not available.`,
    );
  }

  private dispatchMutation(
    command: GameCommand,
    mutate: () => boolean,
    event: DomainEvent,
    rejectionReason: string,
  ): CommandResult {
    const wasCleared = this.runtime.isLevelCleared();
    if (!mutate()) {
      return this.reject(command, rejectionReason);
    }

    this.revision += 1;
    const events: DomainEvent[] = [event];
    if (!wasCleared && this.runtime.isLevelCleared()) {
      events.push({ type: "level.cleared" });
    }
    return {
      accepted: true,
      changed: true,
      snapshot: this.snapshot(),
      events,
    };
  }

  private acceptWithoutMutation(event: DomainEvent): CommandResult {
    return {
      accepted: true,
      changed: false,
      snapshot: this.snapshot(),
      events: [event],
    };
  }

  private reject(command: GameCommand, reason: string): CommandResult {
    return {
      accepted: false,
      changed: false,
      snapshot: this.snapshot(),
      events: [{ type: "command.rejected", commandType: command.type, reason }],
    };
  }
}

function cloneCandidates(
  candidates: readonly HulebuRuntimeComboCandidateOption[],
): HulebuRuntimeComboCandidateOption[] {
  return candidates.map((candidate) => ({
    ...candidate,
    tileIds: [...candidate.tileIds],
    labels: [...candidate.labels],
    prefabKeys: [...candidate.prefabKeys],
  }));
}
