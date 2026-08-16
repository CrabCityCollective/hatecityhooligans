import type { Gang } from "./gang";

/** 1 = Eredivisie (hoogst), 3 = Tweede Divisie (laagst). Zie design §8. */
export type Division = 1 | 2 | 3;

/** Fase binnen de week-cyclus. Elke fase heeft een eigen route (zie lib/week-phase.ts). */
export type WeekPhase = "voorbereiding" | "gevecht" | "resultaat";

export interface GameState {
  currentWeek: number;
  currentPhase: WeekPhase;
  division: Division;
  /** 0-100: hoe voller de meter, hoe groter de kans dat achterblijvers opgepakt worden. */
  policeGaugePercent: number;
  gang: Gang;
}
