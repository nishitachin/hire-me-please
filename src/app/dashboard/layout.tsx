import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // middleware handles this too, but double-checking server-side in case someone bypasses it
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // shouldn't happen normally, but just in case
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-surface-tertiary)" }}>
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}