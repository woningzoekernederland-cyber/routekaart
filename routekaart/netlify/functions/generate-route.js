/**
 * Netlify Function: generate-route
 *
 * Receives a POST with { prompt: string } from the frontend,
 * calls the Anthropic API server-side (API key never reaches the browser),
 * and returns { text: string } or { error: string, code: string }.
 *
 * Environment variable required:
 *   ANTHROPIC_API_KEY  — set in Netlify > Site Settings > Environment variables
 */

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL         = "claude-sonnet-4-5";   // beste model voor geografische kennis
const MAX_TOKENS    = 4096;
const TIMEOUT_MS    = 55000; // Netlify functions time out at 60 s; leave margin

exports.handler = async function (event) {
  // ── CORS headers (allow the Netlify site's own origin) ──
  const headers = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }),
    };
  }

  // ── Parse request body ──
  let prompt;
  try {
    const body = JSON.parse(event.body || "{}");
    prompt = body.prompt;
    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 20) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing or invalid prompt", code: "BAD_REQUEST" }),
      };
    }
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid JSON body", code: "BAD_REQUEST" }),
    };
  }

  // ── Check API key ──
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !apiKey.startsWith("sk-ant-")) {
    console.error("[generate-route] ANTHROPIC_API_KEY is missing or malformed");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Server configuration error: API key not set",
        code:  "AUTH",
      }),
    };
  }

  // ── Call Anthropic with timeout ──
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const anthropicRes = await fetch(ANTHROPIC_URL, {
      method:  "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         apiKey,
        "anthropic-version": "2023-06-01",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: MAX_TOKENS,
        messages:   [{ role: "user", content: prompt }],
      }),
    });

    clearTimeout(timer);

    // ── Handle Anthropic error responses ──
    if (!anthropicRes.ok) {
      let errBody = {};
      try { errBody = await anthropicRes.json(); } catch { /* ignore */ }

      console.error(
        `[generate-route] Anthropic error ${anthropicRes.status}:`,
        JSON.stringify(errBody)
      );

      const codeMap = {
        401: "AUTH",
        403: "AUTH",
        429: "RATE_LIMIT",
        500: "SERVER",
        529: "SERVER",
      };
      const code = codeMap[anthropicRes.status] || `HTTP_${anthropicRes.status}`;

      return {
        statusCode: anthropicRes.status,
        headers,
        body: JSON.stringify({
          error: errBody?.error?.message || `Anthropic API error ${anthropicRes.status}`,
          code,
        }),
      };
    }

    // ── Parse successful response ──
    const data    = await anthropicRes.json();
    const rawText = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text || "")
      .join("");

    if (!rawText.trim()) {
      console.error("[generate-route] Anthropic returned empty content");
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: "Empty response from AI", code: "EMPTY_RESPONSE" }),
      };
    }

    console.log(
      `[generate-route] OK — ${rawText.length} chars, model: ${data.model}, ` +
      `tokens: ${data.usage?.input_tokens}in / ${data.usage?.output_tokens}out`
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text: rawText }),
    };

  } catch (err) {
    clearTimeout(timer);

    if (err.name === "AbortError") {
      console.error("[generate-route] Request timed out");
      return {
        statusCode: 504,
        headers,
        body: JSON.stringify({ error: "Request timed out", code: "TIMEOUT" }),
      };
    }

    console.error("[generate-route] Unexpected error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: `Unexpected server error: ${err.message}`,
        code:  "SERVER",
      }),
    };
  }
};
