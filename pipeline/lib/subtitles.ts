/**
 * Subtitles Downloader using yt-dlp
 *
 * Exclusively responsible for subtitle discovery and fetching.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { parseVttToCleanText } from './vtt_parser';

const execFileAsync = promisify(execFile);

const ROOT_DIR = path.resolve(__dirname, '../..');
const DEFAULT_SUBTITLES_DIR = path.join(ROOT_DIR, 'data/raw/subtitles');

/**
 * Finds the yt-dlp binary (checks local .venv first, then PATH).
 */
export function findYtDlpBinary(): string {
  const venvPath = path.join(ROOT_DIR, '.venv/bin/yt-dlp');
  if (fs.existsSync(venvPath)) {
    return venvPath;
  }
  return 'yt-dlp';
}

export interface AvailableSubtitles {
  manual: string[];
  automatic: string[];
}

/**
 * Discovers available manual subtitles and automatic captions for a video.
 */
export async function fetchAvailableSubtitles(videoId: string): Promise<AvailableSubtitles> {
  const ytDlp = findYtDlpBinary();
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    const { stdout } = await execFileAsync(
      ytDlp,
      ['--js-runtimes', 'node:node', '--list-subs', '--skip-download', url],
      { timeout: 30000 }
    );

    const manual: string[] = [];
    const automatic: string[] = [];

    let currentSection: 'none' | 'auto' | 'manual' = 'none';

    for (const line of stdout.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('Available automatic captions for')) {
        currentSection = 'auto';
        continue;
      } else if (trimmed.startsWith('Available subtitles for')) {
        currentSection = 'manual';
        continue;
      }

      if (trimmed.startsWith('Language') || !trimmed) {
        continue;
      }

      // First column is the language code
      const parts = trimmed.split(/\s+/);
      const code = parts[0];
      if (code) {
        if (currentSection === 'manual' && !manual.includes(code)) {
          manual.push(code);
        } else if (currentSection === 'auto' && !automatic.includes(code)) {
          automatic.push(code);
        }
      }
    }

    return { manual, automatic };
  } catch (err: any) {
    throw new Error(`Failed to list subtitles for ${videoId}: ${err.message}`);
  }
}

export interface DownloadSubtitleResult {
  filePath: string;
  lang: string;
  cleanText: string;
}

/**
 * Downloads a subtitle track in VTT format and cleans it.
 */
export async function downloadSubtitle(
  videoId: string,
  lang: string = 'en',
  outputDir: string = DEFAULT_SUBTITLES_DIR
): Promise<DownloadSubtitleResult | null> {
  const ytDlp = findYtDlpBinary();
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const expectedVtt = path.join(outputDir, `${videoId}.${lang}.vtt`);

  // Check cache: if file already downloaded, read and return directly
  if (fs.existsSync(expectedVtt)) {
    const rawContent = fs.readFileSync(expectedVtt, 'utf8');
    const cleanText = parseVttToCleanText(rawContent);
    return {
      filePath: expectedVtt,
      lang,
      cleanText,
    };
  }

  try {
    const outputTemplate = path.join(outputDir, '%(id)s.%(ext)s');
    await execFileAsync(
      ytDlp,
      [
        '--js-runtimes',
        'node:node',
        '--skip-download',
        '--write-sub',
        '--sub-lang',
        lang,
        '--convert-subs',
        'vtt',
        '-o',
        outputTemplate,
        url,
      ],
      { timeout: 60000 }
    );

    if (fs.existsSync(expectedVtt)) {
      const rawContent = fs.readFileSync(expectedVtt, 'utf8');
      const cleanText = parseVttToCleanText(rawContent);
      return {
        filePath: expectedVtt,
        lang,
        cleanText,
      };
    }

    return null;
  } catch (err: any) {
    // If subtitle track was not found or download failed
    return null;
  }
}
