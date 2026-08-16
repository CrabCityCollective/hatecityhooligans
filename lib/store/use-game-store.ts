"use client";

import { create } from "zustand";
import type { GameState, Hooligan } from "@/types";
import type { FightResult } from "@/lib/gevecht/types";
import { PHASE_ORDER } from "@/lib/week-phase";

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
  },
};

interface GameStore extends GameState {
  advanceWeek: () => void;
  /** Gaat naar de volgende fase. Na de laatste fase (resultaat) begint een nieuwe week bij voorbereiding. */
  advancePhase: () => void;
  setPoliceGaugePercent: (percent: number) => void;
  addHooligan: (hooligan: Hooligan) => void;
  removeHooligan: (hooliganId: string) => void;
  /**
   * Verwerkt de uitkomst van een afgelopen gevecht: markeert opgepakte hooligans in het roster als
   * tijdelijk/permanent verloren (design §3) en zet de politie-meter-startwaarde voor volgende week.
   */
  applyFightResult: (result: FightResult) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  ...INITIAL_STATE,
  advanceWeek: () =>
    set((state) => ({ currentWeek: state.currentWeek + 1 })),
  advancePhase: () =>
    set((state) => {
      const currentIndex = PHASE_ORDER.indexOf(state.currentPhase);
      const isLastPhase = currentIndex === PHASE_ORDER.length - 1;

      if (isLastPhase) {
        return {
          currentPhase: PHASE_ORDER[0],
          currentWeek: state.currentWeek + 1,
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
      const arrestsByHooliganId = new Map(
        result.arrests.map((arrest) => [arrest.hooliganId, arrest]),
      );

      const roster = state.gang.roster.map((hooligan) => {
        const arrest = arrestsByHooliganId.get(hooligan.id);
        if (!arrest) return hooligan;

        if (arrest.outcome.type === "permanent") {
          return { ...hooligan, status: "dead" as const };
        }

        return {
          ...hooligan,
          status: "unavailable" as const,
          unavailableUntilWeek: state.currentWeek + (arrest.outcome.weeks ?? 1),
        };
      });

      return {
        gang: { ...state.gang, roster },
        policeGaugePercent: result.nextPoliceGaugeStartPercent,
      };
    }),
}));
