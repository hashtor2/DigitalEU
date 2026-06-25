Hermes Agent is running 24/7 on your Hetzner server and connected to Telegram (@Mycli66bot), locked to your account. Just message the bot anytime.

**AI provider:** Gemini (`gemini-2.5-pro`) via `GOOGLE_API_KEY` in `/root/.hermes/.env`. `ANTHROPIC_API_KEY` is disabled.

Quick reference if you ever need it (SSH in with `ssh -i ~/.ssh/digitaleu_hetzner root@167.233.54.232`):
- `hermes gateway status` — check it's running
- `hermes gateway restart` — restart after any `.env` or config change
- `hermes model` — switch Gemini model if you change your mind on cost
- `grep -A4 '^model:' ~/.hermes/config.yaml` — show current model config

After editing `/root/.hermes/.env`, always run `hermes gateway restart` (config is not hot-reloaded).
