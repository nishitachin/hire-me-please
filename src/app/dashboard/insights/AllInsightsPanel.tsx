"use client";

import { useState } from "react";
import type { InsightStats } from "./stats";

interface Insight {
  emoji: string;
  title: string;
  body: string;
  type: "positive" | "suggestion" | "warning";
}

const typeStyles = {
  positive:   { bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d" },
  suggestion: { bg: "var(--color-brand-50)", border: "#f4a8ce", color: "var(--color-brand-700)" },
  warning:    { bg: "#fffbeb", border: "#fde68a", color: "#b45309" },
};

export default function AIInsightsPanel({ stats }: { stats: InsightStats }) {
  const [insights, setInsights] = useState<Insight[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setInsights(data.insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!insights) {
    return (
      <div
        className="card flex flex-col items-center justify-center py-10 text-center space-y-3"
        style={{ background: "var(--color-brand-50)", border: "1px solid #f4a8ce" }}
      >
        <div className="text-2xl">✦</div>
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--color-brand-700)" }}>
            Get AI insights on your search!
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-brand-500)" }}>
            Let's analyze your data and see what&apos;s working.
          </p>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary mt-1"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner />
              Analyzing…
            </span>
          ) : (
            "✦ Generate insights"
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => {
        const style = typeStyles[insight.type];
        return (
          <div
            key={i}
            className="rounded-xl px-4 py-4"
            style={{ background: style.bg, border: `1px solid ${style.border}` }}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">{insight.emoji}</span>
              <div>
                <p className="text-sm font-medium" style={{ color: style.color }}>
                  {insight.title}
                </p>
                <p className="text-xs mt-1 leading-relaxed text-gray-600">
                  {insight.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <button
        onClick={() => setInsights(null)}
        className="text-xs text-gray-400 hover:text-gray-600 transition-colors pt-1"
      >
        Regenerate ↺
      </button>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
      <path d="M7 1.5a5.5 5.5 0 0 1 5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}