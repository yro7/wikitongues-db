/**
 * inspect_slice.ts — Display key fields for a slice [a, b] of the dataset.
 *
 * Usage:
 *   npx tsx inspect_slice.ts <a> <b>
 *
 * Example:
 *   npx tsx inspect_slice.ts 0 5     → shows records 0..4
 *   npx tsx inspect_slice.ts 100 103 → shows records 100..102
 */

import data from "../../data/processed/wikitongues_normalized.json";

const a = parseInt(process.argv[2], 10);
const b = parseInt(process.argv[3], 10);

if (isNaN(a) || isNaN(b)) {
  console.error("Usage: npx tsx inspect_slice.ts <a> <b>");
  console.error(`  Dataset size: ${data.length} records (indices 0..${data.length - 1})`);
  process.exit(1);
}

if (a < 0 || b > data.length || a >= b) {
  console.error(`Invalid range [${a}, ${b}). Dataset has ${data.length} records (indices 0..${data.length - 1}).`);
  process.exit(1);
}

const slice = data.slice(a, b);

for (let i = 0; i < slice.length; i++) {
  const d = slice[i];
  const idx = a + i;

  const pl = d.primary_language;
  const lines: [string, string | null | undefined][] = [
    ["Title", d.raw_metadata?.title ?? null],
    ["Primary: iso 639-3", pl.standards.iso639_3],
    ["Primary: glottocode", pl.standards.glottocode],
    ["Primary: bcp47", pl.standards.bcp47],
    ["Primary: speaker_claim", pl.speaker_claim],
    ["Primary: wikitongues_classification", pl.wikitongues_classification],
    ["Primary: wikitongues_lineage", pl.wikitongues_lineage],
    ["Primary: autonym", pl.autonym],
  ];
  for (let j = 0; j < d.additional_languages.length; j++) {
    const al = d.additional_languages[j];
    lines.push([`Additional[${j}]: standards`, `${al.standards.iso639_3} / ${al.standards.glottocode} / ${al.standards.bcp47}`]);
    lines.push([`Additional[${j}]: classification`, al.wikitongues_classification]);
  }

  console.log(`\n${"═".repeat(72)}`);
  console.log(`  [${idx}] ${d.id}`);
  console.log(`${"═".repeat(72)}`);

  for (const [label, value] of lines) {
    const display = value === null || value === undefined ? "\x1b[2mnull\x1b[0m" : value;
    console.log(`  ${label.padEnd(38)} : ${display}`);
  }
}

console.log(`\n--- Displayed ${slice.length} record(s) [${a}..${b - 1}] out of ${data.length} total ---`);
