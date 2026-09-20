/**
 * Fluent QueryBuilder for Wikitongues Database.
 * Enables expressive, composable, and chainable querying over Wikitongues records.
 */

import { Video, Language } from './models';
import { VideoCollection } from './collection';
import { LanguageResolver, normalizeText } from './resolver';

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class QueryBuilder {
  private readonly _sourceVideos: readonly Video[];
  private readonly _resolver?: LanguageResolver;
  private _filters: Array<(video: Video) => boolean> = [];
  private _sortKey: string | ((video: Video) => any) | null = null;
  private _sortDescending: boolean = false;
  private _limitVal: number | null = null;
  private _offsetVal: number | null = null;

  constructor(videos: readonly Video[], resolver?: LanguageResolver) {
    this._sourceVideos = videos;
    this._resolver = resolver;
  }

  public clone(): QueryBuilder {
    const cloned = new QueryBuilder(this._sourceVideos, this._resolver);
    cloned._filters = [...this._filters];
    cloned._sortKey = this._sortKey;
    cloned._sortDescending = this._sortDescending;
    cloned._limitVal = this._limitVal;
    cloned._offsetVal = this._offsetVal;
    return cloned;
  }

  // -------------------------------------------------------------------------
  // Filtering Methods
  // -------------------------------------------------------------------------

  public language(query: string, includeAdditional: boolean = true): this {
    if (!query || !query.trim()) return this;

    const raw = query.trim();
    const rawLower = raw.toLowerCase();
    const norm = normalizeText(raw);
    const matchedIsos = this._resolver ? this._resolver.resolve(raw) : new Set<string>();

    const pattern = norm ? new RegExp(`\\b${escapeRegex(norm)}\\b`, 'i') : null;

    const matchLangObj = (lang: Language): boolean => {
      const lIso = lang.iso639_3.toLowerCase();
      if (matchedIsos.has(lIso) || lIso === rawLower) {
        return true;
      }

      const part1 = lang.standards.iso639_3.part1?.toLowerCase();
      if (part1 && (matchedIsos.has(part1) || part1 === rawLower)) {
        return true;
      }

      const macro = lang.standards.bcp47.macrolanguage?.toLowerCase();
      if (macro && (matchedIsos.has(macro) || macro === rawLower)) {
        return true;
      }

      const lBcp = lang.bcp47.toLowerCase();
      if (lBcp === rawLower || lBcp.startsWith(`${rawLower}-`)) {
        return true;
      }

      if (lang.glottocode === rawLower || lang.standards.glottolog.parentLanguageId === rawLower) {
        return true;
      }

      if (norm) {
        for (const label of lang.labels) {
          const lNorm = normalizeText(label);
          if (lNorm === norm || (pattern && pattern.test(lNorm))) return true;
        }
        const autoLower = lang.autonym.toLowerCase();
        if (autoLower === rawLower) return true;
        if (rawLower.length >= 4 && autoLower.includes(rawLower)) return true;
      }

      return false;
    };

    const predicate = (video: Video): boolean => {
      if (matchLangObj(video.primaryLanguage)) {
        return true;
      }
      if (includeAdditional) {
        for (const al of video.additionalLanguages) {
          if (matchLangObj(al)) {
            return true;
          }
        }
      }
      return false;
    };

    this._filters.push(predicate);
    return this;
  }

  public iso(code: string, includeAdditional: boolean = true): this {
    const codeClean = code.trim().toLowerCase();
    const predicate = (v: Video): boolean => {
      const matchIso = (l: Language): boolean => {
        if (l.iso639_3.toLowerCase() === codeClean) return true;
        if (l.standards.iso639_3.part1?.toLowerCase() === codeClean) return true;
        if (l.standards.bcp47.macrolanguage?.toLowerCase() === codeClean) return true;
        return false;
      };
      if (matchIso(v.primaryLanguage)) {
        return true;
      }
      if (includeAdditional) {
        return v.additionalLanguages.some(matchIso);
      }
      return false;
    };
    this._filters.push(predicate);
    return this;
  }

  public bcp47(tag: string, exact: boolean = false): this {
    const tagClean = tag.trim().toLowerCase();
    const predicate = (v: Video): boolean => {
      for (const lang of v.allLanguages) {
        const lTag = lang.bcp47.toLowerCase();
        const lIso = lang.iso639_3.toLowerCase();
        const part1 = lang.standards.iso639_3.part1?.toLowerCase();
        const macro = lang.standards.bcp47.macrolanguage?.toLowerCase();

        if (exact) {
          if (lTag === tagClean || lIso === tagClean || part1 === tagClean || macro === tagClean) return true;
        } else {
          if (
            lTag === tagClean ||
            lTag.startsWith(`${tagClean}-`) ||
            lIso === tagClean ||
            part1 === tagClean ||
            macro === tagClean
          ) return true;
        }
      }
      return false;
    };
    this._filters.push(predicate);
    return this;
  }

  public glottocode(code: string): this {
    const codeClean = code.trim().toLowerCase();
    const predicate = (v: Video): boolean => {
      return v.allLanguages.some(
        (lang) => lang.glottocode === codeClean || lang.standards.glottolog.parentLanguageId === codeClean
      );
    };
    this._filters.push(predicate);
    return this;
  }

  public country(countryCodeOrName: string): this {
    const cClean = countryCodeOrName.trim();
    const cNorm = normalizeText(cClean);
    const isAlpha2 = cClean.length === 2 && /^[a-zA-Z]+$/.test(cClean);
    const pattern = cNorm ? new RegExp(`\\b${escapeRegex(cNorm)}\\b`, 'i') : null;

    const predicate = (v: Video): boolean => {
      if (isAlpha2 && v.countryCode && v.countryCode.toUpperCase() === cClean.toUpperCase()) {
        return true;
      }
      if (v.countryName) {
        const vCnameNorm = normalizeText(v.countryName);
        if (vCnameNorm === cNorm || (pattern && pattern.test(vCnameNorm))) {
          return true;
        }
      }
      return false;
    };

    this._filters.push(predicate);
    return this;
  }

  public speaker(options: {
    name?: string;
    role?: string;
    origin?: string;
  }): this {
    const nameNorm = options.name ? normalizeText(options.name) : null;
    const roleNorm = options.role ? options.role.trim().toLowerCase() : null;
    const originNorm = options.origin ? normalizeText(options.origin) : null;

    const predicate = (v: Video): boolean => {
      for (const sp of v.speakers) {
        let matched = true;
        if (nameNorm && !normalizeText(sp.name).includes(nameNorm)) {
          matched = false;
        }
        if (roleNorm && sp.role.toLowerCase() !== roleNorm) {
          matched = false;
        }
        if (originNorm && !normalizeText(sp.origin || '').includes(originNorm)) {
          matched = false;
        }
        if (matched) return true;
      }
      return false;
    };

    this._filters.push(predicate);
    return this;
  }

  public contentType(...types: string[]): this {
    const allowed = new Set(types.map((t) => t.toLowerCase().trim()));
    this._filters.push((v) => allowed.has(v.contentType.toLowerCase()));
    return this;
  }

  public license(...licenses: string[]): this {
    const allowed = new Set(licenses);
    this._filters.push((v) => allowed.has(v.license));
    return this;
  }

  public creativeCommonsOnly(): this {
    this._filters.push((v) => v.isCreativeCommons);
    return this;
  }

  public withSubtitles(lang?: string): this {
    if (lang) {
      const lClean = lang.trim().toLowerCase();
      this._filters.push(
        (v) =>
          v.transcription.hasSubtitles &&
          v.transcription.availableSubtitles.some((s) => s.toLowerCase() === lClean)
      );
    } else {
      this._filters.push((v) => v.transcription.hasSubtitles);
    }
    return this;
  }

  public withoutSubtitles(): this {
    this._filters.push((v) => !v.transcription.hasSubtitles);
    return this;
  }

  public minDuration(seconds: number): this {
    this._filters.push((v) => v.durationSeconds >= seconds);
    return this;
  }

  public maxDuration(seconds: number): this {
    this._filters.push((v) => v.durationSeconds <= seconds);
    return this;
  }

  public durationBetween(minSeconds: number, maxSeconds: number): this {
    this._filters.push(
      (v) => v.durationSeconds >= minSeconds && v.durationSeconds <= maxSeconds
    );
    return this;
  }

  public uploadedAfter(dateStr: string): this {
    this._filters.push((v) => v.uploadDate >= dateStr);
    return this;
  }

  public uploadedBefore(dateStr: string): this {
    this._filters.push((v) => v.uploadDate <= dateStr);
    return this;
  }

  public uploadedBetween(startDate: string, endDate: string): this {
    this._filters.push((v) => v.uploadDate >= startDate && v.uploadDate <= endDate);
    return this;
  }

  public recordedBy(name: string): this {
    const normName = normalizeText(name);
    this._filters.push((v) =>
      normalizeText(v.provenance.recordedBy || '').includes(normName)
    );
    return this;
  }

  public filter(predicate: (video: Video) => boolean): this {
    this._filters.push(predicate);
    return this;
  }

  // -------------------------------------------------------------------------
  // Sorting & Slicing
  // -------------------------------------------------------------------------

  public orderBy(
    key: string | ((video: Video) => any),
    descending: boolean = false
  ): this {
    this._sortKey = key;
    this._sortDescending = descending;
    return this;
  }

  public limit(n: number): this {
    this._limitVal = n;
    return this;
  }

  public offset(n: number): this {
    this._offsetVal = n;
    return this;
  }

  public page(page: number = 1, pageSize: number = 20): this {
    const pageNum = Math.max(1, page);
    this._offsetVal = (pageNum - 1) * pageSize;
    this._limitVal = pageSize;
    return this;
  }

  // -------------------------------------------------------------------------
  // Execution Methods
  // -------------------------------------------------------------------------

  public all(): VideoCollection {
    const matched = this._sourceVideos.filter((v) =>
      this._filters.every((f) => f(v))
    );

    let results = new VideoCollection(matched);

    if (this._sortKey !== null) {
      results = results.sortBy(this._sortKey, this._sortDescending);
    }

    if (this._offsetVal !== null) {
      results = results.offset(this._offsetVal);
    }

    if (this._limitVal !== null) {
      results = results.limit(this._limitVal);
    }

    return results;
  }

  public first(): Video | null {
    for (const v of this._sourceVideos) {
      if (this._filters.every((f) => f(v))) {
        return v;
      }
    }
    return null;
  }

  public last(): Video | null {
    return this.all().last();
  }

  public count(): number {
    let cnt = 0;
    for (const v of this._sourceVideos) {
      if (this._filters.every((f) => f(v))) {
        cnt++;
      }
    }
    return cnt;
  }

  public exists(): boolean {
    return this.first() !== null;
  }

  public random(n: number = 1, seed?: number): VideoCollection {
    return this.all().sample(n, seed);
  }
}
