/**
 * Candidate Language & Metadata Finder
 *
 * Scans raw YouTube titles and descriptions against the authoritative SIL ISO 639-3,
 * Glottolog, and IANA tables to find legitimate linguistic anchors and prevent LLM hallucinations.
 */

import {
  parseIsoTable,
  parseIsoInvertedNames,
  parseGlottologCsv,
  parseIanaRegistry,
  glottologIsoCode,
  GlottologRow,
  IanaRegistry,
} from '../../shared/reference_parsers';
import { Iso639_3Entry } from '../../src/types';

export interface CandidateSuggestion {
  matchedLabel: string;
  iso639_3: string;
  isoName: string;
  glottocode: string;
  glottoName: string;
  glottoLevel: 'language' | 'dialect' | 'family';
  bcp47: string;
  autonym?: string;
  suggestedSpeaker?: string | null;
  suggestedCountry?: { code: string; name: string } | null;
}

let cachedIso: Map<string, Iso639_3Entry> | null = null;
let cachedIsoInverted: Map<string, string> | null = null;
let cachedGlotto: Map<string, GlottologRow> | null = null;
let cachedIana: IanaRegistry | null = null;

// Inverse index: lowercase name -> iso code
let nameToIso: Map<string, string> | null = null;
// Inverse index: lowercase glotto name -> GlottologRow[]
let nameToGlotto: Map<string, GlottologRow[]> | null = null;

function initReferenceIndexes() {
  if (cachedIso) return;

  cachedIso = parseIsoTable();
  cachedIsoInverted = parseIsoInvertedNames();
  cachedGlotto = parseGlottologCsv();
  cachedIana = parseIanaRegistry();

  nameToIso = new Map<string, string>();
  for (const [code, entry] of cachedIso.entries()) {
    if (entry.scope !== 'I') continue; // Only individual languages
    nameToIso.set(entry.name.toLowerCase(), code);
    if (entry.invertedName) {
      nameToIso.set(entry.invertedName.toLowerCase(), code);
    }
  }

  nameToGlotto = new Map<string, GlottologRow[]>();
  for (const row of cachedGlotto.values()) {
    if (row.level === 'family') continue; // Only language or dialect
    const lower = row.name.toLowerCase();
    const existing = nameToGlotto.get(lower) || [];
    existing.push(row);
    nameToGlotto.set(lower, existing);
  }
}

/**
 * Derives the canonical BCP-47 tag according to CLASSIFICATION_RULES.md §4.3:
 * Uses ISO 639-1 part1 if it exists, otherwise the 3-letter ISO 639-3 code.
 */
export function deriveBcp47(isoEntry: Iso639_3Entry, isoCode: string, dialectSuffix?: string): string {
  const primary = isoEntry.part1 ? isoEntry.part1.toLowerCase() : isoCode.toLowerCase();
  if (dialectSuffix) {
    return `${primary}-${dialectSuffix.toLowerCase()}`;
  }
  return primary;
}

/**
 * Extracts candidate language name and speaker name from a video title.
 */
export function extractNamesFromTitle(title: string): { speaker: string | null; language: string | null } {
  const clean = title.trim();

  // Pattern: "WIKITONGUES: Speaker speaking Language" or "Speaker speaking Language"
  const speakingMatch = clean.match(/(?:WIKITONGUES:\s*)?([A-ZÀ-Ža-z\s'’]+?)\s+speaking\s+(?:the\s+)?([A-ZÀ-Ža-z\s'’]+?)(?:\s+language|\s*\||\s*\(|$)/i);
  if (speakingMatch) {
    return {
      speaker: speakingMatch[1].trim(),
      language: speakingMatch[2].trim(),
    };
  }

  // Pattern: "Language with Speaker" (e.g. "Yoruba with Hanifa", "Learn Irish with Ahmad")
  const withMatch = clean.match(/(?:Learn\s+)?([A-ZÀ-Ža-z\s'’]+?)\s+with\s+([A-ZÀ-Ža-z\s'’]+?)(?:\s*\||\s*\(|$)/i);
  if (withMatch) {
    return {
      speaker: withMatch[2].trim(),
      language: withMatch[1].trim(),
    };
  }

  // Pattern: "The Language language, casually spoken"
  const casuallyMatch = clean.match(/^The\s+([A-ZÀ-Ža-z\s'’]+?)\s+language/i);
  if (casuallyMatch) {
    return {
      speaker: null,
      language: casuallyMatch[1].trim(),
    };
  }

  return { speaker: null, language: null };
}

/**
 * Finds authoritative candidate suggestions for a given raw title and description.
 */
export function findCandidates(title: string, description: string = ''): CandidateSuggestion[] {
  initReferenceIndexes();

  const { speaker, language } = extractNamesFromTitle(title);
  const searchQueries: string[] = [];

  if (language) {
    searchQueries.push(language);
    // Split compound labels (e.g. "South Bolivian Quechua" -> ["South Bolivian Quechua", "Quechua"])
    const words = language.split(/\s+/);
    if (words.length > 1) {
      searchQueries.push(words[words.length - 1]);
    }
  }

  const results: CandidateSuggestion[] = [];
  const seenKeys = new Set<string>();

  for (const query of searchQueries) {
    const qLower = query.toLowerCase();

    // 1. Direct match in ISO table
    const directIsoCode = nameToIso!.get(qLower);
    if (directIsoCode) {
      const isoEntry = cachedIso!.get(directIsoCode)!;
      // Look up Glottolog node for this ISO code
      let glottoRow: GlottologRow | undefined;
      for (const row of cachedGlotto!.values()) {
        if (glottologIsoCode(row, cachedGlotto!) === directIsoCode && row.level === 'language') {
          glottoRow = row;
          break;
        }
      }

      if (glottoRow) {
        const bcp47 = deriveBcp47(isoEntry, directIsoCode);
        const key = `${directIsoCode}:${glottoRow.code}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          results.push({
            matchedLabel: query,
            iso639_3: directIsoCode,
            isoName: isoEntry.name,
            glottocode: glottoRow.code,
            glottoName: glottoRow.name,
            glottoLevel: glottoRow.level,
            bcp47,
            suggestedSpeaker: speaker,
          });
        }
      }
    }

    // 2. Direct match in Glottolog table
    const glottoMatches = nameToGlotto!.get(qLower) || [];
    for (const grow of glottoMatches) {
      const isoCode = glottologIsoCode(grow, cachedGlotto!);
      if (isoCode && cachedIso!.has(isoCode)) {
        const isoEntry = cachedIso!.get(isoCode)!;
        if (isoEntry.scope !== 'I') continue; // Reject macrolanguages

        const bcp47 = deriveBcp47(isoEntry, isoCode);
        const key = `${isoCode}:${grow.code}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          results.push({
            matchedLabel: query,
            iso639_3: isoCode,
            isoName: isoEntry.name,
            glottocode: grow.code,
            glottoName: grow.name,
            glottoLevel: grow.level,
            bcp47,
            suggestedSpeaker: speaker,
          });
        }
      }
    }
  }

  return results;
}
