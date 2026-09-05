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

## 📋 Target Data Schema

Each entry in the database adheres to a strict schema:

```json
to be defined
```

---

## 🚀 Quick Start — Data Ingestion (Phase 1)

### 1. Setup Environment
```bash
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Run YouTube Extractor
To extract all video metadata from the `@Wikitongues` channel with incremental resumption:
```bash
python scripts/extract_youtube.py
```

Options:
- `--limit N`: Discover / extract only the first $N$ videos.
- `--output data/raw/custom.jsonl`: Target output file.
- `--min-delay 0.5 --max-delay 1.5`: Anti-rate-limiting jitter delay.

---

## 🗺️ Roadmap

- [x] **Phase 1 — Ingestion (YouTube extractor module)**: Scrape raw metadata (titles, descriptions, dates, URLs, tags) into incremental JSON Lines format.
- [ ] **Phase 2 — Normalization**: Batch LLM extraction of structured entities (speakers, dialects, countries, autonyms).
- [ ] **Phase 3 — Validation**: Enforce strict SIL ISO 639-3 and Glottolog table validation.
- [ ] **Phase 4 — Packaging**: Publish `wikitongues-db` (JSON dataset + TypeScript / Rust wrappers).


---

## ⚖️ License & Attribution

All video contents and oral histories are recorded and owned by [Wikitongues](https://wikitongues.org/) and their respective speakers under Creative Commons licenses (primarily CC-BY-NC 4.0 / CC-BY 4.0).

This metadata repository and codebase are licensed under the MIT License.
