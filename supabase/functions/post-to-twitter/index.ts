import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const TWITTER_BEARER_TOKEN = Deno.env.get("TWITTER_BEARER_TOKEN") || "";

interface PostTwitterRequest {
  article: {
    articleId: string;
    title: string;
    url: string;
    summary: string;
  };
}

/**
 * Post tweet to X (Twitter) API v2
 */
async function postToTwitter(tweetText: string): Promise<{ id: string }> {
  const response = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
    },
    body: JSON.stringify({
      text: tweetText,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      `Twitter API error: ${response.status} - ${error}`,
    );
  }

  const data = (await response.json()) as { data?: { id: string } };
  return data.data || { id: "" };
}

/**
 * Record posted tweet in database for tracking
 */
async function recordPostedTweet(
  supabase: ReturnType<typeof createClient>,
  articleId: string,
  tweetId: string,
  tweetText: string,
): Promise<boolean> {
  try {
    const { error } = await supabase.from("posted_tweets").insert({
      article_id: articleId,
      twitter_id: tweetId,
      text: tweetText,
      posted_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error recording tweet:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error recording tweet:", err);
    return false;
  }
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

    const body = (await req.json()) as PostTwitterRequest;

    if (!body.article || !body.article.summary) {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { article } = body;

    // Construct tweet text with link
    const tweetText = `${article.summary}\n\n${article.url}\n\n#EU #Tech #Privacy`;

    console.log(`Posting tweet: ${tweetText}`);

    // Post to Twitter
    const tweetResult = await postToTwitter(tweetText);

    // Record in database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    await recordPostedTweet(
      supabase,
      article.articleId,
      tweetResult.id,
      tweetText,
    );

    return new Response(
      JSON.stringify({
        success: true,
        tweetId: tweetResult.id,
        message: "Tweet posted successfully",
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
    console.error("Error in post-to-twitter:", err);
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
