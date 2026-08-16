import { VoorbereidingPhase } from "@/components/phases/voorbereiding-phase";
import { WeekPhaseNav } from "@/components/week-phase-nav";

export default function VoorbereidingPage() {
  return (
    <main>
      <WeekPhaseNav />
      <VoorbereidingPhase />
    </main>
  );
}
