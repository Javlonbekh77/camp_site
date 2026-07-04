import { NextResponse } from "next/server";
import { buildStcGuideSystemPrompt, getFallbackGuideResponse, parseGroqRecommendation, type ChatMessage } from "@/lib/ai/stcGuide";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

// ─── Key pool: tries each key in order, skips 429/rate-limited ones ───────────
function getApiKeys(): string[] {
  return [
    process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
  ].filter((k): k is string => Boolean(k?.trim()));
}

async function callGroq(apiKey: string, model: string, safeMessages: ChatMessage[]) {
    const apiMessages = safeMessages.map(m => ({
      role: m.role,
      content: m.content
    }));

    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.8,
        max_tokens: 600,
        messages: [
          { role: "system", content: buildStcGuideSystemPrompt() },
          ...apiMessages,
        ],
      }),
    });

  return response;
}

export async function POST(request: Request) {
  const { messages } = (await request.json()) as { messages?: ChatMessage[] };
  const safeMessages = (messages ?? []).filter(
    (m) => m.role === "user" || m.role === "assistant"
  );

  const keys = getApiKeys();
  const fallback = getFallbackGuideResponse(safeMessages);
  const model = process.env.GROQ_MODEL ?? DEFAULT_MODEL;

  if (keys.length === 0) {
    console.log("[STC Guide] No API keys configured — using offline fallback");
    return NextResponse.json({ ok: true, source: "fallback", ...fallback });
  }

  // Try each key in sequence — skip if rate-limited (429) or auth error (401)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const keyLabel = `KEY_${i + 1}`;

    try {
      console.log(`[STC Guide] Trying ${keyLabel}...`);
      const response = await callGroq(key, model, safeMessages);

      // Rate limited or auth failure → try next key
      if (response.status === 429 || response.status === 401) {
        const errText = await response.text().catch(() => "");
        console.warn(`[STC Guide] ${keyLabel} → ${response.status}, trying next. ${errText.slice(0, 100)}`);
        continue;
      }

      // Other non-ok statuses (500, etc.) → skip this key
      if (!response.ok) {
        console.error(`[STC Guide] ${keyLabel} → ${response.status}`);
        continue;
      }

      const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };

      const content = payload.choices?.[0]?.message?.content?.trim();

      if (!content) {
        console.warn(`[STC Guide] ${keyLabel} returned empty content`);
        continue;
      }

      console.log(`[STC Guide] ${keyLabel} success, length: ${content.length}`);
      return NextResponse.json({
        ok: true,
        source: "groq",
        keyUsed: keyLabel,       // optional — visible in server logs only
        ...parseGroqRecommendation(content, fallback.answers ?? {}),
      });

    } catch (err) {
      console.error(`[STC Guide] ${keyLabel} fetch error:`, err instanceof Error ? err.message : err);
      // Network error → try next key
      continue;
    }
  }

  // All keys exhausted → offline fallback
  console.warn("[STC Guide] All keys exhausted — using offline fallback");
  return NextResponse.json({ ok: true, source: "fallback", ...fallback });
}
