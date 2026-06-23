# Design System — Implementation Checklist & Commit Log

**Branch:** `feat/brand-identity`  
**Started:** 2026-06-22  
**Lead:** Head of Design

---

## 📋 Implementation Phases

### **Phase 1: Foundation (CURRENT)**
✅ = Done | ⏳ = In Progress | ⏬ = Not Started

#### 1.1 Tokens & Config
- [x] BRAND.md written (visual guidelines, tone, components)
- [x] Tailwind config updated (colors, typography, spacing, dark mode)
- [ ] IBM Plex Mono font imported + configured
- [ ] Service logo architecture designed (@digitaleu/shared/services)
- [ ] Flag icons setup (flag-icons-css or similar)

**Commit when done:**
```bash
git add docs/BRAND.md apps/web/tailwind.config.ts
git commit -m "feat: Add Nordic Warmth design system v1

- Brand identity docs (tone, colors, typography, accessibility)
- Tailwind tokens: warm palette, monospace headlines, dark mode
- Color: canvas #f9f7f2, accent #c17a5c, errors/warnings defined
- All colors WCAG AAA compliant

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

#### 1.2 Core Components (shadcn/ui overrides)
- [ ] Button (primary + secondary variants)
- [ ] Input (text + text area)
- [ ] Label (above inputs)
- [ ] Card (minimal style)
- [ ] Checkbox (dark mode)

**Commit when done:**
```bash
git add apps/web/src/components/ui/
git commit -m "refactor: Override shadcn/ui components with Nordic Warmth theme

- Button: filled + outline variants, accent color, no shadows
- Input: border-only, clear focus states, light + dark
- Card: minimal borders, breathing room
- All components responsive, accessible

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

#### 1.3 Layout Components
- [ ] Header (logo/nav, theme toggle)
- [ ] Footer (EU tech links + newsletter + copyright)
- [ ] Container (max-width 1200px, gutter)
- [ ] Grid system for sections

**Commit when done:**
```bash
git add apps/web/src/components/Header.tsx apps/web/src/components/Footer.tsx
git commit -m "feat: Build Header and Footer with Nordic Warmth layout

- Header: text-only branding, theme toggle (light/dark), nav
- Footer: EU tech website links, newsletter signup, copyright
- Responsive design, accessible keyboard nav

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

#### 1.4 Service Display Components
- [ ] ServiceCard (logo + name + country flag + description)
- [ ] ServiceGrid (responsive grid layout)
- [ ] ServiceBadge (tag-like display)

**Commit when done:**
```bash
git add apps/web/src/components/Service*.tsx
git commit -m "feat: Add Service display components with country flags

- ServiceCard: logo (24-48px), flag icon, name, description
- ServiceGrid: responsive layout, gap 1rem
- Flags via flag-icons-css, never distorted

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

### **Phase 2: Pages (CURRENT)**
- [x] Landing page (hero + dual CTA + trust signals)
- [x] Report page (breach alert + services + alternatives + next steps)
- [x] How it works page (4-step explainer, zero-knowledge focus)
- [ ] Dashboard page
- [ ] Settings/profile page
- [ ] Success/confirmation page

### **Phase 3: Forms & Flows (CURRENT)**
- [x] Multi-column form layout (name + email side-by-side)
- [x] Consent flow UI (clear, plain language)
- [x] Payment form (with Service selection)
- [ ] Inbox Scanner onboarding

### **Phase 4: Polish (Next)**
- [ ] Extension UI (popover 300–400px)
- [ ] Loading & error states (all components)
- [ ] Accessibility audit (WCAG AAA)
- [ ] i18n layout prep (text expansion)

---

## 🔍 Design Review Checklist (before each commit)

Before committing any design changes, verify:

**Visual**
- [ ] Colors match palette (use Figma/color picker if unsure)
- [ ] Typography hierarchy clear (h1 > h2 > body)
- [ ] Spacing consistent (multiples of 0.25rem or 1rem)
- [ ] Dark mode tested (toggle works, colors readable)
- [ ] Responsive (desktop first, mobile doesn't break)

**Component**
- [ ] Button states clear (normal, hover, disabled)
- [ ] Form labels clear + inputs accessible
- [ ] No rounded corners >4px (unless functional)
- [ ] Icons monochrome + 24px default

**Accessibility**
- [ ] Contrast: 7:1 on text (WCAG AAA)
- [ ] Focus state visible (2px border in accent)
- [ ] Alt text on images/flags
- [ ] Keyboard nav works (Tab through all elements)

**Tone**
- [ ] Microcopy direct + honest (no jargon)
- [ ] No marketing fluff ("revolutionary," "cutting-edge")
- [ ] Plain language (explain like 10-year-old)

---

## 📅 Commit Timeline

| Commit | Date       | Status | Notes |
|--------|-----------|--------|-------|
| 1. Foundation (tokens + config) | 2026-06-22 | 🟢 Done | Base config + BRAND.md |
| 2. Component overrides | 2026-06-22 | 🟢 Done | shadcn/ui theme |
| 3. Header + Footer | 2026-06-22 | 🟢 Done | Layout structure |
| 4. Service display | 2026-06-22 | 🟢 Done | Logos + flags |
| 5. Landing redesign | 2026-06-23 | 🟢 Done | Hero + dual CTA + Nordic Warmth |
| 6. Report + How it works | 2026-06-23 | 🟢 Done | Breach alert, 4-step explainer |
| 7. Routing update | 2026-06-23 | 🟢 Done | / → landing, /selector, /report, /how |
| 8. Phase 3 forms | 2026-06-23 | 🟢 Done | Profile, consent modal, payment forms |
| (merge to main) | (TBD) | ⏳ | Design system + pages + forms ready |

---

## 🚀 Merge Criteria

`feat/brand-identity` is ready to merge when:
- [x] BRAND.md complete
- [ ] Tailwind config working (no errors)
- [ ] Core components (button, input, card) built + tested
- [ ] Header + Footer built
- [ ] Dark mode fully functional
- [ ] Accessibility audit passed
- [ ] All colors verified (WCAG AAA)
- [ ] No console errors

Then: **Create PR, link to issue, merge to main.**
