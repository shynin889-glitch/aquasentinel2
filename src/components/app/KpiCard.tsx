import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  title,
  value,
  change,
  icon: Icon,
  tone = "primary",
}: {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  tone?: "primary" | "warning";
}) {
  return (
    <article className="panel glow-card grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 p-5">
      <span
        className={cn(
          "grid h-14 w-14 shrink-0 place-items-center rounded-full ring-1",
          tone === "primary"
            ? "bg-primary/10 text-primary ring-primary/30"
            : "bg-[color:var(--medium)]/10 text-[color:var(--medium)] ring-[color:var(--medium)]/30",
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">{title}</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
        <p
          className={cn(
            "mt-1 flex items-center gap-1 text-xs",
            tone === "primary" ? "text-success" : "text-[color:var(--medium)]",
          )}
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
          {change}
        </p>
      </div>
    </article>
  );
}
