/**
 * Achtergrond-traits die het gedrag van een hooligan beinvloeden
 * (recruitment, gevecht, arrestatie). Zie hate-city-hooligans-design.md §7.
 */
export type BackgroundTrait =
  | "kickboksen"
  | "karate"
  | "houdt-van-raven"
  | "heeft-een-gezin"
  | "kantoorbaan"
  | "bijbaantje"
  | "woont-in-dorp"
  | "opgegroeid-in-stad";

export type SubstancePreference = "wiet" | "cocaine" | "alcohol" | "xtc";

export type HateTrigger =
  | "rivaliserende-club"
  | "jongeren"
  | "snor"
  | "tattoos"
  | "andere-huidskleur"
  | "huisdieren";

export interface HooliganTraits {
  background: BackgroundTrait[];
  substancePreference?: SubstancePreference;
  hasAlcoholProblem: boolean;
  hateTriggers: HateTrigger[];
  /**
   * Zichtbare eigenschappen van deze hooligan zelf (tattoo, snor, ...). Tegenstanders met de
   * bijbehorende `hateTrigger` krijgen hierdoor een haat-bonus richting deze hooligan tijdens het
   * gevecht. Zie design §7.
   */
  visibleTraits: Exclude<HateTrigger, "rivaliserende-club">[];
}

/**
 * Status van een hooligan tussen gevechten door.
 * "unavailable" = tijdelijk verlies (zie §3), duur staat in `unavailableUntilWeek`.
 */
export type HooliganStatus =
  | "available"
  | "unavailable"
  | "arrested"
  | "dead";

export type EquipmentId =
  | "plank-met-spijkers"
  | "hamer"
  | "bivakmuts"
  | "pepperspray"
  | "taser"
  | "wapenstok"
  | "vuurwapen";

export interface Equipment {
  id: EquipmentId;
  name: string;
  /** Verbruikt na gebruik (bv. pepperspray) vs. permanent bezit (bv. bivakmuts). */
  consumedOnUse: boolean;
}

export interface Hooligan {
  id: string;
  name: string;
  traits: HooliganTraits;
  status: HooliganStatus;
  equipment: Equipment[];
  /** Alleen relevant als status === "unavailable". */
  unavailableUntilWeek?: number;
}
