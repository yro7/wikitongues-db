"""
Strict schema definitions for Wikitongues normalized dataset.
"""

from typing import List, Optional, Literal
from dataclasses import dataclass, field, asdict
import json


LicenseType = Literal[
    'CC-BY-4.0',
    'CC-BY-SA-4.0',
    'CC-BY-NC-4.0',
    'ALL_RIGHTS_RESERVED',
    'PUBLIC_DOMAIN'
]

ContentType = Literal[
    'oral_history',
    'conversation',
    'sign_language',
    'reading_or_song',
    'language_lesson',
    'fellowship_doc',
    'meta'
]

SpeakerRole = Literal[
    'native',
    'heritage',
    'learner',
    'fellow_activist',
    'unknown'
]


@dataclass
class PrimaryLanguage:
    iso639_3: str
    bcp47: str
    name: str
    glottocode: Optional[str] = None
    autonym: Optional[str] = None
    dialect: Optional[str] = None


@dataclass
class AdditionalLanguage:
    iso639_3: str
    bcp47: str
    name: str
    glottocode: Optional[str] = None


@dataclass
class Speaker:
    name: str
    role: SpeakerRole
    origin: Optional[str] = None


@dataclass
class Provenance:
    country_code: Optional[str] = None
    country_name: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None
    recorded_by: Optional[str] = None
    recording_date: Optional[str] = None


@dataclass
class Transcription:
    has_subtitles: bool = False
    available_subtitles: List[str] = field(default_factory=list)
    native_text: Optional[str] = None
    english_translation: Optional[str] = None


@dataclass
class RawMetadata:
    title: str
    tags: List[str] = field(default_factory=list)


@dataclass
class WikitonguesVideo:
    id: str
    url: str
    duration_seconds: int
    upload_date: str
    license: LicenseType
    content_type: ContentType
    primary_language: PrimaryLanguage
    additional_languages: List[AdditionalLanguage] = field(default_factory=list)
    speakers: List[Speaker] = field(default_factory=list)
    provenance: Provenance = field(default_factory=Provenance)
    transcription: Optional[Transcription] = None
    raw_metadata: RawMetadata = field(default_factory=lambda: RawMetadata(title=""))

    def to_dict(self) -> dict:
        """Convert to dictionary, omitting None values where appropriate while maintaining required structure."""
        def filter_nones(d):
            if isinstance(d, dict):
                return {k: filter_nones(v) for k, v in d.items() if v is not None}
            elif isinstance(d, list):
                return [filter_nones(v) for v in d]
            return d
        return filter_nones(asdict(self))

    def to_json(self) -> str:
        return json.dumps(self.to_dict(), ensure_ascii=False)
