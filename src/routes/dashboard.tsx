import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Crosshair, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { KpiCard } from "@/components/app/KpiCard";
import { UploadDropzone, UploadedFileRow } from "@/components/app/UploadDropzone";
import { SonarViewer } from "@/components/app/SonarViewer";
import { ConfidenceControls } from "@/components/app/ConfidenceControls";
import { MapPanel } from "@/components/app/MapPanel";
import { DetectionTable } from "@/components/app/DetectionTable";
import { DetectionDetailDrawer } from "@/components/app/DetectionDetailDrawer";
import { ReportDownload } from "@/components/app/ReportDownload";
import { useApp } from "@/lib/app-store";
import { useProcessing, STAGES } from "@/lib/use-processing";
import { KPI, SONAR_DETECTIONS } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AquaSentinel Marine Debris Detection" },
      {
        name: "description",
        content:
          "Live AI sonar debris detection dashboard: scan uploads, confidence filtering, survey map and detection records.",
      },
      { property: "og:title", content: "AquaSentinel Detection Dashboard" },
      {
        property: "og:description",
        content: "Monitor AI-detected marine debris across sonar surveys in real time.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const {
    threshold,
    setThreshold,
    heatmap,
    setHeatmap,
    counts,
    visibleDetections,
    detections,
    selectedId,
    selectDetection,
    addScan,
    pushNotification,
    settings,
  } = useApp();
  const proc = useProcessing();
  const [uploadedName, setUploadedName] = useState("survey_042.xtf");
  const [uploadedAt, setUploadedAt] = useState("Uploaded: May 24, 2025 10:42 AM");

  const sonarBoxes = useMemo(
    () => SONAR_DETECTIONS.filter((d) => d.confidence >= threshold - 20),
    [threshold],
  );

  const selected = detections.find((d) => d.id === selectedId) ?? null;

  const handleFile = (file: File) => {
    setUploadedName(file.name);
    proc.start(file, () => {
      const now = new Date();
      setUploadedAt(
        `Uploaded: ${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`,
      );
      addScan({
        id: `SCAN-${Math.floor(100 + Math.random() * 800)}`,
        filename: file.name,
        date: now.toISOString(),
        location: "26.12°N, 93.45°E",
        region: "Brahmaputra Delta",
        detections: 140 + Math.floor(Math.random() * 120),
        avgConfidence: Number((68 + Math.random() * 16).toFixed(1)),
        status: "Completed",
      });
      pushNotification({
        title: "Processing complete",
        body: `${file.name} analysed and added to detection history.`,
        tone: "success",
      });
      toast.success(`${file.name} processed — detections added to history.`);
    });
  };

  return (
    <AppShell title="Dashboard" subtitle="AI-Powered Automated Underwater Detection">
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          title="Total Scans Processed"
          value={KPI.totalScans.toLocaleString()}
          change="18% vs yesterday"
          icon={ScanLine}
        />
        <KpiCard
          title="Debris Detected Today"
          value={String(KPI.debrisToday)}
          change="24% vs yesterday"
          icon={Crosshair}
          tone="warning"
        />
        <KpiCard
          title="Average Confidence Score"
          value={`${KPI.avgConfidence}%`}
          change="5.4% vs yesterday"
          icon={BarChart3}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[45fr_55fr]">
        <section className="panel p-4 sm:p-5">
          <h2 className="mb-4 text-base font-medium">
            <span className="text-muted-foreground">1.</span>{" "}
            <span className="text-primary">Upload &amp; Live View</span>
          </h2>

          <UploadDropzone onFile={handleFile} />

          <div className="mt-3 space-y-2">
            <UploadedFileRow
              filename={uploadedName}
              meta={proc.running ? STAGES[proc.stageIndex] : uploadedAt}
              progress={proc.running ? proc.progress : 100}
              done={!proc.running}
            />
          </div>

          <div className="mt-4">
            <SonarViewer
              detections={sonarBoxes}
              selectedId={selectedId}
              onSelect={selectDetection}
              heatmap={heatmap}
            />
          </div>

          <div className="mt-5">
            <ConfidenceControls
              threshold={threshold}
              onThreshold={setThreshold}
              heatmap={heatmap}
              onHeatmap={setHeatmap}
              counts={counts}
            />
          </div>
        </section>

        <section className="panel p-4 sm:p-5">
          <h2 className="mb-4 text-base font-medium">
            <span className="text-muted-foreground">2.</span>{" "}
            <span className="text-primary">Map &amp; Report</span>
          </h2>

          <MapPanel
            detections={visibleDetections}
            threshold={threshold}
            heatmap={heatmap}
            selectedId={selectedId}
            onSelect={selectDetection}
            showRoutes={settings.showSurveyRoutes}
          />

          <div className="mt-5">
            <DetectionTable
              detections={visibleDetections}
              selectedId={selectedId}
              onSelect={selectDetection}
            />
          </div>

          <div className="mt-5">
            <ReportDownload detections={visibleDetections} />
          </div>
        </section>
      </div>

      <DetectionDetailDrawer
        detection={selected}
        onOpenChange={(open) => !open && selectDetection(null)}
      />
    </AppShell>
  );
}
