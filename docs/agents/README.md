# AI-agenter for digitaleu.me ("Layer 1")

Dette er en mappe med **ferdige system-prompts**. Hver fil gjør én AI om til ett
medlem av et virtuelt team for digitaleu.me. Lim hele filinnholdet inn som
første melding (eller "system prompt" / "custom instructions") i hvilken som
helst AI — Claude, Gemini, ChatGPT — så blir den AI-en den rollen.

## Slik bruker du dem
1. Åpne en ny chat / nytt prosjekt i AI-en du vil bruke.
2. Kopier **hele** innholdet i den aktuelle `.md`-filen.
3. Lim inn som første melding (eller som "system prompt"/"custom instructions"
   der det finnes).
4. Skriv hva du trenger. Agenten kjenner prosjektet og vet hvem de andre
   agentene er, og sier fra når noe heller bør tas av en annen rolle.

## Hvorfor self-contained?
Hver prompt inneholder hele prosjektkonteksten (Block A) og hele team-oversikten
(Block B) i seg selv. Det gir litt repetisjon, men gjør at promptene virker i
en hvilken som helst AI **uten tilgang til dette repoet**.

## Holde dem oppdatert
Block A og Block B er like i alle filene. Endrer vi noe sentralt i prosjektet,
oppdater Block A i alle åtte filene (eller be Claude Code gjøre det). Block C er
unik per rolle.

## Teamet
| # | Fil | Rolle |
|---|-----|-------|
| 1 | `01-ceo.md` | CEO / sjefsstrateg — full oversikt, prioritering, sparringspartner |
| 2 | `02-marketer.md` | CMO / markedsfører — posisjonering, vekst, affiliate, launch, SEO |
| 3 | `03-writer.md` | Redaktør / skribent — nyhetsbrev, blogg, Substack |
| 4 | `04-designer.md` | Designsjef / UX — produkt- og merkevaredesign |
| 5 | `05-engineer.md` | Teknisk leder — arkitektur, stack, sikkerhet |
| 6 | `06-legal.md` | Juridisk & personvern — GDPR, vilkår, OAuth-scopes |
| 7 | `07-partnerships.md` | Partnerskapssjef — affiliate-avtaler, EU-leverandører |
| 8 | `08-support.md` | Kundestøtteleder — brukerhjelp, FAQ, tone |

## Senere ("Layer 2")
Når du har gjentakende, autonome arbeidsflyter verdt å automatisere, kan disse
samme personaene flyttes inn i et alltid-på orkestreringsoppsett (f.eks.
OpenClaw eller CrewAI/LangGraph) på en GCP/Azure-VM. Vær obs på sikkerhet:
verktøy som OpenClaw krever brede tilganger og er flagget av sikkerhetsforskere
— sandkasse det hardt og hold det unna ekte brukerdata, gitt at hele merkevaren
vår handler om personvern.
