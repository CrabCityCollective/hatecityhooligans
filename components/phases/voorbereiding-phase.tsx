"use client";

import { useGameStore } from "@/lib/store/use-game-store";
import { RecruitmentPanel } from "@/components/recruitment/recruitment-panel";
import { ShopPanel } from "@/components/economy/shop-panel";
import { EquipmentPanel } from "@/components/economy/equipment-panel";
import { MatchBettingPanel } from "@/components/gok/match-betting-panel";

export function VoorbereidingPhase() {
  const gang = useGameStore((state) => state.gang);
  const lastWeekIncome = useGameStore((state) => state.lastWeekIncome);
  const firearmAlertActive = useGameStore((state) => state.firearmAlertActive);

  return (
    <section>
      <h1>Voorbereiding</h1>
      <dl>
        <dt>Geld</dt>
        <dd>€{gang.money}</dd>
        <dt>Roster</dt>
        <dd>{gang.roster.length} hooligans</dd>
      </dl>

      {firearmAlertActive && (
        <p role="alert">
          ⚠ Verhoogde politie-aandacht: vorige week is een vuurwapen gebruikt. De politie-meter
          start deze week al drastisch hoger.
        </p>
      )}

      {lastWeekIncome && (
        <section aria-label="Inkomsten vorige week">
          <h2>Inkomsten vorige week</h2>
          <p>Totaal: €{lastWeekIncome.total}</p>
          {lastWeekIncome.entries.length > 0 && (
            <ul>
              {lastWeekIncome.entries.map((entry) => (
                <li key={`${entry.hooliganId}-${entry.source}`}>
                  {entry.hooliganName} ({entry.source}): €{entry.amount}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <RecruitmentPanel />

      <ShopPanel />
      <EquipmentPanel />

      <MatchBettingPanel />
    </section>
  );
}
