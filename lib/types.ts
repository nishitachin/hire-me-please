// shared types — mirror the db schema exactly

export type JobStatus = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface JobApplication {
  id: string
  user_id: string
  company_name: string
  role_title: string
  job_url: string | null
  status: JobStatus
  date_applied: string | null  // ISO date string e.g. "2025-04-01"
  notes: string | null
  is_starred: boolean
  created_at: string
  updated_at: string
}

// for the add job form — strips id and timestamps since those come from the db
export type NewJobApplication = Omit<
  JobApplication,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>

// for edits — everything optional except id
export type UpdateJobApplication = Partial<NewJobApplication> & { id: string }

// ai-generated shapes — these don't live in the db, just passed around in the app

export interface SkillAnalysis {
  job_title: string
  company: string | null
  match_score: number  // 0–100
  skills: {
    name: string
    level: 'strong' | 'partial' | 'missing'
    score: number  // 0–100
  }[]
  missing_skills: string[]
  learning_plan: {
    skill: string
    resource: string
    type: 'course' | 'article' | 'project' | 'practice'
    time_estimate: string
  }[]
  summary: string
}

export interface WeeklyPlanDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  theme: string  // e.g. "Application Blitz", "Networking Thursday"
  tasks: {
    type: 'apply' | 'network' | 'study' | 'prep' | 'rest'
    description: string
    duration_minutes: number
  }[]
}

export interface WeeklyPlan {
  id: string
  user_id: string
  week_start: string
  goals: string
  timeline: string
  energy_level: string
  plan: WeeklyPlanDay[]
  created_at: string
}

export interface NetworkingMessage {
  recipient_type: string   // e.g. "Recruiter", "Engineer on the team", "Alumni"
  why: string              // one-liner on why you're reaching out to them specifically
  message: string          // the actual draft message
}

export interface NetworkingResult {
  job_title: string
  company: string
  recipients: NetworkingMessage[]
}

// stats shown on the insights page

export interface TrackerStats {
  total: number
  saved: number
  applied: number
  interviewing: number
  offer: number
  rejected: number
  response_rate: number  // (interviewing + offer) / applied * 100
}
