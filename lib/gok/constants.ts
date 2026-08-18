/** Tunable getallen voor het voetbal-gok-systeem. Zie hate-city-hooligans-design.md §5. */

/** Startwaarde van de vorm bij de allereerste wedstrijd (vóór enige fluctuatie). */
export const BASE_FORM = 0.45;

/** Maximale willekeurige op- of neerwaartse verschuiving van de vorm per week. */
export const FORM_FLUCTUATION = 0.15;

/** Ondergrens/bovengrens voor de vorm, zodat winstkansen nooit 0% of 100% worden. */
export const MIN_FORM = 0.1;
export const MAX_FORM = 0.9;

/** Aandeel van de "niet-winst"-kans dat naar gelijkspel gaat (de rest naar verlies). */
export const DRAW_SHARE_OF_REMAINDER = 0.4;

/** Huis-marge op de eerlijke odds (1 / winstkans), zodat de bank op termijn wint. */
export const ODDS_MARGIN = 0.1;
