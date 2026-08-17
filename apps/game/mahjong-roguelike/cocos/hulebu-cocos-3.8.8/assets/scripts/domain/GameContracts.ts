import type {
  HulebuRuntimeComboCandidateOption,
  HulebuRuntimeSnapshot,
} from "../runtime/HulebuRuntimeState";

export type GameCombo = "chi" | "peng" | "gang" | "bugang" | "hu";

export type GameCommand =
  | { type: "tile.select"; tileId: string }
  | { type: "combo.execute"; combo: GameCombo }
  | { type: "combo.choose"; candidateId: string }
  | { type: "tool.use"; tool: "shuffle" | "undo" | "discard" }
  | { type: "slot.discard"; slotIndex: number }
  | { type: "reward.choose"; rewardId: string }
  | { type: "event.choose"; optionId: string }
  | { type: "flow.pause" }
  | { type: "flow.resume" };

export interface GameSnapshot {
  readonly schemaVersion: 1;
  readonly revision: number;
  readonly levelOrder: number;
  readonly status: "playing" | "cleared";
  readonly runtime: HulebuRuntimeSnapshot;
}

export type DomainEvent =
  | { type: "tile.selected"; tileId: string }
  | { type: "combo.choice.required"; combo: GameCombo; candidates: readonly HulebuRuntimeComboCandidateOption[] }
  | { type: "combo.executed"; combo: GameCombo; candidateId: string }
  | { type: "tool.used"; tool: "shuffle" | "undo" }
  | { type: "discard.choice.required" }
  | { type: "slot.discarded"; slotIndex: number }
  | { type: "reward.chosen"; rewardId: string }
  | { type: "event.chosen"; optionId: string }
  | { type: "flow.paused" }
  | { type: "flow.resumed" }
  | { type: "level.cleared" }
  | { type: "level.failed"; reason: "deadlock" }
  | { type: "command.rejected"; commandType: GameCommand["type"]; reason: string };

export interface CommandResult {
  readonly accepted: boolean;
  readonly changed: boolean;
  readonly snapshot: GameSnapshot;
  readonly events: readonly DomainEvent[];
}
