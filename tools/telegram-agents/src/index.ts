// Entrypoint: starter én Telegram-bot per agent som har en token i env-filen.
// Eier-allowlist på hver melding; ruter tekst til riktig agent; svarer i chatten.
import { Bot } from "grammy";
import {
  activeAgents,
  ensureWorktree,
  OWNER_ID,
} from "./config.js";
import { runAgent, resetSession, hasSession } from "./agent.js";

const TELEGRAM_LIMIT = 4000; // Telegram-tak er 4096; vi deler litt under.

async function sendLong(ctx: any, text: string): Promise<void> {
  for (let i = 0; i < text.length; i += TELEGRAM_LIMIT) {
    await ctx.reply(text.slice(i, i + TELEGRAM_LIMIT));
  }
}

function main(): void {
  if (!OWNER_ID) {
    console.error("✋ OWNER_TELEGRAM_ID mangler i env-filen. Avbryter.");
    process.exit(1);
  }
  const agents = activeAgents();
  if (agents.length === 0) {
    console.error("✋ Fant ingen bot-tokens i env-filen. Avbryter.");
    process.exit(1);
  }

  console.log(`Eier: ${OWNER_ID}. Starter ${agents.length} bot(er)...`);

  for (const agent of agents) {
    const token = process.env[agent.envVar]!;
    const bot = new Bot(token);

    // Sikkerhet: ignorer alle andre enn eier (token-lekkasje-vakt).
    bot.use(async (ctx, next) => {
      if (ctx.from?.id !== OWNER_ID) return;
      await next();
    });

    bot.command("start", (ctx) =>
      ctx.reply(
        `👋 ${agent.role} online.\nSend en oppgave. /reset tømmer kontekst, /status viser tilstand.`,
      ),
    );
    bot.command("reset", (ctx) => {
      resetSession(agent.key);
      return ctx.reply("🔄 Kontekst tømt.");
    });
    bot.command("status", (ctx) =>
      ctx.reply(
        `Rolle: ${agent.role}\nBranch: ${agent.branch}\nSession: ${
          hasSession(agent.key) ? "aktiv" : "fersk"
        }`,
      ),
    );

    bot.on("message:text", async (ctx) => {
      const text = ctx.message.text;
      if (text.startsWith("/")) return; // ukjente kommandoer ignoreres

      // Hold "skriver..."-indikatoren i live mens agenten jobber (kan ta minutter).
      const typing = setInterval(() => {
        ctx.replyWithChatAction("typing").catch(() => {});
      }, 6000);
      ctx.replyWithChatAction("typing").catch(() => {});

      // Audit-logg (fanges av journald på VM-en, jf. spec §6.5).
      const ts = new Date().toISOString();
      console.log(`${ts} [${agent.key}] <- ${text.slice(0, 120).replace(/\s+/g, " ")}`);

      try {
        const wt = await ensureWorktree(agent);
        const reply = await runAgent(agent, text, wt);
        clearInterval(typing);
        await sendLong(ctx, reply);
        console.log(`${new Date().toISOString()} [${agent.key}] -> ok (${reply.length} chars)`);
      } catch (e: any) {
        clearInterval(typing);
        await ctx.reply("⚠️ Feil: " + (e?.message ?? String(e)));
        console.error(`${new Date().toISOString()} [${agent.key}] -> error: ${e?.message ?? e}`);
      }
    });

    bot.catch((err) => console.error(`[${agent.key}]`, err.error ?? err));

    void bot.start({
      onStart: (info) =>
        console.log(`✅ ${agent.role} live som @${info.username}`),
    });
  }
}

main();
