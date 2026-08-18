"use client";

import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store/use-game-store";
import { PHASE_LABELS, PHASE_ORDER, PHASE_ROUTES } from "@/lib/week-phase";
import { isGangCollapsed } from "@/lib/divisie/game-over";

export function WeekPhaseNav() {
  const router = useRouter();
  const currentWeek = useGameStore((state) => state.currentWeek);
  const currentPhase = useGameStore((state) => state.currentPhase);
  const advancePhase = useGameStore((state) => state.advancePhase);
  const gang = useGameStore((state) => state.gang);
  const gameOver = isGangCollapsed(gang);

  const currentIndex = PHASE_ORDER.indexOf(currentPhase);
  const isLastPhase = currentIndex === PHASE_ORDER.length - 1;
  const nextPhase = PHASE_ORDER[(currentIndex + 1) % PHASE_ORDER.length];

  const handleAdvance = () => {
    advancePhase();
    router.push(PHASE_ROUTES[nextPhase]);
  };

  return (
    <nav aria-label="Week-voortgang">
      <p>
        Week {currentWeek} — fase {currentIndex + 1} van {PHASE_ORDER.length}
      </p>
      <ol>
        {PHASE_ORDER.map((phase) => (
          <li key={phase} aria-current={phase === currentPhase ? "step" : undefined}>
            {PHASE_LABELS[phase]}
          </li>
        ))}
      </ol>
      {gameOver ? (
        <p role="alert">Game over — de bende is ingestort.</p>
      ) : (
        <button type="button" onClick={handleAdvance}>
          {isLastPhase
            ? `Week afsluiten → Week ${currentWeek + 1}`
            : `Volgende fase: ${PHASE_LABELS[nextPhase]} →`}
        </button>
      )}
    </nav>
  );
}
