// Kobler en persona til Claude Agent SDK (headless Claude Code). Hver agent
// kjører som en egen session med persona som system-prompt, full verktøytilgang,
// i sitt eget git worktree.
import { readFile } from "node:fs/promises";
import { query } from "@anthropic-ai/claude-agent-sdk";
import type { AgentDef } from "./config.js";

// Per-agent session-id, slik at hver Telegram-chat beholder kontekst.
const sessions = new Map<string, string>();

// Runtime-vakter — legges til persona. Endrer ikke rollen, men holder agenten
// innenfor trygge rammer når den kjører uovervåket via Telegram.
function guardrails(agent: AgentDef): string {
  return [
    "## Operational mode (runtime safety — additive to your role)",
    "You are running headless, controlled by the owner over Telegram, with full",
    `tool access inside an isolated git worktree on branch \`${agent.branch}\`.`,
    "No one is watching a terminal, so: act on the request, then summarize what you did.",
    "Hard rules:",
    "- Stay inside this worktree. Never touch files outside it.",
    "- When you change files, commit to your own branch; never merge or push to `main`.",
    "- Never run destructive commands (rm -rf, hard resets on shared refs, force-push).",
    "- Never print, log, or transmit secrets, tokens, or .env contents.",
    "- Keep replies concise and phone-readable; lead with the result.",
  ].join("\n");
}

export async function runAgent(
  agent: AgentDef,
  userText: string,
  worktree: string,
): Promise<string> {
  const personaText = await readFile(agent.personaFile, "utf8");
  const append = `${personaText}\n\n${guardrails(agent)}`;
  const resume = sessions.get(agent.key);

  const response = query({
    prompt: userText,
    options: {
      systemPrompt: { type: "preset", preset: "claude_code", append },
      cwd: worktree,
      permissionMode: "bypassPermissions",
      ...(resume ? { resume } : {}),
    },
  });

  let finalText = "";
  // SDK-meldinger: system(init) -> assistant/user(...) -> result(final).
  for await (const message of response as AsyncIterable<any>) {
    if (message?.session_id) sessions.set(agent.key, message.session_id);
    if (message?.type === "result") {
      finalText =
        message.subtype === "success"
          ? message.result
          : `(agent stopped: ${message.subtype})`;
    }
  }
  return finalText || "(no response)";
}

export function resetSession(key: string): void {
  sessions.delete(key);
}

export function hasSession(key: string): boolean {
  return sessions.has(key);
}
