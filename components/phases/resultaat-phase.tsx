"use client";

import { useGameStore } from "@/lib/store/use-game-store";

export function ResultaatPhase() {
  const gang = useGameStore((state) => state.gang);
  const lastConsumableBreakage = useGameStore((state) => state.lastConsumableBreakage);

  return (
    <section>
      <h1>Resultaat</h1>
      <dl>
        <dt>Beruchtheid</dt>
        <dd>{gang.notoriety}</dd>
        <dt>Geld</dt>
        <dd>€{gang.money}</dd>
      </dl>

      {lastConsumableBreakage.length > 0 && (
        <section aria-label="Kapotte uitrusting">
          <h2>Kapotte uitrusting</h2>
          <ul>
            {lastConsumableBreakage.map((entry, index) => (
              <li key={`${entry.hooliganId}-${entry.equipmentName}-${index}`}>
                {entry.hooliganName}: {entry.equipmentName} is kapot gegaan.
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* TODO(beruchtheid): bijwerken op basis van de gevecht-uitkomst (afgebroken vs. full clear) — zie design §1 */}

      <p>
        <em>
          Placeholder — beruchtheid-update wordt in een latere issue toegevoegd.
          Arrestaties (tijdelijk/permanent verlies, verraad) en verbruiksartikelen worden
          al direct na het gevecht verwerkt. Inkomsten worden bijgeschreven bij het ingaan
          van de volgende voorbereiding-fase (zie design §4).
        </em>
      </p>
    </section>
  );
}
