import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const TWITTER_CRON_TOKEN = Deno.env.get("TWITTER_CRON_TOKEN") || "";

interface SummarizedArticle {
  articleId: string;
  title: string;
  url: string;
  summary: string;
}

/**
 * Daily Twitter posting orchestrator
 * Chains: summarize-news-for-twitter → post-to-twitter
 * Called daily at 09:00 UTC by Supabase Cron
 */
async function orchestrateTwitterPost(): Promise<{
  success: boolean;
  message: string;
  article?: SummarizedArticle;
  tweetId?: string;
  error?: string;
}> {
  try {
    // Step 1: Summarize latest news article
    console.log("Step 1: Summarizing latest article...");
    const summarizeResponse = await fetch(
      `${SUPABASE_URL}/functions/v1/summarize-news-for-twitter`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TWITTER_CRON_TOKEN}`,
        },
      },
    );

    if (!summarizeResponse.ok) {
      const error = await summarizeResponse.text();
      return {
        success: false,
        message: "Failed to summarize article",
        error,
      };
    }

    const summarizeData = (await summarizeResponse.json()) as {
      success: boolean;
      article?: SummarizedArticle;
      error?: string;
    };

    if (!summarizeData.success || !summarizeData.article) {
      return {
        success: false,
        message: "No article or failed to summarize",
        error: summarizeData.error,
      };
    }

    console.log("Article summarized:", summarizeData.article.title);

    // Step 2: Post tweet to Twitter
    console.log("Step 2: Posting tweet to Twitter...");
    const postResponse = await fetch(
      `${SUPABASE_URL}/functions/v1/post-to-twitter`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TWITTER_CRON_TOKEN}`,
        },
        body: JSON.stringify({
          article: summarizeData.article,
        }),
      },
    );

    if (!postResponse.ok) {
      const error = await postResponse.text();
      return {
        success: false,
        message: "Failed to post tweet",
        error,
        article: summarizeData.article,
      };
    }

    const postData = (await postResponse.json()) as {
      success: boolean;
      tweetId?: string;
      error?: string;
    };

    if (!postData.success) {
      return {
        success: false,
        message: "Tweet post failed",
        error: postData.error,
        article: summarizeData.article,
      };
    }

    console.log("Tweet posted successfully:", postData.tweetId);

    return {
      success: true,
      message: "Tweet posted successfully",
      article: summarizeData.article,
      tweetId: postData.tweetId,
    };
  } catch (err) {
    console.error("Error in twitter-daily-post:", err);
    return {
      success: false,
      message: "Orchestration failed",
      error: err instanceof Error ? err.message : "Unknown error",
    };
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
    // Verify authorization (Supabase Cron includes this)
    const authHeader = req.headers.get("authorization");
    const expectedToken = Deno.env.get("TWITTER_CRON_TOKEN");
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await orchestrateTwitterPost();

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Error in twitter-daily-post handler:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Handler error",
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
