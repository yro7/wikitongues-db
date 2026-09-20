/**
 * Domain types and interfaces for Wikitongues Database.
 */

// ---------------------------------------------------------------------------
// Persisted schema (data/processed/wikitongues_normalized.json)
// ---------------------------------------------------------------------------

/**
 * Ontological anchor keys. All three are mandatory: every language is classified
 * by every authority (see CLASSIFICATION_RULES.md §3.1.1).
 */
export interface StandardsData {
  iso639_3: string;
  glottocode: string;
  bcp47: string;
}

export interface LanguageData {
  standards: StandardsData;
  /** How the speaker names their language in the video; null if never stated. */
  speaker_claim: string | null;
  /** The language label authored by Wikitongues (verbatim from their metadata). */
  wikitongues_classification: string;
  /** Wikitongues' genealogical qualifiers, normalized ("Norman Romance"); null if none. */
  wikitongues_lineage: string | null;
  /** Endonym in native script. */
  autonym: string;
}

export interface SpeakerData {
  name: string;
  role?: string;
  origin?: string | null;
}

export interface ProvenanceData {
  country_code?: string | null;
  country_name?: string | null;
  region?: string | null;
  city?: string | null;
  recorded_by?: string | null;
  recording_date?: string | null;
}

export interface TranscriptionData {
  has_subtitles?: boolean;
  available_subtitles?: string[];
  native_text?: string | null;
  english_translation?: string | null;
}

export interface RawMetadataData {
  title?: string;
  tags?: string[];
}

export interface VideoData {
  id: string;
  url: string;
  duration_seconds: number;
  upload_date: string;
  license: string;
  content_type: string;
  primary_language: LanguageData;
  additional_languages?: LanguageData[];
  speakers?: SpeakerData[];
  provenance?: ProvenanceData | null;
  transcription?: TranscriptionData | null;
  raw_metadata?: RawMetadataData | null;
}

// ---------------------------------------------------------------------------
// Reference tables (src/generated/reference.json, pruned from data/references/)
// ---------------------------------------------------------------------------

export interface Iso639_3Entry {
  name: string;
  scope: 'I' | 'M' | 'S';
  type: 'L' | 'E' | 'A' | 'H' | 'C' | 'S';
  /** ISO 639-1 two-letter code when one exists. */
  part1?: string;
  invertedName?: string;
}

export interface GlottologEntry {
  name: string;
  level: 'family' | 'language' | 'dialect';
  /** Language_ID column: the parent language node, only set for dialects. */
  parentLanguageId?: string;
  /** Family_ID column: the top-level family, not the immediate parent. */
  familyId?: string;
  latitude?: number;
  longitude?: number;
  macroarea?: string;
}

export interface IanaSubtagEntry {
  description: string;
  deprecated?: boolean;
}

export interface IanaLanguageEntry extends IanaSubtagEntry {
  suppressScript?: string;
  macrolanguage?: string;
  scope?: 'macrolanguage';
}

export interface IanaVariantEntry extends IanaSubtagEntry {
  prefixes: string[];
}

export interface ReferenceTables {
  iso639_3: Record<string, Iso639_3Entry>;
  glottolog: Record<string, GlottologEntry>;
  iana: {
    fileDate: string;
    language: Record<string, IanaLanguageEntry>;
    script: Record<string, IanaSubtagEntry>;
    region: Record<string, IanaSubtagEntry>;
    variant: Record<string, IanaVariantEntry>;
  };
}

// ---------------------------------------------------------------------------
// Resolved (hydrated) standards
// ---------------------------------------------------------------------------

export interface ResolvedIso639_3 {
  code: string;
  name: string;
  scope: 'I';
  type: Iso639_3Entry['type'];
  part1?: string;
  invertedName?: string;
}

export interface ResolvedGlottolog {
  code: string;
  name: string;
  level: 'language' | 'dialect';
  parentLanguageId?: string;
  familyId?: string;
  latitude?: number;
  longitude?: number;
  macroarea?: string;
}

export interface ResolvedBcp47 {
  tag: string;
  primarySubtag: string;
  scriptSubtag?: string;
  regionSubtag?: string;
  variantSubtags: string[];
  description?: string;
  macrolanguage?: string;
}

export interface ResolvedStandards {
  iso639_3: ResolvedIso639_3;
  glottolog: ResolvedGlottolog;
  bcp47: ResolvedBcp47;
}

// ---------------------------------------------------------------------------
// Query & aggregate types
// ---------------------------------------------------------------------------

export interface FilterOptions {
  language?: string;
  country?: string;
  speaker?: string;
  contentType?: string;
  license?: string;
  creativeCommons?: boolean;
  subtitles?: boolean;
  minDuration?: number;
  maxDuration?: number;
  limit?: number;
}

export interface LanguageSummary {
  iso639_3: string;
  iso_name: string;
  bcp47_tags: string[];
  glottocodes: string[];
  glottolog_names: string[];
  wikitongues_classifications: string[];
  autonyms: string[];
  video_count: number;
  total_duration_seconds: number;
  countries: string[];
}

export interface CountrySummary {
  country_code: string | null;
  country_name: string;
  video_count: number;
  language_count: number;
  languages: string[];
}

export interface SpeakerSummary {
  name: string;
  roles: string[];
  origins: string[];
  video_count: number;
  languages: string[];
}

export interface DatasetStats {
  total_videos: number;
  total_languages: number;
  total_countries: number;
  total_duration_seconds: number;
  total_duration_hours: number;
  with_subtitles_count: number;
  with_subtitles_percentage: number;
  licenses: Record<string, number>;
  content_types: Record<string, number>;
}
