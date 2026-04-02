import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/dashboard/Topbar";
import { Card } from "@/components/ui/Card";
import AIInsightsPanel from "./AllInsightsPanel";
import { computeInsightStats } from "./stats";
import type { JobApplication } from "@/lib/types";

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: jobs = [] } = await supabase
    .from("job_applications")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const stats = computeInsightStats(jobs as JobApplication[]);

  if (stats.total === 0) {
    return (
      <>
        <TopBar title="Insights" subtitle="Patterns from your job search" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="text-3xl">📊</div>
            <p className="text-sm font-medium text-gray-700">No data yet</p>
            <p className="text-xs text-gray-400">Add some jobs to your tracker to start seeing insights.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar
        title="Insights"
        subtitle={`Based on ${stats.total} job${stats.total !== 1 ? "s" : ""} tracked`}
      />

      <div className="flex-1 p-6 space-y-6">

        {/* Top stats */}
        <div className="grid grid-cols-4 gap-3">
          <Card label="Total tracked"   value={stats.total} />
          <Card label="Response rate"   value={`${stats.response_rate}%`} />
          <Card label="Interview rate"  value={`${stats.interview_rate}%`} />
          <Card label="Offer rate"      value={`${stats.offer_rate}%`} />
        </div>

        <div className="grid grid-cols-2 gap-5">

          {/* Status breakdown */}
          <div className="card space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Applications by status</h3>
            <div className="space-y-2.5">
              {Object.entries(stats.by_status)
                .filter(([, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([status, count]) => {
                  const pct = Math.round((count / stats.total) * 100);
                  const barColors: Record<string, string> = {
                    saved:        "#9ca3af",
                    applied:      "#3b82f6",
                    interviewing: "#f59e0b",
                    offer:        "#22c55e",
                    rejected:     "#f87171",
                  };
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 capitalize">{status}</span>
                        <span className="text-gray-400">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: barColors[status] ?? "#9ca3af" }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Response rate by role type */}
          <div className="card space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Response rate by role type</h3>
            {stats.by_role_type.length === 0 ? (
              <p className="text-xs text-gray-400">Add more jobs to see patterns by role type.</p>
            ) : (
              <div className="space-y-2.5">
                {stats.by_role_type.map((row) => (
                  <div key={row.role}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{row.role}</span>
                      <span className="text-gray-400">
                        {row.response_rate}% · {row.count} job{row.count !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${row.response_rate}%`,
                          background: "var(--color-brand-400)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Quick facts row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center">
            <p className="text-2xl font-medium text-gray-900">{stats.starred_count}</p>
            <p className="text-xs text-gray-400 mt-1">Starred / priority roles</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-medium text-gray-900">{stats.has_notes_rate}%</p>
            <p className="text-xs text-gray-400 mt-1">Jobs with notes</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-medium text-gray-900">
              {stats.most_active_week
                ? new Date(stats.most_active_week + "T00:00:00").toLocaleDateString("en-US", {
                    month: "short", day: "numeric",
                  })
                : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-1">Most active week</p>
          </div>
        </div>

        {/* AI insights */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">AI insights</h3>
          <AIInsightsPanel stats={stats} />
        </div>

      </div>
    </>
  );
}