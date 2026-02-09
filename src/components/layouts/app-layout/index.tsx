import * as React from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { BottomNavProvider } from "../bottom-nav/use-bottom-nav-context";
import { MobileBottomNav } from "../mobile-bottom-nav";
import { AppSidebar } from "../sidebar";
import { TopBar } from "../top-bar";

interface IAppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: Readonly<IAppLayoutProps>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <BottomNavProvider>
        <SidebarInset className="flex h-screen flex-col overflow-hidden">
          <TopBar className="shrink-0" />
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
        <MobileBottomNav />
      </BottomNavProvider>
    </SidebarProvider>
  );
}
