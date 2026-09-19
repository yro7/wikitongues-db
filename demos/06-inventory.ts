/**
 * Demo 6 — Inventories: where the three standards disagree.
 *
 *   npx tsx demos/06-inventory.ts
 */

import { WikitonguesDB } from '../src';
import { heading } from './_shared';

const db = new WikitonguesDB();
const languages = db.languages();

heading('Top 10 languages by number of recordings');
for (const l of languages.slice(0, 10)) {
  console.log(`  ${l.iso639_3}  ${l.iso_name.padEnd(22)} ${String(l.video_count).padStart(3)} videos  ${l.countries.join(',')}`);
}

heading('ISO codes that map to several Glottolog nodes (SIL lumps, Glottolog splits)');
for (const l of languages.filter((l) => l.glottocodes.length > 1)) {
  console.log(`  ${l.iso639_3}  ${l.iso_name.padEnd(22)} glottolog: ${l.glottolog_names.join(' | ')}`);
}

heading('ISO codes that carry several BCP 47 tags');
for (const l of languages.filter((l) => l.bcp47_tags.length > 1)) {
  console.log(`  ${l.iso639_3}  ${l.iso_name.padEnd(22)} ${l.bcp47_tags.join('  ')}`);
}

heading("Wikitongues labels that differ from SIL's reference name");
let shown = 0;
for (const l of languages) {
  const others = l.wikitongues_classifications.filter((c) => c.toLowerCase() !== l.iso_name.toLowerCase());
  if (others.length && shown++ < 15) {
    console.log(`  ${l.iso639_3}  SIL: ${l.iso_name.padEnd(24)} Wikitongues: ${others.join(', ')}`);
  }
}

heading('Countries with the most distinct languages');
for (const c of db.countries().sort((a, b) => b.language_count - a.language_count).slice(0, 8)) {
  console.log(`  ${(c.country_code ?? '??').padEnd(4)} ${c.country_name.padEnd(20)} ${c.language_count} languages, ${c.video_count} videos`);
}
