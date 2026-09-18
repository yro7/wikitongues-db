/**
 * Language Resolver module for Wikitongues Database.
 * Resolves natural language search queries (ISO 639-3, BCP 47, Glottocode, English canonical names,
 * multilingual common names like 'russe' / 'español', autonyms, and dialects)
 * to matched language identifiers.
 */

export function normalizeText(text?: string | null): string {
  if (!text) return '';
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Common international / multilingual aliases for popular and regional languages.
 */
export const MULTILINGUAL_ALIASES: Record<string, string> = {
  // French
  russe: 'rus',
  anglais: 'eng',
  francais: 'fra',
  français: 'fra',
  espagnol: 'spa',
  allemand: 'deu',
  italien: 'ita',
  portugais: 'por',
  arabe: 'ara',
  chinois: 'cmn',
  mandarin: 'cmn',
  cantonais: 'yue',
  japonais: 'jpn',
  coréen: 'kor',
  coreen: 'kor',
  turc: 'tur',
  grec: 'ell',
  polonais: 'pol',
  ukrainien: 'ukr',
  tcheque: 'ces',
  tchèque: 'ces',
  suedois: 'swe',
  suédois: 'swe',
  norvegien: 'nor',
  norvégien: 'nor',
  danois: 'dan',
  finnois: 'fin',
  neerlandais: 'nld',
  néerlandais: 'nld',
  hollandais: 'nld',
  flamand: 'vls',
  roumain: 'ron',
  hongrois: 'hun',
  basque: 'eus',
  breton: 'bre',
  occitan: 'oci',
  catalan: 'cat',
  galicien: 'glg',
  corse: 'cos',
  alsacien: 'gsw',
  creole: 'lou',
  créole: 'lou',
  amharique: 'amh',
  berbere: 'ber',
  berbère: 'ber',
  kabyle: 'kab',
  haoussa: 'hau',
  yorouba: 'yor',
  swahili: 'swh',
  persan: 'fas',
  persian: 'fas',
  farsi: 'fas',
  kurde: 'kur',
  kurdish: 'kur',
  sorani: 'ckb',
  kurmanji: 'kmr',
  berber: 'ber',
  albanais: 'sqi',
  albanian: 'sqi',
  pashto: 'pus',
  pachto: 'pus',
  pashtoun: 'pus',
  serbocroate: 'hbs',
  'serbo-croate': 'hbs',
  serbocroatian: 'hbs',
  'serbo-croatian': 'hbs',
  norwegian: 'nor',
  hindi: 'hin',
  bengali: 'ben',
  tamoul: 'tam',
  vietnamien: 'vie',
  thailandois: 'tha',
  thai: 'tha',
  tagalog: 'tgl',
  filipino: 'fil',
  indonesien: 'ind',
  indonésien: 'ind',
  javanais: 'jav',
  malais: 'zlm',
  esperanto: 'epo',
  latin: 'lat',
  quechua: 'que',
  guarani: 'grn',
  aymara: 'aym',
  nahuatl: 'nah',
  navajo: 'nav',
  inuktitut: 'iku',
  tatar: 'tat',
  nepali: 'npi',
  nepalais: 'npi',
  népalais: 'npi',
  nepales: 'npi',
  nepalés: 'npi',
  atlaans: 'mis',

  // Spanish
  ruso: 'rus',
  ingles: 'eng',
  inglés: 'eng',
  frances: 'fra',
  francés: 'fra',
  espanol: 'spa',
  español: 'spa',
  castellano: 'spa',
  aleman: 'deu',
  alemán: 'deu',
  italiano: 'ita',
  portugues: 'por',
  portugués: 'por',
  chino: 'cmn',
  japones: 'jpn',
  japonés: 'jpn',
  coreano: 'kor',
  turco: 'tur',
  griego: 'ell',
  polaco: 'pol',
  ucraniano: 'ukr',
  sueco: 'swe',
  danes: 'dan',
  danés: 'dan',
  holandes: 'nld',
  holandés: 'nld',
  hungaro: 'hun',
  húngaro: 'hun',
  euskera: 'eus',
  gallego: 'glg',
  catalán: 'cat',

  // German
  russisch: 'rus',
  englisch: 'eng',
  franzosisch: 'fra',
  französisch: 'fra',
  spanisch: 'spa',
  deutsch: 'deu',
  italienisch: 'ita',
  portugiesisch: 'por',
  chinesisch: 'cmn',
  japanisch: 'jpn',
  koreanisch: 'kor',
  turkisch: 'tur',
  türkisch: 'tur',
  griechisch: 'ell',
  polnisch: 'pol',
  schwedisch: 'swe',
  danisch: 'dan',
  dänisch: 'dan',
  niederlandisch: 'nld',
  niederländisch: 'nld',

  // ISO 639-1 two-letter mappings to standard ISO 639-3
  ru: 'rus',
  en: 'eng',
  fr: 'fra',
  es: 'spa',
  de: 'deu',
  it: 'ita',
  pt: 'por',
  ar: 'ara',
  zh: 'cmn',
  ja: 'jpn',
  ko: 'kor',
  tr: 'tur',
  el: 'ell',
  pl: 'pol',
  uk: 'ukr',
  cs: 'ces',
  sv: 'swe',
  no: 'nor',
  da: 'dan',
  fi: 'fin',
  nl: 'nld',
  ro: 'ron',
  hu: 'hun',
  eu: 'eus',
  br: 'bre',
  oc: 'oci',
  ca: 'cat',
  gl: 'glg',
  sq: 'sqi',
  hy: 'hye',
  ka: 'kat',
  he: 'heb',
  fa: 'fas',
  hi: 'hin',
  bn: 'ben',
  ta: 'tam',
  vi: 'vie',
  th: 'tha',
  id: 'ind',
  jv: 'jav',
  ms: 'zlm',
  eo: 'epo',
  la: 'lat',
  qu: 'que',
  gn: 'grn',
  ay: 'aym',
  tt: 'tat',
  kk: 'kaz',
  ky: 'kir',
  uz: 'uzb',
  mn: 'mon',
  am: 'amh',
  ha: 'hau',
  yo: 'yor',
  ig: 'ibo',
  sw: 'swh',
  so: 'som',
  zu: 'zul',
  xh: 'xho',
};

/**
 * ISO 639-3 Macrolanguage to member language codes expansion mapping.
 * Ensures searches for macrolanguages (e.g. Arabic, Persian, Kurdish, Norwegian)
 * resolve to all specific dialectal records present in the dataset.
 */
export const MACROLANGUAGE_EXPANSIONS: Record<string, string[]> = {
  fas: ['fas', 'pes', 'prs'],
  nor: ['nor', 'nob', 'nno'],
  kur: ['kur', 'kmr', 'ckb', 'sdh'],
  ber: ['ber', 'kab', 'shi', 'rif', 'tzm', 'thv', 'zen'],
  ara: [
    'ara', 'ary', 'arz', 'apc', 'acm', 'ayl', 'aao', 'abh', 'abv', 'acw',
    'acx', 'ade', 'aeb', 'aec', 'afb', 'ajp', 'apd', 'arq', 'ars', 'auz',
    'avl', 'ayh', 'ayn', 'ayp', 'bbz', 'pga', 'shu', 'ssh'
  ],
  sqi: ['sqi', 'als', 'aln', 'aae', 'aat'],
  hbs: ['hbs', 'bos', 'hrv', 'srp', 'cnr'],
  zho: ['zho', 'cmn', 'yue', 'wuu', 'nan', 'hak', 'gan', 'czo', 'cjy', 'hsn'],
  pus: ['pus', 'pbu', 'pbt', 'pst'],
  que: ['que', 'quz', 'qvc', 'qwh', 'qub'],
  aym: ['aym', 'ayr', 'ayc'],
  grn: ['grn', 'gug', 'gnw', 'gui', 'gun'],
  msa: ['msa', 'zlm', 'ind', 'min'],
  aze: ['aze', 'azj', 'azb'],
  est: ['est', 'ekk', 'vro'],
  aka: ['aka', 'twi', 'fat'],
  nep: ['nep', 'npi'],
  ful: ['ful', 'fuf', 'fuh', 'fub', 'fuq'],
};

export class LanguageResolver {
  public isoToName: Map<string, string> = new Map();
  public nameToIso: Map<string, string> = new Map();
  public glottoToIso: Map<string, string> = new Map();
  public isoToGlotto: Map<string, string> = new Map();
  public autonymToIso: Map<string, Set<string>> = new Map();
  public dialectToIso: Map<string, Set<string>> = new Map();
  public aliases: Map<string, string> = new Map();

  constructor() {
    for (const [alias, iso] of Object.entries(MULTILINGUAL_ALIASES)) {
      this.aliases.set(alias.toLowerCase(), iso.toLowerCase());
    }
  }

  /**
   * Dynamically register language metadata discovered from normalized records.
   */
  public registerDatasetLanguage(
    iso639_3: string,
    bcp47: string,
    name: string,
    glottocode?: string | null,
    autonym?: string | null,
    dialect?: string | null
  ): void {
    const iso = iso639_3.toLowerCase().trim();
    if (!iso) return;

    if (name) {
      const normName = normalizeText(name);
      this.nameToIso.set(normName, iso);
      this.isoToName.set(iso, name);
    }

    if (bcp47) {
      const bcpClean = bcp47.toLowerCase().trim();
      this.aliases.set(bcpClean, iso);
      if (bcpClean.includes('-')) {
        const prefix = bcpClean.split('-')[0];
        if (!this.aliases.has(prefix)) {
          this.aliases.set(prefix, iso);
        }
      }
    }

    if (glottocode) {
      const gc = glottocode.toLowerCase().trim();
      this.glottoToIso.set(gc, iso);
      this.isoToGlotto.set(iso, gc);
    }

    if (autonym) {
      const normAutonym = normalizeText(autonym);
      if (normAutonym) {
        if (!this.autonymToIso.has(normAutonym)) {
          this.autonymToIso.set(normAutonym, new Set());
        }
        this.autonymToIso.get(normAutonym)!.add(iso);
      }
      const rawAutonym = autonym.toLowerCase().trim();
      if (!this.autonymToIso.has(rawAutonym)) {
        this.autonymToIso.set(rawAutonym, new Set());
      }
      this.autonymToIso.get(rawAutonym)!.add(iso);
    }

    if (dialect) {
      const normDialect = normalizeText(dialect);
      if (normDialect) {
        if (!this.dialectToIso.has(normDialect)) {
          this.dialectToIso.set(normDialect, new Set());
        }
        this.dialectToIso.get(normDialect)!.add(iso);
      }
    }
  }

  /**
   * Resolve a search string to matching ISO 639-3 codes (and direct identifiers).
   * Returns a set of matching ISO codes (or Glottocodes).
   */
  public resolve(query: string): Set<string> {
    if (!query || !query.trim()) {
      return new Set();
    }

    const raw = query.trim();
    const rawLower = raw.toLowerCase();
    const norm = normalizeText(raw);
    const matchedIsos = new Set<string>();

    // 1. Direct match with 3-letter ISO code
    if (rawLower.length === 3 && (this.isoToName.has(rawLower) || this.isoToGlotto.has(rawLower))) {
      matchedIsos.add(rawLower);
    }

    // 2. Match with multilingual / standard aliases
    if (this.aliases.has(rawLower)) {
      matchedIsos.add(this.aliases.get(rawLower)!);
    }
    if (this.aliases.has(norm)) {
      matchedIsos.add(this.aliases.get(norm)!);
    }

    // 3. Match with Glottocode
    if (this.glottoToIso.has(rawLower)) {
      matchedIsos.add(this.glottoToIso.get(rawLower)!);
    }

    // 4. Exact match in name index
    if (this.nameToIso.has(norm)) {
      matchedIsos.add(this.nameToIso.get(norm)!);
    }
    if (this.nameToIso.has(rawLower)) {
      matchedIsos.add(this.nameToIso.get(rawLower)!);
    }

    // 5. Exact match in autonyms
    if (this.autonymToIso.has(norm)) {
      for (const iso of this.autonymToIso.get(norm)!) {
        matchedIsos.add(iso);
      }
    }
    if (this.autonymToIso.has(rawLower)) {
      for (const iso of this.autonymToIso.get(rawLower)!) {
        matchedIsos.add(iso);
      }
    }

    // 6. Exact match in dialects
    if (this.dialectToIso.has(norm)) {
      for (const iso of this.dialectToIso.get(norm)!) {
        matchedIsos.add(iso);
      }
    }

    // 7. Substring / Word match in language names
    if (matchedIsos.size === 0) {
      for (const [nameKey, iso] of this.nameToIso.entries()) {
        if (norm === nameKey || ` ${nameKey} `.includes(` ${norm} `)) {
          matchedIsos.add(iso);
        } else if (nameKey.includes(norm) && norm.length >= 4) {
          matchedIsos.add(iso);
        }
      }
    }

    // 8. Substring in autonyms & dialects
    if (matchedIsos.size === 0) {
      for (const [autoKey, isoSet] of this.autonymToIso.entries()) {
        if (autoKey.includes(norm)) {
          for (const iso of isoSet) {
            matchedIsos.add(iso);
          }
        }
      }
      for (const [dialKey, isoSet] of this.dialectToIso.entries()) {
        if (dialKey.includes(norm)) {
          for (const iso of isoSet) {
            matchedIsos.add(iso);
          }
        }
      }
    }

    // 9. Fallback: return raw lower string if 3 letters
    if (matchedIsos.size === 0 && rawLower.length === 3) {
      matchedIsos.add(rawLower);
    }

    // 10. Macrolanguage expansion: expand any matched macrolanguage code to its member dialects/languages
    for (const iso of [...matchedIsos]) {
      const expansion = MACROLANGUAGE_EXPANSIONS[iso];
      if (expansion) {
        for (const subIso of expansion) {
          matchedIsos.add(subIso);
        }
      }
    }

    return matchedIsos;
  }
}
