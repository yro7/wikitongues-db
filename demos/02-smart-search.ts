/**
 * Demo 2 — One search call, many kinds of input.
 *
 *   npx tsx demos/02-smart-search.ts            # runs the built-in queries
 *   npx tsx demos/02-smart-search.ts Sorani     # runs your own
 */

import { WikitonguesDB } from '../src';
import { heading, printVideos } from './_shared';

const db = new WikitonguesDB();

const queries = process.argv.length > 2
  ? process.argv.slice(2)
  : [
      'rus',            // ISO 639-3
      'ru',             // BCP 47 / ISO 639-1
      'russ1263',       // Glottocode
      'Русский',        // autonym in native script
      'russe',          // French alias
      'Sorani',         // Wikitongues' label (SIL calls it "Central Kurdish")
      'Central Kurdish',// ISO reference name
      'Cocama-Cocamilla', // Glottolog name (Wikitongues says "Kukama")
      'Québécois',      // Glottolog dialect name
      'euskera',        // Spanish alias for Basque
    ];

for (const q of queries) {
  const resolved = [...db.resolver.resolve(q)];
  const results = db.findByLanguage(q);
  heading(`db.findByLanguage('${q}')  →  ${results.length} recording(s)` + (resolved.length ? `  (resolved to ISO ${resolved.join(', ')})` : ''));
  printVideos(results.toArray(), 5);
}
