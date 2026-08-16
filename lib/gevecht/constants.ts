/** Tunable getallen voor de gevecht-simulatie. Zie hate-city-hooligans-design.md §1 en §7. */

export const FIELD_WIDTH = 800;
export const FIELD_HEIGHT = 450;

/** Noodstop-placeholder: het gevecht stopt sowieso na deze duur (politie-meter volgt in een later issue). */
export const MAX_FIGHT_DURATION_SECONDS = 90;

export const CONTACT_RANGE = 22;

export const BASE_SPEED = 70;
export const COCAINE_SPEED_MULTIPLIER = 2;
export const DRONKEN_SPEED_MULTIPLIER = 0.6;

export const BASE_HEALTH = 100;
export const BASE_DAMAGE_PER_SECOND = 14;

export const VECHTSPORT_DAMAGE_MULTIPLIER = 1.4;
export const DRONKEN_MISS_CHANCE = 0.35;
export const DRONKEN_DAMAGE_MULTIPLIER = 0.75;

/** Percentage extra schade per punt haat-score tegen die specifieke tegenstander. */
export const HATE_DAMAGE_BONUS_PER_POINT = 0.04;

/**
 * Kans dat een hooligan vlucht i.p.v. neergaat zodra zijn gezondheid op 0 zou komen.
 * Basis-implementatie zonder trait-afhankelijkheid, zoals gevraagd in het issue.
 */
export const FLEE_CHANCE_ON_LETHAL_HIT = 0.35;
