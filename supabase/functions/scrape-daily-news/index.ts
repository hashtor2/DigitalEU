import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface Article {
  title: string;
  url: string;
  description: string;
  image_url?: string;
  source: "TechCrunch" | "Euractiv" | "Politico";
}

/**
 * Parse RSS feed XML and extract articles
 */
function parseRSSFeed(
  xml: string,
  source: "TechCrunch" | "Euractiv" | "Politico",
): Article[] {
  const articles: Article[] = [];

  // Simple regex-based parsing (since no XML library available)
  // Match <item> tags
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];

    // Extract fields
    const titleMatch = itemContent.match(/<title>([^<]+)<\/title>/);
    const linkMatch = itemContent.match(/<link>([^<]+)<\/link>/);
    const descMatch = itemContent.match(/<description>([^<]+)<\/description>/);
    const imageMatch = itemContent.match(/<image>?<url>?([^<]+)<\/url>?<\/image>/);

    if (titleMatch && linkMatch) {
      articles.push({
        title: titleMatch[1].trim(),
        url: linkMatch[1].trim(),
        description: descMatch ? descMatch[1].trim().substring(0, 200) : "",
        image_url: imageMatch ? imageMatch[1].trim() : undefined,
        source,
      });
    }
  }

  return articles;
}

/**
 * Fetch and parse RSS feed
 */
async function fetchRSSFeed(
  url: string,
  source: "TechCrunch" | "Euractiv" | "Politico",
): Promise<Article[]> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${source}: ${response.statusText}`);
      return [];
    }

    const xml = await response.text();
    return parseRSSFeed(xml, source);
  } catch (err) {
    console.error(`Error fetching ${source}:`, err);
    return [];
  }
}

/**
 * Insert articles into database, skipping duplicates
 */
async function insertArticles(
  supabase: ReturnType<typeof createClient>,
  articles: Article[],
): Promise<{ inserted: number; skipped: number; errors: string[] }> {
  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const article of articles) {
    try {
      const { error } = await supabase.from("daily_news_articles").insert({
        title: article.title,
        url: article.url,
        source: article.source,
        description: article.description,
        image_url: article.image_url,
        scraped_at: new Date().toISOString(),
      });

      if (error) {
        // Unique constraint error (duplicate URL) — skip silently
        if (error.code === "23505") {
          skipped++;
        } else {
          errors.push(`${article.title}: ${error.message}`);
        }
      } else {
        inserted++;
      }
    } catch (err) {
      errors.push(
        `${article.title}: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }

  return { inserted, skipped, errors };
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
    // Verify authorization (cron jobs should include Authorization header)
    const authHeader = req.headers.get("authorization");
    const expectedToken = Deno.env.get("SCRAPER_CRON_TOKEN");
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // RSS feed URLs
    const feeds = [
      {
        url: "https://techcrunch.com/category/startups/feed/",
        source: "TechCrunch" as const,
      },
      { url: "https://www.euractiv.com/feed/", source: "Euractiv" as const },
      {
        url: "https://www.politico.eu/feed/",
        source: "Politico" as const,
      },
    ];

    console.log("Starting daily news scrape...");

    // Fetch all feeds in parallel
    const allArticles = await Promise.all(
      feeds.map(({ url, source }) => fetchRSSFeed(url, source)),
    ).then((results) => results.flat());

    console.log(`Fetched ${allArticles.length} articles from all sources`);

    // Insert into database
    const result = await insertArticles(supabase, allArticles);

    console.log(
      `Inserted: ${result.inserted}, Skipped: ${result.skipped}, Errors: ${result.errors.length}`,
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Daily news scrape completed",
        stats: {
          totalArticles: allArticles.length,
          inserted: result.inserted,
          skipped: result.skipped,
          errors: result.errors,
        },
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
    console.error("Error in scrape-daily-news:", err);
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
