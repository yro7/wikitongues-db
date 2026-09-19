/**
 * Demo 9 — Finding the "standard" variety of a language (Parisian French, British English…).
 *
 * There is no `fr-FR` / `en-GB` shortcut in the dataset: a region subtag is only stored when
 * Wikitongues itself names a regional variety (CLASSIFICATION_RULES.md §4.3.2), and Glottolog has
 * no "Parisian French" node. So a standard is found by combining what the three standards do say:
 *
 *   A. Glottolog — the language node itself, minus its dialect nodes; or an explicit
 *      "X Standard" node where Glottolog has one (Croatian / Serbian / Bosnian Standard…).
 *   B. Chaining — ISO code + country of provenance + no region/variant subtag + bare label.
 *
 *   npx tsx demos/09-find-a-standard.ts
 *   npx tsx demos/09-find-a-standard.ts spa ES     # ISO 639-3 + ISO 3166-1 country
 */

import { WikitonguesDB, Language, Video, VideoCollection } from '../src';
import { heading, printVideos } from './_shared';

const db = new WikitonguesDB();

/** The language of `video` sitting on Glottolog node `node` or on one of its dialect nodes. */
const langUnder = (video: Video, node: string): Language =>
  video.allLanguages.find((l) => l.glottocode === node || l.standards.glottolog.parentLanguageId === node)!;

/** True when `lang` is recorded as the plain, unmarked variety of its language. */
function isStandard(lang: Language): boolean {
  const { glottolog, bcp47, iso639_3 } = lang.standards;
  const label = lang.wikitonguesClassification.toLowerCase();
  const bare = iso639_3.name.toLowerCase();
  return (
    glottolog.level === 'language' &&          // not a Glottolog dialect node
    !bcp47.regionSubtag &&                     // no pt-BR, fr-CA, en-GB…
    bcp47.variantSubtags.length === 0 &&       // no ca-valencia, oc-aranes…
    (label === bare || bare.includes(label))   // Wikitongues wrote "French", not "Chiac"
  );
}

/** Standard variety of `iso`, optionally restricted to a country, primary language only. */
function findStandard(iso: string, country?: string): VideoCollection {
  let q = db.query().iso(iso, false);
  if (country) q = q.country(country);
  return q.filter((v) => isStandard(v.primaryLanguage)).all();
}

// ---------------------------------------------------------------------------
// A. Through Glottolog
// ---------------------------------------------------------------------------

heading("A1. Glottolog language node 'stan1290' (Standard French) returns the node AND its dialects");
const frenchNode = db.getByGlottocode('stan1290');
const byGlotto = frenchNode.groupBy((v) => langUnder(v, 'stan1290').glottocode);
for (const [code, group] of Object.entries(byGlotto)) {
  const l = langUnder(group.first()!, 'stan1290');
  console.log(`  ${code}  ${l.standards.glottolog.name.padEnd(22)} iso ${l.iso639_3}  ${group.length}`);
}
console.log('  ↑ Jèrriais (nrf) is a dialect node under Standard French in Glottolog, yet a separate ISO language');

heading("A2. Keep only recordings sitting exactly on the language node (level 'language')");
const frenchExact = frenchNode.filter((v) => v.primaryLanguage.glottocode === 'stan1290');
printVideos(frenchExact.toArray());
console.log('  ↑ still includes Tourangeau and Chiac: Glottolog has no node for them, so they sit on the');
console.log("    language node — the Wikitongues label is what tells them apart (see B2)");

heading("A3. Where Glottolog names a standard explicitly: Serbo-Croatian 'sout1528' splits into standards");
for (const code of ['croa1245', 'serb1264', 'bosn1245']) {
  const c = db.getByGlottocode(code);
  const g = c.first()!.primaryLanguage.standards.glottolog;
  console.log(`  ${code}  ${g.name.padEnd(20)} (${g.level} of ${g.parentLanguageId})  ${c.length} recording(s)`);
}
console.log('  → db.getByGlottocode(\'serb1264\') is the exact query for "standard Serbian".');

// ---------------------------------------------------------------------------
// B. Through chaining
// ---------------------------------------------------------------------------

heading("B1. Parisian / metropolitan French: iso('fra') + country('FR')");
printVideos(db.query().iso('fra', false).country('FR').all().toArray());
console.log('  ↑ includes Gallo and Tourangeau — regional, not standard');

heading("B2. … then drop dialect nodes, region/variant subtags and non-bare labels");
printVideos(findStandard('fra', 'FR').toArray());

heading("B3. British English: iso('eng') + country('GB') + standard filter");
printVideos(findStandard('eng', 'GB').toArray());
console.log(`  (dropped: ${db.query().iso('eng', false).country('GB').filter((v) => !isStandard(v.primaryLanguage)).all().toArray().map((v) => v.primaryLanguage.wikitonguesClassification).join(', ') || 'nothing'})`);

heading("B4. Standard Spanish, split by country of recording");
const spanish = findStandard('spa').groupBy('country');
for (const [country, group] of Object.entries(spanish)) {
  console.log(`  ${country.padEnd(4)} ${group.length}  ${group.toArray().map((v) => v.title.replace(/^WIKITONGUES:\s*/, '').replace(/\s*\|.*$/, '')).join(' · ')}`);
}

heading("B5. What a bare BCP 47 tag can and cannot tell you");
console.log(`  getByBcp47('fr-FR')  → ${db.getByBcp47('fr-FR').length}   (never stored: Wikitongues never labels "French of France")`);
console.log(`  getByBcp47('en-GB')  → ${db.getByBcp47('en-GB').length}   (only "Cumbrian", a named regional variety)`);
console.log(`  getByBcp47('fr')     → ${db.getByBcp47('fr').length}  (every French tag, fr-CA and fr-gallo included: prefix match)`);
console.log(`  getByBcp47('pt-BR')  → ${db.getByBcp47('pt-BR').length}   (exact: only the recording Wikitongues labelled "Brazilian Portuguese")`);

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

if (process.argv.length > 2) {
  const [iso, country] = process.argv.slice(2);
  heading(`findStandard('${iso}'${country ? `, '${country}'` : ''})`);
  printVideos(findStandard(iso, country).toArray(), 20);
}
