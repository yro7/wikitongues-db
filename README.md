# wikitongues-db

> A zero-dependency, in-memory database and search engine mapping three independent language classifications — **ISO 639-3**, **Glottolog** and **BCP 47** — plus autonyms and Wikitongues' own labels to curated Wikitongues video recordings. Published for **TypeScript / JavaScript (npm)**.

---

## Motivation & Context

[Wikitongues](https://wikitongues.org/) is a non-profit organization dedicated to language documentation, revitalization, and diversity. Over the past decade, they have built an archive of video recordings representing hundreds of languages and dialects across YouTube and Wikimedia Commons.

However, existing metadata across YouTube and Commons is heterogeneous, with free-text descriptions, unstructured notes, and no unified linguistic index.

**`wikitongues-db`** bridges this gap by providing:
1. **A curated, deterministic dataset**: 862 normalized records across 460+ languages with structured speaker roles, geographic provenance, licensing, and transcript status.
2. **Tri-ontological classification**: every language carries its **SIL ISO 639-3** code, its **Glottolog** node (language *or dialect*) and its **BCP 47** tag, each recorded independently according to its own authority's logic and resolved at load time against the bundled reference tables (see [CLASSIFICATION_RULES.md](CLASSIFICATION_RULES.md)). A record that does not resolve does not load.
3. **Multi-faceted resolution**: Instant matching by ISO code, BCP 47 tag, Glottocode (a language node also matches its dialect nodes), ISO / Glottolog names, Wikitongues' own label (`Sorani`, `Gascon`, `Biscayan`), multilingual common name (e.g. `russe`, `espagnol`), or native script autonym (`Qhichwa`, `Asụsụ Igbo`, `Русский`).
4. **Rich content types**: Covers oral histories (81%), spontaneous conversations (13%), sign languages (2.5%), readings/songs (1.5%), and fellowship documentaries.
5. **Zero-dependency TypeScript client**: Embedded in-memory database with $O(1)$ inverted indices, fluent query builder, and full-text search engine.

---

## Architecture

```
┌─────────────────────────────────────────┐
│     Wikitongues YouTube & Commons       │
└────────────────────┬────────────────────┘
                     │ (Curated Metadata)
                     ▼
┌─────────────────────────────────────────┐
│  Persisted anchor keys per language     │
│  standards: { iso639_3, glottocode,     │
│               bcp47 }                   │
│  + speaker_claim, wikitongues_          │
│    classification, wikitongues_lineage, │
│    autonym                              │
└────────────────────┬────────────────────┘
                     │ (Deterministic hydration at load time)
                     │  ← iso-639-3.tab / glottolog_languages.csv /
                     │    IANA subtag registry (pruned, bundled)
                     ▼
┌─────────────────────────────────────────┐
│  Language.standards = {                 │
│    iso639_3:  { code, name, scope … }   │
│    glottolog: { code, name, level,      │
│                 parentLanguageId … }    │
│    bcp47:     { tag, primarySubtag,     │
│                 regionSubtag … }        │
│  }                                      │
└────────────────────┬────────────────────┘
                     ▼
           TypeScript (npm)
          O(1) in-memory API
```

### The language model

Three institutional standards answer three different questions, so the dataset never collapses them into a single `name` / `dialect` pair:

| Standard | Question it answers | Example (Ygor speaking Brazilian Portuguese) |
| :--- | :--- | :--- |
| `standards.iso639_3` | Which individual language does SIL register? | `por` — Portuguese |
| `standards.glottolog` | Which node of the phylogenetic tree? | `braz1246` — Brazilian Portuguese, *dialect* of `port1283` |
| `standards.bcp47` | Which locale tag? | `pt-BR` |

Alongside them, three cultural identifiers are persisted verbatim: `speaker_claim` (how the speaker names their language in the video, `null` if they never do), `wikitongues_classification` (the label Wikitongues itself uses, e.g. `Jèrriais`) with `wikitongues_lineage` (`Norman Romance`), and `autonym` (`Português`).

```typescript
const lang = db.get('qpfxFvpLAJ8')!.primaryLanguage;
lang.standards.iso639_3;   // { code: 'por', name: 'Portuguese', scope: 'I', type: 'L', part1: 'pt' }
lang.standards.glottolog;  // { code: 'braz1246', name: 'Brazilian Portuguese', level: 'dialect', parentLanguageId: 'port1283', familyId: 'indo1319', … }
lang.standards.bcp47;      // { tag: 'pt-BR', primarySubtag: 'pt', regionSubtag: 'BR', variantSubtags: [] }
lang.wikitonguesClassification; // 'Brazilian Portuguese'
lang.iso639_3; lang.glottocode; lang.bcp47; lang.name; // short accessors
```

---

## Dataset Overview

| Metric | Value |
| :--- | :--- |
| **Total Curated Videos** | `862` |
| **Unique Primary ISO 639-3 Languages** | `466` |
| **Unique Primary Glottolog Nodes** | `485` (`72` dialect-level) |
| **Unique BCP 47 Language Tags** | `501` |
| **Fully Classified (ISO + Glottolog + BCP 47)** | `862 / 862` (100%, enforced at load time) |
| **Native Script Autonyms** | `862 / 862` (100.0%) |
| **Wikitongues Lineage Labels** | `120` |
| **Identified Recorders** | `491 / 862` (57.0%) |
| **Embedded Transcripts / Translations** | `56` |
| **Total Archival Duration** | `53h 52m 42s` (`193,962` seconds) |
| **Videos with Subtitles / Captions** | `283` |
| **Runtime Dependencies** | `0` |

---

## TypeScript & JavaScript API (npm)

The package is zero-dependency, works seamlessly across Node.js (CommonJS & ESM), Vite, Next.js, and browser environments, and embeds the curated normalized dataset directly (~1.1 MB uncompressed, ~160 KB gzipped).

### Installation

```bash
npm install wikitongues-db
# or
yarn add wikitongues-db
# or
pnpm add wikitongues-db
```

### 1. Basic Lookups & Smart Language Resolution

```typescript
import { WikitonguesDB } from 'wikitongues-db';

// Hydrates and indexes 862 curated recordings instantly (throws HydrationError on an invalid record)
const db = new WikitonguesDB();

// 1. Smart Language Search (ISO 639-3, BCP 47, Glottolog, ISO / Glottolog / Wikitongues names, aliases, autonyms)
const russianVids = db.findByLanguage('russe');     // or "Russian", "rus", "ru", "Русский", "russ1263"
const quechuaVids = db.findByLanguage('Qhichwa');   // by native autonym
const soraniVids = db.findByLanguage('Sorani');     // by Wikitongues' label (ISO says "Central Kurdish")

// 2. O(1) Indexed Lookups
const video = db.get('nXBPa_wb3dM');                // Lookup by YouTube ID
const basqueVids = db.getByIso('eus');              // Lookup by ISO 639-3
const portuguese = db.getByGlottocode('port1283');  // Language node: includes dialect nodes such as braz1246
const peruVids = db.getByCountry('PE');             // Lookup by ISO 3166-1 alpha-2 or country name
```

### 2. Fluent Chainable Query Builder

```typescript
const results = db
  .query()
  .language('Russian')
  .country('RU')
  .creativeCommonsOnly()
  .withSubtitles()
  .minDuration(60)
  .maxDuration(600)
  .orderBy('duration', true)
  .limit(10)
  .all();

console.log(`Found ${results.length} videos (${results.totalDurationFormatted})`);
for (const v of results) {
  console.log(`- ${v.title} | ${v.url} | ${v.durationFormatted}`);
}
```

### 3. Full-Text Search with Relevance Scoring

```typescript
const matches = db.search('dagestan caucasian oral history', 5);
for (const v of matches) {
  console.log(v.title, v.primaryLanguage.wikitonguesClassification, v.url);
}
```

### 4. Rich `VideoCollection` Operations

```typescript
const collection = db.getByCountry('PE');

// Aggregations
console.log(collection.totalDurationFormatted); // e.g. "1h 45m 12s"
console.log(collection.languages);              // Unique primary Language objects
console.log(collection.speakerNames);           // Array of speaker names
console.log(collection.urls);                   // Array of video URLs
console.log(collection.embedUrls);              // Array of YouTube embed URLs

// Chained transformations
const ccSample = collection.filter((v) => v.isCreativeCommons).sample(3);

// Serializations
const jsonString = collection.toJSON();
const jsonlString = collection.toJSONL();
const csvString = collection.toCSV();
```

### 5. Direct Dataset Access

You can also directly import the raw normalized dataset without constructing a DB instance:

```typescript
import dataset from 'wikitongues-db/data';
// or: import { dataset } from 'wikitongues-db';

console.log(`Loaded ${dataset.length} normalized records directly`);
// dataset[0].primary_language.standards → { iso639_3: 'quz', glottocode: 'cusc1236', bcp47: 'quz' }
```

The raw dataset holds only the anchor keys; use `WikitonguesDB` (or `ReferenceHydrator`) to resolve them into names, levels and subtags.

### 6. Runnable demos

```bash
npm run demo                              # runs demos/01 … 08 in order
npx tsx demos/02-smart-search.ts Sorani   # most scripts take arguments
npx tsx demos/03-tri-ontological-view.ts PeZHJcQYt3c
npx tsx demos/04-glottolog-tree.ts occi1239
```

| Script | Shows |
| :--- | :--- |
| `demos/01-load-and-stats.ts` | Construction, `stats()`, the bundled reference tables |
| `demos/02-smart-search.ts` | One `findByLanguage()` call resolving ISO, BCP 47, Glottocode, names, aliases, autonyms |
| `demos/03-tri-ontological-view.ts` | The three resolved standards + cultural identifiers for one recording |
| `demos/04-glottolog-tree.ts` | A language node returning its dialect nodes, primary or additional |
| `demos/05-query-builder.ts` | Chained filters, grouping, pagination, `count()` / `exists()` |
| `demos/06-inventory.ts` | Where SIL, Glottolog, BCP 47 and Wikitongues disagree, as tables |
| `demos/07-fail-fast.ts` | Every kind of invalid record and the `HydrationError` it raises |
| `demos/08-export.ts` | Seeded sampling, CSV, JSONL, hydrated vs persisted form |
| `demos/09-find-a-standard.ts` | Finding the *standard* variety (Parisian French, British English…) via Glottolog nodes or by chaining ISO + country + label filters |

### 7. Reference Tables

`src/generated/reference.json` is a pruned copy of the ISO 639-3 table, Glottolog and the IANA subtag registry containing exactly the codes the dataset uses (plus parent languages and families). Regenerate it after any change to the dataset or to `data/references/`:

```bash
npm run build:reference   # also run automatically by `npm run build`
```

The test suite fails if the committed file is out of date.

---

## Roadmap

- [x] **Phase 1 — Normalization & Semantic Validation**: Curate structured entities strictly against SIL ISO 639-3 and Glottolog tables.
- [x] **Phase 2 — Inverted Indexing & Smart Resolution**: $O(1)$ lookups, multilingual search, and query engine.
- [x] **Phase 3 — TypeScript (npm) Package**: Zero-dependency package with embedded dataset, dual ESM/CJS, and full TypeScript types.
- [x] **Phase 4 — Tri-ontological classification (v0.2.0)**: independent ISO 639-3 / Glottolog / BCP 47 anchors hydrated from bundled reference tables; no nullable standards.
- [ ] **Phase 5 — Rust (crates.io)**: High-performance, zero-alloc lookup engine.

---

## License & Attribution

All video contents and oral histories are recorded and owned by [Wikitongues](https://wikitongues.org/) and their respective speakers under Creative Commons licenses (primarily CC-BY-NC 4.0 / CC-BY 4.0).

This metadata repository and codebase are licensed under the MIT License.
