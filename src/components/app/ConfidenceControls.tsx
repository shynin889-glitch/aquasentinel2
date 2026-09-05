import { Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ConfidenceControls({
  threshold,
  onThreshold,
  heatmap,
  onHeatmap,
  counts,
}: {
  threshold: number;
  onThreshold: (n: number) => void;
  heatmap: boolean;
  onHeatmap: (b: boolean) => void;
  counts: { total: number; high: number; medium: number; low: number };
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <p className="flex min-w-0 items-center gap-2 text-sm font-medium">
          <span className="truncate">Confidence Threshold</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="What is the confidence threshold?"
                className="text-muted-foreground hover:text-primary"
              >
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[240px]">
              Detections scoring below this threshold are hidden from the sonar view, map and table.
            </TooltipContent>
          </Tooltip>
        </p>
        <label className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
          <Switch
            checked={heatmap}
            onCheckedChange={onHeatmap}
            aria-label="Show heatmap"
            className="data-[state=checked]:bg-primary"
          />
          Show heatmap
        </label>
      </div>

      <div className="relative pt-6">
        <span
          className="absolute -translate-x-1/2 text-xs font-medium text-foreground"
          style={{ left: `${((threshold - 30) / 70) * 100}%`, top: 0 }}
        >
          {threshold}%
        </span>
        <Slider
          value={[threshold]}
          min={30}
          max={100}
          step={1}
          onValueChange={([v]) => onThreshold(v ?? 70)}
          aria-label="Confidence threshold"
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          {[30, 50, 70, 90, 100].map((n) => (
            <span key={n}>{n}%</span>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Adjust the threshold to filter detections in real time.
      </p>

      <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs sm:flex sm:items-center sm:gap-6">
        <span className="text-muted-foreground">
          Detections shown: <span className="font-medium text-foreground">{counts.total}</span>
        </span>
        {(
          [
            ["High", counts.high, "var(--high)"],
            ["Medium", counts.medium, "var(--medium)"],
            ["Low", counts.low, "var(--low)"],
          ] as const
        ).map(([label, value, color]) => (
          <span key={label} className="flex items-center gap-2 text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {label}: <span className="font-medium text-foreground">{value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
