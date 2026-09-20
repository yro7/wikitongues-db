/**
 * CLI: Compute divergence and status between raw YouTube metadata and normalized dataset.
 *
 * Usage:
 *   npx tsx pipeline/scripts/diff_dataset.ts [options]
 *
 * Options:
 *   --export <path>    Export the pending raw records to a JSON file
 *   --subtitles        Show detailed divergence on subtitle translations
 *   --json             Output summary and diff as JSON
 *   --help             Show help message
 */

import * as fs from 'fs';
import * as path from 'path';
import { VideoData } from '../../src/types';

const ROOT_DIR = path.resolve(__dirname, '../..');
const RAW_JSONL_PATH = path.join(ROOT_DIR, 'data/raw/wikitongues_youtube_raw.jsonl');
const NORMALIZED_JSON_PATH = path.join(ROOT_DIR, 'data/processed/wikitongues_normalized.json');

/**
 * Raw YouTube records deliberately absent from the normalized dataset because they
 * cannot satisfy CLASSIFICATION_RULES.md §3.1.1 (all three standards mandatory).
 */
const EXCLUDED_VIDEO_IDS = new Map<string, string>([
  ['9Nl_ttQDYkQ', 'Atlaans: conlang — ISO 639-3 `mis`, no Glottocode, private-use BCP-47 tag'],
]);

interface RawRecord {
  video_id: string;
  url: string;
  title: string;
  description: string;
  upload_date: string;
  timestamp: number;
  duration: number;
  view_count: number;
  like_count: number;
  tags: string[];
  channel_id: string;
  channel_title: string;
  subtitles_available: string[];
  automatic_captions_available: string[];
  thumbnail_url: string | null;
  extracted_at: string;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    exportPath: undefined as string | undefined,
    subtitles: false,
    json: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--export') {
      options.exportPath = args[++i];
    } else if (arg === '--subtitles') {
      options.subtitles = true;
    } else if (arg === '--json') {
      options.json = true;
    }
  }

  return options;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatDate(dateStr: string): string {
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  }
  return dateStr || 'unknown';
}

function main() {
  const options = parseArgs();

  if (options.help) {
    console.log(`
Dataset Divergence & Status Inspector

Usage:
  npx tsx pipeline/scripts/diff_dataset.ts [options]

Options:
  --export <path>   Export pending records to a JSON file
  --subtitles       Inspect subtitle coverage divergence
  --json            Output results as JSON
  --help, -h        Show this message
`);
    return;
  }

  if (!fs.existsSync(RAW_JSONL_PATH)) {
    console.error(`Raw dataset not found at: ${RAW_JSONL_PATH}`);
    process.exit(1);
  }
  if (!fs.existsSync(NORMALIZED_JSON_PATH)) {
    console.error(`Normalized dataset not found at: ${NORMALIZED_JSON_PATH}`);
    process.exit(1);
  }

  // 1. Load raw records
  const rawRecords: RawRecord[] = [];
  const rawContent = fs.readFileSync(RAW_JSONL_PATH, 'utf8');
  for (const line of rawContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      rawRecords.push(JSON.parse(trimmed));
    } catch {
      // Ignore corrupt lines
    }
  }

  // 2. Load normalized records
  const normalizedRecords: VideoData[] = JSON.parse(fs.readFileSync(NORMALIZED_JSON_PATH, 'utf8'));

  const rawMap = new Map<string, RawRecord>(rawRecords.map((r) => [r.video_id, r]));
  const normMap = new Map<string, VideoData>(normalizedRecords.map((v) => [v.id, v]));

  // 3. Compute differences
  const pendingRecords: RawRecord[] = [];
  const excludedPresent: { id: string; reason: string }[] = [];

  for (const raw of rawRecords) {
    if (EXCLUDED_VIDEO_IDS.has(raw.video_id)) {
      excludedPresent.push({
        id: raw.video_id,
        reason: EXCLUDED_VIDEO_IDS.get(raw.video_id)!,
      });
      continue;
    }
    if (!normMap.has(raw.video_id)) {
      pendingRecords.push(raw);
    }
  }

  const orphanedNormalized: VideoData[] = [];
  for (const norm of normalizedRecords) {
    if (!rawMap.has(norm.id)) {
      orphanedNormalized.push(norm);
    }
  }

  // Subtitles analysis
  const normalizedWithSubFlag = normalizedRecords.filter((v) => v.transcription?.has_subtitles);
  const normalizedWithEnText = normalizedRecords.filter((v) => v.transcription?.english_translation);
  const normalizedWithNativeText = normalizedRecords.filter((v) => v.transcription?.native_text);

  if (options.json) {
    const result = {
      counts: {
        raw_total: rawRecords.length,
        normalized_total: normalizedRecords.length,
        documented_exclusions: excludedPresent.length,
        pending_total: pendingRecords.length,
        orphaned_in_normalized: orphanedNormalized.length,
      },
      subtitles: {
        flagged_with_subtitles: normalizedWithSubFlag.length,
        has_english_translation: normalizedWithEnText.length,
        has_native_text: normalizedWithNativeText.length,
      },
      pending: pendingRecords.map((p) => ({
        id: p.video_id,
        title: p.title,
        upload_date: formatDate(p.upload_date),
        duration_seconds: p.duration,
        url: p.url,
      })),
    };
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  // Terminal report
  console.log(`\n${'═'.repeat(78)}`);
  console.log(`  Wikitongues Dataset Status & Raw-Normalized Divergence Report`);
  console.log(`${'═'.repeat(78)}\n`);

  console.log(`┌─ Summary Counts ${'─'.repeat(60)}┐`);
  console.log(`│  • Raw YouTube records (data/raw/)        : ${rawRecords.length.toString().padStart(6)}                     │`);
  console.log(`│  • Normalized records  (data/processed/)  : ${normalizedRecords.length.toString().padStart(6)}                     │`);
  console.log(`│  • Documented exclusions (§3.1.1 conlangs): ${excludedPresent.length.toString().padStart(6)}                     │`);
  console.log(`│  • Orphaned records in normalized         : ${orphanedNormalized.length.toString().padStart(6)}                     │`);
  console.log(`│                                                                              │`);
  const statusColor = pendingRecords.length === 0 ? '\x1b[32m' : '\x1b[33m';
  console.log(`│  ▶ PENDING UNTREATED VIDEOS               : ${statusColor}${pendingRecords.length.toString().padStart(6)}\x1b[0m                     │`);
  console.log(`└${'─'.repeat(76)}┘\n`);

  console.log(`┌─ Transcription & Subtitles Coverage ${'─'.repeat(40)}┐`);
  console.log(`│  • Normalized recordings flagged has_subtitles=true : ${normalizedWithSubFlag.length.toString().padStart(6)}               │`);
  console.log(`│  • With clean English translation text populated    : ${normalizedWithEnText.length.toString().padStart(6)}               │`);
  console.log(`│  • With clean Native language text populated        : ${normalizedWithNativeText.length.toString().padStart(6)}               │`);
  console.log(`└${'─'.repeat(76)}┘\n`);

  if (orphanedNormalized.length > 0) {
    console.log(`\x1b[31m[WARNING] Found ${orphanedNormalized.length} records in normalized dataset with NO raw counterpart:\x1b[0m`);
    for (const o of orphanedNormalized) {
      console.log(`  - ${o.id}: ${o.raw_metadata?.title || 'No title'}`);
    }
    console.log();
  }

  if (pendingRecords.length > 0) {
    console.log(`${'─'.repeat(78)}`);
    console.log(`  Pending Videos to Normalize & Classify (${pendingRecords.length})`);
    console.log(`${'─'.repeat(78)}`);

    for (let i = 0; i < pendingRecords.length; i++) {
      const p = pendingRecords[i];
      const idxStr = `[${(i + 1).toString().padStart(2, ' ')}]`;
      const dateStr = formatDate(p.upload_date);
      const durStr = formatDuration(p.duration);

      console.log(`\n  ${idxStr} \x1b[1m${p.title}\x1b[0m`);
      console.log(`       ID: \x1b[36m${p.video_id}\x1b[0m | Date: ${dateStr} | Duration: ${durStr} | ${p.url}`);
      if (p.tags && p.tags.length > 0) {
        console.log(`       Tags: ${p.tags.slice(0, 5).join(', ')}`);
      }
    }
    console.log(`\n${'─'.repeat(78)}\n`);
  } else {
    console.log(`\x1b[32m✓ Perfect sync: All raw records (minus exclusions) are fully classified in normalized dataset.\x1b[0m\n`);
  }

  if (options.exportPath) {
    const outPath = path.resolve(process.cwd(), options.exportPath);
    fs.writeFileSync(outPath, JSON.stringify(pendingRecords, null, 2) + '\n', 'utf8');
    console.log(`✓ Exported ${pendingRecords.length} pending record(s) to: ${outPath}\n`);
  }
}

main();
