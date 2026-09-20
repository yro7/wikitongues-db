/**
 * CLI: Strict Linguistic Validator & Ingestor for Normalized Dataset Entries.
 *
 * Validates new candidate entries against the authoritative SIL ISO 639-3,
 * Glottolog, and IANA reference tables, and safely appends them to:
 * - data/processed/wikitongues_normalized.json
 * - data/processed/wikitongues_normalized.jsonl
 *
 * Usage:
 *   npx tsx pipeline/scripts/append_normalized.ts <file_with_records.json>
 *   npx tsx pipeline/scripts/append_normalized.ts --json '{...}'
 *   cat record.json | npx tsx pipeline/scripts/append_normalized.ts
 *
 * Options:
 *   --dry-run      Validate entries strictly without writing to disk
 *   --help         Show help message
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  parseIsoTable,
  parseGlottologCsv,
  parseIanaRegistry,
  glottologIsoCode,
  GlottologRow,
  IanaRegistry,
} from '../../shared/reference_parsers';
import { VideoData, LanguageData, Iso639_3Entry } from '../../src/types';

const ROOT_DIR = path.resolve(__dirname, '../..');
const JSON_PATH = path.join(ROOT_DIR, 'data/processed/wikitongues_normalized.json');
const JSONL_PATH = path.join(ROOT_DIR, 'data/processed/wikitongues_normalized.jsonl');

interface ValidationContext {
  iso: Map<string, Iso639_3Entry>;
  glottolog: Map<string, GlottologRow>;
  iana: IanaRegistry;
  existingIds: Set<string>;
}

function initValidationContext(): ValidationContext {
  const iso = parseIsoTable();
  const glottolog = parseGlottologCsv();
  const iana = parseIanaRegistry();

  const existingRaw = fs.readFileSync(JSON_PATH, 'utf8');
  const existingRecords: VideoData[] = JSON.parse(existingRaw);
  const existingIds = new Set<string>(existingRecords.map((r) => r.id));

  return { iso, glottolog, iana, existingIds };
}

function validateLanguage(
  lang: LanguageData,
  recordId: string,
  role: 'primary' | 'additional',
  ctx: ValidationContext
): void {
  const { iso, glottolog, iana } = ctx;
  const std = lang.standards;

  if (!std) {
    throw new Error(`[${recordId}] ${role}_language.standards is missing.`);
  }

  // 1. ISO 639-3 check
  const isoCode = (std.iso639_3 || '').trim().toLowerCase();
  if (!isoCode) {
    throw new Error(`[${recordId}] ${role}_language missing iso639_3 code.`);
  }
  const isoEntry = iso.get(isoCode);
  if (!isoEntry) {
    throw new Error(`[${recordId}] ISO 639-3 code '${isoCode}' does not exist in the official SIL table.`);
  }
  if (isoEntry.scope !== 'I') {
    throw new Error(
      `[${recordId}] ISO 639-3 code '${isoCode}' (${isoEntry.name}) has scope '${isoEntry.scope}'. Only individual languages (I) are permitted (macrolanguages are forbidden by CLASSIFICATION_RULES.md §4.1).`
    );
  }

  // 2. Glottolog check
  const glottoCode = (std.glottocode || '').trim().toLowerCase();
  if (!glottoCode) {
    throw new Error(`[${recordId}] ${role}_language missing glottocode.`);
  }
  const glottoRow = glottolog.get(glottoCode);
  if (!glottoRow) {
    throw new Error(`[${recordId}] Glottocode '${glottoCode}' does not exist in Glottolog.`);
  }
  if (glottoRow.level === 'family') {
    throw new Error(
      `[${recordId}] Glottocode '${glottoCode}' (${glottoRow.name}) is a family node. Only language or dialect nodes are allowed (§4.2).`
    );
  }

  // Hierarchy cross-check
  const glottoIso = glottologIsoCode(glottoRow, glottolog);
  if (glottoIso && glottoIso !== isoCode) {
    // Check if documented exception
    const allowedDivergences = new Set(['jpr', 'twd', 'gos']);
    if (!allowedDivergences.has(isoCode)) {
      throw new Error(
        `[${recordId}] Ontology mismatch: Glottocode '${glottoCode}' belongs to ISO '${glottoIso}', but record declared ISO '${isoCode}'.`
      );
    }
  }

  // 3. BCP-47 check
  const bcp47 = (std.bcp47 || '').trim();
  if (!bcp47) {
    throw new Error(`[${recordId}] ${role}_language missing bcp47 tag.`);
  }

  const subtags = bcp47.split('-');
  const primarySubtag = subtags[0].toLowerCase();

  // Part 1 check
  if (isoEntry.part1 && primarySubtag !== isoEntry.part1.toLowerCase()) {
    throw new Error(
      `[${recordId}] BCP-47 primary subtag must be '${isoEntry.part1}' (ISO 639-1), but found '${primarySubtag}' (§4.3.1).`
    );
  } else if (!isoEntry.part1 && primarySubtag !== isoCode) {
    throw new Error(
      `[${recordId}] BCP-47 primary subtag must be '${isoCode}' (ISO 639-3), but found '${primarySubtag}' (§4.3.1).`
    );
  }

  // Check subtag registration in IANA
  if (!iana.language.has(primarySubtag)) {
    throw new Error(`[${recordId}] BCP-47 primary subtag '${primarySubtag}' is not registered in IANA.`);
  }

  // Labels check
  if (!lang.wikitongues_classification || !lang.wikitongues_classification.trim()) {
    throw new Error(`[${recordId}] ${role}_language missing wikitongues_classification.`);
  }
  if (!lang.autonym || !lang.autonym.trim()) {
    throw new Error(`[${recordId}] ${role}_language missing autonym.`);
  }
}

function validateRecord(record: any, ctx: ValidationContext): VideoData {
  if (!record || typeof record !== 'object') {
    throw new Error('Record must be a JSON object.');
  }

  const id = record.id?.trim();
  if (!id) throw new Error('Record missing "id" field.');
  if (ctx.existingIds.has(id)) {
    throw new Error(`Record with ID "${id}" already exists in the normalized dataset.`);
  }

  if (!record.url || !record.url.startsWith('https://www.youtube.com/watch?v=')) {
    throw new Error(`[${id}] Invalid or missing "url" field.`);
  }

  if (typeof record.duration_seconds !== 'number' || record.duration_seconds <= 0) {
    throw new Error(`[${id}] "duration_seconds" must be a positive number.`);
  }

  if (!record.upload_date || !/^\d{4}-\d{2}-\d{2}$/.test(record.upload_date)) {
    throw new Error(`[${id}] "upload_date" must be formatted as YYYY-MM-DD.`);
  }

  if (!record.license) {
    throw new Error(`[${id}] Missing "license" field.`);
  }

  if (!record.content_type) {
    throw new Error(`[${id}] Missing "content_type" field.`);
  }

  if (!record.primary_language) {
    throw new Error(`[${id}] Missing "primary_language" field.`);
  }

  // Validate primary language
  validateLanguage(record.primary_language, id, 'primary', ctx);

  // Validate additional languages if present
  if (Array.isArray(record.additional_languages)) {
    for (const al of record.additional_languages) {
      validateLanguage(al, id, 'additional', ctx);
    }
  }

  return record as VideoData;
}

function readInput(filePath?: string, inlineJson?: string): any[] {
  let content = '';

  if (inlineJson) {
    content = inlineJson;
  } else if (filePath) {
    content = fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8');
  } else {
    // Read from stdin
    try {
      content = fs.readFileSync(0, 'utf8');
    } catch {
      // Stdin not available
    }
  }

  if (!content || !content.trim()) {
    throw new Error('No input provided. Provide a JSON file path, use --json, or pipe JSON via stdin.');
  }

  const parsed = JSON.parse(content);
  return Array.isArray(parsed) ? parsed : [parsed];
}

async function main() {
  const args = process.argv.slice(2);
  let filePath: string | undefined;
  let inlineJson: string | undefined;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      console.log(`
Normalized Entry Ingestion & Linguistic Validator

Usage:
  npx tsx pipeline/scripts/append_normalized.ts <file.json> [options]
  npx tsx pipeline/scripts/append_normalized.ts --json '{...}' [options]
  cat record.json | npx tsx pipeline/scripts/append_normalized.ts

Options:
  --dry-run   Perform strict validation without writing to disk
  --help, -h  Show this message
`);
      return;
    } else if (arg === '--dry-run') {
      dryRun = true;
    } else if (arg === '--json') {
      inlineJson = args[++i];
    } else if (!arg.startsWith('-')) {
      filePath = arg;
    }
  }

  const rawEntries = readInput(filePath, inlineJson);
  console.log(`\nValidating ${rawEntries.length} candidate record(s) against SIL, Glottolog, and IANA...`);

  const ctx = initValidationContext();
  const validRecords: VideoData[] = [];

  for (let idx = 0; idx < rawEntries.length; idx++) {
    const r = rawEntries[idx];
    const valid = validateRecord(r, ctx);
    validRecords.push(valid);
    ctx.existingIds.add(valid.id); // Prevent intra-batch duplicates
    console.log(
      `  ✓ [${idx + 1}/${rawEntries.length}] Validated: ${valid.id} - ${valid.primary_language.wikitongues_classification} (${valid.primary_language.standards.iso639_3} / ${valid.primary_language.standards.glottocode} / ${valid.primary_language.standards.bcp47})`
    );
  }

  if (dryRun) {
    console.log(`\n[DRY RUN] All ${validRecords.length} record(s) passed strict validation. No changes written.`);
    return;
  }

  // Load existing normalized dataset
  const currentRecords: VideoData[] = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  const updatedRecords = [...currentRecords, ...validRecords];

  console.log(`\nWriting ${validRecords.length} record(s) to:`);
  console.log(`  - ${JSON_PATH}`);
  console.log(`  - ${JSONL_PATH}`);

  fs.writeFileSync(JSON_PATH, JSON.stringify(updatedRecords, null, 2) + '\n', 'utf8');
  fs.writeFileSync(JSONL_PATH, updatedRecords.map((v) => JSON.stringify(v)).join('\n') + '\n', 'utf8');

  console.log(`\nRebuilding runtime reference tables (npm run build:reference)...`);
  const { execSync } = require('child_process');
  execSync('npm run build:reference', { cwd: ROOT_DIR, stdio: 'inherit' });

  console.log(`\n✓ Successfully appended ${validRecords.length} record(s). Dataset total: ${updatedRecords.length} records.\n`);
}

main().catch((err) => {
  console.error('\n❌ Ingestion rejected:', err.message);
  process.exit(1);
});
