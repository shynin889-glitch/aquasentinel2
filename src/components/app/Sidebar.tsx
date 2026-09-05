import { Link, useRouterState } from "@tanstack/react-router";
import { Clock, FileText, LayoutGrid, Radar, Settings, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/upload", label: "Upload Scan", icon: UploadCloud },
  { to: "/detections", label: "Detection History", icon: Clock },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-start gap-3 px-5 py-5">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/30">
          <Radar className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold tracking-tight text-foreground">
            AquaSentinel
          </p>
          <p className="text-[11px] leading-tight text-muted-foreground">
            AI-Powered Marine
            <br />
            Debris Detection
          </p>
        </div>
      </div>

      <nav aria-label="Main navigation" className="mt-2 flex-1 space-y-1 px-2">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-primary/10 font-medium text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              {active && (
                <span className="absolute inset-y-1 left-0 w-[3px] rounded-r bg-primary shadow-[0_0_12px_var(--primary)]" />
              )}
              <Icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-primary")} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="rounded-xl border border-sidebar-border bg-surface/60 p-4">
          <p className="text-xs font-medium tracking-wide text-primary">System Status</p>
          <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative grid h-2 w-2 place-items-center">
              <span className="absolute h-2 w-2 rounded-full bg-success/70 pulse-ring text-success" />
              <span className="h-2 w-2 rounded-full bg-success" />
            </span>
            All Systems Operational
          </p>
          <div className="mt-3 space-y-0.5 text-[11px] text-muted-foreground/80">
            <p>Version 1.2.3</p>
            <p>© 2025 AquaSentinel</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppSidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-sidebar-border lg:block">
        <SidebarBody />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <button
          tabIndex={mobileOpen ? 0 : -1}
          aria-label="Close navigation"
          onClick={onClose}
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[264px] border-r border-sidebar-border transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="absolute right-2 top-4 rounded-md p-2 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <SidebarBody onNavigate={onClose} />
        </div>
      </div>
    </>
  );
}
