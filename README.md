# wikitongues-db

> A lightweight, zero-dependency database and lookup library mapping ISO 639-3 and BCP 47 language codes to Wikitongues oral history video recordings.

---

## 🎯 Motivation & Context

[Wikitongues](https://wikitongues.org/) is a non-profit organization dedicated to language documentation, revitalization, and diversity. Over the past decade, they have built an extraordinary archive of **over 3,000+ video recordings representing 700+ languages and dialects** across YouTube and Wikimedia Commons.

However, **there is currently no standardized, machine-readable dataset or client library** allowing developers, linguists, and educational platforms to easily resolve a language code (e.g. `eus`, `pt-BR`, `cmn`, `kab`) to a curated native speaker video.

Existing metadata across YouTube and Commons is heterogeneous, with free-text descriptions, evolving formats, and no unified index.

**`wikitongues-db`** bridges this gap by providing:
1. **An automated offline curation pipeline**: Video metadata extraction + LLM-assisted entity recognition validated strictly against **SIL ISO 639-3**, **BCP 47**, and **Glottolog** standards.
2. **A deterministic, static dataset**: High-quality JSON / binary index embeddable with zero network latency and zero API keys at runtime.
3. **High-level client libraries**: Fast $O(1)$ lookups by language code, country, dialect, or random discovery.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│     Wikitongues YouTube & Commons       │
└────────────────────┬────────────────────┘
                     │ (Scraping / Metadata dump)
                     ▼
┌─────────────────────────────────────────┐
│  AI-Powered Entity Extraction & Parser  │
│  (Speaker, Dialect, Region, Year, POS)  │
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

## 📋 Target Data Schema

Each entry in the database adheres to a strict schema:

```json
{
  "youtube_id": "dQw4w9WgXcQ",
  "speaker_name": "Amalia",
  "language_name": "Basque",
  "autonym": "Euskara",
  "iso639_3": "eus",
  "bcp47": "eu-ES",
  "glottocode": "basq1248",
  "dialect": "Gipuzkoan",
  "country": "ES",
  "recorded_year": 2019,
  "is_oral_sample": true,
  "license": "CC-BY-NC-4.0"
}
```

---

## 🗺️ Roadmap

- [ ] **Phase 1 — Ingestion**: Scrape raw metadata (titles, descriptions, dates, URLs) from the Wikitongues YouTube archive & Wikimedia Commons.
- [ ] **Phase 2 — Normalization**: Batch LLM extraction of structured entities (speakers, dialects, countries, autonyms).
- [ ] **Phase 3 — Validation**: Enforce strict SIL ISO 639-3 and Glottolog table validation.
- [ ] **Phase 4 — Packaging**: Publish `wikitongues-db` (JSON dataset + TypeScript / Rust wrappers).

---

## ⚖️ License & Attribution

All video contents and oral histories are recorded and owned by [Wikitongues](https://wikitongues.org/) and their respective speakers under Creative Commons licenses (primarily CC-BY-NC 4.0 / CC-BY 4.0).

This metadata repository and codebase are licensed under the MIT License.
