"""
VideoCollection container for rich query results, aggregations, and transformations.
"""

from typing import (
    List,
    Iterator,
    Optional,
    Callable,
    Union,
    Dict,
    Any,
    Set,
    Sequence,
    overload,
)
import json
import random
from pathlib import Path

from .models import Video, Language, Speaker


class VideoCollection(Sequence[Video]):
    """
    An immutable, rich collection of Wikitongues Video records with chainable
    transformations, aggregations, stats, and export capabilities.
    """

    def __init__(self, videos: Optional[Sequence[Video]] = None):
        self._videos: List[Video] = list(videos) if videos is not None else []

    def __len__(self) -> int:
        return len(self._videos)

    def __iter__(self) -> Iterator[Video]:
        return iter(self._videos)

    @overload
    def __getitem__(self, index: int) -> Video:
        ...

    @overload
    def __getitem__(self, index: slice) -> "VideoCollection":
        ...

    def __getitem__(self, index: Union[int, slice]) -> Union[Video, "VideoCollection"]:
        if isinstance(index, slice):
            return VideoCollection(self._videos[index])
        return self._videos[index]

    def __contains__(self, item: Any) -> bool:
        if isinstance(item, Video):
            return item in self._videos
        if isinstance(item, str):
            # Allow checking containment by video ID
            return any(v.id == item for v in self._videos)
        return False

    def __repr__(self) -> str:
        lang_count = len(self.iso_codes)
        return f"<VideoCollection: {len(self._videos)} video(s) across {lang_count} language(s)>"

    # -------------------------------------------------------------------------
    # Aggregation & Summary Properties
    # -------------------------------------------------------------------------

    @property
    def is_empty(self) -> bool:
        return len(self._videos) == 0

    @property
    def ids(self) -> List[str]:
        """List of YouTube video IDs."""
        return [v.id for v in self._videos]

    @property
    def urls(self) -> List[str]:
        """List of YouTube video URLs."""
        return [v.url for v in self._videos]

    @property
    def embed_urls(self) -> List[str]:
        """List of YouTube embed player URLs."""
        return [v.embed_url for v in self._videos]

    @property
    def titles(self) -> List[str]:
        """List of video titles."""
        return [v.title for v in self._videos]

    @property
    def total_duration_seconds(self) -> int:
        """Total duration across all videos in seconds."""
        return sum(v.duration_seconds for v in self._videos)

    @property
    def total_duration_formatted(self) -> str:
        """Human-readable total duration formatted as 'Xh Ym Zs'."""
        total = self.total_duration_seconds
        hours = total // 3600
        minutes = (total % 3600) // 60
        seconds = total % 60
        parts = []
        if hours > 0:
            parts.append(f"{hours}h")
        if minutes > 0 or hours > 0:
            parts.append(f"{minutes}m")
        parts.append(f"{seconds}s")
        return " ".join(parts)

    @property
    def average_duration_seconds(self) -> float:
        """Average duration per video in seconds."""
        if not self._videos:
            return 0.0
        return self.total_duration_seconds / len(self._videos)

    @property
    def iso_codes(self) -> List[str]:
        """Distinct primary ISO 639-3 codes in the collection."""
        seen: Set[str] = set()
        codes: List[str] = []
        for v in self._videos:
            code = v.primary_language.iso639_3
            if code and code not in seen:
                seen.add(code)
                codes.append(code)
        return codes

    @property
    def bcp47_codes(self) -> List[str]:
        """Distinct primary BCP 47 codes in the collection."""
        seen: Set[str] = set()
        codes: List[str] = []
        for v in self._videos:
            bcp = v.primary_language.bcp47
            if bcp and bcp not in seen:
                seen.add(bcp)
                codes.append(bcp)
        return codes

    @property
    def language_names(self) -> List[str]:
        """Distinct primary language names in the collection."""
        seen: Set[str] = set()
        names: List[str] = []
        for v in self._videos:
            name = v.primary_language.name
            if name and name not in seen:
                seen.add(name)
                names.append(name)
        return names

    @property
    def languages(self) -> List[Language]:
        """Distinct primary language objects."""
        seen: Set[str] = set()
        langs: List[Language] = []
        for v in self._videos:
            iso = v.primary_language.iso639_3
            if iso and iso not in seen:
                seen.add(iso)
                langs.append(v.primary_language)
        return langs

    @property
    def countries(self) -> List[str]:
        """Distinct country codes present in the collection."""
        seen: Set[str] = set()
        cc_list: List[str] = []
        for v in self._videos:
            cc = v.country_code
            if cc and cc not in seen:
                seen.add(cc)
                cc_list.append(cc)
        return cc_list

    @property
    def speakers(self) -> List[Speaker]:
        """All speakers present across videos."""
        result: List[Speaker] = []
        for v in self._videos:
            result.extend(v.speakers)
        return result

    @property
    def speaker_names(self) -> List[str]:
        """Distinct named speakers across the collection."""
        seen: Set[str] = set()
        names: List[str] = []
        for v in self._videos:
            for sp_name in v.speaker_names:
                if sp_name not in seen:
                    seen.add(sp_name)
                    names.append(sp_name)
        return names

    # -------------------------------------------------------------------------
    # Chainable Transformations & Navigation
    # -------------------------------------------------------------------------

    def first(self) -> Optional[Video]:
        """Return the first Video or None if empty."""
        return self._videos[0] if self._videos else None

    def last(self) -> Optional[Video]:
        """Return the last Video or None if empty."""
        return self._videos[-1] if self._videos else None

    def sample(self, k: int = 1, seed: Optional[int] = None) -> "VideoCollection":
        """Return a random sample of k videos."""
        if not self._videos:
            return VideoCollection([])
        k = min(k, len(self._videos))
        rng = random.Random(seed)
        sampled = rng.sample(self._videos, k)
        return VideoCollection(sampled)

    def filter(self, predicate: Callable[[Video], bool]) -> "VideoCollection":
        """Filter videos using an arbitrary predicate function."""
        return VideoCollection([v for v in self._videos if predicate(v)])

    def sort_by(
        self,
        key: Union[str, Callable[[Video], Any]],
        descending: bool = False,
    ) -> "VideoCollection":
        """
        Sort videos by a property name ('duration', 'upload_date', 'language_name', 'country')
        or a custom key function.
        """
        if callable(key):
            key_fn = key
        elif key in ("duration", "duration_seconds"):
            key_fn = lambda v: v.duration_seconds
        elif key in ("upload_date", "date"):
            key_fn = lambda v: v.upload_date
        elif key in ("language", "language_name"):
            key_fn = lambda v: v.primary_language.name.lower()
        elif key in ("iso", "iso639_3"):
            key_fn = lambda v: v.primary_language.iso639_3.lower()
        elif key in ("country", "country_code"):
            key_fn = lambda v: v.country_code or ""
        elif key in ("title",):
            key_fn = lambda v: v.title.lower()
        else:
            key_fn = lambda v: getattr(v, key, "")

        sorted_videos = sorted(self._videos, key=key_fn, reverse=descending)
        return VideoCollection(sorted_videos)

    def limit(self, n: int) -> "VideoCollection":
        """Return the first n videos."""
        return VideoCollection(self._videos[:n])

    def offset(self, n: int) -> "VideoCollection":
        """Skip the first n videos."""
        return VideoCollection(self._videos[n:])

    def page(self, page: int = 1, page_size: int = 20) -> "VideoCollection":
        """Return a 1-indexed page of videos."""
        if page < 1:
            page = 1
        start = (page - 1) * page_size
        end = start + page_size
        return VideoCollection(self._videos[start:end])

    def group_by(
        self,
        key: Union[str, Callable[[Video], Any]],
    ) -> Dict[Any, "VideoCollection"]:
        """Group videos by a key function or attribute name."""
        if callable(key):
            key_fn = key
        elif key in ("language", "iso", "iso639_3"):
            key_fn = lambda v: v.primary_language.iso639_3
        elif key in ("country", "country_code"):
            key_fn = lambda v: v.country_code or "Unknown"
        elif key in ("license",):
            key_fn = lambda v: v.license
        elif key in ("content_type",):
            key_fn = lambda v: v.content_type
        else:
            key_fn = lambda v: getattr(v, key, "Unknown")

        groups: Dict[Any, List[Video]] = {}
        for v in self._videos:
            group_key = key_fn(v)
            groups.setdefault(group_key, []).append(v)

        return {k: VideoCollection(vids) for k, vids in groups.items()}

    # -------------------------------------------------------------------------
    # Export & Serialization
    # -------------------------------------------------------------------------

    def to_dicts(self) -> List[Dict[str, Any]]:
        """Export collection to list of plain dictionaries."""
        return [v.to_dict() for v in self._videos]

    def to_json(self, indent: Optional[int] = 2) -> str:
        """Export collection to formatted JSON string."""
        return json.dumps(self.to_dicts(), ensure_ascii=False, indent=indent)

    def to_jsonl(self, filepath: Union[str, Path]) -> None:
        """Write collection to JSON Lines file."""
        target_path = Path(filepath)
        target_path.parent.mkdir(parents=True, exist_ok=True)
        with open(target_path, "w", encoding="utf-8") as f:
            for v in self._videos:
                f.write(v.to_json() + "\n")

    def to_dataframe(self):
        """
        Export collection to a pandas DataFrame if pandas is installed.
        Raises ImportError if pandas is not available.
        """
        try:
            import pandas as pd
        except ImportError:
            raise ImportError(
                "pandas is required for to_dataframe(). Install it with: pip install pandas"
            )

        flattened_rows = []
        for v in self._videos:
            flattened_rows.append({
                "id": v.id,
                "url": v.url,
                "title": v.title,
                "duration_seconds": v.duration_seconds,
                "duration_formatted": v.duration_formatted,
                "upload_date": v.upload_date,
                "license": v.license,
                "content_type": v.content_type,
                "iso639_3": v.primary_language.iso639_3,
                "bcp47": v.primary_language.bcp47,
                "language_name": v.primary_language.name,
                "glottocode": v.primary_language.glottocode,
                "autonym": v.primary_language.autonym,
                "dialect": v.primary_language.dialect,
                "country_code": v.country_code,
                "country_name": v.country_name,
                "has_subtitles": v.transcription.has_subtitles,
                "speakers": ", ".join(v.speaker_names),
            })
        return pd.DataFrame(flattened_rows)
