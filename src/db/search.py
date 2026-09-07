"""
Full-Text Search Engine with multi-field scoring and relevance ranking for Wikitongues records.
"""

from typing import List, Tuple, Optional, Set
import re
from .models import Video
from .resolver import normalize_text, LanguageResolver
from .collection import VideoCollection


class SearchEngine:
    """
    In-memory full-text search engine with weighted field scoring.
    """

    def __init__(self, videos: List[Video], resolver: Optional[LanguageResolver] = None):
        self.videos = videos
        self.resolver = resolver

    def search(
        self,
        query: str,
        limit: Optional[int] = None,
        min_score: float = 1.0,
    ) -> VideoCollection:
        """
        Execute full-text search across all video metadata and rank results by score.
        """
        if not query or not query.strip():
            return VideoCollection([])

        raw_query = query.strip()
        norm_query = normalize_text(raw_query)
        query_tokens = [t for t in re.split(r"[\s,\-\./]+", norm_query) if t]

        if not query_tokens:
            return VideoCollection([])

        # Check if query matches candidate ISO codes from language resolver
        candidate_isos: Set[str] = set()
        if self.resolver:
            candidate_isos = self.resolver.resolve(raw_query)

        scored_results: List[Tuple[float, Video]] = []

        for video in self.videos:
            score = self._score_video(video, raw_query, norm_query, query_tokens, candidate_isos)
            if score >= min_score:
                scored_results.append((score, video))

        # Sort by score descending
        scored_results.sort(key=lambda item: item[0], reverse=True)

        if limit is not None:
            scored_results = scored_results[:limit]

        return VideoCollection([v for _, v in scored_results])

    def _score_video(
        self,
        video: Video,
        raw_query: str,
        norm_query: str,
        tokens: List[str],
        candidate_isos: Set[str],
    ) -> float:
        score = 0.0

        # 1. Resolver candidate ISO match (exact linguistic match bonus)
        if candidate_isos and (video.primary_language.iso639_3.lower() in candidate_isos or
                               any(al.iso639_3.lower() in candidate_isos for al in video.additional_languages)):
            score += 20.0

        # 2. Primary Language Fields
        pl = video.primary_language
        pl_name_norm = normalize_text(pl.name)
        pl_iso = pl.iso639_3.lower()
        pl_bcp = pl.bcp47.lower()
        pl_auto = normalize_text(pl.autonym or "")
        pl_dial = normalize_text(pl.dialect or "")

        if norm_query == pl_name_norm or norm_query == pl_iso or norm_query == pl_bcp:
            score += 15.0
        elif norm_query in pl_name_norm:
            score += 10.0

        if pl_auto and (norm_query in pl_auto or raw_query.lower() in (pl.autonym or "").lower()):
            score += 12.0

        if pl_dial and norm_query in pl_dial:
            score += 10.0

        # 3. Additional Languages
        for al in video.additional_languages:
            al_name = normalize_text(al.name)
            al_iso = al.iso639_3.lower()
            if norm_query == al_name or norm_query == al_iso:
                score += 8.0
            elif norm_query in al_name:
                score += 5.0

        # 4. Title Matching
        title_norm = normalize_text(video.title)
        if norm_query in title_norm:
            score += 8.0
        for token in tokens:
            if len(token) > 2 and token in title_norm:
                score += 3.0

        # 5. Speaker Names & Roles
        for sp in video.speakers:
            sp_norm = normalize_text(sp.name)
            if sp_norm and sp_norm != "unknown":
                if norm_query == sp_norm:
                    score += 10.0
                elif norm_query in sp_norm:
                    score += 6.0
                for token in tokens:
                    if len(token) > 2 and token in sp_norm:
                        score += 2.0
            if sp.role and norm_query == sp.role.lower():
                score += 4.0

        # 6. Provenance (Country, Region, City)
        cc = (video.country_code or "").lower()
        cname = normalize_text(video.country_name or "")
        city = normalize_text(video.provenance.city or "")
        region = normalize_text(video.provenance.region or "")

        if norm_query == cc or norm_query == cname:
            score += 6.0
        elif norm_query in cname or norm_query in city or norm_query in region:
            score += 4.0

        # 7. Tags
        for tag in video.tags:
            tag_norm = normalize_text(tag)
            if norm_query == tag_norm:
                score += 4.0
            elif norm_query in tag_norm:
                score += 2.0

        # 8. Token coverage bonus
        matched_tokens = 0
        all_text = f"{title_norm} {pl_name_norm} {pl_dial} {cname} {' '.join(normalize_text(t) for t in video.tags)}"
        for token in tokens:
            if token in all_text:
                matched_tokens += 1
        if tokens and matched_tokens == len(tokens):
            score += 5.0

        return score
