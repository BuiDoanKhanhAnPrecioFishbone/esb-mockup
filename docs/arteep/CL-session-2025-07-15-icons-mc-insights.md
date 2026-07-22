# ART-EEP — Card Icons, Module Classification, KG Insights (2025-07-15 session 2)

*Apply via Claude Code. Delete after verified.*

---

## §1 — Card Row Icon

### UI-05: Change file icon to Trello card icon ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** Card rows use a generic Lucide `FileText` icon. Since all cards originate from Trello, the icon should represent a Trello card.

**Fix:** Replace `FileText` with Lucide `SquareKanban` (or `Columns3` / `LayoutList` — whichever best resembles a Trello card icon). If none of these feel right, use `CreditCard` as a simple rectangular card shape.

Apply to ALL card row icons in the Data tab — both in `session-command-view.jsx` and anywhere else card rows are rendered.

---

## §2 — Module Classification Panel

### MC-08: Remove verdict/alert box entirely ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** The verdict box ("Confident match — no action needed", "Review needed", "New Module Suggested", etc.) takes up space at the top of the panel. The AI reasoning chat below already explains everything.

**⚠️ REVERSAL of MC-07:** MC-07 moved the verdict to the top of the panel. Now we remove it entirely.

**Fix:** Remove the verdict/alert box from the Module Classification panel. No green "Confident match" box, no amber "Review needed" box, no violet "New Module" box.

The panel layout becomes:
1. Header: "Module Classification" + × close
2. AI Reasoning conversation (M/G chat bubbles) — this IS the explanation
3. Confidence bar
4. Assigned modules (pinned footer — see MC-09)

---

### MC-09: Move Assigned Modules to pinned footer ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** "Assigned modules" chips sit between the verdict and the AI reasoning, interrupting the reading flow.

**Fix:** Move the "Assigned modules" section (chips + "+ Add module" + Save/Cancel) to a **pinned footer** at the bottom of the panel:

```
┌── Module Classification ────────── × ─┐
│                                        │
│  AI REASONING                          │
│  ┌────────────────────────────────┐   │
│  │ M · CLASSIFY                        │   │
│  │ Clear Payment Service signals...   │   │
│  └────────────────────────────────┘   │
│  ┌────────────────────────────────┐   │
│  │ G · VALIDATE                        │   │
│  │ Confirmed — single clean home...   │   │
│  └────────────────────────────────┘   │
│                                        │
│  CONFIDENCE  93%                       │
│  █████████████████████████████░░░     │
│                                        │
│ (scrollable content above)             │
│                                        │
├──────────────────────────────────────┤
│  ASSIGNED MODULES (pinned footer)      │
│  [Payment Service ×]  [+ Add module]   │
│                       [Save] [Cancel]  │
└──────────────────────────────────────┘
```

The footer is always visible at the bottom of the panel (sticky), regardless of scroll position. The AI reasoning + confidence scroll above it.

---

### MC-10: Remove module name from section titles ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** Section titles say "AI REASONING · PAYMENT SERVICE" and "CONFIDENCE · PAYMENT SERVICE". The module name is redundant — the entire panel is about one card, and the assigned module is visible in the footer.

**Fix:**
- "AI REASONING · PAYMENT SERVICE" → "AI REASONING"
- "CONFIDENCE · PAYMENT SERVICE" → "CONFIDENCE"

Remove the module name suffix from all section headers in the Module Classification panel.

---

### MC-11: Add more AI reasoning chat content ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** The AI reasoning section currently shows only 2 chat bubbles (M · CLASSIFY + G · VALIDATE). This feels thin. More conversation steps showcase the AI’s analytical depth.

**Fix:** Expand the AI reasoning to show 3-4 steps for interesting cases (Review, New Module). For Pass/confident cases, 2 steps is fine.

**Example for a Review card (Datadog dashboard, 41% confidence):**
```
M · CLASSIFY
"Mixed signals — SLO tracking matches Monitoring, but
alert thresholds reference Payment Service gateway.
Split confidence: 41% Monitoring, 38% Payment."

G · CHALLENGE
"The payment gateway references are contextual, not
functional. Datadog monitors the gateway but doesn’t
process payments. Recommend Monitoring."

M · RECLASSIFY
"Adjusting. Primary: Monitoring & Alerts. Secondary
link to Payment Service preserved as cross-reference."

G · VALIDATE
"Confirmed with cross-module link. Flagging for
human review due to low confidence (41%)."
```

For high-confidence Pass cards, keep the existing 2-step (M · CLASSIFY + G · VALIDATE).

---

## §3 — Knowledge Graph Insights

### KI-01: Remove left module list panel ✅ LOCKED

**File:** `components/mockups/knowledge-graph-insights.jsx` (or wherever Insights lives)

**Issue:** The Insights view has a left panel listing all modules with entry counts and gap badges. This duplicates the heatmap on the right which already shows all modules.

**Fix:** Remove the left module list. The Insights view shows ONLY the heatmap ("Activity across all modules") taking the full width.

---

### KI-02: Remove gaps from Insights ✅ LOCKED

**File:** `components/mockups/knowledge-graph-insights.jsx`

**Issue:** Gap badges and gap counts appear in the module list (now removed) and potentially in the heatmap legend.

**Fix:** Remove all gap-related elements from the Insights view:
- Remove "Gap" from the heatmap legend (keep: None, Low, High only)
- Remove yellow gap indicators from the heatmap cells
- Remove any gap count text

Gaps are tracked in the session (Data tab, gap lists). The KG Insights shows only knowledge ACTIVITY, not gaps.

---

### KI-03: Heatmap shows card count on hover ✅ LOCKED

**File:** `components/mockups/knowledge-graph-insights.jsx`

**Issue:** Need to clarify what the heatmap cells represent and what information is shown on hover.

**Fix:** Each heatmap cell represents a module’s activity for a specific time period (month). On hover, show a tooltip with the card count:

```
Payment Processing · June
12 cards updated
```

Heatmap legend: None (empty) · Low (light violet) · High (dark violet). No gap colors.

---

### KI-04: KG entry point — employee filter ✅ LOCKED

**File:** `components/mockups/knowledge-graph-explorer.jsx`

**Issue:** When opening the Knowledge Graph (from sidebar or direct URL), users need to select which offboarder’s graph to view. Currently it defaults to Minh Lê with no way to switch.

**Fix:** Add an employee filter/selector at the top of the KG explorer:

```
Knowledge Graph    [Minh Lê ▾]      [← Back to graph] (when in Insights)
```

- Dropdown shows all offboarders who have completed or are completing handover sessions
- For the POC: Minh Lê (complete) and Phương Anh (in progress, grayed out or tagged "in progress")
- Selecting an offboarder reloads the graph with that person’s session data
- The graph title updates: "Minh Lê’s Knowledge Graph" → "Phương Anh’s Knowledge Graph"

---

## Verification checklist

**Card icons:**
- [ ] FileText icon replaced with Trello-style card icon on all card rows

**Module Classification:**
- [ ] Verdict/alert box removed entirely (no green/amber/violet alert)
- [ ] Assigned modules section in pinned footer (always visible at bottom)
- [ ] Section titles: "AI REASONING" and "CONFIDENCE" (no module name suffix)
- [ ] Review/New Module cards show 3-4 AI reasoning steps
- [ ] Pass cards show 2 AI reasoning steps (unchanged)

**KG Insights:**
- [ ] Left module list panel removed
- [ ] Heatmap takes full width
- [ ] No gap badges, gap counts, or gap colors in Insights
- [ ] Heatmap legend: None / Low / High only (no Gap)
- [ ] Hover on heatmap cell shows "[Module] · [Month] — N cards updated"

**KG Explorer:**
- [ ] Employee dropdown at top of KG explorer
- [ ] Shows completed/in-progress offboarders
- [ ] Selecting employee reloads the graph
- [ ] Graph title updates per selected employee

---

*End of fixes. Apply via Claude Code. Delete after verified.*
