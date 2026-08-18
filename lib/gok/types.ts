/** Mogelijke uitslagen van de wedstrijd van de eigen club (design §5). */
export type MatchOutcome = "winst" | "gelijkspel" | "verlies";

export type MatchOdds = Record<MatchOutcome, number>;

export interface FootballMatch {
  week: number;
  /** Naam van de eigen club (`Gang.favoriteClub`), of een placeholder als die nog niet gekozen is. */
  club: string;
  /**
   * Vorm van de eigen club deze week: 0-1, hoger = grotere winstkans. Fluctueert licht per week
   * t.o.v. de vorige waarde (design §5).
   */
  form: number;
  /** Winstkans per uitkomst; som is altijd 1. */
  probabilities: Record<MatchOutcome, number>;
  /** Uitbetalingsfactor per uitkomst, afgeleid van de winstkans (design §5). */
  odds: MatchOdds;
}

export interface Bet {
  outcome: MatchOutcome;
  /** Ingezet bedrag; al afgeschreven van het gang-geld op het moment van plaatsen. */
  amount: number;
}

export interface MatchResult {
  outcome: MatchOutcome;
  bet: Bet | null;
  /** Uitbetaling (0 bij geen weddenschap of een foute voorspelling). */
  payout: number;
}
