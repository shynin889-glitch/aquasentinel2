import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { useApp, type Settings } from "@/lib/app-store";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AquaSentinel" },
      {
        name: "description",
        content:
          "Configure detection thresholds, map behaviour, notifications and profile details in AquaSentinel.",
      },
      { property: "og:title", content: "Settings — AquaSentinel" },
      {
        property: "og:description",
        content: "Tune the AquaSentinel detection pipeline and workspace preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel p-5">
      <h2 className="text-sm font-medium text-primary">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
      <span className="min-w-0">
        <span className="block text-sm">{label}</span>
        {description && (
          <span className="block text-xs text-muted-foreground">{description}</span>
        )}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} className="data-[state=checked]:bg-primary" />
    </label>
  );
}

const inputCls =
  "mt-1 h-9 w-full rounded-lg border border-border bg-surface-2/60 px-3 text-sm focus:border-primary/50 focus:outline-none";

function SettingsPage() {
  const { settings, updateSettings, setThreshold, setHeatmap } = useApp();
  const set = (patch: Partial<Settings>) => updateSettings(patch);

  return (
    <AppShell title="Settings" subtitle="Configure detection, map and notification preferences.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Profile">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
              AS
            </span>
            <button
              type="button"
              onClick={() => toast.info("Avatar upload is not available in this demo.")}
              className="rounded-lg border border-border px-3 py-1.5 text-xs hover:border-primary/40 hover:text-primary"
            >
              Change avatar
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs text-muted-foreground">
              Name
              <input
                className={inputCls}
                value={settings.name}
                onChange={(e) => set({ name: e.target.value })}
              />
            </label>
            <label className="block text-xs text-muted-foreground">
              Role
              <input
                className={inputCls}
                value={settings.role}
                onChange={(e) => set({ role: e.target.value })}
              />
            </label>
          </div>
          <label className="block text-xs text-muted-foreground">
            Email
            <input
              type="email"
              className={inputCls}
              value={settings.email}
              onChange={(e) => set({ email: e.target.value })}
            />
          </label>
        </Section>

        <Section title="Detection Settings">
          <div>
            <p className="flex justify-between text-sm">
              Default confidence threshold
              <span className="text-primary">{settings.defaultThreshold}%</span>
            </p>
            <div className="mt-3">
              <Slider
                value={[settings.defaultThreshold]}
                min={30}
                max={100}
                step={1}
                aria-label="Default confidence threshold"
                onValueChange={([v]) => {
                  const next = v ?? 70;
                  set({ defaultThreshold: next });
                  setThreshold(next);
                }}
              />
            </div>
          </div>
          <ToggleRow
            label="Auto-process uploads"
            description="Start the AI pipeline as soon as a scan is uploaded."
            checked={settings.autoProcess}
            onChange={(v) => set({ autoProcess: v })}
          />
          <ToggleRow
            label="Show heatmap by default"
            checked={settings.heatmapByDefault}
            onChange={(v) => {
              set({ heatmapByDefault: v });
              setHeatmap(v);
            }}
          />
          <ToggleRow
            label="Enable sound notifications"
            checked={settings.soundNotifications}
            onChange={(v) => set({ soundNotifications: v })}
          />
        </Section>

        <Section title="Map Settings">
          <label className="block text-xs text-muted-foreground">
            Map style
            <select
              className={inputCls}
              value={settings.mapStyle}
              onChange={(e) => set({ mapStyle: e.target.value as Settings["mapStyle"] })}
            >
              <option>Deep Ocean</option>
              <option>Bathymetric</option>
              <option>Satellite Dark</option>
            </select>
          </label>
          <div>
            <p className="flex justify-between text-sm">
              Default zoom<span className="text-primary">{settings.defaultZoom}</span>
            </p>
            <div className="mt-3">
              <Slider
                value={[settings.defaultZoom]}
                min={5}
                max={18}
                step={1}
                aria-label="Default map zoom"
                onValueChange={([v]) => set({ defaultZoom: v ?? 11 })}
              />
            </div>
          </div>
          <ToggleRow
            label="Show survey routes"
            checked={settings.showSurveyRoutes}
            onChange={(v) => set({ showSurveyRoutes: v })}
          />
          <ToggleRow
            label="Show low-confidence detections"
            checked={settings.showLowConfidence}
            onChange={(v) => set({ showLowConfidence: v })}
          />
        </Section>

        <Section title="Notifications">
          <ToggleRow
            label="Processing completed"
            checked={settings.notifyProcessing}
            onChange={(v) => set({ notifyProcessing: v })}
          />
          <ToggleRow
            label="High-confidence detection"
            checked={settings.notifyHighConfidence}
            onChange={(v) => set({ notifyHighConfidence: v })}
          />
          <ToggleRow
            label="Report generated"
            checked={settings.notifyReport}
            onChange={(v) => set({ notifyReport: v })}
          />
          <ToggleRow
            label="System alerts"
            checked={settings.notifySystem}
            onChange={(v) => set({ notifySystem: v })}
          />
        </Section>

        <Section title="Appearance">
          <p className="text-sm text-muted-foreground">
            AquaSentinel uses a dark marine theme optimised for low-light survey vessels. Light mode
            is intentionally unavailable.
          </p>
          <ToggleRow
            label="Compact mode"
            description="Reduce padding across tables and panels."
            checked={settings.compactMode}
            onChange={(v) => set({ compactMode: v })}
          />
        </Section>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => toast.success("Preferences saved for this session.")}
          className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
        >
          Save preferences
        </button>
      </div>
    </AppShell>
  );
}
