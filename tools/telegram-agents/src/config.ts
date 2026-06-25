// Konfigurasjon: laster bot-tokens fra den lokale (ikke-committede) env-filen,
// mapper hver token til en persona-fil + branch, og styrer git worktrees.
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import dotenv from "dotenv";
import { git } from "./git.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// tools/telegram-agents/src -> repo-rot er tre nivåer opp.
export const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

// Hemmeligheter ligger UTENFOR repoet (jf. docs/TELEGRAM_AGENTS.md §6).
export const ENV_FILE =
  process.env.BOTS_ENV_FILE || path.join(os.homedir(), "digitaleu-bots.env");

// Hver agent jobber i et eget git worktree, søsken-mappe til repoet.
export const WORKTREE_ROOT = path.resolve(
  REPO_ROOT,
  "..",
  "digitaleu-agent-worktrees",
);

dotenv.config({ path: ENV_FILE });

// Claude Agent SDK leser ANTHROPIC_API_KEY. Er den ikke en ekte Anthropic-nøkkel
// (f.eks. en OpenRouter-nøkkel sk-or-…), fjern den slik at SDK-en faller tilbake
// til Claude Code-abonnementet (OAuth) i stedet for å få 401 Invalid API key.
const apiKey = process.env.ANTHROPIC_API_KEY;
if (apiKey && !apiKey.startsWith("sk-ant-")) {
  delete process.env.ANTHROPIC_API_KEY;
  console.warn(
    "⚠️  ANTHROPIC_API_KEY er ikke en Anthropic-nøkkel (sk-ant-…); ignorerer den og bruker Claude Code-abonnementet.",
  );
}

export const OWNER_ID = Number(process.env.OWNER_TELEGRAM_ID || 0);

export interface AgentDef {
  key: string; // kort id, brukt i branch + worktree-mappe
  role: string; // visningsnavn
  envVar: string; // env-variabel med bot-token
  personaFile: string; // absolutt sti til persona-prompten
  branch: string; // git-branch agenten jobber på
}

function persona(file: string): string {
  return path.join(REPO_ROOT, "docs", "agents", file);
}

// Alle 10 defineres; bare de med en token i env-filen startes (se activeAgents).
export const AGENTS: AgentDef[] = [
  { key: "ceo", role: "CEO / Chief Strategist", envVar: "BOT_01_CEO", personaFile: persona("01-ceo.md"), branch: "agent/ceo" },
  { key: "marketer", role: "CMO / Marketer", envVar: "BOT_02_MARKETER", personaFile: persona("02-marketer.md"), branch: "agent/marketer" },
  { key: "writer", role: "Editor / Writer", envVar: "BOT_03_WRITER", personaFile: persona("03-writer.md"), branch: "agent/writer" },
  { key: "designer", role: "Head of Design / UX", envVar: "BOT_04_DESIGNER", personaFile: persona("04-designer.md"), branch: "agent/designer" },
  { key: "engineer", role: "Lead Engineer", envVar: "BOT_05_ENGINEER", personaFile: persona("05-engineer.md"), branch: "agent/engineer" },
  { key: "legal", role: "Legal & Privacy Counsel", envVar: "BOT_06_LEGAL", personaFile: persona("06-legal.md"), branch: "agent/legal" },
  { key: "partnerships", role: "Head of Partnerships", envVar: "BOT_07_PARTNERSHIPS", personaFile: persona("07-partnerships.md"), branch: "agent/partnerships" },
  { key: "support", role: "Customer Support Lead", envVar: "BOT_08_SUPPORT", personaFile: persona("08-support.md"), branch: "agent/support" },
  { key: "researcher", role: "Research / Analyst", envVar: "BOT_09_RESEARCHER", personaFile: persona("09-researcher.md"), branch: "agent/researcher" },
  { key: "devops", role: "DevOps / Release", envVar: "BOT_10_DEVOPS", personaFile: persona("10-devops.md"), branch: "agent/devops" },
];

export function activeAgents(): AgentDef[] {
  return AGENTS.filter((a) => !!process.env[a.envVar]);
}

export function worktreePathFor(agent: AgentDef): string {
  return path.join(WORKTREE_ROOT, agent.key);
}

// Idempotent: oppretter (eller gjenbruker) agentens worktree på branch agent/<key>.
export async function ensureWorktree(agent: AgentDef): Promise<string> {
  const wt = worktreePathFor(agent);
  if (existsSync(path.join(wt, ".git"))) return wt;
  // -B: opprett eller nullstill branch til HEAD, og sjekk ut i nytt worktree.
  await git(["worktree", "add", "-B", agent.branch, wt, "HEAD"], REPO_ROOT);
  return wt;
}
