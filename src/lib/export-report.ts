import { formatCoords, formatUTC, type Detection } from "./mock-data";

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface ReportMeta {
  survey: string;
  scanId: string;
  threshold: number;
}

export function stats(detections: Detection[]) {
  const high = detections.filter((d) => d.severity === "high").length;
  const medium = detections.filter((d) => d.severity === "medium").length;
  const low = detections.filter((d) => d.severity === "low").length;
  const avg = detections.length
    ? detections.reduce((s, d) => s + d.confidence, 0) / detections.length
    : 0;
  return { high, medium, low, avg: Number(avg.toFixed(1)), total: detections.length };
}

export function exportCSV(detections: Detection[], meta: ReportMeta) {
  const header = [
    "id",
    "scan_id",
    "timestamp_utc",
    "latitude",
    "longitude",
    "confidence",
    "type",
    "severity",
    "status",
  ].join(",");
  const rows = detections.map((d) =>
    [
      d.id,
      d.scanId,
      d.timestamp,
      d.latitude,
      d.longitude,
      d.confidence,
      `"${d.type}"`,
      d.severity,
      d.status,
    ].join(","),
  );
  download(`aquasentinel_${meta.scanId}_detections.csv`, [header, ...rows].join("\n"), "text/csv");
}

export function exportJSON(detections: Detection[], meta: ReportMeta) {
  const s = stats(detections);
  const payload = {
    product: "AquaSentinel",
    survey: meta.survey,
    scanId: meta.scanId,
    generatedAt: new Date().toISOString(),
    confidenceThreshold: meta.threshold,
    summary: s,
    detections,
  };
  download(
    `aquasentinel_${meta.scanId}_report.json`,
    JSON.stringify(payload, null, 2),
    "application/json",
  );
}

export function exportPDF(detections: Detection[], meta: ReportMeta) {
  const s = stats(detections);
  const rows = detections
    .slice(0, 120)
    .map(
      (d) => `<tr>
      <td>${d.id}</td><td>${formatUTC(d.timestamp)}</td>
      <td>${formatCoords(d.latitude, d.longitude)}</td>
      <td class="c">${d.confidence}%</td><td>${d.type}</td><td>${d.status}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html><head><meta charset="utf-8"/>
<title>AquaSentinel Report — ${meta.scanId}</title>
<style>
  *{box-sizing:border-box} body{font-family:Inter,Arial,sans-serif;color:#0f172a;margin:32px;}
  h1{font-size:22px;margin:0;letter-spacing:-0.3px}
  .brand{display:flex;align-items:center;gap:10px;border-bottom:2px solid #0EA5B7;padding-bottom:12px}
  .dot{width:26px;height:26px;border-radius:50%;background:#0EA5B7}
  .sub{color:#475569;font-size:12px;margin-top:2px}
  h2{font-size:14px;margin:24px 0 8px;text-transform:uppercase;letter-spacing:1px;color:#0EA5B7}
  table{width:100%;border-collapse:collapse;font-size:11px}
  th,td{border:1px solid #cbd5e1;padding:5px 7px;text-align:left}
  th{background:#f1f5f9}
  td.c{font-weight:600}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
  .kpi{border:1px solid #cbd5e1;border-radius:8px;padding:10px}
  .kpi b{display:block;font-size:18px}
  .kpi span{font-size:10px;color:#475569;text-transform:uppercase;letter-spacing:1px}
  @media print{ body{margin:14mm} }
</style></head><body>
<div class="brand"><div class="dot"></div><div><h1>AquaSentinel</h1>
<div class="sub">AI-Powered Marine Debris Detection — Survey Report</div></div></div>
<h2>Survey information</h2>
<table><tr><th>Survey</th><td>${meta.survey}</td><th>Scan ID</th><td>${meta.scanId}</td></tr>
<tr><th>Confidence threshold</th><td>${meta.threshold}%</td><th>Report generated</th><td>${new Date().toUTCString()}</td></tr></table>
<h2>Summary statistics</h2>
<div class="grid">
  <div class="kpi"><span>Detections</span><b>${s.total}</b></div>
  <div class="kpi"><span>Avg confidence</span><b>${s.avg}%</b></div>
  <div class="kpi"><span>High / Medium</span><b>${s.high} / ${s.medium}</b></div>
  <div class="kpi"><span>Low</span><b>${s.low}</b></div>
</div>
<h2>Confidence distribution</h2>
<table><tr><th>Band</th><th>Count</th><th>Share</th></tr>
<tr><td>High (&ge; 80%)</td><td>${s.high}</td><td>${((s.high / (s.total || 1)) * 100).toFixed(1)}%</td></tr>
<tr><td>Medium (50–79%)</td><td>${s.medium}</td><td>${((s.medium / (s.total || 1)) * 100).toFixed(1)}%</td></tr>
<tr><td>Low (&lt; 50%)</td><td>${s.low}</td><td>${((s.low / (s.total || 1)) * 100).toFixed(1)}%</td></tr></table>
<h2>Detection records${detections.length > 120 ? " (first 120)" : ""}</h2>
<table><tr><th>ID</th><th>Timestamp (UTC)</th><th>Coordinates</th><th>Confidence</th><th>Type</th><th>Status</th></tr>${rows}</table>
<p class="sub">© 2025 AquaSentinel · Generated automatically from AI detection output.</p>
<script>window.onload=function(){setTimeout(function(){window.print()},400)}</script>
</body></html>`;

  const w = window.open("", "_blank", "width=920,height=900");
  if (!w) {
    download(`aquasentinel_${meta.scanId}_report.html`, html, "text/html");
    return false;
  }
  w.document.write(html);
  w.document.close();
  return true;
}
