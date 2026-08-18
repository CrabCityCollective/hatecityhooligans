import {
  BASE_FORM,
  DRAW_SHARE_OF_REMAINDER,
  FORM_FLUCTUATION,
  MAX_FORM,
  MIN_FORM,
  ODDS_MARGIN,
} from "./constants";
import type { Bet, FootballMatch, MatchOdds, MatchOutcome, MatchResult } from "./types";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Laat de vorm licht fluctueren t.o.v. vorige week (design §5). */
export function nextForm(previousForm: number = BASE_FORM): number {
  const delta = (Math.random() * 2 - 1) * FORM_FLUCTUATION;
  return clamp(previousForm + delta, MIN_FORM, MAX_FORM);
}

function computeProbabilities(form: number): Record<MatchOutcome, number> {
  const winst = form;
  const gelijkspel = (1 - winst) * DRAW_SHARE_OF_REMAINDER;
  const verlies = 1 - winst - gelijkspel;
  return { winst, gelijkspel, verlies };
}

/** Eerlijke odds (1 / kans) verminderd met een huis-marge, afgerond op 2 decimalen. */
function oddsFromProbability(probability: number): number {
  const fairOdds = 1 / probability;
  return Math.round(fairOdds * (1 - ODDS_MARGIN) * 100) / 100;
}

function computeOdds(probabilities: Record<MatchOutcome, number>): MatchOdds {
  return {
    winst: oddsFromProbability(probabilities.winst),
    gelijkspel: oddsFromProbability(probabilities.gelijkspel),
    verlies: oddsFromProbability(probabilities.verlies),
  };
}

/** Genereert de wedstrijd van de eigen club voor deze week, met odds gebaseerd op de vorm (design §5). */
export function generateMatch(week: number, club: string, previousForm?: number): FootballMatch {
  const form = nextForm(previousForm);
  const probabilities = computeProbabilities(form);

  return {
    week,
    club,
    form,
    probabilities,
    odds: computeOdds(probabilities),
  };
}

function pickOutcome(probabilities: Record<MatchOutcome, number>): MatchOutcome {
  const roll = Math.random();
  if (roll < probabilities.winst) return "winst";
  if (roll < probabilities.winst + probabilities.gelijkspel) return "gelijkspel";
  return "verlies";
}

/** Speelt de wedstrijd af: bepaalt de uitslag en verwerkt een eventuele weddenschap (design §5). */
export function resolveMatch(match: FootballMatch, bet: Bet | null): MatchResult {
  const outcome = pickOutcome(match.probabilities);
  if (!bet) return { outcome, bet: null, payout: 0 };

  const payout = bet.outcome === outcome ? Math.round(bet.amount * match.odds[bet.outcome]) : 0;
  return { outcome, bet, payout };
}
