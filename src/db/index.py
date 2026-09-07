"""
In-memory Inverted Index engine for Wikitongues Database.
Provides O(1) indexed lookups by ID, ISO 639-3, BCP 47, Glottocode, Country, Speaker, License, etc.
"""

from typing import Dict, List, Optional, Set
from .models import Video
from .resolver import normalize_text


class DatasetIndex:
    """
    Maintains indexed mappings across all dimensions for fast O(1) retrieval.
    """

    def __init__(self, videos: List[Video]):
        self.videos = videos
        self.by_id: Dict[str, Video] = {}
        self.by_iso: Dict[str, List[Video]] = {}
        self.by_iso_primary: Dict[str, List[Video]] = {}
        self.by_bcp47: Dict[str, List[Video]] = {}
        self.by_glottocode: Dict[str, List[Video]] = {}
        self.by_country_code: Dict[str, List[Video]] = {}
        self.by_country_name: Dict[str, List[Video]] = {}
        self.by_speaker_role: Dict[str, List[Video]] = {}
        self.by_speaker_name: Dict[str, List[Video]] = {}
        self.by_content_type: Dict[str, List[Video]] = {}
        self.by_license: Dict[str, List[Video]] = {}
        self.with_subtitles: List[Video] = []

        self._build_indices()

    def _build_indices(self):
        for video in self.videos:
            # 1. ID Index
            if video.id:
                self.by_id[video.id] = video

            # 2. ISO 639-3 Primary & All
            pl_iso = video.primary_language.iso639_3.lower().strip()
            if pl_iso:
                self.by_iso_primary.setdefault(pl_iso, []).append(video)
                self.by_iso.setdefault(pl_iso, []).append(video)

            for add_lang in video.additional_languages:
                a_iso = add_lang.iso639_3.lower().strip()
                if a_iso and a_iso != pl_iso:
                    self.by_iso.setdefault(a_iso, []).append(video)

            # 3. BCP 47 Index
            for lang in video.all_languages:
                bcp = lang.bcp47.lower().strip()
                if bcp:
                    self.by_bcp47.setdefault(bcp, []).append(video)
                    if "-" in bcp:
                        prefix = bcp.split("-")[0]
                        self.by_bcp47.setdefault(prefix, []).append(video)

            # 4. Glottocode Index
            for lang in video.all_languages:
                gc = (lang.glottocode or "").lower().strip()
                if gc:
                    self.by_glottocode.setdefault(gc, []).append(video)

            # 5. Country Index (code & name)
            cc = (video.provenance.country_code or "").upper().strip()
            if cc:
                self.by_country_code.setdefault(cc, []).append(video)
                self.by_country_code.setdefault(cc.lower(), []).append(video)

            cname = video.provenance.country_name
            if cname:
                norm_cname = normalize_text(cname)
                self.by_country_name.setdefault(norm_cname, []).append(video)

            # 6. Speaker Index
            for sp in video.speakers:
                if sp.role:
                    self.by_speaker_role.setdefault(sp.role.lower(), []).append(video)
                if sp.name and sp.name.lower() != "unknown":
                    norm_sp = normalize_text(sp.name)
                    self.by_speaker_name.setdefault(norm_sp, []).append(video)

            # 7. Content Type Index
            if video.content_type:
                self.by_content_type.setdefault(video.content_type.lower(), []).append(video)

            # 8. License Index
            if video.license:
                self.by_license.setdefault(video.license, []).append(video)

            # 9. Subtitles Index
            if video.transcription.has_subtitles:
                self.with_subtitles.append(video)
