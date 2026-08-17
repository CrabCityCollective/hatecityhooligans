import type { BackgroundTrait, HateTrigger, Hooligan, SubstancePreference } from "@/types";
import {
  FIRST_NAMES,
  LAST_NAME_INITIALS,
  createId,
  pickOne,
  pickSome,
} from "@/lib/gevecht/generate-team";
import type { RecruitmentLocationId } from "./types";

/** Beruchtheid waarbij kandidaat-kwaliteit en undercover-kans hun maximum bereiken (design §6). */
const NOTORIETY_CAP = 100;

const UNDERCOVER_BASE_CHANCE = 0.02;
const UNDERCOVER_MAX_CHANCE = 0.25;

/** Locatie-bias: welke background-traits krijgen een verhoogde (niet gegarandeerde) kans. */
const LOCATION_BACKGROUND_BIAS: Record<RecruitmentLocationId, BackgroundTrait[]> = {
  sportschool: ["kickboksen", "karate"],
  rave: ["houdt-van-raven"],
  schoolplein: ["heeft-een-gezin"],
};

const LOCATION_SUBSTANCE_BIAS: Partial<Record<RecruitmentLocationId, SubstancePreference>> = {
  rave: "xtc",
};

const OTHER_BACKGROUND_TRAITS: BackgroundTrait[] = [
  "kantoorbaan",
  "bijbaantje",
  "woont-in-dorp",
  "opgegroeid-in-stad",
];

const SUBSTANCE_PREFERENCES: SubstancePreference[] = ["wiet", "cocaine", "alcohol", "xtc"];

const HATE_TRIGGERS: Exclude<HateTrigger, "rivaliserende-club">[] = [
  "jongeren",
  "snor",
  "tattoos",
  "andere-huidskleur",
  "huisdieren",
];

/** 0 (geen beruchtheid) .. 1 (op of boven de cap) — stuurt zowel kwaliteit als undercover-kans. */
function qualityScore(notoriety: number): number {
  return Math.max(0, Math.min(1, notoriety / NOTORIETY_CAP));
}

/**
 * Genereert een recruitment-kandidaat voor `location`. Hogere `notoriety` maakt traits gunstiger
 * (meer/betere background-traits, minder kans op alcoholprobleem) en verhoogt de kans dat de
 * kandidaat stiekem een undercover agent is (§6) — de gameplay-consequentie daarvan is een TODO
 * voor een later issue, dit issue slaat alleen de `isUndercoverAgent`-flag op.
 */
export function generateCandidate(location: RecruitmentLocationId, notoriety: number): Hooligan {
  const quality = qualityScore(notoriety);
  const name = `${pickOne(FIRST_NAMES)} ${pickOne(LAST_NAME_INITIALS)}.`;

  const biasedTraits = LOCATION_BACKGROUND_BIAS[location].filter(
    () => Math.random() < 0.5 + quality * 0.4,
  );
  const extraTraits = pickSome(OTHER_BACKGROUND_TRAITS, 0.15 + quality * 0.1);
  const background = Array.from(new Set([...biasedTraits, ...extraTraits]));

  const biasedSubstance = LOCATION_SUBSTANCE_BIAS[location];
  const hasBiasedSubstance = biasedSubstance && Math.random() < 0.55 + quality * 0.25;
  const substancePreference = hasBiasedSubstance
    ? biasedSubstance
    : Math.random() < 0.5
      ? pickOne(SUBSTANCE_PREFERENCES)
      : undefined;

  const hasAlcoholProblem = Math.random() < Math.max(0.03, 0.2 - quality * 0.15);

  const undercoverChance =
    UNDERCOVER_BASE_CHANCE + quality * (UNDERCOVER_MAX_CHANCE - UNDERCOVER_BASE_CHANCE);

  return {
    id: createId("hooligan"),
    name,
    traits: {
      background,
      substancePreference,
      hasAlcoholProblem,
      hateTriggers: ["rivaliserende-club", ...pickSome(HATE_TRIGGERS, 0.3)],
      visibleTraits: pickSome(HATE_TRIGGERS, 0.3),
    },
    status: "available",
    equipment: [],
    isUndercoverAgent: Math.random() < undercoverChance,
  };
}
