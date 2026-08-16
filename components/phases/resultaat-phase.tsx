"use client";

import { useGameStore } from "@/lib/store/use-game-store";

export function ResultaatPhase() {
  const gang = useGameStore((state) => state.gang);

  return (
    <section>
      <h1>Resultaat</h1>
      <dl>
        <dt>Beruchtheid</dt>
        <dd>{gang.notoriety}</dd>
        <dt>Geld</dt>
        <dd>€{gang.money}</dd>
      </dl>

      {/* TODO(beruchtheid): bijwerken op basis van de gevecht-uitkomst (afgebroken vs. full clear) — zie design §1 */}
      {/* TODO(arrestaties): verwerken via de trait-tabel (tijdelijk/permanent verlies, verraad) — zie design §3 */}
      {/* TODO(economie): inkomsten bijschrijven (bijbaantje/kantoorbaan) — zie design §4 */}

      <p>
        <em>
          Placeholder — beruchtheid-update, arrestaties en inkomsten worden in
          latere issues toegevoegd.
        </em>
      </p>
    </section>
  );
}
