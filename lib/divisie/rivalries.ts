/**
 * Rivaliteiten-paren voor de haat-bonus tijdens gevechten (design §9). Los van `Club.rivalId`
 * (de primaire rivaal per club) omdat sommige clubs in meerdere paren voorkomen — bv. Ajax
 * (Feyenoord, PSV, AZ, FC Utrecht) of Feyenoord (Ajax, Sparta, Excelsior).
 */
const RIVALRY_PAIRS: [string, string][] = [
  ["ajax", "feyenoord"],
  ["ajax", "psv"],
  ["feyenoord", "sparta-rotterdam"],
  ["feyenoord", "excelsior"],
  ["psv", "fc-eindhoven"],
  ["az", "ajax"],
  ["az", "fc-twente"],
  ["az", "telstar"],
  ["fc-twente", "heracles-almelo"],
  ["nac-breda", "willem-ii"],
  ["vitesse", "nec-nijmegen"],
  ["fortuna-sittard", "roda-jc-kerkrade"],
  ["pec-zwolle", "go-ahead-eagles"],
  ["top-oss", "fc-den-bosch"],
  ["sc-cambuur", "sc-heerenveen"],
  ["fc-groningen", "sc-heerenveen"],
  ["fc-utrecht", "ajax"],
  ["excelsior", "sparta-rotterdam"],
  ["quick-boys", "vv-katwijk"],
];

/** True als `clubIdA` en `clubIdB` een vastgelegd rivaliteiten-paar vormen (in beide richtingen). */
export function areRivals(clubIdA: string, clubIdB: string): boolean {
  if (!clubIdA || !clubIdB) return false;
  return RIVALRY_PAIRS.some(
    ([a, b]) => (a === clubIdA && b === clubIdB) || (a === clubIdB && b === clubIdA),
  );
}
