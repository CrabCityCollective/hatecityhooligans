import type { Hooligan } from "@/types";
import {
  ARREST_ALCOHOL_PROBLEM_EXTRA_WEEKS,
  ARREST_ALCOHOL_PROBLEM_PERMANENT_CHANCE,
  ARREST_BASE_WEEKS,
  ARREST_DRUGS_EXTRA_WEEKS,
  ARREST_GEZIN_KANTOORBAAN_WEEKS_DELTA,
  ARREST_STAD_WEEKS_DELTA,
  ARREST_VECHTSPORT_EXTRA_WEEKS,
} from "./constants";
import { heeftVechtsportTrait } from "./hooligan-traits";
import type { ArrestOutcome, HooliganArrestResult } from "./types";

function heeftGezinOfKantoorbaanTrait(hooligan: Hooligan): boolean {
  return hooligan.traits.background.some(
    (trait) => trait === "heeft-een-gezin" || trait === "kantoorbaan",
  );
}

function heeftStadTrait(hooligan: Hooligan): boolean {
  return hooligan.traits.background.includes("opgegroeid-in-stad");
}

function heeftDrugsTrait(hooligan: Hooligan): boolean {
  return (
    hooligan.traits.background.includes("houdt-van-raven") ||
    hooligan.traits.substancePreference === "cocaine" ||
    hooligan.traits.substancePreference === "xtc"
  );
}

/**
 * Bepaalt de arrestatie-uitkomst van een opgepakte hooligan op basis van diens traits
 * (design §3 / trait-tabel). Combineert modifiers uit meerdere traits tot een uiteindelijke
 * uitkomst: tijdelijk verlies (X weken) of permanent verlies, met optioneel een "verraad"-flag.
 */
export function determineArrestOutcome(hooligan: Hooligan): HooliganArrestResult {
  const reasons: string[] = [];
  let weeks = ARREST_BASE_WEEKS;
  let betrayal = false;

  if (heeftGezinOfKantoorbaanTrait(hooligan)) {
    weeks += ARREST_GEZIN_KANTOORBAAN_WEEKS_DELTA;
    betrayal = true;
    reasons.push("Praat sneller (gezin/kantoorbaan) — verraadt de bende, kortere eigen straf");
  }
  if (heeftStadTrait(hooligan)) {
    weeks += ARREST_STAD_WEEKS_DELTA;
    reasons.push("Kent zijn rechten (opgegroeid in de stad) — kortere straf");
  }
  if (hooligan.traits.background.includes("woont-in-dorp")) {
    reasons.push(
      "Onbekend bij de lokale politie (woont in een dorp) — mindere kans op herkenning volgende keer",
    );
  }
  if (heeftVechtsportTrait(hooligan)) {
    weeks += ARREST_VECHTSPORT_EXTRA_WEEKS;
    reasons.push("Gezien als getraind (vechtsport) — zwaarder aangerekend, langere straf");
  }
  if (heeftDrugsTrait(hooligan)) {
    weeks += ARREST_DRUGS_EXTRA_WEEKS;
    reasons.push("Extra aanklacht wegens bezit (drugs) — langere straf");
  }

  if (hooligan.traits.hasAlcoholProblem) {
    reasons.push("Alcoholprobleem — recidive-dossier, hogere kans op lange straf");
    if (Math.random() < ARREST_ALCOHOL_PROBLEM_PERMANENT_CHANCE) {
      reasons.push("Permanent verlies");
      return {
        hooliganId: hooligan.id,
        hooliganName: hooligan.name,
        outcome: { type: "permanent" },
        betrayal,
        reasons,
      };
    }
    weeks += ARREST_ALCOHOL_PROBLEM_EXTRA_WEEKS;
  }

  if (reasons.length === 0) {
    reasons.push("Geen bijzondere traits — kort tijdelijk verlies");
  }

  const outcome: ArrestOutcome = { type: "temporary", weeks: Math.max(1, weeks) };
  return {
    hooliganId: hooligan.id,
    hooliganName: hooligan.name,
    outcome,
    betrayal,
    reasons,
  };
}
