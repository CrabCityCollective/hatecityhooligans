/** Tunable getallen voor het economie-systeem. Zie hate-city-hooligans-design.md §4. */

/** Wekelijks inkomen per hooligan met een bijbaantje-trait: laag, zonder gevecht-consequenties. */
export const BIJBAANTJE_WEEKLY_INCOME = 40;

/**
 * Wekelijks inkomen per hooligan met een kantoorbaan-trait: hoog, maar deze hooligan zou als eerste
 * moeten vluchten zodra de politie-meter oploopt — zie de TODO bij `triggerPoliceFlee` in
 * lib/gevecht/simulation.ts en `heeftKantoorbaanTrait` in lib/gevecht/hooligan-traits.ts.
 */
export const KANTOORBAAN_WEEKLY_INCOME = 150;

export const BOUWMARKT_PRICES: Record<"plank-met-spijkers" | "hamer", number> = {
  "plank-met-spijkers": 15,
  hamer: 20,
};

type DarkWebItemId = "bivakmuts" | "pepperspray" | "taser" | "wapenstok" | "vuurwapen";

export const DARK_WEB_PRICES: Record<DarkWebItemId, number> = {
  bivakmuts: 80,
  pepperspray: 60,
  taser: 150,
  wapenstok: 220,
  vuurwapen: 750,
};

/** Kans op onderschepping bij bestelling, oplopend met het risiconiveau van het item (design §4). */
export const DARK_WEB_INTERCEPTION_CHANCE: Record<DarkWebItemId, number> = {
  bivakmuts: 0.05,
  pepperspray: 0.12,
  taser: 0.22,
  wapenstok: 0.35,
  vuurwapen: 0.6,
};

/** Kans dat een verbruiksartikel (plank met spijkers, hamer, pepperspray) na een gevecht kapot gaat. */
export const CONSUMABLE_BREAK_CHANCE = 0.8;
