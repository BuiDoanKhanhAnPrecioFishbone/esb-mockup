# ART-EEP — Implementation Plan & Strategy v2

*Version 2.0 · Sprint 0 Planning Document · Supersedes v1.0 from 2026-05-22*
*Adds Step Zero — Data Integration & Configuration Module*

---

## 0. Executive Summary

### What's new in v2

The Product Owner identified a critical architectural gap: every existing UC (HO-01 through ON-03) assumes that data source integrations are already in place. When UC-HO-01 step 4 lists "Jira, Google Drive, Email metadata," it presupposes those integrations were configured *somewhere*. Currently, no part of the system creates them.

This plan inserts **Step Zero — Data Integration & Configuration** as a new sprint between platform foundation (S0) and the handover initiation flow (S1). Step Zero introduces a new persona (Platform Admin), 4 new screens (Z01–Z04), new audit and secrets-management infrastructure, 5 new pre-build decision blockers, and minor refinements to UC-HO-01 and UC-HO-04 to reference Step Zero outputs.

### Critical path (updated)

```
S0 Foundation → SZ Step Zero → S1 Handover Initiation → S2 Capture & Verify → S3 KG Commit → S4 Onboarding Gen & Read → S5 Skill Gap & Feedback → S6 Polish & Demo
```

Step Zero is now a **hard prerequisite** for S1. The handover flow cannot run without at least one configured connector for the offboarder's department (with AC.3 fallback to generic-question-bank mode if none).

### Scope boundaries (explicit)

**In scope for Step Zero MVP:**
- Connector Library covering 8 curated integrations (M365, Google Workspace, Jira, Salesforce, Slack, Notion, GitHub, generic HRIS)
- Connector Setup Wizard handling OAuth and API-key flows
- Connector Health Dashboard with status, sync lag, error visibility
- Department × Source mapping (per-department configuration)

**Out of scope for MVP** (deferred to v2 or never):
- Field-level entity schema configuration (default mappings ship with each connector)
- Per-source Purview override rules (org defaults sufficient)
- Data lineage UI (admin-only, deferred)
- Sync history detail UI (deferred)
- Custom connector SDK / community marketplace
- Real-time webhook ingestion (sync is pull-based for MVP)
- Cross-org data sharing
- Federated identity beyond Entra ID
- AI-suggested mappings

---

## 1. Step Zero — Architectural Justification

### The gap, named

Every existing UC presumes integrations exist. UC-HO-01 step 4 reads "*Manager confirms which data sources to scan: Jira, Google Drive, Email metadata*" — without specifying how those data sources arrived in the system. UC-HO-04's KG commit pipeline assumes entity schemas are defined; UC-ON-01's Section Blueprint primitive assumes the knowledge layer is structured. None of those assumptions are honored by any UC we've written.

The gap exists because the v1 plan implicitly treated integrations as infrastructure (something that "just gets set up" in S0 Foundation alongside Azure provisioning). That conflation is wrong for two reasons:

1. **Integrations are operational, not infrastructure.** Platform Admins configure, monitor, and rotate them throughout the system's life — not just at install time. They need a permanent UI surface, not a one-shot DevOps script.
2. **Department diversity demands per-org configuration.** Engineering needs Jira; Sales needs Salesforce; People Ops needs HR system access. The same company has different source mixes per department. Hard-coding this is impossible.

### What Step Zero solves

Step Zero is the answer to: *"Where does ART-EEP get its raw data from, and who configures that?"*

It provides:
- **A connector catalog** — what we can integrate with
- **A credential vault** — secure storage for OAuth tokens and API keys
- **A schema mapping layer** — how each source's data shape maps to ART-EEP's entity model
- **A sensitivity classifier hook** — how each source's content gets routed through Microsoft Purview
- **A sync scheduler** — when to pull from each source
- **A health dashboard** — visibility into what's working and what isn't

After Step Zero runs at install time and is kept current by Platform Admins, every downstream UC can rely on the integration layer existing.

### What happens without Step Zero (the cost)

Without Step Zero, the platform can demo but cannot ship:

- The demo works because we hardcode three integrations for the canonical persona (Minh Lê / Engineering).
- Production breaks the moment a non-engineering offboarder shows up. There's no path to onboard a new integration (a Manager would have to file an IT ticket asking for code changes).
- Compliance breaks the moment any source needs credential rotation. No UI exists for rotating an OAuth token without a code deploy.
- Trust breaks when an integration silently fails — there's no surface to detect it.

Step Zero is the difference between *prototype* and *product*.

---

## 2. Refined Sprint Roadmap

### 2.1 Sprint table

| Sprint | Duration | UCs / Module | Primary Persona | Demo-able Output |
|---|---|---|---|---|
| **S0 — Platform Foundation** | 1 week | (infra + design system) | — | Azure provisioned, shared components shipped |
| **SZ — Step Zero (NEW)** | **2 weeks** | **Data Integration Module (Z01–Z04)** | **Platform Admin** | **Admin can browse, configure, monitor, and map 8 connectors across departments** |
| **S1 — Handover Initiation** | 2 weeks | UC-HO-01, UC-HO-05 | Manager | Manager opens a session, configures prompts, watches seeding |
| **S2 — Capture & Verify** | 2 weeks | UC-HO-02, UC-HO-03 | Offboarder | Full voice interview → signed transcript |
| **S3 — KG Commit** | 1.5 weeks | UC-HO-04 | Manager | Atomic indexing pipeline runs end-to-end |
| **S4 — Onboarding Gen & Read** | 2 weeks | UC-ON-01, UC-ON-02 | Manager + Onboarder | Playbook configured, generated, read with Copilot |
| **S5 — Skill Gap & Feedback** | 1.5 weeks | UC-ON-03, UC-HO-06, UC-HO-07 | Onboarder + Manager | Active Learning loop closes |
| **S6 — Polish, Pitch, Deploy** | 1 week | (cross-cutting) | All | 3-min demo runs unattended |

**Total timeline:** ~12 weeks (was ~7–8 weeks in v1).

### 2.2 Sprint dependency notes

- **SZ is a hard prerequisite for S1.** UC-HO-01 step 4 cannot reference data sources until Step Zero provides them. This is a *blocking* dependency, not a soft preference.
- **S0 → SZ** can have a 2–3 day overlap. Azure Key Vault provisioning (S0) can begin while design system finalizes; SZ can start mocking against Vault-provisioned secrets.
- **SZ runs single-track** because the Platform Admin persona is new and the integration logic is novel. Parallelizing this sprint risks integration-pattern drift.
- **All subsequent sprints unchanged** in dependency order. Step Zero plugs in cleanly.

### 2.3 Step Zero sprint detail

**Goal:** Platform Admin can fully configure, monitor, and govern data integrations before any handover or onboarding flow runs.

**Tasks:**
- Provision Azure Key Vault for OAuth tokens and API keys (begins in S0, completes in SZ)
- Connector catalog data model (which providers, what auth method, what scopes, what schema)
- OAuth client registration with the 8 MVP providers
- Build Z01 Connector Library (browse + filter)
- Build Z02 Connector Setup Wizard (OAuth dance + API key + scope confirmation + test connection)
- Build Z03 Connector Health Dashboard (status, sync lag, error visibility)
- Build Z04 Department × Source Mapping (per-department source selection)
- Wire Step Zero output into UC-HO-01's data source listing (refactor — small but real)
- Audit trail for connector lifecycle events (enable, disable, credential update, scope change)

**Parallelization:** 1 frontend dev (Z01 + Z03), 1 frontend dev (Z02 + Z04), 1 backend on connector adapters + Key Vault integration, 1 backend on audit + Purview integration.

**Sprint blockers (TBDs):** TBD-Z1 through TBD-Z5 (see §10).

**Risks:** §11 covers in detail. The biggest: OAuth callback domain whitelisting needs to be done with each provider's developer portal, which can take 5–10 business days per provider for security review.

---

## 3. Step Zero — Detailed Design

### 3.1 Module purpose

Step Zero is the *integration governance layer*. It owns the answer to four questions:

1. **What can we integrate with?** (Connector Library — Z01)
2. **What are we currently integrated with, and is it healthy?** (Connector Health Dashboard — Z03)
3. **How do we add a new integration?** (Setup Wizard — Z02)
4. **Which integrations apply to which parts of the company?** (Department × Source Mapping — Z04)

### 3.2 Personas

**An Quân Vũ — Platform Admin / IT** (NEW, 4th persona). Owns:
- Connector enablement and credential management
- Health monitoring and incident response when integrations fail
- Department-source mapping in collaboration with Department Leads
- Compliance attestation that source-data ingress respects org policies

The Platform Admin role is distinct from Manager (Hà Vy) because the access scope is platform-wide, the responsibilities are operational, and the on-call expectation is different. RBAC must differentiate.

### 3.3 Connector catalog (MVP — 8 connectors)

| # | Connector | Category | Auth | Scopes (min) |
|---|---|---|---|---|
| 1 | Microsoft 365 (Email + OneDrive + SharePoint + Teams) | Productivity | OAuth | Read-only mail.read, files.read.all, group.read |
| 2 | Google Workspace (Drive + Gmail + Calendar) | Productivity | OAuth | drive.readonly, gmail.metadata, calendar.readonly |
| 3 | Jira (Cloud) | Engineering | OAuth | read:jira-work, read:jira-user |
| 4 | Salesforce | Sales / CRM | OAuth | api (read), refresh_token |
| 5 | Slack | Communication | OAuth | channels:history, users:read, files:read |
| 6 | Notion | Productivity | OAuth | read content, read user info |
| 7 | GitHub | Engineering | OAuth (GitHub App) | repo:read, metadata, issues |
| 8 | Generic HRIS (BambooHR / Workday adapter) | HR / People | API key | Read-only employees, departments |

This catalog ships in the MVP. Adding a 9th connector post-MVP requires a code change (new adapter) + catalog entry — no UI to add custom connectors in v1.

### 3.4 Screens

#### Z01 — Connector Library

**Purpose:** Platform Admin browses what's available and sees current connection status at a glance.

**Key specifications:**
- Header: "Integrations" + connector count summary ("4 connected · 4 available · 0 needs attention")
- Filter bar: category chips (All · Productivity · Engineering · Sales · Communication · HR) · search field
- Grid: 8 connector cards. Each card carries: provider logo, name, category tag, one-line description, status badge (Not connected · Connected · Needs reauthorization · Disabled)
- Click on a card → opens Z02 in setup mode (if not connected) or detail mode (if connected)
- Audit trail link at the bottom

**Cross-references:**
- Status badge uses S0 Confidence Badge pattern (Verified → Connected; Low Confidence → Needs reauthorization)
- Audit Log Tile (S0) used for the audit trail link

**States applicable:**
- **S-1 Cold Start** — First-time install, zero connectors configured. Empty hero + "Set up your first integration" CTA pointing to the highest-value connector for the org's primary department.
- **S-2 Happy Path** — Some connectors connected, browse mode.
- **S-5 Empty Filter Result** — Search/filter yields no matches. Suggest clearing filters.
- **S-7 RBAC-Masked** — Non-admin role accesses. Mask Card explains required role and offers "Request admin access."

#### Z02 — Connector Setup Wizard

**Purpose:** Walk the Platform Admin through enabling a new integration safely.

**Key specifications:**
- 5-step wizard with stepper indicator at top
  - Step 1: **Authorize** — OAuth redirect or API key entry. Provider-specific UI.
  - Step 2: **Confirm scopes** — show which permissions ART-EEP is requesting and why. Each scope has a plain-English rationale.
  - Step 3: **Test connection** — system makes a sample call (e.g., list 3 projects for Jira), shows result.
  - Step 4: **Configure sync schedule** — default "Every hour" — alternatives: "Every 15 minutes" or "On demand only" — explains rate-limit implications of each.
  - Step 5: **Confirm and save** — summary card with all selections + "Connect" CTA.
- Each step has Back button (preserves state) and Cancel (confirms abandon)
- Error states inline — never crash the wizard on a sub-step failure

**Cross-references:**
- Manager Wizard from S1 (Setup Wizard) shares the FormSection + ReadOnlyField + Banner pattern — reuse for visual consistency
- Audit trail entry on each step completion

**States applicable:**
- **S-1 Cold Start** — Provider just picked, no creds entered yet.
- **S-3 Loading** — OAuth in flight (redirect dance), or test connection running.
- **S-2 Happy Path** — All steps successful, on confirmation step.
- **S-6 Error (recoverable)** — OAuth failed, credentials invalid, API unreachable, or test connection returns 4xx/5xx. Inline error + retry affordance.
- **S-13 Partial / Fallback** — Some scopes granted, some denied by user during OAuth consent. Show degraded-mode summary + option to proceed or restart.

#### Z03 — Connector Health Dashboard

**Purpose:** Platform Admin's daily operations surface. Answers "is anything broken?" in 3 seconds.

**Key specifications:**
- Top stats row: "8 total · 6 healthy · 1 degraded · 1 failed"
- Connector list sorted by status (failed first, then degraded, then healthy)
- Each row: connector name, status badge with last sync timestamp, error count in last 24h, mini-sparkline of sync success rate, drill-down chevron
- Drill-down (expand inline) shows: last error message, last 5 sync attempts, manual "Sync now" + "Retry" affordances
- Audit Log strip at the bottom shows recent connector lifecycle events (enabled, disabled, credential rotated)

**Cross-references:**
- Severity Badge (S0) for status (Critical = failed, High = degraded, Low = healthy)
- Audit Log Tile (S0) for lifecycle events
- The sparkline is a new pattern — should be specced minimally (12px tall, line-only, no axes)

**States applicable:**
- **S-1 Cold Start** — No connectors yet. Link to Z01.
- **S-2 Happy Path** — All connectors green.
- **S-3 Loading** — Refreshing status (rare; usually background).
- **S-6 Error (recoverable)** — One or more connectors in failed state. Failed connectors render at top with rose left-border accent.
- **S-13 Partial** — Mix of healthy and failed; system continues operating with degraded coverage for affected departments.

#### Z04 — Department × Source Mapping

**Purpose:** Platform Admin (with Department Lead input) declares which connectors apply to which departments. This is what UC-HO-01 step 4 reads.

**Key specifications:**
- Left panel: list of departments (pulled from HRIS connector)
- Right panel: for the selected department, a list of available connectors with checkboxes
- For each enabled connector: optional "Department lead approval" indicator (with date and approver name)
- Save bar at the bottom: shows pending changes count and Save / Discard
- Inline indicator: "12 active handover sessions depend on this mapping" — surfaces blast radius before edit

**Cross-references:**
- DataSourceRow (S1 Wizard) pattern for the checkbox rows
- Audit Log Tile (S0) for mapping changes

**States applicable:**
- **S-1 Cold Start** — No departments mapped yet. Empty state guides through first department.
- **S-2 Happy Path** — Mappings exist, edit mode.
- **S-6 Error (recoverable)** — Save validation failure (e.g., mapping references a now-disabled connector).
- **S-14 Locked** — Department has active handover sessions; mapping changes locked with override-by-admin escalation.

### 3.5 Step Zero integrations to existing infrastructure

Step Zero integrates with five existing infrastructure systems we already committed to:

| Infrastructure | How Step Zero uses it |
|---|---|
| **Azure Key Vault** | All OAuth tokens, refresh tokens, and API keys stored here. Step Zero never displays the raw secrets to anyone, including the admin who entered them. |
| **Azure AI Search** | Each connector creates a per-source index. Schema mapping (Step Zero) defines what fields get indexed. |
| **Cosmos DB Gremlin** | Schema mapping (Step Zero) defines how source records become graph entities and relationships. |
| **Microsoft Purview** | Step Zero registers each connector with Purview so source content gets classified before reaching the KG (preserves CL-005 — Purview as mandatory PII gate). |
| **Entra ID** | Step Zero introduces the Platform Admin RBAC role distinct from Manager. |

### 3.6 New audit trail surfaces

Connector lifecycle events that need immutable audit (UC-HO-04 SR Auditability pattern extends here):
- Connector enable / disable
- Credential update or rotation
- Scope grant or revocation
- Department-source mapping change
- Sync schedule change
- Failed authentication (security event — alert in addition to log)

Each audit entry references the actor (Platform Admin name), timestamp, before/after values where applicable, and connector ID.

---

## 4. Updated Screen Inventory

Original 20 screens + 4 new Z screens = **24 total**.

| # | Screen | UC / Module | Sprint | Primary Actor | Complexity |
|---|---|---|---|---|---|
| **Z01** | **Connector Library** | **Step Zero** | **SZ** | **Platform Admin** | **Medium** |
| **Z02** | **Connector Setup Wizard** | **Step Zero** | **SZ** | **Platform Admin** | **High** |
| **Z03** | **Connector Health Dashboard** | **Step Zero** | **SZ** | **Platform Admin** | **Medium** |
| **Z04** | **Department × Source Mapping** | **Step Zero** | **SZ** | **Platform Admin** | **Medium** |
| 1 | Manager Dashboard | HO-01 | S1 | Manager | Low |
| 2 | Session Setup Wizard | HO-01 | S1 | Manager | Medium |
| 3 | Context Seeding Progress | HO-01 | S1 | Manager | Low |
| 4 | Preliminary Knowledge Map | HO-01 | S1 | Manager | Medium |
| 5 | Prompt Configuration | HO-05 | S1 | Manager | Medium |
| 6 | Pre-Interview Briefing | HO-02 | S2 | Offboarder | Low |
| 7 | Live Voice Interview | HO-02 | S2 | Offboarder | High |
| 8 | Text Mode Interview | HO-02 | S2 | Offboarder | Medium |
| 9 | Review Workspace | HO-03 | S2 | Offboarder | High |
| 10 | Sign-off Modal | HO-03 | S2 | Offboarder | Low |
| 11 | Manager Completion Report | HO-04 | S3 | Manager | Low |
| 12 | Playbook Builder | ON-01 | S4 | Manager | High |
| 13 | Generation Stage | ON-01 | S4 | Manager | High |
| 14 | Onboarder Dashboard | ON-02 | S4 | Onboarder | Low |
| 15 | Playbook Reading | ON-02 | S4 | Onboarder | High |
| 16 | Full Graph View | ON-02 | S4 | Onboarder | Medium |
| 17 | Skill Gap & Growth Plan | ON-03 | S5 | Onboarder | Medium |
| 18 | Skill Dispute Panel | ON-03 | S5 | Onboarder | Low |
| 19 | Hallucination Feedback Drawer | HO-06 | S5 | Onboarder/Offboarder | Medium |
| 20 | Correction Review Diff | HO-07 | S5 | Manager | Medium |

---

## 5. State Taxonomy (unchanged from v1)

The 14-state vocabulary defined in v1 §4 is preserved. Step Zero screens draw from this taxonomy — no new states introduced. Reference table below for convenience.

| ID | State | When It Appears |
|---|---|---|
| S-1 | Cold Start | First encounter, no data |
| S-2 | Happy Path | Normal flow |
| S-3 | Loading | Async work in progress |
| S-4 | Generation | LLM/Agent producing content |
| S-5 | Empty (post-init) | No items, UI initialized |
| S-6 | Error (recoverable) | System error, retry available |
| S-7 | RBAC-Masked | Permission-blocked |
| S-8 | Disputed | User-flagged content |
| S-9 | Verified | Human-approved content |
| S-10 | Low Confidence | AI uncertain |
| S-11 | Paused | User-initiated pause |
| S-12 | Overdue | Deadline missed |
| S-13 | Partial / Fallback | Degraded operation |
| S-14 | Locked | Pre-condition missing |

---

## 6. Impact on Existing UCs

Step Zero changes implicit assumptions in existing UCs. The changes are minor but real, and they must be reflected in the updated UC documents.

### UC-HO-01 — Initiate Handover Session

| Step | Original wording | v2 wording |
|---|---|---|
| **Step 4** | "Manager confirms which data sources to scan" | "System looks up Step Zero's Department × Source mapping for the Offboarder's department and presents the configured sources for Manager confirmation" |
| **Precondition (new)** | — | "At least one connector configured for the Offboarder's department in Step Zero (if none, fallback per AC.3)" |
| **AC.3 (refined)** | "No data sources available — fallback to generic question bank" | "No data sources available *or* none mapped for this department in Step Zero — fallback to generic question bank" |

### UC-HO-04 — Submit Handover Record to Knowledge Graph

| Element | Change |
|---|---|
| **KG schema** | Read from Step Zero's entity schema mappings rather than hardcoded |
| **Skill taxonomy seed** | Augmented from Step Zero HRIS connector (if available) |

### UC-ON-01 — Generate Personalized Onboarding Playbook

| Element | Change |
|---|---|
| **Section Blueprint primitive** | May (optionally) be informed by department-source patterns from Step Zero — but only if the data is rich enough; otherwise defaults apply |

No other UC is affected.

---

## 7. Cross-Cutting Concerns

### 7.1 New persona: Platform Admin (4th persona)

**An Quân Vũ** — Platform Admin / IT (proposed name to maintain Vietnamese naming convention from prior personas). RBAC role distinct from Manager. Different audit log filters, different home surface (Z03 Connector Health Dashboard is the Admin's "Dashboard" equivalent of Hà Vy's Handover Dashboard).

### 7.2 Secrets management

All connector credentials live in Azure Key Vault. Step Zero never displays raw secrets after initial entry — even to the admin who created them. Re-authorization on credential failure is a flow, not a "show me the token" operation. OAuth refresh tokens auto-rotate per provider; static API keys carry a 90-day rotation reminder badge in Z03.

### 7.3 Connector marketplace governance

For MVP, the catalog is curated — 8 connectors, period. No community submissions, no admin-added custom connectors, no SDK. v2 may add a custom connector framework if customer demand surfaces.

### 7.4 Backward compatibility

When a connector's API version changes upstream, Step Zero's adapter must be updated in code (not config). Each adapter logs its API version; Z03 surfaces an "API version drift" warning if a provider announces deprecation. This is a manual operational discipline, not a runtime guarantee.

### 7.5 Connector deprecation

When a connector is disabled, downstream impact is non-trivial: handover sessions referencing it lose their seeded context, playbooks lose their source attribution. UC-HO-01 should gate disablement: connectors with active handover sessions are locked from removal until those sessions resolve (per Z04 S-14 Locked state).

---

## 8. Pre-Build Decision Blockers

### 8.1 Existing blockers (from v1, unchanged)

| TBD | Blocks | Owner |
|---|---|---|
| HO-01 TBD-1 | S1 | Legal — PDPA basis for automated scanning |
| HO-01 TBD-3 | S1 | Legal/HR — Offboarder view rights for own Knowledge Map |
| HO-03 TBD-1 | S2 | Legal — E-signature standard |
| ON-01 TBD-2 | S4 | Product — Static vs interactive Playbook |
| ON-02 TBD-3 | S4 | Product — Mobile parity scope |
| HO-06 TBD-1 | S5 | HR — SLA for Manager correction review |

### 8.2 New blockers from Step Zero

| TBD | Blocks | Owner | Question |
|---|---|---|---|
| **TBD-Z1** | **SZ** | **IT Security** | What's the minimum OAuth scope set per connector that legal will approve? |
| **TBD-Z2** | **SZ** | **IT + Legal** | Does adding a new connector require security review? If yes, what's the workflow and SLA? |
| **TBD-Z3** | **SZ** | **Product + IT** | Default sync frequency: hourly, 15-min, or on-demand? Cost implications per provider's rate limits. |
| **TBD-Z4** | **SZ** | **Legal + DPO** | Source data retention: how long do we keep raw source content before deletion? Does it depend on per-source sensitivity classification? |
| **TBD-Z5** | **SZ** | **Product** | When a connector is disabled, what happens to downstream KG nodes and active sessions? Hard-delete, soft-isolate, or grace-period? |

All 5 are hard SZ blockers. None can be defaulted without risk — they intersect legal, security, and product judgment.

---

## 9. Risk Register

### 9.1 Step Zero-specific risks

| Risk | Severity | Mitigation |
|---|---|---|
| OAuth callback domain whitelisting requires per-provider security review (5–10 business days each) | High | Begin all 8 provider registrations in S0 in parallel; track in a Provider Registration spreadsheet |
| API rate limits vary widely per provider (Jira: 5000/hr; Salesforce: depends on org edition; Slack: tier-dependent) | Medium | Default sync frequency conservative (1/hr); allow per-connector overrides in Z02 step 4 |
| Connector vendor SLA dependencies (if Notion API is down, our system shows degraded) | Medium | Z03 Health Dashboard surfaces the issue; degraded mode doesn't block handovers, just reduces coverage |
| Secrets Vault availability — if Azure Key Vault is unreachable, no connector can authenticate | High | Cache valid tokens in encrypted local cache with 5-min TTL; surfaces Vault-down alert immediately |
| Multi-tenancy concerns if same connector serves multiple Onboarder/Offboarder pairs | Medium | Per-org isolation via Cosmos DB partition keys (already in architecture); Step Zero respects this |

### 9.2 Existing risks (from v1, unchanged but timeline shifted)

Whisper API latency, e-signature compliance, Cosmos DB Gremlin atomic transaction limits, etc. — all still apply, just to S2 / S3 timelines now that SZ has been inserted.

---

## 10. Demo & Pitch Implications

### What changes for the demo

The hackathon pitch should now begin with a 10–15 second Step Zero moment: "Before any handover can happen, our Platform Admin configures the integrations once. Here's that one-time setup." Demonstrate Z01 (browse) → Z02 (connect one provider) → Z03 (health is green). Then transition to "Now Hà Vy can run a handover session…" and proceed with the existing demo flow.

This actually *strengthens* the pitch by demonstrating production-readiness, not just demo-readiness. The judges' question "but how does this scale to other departments?" gets answered before they ask.

### Demo dataset additions for SZ

- 8 connector entries pre-populated in the catalog (4 connected: M365, Google Workspace, Jira, Salesforce; 4 not connected: Slack, Notion, GitHub, HRIS)
- 1 connector showing "Needs reauthorization" status for the troubleshooting moment
- Department × Source mapping populated for Engineering, Sales, People Ops (the three departments demonstrated by our 3-persona dashboard)

---

## 11. Design Change Log (this plan's entries)

The full Change Log is maintained separately at `/mnt/user-data/outputs/ARTEEP-design-change-log.md`. The entries below cover decisions made specifically while generating this v2 plan.

### CL-066 — Step Zero introduced as a new sprint between S0 and S1
**Sprint:** Planning (v2) · **Category:** BA Gap · **Decided by:** Stakeholder + BA
**Why:** Original v1 plan implicitly treated integrations as infrastructure (one-shot setup in S0). This conflation hid the operational reality that Platform Admins manage integrations throughout the system's life. Step Zero gives that reality a dedicated UI surface and sprint allocation.

### CL-067 — Step Zero MVP scoped to 4 screens (Z01–Z04)
**Sprint:** Planning (v2) · **Category:** Scope Deferral · **Decided by:** BA
**Why:** Identified 9 potential screens (registry, setup, health, mapping, role defaults, schema, sensitivity rules, lineage, sync history). Cut to 4 by deferring: schema config (ships per-connector with defaults), sensitivity rules (Purview defaults sufficient), lineage UI (admin power-user, deferred), sync history (deferred). Role defaults derivable from Department × Source mapping, no separate screen needed.

### CL-068 — New persona introduced: An Quân Vũ (Platform Admin)
**Sprint:** Planning (v2) · **Category:** BA Gap · **Decided by:** BA
**Why:** Step Zero's operational ownership doesn't map cleanly to Manager (Hà Vy) — different scope (platform-wide vs. team), different responsibilities (integration health vs. handover quality), different on-call expectations. The 4th persona is justified by genuinely distinct responsibilities, not a manufactured role for screen-padding.

### CL-069 — Connector catalog scoped to 8 MVP integrations
**Sprint:** Planning (v2) · **Category:** Scope Deferral · **Decided by:** BA + Architecture
**Why:** 8 covers the major SaaS surfaces a typical Vietnamese mid-market company would need (M365 + Google Workspace cover communication; Jira/GitHub cover engineering; Salesforce covers sales; Slack/Notion cover collaboration; HRIS covers org structure). Adding a 9th connector becomes a code change in v2. Curated catalog only — no admin-added custom connectors in MVP.

### CL-070 — UC-HO-01 step 4 and AC.3 to be refined to reference Step Zero output
**Sprint:** Planning (v2) · **Category:** BA Gap (cross-impact) · **Decided by:** BA
**Why:** UC-HO-01 step 4's wording ("Manager confirms data sources") presumed unspecified setup. The v2 wording explicitly references Step Zero's Department × Source mapping. AC.3 (no data sources) extends to "no data sources *or* none mapped." UC document update required in S0.

### CL-071 — 5 new pre-build decision blockers (TBD-Z1 through TBD-Z5)
**Sprint:** Planning (v2) · **Category:** Default Pending Confirmation · **Decided by:** BA
**Why:** Step Zero intersects security, legal, and product judgment. The 5 TBDs cover OAuth scope minimums, connector approval workflow, sync frequency, source data retention, and connector deprecation behavior. All 5 are hard blockers — none can be defaulted safely. Sprint SZ cannot start until owners are named.

### CL-072 — Plan v2 supersedes v1 (file preserved for diff)
**Sprint:** Planning (v2) · **Category:** Visual System · **Decided by:** BA
**Why:** Original v1 plan file at `/mnt/user-data/outputs/ARTEEP-implementation-plan.md` is preserved unchanged. This v2 file is the new operative plan. The Master UC Index also needs an update (planned for S0) to reflect Step Zero — that update will be its own Change Log entry when made.

### CL-073 — Total project timeline extended from ~7-8 weeks to ~12 weeks
**Sprint:** Planning (v2) · **Category:** Scope Deferral · **Decided by:** BA + Stakeholder
**Why:** Inserting Step Zero adds 2 weeks to the critical path. For hackathon-compressed mode, Step Zero can be mocked with 2 connectors instead of 8 (reduces to ~1 week). For production-ready release, full 8-connector catalog requires the full SZ allocation. Mode decision pending stakeholder per CL-003.

---

## 12. Approval Gate

The plan locks when the items below are confirmed:

1. **Step Zero scope** — confirm 4 MVP screens (Z01–Z04) and 8 MVP connectors. Anything to add or remove?
2. **Platform Admin persona** — confirm An Quân Vũ as 4th persona, or propose alternative.
3. **Sprint SZ duration** — confirm 2 weeks production / 1 week hackathon-compressed.
4. **Step Zero blocker owners** — assign owners for TBD-Z1 through TBD-Z5 (or accept BA defaults pending escalation).
5. **UC document updates** — approve UC-HO-01 v2.1 wording changes to step 4, AC.3, and new precondition. (Drafted in §6, ready for circulation.)
6. **Demo flow change** — approve adding a Step Zero opener segment to the hackathon pitch (10–15 seconds).

---

*Plan prepared for ART-EEP build kick-off · v2.0 · awaiting approval before SZ build begins.*
