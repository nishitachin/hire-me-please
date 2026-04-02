"use client";

import React from "react";
import { useUser } from "@/hooks/useUser";

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { user } = useUser();

  // use their name if we have it, otherwise fall back to first letter of email
  const initials = (() => {
    const name = user?.user_metadata?.full_name as string | undefined;
    if (name) {
      return name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() ?? "?";
  })();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
      <div>
        <h1 className="text-base font-medium text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        )}
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