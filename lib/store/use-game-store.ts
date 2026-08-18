"use client";

import { create } from "zustand";
import type { EquipmentId, GameState, Hooligan } from "@/types";
import type { FightResult, HooliganArrestResult } from "@/lib/gevecht/types";
import { PHASE_ORDER } from "@/lib/week-phase";
import { applyConsumableBreakage, type BrokenEquipmentEntry } from "@/lib/economy/consumables";
import { computeWeeklyIncome, type WeeklyIncome } from "@/lib/economy/income";
import {
  attemptDarkWebPurchase,
  createEquipmentInstance,
  type DarkWebPurchaseResult,
} from "@/lib/economy/purchase";
import { getShopItem } from "@/lib/economy/shop-items";

const INITIAL_STATE: GameState = {
  currentWeek: 1,
  currentPhase: "voorbereiding",
  division: 3,
  policeGaugePercent: 0,
  gang: {
    id: "player-gang",
    name: "Naamloze Bende",
    roster: [],
    money: 500,
    notoriety: 0,
    favoriteClub: "",
    inventory: [],
  },
};

/** Verwerkt een arrestatie-uitkomst (design §3) in het roster: tijdelijk of permanent verlies. */
function applyArrestToRoster(
  roster: Hooligan[],
  currentWeek: number,
  arrest: HooliganArrestResult,
): Hooligan[] {
  return roster.map((hooligan) => {
    if (hooligan.id !== arrest.hooliganId) return hooligan;

    if (arrest.outcome.type === "permanent") {
      return { ...hooligan, status: "dead" as const };
    }

    return {
      ...hooligan,
      status: "unavailable" as const,
      unavailableUntilWeek: currentWeek + (arrest.outcome.weeks ?? 1),
    };
  });
}

interface GameStore extends GameState {
  /** Vorige-week-inkomsten, laatst bijgeschreven bij het ingaan van de voorbereiding-fase (design §4). */
  lastWeekIncome: WeeklyIncome | null;
  /** Verbruiksartikelen die na het laatste gevecht kapot zijn gegaan (design §4). */
  lastConsumableBreakage: BrokenEquipmentEntry[];
  /**
   * True als er in het laatste gevecht daadwerkelijk een vuurwapen gebruikt is — de politie-meter
   * start daardoor al drastisch verhoogd (zie `policeGaugePercent`). Puur informatief (design §4).
   */
  firearmAlertActive: boolean;

  advanceWeek: () => void;
  /**
   * Gaat naar de volgende fase. Na de laatste fase (resultaat) begint een nieuwe week bij
   * voorbereiding, en worden de wekelijkse baantjes-inkomsten automatisch bijgeschreven (design §4).
   */
  advancePhase: () => void;
  setPoliceGaugePercent: (percent: number) => void;
  addHooligan: (hooligan: Hooligan) => void;
  removeHooligan: (hooliganId: string) => void;
  /**
   * Verwerkt de uitkomst van een afgelopen gevecht: markeert opgepakte hooligans in het roster als
   * tijdelijk/permanent verloren (design §3), zet de politie-meter-startwaarde voor volgende week
   * (hoger bij verraad of vuurwapengebruik) en laat verbruiksartikelen meestal kapot gaan.
   */
  applyFightResult: (result: FightResult) => void;
  /** Koopt een bouwmarkt-item: geen arrestatierisico, direct in de inventaris (design §4). */
  buyBouwmarktItem: (itemId: EquipmentId) => void;
  /**
   * Bestelt een dark web-item voor een aangewezen ontvanger-hooligan. Het risico op onderschepping
   * wordt direct bepaald; bij onderschepping is zowel het geld als de hooligan (via de
   * arrestatie-uitkomst-logica) verloren. Geeft de uitkomst terug zodat de UI die kan tonen.
   */
  buyDarkWebItem: (itemId: EquipmentId, receiverHooliganId: string) => DarkWebPurchaseResult | null;
  /** Wijst een item uit de inventaris toe aan een hooligan in het roster. */
  assignEquipment: (hooliganId: string, instanceId: string) => void;
  /** Haalt een toegewezen item terug van een hooligan naar de (ongebruikte) inventaris. */
  unassignEquipment: (hooliganId: string, instanceId: string) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  ...INITIAL_STATE,
  lastWeekIncome: null,
  lastConsumableBreakage: [],
  firearmAlertActive: false,
  advanceWeek: () =>
    set((state) => ({ currentWeek: state.currentWeek + 1 })),
  advancePhase: () =>
    set((state) => {
      const currentIndex = PHASE_ORDER.indexOf(state.currentPhase);
      const isLastPhase = currentIndex === PHASE_ORDER.length - 1;

      if (isLastPhase) {
        const income = computeWeeklyIncome(state.gang.roster);
        return {
          currentPhase: PHASE_ORDER[0],
          currentWeek: state.currentWeek + 1,
          gang: { ...state.gang, money: state.gang.money + income.total },
          lastWeekIncome: income,
        };
      }

      return { currentPhase: PHASE_ORDER[currentIndex + 1] };
    }),
  setPoliceGaugePercent: (percent) =>
    set({ policeGaugePercent: Math.max(0, Math.min(100, percent)) }),
  addHooligan: (hooligan) =>
    set((state) => ({
      gang: { ...state.gang, roster: [...state.gang.roster, hooligan] },
    })),
  removeHooligan: (hooliganId) =>
    set((state) => ({
      gang: {
        ...state.gang,
        roster: state.gang.roster.filter((h) => h.id !== hooliganId),
      },
    })),
  applyFightResult: (result) =>
    set((state) => {
      const rosterAfterArrests = result.arrests.reduce(
        (roster, arrest) => applyArrestToRoster(roster, state.currentWeek, arrest),
        state.gang.roster,
      );
      const { roster, broken } = applyConsumableBreakage(rosterAfterArrests);

      return {
        gang: { ...state.gang, roster },
        policeGaugePercent: result.nextPoliceGaugeStartPercent,
        firearmAlertActive: result.firearmUsedByPlayer,
        lastConsumableBreakage: broken,
      };
    }),
  buyBouwmarktItem: (itemId) =>
    set((state) => {
      const item = getShopItem(itemId);
      if (item.category !== "bouwmarkt" || state.gang.money < item.price) return state;

      return {
        gang: {
          ...state.gang,
          money: state.gang.money - item.price,
          inventory: [...state.gang.inventory, createEquipmentInstance(itemId)],
        },
      };
    }),
  buyDarkWebItem: (itemId, receiverHooliganId) => {
    let purchaseResult: DarkWebPurchaseResult | null = null;

    set((state) => {
      const item = getShopItem(itemId);
      const receiver = state.gang.roster.find(
        (hooligan) => hooligan.id === receiverHooliganId && hooligan.status === "available",
      );
      if (item.category !== "dark-web" || !receiver || state.gang.money < item.price) {
        return state;
      }

      const purchase = attemptDarkWebPurchase(itemId, receiver);
      purchaseResult = purchase;
      const moneyAfterOrder = state.gang.money - item.price;

      if (purchase.intercepted && purchase.arrest) {
        return {
          gang: {
            ...state.gang,
            money: moneyAfterOrder,
            roster: applyArrestToRoster(state.gang.roster, state.currentWeek, purchase.arrest),
          },
        };
      }

      return {
        gang: {
          ...state.gang,
          money: moneyAfterOrder,
          inventory: purchase.item
            ? [...state.gang.inventory, purchase.item]
            : state.gang.inventory,
        },
      };
    });

    return purchaseResult;
  },
  assignEquipment: (hooliganId, instanceId) =>
    set((state) => {
      const item = state.gang.inventory.find((equipment) => equipment.instanceId === instanceId);
      if (!item) return state;

      return {
        gang: {
          ...state.gang,
          inventory: state.gang.inventory.filter(
            (equipment) => equipment.instanceId !== instanceId,
          ),
          roster: state.gang.roster.map((hooligan) =>
            hooligan.id === hooliganId
              ? { ...hooligan, equipment: [...hooligan.equipment, item] }
              : hooligan,
          ),
        },
      };
    }),
  unassignEquipment: (hooliganId, instanceId) =>
    set((state) => {
      const hooligan = state.gang.roster.find((h) => h.id === hooliganId);
      const item = hooligan?.equipment.find((equipment) => equipment.instanceId === instanceId);
      if (!hooligan || !item) return state;

      return {
        gang: {
          ...state.gang,
          inventory: [...state.gang.inventory, item],
          roster: state.gang.roster.map((h) =>
            h.id === hooliganId
              ? { ...h, equipment: h.equipment.filter((equipment) => equipment.instanceId !== instanceId) }
              : h,
          ),
        },
      };
    }),
}));
