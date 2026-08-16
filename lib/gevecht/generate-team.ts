import type {
  BackgroundTrait,
  HateTrigger,
  Hooligan,
  SubstancePreference,
} from "@/types";

const FIRST_NAMES = [
  "Kevin",
  "Dennis",
  "Ricardo",
  "Bart",
  "Wesley",
  "Jeroen",
  "Mo",
  "Youssef",
  "Tim",
  "Rick",
  "Ferry",
  "Danny",
  "Ruben",
  "Sander",
  "Tom",
  "Melvin",
];

const LAST_NAME_INITIALS = "BCDFGHJKLMNPRSTVW".split("");

const BACKGROUND_TRAITS: BackgroundTrait[] = [
  "kickboksen",
  "karate",
  "houdt-van-raven",
  "heeft-een-gezin",
  "kantoorbaan",
  "bijbaantje",
  "woont-in-dorp",
  "opgegroeid-in-stad",
];

const SUBSTANCE_PREFERENCES: SubstancePreference[] = [
  "wiet",
  "cocaine",
  "alcohol",
  "xtc",
];

const HATE_TRIGGERS: HateTrigger[] = [
  "jongeren",
  "snor",
  "tattoos",
  "andere-huidskleur",
  "huisdieren",
];

const VISIBLE_TRAITS: Exclude<HateTrigger, "rivaliserende-club">[] = [
  "jongeren",
  "snor",
  "tattoos",
  "andere-huidskleur",
  "huisdieren",
];

function pickOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function pickSome<T>(items: T[], chance: number): T[] {
  return items.filter(() => Math.random() < chance);
}

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Genereert een placeholder-hooligan met willekeurige traits. Gebruikt totdat recruitment bestaat. */
export function generateHooligan(namePrefix = ""): Hooligan {
  const name = `${namePrefix}${pickOne(FIRST_NAMES)} ${pickOne(LAST_NAME_INITIALS)}.`;

  return {
    id: createId("hooligan"),
    name,
    traits: {
      background: pickSome(BACKGROUND_TRAITS, 0.25),
      substancePreference:
        Math.random() < 0.6 ? pickOne(SUBSTANCE_PREFERENCES) : undefined,
      hasAlcoholProblem: Math.random() < 0.15,
      hateTriggers: ["rivaliserende-club", ...pickSome(HATE_TRIGGERS, 0.3)],
      visibleTraits: pickSome(VISIBLE_TRAITS, 0.3),
    },
    status: "available",
    equipment: [],
  };
}

/** Genereert een volledig tegenstander-team van `size` willekeurige hooligans. */
export function generateOpponentTeam(size: number): Hooligan[] {
  return Array.from({ length: size }, () => generateHooligan());
}

/**
 * Vult het roster van de speler aan tot minstens `minSize` leden met placeholder-hooligans, en
 * beperkt tot maximaal `maxSize`. Nodig zolang recruitment nog geen roster vult (zie CLAUDE.md).
 */
export function padRosterForFight(
  roster: Hooligan[],
  minSize: number,
  maxSize: number,
): Hooligan[] {
  const available = roster.filter((hooligan) => hooligan.status === "available");
  const padded = [...available];

  while (padded.length < minSize) {
    padded.push(generateHooligan());
  }

  return padded.slice(0, maxSize);
}
