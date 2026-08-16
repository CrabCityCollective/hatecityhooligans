"use client";

import { useGameStore } from "@/lib/store/use-game-store";

export function VoorbereidingPhase() {
  const gang = useGameStore((state) => state.gang);

  return (
    <section>
      <h1>Voorbereiding</h1>
      <dl>
        <dt>Geld</dt>
        <dd>€{gang.money}</dd>
        <dt>Roster</dt>
        <dd>{gang.roster.length} hooligans</dd>
      </dl>

      {/* TODO(recruitment): interview-systeem (locaties, vragen, trait-signalen) — zie design §6 */}
      {/* TODO(aankopen): bouwmarkt/dark web-inkopen en uitrusting toewijzen aan hooligans — zie design §4 */}
      {/* TODO(gokken): inzet op de wedstrijd van de eigen club — zie design §5 */}

      <p>
        <em>
          Placeholder — recruitment, aankopen/uitrusting en gok-inzet worden in
          latere issues toegevoegd.
        </em>
      </p>
    </section>
  );
}
