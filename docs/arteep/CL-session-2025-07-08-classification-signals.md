# ART-EEP — Module Classification Signals, Terminology, Stepper (2025-07-08)

*Apply via Claude Code. Delete after verified.*

---

## CS-01: Stronger visual signals for Review and New Module cards ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Fix:** Apply a **row-level background tint** to non-Pass cards so the entire row changes color.

| State | Left border | Row background | Right badge | Left icon |
|---|---|---|---|---|
| **Pass** | None | White (`bg-white`) | No badge | Gray empty circle |
| **Review** | 3px solid `border-l-amber-400` | `bg-amber-50/50` | Amber "Review" badge | Amber filled dot (8px) |
| **New Module** | 3px solid `border-l-violet-500` | `bg-violet-50/50` | Violet "New Module" badge | Violet filled dot (8px) |
| **Uncategorized** | 3px dashed `border-l-gray-400` | `bg-gray-50/50` | Gray dashed "Uncategorized" badge | Gray dashed circle (8px) |

Left border 3px (not 2px). Badges 11px+ font with `px-2 py-0.5`. Non-Pass rows jump out immediately when scanning.

---

## CS-02: Cross-module cards — "Also in" subtitle ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

Cards in 2+ modules show an "Also in: [module name]" subtitle below the card title:

```
○ 📄 Kafka retry configuration
     Also in: CI/CD Pipeline
```

- 10px, `text-indigo-500`, indented to align with title
- Bidirectional — both instances point to each other
- 3+ modules: "Also in: CI/CD Pipeline, Shared Libraries"
- Mock data: at least 2 cross-module cards

---

## CS-03: Rename "Knowledge Areas" → "Modules" ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

| Old | New |
|---|---|
| `AREAS` (stat card) | `MODULES` |
| `Knowledge Areas` (section header) | `Modules` |

Stat card row: `BOARDS 3` · `CARDS 64` · `MODULES 5` · `QUESTIONS 14`

---

## CS-04: Fix gaps copy ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

| Old | New |
|---|---|
| `KNOWLEDGE GAPS` | `GAPS` |
| `3 module gaps · flags on cards` | `3 unresolved gaps across 2 modules` |

---

## CS-05: Premium stepper — Option B with sub-captions ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx` (PhaseHero / stepper component)

**Issue:** Current stepper is plain circles + lines. Needs to feel premium and professional while clearly communicating phase progress.

### Design: Icon nodes + gradient connectors + dynamic sub-captions

**Node design (32px circles):**

| State | Circle | Icon inside | Shadow |
|---|---|---|---|
| **Done** | Gradient fill (`#34d399` → `#059669`) | Lucide `Check` (white, 14px) | `0 2px 6px rgba(5,150,105,0.15)` |
| **Active** | Gradient fill (`#818cf8` → `#7c3aed`) | Themed icon (white, 14px) | Glow ring: `0 0 0 4px rgba(124,58,237,0.12), 0 2px 8px rgba(124,58,237,0.2)` |
| **Upcoming** | White bg, `border-2 border-gray-200` | Themed icon (gray-300, 14px) | None |

**Themed icons per step:**

| Step | Icon |
|---|---|
| Prepare | Lucide `Package` (data collection) |
| Capture | Lucide `MessageSquare` (Q&A) |
| Deliver | Lucide `Database` (KG commit) |

**Connector lines between nodes:**

| Between | Style |
|---|---|
| Done → Done | Solid 2px, `#059669` (green) |
| Done → Active | Gradient 2px, `#059669` → `#c4b5fd` (green to violet) |
| Active → Upcoming | Dashed 2px, `#c4b5fd` (violet dashed) |
| Upcoming → Upcoming | Dashed 2px, `#e5e7eb` (gray dashed) |

**Sub-captions — dynamic per state:**

| Step | When Done | When Active | When Upcoming |
|---|---|---|---|
| **Prepare** | `64 cards · 5 modules` | `Classifying cards` | — |
| **Capture** | `14 answered · 7 accepted` | `9 of 14 answered` | `Questions and answers` |
| **Deliver** | — | `Review and commit` | `Validate and commit` |

**Sub-caption styling:**
- Done: 9px, `text-gray-500`
- Active: 9px, `text-violet-600` (matches the active node color)
- Upcoming: 9px, `text-gray-300`

**Step label styling:**
- Done: 11px, `font-medium`, `text-emerald-700`
- Active: 12px, `font-semibold`, `text-violet-800`
- Upcoming: 11px, `font-medium`, `text-gray-400`

### CTA buttons per phase

| Phase | Buttons in stepper column |
|---|---|
| **Prepare** | `[Start Capture →]` — outlined violet border, transparent bg |
| **Capture** | `[Start Deliver →]` — outlined violet border, transparent bg |
| **Deliver** | `[← Back to Capture]` — outlined gray border (stacked above) + `[Commit to Knowledge Graph]` — gradient filled `#6366f1→#7c3aed`, white text, Database icon (stacked below) |
| **Complete** | No buttons — all 3 nodes green with checkmarks |

### Background

The stepper column has a subtle gradient background: `linear-gradient(180deg, #f5f3ff 0%, transparent 100%)` with a violet-tinted border (`border-color: #ede9fe`).

---

## Verification checklist

**Classification signals:**
- [ ] Pass: white row, no border, no badge, gray empty circle
- [ ] Review: amber-50 tint, 3px amber border, amber badge, amber dot
- [ ] New Module: violet-50 tint, 3px violet border, violet badge, violet dot
- [ ] Uncategorized: gray-50 tint, 3px dashed border, gray dashed badge, dashed circle
- [ ] Tints subtle (50% opacity)
- [ ] Non-Pass rows jump out when scanning

**Cross-module:**
- [ ] "Also in: [module]" subtitle on cross-module cards (10px, indigo)
- [ ] Bidirectional
- [ ] At least 2 demo cards with multi-module

**Terminology:**
- [ ] "MODULES" not "AREAS" in stat card
- [ ] "Modules" not "Knowledge Areas" in section header
- [ ] "GAPS" not "KNOWLEDGE GAPS"
- [ ] "3 unresolved gaps across 2 modules" not "flags on cards"

**Stepper:**
- [ ] 32px gradient circles with themed Lucide icons
- [ ] Done = green gradient + Check icon + shadow
- [ ] Active = violet gradient + themed icon + glow ring
- [ ] Upcoming = white + gray border + gray icon
- [ ] Gradient connector: green→violet between done→active
- [ ] Dashed connector: violet between active→upcoming
- [ ] Sub-captions change per state (done = outcome, active = progress, upcoming = purpose)
- [ ] Prepare done: "64 cards · 5 modules"
- [ ] Capture active: "9 of 14 answered"
- [ ] Deliver upcoming: "Validate and commit"
- [ ] Prepare active: [Start Capture →] outlined
- [ ] Capture active: [Start Deliver →] outlined
- [ ] Deliver active: [← Back to Capture] outlined + [Commit to KG] gradient
- [ ] Complete: all nodes green, no buttons
- [ ] Stepper column has violet gradient background

---

*End of fixes. Apply via Claude Code. Delete after verified.*
