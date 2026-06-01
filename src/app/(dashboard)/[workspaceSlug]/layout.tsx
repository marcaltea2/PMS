// src/app/(dashboard)/layout.tsx
import { type Metadata } from "next";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/shared/app-sidebar";
import { Topbar } from "~/components/shared/topbar";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Dashboard | PMS",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/login");

  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <SidebarInset>
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
