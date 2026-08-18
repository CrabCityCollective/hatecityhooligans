import type { Equipment, Hooligan } from "./hooligan";

export interface Gang {
  id: string;
  name: string;
  roster: Hooligan[];
  /** Beschikbaar geld voor recruitment en uitrusting. */
  money: number;
  /** Beruchtheid: bepaalt divisie-progressie, politie-meter-snelheid en recruitment-poolkwaliteit. */
  notoriety: number;
  /** Eigen club, voor het voetbal-gok-systeem (zie design §5). */
  favoriteClub: string;
  /** Gekochte maar nog niet aan een hooligan toegewezen uitrusting (zie design §4). */
  inventory: Equipment[];
}
