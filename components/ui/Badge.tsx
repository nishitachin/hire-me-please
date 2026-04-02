import type { JobStatus } from "@/lib/types";

const statusConfig: Record<JobStatus, { label: string; colors: string }> = {
  saved:        { label: "Saved",        colors: "background:#f3f4f6; color:#4b5563;" },
  applied:      { label: "Applied",      colors: "background:#eff6ff; color:#1d4ed8;" },
  interviewing: { label: "Interviewing", colors: "background:#fffbeb; color:#b45309;" },
  offer:        { label: "Offer 🎉",     colors: "background:#f0fdf4; color:#15803d;" },
  rejected:     { label: "Rejected",     colors: "background:#fef2f2; color:#b91c1c;" },
};

interface StatusBadgeProps {
  status: JobStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, colors } = statusConfig[status];
  return (
    <span className="badge" style={{ ...parseColors(colors) }}>
      {label}
    </span>
  );
}

// converts "background:#fff; color:#000;" into a React style object
function parseColors(str: string): React.CSSProperties {
  return Object.fromEntries(
    str.split(";")
      .filter(Boolean)
      .map((s) => {
        const [k, v] = s.split(":").map((x) => x.trim());
        const camel = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        return [camel, v];
      })
  );
}

// used in dropdowns — defines the order too
export const JOB_STATUSES: JobStatus[] = [
  "saved", "applied", "interviewing", "offer", "rejected"
];