// lib/data.ts — the single source of truth for the ART-EEP mockup's session data.
//
// The JSON files under /data are the "tables"; this module is the "query layer".
// EVERY aggregate number (cards, modules, questions, answered, accepted, gaps, …) is
// DERIVED from the arrays here — nothing is hand-counted in a component. Seed the JSON
// and the numbers follow, so they are always impressive AND internally consistent.
//
// References are by id (moduleId, boardId, authorId, linkedModuleIds) so a rename is a
// single edit and `verifyData()` can prove every reference resolves.

import sessionJson from "../data/session.json";
import coworkersJson from "../data/coworkers.json";
import modulesJson from "../data/modules.json";
import uncategorizedJson from "../data/uncategorized.json";
import kgJson from "../data/knowledge-graph.json";

export interface Board { id: string; name: string }
export interface Coworker {
  id: string; name: string; initials: string; moduleIds: string[];
  sharedCards: number; source: "trello" | "manual"; status: "joined" | "pending"; questionsAsked: number;
}
export interface Question {
  id: string; text: string; fromType: "ai" | "human"; authorId?: string;
  answer?: string; answeredBy?: string; answeredAt?: string;
  accepted?: boolean; acceptedBy?: string; acceptedAt?: string;
  file?: { name: string; size: string };
}
export interface ChatMsg { a: string; step: string; t: string }
export interface Classification {
  state: "pass" | "review" | "newmod" | "uncat";
  confidence: number; newModule?: string; candidates?: string[]; chat?: ChatMsg[];
}
export interface Card {
  id: string; name: string; desc?: string;
  checklist?: { text: string; done: boolean }[];
  files?: { name: string; size: string }[];
  linkedModuleIds?: string[];
  gaps?: string[];
  classification?: Classification;
  questions?: Question[];
}
export interface Gap { id: string; description: string; aiQuestion: string; addressed: boolean }
export interface Module { id: string; name: string; boardId: string; gaps: Gap[]; cards: Card[] }

export const boards = sessionJson.boards as Board[];
export const coworkers = coworkersJson as unknown as Coworker[];
export const modules = modulesJson as unknown as Module[];
export const uncategorized = uncategorizedJson as unknown as Card[];
export const sessionMeta = sessionJson;

// ── Flat views ──────────────────────────────────────────────────────────────
export const allCards: Card[] = modules.flatMap((m) => m.cards);
export const allQuestions: Question[] = allCards.flatMap((c) => c.questions ?? []);
export const allGaps: Gap[] = modules.flatMap((m) => m.gaps);
// Gaps carrying their owning module name — split by addressed for the Deliver phase.
export const gapsWithModule = modules.flatMap((m) => m.gaps.map((g) => ({ ...g, module: m.name })));
export const resolvedGaps = gapsWithModule.filter((g) => g.addressed).map((g) => ({ module: g.module, gap: g.description, how: "answered by Minh Lê" }));
export const unresolvedGaps = gapsWithModule.filter((g) => !g.addressed).map((g) => ({ module: g.module, gap: g.description, status: "1 question waiting" }));

const boardNameById = new Map(boards.map((b) => [b.id, b.name]));
const moduleNameById = new Map(modules.map((m) => [m.id, m.name]));

// ── Derived aggregates (the ONLY place these numbers are computed) ────────────
const distinctFiles = new Set<string>();
allCards.forEach((c) => (c.files ?? []).forEach((f) => distinctFiles.add(f.name)));
allQuestions.forEach((q) => q.file && distinctFiles.add(q.file.name));

export const aggregates = {
  boards: new Set(modules.map((m) => m.boardId)).size,
  modules: modules.length,
  cards: allCards.length,
  questions: allQuestions.length,
  answered: allQuestions.filter((q) => !!q.answer).length,
  accepted: allQuestions.filter((q) => !!q.accepted).length,
  waiting: allQuestions.filter((q) => !q.answer).length,
  gaps: allGaps.length,
  gapsAddressed: allGaps.filter((g) => g.addressed).length,
  coworkers: coworkers.length,
  files: distinctFiles.size,
};

// ── Legacy-compatible SESSION object (consumed by session-command-view) ───────
// Aggregates come straight from `aggregates`, so the hero numbers can never drift.
export const SESSION = {
  id: sessionMeta.id,
  name: sessionMeta.offboarder.name,
  role: sessionMeta.offboarder.role,
  dept: sessionMeta.offboarder.dept,
  initials: sessionMeta.offboarder.initials,
  daysLeft: sessionMeta.daysLeft,
  deadline: sessionMeta.deadline,
  boards: aggregates.boards,
  cards: aggregates.cards,
  entries: aggregates.cards,
  modules: aggregates.modules,
  questions: aggregates.questions,
  gaps: aggregates.gaps,
  coworkers: aggregates.coworkers,
  answered: aggregates.answered,
  satisfied: aggregates.accepted,
  gapsAddressed: aggregates.gapsAddressed,
  files: aggregates.files,
};

// Resolve a question author to a display name.
export function authorName(authorId?: string): string {
  if (!authorId || authorId === "manager") return "Hà Vy";
  return coworkers.find((c) => c.id === authorId)?.name ?? "Coworker";
}
export function moduleName(id: string): string {
  return moduleNameById.get(id) ?? id;
}
export function boardName(id: string): string {
  return boardNameById.get(id) ?? id;
}

// ── Invariant check — call from a script/test to fail the build on drift ──────
export function verifyData(): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const ids = new Set<string>();
  const dupe = (kind: string, id: string) => {
    if (ids.has(`${kind}:${id}`)) errors.push(`duplicate ${kind} id: ${id}`);
    ids.add(`${kind}:${id}`);
  };
  const moduleIds = new Set(modules.map((m) => m.id));
  modules.forEach((m) => {
    dupe("module", m.id);
    if (!boardNameById.has(m.boardId)) errors.push(`module ${m.id} → unknown boardId ${m.boardId}`);
    m.gaps.forEach((g) => dupe("gap", g.id));
    m.cards.forEach((c) => {
      dupe("card", c.id);
      (c.linkedModuleIds ?? []).forEach((lm) => {
        if (!moduleIds.has(lm)) errors.push(`card ${c.id} → unknown linkedModuleId ${lm}`);
      });
      (c.questions ?? []).forEach((q) => {
        dupe("question", q.id);
        if (q.fromType === "human" && q.authorId && q.authorId !== "manager" && !coworkers.some((cw) => cw.id === q.authorId))
          errors.push(`question ${q.id} → unknown authorId ${q.authorId}`);
        if (q.accepted && !q.answer) errors.push(`question ${q.id} is accepted but has no answer`);
      });
    });
  });
  return { ok: errors.length === 0, errors };
}

// ── Legacy-compatible shapes consumed by session-command-view.jsx ─────────────
// These preserve the exact field names the JSX reads (board/items/qs/CLASSIFY/…),
// but everything is derived from the JSON above — so counts and links can't drift.
/* eslint-disable @typescript-eslint/no-explicit-any */

const modulesByBoard = new Map<string, Module[]>();
modules.forEach((m) => { const a = modulesByBoard.get(m.boardId) ?? []; a.push(m); modulesByBoard.set(m.boardId, a); });
const moduleNameOfQuestion = new Map<string, string>();
modules.forEach((m) => m.cards.forEach((c) => (c.questions ?? []).forEach((q) => moduleNameOfQuestion.set(q.id, m.name))));

function toLegacyQ(q: Question): any {
  const o: any = { q: q.text, from: q.fromType === "ai" ? "AI-generated" : authorName(q.authorId), fromType: q.fromType };
  if (q.answer) { o.answer = q.answer; o.answeredBy = q.answeredBy; o.answeredAt = q.answeredAt; }
  if (q.accepted) { o.satisfiedBy = q.acceptedBy; o.satisfiedAt = q.acceptedAt; }
  if (q.file) o.file = q.file;
  return o;
}

export const MODULES_DATA: any[] = boards
  .filter((b) => modulesByBoard.has(b.id))
  .map((b) => ({
    board: b.name,
    boardCards: (modulesByBoard.get(b.id) ?? []).reduce((n, m) => n + m.cards.length, 0),
    modules: (modulesByBoard.get(b.id) ?? []).map((m) => ({
      name: m.name,
      cards: m.cards.length,
      qs: m.cards.reduce((n, c) => n + (c.questions ?? []).filter((q) => q.fromType !== "ai").length, 0),
      gaps: m.gaps.length,
      moduleGaps: m.gaps.map((g) => g.description),
      moduleGapQs: m.gaps.map((g) => g.aiQuestion),
      items: m.cards.map((c) => ({
        name: c.name,
        ...(c.linkedModuleIds ? { linkedIn: c.linkedModuleIds.map(moduleName) } : {}),
        desc: c.desc ?? "",
        checklist: c.checklist ?? [],
        gaps: c.gaps ?? [],
        files: c.files ?? [],
        qs: (c.questions ?? []).map(toLegacyQ),
      })),
    })),
  }));

// Cards the AI could not confidently place in any module (home-less; not counted in the 64).
export const UNCATEGORIZED: any[] = uncategorized.map((c) => ({
  name: c.name, desc: c.desc ?? "", checklist: c.checklist ?? [], gaps: c.gaps ?? [], files: c.files ?? [], qs: (c.questions ?? []).map(toLegacyQ),
}));

// Classification map keyed by card name (built from card.classification; ids resolve names).
export const CLASSIFY: Record<string, any> = {};
modules.forEach((m) => m.cards.forEach((c) => {
  const cl = c.classification;
  const state = cl?.state ?? "pass";
  const entry: any = { state, confidence: cl?.confidence ?? 94 };
  if (state === "newmod") { entry.newModule = cl?.newModule; const linked = (c.linkedModuleIds ?? []).map(moduleName); if (linked.length) entry.linked = linked; }
  else if (state === "review" || state === "uncat") { if (cl?.candidates) entry.candidates = cl.candidates; }
  else { entry.primary = m.name; const linked = (c.linkedModuleIds ?? []).map(moduleName); if (linked.length) entry.linked = linked; }
  if (cl?.chat) entry.chat = cl.chat;
  CLASSIFY[c.name] = entry;
}));
uncategorized.forEach((c) => {
  const cl = c.classification; if (!cl) return;
  const entry: any = { state: cl.state, confidence: cl.confidence };
  if (cl.candidates) entry.candidates = cl.candidates;
  if (cl.chat) entry.chat = cl.chat;
  CLASSIFY[c.name] = entry;
});

// Offboarder question queue — every question, mutable (GapContextPanel pushes new asks).
export const OB_QUEUE: any[] = allQuestions.map((q) => {
  const o: any = { id: q.id, q: q.text, from: q.fromType === "ai" ? "AI-generated" : authorName(q.authorId), fromType: q.fromType, module: moduleNameOfQuestion.get(q.id) ?? "", answered: !!q.answer, satisfied: !!q.accepted };
  if (q.answer) o.answer = q.answer;
  return o;
});

export const SEED_COWORKERS: any[] = coworkers.map((c) => ({ id: c.id, name: c.name, initials: c.initials, modules: c.moduleIds.map(moduleName), sharedCards: c.sharedCards, source: c.source, status: c.status }));

// Session-level general questions (not tied to a card).
export const SEED_GQ: any[] = ((sessionMeta as any).generalQuestions ?? []).map((g: any) => {
  const o: any = { id: g.id, q: g.text, from: authorName(g.authorId), fromType: "human" };
  if (g.answer) { o.answer = g.answer; o.answeredBy = g.answeredBy; o.answeredAt = g.answeredAt; }
  if (g.accepted) { o.satisfiedBy = g.acceptedBy; o.satisfiedAt = g.acceptedAt; }
  return o;
});

// ── Consumer-plane Knowledge Graph — DERIVED from the same modules.json ────────
// The committed graph regenerates from the session: dept → 5 module nodes → 64 entry
// nodes (the cards), with cross edges from linkedModuleIds. So the KG's module/entry
// counts match the capture side exactly. Only the copilot narrative is authored, in
// data/knowledge-graph.json (its focus arrays reference these module ids + card ids).
function kgModuleSummary(m: Module): string {
  return m.cards.slice(0, 4).map((c) => c.name).join(", ");
}
export const KG_NODES: any[] = [
  { id: "minh-le", label: SESSION.name, type: "dept", depth: 0, summary: `${SESSION.name} · ${SESSION.role}\nOffboarding handover · Jun 2026\n${SESSION.modules} knowledge modules · ${SESSION.entries} entries` },
  ...modules.map((m) => ({ id: m.id, label: m.name, type: "module", depth: 1, parent: "minh-le", entries: m.cards.length, verified: m.cards.length, flagged: 0, gaps: 0, summary: kgModuleSummary(m), provenance: [{ name: SESSION.name, date: "Jun 2026", count: m.cards.length }] })),
  ...modules.flatMap((m) => m.cards.map((c) => ({ id: c.id, label: c.name, type: "entry", depth: 2, parent: m.id, status: "verified", summary: c.desc ?? c.name }))),
];
export const KG_EDGES: any[] = [
  ...modules.map((m) => ({ from: "minh-le", to: m.id, type: "hierarchy" })),
  ...modules.flatMap((m) => m.cards.map((c) => ({ from: m.id, to: c.id, type: "hierarchy" }))),
  ...modules.flatMap((m) => m.cards.flatMap((c) => (c.linkedModuleIds ?? []).map((lm) => ({ from: c.id, to: lm, type: "cross", label: "also in" })))),
];
export const KG_CHIPS = (kgJson as any).chips as any[];
export const KG_SEED_THREADS = (kgJson as any).seedThreads as any[];
export const KG_REPORTED = (kgJson as any).reported as any[];
export const KG_PROMPTS: Record<string, any> = {};
Object.entries((kgJson as any).prompts).forEach(([k, v]) => {
  const cfg = v as any;
  KG_PROMPTS[k] = { input: cfg.input, response: cfg.response, filter: (n: any) => n.provenance?.some((p: any) => p.name.includes(cfg.contributor)) };
});
