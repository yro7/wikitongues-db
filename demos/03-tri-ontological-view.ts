/**
 * Demo 3 — The same recording seen by ISO 639-3, Glottolog and BCP 47.
 *
 *   npx tsx demos/03-tri-ontological-view.ts
 *   npx tsx demos/03-tri-ontological-view.ts PeZHJcQYt3c   # any YouTube id from the dataset
 */

import { WikitonguesDB } from '../src';
import { heading } from './_shared';

const db = new WikitonguesDB();

const ids = process.argv.length > 2
  ? process.argv.slice(2)
  : [
      'qpfxFvpLAJ8', // Brazilian Portuguese — a dialect for Glottolog, one language for SIL
      'FiBkz0nnhtk', // Speaker from Brazil, but the title just says "Portuguese" → language node, no region
      'PeZHJcQYt3c', // Jèrriais — carries Wikitongues' lineage "Norman Romance"
      'mygnGGT679A', // Valencian — a registered IANA variant instead of a region
      'nXBPa_wb3dM', // Cusco Quechua — individual code quz, never the macrolanguage que
      'mORCaQbggIo', // Sorani — three different names for one recording
    ];

for (const id of ids) {
  const video = db.get(id);
  if (!video) {
    console.error(`  no recording with id ${id}`);
    continue;
  }
  const lang = video.primaryLanguage;
  const { iso639_3: iso, glottolog: g, bcp47: b } = lang.standards;

  heading(`${id} — ${video.title}`);
  console.log(`  ISO 639-3   ${iso.code.padEnd(14)} ${iso.name}  (scope ${iso.scope}, type ${iso.type}${iso.part1 ? `, 639-1 ${iso.part1}` : ''})`);
  console.log(`  Glottolog   ${g.code.padEnd(14)} ${g.name}  (${g.level}${g.parentLanguageId ? ` of ${g.parentLanguageId}` : ''}${g.familyId ? `, family ${g.familyId}` : ''})`);
  console.log(`  BCP 47      ${b.tag.padEnd(14)} language ${b.primarySubtag}${b.regionSubtag ? `, region ${b.regionSubtag}` : ''}${b.scriptSubtag ? `, script ${b.scriptSubtag}` : ''}${b.variantSubtags.length ? `, variant ${b.variantSubtags.join('-')}` : ''}`);
  console.log();
  console.log(`  wikitonguesClassification  ${lang.wikitonguesClassification}`);
  console.log(`  wikitonguesLineage         ${lang.wikitonguesLineage ?? 'null'}`);
  console.log(`  speakerClaim               ${lang.speakerClaim ?? 'null'}`);
  console.log(`  autonym                    ${lang.autonym}`);
  console.log(`  labels                     ${lang.labels.join(' · ')}`);
  console.log();
  console.log(`  persisted form (toDict): ${JSON.stringify(lang.toDict().standards)}`);
}
