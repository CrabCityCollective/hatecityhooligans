import type { Equipment, EquipmentId } from "@/types";

/**
 * Simpele schade-modifier per wapentype (vermenigvuldiger op de basis-schade).
 * Voor dit issue volstaat een vlakke bonus per item; een volwaardig itemsysteem volgt in de
 * economie-issue. Pepperspray/taser zijn stun-items zonder rechtstreekse schade-bonus.
 */
const EQUIPMENT_DAMAGE_MULTIPLIER: Record<EquipmentId, number> = {
  "plank-met-spijkers": 1.3,
  hamer: 1.3,
  bivakmuts: 1,
  pepperspray: 1,
  taser: 1,
  wapenstok: 1.6,
  vuurwapen: 2.2,
};

export function equipmentDamageMultiplier(equipment: Equipment[]): number {
  return equipment.reduce(
    (multiplier, item) => multiplier * EQUIPMENT_DAMAGE_MULTIPLIER[item.id],
    1,
  );
}
