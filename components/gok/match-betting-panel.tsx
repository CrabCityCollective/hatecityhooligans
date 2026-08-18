"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store/use-game-store";
import type { MatchOutcome } from "@/lib/gok/types";

const OUTCOME_LABELS: Record<MatchOutcome, string> = {
  winst: "Winst",
  gelijkspel: "Gelijkspel",
  verlies: "Verlies",
};

const OUTCOMES: MatchOutcome[] = ["winst", "gelijkspel", "verlies"];

export function MatchBettingPanel() {
  const money = useGameStore((state) => state.gang.money);
  const currentMatch = useGameStore((state) => state.currentMatch);
  const currentBet = useGameStore((state) => state.currentBet);
  const matchResult = useGameStore((state) => state.matchResult);
  const placeBet = useGameStore((state) => state.placeBet);
  const playMatch = useGameStore((state) => state.playMatch);

  const [outcome, setOutcome] = useState<MatchOutcome>("winst");
  const [amount, setAmount] = useState(10);

  function handlePlaceBet() {
    if (amount <= 0 || amount > money) return;
    placeBet(outcome, amount);
  }

  return (
    <section aria-label="Voetbal-gokken">
      <h2>Wedstrijd — {currentMatch.club}</h2>
      <table>
        <thead>
          <tr>
            <th>Uitkomst</th>
            <th>Odds</th>
          </tr>
        </thead>
        <tbody>
          {OUTCOMES.map((option) => (
            <tr key={option}>
              <td>{OUTCOME_LABELS[option]}</td>
              <td>{currentMatch.odds[option].toFixed(2)}x</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!currentBet && !matchResult && (
        <div>
          <label>
            Uitkomst:{" "}
            <select
              value={outcome}
              onChange={(event) => setOutcome(event.target.value as MatchOutcome)}
            >
              {OUTCOMES.map((option) => (
                <option key={option} value={option}>
                  {OUTCOME_LABELS[option]}
                </option>
              ))}
            </select>
          </label>{" "}
          <label>
            Inzet: €
            <input
              type="number"
              min={1}
              max={money}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
          </label>{" "}
          <button type="button" disabled={amount <= 0 || amount > money} onClick={handlePlaceBet}>
            Weddenschap plaatsen
          </button>
        </div>
      )}

      {currentBet && !matchResult && (
        <p>
          Ingezet: €{currentBet.amount} op {OUTCOME_LABELS[currentBet.outcome]} (odds{" "}
          {currentMatch.odds[currentBet.outcome].toFixed(2)}x).
        </p>
      )}

      {!matchResult && (
        <button type="button" onClick={playMatch}>
          Wedstrijd afspelen
        </button>
      )}

      {matchResult && (
        <section aria-label="Wedstrijduitslag">
          <h3>Uitslag: {OUTCOME_LABELS[matchResult.outcome]}</h3>
          {matchResult.bet && matchResult.payout > 0 && (
            <p>Goed gegokt! Uitbetaling: €{matchResult.payout}.</p>
          )}
          {matchResult.bet && matchResult.payout === 0 && (
            <p>Verkeerd gegokt — inzet van €{matchResult.bet.amount} kwijt.</p>
          )}
          {!matchResult.bet && <p>Geen weddenschap geplaatst.</p>}
          {matchResult.outcome === "verlies" && (
            <p role="alert">
              🔥 De eigen club verloor — het roster is woedend en krijgt een tijdelijke
              agressie-boost voor het aankomende gevecht.
            </p>
          )}
        </section>
      )}
    </section>
  );
}
