"use client";

import Link from "next/link";
import { useGameStore } from "@/lib/store/use-game-store";
import { PHASE_LABELS, PHASE_ROUTES } from "@/lib/week-phase";

export function ContinueToPhaseLink() {
  const currentPhase = useGameStore((state) => state.currentPhase);

  return (
    <Link href={PHASE_ROUTES[currentPhase]}>
      Verder naar: {PHASE_LABELS[currentPhase]} →
    </Link>
  );
}
