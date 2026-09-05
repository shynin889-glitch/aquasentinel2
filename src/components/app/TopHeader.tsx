import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, ChevronDown, LogOut, Menu, Search, Settings2, User } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-store";
import { formatCoords, formatUTC } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function TopHeader({
  title,
  subtitle,
  onMenu,
  actions,
}: {
  title: string;
  subtitle: string;
  onMenu: () => void;
  actions?: ReactNode;
}) {
  const { detections, scans, settings, notifications, markAllRead, selectDetection } = useApp();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { detections: [], scans: [] };
    return {
      detections: detections
        .filter(
          (d) =>
            d.id.toLowerCase().includes(q) ||
            d.type.toLowerCase().includes(q) ||
            formatCoords(d.latitude, d.longitude).toLowerCase().includes(q),
        )
        .slice(0, 5),
      scans: scans
        .filter(
          (s) =>
            s.id.toLowerCase().includes(q) ||
            s.filename.toLowerCase().includes(q) ||
            s.region.toLowerCase().includes(q),
        )
        .slice(0, 4),
    };
  }, [query, detections, scans]);

  const hasResults = results.detections.length + results.scans.length > 0;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMenu}
            aria-label="Open navigation"
            className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
            <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden xl:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              aria-label="Search scans, locations or detections"
              placeholder="Search scans, locations, or detections..."
              className="h-10 w-[320px] rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            {open && query.trim() && (
              <div className="absolute right-0 top-12 w-[380px] overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
                {!hasResults && (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No matches for “{query}”.
                  </p>
                )}
                {results.scans.length > 0 && (
                  <div className="border-b border-border p-2">
                    <p className="px-2 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                      Scans
                    </p>
                    {results.scans.map((s) => (
                      <Link
                        key={s.id}
                        to="/detections"
                        className="block rounded-md px-2 py-2 text-sm hover:bg-accent"
                      >
                        <span className="font-medium">{s.id}</span>{" "}
                        <span className="text-muted-foreground">
                          {s.filename} · {s.region}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
                {results.detections.length > 0 && (
                  <div className="p-2">
                    <p className="px-2 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                      Detections
                    </p>
                    {results.detections.map((d) => (
                      <Link
                        key={d.id}
                        to="/dashboard"
                        onClick={() => selectDetection(d.id)}
                        className="block rounded-md px-2 py-2 text-sm hover:bg-accent"
                      >
                        <span className="font-medium">{d.id}</span>{" "}
                        <span className="text-muted-foreground">
                          {d.type} · {d.confidence}% · {formatUTC(d.timestamp)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {actions}

          <Popover>
            <PopoverTrigger asChild>
              <button
                aria-label={`Notifications, ${unread} unread`}
                className="relative rounded-lg border border-border bg-surface p-2.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[320px] p-0">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-medium">Notifications</p>
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary hover:underline"
                  type="button"
                >
                  Mark all read
                </button>
              </div>
              <ul className="max-h-[300px] overflow-y-auto scan-scroll">
                {notifications.map((n) => (
                  <li key={n.id} className="border-b border-border/60 px-4 py-3 last:border-0">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          n.tone === "warning" && "bg-[color:var(--medium)]",
                          n.tone === "success" && "bg-success",
                          n.tone === "info" && "bg-primary",
                        )}
                      />
                      {n.title}
                      {!n.read && <span className="ml-auto text-[10px] text-primary">new</span>}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground/70">{n.time}</p>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2 py-1.5 text-left transition-colors hover:border-primary/40">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  AS
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span className="block truncate text-sm font-medium leading-tight">
                    {settings.name}
                  </span>
                  <span className="block truncate text-[11px] leading-tight text-muted-foreground">
                    {settings.role}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{settings.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings2 className="mr-2 h-4 w-4" /> Preferences
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.info("Signed out of this demo session.")}>
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
