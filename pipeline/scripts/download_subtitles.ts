/**
 * CLI: Download and process subtitles for Wikitongues recordings via yt-dlp.
 *
 * Usage:
 *   npx tsx pipeline/scripts/download_subtitles.ts [options]
 *
 * Options:
 *   --id <videoId>  Process only the specified video ID
 *   --limit <n>     Process up to <n> videos
 *   --lang <lang>   Subtitle language code to fetch (default: 'en')
 *   --all           Scan all videos in dataset, not just those with has_subtitles=true
 *   --dry-run       Preview downloads without saving to dataset files
 *   --help          Show help message
 */

import * as fs from 'fs';
import * as path from 'path';
import { downloadSubtitle } from '../lib/subtitles';
import { VideoData } from '../../src/types';

const ROOT_DIR = path.resolve(__dirname, '../..');
const JSON_PATH = path.join(ROOT_DIR, 'data/processed/wikitongues_normalized.json');
const JSONL_PATH = path.join(ROOT_DIR, 'data/processed/wikitongues_normalized.jsonl');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    id: undefined as string | undefined,
    limit: undefined as number | undefined,
    lang: 'en',
    all: false,
    dryRun: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--id') {
      options.id = args[++i];
    } else if (arg === '--limit') {
      const val = parseInt(args[++i], 10);
      if (!isNaN(val) && val > 0) {
        options.limit = val;
      }
    } else if (arg === '--lang') {
      options.lang = args[++i];
    } else if (arg === '--all') {
      options.all = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Wikitongues Subtitle Downloader & Ingestion Tool (yt-dlp)

Usage:
  npx tsx pipeline/scripts/download_subtitles.ts [options]

Options:
  --id <videoId>  Process a single video by its YouTube ID
  --limit <n>     Process at most <n> videos
  --lang <lang>   Language code to download (default: 'en')
  --all           Scan all videos, even if has_subtitles is false
  --dry-run       Preview without saving changes to disk
  --help, -h      Show this message
`);
}

async function main() {
  const options = parseArgs();
  if (options.help) {
    printHelp();
    return;
  }

  if (!fs.existsSync(JSON_PATH)) {
    console.error(`Dataset not found at: ${JSON_PATH}`);
    process.exit(1);
  }

  const rawJson = fs.readFileSync(JSON_PATH, 'utf8');
  const dataset: VideoData[] = JSON.parse(rawJson);

  console.log(`\n============================================================`);
  console.log(`  Wikitongues Subtitles Ingestion Pipeline (yt-dlp)`);
  console.log(`============================================================\n`);
  console.log(`Loaded dataset with ${dataset.length} records.`);

  let targetVideos: VideoData[] = [];

  if (options.id) {
    const found = dataset.find((v) => v.id === options.id);
    if (!found) {
      console.error(`Video ID "${options.id}" not found in dataset.`);
      process.exit(1);
    }
    targetVideos = [found];
  } else if (options.all) {
    targetVideos = dataset;
  } else {
    // By default, target videos that either have has_subtitles=true or have available_subtitles
    // and don't yet have the clean text populated for this language
    targetVideos = dataset.filter((v) => {
      const trans = v.transcription;
      if (!trans) return false;
      if (options.lang === 'en' && trans.english_translation) return false;
      return (
        trans.has_subtitles === true ||
        (trans.available_subtitles && trans.available_subtitles.length > 0)
      );
    });
  }

  if (options.limit && targetVideos.length > options.limit) {
    targetVideos = targetVideos.slice(0, options.limit);
  }

  console.log(`Targeting ${targetVideos.length} video(s) for subtitle extraction (lang: "${options.lang}").\n`);

  let updatedCount = 0;

  for (let idx = 0; idx < targetVideos.length; idx++) {
    const video = targetVideos[idx];
    console.log(`[${idx + 1}/${targetVideos.length}] Processing ${video.id} (${video.primary_language.wikitongues_classification})...`);

    const result = await downloadSubtitle(video.id, options.lang);

    if (result && result.cleanText) {
      console.log(`   ✓ Subtitle found (${result.cleanText.length} chars). First 80 chars: "${result.cleanText.slice(0, 80)}..."`);

      if (!video.transcription) {
        video.transcription = {
          has_subtitles: true,
          available_subtitles: [options.lang],
          native_text: null,
          english_translation: null,
        };
      }

      video.transcription.has_subtitles = true;
      video.transcription.available_subtitles = video.transcription.available_subtitles || [];
      if (!video.transcription.available_subtitles.includes(options.lang)) {
        video.transcription.available_subtitles.push(options.lang);
      }

      if (options.lang === 'en') {
        video.transcription.english_translation = result.cleanText;
      } else {
        const iso = video.primary_language.standards.iso639_3;
        const bcp47 = video.primary_language.standards.bcp47;
        if (options.lang === iso || options.lang === bcp47 || bcp47.startsWith(options.lang)) {
          video.transcription.native_text = result.cleanText;
        }
      }

      updatedCount++;
    } else {
      console.log(`   - No subtitles available for lang "${options.lang}".`);
    }
  }

  console.log(`\nProcessed ${targetVideos.length} videos. Updated subtitles for ${updatedCount} video(s).`);

  if (updatedCount > 0 && !options.dryRun) {
    console.log(`Saving changes to:\n  - ${JSON_PATH}\n  - ${JSONL_PATH}`);
    fs.writeFileSync(JSON_PATH, JSON.stringify(dataset, null, 2) + '\n', 'utf8');
    fs.writeFileSync(JSONL_PATH, dataset.map((v) => JSON.stringify(v)).join('\n') + '\n', 'utf8');
    console.log(`✓ Dataset successfully updated.`);
  } else if (options.dryRun) {
    console.log(`[DRY RUN] No files were modified.`);
  }

  console.log(`\nFinished!\n`);
}

main().catch((err) => {
  console.error('\nError running download_subtitles:', err.message);
  process.exit(1);
});
