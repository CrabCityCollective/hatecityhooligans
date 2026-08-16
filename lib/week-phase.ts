import type { WeekPhase } from "@/types";

/** Volgorde van de week-cyclus. Na de laatste fase begint een nieuwe week bij de eerste. */
export const PHASE_ORDER: WeekPhase[] = ["voorbereiding", "gevecht", "resultaat"];

export const PHASE_ROUTES: Record<WeekPhase, string> = {
  voorbereiding: "/voorbereiding",
  gevecht: "/gevecht",
  resultaat: "/resultaat",
};

export const PHASE_LABELS: Record<WeekPhase, string> = {
  voorbereiding: "Voorbereiding",
  gevecht: "Gevecht",
  resultaat: "Resultaat",
};
