import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/dashboard/Topbar";
import NetworkingClient from "./NetworkingClient";

export default async function NetworkingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: history }] = await Promise.all([
    supabase.from("profiles").select("background").eq("id", user!.id).single(),
    supabase
      .from("networking_results")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <>
      <TopBar title="Networking Assistant" subtitle="Get personalized outreach messages for any role" />
      <NetworkingClient savedBackground={profile?.background ?? ""} history={history ?? []} />
    </>
  );
}