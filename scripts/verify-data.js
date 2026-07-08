// Independent consistency check for the /data JSON "small DB".
// Re-derives every aggregate from the arrays and asserts (a) they hit the intended
// impressive targets and (b) every id/reference resolves. Run: node scripts/verify-data.js
const fs = require("fs");
const path = require("path");
const D = path.join(__dirname, "..", "data");
const rd = (f) => JSON.parse(fs.readFileSync(path.join(D, f), "utf8"));
const session = rd("session.json");
const coworkers = rd("coworkers.json");
const modules = rd("modules.json");

const allCards = modules.flatMap((m) => m.cards);
const allQuestions = allCards.flatMap((c) => c.questions || []);
const allGaps = modules.flatMap((m) => m.gaps);
const files = new Set();
allCards.forEach((c) => (c.files || []).forEach((f) => files.add(f.name)));
allQuestions.forEach((q) => q.file && files.add(q.file.name));

const agg = {
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
  files: files.size,
};
console.log("Derived aggregates:\n" + JSON.stringify(agg, null, 2));

const errors = [];
const ids = new Set();
const dupe = (k, id) => { if (ids.has(k + ":" + id)) errors.push(`duplicate ${k} id: ${id}`); ids.add(k + ":" + id); };
const moduleIds = new Set(modules.map((m) => m.id));
const boardIds = new Set(session.boards.map((b) => b.id));
const cwIds = new Set(coworkers.map((c) => c.id));
modules.forEach((m) => {
  dupe("module", m.id);
  if (!boardIds.has(m.boardId)) errors.push(`module ${m.id} → unknown boardId ${m.boardId}`);
  m.gaps.forEach((g) => dupe("gap", g.id));
  m.cards.forEach((c) => {
    dupe("card", c.id);
    (c.linkedModuleIds || []).forEach((lm) => { if (!moduleIds.has(lm)) errors.push(`card ${c.id} → unknown linkedModuleId ${lm}`); });
    if ((c.linkedModuleIds || []).length && !(c.classification && Array.isArray(c.classification.chat) && c.classification.chat.length)) errors.push(`cross-module card ${c.id} has no classification.chat (AI reasoning for the multi-module link)`);
    (c.questions || []).forEach((q) => {
      dupe("question", q.id);
      if (q.fromType === "human" && q.authorId && q.authorId !== "manager" && !cwIds.has(q.authorId)) errors.push(`question ${q.id} → unknown authorId ${q.authorId}`);
      if (q.accepted && !q.answer) errors.push(`question ${q.id} accepted but has no answer`);
    });
  });
});
coworkers.forEach((c) => c.moduleIds.forEach((mid) => { if (!moduleIds.has(mid)) errors.push(`coworker ${c.id} → unknown moduleId ${mid}`); }));

const targets = { boards: 3, modules: 5, cards: 64, questions: 14, answered: 9, accepted: 7, waiting: 5, gaps: 6, gapsAddressed: 4, coworkers: 3, files: 3 };
Object.entries(targets).forEach(([k, v]) => { if (agg[k] !== v) errors.push(`aggregate ${k} = ${agg[k]}, expected ${v}`); });

if (errors.length) { console.error("\nFAIL (" + errors.length + "):\n - " + errors.join("\n - ")); process.exit(1); }
console.log("\nAll invariants + impressive-number targets OK ✓");
