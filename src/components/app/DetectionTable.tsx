import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { SEVERITY_META, formatCoords, formatUTC, type Detection } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

export function DetectionTable({
  detections,
  selectedId,
  onSelect,
}: {
  detections: Detection[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return detections;
    return detections.filter(
      (d) =>
        d.id.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        String(d.confidence).includes(q) ||
        formatCoords(d.latitude, d.longitude).toLowerCase().includes(q),
    );
  }, [detections, query]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  useEffect(() => {
    setPage(0);
  }, [query, detections.length]);
  const current = rows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section aria-label="Detections">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-1 pb-3 sm:flex sm:justify-between">
        <h3 className="truncate text-base font-medium">Detections ({rows.length})</h3>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search detections..."
            aria-label="Search detections"
            className="h-9 w-full min-w-0 rounded-lg border border-border bg-surface-2/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none sm:w-[240px]"
          />
        </div>
      </div>

      <div className="overflow-x-auto scan-scroll rounded-lg border border-border">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Timestamp (UTC)</th>
              <th className="px-4 py-3 font-medium">Coordinates</th>
              <th className="px-4 py-3 font-medium">Confidence</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {current.map((d) => {
              const meta = SEVERITY_META[d.severity];
              const active = selectedId === d.id;
              return (
                <tr
                  key={d.id}
                  tabIndex={0}
                  role="button"
                  onClick={() => onSelect(d.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(d.id);
                    }
                  }}
                  className={cn(
                    "cursor-pointer border-t border-border/70 transition-colors hover:bg-accent/40",
                    active && "bg-primary/10 ring-1 ring-inset ring-primary/40",
                  )}
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: meta.color }}
                        aria-hidden
                      />
                      {d.id}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {formatUTC(d.timestamp)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {formatCoords(d.latitude, d.longitude)}
                  </td>
                  <td
                    className="whitespace-nowrap px-4 py-3 font-semibold"
                    style={{ color: meta.color }}
                  >
                    {d.confidence}%{" "}
                    <span className="text-[10px] font-normal text-muted-foreground">
                      {meta.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{d.type}</td>
                  <td className="px-2 py-3 text-muted-foreground">
                    <ChevronRight className="h-4 w-4" />
                  </td>
                </tr>
              );
            })}
            {current.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No detections match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-1 pt-3 text-xs text-muted-foreground">
        <span>
          Page {page + 1} of {pages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-md border border-border px-2 py-1 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            disabled={page >= pages - 1}
            className="rounded-md border border-border px-2 py-1 disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
