import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/dashboard/Topbar";
import AnalyzerClient from "./AnalyzerClient";

export default async function AnalyzerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: history }] = await Promise.all([
    supabase.from("profiles").select("background").eq("id", user!.id).single(),
    supabase
      .from("ai_analyses")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <>
      <TopBar title="Skill Analyzer" subtitle="Paste a job description to see your fit" />
      <AnalyzerClient savedBackground={profile?.background ?? ""} history={history ?? []} />
    </>
  );
}