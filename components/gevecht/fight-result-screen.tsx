import type { FightResult } from "@/lib/gevecht/types";

const OUTCOME_LABELS: Record<FightResult["outcome"], string> = {
  "full-clear-player": "Volledige overwinning!",
  "full-clear-opponent": "Volledige nederlaag.",
  timeout: "Gevecht afgebroken (tijd om) — geen van beide teams volledig uitgeschakeld.",
};

interface FightResultScreenProps {
  result: FightResult;
  onRestart: () => void;
}

export function FightResultScreen({ result, onRestart }: FightResultScreenProps) {
  return (
    <section aria-label="Gevecht-resultaat">
      <h2>{OUTCOME_LABELS[result.outcome]}</h2>
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>KO&apos;s</th>
            <th>Gevlucht</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Eigen gang</td>
            <td>{result.koCounts.player}</td>
            <td>{result.fledCounts.player}</td>
          </tr>
          <tr>
            <td>Tegenstander</td>
            <td>{result.koCounts.opponent}</td>
            <td>{result.fledCounts.opponent}</td>
          </tr>
        </tbody>
      </table>
      <button type="button" onClick={onRestart}>
        Nieuw gevecht
      </button>
    </section>
  );
}
