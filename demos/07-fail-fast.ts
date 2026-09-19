/**
 * Demo 7 — Records that violate the classification rules do not load.
 *
 *   npx tsx demos/07-fail-fast.ts
 */

import { WikitonguesDB, HydrationError, VideoData } from '../src';
import { heading } from './_shared';

const db = new WikitonguesDB();
const template = db.get('qpfxFvpLAJ8')!.toDict();

const cases: Array<[string, (r: VideoData) => void]> = [
  ['Glottolog family node',            (r) => { r.primary_language.standards.glottocode = 'indo1319'; }],
  ['unknown Glottocode',               (r) => { r.primary_language.standards.glottocode = 'nope1234'; }],
  ['ISO macrolanguage (not bundled)',  (r) => { r.primary_language.standards.iso639_3 = 'ara'; }],
  ['missing standard',                 (r) => { (r.primary_language.standards as any).bcp47 = null; }],
  ['BCP 47 region not in IANA',        (r) => { r.primary_language.standards.bcp47 = 'pt-XX'; }],
  ['BCP 47 private-use subtag',        (r) => { r.primary_language.standards.bcp47 = 'pt-x-brasil'; }],
  ['BCP 47 primary must be ISO 639-1', (r) => { r.primary_language.standards.bcp47 = 'por'; }],
  ['BCP 47 variant with wrong prefix', (r) => { r.primary_language.standards.bcp47 = 'pt-valencia'; }],
  ['BCP 47 Suppress-Script',           (r) => { r.primary_language.standards.bcp47 = 'pt-Latn'; }],
  ['empty wikitongues_classification', (r) => { r.primary_language.wikitongues_classification = ''; }],
  ['valid record (control)',           (r) => { r.primary_language.standards.bcp47 = 'pt-BR'; }],
];

for (const [label, mutate] of cases) {
  const record: VideoData = JSON.parse(JSON.stringify(template));
  mutate(record);
  heading(label);
  try {
    const tmp = new WikitonguesDB({ data: [record] });
    console.log(`  loaded ${tmp.length} record`);
  } catch (err) {
    if (err instanceof HydrationError) {
      console.log(`  HydrationError  record=${err.recordId}  field=${err.field}  code=${JSON.stringify(err.code)}`);
      console.log(`  ${err.message}`);
    } else {
      throw err;
    }
  }
}
