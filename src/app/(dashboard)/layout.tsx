import { redirect } from "next/navigation";
import { getAuthUserId } from "@/lib/auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getAuthUserId();
  if (!userId) redirect("/sign-in");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-w-0 bg-background text-foreground font-sans">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

