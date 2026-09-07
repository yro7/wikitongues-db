# wikitongues-db

> A lightweight, zero-dependency database and lookup library mapping ISO 639-3 and BCP 47 language codes to Wikitongues oral history video recordings. Published for **TypeScript / JavaScript (npm)**.

---

## 🎯 Motivation & Context

[Wikitongues](https://wikitongues.org/) is a non-profit organization dedicated to language documentation, revitalization, and diversity. Over the past decade, they have built an extraordinary archive of **over 3,000+ video recordings representing 700+ languages and dialects** across YouTube and Wikimedia Commons.

However, **there is currently no standardized, machine-readable dataset or client library** allowing developers, linguists, and educational platforms to easily resolve a language code (e.g. `eus`, `pt-BR`, `cmn`, `kab`) to a curated native speaker video.

Existing metadata across YouTube and Commons is heterogeneous, with free-text descriptions, evolving formats, and no unified index.

**`wikitongues-db`** bridges this gap by providing:
1. **A deterministic, static dataset**: 863 high-quality, normalized records embeddable with zero network latency and zero API keys at runtime.
2. **Strict linguistic standards**: Verified against **SIL ISO 639-3**, **BCP 47**, and **Glottolog**.
3. **High-level TypeScript library**: Fast $O(1)$ lookups by language code, country, dialect, or random discovery with full type safety.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│     Wikitongues YouTube & Commons       │
└────────────────────┬────────────────────┘
                     │ (Curated Metadata)
                     ▼
┌─────────────────────────────────────────┐
│  SIL ISO 639-3 & Glottolog Validator    │  <-- Anti-hallucination safeguard
└────────────────────┬────────────────────┘
                     │ (Deterministic Indexing)
                     ▼
┌─────────────────────────────────────────┐
│     wikitongues-db (Static JSON / DB)   │
└────────────────────┬────────────────────┘
                     │
                     ▼
           TypeScript (npm)
          O(1) in-memory API
```

---

## ⚡ TypeScript & JavaScript API (npm)

The TypeScript package is zero-dependency, works seamlessly across Node.js (CommonJS & ESM), Vite, Next.js, and browser environments, and embeds the curated normalized dataset directly.

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

// Initializes in-memory inverted indices across 860+ curated recordings instantly
const db = new WikitonguesDB();

// 1. Smart Language Search (supports ISO 639-3, BCP 47, Glottolog, French/English aliases, autonyms)
const russianVids = db.findByLanguage('russe');     // or "Russian", "rus", "ru", "Русский", "russ1263"
const quechuaVids = db.findByLanguage('Qhichwa');   // by native autonym
const arbereshVids = db.findByLanguage('Arbëresh'); // by dialect

// 2. O(1) Indexed Lookups
const video = db.get('nXBPa_wb3dM');                // Lookup by YouTube ID
const basqueVids = db.getByIso('eus');              // Lookup by ISO 639-3
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
  console.log(v.title, v.primaryLanguage.name, v.url);
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
```

---

## 🗺️ Roadmap

- [x] **Phase 1 — Normalization & Semantic Validation**: Curate structured entities strictly against SIL ISO 639-3 and Glottolog tables.
- [x] **Phase 2 — Inverted Indexing & Smart Resolution**: $O(1)$ lookups, multilingual search, and query engine.
- [x] **Phase 3 — TypeScript (npm) Package**: Zero-dependency package with embedded dataset, dual ESM/CJS, and full TypeScript types.
- [ ] **Phase 4 — Rust (crates.io)**: High-performance, zero-alloc lookup engine.

---

## ⚖️ License & Attribution

All video contents and oral histories are recorded and owned by [Wikitongues](https://wikitongues.org/) and their respective speakers under Creative Commons licenses (primarily CC-BY-NC 4.0 / CC-BY 4.0).

This metadata repository and codebase are licensed under the MIT License.
