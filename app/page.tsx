import { ContinueToPhaseLink } from "@/components/continue-to-phase-link";
import { GangOverview } from "@/components/gang-overview";

export default function Home() {
  return (
    <main>
      <h1>Hate City Hooligans</h1>
      <GangOverview />
      <p>
        <ContinueToPhaseLink />
      </p>
    </main>
  );
}
