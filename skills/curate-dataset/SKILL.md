---
name: curate-dataset
description: >-
  Step-by-step agentic workflow to curate, normalize, and update the Wikitongues
  database with new YouTube recordings, ensuring strict linguistic compliance with
  SIL ISO 639-3, Glottolog, and IANA standards.
---

# Wikitongues Database Curation & Update Workflow

This skill guides you through curating and integrating newly discovered YouTube recordings
from `data/raw/wikitongues_youtube_raw.jsonl` into the published, ontology-anchored dataset
in `data/processed/wikitongues_normalized.json`.

---

## Mandatory Classification Standard

Before curating any entry, you **MUST** read and strictly adhere to [`CLASSIFICATION_RULES.md`](../../CLASSIFICATION_RULES.md).

## Step-by-Step Curation Workflow

### Step 1: Check Current Divergence
Run the status command to see how many raw videos are pending normalization:
```bash
npm run dataset:status
```
Note the pending count and inspect the list of pending video IDs.

---

### Step 2: Inspect the Pending Record
Inspect the target pending video (by pending index `0`, slice `0 5`, or `--id <videoId>`):
```bash
npm run inspect:raw 0
# or
npm run inspect:raw -- --id <videoId>
```

The output gives you:
1. **Raw metadata**: Video ID, URL, Title, Upload date, Duration, Tags, Subtitles.
2. **Video description**: Context about the speaker, language family, and recording background.
3. **Authoritative Candidates (SIL / Glottolog / IANA)**:
   Legitimate, non-hallucinated matches found from the official reference tables.
4. **Suggested JSON Skeleton**:
   Pre-filled structure ready to be enriched.

---

### Step 3: Complete the Normalized Record

Fill in the remaining fields in the skeleton:

1. **`content_type`**:
   - `oral_history`: Standard personal narrative / conversation (default).
   - `language_lesson`: Video teaching words or phrases ("Learn X with Y").
   - `fellowship_doc`: Long-form revitalization documentary (> 600s, Wikitongues Fellows).
   - `reading_or_song`: Poetry reading, song, or prayer.
   - `meta`: Channel updates, birthdays, livestreams, grant announcements.
2. **`primary_language`**:
   - Verify `standards`: `{ iso639_3, glottocode, bcp47 }` against candidate suggestions.
   - `wikitongues_classification`: Exact language label as authored by Wikitongues.
   - `wikitongues_lineage`: Normalized genealogical lineage (e.g. `"Bantu"`, `"Mayan"`, or `null`).
   - `autonym`: Endonym in native script.
3. **`speakers`**:
   - `name`: Extracted from title (e.g. `"Lolly"` from `"Lolly speaking Zulu"`).
   - `role`: `"native"` | `"heritage"` | `"second_language"`.
   - `origin`: Country/region of origin if stated in description (e.g. `"South Africa"`).
4. **`provenance`**:
   - `country_code`: ISO 3166-1 alpha-2 uppercase (e.g. `"ZA"`, `"GT"`, `"GB"`).
   - `country_name`: Full English country name (e.g. `"South Africa"`).
   - `recorded_by`: Name of the volunteer/recorder if named in description, else `null`.

---

### Step 4: Strict Validation & Ingestion
Always validate with `--dry-run` first:
```bash
npm run dataset:append -- --dry-run --json '<JSON_STRING>'
```

If validation fails, the tool will explain the exact error (e.g. macrolanguage scope, ontology mismatch). Fix the field accordingly.

Once validated, append it to the dataset:
```bash
npm run dataset:append -- --json '<JSON_STRING>'
```
*Note: `dataset:append` automatically updates both `wikitongues_normalized.json` and `.jsonl`, and rebuilds `src/generated/reference.json` via `npm run build:reference`.*

---

### Step 5: Subtitles Ingestion (If Subtitles Available)
If the raw video has subtitles available:
```bash
npm run download:subtitles -- --id <videoId>
```
This fetches the `.vtt` file, strips timestamps and boilerplate (Amara.org), and updates `transcription.english_translation` / `transcription.native_text`.

---

### Step 6: Verify the Entire Test Suite
Run the full verification suite to guarantee zero regression:
```bash
npm run test:all
```
All tests (`tests/db.test.ts`, `pipeline/__tests__/validation.test.ts`, `pipeline/__tests__/e2e_youtube.test.ts`) must pass.

---

## Special Case: Conlangs & Unclassifiable Videos
If a video represents a conlang or an unclassifiable entry that cannot satisfy §3.1.1 (like *Atlaans* `9Nl_ttQDYkQ` or empty live streams):
1. Document the exclusion and rationale.
2. Add the video ID and rationale to `EXCLUDED_VIDEO_IDS` in `pipeline/lib/exclusions.ts`.

