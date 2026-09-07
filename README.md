# wikitongues-db

> A lightweight, zero-dependency database and lookup library mapping ISO 639-3 and BCP 47 language codes to Wikitongues oral history video recordings. Available for **TypeScript / JavaScript (npm)** and **Python**.

---

## 🎯 Motivation & Context

[Wikitongues](https://wikitongues.org/) is a non-profit organization dedicated to language documentation, revitalization, and diversity. Over the past decade, they have built an extraordinary archive of **over 3,000+ video recordings representing 700+ languages and dialects** across YouTube and Wikimedia Commons.

However, **there is currently no standardized, machine-readable dataset or client library** allowing developers, linguists, and educational platforms to easily resolve a language code (e.g. `eus`, `pt-BR`, `cmn`, `kab`) to a curated native speaker video.

Existing metadata across YouTube and Commons is heterogeneous, with free-text descriptions, evolving formats, and no unified index.

**`wikitongues-db`** bridges this gap by providing:
1. **An automated offline curation pipeline**: Video metadata extraction + LLM-assisted entity recognition validated strictly against **SIL ISO 639-3**, **BCP 47**, and **Glottolog** standards.
2. **A deterministic, static dataset**: High-quality JSON / binary index embeddable with zero network latency and zero API keys at runtime.
3. **High-level client libraries (TypeScript & Python)**: Fast $O(1)$ lookups by language code, country, dialect, or random discovery.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│     Wikitongues YouTube & Commons       │
└────────────────────┬────────────────────┘
                     │ (Scraping / Metadata dump)
                     ▼
┌─────────────────────────────────────────┐
│  LLM-Powered Entity Extraction & Parser │
│                                         │
└────────────────────┬────────────────────┘
                     │ (Validation Layer)
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
           ┌─────────┴─────────┐
           ▼                   ▼
    TypeScript (npm)      Rust (crates.io)
   O(1) in-memory API    Zero-alloc lookup
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

## 🚀 High-Level Python Query API

`wikitongues-db` also includes the identical high-level, zero-latency in-memory query engine and Python API:

### 1. Basic Lookups & Natural Language Resolution

```python
from src import WikitonguesDB

# Initializes in-memory inverted indices across 860+ curated recordings
db = WikitonguesDB()

# 1. Smart Language Search (supports ISO 639-3, BCP 47, Glottolog, French/English aliases, autonyms)
russian_vids = db.find_by_language("russe")       # or "Russian", "rus", "ru", "Русский", "russ1263"
quechua_vids = db.find_by_language("Qhichwa")     # by native autonym
arberesh_vids = db.find_by_language("Arbëresh")   # by dialect

# 2. O(1) Indexed Lookups
video = db.get("nXBPa_wb3dM")                     # Lookup by YouTube ID
basque_vids = db.get_by_iso("eus")                # Lookup by ISO 639-3
peru_vids = db.get_by_country("PE")               # Lookup by ISO 3166-1 alpha-2
```

### 2. Fluent Chainable Query Builder

```python
results = (
    db.query()
    .language("Russian")
    .country("RU")
    .creative_commons_only()
    .with_subtitles()
    .min_duration(60)
    .max_duration(600)
    .order_by("duration", descending=True)
    .limit(10)
    .all()
)

print(f"Found {len(results)} videos ({results.total_duration_formatted})")
for v in results:
    print(f"- {v.title} | {v.url} | {v.duration_formatted}")
```

### 3. Full-Text Search with Relevance Scoring

```python
matches = db.search("dagestan caucasian oral history", limit=5)
for v in matches:
    print(v.title, v.primary_language.name, v.url)
```

---

## 💻 Command-Line Interface (CLI)

You can query the database directly from your terminal:

```bash
# Dataset statistics
python -m src.db.cli stats

# Query Russian videos with Creative Commons licenses
python -m src.db.cli query --language russe --cc

# Full-text search
python -m src.db.cli search "albanian diaspora"

# Discover a random video for a language
python -m src.db.cli random --language que

# List top languages
python -m src.db.cli languages --limit 20
```

---

## 🗺️ Roadmap

- [x] **Phase 1 — Ingestion (YouTube extractor module)**: Scrape raw metadata into JSON Lines.
- [x] **Phase 2 — Normalization**: Extraction of structured entities (speakers, dialects, countries, autonyms).
- [x] **Phase 3 — Validation**: Enforce strict SIL ISO 639-3 and Glottolog table validation.
- [x] **Phase 4 — High-Level Python Query API & Inverted Indexing**: Fast $O(1)$ lookups, fluent query builder, multilingual resolver, and CLI.
- [x] **Phase 5 — TypeScript (npm) Package**: Standalone, zero-dependency package with embedded dataset, dual ESM/CJS, and full TypeScript types.
- [ ] **Phase 6 — Rust (crates.io)**: High-performance, zero-alloc lookup engine.

---

## ⚖️ License & Attribution

All video contents and oral histories are recorded and owned by [Wikitongues](https://wikitongues.org/) and their respective speakers under Creative Commons licenses (primarily CC-BY-NC 4.0 / CC-BY 4.0).

This metadata repository and codebase are licensed under the MIT License.
