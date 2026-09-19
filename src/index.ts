/**
 * Wikitongues Database & Query Library (TypeScript).
 * Zero-dependency, lightweight, embeddable dataset and search engine.
 */

export { WikitonguesDB, type WikitonguesDBOptions } from './client';
export {
  Video,
  Language,
  Speaker,
  Provenance,
  Transcription,
  RawMetadata,
} from './models';
export { VideoCollection } from './collection';
export { QueryBuilder } from './query';
export { SearchEngine } from './search';
export {
  LanguageResolver,
  normalizeText,
  MULTILINGUAL_ALIASES,
} from './resolver';
export { DatasetIndex } from './index-engine';
export { ReferenceHydrator, HydrationError } from './hydrator';
export { dataset } from './dataset';

export type {
  LanguageData,
  StandardsData,
  ResolvedStandards,
  ResolvedIso639_3,
  ResolvedGlottolog,
  ResolvedBcp47,
  ReferenceTables,
  Iso639_3Entry,
  GlottologEntry,
  IanaLanguageEntry,
  IanaSubtagEntry,
  IanaVariantEntry,
  SpeakerData,
  ProvenanceData,
  TranscriptionData,
  RawMetadataData,
  VideoData,
  FilterOptions,
  LanguageSummary,
  CountrySummary,
  SpeakerSummary,
  DatasetStats,
} from './types';
