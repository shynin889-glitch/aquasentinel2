import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  DETECTIONS,
  REPORTS,
  SCANS,
  type Detection,
  type ReportRecord,
  type Scan,
} from "./mock-data";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  tone: "info" | "success" | "warning";
}

export interface Settings {
  name: string;
  role: string;
  email: string;
  defaultThreshold: number;
  autoProcess: boolean;
  heatmapByDefault: boolean;
  soundNotifications: boolean;
  mapStyle: "Deep Ocean" | "Bathymetric" | "Satellite Dark";
  defaultZoom: number;
  showSurveyRoutes: boolean;
  showLowConfidence: boolean;
  notifyProcessing: boolean;
  notifyHighConfidence: boolean;
  notifyReport: boolean;
  notifySystem: boolean;
  compactMode: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  name: "Dr. Aditi Sharma",
  role: "Marine Researcher",
  email: "aditi.sharma@aquasentinel.org",
  defaultThreshold: 70,
  autoProcess: true,
  heatmapByDefault: false,
  soundNotifications: false,
  mapStyle: "Deep Ocean",
  defaultZoom: 11,
  showSurveyRoutes: true,
  showLowConfidence: true,
  notifyProcessing: true,
  notifyHighConfidence: true,
  notifyReport: true,
  notifySystem: true,
  compactMode: false,
};

interface Ctx {
  detections: Detection[];
  scans: Scan[];
  reports: ReportRecord[];
  threshold: number;
  setThreshold: (n: number) => void;
  heatmap: boolean;
  setHeatmap: (b: boolean) => void;
  selectedId: string | null;
  selectDetection: (id: string | null) => void;
  visibleDetections: Detection[];
  counts: { total: number; high: number; medium: number; low: number };
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  notifications: AppNotification[];
  pushNotification: (n: Omit<AppNotification, "id" | "time" | "read">) => void;
  markAllRead: () => void;
  addScan: (scan: Scan) => void;
  addReport: (r: ReportRecord) => void;
  removeReport: (id: string) => void;
  globalSearch: string;
  setGlobalSearch: (s: string) => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [threshold, setThreshold] = useState(70);
  const [heatmap, setHeatmap] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scans, setScans] = useState<Scan[]>(SCANS);
  const [reports, setReports] = useState<ReportRecord[]>(REPORTS);
  const [globalSearch, setGlobalSearch] = useState("");
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "n1",
      title: "High-confidence detection",
      body: "D-0216 — Fishing Net at 96% confidence in Survey 042.",
      time: "2 min ago",
      read: false,
      tone: "warning",
    },
    {
      id: "n2",
      title: "Processing complete",
      body: "survey_042.xtf analysed — 216 detections found.",
      time: "18 min ago",
      read: false,
      tone: "success",
    },
    {
      id: "n3",
      title: "Report generated",
      body: "RPT-2041 is ready to download.",
      time: "1 hr ago",
      read: true,
      tone: "info",
    },
  ]);

  const visibleDetections = useMemo(
    () => DETECTIONS.filter((d) => d.confidence >= threshold - 40 && d.confidence >= 0),
    [threshold],
  );

  const filtered = useMemo(() => DETECTIONS.filter((d) => d.confidence >= threshold), [threshold]);

  const counts = useMemo(
    () => ({
      total: filtered.length,
      high: filtered.filter((d) => d.severity === "high").length,
      medium: filtered.filter((d) => d.severity === "medium").length,
      low: filtered.filter((d) => d.severity === "low").length,
    }),
    [filtered],
  );

  const pushNotification = useCallback((n: Omit<AppNotification, "id" | "time" | "read">) => {
    setNotifications((prev) => [
      { ...n, id: `n${Date.now()}`, time: "just now", read: false },
      ...prev,
    ]);
  }, []);

  const value: Ctx = {
    detections: DETECTIONS,
    scans,
    reports,
    threshold,
    setThreshold,
    heatmap,
    setHeatmap,
    selectedId,
    selectDetection: setSelectedId,
    visibleDetections: filtered,
    counts,
    settings,
    updateSettings: (patch) => setSettings((s) => ({ ...s, ...patch })),
    notifications,
    pushNotification,
    markAllRead: () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
    addScan: (scan) => setScans((prev) => [scan, ...prev]),
    addReport: (r) => setReports((prev) => [r, ...prev]),
    removeReport: (id) => setReports((prev) => prev.filter((r) => r.id !== id)),
    globalSearch,
    setGlobalSearch,
  };

  void visibleDetections;

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppStoreProvider");
  return ctx;
}
