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
