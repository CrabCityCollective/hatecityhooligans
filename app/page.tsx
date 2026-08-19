import { ContinueToPhaseLink } from "@/components/continue-to-phase-link";
import { GangOverview } from "@/components/gang-overview";
import { TitleScreen } from "@/components/title-screen";

export default function Home() {
  return (
    <main>
      <TitleScreen />
      <GangOverview />
      <p>
        <ContinueToPhaseLink />
      </p>
    </main>
  );
}
