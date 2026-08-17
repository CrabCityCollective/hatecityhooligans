"use client";

import { useGameStore } from "@/lib/store/use-game-store";
import { RecruitmentPanel } from "@/components/recruitment/recruitment-panel";

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

      <RecruitmentPanel />

      {/* TODO(aankopen): bouwmarkt/dark web-inkopen en uitrusting toewijzen aan hooligans — zie design §4 */}
      {/* TODO(gokken): inzet op de wedstrijd van de eigen club — zie design §5 */}

      <p>
        <em>Placeholder — aankopen/uitrusting en gok-inzet worden in latere issues toegevoegd.</em>
      </p>
    </section>
  );
}
