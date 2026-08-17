import type { ArrestOutcome, FightResult } from "@/lib/gevecht/types";

const OUTCOME_LABELS: Record<FightResult["outcome"], string> = {
  "full-clear-player": "Volledige overwinning! (full clear, geen politie nodig)",
  "full-clear-opponent": "Volledige nederlaag.",
  "police-raid": "Gevecht afgebroken — de politie heeft ingegrepen.",
  timeout: "Gevecht afgebroken (tijd om) — geen van beide teams volledig uitgeschakeld.",
};

const ARREST_OUTCOME_LABELS: Record<ArrestOutcome["type"], string> = {
  temporary: "Tijdelijk verlies",
  permanent: "Permanent verlies",
};

function describeArrestOutcome(outcome: ArrestOutcome): string {
  if (outcome.type === "temporary") {
    return `${ARREST_OUTCOME_LABELS.temporary} (${outcome.weeks} weken)`;
  }
  return ARREST_OUTCOME_LABELS.permanent;
}

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

      <h3>Gearresteerd: {result.arrests.length}</h3>
      {result.arrests.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Naam</th>
              <th>Uitkomst</th>
              <th>Reden</th>
            </tr>
          </thead>
          <tbody>
            {result.arrests.map((arrest) => (
              <tr key={arrest.hooliganId}>
                <td>
                  {arrest.hooliganName}
                  {arrest.betrayal && " (verraad)"}
                </td>
                <td>{describeArrestOutcome(arrest.outcome)}</td>
                <td>{arrest.reasons.join("; ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button type="button" onClick={onRestart}>
        Nieuw gevecht
      </button>
    </section>
  );
}
