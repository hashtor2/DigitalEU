import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const MISTRAL_API_KEY = Deno.env.get("MISTRAL_API_KEY") || "";

interface SummarizedArticle {
  articleId: string;
  title: string;
  url: string;
  summary: string;
}

/**
 * Call Mistral API to summarize article content
 */
async function summarizeWithMistral(
  title: string,
  description: string,
): Promise<string> {
  const prompt = `You are a tech news summarizer. Create a concise, engaging tweet (under 250 chars) summarizing this news:

Title: ${title}
Description: ${description}

Respond with ONLY the tweet text, no additional formatting.`;

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error(
        `Mistral API error: ${response.status} ${response.statusText}`,
      );
      return "";
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content || "";
  } catch (err) {
    console.error("Error calling Mistral API:", err);
    return "";
  }
}

/**
 * Fetch the latest unposted article
 */
async function fetchLatestArticle(
  supabase: ReturnType<typeof createClient>,
): Promise<{ id: string; title: string; url: string; description: string } | null> {
  const { data, error } = await supabase
    .from("daily_news_articles")
    .select("id, title, url, description")
    .order("scraped_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching article:", error);
    return null;
  }

  return data;
}

/**
 * Generate summary and tweet text for an article
 */
async function generateSummary(
  article: {
    id: string;
    title: string;
    url: string;
    description: string;
  },
): Promise<SummarizedArticle | null> {
  const summary = await summarizeWithMistral(article.title, article.description);

  if (!summary) {
    console.error("Failed to generate summary for article:", article.id);
    return null;
  }

  return {
    articleId: article.id,
    title: article.title,
    url: article.url,
    summary: summary.trim(),
  };
}

Deno.serve(async (req: Request) => {
  // CORS headers
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get("authorization");
    const expectedToken = Deno.env.get("TWITTER_CRON_TOKEN");
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Fetch latest article
    const article = await fetchLatestArticle(supabase);
    if (!article) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No articles found",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    console.log(`Summarizing article: ${article.title}`);

    // Generate summary using Mistral
    const summarized = await generateSummary(article);
    if (!summarized) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to generate summary",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        article: summarized,
        message: "Article summary generated successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (err) {
    console.error("Error in summarize-news-for-twitter:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
});
