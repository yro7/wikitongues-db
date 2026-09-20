/**
 * Deterministic hydration of the persisted ontological anchor keys
 * (`standards: { iso639_3, glottocode, bcp47 }`) into fully resolved standard objects,
 * joined against the bundled reference tables (src/generated/reference.json).
 *
 * Hydration is strict: any key that does not resolve, or that violates the curation rules
 * (macrolanguage ISO code, Glottolog family node, malformed or unregistered BCP-47 tag),
 * throws a HydrationError. A dataset that does not hydrate does not load.
 */

import bundledReference from './generated/reference.json';
import {
  ReferenceTables,
  ResolvedBcp47,
  ResolvedGlottolog,
  ResolvedIso639_3,
  ResolvedStandards,
  StandardsData,
} from './types';

export class HydrationError extends Error {
  public readonly recordId: string;
  public readonly field: keyof StandardsData;
  public readonly code: string;

  constructor(recordId: string, field: keyof StandardsData, code: string, reason: string) {
    super(`[${recordId}] standards.${field} '${code}': ${reason}`);
    this.name = 'HydrationError';
    this.recordId = recordId;
    this.field = field;
    this.code = code;
  }
}

const PRIVATE_USE_PREFIX = /(^|-)x(-|$)/i;

export class ReferenceHydrator {
  public readonly tables: ReferenceTables;

  constructor(tables: ReferenceTables = bundledReference as ReferenceTables) {
    this.tables = tables;
  }

  public resolveIso(code: string, recordId: string = '?'): ResolvedIso639_3 {
    const key = code.trim().toLowerCase();
    const entry = this.tables.iso639_3[key];
    if (!entry) throw new HydrationError(recordId, 'iso639_3', code, 'not found in ISO 639-3 reference table');
    if (entry.scope !== 'I') {
      throw new HydrationError(recordId, 'iso639_3', code, `scope '${entry.scope}' is not an individual language (I)`);
    }
    const resolved: ResolvedIso639_3 = { code: key, name: entry.name, scope: 'I', type: entry.type };
    if (entry.part1) resolved.part1 = entry.part1;
    if (entry.invertedName) resolved.invertedName = entry.invertedName;
    return resolved;
  }

  public resolveGlottolog(code: string, recordId: string = '?'): ResolvedGlottolog {
    const key = code.trim().toLowerCase();
    const entry = this.tables.glottolog[key];
    if (!entry) throw new HydrationError(recordId, 'glottocode', code, 'not found in Glottolog reference table');
    if (entry.level === 'family') {
      throw new HydrationError(recordId, 'glottocode', code, `'${entry.name}' is a family node; only language or dialect nodes are allowed`);
    }
    const resolved: ResolvedGlottolog = { code: key, name: entry.name, level: entry.level };
    if (entry.parentLanguageId) resolved.parentLanguageId = entry.parentLanguageId;
    if (entry.familyId) resolved.familyId = entry.familyId;
    if (entry.latitude !== undefined) resolved.latitude = entry.latitude;
    if (entry.longitude !== undefined) resolved.longitude = entry.longitude;
    if (entry.macroarea) resolved.macroarea = entry.macroarea;
    return resolved;
  }

  /**
   * Parse and validate a tag of the form `language[-script][-region][-variant]*` (RFC 5646 §2.1).
   * The primary subtag must be the ISO 639-1 code of `iso` when one exists, else `iso` itself.
   */
  public resolveBcp47(tag: string, iso: ResolvedIso639_3, recordId: string = '?'): ResolvedBcp47 {
    const raw = tag.trim();
    if (!raw) throw new HydrationError(recordId, 'bcp47', tag, 'empty tag');
    if (PRIVATE_USE_PREFIX.test(raw)) throw new HydrationError(recordId, 'bcp47', tag, 'private-use subtags are not allowed');

    const parts = raw.split('-');
    const primary = parts[0].toLowerCase();
    const { iana } = this.tables;
    const lang = iana.language[primary];
    if (!lang) throw new HydrationError(recordId, 'bcp47', tag, `primary subtag '${primary}' not in IANA registry`);
    const expected = iso.part1 ?? iso.code;
    if (primary !== expected) {
      throw new HydrationError(recordId, 'bcp47', tag, `primary subtag '${primary}' must be '${expected}' for ISO 639-3 '${iso.code}'`);
    }

    const resolved: ResolvedBcp47 = { tag: raw, primarySubtag: primary, variantSubtags: [] };
    if (lang.description) resolved.description = lang.description;
    if (lang.macrolanguage) resolved.macrolanguage = lang.macrolanguage;

    // States: 0 = after language, 1 = after script, 2 = after region, 3 = in variants
    let state = 0;
    for (const sub of parts.slice(1)) {
      const lower = sub.toLowerCase();
      if (state < 1 && lower.length === 4 && /^[a-z]{4}$/.test(lower)) {
        if (lang.suppressScript && lang.suppressScript.toLowerCase() === lower) {
          throw new HydrationError(recordId, 'bcp47', tag, `script '${sub}' is the Suppress-Script of '${primary}'`);
        }
        if (!iana.script[lower]) throw new HydrationError(recordId, 'bcp47', tag, `script subtag '${sub}' not in IANA registry`);
        resolved.scriptSubtag = sub;
        state = 1;
      } else if (state < 2 && (/^[a-z]{2}$/.test(lower) || /^[0-9]{3}$/.test(lower))) {
        if (!iana.region[lower]) throw new HydrationError(recordId, 'bcp47', tag, `region subtag '${sub}' not in IANA registry`);
        resolved.regionSubtag = sub;
        state = 2;
      } else {
        const variant = iana.variant[lower];
        if (!variant) throw new HydrationError(recordId, 'bcp47', tag, `subtag '${sub}' is not a registered script, region or variant`);
        const prefixOk =
          variant.prefixes.length === 0 ||
          variant.prefixes.some((p) => raw.toLowerCase() === p || raw.toLowerCase().startsWith(`${p}-`));
        if (!prefixOk) {
          throw new HydrationError(recordId, 'bcp47', tag, `variant '${sub}' requires prefix ${variant.prefixes.join(' | ')}`);
        }
        resolved.variantSubtags.push(lower);
        state = 3;
      }
    }
    return resolved;
  }

  public hydrate(standards: StandardsData, recordId: string = '?'): ResolvedStandards {
    if (!standards || typeof standards !== 'object') {
      throw new HydrationError(recordId, 'iso639_3', '', 'missing standards block');
    }
    for (const field of ['iso639_3', 'glottocode', 'bcp47'] as const) {
      const value = standards[field];
      if (typeof value !== 'string' || !value.trim()) {
        throw new HydrationError(recordId, field, String(value), 'missing — all three standards are mandatory');
      }
    }
    const iso639_3 = this.resolveIso(standards.iso639_3, recordId);
    const glottolog = this.resolveGlottolog(standards.glottocode, recordId);
    const bcp47 = this.resolveBcp47(standards.bcp47, iso639_3, recordId);
    return { iso639_3, glottolog, bcp47 };
  }
}
