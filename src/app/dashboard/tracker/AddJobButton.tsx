"use client";

import { useState } from "react";
import JobModal from "./JobModal";

export default function AddJobButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="7" y1="1" x2="7" y2="13"/>
          <line x1="1" y1="7" x2="13" y2="7"/>
        </svg>
        Add job
      </button>

      {open && <JobModal onClose={() => setOpen(false)} />}
    </>
  );
}
