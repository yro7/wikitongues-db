"""Data models for raw video metadata extraction."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


@dataclass
class RawVideoMetadata:
    video_id: str
    url: str
    title: str
    description: str
    upload_date: Optional[str] = None
    timestamp: Optional[int] = None
    duration: Optional[int] = None
    view_count: Optional[int] = None
    like_count: Optional[int] = None
    tags: List[str] = field(default_factory=list)
    channel_id: Optional[str] = None
    channel_title: Optional[str] = None
    subtitles_available: List[str] = field(default_factory=list)
    automatic_captions_available: List[str] = field(default_factory=list)
    thumbnail_url: Optional[str] = None
    extracted_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_yt_dlp_dict(cls, data: Dict[str, Any]) -> RawVideoMetadata:
        """Parse a yt-dlp info dict into a clean RawVideoMetadata object."""
        video_id = data.get("id") or ""
        url = data.get("webpage_url") or f"https://www.youtube.com/watch?v={video_id}"
        title = (data.get("title") or "").strip()
        description = data.get("description") or ""

        # Subtitles
        subtitles_dict = data.get("subtitles") or {}
        auto_subtitles_dict = data.get("automatic_captions") or {}

        # Thumbnails
        thumbnails = data.get("thumbnails") or []
        best_thumb = thumbnails[-1]["url"] if thumbnails and "url" in thumbnails[-1] else None

        return cls(
            video_id=video_id,
            url=url,
            title=title,
            description=description,
            upload_date=data.get("upload_date"),
            timestamp=data.get("timestamp"),
            duration=data.get("duration"),
            view_count=data.get("view_count"),
            like_count=data.get("like_count"),
            tags=data.get("tags") or [],
            channel_id=data.get("channel_id"),
            channel_title=data.get("channel") or data.get("uploader"),
            subtitles_available=list(subtitles_dict.keys()),
            automatic_captions_available=list(auto_subtitles_dict.keys()),
            thumbnail_url=best_thumb,
        )
