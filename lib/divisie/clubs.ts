import type { Division } from "@/types";
import type { Club } from "./types";

/** Divisie 3 (Tweede Divisie) — 16 clubs, laagste beruchtheid (design §8). */
const DIVISION_3_CLUBS: Club[] = [
  { id: "rijnsburgse-boys", name: "Rijnsburgse Boys", division: 3, baseNotoriety: 5 },
  { id: "de-treffers", name: "De Treffers", division: 3, baseNotoriety: 4 },
  { id: "gvvv", name: "GVVV", division: 3, baseNotoriety: 4 },
  { id: "koninklijke-hfc", name: "Koninklijke HFC", division: 3, baseNotoriety: 4 },
  { id: "barendrecht", name: "Barendrecht", division: 3, baseNotoriety: 5 },
  { id: "hhc-hardenberg", name: "HHC Hardenberg", division: 3, baseNotoriety: 4 },
  { id: "rkav-volendam", name: "RKAV Volendam", division: 3, baseNotoriety: 6 },
  { id: "spakenburg", name: "Spakenburg", division: 3, baseNotoriety: 7 },
  { id: "ijsselmeervogels", name: "IJsselmeervogels", division: 3, baseNotoriety: 6 },
  { id: "quick-boys", name: "Quick Boys", division: 3, baseNotoriety: 7, rivalId: "vv-katwijk" },
  { id: "vv-katwijk", name: "VV Katwijk", division: 3, baseNotoriety: 6, rivalId: "quick-boys" },
  { id: "hsv-hoek", name: "HSV Hoek", division: 3, baseNotoriety: 4 },
  { id: "kloetinge", name: "Kloetinge", division: 3, baseNotoriety: 4 },
  { id: "kozakken-boys", name: "Kozakken Boys", division: 3, baseNotoriety: 5 },
  { id: "afc", name: "AFC", division: 3, baseNotoriety: 5 },
  { id: "rohda-raalte", name: "Rohda Raalte", division: 3, baseNotoriety: 4 },
];

/** Divisie 2 (Keuken Kampioen Divisie) — 16 clubs, middelste beruchtheid (design §8). */
const DIVISION_2_CLUBS: Club[] = [
  { id: "fc-volendam", name: "FC Volendam", division: 2, baseNotoriety: 16 },
  { id: "nac-breda", name: "NAC Breda", division: 2, baseNotoriety: 17, rivalId: "willem-ii" },
  { id: "heracles-almelo", name: "Heracles Almelo", division: 2, baseNotoriety: 15 },
  { id: "de-graafschap", name: "De Graafschap", division: 2, baseNotoriety: 16 },
  {
    id: "roda-jc-kerkrade",
    name: "Roda JC Kerkrade",
    division: 2,
    baseNotoriety: 15,
    rivalId: "fortuna-sittard",
  },
  { id: "fc-dordrecht", name: "FC Dordrecht", division: 2, baseNotoriety: 11 },
  { id: "almere-city", name: "Almere City", division: 2, baseNotoriety: 12 },
  { id: "rkc-waalwijk", name: "RKC Waalwijk", division: 2, baseNotoriety: 13 },
  { id: "fc-den-bosch", name: "FC Den Bosch", division: 2, baseNotoriety: 12, rivalId: "top-oss" },
  { id: "vvv-venlo", name: "VVV-Venlo", division: 2, baseNotoriety: 12 },
  { id: "fc-eindhoven", name: "FC Eindhoven", division: 2, baseNotoriety: 13, rivalId: "psv" },
  { id: "helmond-sport", name: "Helmond Sport", division: 2, baseNotoriety: 11 },
  { id: "mvv-maastricht", name: "MVV Maastricht", division: 2, baseNotoriety: 10 },
  { id: "fc-emmen", name: "FC Emmen", division: 2, baseNotoriety: 14 },
  { id: "top-oss", name: "TOP Oss", division: 2, baseNotoriety: 11, rivalId: "fc-den-bosch" },
  { id: "vitesse", name: "Vitesse", division: 2, baseNotoriety: 18, rivalId: "nec-nijmegen" },
];

/** Divisie 1 (Eredivisie) — 18 clubs, hoogste beruchtheid (design §8). */
const DIVISION_1_CLUBS: Club[] = [
  { id: "ajax", name: "Ajax", division: 1, baseNotoriety: 40, rivalId: "feyenoord" },
  { id: "psv", name: "PSV", division: 1, baseNotoriety: 38, rivalId: "ajax" },
  { id: "feyenoord", name: "Feyenoord", division: 1, baseNotoriety: 38, rivalId: "ajax" },
  { id: "az", name: "AZ", division: 1, baseNotoriety: 32, rivalId: "ajax" },
  { id: "fc-twente", name: "FC Twente", division: 1, baseNotoriety: 30, rivalId: "az" },
  { id: "fc-utrecht", name: "FC Utrecht", division: 1, baseNotoriety: 28, rivalId: "ajax" },
  {
    id: "go-ahead-eagles",
    name: "Go Ahead Eagles",
    division: 1,
    baseNotoriety: 24,
    rivalId: "pec-zwolle",
  },
  {
    id: "sparta-rotterdam",
    name: "Sparta Rotterdam",
    division: 1,
    baseNotoriety: 26,
    rivalId: "feyenoord",
  },
  { id: "nec-nijmegen", name: "NEC Nijmegen", division: 1, baseNotoriety: 24, rivalId: "vitesse" },
  {
    id: "fortuna-sittard",
    name: "Fortuna Sittard",
    division: 1,
    baseNotoriety: 23,
    rivalId: "roda-jc-kerkrade",
  },
  {
    id: "pec-zwolle",
    name: "PEC Zwolle",
    division: 1,
    baseNotoriety: 23,
    rivalId: "go-ahead-eagles",
  },
  {
    id: "sc-heerenveen",
    name: "SC Heerenveen",
    division: 1,
    baseNotoriety: 25,
    rivalId: "sc-cambuur",
  },
  { id: "excelsior", name: "Excelsior", division: 1, baseNotoriety: 24, rivalId: "feyenoord" },
  {
    id: "fc-groningen",
    name: "FC Groningen",
    division: 1,
    baseNotoriety: 27,
    rivalId: "sc-heerenveen",
  },
  { id: "telstar", name: "Telstar", division: 1, baseNotoriety: 22, rivalId: "az" },
  { id: "willem-ii", name: "Willem II", division: 1, baseNotoriety: 23, rivalId: "nac-breda" },
  { id: "ado-den-haag", name: "ADO Den Haag", division: 1, baseNotoriety: 24 },
  { id: "sc-cambuur", name: "SC Cambuur", division: 1, baseNotoriety: 23, rivalId: "sc-heerenveen" },
];

/** Alle 50 clubs over de drie divisies (design §8). */
export const CLUBS: Club[] = [...DIVISION_3_CLUBS, ...DIVISION_2_CLUBS, ...DIVISION_1_CLUBS];

const CLUBS_BY_ID = new Map(CLUBS.map((club) => [club.id, club]));

export function getClub(clubId: string): Club | undefined {
  return CLUBS_BY_ID.get(clubId);
}

export function getClubsByDivision(division: Division): Club[] {
  return CLUBS.filter((club) => club.division === division);
}
