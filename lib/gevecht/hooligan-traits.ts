import type { HateTrigger, Hooligan } from "@/types";

/** Baseline haat richting elke tegenstander, puur omdat die bij de rivaliserende club hoort. */
const RIVAL_CLUB_BASE_HATE = 3;

/** Extra haat per zichtbare eigenschap van de tegenstander die de aanvaller als hate-trigger heeft. */
const TRIGGER_HATE_BONUS = 2;

/**
 * Scoort hoeveel haat `attacker` richting `defender` heeft. Gebruikt zowel voor targeting
 * (hoogst scorende target wint) als voor de schade-bonus tijdens een duel. Zie design §1 en §7.
 */
export function computeHateScore(attacker: Hooligan, defender: Hooligan): number {
  const relevantTriggers = attacker.traits.hateTriggers.filter(
    (trigger): trigger is Exclude<HateTrigger, "rivaliserende-club"> =>
      trigger !== "rivaliserende-club",
  );
  const matchingTriggers = relevantTriggers.filter((trigger) =>
    defender.traits.visibleTraits.includes(trigger),
  ).length;

  return RIVAL_CLUB_BASE_HATE + matchingTriggers * TRIGGER_HATE_BONUS;
}

export function isDronken(hooligan: Hooligan): boolean {
  return hooligan.traits.substancePreference === "alcohol";
}

export function heeftCocaine(hooligan: Hooligan): boolean {
  return hooligan.traits.substancePreference === "cocaine";
}

export function heeftVechtsportTrait(hooligan: Hooligan): boolean {
  return hooligan.traits.background.some(
    (trait) => trait === "kickboksen" || trait === "karate",
  );
}

export function heeftBivakmuts(hooligan: Hooligan): boolean {
  return hooligan.equipment.some((item) => item.id === "bivakmuts");
}

export function heeftVuurwapen(hooligan: Hooligan): boolean {
  return hooligan.equipment.some((item) => item.id === "vuurwapen");
}

/**
 * Kantoorbaan-hooligans genereren hoog inkomen (zie lib/economy/constants.ts) maar zouden als
 * eerste moeten vluchten zodra de politie-meter oploopt (design §4) — nog niet verwerkt in de
 * vlucht-logica, zie de TODO bij `triggerPoliceFlee` in simulation.ts.
 */
export function heeftKantoorbaanTrait(hooligan: Hooligan): boolean {
  return hooligan.traits.background.includes("kantoorbaan");
}
