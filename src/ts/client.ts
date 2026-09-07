/**
 * High-Level Client for the Wikitongues Database.
 * Provides instant O(1) lookups, fluent querying, full-text search, discovery, and analytics.
 */

import { Video } from './models';
import { VideoCollection } from './collection';
import { LanguageResolver, normalizeText } from './resolver';
import { DatasetIndex } from './index-engine';
import { SearchEngine } from './search';
import { QueryBuilder } from './query';
import { dataset as bundledDataset } from './dataset';
import {
  VideoData,
  FilterOptions,
  LanguageSummary,
  CountrySummary,
  SpeakerSummary,
  DatasetStats,
} from './types';

export interface WikitonguesDBOptions {
  data?: (VideoData | Video)[];
  records?: (VideoData | Video)[];
}

export class WikitonguesDB {
  protected readonly _videos: Video[] = [];
  public readonly resolver: LanguageResolver;
  public readonly index: DatasetIndex;
  public readonly searchEngine: SearchEngine;

  constructor(options?: WikitonguesDBOptions) {
    this.resolver = new LanguageResolver();

    const rawRecords = options?.data || options?.records || bundledDataset;

    for (const record of rawRecords) {
      const video = record instanceof Video ? record : Video.fromDict(record);
      this._videos.push(video);

      // Register language entities into resolver
      const pl = video.primaryLanguage;
      this.resolver.registerDatasetLanguage(
        pl.iso639_3,
        pl.bcp47,
        pl.name,
        pl.glottocode,
        pl.autonym,
        pl.dialect
      );

      for (const al of video.additionalLanguages) {
        this.resolver.registerDatasetLanguage(
          al.iso639_3,
          al.bcp47,
          al.name,
          al.glottocode,
          al.autonym,
          al.dialect
        );
      }
    }

    this.index = new DatasetIndex(this._videos);
    this.searchEngine = new SearchEngine(this._videos, this.resolver);
  }

  public get length(): number {
    return this._videos.length;
  }

  // -------------------------------------------------------------------------
  // Static Factory Methods
  // -------------------------------------------------------------------------

  /**
   * Create a WikitonguesDB instance directly from an in-memory list of dicts or Videos.
   */
  public static fromRecords(records: (VideoData | Video)[]): WikitonguesDB {
    return new WikitonguesDB({ records });
  }

  /**
   * Create a WikitonguesDB instance from a JSON string or JSON array.
   */
  public static fromJSON(json: string | VideoData[]): WikitonguesDB {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    return new WikitonguesDB({ data });
  }

  /**
   * Create a WikitonguesDB instance from a JSON or JSONL file path (Node.js environments).
   */
  public static fromFile(filepath: string): WikitonguesDB {
    // Dynamic require for node fs to remain browser-compatible if bundled
    try {
      const fs = require('fs');
      const content = fs.readFileSync(filepath, 'utf-8');
      const trimmed = content.trim();
      let records: VideoData[] = [];
      if (trimmed.startsWith('[')) {
        records = JSON.parse(trimmed);
      } else {
        records = trimmed
          .split('\n')
          .filter((line: string) => line.trim())
          .map((line: string) => JSON.parse(line));
      }
      return new WikitonguesDB({ data: records });
    } catch (err: any) {
      throw new Error(`Failed to load dataset from file '${filepath}': ${err.message}`);
    }
  }

  // -------------------------------------------------------------------------
  // Direct Lookups (O(1))
  // -------------------------------------------------------------------------

  /**
   * Lookup a video by its YouTube ID in O(1) time.
   */
  public get(videoId: string): Video | null {
    return this.index.byId.get(videoId.trim()) || null;
  }

  /**
   * Lookup videos matching a 3-letter SIL ISO 639-3 code in O(1) time.
   */
  public getByIso(code: string): VideoCollection {
    const list = this.index.byIso.get(code.trim().toLowerCase());
    return new VideoCollection(list || []);
  }

  /**
   * Lookup videos matching a BCP 47 language tag in O(1) time.
   */
  public getByBcp47(tag: string): VideoCollection {
    const list = this.index.byBcp47.get(tag.trim().toLowerCase());
    return new VideoCollection(list || []);
  }

  /**
   * Lookup videos matching a Glottolog code in O(1) time.
   */
  public getByGlottocode(glottocode: string): VideoCollection {
    const list = this.index.byGlottocode.get(glottocode.trim().toLowerCase());
    return new VideoCollection(list || []);
  }

  /**
   * Lookup videos matching an ISO 3166-1 alpha-2 code or country name in O(1) time.
   */
  public getByCountry(countryCodeOrName: string): VideoCollection {
    const c = countryCodeOrName.trim();
    if (c.length === 2 && this.index.byCountryCode.has(c.toUpperCase())) {
      return new VideoCollection(this.index.byCountryCode.get(c.toUpperCase()) || []);
    }
    const normName = normalizeText(c);
    if (this.index.byCountryName.has(normName)) {
      return new VideoCollection(this.index.byCountryName.get(normName) || []);
    }
    return this.query().country(c).all();
  }

  /**
   * Lookup videos for a given speaker name.
   */
  public getBySpeaker(name: string): VideoCollection {
    const normName = normalizeText(name);
    if (this.index.bySpeakerName.has(normName)) {
      return new VideoCollection(this.index.bySpeakerName.get(normName) || []);
    }
    return this.query().speaker({ name }).all();
  }

  // -------------------------------------------------------------------------
  // Smart Lookups & Shortcut Queries
  // -------------------------------------------------------------------------

  /**
   * Intelligent language search: resolves natural names, multilingual aliases ('russe'),
   * ISO 639-3 ('rus'), BCP 47 ('ru'), autonyms ('Русский'), and dialects.
   */
  public findByLanguage(
    languageQuery: string,
    includeAdditional: boolean = true
  ): VideoCollection {
    return this.query()
      .language(languageQuery, includeAdditional)
      .all();
  }

  /**
   * Shortcut method to filter videos by common criteria.
   */
  public find(filters: FilterOptions = {}): VideoCollection {
    const q = this.query();
    if (filters.language) q.language(filters.language);
    if (filters.country) q.country(filters.country);
    if (filters.speaker) q.speaker({ name: filters.speaker });
    if (filters.contentType) q.contentType(filters.contentType);
    if (filters.license) q.license(filters.license);
    if (filters.creativeCommons) q.creativeCommonsOnly();
    if (filters.subtitles === true) q.withSubtitles();
    else if (filters.subtitles === false) q.withoutSubtitles();
    if (filters.minDuration !== undefined) q.minDuration(filters.minDuration);
    if (filters.maxDuration !== undefined) q.maxDuration(filters.maxDuration);
    if (filters.limit !== undefined) q.limit(filters.limit);
    return q.all();
  }

  /**
   * Initialize a new fluent QueryBuilder.
   */
  public query(): QueryBuilder {
    return new QueryBuilder(this._videos, this.resolver);
  }

  /**
   * Execute weighted full-text search across all metadata.
   */
  public search(query: string, limit?: number): VideoCollection {
    return this.searchEngine.search(query, limit);
  }

  /**
   * Return all videos as a VideoCollection.
   */
  public all(): VideoCollection {
    return new VideoCollection(this._videos);
  }

  /**
   * Return n random videos, optionally filtered by criteria.
   */
  public random(
    n: number = 1,
    seed?: number,
    filters?: FilterOptions
  ): VideoCollection {
    if (filters && Object.keys(filters).length > 0) {
      return this.find(filters).sample(n, seed);
    }
    return this.all().sample(n, seed);
  }

  // -------------------------------------------------------------------------
  // Exploration & Aggregate Statistics
  // -------------------------------------------------------------------------

  /**
   * Return a structured inventory of all represented languages with summary metrics.
   */
  public languages(): LanguageSummary[] {
    const langMap = new Map<
      string,
      {
        iso639_3: string;
        bcp47: string;
        name: string;
        glottocode: string | null;
        autonyms: Set<string>;
        dialects: Set<string>;
        video_count: number;
        total_duration_seconds: number;
        countries: Set<string>;
      }
    >();

    for (const v of this._videos) {
      const pl = v.primaryLanguage;
      const iso = pl.iso639_3;
      if (!iso) continue;

      if (!langMap.has(iso)) {
        langMap.set(iso, {
          iso639_3: iso,
          bcp47: pl.bcp47,
          name: pl.name,
          glottocode: pl.glottocode,
          autonyms: new Set(),
          dialects: new Set(),
          video_count: 0,
          total_duration_seconds: 0,
          countries: new Set(),
        });
      }

      const entry = langMap.get(iso)!;
      entry.video_count += 1;
      entry.total_duration_seconds += v.durationSeconds;
      if (pl.autonym) entry.autonyms.add(pl.autonym);
      if (pl.dialect) entry.dialects.add(pl.dialect);
      if (v.countryCode) entry.countries.add(v.countryCode);
    }

    const result: LanguageSummary[] = [];
    for (const item of langMap.values()) {
      result.push({
        iso639_3: item.iso639_3,
        bcp47: item.bcp47,
        name: item.name,
        glottocode: item.glottocode,
        autonyms: Array.from(item.autonyms).sort(),
        dialects: Array.from(item.dialects).sort(),
        video_count: item.video_count,
        total_duration_seconds: item.total_duration_seconds,
        countries: Array.from(item.countries).sort(),
      });
    }

    return result.sort((a, b) => b.video_count - a.video_count);
  }

  /**
   * Return a structured inventory of all represented countries with summary metrics.
   */
  public countries(): CountrySummary[] {
    const countryMap = new Map<
      string,
      {
        country_code: string | null;
        country_name: string;
        video_count: number;
        languages: Set<string>;
      }
    >();

    for (const v of this._videos) {
      const cc = v.countryCode || 'ZZ';
      const cname = v.countryName || 'Unknown';

      if (!countryMap.has(cc)) {
        countryMap.set(cc, {
          country_code: cc !== 'ZZ' ? cc : null,
          country_name: cc !== 'ZZ' ? cname : 'Unknown',
          video_count: 0,
          languages: new Set(),
        });
      }

      const entry = countryMap.get(cc)!;
      entry.video_count += 1;
      if (v.primaryLanguage.iso639_3) {
        entry.languages.add(v.primaryLanguage.iso639_3);
      }
    }

    const result: CountrySummary[] = [];
    for (const item of countryMap.values()) {
      result.push({
        country_code: item.country_code,
        country_name: item.country_name,
        video_count: item.video_count,
        language_count: item.languages.size,
        languages: Array.from(item.languages).sort(),
      });
    }

    return result.sort((a, b) => b.video_count - a.video_count);
  }

  /**
   * Return a structured inventory of all speakers in the dataset.
   */
  public speakers(): SpeakerSummary[] {
    const speakerMap = new Map<
      string,
      {
        name: string;
        roles: Set<string>;
        origins: Set<string>;
        video_count: number;
        languages: Set<string>;
      }
    >();

    for (const v of this._videos) {
      for (const sp of v.speakers) {
        if (!sp.name || sp.name.toLowerCase() === 'unknown') {
          continue;
        }

        if (!speakerMap.has(sp.name)) {
          speakerMap.set(sp.name, {
            name: sp.name,
            roles: new Set(),
            origins: new Set(),
            video_count: 0,
            languages: new Set(),
          });
        }

        const entry = speakerMap.get(sp.name)!;
        entry.video_count += 1;
        if (sp.role) entry.roles.add(sp.role);
        if (sp.origin) entry.origins.add(sp.origin);
        if (v.primaryLanguage.iso639_3) {
          entry.languages.add(v.primaryLanguage.iso639_3);
        }
      }
    }

    const result: SpeakerSummary[] = [];
    for (const item of speakerMap.values()) {
      result.push({
        name: item.name,
        roles: Array.from(item.roles).sort(),
        origins: Array.from(item.origins).sort(),
        video_count: item.video_count,
        languages: Array.from(item.languages).sort(),
      });
    }

    return result.sort((a, b) => b.video_count - a.video_count);
  }

  /**
   * Compute aggregate dataset statistics.
   */
  public stats(): DatasetStats {
    const totalVideos = this._videos.length;
    const totalDuration = this._videos.reduce((acc, v) => acc + v.durationSeconds, 0);
    const uniqueIsos = new Set(
      this._videos
        .map((v) => v.primaryLanguage.iso639_3)
        .filter(Boolean)
    );
    const uniqueCountries = new Set(
      this._videos.map((v) => v.countryCode).filter(Boolean)
    );

    const licenseCounts: Record<string, number> = {};
    const contentTypeCounts: Record<string, number> = {};
    let subtitlesCount = 0;

    for (const v of this._videos) {
      licenseCounts[v.license] = (licenseCounts[v.license] || 0) + 1;
      contentTypeCounts[v.contentType] = (contentTypeCounts[v.contentType] || 0) + 1;
      if (v.transcription.hasSubtitles) {
        subtitlesCount += 1;
      }
    }

    const hours = totalDuration / 3600;

    return {
      total_videos: totalVideos,
      total_languages: uniqueIsos.size,
      total_countries: uniqueCountries.size,
      total_duration_seconds: totalDuration,
      total_duration_hours: Math.round(hours * 100) / 100,
      with_subtitles_count: subtitlesCount,
      with_subtitles_percentage:
        totalVideos > 0
          ? Math.round((subtitlesCount / totalVideos) * 1000) / 10
          : 0,
      licenses: licenseCounts,
      content_types: contentTypeCounts,
    };
  }
}
