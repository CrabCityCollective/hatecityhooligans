"use client";

import { useGameStore } from "@/lib/store/use-game-store";

export function GevechtPhase() {
  const division = useGameStore((state) => state.division);
  const policeGaugePercent = useGameStore((state) => state.policeGaugePercent);
  const roster = useGameStore((state) => state.gang.roster);

  return (
    <section>
      <h1>Gevecht</h1>
      <dl>
        <dt>Divisie</dt>
        <dd>{division}</dd>
        <dt>Politie-meter</dt>
        <dd>{policeGaugePercent}%</dd>
        <dt>Beschikbare hooligans</dt>
        <dd>{roster.length}</dd>
      </dl>

      {/* TODO(gevecht-simulatie): top-down vrij-voor-allen simulatie — opstelling, targeting,
          duels, KO/politie-afbreking — zie design §1 en §2 */}

      <p>
        <em>Placeholder — de gevecht-simulatie zelf wordt in een later issue gebouwd.</em>
      </p>
    </section>
  );
}
