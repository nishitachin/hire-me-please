"use client";

import { useState } from "react";
import type { NetworkingMessage } from "@/lib/types";

interface MessageCardProps {
  message: NetworkingMessage;
  index: number;
}

export default function MessageCard({ message, index }: MessageCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(message.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const colors = [
    { bg: "var(--color-brand-50)",  label: "var(--color-brand-700)"  },
    { bg: "#eff6ff",                label: "#1d4ed8"                 },
    { bg: "#f0fdf4",                label: "#15803d"                 },
  ];
  const color = colors[index % colors.length];

  return (
    <div className="card space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className="badge text-xs"
            style={{ background: color.bg, color: color.label }}
          >
            {message.recipient_type}
          </span>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">{message.why}</p>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={
            copied
              ? { background: "#f0fdf4", color: "#15803d" }
              : { background: "var(--color-surface-secondary)", color: "#6b7280" }
          }
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2,6 5,9 10,3"/>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="7" height="7" rx="1"/>
                <path d="M8 4V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1"/>
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Message body */}
      <div
        className="rounded-lg px-4 py-3.5 text-sm text-gray-700 leading-relaxed border-l-2 whitespace-pre-wrap"
        style={{
          background: "var(--color-surface-secondary)",
          borderLeftColor: color.label,
        }}
      >
        {message.message}
      </div>
    </div>
  );
}