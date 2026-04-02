import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/dashboard/Topbar";
import PlannerClient from "./PlannerClient";

export default async function PlannerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: history }] = await Promise.all([
    supabase.from("profiles").select("background").eq("id", user!.id).single(),
    supabase
      .from("weekly_plans")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <>
      <TopBar title="Weekly Planner" subtitle="Your personalized job search schedule" />
      <PlannerClient savedBackground={profile?.background ?? ""} history={history ?? []} />
    </>
  );
}