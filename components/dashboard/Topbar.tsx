"use client";

import React from "react";
import { useUser } from "@/hooks/useUser";
import { useSidebar } from "./SidebarContext";

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { user } = useUser();
  const { toggle } = useSidebar();

  // use their name if we have it, otherwise fall back to first letter of email
  const initials = (() => {
    const name = user?.user_metadata?.full_name as string | undefined;
    if (name) {
      return name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() ?? "?";
  })();

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-3">
        {/* hamburger — mobile only */}
        <button
          onClick={toggle}
          className="md:hidden p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label="Open menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="2" y1="4.5" x2="16" y2="4.5"/>
            <line x1="2" y1="9" x2="16" y2="9"/>
            <line x1="2" y1="13.5" x2="16" y2="13.5"/>
          </svg>
        </button>
        <div>
          <h1 className="text-base font-medium text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actions}
        {/* initials avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0"
          style={{ background: "var(--color-brand-500)" }}
          title={user?.email}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
