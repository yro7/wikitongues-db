/**
 * CLI: Inspect raw YouTube records and display candidate linguistic matches for curation.
 *
 * Usage:
 *   npx tsx pipeline/scripts/inspect_raw.ts [pending_index_start] [pending_index_end]
 *   npx tsx pipeline/scripts/inspect_raw.ts --id <video_id>
 *   npx tsx pipeline/scripts/inspect_raw.ts --raw <raw_index>
 *
 * Examples:
 *   npx tsx pipeline/scripts/inspect_raw.ts 0         → shows first pending video
 *   npx tsx pipeline/scripts/inspect_raw.ts 0 5       → shows pending videos 0..4
 *   npx tsx pipeline/scripts/inspect_raw.ts --id MxvdCaFjJZo
 */

import * as fs from 'fs';
import * as path from 'path';
import { findCandidates, extractNamesFromTitle } from '../lib/candidate_finder';
import { VideoData } from '../../src/types';

const ROOT_DIR = path.resolve(__dirname, '../..');
const RAW_JSONL_PATH = path.join(ROOT_DIR, 'data/raw/wikitongues_youtube_raw.jsonl');
const NORMALIZED_JSON_PATH = path.join(ROOT_DIR, 'data/processed/wikitongues_normalized.json');

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
    id: undefined as string | undefined,
    rawIndex: undefined as number | undefined,
    start: undefined as number | undefined,
    end: undefined as number | undefined,
    json: false,
    help: false,
  };

  const positional: number[] = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--id') {
      options.id = args[++i];
    } else if (arg === '--raw') {
      options.rawIndex = parseInt(args[++i], 10);
    } else if (arg === '--json') {
      options.json = true;
    } else if (!isNaN(parseInt(arg, 10))) {
      positional.push(parseInt(arg, 10));
    }
  }

  if (positional.length === 1) {
    options.start = positional[0];
    options.end = positional[0] + 1;
  } else if (positional.length >= 2) {
    options.start = positional[0];
    options.end = positional[1];
  }

  return options;
}

function formatDate(dateStr: string): string {
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  }
  return dateStr;
}

function detectContentType(title: string, duration: number, description: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.startsWith('learn ') || lowerTitle.includes('mother language day')) {
    return 'language_lesson';
  }
  if (
    lowerTitle.includes('birthday party') ||
    lowerTitle.includes('live stream') ||
    lowerTitle.includes('grant recipients') ||
    lowerTitle.includes('accelerator q&a') ||
    lowerTitle.includes('updates,') ||
    lowerTitle.includes('toolkit')
  ) {
    return 'meta';
  }
  if (duration > 600 && lowerTitle.includes('fellows')) {
    return 'fellowship_doc';
  }
  return 'oral_history';
}

function main() {
  const options = parseArgs();

  if (options.help) {
    console.log(`
Raw Record Inspector & Linguistic Candidate Suggester

Usage:
  npx tsx pipeline/scripts/inspect_raw.ts [start] [end]
  npx tsx pipeline/scripts/inspect_raw.ts --id <video_id>
  npx tsx pipeline/scripts/inspect_raw.ts --raw <index>
`);
    return;
  }

  const rawRecords: RawRecord[] = [];
  const rawContent = fs.readFileSync(RAW_JSONL_PATH, 'utf8');
  for (const line of rawContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      rawRecords.push(JSON.parse(trimmed));
    } catch {
      // Ignore
    }
  }

  const normalizedRecords: VideoData[] = JSON.parse(fs.readFileSync(NORMALIZED_JSON_PATH, 'utf8'));
  const normIds = new Set(normalizedRecords.map((v) => v.id));

  // Compute pending records
  const pendingRecords = rawRecords.filter((r) => !normIds.has(r.video_id) && r.video_id !== '9Nl_ttQDYkQ');

  let targets: { record: RawRecord; pendingIndex?: number; rawIndex: number }[] = [];

  if (options.id) {
    const rawIdx = rawRecords.findIndex((r) => r.video_id === options.id);
    if (rawIdx === -1) {
      console.error(`Video ID "${options.id}" not found in raw dataset.`);
      process.exit(1);
    }
    const pendIdx = pendingRecords.findIndex((r) => r.video_id === options.id);
    targets.push({
      record: rawRecords[rawIdx],
      pendingIndex: pendIdx !== -1 ? pendIdx : undefined,
      rawIndex: rawIdx,
    });
  } else if (options.rawIndex !== undefined) {
    const r = rawRecords[options.rawIndex];
    if (!r) {
      console.error(`Raw index ${options.rawIndex} out of bounds (total raw: ${rawRecords.length}).`);
      process.exit(1);
    }
    targets.push({
      record: r,
      rawIndex: options.rawIndex,
    });
  } else {
    // Default: pending range
    const start = options.start ?? 0;
    const end = options.end ?? 1;

    if (start < 0 || start >= pendingRecords.length) {
      console.error(`Invalid start index ${start}. Pending total: ${pendingRecords.length}.`);
      process.exit(1);
    }
    const slice = pendingRecords.slice(start, Math.min(end, pendingRecords.length));
    targets = slice.map((record, i) => ({
      record,
      pendingIndex: start + i,
      rawIndex: rawRecords.findIndex((r) => r.video_id === record.video_id),
    }));
  }

  for (const { record, pendingIndex, rawIndex } of targets) {
    const candidates = findCandidates(record.title, record.description);
    const names = extractNamesFromTitle(record.title);
    const contentType = detectContentType(record.title, record.duration, record.description);
    const uploadDate = formatDate(record.upload_date);

    const primaryCandidate = candidates[0];

    const skeleton: any = {
      id: record.video_id,
      url: record.url,
      duration_seconds: record.duration,
      upload_date: uploadDate,
      license: 'ALL_RIGHTS_RESERVED',
      content_type: contentType,
      primary_language: {
        standards: {
          iso639_3: primaryCandidate?.iso639_3 || '???',
          glottocode: primaryCandidate?.glottocode || '???',
          bcp47: primaryCandidate?.bcp47 || '???',
        },
        speaker_claim: null,
        wikitongues_classification: primaryCandidate?.matchedLabel || names.language || '???',
        wikitongues_lineage: null,
        autonym: primaryCandidate?.autonym || primaryCandidate?.isoName || '???',
      },
      speakers: names.speaker
        ? [
            {
              name: names.speaker,
              role: 'native',
              origin: null,
            },
          ]
        : [],
      provenance: {
        country_code: null,
        country_name: null,
        recorded_by: null,
      },
      transcription: {
        has_subtitles: record.subtitles_available.length > 0,
        available_subtitles: record.subtitles_available,
        native_text: null,
        english_translation: null,
      },
      raw_metadata: {
        title: record.title,
        tags: record.tags,
      },
    };

    if (options.json) {
      console.log(JSON.stringify({ raw: record, candidates, skeleton }, null, 2));
      continue;
    }

    console.log(`\n${'═'.repeat(78)}`);
    const headerPrefix = pendingIndex !== undefined ? `[Pending #${pendingIndex} | Raw #${rawIndex}]` : `[Raw #${rawIndex}]`;
    console.log(`  ${headerPrefix} \x1b[1m${record.title}\x1b[0m`);
    console.log(`${'═'.repeat(78)}`);
    console.log(`  • ID          : \x1b[36m${record.video_id}\x1b[0m`);
    console.log(`  • URL         : ${record.url}`);
    console.log(`  • Upload Date : ${uploadDate}`);
    console.log(`  • Duration    : ${record.duration}s`);
    console.log(`  • Subtitles   : ${record.subtitles_available.length > 0 ? record.subtitles_available.join(', ') : 'none'}`);
    if (record.tags.length > 0) {
      console.log(`  • Tags        : ${record.tags.join(', ')}`);
    }

    console.log(`\n  ┌─ Description ─────────────────────────────────────────────────────────────┐`);
    const descLines = record.description.split('\n').filter((l) => l.trim().length > 0);
    for (const dl of descLines.slice(0, 4)) {
      console.log(`  │ ${dl.slice(0, 74)}`);
    }
    if (descLines.length > 4) {
      console.log(`  │ ... (${descLines.length - 4} more lines)`);
    }
    console.log(`  └───────────────────────────────────────────────────────────────────────────┘`);

    console.log(`\n  ┌─ Authoritative Linguistic Candidates (SIL / Glottolog / IANA) ───────────┐`);
    if (candidates.length === 0) {
      console.log(`  │ No direct match automatically found for title. Check description or conlang.`);
    } else {
      for (const c of candidates) {
        console.log(`  │ • Match: "\x1b[33m${c.matchedLabel}\x1b[0m"`);
        console.log(`  │   ISO 639-3  : \x1b[32m${c.iso639_3}\x1b[0m (${c.isoName})`);
        console.log(`  │   Glottocode : \x1b[32m${c.glottocode}\x1b[0m (${c.glottoName} - ${c.glottoLevel})`);
        console.log(`  │   BCP-47     : \x1b[32m${c.bcp47}\x1b[0m`);
      }
    }
    console.log(`  └───────────────────────────────────────────────────────────────────────────┘`);

    console.log(`\n  ┌─ Suggested JSON Skeleton ────────────────────────────────────────────────┐`);
    const formattedJson = JSON.stringify(skeleton, null, 2)
      .split('\n')
      .map((l) => `  │ ${l}`)
      .join('\n');
    console.log(formattedJson);
    console.log(`  └───────────────────────────────────────────────────────────────────────────┘\n`);
  }
}

main();
