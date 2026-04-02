"use client";

import type { WeeklyPlanDay } from "@/lib/types";

interface WeeklyPlanDisplayProps {
  plan: WeeklyPlanDay[];
  weekStart: string;
}

const taskConfig = {
  apply:   { color: "#c92d73", bg: "#fdf2f7", label: "Apply",   icon: "📨" },
  network: { color: "#1d4ed8", bg: "#eff6ff", label: "Network", icon: "🤝" },
  study:   { color: "#15803d", bg: "#f0fdf4", label: "Study",   icon: "📚" },
  prep:    { color: "#b45309", bg: "#fffbeb", label: "Prep",    icon: "✍️" },
  rest:    { color: "#6b7280", bg: "#f9fafb", label: "Rest",    icon: "☕" },
};

export default function WeeklyPlanDisplay({ plan, weekStart }: WeeklyPlanDisplayProps) {
  const weekLabel = new Date(weekStart + "T00:00:00").toLocaleDateString("en-US", {
    month: "long", day: "numeric",
  });

  const totalMinutes = plan.reduce(
    (sum, day) => sum + day.tasks.reduce((s, t) => s + t.duration_minutes, 0),
    0
  );

  return (
    <div className="space-y-4">

      {/* Week header */}
      <div className="card flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Week of</p>
          <p className="text-base font-medium text-gray-900">{weekLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-0.5">Total time this week</p>
          <p className="text-base font-medium" style={{ color: "var(--color-brand-600)" }}>
            {Math.round(totalMinutes / 60 * 10) / 10} hrs
          </p>
        </div>
      </div>

      {/* Days */}
      <div className="grid grid-cols-1 gap-3">
        {plan.map((day) => {
          const dayTotal = day.tasks.reduce((s, t) => s + t.duration_minutes, 0);
          return (
            <div key={day.day} className="card">
              {/* Day header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {day.day}
                  </span>
                  <span
                    className="ml-2 text-sm font-medium"
                    style={{ color: "var(--color-brand-600)" }}
                  >
                    {day.theme}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{dayTotal} min</span>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {day.tasks.map((task, i) => {
                  const cfg = taskConfig[task.type];
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg px-3 py-2.5"
                      style={{ background: cfg.bg }}
                    >
                      <span className="text-sm mt-0.5">{cfg.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 leading-snug">
                          {task.description}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: cfg.color }}>
                          {cfg.label} · {task.duration_minutes} min
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 pt-1">
        {Object.entries(taskConfig).map(([type, cfg]) => (
          <span
            key={type}
            className="badge text-xs"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {cfg.icon} {cfg.label}
          </span>
        ))}
      </div>
    </div>
  );
}