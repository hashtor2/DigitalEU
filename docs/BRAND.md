# Brand Identity — digitaleu.me

**Last updated:** 2026-06-25  
**Status:** ✅ ACTIVE — European Digital Design System (Web + Scanner unified)  
**Deprecated:** All previous designs (Nordic Warmth, etc.) — NO LONGER IN USE

---

## Brand Pillars

- **Clarity** — No jargon, no bullshit. Plain language about what we do.
- **Integrity** — We handle the most private data. Trust is earned through transparency.
- **Human** — Built in Norway. Functional, unpretentious, real.

---

## Visual Language

### Aesthetic: European Digital (Modern, Premium, Trusted)

**High contrast. Clean. Professional. Trustworthy.**

The goal: make security feel real, modern, and approachable—not paranoid or corporate. Emerald = trust + growth. Deep navy = stability. Bright cyan = innovation.

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
| **Canvas (BG)**     | `#ffffff` | Page background (light)       | ✅    | —     |
| **Canvas Dark**     | `#0f172a` | Page background (dark)        | —     | ✅    |
| **Text Primary**    | `#111827` | Headline, body text (light)   | ✅    | —     |
| **Text Primary Dark** | `#f8fafc` | Headline, body text (dark)    | —     | ✅    |
| **Text Secondary**  | `#6b7280` | Muted text, labels (light)    | ✅    | —     |
| **Text Secondary Dark** | `#cbd5e1` | Muted text, labels (dark)     | —     | ✅    |
| **Accent (Primary)**| `#10b981` | Buttons, CTAs, trust          | ✅    | ✅    |
| **Accent Hover**    | `#059669` | Button hover state            | ✅    | ✅    |
| **Secondary Accent**| `#0ea5e9` | Highlights, emphasis          | ✅    | ✅    |
| **Secondary Hover** | `#0284c7` | Secondary hover state         | ✅    | ✅    |
| **Warm Accent**     | `#f59e0b` | Warnings, secondary CTAs      | ✅    | ✅    |
| **Border**          | `#e5e7eb` | Dividers, subtle borders      | ✅    | —     |
| **Border Dark**     | `#1e293b` | Dividers, borders (dark)      | —     | ✅    |
| **Success**         | `#10b981` | Confirmations, check marks    | ✅    | ✅    |
| **Warning**         | `#f59e0b` | Alerts, cautions              | ✅    | ✅    |
| **Error**           | `#ef4444` | Errors, destructive actions   | ✅    | ✅    |

**Rationale:**
- **Light mode:** Pure white canvas, deep charcoal text = maximum readability.
- **Dark mode:** Rich navy background, bright white text = premium feel + easy on eyes.
- **Emerald accent (#10b981):** Conveys trust, growth, European (common in EU design). Fresh yet serious.
- **Cyan secondary (#0ea5e9):** Modern, tech-forward, used sparingly for innovation/highlights.
- **Amber warm (#f59e0b):** Friendly counterpoint, used for secondary CTAs and warnings.
- **All colors:** WCAG AAA contrast minimum (7:1 for body, 4.5:1 for UI).

---

## Layout & Spacing

### Grid & Breathing Room

- **Base unit:** 4px (Tailwind default)
- **Container max-width:** 1280px (desktop-first)
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

- **Primary (Accent):** Emerald background (#10b981), white text. Strong, trusting, default CTA.
- **Secondary (Outline):** Transparent with emerald border, emerald text. Lower emphasis.
- **Tertiary (Ghost):** Text only, no border. Minimal, often for secondary links.
- **Disabled:** 50% opacity.
- **No rounded corners:** Square or minimal 4px border-radius.
- **Padding:** `0.75rem 1.5rem` (vertical / horizontal).
- **Font:** Small/body, semibold, IBM Plex Mono.

### Forms

- **Multi-column layout** (name + email side-by-side on desktop).
- **Labels above inputs** (not floating, not inside).
- **Inputs:** Full width on mobile, stacked on desktop.
- **Input background:** Light gray (#f3f4f6 light, darker in dark mode).
- **Border:** `1px solid #e5e7eb` (light) / `#1e293b` (dark).
- **Focus state:** Emerald accent border, no outline-style shadow.

### Cards

- **Light mode:** White background, light gray border, subtle shadow.
- **Dark mode:** Dark navy background, dark gray border.
- **Padding:** `1.5rem` to `2rem`.
- **Border:** `1px solid` (border color).
- **Radius:** 4px or none.

---

## Accessibility

- **Contrast:** All text ≥ WCAG AAA (7:1 for normal, 4.5:1 for UI).
- **Dark mode:** High-contrast white on dark navy, not grey-on-grey.
- **Focus indicators:** Always visible, emerald ring.
- **Interactions:** Clear feedback (hover, active, disabled states).

---

## Implementation Notes

- Update Tailwind config: new color token mappings.
- All existing components inherit new colors automatically (via CSS variables).
- Test dark mode extensively; the emerald accent should pop on dark navy.
- Ensure all new CTAs use emerald primary, not the warm/secondary accents (they're for highlights/warnings).


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
- **Honest.** "This data lives in Sweden, encrypted."
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
