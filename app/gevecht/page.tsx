import { GevechtPhase } from "@/components/phases/gevecht-phase";
import { WeekPhaseNav } from "@/components/week-phase-nav";

export default function GevechtPage() {
  return (
    <main>
      <WeekPhaseNav />
      <GevechtPhase />
    </main>
  );
}
