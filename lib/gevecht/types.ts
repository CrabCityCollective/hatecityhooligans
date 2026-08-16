import type { Hooligan } from "@/types";

export type TeamId = "player" | "opponent";

export type CombatantState =
  | "idle"
  | "moving"
  | "fighting"
  | "fleeing"
  | "fled"
  | "downed";

export interface Vector2 {
  x: number;
  y: number;
}

export interface Combatant {
  id: string;
  hooligan: Hooligan;
  team: TeamId;
  position: Vector2;
  state: CombatantState;
  health: number;
  maxHealth: number;
  speed: number;
  /** Huidig doelwit: de tegenstander waar deze hooligan naartoe rent of tegen vecht. */
  targetId: string | null;
  duelId: string | null;
}

/**
 * Een "kluitje": een of meer hooligans van beide teams die op dezelfde plek vergrendeld zijn in
 * een gevecht. Meer dan 1 deelnemer per kant = kluitjesvorming / 2-tegen-1.
 */
export interface Duel {
  id: string;
  position: Vector2;
  participantIds: string[];
}

export type FightOutcome = "full-clear-player" | "full-clear-opponent" | "timeout";

export interface FightResult {
  outcome: FightOutcome;
  koCounts: Record<TeamId, number>;
  fledCounts: Record<TeamId, number>;
}

export interface FightConfig {
  fieldWidth: number;
  fieldHeight: number;
  maxDurationSeconds: number;
}

export interface FightState {
  config: FightConfig;
  elapsedSeconds: number;
  combatants: Combatant[];
  duels: Duel[];
  status: "in-progress" | "finished";
  result: FightResult | null;
}
