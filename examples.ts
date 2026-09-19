/**
 * wikitongues-db - Concrete Usage Examples
 *
 * This file demonstrates practical usage of the wikitongues-db library:
 * 1. Initializing and inspecting dataset statistics
 * 2. Smart language resolution (ISO 639-3, BCP 47, Glottolog, French/English names, native autonyms, dialects)
 * 3. Fast O(1) indexed lookups by ID and Country
 * 4. Fluent chainable query builder with filters, sorting, and pagination
 * 5. Full-text search with relevance scoring
 * 6. Video collection aggregations, sampling, and export formats (JSON, JSONL, CSV)
 * 7. Direct raw dataset access
 *
 * Run with: npx tsx examples.ts
 */

import { WikitonguesDB, VideoCollection } from './src';
import rawDataset from './src/dataset';

function separator(title: string) {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60));
}

// ---------------------------------------------------------------------------
// Example 1: Initialization and Global Dataset Statistics
// ---------------------------------------------------------------------------
separator('1. Initializing WikitonguesDB & Overview Stats');

const db = new WikitonguesDB();
const stats = db.stats();

console.log(`Database loaded: ${db.length} curated video records`);
console.log(`Total languages indexed: ${stats.total_languages}`);
console.log(`Total countries represented: ${stats.total_countries}`);
console.log(`Total archival recording duration: ${stats.total_duration_hours} hours`);
console.log('Top content types:', stats.content_types);
console.log('License breakdown:', stats.licenses);

// ---------------------------------------------------------------------------
// Example 2: Smart Language Resolution
// ---------------------------------------------------------------------------
separator('2. Smart Language Search & Resolution');

// Look up by French alias
const russianVids = db.findByLanguage('russe');
console.log(`[French alias 'russe']: Found ${russianVids.length} videos`);
console.log(`  First video: "${russianVids.at(0)?.title}" (${russianVids.at(0)?.url})`);

// Look up by native autonym
const quechuaVids = db.findByLanguage('Qhichwa');
console.log(`[Autonym 'Qhichwa']: Found ${quechuaVids.length} videos`);
console.log(`  Language: ${quechuaVids.at(0)?.primaryLanguage.name} (ISO: ${quechuaVids.at(0)?.primaryLanguage.iso639_3})`);

// Look up by Wikitongues classification (ISO calls it "Central Kurdish")
const soraniVids = db.findByLanguage('Sorani');
console.log(`[Classification 'Sorani']: Found ${soraniVids.length} videos`);
console.log(`  ISO name: ${soraniVids.at(0)?.primaryLanguage.standards.iso639_3.name} | Glottolog: ${soraniVids.at(0)?.primaryLanguage.standards.glottolog.name}`);

// Look up by autonym
const arbereshVids = db.findByLanguage('Arbërisht');
console.log(`[Autonym 'Arbërisht']: Found ${arbereshVids.length} videos`);
console.log(`  Speaker & Origin: ${arbereshVids.at(0)?.speakers[0]?.name} (${arbereshVids.at(0)?.provenance.countryName})`);

// The three institutional standards, resolved at load time
const brazilian = db.get('qpfxFvpLAJ8')!.primaryLanguage;
console.log(`[Tri-ontological view of '${brazilian.wikitonguesClassification}']`);
console.log(`  ISO 639-3 : ${brazilian.standards.iso639_3.code} — ${brazilian.standards.iso639_3.name}`);
console.log(`  Glottolog : ${brazilian.standards.glottolog.code} — ${brazilian.standards.glottolog.name} (${brazilian.standards.glottolog.level} of ${brazilian.standards.glottolog.parentLanguageId})`);
console.log(`  BCP-47    : ${brazilian.standards.bcp47.tag} — region ${brazilian.standards.bcp47.regionSubtag}`);
console.log(`  Same language node: ${db.getByGlottocode('port1283').length} videos under port1283, ${db.getByGlottocode('braz1246').length} under braz1246`);

// Look up by BCP 47 subtag with region
const ptBrVids = db.findByLanguage('pt-BR');
console.log(`[BCP 47 'pt-BR' via smart search]: Found ${ptBrVids.length} videos (resolves to the whole language)`);
console.log(`[BCP 47 'pt-BR' exact]: Found ${db.getByBcp47('pt-BR').length} videos`);

// Look up by Glottocode (language node — also returns its dialect nodes)
const glottoVids = db.findByLanguage('cusc1236');
console.log(`[Glottocode 'cusc1236']: Found ${glottoVids.length} videos`);

// ---------------------------------------------------------------------------
// Example 3: O(1) Indexed Lookups
// ---------------------------------------------------------------------------
separator('3. O(1) Direct Lookups by ID, ISO, and Country');

// Lookup by YouTube ID
const video = db.get('nXBPa_wb3dM');
if (video) {
  console.log(`Found video by ID [${video.id}]:`);
  console.log(`  - Title: ${video.title}`);
  console.log(`  - Language: ${video.primaryLanguage.name} (${video.primaryLanguage.iso639_3})`);
  console.log(`  - Duration: ${video.durationFormatted} (${video.durationSeconds}s)`);
  console.log(`  - License: ${video.license} | Creative Commons: ${video.isCreativeCommons}`);
  console.log(`  - Embed URL: ${video.embedUrl}`);
  console.log(`  - Country: ${video.provenance.countryName} (${video.countryCode})`);
}

// Lookup all videos from a country (e.g. Peru / PE)
const peruVideos = db.getByCountry('PE');
console.log(`\nVideos recorded in Peru (PE): ${peruVideos.length} videos`);
for (const v of peruVideos) {
  console.log(`  • [${v.primaryLanguage.name}] ${v.title} (${v.durationFormatted})`);
}

// ---------------------------------------------------------------------------
// Example 4: Fluent Chainable Query Builder
// ---------------------------------------------------------------------------
separator('4. Fluent Query Builder with Filter Chaining');

const filteredVideos = db
  .query()
  .country('US')
  .contentType('oral_history')
  .creativeCommonsOnly()
  .minDuration(60)
  .maxDuration(600)
  .orderBy('duration', true) // Sort by duration descending
  .limit(3)
  .all();

console.log(`Query (Country=US, Content=oral_history, CC=true, 60s<=duration<=600s, Top 3):`);
for (const v of filteredVideos) {
  console.log(`  - [${v.durationFormatted}] ${v.title} | Lang: ${v.primaryLanguage.name} | ${v.url}`);
}

// Subtitles filter
const subtitledCount = db.query().withSubtitles().count();
console.log(`\nTotal videos with subtitles available: ${subtitledCount}`);

// Custom predicate filter: videos recorded before 2020 with multiple speakers
const multiSpeakerVideos = db
  .query()
  .filter((v) => v.speakers.length > 1)
  .limit(3)
  .all();

console.log(`\nVideos with multiple speakers (Sample of 3):`);
for (const v of multiSpeakerVideos) {
  const speakerNames = v.speakers.map((s) => s.name).join(', ');
  console.log(`  - "${v.title}" -> Speakers: ${speakerNames}`);
}

// ---------------------------------------------------------------------------
// Example 5: Full-Text Search with Relevance Scoring
// ---------------------------------------------------------------------------
separator('5. Weighted Full-Text Search');

const queries = ['mayan guatemala oral history', 'kaitag dagestan'];

for (const queryText of queries) {
  const searchMatches = db.search(queryText, 2);
  console.log(`Top search results for "${queryText}":`);
  for (const match of searchMatches) {
    console.log(`  - "${match.title}"`);
    console.log(`    Lang: ${match.primaryLanguage.name} (${match.primaryLanguage.iso639_3}) | Country: ${match.provenance.countryName ?? 'N/A'}`);
  }
  console.log();
}

// ---------------------------------------------------------------------------
// Example 6: VideoCollection Transformations & Export Formats
// ---------------------------------------------------------------------------
separator('6. VideoCollection Aggregations, Sampling, and Serialization');

const basqueCollection: VideoCollection = db.getByIso('eus');

console.log(`Basque Collection Overview:`);
console.log(`  - Total Videos: ${basqueCollection.length}`);
console.log(`  - Total Duration: ${basqueCollection.totalDurationFormatted}`);
console.log(`  - Average Video Duration: ${Math.round(basqueCollection.averageDurationSeconds)}s`);
console.log(`  - Video URLs:`, basqueCollection.urls);

// Reproducible random sample with a seed
const sampleOf2 = db.random(2, 42);
console.log(`\nReproducible random sample (seed=42):`);
for (const v of sampleOf2) {
  console.log(`  - [${v.id}] ${v.primaryLanguage.name}: "${v.title}"`);
}

// CSV Export preview
console.log(`\nCSV Export (First 2 rows):`);
const csvLines = basqueCollection.toCSV().split('\n');
console.log(csvLines.slice(0, 3).join('\n'));

// JSONL Export preview
console.log(`\nJSON Lines Export (First line preview):`);
const jsonlLine = basqueCollection.toJSONL().split('\n')[0];
console.log(jsonlLine.slice(0, 120) + '...');

// ---------------------------------------------------------------------------
// Example 7: Direct Raw Dataset Access
// ---------------------------------------------------------------------------
separator('7. Direct Access to Raw Normalized Dataset');

console.log(`Direct dataset array imported: ${rawDataset.length} entries`);
console.log(`First entry ID: ${rawDataset[0].id}`);
console.log(`First entry Language: ${rawDataset[0].primary_language.wikitongues_classification} (${JSON.stringify(rawDataset[0].primary_language.standards)})`);

separator('All examples executed successfully!');
