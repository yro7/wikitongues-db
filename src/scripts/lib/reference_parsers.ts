/**
 * Parsers for the authoritative reference tables in `data/references/`.
 * Shared by the build script (`build_reference.ts`) and the validation test suite so
 * that both read the tables through exactly the same code path.
 *
 * Node-only: uses `fs`. Never import this from the library entry point.
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  Iso639_3Entry,
  GlottologEntry,
  IanaLanguageEntry,
  IanaSubtagEntry,
  IanaVariantEntry,
  ReferenceTables,
} from '../../types';

export const REFERENCES_DIR = path.resolve(__dirname, '../../../data/references');

export const ISO_TAB_PATH = path.join(REFERENCES_DIR, 'iso-639-3.tab');
export const ISO_NAME_INDEX_PATH = path.join(REFERENCES_DIR, 'iso-639-3_Name_Index.tab');
export const GLOTTOLOG_CSV_PATH = path.join(REFERENCES_DIR, 'glottolog_languages.csv');
export const IANA_REGISTRY_PATH = path.join(REFERENCES_DIR, 'iana_language_subtag_registry.txt');

/**
 * Full (un-pruned) Glottolog row, including columns not shipped in the runtime table.
 */
export interface GlottologRow extends GlottologEntry {
  code: string;
  iso639_3?: string;
  closestIso639_3?: string;
}

/**
 * Parse `iso-639-3.tab` (tab-separated: Id, Part2b, Part2t, Part1, Scope, Language_Type, Ref_Name, Comment).
 */
export function parseIsoTable(filePath: string = ISO_TAB_PATH): Map<string, Iso639_3Entry> {
  const out = new Map<string, Iso639_3Entry>();
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const parts = line.split('\t');
    const code = parts[0]?.trim().toLowerCase();
    if (!code) continue;
    const entry: Iso639_3Entry = {
      name: parts[6]?.trim() ?? '',
      scope: (parts[4]?.trim() ?? '') as Iso639_3Entry['scope'],
      type: (parts[5]?.trim() ?? '') as Iso639_3Entry['type'],
    };
    const part1 = parts[3]?.trim().toLowerCase();
    if (part1) entry.part1 = part1;
    out.set(code, entry);
  }
  return out;
}

/**
 * Parse `iso-639-3_Name_Index.tab` (Id, Print_Name, Inverted_Name) into inverted names keyed by code.
 * Only the first inverted name per code is kept, matching the reference name row.
 */
export function parseIsoInvertedNames(filePath: string = ISO_NAME_INDEX_PATH): Map<string, string> {
  const out = new Map<string, string>();
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const parts = line.split('\t');
    const code = parts[0]?.trim().toLowerCase();
    const inverted = parts[2]?.trim();
    if (code && inverted && !out.has(code)) out.set(code, inverted);
  }
  return out;
}

/**
 * Minimal RFC 4180 line splitter: handles double-quoted fields containing commas.
 */
export function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

/**
 * Parse `glottolog_languages.csv`
 * (ID, Name, Macroarea, Latitude, Longitude, Glottocode, ISO639P3code, Level, Countries,
 *  Family_ID, Language_ID, Closest_ISO369P3code, ...).
 */
export function parseGlottologCsv(filePath: string = GLOTTOLOG_CSV_PATH): Map<string, GlottologRow> {
  const out = new Map<string, GlottologRow>();
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  const header = splitCsvLine(lines[0].trim());
  const col = (name: string) => {
    const idx = header.indexOf(name);
    if (idx < 0) throw new Error(`glottolog csv: missing column '${name}'`);
    return idx;
  };
  const cId = col('ID');
  const cName = col('Name');
  const cMacroarea = col('Macroarea');
  const cLat = col('Latitude');
  const cLon = col('Longitude');
  const cIso = col('ISO639P3code');
  const cLevel = col('Level');
  const cFamily = col('Family_ID');
  const cLang = col('Language_ID');
  const cClosest = col('Closest_ISO369P3code');

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = splitCsvLine(line);
    const code = parts[cId]?.trim();
    if (!code) continue;
    const row: GlottologRow = {
      code,
      name: parts[cName]?.trim() ?? '',
      level: parts[cLevel]?.trim() as GlottologRow['level'],
    };
    const macroarea = parts[cMacroarea]?.trim();
    if (macroarea) row.macroarea = macroarea;
    const lat = parts[cLat]?.trim();
    const lon = parts[cLon]?.trim();
    if (lat) row.latitude = Number(lat);
    if (lon) row.longitude = Number(lon);
    const family = parts[cFamily]?.trim();
    if (family) row.familyId = family;
    const lang = parts[cLang]?.trim();
    if (lang) row.parentLanguageId = lang;
    const iso = parts[cIso]?.trim().toLowerCase();
    if (iso) row.iso639_3 = iso;
    const closest = parts[cClosest]?.trim().toLowerCase();
    if (closest) row.closestIso639_3 = closest;
    out.set(code, row);
  }
  return out;
}

/**
 * Resolve the ISO 639-3 code a Glottolog node maps to: its own code, else its closest code,
 * else (for dialects) the code of its parent language.
 */
export function glottologIsoCode(
  row: GlottologRow,
  table: Map<string, GlottologRow>
): string | undefined {
  if (row.iso639_3) return row.iso639_3;
  if (row.closestIso639_3) return row.closestIso639_3;
  if (row.parentLanguageId) {
    const parent = table.get(row.parentLanguageId);
    if (parent) return parent.iso639_3 || parent.closestIso639_3;
  }
  return undefined;
}

export interface IanaRegistry {
  fileDate: string;
  language: Map<string, IanaLanguageEntry>;
  script: Map<string, IanaSubtagEntry>;
  region: Map<string, IanaSubtagEntry>;
  variant: Map<string, IanaVariantEntry>;
}

/**
 * Parse the IANA Language Subtag Registry (records separated by `%%`, `Key: value` lines,
 * continuation lines start with two spaces). Only language/script/region/variant records are kept.
 */
export function parseIanaRegistry(filePath: string = IANA_REGISTRY_PATH): IanaRegistry {
  const registry: IanaRegistry = {
    fileDate: '',
    language: new Map(),
    script: new Map(),
    region: new Map(),
    variant: new Map(),
  };
  const blocks = fs.readFileSync(filePath, 'utf-8').split('%%');
  for (const block of blocks) {
    const fields = new Map<string, string[]>();
    let lastKey = '';
    for (const rawLine of block.split('\n')) {
      if (!rawLine.trim()) continue;
      if (rawLine.startsWith('  ') && lastKey) {
        const list = fields.get(lastKey)!;
        list[list.length - 1] += ' ' + rawLine.trim();
        continue;
      }
      const sep = rawLine.indexOf(':');
      if (sep < 0) continue;
      const key = rawLine.slice(0, sep).trim();
      const value = rawLine.slice(sep + 1).trim();
      if (!fields.has(key)) fields.set(key, []);
      fields.get(key)!.push(value);
      lastKey = key;
    }
    const fileDate = fields.get('File-Date')?.[0];
    if (fileDate) registry.fileDate = fileDate;

    const type = fields.get('Type')?.[0];
    const subtag = fields.get('Subtag')?.[0]?.toLowerCase();
    if (!type || !subtag) continue;
    // Subtag ranges like "qaa..qtz" are private-use and never valid for us.
    if (subtag.includes('..')) continue;
    const description = fields.get('Description')?.join('; ') ?? '';

    if (type === 'language') {
      const entry: IanaLanguageEntry = { description };
      const suppress = fields.get('Suppress-Script')?.[0];
      if (suppress) entry.suppressScript = suppress;
      const macro = fields.get('Macrolanguage')?.[0]?.toLowerCase();
      if (macro) entry.macrolanguage = macro;
      if (fields.get('Scope')?.[0] === 'macrolanguage') entry.scope = 'macrolanguage';
      if (fields.get('Deprecated')) entry.deprecated = true;
      registry.language.set(subtag, entry);
    } else if (type === 'script' || type === 'region') {
      const entry: IanaSubtagEntry = { description };
      if (fields.get('Deprecated')) entry.deprecated = true;
      registry[type].set(subtag, entry);
    } else if (type === 'variant') {
      const entry: IanaVariantEntry = {
        description,
        prefixes: (fields.get('Prefix') ?? []).map((p) => p.toLowerCase()),
      };
      if (fields.get('Deprecated')) entry.deprecated = true;
      registry.variant.set(subtag, entry);
    }
  }
  return registry;
}

/**
 * Build the pruned runtime reference tables for a given set of anchor keys.
 * Glottolog nodes are closed over their parent language and family so that hydrated
 * records can always name their ancestors.
 */
export function buildReferenceTables(
  anchors: { iso639_3: Iterable<string>; glottocodes: Iterable<string>; bcp47: Iterable<string> },
  sources: {
    iso: Map<string, Iso639_3Entry>;
    invertedNames: Map<string, string>;
    glottolog: Map<string, GlottologRow>;
    iana: IanaRegistry;
  }
): ReferenceTables {
  const tables: ReferenceTables = {
    iso639_3: {},
    glottolog: {},
    iana: {
      fileDate: sources.iana.fileDate,
      language: {},
      script: {},
      region: {},
      variant: {},
    },
  };

  for (const rawCode of anchors.iso639_3) {
    const code = rawCode.toLowerCase();
    const entry = sources.iso.get(code);
    if (!entry) continue;
    const copy: Iso639_3Entry = { ...entry };
    const inverted = sources.invertedNames.get(code);
    if (inverted) copy.invertedName = inverted;
    tables.iso639_3[code] = copy;
  }

  const addGlotto = (code: string | undefined) => {
    if (!code || tables.glottolog[code]) return;
    const row = sources.glottolog.get(code);
    if (!row) return;
    const { code: _code, iso639_3: _iso, closestIso639_3: _closest, ...entry } = row;
    tables.glottolog[code] = entry;
    addGlotto(row.parentLanguageId);
    addGlotto(row.familyId);
  };
  for (const code of anchors.glottocodes) addGlotto(code);

  for (const tag of anchors.bcp47) {
    const parts = tag.toLowerCase().split('-');
    const primary = parts[0];
    const lang = sources.iana.language.get(primary);
    if (lang) tables.iana.language[primary] = { ...lang };
    for (const sub of parts.slice(1)) {
      if (sources.iana.script.has(sub)) tables.iana.script[sub] = { ...sources.iana.script.get(sub)! };
      if (sources.iana.region.has(sub)) tables.iana.region[sub] = { ...sources.iana.region.get(sub)! };
      if (sources.iana.variant.has(sub)) {
        const v = sources.iana.variant.get(sub)!;
        tables.iana.variant[sub] = { ...v, prefixes: [...v.prefixes] };
      }
    }
  }

  const sortKeys = <T>(obj: Record<string, T>): Record<string, T> =>
    Object.fromEntries(Object.entries(obj).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
  tables.iso639_3 = sortKeys(tables.iso639_3);
  tables.glottolog = sortKeys(tables.glottolog);
  tables.iana.language = sortKeys(tables.iana.language);
  tables.iana.script = sortKeys(tables.iana.script);
  tables.iana.region = sortKeys(tables.iana.region);
  tables.iana.variant = sortKeys(tables.iana.variant);
  return tables;
}
