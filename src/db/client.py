"""
High-Level Client for the Wikitongues Database.
Provides instant O(1) lookups, fluent querying, full-text search, discovery, and analytics.
"""

from pathlib import Path
from typing import (
    List,
    Optional,
    Union,
    Dict,
    Any,
    Sequence,
    Set,
)
import json
from collections import Counter

from .models import Video
from .collection import VideoCollection
from .resolver import LanguageResolver, normalize_text
from .index import DatasetIndex
from .search import SearchEngine
from .query import QueryBuilder


class WikitonguesDB:
    """
    High-level, zero-latency in-memory database and search engine for Wikitongues dataset.
    """

    def __init__(
        self,
        data_path: Optional[Union[str, Path]] = None,
        references_dir: Optional[Union[str, Path]] = None,
    ):
        self._data_path = self._resolve_data_path(data_path)
        self._references_dir = self._resolve_references_dir(references_dir)

        # 1. Initialize language resolver
        self.resolver = LanguageResolver(self._references_dir)

        # 2. Load records
        self._videos: List[Video] = []
        if self._data_path and self._data_path.exists():
            self._load_from_jsonl(self._data_path)

        # 3. Build inverted index
        self.index = DatasetIndex(self._videos)

        # 4. Initialize search engine
        self.search_engine = SearchEngine(self._videos, resolver=self.resolver)

    def _resolve_data_path(self, path: Optional[Union[str, Path]]) -> Optional[Path]:
        if path:
            return Path(path)
        # Search candidate locations relative to this package or current working dir
        candidates = [
            Path(__file__).resolve().parent.parent.parent / "data" / "processed" / "wikitongues_normalized.jsonl",
            Path.cwd() / "data" / "processed" / "wikitongues_normalized.jsonl",
        ]
        for c in candidates:
            if c.exists():
                return c
        return candidates[0]

    def _resolve_references_dir(self, path: Optional[Union[str, Path]]) -> Optional[Path]:
        if path:
            return Path(path)
        candidates = [
            Path(__file__).resolve().parent.parent.parent / "data" / "references",
            Path.cwd() / "data" / "references",
        ]
        for c in candidates:
            if c.exists():
                return c
        return candidates[0]

    def _load_from_jsonl(self, filepath: Path):
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                line_str = line.strip()
                if not line_str:
                    continue
                record_dict = json.loads(line_str)
                video = Video.from_dict(record_dict)
                self._videos.append(video)

                # Register language entities into resolver
                pl = video.primary_language
                self.resolver.register_dataset_language(
                    iso639_3=pl.iso639_3,
                    bcp47=pl.bcp47,
                    name=pl.name,
                    glottocode=pl.glottocode,
                    autonym=pl.autonym,
                    dialect=pl.dialect,
                )
                for al in video.additional_languages:
                    self.resolver.register_dataset_language(
                        iso639_3=al.iso639_3,
                        bcp47=al.bcp47,
                        name=al.name,
                        glottocode=al.glottocode,
                    )

    @classmethod
    def from_file(
        cls,
        filepath: Union[str, Path],
        references_dir: Optional[Union[str, Path]] = None,
    ) -> "WikitonguesDB":
        """Create a WikitonguesDB instance from a custom JSONL file path."""
        return cls(data_path=filepath, references_dir=references_dir)

    @classmethod
    def from_records(
        cls,
        records: List[Union[Dict[str, Any], Video]],
        references_dir: Optional[Union[str, Path]] = None,
    ) -> "WikitonguesDB":
        """Create a WikitonguesDB instance directly from an in-memory list of dicts or Videos."""
        instance = cls(data_path=None, references_dir=references_dir)
        instance._videos = []
        for r in records:
            if isinstance(r, Video):
                v = r
            else:
                v = Video.from_dict(r)
            instance._videos.append(v)
            pl = v.primary_language
            instance.resolver.register_dataset_language(
                iso639_3=pl.iso639_3,
                bcp47=pl.bcp47,
                name=pl.name,
                glottocode=pl.glottocode,
                autonym=pl.autonym,
                dialect=pl.dialect,
            )
        instance.index = DatasetIndex(instance._videos)
        instance.search_engine = SearchEngine(instance._videos, resolver=instance.resolver)
        return instance

    def __len__(self) -> int:
        return len(self._videos)

    def __repr__(self) -> str:
        return f"<WikitonguesDB: {len(self._videos)} records loaded>"

    # -------------------------------------------------------------------------
    # Direct Lookups (O(1))
    # -------------------------------------------------------------------------

    def get(self, video_id: str) -> Optional[Video]:
        """Lookup a video by its YouTube ID in O(1) time."""
        return self.index.by_id.get(video_id.strip())

    def get_by_iso(self, code: str) -> VideoCollection:
        """Lookup videos matching a 3-letter SIL ISO 639-3 code in O(1) time."""
        return VideoCollection(self.index.by_iso.get(code.strip().lower(), []))

    def get_by_bcp47(self, tag: str) -> VideoCollection:
        """Lookup videos matching a BCP 47 language tag in O(1) time."""
        return VideoCollection(self.index.by_bcp47.get(tag.strip().lower(), []))

    def get_by_glottocode(self, glottocode: str) -> VideoCollection:
        """Lookup videos matching a Glottolog code in O(1) time."""
        return VideoCollection(self.index.by_glottocode.get(glottocode.strip().lower(), []))

    def get_by_country(self, country_code_or_name: str) -> VideoCollection:
        """Lookup videos matching an ISO 3166-1 alpha-2 code or country name in O(1) time."""
        c = country_code_or_name.strip()
        if len(c) == 2 and c.upper() in self.index.by_country_code:
            return VideoCollection(self.index.by_country_code[c.upper()])
        norm_name = normalize_text(c)
        if norm_name in self.index.by_country_name:
            return VideoCollection(self.index.by_country_name[norm_name])
        # Fallback to query
        return self.query().country(c).all()

    def get_by_speaker(self, name: str) -> VideoCollection:
        """Lookup videos for a given speaker name."""
        norm_name = normalize_text(name)
        if norm_name in self.index.by_speaker_name:
            return VideoCollection(self.index.by_speaker_name[norm_name])
        return self.query().speaker(name=name).all()

    # -------------------------------------------------------------------------
    # Smart Lookups & Shortcut Queries
    # -------------------------------------------------------------------------

    def find_by_language(
        self,
        language_query: str,
        include_additional: bool = True,
    ) -> VideoCollection:
        """
        Intelligent language search: resolves natural names, multilingual aliases ('russe'),
        ISO 639-3 ('rus'), BCP 47 ('ru'), autonyms ('Русский'), and dialects.
        """
        return self.query().language(language_query, include_additional=include_additional).all()

    def find(
        self,
        language: Optional[str] = None,
        country: Optional[str] = None,
        speaker: Optional[str] = None,
        content_type: Optional[str] = None,
        license: Optional[str] = None,
        creative_commons: bool = False,
        subtitles: Optional[bool] = None,
        min_duration: Optional[int] = None,
        max_duration: Optional[int] = None,
        limit: Optional[int] = None,
    ) -> VideoCollection:
        """Shortcut method to filter videos by common criteria."""
        q = self.query()
        if language:
            q.language(language)
        if country:
            q.country(country)
        if speaker:
            q.speaker(name=speaker)
        if content_type:
            q.content_type(content_type)
        if license:
            q.license(license)
        if creative_commons:
            q.creative_commons_only()
        if subtitles is True:
            q.with_subtitles()
        elif subtitles is False:
            q.without_subtitles()
        if min_duration is not None:
            q.min_duration(min_duration)
        if max_duration is not None:
            q.max_duration(max_duration)
        if limit is not None:
            q.limit(limit)
        return q.all()

    def query(self) -> QueryBuilder:
        """Initialize a new fluent QueryBuilder."""
        return QueryBuilder(self._videos, resolver=self.resolver)

    def search(self, query: str, limit: Optional[int] = None) -> VideoCollection:
        """Execute weighted full-text search across all metadata."""
        return self.search_engine.search(query, limit=limit)

    def all(self) -> VideoCollection:
        """Return all videos as a VideoCollection."""
        return VideoCollection(self._videos)

    def random(
        self,
        n: int = 1,
        seed: Optional[int] = None,
        **filters,
    ) -> VideoCollection:
        """Return n random videos, optionally filtered by criteria."""
        if filters:
            return self.find(**filters).sample(k=n, seed=seed)
        return self.all().sample(k=n, seed=seed)

    # -------------------------------------------------------------------------
    # Exploration & Aggregate Statistics
    # -------------------------------------------------------------------------

    def languages(self) -> List[Dict[str, Any]]:
        """Return a structured inventory of all represented languages with summary metrics."""
        lang_map: Dict[str, Dict[str, Any]] = {}

        for v in self._videos:
            pl = v.primary_language
            iso = pl.iso639_3
            if not iso:
                continue

            if iso not in lang_map:
                lang_map[iso] = {
                    "iso639_3": iso,
                    "bcp47": pl.bcp47,
                    "name": pl.name,
                    "glottocode": pl.glottocode,
                    "autonyms": set(),
                    "dialects": set(),
                    "video_count": 0,
                    "total_duration_seconds": 0,
                    "countries": set(),
                }

            entry = lang_map[iso]
            entry["video_count"] += 1
            entry["total_duration_seconds"] += v.duration_seconds
            if pl.autonym:
                entry["autonyms"].add(pl.autonym)
            if pl.dialect:
                entry["dialects"].add(pl.dialect)
            if v.country_code:
                entry["countries"].add(v.country_code)

        result = []
        for iso, item in sorted(lang_map.items(), key=lambda x: x[1]["video_count"], reverse=True):
            result.append({
                "iso639_3": item["iso639_3"],
                "bcp47": item["bcp47"],
                "name": item["name"],
                "glottocode": item["glottocode"],
                "autonyms": sorted(list(item["autonyms"])),
                "dialects": sorted(list(item["dialects"])),
                "video_count": item["video_count"],
                "total_duration_seconds": item["total_duration_seconds"],
                "countries": sorted(list(item["countries"])),
            })
        return result

    def countries(self) -> List[Dict[str, Any]]:
        """Return a structured inventory of all represented countries with summary metrics."""
        country_map: Dict[str, Dict[str, Any]] = {}

        for v in self._videos:
            cc = v.country_code or "ZZ"
            cname = v.country_name or "Unknown"

            if cc not in country_map:
                country_map[cc] = {
                    "country_code": cc if cc != "ZZ" else None,
                    "country_name": cname if cc != "ZZ" else "Unknown",
                    "video_count": 0,
                    "languages": set(),
                }

            entry = country_map[cc]
            entry["video_count"] += 1
            if v.primary_language.iso639_3:
                entry["languages"].add(v.primary_language.iso639_3)

        result = []
        for cc, item in sorted(country_map.items(), key=lambda x: x[1]["video_count"], reverse=True):
            result.append({
                "country_code": item["country_code"],
                "country_name": item["country_name"],
                "video_count": item["video_count"],
                "language_count": len(item["languages"]),
                "languages": sorted(list(item["languages"])),
            })
        return result

    def speakers(self) -> List[Dict[str, Any]]:
        """Return a structured inventory of all speakers in the dataset."""
        speaker_map: Dict[str, Dict[str, Any]] = {}

        for v in self._videos:
            for sp in v.speakers:
                if not sp.name or sp.name.lower() == "unknown":
                    continue
                if sp.name not in speaker_map:
                    speaker_map[sp.name] = {
                        "name": sp.name,
                        "roles": set(),
                        "origins": set(),
                        "video_count": 0,
                        "languages": set(),
                    }
                entry = speaker_map[sp.name]
                entry["video_count"] += 1
                if sp.role:
                    entry["roles"].add(sp.role)
                if sp.origin:
                    entry["origins"].add(sp.origin)
                if v.primary_language.iso639_3:
                    entry["languages"].add(v.primary_language.iso639_3)

        result = []
        for name, item in sorted(speaker_map.items(), key=lambda x: x[1]["video_count"], reverse=True):
            result.append({
                "name": item["name"],
                "roles": sorted(list(item["roles"])),
                "origins": sorted(list(item["origins"])),
                "video_count": item["video_count"],
                "languages": sorted(list(item["languages"])),
            })
        return result

    def stats(self) -> Dict[str, Any]:
        """Compute aggregate dataset statistics."""
        total_videos = len(self._videos)
        total_duration = sum(v.duration_seconds for v in self._videos)
        unique_isos = {v.primary_language.iso639_3 for v in self._videos if v.primary_language.iso639_3}
        unique_countries = {v.country_code for v in self._videos if v.country_code}

        license_counts = Counter(v.license for v in self._videos)
        content_type_counts = Counter(v.content_type for v in self._videos)
        subtitles_count = sum(1 for v in self._videos if v.transcription.has_subtitles)

        hours = total_duration / 3600

        return {
            "total_videos": total_videos,
            "total_languages": len(unique_isos),
            "total_countries": len(unique_countries),
            "total_duration_seconds": total_duration,
            "total_duration_hours": round(hours, 2),
            "with_subtitles_count": subtitles_count,
            "with_subtitles_percentage": round((subtitles_count / total_videos * 100) if total_videos else 0, 1),
            "licenses": dict(license_counts),
            "content_types": dict(content_type_counts),
        }
