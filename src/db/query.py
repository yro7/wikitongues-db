"""
Fluent QueryBuilder for Wikitongues Database.
Enables expressive, composable, and chainable querying over Wikitongues records.
"""

from typing import (
    List,
    Optional,
    Callable,
    Union,
    Sequence,
    Set,
    Any,
)
from .models import Video
from .collection import VideoCollection
from .resolver import LanguageResolver, normalize_text


class QueryBuilder:
    """
    Fluent builder for querying and filtering the Wikitongues dataset.
    """

    def __init__(
        self,
        videos: Sequence[Video],
        resolver: Optional[LanguageResolver] = None,
    ):
        self._source_videos: Sequence[Video] = videos
        self._resolver: Optional[LanguageResolver] = resolver
        self._filters: List[Callable[[Video], bool]] = []
        self._sort_key: Optional[Union[str, Callable[[Video], Any]]] = None
        self._sort_descending: bool = False
        self._limit_val: Optional[int] = None
        self._offset_val: Optional[int] = None

    def clone(self) -> "QueryBuilder":
        """Create a shallow clone of the query builder."""
        cloned = QueryBuilder(self._source_videos, self._resolver)
        cloned._filters = list(self._filters)
        cloned._sort_key = self._sort_key
        cloned._sort_descending = self._sort_descending
        cloned._limit_val = self._limit_val
        cloned._offset_val = self._offset_val
        return cloned

    # -------------------------------------------------------------------------
    # Filtering Methods
    # -------------------------------------------------------------------------

    def language(
        self,
        query: str,
        include_additional: bool = True,
    ) -> "QueryBuilder":
        """
        Filter videos matching a language (by ISO 639-3, BCP 47, Glottocode,
        canonical English name, multilingual aliases like 'russe', autonyms, or dialects).
        """
        if not query or not query.strip():
            return self

        import re
        raw = query.strip()
        raw_lower = raw.lower()
        norm = normalize_text(raw)
        matched_isos: Set[str] = set()

        if self._resolver:
            matched_isos = self._resolver.resolve(raw)

        # Build word-boundary pattern for name/autonym/dialect search
        pattern = re.compile(rf"\b{re.escape(norm)}\b", re.IGNORECASE) if norm else None

        def match_lang_obj(lang) -> bool:
            l_iso = lang.iso639_3.lower()
            if l_iso in matched_isos or l_iso == raw_lower:
                return True

            l_bcp = lang.bcp47.lower()
            if l_bcp == raw_lower or l_bcp.startswith(f"{raw_lower}-"):
                return True

            if (lang.glottocode or "").lower() == raw_lower:
                return True

            l_name_norm = normalize_text(lang.name)
            if norm and (l_name_norm == norm or (pattern and pattern.search(l_name_norm))):
                return True

            if lang.autonym:
                l_auto_norm = normalize_text(lang.autonym)
                if norm and (l_auto_norm == norm or (pattern and pattern.search(l_auto_norm)) or raw in lang.autonym):
                    return True

            if lang.dialect:
                l_dial_norm = normalize_text(lang.dialect)
                if norm and (l_dial_norm == norm or (pattern and pattern.search(l_dial_norm))):
                    return True

            return False

        def predicate(video: Video) -> bool:
            if match_lang_obj(video.primary_language):
                return True
            if include_additional:
                for al in video.additional_languages:
                    if match_lang_obj(al):
                        return True
            return False

        self._filters.append(predicate)
        return self

    def iso(self, code: str, include_additional: bool = True) -> "QueryBuilder":
        """Filter by exact ISO 639-3 code."""
        code_clean = code.strip().lower()

        def predicate(v: Video) -> bool:
            if v.primary_language.iso639_3.lower() == code_clean:
                return True
            if include_additional:
                return any(al.iso639_3.lower() == code_clean for al in v.additional_languages)
            return False

        self._filters.append(predicate)
        return self

    def bcp47(self, tag: str, exact: bool = False) -> "QueryBuilder":
        """Filter by BCP 47 tag (prefix match by default, or exact match)."""
        tag_clean = tag.strip().lower()

        def predicate(v: Video) -> bool:
            for lang in v.all_languages:
                ltag = lang.bcp47.lower()
                if exact:
                    if ltag == tag_clean:
                        return True
                else:
                    if ltag == tag_clean or ltag.startswith(f"{tag_clean}-"):
                        return True
            return False

        self._filters.append(predicate)
        return self

    def glottocode(self, code: str) -> "QueryBuilder":
        """Filter by Glottolog 8-character ID."""
        code_clean = code.strip().lower()

        def predicate(v: Video) -> bool:
            for lang in v.all_languages:
                if (lang.glottocode or "").lower() == code_clean:
                    return True
            return False

        self._filters.append(predicate)
        return self

    def country(self, country_code_or_name: str) -> "QueryBuilder":
        """Filter by ISO 3166-1 alpha-2 country code or country name."""
        import re
        c_clean = country_code_or_name.strip()
        c_norm = normalize_text(c_clean)
        is_alpha2 = len(c_clean) == 2 and c_clean.isalpha()
        pattern = re.compile(rf"\b{re.escape(c_norm)}\b", re.IGNORECASE) if c_norm else None

        def predicate(v: Video) -> bool:
            if is_alpha2 and v.country_code and v.country_code.upper() == c_clean.upper():
                return True
            if v.country_name:
                v_cname_norm = normalize_text(v.country_name)
                if v_cname_norm == c_norm or (pattern and pattern.search(v_cname_norm)):
                    return True
            return False

        self._filters.append(predicate)
        return self

    def speaker(
        self,
        name: Optional[str] = None,
        role: Optional[str] = None,
        origin: Optional[str] = None,
    ) -> "QueryBuilder":
        """Filter by speaker attributes (name substring, role, or origin)."""
        name_norm = normalize_text(name) if name else None
        role_norm = role.strip().lower() if role else None
        origin_norm = normalize_text(origin) if origin else None

        def predicate(v: Video) -> bool:
            for sp in v.speakers:
                matched = True
                if name_norm and name_norm not in normalize_text(sp.name):
                    matched = False
                if role_norm and sp.role.lower() != role_norm:
                    matched = False
                if origin_norm and origin_norm not in normalize_text(sp.origin or ""):
                    matched = False
                if matched:
                    return True
            return False

        self._filters.append(predicate)
        return self

    def content_type(self, *types: str) -> "QueryBuilder":
        """Filter by allowed content types (e.g. 'oral_history', 'conversation', etc.)."""
        allowed = {t.lower().strip() for t in types}

        def predicate(v: Video) -> bool:
            return v.content_type.lower() in allowed

        self._filters.append(predicate)
        return self

    def license(self, *licenses: str) -> "QueryBuilder":
        """Filter by license types (e.g. 'CC-BY-4.0', 'CC-BY-NC-4.0', etc.)."""
        allowed = set(licenses)

        def predicate(v: Video) -> bool:
            return v.license in allowed

        self._filters.append(predicate)
        return self

    def creative_commons_only(self) -> "QueryBuilder":
        """Filter only videos with Creative Commons or Public Domain licenses."""
        self._filters.append(lambda v: v.is_creative_commons)
        return self

    def with_subtitles(self, lang: Optional[str] = None) -> "QueryBuilder":
        """Filter videos that have subtitles (optionally in a specific language code)."""
        if lang:
            l_clean = lang.strip().lower()
            self._filters.append(
                lambda v: v.transcription.has_subtitles and l_clean in [s.lower() for s in v.transcription.available_subtitles]
            )
        else:
            self._filters.append(lambda v: v.transcription.has_subtitles)
        return self

    def without_subtitles(self) -> "QueryBuilder":
        """Filter videos without subtitles."""
        self._filters.append(lambda v: not v.transcription.has_subtitles)
        return self

    def min_duration(self, seconds: int) -> "QueryBuilder":
        """Filter videos with duration >= seconds."""
        self._filters.append(lambda v: v.duration_seconds >= seconds)
        return self

    def max_duration(self, seconds: int) -> "QueryBuilder":
        """Filter videos with duration <= seconds."""
        self._filters.append(lambda v: v.duration_seconds <= seconds)
        return self

    def duration_between(self, min_seconds: int, max_seconds: int) -> "QueryBuilder":
        """Filter videos with duration between min and max seconds (inclusive)."""
        self._filters.append(lambda v: min_seconds <= v.duration_seconds <= max_seconds)
        return self

    def uploaded_after(self, date_str: str) -> "QueryBuilder":
        """Filter videos uploaded on or after YYYY-MM-DD."""
        self._filters.append(lambda v: v.upload_date >= date_str)
        return self

    def uploaded_before(self, date_str: str) -> "QueryBuilder":
        """Filter videos uploaded on or before YYYY-MM-DD."""
        self._filters.append(lambda v: v.upload_date <= date_str)
        return self

    def uploaded_between(self, start_date: str, end_date: str) -> "QueryBuilder":
        """Filter videos uploaded between start and end date (inclusive)."""
        self._filters.append(lambda v: start_date <= v.upload_date <= end_date)
        return self

    def recorded_by(self, name: str) -> "QueryBuilder":
        """Filter videos recorded by a specific person/organization."""
        norm_name = normalize_text(name)
        self._filters.append(
            lambda v: norm_name in normalize_text(v.provenance.recorded_by or "")
        )
        return self

    def filter(self, predicate: Callable[[Video], bool]) -> "QueryBuilder":
        """Attach a custom predicate function for arbitrary filtering."""
        self._filters.append(predicate)
        return self

    # -------------------------------------------------------------------------
    # Sorting & Slicing
    # -------------------------------------------------------------------------

    def order_by(
        self,
        key: Union[str, Callable[[Video], Any]],
        descending: bool = False,
    ) -> "QueryBuilder":
        """Set sorting criteria for results."""
        self._sort_key = key
        self._sort_descending = descending
        return self

    def limit(self, n: int) -> "QueryBuilder":
        """Limit maximum number of returned results."""
        self._limit_val = n
        return self

    def offset(self, n: int) -> "QueryBuilder":
        """Offset starting position of returned results."""
        self._offset_val = n
        return self

    def page(self, page: int = 1, page_size: int = 20) -> "QueryBuilder":
        """Set 1-indexed pagination."""
        if page < 1:
            page = 1
        self._offset_val = (page - 1) * page_size
        self._limit_val = page_size
        return self

    # -------------------------------------------------------------------------
    # Execution Methods
    # -------------------------------------------------------------------------

    def all(self) -> VideoCollection:
        """Execute query and return resulting VideoCollection."""
        matched = [
            v for v in self._source_videos
            if all(f(v) for f in self._filters)
        ]
        results = VideoCollection(matched)

        if self._sort_key is not None:
            results = results.sort_by(self._sort_key, descending=self._sort_descending)

        if self._offset_val is not None:
            results = results.offset(self._offset_val)

        if self._limit_val is not None:
            results = results.limit(self._limit_val)

        return results

    def first(self) -> Optional[Video]:
        """Execute query and return first matching Video, or None."""
        for v in self._source_videos:
            if all(f(v) for f in self._filters):
                return v
        return None

    def last(self) -> Optional[Video]:
        """Execute query and return last matching Video, or None."""
        return self.all().last()

    def count(self) -> int:
        """Count total matching records without overhead."""
        return sum(1 for v in self._source_videos if all(f(v) for f in self._filters))

    def exists(self) -> bool:
        """True if at least one record matches the criteria."""
        return self.first() is not None

    def random(self, n: int = 1, seed: Optional[int] = None) -> VideoCollection:
        """Return a random sample of n matching videos."""
        return self.all().sample(k=n, seed=seed)
