"""
Validator module for Wikitongues normalized dataset.
Enforces zero hallucination against SIL ISO 639-3 and Glottolog reference tables.
"""

import csv
import re
from pathlib import Path
from typing import Dict, Set, List, Tuple


class DatasetValidator:
    def __init__(self, references_dir: Path):
        self.references_dir = Path(references_dir)
        self.sil_codes: Dict[str, str] = {}
        self.glotto_codes: Set[str] = set()
        self.iso_to_glotto: Dict[str, str] = {}
        self._load_references()

    def _load_references(self):
        sil_path = self.references_dir / "iso-639-3.tab"
        if not sil_path.exists():
            raise FileNotFoundError(f"SIL ISO 639-3 table missing at {sil_path}")

        with open(sil_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f, delimiter="\t")
            for row in reader:
                self.sil_codes[row["Id"]] = row["Ref_Name"]

        glotto_path = self.references_dir / "glottolog_languages.csv"
        if glotto_path.exists():
            with open(glotto_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    gc = row.get("Glottocode")
                    if gc:
                        self.glotto_codes.add(gc)
                    iso = row.get("ISO639P3code")
                    if iso and iso not in self.iso_to_glotto:
                        self.iso_to_glotto[iso] = gc

    def validate_record(self, record: dict) -> List[str]:
        errors = []

        # ID
        vid = record.get("id")
        if not vid or len(vid) != 11:
            errors.append(f"Invalid video id: '{vid}' (must be 11 characters)")

        # URL
        url = record.get("url")
        if not url or not url.startswith("https://www.youtube.com/watch?v="):
            errors.append(f"Invalid URL: '{url}'")

        # Duration
        dur = record.get("duration_seconds")
        if not isinstance(dur, (int, float)) or dur <= 0:
            errors.append(f"Invalid duration_seconds: {dur} (must be > 0)")

        # Upload date format YYYY-MM-DD
        upload_date = record.get("upload_date")
        if not upload_date or not re.match(r"^\d{4}-\d{2}-\d{2}$", upload_date):
            errors.append(f"Invalid upload_date format: '{upload_date}' (expected YYYY-MM-DD)")

        # License
        allowed_licenses = {
            "CC-BY-4.0",
            "CC-BY-SA-4.0",
            "CC-BY-NC-4.0",
            "ALL_RIGHTS_RESERVED",
            "PUBLIC_DOMAIN"
        }
        lic = record.get("license")
        if lic not in allowed_licenses:
            errors.append(f"Invalid license: '{lic}'. Must be one of {allowed_licenses}")

        # Content type
        allowed_types = {
            "oral_history",
            "conversation",
            "sign_language",
            "reading_or_song",
            "language_lesson",
            "fellowship_doc",
            "meta"
        }
        ctype = record.get("content_type")
        if ctype not in allowed_types:
            errors.append(f"Invalid content_type: '{ctype}'. Must be one of {allowed_types}")

        # Primary language
        pl = record.get("primary_language")
        if not pl or not isinstance(pl, dict):
            errors.append("Missing primary_language dictionary")
        else:
            # Check forbidden keys
            if "family" in pl or "branch" in pl:
                errors.append("FORBIDDEN: 'family' or 'branch' found in primary_language!")

            iso = pl.get("iso639_3")
            if not iso or iso not in self.sil_codes:
                errors.append(f"Invalid or unknown ISO 639-3 code: '{iso}' (not in official SIL table)")

            gc = pl.get("glottocode")
            if gc and self.glotto_codes and gc not in self.glotto_codes:
                errors.append(f"Invalid glottocode: '{gc}' (not found in Glottolog table)")

            bcp = pl.get("bcp47")
            if not bcp:
                errors.append("Missing bcp47 tag in primary_language")

        # Additional languages
        add_langs = record.get("additional_languages", [])
        for i, al in enumerate(add_langs):
            if "family" in al or "branch" in al:
                errors.append(f"FORBIDDEN: 'family' or 'branch' found in additional_languages[{i}]!")
            a_iso = al.get("iso639_3")
            if not a_iso or a_iso not in self.sil_codes:
                errors.append(f"Invalid ISO 639-3 in additional_languages[{i}]: '{a_iso}'")
            a_gc = al.get("glottocode")
            if a_gc and self.glotto_codes and a_gc not in self.glotto_codes:
                errors.append(f"Invalid glottocode in additional_languages[{i}]: '{a_gc}'")

        # Country code in provenance
        prov = record.get("provenance", {})
        cc = prov.get("country_code")
        if cc and (len(cc) != 2 or not cc.isupper()):
            errors.append(f"Invalid ISO 3166-1 alpha-2 country_code: '{cc}'")

        # Recording date in provenance
        r_date = prov.get("recording_date")
        if r_date and not re.match(r"^\d{4}-\d{2}-\d{2}$", r_date):
            errors.append(f"Invalid recording_date format: '{r_date}' (expected YYYY-MM-DD)")

        return errors
