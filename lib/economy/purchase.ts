import type { Equipment, EquipmentId, Hooligan } from "@/types";
import { determineArrestOutcome } from "@/lib/gevecht/arrest";
import type { HooliganArrestResult } from "@/lib/gevecht/types";
import { getShopItem } from "./shop-items";

function createEquipmentInstanceId(itemId: EquipmentId): string {
  return `${itemId}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createEquipmentInstance(itemId: EquipmentId): Equipment {
  const item = getShopItem(itemId);
  return {
    instanceId: createEquipmentInstanceId(itemId),
    id: item.id,
    name: item.name,
    consumedOnUse: item.consumedOnUse,
  };
}

export interface DarkWebPurchaseResult {
  intercepted: boolean;
  item?: Equipment;
  arrest?: HooliganArrestResult;
}

/**
 * Bepaalt direct bij bestelling (niet bij gebruik) of een dark web-levering wordt onderschept
 * (design §4). Bij onderschepping is zowel de bestelling als de aangewezen ontvanger-hooligan
 * (via de bestaande arrestatie-uitkomst-logica uit het politie-meter-issue) verloren.
 */
export function attemptDarkWebPurchase(
  itemId: EquipmentId,
  receiver: Hooligan,
): DarkWebPurchaseResult {
  const item = getShopItem(itemId);
  const interceptionChance = item.interceptionChance ?? 0;

  if (Math.random() < interceptionChance) {
    return { intercepted: true, arrest: determineArrestOutcome(receiver) };
  }

  return { intercepted: false, item: createEquipmentInstance(itemId) };
}
