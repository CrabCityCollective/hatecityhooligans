import type { Division } from "@/types";
import type { FightOutcome } from "@/lib/gevecht/types";

/** Eén club binnen de divisiestructuur (design §8/§9, MVP 8). */
export interface Club {
  id: string;
  name: string;
  division: Division;
  /** Basis-beruchtheidswaarde: hoger in hogere divisies, telt mee in de politie-meter-snelheid. */
  baseNotoriety: number;
  /** Primaire rivaal, indien vastgelegd (design §9). Voor alle rivaal-paren, zie ./rivalries. */
  rivalId?: string;
}

/** Eén wedstrijd-resultaat binnen het lopende seizoen. */
export interface SeasonMatchResult {
  week: number;
  opponentClubId: string;
  outcome: FightOutcome;
  isRivalMatch: boolean;
  /** Competitiepunten: 3 (full clear), 1 (timeout), 0 (verlies/politie-inval). */
  points: number;
}

export type SeasonStanding = "promotie" | "degradatie" | "handhaving";

/** Uitslag van een afgesloten seizoen: promotie/degradatie plus de cijfers waarop die is gebaseerd. */
export interface SeasonStandingResult {
  standing: SeasonStanding;
  fromDivision: Division;
  toDivision: Division;
  points: number;
  maxPoints: number;
}
