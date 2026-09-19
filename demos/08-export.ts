/**
 * Demo 8 — Sampling and export formats.
 *
 *   npx tsx demos/08-export.ts
 */

import { WikitonguesDB } from '../src';
import { heading } from './_shared';

const db = new WikitonguesDB();

heading('Seeded random sample (same seed → same rows)');
const sample = db.random(3, 42);
for (const v of sample.toArray()) console.log(`  ${v.id}  ${v.primaryLanguage.wikitonguesClassification}`);

heading('CSV — one row per video, one column per standard');
const csv = db.query().iso('por').limit(3).all().toCSV();
console.log(csv.split('\n').map((l) => '  ' + l.slice(0, 160) + (l.length > 160 ? '…' : '')).join('\n'));

heading('JSONL — persisted form, one record per line');
const jsonl = db.query().iso('nrf').limit(1).all().toJSONL();
console.log('  ' + jsonl.slice(0, 400) + '…');

heading('Hydrated object vs persisted dict');
const v = db.get('PeZHJcQYt3c')!;
console.log('  hydrated:  ', JSON.stringify(v.primaryLanguage.standards.glottolog));
console.log('  persisted: ', JSON.stringify(v.toDict().primary_language));
