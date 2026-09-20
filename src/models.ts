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
  ResolvedStandards,
} from './types';
import { normalizeText } from './resolver';
import { HydrationError, ReferenceHydrator } from './hydrator';

/**
 * A language as recorded in a video: three independently resolved institutional standards
 * plus the speaker's own claim, Wikitongues' editorial label and the autonym.
 * Shared by `Video.primaryLanguage` and every entry of `Video.additionalLanguages`.
 */
export class Language {
  public readonly standards: ResolvedStandards;
  public readonly speakerClaim: string | null;
  public readonly wikitonguesClassification: string;
  public readonly wikitonguesLineage: string | null;
  public readonly autonym: string;

  constructor(data: LanguageData, hydrator: ReferenceHydrator, recordId: string = '?') {
    this.standards = hydrator.hydrate(data.standards, recordId);
    if (typeof data.wikitongues_classification !== 'string' || !data.wikitongues_classification.trim()) {
      throw new HydrationError(recordId, 'iso639_3', data.standards.iso639_3, 'wikitongues_classification is mandatory');
    }
    if (typeof data.autonym !== 'string' || !data.autonym.trim()) {
      throw new HydrationError(recordId, 'iso639_3', data.standards.iso639_3, 'autonym is mandatory');
    }
    this.speakerClaim = data.speaker_claim ?? null;
    this.wikitonguesClassification = data.wikitongues_classification;
    this.wikitonguesLineage = data.wikitongues_lineage ?? null;
    this.autonym = data.autonym;
  }

  public static hydrate(data: LanguageData, hydrator: ReferenceHydrator, recordId?: string): Language {
    return new Language(data, hydrator, recordId);
  }

  /** ISO 639-3 code, e.g. "por". */
  public get iso639_3(): string {
    return this.standards.iso639_3.code;
  }

  /** BCP-47 tag, e.g. "pt-BR". */
  public get bcp47(): string {
    return this.standards.bcp47.tag;
  }

  /** Glottocode, e.g. "braz1246". */
  public get glottocode(): string {
    return this.standards.glottolog.code;
  }

  /** Human-readable label: Wikitongues' own classification. */
  public get name(): string {
    return this.wikitonguesClassification;
  }

  /**
   * Every label under which this language can be searched, in priority order:
   * Wikitongues classification, Glottolog node name, ISO reference name, autonym, speaker claim.
   */
  public get labels(): string[] {
    const out = [
      this.wikitonguesClassification,
      this.standards.glottolog.name,
      this.standards.iso639_3.name,
      this.autonym,
    ];
    if (this.speakerClaim) out.push(this.speakerClaim);
    return out;
  }

  /**
   * Check if this language matches the given code by ISO 639-3, ISO 639-1 part1,
   * BCP-47 (exact or prefix), macrolanguage, or Glottocode.
   */
  public matchesCode(code: string): boolean {
    const c = code.trim().toLowerCase();
    if (!c) return false;
    if (this.iso639_3.toLowerCase() === c) return true;
    if (this.standards.iso639_3.part1?.toLowerCase() === c) return true;
    if (this.standards.bcp47.macrolanguage?.toLowerCase() === c) return true;
    const bcp = this.bcp47.toLowerCase();
    if (bcp === c || bcp.startsWith(`${c}-`)) return true;
    if (this.glottocode.toLowerCase() === c) return true;
    return false;
  }

  public toDict(): LanguageData {
    return {
      standards: {
        iso639_3: this.standards.iso639_3.code,
        glottocode: this.standards.glottolog.code,
        bcp47: this.standards.bcp47.tag,
      },
      speaker_claim: this.speakerClaim,
      wikitongues_classification: this.wikitonguesClassification,
      wikitongues_lineage: this.wikitonguesLineage,
      autonym: this.autonym,
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

  constructor(data: VideoData, hydrator: ReferenceHydrator = new ReferenceHydrator()) {
    this.id = String(data.id || '');
    this.url = String(data.url || '');
    this.durationSeconds = Number(data.duration_seconds || 0);
    this.uploadDate = String(data.upload_date || '');
    this.license = String(data.license || 'ALL_RIGHTS_RESERVED');
    this.contentType = String(data.content_type || 'oral_history');
    if (!data.primary_language) {
      throw new HydrationError(this.id, 'iso639_3', '', 'primary_language is missing');
    }
    this.primaryLanguage = Language.hydrate(data.primary_language, hydrator, this.id);
    this.additionalLanguages = Array.isArray(data.additional_languages)
      ? data.additional_languages.map((l) => Language.hydrate(l, hydrator, this.id))
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
      if (lang.standards.iso639_3.part1) set.add(lang.standards.iso639_3.part1);
      if (lang.standards.bcp47.macrolanguage) set.add(lang.standards.bcp47.macrolanguage);
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
      if (lang.iso639_3) set.add(lang.iso639_3);
      if (lang.standards.iso639_3.part1) set.add(lang.standards.iso639_3.part1);
      if (lang.standards.bcp47.macrolanguage) set.add(lang.standards.bcp47.macrolanguage);
    }
    return set;
  }

  /**
   * Returns all Glottolog codes for this video.
   */
  public get allGlottocodes(): Set<string> {
    const set = new Set<string>();
    for (const lang of this.allLanguages) {
      set.add(lang.glottocode);
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
   * Check if video contains a language matching query (by ISO 639-3, BCP-47, Glottocode —
   * including the parent language of a dialect node — or any label: Wikitongues classification,
   * Glottolog name, ISO name, autonym, speaker claim). Case-insensitive.
   */
  public hasLanguage(query: string): boolean {
    const q = query.trim();
    if (!q) return false;
    const qLower = q.toLowerCase();
    const qNorm = normalizeText(q);

    for (const lang of this.allLanguages) {
      if (lang.iso639_3 === qLower) return true;
      if (lang.standards.iso639_3.part1?.toLowerCase() === qLower) return true;
      if (lang.standards.bcp47.macrolanguage?.toLowerCase() === qLower) return true;
      const bcp = lang.bcp47.toLowerCase();
      if (bcp === qLower || bcp.startsWith(`${qLower}-`)) return true;
      if (lang.glottocode === qLower) return true;
      if (lang.standards.glottolog.parentLanguageId === qLower) return true;
      for (const label of lang.labels) {
        const labelNorm = normalizeText(label);
        if (labelNorm === qNorm || ` ${labelNorm} `.includes(` ${qNorm} `)) return true;
      }
      const autoLower = lang.autonym.toLowerCase();
      if (autoLower === qLower || (qLower.length >= 4 && autoLower.includes(qLower))) return true;
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

  public static fromDict(data: VideoData, hydrator?: ReferenceHydrator): Video {
    return new Video(data, hydrator);
  }
}
