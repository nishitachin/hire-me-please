import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { goals, timeline, energyLevel } = await request.json();

  if (!goals?.trim()) {
    return NextResponse.json({ error: "Goals are required" }, { status: 400 });
  }

  const prompt = `You are an encouraging, practical career coach helping someone organize their job search week. Create a realistic, personalized weekly plan based on their inputs.

GOALS: ${goals}
TIMELINE: ${timeline || "Not specified"}
ENERGY LEVEL / AVAILABILITY: ${energyLevel}

Return ONLY a valid JSON array of 5 days (Monday–Friday) with this exact structure (no markdown, no explanation, just JSON):
[
  {
    "day": "Monday",
    "theme": "fun 2-4 word name for the day e.g. 'The Warm-Up' or 'Application Blitz'",
    "tasks": [
      {
        "type": "apply" | "network" | "study" | "prep" | "rest",
        "description": "specific, actionable task description",
        "duration_minutes": <integer>
      }
    ]
  }
]

Rules:
- Each day should have 2-4 tasks max — don't overwhelm
- Total daily time should match their energy level (low = ~30min, medium = ~60min, high = ~90-120min)
- Spread task types across the week — don't put all applications on one day
- Be specific and actionable, not vague (e.g. "Apply to 2 roles from your saved list" not "Apply to jobs")
- Give each day a fun, motivating theme name
- Include at least one "study" or "prep" task somewhere in the week
- Saturday and Sunday are NOT included — keep it to weekdays only`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const plan = JSON.parse(raw.replace(/```json|```/g, "").trim());

    // Get Monday of current week
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const weekStart = monday.toISOString().split("T")[0];

    // Save to database
    await supabase.from("weekly_plans").insert({
      user_id: user.id,
      week_start: weekStart,
      goals,
      timeline: timeline || "",
      energy_level: energyLevel,
      plan,
    });

    return NextResponse.json({ plan, weekStart });
  } catch (err) {
    console.error("Claude API error:", err);
    return NextResponse.json({ error: "Failed to generate plan. Please try again." }, { status: 500 });
  }
}