import { computeHateScore } from "./hooligan-traits";
import type { Combatant, FightState, TeamId } from "./types";

const TEAM_COLORS: Record<TeamId, string> = {
  player: "#3b82f6",
  opponent: "#ef4444",
};

const RADIUS = 14;

function highestHateAgainstEnemies(combatant: Combatant, all: Combatant[]): number {
  const enemies = all.filter(
    (other) =>
      other.team !== combatant.team &&
      other.state !== "fled" &&
      other.state !== "downed",
  );
  if (enemies.length === 0) return 0;

  return Math.max(
    ...enemies.map((enemy) => computeHateScore(combatant.hooligan, enemy.hooligan)),
  );
}

function drawCombatant(
  ctx: CanvasRenderingContext2D,
  combatant: Combatant,
  all: Combatant[],
): void {
  const { x, y } = combatant.position;

  if (combatant.state === "downed") {
    ctx.save();
    ctx.fillStyle = "#4b5563";
    ctx.beginPath();
    ctx.ellipse(x, y, RADIUS, RADIUS / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  const hate = highestHateAgainstEnemies(combatant, all);
  const glowIntensity = Math.min(hate / 12, 1);

  if (glowIntensity > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, RADIUS + 6, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, ${Math.round(120 - glowIntensity * 120)}, 0, ${0.3 + glowIntensity * 0.6})`;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.globalAlpha = combatant.state === "fleeing" ? 0.5 : 1;
  ctx.fillStyle = TEAM_COLORS[combatant.team];
  ctx.beginPath();
  ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
  ctx.fill();

  if (combatant.state === "fighting") {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#facc15";
    ctx.stroke();
  }
  ctx.restore();

  if (combatant.health < combatant.maxHealth) {
    const barWidth = RADIUS * 2;
    const healthRatio = Math.max(combatant.health, 0) / combatant.maxHealth;
    ctx.save();
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(x - barWidth / 2, y - RADIUS - 12, barWidth, 4);
    ctx.fillStyle = healthRatio > 0.3 ? "#22c55e" : "#ef4444";
    ctx.fillRect(x - barWidth / 2, y - RADIUS - 12, barWidth * healthRatio, 4);
    ctx.restore();
  }

  ctx.save();
  ctx.fillStyle = "#f9fafb";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(combatant.hooligan.name, x, y - RADIUS - 16);
  ctx.restore();
}

/** Tekent het volledige gevechtsveld (top-down) op canvas op basis van de huidige fight-state. */
export function drawFight(canvas: HTMLCanvasElement, fight: FightState): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#14231a";
  ctx.fillRect(0, 0, fight.config.fieldWidth, fight.config.fieldHeight);

  for (const combatant of fight.combatants) {
    if (combatant.state === "fled") continue;
    drawCombatant(ctx, combatant, fight.combatants);
  }
}
