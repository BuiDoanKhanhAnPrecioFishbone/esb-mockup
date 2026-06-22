# Pack manifest — 2026-06-22 hero batch

URLs derived from `lib/view-matrix.ts` (`sessionUrl`, `dashboardUrl`, `FLOWS`). Captured at
1440×900, light mode, against the running dev server.

| State id | URL (path + query) | What it shows |
|---|---|---|
| `dashboard-manager-active` | `/?role=manager&state=active` | Manager home — metrics + active session cards + activity feed |
| `dashboard-offboarder-active-queue` | `/?role=offboarder&state=active-queue` | Offboarder home — deadline bar + question queue to answer |
| `all-sessions-list` | `/sessions` | All-sessions registry (Active/Completed/All) |
| `session-manager-capture-overview` | `/session/minh-le?role=manager&step=capture&tab=overview` | Session · Manager · Capture · Overview — progress + metrics + "Move to Deliver" |
| `session-manager-capture-data` | `/session/minh-le?role=manager&step=capture&tab=data` | Session · Manager · Capture · Data — module accordion + gaps + questions |
| `session-manager-deliver-overview` | `/session/minh-le?role=manager&step=deliver&tab=overview` | Session · Manager · Deliver · Overview — per-module readiness + "Commit to KG" |
| `session-manager-complete-overview` | `/session/minh-le?role=manager&step=complete&tab=overview` | Session · Manager · Complete · Overview — success banner + "Explore in KG" |
| `session-offboarder-capture-overview` | `/session/minh-le?role=offboarder&step=capture&tab=overview` | Session · Offboarder · Capture · Overview — progress + "Open question queue" |
| `knowledge-graph-default` | `/knowledge-graph` | KG explorer — force-directed graph + copilot + filters |
| `knowledge-graph-from-session` | `/knowledge-graph?prompt=minh-le` | KG explorer entered from a session — modules expanded, copilot pre-filled |
