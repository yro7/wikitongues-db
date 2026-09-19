# Target Architecture (v0.2.0): Tri-Ontological Classification & Schema Specification

> **Official Architectural Blueprint & Classification Rules for `wikitongues-db` (v0.2.0)**  
> This document formalizes the separation of competing linguistic ontologies and establishes the deterministic in-memory hydration model.

---

## 1. The Core Paradigm Shift: Rejecting the "Unified Taxonomy" Illusion

A fundamental flaw in early versions was attempting to force three distinct institutional standards into a single, hierarchical set of fields (`name`, `dialect`):

* Trying to treat **ISO 639-3** as the "common language", **BCP-47** as the "region", and **Glottolog** as the "dialect" is **factually false**.
* These three systems were designed by different bodies with incompatible philosophies:
  * **SIL / ISO 639-3** is a political and bibliographical registry of individual languages and macrolanguages. It splits Quechua into 44 languages and Arabic into 30, but bundles all Portuguese (Brazil, Portugal, Angola) into a single code `por`.
  * **Glottolog (Max Planck / Leipzig)** is an academic phylogenetic tree based on mutual intelligibility and documentation. It classifies Croatian, Serbian, and Bosnian as dialects of Serbo-Croatian (`sout1528`), while classifying Brazilian Portuguese as a dedicated dialect node (`braz1246`).
  * **BCP-47 (IETF / RFC 5646)** is an information technology standard for software locales, combining ISO 639 codes with ISO 3166 country subtags (`pt-BR`, `fr-CA`), script tags (`sr-Cyrl`), and dialect variants (`ca-valencia`).

**The v0.2.0 architecture stops forcing artificial compromises.**  
Instead of trying to decide whether Brazilian Portuguese is a "language" or a "dialect", the database records the exact classification made by each authority and exposes the three independent perspectives to the consumer.

---

## 2. Tri-Ontological Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               CURATED STORAGE LAYER (.json / .jsonl)                   │
│                                                                                        │
│  "primary_language": {                                                                 │
│    "standards": {                                                                      │
│      "iso639_3": "por",                                                                │
│      "glottocode": "braz1246",                                                         │
│      "bcp47": "pt-BR"                                                                  │
│    },                                                                                  │
│    "speaker_claim": "Português",                                                       │
│    "wikitongues_classification": "Brazilian Portuguese",                               │
│    "wikitongues_lineage": "Romance",                                                   │
│    "autonym": "Português"                                                              │
│  }                                                                                     │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼  DETERMINISTIC IN-MEMORY HYDRATION
                       (Joined against local reference tables at load-time)
                       ├── data/references/iso-639-3.tab
                       ├── data/references/glottolog_languages.csv
                       └── data/references/iana_language_subtag_registry.txt
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                             RESOLVED IN-MEMORY DOMAIN MODEL (SDK)                      │
│                                                                                        │
│  standards.iso639_3   ➔ { code: 'por', name: 'Portuguese', scope: 'I', type: 'L' }     │
│  standards.glottolog  ➔ { code: 'braz1246', name: 'Brazilian Portuguese',              │
│                           level: 'dialect', parentLanguage: 'port1283',                │
│                           family: 'indo1319' (Indo-European) }                         │
│  standards.bcp47      ➔ { tag: 'pt-BR', language: 'pt', region: 'BR' }                 │
│                                                                                        │
│  speakerClaim                ➔ "Português"                                             │
│  wikitonguesClassification   ➔ "Brazilian Portuguese"                                  │
│  wikitonguesLineage          ➔ "Romance"                                               │
│  autonym                     ➔ "Português"                                             │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Schema Specification: Storage vs Runtime

### 3.1 Persisted Record (`wikitongues_normalized.json`)

The record keeps every non-linguistic field already present in the dataset (`duration_seconds`, `upload_date`, `license`, `content_type`, `speakers`, `provenance`, `transcription`, `raw_metadata`) unchanged. Only the language blocks change.

**One language shape, used everywhere.** `primary_language` and every entry of `additional_languages[]` share the exact same `PersistedLanguage` structure. The primary language is **not** flattened onto the record root.

To prevent redundancy, avoid data drift, and keep the JSON compact, a language block stores **only the ontological anchor keys** and the cultural identifiers:

```json
{
  "id": "FiBkz0nnhtk",
  "url": "https://www.youtube.com/watch?v=FiBkz0nnhtk",
  "duration_seconds": 312,
  "upload_date": "2019-03-14",
  "license": "ALL_RIGHTS_RESERVED",
  "content_type": "oral_history",
  "primary_language": {
    "standards": {
      "iso639_3": "por",
      "glottocode": "braz1246",
      "bcp47": "pt-BR"
    },
    "speaker_claim": "Português",
    "wikitongues_classification": "Brazilian Portuguese",
    "wikitongues_lineage": "Romance",
    "autonym": "Português"
  },
  "additional_languages": [],
  "speakers": [
    { "name": "Vitória", "role": "native", "origin": "Brazil" }
  ],
  "provenance": {
    "country_code": "UY",
    "country_name": "Uruguay",
    "region": null,
    "city": "Montevideo",
    "recorded_by": "Wikitongues",
    "recording_date": null
  },
  "transcription": {
    "has_subtitles": false,
    "available_subtitles": [],
    "native_text": null,
    "english_translation": null
  },
  "raw_metadata": {
    "title": "Vitória speaking Brazilian Portuguese | Romance | Wikitongues",
    "tags": ["Wikitongues"]
  }
}
```

#### Multi-Language Example

When a video features multiple languages, `additional_languages[]` carries the same `PersistedLanguage` structure as `primary_language`:

```json
{
  "id": "xYz123abc",
  "url": "https://www.youtube.com/watch?v=xYz123abc",
  "duration_seconds": 540,
  "upload_date": "2020-11-02",
  "license": "CC_BY",
  "content_type": "oral_history",
  "primary_language": {
    "standards": {
      "iso639_3": "scl",
      "glottocode": "shin1264",
      "bcp47": "scl"
    },
    "speaker_claim": "Shina",
    "wikitongues_classification": "Shina",
    "wikitongues_lineage": "Dardic Indo-Aryan",
    "autonym": "شینا"
  },
  "additional_languages": [
    {
      "standards": {
        "iso639_3": "urd",
        "glottocode": "urdu1245",
        "bcp47": "ur"
      },
      "speaker_claim": null,
      "wikitongues_classification": "Urdu",
      "wikitongues_lineage": "Indo-Aryan",
      "autonym": "اردو"
    }
  ],
  "speakers": [
    { "name": "Ali", "role": "native", "origin": "Pakistan" }
  ],
  "provenance": {
    "country_code": "PK",
    "country_name": "Pakistan",
    "region": "Gilgit-Baltistan",
    "city": null,
    "recorded_by": "Wikitongues",
    "recording_date": null
  },
  "transcription": {
    "has_subtitles": true,
    "available_subtitles": ["en"],
    "native_text": null,
    "english_translation": null
  },
  "raw_metadata": {
    "title": "Ali speaking Shina and Urdu | Dardic | Indo-Aryan | Wikitongues",
    "tags": ["Wikitongues"]
  }
}
```

#### 3.1.1 Nullability Contract

**Every language is fully classified. There is no nullability on `standards`.**

| Field | Nullable | Rule |
| :--- | :--- | :--- |
| `standards.iso639_3` | **No** | Must exist in `iso-639-3.tab` with scope `I`. |
| `standards.glottocode` | **No** | Must exist in `glottolog_languages.csv` with level `language` or `dialect`. |
| `standards.bcp47` | **No** | Must be a well-formed RFC 5646 tag whose subtags all exist in the IANA registry. |
| `speaker_claim` | Yes | `null` when the speaker never names their language in the video. |
| `wikitongues_classification` | **No** | Wikitongues' own label, see §4.4. |
| `wikitongues_lineage` | Yes | `null` when the Wikitongues title carries no genealogical qualifiers. |
| `autonym` | **No** | Endonym in native script. |

A language record that fails any of the three `standards` constraints is a **validation error**: `tests/validation.test.ts` must fail, and the SDK must refuse to hydrate the dataset (fail-fast at load time, not silent `undefined`). A recording whose language genuinely cannot be pinned to all three standards is a curation task to resolve, not a schema exception.

**Consequence applied in v0.2.0**: the Atlaans recording (`9Nl_ttQDYkQ`, a constructed language with ISO 639-3 `mis`, no Glottocode and the private-use tag `art-x-atlaans`) cannot satisfy this contract and was removed from the dataset (863 → 862 records). It remains in `data/raw/` and is listed in `EXCLUDED_VIDEO_IDS` in the validation suite.

### 3.2 In-Memory Hydrated Object (`VideoRecord`)

When `WikitonguesDB` initializes in Node.js / Browser, it joins the keys against the bundled authority tables to build the full domain object:

Each resolved standard carries its own `name` from its reference table. There is no separate `displayName` — consumers pick the name from whichever standard they prefer (typically `wikitonguesClassification` for a human-readable label, `standards.glottolog.name` for the most specific academic label, or `standards.iso639_3.name` for the broadest).

```typescript
export interface ResolvedIso639_3 {
  code: string;                 // "por"
  name: string;                 // "Portuguese" — from iso-639-3.tab
  scope: 'I';                   // Individual — 'M' (macrolanguage) and 'S' (special) are rejected by validation
  type: 'L' | 'E' | 'A' | 'H' | 'C' | 'S';  // Living / Extinct / Ancient / Historical / Constructed / Special
  part1?: string;               // "pt" — ISO 639-1 code when one exists (used to derive the BCP-47 primary subtag)
  invertedName?: string;        // "Portuguese"
}

export interface ResolvedGlottolog {
  code: string;                 // "braz1246"
  name: string;                 // "Brazilian Portuguese" — from glottolog_languages.csv
  level: 'language' | 'dialect'; // "dialect" — 'family' is rejected by validation
  parentLanguageId?: string;    // "port1283" — Language_ID column, only set for dialects
  familyId?: string;            // "indo1319" — Family_ID column: the TOP-LEVEL family, not the immediate parent
  latitude?: number;
  longitude?: number;
  macroarea?: string;           // "South America"
}

export interface ResolvedBcp47 {
  tag: string;                  // "pt-BR"
  primarySubtag: string;        // "pt"
  scriptSubtag?: string;        // undefined
  regionSubtag?: string;        // "BR"
  variantSubtags: string[];     // [] — e.g. ["valencia"], ["aranes"]
  description?: string;         // "Portuguese" — from IANA registry Description field of the primary subtag
}

/** Shared by `primaryLanguage` and every entry of `additionalLanguages`. */
export interface VideoLanguage {
  // 1. Institutional Standards (Resolved at load-time from reference tables) — never null
  standards: {
    iso639_3: ResolvedIso639_3;
    glottolog: ResolvedGlottolog;
    bcp47: ResolvedBcp47;
  };

  // 2. Speaker Self-Identification (persisted, verbatim from the video)
  speakerClaim: string | null;    // What the speaker calls their language ("Créole", "Patois"); null if never stated

  // 3. Wikitongues Editorial Classification (persisted, verbatim from Wikitongues' own metadata)
  wikitonguesClassification: string;   // The language label Wikitongues uses ("Jèrriais", "Haitian Creole")
  wikitonguesLineage: string | null;   // Normalized genealogical qualifiers ("Norman Romance"); null if none

  // 4. Autonym (persisted)
  autonym: string;                // Native script endonym ("Qhichwa", "Arbërisht", "تونسي")
}

export interface VideoRecord {
  id: string;
  url: string;
  durationSeconds: number;
  uploadDate: string;
  license: string;
  contentType: string;
  primaryLanguage: VideoLanguage;
  additionalLanguages: VideoLanguage[];
  speakers: Speaker[];
  provenance: Provenance;
  transcription: Transcription;
  rawMetadata: RawMetadata;
}
```

---

## 4. Curation Rules for Curators and Pipelines

When curating or validating a video recording, curators must evaluate each standard **independently** according to its own institutional logic.

### 4.1 ISO 639-3 Curation Rule
* **Mandatory Individual Scope**: Always select the individual language code (Scope `I`).
* **Never use Macrolanguages**: `ara`, `zho`, `que`, `est`, `fas` are invalid primary codes.
* **Never use Special codes**: `mis`, `mul`, `und`, `zxx` are invalid.
* *Example*: For Cusco Quechua, use `quz`, never `que`. For Tunis Arabic, use `aeb`, never `ara`.
* *Example (Portuguese)*: Because SIL only maintains `por`, the code must be `por` regardless of whether the speaker is in Lisbon or Rio de Janeiro.

### 4.2 Glottolog Curation Rule (The Attested-Specificity Principle)

Assign the **most specific Glottolog node that the recording itself attests** — never deeper.

* **Default: the `language` node.** Every recording gets at least the Glottolog `language` node matching its ISO 639-3 code (e.g. `cusc1236` for `quz`, `port1283` for `por`).
* **Descend to a `dialect` node only on explicit evidence.** A dialect Glottocode may be assigned **only if** the variety is *named* by at least one of:
  1. the Wikitongues title or description (`wikitongues_classification`),
  2. the speaker in the video (`speaker_claim`),
  3. a Wikitongues tag.
* **Never infer a dialect from the speaker's origin or the recording location.** A speaker from Rio whose video is titled "Portuguese" gets `port1283`, not `braz1246`. `provenance.country_code` and `speakers[].origin` are **not** evidence for a Glottolog node.
* **Never invent depth.** If the named variety exists in Glottolog only as a `language` node, stop there; do not pick a child dialect that is "probably" right.
* *Examples of valid dialect assignment (variety named in the title)*:
  * "… speaking Brazilian Portuguese" ➔ `braz1246` (dialect under `port1283`)
  * "… speaking Alsatian" ➔ `alsa1241` (dialect under `swis1247`)
  * "… speaking Sfaxi Arabic" ➔ `sfax1238` (dialect under `tuni1259`)
  * "… speaking Québécois French" ➔ `queb1247` (dialect under `stan1290`)
  * "… speaking Aranese" ➔ `aran1260` (dialect under `occi1239`)
* *Examples of mandatory fallback to the language node*:
  * "… speaking Portuguese", speaker origin Brazil ➔ `port1283`
  * "… speaking Arabic", filmed in Sfax ➔ `tuni1259` at most (and only if `speaker_claim` or the title says Tunisian), never `sfax1238`
* **Prohibit Family Nodes**: Assigning `quec1387`, `afro1255`, or `indo1319` is a validation error.
* **Consistency with ISO 639-3**: the assigned node (if `language`) or its parent language (if `dialect`) must carry the same `ISO639P3code` as `standards.iso639_3`.

### 4.3 BCP-47 Curation Rule

Compose the **shortest valid RFC 5646 tag that distinguishes the recorded variety**. Every subtag must exist in the IANA registry. Private-use (`x-…`) and grandfathered tags are forbidden.

1. **Primary language subtag**
   * Use the **ISO 639-1** two-letter code when one exists for `standards.iso639_3` (`pt` for `por`, `ht` for `hat`, `fr` for `fra`).
   * Otherwise use the ISO 639-3 code itself (`quz`, `aeb`, `aae`, `scl`).
   * Never use a macrolanguage subtag (`ar`, `zh`, `qu`) — the primary subtag must correspond to the individual code chosen in §4.1.
2. **Region subtag** (ISO 3166-1 alpha-2) — add **only if** the recorded variety is *defined by* a region, i.e. `wikitongues_classification` or the Glottolog node names a country or region.
   * "Brazilian Portuguese" / `braz1246` ➔ `pt-BR`; "European Portuguese" ➔ `pt-PT`; "Québécois French" ➔ `fr-CA`; "Rioplatense Spanish" ➔ `es-AR`.
   * Do **not** add a region merely because the language happens to be spoken in one country, or because of where the video was filmed: Arbëreshë Albanian is `aae`, never `aae-IT`; Jèrriais is `nrf`, never `nrf-JE`.
3. **Script subtag** (ISO 15924) — add **only if** the language is written in several scripts *and* the recording's metadata (title, subtitles, autonym) identifies which one (`sr-Latn`, `sr-Cyrl`, `uz-Cyrl`). Never add a script that the IANA registry marks as `Suppress-Script` for the language (`en-Latn`, `fr-Latn` are invalid).
4. **Variant subtags** — when the IANA registry has a registered variant for the recorded variety, prefer it over a region subtag: `ca-valencia` (Valencian), `sl-rozaj` (Resian), `oc-aranes` (Aranese), `de-1996` is *not* a dialect variant and must not be used.
5. **Ordering**: `language[-script][-region][-variant]`, per RFC 5646 §2.1.

### 4.4 `speaker_claim`, `wikitongues_classification`, `wikitongues_lineage` & `autonym` Curation Rules

* **`speaker_claim`** — Records **strictly** how the speaker self-identifies their language *in the video*. This is the raw vernacular label the speaker uses, transcribed as-is (*"Créole"*, *"Patois"*, *"Arabe"*, *"Chiac"*, *"Valencien"*). **If the speaker never names their language, the value is `null`.** Never substitute the title, the description, or a curator's guess — the whole point of this field is to be the one value nobody but the speaker has authored.

* **`wikitongues_classification`** — The language label **authored by Wikitongues**, taken verbatim from Wikitongues' own metadata, never invented by our curators. Extraction rule, in priority order:
  1. The language name in the YouTube title, following the `speaking` / `singing in` / `shares his language,` pattern, or the `The X language` pattern: *"Geraint speaking Jèrriais | Norman | Romance | Wikitongues"* ➔ `"Jèrriais"`; *"The Tsonga language, casually spoken | …"* ➔ `"Tsonga"`.
  2. Parenthesized qualifiers in the name are kept as written: *"Casey speaking (Southwestern) Ojibwe"* ➔ `"(Southwestern) Ojibwe"`.
  3. If the title carries no language name (fellowship documentaries, editorial videos), use the language named in the video description or tags.
  4. Wikitongues-only stylistic noise is stripped (`the`, `language`, trailing punctuation), but the name is otherwise **not** edited, translated, or "corrected" — if Wikitongues wrote *"Mandailing Batak"* it stays *"Mandailing Batak"* even though ISO calls it *"Batak Mandailing"*.

* **`wikitongues_lineage`** — The genealogical qualifiers Wikitongues appends to the title, normalized into a single space-separated string, most specific first, ordered as in the title. Pipe separators are dropped; the `Wikitongues` sentinel, country/place names, and program names (`Wikitongues Fellows #3`) are excluded because they are not lineage.
  * *"… | Norman | Romance | Wikitongues"* ➔ `"Norman Romance"`
  * *"… | Taihu Wu | Northern Wu | China | Wikitongues"* ➔ `"Taihu Wu Northern Wu"`
  * *"… | Savanna | Niger-Congo | Nigeria | Benin | Wikitongues"* ➔ `"Savanna Niger-Congo"`
  * *"… | Wikitongues Fellows #3"* ➔ `null`
  * This is **Wikitongues' folk classification**, kept for transparency; it is never used to derive `standards.*`.

* **`autonym`** — The authentic endonym written in native orthography/script (*"Qhichwa"*, *"Arbërisht"*, *"Asụsụ Igbo"*, *"Русский"*, *"تونسي"*).

---

## 5. Concrete Benchmarks Under v0.2.0

| Case | `speaker_claim` | `wikitongues_classification` | `standards.iso639_3` | `standards.glottolog` | `standards.bcp47` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Brazilian Portuguese** (`qpfxFvpLAJ8`, "Ygor speaking Brazilian Portuguese") | `null` (not yet curated) | `"Brazilian Portuguese"` | `por` (Portuguese) | `braz1246` (Brazilian Portuguese, *dialect*) | `pt-BR` |
| **Portuguese, title just "Portuguese"** (`FiBkz0nnhtk`, "Vitória speaking Portuguese", speaker from Brazil) | `null` | `"Portuguese"` | `por` (Portuguese) | `port1283` (Portuguese, *language*) | `pt` |
| **Cusco Quechua** (`nXBPa_wb3dM`, documentary) | `null` | `"Cusco Quechua"` | `quz` (Cusco Quechua) | `cusc1236` (Cusco Quechua, *language*) | `quz` |
| **Sfaxi Tunisian** (hypothetical) | `"Arabe"` | `"Sfaxi Tunisian Arabic"` | `aeb` (Tunisian Arabic) | `sfax1238` (Sfax, *dialect*) | `aeb` |
| **Québécois French** (`kAenLJSfNWM`, "Maxime speaking Québecois French") | `null` | `"Québecois French"` | `fra` (French) | `queb1247` (Québécois, *dialect*) | `fr-CA` |
| **Arbëreshë** (`lstcnY-UXbs`, fellowship documentary) | `null` | `"Arbëreshë Albanian"` | `aae` (Arbëreshë Albanian) | `arbe1236` (Arbëreshë Albanian, *language*) | `aae` |
| **Jèrriais** (`PeZHJcQYt3c`, "Geraint speaking Jèrriais \| Norman \| Romance") | `null` | `"Jèrriais"` (lineage `"Norman Romance"`) | `nrf` (Jèrriais) | `jerr1238` (Jerriais, *dialect*) | `nrf` |
| **Valencian** (`mygnGGT679A`, "Francesc speaking Valencian Catalan") | `null` | `"Valencian Catalan"` | `cat` (Catalan) | `stan1289` (Catalan, *language*) | `ca-valencia` |
| **Haitian Creole** (hypothetical) | `"Créole"` | `"Haitian Creole"` | `hat` (Haitian) | `hait1244` (Haitian, *language*) | `ht` |

`speaker_claim` is `null` across the whole dataset after the v0.2.0 migration: it can only be filled by watching each video, which is a separate curation pass.

---

## 6. Implementation Strategy: Clean Break (Zero Legacy Shims)

Because the project is in pre-release (`v0.x.x`) without active production consumers, **there will be no legacy compatibility layers, deprecation shims, or dead code**.

The transition to `v0.2.0` is an explicit, clean break:

1. **Clean Schema Cutover**:
   * Directly migrate `wikitongues_normalized.json` and `jsonl` to the new language block (`standards: { iso639_3, glottocode, bcp47 }`, `speaker_claim`, `wikitongues_classification`, `wikitongues_lineage`, `autonym`) inside `primary_language` and every `additional_languages[]` entry.
   * Drop the ambiguous `name` and `dialect` fields from storage.
   * All other record fields are untouched.
2. **Deterministic Hydration Engine** (`src/hydrator.ts`):
   * `ReferenceHydrator` joins the anchor keys against `src/generated/reference.json`, a pruned copy of `iso-639-3.tab`, `glottolog_languages.csv` and `iana_language_subtag_registry.txt` restricted to the codes the dataset uses (plus parent languages and families). It is regenerated by `npm run build:reference` (part of `npm run build`) and committed; the test suite fails if it is stale.
   * Each resolved standard exposes its own `name` from its reference table (no standalone `displayName`).
   * Hydration fails fast on any unresolvable key (§3.1.1) with a `HydrationError` naming the record, the field and the code.
3. **Test Suite Modernization**:
   * Update all tests in `tests/db.test.ts` and `tests/validation.test.ts` to test against the v0.2.0 domain model directly.
   * `validation.test.ts` enforces §3.1.1 (no null `standards`), §4.1 (scope `I`), §4.2 (level ∉ `family`, ISO consistency between the Glottolog node and `iso639_3`), and §4.3 (well-formed tag, subtags registered, primary subtag matches `iso639_3` via `Part1`).
