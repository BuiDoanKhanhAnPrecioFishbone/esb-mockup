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
export const sessionMeta = sessionJson;

// ── Flat views ──────────────────────────────────────────────────────────────
export const allCards: Card[] = modules.flatMap((m) => m.cards);
export const allQuestions: Question[] = allCards.flatMap((c) => c.questions ?? []);
export const allGaps: Gap[] = modules.flatMap((m) => m.gaps);

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
