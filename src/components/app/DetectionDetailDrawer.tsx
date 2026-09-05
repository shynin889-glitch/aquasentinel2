import { MapPin, Sparkles } from "lucide-react";
import sonarImg from "@/assets/sonar-scan.jpg";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SEVERITY_META, formatCoords, formatUTC, type Detection } from "@/lib/mock-data";

export function DetectionDetailDrawer({
  detection,
  onOpenChange,
}: {
  detection: Detection | null;
  onOpenChange: (open: boolean) => void;
}) {
  const meta = detection ? SEVERITY_META[detection.severity] : null;

  return (
    <Sheet open={!!detection} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto scan-scroll border-border bg-surface sm:max-w-md">
        {detection && meta && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                {detection.id}
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-medium text-black"
                  style={{ backgroundColor: meta.color }}
                >
                  {meta.label} confidence
                </span>
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-5 px-4 pb-8">
              <div className="relative overflow-hidden rounded-lg border border-border">
                <img
                  src={sonarImg}
                  alt={`Sonar crop for detection ${detection.id}`}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-40 w-full object-cover"
                  style={{
                    objectPosition: `${detection.boundingBox.x}% ${detection.boundingBox.y}%`,
                  }}
                />
                <span
                  className="absolute left-1/2 top-1/2 h-16 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[3px] border-2"
                  style={{ borderColor: meta.color, boxShadow: `0 0 16px ${meta.color}` }}
                />
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Type", detection.type],
                  ["Confidence", `${detection.confidence}%`],
                  ["Status", detection.status],
                  ["Scan", detection.scanId],
                  ["Timestamp (UTC)", formatUTC(detection.timestamp)],
                  ["Coordinates", formatCoords(detection.latitude, detection.longitude)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-border bg-surface-2/50 p-3">
                    <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {k}
                    </dt>
                    <dd className="mt-1 break-words text-sm">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="rounded-lg border border-primary/25 bg-primary/[0.06] p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" /> AI explanation
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{detection.note}</p>
              </div>

              <div className="rounded-lg border border-border bg-[#04121e] p-4">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-primary" /> Location on map
                </p>
                <div className="relative mt-3 h-32 overflow-hidden rounded-md border border-border">
                  <svg viewBox="0 0 100 40" className="h-full w-full" aria-hidden>
                    <rect width="100" height="40" fill="#061826" />
                    <path
                      d="M8 26 C28 10, 48 32, 70 14 S94 22, 99 10"
                      fill="none"
                      stroke="rgba(32,207,224,0.55)"
                      strokeWidth="0.5"
                      strokeDasharray="2 1.5"
                    />
                    <path d="M12 30 L34 26 L48 33 L40 39 L16 38 Z" fill="#0d2b3c" />
                    <circle cx="62" cy="18" r="2.4" fill={meta.color} />
                  </svg>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatCoords(detection.latitude, detection.longitude)}
                </p>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
