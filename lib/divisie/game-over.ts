import type { Gang } from "@/types";

/** Onder dit bedrag kan de bende zich niet meer herstellen zonder inzetbare hooligans (MVP 8). */
export const GANG_COLLAPSE_MONEY_THRESHOLD = 0;

/** Totale gang-ineenstorting: geen inzetbare hooligans meer én onvoldoende geld om op te bouwen. */
export function isGangCollapsed(gang: Gang): boolean {
  const hasAvailableHooligan = gang.roster.some((hooligan) => hooligan.status === "available");
  return !hasAvailableHooligan && gang.money <= GANG_COLLAPSE_MONEY_THRESHOLD;
}
