/**
 * Strict Semantic and Linguistic Validation Test Suite for Wikitongues Database.
 * Validates the entire dataset against official SIL ISO 639-3, Glottolog, and YouTube raw data.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { dataset, WikitonguesDB } from '../src';
import { normalizeText, MULTILINGUAL_ALIASES } from '../src/resolver';

describe('Dataset Integrity & Strict Linguistic Validation', () => {
  const rootDir = path.resolve(__dirname, '..');
  const silTabPath = path.join(rootDir, 'data/references/iso-639-3.tab');
  const silNameIndexPath = path.join(rootDir, 'data/references/iso-639-3_Name_Index.tab');
  const ianaRegistryPath = path.join(rootDir, 'data/references/iana_language_subtag_registry.txt');
  const glottoCsvPath = path.join(rootDir, 'data/references/glottolog_languages.csv');
  const rawJsonlPath = path.join(rootDir, 'data/raw/wikitongues_youtube_raw.jsonl');
  const jsonlPath = path.join(rootDir, 'data/processed/wikitongues_normalized.jsonl');
  const jsonPath = path.join(rootDir, 'data/processed/wikitongues_normalized.json');

  let validSilCodes: Set<string>;
  let validGlottoCodes: Set<string>;
  let isoToPart1: Map<string, string>;
  let isoScope: Map<string, string>;
  let ianaMacrolanguages: Map<string, string>;
  let ianaMacroSubtags: Set<string>;
  let glottoToIso: Map<string, string>;
  let glottoLevel: Map<string, string>;
  let isoValidNames: Map<string, Set<string>>;
  let rawRecords: Array<{ video_id: string; title: string }>;

  const GLOTTO_ONTOLOGY_EXCEPTIONS = new Set([
    '7cMIidnH7xY', // jude1270: Glottolog classifies Judeo-Shirazi under Southwestern Fars (fay), dataset/SIL uses Judeo-Persian (jpr)
    'pAUaSmVQ1Sg', // nort2627: Glottolog classifies Twents under Eastern Low German (nds), dataset/SIL uses Twents (twd)
    '9S8lDVmQSCQ', // nort2627: Glottolog classifies Gronings under Eastern Low German (nds), dataset/SIL uses Gronings (gos)
  ]);

  const KNOWN_NAME_ALIASES: Record<string, string[]> = {
    sjs: ['sanhaja of srair'],
    nrf: ['norman'],
    rsk: ['pannonian rusyn'],
    qvi: ['otavalo highland quichua'],
    ell: ['greek'],
    ton: ['tongan'],
    mis: ['atlaans'],
    luo: ['luo'],
    oci: ['occitan'],
    frs: ['east frisian low saxon'],
    diq: ['dimli'],
  };

  function addValidName(iso: string, rawName: string) {
    if (!iso || !rawName) return;
    const i = iso.trim().toLowerCase();
    const n = rawName.trim().toLowerCase();
    if (!i || !n) return;
    if (!isoValidNames.has(i)) isoValidNames.set(i, new Set());
    const set = isoValidNames.get(i)!;
    set.add(n);
    const withoutParens = n.replace(/\s*\([^)]*\)/g, '').trim();
    if (withoutParens) set.add(withoutParens);
  }

  function isValidBcpSubtag(iso639_3: string, bcp47: string): boolean {
    const iso = iso639_3.toLowerCase().trim();
    const bcp = bcp47.toLowerCase().trim();
    const subtag = bcp.split('-')[0];
    const part1 = isoToPart1.get(iso);
    const macro = ianaMacrolanguages.get(iso);
    const macroPart1 = macro ? isoToPart1.get(macro) : undefined;

    return (
      subtag === iso ||
      (part1 !== undefined && subtag === part1) ||
      (macro !== undefined && subtag === macro) ||
      (macroPart1 !== undefined && subtag === macroPart1) ||
      (iso === 'mis' && subtag === 'art')
    );
  }

  function isValidGlottoMapping(iso639_3: string, glottocode: string | null, recordId?: string): boolean {
    if (!glottocode) return true;
    if (recordId && GLOTTO_ONTOLOGY_EXCEPTIONS.has(recordId)) return true;

    const expectedIso = glottoToIso.get(glottocode.trim());
    if (!expectedIso) return true;
    return expectedIso === iso639_3.toLowerCase().trim();
  }

  function isValidName(iso639_3: string, name: string): boolean {
    const iso = iso639_3.toLowerCase().trim();
    const normalizedName = name.toLowerCase().trim();
    const cleanName = normalizedName.replace(/\s*\([^)]*\)/g, '').trim();
    const validSet = isoValidNames.get(iso);
    if (!validSet) return false;
    return validSet.has(normalizedName) || validSet.has(cleanName);
  }

  beforeAll(() => {
    // 1. Parse SIL ISO 639-3 table
    validSilCodes = new Set<string>();
    isoToPart1 = new Map<string, string>();
    isoScope = new Map<string, string>();
    isoValidNames = new Map<string, Set<string>>();

    const silContent = fs.readFileSync(silTabPath, 'utf-8');
    const silLines = silContent.split('\n');
    for (let i = 1; i < silLines.length; i++) {
      const line = silLines[i].trim();
      if (!line) continue;
      const parts = line.split('\t');
      const iso = parts[0]?.trim().toLowerCase();
      if (iso) {
        validSilCodes.add(iso);
        const part1 = parts[3]?.trim().toLowerCase();
        if (part1) isoToPart1.set(iso, part1);
        const scope = parts[4]?.trim(); // I (individual), M (macrolanguage), S (special)
        if (scope) isoScope.set(iso, scope);
        const refName = parts[6]?.trim();
        if (refName) addValidName(iso, refName);
      }
    }

    // 2. Parse SIL Name Index
    const nameLines = fs.readFileSync(silNameIndexPath, 'utf-8').split('\n');
    for (let i = 1; i < nameLines.length; i++) {
      const line = nameLines[i].trim();
      if (!line) continue;
      const parts = line.split('\t');
      const iso = parts[0]?.trim().toLowerCase();
      if (iso) {
        if (parts[1]) addValidName(iso, parts[1]);
        if (parts[2]) addValidName(iso, parts[2]);
      }
    }

    // 3. Parse IANA Subtag Registry (Macrolanguages)
    ianaMacrolanguages = new Map<string, string>();
    ianaMacroSubtags = new Set<string>();
    const ianaContent = fs.readFileSync(ianaRegistryPath, 'utf-8');
    const ianaBlocks = ianaContent.split('%%');
    for (const b of ianaBlocks) {
      const lines = b.split('\n');
      let subtag = '';
      let macro = '';
      let isLanguage = false;
      let isMacroScope = false;
      for (const l of lines) {
        if (l.startsWith('Type: language')) isLanguage = true;
        else if (l.startsWith('Subtag: ')) subtag = l.substring(8).trim().toLowerCase();
        else if (l.startsWith('Macrolanguage: ')) macro = l.substring(15).trim().toLowerCase();
        else if (l.startsWith('Scope: macrolanguage')) isMacroScope = true;
      }
      if (isLanguage && subtag && macro) {
        ianaMacrolanguages.set(subtag, macro);
      }
      if (isLanguage && subtag && isMacroScope) {
        ianaMacroSubtags.add(subtag);
      }
    }

    // 4. Parse Glottolog CSV
    validGlottoCodes = new Set<string>();
    glottoToIso = new Map<string, string>();
    glottoLevel = new Map<string, string>();
    const glottoEntries = new Map<string, { name: string; iso?: string; langId?: string; closestIso?: string }>();

    const glottoContent = fs.readFileSync(glottoCsvPath, 'utf-8');
    const glottoLines = glottoContent.split('\n');
    for (let i = 1; i < glottoLines.length; i++) {
      const line = glottoLines[i].trim();
      if (!line) continue;
      const parts = line.split(',');
      const gc = parts[0]?.replace(/"/g, '').trim();
      if (!gc) continue;
      validGlottoCodes.add(gc);
      const name = parts[1]?.replace(/"/g, '').trim();
      const iso = parts[6]?.replace(/"/g, '').trim().toLowerCase();
      const level = parts[7]?.replace(/"/g, '').trim(); // 'family', 'language', 'dialect'
      if (level) glottoLevel.set(gc, level);
      const langId = parts[10]?.replace(/"/g, '').trim();
      const closestIso = parts[11]?.replace(/"/g, '').trim().toLowerCase();
      glottoEntries.set(gc, { name, iso, langId, closestIso });
      if (iso && name) addValidName(iso, name);
      if (closestIso && name) addValidName(closestIso, name);
    }

    // Resolve dialect/parent ISO codes in Glottolog
    for (const [gc, entry] of glottoEntries.entries()) {
      let resolvedIso = entry.iso || entry.closestIso;
      if (!resolvedIso && entry.langId && glottoEntries.has(entry.langId)) {
        const parent = glottoEntries.get(entry.langId)!;
        resolvedIso = parent.iso || parent.closestIso;
      }
      if (resolvedIso) {
        glottoToIso.set(gc, resolvedIso);
      }
    }

    // Register known naming aliases
    for (const [iso, aliases] of Object.entries(KNOWN_NAME_ALIASES)) {
      for (const alias of aliases) {
        addValidName(iso, alias);
      }
    }

    // 5. Parse raw records
    const rawContent = fs.readFileSync(rawJsonlPath, 'utf-8');
    rawRecords = rawContent
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => JSON.parse(l));
  });

  it('should have exactly 863 records across all files', () => {
    expect(dataset.length).toBe(863);
    expect(rawRecords.length).toBe(863);

    const jsonlContent = fs.readFileSync(jsonlPath, 'utf-8');
    const jsonlCount = jsonlContent.split('\n').filter((l) => l.trim()).length;
    expect(jsonlCount).toBe(863);

    const rawJson = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    expect(rawJson.length).toBe(863);
  });

  it('should match raw YouTube metadata IDs 1-to-1 with zero offset or discrepancy', () => {
    for (let i = 0; i < dataset.length; i++) {
      const normalizedItem = dataset[i];
      const rawItem = rawRecords[i];
      expect(normalizedItem.id).toBe(rawItem.video_id);
      expect(normalizedItem.url).toBe(`https://www.youtube.com/watch?v=${rawItem.video_id}`);
    }
  });

  it('should validate all primary ISO 639-3 codes against official SIL table (100% valid)', () => {
    const invalidIso: Array<{ id: string; iso: string }> = [];

    for (const item of dataset) {
      const iso = item.primary_language.iso639_3.toLowerCase();
      if (!validSilCodes.has(iso)) {
        invalidIso.push({ id: item.id, iso });
      }
    }

    expect(invalidIso).toEqual([]);
  });

  it('should validate all additional language ISO 639-3 codes against official SIL table', () => {
    const invalidAdditionalIso: Array<{ id: string; iso: string }> = [];

    for (const item of dataset) {
      if (item.additional_languages) {
        for (const addLang of item.additional_languages) {
          const iso = addLang.iso639_3.toLowerCase();
          if (!validSilCodes.has(iso)) {
            invalidAdditionalIso.push({ id: item.id, iso });
          }
        }
      }
    }

    expect(invalidAdditionalIso).toEqual([]);
  });

  it('should validate all glottocodes against Glottolog table (zero hallucination)', () => {
    const invalidGlottocodes: Array<{ id: string; glottocode: string }> = [];

    for (const item of dataset) {
      if (item.primary_language.glottocode) {
        const gc = item.primary_language.glottocode.trim();
        if (!validGlottoCodes.has(gc)) {
          invalidGlottocodes.push({ id: item.id, glottocode: gc });
        }
      }

      if (item.additional_languages) {
        for (const addLang of item.additional_languages) {
          if (addLang.glottocode) {
            const gc = addLang.glottocode.trim();
            if (!validGlottoCodes.has(gc)) {
              invalidGlottocodes.push({ id: item.id, glottocode: gc });
            }
          }
        }
      }
    }

    expect(invalidGlottocodes).toEqual([]);
  });

  it('should deterministically cross-check ISO 639-3 with BCP-47 language subtag across all records (RFC 5646)', () => {
    const bcpMismatches: Array<{ id: string; role: string; iso: string; bcp: string }> = [];

    for (const item of dataset) {
      if (!isValidBcpSubtag(item.primary_language.iso639_3, item.primary_language.bcp47)) {
        bcpMismatches.push({
          id: item.id,
          role: 'primary',
          iso: item.primary_language.iso639_3,
          bcp: item.primary_language.bcp47,
        });
      }

      if (item.additional_languages) {
        for (const addLang of item.additional_languages) {
          if (!isValidBcpSubtag(addLang.iso639_3, addLang.bcp47)) {
            bcpMismatches.push({
              id: item.id,
              role: 'additional',
              iso: addLang.iso639_3,
              bcp: addLang.bcp47,
            });
          }
        }
      }
    }

    expect(bcpMismatches).toEqual([]);
  });

  it('should deterministically cross-check ISO 639-3 with Glottolog hierarchy (with documented ontology divergences)', () => {
    const glottoMismatches: Array<{ id: string; role: string; iso: string; glottocode: string; expectedIso?: string }> = [];

    for (const item of dataset) {
      if (!isValidGlottoMapping(item.primary_language.iso639_3, item.primary_language.glottocode, item.id)) {
        glottoMismatches.push({
          id: item.id,
          role: 'primary',
          iso: item.primary_language.iso639_3,
          glottocode: item.primary_language.glottocode!,
          expectedIso: glottoToIso.get(item.primary_language.glottocode!.trim()),
        });
      }

      if (item.additional_languages) {
        for (const addLang of item.additional_languages) {
          if (!isValidGlottoMapping(addLang.iso639_3, addLang.glottocode, item.id)) {
            glottoMismatches.push({
              id: item.id,
              role: 'additional',
              iso: addLang.iso639_3,
              glottocode: addLang.glottocode!,
              expectedIso: glottoToIso.get(addLang.glottocode!.trim()),
            });
          }
        }
      }
    }

    expect(glottoMismatches).toEqual([]);
  });

  it('should verify lexical coherence between language name and ISO 639-3 official reference names', () => {
    const nameMismatches: Array<{ id: string; role: string; iso: string; name: string }> = [];

    for (const item of dataset) {
      if (!isValidName(item.primary_language.iso639_3, item.primary_language.name)) {
        nameMismatches.push({
          id: item.id,
          role: 'primary',
          iso: item.primary_language.iso639_3,
          name: item.primary_language.name,
        });
      }

      if (item.additional_languages) {
        for (const addLang of item.additional_languages) {
          if (!isValidName(addLang.iso639_3, addLang.name)) {
            nameMismatches.push({
              id: item.id,
              role: 'additional',
              iso: addLang.iso639_3,
              name: addLang.name,
            });
          }
        }
      }
    }

    expect(nameMismatches).toEqual([]);
  });

  it('should deterministically catch corrupted cross-field combinations (negative test)', () => {
    // 1. The user's exact example: French ISO with English BCP, Glottocode, and Name
    expect(isValidBcpSubtag('fra', 'en-GB-scotland')).toBe(false);
    expect(isValidGlottoMapping('fra', 'stan1293')).toBe(false);
    expect(isValidName('fra', 'English')).toBe(false);

    // 2. English ISO with French BCP, Glottocode, and Name
    expect(isValidBcpSubtag('eng', 'fr-FR')).toBe(false);
    expect(isValidGlottoMapping('eng', 'stan1290')).toBe(false); // French standard
    expect(isValidName('eng', 'Français')).toBe(false);

    // 3. Spanish ISO with German Glottocode
    expect(isValidGlottoMapping('spa', 'stan1295')).toBe(false); // Standard German

    // 4. Russian ISO with Arabic BCP
    expect(isValidBcpSubtag('rus', 'ar-EG')).toBe(false);
  });

  it('should reject ISO 639-3 macrolanguages (Scope M: individuals only)', () => {
    const isoMacroViolations: Array<{ id: string; role: string; iso: string; name: string }> = [];

    for (const item of dataset) {
      const check = (lang: { iso639_3: string; name: string }, role: 'primary' | 'additional') => {
        const iso = lang.iso639_3?.toLowerCase().trim();
        if (iso && isoScope.get(iso) === 'M') {
          isoMacroViolations.push({ id: item.id, role, iso, name: lang.name });
        }
      };

      check(item.primary_language, 'primary');
      if (item.additional_languages) {
        for (const addLang of item.additional_languages) {
          check(addLang, 'additional');
        }
      }
    }

    expect(isoMacroViolations).toEqual([]);
  });

  it('should reject Glottolog language families (Level family: languages or dialects only)', () => {
    const glottoFamilyViolations: Array<{ id: string; role: string; glottocode: string; name: string }> = [];

    for (const item of dataset) {
      const check = (lang: { glottocode: string | null; name: string }, role: 'primary' | 'additional') => {
        if (lang.glottocode) {
          const gc = lang.glottocode.trim();
          if (glottoLevel.get(gc) === 'family') {
            glottoFamilyViolations.push({ id: item.id, role, glottocode: gc, name: lang.name });
          }
        }
      };

      check(item.primary_language, 'primary');
      if (item.additional_languages) {
        for (const addLang of item.additional_languages) {
          check(addLang, 'additional');
        }
      }
    }

    expect(glottoFamilyViolations).toEqual([]);
  });

  it('should reject BCP-47 macrolanguage subtags (individual language subtags only)', () => {
    const bcpMacroViolations: Array<{ id: string; role: string; bcp: string; primarySubtag: string; iso: string }> = [];

    for (const item of dataset) {
      const check = (lang: { bcp47: string; iso639_3: string }, role: 'primary' | 'additional') => {
        if (lang.bcp47) {
          const subtag = lang.bcp47.split('-')[0].toLowerCase().trim();
          if (ianaMacroSubtags.has(subtag)) {
            bcpMacroViolations.push({
              id: item.id,
              role,
              bcp: lang.bcp47,
              primarySubtag: subtag,
              iso: lang.iso639_3,
            });
          }
        }
      };

      check(item.primary_language, 'primary');
      if (item.additional_languages) {
        for (const addLang of item.additional_languages) {
          check(addLang, 'additional');
        }
      }
    }

    expect(bcpMacroViolations).toEqual([]);
  });

  it('should have well-formed schemas across all records', () => {
    const validLicenses = new Set([
      'ALL_RIGHTS_RESERVED',
      'CC-BY-4.0',
      'CC-BY-NC-4.0',
      'CC-BY-SA-4.0',
      'PUBLIC_DOMAIN',
    ]);

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
      expect(item.primary_language.name).toBeTruthy();
      expect(item.primary_language.iso639_3).toHaveLength(3);
      expect(item.primary_language.bcp47).toBeTruthy();
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

    // Multilingual aliases checks
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

    // Specific cleanups check
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

    // Test CJS require
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const cjsModule = require(distCjsPath);
    expect(cjsModule.WikitonguesDB).toBeDefined();

    const dbInstance = new cjsModule.WikitonguesDB();
    expect(dbInstance.length).toBe(863);
    expect(dbInstance.get('nXBPa_wb3dM')?.primaryLanguage.iso639_3).toBe('quz');
    expect(dbInstance.findByLanguage('russe').length).toBeGreaterThan(0);
  });
});
