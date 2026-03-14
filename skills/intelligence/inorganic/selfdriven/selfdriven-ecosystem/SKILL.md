---
name: selfdriven-ecosystem
description: "Build selfdriven Foundation ecosystem properties — branded webapps, documents, APIs, and organisational frameworks. Use when the user mentions selfdriven, selfdriven.money, KERI/ACDC identity, Areas of Focus, Human Conductor models, or the selfdriven brand palette (flamingo #C8442F)."
---

# selfdriven Ecosystem Builder

Build production-grade web properties, documents, APIs, and organisational frameworks for the selfdriven Foundation ecosystem.

## Overview

The selfdriven Foundation operates a family of interconnected domains spanning sovereign identity, banking, AI, community, and professional services. This skill captures the brand system, architectural patterns, content frameworks, and technical standards needed to build consistently across the entire ecosystem — not just a single domain.

### Trigger Contexts

Consult this skill for any mention of:
- Any selfdriven domain: selfdriven.money, .foundation, .pro, .network, .ai, .services, .community, .finance, .bot
- TANA (community actuation platform) or any selfdriven-branded property
- KERI/ACDC identity integration in any vertical (banking, legal, healthcare, insurance, etc.)
- ISO 27001 ISMS, compliance frameworks, or governance documents for selfdriven entities
- The selfdriven brand palette, typography, or visual language
- 8 Areas of Focus framework, Human Conductor models, community self-actuation
- API servers for any selfdriven property (CDR Open Banking, identity, agent protocols)

### When to Use This Skill

- Creating or modifying any selfdriven-branded webapp, site, or dashboard
- Writing organisational papers, compliance documents, or governance frameworks
- Building API servers for any selfdriven domain
- Designing team/organisational structures using the 8 Areas of Focus
- Creating presentation or marketing pages for selfdriven properties
- Building any interface that combines sovereign identity (KERI/ACDC/passkeys) with a service vertical

## Brand System

### Design Tokens

Always use CSS variables. Always support both light and dark modes via `prefers-color-scheme`.

```css
/* Light mode (default) */
:root {
  --bg: #f5f2ed;
  --surface: #edeae3;
  --surface2: #e5e1d8;
  --border: #ddd8ce;
  --text: #1a1410;
  --muted: #6b5f52;
  --muted2: #9e9085;
  --accent: #c8442f;
  --accent-dim: rgba(200, 68, 47, 0.10);
  --accent-strong: rgba(200, 68, 47, 0.18);
  --card-radius: 20px;
  --shadow: 0 2px 16px rgba(0,0,0,0.07);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0a0a0a;
    --surface: #161616;
    --surface2: #1e1e1e;
    --border: #2a2a2a;
    --text: #f0ede8;
    --muted: #b0a89e;
    --muted2: #7a7268;
    --accent: #e85d4a;
    --accent-dim: rgba(232, 93, 74, 0.12);
    --accent-strong: rgba(232, 93, 74, 0.20);
    --shadow: 0 2px 16px rgba(0,0,0,0.4);
  }
}
```

**CRITICAL**: Always test dark mode for text contrast. Common pitfalls: `var(--muted)` used for text that needs to be readable (use `var(--text)` or `var(--muted)` only — never `var(--muted2)` for body text in dark mode); inverted sections need explicit light text colours rather than `var(--bg)` which becomes `#0a0a0a` in dark mode.

### Typography

- **Primary font**: `Poppins` (Google Fonts) — weights 300–900
- **Monospace**: `JetBrains Mono` — for identifiers, AIDs, code, technical data
- **Never use**: Inter, Roboto, Arial, system fonts, DM Sans, Space Grotesk
- **Heading style**: Poppins 800/900 weight, letter-spacing -0.04em, large sizes
- **Body style**: Poppins 400/500, colour `var(--muted)`, line-height 1.6–1.8
- **Eyebrow labels**: 11px, weight 700, letter-spacing 0.12em, uppercase, colour `var(--accent)`

### Logo

The selfdriven logo is a square flamingo-coloured mark. When available as an uploaded file, embed as base64 for self-contained HTML:
- 80x80px on cover pages and auth screens
- 30-36px in navigation bars
- 18-20px in footers
- Always with `border-radius: 8-14px` and `overflow: hidden`

### Visual Language

- **Card style**: `var(--card-radius)` (20px), `1px solid var(--border)`, `var(--shadow)` on hover
- **Accent bar**: 3px top border on cards/modals using `var(--accent)` — signature selfdriven motif
- **Buttons**: Pill-shaped (`border-radius: 999px`) for CTAs, rounded (`border-radius: 12px`) for in-app actions
- **Dark sections**: Invert to `var(--text)` background with explicit light text. In dark mode, use `#141414` to contrast against `#0a0a0a` page
- **Scroll animations**: `IntersectionObserver` with staggered `transitionDelay` for card reveals
- **Nav**: Fixed, blurred backdrop on scroll (`backdrop-filter: blur(16px)`), accent-coloured brand text

### selfdriven Domain Family

| Domain | Purpose |
|--------|---------|
| selfdriven.foundation | Parent foundation entity |
| selfdriven.money | Banking platform |
| selfdriven.services | Professional services marketplace |
| selfdriven.pro | Human Conductor webapp (9 professional domains) |
| selfdriven.network | TANA community actuation platform |
| selfdriven.ai | AI automation and agent services |
| selfdriven.community | Community hub and governance |
| selfdriven.finance | Financial services and DeFi |
| selfdriven.bot | Agent marketplace and A2A protocols |

## 8 Areas of Focus Framework

The selfdriven Foundation organises **all** entities using 8 Areas of Focus. This framework applies to every selfdriven property, not just banking. When building any organisational content, always use these consistently:

| # | Area | Universal Purpose |
|---|------|-------------------|
| 01 | Direction | Strategy, vision, governance, and regulatory roadmap |
| 02 | Engagement | Community, partnerships, ecosystem relationships, and outreach |
| 03 | Enablement | Education, onboarding, skills development, and developer tools |
| 04 | Protocols | Identity infrastructure, technical standards, and integration |
| 05 | Sustainability | Revenue model, resource stewardship, and long-term viability |
| 06 | Processes | Operations, workflows, service delivery, and incident management |
| 07 | Accountability | Compliance, audit trails, transparency, and stakeholder reporting |
| 08 | Organisational | Structure, team design, culture, and decentralised operations |

### Applying to Any Domain

When building for a specific selfdriven property, map each area to that domain's context. Examples:

- **selfdriven.money (Banking)**: Direction = APRA ADI licensing; Protocols = KERI + NPP/BPAY/SWIFT/CDR
- **selfdriven.pro (Professional Services)**: Direction = 9-vertical service strategy; Protocols = KERI-anchored professional credentials
- **selfdriven.network (TANA)**: Direction = Community self-governance; Protocols = NuNet compute + KERI event processing
- **selfdriven.services**: Direction = Service marketplace strategy; Protocols = ACDC service credentials + A2A agent discovery
- **selfdriven.ai**: Direction = AI agent governance; Protocols = Agent delegation via KERI dip events + SKILL.MD protocol

### Human Conductor Model

Each Area of Focus is led by a **human conductor** who orchestrates AI agents:
- Conductor dedicates ~70% energy to primary area, ~30% across supporting areas
- Each conductor holds a KERI AID with an ACDC role credential
- AI agents operate under KERI-delegated AIDs with scoped, time-limited authority
- Conductors handle: strategy, judgment, relationships, ethics, accountability
- Agents handle: volume, consistency, monitoring, reporting, automation
- Default placeholder conductor: "selfdriven Actuation Team Member" with initials "sd"

## KERI/ACDC Identity Architecture

This is the universal trust layer across all selfdriven properties.

### Key Concepts

- **AID**: Autonomous Identifier — self-certifying, no central authority
- **KEL**: Key Event Log — append-only, witnessed, tamper-evident
- **Event types**: `icp` (inception), `rot` (rotation), `ixn` (interaction), `dip` (delegated inception)
- **ACDC**: Authentic Chained Data Container — verifiable credential anchored to KERI
- **Witness network**: Distributed (typically 3 witnesses, 2-of-3 threshold)
- **Pre-rotation**: Next keys committed before current keys are used — enables instant recovery
- **Passkey binding**: FIDO2/WebAuthn credentials linked to KERI AID via `ixn` event
- **vLEI**: Verifiable Legal Entity Identifier — GLEIF-issued ACDC for organisational identity

### Trust Model (Three Layers)

1. **Key Events**: KERI provides root of trust via append-only key event log
2. **Credentials**: ACDC credentials attest domain-specific claims anchored in KERI
3. **Operations**: Domain actions (transactions, attestations, governance votes) reference the credential layer

### KERI Event in API Responses

Every mutating operation across any selfdriven API should include:
```json
{
  "keriEvent": {
    "type": "ixn",
    "aid": "EKE4g_0hDGBOqDLKzNBT3kFOPxoP7wXkqt",
    "sn": 1709971200000,
    "digest": "sha256-hex-of-request-body"
  }
}
```

### Authentication Pattern (Universal)

All selfdriven properties use the same auth model:
- **User auth**: FIDO2 passkey (biometric/device-bound) linked to KERI AID. No passwords. No SMS OTP.
- **Service auth**: mTLS + KERI-signed bearer tokens
- **Transaction signing**: WebAuthn assertion with operation-specific data binding
- **Auth UI**: Passkey button (primary, accent) + KERI AID button (secondary, outline). Biometric animation (pulsing ring > "Identity verified" > "KERI key event confirmed").

## Document Creation

### Word Documents (docx)

Use the `docx` skill. selfdriven conventions:
- **Font**: Poppins (not Arial) — set in document styles
- **Heading colours**: H1 `#1A1410`, H2 `#C8442F` (accent), H3 `#1A1410`
- **Table headers**: Fill `#C8442F`, text white, Poppins bold
- **Table alternating rows**: `#F5E8E5` (accent light)
- **Monospace**: JetBrains Mono for AIDs, identifiers, hashes, technical data
- **Cover page**: Logo top-left, title 28pt bold, accent rule, metadata below
- **Headers**: "selfdriven.[domain] . [Document Title]" left; classification right
- **Footers**: Page number centred with document reference and version

### ISO 27001 / Compliance Documents

- **SoA**: Landscape A4 for wide tables; all 93 Annex A controls
- **Columns**: Control ID, Name, Applicable (Yes/N/A), Implemented, Justification, Implementation
- **Status colours**: Green for "Yes", amber for "N/A"
- **KERI enhancements**: Note where KERI/ACDC provides architectural enforcement beyond policy
- **Regulatory mapping**: Adapt to the domain's regulator (APRA CPS 234 for banking, relevant regulator for other verticals)
- **Approval table**: Domain-appropriate signatories (CISO, CRO, CEO, Board Chair or equivalent)

### Markdown Conversion

`pandoc input.docx -o output.md --wrap=none`

## Webapp Patterns

### App (Authenticated Dashboard)

- Sidebar: Logo, nav groups by domain context, identity card at bottom showing KERI AID + role
- Topbar: Page title, KERI status pill, notification bell, lock button
- Hero card: Primary metric with accent top-bar, quick action buttons
- Modals: Tabbed interface for multi-step operations; passkey signing animation for mutations
- Toast notifications for feedback; confirmation dialogs for destructive actions
- Search/filter on list views; CSV export for data tables
- Settings: Functional toggle switches with toast feedback
- Auth screen: Passkey + KERI AID dual auth; biometric animation
- **Always support dark mode**

### Presentation / Marketing Site

- Fixed nav with logo, section links, CTA pill button
- Full-viewport hero: Bold headline with accent `<em>`, eyebrow label, staggered fade-up
- Stats strip with scroll-triggered reveals
- Feature grid (3-column): Accent-top-bar hover cards with icons
- Step-by-step flow: Numbered cards with connectors
- Dark inverted section: Trust/security/identity messaging
- 8 Areas of Focus grid (4-column): Numbered cards matching the framework
- CTA section: Accent-topped card with primary + outline buttons
- Scroll reveal: `IntersectionObserver` with staggered `transitionDelay`

### Team / Organisational Page

- 4-column card grid for 8 Areas of Focus
- Progress bar: Conductors appointed / 8
- Cards: Number badge, status (APPOINTED/OPEN), title, subtitle, conductor slot
- Expandable panel: Description, responsibilities list, AI agents (3 per area), KPIs (3 per area)
- Conductor slot: Dashed border when open (amber status), solid green when filled
- Philosophy section: Human conductor model with 70/30 focus distribution

## API Server Patterns

### Express.js Structure (Adaptable to Any Domain)

```
server.js
+-- Identity middleware (keriAuth) — validates bearer token, extracts AID context
+-- Passkey middleware (passkeyVerify) — validates WebAuthn signature for mutations
+-- Domain middleware — e.g., CDR headers for banking, credential scope for services
+-- Public APIs — catalogue, discovery, status
+-- Authenticated APIs — domain resources gated by KERI auth + ACDC scope
+-- KERI Identity APIs — /api/v1/identity/aid, /credentials, /kel, /passkeys
+-- Domain Operations — mutating endpoints with passkey signing + KERI event logging
+-- Health — /health with component status
```

### Pagination

```json
{
  "data": { },
  "links": { "self": "?page=1", "first": "?page=1", "last": "?page=N", "next": "?page=2" },
  "meta": { "totalRecords": 100, "totalPages": 4 }
}
```

## Domain Reference: Banking (selfdriven.money)

Applies only when building for selfdriven.money. For other domains, adapt accordingly.

### Regulators

APRA (prudential), ASIC (conduct), AUSTRAC (AML/CTF), OAIC (privacy), ACCC (CDR)

### CDR Open Banking API

Base: `/cds-au/v1/banking/` | Headers: `x-v`, `x-min-v`, `x-fapi-interaction-id`, `x-fapi-customer-ip-address`, `x-fapi-auth-date`

Public: `GET /products`, `/products/:id`, `/discovery/status`, `/discovery/outages`

Authenticated: `GET /accounts`, `/accounts/:id`, `/accounts/:id/balance`, `/accounts/:id/transactions`, `/payees`, `/payments/scheduled`, `/payments/direct-debits`, `/common/customer`

### Mock Data

BSB 802-985 | Everyday 4471 8823 $12,847.63 | Bills 4471 8831 $3,240 | Savings 4471 8847 $45,620.18 (5.25%) | Offset 4471 8855 $28,500 | Loan $487,240 (6.19%) | Visa 4823****7741 | MC 5412****3309 ($15k) | AID: EKE4g_0hDGBOqDLKzNBT3kFOPxoP7wXkqt | PayID: mark@selfdriven.foundation

### Payments

PayID (NPP, real-time, 24/7) | BSB (DE, next day) | BPAY (same/next day) | Internal (immediate) | International (SWIFT, T+1-3, cut-off 2pm AEST)

## Checklist

Before delivering any selfdriven output:

- [ ] Poppins + JetBrains Mono (not generic fonts)
- [ ] Accent `#C8442F` (light) / `#E85D4A` (dark)
- [ ] Dark mode supported and contrast-tested
- [ ] Logo embedded at correct size if available
- [ ] Card radius 20px with accent top-bar hover
- [ ] Pill-shaped CTA buttons (999px radius)
- [ ] KERI/ACDC terminology correct (AID not "address", KEL not "log")
- [ ] 8 Areas of Focus numbered 01-08 in correct order
- [ ] Documents use Poppins in styles (not Arial)
- [ ] Domain-specific regulatory references accurate
- [ ] Human Conductor model for organisational structures
