import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { UploadDropzone } from "@/components/app/UploadDropzone";
import { useApp } from "@/lib/app-store";
import { STAGES, useProcessing } from "@/lib/use-processing";
import { generateDetections } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload Scan — AquaSentinel" },
      {
        name: "description",
        content: "Upload underwater sonar data for AI-powered marine debris detection.",
      },
      { property: "og:title", content: "Upload Sonar Scan — AquaSentinel" },
      {
        property: "og:description",
        content: "Run the AquaSentinel AI detection pipeline on new sonar surveys.",
      },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const proc = useProcessing();
  const navigate = useNavigate();
  const { addScan, pushNotification } = useApp();
  const [result, setResult] = useState<{
    total: number;
    avg: number;
    high: number;
    medium: number;
    low: number;
  } | null>(null);

  const handleFile = (file: File) => {
    setResult(null);
    proc.start(file, () => {
      const dets = generateDetections("SCAN-NEW", 120 + Math.floor(Math.random() * 120));
      const high = dets.filter((d) => d.severity === "high").length;
      const medium = dets.filter((d) => d.severity === "medium").length;
      const low = dets.filter((d) => d.severity === "low").length;
      const avg = Number((dets.reduce((s, d) => s + d.confidence, 0) / dets.length).toFixed(1));
      setResult({ total: dets.length, avg, high, medium, low });
      addScan({
        id: `SCAN-${Math.floor(100 + Math.random() * 800)}`,
        filename: file.name,
        date: new Date().toISOString(),
        location: "26.12°N, 93.45°E",
        region: "Brahmaputra Delta",
        detections: dets.length,
        avgConfidence: avg,
        status: "Completed",
      });
      pushNotification({
        title: "Processing complete",
        body: `${file.name} analysed — ${dets.length} detections.`,
        tone: "success",
      });
      toast.success("Analysis complete");
    });
  };

  return (
    <AppShell
      title="Upload Scan"
      subtitle="Upload underwater sonar data for AI-powered debris detection."
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="panel p-4 sm:p-6">
          <UploadDropzone onFile={handleFile} compact />
          <p className="mt-3 text-xs text-muted-foreground">
            Accepted formats: .xtf sonar logs, .jpg / .jpeg / .png waterfall exports. Maximum file
            size 200MB per scan.
          </p>
        </section>

        <section className="panel p-4 sm:p-6">
          <h2 className="text-sm font-medium">AI processing pipeline</h2>
          {!proc.file && !result && (
            <p className="mt-3 text-sm text-muted-foreground">
              Select a scan to start the detection pipeline.
            </p>
          )}

          {proc.file && (
            <>
              <p className="mt-3 truncate text-sm text-primary">{proc.file.name}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-200"
                  style={{ width: `${proc.progress}%` }}
                />
              </div>
              <p className="mt-1 text-right text-xs text-muted-foreground">{proc.progress}%</p>

              <ol className="mt-4 space-y-2.5">
                {STAGES.map((stage, i) => {
                  const active = proc.running && i === proc.stageIndex;
                  const complete = proc.done || i < proc.stageIndex;
                  return (
                    <li
                      key={stage}
                      className={cn(
                        "flex items-center gap-2 text-sm",
                        complete
                          ? "text-foreground"
                          : active
                            ? "text-primary"
                            : "text-muted-foreground/70",
                      )}
                    >
                      {complete ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : active ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-border" />
                      )}
                      {i + 1}. {stage}
                    </li>
                  );
                })}
              </ol>
            </>
          )}

          {result && (
            <div className="mt-5 rounded-lg border border-primary/30 bg-primary/[0.06] p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" /> Analysis Complete
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Detections</dt>
                  <dd className="font-semibold">{result.total}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Avg confidence</dt>
                  <dd className="font-semibold">{result.avg}%</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">High / Medium</dt>
                  <dd className="font-semibold">
                    {result.high} / {result.medium}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Low</dt>
                  <dd className="font-semibold">{result.low}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => navigate({ to: "/dashboard" })}
                className="mt-4 w-full rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
              >
                View Results
              </button>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
