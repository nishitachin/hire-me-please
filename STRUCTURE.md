# Hire Me, Please — Folder Structure

hire-me-please/
├── .env.local                            # Environment variables (Supabase, Anthropic keys)
├── middleware.ts                         # Calls Supabase session refresh on every request
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
│
├── public/                               # Default Next.js SVG icons (unused)
│
├── components/                           # Shared UI components
│   ├── ui/
│   │   ├── Badge.tsx                     # Color-coded status badge (job statuses)
│   │   └── Card.tsx                      # Label-value card display
│   └── dashboard/
│       ├── Sidebar.tsx                   # Nav sidebar with links to all sections + sign-out
│       ├── Topbar.tsx                    # Page header with title, subtitle, user avatar
│       └── HistoryPanel.tsx              # Generic recent-items sidebar with selection
│
├── hooks/
│   └── useUser.ts                        # React hook for authenticated user state
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # Browser Supabase client
│   │   ├── server.ts                     # Server-side Supabase client
│   │   └── middleware.ts                 # Session refresh + auth redirect logic
│   └── types.ts                          # Shared TypeScript types (DB models, AI data structures)
│
└── src/
    └── app/                              # Next.js App Router
        ├── layout.tsx                    # Root layout (font config, metadata)
        ├── globals.css                   # Tailwind + CSS variables
        ├── favicon.ico
        │
        ├── auth/
        │   ├── login/page.tsx            # Login page (Google OAuth + magic link)
        │   └── callback/route.ts         # Exchanges OAuth code for Supabase session
        │
        ├── api/
        │   ├── analyze/route.ts          # Claude: analyzes job descriptions, returns skill gaps + learning plan
        │   ├── insights/route.ts         # Claude: generates 3 AI insights from job search stats
        │   ├── networking/route.ts       # Claude: generates personalized LinkedIn outreach messages
        │   └── planner/route.ts          # Claude: generates weekly job search schedule
        │
        └── dashboard/
            ├── layout.tsx                # Auth-protected shell with sidebar + main content
            ├── page.tsx                  # Redirects to /dashboard/tracker
            │
            ├── tracker/                  # Job application tracker
            │   ├── page.tsx              # Page with stats and jobs table
            │   ├── JobsTable.tsx         # Table with inline status editing and actions
            │   ├── JobModal.tsx          # Add/edit job modal form
            │   ├── AddJobButton.tsx      # Opens JobModal
            │   └── actions.ts            # Server actions: add, update, delete, star jobs
            │
            ├── analyzer/                 # Job skill gap analyzer
            │   ├── page.tsx              # Fetches server data, renders client component
            │   ├── AnalyzerClient.tsx    # Job description input + analysis UI with history sidebar
            │   └── AnalysisResults.tsx   # Displays skill breakdown, match score, learning plan
            │
            ├── planner/                  # Weekly job search planner
            │   ├── page.tsx
            │   ├── PlannerClient.tsx     # Goals/timeline/energy input + plan generation
            │   └── WeeklyPlanDisplay.tsx # Color-coded weekly schedule display
            │
            ├── networking/               # LinkedIn outreach message generator
            │   ├── page.tsx
            │   ├── NetworkingClient.tsx  # Job input + message generation with history
            │   └── MessageCard.tsx       # Individual message with copy-to-clipboard
            │
            ├── insights/                 # Job search insights dashboard
            │   ├── page.tsx
            │   ├── AllInsightsPanel.tsx  # Generates + displays AI insights from stats
            │   └── stats.ts              # Computes response rates, role types, etc. from job data
            │
            └── settings/                 # User profile settings
                ├── page.tsx
                ├── SettingsForm.tsx      # Form to update name and background info
                └── actions.ts            # Server actions: get/update user profile
