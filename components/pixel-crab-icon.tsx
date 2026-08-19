const CRAB_PIXELS = [
  "..o.....o..",
  ".oo.....oo.",
  ".oob...boo.",
  ".obbbbbbbo.",
  "obbebbbebbo",
  "obbbbbbbbbo",
  ".o.o.o.o.o.",
  "...o...o...",
];

const PIXEL_COLORS: Record<string, string> = {
  o: "#7a1f12",
  b: "#e2472b",
  e: "#1a1a1a",
};

interface PixelCrabIconProps {
  /** Pixelgrootte in px; bepaalt de totale afmeting van het icoontje. */
  size?: number;
}

/** Klein krab-icoontje in pixel art, opgebouwd uit een CSS-grid (geen afbeeldingsbestand nodig). */
export function PixelCrabIcon({ size = 4 }: PixelCrabIconProps) {
  const columns = CRAB_PIXELS[0].length;

  return (
    <div
      role="img"
      aria-label="Krab-icoontje"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, ${size}px)`,
        gridAutoRows: `${size}px`,
        flexShrink: 0,
      }}
    >
      {CRAB_PIXELS.flatMap((row, y) =>
        [...row].map((pixel, x) => (
          <div
            key={`${x}-${y}`}
            style={{ backgroundColor: PIXEL_COLORS[pixel] ?? "transparent" }}
          />
        )),
      )}
    </div>
  );
}
