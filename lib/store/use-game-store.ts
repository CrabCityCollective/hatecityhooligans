"use client";

import { create } from "zustand";
import type { Division, EquipmentId, GameState, Hooligan } from "@/types";
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
import { getClubsByDivision } from "@/lib/divisie/clubs";
import { areRivals } from "@/lib/divisie/rivalries";
import {
  applyStanding,
  evaluateSeasonStanding,
  generateOpponentOrder,
  opponentForMatchIndex,
  pointsForOutcome,
  seasonLengthForDivision,
} from "@/lib/divisie/season";
import type { SeasonMatchResult, SeasonStandingResult } from "@/lib/divisie/types";
import { pickOne } from "@/lib/gevecht/generate-team";
import { BASE_FORM } from "@/lib/gok/constants";
import { generateMatch, resolveMatch } from "@/lib/gok/match";
import type { Bet, FootballMatch, MatchOutcome, MatchResult } from "@/lib/gok/types";

const FALLBACK_CLUB_NAME = "Eigen club";

/** Startdivisie voor een nieuw spel: de laagste, Divisie 3 (design §8). */
const STARTING_DIVISION: Division = 3;

/** Eigen club, willekeurig toegewezen uit de startdivisie bij het begin van een nieuw spel (MVP 8). */
const startingClub = pickOne(getClubsByDivision(STARTING_DIVISION));
const initialSeasonOpponentOrder = generateOpponentOrder(startingClub.id, STARTING_DIVISION);
const initialOpponentClubId = opponentForMatchIndex(initialSeasonOpponentOrder, 0);

const INITIAL_STATE: GameState = {
  currentWeek: 1,
  currentPhase: "voorbereiding",
  division: STARTING_DIVISION,
  policeGaugePercent: 0,
  gang: {
    id: "player-gang",
    name: "Naamloze Bende",
    roster: [],
    money: 500,
    notoriety: 0,
    favoriteClub: startingClub.name,
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
  /** Wedstrijd van de eigen club deze week, met vorm-gebaseerde odds (design §5). */
  currentMatch: FootballMatch;
  /** Vorm-waarde van de laatst gespeelde wedstrijd, als basis voor lichte fluctuatie volgende week. */
  previousClubForm: number;
  /** Geplaatste weddenschap op `currentMatch`, of null zolang er nog niet is ingezet. */
  currentBet: Bet | null;
  /** Uitslag + uitbetaling van `currentMatch`, of null zolang die nog niet is afgespeeld. */
  matchResult: MatchResult | null;
  /**
   * Tijdelijke haat/agressie-boost voor het eigen roster tijdens het komende gevecht: actief na
   * een verlies van de eigen club, verdwijnt weer na dat ene gevecht (design §5).
   */
  playerAggressionBoostActive: boolean;
  /** Eigen club-referentie in de divisie-data (zie lib/divisie/clubs.ts) — vast voor de hele game. */
  ownClubId: string;
  /** Tegenstander-club voor de huidige week, bepaald bij het ingaan van elke voorbereiding-fase. */
  currentOpponentClubId: string;
  /** Geschudde tegenstander-volgorde (round-robin) voor het lopende seizoen in de huidige divisie. */
  seasonOpponentOrder: string[];
  /** Resultaten van dit seizoen tot nu toe, gebruikt voor promotie/degradatie (design §8). */
  seasonResults: SeasonMatchResult[];
  /** Promotie/degradatie-uitslag van het zojuist afgesloten seizoen, of null (design §8). */
  lastSeasonStanding: SeasonStandingResult | null;

  /** Plaatst een weddenschap op `currentMatch` en schrijft de inzet direct af (design §5). */
  placeBet: (outcome: MatchOutcome, amount: number) => void;
  /**
   * Speelt `currentMatch` af: bepaalt de uitslag, verwerkt een eventuele weddenschap (uitbetaling
   * of verlies van de inzet) en zet de agressie-boost voor het komende gevecht bij een verlies.
   */
  playMatch: () => void;

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
  currentMatch: generateMatch(1, INITIAL_STATE.gang.favoriteClub || FALLBACK_CLUB_NAME),
  previousClubForm: BASE_FORM,
  currentBet: null,
  matchResult: null,
  playerAggressionBoostActive: false,
  ownClubId: startingClub.id,
  currentOpponentClubId: initialOpponentClubId,
  seasonOpponentOrder: initialSeasonOpponentOrder,
  seasonResults: [],
  lastSeasonStanding: null,
  placeBet: (outcome, amount) =>
    set((state) => {
      if (state.currentBet || state.matchResult) return state;
      if (amount <= 0 || amount > state.gang.money) return state;

      return {
        gang: { ...state.gang, money: state.gang.money - amount },
        currentBet: { outcome, amount },
      };
    }),
  playMatch: () =>
    set((state) => {
      if (state.matchResult) return state;

      const result = resolveMatch(state.currentMatch, state.currentBet);
      return {
        matchResult: result,
        gang: { ...state.gang, money: state.gang.money + result.payout },
        playerAggressionBoostActive: result.outcome === "verlies",
      };
    }),
  advanceWeek: () =>
    set((state) => ({ currentWeek: state.currentWeek + 1 })),
  advancePhase: () =>
    set((state) => {
      const currentIndex = PHASE_ORDER.indexOf(state.currentPhase);
      const isLastPhase = currentIndex === PHASE_ORDER.length - 1;

      if (isLastPhase) {
        const income = computeWeeklyIncome(state.gang.roster);
        const nextWeek = state.currentWeek + 1;
        const nextForm = state.currentMatch.form;

        // Seizoen loopt af zodra elke tegenstander in de divisie (min. 1x) gespeeld is (design §8).
        const seasonComplete =
          state.seasonResults.length >= seasonLengthForDivision(state.division);

        let nextDivision = state.division;
        let lastSeasonStanding: SeasonStandingResult | null = null;
        let nextSeasonResults = state.seasonResults;
        let nextOpponentOrder = state.seasonOpponentOrder;

        if (seasonComplete) {
          const totalPoints = state.seasonResults.reduce((sum, entry) => sum + entry.points, 0);
          const standing = evaluateSeasonStanding(totalPoints, state.seasonResults.length);
          nextDivision = applyStanding(state.division, standing);
          lastSeasonStanding = {
            standing,
            fromDivision: state.division,
            toDivision: nextDivision,
            points: totalPoints,
            maxPoints: state.seasonResults.length * 3,
          };
          nextSeasonResults = [];
          nextOpponentOrder = generateOpponentOrder(state.ownClubId, nextDivision);
        }

        const nextOpponentClubId = opponentForMatchIndex(
          nextOpponentOrder,
          nextSeasonResults.length,
        );

        return {
          currentPhase: PHASE_ORDER[0],
          currentWeek: nextWeek,
          division: nextDivision,
          gang: { ...state.gang, money: state.gang.money + income.total },
          lastWeekIncome: income,
          currentMatch: generateMatch(
            nextWeek,
            state.gang.favoriteClub || FALLBACK_CLUB_NAME,
            nextForm,
          ),
          previousClubForm: nextForm,
          currentBet: null,
          matchResult: null,
          playerAggressionBoostActive: false,
          seasonResults: nextSeasonResults,
          seasonOpponentOrder: nextOpponentOrder,
          currentOpponentClubId: nextOpponentClubId,
          lastSeasonStanding,
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

      const seasonEntry: SeasonMatchResult = {
        week: state.currentWeek,
        opponentClubId: state.currentOpponentClubId,
        outcome: result.outcome,
        isRivalMatch: areRivals(state.ownClubId, state.currentOpponentClubId),
        points: pointsForOutcome(result.outcome),
      };

      return {
        gang: { ...state.gang, roster },
        policeGaugePercent: result.nextPoliceGaugeStartPercent,
        firearmAlertActive: result.firearmUsedByPlayer,
        lastConsumableBreakage: broken,
        // De agressie-boost geldt maar voor dit ene gevecht (design §5).
        playerAggressionBoostActive: false,
        seasonResults: [...state.seasonResults, seasonEntry],
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
