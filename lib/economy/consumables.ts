import type { Hooligan } from "@/types";
import { CONSUMABLE_BREAK_CHANCE } from "./constants";

export interface BrokenEquipmentEntry {
  hooliganId: string;
  hooliganName: string;
  equipmentName: string;
}

/**
 * Verbruiksartikelen (plank met spijkers, hamer, pepperspray) gaan na een gevecht meestal kapot
 * (design §4). Toegepast op het roster na elk gevecht — permanente items (bivakmuts, taser,
 * wapenstok, vuurwapen) blijven altijd behouden.
 */
export function applyConsumableBreakage(roster: Hooligan[]): {
  roster: Hooligan[];
  broken: BrokenEquipmentEntry[];
} {
  const broken: BrokenEquipmentEntry[] = [];

  const nextRoster = roster.map((hooligan) => {
    if (hooligan.status !== "available" || hooligan.equipment.length === 0) return hooligan;

    const equipment = hooligan.equipment.filter((item) => {
      if (!item.consumedOnUse) return true;
      const breaks = Math.random() < CONSUMABLE_BREAK_CHANCE;
      if (breaks) {
        broken.push({
          hooliganId: hooligan.id,
          hooliganName: hooligan.name,
          equipmentName: item.name,
        });
      }
      return !breaks;
    });

    if (equipment.length === hooligan.equipment.length) return hooligan;
    return { ...hooligan, equipment };
  });

  return { roster: nextRoster, broken };
}
