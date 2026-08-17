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
  /** Extra tijd (seconden) voordat deze hooligan vlucht nadat de politie-meter vol is (bivakmuts). */
  policeToleranceSeconds: number;
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

export type FightOutcome =
  | "full-clear-player"
  | "full-clear-opponent"
  | "police-raid"
  | "timeout";

/** Uitkomst van een arrestatie: zie design §3. "Verraad" is een modifier bovenop beide (zie `betrayal`). */
export interface ArrestOutcome {
  type: "temporary" | "permanent";
  /** Alleen relevant als `type === "temporary"`. */
  weeks?: number;
}

export interface HooliganArrestResult {
  hooliganId: string;
  hooliganName: string;
  outcome: ArrestOutcome;
  /** Verraadt de bende: verhoogt de politie-meter-startwaarde van het volgende gevecht. */
  betrayal: boolean;
  /** Leesbare toelichting per trait die aan deze uitkomst bijdroeg. */
  reasons: string[];
}

export interface FightResult {
  outcome: FightOutcome;
  koCounts: Record<TeamId, number>;
  fledCounts: Record<TeamId, number>;
  /** Opgepakte hooligans uit de eigen gang, met hun trait-gebaseerde uitkomst (design §3). */
  arrests: HooliganArrestResult[];
  /** Politie-meter-startwaarde voor het volgende gevecht (hoger bij verraad). */
  nextPoliceGaugeStartPercent: number;
}

export interface FightConfig {
  fieldWidth: number;
  fieldHeight: number;
  maxDurationSeconds: number;
  /** Huidige beruchtheid van de gang: bepaalt hoe snel de politie-meter oploopt (design §2). */
  notoriety: number;
  /** Startwaarde van de politie-meter bij het begin van dit gevecht (bv. door verraad vorige week). */
  startingPoliceGaugePercent: number;
}

export interface FightState {
  config: FightConfig;
  elapsedSeconds: number;
  combatants: Combatant[];
  duels: Duel[];
  status: "in-progress" | "finished";
  result: FightResult | null;
  policeGaugePercent: number;
  /** `elapsedSeconds` waarop de meter voor het eerst vol was, of null zolang dat nog niet zo is. */
  policeGaugeFullAtSeconds: number | null;
}
