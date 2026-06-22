# Brand Identity — digitaleu.me

**Last updated:** 2026-06-22  
**Status:** Design System v1 (in development on `feat/brand-identity`)

---

## Brand Pillars

- **Clarity** — No jargon, no bullshit. Plain language about what we do.
- **Integrity** — We handle the most private data. Trust is earned through transparency.
- **Human** — Built in Norway. Functional, unpretentious, real.

---

## Visual Language

### Aesthetic: Nordic Warmth (Simplified)

No fancy design. No trends. **Functional beauty.** The goal: make security feel real and accessible, not paranoid or corporate.

#### Typography

| Use       | Font                                  | Open Source | Notes                              |
|-----------|---------------------------------------|-------------|-------------------------------------|
| Headlines | **IBM Plex Mono** (bold/semibold)     | ✅ Apache 2 | Monospace = "this is real"          |
| Body      | **system-ui stack** (sans-serif)      | ✅ Native   | Fast, honest, works everywhere      |
| Code      | IBM Plex Mono or monospace fallback   | ✅          | Consistency                         |

**Rationale:** Monospace headlines feel unpretentious and serious. System fonts on body = speed + accessibility. No web fonts beyond IBM Plex Mono.

#### Color Palette

| Name                | Hex       | Role                          | Light | Dark  |
|---------------------|-----------|-------------------------------|-------|-------|
| **Canvas (BG)**     | `#f9f7f2` | Page background               | ✅    | —     |
| **Canvas Dark**     | `#1a1815` | Page background (dark mode)   | —     | ✅    |
| **Text Primary**    | `#2c2520` | Headline, body text (light)   | ✅    | —     |
| **Text Primary Dark** | `#f5f1ea` | Headline, body text (dark)    | —     | ✅    |
| **Text Secondary**  | `#6b6560` | Muted text, labels (light)    | ✅    | —     |
| **Text Secondary Dark** | `#a89d96` | Muted text, labels (dark)     | —     | ✅    |
| **Accent**          | `#c17a5c` | Buttons, CTAs, highlights     | ✅    | ✅    |
| **Accent Hover**    | `#a8654a` | Button hover state            | ✅    | ✅    |
| **Border**          | `#e8e3da` | Dividers, subtle borders      | ✅    | —     |
| **Border Dark**     | `#3a3530` | Dividers, borders (dark)      | —     | ✅    |
| **Success**         | `#5a9873` | Confirmations, check marks    | ✅    | ✅    |
| **Warning**         | `#d9a835` | Alerts, cautions              | ✅    | ✅    |
| **Error**           | `#c85553` | Errors, destructive actions   | ✅    | ✅    |

**Rationale:**
- Warm cream background = human, not sterile.
- Burnt terracotta accent = European, crafted, functional (not trendy).
- High contrast dark mode (not grey-on-grey).
- All colors meet WCAG AAA contrast ratios.

---

## Layout & Spacing

### Grid & Breathing Room

- **Base unit:** 4px (Tailwind default)
- **Container max-width:** 1200px (desktop-first)
- **Margin/padding:** Generous. Lots of white space.
- **Gutter:** 1rem (16px) on most screens

### Hierarchy

| Element      | Size (rem) | Weight    | Use                       |
|--------------|-----------|-----------|---------------------------|
| H1           | 2.5–3     | semibold  | Page title                |
| H2           | 2         | semibold  | Section heading           |
| H3           | 1.5       | semibold  | Subsection               |
| Body         | 1         | regular   | Paragraph text            |
| Small/Label  | 0.875     | regular   | Labels, captions, buttons |

---

## Components

### Buttons

- **Style:** Filled (accent bg) or outline (border).
- **Default:** Filled + accent color.
- **Secondary:** Outline (border, no fill).
- **Disabled:** 50% opacity.
- **No rounded corners:** Square or minimal 4px border-radius (not trendy).
- **Padding:** `0.75rem 1.5rem` (vertical / horizontal).
- **Font:** Small/body, semibold.

### Forms

- **Multi-column layout** (name + email side-by-side on desktop).
- **Labels above inputs** (not floating, not inside).
- **Inputs:** Full width on mobile, stacked on desktop.
- **Placeholder:** `#a89d96` (secondary text, light mode).
- **Border:** `1px solid #e8e3da` (light) / `#3a3530` (dark).
- **Focus state:** Accent color border, no outline-style shadow.

### Cards

- **Background:** Canvas color (inherited).
- **Border:** Subtle `1px solid #e8e3da` (light) / `#3a3530` (dark).
- **No shadow** (purist).
- **Padding:** `1.5rem` inside.
- **Gap between cards:** `1rem`.

### Icons

- **Style:** Monochrome, simple, 24px default.
- **Source:** Lucide React (open source, clean).
- **Color:** Inherit text color or accent when needed.
- **No decorative icons** (only functional).

### Service Logos & Flags

- **Service logos:** Loaded from `@digitaleu/shared/services` (to be built).
- **Size:** 24px–48px (context-dependent).
- **Flags:** 16px beside service name (via `flag-icons-css` or similar).
- **Never distort** aspect ratio.

### Dark Mode

- All components auto-respond to `.dark` class on `<html>`.
- Use Tailwind `dark:` prefix.
- **No separate CSS files** for dark mode — keep it in component classes.

---

## Tone of Voice

- **Direct.** "We scan your inbox. Here's what we found."
- **Honest.** "This data lives in Switzerland, encrypted."
- **Human.** "Your email is personal. We treat it that way."
- **No marketing fluff.** No "revolutionary," no "cutting-edge," no exclamation marks.
- **Plain language.** Explain what we do in 10-year-old terms.

---

## Usage Across Touchpoints

### Landing Page
- Hero: headline + subline + CTA button (center, lots of whitespace).
- Benefits: 3–4 sections, each with icon + headline + 1–2 sentences.
- Footer: Links to EU tech sites, newsletter signup, copyright.

### Dashboard
- Clean data-first layout.
- Tables, lists, minimal decoration.
- Buttons for actions (scan, export, settings).

### Forms (Consent, Payment, Profile)
- Multi-column on desktop, single on mobile.
- Clear labels + help text.
- Progress indicator if multi-step.

### Extension UI
- Minimal popover (300–400px wide).
- Same palette + fonts.
- Auto-fill status + clear action button.

---

## Accessibility

- **Contrast:** All text meets WCAG AAA (7:1 minimum).
- **Font sizing:** Min 16px on mobile, scales to 18px+ on desktop.
- **Focus states:** Visible 2px border in accent color.
- **Alt text:** All images, icons, flags.
- **Keyboard nav:** All interactive elements reachable via Tab.
- **Color not only info:** Always pair color with text/icon (e.g., error state = red + ❌ icon).

---

## i18n Considerations

- **Text expansion:** German/Polish text expands 20–30%. Design layouts with generous width.
- **RTL:** Not yet (but structure for future).
- **Icons & flags:** Language-agnostic (good).

---

## What's NOT in Scope (v1)

- Custom logo/wordmark (text-only for now).
- Animations or micro-interactions.
- Storybook (live markdown + components in code is enough).
- Print styles.

---

## Next Steps (v2+)

- Design a wordmark/logo once brand is proven.
- Add illustrations (simple, monochrome, if needed).
- Motion design (scroll, page transitions) if metrics warrant it.
