/**
 * migrate_v020.ts — One-shot migration of the persisted dataset from the v0.1 language block
 * (`iso639_3, bcp47, name, glottocode, autonym, dialect`) to the v0.2.0 tri-ontological block
 * (`standards: {iso639_3, glottocode, bcp47}, speaker_claim, wikitongues_classification,
 * wikitongues_lineage, autonym`). See CLASSIFICATION_RULES.md.
 *
 * Usage:
 *   npx tsx pipeline/scripts/migrate_v020.ts
 *
 * Rewrites data/processed/wikitongues_normalized.{json,jsonl} and writes a review report to
 * data/processed/migration_v020_report.md. Every non-mechanical decision is listed in the report.
 */

import * as fs from 'fs';
import * as path from 'path';
import { normalizeText } from '../../src/resolver';
import {
  parseIsoTable,
  parseGlottologCsv,
  parseIanaRegistry,
  glottologIsoCode,
  GlottologRow,
  IanaRegistry,
} from '../../shared/reference_parsers';
import { Iso639_3Entry, LanguageData, VideoData } from '../../src/types';

// ---------------------------------------------------------------------------
// v0.1 shapes (kept local: this script is the only consumer)
// ---------------------------------------------------------------------------

interface OldLanguage {
  iso639_3: string;
  bcp47: string;
  name: string;
  glottocode?: string | null;
  autonym?: string | null;
  dialect?: string | null;
}

type OldVideo = Omit<VideoData, 'primary_language' | 'additional_languages'> & {
  primary_language: OldLanguage;
  additional_languages: OldLanguage[];
};

const ROOT = path.resolve(__dirname, '../..');
const JSON_PATH = path.join(ROOT, 'data/processed/wikitongues_normalized.json');
const JSONL_PATH = path.join(ROOT, 'data/processed/wikitongues_normalized.jsonl');
const REPORT_PATH = path.join(ROOT, 'data/processed/migration_v020_report.md');

/** Records that cannot satisfy §3.1.1 (all three standards mandatory) and are dropped. */
const DROPPED_IDS = new Set(['9Nl_ttQDYkQ']); // Atlaans conlang: ISO `mis`, no Glottocode

// ---------------------------------------------------------------------------
// Title parsing — wikitongues_classification & wikitongues_lineage
// ---------------------------------------------------------------------------

const LABEL_RULES: RegExp[] = [
  /(?:speaking|signing|singing in|speaks|shares (?:his|her|their) language,?)\s+(.+)$/i,
  /\b(?:a song|a poem|a voice|a prayer) in (?:the )?(.+?)(?: language)?$/i,
  /^The ([A-ZÀ-Ž][^,]+?) languages?\b/,
  /^Listen to (?:the )?([A-ZÀ-Ž][^,]+?)(?: language\b|,|$)/,
  /^(.+?),? casually spoken/i,
];
const MAX_LABEL_WORDS = 5;

const LIST_SPLIT = /\s*,\s*(?:and\s+)?|\s+and\s+|\s*&\s*/i;

/** Segment-level noise that is never a lineage: program names, sentinels, calls to action. */
const NOISE_SEGMENT = /wikitongues|fellowship|league of women voters|lingq|census|owu festival/i;

const EXTRA_PLACES = [
  'china', 'yunnan', 'iraq', 'nigeria', 'benin', 'guinea', 'south africa', 'indonesia',
  'sri lanka', 'kenya', 'tanzania', 'iran', 'britain', 'france', 'romance languages',
];

function cleanLabel(raw: string): string {
  let s = raw.trim();
  s = s.replace(/\s*\(.*?\)?$/g, (m) => (m.includes(')') ? m : '')); // drop unclosed trailing paren
  s = s.split(':')[0];
  s = s.split(/,\s*also known as/i)[0];
  s = s.split(/\s+in\s+[A-Z]/)[0];
  s = s.replace(/^the\s+/i, '').replace(/(?<!sign)\s+(?:languages?|dialect)$/i, '');
  s = s.replace(/[\s.!?,]+$/g, '').trim();
  return s;
}

function extractLabelSegments(title: string): { label: string | null; usedSegment: number; segments: string[] } {
  const stripped = title.replace(/^WIKITONGUES:\s*/i, '');
  const segments = stripped.split('|').map((s) => s.trim()).filter(Boolean);
  for (const rule of LABEL_RULES) {
    for (let i = 0; i < segments.length; i++) {
      const m = segments[i].match(rule);
      if (m && m[1]) {
        const label = cleanLabel(m[1]);
        if (label && label.split(LIST_SPLIT).every((part) => part.split(/\s+/).length <= MAX_LABEL_WORDS)) return { label, usedSegment: i, segments };
      }
    }
  }
  return { label: null, usedSegment: -1, segments };
}

function buildLineage(
  segments: string[],
  usedSegment: number,
  countryNames: Set<string>
): string | null {
  const parts: string[] = [];
  for (let i = 0; i < segments.length; i++) {
    if (i === usedSegment) continue;
    const seg = segments[i];
    if (NOISE_SEGMENT.test(seg)) continue;
    if (LABEL_RULES.some((r) => r.test(seg))) continue; // another language segment, not lineage
    const cleaned = seg.replace(/\s+languages?$/i, '').trim();
    const norm = normalizeText(cleaned);
    const lastComma = norm.split(',').pop()!.trim();
    if (countryNames.has(norm) || countryNames.has(lastComma)) continue;
    if (cleaned) parts.push(cleaned);
  }
  return parts.length ? parts.join(' ') : null;
}

const GENERIC_TOKENS = new Set(['language', 'languages', 'the', 'creole', 'sign']);

function tokens(s: string): string[] {
  return normalizeText(s)
    .replace(/[^a-z0-9' ]+/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !GENERIC_TOKENS.has(t));
}

function matchScore(candidate: string, oldName: string): number {
  const a = normalizeText(candidate);
  const b = normalizeText(oldName);
  if (!a || !b) return 0;
  if (a === b) return 3;
  if (a.includes(b) || b.includes(a)) return 2;
  const ta = new Set(tokens(a));
  return tokens(b).some((t) => ta.has(t)) ? 1 : 0;
}

// ---------------------------------------------------------------------------
// BCP-47 cleanup
// ---------------------------------------------------------------------------

interface BcpDecision {
  before: string;
  after: string;
  notes: string[];
}

function cleanBcp47(
  tag: string,
  iso: string,
  isoEntry: Iso639_3Entry,
  label: string,
  glottoName: string,
  iana: IanaRegistry
): BcpDecision {
  const notes: string[] = [];
  const parts = tag.toLowerCase().split('-');
  const expectedPrimary = isoEntry.part1 ?? iso;
  let primary = parts[0];
  if (primary !== expectedPrimary) {
    notes.push(`primary subtag '${primary}' → '${expectedPrimary}' (Part1 ?? iso)`);
    primary = expectedPrimary;
  }

  let script: string | undefined;
  let region: string | undefined;
  const variants: string[] = [];
  for (const sub of parts.slice(1)) {
    if (sub === 'x') {
      notes.push('private-use subtags dropped');
      break;
    }
    if (iana.script.has(sub) && !script) script = sub;
    else if (iana.region.has(sub) && !region) region = sub;
    else if (iana.variant.has(sub)) variants.push(sub);
    else notes.push(`subtag '${sub}' not in IANA registry, dropped`);
  }

  const evidence = normalizeText(`${label} ${glottoName}`);
  const bareTokens = new Set(tokens(`${isoEntry.name} ${isoEntry.invertedName ?? ''}`));
  // Tokens shared with the bare ISO name ("English" in "Scottish Standard English") prove nothing.
  const evidenceTokens = new Set(tokens(evidence).filter((t) => !bareTokens.has(t)));

  // Script: never a Suppress-Script; keep otherwise (only gu-Arab in the dataset).
  const lang = iana.language.get(primary);
  if (script && lang?.suppressScript && lang.suppressScript.toLowerCase() === script) {
    notes.push(`script '${script}' is Suppress-Script for '${primary}', dropped`);
    script = undefined;
  }

  // Variants: keep only if the variant's description is attested by the label / Glottolog name.
  const keptVariants = variants.filter((v) => {
    const desc = iana.variant.get(v)!.description;
    const attested = tokens(desc).some((t) => evidenceTokens.has(t)) || evidence.includes(v);
    if (!attested) notes.push(`variant '${v}' (${desc}) not named in label, dropped`);
    return attested;
  });

  // Region: keep only if the label names a variety beyond the bare language (§4.3.2).
  if (region) {
    const bareNames = [isoEntry.name, isoEntry.invertedName ?? ''].map(normalizeText);
    const labelNorm = normalizeText(label);
    const labelIsBare = bareNames.some((n) => n && (n === labelNorm || n.includes(labelNorm)));
    if (labelIsBare) {
      notes.push(`region '${region}' dropped: label '${label}' is the bare language name`);
      region = undefined;
    } else if (keptVariants.length) {
      notes.push(`region '${region}' dropped in favour of variant '${keptVariants.join('-')}'`);
      region = undefined;
    } else {
      notes.push(`region '${region}' KEPT (label '${label}') — review`);
    }
  }

  const after = [primary, script, region, ...keptVariants].filter(Boolean).join('-');
  const normalizedAfter = after
    .split('-')
    .map((s, i) => (i === 0 ? s : s.length === 2 ? s.toUpperCase() : s.length === 4 && iana.script.has(s) ? s[0].toUpperCase() + s.slice(1) : s))
    .join('-');
  return { before: tag, after: normalizedAfter, notes };
}

// ---------------------------------------------------------------------------
// Glottolog demotion (§4.2 Attested-Specificity)
// ---------------------------------------------------------------------------

const GLOTTO_GENERIC = new Set(['standard', 'nuclear', 'proper', 'modern', 'classical']);

let childrenIndex: Map<string, GlottologRow[]> | null = null;
function dialectChildren(parent: string, glottolog: Map<string, GlottologRow>): GlottologRow[] {
  if (!childrenIndex) {
    childrenIndex = new Map();
    for (const row of glottolog.values()) {
      if (row.level !== 'dialect' || !row.parentLanguageId) continue;
      if (!childrenIndex.has(row.parentLanguageId)) childrenIndex.set(row.parentLanguageId, []);
      childrenIndex.get(row.parentLanguageId)!.push(row);
    }
  }
  return childrenIndex.get(parent) ?? [];
}

function attestedGlottocode(
  code: string,
  iso: string,
  evidenceText: string,
  label: string,
  glottolog: Map<string, GlottologRow>
): { code: string; note?: string } {
  const row = glottolog.get(code);
  if (!row) return { code, note: `glottocode '${code}' not in Glottolog table — review` };
  if (row.level === 'language') {
    // Promotion: the Wikitongues label names a variety that Glottolog models as a dialect child.
    const labelTokens = new Set(tokens(label));
    const languageTokens = new Set(tokens(row.name));
    // Tokens in the label beyond the language's own name — the only ones that can attest a variety.
    const distinctive = new Set([...labelTokens].filter((t) => !languageTokens.has(t)));
    let matches = dialectChildren(code, glottolog).filter((child) => {
      const nameTokens = tokens(child.name).filter((t) => !GLOTTO_GENERIC.has(t));
      return (
        nameTokens.length > 0 &&
        nameTokens.every((t) => labelTokens.has(t)) &&
        nameTokens.some((t) => distinctive.has(t))
      );
    });
    if (matches.length > 1) {
      const exact = matches.filter((m) => normalizeText(m.name) === normalizeText(label));
      if (exact.length === 1) matches = exact;
    }
    if (matches.length === 1) {
      return { code: matches[0].code, note: `language '${row.name}' → promoted to dialect ${matches[0].code} ('${matches[0].name}' named in label '${label}')` };
    }
    if (matches.length > 1) {
      return { code, note: `label '${label}' matches several dialect children (${matches.map((m) => `${m.code} ${m.name}`).join(', ')}) — kept language node, review` };
    }
    return { code };
  }
  if (row.level !== 'dialect') return { code };

  const evidence = new Set(tokens(evidenceText));
  const nameTokens = tokens(row.name).filter((t) => !GLOTTO_GENERIC.has(t));
  const attested = nameTokens.length > 0 && nameTokens.every((t) => evidence.has(t));
  if (attested) return { code, note: `dialect '${row.name}' kept (named in title)` };

  const parent = row.parentLanguageId ? glottolog.get(row.parentLanguageId) : undefined;
  if (!parent) return { code, note: `dialect '${row.name}' has no parent — review` };
  const parentIso = glottologIsoCode(parent, glottolog);
  if (parentIso !== iso) {
    return {
      code,
      note: `dialect '${row.name}' not named in title but parent ${parent.code} maps to '${parentIso}' ≠ '${iso}' — kept, review`,
    };
  }
  return { code: parent.code, note: `dialect '${row.name}' not named in title → demoted to ${parent.code} (${parent.name})` };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const iso = parseIsoTable();
  const glottolog = parseGlottologCsv();
  const iana = parseIanaRegistry();
  const old: OldVideo[] = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));

  const countryNames = new Set<string>(EXTRA_PLACES.map(normalizeText));
  for (const v of old) {
    const n = v.provenance?.country_name;
    if (n) countryNames.add(normalizeText(n));
  }

  const report = {
    dropped: [] as string[],
    labelFallback: [] as string[],
    labelMatched: [] as string[],
    glotto: [] as string[],
    bcp47: [] as string[],
    autonym: [] as string[],
    lineage: [] as string[],
  };

  const migrated: VideoData[] = [];

  for (const v of old) {
    if (DROPPED_IDS.has(v.id)) {
      report.dropped.push(`- \`${v.id}\` — ${v.raw_metadata?.title ?? ''} (${v.primary_language.name})`);
      continue;
    }
    const title = v.raw_metadata?.title ?? '';
    const tags = (v.raw_metadata?.tags ?? []).join(' ');
    const { label, usedSegment, segments } = extractLabelSegments(title);
    const lineage = label ? buildLineage(segments, usedSegment, countryNames) : null;
    if (lineage) report.lineage.push(`- \`${v.id}\` \`${lineage}\` ← ${title}`);

    const blocks = [v.primary_language, ...(v.additional_languages ?? [])];
    const candidates = label ? label.split(LIST_SPLIT).map(cleanLabel).filter(Boolean) : [];

    // Assign title candidates to language blocks: exact/fuzzy matches first (each candidate used
    // once), then the single leftover candidate to the single leftover block, then the primary
    // block takes any leftover. Blocks with no candidate keep the old name and are reported.
    const assigned: (string | null)[] = blocks.map(() => null);
    {
      const usedCand = new Set<number>();
      const pairs: { b: number; c: number; s: number }[] = [];
      blocks.forEach((b, bi) => candidates.forEach((c, ci) => pairs.push({ b: bi, c: ci, s: matchScore(c, b.name) })));
      pairs.sort((x, y) => y.s - x.s);
      for (const p of pairs) {
        if (p.s === 0 || assigned[p.b] !== null || usedCand.has(p.c)) continue;
        assigned[p.b] = candidates[p.c];
        usedCand.add(p.c);
        if (p.s < 3) report.labelMatched.push(`- \`${v.id}\` [${p.b}] old \`${blocks[p.b].name}\` → \`${candidates[p.c]}\` (score ${p.s}) ← ${title}`);
      }
      const leftoverCands = candidates.map((_, i) => i).filter((i) => !usedCand.has(i));
      const leftoverBlocks = blocks.map((_, i) => i).filter((i) => assigned[i] === null);
      if (leftoverCands.length === 1 && leftoverBlocks.length === 1) {
        assigned[leftoverBlocks[0]] = candidates[leftoverCands[0]];
        report.labelMatched.push(`- \`${v.id}\` [${leftoverBlocks[0]}] old \`${blocks[leftoverBlocks[0]].name}\` → \`${candidates[leftoverCands[0]]}\` (leftover) ← ${title}`);
      } else if (leftoverCands.length && assigned[0] === null) {
        assigned[0] = candidates[leftoverCands[0]];
        report.labelMatched.push(`- \`${v.id}\` [0] old \`${blocks[0].name}\` → \`${candidates[leftoverCands[0]]}\` (first leftover of ${JSON.stringify(candidates)}) ← ${title}`);
      }
    }

    const converted: LanguageData[] = blocks.map((b, idx) => {
      // 1. wikitongues_classification
      const classification = assigned[idx] ?? b.name;
      if (assigned[idx] === null) {
        report.labelFallback.push(`- \`${v.id}\` [${idx}] ${candidates.length ? `no candidate in ${JSON.stringify(candidates)} left for` : 'no language pattern in title, kept'} old \`${b.name}\` ← ${title}`);
      }

      // 2. glottocode
      const isoCode = b.iso639_3.toLowerCase();
      const isoEntry = iso.get(isoCode);
      if (!isoEntry) throw new Error(`${v.id}: unknown ISO code ${isoCode}`);
      if (!b.glottocode) throw new Error(`${v.id}: missing glottocode for ${isoCode}`);
      const evidenceText = `${title} ${tags} ${classification}`;
      const g = attestedGlottocode(b.glottocode, isoCode, evidenceText, classification, glottolog);
      if (g.note) report.glotto.push(`- \`${v.id}\` [${idx}] ${b.glottocode} — ${g.note}`);
      const glottoName = glottolog.get(g.code)?.name ?? '';

      // 3. bcp47
      const bcp = cleanBcp47(b.bcp47, isoCode, isoEntry, classification, glottoName, iana);
      if (bcp.notes.length) {
        report.bcp47.push(`- \`${v.id}\` [${idx}] \`${bcp.before}\` → \`${bcp.after}\`\n  - ${bcp.notes.join('\n  - ')}`);
      }

      // 4. autonym
      let autonym = b.autonym ?? '';
      if (!autonym) {
        autonym = b.name;
        report.autonym.push(`- \`${v.id}\` [${idx}] autonym missing, used old name \`${b.name}\``);
      }

      return {
        standards: { iso639_3: isoCode, glottocode: g.code, bcp47: bcp.after },
        speaker_claim: null,
        wikitongues_classification: classification,
        wikitongues_lineage: lineage,
        autonym,
      };
    });

    const { primary_language: _p, additional_languages: _a, ...rest } = v;
    migrated.push({
      id: rest.id,
      url: rest.url,
      duration_seconds: rest.duration_seconds,
      upload_date: rest.upload_date,
      license: rest.license,
      content_type: rest.content_type,
      primary_language: converted[0],
      additional_languages: converted.slice(1),
      speakers: rest.speakers,
      provenance: rest.provenance,
      transcription: rest.transcription,
      raw_metadata: rest.raw_metadata,
    });
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(migrated, null, 2) + '\n');
  fs.writeFileSync(JSONL_PATH, migrated.map((r) => JSON.stringify(r)).join('\n') + '\n');

  const section = (title: string, lines: string[]) =>
    `## ${title} (${lines.length})\n\n${lines.length ? lines.join('\n') : '_none_'}\n\n`;
  const md =
    `# Migration v0.2.0 — Review Report\n\n` +
    `Generated ${new Date().toISOString()} · ${old.length} → ${migrated.length} records\n\n` +
    section('Dropped records', report.dropped) +
    section('Classification: fallback to old name (REVIEW)', report.labelFallback) +
    section('Classification: fuzzy match (review)', report.labelMatched) +
    section('Glottolog dialect decisions', report.glotto) +
    section('BCP-47 changes', report.bcp47) +
    section('Autonym fallbacks', report.autonym) +
    section('Lineage extracted', report.lineage);
  fs.writeFileSync(REPORT_PATH, md);

  console.log(`Migrated ${migrated.length} records. Report: ${path.relative(ROOT, REPORT_PATH)}`);
  console.log(`  classification fallbacks: ${report.labelFallback.length}, fuzzy: ${report.labelMatched.length}`);
  console.log(`  glottolog notes: ${report.glotto.length}, bcp47 changes: ${report.bcp47.length}`);
}

main();
