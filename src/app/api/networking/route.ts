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

  const { jobDescription, userBackground } = await request.json();

  if (!jobDescription?.trim()) {
    return NextResponse.json({ error: "Job description is required" }, { status: 400 });
  }

  const prompt = `You are an expert career coach who specializes in helping people network their way into jobs. Based on the job posting below, generate personalized outreach messages for 3 different types of people the candidate should contact.

JOB POSTING:
${jobDescription}

CANDIDATE BACKGROUND:
${userBackground?.trim() || "Not provided — write messages that work for a general candidate."}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, just JSON):
{
  "job_title": "extracted job title",
  "company": "extracted company name",
  "recipients": [
    {
      "recipient_type": "e.g. Recruiter at [Company]",
      "why": "one sentence on why reaching out to this person is valuable",
      "message": "the full LinkedIn message, warm and human but direct, under 150 words"
    },
    {
      "recipient_type": "e.g. Engineer on the team",
      "why": "...",
      "message": "..."
    },
    {
      "recipient_type": "e.g. Alumni from your school who works there",
      "why": "...",
      "message": "..."
    }
  ]
}

Rules for the messages:
- Warm, genuine, and conversational — not stiff or corporate
- Reference something specific about the company or role to show genuine interest
- Under 150 words each — busy people don't read long cold messages
- End with a low-pressure ask (15-min chat, happy to share portfolio, etc.)
- Use [Your Name] as a placeholder for the sender
- Do NOT use hollow phrases like "I hope this message finds you well" or "I wanted to reach out"
- Each message should feel distinct — different tone for recruiter vs peer vs alumni`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const result = JSON.parse(raw.replace(/```json|```/g, "").trim());

    return NextResponse.json(result);
  } catch (err) {
    console.error("Claude API error:", err);
    return NextResponse.json({ error: "Failed to generate messages. Please try again." }, { status: 500 });
  }
}