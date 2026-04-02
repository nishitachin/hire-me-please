import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/dashboard/Topbar";
import { Card } from "@/components/ui/Card";
import JobsTable from "./JobsTable";
import AddJobButton from "./AddJobButton";
import type { JobApplication, TrackerStats } from "@/lib/types";

function computeStats(jobs: JobApplication[]): TrackerStats {
  const total        = jobs.length;
  const saved        = jobs.filter((j) => j.status === "saved").length;
  const applied      = jobs.filter((j) => j.status === "applied").length;
  const interviewing = jobs.filter((j) => j.status === "interviewing").length;
  const offer        = jobs.filter((j) => j.status === "offer").length;
  const rejected     = jobs.filter((j) => j.status === "rejected").length;

  const responseRate =
    applied + interviewing + offer + rejected > 0
      ? Math.round(((interviewing + offer) / (applied + interviewing + offer + rejected)) * 100)
      : 0;

  return { total, saved, applied, interviewing, offer, rejected, response_rate: responseRate };
}

export default async function TrackerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: jobs = [] } = await supabase
    .from("job_applications")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const stats = computeStats(jobs as JobApplication[]);

  const firstName = (user?.user_metadata?.full_name as string)?.split(" ")[0]
    ?? user?.email?.split("@")[0]
    ?? "there";

  return (
    <>
      <TopBar
        title="Job tracker"
        subtitle={`${stats.total} job${stats.total !== 1 ? "s" : ""} tracked`}
        actions={<AddJobButton />}
      />

      <div className="flex-1 p-6 space-y-5">

        {/* empty state welcome — only show before they've added anything */}
        {stats.total === 0 && (
          <div
            className="rounded-xl px-5 py-4 text-sm"
            style={{ background: "var(--color-brand-50)", color: "var(--color-brand-700)" }}
          >
            👋 Hey {firstName}! Add your first job to get started. Track everything in one place — saved roles, applications, interviews, and offers.
          </div>
        )}

        {/* stats row */}
        {stats.total > 0 && (
          <div className="grid grid-cols-4 gap-3">
            <Card label="Total tracked"  value={stats.total} />
            <Card label="Interviewing"   value={stats.interviewing} />
            <Card
              label="Response rate"
              value={`${stats.response_rate}%`}
              note={stats.response_rate >= 20 ? "Great work! 🎉" : undefined}
            />
            <Card
              label="Offers"
              value={stats.offer}
              note={stats.offer > 0 ? "You got this! 👑" : undefined}
            />
          </div>
        )}

        {/* jobs table */}
        <JobsTable jobs={jobs as JobApplication[]} />

      </div>
    </>
  );
}
