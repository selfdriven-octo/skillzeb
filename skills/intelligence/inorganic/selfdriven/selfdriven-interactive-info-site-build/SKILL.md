---
name: selfdriven-interactive-info-site-build
description: "Build selfdriven-branded interactive info websites from conceptual sketches, notebook photos, or framework descriptions. Use when the user wants to turn notes, sketches, diagrams, or conceptual frameworks into a polished single-file HTML interactive site with the selfdriven brand system — especially for KERI/ACDC trust architecture, digital interaction frameworks, or any selfdriven knowledge base content."
---

# selfdriven Interactive Info Site Builder

Turn conceptual sketches, notebook photos, and framework descriptions into polished, single-file interactive HTML info websites using the selfdriven brand system.

## Overview

This skill captures the end-to-end workflow for building a selfdriven-branded interactive information site — from interpreting a rough conceptual sketch through iterative refinement to a production-quality self-contained HTML file. It was derived from the workflow used to build the Digital Interaction Framework site and encodes the patterns, decisions, and lessons learned.

### Trigger Contexts

Use this skill when the user:
- Uploads a photo of handwritten notes, whiteboard sketches, or notebook diagrams and asks to turn them into a website
- Asks for an "interactive info site", "info website", "knowledge base page", or "framework site"
- Wants to present a conceptual framework (layers, stages, tiers, matrices) as an interactive web experience
- Mentions turning research, papers, or structured thinking into a selfdriven-branded webapp
- Asks to create a selfdriven property landing page or documentation site from scratch

### Prerequisite Skills

Always read these skills before starting:
1. **`selfdriven-ecosystem`** — brand system, design tokens, typography, visual language, domain family
2. **`selfdriven-digital-interaction-framework`** — if the content relates to the trust framework specifically
3. **`frontend-design`** — for design thinking and aesthetic guidance

## Workflow

### Phase 1 — Interpret the Source Material

When the user provides a sketch, photo, or description:

1. **Identify the conceptual structure**: Look for layers, hierarchies, stages, categories, relationships, and flows. Name them explicitly.
2. **Map to interactive patterns**: Each concept type maps to a UI pattern:
   - Layers/stack → Accordion with timeline dots
   - Stages/sequence → Horizontal flow with clickable detail panels
   - Categories/domains → Card grid or tabbed interface
   - Relationships/network → Canvas animation or node grid
   - Comparisons → Tables with hover highlighting
   - Decisions/records → Clickable chip strip with expandable detail panels
3. **Identify the information hierarchy**: What's the hero message? What are the nav sections? What's the depth of detail per section?
4. **Don't ask too many questions**: Interpret and build. The user can refine iteratively.

### Phase 2 — Build the First Version

Create a single self-contained HTML file. Key principles:

#### File Structure
```
Single .html file containing:
├── <style> — all CSS including light/dark mode tokens
├── <nav> — fixed, blurred backdrop on scroll
├── <hero> — full-viewport with eyebrow, headline, subtitle, CTAs, stat strip
├── <section> per nav link — each a full content section
├── <footer> — links, optional audio player
└── <script> — all interactivity (accordion, tabs, observers, canvas)
```

#### Brand System (from selfdriven-ecosystem skill)
- **Fonts**: Poppins (300–900) + JetBrains Mono — loaded via Google Fonts
- **Colours**: CSS variables with full light/dark mode support
- **Cards**: 20px radius, 1px border, 3px accent top-bar on hover
- **Buttons**: Pill-shaped (999px radius) for CTAs
- **Nav**: Fixed, `backdrop-filter: blur(16px)` on scroll
- **Dark sections**: Use `var(--text)` as background; in dark mode use `#141414` against `#0a0a0a`
- **Animations**: `IntersectionObserver` with staggered `transitionDelay` for reveals

#### Critical Implementation Details

**Navigation links** — NEVER use `<a href="#section">` anchors. These trigger popups in artifact viewers. Always use:
```html
<a href="javascript:void(0)" data-target="sectionId">Link Text</a>
```
With JS:
```javascript
navLinks.forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById(a.dataset.target).scrollIntoView({ behavior: 'smooth' });
  });
});
```

**Hero CTA buttons** — Same issue. Use `<button>` with `onclick`:
```html
<button class="btn-primary" onclick="document.getElementById('target').scrollIntoView({behavior:'smooth'})">
  Explore ↓
</button>
```

**Accordion panels** — Prevent child clicks from collapsing parent:
```javascript
layer.addEventListener('click', (e) => {
  if (e.target.closest('.layer-panel')) return; // Don't collapse from panel clicks
  // ... toggle logic
});
```

**Interactive sub-elements within accordions** — When a panel contains clickable items (e.g. tech tags that switch content), use `e.stopPropagation()` and `data-*` attributes:
```javascript
tag.addEventListener('click', (e) => {
  e.stopPropagation();
  // Switch displayed content based on tag.dataset.tech
});
```

**Canvas animations** — Always use transparent background so the canvas blends with its section:
```html
<div style="background: transparent; border: 1px solid rgba(255,255,255,0.08);">
  <canvas id="myCanvas" style="width: 100%; height: 420px; display: block;"></canvas>
</div>
```
Initialise via IntersectionObserver (don't run animation until visible). Handle `window.resize` with `ctx.setTransform(1,0,0,1,0,0)` before re-scaling.

**Logo embedding** — When user provides a logo file:
1. Check if it's actually a JPEG disguised as PNG (common with uploads)
2. If background is solid black, remove it by replacing near-black pixels with transparent in Python/Pillow
3. Resize to nav height (30–36px) maintaining aspect ratio
4. Base64 encode as PNG and embed inline: `<img src="data:image/png;base64,...">`
5. Make the logo a scroll-to-top button

#### Stat Strip Pattern
Below the hero, include a stat strip summarising key numbers:
```html
<div class="stat-strip">
  <div class="stat-item">
    <div class="stat-num">5</div>
    <div class="stat-label">Trust Layers</div>
  </div>
  <!-- more items -->
</div>
```
JetBrains Mono for numbers, accent colour, uppercase labels.

### Phase 3 — Iterative Refinement

The user will typically request several rounds of changes. Common patterns:

#### "Expand on the sections"
- Add more detail cards within each section
- Add comparison tables (accent header, alternating rows, hover highlight)
- Add sub-sections with their own eyebrow/title/description
- Add tabbed interfaces for sections with multiple views
- Add clickable elements that reveal detail panels (ADR chips, lifecycle stages)

#### "The links trigger popups"
- Replace all `<a href="#...">` with `javascript:void(0)` + `data-target` + JS `scrollIntoView`
- This is the #1 most common issue in artifact viewers

#### "Clicking inside panels collapses them"
- Add `if (e.target.closest('.panel-class')) return;` guard to accordion click handlers
- Add `e.stopPropagation()` to interactive child elements

#### "Nothing happens when I click [interactive element]"
- The element has visual styling (hover effects) but no JS handler
- Add click handlers with `data-*` attributes and corresponding content panels
- Each clickable item needs: active state CSS, a target panel, and toggle logic

#### "Add the logo / make it transparent"
- Process with Pillow: convert to RGBA, replace near-black pixels, resize, base64 encode
- Embed as `<img>` inside the nav brand element

#### "Add an audio player"
- Styled card with accent top-bar inside footer area
- `<audio controls preload="none">` with `<source>` pointing to provided path
- Include title, description text above the player

#### "Make the links real"
- Replace `href="#"` with actual `https://selfdriven.{domain}` URLs
- Add `target="_blank"` for external links

### Phase 4 — Final Output

The deliverable is always:
1. **Single HTML file** in `/mnt/user-data/outputs/` — fully self-contained (embedded fonts via Google Fonts CDN, embedded base64 logo, inline CSS + JS)
2. Present via `present_files` tool
3. Optionally, a **SKILL.md** capturing the framework content for reuse

## Interactive Pattern Library

### Accordion with Timeline
```
┌─ ● Layer 05 — Title ──────────────────────┐
│   Brief description                         │
│   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │  ← expanded panel with cards
│   │Card 1│ │Card 2│ │Card 3│ │Card 4│     │
│   └──────┘ └──────┘ └──────┘ └──────┘     │
├─ ○ Layer 04 — Title ──────────────────────┤  ← collapsed
├─ ○ Layer 03 — Title ──────────────────────┤
├─ ○ Layer 02 — Title ──────────────────────┤
└─ ○ Layer 01 — Title ──────────────────────┘
```
- Left timeline: 2px line with 16px dot markers
- Active dot: accent colour with glow box-shadow
- Panel: `max-height: 0` → `max-height: 1200px` transition
- Open first layer by default after 1.2s delay

### Tabbed Interface with Sub-Content
```
[ Overview ] [ Detailed ] [ Interactions ]
─────────────────────────────────────────
  (content switches based on active tab)
```
- Tab bar: `var(--surface)` background, 4px padding, 12px border-radius
- Active tab: accent background, white text
- Re-trigger stagger animation on tab switch

### Clickable Stage Flow
```
🔍 → 🤝 → 📋 → ✅ → 🔄 → 📦
Discovering  Co-Creating  Proposing  Using  Updating  Archiving

┌─ Detail Panel ──────────────────────────────┐
│  01  Stage Title                             │
│  Description paragraph...                    │
│  ┌──────┐ ┌──────┐ ┌──────┐                │
│  │Card 1│ │Card 2│ │Card 3│                │
│  └──────┘ └──────┘ └──────┘                │
│  [keri-action] [keri-action] [keri-action]  │
└─────────────────────────────────────────────┘
```
- Horizontal flex with `→` pseudo-element connectors
- Stage icons in 56px rounded squares with accent-dim background
- Active stage: icon becomes accent with glow
- Detail panel appears below with slide-in

### ADR Chip Strip
```
[ADR-001: Title] [ADR-002: Title] [ADR-003: Title] ...

┌─ ADR Detail ──────────────────────────────────┐
│  ADR-001: Full Title                           │
│  Status: Accepted · Date: 2024-01 · Scope: All│
│                                                │
│  Context: ...                                  │
│  Decision: ...                                 │
│  Consequences: ...                             │
└────────────────────────────────────────────────┘
```
- JetBrains Mono, 11px, pill-shaped (999px radius)
- Click toggles: same chip closes, different chip switches
- Detail panel: left accent border (4px), Context/Decision/Consequences structure

### Animated Network Canvas
```
    ○ R (blue)          ○ R (blue)
   / \                 / \
  ●R(green)───────●R(green)
   \    \         /    /
    \    ◉ You   /    /
     \  (accent)/    /
      ●R(green)     ●R(green)
     /              \
    ○(grey)          ○(grey)
```
- Central "You" node: accent colour, 22px radius, "You" label
- Tier 1 (green #2d8a4e, 14px), Tier 2 (blue #4a7fb5, 10px), Delegated (grey #9e9085, 7px)
- Edges: `rgba(200,68,47,0.12)` with animated packet dots
- Node wobble: `Math.sin(time * 1.5 + i) * 3`
- Mouse proximity glow within 40px
- Transparent background, IntersectionObserver init
- Legend bar below with colour-coded dot + label for each tier

### Comparison Table
```css
.compare-table thead th { background: var(--accent); color: #fff; }
.compare-table tbody tr:nth-child(even) { background: var(--surface); }
.compare-table tbody tr:hover { background: var(--accent-dim); }
.compare-table .mono { font-family: 'JetBrains Mono'; color: var(--accent); }
```
- Rounded corners via `border-collapse: separate; border-radius: 14px; overflow: hidden;`
- Accent header row, alternating body rows, hover highlight

## Common Pitfalls & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Nav links open popups | `<a href="#id">` in artifact viewer | Use `javascript:void(0)` + `data-target` + JS `scrollIntoView` |
| Accordion collapses when clicking inside | Click bubbles to parent toggle handler | Add `if (e.target.closest('.panel')) return;` guard |
| Interactive tags do nothing | Visual hover styling but no JS handler | Add `data-*` attributes, click handler, and switchable content panels |
| Logo has black background | Source is JPEG disguised as PNG | Process with Pillow: RGBA conversion, replace near-black pixels, re-encode as PNG |
| Canvas has solid background | Default canvas rendering | Set container `background: transparent` and border to `rgba(255,255,255,0.08)` |
| Dark mode text invisible | Using `var(--bg)` for text in dark sections | Use explicit light colours (`#f0ede8`) for text in inverted/dark sections |
| File won't save | File already exists at output path | `rm` the existing file first, then `create_file` |
| Active nav link not tracking | Using `href` attribute for comparison | Use `data-target` attribute for comparison: `a.dataset.target === currentId` |

## Checklist

Before delivering:

- [ ] Single self-contained HTML file (inline CSS, inline JS, base64 logo if provided)
- [ ] Poppins + JetBrains Mono via Google Fonts CDN
- [ ] Full light + dark mode support via CSS variables
- [ ] Nav links use JS scrollIntoView (NOT href anchors)
- [ ] Accordion panels don't collapse on child clicks
- [ ] All interactive elements have working JS handlers (not just hover CSS)
- [ ] Canvas animations use transparent background
- [ ] Logo processed for transparency if needed
- [ ] IntersectionObserver for scroll reveals and canvas init
- [ ] Footer links point to real selfdriven domains with target="_blank"
- [ ] Audio player uses preload="none"
- [ ] File saved to `/mnt/user-data/outputs/` and presented via `present_files`
- [ ] Mobile responsive (nav hidden, grids collapse, flow goes vertical)
