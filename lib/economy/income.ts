import type { Hooligan } from "@/types";
import { BIJBAANTJE_WEEKLY_INCOME, KANTOORBAAN_WEEKLY_INCOME } from "./constants";

export interface WeeklyIncomeEntry {
  hooliganId: string;
  hooliganName: string;
  source: "bijbaantje" | "kantoorbaan";
  amount: number;
}

export interface WeeklyIncome {
  total: number;
  entries: WeeklyIncomeEntry[];
}

/**
 * Berekent het wekelijkse inkomen uit baantjes van beschikbare hooligans (design §4). Alleen
 * `available` hooligans werken; arrestatie/afwezigheid/dood levert geen inkomen op. Gevechten
 * leveren in de MVP geen geld op — dit zijn de enige inkomstenbronnen.
 */
export function computeWeeklyIncome(roster: Hooligan[]): WeeklyIncome {
  const entries: WeeklyIncomeEntry[] = [];

  for (const hooligan of roster) {
    if (hooligan.status !== "available") continue;

    if (hooligan.traits.background.includes("bijbaantje")) {
      entries.push({
        hooliganId: hooligan.id,
        hooliganName: hooligan.name,
        source: "bijbaantje",
        amount: BIJBAANTJE_WEEKLY_INCOME,
      });
    }
    if (hooligan.traits.background.includes("kantoorbaan")) {
      entries.push({
        hooliganId: hooligan.id,
        hooliganName: hooligan.name,
        source: "kantoorbaan",
        amount: KANTOORBAAN_WEEKLY_INCOME,
      });
    }
  }

  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
  return { total, entries };
}
