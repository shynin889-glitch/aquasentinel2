import { useState } from "react";
import { Hand, Maximize, MousePointer2, Sun, ZoomIn, ZoomOut } from "lucide-react";
import sonarImg from "@/assets/sonar-scan.jpg";
import { SEVERITY_META, type Detection } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Tool = "select" | "pan";

export function SonarViewer({
  detections,
  selectedId,
  onSelect,
  heatmap,
}: {
  detections: Detection[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  heatmap: boolean;
}) {
  const [tool, setTool] = useState<Tool>("select");
  const [zoom, setZoom] = useState(1);
  const [bright, setBright] = useState(1);
  const [hovered, setHovered] = useState<string | null>(null);

  const tools = [
    { id: "select", label: "Select", icon: MousePointer2, run: () => setTool("select") },
    { id: "pan", label: "Pan", icon: Hand, run: () => setTool("pan") },
    {
      id: "in",
      label: "Zoom in",
      icon: ZoomIn,
      run: () => setZoom((z) => Math.min(2.5, Number((z + 0.2).toFixed(2)))),
    },
    {
      id: "out",
      label: "Zoom out",
      icon: ZoomOut,
      run: () => setZoom((z) => Math.max(1, Number((z - 0.2).toFixed(2)))),
    },
    {
      id: "fit",
      label: "Fit view",
      icon: Maximize,
      run: () => {
        setZoom(1);
        setBright(1);
      },
    },
    {
      id: "bright",
      label: "Brightness / contrast",
      icon: Sun,
      run: () => setBright((b) => (b >= 1.4 ? 0.8 : Number((b + 0.2).toFixed(1)))),
    },
  ] as const;

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-black">
      <div className="absolute left-2 top-2 z-20 flex flex-col gap-1 rounded-lg border border-border bg-background/80 p-1 backdrop-blur">
        {tools.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={t.run}
            aria-label={t.label}
            title={t.label}
            className={cn(
              "rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              tool === t.id && "bg-primary/15 text-primary",
            )}
          >
            <t.icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      <div className="absolute right-2 top-2 z-20 rounded-md border border-border bg-background/80 px-2 py-1 text-[11px] text-muted-foreground backdrop-blur">
        {Math.round(zoom * 100)}% · {tool === "pan" ? "Pan" : "Select"}
      </div>

      <div
        className={cn("relative aspect-[4/3] w-full overflow-hidden", tool === "pan" && "cursor-grab")}
      >
        <div
          className="absolute inset-0 origin-center transition-transform duration-300"
          style={{ transform: `scale(${zoom})`, filter: `brightness(${bright}) contrast(1.05)` }}
        >
          <img
            src={sonarImg}
            alt="Side-scan sonar imagery of the surveyed seafloor"
            loading="lazy"
            width={1024}
            height={1024}
            className="h-full w-full object-cover"
          />
          {heatmap && (
            <div
              className="pointer-events-none absolute inset-0 mix-blend-screen"
              style={{
                background:
                  "radial-gradient(circle at 58% 18%, rgba(239,68,68,0.45), transparent 22%)," +
                  "radial-gradient(circle at 26% 28%, rgba(245,158,11,0.4), transparent 20%)," +
                  "radial-gradient(circle at 71% 68%, rgba(239,68,68,0.35), transparent 20%)," +
                  "radial-gradient(circle at 32% 83%, rgba(245,158,11,0.35), transparent 20%)",
              }}
            />
          )}

          {detections.map((d) => {
            const meta = SEVERITY_META[d.severity];
            const active = selectedId === d.id || hovered === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onSelect(d.id)}
                onMouseEnter={() => setHovered(d.id)}
                onMouseLeave={() => setHovered(null)}
                aria-label={`Detection ${d.id}, ${d.type}, ${d.confidence} percent confidence`}
                className="absolute"
                style={{
                  left: `${d.boundingBox.x}%`,
                  top: `${d.boundingBox.y}%`,
                  width: `${d.boundingBox.w}%`,
                  height: `${d.boundingBox.h}%`,
                }}
              >
                <span
                  className="absolute inset-0 rounded-[3px] border-2 transition-all"
                  style={{
                    borderColor: meta.color,
                    boxShadow: active ? `0 0 0 2px ${meta.color}55, 0 0 18px ${meta.color}` : "none",
                    backgroundColor: active ? `${meta.color}1f` : "transparent",
                  }}
                />
                <span
                  className="absolute -top-6 left-0 whitespace-nowrap rounded-[3px] px-1.5 py-0.5 text-[10px] font-semibold text-black"
                  style={{ backgroundColor: meta.color }}
                >
                  Debris — {d.confidence}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
