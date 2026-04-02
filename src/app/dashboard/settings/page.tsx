import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/dashboard/Topbar";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <>
      <TopBar title="Settings" subtitle="Manage your profile and preferences" />
      <div className="flex-1 p-6">
        <div className="max-w-xl mx-auto">
          <SettingsForm profile={profile} />
        </div>
      </div>
    </>
  );
}