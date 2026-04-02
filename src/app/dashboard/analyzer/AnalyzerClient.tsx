"use client";

import { useState } from "react";
import AnalysisResults from "./AnalysisResults";
import HistoryPanel from "@/components/dashboard/HistoryPanel";
import type { SkillAnalysis } from "@/lib/types";

interface HistoryItem {
  id: string;
  job_description: string;
  result: SkillAnalysis;
  created_at: string;
}

interface AnalyzerClientProps {
  savedBackground: string;
  history: HistoryItem[];
}

export default function AnalyzerClient({ savedBackground, history }: AnalyzerClientProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [userBackground, setUserBackground] = useState(savedBackground);
  const [result, setResult] = useState<SkillAnalysis | null>(null);
  const [selected, setSelected] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSelectHistory(item: HistoryItem) {
    setSelected(item);
    setResult(item.result);
    setJobDescription(item.job_description);
  }

  function handleNew() {
    setSelected(null);
    setResult(null);
    setJobDescription("");
    setUserBackground(savedBackground);
    setError(null);
  }

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSelected(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, userBackground }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 min-h-0">
      {/* History sidebar */}
      <HistoryPanel
        items={history}
        selected={selected}
        onSelect={handleSelectHistory}
        onNew={handleNew}
        newLabel="New Analysis"
        getLabel={(item) => item.result?.job_title ?? "Analysis"}
        getSub={(item) =>
          new Date(item.created_at).toLocaleDateString("en-US", {
            month: "short", day: "numeric",
          })
        }
      />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!result ? (
          <div className="max-w-2xl mx-auto space-y-5">
            <div
              className="rounded-xl px-5 py-4 text-sm leading-relaxed"
              style={{ background: "var(--color-brand-50)", color: "var(--color-brand-700)" }}
            >
              ✦ Paste any job description below. Your background is pre-filled from your profile — update it in Settings anytime.
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="card space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Job description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    className="input-base resize-none"
                    rows={8}
                    placeholder="Paste the full job posting here…"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-gray-500">
                      Your background
                    </label>
                    {savedBackground && (
                      <span className="text-xs" style={{ color: "var(--color-brand-500)" }}>
                        ✓ Pre-filled from your profile
                      </span>
                    )}
                  </div>
                  <textarea
                    className="input-base resize-none"
                    rows={4}
                    placeholder="Describe your experience and skills…"
                    value={userBackground}
                    onChange={(e) => setUserBackground(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !jobDescription.trim()}
                className="btn-primary w-full py-3"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><Spinner /> Analyzing your fit…</span>
                ) : "✦ Analyze my fit"}
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            <button onClick={handleNew} className="btn-ghost text-xs px-3 py-2">
              ← New Analysis
            </button>
            <AnalysisResults result={result} />
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