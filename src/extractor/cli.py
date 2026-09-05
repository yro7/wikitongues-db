"""CLI entrypoint for YouTube raw extraction."""

from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

from src.extractor.youtube import YouTubeExtractor


def setup_logging(verbose: bool = False) -> None:
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%H:%M:%S",
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extract raw metadata from Wikitongues YouTube channel into JSONL format."
    )
    parser.add_argument(
        "--channel",
        type=str,
        default="https://www.youtube.com/playlist?list=UUBgWgQyEb5eTzvh4lLcuipQ",
        help="YouTube channel / playlist URL (default: https://www.youtube.com/playlist?list=UUBgWgQyEb5eTzvh4lLcuipQ)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="data/raw/wikitongues_youtube_raw.jsonl",
        help="Output JSON Lines file path (default: data/raw/wikitongues_youtube_raw.jsonl)",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Maximum number of videos to discover/extract (for test/preview)",
    )
    parser.add_argument(
        "--min-delay",
        type=float,
        default=0.4,
        help="Minimum delay between video requests in seconds (default: 0.4)",
    )
    parser.add_argument(
        "--max-delay",
        type=float,
        default=1.0,
        help="Maximum delay between video requests in seconds (default: 1.0)",
    )
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="Enable verbose debug logging",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    setup_logging(args.verbose)

    extractor = YouTubeExtractor(
        channel_url=args.channel,
        output_file=args.output,
        min_delay=args.min_delay,
        max_delay=args.max_delay,
    )

    stats = extractor.run(limit=args.limit)
    print(f"\n✅ Summary: {stats['newly_extracted']} newly extracted, {stats['already_cached']} cached, {stats['failed']} failed.")


if __name__ == "__main__":
    main()
