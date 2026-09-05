import { ChevronDown, FileDown, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportCSV, exportJSON, exportPDF } from "@/lib/export-report";
import type { Detection } from "@/lib/mock-data";
import { useApp } from "@/lib/app-store";

export function ReportDownload({
  detections,
  survey = "Brahmaputra Delta — Survey 042",
  scanId = "SCAN-042",
  compact = false,
}: {
  detections: Detection[];
  survey?: string;
  scanId?: string;
  compact?: boolean;
}) {
  const { threshold, pushNotification, addReport } = useApp();
  const meta = { survey, scanId, threshold };

  const record = (fileType: "PDF" | "CSV" | "JSON") => {
    addReport({
      id: `RPT-${Math.floor(2100 + Math.random() * 800)}`,
      survey,
      scanId,
      generated: new Date().toISOString(),
      detections: detections.length,
      avgConfidence: detections.length
        ? Number(
            (detections.reduce((s, d) => s + d.confidence, 0) / detections.length).toFixed(1),
          )
        : 0,
      fileType,
      status: "Ready",
    });
    pushNotification({
      title: "Report generated",
      body: `${fileType} export for ${scanId} (${detections.length} detections).`,
      tone: "info",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={
            compact
              ? "inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              : "flex w-full items-center justify-center gap-3 rounded-xl border border-primary/40 bg-primary/[0.08] px-4 py-4 text-base font-medium text-primary transition-all hover:bg-primary/15 hover:shadow-[0_0_28px_-8px_var(--primary)]"
          }
        >
          <FileDown className="h-5 w-5" />
          Download Report (PDF / CSV)
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => {
            const ok = exportPDF(detections, meta);
            record("PDF");
            toast.success(
              ok ? "PDF report opened — use your print dialog to save." : "PDF report downloaded.",
            );
          }}
        >
          <FileText className="mr-2 h-4 w-4" /> Download PDF Report
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            exportCSV(detections, meta);
            record("CSV");
            toast.success(`CSV exported — ${detections.length} records.`);
          }}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" /> Download CSV Data
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            exportJSON(detections, meta);
            record("JSON");
            toast.success("JSON export downloaded.");
          }}
        >
          <FileJson className="mr-2 h-4 w-4" /> Export JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
