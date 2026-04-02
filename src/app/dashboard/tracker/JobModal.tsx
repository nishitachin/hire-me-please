"use client";

import { useState, useEffect } from "react";
import { addJob, updateJob } from "./actions";
import { JOB_STATUSES } from "@/components/ui/Badge";
import type { JobApplication, NewJobApplication } from "@/lib/types";

interface JobModalProps {
  job?: JobApplication;        // editing if provided, adding if not
  onClose: () => void;
}

const EMPTY: NewJobApplication = {
  company_name: "",
  role_title: "",
  job_url: "",
  status: "saved",
  date_applied: "",
  notes: "",
  is_starred: false,
};

export default function JobModal({ job, onClose }: JobModalProps) {
  const [form, setForm] = useState<NewJobApplication>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (job) {
      setForm({
        company_name: job.company_name,
        role_title:   job.role_title,
        job_url:      job.job_url ?? "",
        status:       job.status,
        date_applied: job.date_applied ?? "",
        notes:        job.notes ?? "",
        is_starred:   job.is_starred,
      });
    }
  }, [job]);

  function set(field: keyof NewJobApplication, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (job) {
        await updateJob({ id: job.id, ...form });
      } else {
        await addJob(form);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    // backdrop — clicking outside closes the modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.3)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-medium text-gray-900">
            {job ? "Edit job" : "Add job"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="4" x2="14" y2="14"/>
              <line x1="14" y1="4" x2="4" y2="14"/>
            </svg>
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Company <span className="text-red-400">*</span>
              </label>
              <input
                className="input-base"
                placeholder="Stripe"
                value={form.company_name}
                onChange={(e) => set("company_name", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Role <span className="text-red-400">*</span>
              </label>
              <input
                className="input-base"
                placeholder="Product Designer"
                value={form.role_title}
                onChange={(e) => set("role_title", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Job URL
            </label>
            <input
              className="input-base"
              placeholder="https://..."
              type="url"
              value={form.job_url ?? ""}
              onChange={(e) => set("job_url", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Status
              </label>
              <select
                className="input-base"
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {JOB_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Date applied
              </label>
              <input
                className="input-base"
                type="date"
                value={form.date_applied ?? ""}
                onChange={(e) => set("date_applied", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Notes
            </label>
            <textarea
              className="input-base resize-none"
              rows={3}
              placeholder="Referral from Amy, 2nd round next week…"
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* footer buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading
                ? (job ? "Saving…" : "Adding…")
                : (job ? "Save changes" : "Add job")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
