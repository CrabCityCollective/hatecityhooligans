import type { Gang } from "@/types";

interface GameOverScreenProps {
  gang: Gang;
}

/** Eindscherm bij totale gang-ineenstorting: geen inzetbare hooligans meer, geen geld om op te bouwen (MVP 8). */
export function GameOverScreen({ gang }: GameOverScreenProps) {
  return (
    <section aria-label="Game over">
      <h1>Game Over</h1>
      <p>
        {gang.name} is ingestort: geen inzetbare hooligans meer en onvoldoende geld om de bende
        weer op te bouwen.
      </p>
    </section>
  );
}
