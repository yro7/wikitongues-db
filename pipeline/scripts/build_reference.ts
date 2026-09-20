/**
 * build_reference.ts — Generate the pruned runtime reference tables.
 *
 * Reads the authoritative tables in data/references/ and the normalized dataset, and writes
 * src/generated/reference.json containing only the ISO 639-3 codes, Glottolog nodes (closed over
 * parent language and family) and IANA subtags actually used by the dataset.
 *
 * Usage:
 *   npx tsx pipeline/scripts/build_reference.ts      (also run by `npm run build`)
 *
 * The output is committed: the published package must build without the 3 MB source tables.
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  parseIsoTable,
  parseIsoInvertedNames,
  parseGlottologCsv,
  parseIanaRegistry,
  buildReferenceTables,
} from '../../shared/reference_parsers';
import { ReferenceTables, VideoData } from '../../src/types';

const ROOT = path.resolve(__dirname, '../..');
export const DATASET_PATH = path.join(ROOT, 'data/processed/wikitongues_normalized.json');
export const OUTPUT_PATH = path.join(ROOT, 'src/generated/reference.json');

export function collectAnchors(records: VideoData[]): {
  iso639_3: Set<string>;
  glottocodes: Set<string>;
  bcp47: Set<string>;
} {
  const anchors = { iso639_3: new Set<string>(), glottocodes: new Set<string>(), bcp47: new Set<string>() };
  for (const v of records) {
    for (const lang of [v.primary_language, ...(v.additional_languages ?? [])]) {
      anchors.iso639_3.add(lang.standards.iso639_3);
      anchors.glottocodes.add(lang.standards.glottocode);
      anchors.bcp47.add(lang.standards.bcp47);
    }
  }
  return anchors;
}

export function generateReferenceTables(datasetPath: string = DATASET_PATH): ReferenceTables {
  const records: VideoData[] = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
  return buildReferenceTables(collectAnchors(records), {
    iso: parseIsoTable(),
    invertedNames: parseIsoInvertedNames(),
    glottolog: parseGlottologCsv(),
    iana: parseIanaRegistry(),
  });
}

export function serializeReferenceTables(tables: ReferenceTables): string {
  return JSON.stringify(tables, null, 1) + '\n';
}

if (require.main === module) {
  const tables = generateReferenceTables();
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, serializeReferenceTables(tables));
  const size = fs.statSync(OUTPUT_PATH).size;
  console.log(
    `Wrote ${path.relative(ROOT, OUTPUT_PATH)} (${(size / 1024).toFixed(0)} KB): ` +
      `${Object.keys(tables.iso639_3).length} ISO codes, ${Object.keys(tables.glottolog).length} Glottolog nodes, ` +
      `${Object.keys(tables.iana.language).length} IANA language subtags, ` +
      `${Object.keys(tables.iana.region).length} regions, ${Object.keys(tables.iana.script).length} scripts, ` +
      `${Object.keys(tables.iana.variant).length} variants`
  );
}
