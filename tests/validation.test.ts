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
  const glottoCsvPath = path.join(rootDir, 'data/references/glottolog_languages.csv');
  const rawJsonlPath = path.join(rootDir, 'data/raw/wikitongues_youtube_raw.jsonl');
  const jsonlPath = path.join(rootDir, 'data/processed/wikitongues_normalized.jsonl');
  const jsonPath = path.join(rootDir, 'data/processed/wikitongues_normalized.json');

  let validSilCodes: Set<string>;
  let validGlottoCodes: Set<string>;
  let rawRecords: Array<{ video_id: string; title: string }>;

  beforeAll(() => {
    // 1. Parse SIL ISO 639-3 table
    validSilCodes = new Set<string>();
    const silContent = fs.readFileSync(silTabPath, 'utf-8');
    const silLines = silContent.split('\n');
    // First line is header: Id \t Print_Name \t Inverted_Name \t ...
    for (let i = 1; i < silLines.length; i++) {
      const line = silLines[i].trim();
      if (!line) continue;
      const parts = line.split('\t');
      if (parts[0]) {
        validSilCodes.add(parts[0].trim().toLowerCase());
      }
    }

    // 2. Parse Glottolog CSV
    validGlottoCodes = new Set<string>();
    const glottoContent = fs.readFileSync(glottoCsvPath, 'utf-8');
    const glottoLines = glottoContent.split('\n');
    for (let i = 1; i < glottoLines.length; i++) {
      const line = glottoLines[i].trim();
      if (!line) continue;
      // Glottocode is column 1 (e.g. stan1288, abaz1238)
      const parts = line.split(',');
      if (parts[0]) {
        const gc = parts[0].replace(/"/g, '').trim();
        if (gc) {
          validGlottoCodes.add(gc);
        }
      }
    }

    // 3. Parse raw records
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
