/** Tunable getallen voor de gevecht-simulatie. Zie hate-city-hooligans-design.md §1 en §7. */

export const FIELD_WIDTH = 800;
export const FIELD_HEIGHT = 450;

/** Noodstop: garandeert dat het gevecht ook stopt als de politie-meter (bv. bij 0 beruchtheid) nooit vol raakt. */
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

/** Hoeveel procentpunt de politie-meter per seconde stijgt, per punt beruchtheid (design §2). */
export const POLICE_GAUGE_PERCENT_PER_SECOND_PER_NOTORIETY = 0.15;

/** Bovengrens voor hoe snel de meter kan vollopen, ook bij extreem hoge beruchtheid. */
export const POLICE_GAUGE_MAX_PERCENT_PER_SECOND = 8;

/**
 * Extra tijd (seconden) die een hooligan met bivakmuts blijft staan nadat de meter vol is, voordat
 * hij alsnog vlucht. Geen invloed op de tijd tot de meter zelf vol is (design §2).
 */
export const BIVAKMUTS_POLICE_TOLERANCE_SECONDS = 6;

/** Baseline aantal weken tijdelijk verlies bij arrestatie, zonder bijzondere traits (design §3). */
export const ARREST_BASE_WEEKS = 2;

/** Opgegroeid in de stad: kent zijn rechten, kortere straf. */
export const ARREST_STAD_WEEKS_DELTA = -1;

/** Gezin/kantoorbaan: praat sneller (verraad) maar krijgt zelf een kortere straf. */
export const ARREST_GEZIN_KANTOORBAAN_WEEKS_DELTA = -1;

/** Vechtsport-trait: wordt gezien als "getraind", zwaarder aangerekend. */
export const ARREST_VECHTSPORT_EXTRA_WEEKS = 2;

/** Houdt van raven / hard drugs: extra aanklacht wegens bezit. */
export const ARREST_DRUGS_EXTRA_WEEKS = 1;

/** Kans dat een alcoholprobleem leidt tot permanent verlies i.p.v. een langere straf. */
export const ARREST_ALCOHOL_PROBLEM_PERMANENT_CHANCE = 0.35;

/** Extra weken straf bij alcoholprobleem, als het geen permanent verlies wordt. */
export const ARREST_ALCOHOL_PROBLEM_EXTRA_WEEKS = 3;

/** Verhoging van de politie-meter-startwaarde volgende week, per hooligan die "verraadt". */
export const BETRAYAL_POLICE_GAUGE_START_BONUS_PERCENT = 15;

/** Bovengrens voor de politie-meter-startwaarde die door verraad kan worden opgebouwd. */
export const MAX_POLICE_GAUGE_START_PERCENT = 60;
