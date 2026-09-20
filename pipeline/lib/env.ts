import * as fs from 'fs';
import * as path from 'path';

let envLoaded = false;

/**
 * Loads environment variables from `.env` at the project root.
 * Uses native process.loadEnvFile if supported (Node 20.12+),
 * with a manual regex-based fallback to guarantee compatibility.
 */
export function loadEnv(): void {
  if (envLoaded) return;
  envLoaded = true;

  const rootDir = path.resolve(__dirname, '../..');
  const envPath = path.join(rootDir, '.env');

  if (!fs.existsSync(envPath)) {
    return;
  }

  // Use native Node process.loadEnvFile if available
  if (typeof (process as any).loadEnvFile === 'function') {
    try {
      (process as any).loadEnvFile(envPath);
      return;
    } catch {
      // Fallback to manual parsing if process.loadEnvFile throws
    }
  }

  // Fallback parsing
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();

    // Strip surrounding quotes
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

/**
 * Gets the YouTube API key from process.env or .env.
 */
export function getYouTubeApiKey(): string | undefined {
  loadEnv();
  return process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_DATA_API_KEY;
}

/**
 * Gets the YouTube API key or throws a descriptive error.
 */
export function requireYouTubeApiKey(): string {
  const key = getYouTubeApiKey();
  if (!key) {
    throw new Error(
      'YOUTUBE_API_KEY is required. Please set it in your environment or in a .env file at the project root.'
    );
  }
  return key;
}
