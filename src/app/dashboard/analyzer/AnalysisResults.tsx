"use client";

import type { SkillAnalysis } from "@/lib/types";

interface AnalysisResultsProps {
  result: SkillAnalysis;
}

const levelConfig = {
  strong:  { label: "Strong",  bg: "#f0fdf4", color: "#15803d", bar: "#22c55e" },
  partial: { label: "Partial", bg: "#fffbeb", color: "#b45309", bar: "#f59e0b" },
  missing: { label: "Missing", bg: "#fef2f2", color: "#b91c1c", bar: "#f87171" },
};

const typeIcon = {
  course:   "🎓",
  article:  "📄",
  project:  "🛠️",
  practice: "💪",
};

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  return (
    <div className="space-y-5">

      {/* Header card */}
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-medium text-gray-900 text-base">
              {result.job_title}
              {result.company && (
                <span className="text-gray-400 font-normal"> @ {result.company}</span>
              )}
            </h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{result.summary}</p>
          </div>

          {/* Match score dial */}
          <div className="shrink-0 flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-medium border-4"
              style={{
                borderColor: result.match_score >= 70
                  ? "#22c55e"
                  : result.match_score >= 40
                  ? "#f59e0b"
                  : "#f87171",
                color: result.match_score >= 70
                  ? "#15803d"
                  : result.match_score >= 40
                  ? "#b45309"
                  : "#b91c1c",
              }}
            >
              {result.match_score}%
            </div>
            <span className="text-xs text-gray-400 mt-1.5">match</span>
          </div>
        </div>
      </div>

      {/* Skills breakdown */}
      <div className="card">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Skill Breakdown</h4>
        <div className="space-y-3">
          {result.skills.map((skill) => {
            const cfg = levelConfig[skill.level];
            return (
              <div key={skill.name} className="flex items-center gap-3">
                <div className="w-32 shrink-0 text-sm text-gray-700">{skill.name}</div>
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${skill.score}%`, background: cfg.bar }}
                  />
                </div>
                <span
                  className="badge shrink-0"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning plan */}
      {result.learning_plan.length > 0 && (
        <div className="card">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Your Learning Plan</h4>
          <div className="space-y-3">
            {result.learning_plan.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: "var(--color-surface-secondary)" }}
              >
                <span className="text-base mt-0.5">{typeIcon[item.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-900">{item.skill}</span>
                    <span className="text-xs text-gray-400">· {item.time_estimate}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.resource}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing skills pills */}
      {result.missing_skills.length > 0 && (
        <div className="card">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Skills To Develop</h4>
          <div className="flex flex-wrap gap-2">
            {result.missing_skills.map((skill) => (
              <span
                key={skill}
                className="badge"
                style={{ background: "#fef2f2", color: "#b91c1c" }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}