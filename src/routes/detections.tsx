import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { useApp } from "@/lib/app-store";
import { formatDate, type Scan } from "@/lib/mock-data";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ReportDownload } from "@/components/app/ReportDownload";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/detections")({
  head: () => ({
    meta: [
      { title: "Detection History — AquaSentinel" },
      {
        name: "description",
        content: "Review and analyse previous underwater sonar surveys and their AI detections.",
      },
      { property: "og:title", content: "Detection History — AquaSentinel" },
      {
        property: "og:description",
        content: "Filter past marine debris surveys by date, location, confidence and status.",
      },
    ],
  }),
  component: HistoryPage,
});

const SELECT =
  "h-9 rounded-lg border border-border bg-surface-2/60 px-3 text-sm text-foreground focus:border-primary/50 focus:outline-none";

function HistoryPage() {
  const { scans, visibleDetections } = useApp();
  const [query, setQuery] = useState("");
  const [range, setRange] = useState("all");
  const [region, setRegion] = useState("all");
  const [conf, setConf] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState<Scan | null>(null);

  const regions = useMemo(() => Array.from(new Set(scans.map((s) => s.region))), [scans]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scans.filter((s) => {
      if (q && !(`${s.id} ${s.filename} ${s.region} ${s.location}`.toLowerCase().includes(q)))
        return false;
      if (region !== "all" && s.region !== region) return false;
      if (status !== "all" && s.status !== status) return false;
      if (conf === "high" && s.avgConfidence < 80) return false;
      if (conf === "medium" && (s.avgConfidence < 50 || s.avgConfidence >= 80)) return false;
      if (conf === "low" && s.avgConfidence >= 50) return false;
      if (range !== "all") {
        const days = Number(range);
        const cutoff = Date.parse("2025-05-24T23:59:00Z") - days * 86400000;
        if (Date.parse(s.date) < cutoff) return false;
      }
      return true;
    });
  }, [scans, query, region, status, conf, range]);

  return (
    <AppShell
      title="Detection History"
      subtitle="Review and analyze previous underwater surveys."
    >
      <section className="panel p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search scans, files or locations..."
              aria-label="Search scans"
              className="h-9 w-full rounded-lg border border-border bg-surface-2/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            />
          </div>
          <select
            aria-label="Date range"
            className={SELECT}
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="all">All dates</option>
            <option value="2">Last 2 days</option>
            <option value="5">Last 5 days</option>
            <option value="30">Last 30 days</option>
          </select>
          <select
            aria-label="Location"
            className={SELECT}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="all">All locations</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            aria-label="Confidence"
            className={SELECT}
            value={conf}
            onChange={(e) => setConf(e.target.value)}
          >
            <option value="all">All confidence</option>
            <option value="high">High (≥ 80%)</option>
            <option value="medium">Medium (50–79%)</option>
            <option value="low">Low (&lt; 50%)</option>
          </select>
          <select
            aria-label="Processing status"
            className={SELECT}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto scan-scroll rounded-lg border border-border">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                {[
                  "Scan ID",
                  "Filename",
                  "Date",
                  "Location",
                  "Detections",
                  "Avg confidence",
                  "Status",
                  "",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr
                  key={s.id}
                  className="cursor-pointer border-t border-border/70 transition-colors hover:bg-accent/40"
                  onClick={() => setOpen(s)}
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium">{s.id}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {s.filename}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {formatDate(s.date)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {s.location}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{s.detections} detections</td>
                  <td className="whitespace-nowrap px-4 py-3">{s.avgConfidence}%</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px]",
                        s.status === "Completed" && "bg-success/15 text-success",
                        s.status === "Processing" &&
                          "bg-[color:var(--medium)]/15 text-[color:var(--medium)]",
                        s.status === "Failed" && "bg-destructive/15 text-destructive",
                      )}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-primary">View analysis</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No surveys match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="w-full overflow-y-auto scan-scroll bg-surface sm:max-w-md">
          {open && (
            <>
              <SheetHeader>
                <SheetTitle>
                  {open.id} — {open.filename}
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-8">
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Date", formatDate(open.date)],
                    ["Region", open.region],
                    ["Location", open.location],
                    ["Status", open.status],
                    ["Detections", String(open.detections)],
                    ["Avg confidence", `${open.avgConfidence}%`],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-lg border border-border bg-surface-2/50 p-3">
                      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {k}
                      </dt>
                      <dd className="mt-1">{v}</dd>
                    </div>
                  ))}
                </dl>
                <ReportDownload
                  detections={visibleDetections}
                  survey={`${open.region} — ${open.id}`}
                  scanId={open.id}
                />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
