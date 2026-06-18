// Deno Supabase Edge Function for Have I Been Pwned checks.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Mock-lekkasjer som returneres i lokalt utviklingsmiljø hvis ingen
 * HIBP_API_KEY er satt. Sikrer en kjempefin ut-av-boksen opplevelse.
 */
const MOCK_BREACHES = [
  {
    Name: "Canva",
    Title: "Canva",
    Domain: "canva.com",
    BreachDate: "2019-05-24",
    AddedDate: "2019-05-28T04:22:18Z",
    Description: "In May 2019, the graphic design tool website Canva suffered a data breach...",
    DataClasses: ["Email addresses", "Passwords", "Names", "Usernames"],
  },
  {
    Name: "LinkedIn",
    Title: "LinkedIn",
    Domain: "linkedin.com",
    BreachDate: "2016-05-17",
    AddedDate: "2016-05-21T21:30:00Z",
    Description: "In May 2016, LinkedIn had a massive historical data dump of 167 million accounts...",
    DataClasses: ["Email addresses", "Passwords"],
  }
];

serve(async (req) => {
  // Håndter CORS Preflight-forespørsler (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST method is allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "A valid email address is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const hibpKey = Deno.env.get("HIBP_API_KEY");

    if (!hibpKey) {
      console.warn(
        "[check-breach] HIBP_API_KEY is not set in Supabase Edge Secrets. Returning mock sandbox results."
      );
      return new Response(
        JSON.stringify({
          breached: true,
          count: MOCK_BREACHES.length,
          breaches: MOCK_BREACHES,
          isMock: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Kall det offisielle HIBP API v3
    const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "hibp-api-key": hibpKey,
        "user-agent": "DigitalEU-BreachProxy/1.0",
        "Accept": "application/json"
      }
    });

    // 200: Kontoen er lekket
    if (response.status === 200) {
      const breaches = await response.json();
      return new Response(
        JSON.stringify({
          breached: true,
          count: breaches.length,
          breaches: breaches,
          isMock: false,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 404: Fantastisk nyhet! Ingen lekkasjer funnet
    if (response.status === 404) {
      return new Response(
        JSON.stringify({
          breached: false,
          count: 0,
          breaches: [],
          isMock: false,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 429: Rate limited
    if (response.status === 429) {
      return new Response(
        JSON.stringify({
          error: "Have I Been Pwned rate limit exceeded. Please try again in a few moments.",
          code: "rate_limited"
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Andre feil (f.eks. 401 Unauthorized for ugyldig nøkkel)
    const errText = await response.text();
    console.error(`HIBP API returned error status ${response.status}:`, errText);
    throw new Error(`HIBP check failed with status ${response.status}`);

  } catch (error: any) {
    console.error("Error in check-breach function:", error);
    return new Response(
      JSON.stringify({
        error: "An internal server error occurred while performing the breach check.",
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
