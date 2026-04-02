"use client";

import { useState } from "react";
import WeeklyPlanDisplay from "./WeeklyPlanDisplay";
import HistoryPanel from "@/components/dashboard/HistoryPanel";
import type { WeeklyPlanDay } from "@/lib/types";

interface PlanRecord {
  id: string;
  goals: string;
  timeline: string;
  energy_level: string;
  plan: WeeklyPlanDay[];
  week_start: string;
  created_at: string;
}

const ENERGY_OPTIONS = [
  { value: "low",    label: "Low",    sub: "~30 min/day", emoji: "🌱" },
  { value: "medium", label: "Medium", sub: "~1 hr/day",   emoji: "⚡" },
  { value: "high",   label: "High",   sub: "2+ hrs/day",  emoji: "🔥" },
];

interface PlannerClientProps {
  savedBackground: string;
  history: PlanRecord[];
}

export default function PlannerClient({ savedBackground, history }: PlannerClientProps) {
  const [goals, setGoals] = useState("");
  const [timeline, setTimeline] = useState("");
  const [energyLevel, setEnergyLevel] = useState("medium");
  const [result, setResult] = useState<{ plan: WeeklyPlanDay[]; weekStart: string } | null>(null);
  const [selected, setSelected] = useState<PlanRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSelectHistory(item: PlanRecord) {
    setSelected(item);
    setResult({ plan: item.plan, weekStart: item.week_start });
    setGoals(item.goals);
    setTimeline(item.timeline);
    setEnergyLevel(item.energy_level);
  }

  function handleNew() {
    setSelected(null);
    setResult(null);
    setGoals("");
    setTimeline("");
    setEnergyLevel("medium");
    setError(null);
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSelected(null);

    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals, timeline, energyLevel, userBackground: savedBackground }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate plan");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 min-h-0">
      <HistoryPanel
        items={history}
        selected={selected}
        onSelect={handleSelectHistory}
        onNew={handleNew}
        newLabel="New plan"
        getLabel={(item) => item.goals.slice(0, 40) + (item.goals.length > 40 ? "…" : "")}
        getSub={(item) =>
          new Date(item.created_at).toLocaleDateString("en-US", {
            month: "short", day: "numeric",
          })
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {!result ? (
          <div className="max-w-xl mx-auto space-y-5">
            <div
              className="rounded-xl px-5 py-4 text-sm leading-relaxed"
              style={{ background: "var(--color-brand-50)", color: "var(--color-brand-700)" }}
            >
              ✦ What do you want to accomplish this week? Let's build you a realistic day-by-day plan.
              {savedBackground && " Your background is loaded from your profile."}
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="card space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    What are your goals this week? <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    className="input-base resize-none"
                    rows={3}
                    placeholder="e.g. Submit 5 applications, reach out to 3 people on LinkedIn, prep for my Stripe interview on Thursday…"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Timeline / deadline{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    className="input-base"
                    placeholder="e.g. I want to start a new role in 6 weeks"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-3">
                    Energy level this week
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ENERGY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setEnergyLevel(opt.value)}
                        className="rounded-lg border p-3 text-left transition-all"
                        style={
                          energyLevel === opt.value
                            ? { borderColor: "var(--color-brand-400)", background: "var(--color-brand-50)" }
                            : { borderColor: "#e5e7eb", background: "white" }
                        }
                      >
                        <div className="text-lg mb-1">{opt.emoji}</div>
                        <div
                          className="text-xs font-medium"
                          style={{ color: energyLevel === opt.value ? "var(--color-brand-700)" : "#374151" }}
                        >
                          {opt.label}
                        </div>
                        <div className="text-xs text-gray-400">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !goals.trim()}
                className="btn-primary w-full py-3"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><Spinner /> Building your plan…</span>
                ) : "✦ Generate my week"}
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-xl mx-auto space-y-4">
            {!selected && (
              <button onClick={handleNew} className="btn-ghost text-xs px-3 py-2">
                ← New plan
              </button>
            )}
            <WeeklyPlanDisplay plan={result.plan} weekStart={result.weekStart} />
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
      <path d="M7 1.5a5.5 5.5 0 0 1 5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}