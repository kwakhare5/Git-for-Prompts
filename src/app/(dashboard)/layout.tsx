import { redirect } from "next/navigation";
import { getAuthUserId } from "@/lib/auth";
import { db } from "@/db";
import { prompts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { TopHeaderBar } from "@/components/layout/top-header-bar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getAuthUserId();
  if (!userId) redirect("/sign-in");

  const userPrompts = await db
    .select({
      id: prompts.id,
      name: prompts.name,
    })
    .from(prompts)
    .where(eq(prompts.ownerId, userId))
    .orderBy(desc(prompts.updatedAt));

  return (
    <div className="min-h-screen bg-bg-page text-zinc-100 font-sans antialiased flex selection:bg-blue-500/20 selection:text-blue-200">
      {/* Persistent Left Application Sidebar */}
      <DashboardSidebar prompts={userPrompts} isDemo={false} />

      {/* Main Full-Bleed Scrollable Viewport Canvas with Sticky Top Bar */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <TopHeaderBar />
        <main className="flex-1 min-w-0 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
