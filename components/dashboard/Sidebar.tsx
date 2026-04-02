"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  {
    href: "/dashboard/tracker",
    label: "Job tracker",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1.5" y="1.5" width="13" height="13" rx="2"/>
        <line x1="5" y1="5" x2="11" y2="5"/>
        <line x1="5" y1="8" x2="11" y2="8"/>
        <line x1="5" y1="11" x2="8.5" y2="11"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/analyzer",
    label: "Skill analyzer",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="7" r="5"/>
        <line x1="10.5" y1="10.5" x2="14" y2="14"/>
        <line x1="7" y1="4.5" x2="7" y2="7"/>
        <line x1="7" y1="7" x2="9" y2="9"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/planner",
    label: "Weekly planner",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1.5" y="2.5" width="13" height="12" rx="2"/>
        <line x1="1.5" y1="6.5" x2="14.5" y2="6.5"/>
        <line x1="5.5" y1="0.5" x2="5.5" y2="4.5"/>
        <line x1="10.5" y1="0.5" x2="10.5" y2="4.5"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/networking",
    label: "Networking",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="5" r="2.5"/>
        <path d="M3 14c0-2.76 2.24-5 5-5s5 2.24 5 5"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/insights",
    label: "Insights",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1.5,12 5,7 8.5,9.5 13,3.5"/>
        <line x1="13" y1="3.5" x2="13" y2="7"/>
        <line x1="13" y1="3.5" x2="9.5" y2="3.5"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="2"/>
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <aside className="w-52 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100 flex flex-col">

      {/* logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">👑</span>
          <span style={{ fontFamily: "var(--font-display)" }} className="text-base text-gray-900">
            Hire Me, Please
          </span>
        </div>
      </div>

      {/* nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors duration-100 ${
                active
                  ? "bg-brand-50 text-brand-700 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
              style={active ? { color: "var(--color-brand-700)", background: "var(--color-brand-50)" } : {}}
            >
              <span className={active ? "opacity-100" : "opacity-60"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* sign out */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors w-full"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>
            <polyline points="10.5,5 14,8 10.5,11"/>
            <line x1="14" y1="8" x2="6" y2="8"/>
          </svg>
          Sign out
        </button>
      </div>

    </aside>
  );
}