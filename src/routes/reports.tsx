import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
import { Eye, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { ReportDownload } from "@/components/app/ReportDownload";
import { MapPanel } from "@/components/app/MapPanel";
import { useApp } from "@/lib/app-store";
import { formatDate, type ReportRecord } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — AquaSentinel" },
      {
        name: "description",
        content: "Generate, preview and export marine debris survey reports as PDF, CSV or JSON.",
      },
      { property: "og:title", content: "Survey Reports — AquaSentinel" },
      {
        property: "og:description",
        content: "Every AquaSentinel survey report with statistics, maps and exports.",
      },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { reports, addReport, removeReport, visibleDetections, counts, threshold, heatmap, selectDetection, selectedId } =
    useApp();
  const [preview, setPreview] = useState<ReportRecord | null>(null);
  const [notes, setNotes] = useState("Survey completed in calm sea state; nadir gap within spec.");

  const distribution = [
    { name: "High", value: counts.high, color: "var(--high)" },
    { name: "Medium", value: counts.medium, color: "var(--medium)" },
    { name: "Low", value: counts.low, color: "var(--low)" },
  ];

  return (
    <AppShell
      title="Reports"
      subtitle="Generated survey reports and export history."
      actions={
        <button
          type="button"
          onClick={() => {
            addReport({
              id: `RPT-${Math.floor(2100 + Math.random() * 800)}`,
              survey: "Brahmaputra Delta — Survey 042",
              scanId: "SCAN-042",
              generated: new Date().toISOString(),
              detections: visibleDetections.length,
              avgConfidence: 78.6,
              fileType: "PDF",
              status: "Ready",
            });
            toast.success("New report generated.");
          }}
          className="hidden items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 sm:inline-flex"
        >
          <Plus className="h-4 w-4" /> Generate New Report
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((r) => (
          <article key={r.id} className="panel glow-card flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-medium">{r.survey}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {r.id} · Generated {formatDate(r.generated)}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[11px]",
                  r.status === "Ready" && "bg-success/15 text-success",
                  r.status === "Generating" &&
                    "bg-[color:var(--medium)]/15 text-[color:var(--medium)]",
                  r.status === "Archived" && "bg-muted text-muted-foreground",
                )}
              >
                {r.status}
              </span>
            </div>
            <dl className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <dt className="text-muted-foreground">Detections</dt>
                <dd className="mt-0.5 text-sm font-semibold">{r.detections}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Confidence</dt>
                <dd className="mt-0.5 text-sm font-semibold">{r.avgConfidence}%</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Format</dt>
                <dd className="mt-0.5 text-sm font-semibold">{r.fileType}</dd>
              </div>
            </dl>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPreview(r)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs hover:border-primary/40 hover:text-primary"
              >
                <Eye className="h-3.5 w-3.5" /> View
              </button>
              <ReportDownload
                detections={visibleDetections}
                survey={r.survey}
                scanId={r.scanId}
                compact
              />
              <button
                type="button"
                onClick={() => {
                  removeReport(r.id);
                  toast.success(`${r.id} deleted.`);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:border-destructive/50 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto scan-scroll bg-surface">
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle>{preview.survey}</DialogTitle>
              </DialogHeader>
              <div className="space-y-5">
                <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  {[
                    ["Report", preview.id],
                    ["Scan", preview.scanId],
                    ["Detections", String(preview.detections)],
                    ["Avg confidence", `${preview.avgConfidence}%`],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-lg border border-border bg-surface-2/50 p-3">
                      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {k}
                      </dt>
                      <dd className="mt-1 font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>

                <MapPanel
                  detections={visibleDetections}
                  threshold={threshold}
                  heatmap={heatmap}
                  selectedId={selectedId}
                  onSelect={selectDetection}
                />

                <div className="grid gap-4 sm:grid-cols-[240px_minmax(0,1fr)]">
                  <div className="h-[200px] rounded-lg border border-border p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <RTooltip
                          contentStyle={{
                            background: "var(--popover)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Pie
                          data={distribution}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={45}
                          outerRadius={70}
                          stroke="none"
                        >
                          {distribution.map((d) => (
                            <Cell key={d.name} fill={d.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <label
                      htmlFor="report-notes"
                      className="text-xs uppercase tracking-wider text-muted-foreground"
                    >
                      Notes
                    </label>
                    <textarea
                      id="report-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={6}
                      className="mt-2 w-full rounded-lg border border-border bg-surface-2/50 p-3 text-sm focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                </div>

                <ReportDownload
                  detections={visibleDetections}
                  survey={preview.survey}
                  scanId={preview.scanId}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
