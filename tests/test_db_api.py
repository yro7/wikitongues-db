"""
Comprehensive unit tests for the high-level Wikitongues Database API (WikitonguesDB).
"""

import unittest
import tempfile
from pathlib import Path

from src import (
    WikitonguesDB,
    Video,
    VideoCollection,
    Language,
    Speaker,
    Provenance,
    Transcription,
    RawMetadata,
)


class TestWikitonguesDBAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Initialize default DB loading the 863 records from processed JSONL
        cls.db = WikitonguesDB()

    def test_database_initialization_and_len(self):
        self.assertGreaterEqual(len(self.db), 800, "Database should load all normalized records")
        self.assertIn("WikitonguesDB", repr(self.db))

    def test_get_by_id_o1(self):
        # Test known Quechua video ID
        vid = self.db.get("nXBPa_wb3dM")
        self.assertIsNotNone(vid)
        self.assertEqual(vid.id, "nXBPa_wb3dM")
        self.assertEqual(vid.primary_language.iso639_3, "que")
        self.assertEqual(vid.primary_language.name, "Quechua")
        self.assertEqual(vid.embed_url, "https://www.youtube.com/embed/nXBPa_wb3dM")
        self.assertIn("Peru", vid.provenance.country_name)
        self.assertEqual(vid.duration_formatted, "19:42")

        # Test non-existent ID
        none_vid = self.db.get("non_existent_id")
        self.assertIsNone(none_vid)

    def test_get_by_iso_and_bcp47(self):
        # Quechua (que / qu)
        que_by_iso = self.db.get_by_iso("que")
        self.assertGreater(len(que_by_iso), 0)
        self.assertIn("nXBPa_wb3dM", que_by_iso.ids)

        que_by_bcp = self.db.get_by_bcp47("qu")
        self.assertGreater(len(que_by_bcp), 0)

        # Igbo (ibo / ig)
        ibo_vids = self.db.get_by_iso("ibo")
        self.assertGreater(len(ibo_vids), 0)
        self.assertIn("HQcLp1qnjHU", ibo_vids.ids)

    def test_get_by_glottocode(self):
        que_by_glotto = self.db.get_by_glottocode("quec1387")
        self.assertGreater(len(que_by_glotto), 0)
        self.assertIn("nXBPa_wb3dM", que_by_glotto.ids)

    def test_get_by_country(self):
        pe_vids = self.db.get_by_country("PE")
        self.assertGreater(len(pe_vids), 0)
        self.assertTrue(all(v.country_code == "PE" for v in pe_vids))

        peru_by_name = self.db.get_by_country("Peru")
        self.assertEqual(len(pe_vids), len(peru_by_name))

    def test_find_by_language_russian_variants(self):
        """
        Critical user requirement: test finding Russian videos through various queries:
        'rus', 'ru', 'Russian', 'russe' (French), 'Русский' (Cyrillic autonym), 'russ1263' (Glottocode).
        """
        rus_iso = self.db.find_by_language("rus")
        self.assertGreaterEqual(len(rus_iso), 1)

        rus_bcp = self.db.find_by_language("ru")
        self.assertGreaterEqual(len(rus_bcp), 1)

        rus_name = self.db.find_by_language("Russian")
        self.assertGreaterEqual(len(rus_name), 1)

        rus_fr = self.db.find_by_language("russe")
        self.assertGreaterEqual(len(rus_fr), 1)

        rus_glotto = self.db.find_by_language("russ1263")
        self.assertGreaterEqual(len(rus_glotto), 1)

        # Verify Maxim video is found
        self.assertIn("G1ZIzrAxWbA", rus_iso.ids)
        self.assertIn("G1ZIzrAxWbA", rus_fr.ids)

    def test_find_by_language_multilingual_aliases(self):
        # French aliases
        self.assertGreater(len(self.db.find_by_language("francais")), 0)
        self.assertGreater(len(self.db.find_by_language("espagnol")), 0)
        self.assertGreater(len(self.db.find_by_language("allemand")), 0)
        self.assertGreater(len(self.db.find_by_language("basque")), 0)
        self.assertGreater(len(self.db.find_by_language("arabe")), 0)

        # Spanish aliases
        self.assertGreater(len(self.db.find_by_language("euskera")), 0)
        self.assertGreater(len(self.db.find_by_language("ingles")), 0)

    def test_find_by_autonym_and_dialect(self):
        # Autonym: Asụsụ Igbo
        igbo = self.db.find_by_language("Asụsụ Igbo")
        self.assertGreater(len(igbo), 0)
        self.assertIn("HQcLp1qnjHU", igbo.ids)

        # Autonym: Qhichwa
        quechua = self.db.find_by_language("Qhichwa")
        self.assertGreater(len(quechua), 0)

        # Dialect: Arbëresh
        arberesh = self.db.find_by_language("Arbëresh")
        self.assertGreater(len(arberesh), 0)
        self.assertIn("lstcnY-UXbs", arberesh.ids)

    def test_fluent_query_builder(self):
        # Chain multiple filters
        query = (
            self.db.query()
            .country("US")
            .content_type("oral_history")
            .creative_commons_only()
            .min_duration(60)
            .max_duration(600)
            .order_by("duration", descending=True)
            .limit(5)
        )
        results = query.all()

        self.assertLessEqual(len(results), 5)
        for v in results:
            self.assertEqual(v.country_code, "US")
            self.assertEqual(v.content_type, "oral_history")
            self.assertTrue(v.is_creative_commons)
            self.assertGreaterEqual(v.duration_seconds, 60)
            self.assertLessEqual(v.duration_seconds, 600)

        # Verify descending sort
        durations = [v.duration_seconds for v in results]
        self.assertEqual(durations, sorted(durations, reverse=True))

    def test_query_subtitles_filter(self):
        with_subs = self.db.query().with_subtitles().all()
        without_subs = self.db.query().without_subtitles().all()

        self.assertEqual(len(with_subs) + len(without_subs), len(self.db))
        self.assertTrue(all(v.transcription.has_subtitles for v in with_subs))
        self.assertTrue(all(not v.transcription.has_subtitles for v in without_subs))

    def test_query_pagination(self):
        all_pe = self.db.query().country("PE").all()
        page1 = self.db.query().country("PE").page(page=1, page_size=2).all()
        page2 = self.db.query().country("PE").page(page=2, page_size=2).all()

        self.assertEqual(len(page1), min(2, len(all_pe)))
        if len(all_pe) > 2:
            self.assertEqual(len(page2), min(2, len(all_pe) - 2))
            self.assertNotEqual(page1[0].id, page2[0].id)

    def test_query_custom_predicate(self):
        # Filter videos with duration divisible by 10 and uploaded in 2026
        custom_results = (
            self.db.query()
            .filter(lambda v: v.duration_seconds % 10 == 0 and v.upload_date.startswith("2026"))
            .all()
        )
        for v in custom_results:
            self.assertEqual(v.duration_seconds % 10, 0)
            self.assertTrue(v.upload_date.startswith("2026"))

    def test_search_engine_ranking(self):
        # Search for Albanian Arbëresh
        search_results = self.db.search("Arbëresh Albanian diaspora medieval")
        self.assertGreater(len(search_results), 0)
        # The top result should be the Martin Di Maggio video
        top_vid = search_results[0]
        self.assertEqual(top_vid.id, "lstcnY-UXbs")

        # Search for Quechua comic books
        que_search = self.db.search("comic books Incan language")
        self.assertGreater(len(que_search), 0)
        self.assertEqual(que_search[0].id, "nXBPa_wb3dM")

    def test_video_collection_aggregations_and_export(self):
        pe_vids = self.db.get_by_country("PE")

        self.assertGreater(pe_vids.total_duration_seconds, 0)
        self.assertIn("s", pe_vids.total_duration_formatted)
        self.assertGreater(pe_vids.average_duration_seconds, 0)
        self.assertIsInstance(pe_vids.iso_codes, list)
        self.assertIsInstance(pe_vids.titles, list)
        self.assertIsInstance(pe_vids.urls, list)

        # Slicing
        slice_col = pe_vids[:2]
        self.assertIsInstance(slice_col, VideoCollection)
        self.assertEqual(len(slice_col), min(2, len(pe_vids)))

        # Group by
        groups = pe_vids.group_by("language")
        self.assertIsInstance(groups, dict)

        # JSON Export
        json_str = pe_vids.to_json()
        self.assertTrue(json_str.startswith("["))

        # JSONL Export to temp file
        with tempfile.NamedTemporaryFile(suffix=".jsonl", delete=False) as tmp:
            tmp_path = tmp.name
        pe_vids.to_jsonl(tmp_path)
        with open(tmp_path, "r", encoding="utf-8") as f:
            lines = [l.strip() for l in f if l.strip()]
        self.assertEqual(len(lines), len(pe_vids))
        Path(tmp_path).unlink(missing_ok=True)

    def test_random_sampling(self):
        sampled = self.db.random(n=3, seed=42)
        self.assertEqual(len(sampled), 3)

        sampled_que = self.db.random(n=1, language="que", seed=42)
        self.assertEqual(len(sampled_que), 1)
        self.assertEqual(sampled_que[0].primary_language.iso639_3, "que")

    def test_dataset_stats_and_overviews(self):
        stats = self.db.stats()
        self.assertEqual(stats["total_videos"], len(self.db))
        self.assertGreater(stats["total_languages"], 300)
        self.assertGreater(stats["total_countries"], 80)
        self.assertGreater(stats["total_duration_hours"], 10)
        self.assertIn("licenses", stats)
        self.assertIn("content_types", stats)

        languages = self.db.languages()
        self.assertGreater(len(languages), 300)
        top_lang = languages[0]
        self.assertIn("iso639_3", top_lang)
        self.assertIn("video_count", top_lang)
        self.assertGreaterEqual(top_lang["video_count"], languages[1]["video_count"])

        countries = self.db.countries()
        self.assertGreater(len(countries), 80)
        self.assertIn("country_code", countries[0])

        speakers = self.db.speakers()
        self.assertGreater(len(speakers), 50)
        self.assertIn("name", speakers[0])

    def test_from_records_factory(self):
        custom_records = [
            {
                "id": "vid_test_001",
                "url": "https://www.youtube.com/watch?v=vid_test_001",
                "duration_seconds": 120,
                "upload_date": "2026-05-01",
                "license": "CC-BY-4.0",
                "content_type": "oral_history",
                "primary_language": {
                    "iso639_3": "eus",
                    "bcp47": "eu",
                    "name": "Basque",
                    "autonym": "Euskara",
                },
                "speakers": [{"name": "Miren", "role": "native"}],
                "provenance": {"country_code": "ES", "country_name": "Spain"},
            }
        ]
        custom_db = WikitonguesDB.from_records(custom_records)
        self.assertEqual(len(custom_db), 1)
        self.assertEqual(custom_db.get("vid_test_001").primary_language.name, "Basque")
        self.assertEqual(len(custom_db.find_by_language("basque")), 1)
        self.assertEqual(len(custom_db.find_by_language("euskera")), 1)
        self.assertEqual(len(custom_db.find_by_language("Euskara")), 1)


if __name__ == "__main__":
    unittest.main()
