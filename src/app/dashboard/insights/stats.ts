import type { JobApplication } from "@/lib/types";

export interface InsightStats {
  total: number;
  by_status: Record<string, number>;
  response_rate: number;
  interview_rate: number;
  offer_rate: number;
  by_role_type: { role: string; count: number; responses: number; response_rate: number }[];
  avg_days_to_response: number | null;
  most_active_week: string | null;
  starred_count: number;
  has_notes_rate: number;
}

export function computeInsightStats(jobs: JobApplication[]): InsightStats {
  const total = jobs.length;

  // By status
  const by_status: Record<string, number> = {
    saved: 0, applied: 0, interviewing: 0, offer: 0, rejected: 0,
  };
  jobs.forEach((j) => { by_status[j.status] = (by_status[j.status] ?? 0) + 1; });

  // Rates (out of jobs that have moved past "saved")
  const active = jobs.filter((j) => j.status !== "saved");
  const responded = jobs.filter((j) => ["interviewing", "offer", "rejected"].includes(j.status));
  const interviewed = jobs.filter((j) => ["interviewing", "offer"].includes(j.status));
  const offered = jobs.filter((j) => j.status === "offer");

  const response_rate  = active.length > 0 ? Math.round((responded.length  / active.length) * 100) : 0;
  const interview_rate = active.length > 0 ? Math.round((interviewed.length / active.length) * 100) : 0;
  const offer_rate     = active.length > 0 ? Math.round((offered.length     / active.length) * 100) : 0;

  // Group by rough role type (first word or two of title)
  const roleMap = new Map<string, { count: number; responses: number }>();
  jobs.forEach((j) => {
    // Simplify role title to a category
    const title = j.role_title.toLowerCase();
    let category = "Other";
    if (title.includes("engineer") || title.includes("developer") || title.includes("swe")) category = "Engineering";
    else if (title.includes("design")) category = "Design";
    else if (title.includes("product") || title.includes("pm")) category = "Product";
    else if (title.includes("data") || title.includes("analyst")) category = "Data";
    else if (title.includes("market")) category = "Marketing";
    else if (title.includes("sales")) category = "Sales";
    else if (title.includes("research")) category = "Research";
    else {
      // Fall back to first meaningful word
      category = j.role_title.split(" ").slice(0, 2).join(" ");
    }

    const entry = roleMap.get(category) ?? { count: 0, responses: 0 };
    entry.count++;
    if (["interviewing", "offer", "rejected"].includes(j.status)) entry.responses++;
    roleMap.set(category, entry);
  });

  const by_role_type = Array.from(roleMap.entries())
    .map(([role, { count, responses }]) => ({
      role,
      count,
      responses,
      response_rate: count > 0 ? Math.round((responses / count) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Most active week
  const weekCounts = new Map<string, number>();
  jobs.forEach((j) => {
    if (!j.date_applied) return;
    const d = new Date(j.date_applied + "T00:00:00");
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((day + 6) % 7));
    const key = monday.toISOString().split("T")[0];
    weekCounts.set(key, (weekCounts.get(key) ?? 0) + 1);
  });
  const most_active_week = weekCounts.size > 0
    ? Array.from(weekCounts.entries()).sort((a, b) => b[1] - a[1])[0][0]
    : null;

  const starred_count = jobs.filter((j) => j.is_starred).length;
  const has_notes_rate = total > 0
    ? Math.round((jobs.filter((j) => j.notes && j.notes.trim().length > 0).length / total) * 100)
    : 0;

  return {
    total,
    by_status,
    response_rate,
    interview_rate,
    offer_rate,
    by_role_type,
    avg_days_to_response: null, // would need response date field to compute
    most_active_week,
    starred_count,
    has_notes_rate,
  };
}