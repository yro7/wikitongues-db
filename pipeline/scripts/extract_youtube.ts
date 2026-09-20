/**
 * CLI: Extract metadata from Wikitongues YouTube channel using YouTube Data API v3.
 *
 * Usage:
 *   npx tsx pipeline/scripts/extract_youtube.ts [options]
 *
 * Options:
 *   --limit <n>     Only fetch/process up to <n> video IDs
 *   --all           Refetch all videos instead of only newly discovered ones
 *   --dry-run       Do not append to data/raw/wikitongues_youtube_raw.jsonl
 *   --help          Show help message
 */

import * as fs from 'fs';
import * as path from 'path';
import { requireYouTubeApiKey } from '../lib/env';
import {
  WIKITONGUES_CHANNEL_ID,
  getUploadsPlaylistId,
  fetchPlaylistVideoIds,
  fetchVideosDetails,
  RawVideoRecord,
} from '../lib/youtube_api';

const ROOT_DIR = path.resolve(__dirname, '../..');
const RAW_JSONL_PATH = path.join(ROOT_DIR, 'data/raw/wikitongues_youtube_raw.jsonl');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    limit: undefined as number | undefined,
    all: false,
    dryRun: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--all') {
      options.all = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--limit') {
      const val = parseInt(args[++i], 10);
      if (!isNaN(val) && val > 0) {
        options.limit = val;
      }
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Wikitongues YouTube Metadata Extractor (YouTube Data API v3)

Usage:
  npx tsx pipeline/scripts/extract_youtube.ts [options]

Options:
  --limit <n>     Process up to <n> videos
  --all           Refresh all videos instead of only newly discovered ones
  --dry-run       Preview discovery without writing to data/raw/
  --help, -h      Show this message
`);
}

function loadExistingVideoIds(): Set<string> {
  if (!fs.existsSync(RAW_JSONL_PATH)) {
    return new Set();
  }

  const ids = new Set<string>();
  const content = fs.readFileSync(RAW_JSONL_PATH, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.video_id) {
        ids.add(parsed.video_id);
      }
    } catch {
      // Ignore corrupted line
    }
  }
  return ids;
}

async function main() {
  const options = parseArgs();
  if (options.help) {
    printHelp();
    return;
  }

  const apiKey = requireYouTubeApiKey();

  console.log(`\n============================================================`);
  console.log(`  Wikitongues Channel Ingestion Pipeline (YouTube Data API v3)`);
  console.log(`============================================================\n`);

  console.log(`1. Connecting to YouTube Data API v3...`);
  const uploadsPlaylistId = await getUploadsPlaylistId(WIKITONGUES_CHANNEL_ID, apiKey);
  console.log(`   Found Uploads playlist: ${uploadsPlaylistId}`);

  console.log(`\n2. Crawling channel videos list...`);
  const allVideoIds = await fetchPlaylistVideoIds(uploadsPlaylistId, apiKey, {
    limit: options.limit,
    onPageFetched: (count, total) => {
      process.stdout.write(`   Discovered ${count} videos (total estimated: ${total || 'unknown'})...\r`);
    },
  });
  console.log(`\n   Discovered ${allVideoIds.length} total videos on channel.`);

  const existingIds = loadExistingVideoIds();
  console.log(`   Existing records in raw dataset: ${existingIds.size}`);

  const pendingIds = options.all
    ? allVideoIds
    : allVideoIds.filter((id) => !existingIds.has(id));

  console.log(`   Videos to fetch details for: ${pendingIds.length}`);

  if (pendingIds.length === 0) {
    console.log(`\nAll videos are already cached in ${RAW_JSONL_PATH}. Nothing to do.`);
    return;
  }

  if (options.dryRun) {
    console.log(`\n[DRY RUN] Would fetch and append ${pendingIds.length} video records.`);
    return;
  }

  console.log(`\n3. Fetching detailed video metadata (batches of 50)...`);
  const records = await fetchVideosDetails(pendingIds, apiKey, (processed, total) => {
    process.stdout.write(`   Fetched ${processed}/${total} video details...\r`);
  });
  console.log(`\n   Successfully fetched ${records.length} records.`);

  console.log(`\n4. Appending to ${RAW_JSONL_PATH}...`);
  const lines = records.map((r) => JSON.stringify(r)).join('\n') + '\n';
  fs.appendFileSync(RAW_JSONL_PATH, lines, 'utf8');

  console.log(`\nDone! Appended ${records.length} newly ingested video records.\n`);
}

main().catch((err) => {
  console.error('\nError running extract_youtube:', err.message);
  process.exit(1);
});
