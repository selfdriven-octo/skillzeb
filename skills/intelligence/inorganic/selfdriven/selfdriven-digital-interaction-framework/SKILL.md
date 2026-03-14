---
name: selfdriven-digital-interaction-framework
description: "Build content, webapps, and documentation based on the selfdriven Digital Interaction Framework — the layered trust architecture for digital relationships. Use when the user mentions trust layers, digital interaction framework, relationship lifecycle, agent network, trust tiers, policy stacks, risk calibration, transactional vs interactional, fidelity/confidence/provenance, or Architecture Decision Records (ADRs) in the selfdriven context."
---

# selfdriven Digital Interaction Framework

Build interactive info sites, documentation, diagrams, and reference materials based on the selfdriven Digital Interaction Framework — a layered trust architecture for self-sovereign digital relationships.

## Overview

The Digital Interaction Framework defines how verifiable digital relationships are established, maintained, and dissolved using KERI/ACDC cryptographic infrastructure. It organises trust into five interdependent layers, a six-stage relationship lifecycle, a tiered agent network, a governance model with Architecture Decision Records, and four interconnected policy domains.

This skill should be used alongside the `selfdriven-ecosystem` skill which provides the brand system, design tokens, typography, and visual language. This skill provides the **conceptual framework and content model**.

### Trigger Contexts

Consult this skill for any mention of:
- Trust layers, layered trust model, or the five-layer stack
- Digital interaction types: transactional vs interactional
- Relationship lifecycle stages: discovering, co-creating, proposing, using, updating, archiving
- Trust assurance concepts: fidelity, confidence, provenance, risk calibration
- Agent network, trust tiers (Tier 1 direct, Tier 2 shared), teammate/dependable nodes
- Policy stacks: technical, financial, human, agent policy domains
- Agent autonomy levels (L1–L5)
- Architecture Decision Records (ADRs) for selfdriven identity infrastructure
- Policy domain interaction matrices
- The Digital Interaction Framework as a reference or citation

## Five-Layer Trust Model

Every digital interaction rests on a stack of interdependent layers. Each layer builds assurance and reduces risk for the layers above. Layers are numbered bottom-up (01 = foundation, 05 = surface).

### Layer 01 — Policy Stacks (Foundation)

The most stable layer, changing infrequently. Four interconnected policy domains:

| Domain | Scope | Key Elements |
|--------|-------|-------------|
| Technical | Infrastructure & security | Ed25519 signing, X25519 exchange, AES-256-GCM at rest, TLS 1.3 in transit, HSM key storage, 2-of-3 witness topology, OpenAPI 3.1 contracts, 7yr audit retention |
| Financial | Economic & regulatory | Transaction limits, velocity controls, NPP/BPAY/SWIFT settlement, AUSTRAC AML/CTF, APRA CPS 234, CDR consent, cross-border governance |
| Human | Conduct & privacy | Conductor 70/30 model, role-to-credential access mapping, graduated disclosure, OAIC compliance, escalation authority chains, consent management |
| Agent | Delegation & autonomy | Action whitelists, 24h default time limits, all ixn logged, anomaly/threshold escalation, ACDC-gated access, A2A protocol rules, L1–L5 classification |

**Policy Domain Interactions** — strong dependencies exist between: Technical ↔ Agent (infra constrains agent capability), Financial ↔ Human (limits constrain decisions), Human ↔ Agent (conductors set agent boundaries), Technical ↔ Financial (protocols enable compliance).

### Layer 02 — Governance

Rules, structures, and oversight that shape how technology is deployed.

- **KEL Governance**: Witness thresholds (2-of-3 default), rotation policies, delegation rules via `dip` events
- **Credential Governance**: ACDC issuance rules, revocation policies, schema management, trust chain requirements
- **Organisational Rules**: Human Conductor oversight, 8 Areas of Focus alignment, decision authority matrices
- **Delegation Framework**: AI agent delegation via `dip` — scope boundaries, time limits, escalation triggers, human-in-the-loop checkpoints

### Layer 03 — Technology

The cryptographic substrate. Eight technology domains, each with specific detail:

| Domain | Detail |
|--------|--------|
| AuthN / AuthZ | FIDO2/WebAuthn passkeys bound to KERI AIDs via `ixn`. ACDC-derived authorisation scopes. Passkey public key anchored to AID via ixn event. |
| Protocols | KERI events (`icp`, `rot`, `ixn`, `dip`, `drt`), OOBI discovery, A2A agent-to-agent communication |
| Encryption | AES-256-GCM at rest, TLS 1.3 in transit, X25519 end-to-end agent messages |
| Cryptology | Ed25519 signing, X25519 key exchange, SHA-256 event digests, SHA-512/HKDF key derivation |
| Privacy | ACDC graduated disclosure, selective correlation control, protocol-level data minimisation |
| Path History | Complete identifier traversal record, ixn sequence gap detection, forensic KEL replay |
| Key Management | Mandatory pre-rotation, HSM integration for high-value AIDs, M-of-N multi-sig thresholds |
| Witness Network | 2-of-3 default (high-value: 3-of-5), geographic distribution across 2+ AZs, watcher duplicity detection |

### Layer 04 — Trust & Assurance

Establishing the level of risk tolerance for each interaction:

- **Fidelity**: Signal integrity via cryptographic anchoring and witness corroboration. Degraded fidelity triggers re-verification.
- **Confidence**: Certainty built through credential verification, reputation, and historical track record across the lifecycle.
- **Provenance**: Chain of custody via KEL event logs and ACDC credential chains. Gaps reduce confidence scores.
- **Risk Calibration**: Transactional interactions accept lower fidelity thresholds; interactional relationships demand progressive trust accumulation.

### Layer 05 — Digital Interaction & Relationship (Surface)

The interaction itself — where value is exchanged:

- **Transactional** (Ephemeral): Short-lived, utility-focused. Bounded failure cost. Lifecycle: seconds to hours.
- **Interactional** (Enduring): Relationship-building across shared domains. Trust compounds over time. Lifecycle: days to years.
- **Shared Context**: Enterprise Workflow Model links interaction purpose to organisational function.
- **Activity Binding**: Each interaction scoped to a specific activity with defined inputs, outputs, and success criteria.

### Layer Comparison Reference

| Layer | Rate of Change | Primary Actor | KERI Primitive | Failure Mode |
|-------|---------------|---------------|----------------|-------------|
| 05 — Interaction | Per-exchange | Both parties | `ixn` | Context mismatch, scope creep |
| 04 — Trust | Progressive | Verifier | ACDC chain | Fidelity degradation, confidence erosion |
| 03 — Technology | On rotation | Infrastructure | `icp`, `rot` | Key compromise, witness failure |
| 02 — Governance | Periodic | Human Conductor | `dip`, rules | Authority gap, escalation failure |
| 01 — Policy | Infrequent | Foundation | ADR | Regulatory non-compliance |

## Relationship Lifecycle

Six stages from discovery to dissolution. Each stage maps to specific KERI primitives and trust requirements.

### Stage 1 — Discovering

- AIDs published to discovery registries; watchers monitor for matching identifiers
- ACDC schema-based capability matching connects seekers with providers
- Zero trust: all claims unverified until co-creation begins
- **KERI actions**: `icp` → AID genesis, `ACDC` → capability publish, `oobi` → endpoint discovery

### Stage 2 — Co-Creating

- Bilateral credential exchange: each party presents ACDC claims, other verifies against issuer KEL
- Shared domain, purpose, and activity scope established
- Initial trust seeded through credential verification; history begins accumulating
- **KERI actions**: `ixn` → context binding, `ACDC` → credential present, `TEL` → issuance verify

### Stage 3 — Proposing

- Interaction terms encoded as ACDC credential schemas
- Governance agreements: dispute resolution, escalation paths, credential refresh cadence, rotation expectations
- If agents will operate: `dip` events establish delegated AIDs with scoped authority
- **KERI actions**: `dip` → agent delegation, `ACDC` → terms credential, `ixn` → agreement anchor

### Stage 4 — Using

- Active operational phase; full technology stack exercised continuously
- Every interaction verified against current credential status via TEL checks
- Successful interactions compound trust; anomaly detection triggers governance escalation
- **KERI actions**: `ixn` → operation log, `TEL` → status check, `ACDC` → re-present

### Stage 5 — Updating

- Keys rotate via `rot` events; pre-rotation means next keys already committed
- Time-limited credentials re-issued before expiry; schema updates propagate
- Relationship terms may be updated: new activities, adjusted delegation, refined governance
- **KERI actions**: `rot` → key rotation, `ACDC` → credential reissue, `ixn` → terms update

### Stage 6 — Archiving

- Credentials revoked via TEL updates; verifiers immediately aware
- Delegated AIDs revoked via `drt`; agent authority terminated
- Complete KEL, TEL, and interaction history preserved permanently
- **KERI actions**: `TEL` → revoke, `drt` → delegation revoke, `KEL` → permanent record

### Trust Requirements by Stage

| Stage | Trust Level | Credential Flow | Governance | Reversibility |
|-------|------------|----------------|-----------|--------------|
| Discovering | None | Outbound publish | Minimal | Full |
| Co-Creating | Emerging | Bilateral exchange | Light | High |
| Proposing | Threshold | Terms codification | Moderate | Moderate |
| Using | Established | Continuous verify | Active | Low |
| Updating | Maintained | Refresh & reissue | Periodic | Moderate |
| Archiving | Residual | Revocation | Wind-down | Irreversible |

## Agent Network — Trust Tiers

Tiered identity architecture connecting individual AIDs to organisational networks.

### Primary AID (You)

The self-certifying root identifier. All trust relationships radiate from this node.

### Tier 1 — Direct Relationships

Highest trust. Full bilateral credential chain verification, mutual KEL witnessing, direct signed communication, real-time TEL status, eligible for agent delegation.

### Tier 2 — Shared Attribute Communities

Trust derived from group membership via shared issuer. Group credential schema membership, issuer-mediated trust, attribute-based access control, progressive elevation to Tier 1.

### Teammate — Human + Agent Pairing

The core operational unit of the Human Conductor model. Conductor holds root AID; agent operates under delegated AID via `dip`. 70/30 energy split. All agent actions logged via `ixn`.

### Dependable — Infrastructure & Services

Always-on network infrastructure. Witness nodes (2-of-3), watcher nodes (KEL monitoring/duplicity detection), discovery endpoints (OOBI resolution), TEL registries (credential status broadcasting). Geographic distribution required.

### Protocol Infrastructure

| Protocol | Purpose |
|----------|---------|
| KEL | Append-only key event log. Events: `icp`, `rot`, `ixn`, `dip`, `drt` |
| TEL | Transaction Event Log — credential lifecycle tracking (issuance, revocation, status) |
| OOBI | Out-of-Band Introduction — discovery protocol bootstrapping trust via endpoint resolution |

## Architecture Decision Records (ADRs)

Seven foundational ADRs govern the framework. Each follows Context → Decision → Consequences structure.

| ADR | Title | Scope | Key Decision |
|-----|-------|-------|-------------|
| ADR-001 | KERI-First Identity | All domains | All identifiers are KERI AIDs. No alternative primary identity scheme. External identifiers (email, DID:web) as secondary bindings only. |
| ADR-002 | Passkey-Only AuthN | All user-facing apps | FIDO2/WebAuthn passkeys bound to KERI AIDs. No passwords, no SMS OTP, no email magic links. |
| ADR-003 | ACDC Credential Schema | All credentials | Foundation-governed ACDC schemas. Graduated disclosure by default. Schema changes require governance review. |
| ADR-004 | Witness Threshold 2/3 | Infrastructure | 3 witnesses, 2-of-3 confirmation. High-value: 5 witnesses, 3-of-5. Geographic distribution across 2+ AZs. |
| ADR-005 | Agent Delegation via dip | Agent operations | All agent authority via KERI `dip` events with explicit scope, time window, interaction limits, and escalation triggers. |
| ADR-006 | Pre-Rotation Mandatory | All AIDs | Next rotation keys committed at inception. Not optional. Enables instant recovery without authority dependency. |
| ADR-007 | TEL for All Credentials | All ACDC credentials | Every ACDC has a TEL entry. Verifiers check TEL before accepting any presentation. |

## Agent Autonomy Levels

Five-level classification for AI agent independence:

| Level | Name | Authority | Human Oversight | Example |
|-------|------|-----------|----------------|---------|
| L1 | Assistive | Read-only, suggest | Continuous | Data retrieval, report generation |
| L2 | Supervised | Execute with approval | Per-action | Draft communications, form filling |
| L3 | Bounded | Execute within rules | Exception-based | Routine transactions, credential issuance |
| L4 | Autonomous | Self-directed in scope | Periodic review | Service monitoring, anomaly response |
| L5 | Strategic | Cross-domain coordination | Outcome-based | Multi-agent orchestration, resource allocation |

## Interactive Webapp Patterns

When building interactive framework documentation sites:

### Network Canvas Animation

Use an HTML `<canvas>` element with `requestAnimationFrame` for the agent network visualisation:
- Central "You" node (accent colour, larger radius ~22px)
- Tier 1 nodes: green `#2d8a4e`, radius ~14px, label "R"
- Tier 2 nodes: blue `#4a7fb5`, radius ~10px, label "R"
- Teammate/Delegated nodes: grey `#9e9085`, radius ~7px, no label
- Edges drawn as thin lines (`rgba(200,68,47,0.12)`) with animated packets travelling along them
- Nodes gently wobble via `Math.sin(time * 1.5 + i) * 3`
- Mouse proximity glow effect (radial gradient within 40px)
- Canvas background: transparent, blending with section background
- Legend bar beneath showing all four node types
- Initialise via `IntersectionObserver` (only start animation when visible)

### Layer Accordion

- Vertical stack with left timeline (2px line + dot markers)
- Click header to expand; click inside expanded panel does NOT collapse
- Tech tags in the Technology layer are interactive: clicking switches the right-side detail cards
- Each tech domain (8 total) has its own panel with 3 detail cards

### Lifecycle Stage Selector

- Horizontal flow with arrow connectors between stages
- Click any stage to reveal a detail panel below with: stage number, title, description text, 3 sub-cards, and KERI action chips
- Staggered reveal animation via IntersectionObserver

### ADR Chips

- Pill-shaped chips in `JetBrains Mono`
- Click to expand full ADR detail panel with: title, metadata (status, date, scope), and Context/Decision/Consequences body

### Policy Tabs

- Three-tab interface: Overview (four-column grid), Detailed (deep dive + autonomy table), Interactions (matrix + dependency cards)
- Tab switching re-triggers column stagger animation on Overview tab

### Navigation

- Use `javascript:void(0)` with `data-target` attributes and `scrollIntoView({behavior:'smooth'})` for nav links — avoids popup behaviour in artifact viewers
- Active link tracking via scroll position with `classList.toggle('active-link')`
- Fixed nav with backdrop blur on scroll

### Footer Pattern

- Podcast/audio player card with accent top-bar, title, description, `<audio>` element with `preload="none"`
- Real domain links: `https://selfdriven.foundation`, `.money`, `.pro`, `.network`, `.ai`, `.bot`, `.insure` with `target="_blank"`

## Checklist

Before delivering Digital Interaction Framework content:

- [ ] Five layers numbered 01–05 in correct order (Policy → Governance → Technology → Trust → Interaction)
- [ ] Six lifecycle stages in correct order (Discovering → Co-Creating → Proposing → Using → Updating → Archiving)
- [ ] Four policy domains: Technical, Financial, Human, Agent
- [ ] Trust assurance triad: Fidelity, Confidence, Provenance
- [ ] Trust tiers: Tier 1 (Direct), Tier 2 (Shared), Teammate, Dependable
- [ ] Seven ADRs numbered ADR-001 through ADR-007
- [ ] Five agent autonomy levels L1–L5
- [ ] KERI primitives correctly named: `icp`, `rot`, `ixn`, `dip`, `drt`, not generic terms
- [ ] ACDC, KEL, TEL, OOBI acronyms used correctly
- [ ] Transactional = ephemeral, Interactional = enduring (not reversed)
- [ ] Canvas network animation uses transparent background
- [ ] Nav links use JS scrollIntoView, not href anchors (for artifact viewer compatibility)
- [ ] Brand system from `selfdriven-ecosystem` skill applied (Poppins, JetBrains Mono, flamingo accent, dark mode)
