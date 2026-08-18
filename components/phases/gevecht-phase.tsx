"use client";

import { useState } from "react";
import { FightCanvas } from "@/components/gevecht/fight-canvas";
import { FightResultScreen } from "@/components/gevecht/fight-result-screen";
import type { FightResult } from "@/lib/gevecht/types";
import { useGameStore } from "@/lib/store/use-game-store";

type FightPhaseState = "not-started" | "in-progress" | "finished";

export function GevechtPhase() {
  const roster = useGameStore((state) => state.gang.roster);
  const notoriety = useGameStore((state) => state.gang.notoriety);
  const policeGaugePercent = useGameStore((state) => state.policeGaugePercent);
  const playerAggressionBoostActive = useGameStore((state) => state.playerAggressionBoostActive);
  const applyFightResult = useGameStore((state) => state.applyFightResult);
  const [phaseState, setPhaseState] = useState<FightPhaseState>("not-started");
  const [result, setResult] = useState<FightResult | null>(null);
  const [fightKey, setFightKey] = useState(0);

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
          onFinish={handleFinish}
        />
      )}

      {phaseState === "finished" && result && (
        <FightResultScreen result={result} onRestart={handleStart} />
      )}
    </section>
  );
}
