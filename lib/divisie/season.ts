import type { Division } from "@/types";
import type { FightOutcome } from "@/lib/gevecht/types";
import { getClubsByDivision } from "./clubs";
import type { SeasonStanding } from "./types";

const POINTS_PER_OUTCOME: Record<FightOutcome, number> = {
  "full-clear-player": 3,
  timeout: 1,
  "police-raid": 0,
  "full-clear-opponent": 0,
};

/** Competitiepunten voor een gevecht-uitkomst: winst/full clear > timeout > verlies/politie-inval. */
export function pointsForOutcome(outcome: FightOutcome): number {
  return POINTS_PER_OUTCOME[outcome];
}

/** Seizoenslengte = aantal clubs in de divisie (MVP 8). */
export function seasonLengthForDivision(division: Division): number {
  return getClubsByDivision(division).length;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Geschudde tegenstander-volgorde (round-robin) voor een nieuw seizoen in `division`, exclusief
 * `ownClubId`. Simpele round-robin per issue MVP 8 — bij seizoenen langer dan het aantal
 * tegenstanders wrapt de volgorde rond (zie `opponentForMatchIndex`).
 */
export function generateOpponentOrder(ownClubId: string, division: Division): string[] {
  const others = getClubsByDivision(division)
    .map((club) => club.id)
    .filter((id) => id !== ownClubId);
  return shuffle(others);
}

/** Tegenstander voor de zoveelste (0-based) wedstrijd van het seizoen. */
export function opponentForMatchIndex(opponentOrder: string[], matchIndex: number): string {
  if (opponentOrder.length === 0) return "";
  return opponentOrder[matchIndex % opponentOrder.length];
}

/** Aandeel van de behaalde punten t.o.v. het maximum waarboven promotie volgt. */
const PROMOTION_POINT_SHARE = 2 / 3;
/** Aandeel van de behaalde punten t.o.v. het maximum waaronder degradatie volgt. */
const RELEGATION_POINT_SHARE = 1 / 3;

/** Bepaalt promotie/degradatie o.b.v. het aandeel behaalde punten t.o.v. het maximum (design §8). */
export function evaluateSeasonStanding(totalPoints: number, matchesPlayed: number): SeasonStanding {
  if (matchesPlayed === 0) return "handhaving";
  const share = totalPoints / (matchesPlayed * 3);
  if (share >= PROMOTION_POINT_SHARE) return "promotie";
  if (share <= RELEGATION_POINT_SHARE) return "degradatie";
  return "handhaving";
}

/** Past promotie/degradatie toe; klemt aan divisie 1 (hoogst) en divisie 3 (laagst). */
export function applyStanding(division: Division, standing: SeasonStanding): Division {
  if (standing === "promotie") return Math.max(1, division - 1) as Division;
  if (standing === "degradatie") return Math.min(3, division + 1) as Division;
  return division;
}
