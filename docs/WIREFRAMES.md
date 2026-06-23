# Wireframes — Landing Redesign (June 2026)

## Overview
New navigation structure with 6-page site. Landing page is entry point with dual CTA (manual service selection vs OAuth inbox scan). Both paths lead to report with HIBP results, alternatives, and next steps.

---

## Wireframe 1: Landing Page (/)

```
┌─────────────────────────────────────────────────────────────────┐
│ [LOGO] digitaleu.me    [Nav: How|Dir|News|Guides|About]  [☀/☀]  │
│                                              [For Business →]    │
└─────────────────────────────────────────────────────────────────┘

Hero Section:
┌──────────────────────────────────────────────────────────────┐
│  Reclaim Your Digital Life                                    │
│  Move away from Big Tech to trusted European tools            │
│                                                                │
│  ┌──────────────────┐    OR    ┌──────────────────┐          │
│  │ [Check Services] │          │  [Scan Inbox]    │          │
│  │ (5 min, no auth) │          │  (Auto-detect)   │          │
│  └──────────────────┘          └──────────────────┘          │
│                                                                │
│  ✓ Zero-knowledge • 🇪🇺 EU-first • No tracking               │
└──────────────────────────────────────────────────────────────┘

Manual Path (if "Check Services"):
┌──────────────────────────────────────────────────────────────┐
│  Which services do you use?                                   │
│                                                                │
│  ☐ Gmail        ☐ Outlook      ☐ Yahoo                      │
│  ☐ Netflix      ☐ Spotify      ☐ Adobe                      │
│  ☐ Microsoft    ☐ Google Drive ☐ Dropbox                    │
│  ... (more)                                                   │
│                                                                │
│                    [Get My Report →]                         │
└──────────────────────────────────────────────────────────────┘

Footer:
┌──────────────────────────────────────────────────────────────┐
│ Links to EU tech | Newsletter signup ↓ | © 2026              │
└──────────────────────────────────────────────────────────────┘
```

**Key behaviors:**
- Manual first (reduces adoption friction)
- Scan second (OAuth-powered auto-detection)
- Both lead to same report page
- Trust signals below CTA

---

## Wireframe 2: Report Page (/report)

```
┌──────────────────────────────────────────────────────────────┐
│  Your Privacy Report                                          │
│  Generated just now                                           │
│                                                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Security Check: Email is IN 3 known breaches       │    │
│  │ 🔴 Exposed in: LinkedIn (2021), Adobe (2013), Yahoo │    │
│  │ → Action: Change password. See alternatives.        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                                │
│  Services You Use:                                    [5 items]│
│                                                                │
│   Gmail  🇺🇸      └→ Tutanota (🇩🇪)                         │
│   Spotify 🇸🇪      └→ Tidal (🇳🇴)                            │
│   Dropbox 🇺🇸      └→ Nextcloud (EU-hosted)                  │
│   Netflix 🇺🇸      └→ (limited EU alt)                       │
│   Adobe 🇺🇸        └→ Affinity (🇬🇧) / Krita (open)        │
│                                                                │
│  [View Full Directory] [Save Report as PDF]                   │
│                                                                │
│  Next Steps:                                                   │
│  1. Create new email at Tutanota                              │
│  2. Migrate your important data                               │
│  3. Deactivate old accounts                                   │
│  ... or $29 for Premium setup guide                           │
└──────────────────────────────────────────────────────────────┘
```

**Components:**
- HIBP breach alert (red if exposed)
- Service detection results
- Alternative suggestions with country flags
- Next steps + CTA to premium

---

## Wireframe 3: How It Works (/how)

```
┌──────────────────────────────────────────────────────────────┐
│  How digitaleu.me Works                                       │
│                                                                │
│  Step 1: You Tell Us (or We Scan)                            │
│  Manual: Check boxes for services you use.                   │
│  OR Scan: Give OAuth → we read *only* metadata.              │
│  ✓ Your password never leaves your device.                   │
│  ✓ We see sender domains only, not content.                  │
│                                                                │
│  Step 2: We Check for Breaches                               │
│  Your email is cross-checked against Have I Been Pwned.      │
│  ✓ We don't store your email.                                │
│  ✓ Zero-knowledge: we can't see the result.                  │
│                                                                │
│  Step 3: You Get a Report                                    │
│  Your report shows: breach status, services, EU alternatives.│
│  ✓ Data lives only on your device (unless you save).         │
│  ✓ Guest mode: no account needed.                            │
│                                                                │
│  Step 4: Optional: Sign Up & Get a Dashboard                 │
│  Save your report, build a migration checklist, track         │
│  progress, get email updates.                                │
│  ✓ Your data is encrypted on our servers (we can't read it). │
│                                                                │
│  [Security & Privacy Deep-Dive] [Read Our Docs]              │
└──────────────────────────────────────────────────────────────┘
```

**Focus:** Plain-language security explainer. No jargon. Emphasis on "we can't see your data."

---

## Design System Notes

- **Colors:** Cream (#f9f7f2) background, Terracotta (#c17a5c) accents
- **Typography:** Body in serif, headlines in IBM Plex Mono
- **Spacing:** 1rem grid
- **Responsive:** Desktop-first, mobile breakpoint at 768px
- **Accessibility:** WCAG AAA contrast, 7:1 on text
- **Dark mode:** Full support, toggle in header

---

## Wireframe 4: Inbox Scanner OAuth — Private Beta Flow

**Context:** While Google is reviewing our app, inbox scanning is in a private beta (testing status). Only manually approved Gmail addresses can authorize. This flow handles the three key UX moments: (1) gating before OAuth, (2) coaching through the Google "unverified app" warning, (3) handling rejection when not on beta list.

### Screen A: Beta Gate

```
┌──────────────────────────────────────────────────────────────┐
│ 🔒 Private Beta                                              │
│                                                              │
│ The inbox scanner is in a private beta while Google reviews  │
│ our app. We're letting people in a few at a time.           │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [ My email is on the list — continue ]                 │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [ Request an invite ]                                  │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ Why invite-only?                                            │
│ We'd rather grow slowly and securely than open the doors    │
│ before Google has verified us.                              │
│ [← Back] [How it works →]                                   │
└──────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Button 1 (list): Proceeds directly to Screen B (Google warning coach)
- Button 2 (invite): Opens Tally form in new tab (`_blank`)
- "How it works" link: Opens modal/page explaining the beta process

**Copy notes:**
- Tone: honest, not apologetic. "We're letting people in a few at a time" explains the constraint as deliberate, not a rejection.
- Link text keeps copy short; "Why invite-only?" below is the full rationale.

---

### Screen B: Before You Continue (Critical)

```
┌──────────────────────────────────────────────────────────────┐
│ One thing before Google takes over                           │
│                                                              │
│ Google will say "Google hasn't verified this app."           │
│ That's expected during our beta — verification is still in   │
│ progress. Nothing is wrong, and nothing about your data      │
│ changes.                                                     │
│                                                              │
│ To continue:                                                 │
│  1. Click Advanced                                           │
│  2. Click "Go to digitaleu.me"                               │
│                                                              │
│ [Annotated screenshot of the Google warning here]           │
│                                                              │
│ 🔒 We still only request **read-only access to sender       │
│    domains** — never your email content, attachments,        │
│    or full addresses.                                        │
│                                                              │
│ [ Got it — continue to Google → ]    [ Cancel ]             │
└──────────────────────────────────────────────────────────────┘
```

**Design notes:**
- This is the **most critical screen** — it runs immediately after user clicks "My email is on the list," before the OAuth redirect. Design this as a modal or inline section, cannot be skipped.
- The screenshot placeholder: insert an annotated image of the actual Google "hasn't verified this app" warning screen. Label the "Advanced" button and the "Go to digitaleu.me" link. This reduces fear by 80%.
- The blue lock emoji (🔒) + bold "read-only access to sender domains" repeats the safety promise *where Google just sowed doubt*. Crucial for conversion.
- "Cancel" button: takes user back to Screen A (they can request an invite instead).

**Copy rationale:**
- Quote Google's exact words ("Google hasn't verified this app") so users recognize them and don't feel tricked.
- "Nothing is wrong, and nothing about your data changes" directly counters the "This app isn't verified" fear.
- Step-by-step walkthrough (1. Click Advanced, 2. Click Go to...) makes it foolproof.

---

### Screen C: Not on Beta List (Error State)

```
┌──────────────────────────────────────────────────────────────┐
│ This email isn't on the beta list yet                        │
│                                                              │
│ We couldn't authorize **jane@gmail.com**. During the beta   │
│ we add testers in small batches — yours may not be active   │
│ yet.                                                         │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [ Request an invite for this email ]                   │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [ Try a different Google account ]                     │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [ Choose services manually instead ]                   │  │
│ └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Button 1 (request): Opens Tally form in new tab
- Button 2 (try different): Returns user to Screen A / OAuth flow (to try another Gmail)
- Button 3 (manual): Bypasses OAuth entirely, shows manual service selector

**Copy notes:**
- "We couldn't authorize" + the email address = clear, diagnostic language. No vague "something went wrong."
- "In small batches" reinforces the deliberate scaling narrative (matches Screen A).
- Three exits, **no dead end** — last resort is always "choose manually."

**Engineering note on error handling:**
Google OAuth returns the error in the URL **hash** (implicit flow): `#error=access_denied&error_description=...` when the user is denied or not on the test-user list. Parse `window.location.hash` for `error=access_denied`, not the search params. Once detected, route to Screen C. (See gmailScanner.ts `extractAccessTokenFromUrl()` for the pattern.)

---

## Inbox Scanner Flow — Technical Notes for Lovable Build

**1. OAuth Endpoint**
- Direct Google OAuth (not Supabase Auth social login)
- `response_type=token` (implicit flow)
- Scope: `https://www.googleapis.com/auth/gmail.metadata` (read-only metadata only)
- Redirect URI: `/dashboard`

**2. Request Access (External Form)**
Placeholder: `https://tally.so/r/[FORM_ID]` (Tally is 🇧🇪 EU-hosted — on brand)
- Captures: Email, optional name
- Opens in `_blank` (new tab)

**3. Flow States**
- Entry → Screen A (Beta Gate)
- User clicks "My email is on the list" → Screen B (Google warning coach) → Google OAuth redirect
- OAuth success → proceed to inbox scan
- OAuth error (`#error=access_denied`) → Screen C (not on list)

**4. Accessibility & Dark Mode**
- All three screens: WCAG AAA, 7:1 text contrast
- Dark mode: cream background → dark canvas, terracotta → lighter accent
- Typography: IBM Plex Mono for headlines, serif body
- Buttons: Nordic Warmth style (see BRAND.md)
