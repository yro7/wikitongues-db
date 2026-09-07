"""
Language Resolver module for Wikitongues Database.
Resolves language search queries (ISO 639-3, BCP 47, Glottocode, English canonical names,
multilingual common names like 'russe' / 'español', autonyms, and dialects)
to matched language identifiers.
"""

import csv
import re
import unicodedata
from pathlib import Path
from typing import Dict, Set, List, Optional, Tuple


def normalize_text(text: str) -> str:
    """Normalize string by removing accents/diacritics and lowercasing."""
    if not text:
        return ""
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    return text.lower().strip()


# Common international / multilingual aliases for popular and regional languages
MULTILINGUAL_ALIASES: Dict[str, str] = {
    # French
    "russe": "rus",
    "anglais": "eng",
    "francais": "fra",
    "français": "fra",
    "espagnol": "spa",
    "allemand": "deu",
    "italien": "ita",
    "portugais": "por",
    "arabe": "ara",
    "chinois": "cmn",
    "mandarin": "cmn",
    "cantonais": "yue",
    "japonais": "jpn",
    "coréen": "kor",
    "coreen": "kor",
    "turc": "tur",
    "grec": "ell",
    "polonais": "pol",
    "ukrainien": "ukr",
    "tcheque": "ces",
    "tchèque": "ces",
    "suedois": "swe",
    "suédois": "swe",
    "norvegien": "nor",
    "norvégien": "nor",
    "danois": "dan",
    "finnois": "fin",
    "neerlandais": "nld",
    "néerlandais": "nld",
    "hollandais": "nld",
    "flamand": "vls",
    "roumain": "ron",
    "hongrois": "hun",
    "basque": "eus",
    "breton": "bre",
    "occitan": "oci",
    "catalan": "cat",
    "galicien": "glg",
    "corse": "cos",
    "alsacien": "gsw",
    "creole": "lou",
    "créole": "lou",
    "amharique": "amh",
    "berbere": "ber",
    "berbère": "ber",
    "kabyle": "kab",
    "haoussa": "hau",
    "yorouba": "yor",
    "swahili": "swh",
    "persan": "fas",
    "farsi": "fas",
    "hindi": "hin",
    "bengali": "ben",
    "tamoul": "tam",
    "vietnamien": "vie",
    "thailandois": "tha",
    "thai": "tha",
    "tagalog": "tgl",
    "filipino": "fil",
    "indonesien": "ind",
    "indonésien": "ind",
    "javanais": "jav",
    "malais": "zlm",
    "esperanto": "epo",
    "latin": "lat",
    "quechua": "que",
    "guarani": "grn",
    "aymara": "aym",
    "nahuatl": "nah",
    "navajo": "nav",
    "inuktitut": "iku",
    "tatar": "tat",

    # Spanish
    "ruso": "rus",
    "ingles": "eng",
    "inglés": "eng",
    "frances": "fra",
    "francés": "fra",
    "espanol": "spa",
    "español": "spa",
    "castellano": "spa",
    "aleman": "deu",
    "alemán": "deu",
    "italiano": "ita",
    "portugues": "por",
    "portugués": "por",
    "chino": "cmn",
    "japones": "jpn",
    "japonés": "jpn",
    "coreano": "kor",
    "turco": "tur",
    "griego": "ell",
    "polaco": "pol",
    "ucraniano": "ukr",
    "sueco": "swe",
    "danes": "dan",
    "danés": "dan",
    "holandes": "nld",
    "holandés": "nld",
    "hungaro": "hun",
    "húngaro": "hun",
    "euskera": "eus",
    "gallego": "glg",
    "catalan": "cat",
    "catalán": "cat",

    # German
    "russisch": "rus",
    "englisch": "eng",
    "franzosisch": "fra",
    "französisch": "fra",
    "spanisch": "spa",
    "deutsch": "deu",
    "italienisch": "ita",
    "portugiesisch": "por",
    "chinesisch": "cmn",
    "japanisch": "jpn",
    "koreanisch": "kor",
    "turkisch": "tur",
    "türkisch": "tur",
    "griechisch": "ell",
    "polnisch": "pol",
    "schwedisch": "swe",
    "danisch": "dan",
    "dänisch": "dan",
    "niederlandisch": "nld",
    "niederländisch": "nld",

    # ISO 639-1 two-letter mappings to standard ISO 639-3
    "ru": "rus",
    "en": "eng",
    "fr": "fra",
    "es": "spa",
    "de": "deu",
    "it": "ita",
    "pt": "por",
    "ar": "ara",
    "zh": "cmn",
    "ja": "jpn",
    "ko": "kor",
    "tr": "tur",
    "el": "ell",
    "pl": "pol",
    "uk": "ukr",
    "cs": "ces",
    "sv": "swe",
    "no": "nor",
    "da": "dan",
    "fi": "fin",
    "nl": "nld",
    "ro": "ron",
    "hu": "hun",
    "eu": "eus",
    "br": "bre",
    "oc": "oci",
    "ca": "cat",
    "gl": "glg",
    "sq": "sqi",
    "hy": "hye",
    "ka": "kat",
    "he": "heb",
    "fa": "fas",
    "hi": "hin",
    "bn": "ben",
    "ta": "tam",
    "vi": "vie",
    "th": "tha",
    "id": "ind",
    "jv": "jav",
    "ms": "zlm",
    "eo": "epo",
    "la": "lat",
    "qu": "que",
    "gn": "grn",
    "ay": "aym",
    "tt": "tat",
    "kk": "kaz",
    "ky": "kir",
    "uz": "uzb",
    "mn": "mon",
    "am": "amh",
    "ha": "hau",
    "yo": "yor",
    "ig": "ibo",
    "sw": "swh",
    "so": "som",
    "zu": "zul",
    "xh": "xho",
}


class LanguageResolver:
    """
    Resolves natural language strings, aliases, autonyms, ISO/BCP codes to candidate identifiers.
    """

    def __init__(self, references_dir: Optional[Path] = None):
        self.references_dir = Path(references_dir) if references_dir else None
        self.iso_to_name: Dict[str, str] = {}
        self.name_to_iso: Dict[str, str] = {}
        self.glotto_to_iso: Dict[str, str] = {}
        self.iso_to_glotto: Dict[str, str] = {}
        self.autonym_to_iso: Dict[str, Set[str]] = {}
        self.dialect_to_iso: Dict[str, Set[str]] = {}
        self.aliases: Dict[str, str] = dict(MULTILINGUAL_ALIASES)

        self._load_references()

    def _load_references(self):
        if not self.references_dir or not self.references_dir.exists():
            return

        # Load ISO 639-3 table
        sil_path = self.references_dir / "iso-639-3.tab"
        if sil_path.exists():
            with open(sil_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f, delimiter="\t")
                for row in reader:
                    iso = row.get("Id")
                    name = row.get("Ref_Name")
                    if iso and name:
                        self.iso_to_name[iso] = name
                        self.name_to_iso[normalize_text(name)] = iso

        # Load ISO 639-3 Name Index
        name_index_path = self.references_dir / "iso-639-3_Name_Index.tab"
        if name_index_path.exists():
            with open(name_index_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f, delimiter="\t")
                for row in reader:
                    iso = row.get("Id")
                    p_name = row.get("Print_Name")
                    inv_name = row.get("Inverted_Name")
                    if iso and p_name:
                        self.name_to_iso[normalize_text(p_name)] = iso
                    if iso and inv_name:
                        self.name_to_iso[normalize_text(inv_name)] = iso

        # Load Glottolog table
        glotto_path = self.references_dir / "glottolog_languages.csv"
        if glotto_path.exists():
            with open(glotto_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    gc = row.get("Glottocode")
                    iso = row.get("ISO639P3code")
                    name = row.get("Name")
                    if gc and iso:
                        self.glotto_to_iso[gc.lower()] = iso
                        self.iso_to_glotto[iso] = gc.lower()
                    if gc and name:
                        self.name_to_iso[normalize_text(name)] = iso or gc.lower()

    def register_dataset_language(
        self,
        iso639_3: str,
        bcp47: str,
        name: str,
        glottocode: Optional[str] = None,
        autonym: Optional[str] = None,
        dialect: Optional[str] = None,
    ):
        """Dynamically register language metadata discovered from normalized records."""
        iso = iso639_3.lower().strip()
        if not iso:
            return

        if name:
            norm_name = normalize_text(name)
            self.name_to_iso[norm_name] = iso
            self.iso_to_name[iso] = name

        if bcp47:
            bcp_clean = bcp47.lower().strip()
            self.aliases[bcp_clean] = iso
            if "-" in bcp_clean:
                prefix = bcp_clean.split("-")[0]
                if prefix not in self.aliases:
                    self.aliases[prefix] = iso

        if glottocode:
            gc = glottocode.lower().strip()
            self.glotto_to_iso[gc] = iso
            self.iso_to_glotto[iso] = gc

        if autonym:
            norm_autonym = normalize_text(autonym)
            if norm_autonym:
                self.autonym_to_iso.setdefault(norm_autonym, set()).add(iso)
            raw_autonym = autonym.lower().strip()
            self.autonym_to_iso.setdefault(raw_autonym, set()).add(iso)

        if dialect:
            norm_dialect = normalize_text(dialect)
            if norm_dialect:
                self.dialect_to_iso.setdefault(norm_dialect, set()).add(iso)

    def resolve(self, query: str) -> Set[str]:
        """
        Resolve a search string to matching ISO 639-3 codes (and direct identifiers).
        Returns a set of matching ISO codes (or Glottocodes).
        """
        if not query or not query.strip():
            return set()

        raw = query.strip()
        raw_lower = raw.lower()
        norm = normalize_text(raw)
        matched_isos: Set[str] = set()

        # 1. Direct match with 3-letter ISO code
        if len(raw_lower) == 3 and (raw_lower in self.iso_to_name or raw_lower in self.iso_to_glotto):
            matched_isos.add(raw_lower)

        # 2. Match with multilingual / standard aliases
        if raw_lower in self.aliases:
            matched_isos.add(self.aliases[raw_lower])
        if norm in self.aliases:
            matched_isos.add(self.aliases[norm])

        # 3. Match with Glottocode
        if raw_lower in self.glotto_to_iso:
            matched_isos.add(self.glotto_to_iso[raw_lower])

        # 4. Exact match in name index
        if norm in self.name_to_iso:
            matched_isos.add(self.name_to_iso[norm])
        if raw_lower in self.name_to_iso:
            matched_isos.add(self.name_to_iso[raw_lower])

        # 5. Exact match in autonyms
        if norm in self.autonym_to_iso:
            matched_isos.update(self.autonym_to_iso[norm])
        if raw_lower in self.autonym_to_iso:
            matched_isos.update(self.autonym_to_iso[raw_lower])

        # 6. Exact match in dialects
        if norm in self.dialect_to_iso:
            matched_isos.update(self.dialect_to_iso[norm])

        # 7. Substring / Word match in language names
        if not matched_isos:
            for name_key, iso in self.name_to_iso.items():
                if norm == name_key or f" {norm} " in f" {name_key} ":
                    matched_isos.add(iso)
                elif norm in name_key and len(norm) >= 4:
                    matched_isos.add(iso)

        # 8. Substring in autonyms & dialects
        if not matched_isos:
            for auto_key, iso_set in self.autonym_to_iso.items():
                if norm in auto_key:
                    matched_isos.update(iso_set)
            for dial_key, iso_set in self.dialect_to_iso.items():
                if norm in dial_key:
                    matched_isos.update(iso_set)

        # 9. Fallback: return raw lower string if 3 letters
        if not matched_isos and len(raw_lower) == 3:
            matched_isos.add(raw_lower)

        return matched_isos
