/**
 * Comprehensive test suite for the Wikitongues Database TypeScript API.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  WikitonguesDB,
  Video,
  VideoCollection,
  Language,
  Speaker,
  Provenance,
  Transcription,
  RawMetadata,
} from '../src';

describe('WikitonguesDB API', () => {
  let db: WikitonguesDB;

  beforeAll(() => {
    db = new WikitonguesDB();
  });

  it('should initialize and load all 860+ normalized records', () => {
    expect(db.length).toBeGreaterThanOrEqual(800);
    expect(db.all().length).toBe(db.length);
  });

  it('should perform O(1) lookup by ID', () => {
    const vid = db.get('nXBPa_wb3dM');
    expect(vid).not.toBeNull();
    expect(vid!.id).toBe('nXBPa_wb3dM');
    expect(vid!.primaryLanguage.iso639_3).toBe('quz');
    expect(vid!.primaryLanguage.name).toBe('Quechua');
    expect(vid!.embedUrl).toBe('https://www.youtube.com/embed/nXBPa_wb3dM');
    expect(vid!.provenance.countryName).toContain('Peru');
    expect(vid!.durationFormatted).toBe('19:42');

    // Test non-existent ID
    const noneVid = db.get('non_existent_id');
    expect(noneVid).toBeNull();
  });

  it('should lookup by ISO 639-3 and BCP 47', () => {
    // Cusco Quechua (quz)
    const queByIso = db.getByIso('quz');
    expect(queByIso.length).toBeGreaterThan(0);
    expect(queByIso.ids).toContain('nXBPa_wb3dM');

    const queByBcp = db.getByBcp47('quz');
    expect(queByBcp.length).toBeGreaterThan(0);

    // Igbo (ibo / ig)
    const iboVids = db.getByIso('ibo');
    expect(iboVids.length).toBeGreaterThan(0);
    expect(iboVids.ids).toContain('HQcLp1qnjHU');
  });

  it('should lookup by Glottocode', () => {
    const queByGlotto = db.getByGlottocode('cusc1236');
    expect(queByGlotto.length).toBeGreaterThan(0);
    expect(queByGlotto.ids).toContain('nXBPa_wb3dM');
  });

  it('should lookup by Country code and name', () => {
    const peVids = db.getByCountry('PE');
    expect(peVids.length).toBeGreaterThan(0);
    expect(peVids.toArray().every((v) => v.countryCode === 'PE')).toBe(true);

    const peruByName = db.getByCountry('Peru');
    expect(peVids.length).toBe(peruByName.length);
  });

  it('should find Russian variants (ISO, BCP47, English, French, Autonym, Glottocode)', () => {
    const rusIso = db.findByLanguage('rus');
    expect(rusIso.length).toBeGreaterThanOrEqual(1);

    const rusBcp = db.findByLanguage('ru');
    expect(rusBcp.length).toBeGreaterThanOrEqual(1);

    const rusName = db.findByLanguage('Russian');
    expect(rusName.length).toBeGreaterThanOrEqual(1);

    const rusFr = db.findByLanguage('russe');
    expect(rusFr.length).toBeGreaterThanOrEqual(1);

    const rusGlotto = db.findByLanguage('russ1263');
    expect(rusGlotto.length).toBeGreaterThanOrEqual(1);

    // Verify Maxim video is found
    expect(rusIso.ids).toContain('G1ZIzrAxWbA');
    expect(rusFr.ids).toContain('G1ZIzrAxWbA');
  });

  it('should find multilingual aliases in French and Spanish', () => {
    // French aliases
    expect(db.findByLanguage('francais').length).toBeGreaterThan(0);
    expect(db.findByLanguage('espagnol').length).toBeGreaterThan(0);
    expect(db.findByLanguage('allemand').length).toBeGreaterThan(0);
    expect(db.findByLanguage('basque').length).toBeGreaterThan(0);
    expect(db.findByLanguage('arabe').length).toBeGreaterThan(0);
    expect(db.findByLanguage('persan').length).toBeGreaterThan(0);
    expect(db.findByLanguage('farsi').length).toBeGreaterThan(0);
    expect(db.findByLanguage('norvegien').length).toBeGreaterThan(0);
    expect(db.findByLanguage('kurde').length).toBeGreaterThan(0);
    expect(db.findByLanguage('albanais').length).toBeGreaterThan(0);
    expect(db.findByLanguage('pashto').length).toBeGreaterThan(0);

    // Spanish aliases
    expect(db.findByLanguage('euskera').length).toBeGreaterThan(0);
    expect(db.findByLanguage('ingles').length).toBeGreaterThan(0);
  });

  it('should find by native autonym and dialect', () => {
    // Autonym: Asụsụ Igbo
    const igbo = db.findByLanguage('Asụsụ Igbo');
    expect(igbo.length).toBeGreaterThan(0);
    expect(igbo.ids).toContain('HQcLp1qnjHU');

    // Autonym: Qhichwa
    const quechua = db.findByLanguage('Qhichwa');
    expect(quechua.length).toBeGreaterThan(0);

    // Dialect: Arbëresh
    const arberesh = db.findByLanguage('Arbëresh');
    expect(arberesh.length).toBeGreaterThan(0);
    expect(arberesh.ids).toContain('lstcnY-UXbs');

    // Dialect: Scanian
    const scanian = db.findByLanguage('Scanian');
    expect(scanian.length).toBeGreaterThan(0);

    // Dialect: Kukamiria
    const kukamiria = db.findByLanguage('Kukamiria');
    expect(kukamiria.length).toBeGreaterThan(0);
    expect(kukamiria.ids).toContain('cxiGMkEZvKQ');
  });

  it('should support fluent QueryBuilder chaining', () => {
    const results = db
      .query()
      .country('US')
      .contentType('oral_history')
      .creativeCommonsOnly()
      .minDuration(60)
      .maxDuration(600)
      .orderBy('duration', true)
      .limit(5)
      .all();

    expect(results.length).toBeLessThanOrEqual(5);
    for (const v of results) {
      expect(v.countryCode).toBe('US');
      expect(v.contentType).toBe('oral_history');
      expect(v.isCreativeCommons).toBe(true);
      expect(v.durationSeconds).toBeGreaterThanOrEqual(60);
      expect(v.durationSeconds).toBeLessThanOrEqual(600);
    }

    // Verify descending sort
    const durations = results.toArray().map((v) => v.durationSeconds);
    const sortedDesc = [...durations].sort((a, b) => b - a);
    expect(durations).toEqual(sortedDesc);
  });

  it('should support subtitles filtering', () => {
    const withSubs = db.query().withSubtitles().all();
    const withoutSubs = db.query().withoutSubtitles().all();

    expect(withSubs.length + withoutSubs.length).toBe(db.length);
    expect(withSubs.toArray().every((v) => v.transcription.hasSubtitles)).toBe(true);
    expect(withoutSubs.toArray().every((v) => !v.transcription.hasSubtitles)).toBe(true);
  });

  it('should support pagination', () => {
    const allPe = db.query().country('PE').all();
    const page1 = db.query().country('PE').page(1, 2).all();
    const page2 = db.query().country('PE').page(2, 2).all();

    expect(page1.length).toBe(Math.min(2, allPe.length));
    if (allPe.length > 2) {
      expect(page2.length).toBe(Math.min(2, allPe.length - 2));
      expect(page1.at(0)?.id).not.toBe(page2.at(0)?.id);
    }
  });

  it('should support custom predicate filtering', () => {
    const customResults = db
      .query()
      .filter(
        (v) => v.durationSeconds % 10 === 0 && v.uploadDate.startsWith('2026')
      )
      .all();

    for (const v of customResults) {
      expect(v.durationSeconds % 10).toBe(0);
      expect(v.uploadDate.startsWith('2026')).toBe(true);
    }
  });

  it('should score and rank full-text search results', () => {
    // Search for Albanian Arbëresh
    const searchResults = db.search('Arbëresh Albanian diaspora medieval');
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults.at(0)?.id).toBe('lstcnY-UXbs');

    // Search for Quechua comic books
    const queSearch = db.search('comic books Incan language');
    expect(queSearch.length).toBeGreaterThan(0);
    expect(queSearch.at(0)?.id).toBe('nXBPa_wb3dM');
  });

  it('should provide aggregations, slicing, grouping, and exports on VideoCollection', () => {
    const peVids = db.getByCountry('PE');

    expect(peVids.totalDurationSeconds).toBeGreaterThan(0);
    expect(peVids.totalDurationFormatted).toContain('s');
    expect(peVids.averageDurationSeconds).toBeGreaterThan(0);
    expect(Array.isArray(peVids.isoCodes)).toBe(true);
    expect(Array.isArray(peVids.titles)).toBe(true);
    expect(Array.isArray(peVids.urls)).toBe(true);
    expect(Array.isArray(peVids.embedUrls)).toBe(true);

    // Slicing
    const sliceCol = peVids.slice(0, 2);
    expect(sliceCol).toBeInstanceOf(VideoCollection);
    expect(sliceCol.length).toBe(Math.min(2, peVids.length));

    // Group by
    const groups = peVids.groupBy('language');
    expect(typeof groups).toBe('object');

    // JSON Export
    const jsonStr = peVids.toJSON();
    expect(jsonStr.startsWith('[')).toBe(true);

    // JSONL Export
    const jsonlStr = peVids.toJSONL();
    const lines = jsonlStr.trim().split('\n');
    expect(lines.length).toBe(peVids.length);

    // CSV Export
    const csvStr = peVids.toCSV();
    expect(csvStr.startsWith('id,url,title')).toBe(true);
  });

  it('should sample random videos with seed reproducibility', () => {
    const sample1 = db.random(3, 42);
    const sample2 = db.random(3, 42);

    expect(sample1.length).toBe(3);
    expect(sample2.length).toBe(3);
    expect(sample1.ids).toEqual(sample2.ids);

    const sampledQue = db.random(1, 42, { language: 'quz' });
    expect(sampledQue.length).toBe(1);
    expect(sampledQue.at(0)?.allIsoCodes.has('quz')).toBe(true);
  });

  it('should compute dataset stats and inventories', () => {
    const stats = db.stats();
    expect(stats.total_videos).toBe(db.length);
    expect(stats.total_languages).toBeGreaterThan(300);
    expect(stats.total_countries).toBeGreaterThan(80);
    expect(stats.total_duration_hours).toBeGreaterThan(10);
    expect(stats.licenses).toBeDefined();
    expect(stats.content_types).toBeDefined();

    const languages = db.languages();
    expect(languages.length).toBeGreaterThan(300);
    const topLang = languages[0];
    expect(topLang.iso639_3).toBeDefined();
    expect(topLang.video_count).toBeGreaterThanOrEqual(languages[1].video_count);

    const countries = db.countries();
    expect(countries.length).toBeGreaterThan(80);
    expect(countries[0].country_name).toBeDefined();

    const speakers = db.speakers();
    expect(speakers.length).toBeGreaterThan(50);
    expect(speakers[0].name).toBeDefined();
  });

  it('should construct WikitonguesDB from custom in-memory records and JSON', () => {
    const customRecords = [
      {
        id: 'vid_test_001',
        url: 'https://www.youtube.com/watch?v=vid_test_001',
        duration_seconds: 120,
        upload_date: '2026-05-01',
        license: 'CC-BY-4.0',
        content_type: 'oral_history',
        primary_language: {
          iso639_3: 'eus',
          bcp47: 'eu',
          name: 'Basque',
          autonym: 'Euskara',
        },
        speakers: [{ name: 'Miren', role: 'native' }],
        provenance: { country_code: 'ES', country_name: 'Spain' },
      },
    ];

    const customDb = WikitonguesDB.fromRecords(customRecords);
    expect(customDb.length).toBe(1);
    expect(customDb.get('vid_test_001')?.primaryLanguage.name).toBe('Basque');
    expect(customDb.findByLanguage('basque').length).toBe(1);
    expect(customDb.findByLanguage('euskera').length).toBe(1);
    expect(customDb.findByLanguage('Euskara').length).toBe(1);

    const fromJsonDb = WikitonguesDB.fromJSON(JSON.stringify(customRecords));
    expect(fromJsonDb.length).toBe(1);
    expect(fromJsonDb.get('vid_test_001')?.primaryLanguage.iso639_3).toBe('eus');
  });
});
