"use client";

import { useState } from "react";
import { updateProfile } from "./actions";

interface SettingsFormProps {
  profile: {
    full_name: string | null;
    email: string;
    background: string | null;
  } | null;
}

export default function SettingsForm({ profile }: SettingsFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [background, setBackground] = useState(profile?.background ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      await updateProfile({ full_name: fullName, background });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Profile */}
      <div className="card space-y-4">
        <h2 className="text-sm font-medium text-gray-900">Profile</h2>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Full name</label>
          <input
            className="input-base"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ada Lovelace"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
          <input
            className="input-base"
            value={profile?.email ?? ""}
            disabled
            style={{ opacity: 0.6, cursor: "not-allowed" }}
          />
          <p className="text-xs text-gray-400 mt-1">Email can&apos;t be changed here.</p>
        </div>
      </div>

      {/* Background */}
      <div className="card space-y-3">
        <div>
          <h2 className="text-sm font-medium text-gray-900">Your background</h2>
          <p className="text-xs text-gray-400 mt-1">
            This is pre-filled into every AI feature — skill analyzer, weekly planner, and networking assistant — so you never have to type it again.
          </p>
        </div>

        <div
          className="rounded-lg px-4 py-3 text-xs leading-relaxed"
          style={{ background: "var(--color-brand-50)", color: "var(--color-brand-700)" }}
        >
          ✦ Be specific — your years of experience, key skills, industries, what you&apos;re looking for next. The more detail, the better the AI output.
        </div>

        <textarea
          className="input-base resize-none"
          rows={6}
          placeholder={`e.g. I'm a product designer with 4 years of experience, currently at a Series B fintech startup. Strong in Figma, design systems, and user research. I've led end-to-end product work from discovery to shipping. Looking for senior IC or lead roles at companies with strong design culture, ideally in fintech, productivity, or dev tools.`}
          value={background}
          onChange={(e) => setBackground(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="btn-primary w-full py-3"
      >
        {saving ? "Saving…" : saved ? "✓ Saved!" : "Save changes"}
      </button>

    </form>
  );
}