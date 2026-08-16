"use client";

import { useGameStore } from "@/lib/store/use-game-store";
import { PHASE_LABELS } from "@/lib/week-phase";

export function GangOverview() {
  const gang = useGameStore((state) => state.gang);
  const currentWeek = useGameStore((state) => state.currentWeek);
  const currentPhase = useGameStore((state) => state.currentPhase);
  const division = useGameStore((state) => state.division);
  const policeGaugePercent = useGameStore((state) => state.policeGaugePercent);

  return (
    <section>
      <h2>{gang.name}</h2>
      <dl>
        <dt>Week</dt>
        <dd>{currentWeek}</dd>
        <dt>Fase</dt>
        <dd>{PHASE_LABELS[currentPhase]}</dd>
        <dt>Divisie</dt>
        <dd>{division}</dd>
        <dt>Politie-meter</dt>
        <dd>{policeGaugePercent}%</dd>
        <dt>Geld</dt>
        <dd>€{gang.money}</dd>
        <dt>Beruchtheid</dt>
        <dd>{gang.notoriety}</dd>
        <dt>Leden</dt>
        <dd>{gang.roster.length}</dd>
      </dl>
    </section>
  );
}
