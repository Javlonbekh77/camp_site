import { NextResponse } from "next/server";
import { buildStcGuideSystemPrompt, getFallbackGuideResponse, parseGroqRecommendation, type ChatMessage } from "@/lib/ai/stcGuide";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

// Current active Groq models (as of 2026):
// llama-3.3-70b-versatile, llama-3.1-8b-instant, mixtral-8x7b-32768, gemma2-9b-it
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export async function POST(request: Request) {
  const { messages } = (await request.json()) as { messages?: ChatMessage[] };
  const safeMessages = (messages ?? []).filter(
    (m) => m.role === "user" || m.role === "assistant"
  );

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.log("[STC Guide] No GROQ_API_KEY — using fallback");
    return NextResponse.json({
      ok: true,
      source: "fallback",
      ...getFallbackGuideResponse(safeMessages)
    });
  }

  const fallback = getFallbackGuideResponse(safeMessages);
  const model = process.env.GROQ_MODEL ?? DEFAULT_MODEL;

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: 1000,
        messages: [
          { role: "system", content: buildStcGuideSystemPrompt() },
          ...safeMessages
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[STC Guide] Groq API error:", response.status, errText);
      // Return fallback but with a warning in the console
      return NextResponse.json({
        ok: true,
        source: "fallback",
        warning: `Groq ${response.status}: ${errText}`,
        ...fallback
      });
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = payload.choices?.[0]?.message?.content?.trim();

    if (!content) {
      console.error("[STC Guide] Empty content from Groq");
      return NextResponse.json({ ok: true, source: "fallback", ...fallback });
    }

    console.log("[STC Guide] Groq response received, length:", content.length);

    return NextResponse.json({
      ok: true,
      source: "groq",
      ...parseGroqRecommendation(content, fallback.answers ?? {})
    });
  } catch (error) {
    console.error("[STC Guide] Fetch error:", error);
    return NextResponse.json({
      ok: true,
      source: "fallback",
      warning: error instanceof Error ? error.message : "Network error",
      ...fallback
    });
  }
}
