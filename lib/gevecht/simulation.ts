import type { Hooligan } from "@/types";
import { determineArrestOutcome } from "./arrest";
import {
  BASE_DAMAGE_PER_SECOND,
  BASE_HEALTH,
  BASE_SPEED,
  BETRAYAL_POLICE_GAUGE_START_BONUS_PERCENT,
  BIVAKMUTS_POLICE_TOLERANCE_SECONDS,
  COCAINE_SPEED_MULTIPLIER,
  CONTACT_RANGE,
  DRONKEN_DAMAGE_MULTIPLIER,
  DRONKEN_MISS_CHANCE,
  DRONKEN_SPEED_MULTIPLIER,
  FIELD_HEIGHT,
  FIELD_WIDTH,
  FLEE_CHANCE_ON_LETHAL_HIT,
  HATE_DAMAGE_BONUS_PER_POINT,
  MAX_FIGHT_DURATION_SECONDS,
  MAX_POLICE_GAUGE_START_PERCENT,
  POLICE_GAUGE_MAX_PERCENT_PER_SECOND,
  POLICE_GAUGE_PERCENT_PER_SECOND_PER_NOTORIETY,
  VECHTSPORT_DAMAGE_MULTIPLIER,
} from "./constants";
import { equipmentDamageMultiplier } from "./equipment-modifiers";
import { generateOpponentTeam, padRosterForFight } from "./generate-team";
import {
  computeHateScore,
  heeftBivakmuts,
  heeftCocaine,
  heeftVechtsportTrait,
  isDronken,
} from "./hooligan-traits";
import type {
  Combatant,
  Duel,
  FightConfig,
  FightOutcome,
  FightResult,
  FightState,
  TeamId,
  Vector2,
} from "./types";

export const DEFAULT_FIGHT_CONFIG: FightConfig = {
  fieldWidth: FIELD_WIDTH,
  fieldHeight: FIELD_HEIGHT,
  maxDurationSeconds: MAX_FIGHT_DURATION_SECONDS,
  notoriety: 0,
  startingPoliceGaugePercent: 0,
};

const SPAWN_MARGIN = 60;

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function randomTeamSize(): number {
  return 5 + Math.floor(Math.random() * 4); // 5 t/m 8
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function computeSpeed(hooligan: Hooligan): number {
  let speed = BASE_SPEED;
  if (heeftCocaine(hooligan)) speed *= COCAINE_SPEED_MULTIPLIER;
  if (isDronken(hooligan)) speed *= DRONKEN_SPEED_MULTIPLIER;
  return speed;
}

function computePoliceTolerance(hooligan: Hooligan): number {
  return heeftBivakmuts(hooligan) ? BIVAKMUTS_POLICE_TOLERANCE_SECONDS : 0;
}

function createCombatant(
  hooligan: Hooligan,
  team: TeamId,
  position: Vector2,
): Combatant {
  return {
    id: createId("combatant"),
    hooligan,
    team,
    position,
    state: "idle",
    health: BASE_HEALTH,
    maxHealth: BASE_HEALTH,
    speed: computeSpeed(hooligan),
    targetId: null,
    duelId: null,
    policeToleranceSeconds: computePoliceTolerance(hooligan),
  };
}

function spawnTeam(
  hooligans: Hooligan[],
  team: TeamId,
  config: FightConfig,
): Combatant[] {
  const x = team === "player" ? SPAWN_MARGIN : config.fieldWidth - SPAWN_MARGIN;
  const ySpacing = config.fieldHeight / (hooligans.length + 1);

  return hooligans.map((hooligan, index) =>
    createCombatant(hooligan, team, { x, y: ySpacing * (index + 1) }),
  );
}

/** Zet een nieuw gevecht op met twee teams van 5-8 hooligans, tegenover elkaar gespawnd. */
export function createFight(
  playerRoster: Hooligan[],
  config: FightConfig = DEFAULT_FIGHT_CONFIG,
): FightState {
  const teamSize = randomTeamSize();
  const playerHooligans = padRosterForFight(playerRoster, teamSize, teamSize);
  const opponentHooligans = generateOpponentTeam(teamSize);
  const startingPoliceGaugePercent = clamp(config.startingPoliceGaugePercent, 0, 100);

  return {
    config,
    elapsedSeconds: 0,
    combatants: [
      ...spawnTeam(playerHooligans, "player", config),
      ...spawnTeam(opponentHooligans, "opponent", config),
    ],
    duels: [],
    status: "in-progress",
    result: null,
    policeGaugePercent: startingPoliceGaugePercent,
    policeGaugeFullAtSeconds: startingPoliceGaugePercent >= 100 ? 0 : null,
  };
}

function isTargetable(combatant: Combatant): boolean {
  return (
    combatant.state === "idle" ||
    combatant.state === "moving" ||
    combatant.state === "fighting"
  );
}

function findById(combatants: Combatant[], id: string | null): Combatant | undefined {
  if (!id) return undefined;
  return combatants.find((combatant) => combatant.id === id);
}

/** Elke vrije hooligan zoekt (opnieuw) het hoogst scorende, nog levende/actieve doelwit. */
function assignTargets(combatants: Combatant[]): void {
  for (const combatant of combatants) {
    if (combatant.state !== "idle" && combatant.state !== "moving") continue;

    const currentTarget = findById(combatants, combatant.targetId);
    if (currentTarget && isTargetable(currentTarget)) continue;

    const enemies = combatants.filter(
      (other) => other.team !== combatant.team && isTargetable(other),
    );
    if (enemies.length === 0) {
      combatant.targetId = null;
      continue;
    }

    let bestTarget = enemies[0];
    let bestScore = computeHateScore(combatant.hooligan, bestTarget.hooligan);
    for (const enemy of enemies.slice(1)) {
      const score = computeHateScore(combatant.hooligan, enemy.hooligan);
      if (score > bestScore) {
        bestTarget = enemy;
        bestScore = score;
      }
    }

    combatant.targetId = bestTarget.id;
    combatant.state = "moving";
  }
}

function distance(a: Vector2, b: Vector2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Beweegt hooligans die nog geen contact hebben richting hun doelwit (of diens kluitje). */
function moveCombatants(
  combatants: Combatant[],
  duels: Duel[],
  dtSeconds: number,
  config: FightConfig,
): void {
  for (const combatant of combatants) {
    if (combatant.state !== "moving") continue;

    const target = findById(combatants, combatant.targetId);
    if (!target || !isTargetable(target)) continue;

    const duel = target.duelId ? duels.find((d) => d.id === target.duelId) : undefined;
    const destination = duel ? duel.position : target.position;

    if (distance(combatant.position, destination) <= CONTACT_RANGE) continue;

    const dx = destination.x - combatant.position.x;
    const dy = destination.y - combatant.position.y;
    const length = Math.hypot(dx, dy) || 1;
    const step = combatant.speed * dtSeconds;

    combatant.position = {
      x: clamp(combatant.position.x + (dx / length) * step, 0, config.fieldWidth),
      y: clamp(combatant.position.y + (dy / length) * step, 0, config.fieldHeight),
    };
  }
}

/** Vergrendelt hooligans die hun doelwit (of diens kluitje) bereikt hebben in een duel. */
function resolveContacts(combatants: Combatant[], duels: Duel[]): void {
  for (const combatant of combatants) {
    if (combatant.state !== "moving") continue;

    const target = findById(combatants, combatant.targetId);
    if (!target || !isTargetable(target)) continue;

    if (target.duelId) {
      const duel = duels.find((d) => d.id === target.duelId);
      if (!duel || distance(combatant.position, duel.position) > CONTACT_RANGE) continue;

      duel.participantIds.push(combatant.id);
      combatant.duelId = duel.id;
      combatant.state = "fighting";
      continue;
    }

    if (distance(combatant.position, target.position) > CONTACT_RANGE) continue;

    const duel: Duel = {
      id: createId("duel"),
      position: {
        x: (combatant.position.x + target.position.x) / 2,
        y: (combatant.position.y + target.position.y) / 2,
      },
      participantIds: [combatant.id, target.id],
    };
    duels.push(duel);
    combatant.duelId = duel.id;
    combatant.state = "fighting";
    target.duelId = duel.id;
    target.state = "fighting";
  }
}

function computeDamage(attacker: Hooligan, defender: Hooligan, dtSeconds: number): number {
  let dps = BASE_DAMAGE_PER_SECOND;
  dps *= heeftVechtsportTrait(attacker) ? VECHTSPORT_DAMAGE_MULTIPLIER : 1;
  dps *= equipmentDamageMultiplier(attacker.equipment);
  dps *= 1 + computeHateScore(attacker, defender) * HATE_DAMAGE_BONUS_PER_POINT;

  if (isDronken(attacker)) {
    if (Math.random() < DRONKEN_MISS_CHANCE) return 0;
    dps *= DRONKEN_DAMAGE_MULTIPLIER;
  }

  return dps * dtSeconds;
}

/** Bepaalt of een hooligan die op 0 gezondheid komt vlucht of neergaat (basis-implementatie). */
function handleLethalHit(combatant: Combatant): void {
  if (Math.random() < FLEE_CHANCE_ON_LETHAL_HIT) {
    combatant.state = "fleeing";
    combatant.health = 1;
  } else {
    combatant.state = "downed";
    combatant.health = 0;
  }
  combatant.duelId = null;
  combatant.targetId = null;
}

/**
 * Past schade toe binnen elk kluitje: elke aanvaller richt op de zwakste levende tegenstander in
 * het kluitje. Bij 2-tegen-1 (of meer) tellen alle aanvallers gewoon op tegen dezelfde underdog.
 */
function resolveDamage(combatants: Combatant[], duels: Duel[], dtSeconds: number): void {
  for (const duel of duels) {
    const participants = duel.participantIds
      .map((id) => findById(combatants, id))
      .filter((c): c is Combatant => c !== undefined && c.state === "fighting");

    for (const team of ["player", "opponent"] as TeamId[]) {
      const attackers = participants.filter((c) => c.team === team);
      const defenders = participants.filter((c) => c.team !== team);
      if (attackers.length === 0 || defenders.length === 0) continue;

      for (const attacker of attackers) {
        const focus = defenders.reduce((weakest, current) =>
          current.health < weakest.health ? current : weakest,
        );
        const damage = computeDamage(attacker.hooligan, focus.hooligan, dtSeconds);
        focus.health -= damage;
        if (focus.health <= 0 && focus.state === "fighting") {
          handleLethalHit(focus);
        }
      }
    }
  }
}

/** Ontbindt kluitjes waarvan een kant volledig weg is (KO/gevlucht); winnaars worden weer vrij. */
function cleanupDuels(combatants: Combatant[], duels: Duel[]): Duel[] {
  return duels.filter((duel) => {
    duel.participantIds = duel.participantIds.filter((id) => {
      const combatant = findById(combatants, id);
      return combatant?.state === "fighting";
    });

    const remaining = duel.participantIds
      .map((id) => findById(combatants, id))
      .filter((c): c is Combatant => Boolean(c));
    const teamsPresent = new Set(remaining.map((c) => c.team));

    if (teamsPresent.size >= 2) return true;

    for (const combatant of remaining) {
      combatant.state = "idle";
      combatant.duelId = null;
      combatant.targetId = null;
    }
    return false;
  });
}

/** Vluchtende hooligans rennen terug naar hun eigen kant van het veld en verlaten dan het gevecht. */
function updateFleeing(
  combatants: Combatant[],
  dtSeconds: number,
  config: FightConfig,
): void {
  for (const combatant of combatants) {
    if (combatant.state !== "fleeing") continue;

    const edgeX = combatant.team === "player" ? 0 : config.fieldWidth;
    const step = combatant.speed * dtSeconds * (combatant.team === "player" ? -1 : 1);
    combatant.position = {
      ...combatant.position,
      x: clamp(combatant.position.x + step, 0, config.fieldWidth),
    };

    if (Math.abs(combatant.position.x - edgeX) < 1) {
      combatant.state = "fled";
    }
  }
}

function isStillFighting(combatant: Combatant): boolean {
  return (
    combatant.state === "idle" ||
    combatant.state === "moving" ||
    combatant.state === "fighting" ||
    combatant.state === "fleeing"
  );
}

/** Hoeveel procentpunt de politie-meter per seconde stijgt, puur op basis van beruchtheid (design §2). */
function policeGaugeFillRatePerSecond(notoriety: number): number {
  return clamp(
    notoriety * POLICE_GAUGE_PERCENT_PER_SECOND_PER_NOTORIETY,
    0,
    POLICE_GAUGE_MAX_PERCENT_PER_SECOND,
  );
}

/**
 * Zodra de meter vol is, vluchten "verstandige" hooligans (niet dronken, niet neergeslagen) het
 * veld af — met een extra tolerantie voor wie een bivakmuts draagt. Dronken/KO'de hooligans
 * blijven staan/liggen en worden later door de politie opgepakt.
 */
function triggerPoliceFlee(
  combatants: Combatant[],
  elapsedSeconds: number,
  policeGaugeFullAtSeconds: number | null,
): void {
  if (policeGaugeFullAtSeconds === null) return;

  for (const combatant of combatants) {
    if (
      combatant.state !== "idle" &&
      combatant.state !== "moving" &&
      combatant.state !== "fighting"
    ) {
      continue;
    }
    if (isDronken(combatant.hooligan)) continue;
    if (elapsedSeconds - policeGaugeFullAtSeconds < combatant.policeToleranceSeconds) continue;

    combatant.state = "fleeing";
    combatant.duelId = null;
    combatant.targetId = null;
  }
}

function evaluateFightEnd(
  combatants: Combatant[],
  elapsedSeconds: number,
  config: FightConfig,
  policeGaugeFullAtSeconds: number | null,
): FightResult | null {
  const playerRemaining = combatants.some(
    (c) => c.team === "player" && isStillFighting(c),
  );
  const opponentRemaining = combatants.some(
    (c) => c.team === "opponent" && isStillFighting(c),
  );
  const policeSweepResolved =
    policeGaugeFullAtSeconds !== null &&
    !combatants.some((c) => c.state === "fleeing");

  let outcome: FightOutcome | null = null;
  if (!opponentRemaining) outcome = "full-clear-player";
  else if (policeSweepResolved) outcome = "police-raid";
  else if (!playerRemaining) outcome = "full-clear-opponent";
  else if (elapsedSeconds >= config.maxDurationSeconds) outcome = "timeout";

  if (!outcome) return null;

  const koCounts: Record<TeamId, number> = { player: 0, opponent: 0 };
  const fledCounts: Record<TeamId, number> = { player: 0, opponent: 0 };
  for (const combatant of combatants) {
    if (combatant.state === "downed") koCounts[combatant.team] += 1;
    if (combatant.state === "fled") fledCounts[combatant.team] += 1;
  }

  // Bij een full clear was er geen politie-inmenging nodig; niemand wordt opgepakt.
  const isPoliceSweep = outcome === "police-raid" || outcome === "timeout";
  const arrests = isPoliceSweep
    ? combatants
        .filter((c) => c.team === "player" && c.state !== "fled")
        .map((c) => determineArrestOutcome(c.hooligan))
    : [];

  const betrayalCount = arrests.filter((arrest) => arrest.betrayal).length;
  const nextPoliceGaugeStartPercent = clamp(
    betrayalCount * BETRAYAL_POLICE_GAUGE_START_BONUS_PERCENT,
    0,
    MAX_POLICE_GAUGE_START_PERCENT,
  );

  return { outcome, koCounts, fledCounts, arrests, nextPoliceGaugeStartPercent };
}

/** Berekent een volledige tick van de gevecht-simulatie. Pure functie: retourneert nieuwe state. */
export function stepFight(state: FightState, dtSeconds: number): FightState {
  if (state.status === "finished") return state;

  const combatants = state.combatants.map((combatant) => ({ ...combatant }));
  const duels = state.duels.map((duel) => ({
    ...duel,
    participantIds: [...duel.participantIds],
  }));
  const elapsedSeconds = state.elapsedSeconds + dtSeconds;

  const fillRate = policeGaugeFillRatePerSecond(state.config.notoriety);
  const policeGaugePercent = clamp(state.policeGaugePercent + fillRate * dtSeconds, 0, 100);
  const policeGaugeFullAtSeconds =
    state.policeGaugeFullAtSeconds ?? (policeGaugePercent >= 100 ? elapsedSeconds : null);

  assignTargets(combatants);
  moveCombatants(combatants, duels, dtSeconds, state.config);
  resolveContacts(combatants, duels);
  resolveDamage(combatants, duels, dtSeconds);
  triggerPoliceFlee(combatants, elapsedSeconds, policeGaugeFullAtSeconds);
  const remainingDuels = cleanupDuels(combatants, duels);
  updateFleeing(combatants, dtSeconds, state.config);

  const result = evaluateFightEnd(
    combatants,
    elapsedSeconds,
    state.config,
    policeGaugeFullAtSeconds,
  );

  return {
    ...state,
    elapsedSeconds,
    combatants,
    duels: remainingDuels,
    status: result ? "finished" : "in-progress",
    result,
    policeGaugePercent,
    policeGaugeFullAtSeconds,
  };
}
