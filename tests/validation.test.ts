/**
 * Strict Semantic and Linguistic Validation Test Suite for Wikitongues Database (v0.2.0 schema).
 * Validates the entire dataset against the official SIL ISO 639-3 table, Glottolog, the IANA
 * Language Subtag Registry and the raw YouTube metadata, following CLASSIFICATION_RULES.md.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { dataset, WikitonguesDB, HydrationError, ReferenceHydrator } from '../src';
import { normalizeText, MULTILINGUAL_ALIASES } from '../src/resolver';
import { LanguageData, ReferenceTables, VideoData } from '../src/types';
import {
  parseIsoTable,
  parseGlottologCsv,
  parseIanaRegistry,
  glottologIsoCode,
  GlottologRow,
  IanaRegistry,
} from '../src/scripts/lib/reference_parsers';
import { generateReferenceTables, OUTPUT_PATH as REFERENCE_JSON_PATH } from '../src/scripts/build_reference';
import { Iso639_3Entry } from '../src/types';

describe('Dataset Integrity & Strict Linguistic Validation', () => {
  const rootDir = path.resolve(__dirname, '..');
  const rawJsonlPath = path.join(rootDir, 'data/raw/wikitongues_youtube_raw.jsonl');
  const jsonlPath = path.join(rootDir, 'data/processed/wikitongues_normalized.jsonl');
  const jsonPath = path.join(rootDir, 'data/processed/wikitongues_normalized.json');

  const EXPECTED_RECORDS = 862;

  /**
   * Raw YouTube records that are deliberately absent from the normalized dataset because they
   * cannot satisfy CLASSIFICATION_RULES.md §3.1.1 (all three standards mandatory).
   */
  const EXCLUDED_VIDEO_IDS = new Set([
    '9Nl_ttQDYkQ', // Atlaans: a conlang — ISO 639-3 `mis`, no Glottocode, private-use BCP-47 tag
  ]);

  /** Documented divergences between the SIL and Glottolog ontologies (kept from v0.1). */
  const GLOTTO_ONTOLOGY_EXCEPTIONS = new Set([
    '7cMIidnH7xY', // jude1270: Glottolog classifies Judeo-Shirazi under Southwestern Fars (fay), dataset/SIL uses Judeo-Persian (jpr)
    'pAUaSmVQ1Sg', // nort2627: Glottolog classifies Twents under Eastern Low German (nds), dataset/SIL uses Twents (twd)
    '9S8lDVmQSCQ', // nort2627: Glottolog classifies Gronings under Eastern Low German (nds), dataset/SIL uses Gronings (gos)
  ]);

  const GLOTTO_GENERIC_TOKENS = new Set(['standard', 'nuclear', 'proper', 'modern', 'classical']);

  let iso: Map<string, Iso639_3Entry>;
  let glottolog: Map<string, GlottologRow>;
  let iana: IanaRegistry;
  let rawRecords: Array<{ video_id: string; title: string }>;

  type Role = 'primary' | 'additional';
  const eachLanguage = (fn: (lang: LanguageData, item: VideoData, role: Role, idx: number) => void) => {
    for (const item of dataset) {
      fn(item.primary_language, item, 'primary', 0);
      (item.additional_languages ?? []).forEach((al, i) => fn(al, item, 'additional', i + 1));
    }
  };

  const tokens = (s: string): string[] =>
    normalizeText(s)
      .replace(/[^a-z0-9' ]+/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length >= 3);

  /** ISO code a Glottolog node maps to (own code, closest code, or parent's), if resolvable. */
  const glottoIso = (code: string): string | undefined => {
    const row = glottolog.get(code);
    return row ? glottologIsoCode(row, glottolog) : undefined;
  };

  beforeAll(() => {
    iso = parseIsoTable();
    glottolog = parseGlottologCsv();
    iana = parseIanaRegistry();
    rawRecords = fs
      .readFileSync(rawJsonlPath, 'utf-8')
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => JSON.parse(l));
  });

  // -------------------------------------------------------------------------
  // Files & provenance
  // -------------------------------------------------------------------------

  it(`should have exactly ${EXPECTED_RECORDS} records across all files`, () => {
    expect(dataset.length).toBe(EXPECTED_RECORDS);

    const jsonlContent = fs.readFileSync(jsonlPath, 'utf-8');
    const jsonlCount = jsonlContent.split('\n').filter((l) => l.trim()).length;
    expect(jsonlCount).toBe(EXPECTED_RECORDS);

    const rawJson = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    expect(rawJson.length).toBe(EXPECTED_RECORDS);
  });

  it('should keep JSON and JSONL files identical', () => {
    const fromJsonl = fs
      .readFileSync(jsonlPath, 'utf-8')
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => JSON.parse(l));
    expect(fromJsonl).toEqual(JSON.parse(fs.readFileSync(jsonPath, 'utf-8')));
  });

  it('should match raw YouTube metadata IDs 1-to-1 in order, minus the documented exclusions', () => {
    const expectedRaw = rawRecords.filter((r) => !EXCLUDED_VIDEO_IDS.has(r.video_id));
    expect(rawRecords.length - expectedRaw.length).toBe(EXCLUDED_VIDEO_IDS.size);
    expect(dataset.length).toBe(expectedRaw.length);
    for (let i = 0; i < dataset.length; i++) {
      expect(dataset[i].id).toBe(expectedRaw[i].video_id);
      expect(dataset[i].url).toBe(`https://www.youtube.com/watch?v=${expectedRaw[i].video_id}`);
    }
  });

  // -------------------------------------------------------------------------
  // §3.1.1 Nullability contract
  // -------------------------------------------------------------------------

  it('should have every language fully classified: no null or empty standards (§3.1.1)', () => {
    const violations: Array<{ id: string; role: Role; field: string }> = [];
    eachLanguage((lang, item, role) => {
      for (const field of ['iso639_3', 'glottocode', 'bcp47'] as const) {
        const value = lang.standards?.[field];
        if (typeof value !== 'string' || !value.trim()) violations.push({ id: item.id, role, field });
      }
      if (typeof lang.wikitongues_classification !== 'string' || !lang.wikitongues_classification.trim()) {
        violations.push({ id: item.id, role, field: 'wikitongues_classification' });
      }
      if (typeof lang.autonym !== 'string' || !lang.autonym.trim()) {
        violations.push({ id: item.id, role, field: 'autonym' });
      }
      if (lang.speaker_claim !== null && typeof lang.speaker_claim !== 'string') {
        violations.push({ id: item.id, role, field: 'speaker_claim' });
      }
      if (lang.wikitongues_lineage !== null && typeof lang.wikitongues_lineage !== 'string') {
        violations.push({ id: item.id, role, field: 'wikitongues_lineage' });
      }
      const allowed = new Set(['standards', 'speaker_claim', 'wikitongues_classification', 'wikitongues_lineage', 'autonym']);
      for (const key of Object.keys(lang)) {
        if (!allowed.has(key)) violations.push({ id: item.id, role, field: `unexpected:${key}` });
      }
    });
    expect(violations).toEqual([]);
  });

  it('should hydrate the whole dataset without a single HydrationError', () => {
    const hydrator = new ReferenceHydrator();
    const failures: string[] = [];
    eachLanguage((lang, item) => {
      try {
        hydrator.hydrate(lang.standards, item.id);
      } catch (err) {
        failures.push((err as Error).message);
      }
    });
    expect(failures).toEqual([]);
  });

  // -------------------------------------------------------------------------
  // §4.1 ISO 639-3
  // -------------------------------------------------------------------------

  it('should validate all ISO 639-3 codes against the official SIL table with individual scope (§4.1)', () => {
    const violations: Array<{ id: string; role: Role; iso: string; reason: string }> = [];
    eachLanguage((lang, item, role) => {
      const code = lang.standards.iso639_3;
      const entry = iso.get(code);
      if (!entry) violations.push({ id: item.id, role, iso: code, reason: 'not in SIL table' });
      else if (entry.scope !== 'I') violations.push({ id: item.id, role, iso: code, reason: `scope ${entry.scope}` });
      else if (code !== code.toLowerCase()) violations.push({ id: item.id, role, iso: code, reason: 'not lowercase' });
    });
    expect(violations).toEqual([]);
  });

  // -------------------------------------------------------------------------
  // §4.2 Glottolog
  // -------------------------------------------------------------------------

  it('should validate all glottocodes against the Glottolog table as language or dialect nodes (§4.2)', () => {
    const violations: Array<{ id: string; role: Role; glottocode: string; reason: string }> = [];
    eachLanguage((lang, item, role) => {
      const gc = lang.standards.glottocode;
      const row = glottolog.get(gc);
      if (!row) violations.push({ id: item.id, role, glottocode: gc, reason: 'not in Glottolog table' });
      else if (row.level === 'family') violations.push({ id: item.id, role, glottocode: gc, reason: `family node '${row.name}'` });
    });
    expect(violations).toEqual([]);
  });

  it('should cross-check ISO 639-3 with the Glottolog hierarchy (with documented ontology divergences)', () => {
    const mismatches: Array<{ id: string; role: Role; iso: string; glottocode: string; expectedIso: string }> = [];
    eachLanguage((lang, item, role) => {
      if (GLOTTO_ONTOLOGY_EXCEPTIONS.has(item.id)) return;
      const expected = glottoIso(lang.standards.glottocode);
      if (expected && expected !== lang.standards.iso639_3) {
        mismatches.push({ id: item.id, role, iso: lang.standards.iso639_3, glottocode: lang.standards.glottocode, expectedIso: expected });
      }
    });
    expect(mismatches).toEqual([]);
  });

  it('should only assign a dialect node when the variety is named by Wikitongues (§4.2 Attested-Specificity)', () => {
    const unattested: Array<{ id: string; role: Role; glottocode: string; dialect: string; title: string }> = [];
    eachLanguage((lang, item, role) => {
      const row = glottolog.get(lang.standards.glottocode);
      if (!row || row.level !== 'dialect') return;

      // A dialect node whose parent language carries a different ISO code is the highest Glottolog
      // node for this ISO code: it is the "language root" in the sense of §4.2, not a refinement.
      const parent = row.parentLanguageId ? glottolog.get(row.parentLanguageId) : undefined;
      if (parent && glottologIsoCode(parent, glottolog) !== lang.standards.iso639_3) return;

      const evidence = new Set(
        tokens(`${item.raw_metadata?.title ?? ''} ${(item.raw_metadata?.tags ?? []).join(' ')} ${lang.wikitongues_classification}`)
      );
      const nameTokens = tokens(row.name).filter((t) => !GLOTTO_GENERIC_TOKENS.has(t));
      if (nameTokens.length === 0 || !nameTokens.every((t) => evidence.has(t))) {
        unattested.push({ id: item.id, role, glottocode: row.code, dialect: row.name, title: item.raw_metadata?.title ?? '' });
      }
    });
    expect(unattested).toEqual([]);
  });

  // -------------------------------------------------------------------------
  // §4.3 BCP-47
  // -------------------------------------------------------------------------

  it('should compose BCP-47 tags whose primary subtag is ISO 639-1 when it exists, else ISO 639-3 (§4.3.1)', () => {
    const violations: Array<{ id: string; role: Role; iso: string; bcp47: string; expected: string }> = [];
    eachLanguage((lang, item, role) => {
      const entry = iso.get(lang.standards.iso639_3);
      const expected = entry?.part1 ?? lang.standards.iso639_3;
      const primary = lang.standards.bcp47.split('-')[0];
      if (primary !== expected) {
        violations.push({ id: item.id, role, iso: lang.standards.iso639_3, bcp47: lang.standards.bcp47, expected });
      }
    });
    expect(violations).toEqual([]);
  });

  it('should only use registered IANA subtags in RFC 5646 order, with no private-use or macrolanguage subtags (§4.3)', () => {
    const violations: Array<{ id: string; role: Role; bcp47: string; reason: string }> = [];
    eachLanguage((lang, item, role) => {
      const tag = lang.standards.bcp47;
      const fail = (reason: string) => violations.push({ id: item.id, role, bcp47: tag, reason });
      const parts = tag.split('-');
      const primary = parts[0];
      const langEntry = iana.language.get(primary);
      if (!langEntry) return fail('primary subtag not registered');
      if (langEntry.scope === 'macrolanguage') return fail('primary subtag is a macrolanguage');
      if (primary !== primary.toLowerCase()) return fail('primary subtag must be lowercase');

      let state = 0; // 0 language, 1 script, 2 region, 3 variant
      for (const sub of parts.slice(1)) {
        const lower = sub.toLowerCase();
        if (lower === 'x') return fail('private-use subtags are forbidden');
        if (/^[a-z]{4}$/.test(lower)) {
          if (state >= 1) return fail(`script '${sub}' out of order`);
          if (!iana.script.has(lower)) return fail(`script '${sub}' not registered`);
          if (langEntry.suppressScript?.toLowerCase() === lower) return fail(`script '${sub}' is Suppress-Script`);
          if (sub !== lower[0].toUpperCase() + lower.slice(1)) return fail(`script '${sub}' must be Title case`);
          state = 1;
        } else if (/^[a-z]{2}$/.test(lower) || /^[0-9]{3}$/.test(lower)) {
          if (state >= 2) return fail(`region '${sub}' out of order`);
          if (!iana.region.has(lower)) return fail(`region '${sub}' not registered`);
          if (sub !== sub.toUpperCase()) return fail(`region '${sub}' must be uppercase`);
          state = 2;
        } else {
          const variant = iana.variant.get(lower);
          if (!variant) return fail(`subtag '${sub}' is not a registered script, region or variant`);
          const ok = variant.prefixes.length === 0 || variant.prefixes.some((p) => tag.toLowerCase() === p || tag.toLowerCase().startsWith(`${p}-`));
          if (!ok) return fail(`variant '${sub}' requires prefix ${variant.prefixes.join(' | ')}`);
          state = 3;
        }
      }
    });
    expect(violations).toEqual([]);
  });

  it('should only carry a region subtag when Wikitongues names a variety beyond the bare language (§4.3.2)', () => {
    const violations: Array<{ id: string; role: Role; bcp47: string; classification: string }> = [];
    eachLanguage((lang, item, role) => {
      const parts = lang.standards.bcp47.split('-').slice(1);
      const hasRegion = parts.some((p) => /^[A-Z]{2}$/.test(p) || /^[0-9]{3}$/.test(p));
      if (!hasRegion) return;
      const entry = iso.get(lang.standards.iso639_3)!;
      const label = normalizeText(lang.wikitongues_classification);
      const bare = [entry.name, entry.invertedName ?? ''].map(normalizeText).filter(Boolean);
      if (bare.some((n) => n === label || n.includes(label))) {
        violations.push({ id: item.id, role, bcp47: lang.standards.bcp47, classification: lang.wikitongues_classification });
      }
    });
    expect(violations).toEqual([]);
  });

  // -------------------------------------------------------------------------
  // §4.4 Labels
  // -------------------------------------------------------------------------

  it('should carry a Wikitongues classification that is a label, not a code (§4.4)', () => {
    const violations: Array<{ id: string; role: Role; classification: string }> = [];
    eachLanguage((lang, item, role) => {
      const c = lang.wikitongues_classification;
      if (/^[a-z]{2,3}(-|$)/.test(c) || c.includes('|') || c.toLowerCase().includes('wikitongues')) {
        violations.push({ id: item.id, role, classification: c });
      }
    });
    expect(violations).toEqual([]);
  });

  it('should keep lineage free of pipes, sentinels and country names (§4.4)', () => {
    const violations: Array<{ id: string; lineage: string }> = [];
    const countries = new Set(dataset.map((d) => normalizeText(d.provenance?.country_name ?? '')).filter(Boolean));
    for (const item of dataset) {
      const l = item.primary_language.wikitongues_lineage;
      if (!l) continue;
      if (l.includes('|') || /wikitongues/i.test(l) || countries.has(normalizeText(l))) violations.push({ id: item.id, lineage: l });
    }
    expect(violations).toEqual([]);
  });

  // -------------------------------------------------------------------------
  // Hydration engine: negative tests
  // -------------------------------------------------------------------------

  describe('hydration rejects invalid standards', () => {
    const base = (): VideoData => JSON.parse(JSON.stringify(dataset.find((d) => d.id === 'qpfxFvpLAJ8')!));
    const load = (mutate: (v: VideoData) => void, reference?: ReferenceTables) => {
      const v = base();
      mutate(v);
      return () => new WikitonguesDB({ data: [v], reference });
    };

    it('rejects a Glottolog family node', () => {
      expect(load((v) => (v.primary_language.standards.glottocode = 'indo1319'))).toThrow(HydrationError);
    });

    it('rejects a missing standard', () => {
      expect(load((v) => ((v.primary_language.standards as any).glottocode = null))).toThrow(/mandatory/);
    });

    it('rejects an unknown ISO code and a macrolanguage', () => {
      expect(load((v) => (v.primary_language.standards.iso639_3 = 'ara'))).toThrow(HydrationError);
      const tables = new ReferenceHydrator().tables;
      const withMacro: ReferenceTables = {
        ...tables,
        iso639_3: { ...tables.iso639_3, ara: { name: 'Arabic', scope: 'M', type: 'L', part1: 'ar' } },
      };
      expect(load((v) => (v.primary_language.standards.iso639_3 = 'ara'), withMacro)).toThrow(/individual/);
    });

    it('rejects malformed, private-use and inconsistent BCP-47 tags', () => {
      expect(load((v) => (v.primary_language.standards.bcp47 = 'por'))).toThrow(/primary subtag/);
      expect(load((v) => (v.primary_language.standards.bcp47 = 'fr'))).toThrow(/must be 'pt'/);
      expect(load((v) => (v.primary_language.standards.bcp47 = 'pt-XX'))).toThrow(/region/);
      expect(load((v) => (v.primary_language.standards.bcp47 = 'pt-x-brasil'))).toThrow(/private-use/);
      expect(load((v) => (v.primary_language.standards.bcp47 = 'pt-valencia'))).toThrow(/prefix/);
      expect(load((v) => (v.primary_language.standards.bcp47 = 'pt-Latn'))).toThrow(/Suppress-Script/);
    });

    it('rejects a missing classification or autonym', () => {
      expect(load((v) => (v.primary_language.wikitongues_classification = ''))).toThrow(/wikitongues_classification/);
      expect(load((v) => ((v.primary_language as any).autonym = null))).toThrow(/autonym/);
    });

    it('names the offending record and field in the error', () => {
      try {
        load((v) => (v.additional_languages = [{ ...v.primary_language, standards: { ...v.primary_language.standards, glottocode: 'nope1234' } }]))();
        expect.unreachable();
      } catch (err) {
        expect(err).toBeInstanceOf(HydrationError);
        const e = err as HydrationError;
        expect(e.recordId).toBe('qpfxFvpLAJ8');
        expect(e.field).toBe('glottocode');
        expect(e.code).toBe('nope1234');
      }
    });
  });

  // -------------------------------------------------------------------------
  // Generated reference tables
  // -------------------------------------------------------------------------

  it('should ship reference tables that are up to date with the dataset and source tables (npm run build:reference)', () => {
    const committed = JSON.parse(fs.readFileSync(REFERENCE_JSON_PATH, 'utf-8'));
    expect(committed).toEqual(generateReferenceTables());
  });

  // -------------------------------------------------------------------------
  // Non-linguistic schema checks (unchanged from v0.1)
  // -------------------------------------------------------------------------

  it('should have well-formed schemas across all records', () => {
    const validLicenses = new Set(['ALL_RIGHTS_RESERVED', 'CC-BY-4.0', 'CC-BY-NC-4.0', 'CC-BY-SA-4.0', 'PUBLIC_DOMAIN']);
    const validContentTypes = new Set([
      'oral_history',
      'conversation',
      'sign_language',
      'reading_or_song',
      'meta',
      'fellowship_doc',
      'language_lesson',
    ]);

    for (const item of dataset) {
      expect(item.id).toBeTruthy();
      expect(item.duration_seconds).toBeGreaterThanOrEqual(0);
      expect(item.upload_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(validLicenses.has(item.license)).toBe(true);
      expect(validContentTypes.has(item.content_type)).toBe(true);
      expect(item.primary_language.standards.iso639_3).toHaveLength(3);
      expect(Array.isArray(item.additional_languages)).toBe(true);
      expect(Array.isArray(item.speakers)).toBe(true);
    }
  });

  it('should normalize and resolve text queries consistently', () => {
    expect(normalizeText('  Français  ')).toBe('francais');
    expect(normalizeText('Español')).toBe('espanol');
    expect(normalizeText('РУССКИЙ')).toBe('русскии');
    expect(normalizeText('')).toBe('');
    expect(normalizeText(null)).toBe('');
    expect(normalizeText(undefined)).toBe('');

    expect(MULTILINGUAL_ALIASES['russe']).toBe('rus');
    expect(MULTILINGUAL_ALIASES['espagnol']).toBe('spa');
    expect(MULTILINGUAL_ALIASES['allemand']).toBe('deu');
    expect(MULTILINGUAL_ALIASES['arabe']).toBe('ara');
  });

  it('should verify transcription integrity with zero leaked boilerplate or URLs', () => {
    const leakPattern = /(?:amara\.org|This video is licensed|Help us caption|Creative Commons Attribution)/i;
    for (const item of dataset) {
      if (item.transcription?.native_text) {
        expect(item.transcription.native_text).not.toMatch(leakPattern);
      }
      if (item.transcription?.english_translation) {
        expect(item.transcription.english_translation).not.toMatch(leakPattern);
      }
    }

    const nicole = dataset.find((d) => d.id === 'MMfozbb4w74');
    expect(nicole?.transcription?.english_translation).toContain('Goodbye everybody!');
    expect(nicole?.transcription?.english_translation).not.toContain('Bresciano features vowel harmony');

    const helsinki = dataset.find((d) => d.id === '38mq_FwgCNs');
    expect(helsinki?.transcription?.native_text).toContain('Nu kan jag ryska');
    expect(helsinki?.transcription?.english_translation).toContain('Now I know Russian');

    const signLang = dataset.find((d) => d.id === 'BCEO_U7713M');
    expect(signLang?.transcription?.native_text).toBeNull();
    expect(signLang?.transcription?.english_translation).toContain('Sukanya Bhan');
  });

  it('should verify enhanced provenance recorder recovery (>= 491 recorders)', () => {
    const withRecorder = dataset.filter((d) => d.provenance?.recorded_by !== null);
    expect(withRecorder.length).toBeGreaterThanOrEqual(491);

    const aran = dataset.find((d) => d.id === 'pdYpvY6Efos');
    expect(aran?.provenance?.recorded_by).toBe('Daniel Bogre Udell');
    expect(aran?.provenance?.city).toBe('Vielha e Mijaran');

    const purka = dataset.find((d) => d.id === 'BT7Pgimrq4g');
    expect(purka?.provenance?.recorded_by).toBe('Oliver Loode, Kristen Tcherneshoff');
    expect(purka?.provenance?.city).toBe('Purka');

    const anneli = dataset.find((d) => d.id === 'o6FUP_2RmcI');
    expect(anneli?.transcription?.native_text).not.toMatch(/_{3,}/);
  });

  it('should test compiled dist package artifacts', async () => {
    const distCjsPath = path.join(rootDir, 'dist/index.js');
    expect(fs.existsSync(distCjsPath)).toBe(true);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const cjsModule = require(distCjsPath);
    expect(cjsModule.WikitonguesDB).toBeDefined();

    const dbInstance = new cjsModule.WikitonguesDB();
    expect(dbInstance.length).toBe(EXPECTED_RECORDS);
    expect(dbInstance.get('nXBPa_wb3dM')?.primaryLanguage.iso639_3).toBe('quz');
    expect(dbInstance.get('qpfxFvpLAJ8')?.primaryLanguage.standards.glottolog.name).toBe('Brazilian Portuguese');
    expect(dbInstance.findByLanguage('russe').length).toBeGreaterThan(0);
  });
});
