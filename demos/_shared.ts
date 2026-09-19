/**
 * Helpers shared by the demo scripts. Not part of the package.
 */

import { Language, Video } from '../src';

export function heading(title: string): void {
  console.log(`\n${'─'.repeat(72)}\n  ${title}\n${'─'.repeat(72)}`);
}

export function standards(lang: Language): string {
  return `${lang.iso639_3} / ${lang.glottocode} / ${lang.bcp47}`;
}

export function line(video: Video): string {
  const title = video.title.replace(/^WIKITONGUES:\s*/, '').replace(/\s*\|.*$/, '');
  return `[${standards(video.primaryLanguage).padEnd(30)}] ${video.primaryLanguage.wikitonguesClassification.padEnd(26)} ${title}`;
}

export function printVideos(videos: Video[], max = 8): void {
  for (const v of videos.slice(0, max)) console.log('  ' + line(v));
  if (videos.length > max) console.log(`  … ${videos.length - max} more`);
}
