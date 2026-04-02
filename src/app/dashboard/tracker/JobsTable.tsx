"use client";

import { useState } from "react";
import { StatusBadge, JOB_STATUSES } from "@/components/ui/Badge";
import { updateJob, deleteJob, toggleStar } from "./actions";
import JobModal from "./JobModal";
import type { JobApplication, JobStatus } from "@/lib/types";

interface JobsTableProps {
  jobs: JobApplication[];
}

export default function JobsTable({ jobs }: JobsTableProps) {
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: JobStatus) {
    await updateJob({ id, status });
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await deleteJob(id);
    setDeletingId(null);
  }

  if (jobs.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <div className="text-3xl mb-3">📋</div>
        <p className="text-sm font-medium text-gray-700 mb-1">No jobs yet</p>
        <p className="text-xs text-gray-400">Hit &ldquo;Add job&rdquo; to start tracking your search.</p>
      </div>
    );
  }

  return (
    <>
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-400 px-5 py-3.5 w-6"></th>
              <th className="text-left text-xs font-medium text-gray-400 px-5 py-3.5">Company</th>
              <th className="text-left text-xs font-medium text-gray-400 px-3 py-3.5">Role</th>
              <th className="text-left text-xs font-medium text-gray-400 px-3 py-3.5">Status</th>
              <th className="text-left text-xs font-medium text-gray-400 px-3 py-3.5">Applied</th>
              <th className="hidden sm:table-cell text-left text-xs font-medium text-gray-400 px-3 py-3.5">Notes</th>
              <th className="px-3 py-3.5 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
              >
                {/* star */}
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => toggleStar(job.id, job.is_starred)}
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                    title={job.is_starred ? "Unstar" : "Star"}
                  >
                    {job.is_starred ? "★" : "☆"}
                  </button>
                </td>

                {/* company + job link */}
                <td className="px-5 py-3.5">
                  <div className="font-medium text-gray-900">{job.company_name}</div>
                  {job.job_url && (
                    <a
                      href={job.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:underline"
                      style={{ color: "var(--color-brand-500)" }}
                    >
                      View posting ↗
                    </a>
                  )}
                </td>

                {/* role title */}
                <td className="px-3 py-3.5 text-gray-600">{job.role_title}</td>

                {/* status — inline dropdown so you can update it without opening the modal */}
                <td className="px-3 py-3.5">
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job.id, e.target.value as JobStatus)}
                    className="text-xs border-0 bg-transparent p-0 cursor-pointer focus:outline-none"
                    style={{ fontFamily: "inherit" }}
                  >
                    {JOB_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="mt-1">
                    <StatusBadge status={job.status} />
                  </div>
                </td>

                {/* date applied */}
                <td className="px-3 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                  {job.date_applied
                    ? new Date(job.date_applied + "T00:00:00").toLocaleDateString("en-US", {
                        month: "short", day: "numeric",
                      })
                    : "—"}
                </td>

                {/* notes — truncated, full text in modal */}
                <td className="hidden sm:table-cell px-3 py-3.5 text-gray-400 text-xs max-w-[180px] truncate">
                  {job.notes || "—"}
                </td>

                {/* edit/delete — hidden until hover */}
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingJob(job)}
                      className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      title="Edit"
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 2l2 2-7 7H2v-2l7-7z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id}
                      className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2,3.5 11,3.5"/>
                        <path d="M4.5 3.5V2.5h4v1"/>
                        <path d="M3 3.5l.7 7h5.6l.7-7"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* edit modal */}
      {editingJob && (
        <JobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
        />
      )}
    </>
  );
}
