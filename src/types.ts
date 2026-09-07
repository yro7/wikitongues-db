/**
 * Domain types and interfaces for Wikitongues Database.
 */

export interface LanguageData {
  iso639_3: string;
  bcp47: string;
  name: string;
  glottocode?: string | null;
  autonym?: string | null;
  dialect?: string | null;
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
  bcp47: string;
  name: string;
  glottocode: string | null;
  autonyms: string[];
  dialects: string[];
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
