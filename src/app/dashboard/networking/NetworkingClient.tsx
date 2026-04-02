"use client";

import { useState } from "react";
import MessageCard from "./MessageCard";
import HistoryPanel from "@/components/dashboard/HistoryPanel";
import type { NetworkingResult } from "@/lib/types";

interface NetworkingRecord {
  id: string;
  job_description: string;
  result: NetworkingResult;
  created_at: string;
}

interface NetworkingClientProps {
  savedBackground: string;
  history: NetworkingRecord[];
}

export default function NetworkingClient({ savedBackground, history }: NetworkingClientProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [userBackground, setUserBackground] = useState(savedBackground);
  const [result, setResult] = useState<NetworkingResult | null>(null);
  const [selected, setSelected] = useState<NetworkingRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSelectHistory(item: NetworkingRecord) {
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

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSelected(null);

    try {
      const res = await fetch("/api/networking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, userBackground }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate messages");
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
        newLabel="New messages"
        getLabel={(item) => item.result?.job_title ?? "Networking"}
        getSub={(item) =>
          item.result?.company ??
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
              ✦ Paste a job posting to see three ready-to-send LinkedIn messages.
              {savedBackground && " Your background is pre-filled from your profile."}
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="card space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Job posting <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    className="input-base resize-none"
                    rows={7}
                    placeholder="Paste the job description or company name + role + a few details…"
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
                    rows={3}
                    placeholder="Describe your experience…"
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
                  <span className="flex items-center gap-2"><Spinner /> Writing your messages…</span>
                ) : "✦ Write my outreach messages"}
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-xl mx-auto space-y-5">
            {!selected && (
              <button onClick={handleNew} className="btn-ghost text-xs px-3 py-2">
                ← New messages
              </button>
            )}
            <div className="card">
              <p className="text-xs text-gray-400 mb-0.5">Messages for</p>
              <p className="text-base font-medium text-gray-900">
                {result.job_title}
                {result.company && <span className="text-gray-400 font-normal"> @ {result.company}</span>}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                3 messages ready · Replace [Your Name] before sending
              </p>
            </div>
            {result.recipients.map((msg, i) => (
              <MessageCard key={i} message={msg} index={i} />
            ))}
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