import { PixelCrabIcon } from "@/components/pixel-crab-icon";

/** Titelscherm bovenaan de homepage: gamenaam, studio-credit en pixel-art krab-logo. */
export function TitleScreen() {
  return (
    <header className="title-screen">
      <h1 className="title-screen__title">Hate City Hooligans</h1>
      <p className="title-screen__subtitle">
        <PixelCrabIcon size={3} />
        <span>Een game van Crab City Collective</span>
      </p>
    </header>
  );
}
