import { useState, type ReactNode } from "react";
import { AppSidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";

export function AppShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-[248px]">
        <TopHeader
          title={title}
          subtitle={subtitle}
          onMenu={() => setMobileOpen(true)}
          actions={actions}
        />
        <main className="px-4 pb-10 pt-4 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
