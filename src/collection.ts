/**
 * VideoCollection container for rich query results, aggregations, and transformations.
 */

import { Video, Language, Speaker } from './models';
import { VideoData } from './types';

// Simple seeded pseudo-random generator (Linear Congruential Generator / Mulberry32)
function createSeededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class VideoCollection implements Iterable<Video> {
  protected readonly _videos: Video[];

  constructor(videos: Video[] | readonly Video[] = []) {
    this._videos = [...videos];
  }

  public [Symbol.iterator](): Iterator<Video> {
    return this._videos[Symbol.iterator]();
  }

  public get length(): number {
    return this._videos.length;
  }

  public get(index: number): Video | undefined {
    return this._videos[index];
  }

  public at(index: number): Video | undefined {
    return this._videos.at(index);
  }

  public toArray(): Video[] {
    return [...this._videos];
  }

  public slice(start?: number, end?: number): VideoCollection {
    return new VideoCollection(this._videos.slice(start, end));
  }

  public includes(item: Video | string): boolean {
    if (typeof item === 'string') {
      return this._videos.some((v) => v.id === item);
    }
    return this._videos.some((v) => v.id === item.id);
  }

  // -------------------------------------------------------------------------
  // Aggregation & Summary Properties
  // -------------------------------------------------------------------------

  public get isEmpty(): boolean {
    return this._videos.length === 0;
  }

  public get ids(): string[] {
    return this._videos.map((v) => v.id);
  }

  public get urls(): string[] {
    return this._videos.map((v) => v.url);
  }

  public get embedUrls(): string[] {
    return this._videos.map((v) => v.embedUrl);
  }

  public get titles(): string[] {
    return this._videos.map((v) => v.title);
  }

  public get totalDurationSeconds(): number {
    return this._videos.reduce((acc, v) => acc + v.durationSeconds, 0);
  }

  public get totalDurationFormatted(): string {
    const total = this.totalDurationSeconds;
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    const parts: string[] = [];
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0 || hours > 0) {
      parts.push(`${minutes}m`);
    }
    parts.push(`${seconds}s`);
    return parts.join(' ');
  }

  public get averageDurationSeconds(): number {
    if (this._videos.length === 0) return 0;
    return this.totalDurationSeconds / this._videos.length;
  }

  public get isoCodes(): string[] {
    const seen = new Set<string>();
    const codes: string[] = [];
    for (const v of this._videos) {
      const code = v.primaryLanguage.iso639_3;
      if (code && !seen.has(code)) {
        seen.add(code);
        codes.push(code);
      }
    }
    return codes;
  }

  public get bcp47Codes(): string[] {
    const seen = new Set<string>();
    const codes: string[] = [];
    for (const v of this._videos) {
      const bcp = v.primaryLanguage.bcp47;
      if (bcp && !seen.has(bcp)) {
        seen.add(bcp);
        codes.push(bcp);
      }
    }
    return codes;
  }

  public get languageNames(): string[] {
    const seen = new Set<string>();
    const names: string[] = [];
    for (const v of this._videos) {
      const name = v.primaryLanguage.name;
      if (name && !seen.has(name)) {
        seen.add(name);
        names.push(name);
      }
    }
    return names;
  }

  public get languages(): Language[] {
    const seen = new Set<string>();
    const list: Language[] = [];
    for (const v of this._videos) {
      const iso = v.primaryLanguage.iso639_3;
      if (iso && !seen.has(iso)) {
        seen.add(iso);
        list.push(v.primaryLanguage);
      }
    }
    return list;
  }

  public get countries(): string[] {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const v of this._videos) {
      const cc = v.countryCode;
      if (cc && !seen.has(cc)) {
        seen.add(cc);
        list.push(cc);
      }
    }
    return list;
  }

  public get speakers(): Speaker[] {
    const result: Speaker[] = [];
    for (const v of this._videos) {
      result.push(...v.speakers);
    }
    return result;
  }

  public get speakerNames(): string[] {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const v of this._videos) {
      for (const spName of v.speakerNames) {
        if (!seen.has(spName)) {
          seen.add(spName);
          list.push(spName);
        }
      }
    }
    return list;
  }

  // -------------------------------------------------------------------------
  // Chainable Transformations & Navigation
  // -------------------------------------------------------------------------

  public first(): Video | null {
    return this._videos.length > 0 ? this._videos[0] : null;
  }

  public last(): Video | null {
    return this._videos.length > 0 ? this._videos[this._videos.length - 1] : null;
  }

  public sample(k: number = 1, seed?: number): VideoCollection {
    if (this._videos.length === 0) {
      return new VideoCollection([]);
    }
    const sampleSize = Math.min(k, this._videos.length);
    const rng = seed !== undefined ? createSeededRandom(seed) : Math.random;

    // Fisher-Yates shuffle on copy
    const pool = [...this._videos];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return new VideoCollection(pool.slice(0, sampleSize));
  }

  public filter(predicate: (video: Video, index: number) => boolean): VideoCollection {
    return new VideoCollection(this._videos.filter(predicate));
  }

  public sortBy(
    key: string | ((video: Video) => any),
    descending: boolean = false
  ): VideoCollection {
    let keyFn: (video: Video) => any;

    if (typeof key === 'function') {
      keyFn = key;
    } else if (key === 'duration' || key === 'duration_seconds') {
      keyFn = (v) => v.durationSeconds;
    } else if (key === 'upload_date' || key === 'date') {
      keyFn = (v) => v.uploadDate;
    } else if (key === 'language' || key === 'language_name') {
      keyFn = (v) => v.primaryLanguage.name.toLowerCase();
    } else if (key === 'iso' || key === 'iso639_3') {
      keyFn = (v) => v.primaryLanguage.iso639_3;
    } else if (key === 'country' || key === 'country_code') {
      keyFn = (v) => v.countryCode || '';
    } else if (key === 'title') {
      keyFn = (v) => v.title.toLowerCase();
    } else {
      keyFn = (v) => (v as any)[key] ?? '';
    }

    const sorted = [...this._videos].sort((a, b) => {
      const valA = keyFn(a);
      const valB = keyFn(b);
      if (valA < valB) return descending ? 1 : -1;
      if (valA > valB) return descending ? -1 : 1;
      return 0;
    });

    return new VideoCollection(sorted);
  }

  public limit(n: number): VideoCollection {
    return new VideoCollection(this._videos.slice(0, n));
  }

  public offset(n: number): VideoCollection {
    return new VideoCollection(this._videos.slice(n));
  }

  public page(page: number = 1, pageSize: number = 20): VideoCollection {
    const pageNum = Math.max(1, page);
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    return new VideoCollection(this._videos.slice(start, end));
  }

  public groupBy(key: string | ((video: Video) => string)): Record<string, VideoCollection> {
    let keyFn: (video: Video) => string;

    if (typeof key === 'function') {
      keyFn = key;
    } else if (key === 'language' || key === 'iso' || key === 'iso639_3') {
      keyFn = (v) => v.primaryLanguage.iso639_3 || 'Unknown';
    } else if (key === 'country' || key === 'country_code') {
      keyFn = (v) => v.countryCode || 'Unknown';
    } else if (key === 'license') {
      keyFn = (v) => v.license || 'Unknown';
    } else if (key === 'content_type') {
      keyFn = (v) => v.contentType || 'Unknown';
    } else {
      keyFn = (v) => String((v as any)[key] || 'Unknown');
    }

    const groups: Record<string, Video[]> = {};
    for (const v of this._videos) {
      const gKey = keyFn(v);
      if (!groups[gKey]) {
        groups[gKey] = [];
      }
      groups[gKey].push(v);
    }

    const result: Record<string, VideoCollection> = {};
    for (const [k, vids] of Object.entries(groups)) {
      result[k] = new VideoCollection(vids);
    }
    return result;
  }

  // -------------------------------------------------------------------------
  // Export & Serialization
  // -------------------------------------------------------------------------

  public toDicts(): VideoData[] {
    return this._videos.map((v) => v.toDict());
  }

  public toJSON(indent: number = 2): string {
    return JSON.stringify(this.toDicts(), null, indent);
  }

  public toJSONL(): string {
    return this._videos.map((v) => v.toJSON()).join('\n') + (this._videos.length > 0 ? '\n' : '');
  }

  public toCSV(): string {
    const headers = [
      'id',
      'url',
      'title',
      'duration_seconds',
      'duration_formatted',
      'upload_date',
      'license',
      'content_type',
      'iso639_3',
      'iso_name',
      'bcp47',
      'glottocode',
      'glottolog_name',
      'glottolog_level',
      'wikitongues_classification',
      'wikitongues_lineage',
      'speaker_claim',
      'autonym',
      'country_code',
      'country_name',
      'has_subtitles',
      'speakers',
    ];

    const rows = this._videos.map((v) => {
      const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;
      return [
        v.id,
        v.url,
        escape(v.title),
        v.durationSeconds,
        v.durationFormatted,
        v.uploadDate,
        v.license,
        v.contentType,
        v.primaryLanguage.iso639_3,
        escape(v.primaryLanguage.standards.iso639_3.name),
        v.primaryLanguage.bcp47,
        v.primaryLanguage.glottocode,
        escape(v.primaryLanguage.standards.glottolog.name),
        v.primaryLanguage.standards.glottolog.level,
        escape(v.primaryLanguage.wikitonguesClassification),
        escape(v.primaryLanguage.wikitonguesLineage ?? ''),
        escape(v.primaryLanguage.speakerClaim ?? ''),
        escape(v.primaryLanguage.autonym),
        v.countryCode || '',
        escape(v.countryName || ''),
        v.transcription.hasSubtitles,
        escape(v.speakerNames.join(', ')),
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }
}
