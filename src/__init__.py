"""
Wikitongues DB: A high-level library and lightweight database mapping ISO 639-3 and BCP 47 codes
to curated Wikitongues oral history video recordings.
"""

from .db import (
    WikitonguesDB,
    Video,
    VideoCollection,
    Language,
    Speaker,
    Provenance,
    Transcription,
    RawMetadata,
    QueryBuilder,
    SearchEngine,
    LanguageResolver,
)

__version__ = "0.1.0"

__all__ = [
    "WikitonguesDB",
    "Video",
    "VideoCollection",
    "Language",
    "Speaker",
    "Provenance",
    "Transcription",
    "RawMetadata",
    "QueryBuilder",
    "SearchEngine",
    "LanguageResolver",
]
