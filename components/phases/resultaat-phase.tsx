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
      {/* TODO(economie): inkomsten bijschrijven (bijbaantje/kantoorbaan) — zie design §4 */}

      <p>
        <em>
          Placeholder — beruchtheid-update en inkomsten worden in latere issues
          toegevoegd. Arrestaties (tijdelijk/permanent verlies, verraad) worden al
          direct na het gevecht in het roster verwerkt.
        </em>
      </p>
    </section>
  );
}
