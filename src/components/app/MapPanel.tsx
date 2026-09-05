import { useMemo, useState } from "react";
import { Crosshair, Layers, Minus, Plus } from "lucide-react";
import { SEVERITY_META, type Detection } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface Cluster {
  id: string;
  x: number;
  y: number;
  count: number;
  minConfidence: number;
  detectionId: string;
}

const CLUSTER_SEEDS = [
  { x: 74, y: 16, conf: 96 },
  { x: 51, y: 22, conf: 92 },
  { x: 26, y: 33, conf: 88 },
  { x: 62, y: 52, conf: 76 },
  { x: 84, y: 63, conf: 61 },
  { x: 43, y: 71, conf: 55 },
  { x: 18, y: 60, conf: 44 },
  { x: 68, y: 84, conf: 38 },
];

export function MapPanel({
  detections,
  threshold,
  heatmap,
  selectedId,
  onSelect,
  showRoutes = true,
}: {
  detections: Detection[];
  threshold: number;
  heatmap: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  showRoutes?: boolean;
}) {
  const [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState(true);

  const clusters: Cluster[] = useMemo(() => {
    const groups = CLUSTER_SEEDS.map((seed, i) => {
      const bucket = detections.filter((_, idx) => idx % CLUSTER_SEEDS.length === i);
      return {
        id: `C${i}`,
        x: seed.x,
        y: seed.y,
        count: bucket.length,
        minConfidence: seed.conf,
        detectionId: bucket[0]?.id ?? "",
      };
    });
    return groups.filter((g) => g.count > 0 && g.minConfidence >= threshold - 25);
  }, [detections, threshold]);

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-[#04121e]">
      <div className="relative aspect-[16/10] w-full">
        <svg
          viewBox="0 0 100 62"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
          role="img"
          aria-label="Survey area map with detection markers"
        >
          <defs>
            <linearGradient id="ocean" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#04121e" />
              <stop offset="100%" stopColor="#071d2c" />
            </linearGradient>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M8 0H0V8" fill="none" stroke="rgba(148,163,184,0.07)" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="62" fill="url(#ocean)" />
          <rect width="100" height="62" fill="url(#grid)" />

          {layers && (
            <g fill="#0d2b3c" stroke="rgba(24,217,230,0.25)" strokeWidth="0.25">
              <path d="M6 8 L20 4 L34 10 L40 20 L30 27 L14 24 L4 16 Z" />
              <path d="M55 6 L72 3 L86 9 L92 19 L80 26 L64 22 L52 14 Z" />
              <path d="M20 36 L38 33 L52 40 L48 52 L30 57 L14 48 Z" />
              <path d="M62 40 L82 38 L94 46 L88 57 L70 58 L60 50 Z" />
            </g>
          )}

          {showRoutes && (
            <g fill="none" stroke="rgba(32,207,224,0.6)" strokeWidth="0.35" strokeDasharray="1.6 1.4">
              <path d="M8 30 C26 12, 44 40, 62 18 S88 26, 96 12" />
              <path d="M10 48 C30 38, 46 58, 66 44 S90 52, 97 40" />
            </g>
          )}

          {heatmap &&
            clusters.map((c) => (
              <circle
                key={`h-${c.id}`}
                cx={c.x}
                cy={c.y * 0.62}
                r={Math.min(14, 4 + c.count / 4)}
                fill={
                  c.minConfidence >= 80
                    ? "rgba(239,68,68,0.28)"
                    : c.minConfidence >= 50
                      ? "rgba(245,158,11,0.26)"
                      : "rgba(148,163,184,0.2)"
                }
              />
            ))}
        </svg>

        {clusters.map((c) => {
          const sev = c.minConfidence >= 80 ? "high" : c.minConfidence >= 50 ? "medium" : "low";
          const meta = SEVERITY_META[sev];
          const active = selectedId === c.detectionId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => c.detectionId && onSelect(c.detectionId)}
              aria-label={`${c.count} detections, ${meta.label} confidence cluster`}
              className="absolute -translate-x-1/2 -translate-y-full transition-transform hover:scale-110"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              <span
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full rounded-bl-none rotate-45 text-[11px] font-bold text-black ring-2 ring-black/30",
                  active && "ring-primary",
                )}
                style={{ backgroundColor: meta.color }}
              >
                <span className="-rotate-45">{c.count > 99 ? "99+" : c.count}</span>
              </span>
            </button>
          );
        })}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {[
            { icon: Plus, label: "Zoom in", run: () => setZoom((z) => Math.min(2, z + 0.15)) },
            { icon: Minus, label: "Zoom out", run: () => setZoom((z) => Math.max(1, z - 0.15)) },
            { icon: Layers, label: "Toggle layers", run: () => setLayers((l) => !l) },
            { icon: Crosshair, label: "Recenter", run: () => setZoom(1) },
          ].map(({ icon: Icon, label, run }) => (
            <button
              key={label}
              type="button"
              onClick={run}
              aria-label={label}
              title={label}
              className="rounded-md border border-border bg-background/80 p-2 text-muted-foreground backdrop-blur transition-colors hover:text-primary"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        <div className="absolute right-3 top-3 rounded-lg border border-border bg-background/85 p-3 text-xs backdrop-blur">
          <p className="mb-2 font-medium">Confidence</p>
          <ul className="space-y-1.5 text-muted-foreground">
            {(
              [
                ["high", "High (≥ 80%)"],
                ["medium", "Medium (50% – 79%)"],
                ["low", "Low (< 50%)"],
              ] as const
            ).map(([k, label]) => (
              <li key={k} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: SEVERITY_META[k].color }}
                />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>2 km</span>
          <span className="block h-2 w-16 border-x border-b border-muted-foreground/70" />
        </div>
        <div className="absolute bottom-3 left-3 text-[11px] tracking-wide text-muted-foreground/80">
          AquaSentinel Ocean Grid
        </div>
      </div>
    </div>
  );
}
