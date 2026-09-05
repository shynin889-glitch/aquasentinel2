export type DebrisType =
  | "Fishing Net"
  | "Rope"
  | "Plastic Container"
  | "Metal Object"
  | "Wood Fragment"
  | "Tire"
  | "Unknown";

export type Severity = "high" | "medium" | "low";
export type DetectionStatus = "Confirmed" | "Pending Review" | "Dismissed";

export interface BoundingBox {
  /** percentages of the sonar frame */
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Detection {
  id: string;
  scanId: string;
  timestamp: string; // ISO
  latitude: number;
  longitude: number;
  confidence: number; // 0-100
  type: DebrisType;
  severity: Severity;
  boundingBox: BoundingBox;
  status: DetectionStatus;
  note: string;
}

export interface Scan {
  id: string;
  filename: string;
  date: string; // ISO
  location: string;
  region: string;
  detections: number;
  avgConfidence: number;
  status: "Completed" | "Processing" | "Failed";
}

export interface ReportRecord {
  id: string;
  survey: string;
  scanId: string;
  generated: string;
  detections: number;
  avgConfidence: number;
  fileType: "PDF" | "CSV" | "JSON";
  status: "Ready" | "Generating" | "Archived";
}

export const DEBRIS_TYPES: DebrisType[] = [
  "Fishing Net",
  "Rope",
  "Plastic Container",
  "Metal Object",
  "Wood Fragment",
  "Tire",
  "Unknown",
];

export function severityOf(confidence: number): Severity {
  if (confidence >= 80) return "high";
  if (confidence >= 50) return "medium";
  return "low";
}

export const SEVERITY_META: Record<Severity, { label: string; color: string; text: string }> = {
  high: { label: "High", color: "var(--high)", text: "text-[color:var(--high)]" },
  medium: { label: "Medium", color: "var(--medium)", text: "text-[color:var(--medium)]" },
  low: { label: "Low", color: "var(--low)", text: "text-[color:var(--low)]" },
};

/** deterministic pseudo random so SSR and client agree */
function mulberry(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BASE_TIME = Date.parse("2025-05-24T10:42:31Z");

const NOTES: Record<DebrisType, string> = {
  "Fishing Net": "Strong linear acoustic returns with irregular mesh shadowing, consistent with a drifting gill net.",
  Rope: "Elongated thin return with continuous shadow tail — typical of synthetic mooring rope.",
  "Plastic Container": "Compact high-reflectivity blob with sharp shadow edge, matches rigid plastic drum profile.",
  "Metal Object": "Very high backscatter and hard shadow boundary indicating a dense metallic object.",
  "Wood Fragment": "Low-contrast elongated return; timber debris signature with weak shadow.",
  Tire: "Toroidal return with circular shadow void, matching vehicle tire geometry.",
  Unknown: "Ambiguous return; morphology does not match trained debris classes with sufficient margin.",
};

const FIXED: Array<[string, number, DebrisType, number, number]> = [
  ["D-0216", 96, "Fishing Net", 0, 26.123456],
  ["D-0215", 92, "Metal Object", 21, 26.12321],
  ["D-0214", 81, "Plastic Container", 46, 26.12298],
  ["D-0213", 76, "Rope", 71, 26.12265],
  ["D-0212", 61, "Unknown", 96, 26.12231],
  ["D-0211", 43, "Wood Fragment", 121, 26.12198],
];

/** the five bounding boxes visible in the live sonar view */
const SONAR_BOXES: BoundingBox[] = [
  { x: 46, y: 8, w: 24, h: 18 },
  { x: 16, y: 20, w: 20, h: 16 },
  { x: 60, y: 58, w: 22, h: 20 },
  { x: 8, y: 46, w: 18, h: 12 },
  { x: 22, y: 74, w: 20, h: 18 },
];

function buildDetections(): Detection[] {
  const rand = mulberry(4242);
  const out: Detection[] = [];
  for (let i = 0; i < 216; i++) {
    const n = 216 - i;
    const fixed = FIXED[i];
    const conf = fixed ? fixed[1] : Math.round(35 + rand() * 64);
    const type = fixed ? fixed[2] : DEBRIS_TYPES[Math.floor(rand() * DEBRIS_TYPES.length)];
    const secondsBack = fixed ? fixed[3] : 121 + (i - 5) * 27;
    const lat = 26.123456 - i * 0.00021 - rand() * 0.00004;
    const lng = 93.456789 - i * 0.00019 - rand() * 0.00004;
    out.push({
      id: fixed ? fixed[0] : `D-${String(n).padStart(4, "0")}`,
      scanId: "SCAN-042",
      timestamp: new Date(BASE_TIME - secondsBack * 1000).toISOString(),
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
      confidence: conf,
      type,
      severity: severityOf(conf),
      boundingBox:
        SONAR_BOXES[i] ??
        ({
          x: 8 + rand() * 70,
          y: 6 + rand() * 80,
          w: 12 + rand() * 12,
          h: 10 + rand() * 12,
        } as BoundingBox),
      status: conf >= 80 ? "Confirmed" : conf >= 50 ? "Pending Review" : "Dismissed",
      note: NOTES[type],
    });
  }
  return out;
}

export const DETECTIONS: Detection[] = buildDetections();

/** the 5 detections rendered as boxes on the live sonar viewer */
export const SONAR_DETECTIONS: Detection[] = [
  { ...DETECTIONS[0], confidence: 87, severity: "high" },
  { ...DETECTIONS[1], confidence: 96, severity: "high" },
  { ...DETECTIONS[2], confidence: 61, severity: "medium" },
  { ...DETECTIONS[3], confidence: 76, severity: "medium" },
  { ...DETECTIONS[4], confidence: 79, severity: "medium" },
].map((d, i) => ({ ...d, boundingBox: SONAR_BOXES[i] }));

export const SCANS: Scan[] = [
  {
    id: "SCAN-042",
    filename: "survey_042.xtf",
    date: "2025-05-24T10:42:00Z",
    location: "26.12°N, 93.45°E",
    region: "Brahmaputra Delta",
    detections: 216,
    avgConfidence: 78.6,
    status: "Completed",
  },
  {
    id: "SCAN-041",
    filename: "survey_041.xtf",
    date: "2025-05-23T08:12:00Z",
    location: "26.09°N, 93.41°E",
    region: "Brahmaputra Delta",
    detections: 184,
    avgConfidence: 74.2,
    status: "Completed",
  },
  {
    id: "SCAN-040",
    filename: "coastal_ridge_03.jpg",
    date: "2025-05-22T16:30:00Z",
    location: "15.42°N, 73.80°E",
    region: "Goa Shelf",
    detections: 97,
    avgConfidence: 69.8,
    status: "Completed",
  },
  {
    id: "SCAN-039",
    filename: "harbour_sweep_11.xtf",
    date: "2025-05-21T11:05:00Z",
    location: "13.08°N, 80.29°E",
    region: "Chennai Harbour",
    detections: 312,
    avgConfidence: 82.4,
    status: "Completed",
  },
  {
    id: "SCAN-038",
    filename: "reef_transect_07.png",
    date: "2025-05-20T09:44:00Z",
    location: "11.66°N, 92.73°E",
    region: "Andaman Reef",
    detections: 58,
    avgConfidence: 63.1,
    status: "Completed",
  },
  {
    id: "SCAN-037",
    filename: "survey_037.xtf",
    date: "2025-05-19T14:20:00Z",
    location: "22.57°N, 88.36°E",
    region: "Hooghly Estuary",
    detections: 241,
    avgConfidence: 80.9,
    status: "Completed",
  },
  {
    id: "SCAN-036",
    filename: "deep_pass_02.xtf",
    date: "2025-05-18T07:55:00Z",
    location: "08.09°N, 77.54°E",
    region: "Gulf of Mannar",
    detections: 133,
    avgConfidence: 71.5,
    status: "Processing",
  },
  {
    id: "SCAN-035",
    filename: "survey_035.xtf",
    date: "2025-05-17T17:31:00Z",
    location: "19.08°N, 72.88°E",
    region: "Mumbai Coast",
    detections: 0,
    avgConfidence: 0,
    status: "Failed",
  },
];

export const REPORTS: ReportRecord[] = [
  {
    id: "RPT-2041",
    survey: "Brahmaputra Delta — Survey 042",
    scanId: "SCAN-042",
    generated: "2025-05-24T11:02:00Z",
    detections: 216,
    avgConfidence: 78.6,
    fileType: "PDF",
    status: "Ready",
  },
  {
    id: "RPT-2040",
    survey: "Brahmaputra Delta — Survey 041",
    scanId: "SCAN-041",
    generated: "2025-05-23T09:40:00Z",
    detections: 184,
    avgConfidence: 74.2,
    fileType: "CSV",
    status: "Ready",
  },
  {
    id: "RPT-2039",
    survey: "Chennai Harbour Sweep 11",
    scanId: "SCAN-039",
    generated: "2025-05-21T12:15:00Z",
    detections: 312,
    avgConfidence: 82.4,
    fileType: "PDF",
    status: "Ready",
  },
  {
    id: "RPT-2038",
    survey: "Andaman Reef Transect 07",
    scanId: "SCAN-038",
    generated: "2025-05-20T10:26:00Z",
    detections: 58,
    avgConfidence: 63.1,
    fileType: "JSON",
    status: "Archived",
  },
  {
    id: "RPT-2037",
    survey: "Hooghly Estuary — Survey 037",
    scanId: "SCAN-037",
    generated: "2025-05-19T15:10:00Z",
    detections: 241,
    avgConfidence: 80.9,
    fileType: "PDF",
    status: "Ready",
  },
];

export const KPI = {
  totalScans: 1247,
  debrisToday: 216,
  avgConfidence: 78.6,
};

export const DETECTIONS_OVER_TIME = [
  { day: "May 18", detections: 133, scans: 4 },
  { day: "May 19", detections: 241, scans: 6 },
  { day: "May 20", detections: 58, scans: 3 },
  { day: "May 21", detections: 312, scans: 7 },
  { day: "May 22", detections: 97, scans: 5 },
  { day: "May 23", detections: 184, scans: 6 },
  { day: "May 24", detections: 216, scans: 8 },
];

export function formatUTC(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const time = d.toLocaleTimeString("en-GB", { timeZone: "UTC", hour12: false });
  return `${date} ${time}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatCoords(lat: number, lng: number) {
  return `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`;
}

/** simulated AI run — produces fresh randomized but realistic detections */
export function generateDetections(scanId: string, count: number): Detection[] {
  const rand = mulberry(Date.now() % 100000);
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const conf = Math.round(35 + rand() * 64);
    const type = DEBRIS_TYPES[Math.floor(rand() * DEBRIS_TYPES.length)];
    return {
      id: `D-${String(count - i).padStart(4, "0")}`,
      scanId,
      timestamp: new Date(now - i * 24000).toISOString(),
      latitude: Number((26.2 - i * 0.0002 - rand() * 0.0001).toFixed(6)),
      longitude: Number((93.5 - i * 0.00018 - rand() * 0.0001).toFixed(6)),
      confidence: conf,
      type,
      severity: severityOf(conf),
      boundingBox: { x: 6 + rand() * 70, y: 6 + rand() * 78, w: 12 + rand() * 12, h: 10 + rand() * 12 },
      status: conf >= 80 ? "Confirmed" : conf >= 50 ? "Pending Review" : "Dismissed",
      note: NOTES[type],
    } as Detection;
  });
}
