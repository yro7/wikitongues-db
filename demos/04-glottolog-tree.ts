/**
 * Demo 4 — A Glottolog language node also matches its dialect nodes.
 *
 *   npx tsx demos/04-glottolog-tree.ts
 *   npx tsx demos/04-glottolog-tree.ts occi1239   # any language node
 */

import { WikitonguesDB, Language, Video } from '../src';
import { heading } from './_shared';

const db = new WikitonguesDB();
const parent = process.argv[2] ?? 'port1283';

const all = db.getByGlottocode(parent);
heading(`db.getByGlottocode('${parent}')  →  ${all.length} recording(s) (primary or additional language)`);

// The matching language may be the primary or an additional one: pick the one under `parent`.
const matching = (v: Video): Language =>
  v.allLanguages.find((l) => l.glottocode === parent || l.standards.glottolog.parentLanguageId === parent)!;

const byNode = all.groupBy((v) => matching(v).glottocode);
for (const [code, group] of Object.entries(byNode)) {
  const videos = group.toArray();
  const node = matching(videos[0]).standards.glottolog;
  const marker = code === parent ? 'language node' : `dialect of ${node.parentLanguageId}`;
  console.log(`\n  ${code}  ${node.name}  (${marker})  — ${videos.length}`);
  for (const v of videos.slice(0, 5)) {
    const l = matching(v);
    const role = l === v.primaryLanguage ? 'primary   ' : 'additional';
    console.log(`      ${role}  ${l.bcp47.padEnd(12)} ${l.wikitonguesClassification.padEnd(24)} ${v.title.replace(/^WIKITONGUES:\s*/, '').replace(/\s*\|.*$/, '')}`);
  }
  if (videos.length > 5) console.log(`      … ${videos.length - 5} more`);
}

heading('Dialect nodes are only assigned when Wikitongues names the variety');
for (const v of all.toArray()) {
  const g = matching(v).standards.glottolog;
  if (g.level === 'dialect') {
    console.log(`  ${g.code}  "${g.name}"  ←  title: ${v.title}`);
  }
}
