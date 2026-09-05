"""Extractor package for Wikitongues metadata ingestion."""

from src.extractor.models import RawVideoMetadata
from src.extractor.youtube import YouTubeExtractor

__all__ = ["RawVideoMetadata", "YouTubeExtractor"]
