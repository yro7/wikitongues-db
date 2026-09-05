"""YouTube extractor implementation using yt-dlp."""

from __future__ import annotations

import json
import logging
import random
import time
from pathlib import Path
from typing import Callable, Dict, List, Optional, Set

from tqdm import tqdm
import yt_dlp

from src.extractor.models import RawVideoMetadata

logger = logging.getLogger("wikitongues_db.extractor")


class YouTubeExtractor:
    """Extracts raw metadata from YouTube channels with resumption and rate-limit control."""

    def __init__(
        self,
        channel_url: str = "https://www.youtube.com/@Wikitongues/videos",
        output_file: Path | str = "data/raw/wikitongues_youtube_raw.jsonl",
        min_delay: float = 0.5,
        max_delay: float = 1.2,
        max_retries: int = 3,
    ) -> None:
        self.channel_url = channel_url
        self.output_file = Path(output_file)
        self.min_delay = min_delay
        self.max_delay = max_delay
        self.max_retries = max_retries

    def get_existing_video_ids(self) -> Set[str]:
        """Read existing JSONL file and return set of video IDs already extracted."""
        if not self.output_file.exists():
            return set()

        existing_ids: Set[str] = set()
        with open(self.output_file, "r", encoding="utf-8") as f:
            for line_idx, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue
                try:
                    entry = json.loads(line)
                    if "video_id" in entry:
                        existing_ids.add(entry["video_id"])
                    elif "id" in entry:
                        existing_ids.add(entry["id"])
                except json.JSONDecodeError as err:
                    logger.warning("Corrupted JSON on line %d of %s: %s", line_idx, self.output_file, err)
        return existing_ids

    def discover_video_entries(self, limit: Optional[int] = None) -> List[Dict[str, str]]:
        """Fast pass 1: Discover all video IDs and titles without downloading full webpage bodies."""
        logger.info("Discovering videos from %s ...", self.channel_url)
        ydl_opts = {
            "extract_flat": True,
            "skip_download": True,
            "quiet": True,
            "no_warnings": True,
        }
        if limit:
            ydl_opts["playlist_items"] = f"1-{limit}"

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            res = ydl.extract_info(self.channel_url, download=False)
            if not res or "entries" not in res:
                return []
            entries = []
            for item in res["entries"]:
                if item and "id" in item:
                    entries.append({
                        "id": item["id"],
                        "title": item.get("title", ""),
                        "url": item.get("url") or f"https://www.youtube.com/watch?v={item['id']}",
                    })
            return entries

    def extract_single_video(self, video_url: str) -> Optional[RawVideoMetadata]:
        """Extract full detailed metadata for a single video with retry logic."""
        ydl_opts = {
            "extract_flat": False,
            "skip_download": True,
            "quiet": True,
            "no_warnings": True,
            "extractor_args": {
                "youtube": {
                    "player_client": ["ios", "android", "web"],
                }
            },
        }

        for attempt in range(1, self.max_retries + 1):
            try:
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(video_url, download=False)
                    if info:
                        return RawVideoMetadata.from_yt_dlp_dict(info)
            except Exception as e:
                logger.debug("Attempt %d/%d failed for %s: %s", attempt, self.max_retries, video_url, e)
                if attempt < self.max_retries:
                    time.sleep(2.0 * attempt)
                else:
                    logger.error("Failed to extract metadata for %s after %d attempts: %s", video_url, self.max_retries, e)
        return None

    def run(
        self,
        limit: Optional[int] = None,
        progress_callback: Optional[Callable[[int, int, RawVideoMetadata], None]] = None,
    ) -> Dict[str, int]:
        """Execute the two-pass extraction and append results incrementally."""
        self.output_file.parent.mkdir(parents=True, exist_ok=True)
        existing_ids = self.get_existing_video_ids()
        logger.info("Found %d already extracted videos in %s", len(existing_ids), self.output_file)

        # 1. Discover all videos
        discovered = self.discover_video_entries(limit=limit)
        logger.info("Discovered %d total videos on channel", len(discovered))

        # 2. Filter remaining
        pending = [v for v in discovered if v["id"] not in existing_ids]
        logger.info("Pending extraction: %d videos (%d already cached)", len(pending), len(discovered) - len(pending))

        if not pending:
            logger.info("All discovered videos are already present in dataset. Nothing to do.")
            return {
                "total_discovered": len(discovered),
                "already_cached": len(existing_ids),
                "newly_extracted": 0,
                "failed": 0,
            }

        newly_extracted = 0
        failed = 0

        # 3. Incremental extraction loop
        with open(self.output_file, "a", encoding="utf-8") as out_f:
            with tqdm(total=len(pending), desc="Extracting Wikitongues metadata", unit="video") as pbar:
                for idx, item in enumerate(pending, 1):
                    v_id = item["id"]
                    v_url = item["url"]

                    metadata = self.extract_single_video(v_url)
                    if metadata:
                        out_f.write(json.dumps(metadata.to_dict(), ensure_ascii=False) + "\n")
                        out_f.flush()
                        newly_extracted += 1
                        if progress_callback:
                            progress_callback(idx, len(pending), metadata)
                    else:
                        failed += 1

                    pbar.set_postfix({
                        "cached": len(existing_ids),
                        "saved": newly_extracted,
                        "failed": failed,
                    })
                    pbar.update(1)

                    # Anti-throttling jitter delay
                    if self.max_delay > 0:
                        sleep_time = random.uniform(self.min_delay, self.max_delay)
                        time.sleep(sleep_time)

        logger.info(
            "Extraction completed: %d newly extracted, %d failed, total cached: %d",
            newly_extracted,
            failed,
            len(existing_ids) + newly_extracted,
        )

        return {
            "total_discovered": len(discovered),
            "already_cached": len(existing_ids),
            "newly_extracted": newly_extracted,
            "failed": failed,
        }
