import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { getAuthUserId } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getAuthUserId();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex h-screen bg-[#111111] text-[#f5f0eb] overflow-hidden font-sans selection:bg-zinc-800">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}

