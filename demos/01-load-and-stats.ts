/**
 * Demo 1 — Load the database and inspect what is in it.
 *
 *   npx tsx demos/01-load-and-stats.ts
 */

import { WikitonguesDB } from '../src';
import { heading } from './_shared';

heading('Constructing WikitonguesDB (hydrates every record, builds the indices)');
const t0 = performance.now();
const db = new WikitonguesDB();
console.log(`  ${db.length} recordings loaded in ${(performance.now() - t0).toFixed(0)} ms`);

heading('db.stats()');
const stats = db.stats();
console.log(`  videos          ${stats.total_videos}`);
console.log(`  ISO languages   ${stats.total_languages}`);
console.log(`  countries       ${stats.total_countries}`);
console.log(`  duration        ${stats.total_duration_hours} h`);
console.log(`  with subtitles  ${stats.with_subtitles_count} (${stats.with_subtitles_percentage}%)`);
console.log(`  licenses        ${Object.entries(stats.licenses).map(([k, v]) => `${k}=${v}`).join('  ')}`);
console.log(`  content types   ${Object.entries(stats.content_types).map(([k, v]) => `${k}=${v}`).join('  ')}`);

heading('Reference tables bundled with the package');
const t = db.hydrator.tables;
console.log(`  ISO 639-3 codes        ${Object.keys(t.iso639_3).length}`);
console.log(`  Glottolog nodes        ${Object.keys(t.glottolog).length}`);
console.log(`  IANA language subtags  ${Object.keys(t.iana.language).length}`);
console.log(`  IANA regions/scripts   ${Object.keys(t.iana.region).length} / ${Object.keys(t.iana.script).length}`);
console.log(`  IANA variants          ${Object.keys(t.iana.variant).join(', ')}`);
console.log(`  IANA registry date     ${t.iana.fileDate}`);
