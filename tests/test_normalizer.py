"""
Tests for Wikitongues normalizer and processed dataset integrity (Standard unittest).
"""

import json
from pathlib import Path
import unittest

from src.normalizer.schemas import WikitonguesVideo, PrimaryLanguage
from src.normalizer.validator import DatasetValidator


class TestWikitonguesNormalizer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.repo_root = Path(__file__).resolve().parent.parent
        cls.validator = DatasetValidator(cls.repo_root / "data" / "references")

    def test_validator_detects_forbidden_fields(self):
        bad_record = {
            "id": "12345678901",
            "url": "https://www.youtube.com/watch?v=12345678901",
            "duration_seconds": 100,
            "upload_date": "2026-01-01",
            "license": "CC-BY-4.0",
            "content_type": "oral_history",
            "primary_language": {
                "iso639_3": "ibo",
                "bcp47": "ig",
                "name": "Igbo",
                "family": "Niger-Congo",  # FORBIDDEN!
            }
        }
        errors = self.validator.validate_record(bad_record)
        self.assertTrue(any("FORBIDDEN" in err for err in errors))

    def test_validator_detects_invalid_iso(self):
        bad_record = {
            "id": "12345678901",
            "url": "https://www.youtube.com/watch?v=12345678901",
            "duration_seconds": 100,
            "upload_date": "2026-01-01",
            "license": "CC-BY-4.0",
            "content_type": "oral_history",
            "primary_language": {
                "iso639_3": "xyz999",  # Invalid
                "bcp47": "xyz999",
                "name": "Fake Language"
            }
        }
        errors = self.validator.validate_record(bad_record)
        self.assertTrue(any("not in official SIL table" in err for err in errors))

    def test_processed_jsonl_dataset_integrity(self):
        jsonl_path = self.repo_root / "data" / "processed" / "wikitongues_normalized.jsonl"
        self.assertTrue(jsonl_path.exists(), "Normalized dataset file does not exist")

        with open(jsonl_path, "r", encoding="utf-8") as f:
            lines = [line.strip() for line in f if line.strip()]

        self.assertEqual(len(lines), 863, f"Expected 863 records, got {len(lines)}")

        for idx, line in enumerate(lines, 1):
            data = json.loads(line)
            errors = self.validator.validate_record(data)
            self.assertEqual(len(errors), 0, f"Record #{idx} ({data.get('id')}) failed validation: {errors}")

            # Check forbidden fields in language objects
            pl = data.get("primary_language", {})
            self.assertNotIn("family", pl, f"Record #{idx} contains forbidden key 'family' in primary_language")
            self.assertNotIn("branch", pl, f"Record #{idx} contains forbidden key 'branch' in primary_language")
            for al in data.get("additional_languages", []):
                self.assertNotIn("family", al, f"Record #{idx} contains forbidden key 'family' in additional_languages")
                self.assertNotIn("branch", al, f"Record #{idx} contains forbidden key 'branch' in additional_languages")


if __name__ == "__main__":
    unittest.main()
