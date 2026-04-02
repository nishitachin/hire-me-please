import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: Request) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobDescription, userBackground } = await request.json();

  if (!jobDescription?.trim()) {
    return NextResponse.json({ error: "Job description is required" }, { status: 400 });
  }

  const prompt = `You are an expert career coach and hiring manager. Analyze the following job description (please open the link and read it clearly) against the candidate's background and return a detailed skill gap analysis.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE BACKGROUND:
${userBackground?.trim() || "Not provided — assess based on job description alone and mark all skills as needing evaluation."}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, just JSON):
{
  "job_title": "extracted job title",
  "company": "extracted company name or null",
  "match_score": <0-100 integer representing overall fit>,
  "skills": [
    {
      "name": "skill name",
      "level": "strong" | "partial" | "missing",
      "score": <0-100 integer>
    }
  ],
  "missing_skills": ["skill1", "skill2"],
  "learning_plan": [
    {
      "skill": "skill to learn",
      "resource": "specific resource name and URL if known",
      "type": "course" | "article" | "project" | "practice",
      "time_estimate": "e.g. 2 weeks, 5 hours"
    }
  ],
  "summary": "2-3 sentence honest assessment of fit and biggest opportunity areas"
}

Extract 5-8 of the most important skills from the job description. Be honest and specific. For the learning plan, only include items for missing or partial skills.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const result = JSON.parse(raw.replace(/```json|```/g, "").trim());

    // Save to database so we don't re-call Claude on every visit
    await supabase.from("ai_analyses").insert({
      user_id: user.id,
      job_description: jobDescription,
      result,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Claude API error:", err);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}