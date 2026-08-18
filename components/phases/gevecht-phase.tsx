"use client";

import { useState } from "react";
import { FightCanvas } from "@/components/gevecht/fight-canvas";
import { FightResultScreen } from "@/components/gevecht/fight-result-screen";
import type { FightResult } from "@/lib/gevecht/types";
import { useGameStore } from "@/lib/store/use-game-store";
import { getClub } from "@/lib/divisie/clubs";
import { areRivals } from "@/lib/divisie/rivalries";

type FightPhaseState = "not-started" | "in-progress" | "finished";

export function GevechtPhase() {
  const roster = useGameStore((state) => state.gang.roster);
  const gangNotoriety = useGameStore((state) => state.gang.notoriety);
  const ownClubId = useGameStore((state) => state.ownClubId);
  const currentOpponentClubId = useGameStore((state) => state.currentOpponentClubId);
  const policeGaugePercent = useGameStore((state) => state.policeGaugePercent);
  const playerAggressionBoostActive = useGameStore((state) => state.playerAggressionBoostActive);
  const applyFightResult = useGameStore((state) => state.applyFightResult);
  const [phaseState, setPhaseState] = useState<FightPhaseState>("not-started");
  const [result, setResult] = useState<FightResult | null>(null);
  const [fightKey, setFightKey] = useState(0);

  const opponentClub = getClub(currentOpponentClubId);
  const isRivalMatch = areRivals(ownClubId, currentOpponentClubId);
  // Zwaardere tegenstanders (hogere divisie) laten de politie-meter ook sneller vollopen (design §8).
  const notoriety = gangNotoriety + (opponentClub?.baseNotoriety ?? 0);

  const handleStart = () => {
    setResult(null);
    setPhaseState("in-progress");
    setFightKey((key) => key + 1);
  };

  const handleFinish = (fightResult: FightResult) => {
    setResult(fightResult);
    setPhaseState("finished");
    applyFightResult(fightResult);
  };

  return (
    <section>
      <h1>Gevecht</h1>

      {opponentClub && (
        <p>
          Tegenstander: <strong>{opponentClub.name}</strong>
          {isRivalMatch && (
            <span role="alert"> — RIVAAL! Extra haat tijdens dit gevecht.</span>
          )}
        </p>
      )}

      {playerAggressionBoostActive && (
        <p role="alert">
          🔥 Agressie-boost actief: de eigen club verloor, het roster vecht met verhoogde haat en
          schade tijdens dit gevecht.
        </p>
      )}

      {phaseState === "not-started" && (
        <button type="button" onClick={handleStart}>
          Start gevecht
        </button>
      )}

      {phaseState !== "not-started" && (
        <FightCanvas
          key={fightKey}
          playerRoster={roster}
          notoriety={notoriety}
          startingPoliceGaugePercent={policeGaugePercent}
          playerAggressionBoostActive={playerAggressionBoostActive}
          isRivalMatch={isRivalMatch}
          onFinish={handleFinish}
        />
      )}

      {phaseState === "finished" && result && (
        <FightResultScreen result={result} onRestart={handleStart} />
      )}
    </section>
  );
}
