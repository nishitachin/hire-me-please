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

  const { stats } = await request.json();

  const prompt = `You are an encouraging, data-savvy career coach. Based on this person's job search data, give them 3 short, specific, actionable insights.

JOB SEARCH DATA:
${JSON.stringify(stats, null, 2)}

Return ONLY a valid JSON array of exactly 3 insight objects (no markdown, no explanation):
[
  {
    "emoji": "single relevant emoji",
    "title": "short insight title, max 6 words",
    "body": "2 sentences max — one observation from the data, one specific action to take",
    "type": "positive" | "suggestion" | "warning"
  }
]

Rules:
- Be specific — reference actual numbers from the data
- Be encouraging but honest
- "positive" = something going well, "suggestion" = something to try, "warning" = something to address
- If there isn't enough data for a meaningful insight, give general best-practice advice for that slot
- Keep each body under 40 words`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const insights = JSON.parse(raw.replace(/```json|```/g, "").trim());

    return NextResponse.json({ insights });
  } catch (err) {
    console.error("Claude API error:", err);
    return NextResponse.json({ error: "Failed to generate insights." }, { status: 500 });
  }
}