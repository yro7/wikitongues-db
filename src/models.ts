/**
 * Domain models for the high-level Wikitongues Database API.
 * Provides typed, immutable-friendly classes with rich helper methods.
 */

import {
  LanguageData,
  SpeakerData,
  ProvenanceData,
  TranscriptionData,
  RawMetadataData,
  VideoData,
} from './types';
import { normalizeText } from './resolver';

export class Language {
  public readonly iso639_3: string;
  public readonly bcp47: string;
  public readonly name: string;
  public readonly glottocode: string | null;
  public readonly autonym: string | null;
  public readonly dialect: string | null;

  constructor(data: Partial<LanguageData>) {
    this.iso639_3 = data.iso639_3 || '';
    this.bcp47 = data.bcp47 || '';
    this.name = data.name || '';
    this.glottocode = data.glottocode ?? null;
    this.autonym = data.autonym ?? null;
    this.dialect = data.dialect ?? null;
  }

  public static fromDict(data: Partial<LanguageData>): Language {
    return new Language(data);
  }

  public toDict(): LanguageData {
    return {
      iso639_3: this.iso639_3,
      bcp47: this.bcp47,
      name: this.name,
      ...(this.glottocode ? { glottocode: this.glottocode } : {}),
      ...(this.autonym ? { autonym: this.autonym } : {}),
      ...(this.dialect ? { dialect: this.dialect } : {}),
    };
  }
}

export class Speaker {
  public readonly name: string;
  public readonly role: string;
  public readonly origin: string | null;

  constructor(data: Partial<SpeakerData>) {
    this.name = data.name || '';
    this.role = data.role || 'native';
    this.origin = data.origin ?? null;
  }

  public static fromDict(data: Partial<SpeakerData>): Speaker {
    return new Speaker(data);
  }

  public toDict(): SpeakerData {
    return {
      name: this.name,
      role: this.role,
      ...(this.origin ? { origin: this.origin } : {}),
    };
  }
}

export class Provenance {
  public readonly countryCode: string | null;
  public readonly countryName: string | null;
  public readonly region: string | null;
  public readonly city: string | null;
  public readonly recordedBy: string | null;
  public readonly recordingDate: string | null;

  constructor(data?: Partial<ProvenanceData> | null) {
    this.countryCode = data?.country_code ?? null;
    this.countryName = data?.country_name ?? null;
    this.region = data?.region ?? null;
    this.city = data?.city ?? null;
    this.recordedBy = data?.recorded_by ?? null;
    this.recordingDate = data?.recording_date ?? null;
  }

  public static fromDict(data?: Partial<ProvenanceData> | null): Provenance {
    return new Provenance(data);
  }

  public toDict(): ProvenanceData {
    return {
      country_code: this.countryCode,
      country_name: this.countryName,
      region: this.region,
      city: this.city,
      recorded_by: this.recordedBy,
      recording_date: this.recordingDate,
    };
  }
}

export class Transcription {
  public readonly hasSubtitles: boolean;
  public readonly availableSubtitles: string[];
  public readonly nativeText: string | null;
  public readonly englishTranslation: string | null;

  constructor(data?: Partial<TranscriptionData> | null) {
    this.hasSubtitles = Boolean(data?.has_subtitles);
    this.availableSubtitles = Array.isArray(data?.available_subtitles)
      ? [...data.available_subtitles]
      : [];
    this.nativeText = data?.native_text ?? null;
    this.englishTranslation = data?.english_translation ?? null;
  }

  public static fromDict(data?: Partial<TranscriptionData> | null): Transcription {
    return new Transcription(data);
  }

  public toDict(): TranscriptionData {
    return {
      has_subtitles: this.hasSubtitles,
      available_subtitles: [...this.availableSubtitles],
      native_text: this.nativeText,
      english_translation: this.englishTranslation,
    };
  }
}

export class RawMetadata {
  public readonly title: string;
  public readonly tags: string[];

  constructor(data?: Partial<RawMetadataData> | null) {
    this.title = data?.title || '';
    this.tags = Array.isArray(data?.tags) ? [...data.tags] : [];
  }

  public static fromDict(data?: Partial<RawMetadataData> | null): RawMetadata {
    return new RawMetadata(data);
  }

  public toDict(): RawMetadataData {
    return {
      title: this.title,
      tags: [...this.tags],
    };
  }
}

export class Video {
  public readonly id: string;
  public readonly url: string;
  public readonly durationSeconds: number;
  public readonly uploadDate: string;
  public readonly license: string;
  public readonly contentType: string;
  public readonly primaryLanguage: Language;
  public readonly additionalLanguages: Language[];
  public readonly speakers: Speaker[];
  public readonly provenance: Provenance;
  public readonly transcription: Transcription;
  public readonly rawMetadata: RawMetadata;

  constructor(data: Partial<VideoData>) {
    this.id = String(data.id || '');
    this.url = String(data.url || '');
    this.durationSeconds = Number(data.duration_seconds || 0);
    this.uploadDate = String(data.upload_date || '');
    this.license = String(data.license || 'ALL_RIGHTS_RESERVED');
    this.contentType = String(data.content_type || 'oral_history');
    this.primaryLanguage = Language.fromDict(data.primary_language || { iso639_3: '', bcp47: '', name: '' });
    this.additionalLanguages = Array.isArray(data.additional_languages)
      ? data.additional_languages.map(Language.fromDict)
      : [];
    this.speakers = Array.isArray(data.speakers)
      ? data.speakers.map(Speaker.fromDict)
      : [];
    this.provenance = Provenance.fromDict(data.provenance);
    this.transcription = Transcription.fromDict(data.transcription);
    this.rawMetadata = RawMetadata.fromDict(data.raw_metadata);
  }

  /**
   * Returns the YouTube embed URL for iframe players.
   */
  public get embedUrl(): string {
    return `https://www.youtube.com/embed/${this.id}`;
  }

  /**
   * Returns video title.
   */
  public get title(): string {
    return this.rawMetadata.title;
  }

  /**
   * Returns raw metadata tags.
   */
  public get tags(): string[] {
    return this.rawMetadata.tags;
  }

  /**
   * Returns human-readable duration formatted as 'MM:SS' or 'HH:MM:SS'.
   */
  public get durationFormatted(): string {
    const total = this.durationSeconds;
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    const pad = (num: number) => String(num).padStart(2, '0');

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  }

  /**
   * True if the video is licensed under any Creative Commons or Public Domain license.
   */
  public get isCreativeCommons(): boolean {
    return this.license.startsWith('CC-BY') || this.license === 'PUBLIC_DOMAIN';
  }

  /**
   * Returns all languages (primary + additional).
   */
  public get allLanguages(): Language[] {
    return [this.primaryLanguage, ...this.additionalLanguages];
  }

  /**
   * Returns all ISO 639-3 codes for this video.
   */
  public get allIsoCodes(): Set<string> {
    const set = new Set<string>();
    for (const lang of this.allLanguages) {
      if (lang.iso639_3) set.add(lang.iso639_3);
    }
    return set;
  }

  /**
   * Returns all BCP 47 codes for this video.
   */
  public get allBcp47Codes(): Set<string> {
    const set = new Set<string>();
    for (const lang of this.allLanguages) {
      if (lang.bcp47) set.add(lang.bcp47);
    }
    return set;
  }

  /**
   * Returns all Glottolog codes for this video.
   */
  public get allGlottocodes(): Set<string> {
    const set = new Set<string>();
    for (const lang of this.allLanguages) {
      if (lang.glottocode) set.add(lang.glottocode);
    }
    return set;
  }

  /**
   * Returns list of speaker names (excluding 'unknown').
   */
  public get speakerNames(): string[] {
    return this.speakers
      .map((sp) => sp.name)
      .filter((name) => name && name.toLowerCase() !== 'unknown');
  }

  public get countryCode(): string | null {
    return this.provenance.countryCode;
  }

  public get countryName(): string | null {
    return this.provenance.countryName;
  }

  /**
   * Check if video contains a language matching query (by ISO, BCP-47, Glottocode, Name, Autonym, or Dialect).
   * Case-insensitive.
   */
  public hasLanguage(query: string): boolean {
    const q = query.trim();
    if (!q) return false;
    const qLower = q.toLowerCase();
    const qNorm = normalizeText(q);

    for (const lang of this.allLanguages) {
      if (lang.iso639_3 && lang.iso639_3.toLowerCase() === qLower) {
        return true;
      }
      if (
        lang.bcp47 &&
        (lang.bcp47.toLowerCase() === qLower ||
          lang.bcp47.toLowerCase().startsWith(`${qLower}-`))
      ) {
        return true;
      }
      if (lang.glottocode && lang.glottocode.toLowerCase() === qLower) {
        return true;
      }
      if (lang.name) {
        const langNameNorm = normalizeText(lang.name);
        if (
          langNameNorm === qNorm ||
          ` ${langNameNorm} `.includes(` ${qNorm} `)
        ) {
          return true;
        }
      }
      if (lang.autonym) {
        const autoNorm = normalizeText(lang.autonym);
        if (
          autoNorm === qNorm ||
          ` ${autoNorm} `.includes(` ${qNorm} `) ||
          lang.autonym.toLowerCase().includes(qLower)
        ) {
          return true;
        }
      }
      if (lang.dialect) {
        const dialNorm = normalizeText(lang.dialect);
        if (
          dialNorm === qNorm ||
          ` ${dialNorm} `.includes(` ${qNorm} `)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if any speaker matches the name or role (case-insensitive substring match).
   */
  public hasSpeaker(nameOrRole: string): boolean {
    const q = nameOrRole.trim().toLowerCase();
    if (!q) return false;
    for (const sp of this.speakers) {
      if (sp.name && sp.name.toLowerCase().includes(q)) {
        return true;
      }
      if (sp.role && sp.role.toLowerCase() === q) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if provenance country matches country code or name (case-insensitive).
   */
  public hasCountry(country: string): boolean {
    const q = country.trim();
    if (!q) return false;
    const qLower = q.toLowerCase();
    const qNorm = normalizeText(q);

    if (q.length === 2 && /^[a-zA-Z]+$/.test(q) && this.provenance.countryCode) {
      return this.provenance.countryCode.toUpperCase() === q.toUpperCase();
    }
    if (this.provenance.countryName) {
      const cnameNorm = normalizeText(this.provenance.countryName);
      if (
        cnameNorm === qNorm ||
        ` ${cnameNorm} `.includes(` ${qNorm} `)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Convert Video object into a standard dictionary.
   */
  public toDict(): VideoData {
    return {
      id: this.id,
      url: this.url,
      duration_seconds: this.durationSeconds,
      upload_date: this.uploadDate,
      license: this.license,
      content_type: this.contentType,
      primary_language: this.primaryLanguage.toDict(),
      additional_languages: this.additionalLanguages.map((l) => l.toDict()),
      speakers: this.speakers.map((s) => s.toDict()),
      provenance: this.provenance.toDict(),
      transcription: this.transcription.toDict(),
      raw_metadata: this.rawMetadata.toDict(),
    };
  }

  /**
   * Serialize Video to JSON string.
   */
  public toJSON(indent?: number): string {
    return JSON.stringify(this.toDict(), null, indent);
  }

  public static fromDict(data: Partial<VideoData>): Video {
    return new Video(data);
  }
}
