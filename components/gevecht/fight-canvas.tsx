"use client";

import { useEffect, useRef } from "react";
import type { Hooligan } from "@/types";
import { drawFight } from "@/lib/gevecht/draw-fight";
import { createFight, stepFight } from "@/lib/gevecht/simulation";
import type { FightResult, FightState } from "@/lib/gevecht/types";

interface FightCanvasProps {
  playerRoster: Hooligan[];
  onFinish: (result: FightResult) => void;
}

/** Maximale tijdstap per animatieframe, zodat een korte hik in de browser geen grote sprong geeft. */
const MAX_TICK_SECONDS = 0.1;

export function FightCanvas({ playerRoster, onFinish }: FightCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialFightRef = useRef<FightState | null>(null);
  if (initialFightRef.current === null) {
    initialFightRef.current = createFight(playerRoster);
  }
  const initialFight = initialFightRef.current;

  useEffect(() => {
    let animationFrame: number;
    let lastTimestamp: number | null = null;
    let fight = initialFight;

    const tick = (timestamp: number) => {
      if (lastTimestamp !== null) {
        const dtSeconds = Math.min((timestamp - lastTimestamp) / 1000, MAX_TICK_SECONDS);
        fight = stepFight(fight, dtSeconds);

        const canvas = canvasRef.current;
        if (canvas) drawFight(canvas, fight);

        if (fight.status === "finished" && fight.result) {
          onFinish(fight.result);
          return;
        }
      }
      lastTimestamp = timestamp;
      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={initialFight.config.fieldWidth}
      height={initialFight.config.fieldHeight}
      role="img"
      aria-label="Gevecht-simulatie: twee teams hooligans vechten top-down op een plein"
    />
  );
}
