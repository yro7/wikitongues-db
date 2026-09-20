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
    expect(vid!.primaryLanguage.name).toBe('Cusco Quechua');
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

  it('should seamlessly bridge 2-letter and 3-letter codes for ISO 639 and BCP 47', () => {
    // 1. ISO 639-1 / 639-3 bridging (e.g. fr <-> fra, cs <-> ces)
    const frByBcp2 = db.getByBcp47('fr');
    const frByBcp3 = db.getByBcp47('fra');
    expect(frByBcp2.length).toBeGreaterThan(0);
    expect(frByBcp2.ids).toEqual(frByBcp3.ids);

    const csByBcp2 = db.getByBcp47('cs');
    const csByBcp3 = db.getByBcp47('ces');
    expect(csByBcp2.length).toBeGreaterThan(0);
    expect(csByBcp2.ids).toEqual(csByBcp3.ids);

    const frByIso2 = db.getByIso('fr');
    const frByIso3 = db.getByIso('fra');
    expect(frByIso2.length).toBeGreaterThan(0);
    expect(frByIso2.ids).toEqual(frByIso3.ids);

    // 2. Macrolanguage 2-letter code bridging to individual languages (e.g. et -> ekk, fa -> pes)
    const etByBcp = db.getByBcp47('et');
    const ekkByBcp = db.getByBcp47('ekk');
    expect(etByBcp.length).toBeGreaterThan(0);
    expect(ekkByBcp.length).toBeGreaterThan(0);
    expect(etByBcp.ids).toEqual(expect.arrayContaining(ekkByBcp.ids));

    const faByBcp = db.getByBcp47('fa');
    const pesByBcp = db.getByBcp47('pes');
    expect(faByBcp.length).toBeGreaterThan(0);
    expect(pesByBcp.length).toBeGreaterThan(0);
    expect(faByBcp.ids).toEqual(expect.arrayContaining(pesByBcp.ids));

    // 3. QueryBuilder bridging
    expect(db.query().iso('fr').all().ids).toEqual(db.query().iso('fra').all().ids);
    expect(db.query().bcp47('fr').all().ids).toEqual(db.query().bcp47('fra').all().ids);

    // 4. hasLanguage checks
    expect(db.hasLanguage('fr')).toBe(true);
    expect(db.hasLanguage('fra')).toBe(true);
    expect(db.hasLanguage('et')).toBe(true);
    expect(db.hasLanguage('ekk')).toBe(true);

    // 5. findByLanguage precision (no substring false positives on autonyms for 2-letter queries)
    const neVids = db.findByLanguage('ne');
    expect(neVids.length).toBeGreaterThan(0);
    expect(neVids.length).toBeLessThan(10); // should not match Indonesian/Japanese autonyms
  });

  it('should lookup by Glottocode, including dialect nodes through their parent language', () => {
    const queByGlotto = db.getByGlottocode('cusc1236');
    expect(queByGlotto.length).toBeGreaterThan(0);
    expect(queByGlotto.ids).toContain('nXBPa_wb3dM');

    // Brazilian Portuguese is a dialect node (braz1246) under Portuguese (port1283)
    const brazilian = db.getByGlottocode('braz1246');
    expect(brazilian.ids).toContain('qpfxFvpLAJ8');
    const portuguese = db.getByGlottocode('port1283');
    expect(portuguese.ids).toContain('qpfxFvpLAJ8');
    expect(portuguese.length).toBeGreaterThan(brazilian.length);
    expect(db.query().glottocode('port1283').all().ids).toContain('qpfxFvpLAJ8');
  });

  it('should expose the three resolved standards on every language (CLASSIFICATION_RULES.md §5)', () => {
    const brazilian = db.get('qpfxFvpLAJ8')!.primaryLanguage;
    expect(brazilian.standards.iso639_3).toMatchObject({ code: 'por', name: 'Portuguese', scope: 'I', part1: 'pt' });
    expect(brazilian.standards.glottolog).toMatchObject({
      code: 'braz1246',
      name: 'Brazilian Portuguese',
      level: 'dialect',
      parentLanguageId: 'port1283',
      familyId: 'indo1319',
    });
    expect(brazilian.standards.bcp47).toMatchObject({ tag: 'pt-BR', primarySubtag: 'pt', regionSubtag: 'BR', variantSubtags: [] });
    expect(brazilian.wikitonguesClassification).toBe('Brazilian Portuguese');
    expect(brazilian.speakerClaim).toBeNull();
    expect(brazilian.name).toBe('Brazilian Portuguese');
    expect(brazilian.iso639_3).toBe('por');
    expect(brazilian.bcp47).toBe('pt-BR');
    expect(brazilian.glottocode).toBe('braz1246');

    const cusco = db.get('nXBPa_wb3dM')!.primaryLanguage;
    expect(cusco.standards.glottolog).toMatchObject({ code: 'cusc1236', level: 'language' });
    expect(cusco.standards.bcp47.tag).toBe('quz');

    const arberesh = db.get('lstcnY-UXbs')!.primaryLanguage;
    expect(arberesh.standards.bcp47.tag).toBe('aae'); // no region: Arbëreshë is only spoken in Italy
    expect(arberesh.autonym).toBe('Arbërisht');

    const jerriais = db.get('PeZHJcQYt3c')!.primaryLanguage;
    expect(jerriais.wikitonguesClassification).toBe('Jèrriais');
    expect(jerriais.wikitonguesLineage).toBe('Norman Romance');
    expect(jerriais.standards.iso639_3.code).toBe('nrf');

    const valencian = db.get('mygnGGT679A')!.primaryLanguage;
    expect(valencian.standards.bcp47).toMatchObject({ tag: 'ca-valencia', variantSubtags: ['valencia'] });
    expect(valencian.standards.bcp47.regionSubtag).toBeUndefined();

    expect(brazilian.toDict()).toEqual({
      standards: { iso639_3: 'por', glottocode: 'braz1246', bcp47: 'pt-BR' },
      speaker_claim: null,
      wikitongues_classification: 'Brazilian Portuguese',
      wikitongues_lineage: null,
      autonym: 'Português',
    });
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

  it('should find by autonym, Wikitongues classification, Glottolog name and ISO name', () => {
    // Autonym: Asụsụ Igbo
    const igbo = db.findByLanguage('Asụsụ Igbo');
    expect(igbo.length).toBeGreaterThan(0);
    expect(igbo.ids).toContain('HQcLp1qnjHU');

    // Autonym: Qhichwa
    const quechua = db.findByLanguage('Qhichwa');
    expect(quechua.length).toBeGreaterThan(0);

    // Autonym (accent-insensitive): Arbërisht
    const arberesh = db.findByLanguage('Arberisht');
    expect(arberesh.length).toBeGreaterThan(0);
    expect(arberesh.ids).toContain('lstcnY-UXbs');

    // Wikitongues classification: Sorani (ISO name is "Central Kurdish")
    const sorani = db.findByLanguage('Sorani');
    expect(sorani.length).toBeGreaterThan(0);
    expect(sorani.ids).toContain('mORCaQbggIo');

    // ISO reference name: Central Kurdish
    const centralKurdish = db.findByLanguage('Central Kurdish');
    expect(centralKurdish.ids).toContain('mORCaQbggIo');

    // Glottolog node name: Cocama-Cocamilla (Wikitongues says "Kukama")
    const kukama = db.findByLanguage('Cocama-Cocamilla');
    expect(kukama.length).toBeGreaterThan(0);
    expect(kukama.ids).toContain('cxiGMkEZvKQ');

    // Glottolog dialect name: Québécois
    const quebecois = db.findByLanguage('Québécois');
    expect(quebecois.ids).toContain('kAenLJSfNWM');
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
    expect(topLang.iso_name).toBeTruthy();
    expect(topLang.video_count).toBeGreaterThanOrEqual(languages[1].video_count);

    const portuguese = languages.find((l) => l.iso639_3 === 'por')!;
    expect(portuguese.iso_name).toBe('Portuguese');
    expect(portuguese.bcp47_tags).toEqual(expect.arrayContaining(['pt', 'pt-BR']));
    expect(portuguese.glottocodes).toEqual(expect.arrayContaining(['port1283', 'braz1246']));
    expect(portuguese.glottolog_names).toContain('Brazilian Portuguese');
    expect(portuguese.wikitongues_classifications).toContain('Brazilian Portuguese');

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
          standards: { iso639_3: 'eus', glottocode: 'bisc1236', bcp47: 'eu-biscayan' },
          speaker_claim: 'Euskera',
          wikitongues_classification: 'Biscayan',
          wikitongues_lineage: null,
          autonym: 'Euskara',
        },
        additional_languages: [],
        speakers: [{ name: 'Miren', role: 'native' }],
        provenance: { country_code: 'ES', country_name: 'Spain' },
      },
    ];

    const customDb = WikitonguesDB.fromRecords(customRecords);
    expect(customDb.length).toBe(1);
    const lang = customDb.get('vid_test_001')!.primaryLanguage;
    expect(lang.name).toBe('Biscayan');
    expect(lang.standards.glottolog).toMatchObject({ name: 'Biscayan', level: 'dialect', parentLanguageId: 'basq1248' });
    expect(lang.standards.bcp47.variantSubtags).toEqual(['biscayan']);
    expect(customDb.findByLanguage('basque').length).toBe(1); // ISO reference name
    expect(customDb.findByLanguage('euskera').length).toBe(1); // speaker claim & alias
    expect(customDb.findByLanguage('Euskara').length).toBe(1); // autonym
    expect(customDb.findByLanguage('Biscayan').length).toBe(1); // Wikitongues classification
    expect(customDb.getByGlottocode('basq1248').length).toBe(1); // parent language node

    const fromJsonDb = WikitonguesDB.fromJSON(JSON.stringify(customRecords));
    expect(fromJsonDb.length).toBe(1);
    expect(fromJsonDb.get('vid_test_001')?.primaryLanguage.iso639_3).toBe('eus');
  });
});
