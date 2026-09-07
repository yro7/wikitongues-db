"""
Domain models for the high-level Wikitongues Database API.
Provides typed, immutable-friendly dataclasses with rich helper methods.
"""

from dataclasses import dataclass, field, asdict
from typing import List, Optional, Set, Dict, Any
import json


@dataclass(frozen=True)
class Language:
    iso639_3: str
    bcp47: str
    name: str
    glottocode: Optional[str] = None
    autonym: Optional[str] = None
    dialect: Optional[str] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Language":
        return cls(
            iso639_3=data.get("iso639_3", ""),
            bcp47=data.get("bcp47", ""),
            name=data.get("name", ""),
            glottocode=data.get("glottocode"),
            autonym=data.get("autonym"),
            dialect=data.get("dialect"),
        )


@dataclass(frozen=True)
class Speaker:
    name: str
    role: str = "native"
    origin: Optional[str] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Speaker":
        return cls(
            name=data.get("name", ""),
            role=data.get("role", "native"),
            origin=data.get("origin"),
        )


@dataclass(frozen=True)
class Provenance:
    country_code: Optional[str] = None
    country_name: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None
    recorded_by: Optional[str] = None
    recording_date: Optional[str] = None

    @classmethod
    def from_dict(cls, data: Optional[Dict[str, Any]]) -> "Provenance":
        if not data:
            return cls()
        return cls(
            country_code=data.get("country_code"),
            country_name=data.get("country_name"),
            region=data.get("region"),
            city=data.get("city"),
            recorded_by=data.get("recorded_by"),
            recording_date=data.get("recording_date"),
        )


@dataclass(frozen=True)
class Transcription:
    has_subtitles: bool = False
    available_subtitles: List[str] = field(default_factory=list)
    native_text: Optional[str] = None
    english_translation: Optional[str] = None

    @classmethod
    def from_dict(cls, data: Optional[Dict[str, Any]]) -> "Transcription":
        if not data:
            return cls()
        return cls(
            has_subtitles=bool(data.get("has_subtitles", False)),
            available_subtitles=list(data.get("available_subtitles", [])),
            native_text=data.get("native_text"),
            english_translation=data.get("english_translation"),
        )


@dataclass(frozen=True)
class RawMetadata:
    title: str = ""
    tags: List[str] = field(default_factory=list)

    @classmethod
    def from_dict(cls, data: Optional[Dict[str, Any]]) -> "RawMetadata":
        if not data:
            return cls()
        return cls(
            title=data.get("title", ""),
            tags=list(data.get("tags", [])),
        )


@dataclass(frozen=True)
class Video:
    id: str
    url: str
    duration_seconds: int
    upload_date: str
    license: str
    content_type: str
    primary_language: Language
    additional_languages: List[Language] = field(default_factory=list)
    speakers: List[Speaker] = field(default_factory=list)
    provenance: Provenance = field(default_factory=Provenance)
    transcription: Transcription = field(default_factory=Transcription)
    raw_metadata: RawMetadata = field(default_factory=RawMetadata)

    @property
    def embed_url(self) -> str:
        """Returns the YouTube embed URL for iframe players."""
        return f"https://www.youtube.com/embed/{self.id}"

    @property
    def title(self) -> str:
        """Returns video title."""
        return self.raw_metadata.title

    @property
    def tags(self) -> List[str]:
        """Returns raw metadata tags."""
        return self.raw_metadata.tags

    @property
    def duration_formatted(self) -> str:
        """Returns human-readable duration formatted as 'MM:SS' or 'HH:MM:SS'."""
        total = self.duration_seconds
        hours = total // 3600
        minutes = (total % 3600) // 60
        seconds = total % 60
        if hours > 0:
            return f"{hours}:{minutes:02d}:{seconds:02d}"
        return f"{minutes:02d}:{seconds:02d}"

    @property
    def is_creative_commons(self) -> bool:
        """True if the video is licensed under any Creative Commons or Public Domain license."""
        return self.license.startswith("CC-BY") or self.license == "PUBLIC_DOMAIN"

    @property
    def all_languages(self) -> List[Language]:
        """Returns all languages (primary + additional)."""
        return [self.primary_language] + self.additional_languages

    @property
    def all_iso_codes(self) -> Set[str]:
        """Returns all ISO 639-3 codes for this video."""
        return {lang.iso639_3 for lang in self.all_languages if lang.iso639_3}

    @property
    def all_bcp47_codes(self) -> Set[str]:
        """Returns all BCP 47 codes for this video."""
        return {lang.bcp47 for lang in self.all_languages if lang.bcp47}

    @property
    def all_glottocodes(self) -> Set[str]:
        """Returns all Glottolog codes for this video."""
        return {lang.glottocode for lang in self.all_languages if lang.glottocode}

    @property
    def speaker_names(self) -> List[str]:
        """Returns list of speaker names."""
        return [sp.name for sp in self.speakers if sp.name and sp.name.lower() != "unknown"]

    @property
    def country_code(self) -> Optional[str]:
        return self.provenance.country_code

    @property
    def country_name(self) -> Optional[str]:
        return self.provenance.country_name

    def has_language(self, query: str) -> bool:
        """
        Check if video contains a language matching query (by ISO, BCP-47, Glottocode, Name, Autonym, or Dialect).
        Case-insensitive.
        """
        import re
        q = query.strip()
        q_lower = q.lower()
        pattern = re.compile(rf"\b{re.escape(q_lower)}\b", re.IGNORECASE)

        for lang in self.all_languages:
            if lang.iso639_3 and lang.iso639_3.lower() == q_lower:
                return True
            if lang.bcp47 and (lang.bcp47.lower() == q_lower or lang.bcp47.lower().startswith(f"{q_lower}-")):
                return True
            if lang.glottocode and lang.glottocode.lower() == q_lower:
                return True
            if lang.name and (lang.name.lower() == q_lower or pattern.search(lang.name.lower())):
                return True
            if lang.autonym and (lang.autonym.lower() == q_lower or pattern.search(lang.autonym.lower()) or q in lang.autonym):
                return True
            if lang.dialect and (lang.dialect.lower() == q_lower or pattern.search(lang.dialect.lower())):
                return True
        return False

    def has_speaker(self, name_or_role: str) -> bool:
        """Check if any speaker matches the name or role (case-insensitive substring match)."""
        q = name_or_role.strip().lower()
        for sp in self.speakers:
            if sp.name and q in sp.name.lower():
                return True
            if sp.role and q == sp.role.lower():
                return True
        return False

    def has_country(self, country: str) -> bool:
        """Check if provenance country matches country code or name (case-insensitive)."""
        import re
        q = country.strip()
        q_lower = q.lower()
        if len(q) == 2 and q.isalpha() and self.provenance.country_code:
            return self.provenance.country_code.upper() == q.upper()
        if self.provenance.country_name:
            cname = self.provenance.country_name.lower()
            if cname == q_lower or re.search(rf"\b{re.escape(q_lower)}\b", cname):
                return True
        return False

    def to_dict(self) -> Dict[str, Any]:
        """Convert Video object into a standard dictionary without None values."""
        def filter_nones(d):
            if isinstance(d, dict):
                return {k: filter_nones(v) for k, v in d.items() if v is not None}
            elif isinstance(d, list):
                return [filter_nones(v) for v in d]
            return d
        return filter_nones(asdict(self))

    def to_json(self, indent: Optional[int] = None) -> str:
        """Serialize Video to JSON string."""
        return json.dumps(self.to_dict(), ensure_ascii=False, indent=indent)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Video":
        """Construct a Video instance from a raw or normalized dictionary."""
        pl_data = data.get("primary_language", {})
        primary_language = Language.from_dict(pl_data)

        add_langs = [
            Language.from_dict(item) for item in data.get("additional_languages", [])
        ]
        speakers = [
            Speaker.from_dict(item) for item in data.get("speakers", [])
        ]
        provenance = Provenance.from_dict(data.get("provenance"))
        transcription = Transcription.from_dict(data.get("transcription"))
        raw_metadata = RawMetadata.from_dict(data.get("raw_metadata"))

        return cls(
            id=str(data.get("id", "")),
            url=str(data.get("url", "")),
            duration_seconds=int(data.get("duration_seconds", 0)),
            upload_date=str(data.get("upload_date", "")),
            license=str(data.get("license", "ALL_RIGHTS_RESERVED")),
            content_type=str(data.get("content_type", "oral_history")),
            primary_language=primary_language,
            additional_languages=add_langs,
            speakers=speakers,
            provenance=provenance,
            transcription=transcription,
            raw_metadata=raw_metadata,
        )
