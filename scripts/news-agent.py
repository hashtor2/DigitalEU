"""
EU Tech News Daily Agent
Fetches top EU tech stories, summarizes with Gemini, posts to Telegram + saves to Supabase.
"""

import os
import sys
import requests
import feedparser
from google import genai
from datetime import datetime, timezone, date
from pathlib import Path
from dotenv import load_dotenv

# Load .env only if running locally (not in GitHub Actions)
if not os.environ.get("GITHUB_ACTIONS"):
    load_dotenv(Path(__file__).parent / ".env")

# ── Config ──────────────────────────────────────────────────────────────────
TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash")
CHAT_ID = os.environ.get("CHAT_ID", "539927333")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

# Validate required env vars
if not TELEGRAM_TOKEN:
    raise ValueError("TELEGRAM_TOKEN env var is not set")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY (or GOOGLE_API_KEY) env var is not set")

EU_TECH_FEEDS = [
    "https://techcrunch.com/tag/europe/feed/",
    "https://www.sifted.eu/feed",
    "https://feeds.feedburner.com/Techcrunch",
    "https://thenextweb.com/feed/",
    "https://www.euractiv.com/sections/digital/feed/",
]

# ── Telegram ─────────────────────────────────────────────────────────────────

def send_telegram(text: str):
    r = requests.post(
        f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
        json={"chat_id": CHAT_ID, "text": text, "parse_mode": "HTML", "disable_web_page_preview": False},
        timeout=15,
    )
    r.raise_for_status()


# ── RSS fetching ─────────────────────────────────────────────────────────────

def fetch_stories(max_per_feed=5) -> list[dict]:
    stories = []
    for feed_url in EU_TECH_FEEDS:
        try:
            feed = feedparser.parse(feed_url)
            for entry in feed.entries[:max_per_feed]:
                stories.append({
                    "title": entry.get("title", ""),
                    "summary": entry.get("summary", entry.get("description", ""))[:500],
                    "link": entry.get("link", ""),
                    "published": entry.get("published", ""),
                    "source": feed.feed.get("title", feed_url),
                })
        except Exception as e:
            print(f"Feed error ({feed_url}): {e}")
    return stories


# ── Gemini summarization ─────────────────────────────────────────────────────

def summarize_with_gemini(stories: list[dict]) -> str:
    client = genai.Client(api_key=GEMINI_API_KEY)
    today = datetime.now(timezone.utc).strftime("%A, %d %B %Y")
    stories_text = "\n\n".join(
        f"[{i+1}] {s['title']}\nSource: {s['source']}\nURL: {s['link']}\nSnippet: {s['summary']}"
        for i, s in enumerate(stories[:20])
    )

    prompt = f"""You are a curator for a daily EU tech news digest sent to people building privacy-first European digital products.

Today is {today}.

Here are today's stories from EU tech feeds:

{stories_text}

Pick the 4-5 most relevant and interesting stories — prioritize:
- European tech companies, startups, regulation (GDPR, DSA, AI Act, NIS2)
- Privacy, digital sovereignty, open source
- Alternatives to Big Tech

Write a Telegram-ready digest in this format (plain text, no markdown, use HTML for links):

🇪🇺 EU Tech Daily — {today}

For each story (4-5 total):
📌 [Story title as <a href="URL">linked title</a>]
One sentence explaining why this matters for EU digital sovereignty or tech builders.

End with:
—
🤖 Powered by Gemini + digitaleu.me
"""

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )
    return response.text


# ── Supabase save ─────────────────────────────────────────────────────────────

def save_to_supabase(digest_text: str, stories: list[dict]):
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("Supabase not configured — skipping save.")
        return

    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/news_digests",
        headers={
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates",
        },
        json={
            "digest_date": date.today().isoformat(),
            "digest_text": digest_text,
            "stories": stories,
            "telegram_posted": True,
        },
        timeout=15,
    )
    if r.status_code in (200, 201):
        print(f"Saved digest for {date.today()} to Supabase.")
    else:
        print(f"Supabase save failed: {r.status_code} {r.text}")


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    print(f"[{datetime.now().isoformat()}] EU Tech News Agent starting...")

    print("Fetching stories...")
    stories = fetch_stories()
    print(f"Fetched {len(stories)} stories from {len(EU_TECH_FEEDS)} feeds")

    if not stories:
        send_telegram("⚠️ EU Tech Daily: No stories fetched today.")
        return

    print(f"Summarizing with Gemini ({GEMINI_MODEL})...")
    digest = summarize_with_gemini(stories)

    print("Posting to Telegram...")
    send_telegram(digest)

    print("Saving to Supabase...")
    save_to_supabase(digest, stories)

    print("Done!")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"ERROR: {type(e).__name__}: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
