const STAR_POINTS =
  "0,-1.6 0.4,-0.55 1.52,-0.49 0.65,0.21 0.94,1.29 0,0.68 -0.94,1.29 -0.65,0.21 -1.52,-0.49 -0.4,-0.55";
const RING_R = 10.5;
const C = 16;

function starXY(k: number) {
  const a = (k * Math.PI * 2) / 12 - Math.PI / 2;
  return { x: C + RING_R * Math.cos(a), y: C + RING_R * Math.sin(a) };
}

export function EuStarRing({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden focusable="false">
      {Array.from({ length: 12 }, (_, k) => {
        const { x, y } = starXY(k);
        return (
          <polygon
            key={k}
            points={STAR_POINTS}
            transform={`translate(${x.toFixed(2)},${y.toFixed(2)})`}
            fill="#f0c040"
          />
        );
      })}
    </svg>
  );
}
