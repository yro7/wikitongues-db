/**
 * Demo 5 — Compose filters with the fluent QueryBuilder.
 *
 *   npx tsx demos/05-query-builder.ts
 */

import { WikitonguesDB } from '../src';
import { heading, printVideos } from './_shared';

const db = new WikitonguesDB();

heading('Creative-Commons recordings with subtitles, longest first');
const reusable = db.query().creativeCommonsOnly().withSubtitles().minDuration(180).orderBy('duration', true).limit(6).all();
printVideos(reusable.toArray());

heading("Arabic varieties (macrolanguage 'ara' expands to its individual codes) recorded outside the Middle East");
const arabic = db.query().language('arabic').filter((v) => !['SY', 'LB', 'PS', 'IQ', 'JO'].includes(v.countryCode ?? '')).all();
printVideos(arabic.toArray());

heading('Sign languages, grouped by country');
const signs = db.query().contentType('sign_language').all().groupBy('country');
for (const [country, videos] of Object.entries(signs)) {
  console.log(`  ${country.padEnd(8)} ${videos.toArray().map((v) => v.primaryLanguage.wikitonguesClassification).join(', ')}`);
}

heading('Recordings by a given recorder, uploaded in 2019');
const recorded = db.query().recordedBy('Daniel Bogre Udell').uploadedBetween('2019-01-01', '2019-12-31').all();
printVideos(recorded.toArray(), 5);

heading('Pagination: page 2 of Portuguese, 3 per page');
printVideos(db.query().iso('por').orderBy('title').page(2, 3).all().toArray());

heading('count() / exists() / first() without materializing');
console.log(`  count: ${db.query().language('quechua').count()}`);
console.log(`  exists('klingon'): ${db.query().language('klingon').exists()}`);
console.log(`  first Igbo: ${db.query().iso('ibo').first()?.title}`);
