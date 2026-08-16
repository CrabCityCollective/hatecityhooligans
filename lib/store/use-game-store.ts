"use client";

import { create } from "zustand";
import type { GameState, Hooligan } from "@/types";

const INITIAL_STATE: GameState = {
  currentWeek: 1,
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
  setPoliceGaugePercent: (percent: number) => void;
  addHooligan: (hooligan: Hooligan) => void;
  removeHooligan: (hooliganId: string) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  ...INITIAL_STATE,
  advanceWeek: () =>
    set((state) => ({ currentWeek: state.currentWeek + 1 })),
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
}));
