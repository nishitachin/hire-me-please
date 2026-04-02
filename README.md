# Hire Me, Please

Your job search, finally organized. An AI-powered job search companion that helps you track applications, analyze job fit, plan your week, and generate personalized networking outreach — all in one place.

## Features

- **Job Tracker** — Add, edit, and manage applications with status tracking (Saved → Applied → Interviewing → Offer/Rejected), priority starring, and response rate stats
- **Skill Analyzer** — Paste a job description and get an AI-powered match score, skill breakdown (strong/partial/missing), and a personalized learning plan with resources and time estimates
- **Weekly Planner** — Set your goals, timeline, and energy level; get a Claude-generated 5-day job search schedule with themed days and task breakdowns
- **Networking Assistant** — Paste a job posting and get 3 tailored LinkedIn outreach messages (recruiter, engineer, alumni) with conversation starters
- **Insights** — Analytics dashboard with status breakdown, response rates, application timeline, and AI-generated actionable recommendations
- **Settings** — Update your background and experience so AI features give you more personalized results

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, server components, server actions)
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) — PostgreSQL database + auth (Google OAuth + magic link)
- [Anthropic Claude API](https://www.anthropic.com/) (`claude-sonnet-4-20250514`) — AI features

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com/) project
- An [Anthropic API key](https://console.anthropic.com/)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
ANTHROPIC_API_KEY=[your-anthropic-key]
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The app uses the following Supabase tables:

| Table | Purpose |
|---|---|
| `profiles` | User data (name, background/experience for AI personalization) |
| `job_applications` | Job tracking (company, role, status, date applied, notes, starred) |
| `ai_analyses` | Cached skill analysis results (avoids redundant Claude API calls) |
| `weekly_plans` | Stored weekly schedules (keyed by user + week start date) |
| `networking_results` | Outreach message history |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com/). After connecting your repo, add the three environment variables above in your Vercel project settings.
