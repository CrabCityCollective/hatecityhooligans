import type { EquipmentId } from "@/types";
import {
  BOUWMARKT_PRICES,
  DARK_WEB_INTERCEPTION_CHANCE,
  DARK_WEB_PRICES,
} from "./constants";

export type ShopCategory = "bouwmarkt" | "dark-web";

export interface ShopItem {
  id: EquipmentId;
  name: string;
  description: string;
  price: number;
  consumedOnUse: boolean;
  category: ShopCategory;
  /** Alleen voor dark web-items: kans op onderschepping bij bestelling (design §4). */
  interceptionChance?: number;
}

export const BOUWMARKT_ITEMS: ShopItem[] = [
  {
    id: "plank-met-spijkers",
    name: "Plank met spijkers",
    description: "Matige schade-bonus. Meestal kapot na 1 gevecht.",
    price: BOUWMARKT_PRICES["plank-met-spijkers"],
    consumedOnUse: true,
    category: "bouwmarkt",
  },
  {
    id: "hamer",
    name: "Hamer",
    description: "Matige schade-bonus. Meestal kapot na 1 gevecht.",
    price: BOUWMARKT_PRICES.hamer,
    consumedOnUse: true,
    category: "bouwmarkt",
  },
];

export const DARK_WEB_ITEMS: ShopItem[] = [
  {
    id: "bivakmuts",
    name: "Bivakmuts",
    description: "Verhoogt politie-tolerantie tijdens het gevecht. Permanent bezit.",
    price: DARK_WEB_PRICES.bivakmuts,
    consumedOnUse: false,
    category: "dark-web",
    interceptionChance: DARK_WEB_INTERCEPTION_CHANCE.bivakmuts,
  },
  {
    id: "pepperspray",
    name: "Pepperspray",
    description: "Stun/schade-effect. Verbruikt na gebruik.",
    price: DARK_WEB_PRICES.pepperspray,
    consumedOnUse: true,
    category: "dark-web",
    interceptionChance: DARK_WEB_INTERCEPTION_CHANCE.pepperspray,
  },
  {
    id: "taser",
    name: "Taser",
    description: "Stun-effect. Permanent (oplaadbaar).",
    price: DARK_WEB_PRICES.taser,
    consumedOnUse: false,
    category: "dark-web",
    interceptionChance: DARK_WEB_INTERCEPTION_CHANCE.taser,
  },
  {
    id: "wapenstok",
    name: "Wapenstok",
    description: "Hoge schade-bonus. Permanent bezit.",
    price: DARK_WEB_PRICES.wapenstok,
    consumedOnUse: false,
    category: "dark-web",
    interceptionChance: DARK_WEB_INTERCEPTION_CHANCE.wapenstok,
  },
  {
    id: "vuurwapen",
    name: "Vuurwapen",
    description:
      "Zeer hoge winstkans-boost tijdens het gevecht. Permanent bezit — maar gebruik ervan zet de " +
      "politie-meter-startwaarde van het volgende gevecht drastisch omhoog. De nucleaire optie.",
    price: DARK_WEB_PRICES.vuurwapen,
    consumedOnUse: false,
    category: "dark-web",
    interceptionChance: DARK_WEB_INTERCEPTION_CHANCE.vuurwapen,
  },
];

export const SHOP_ITEMS: ShopItem[] = [...BOUWMARKT_ITEMS, ...DARK_WEB_ITEMS];

export function getShopItem(id: EquipmentId): ShopItem {
  const item = SHOP_ITEMS.find((shopItem) => shopItem.id === id);
  if (!item) throw new Error(`Onbekend shop-item: ${id}`);
  return item;
}
