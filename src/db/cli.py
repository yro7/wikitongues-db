"""
Command-Line Interface (CLI) for Wikitongues Database.
Enables instant lookups, query filtering, full-text searches, and dataset statistics from the terminal.
"""

import argparse
import sys
import json
from .client import WikitonguesDB


def main():
    parser = argparse.ArgumentParser(
        prog="wikitongues-db",
        description="Wikitongues Database CLI - High-level querying & discovery for oral history recordings",
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # 1. Query command
    query_parser = subparsers.add_parser("query", help="Filter videos by multiple criteria")
    query_parser.add_argument("-l", "--language", help="Language name, ISO 639-3, BCP 47, autonym, or alias (e.g. 'russe', 'rus', 'Quechua')")
    query_parser.add_argument("-c", "--country", help="Country code or name (e.g. 'PE', 'Peru')")
    query_parser.add_argument("-s", "--speaker", help="Speaker name or role")
    query_parser.add_argument("-t", "--type", help="Content type (oral_history, conversation, etc.)")
    query_parser.add_argument("--cc", action="store_true", help="Creative Commons license only")
    query_parser.add_argument("--subtitles", action="store_true", help="Only videos with subtitles")
    query_parser.add_argument("--limit", type=int, default=10, help="Maximum number of results to display (default: 10)")
    query_parser.add_argument("--json", action="store_true", help="Output results as raw JSON")

    # 2. Search command
    search_parser = subparsers.add_parser("search", help="Full-text search across all video metadata")
    search_parser.add_argument("query_str", help="Search keywords (e.g. 'dagestan caucasian', 'russian oral history')")
    search_parser.add_argument("--limit", type=int, default=10, help="Maximum number of results (default: 10)")
    search_parser.add_argument("--json", action="store_true", help="Output results as raw JSON")

    # 3. Stats command
    subparsers.add_parser("stats", help="Show aggregate dataset statistics")

    # 4. Random command
    random_parser = subparsers.add_parser("random", help="Get random video(s)")
    random_parser.add_argument("-n", type=int, default=1, help="Number of random videos (default: 1)")
    random_parser.add_argument("-l", "--language", help="Optional language filter")
    random_parser.add_argument("-c", "--country", help="Optional country filter")
    random_parser.add_argument("--json", action="store_true", help="Output results as raw JSON")

    # 5. Languages command
    lang_parser = subparsers.add_parser("languages", help="List all represented languages")
    lang_parser.add_argument("--limit", type=int, default=30, help="Top N languages by video count (default: 30)")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(0)

    db = WikitonguesDB()

    if args.command == "stats":
        stats = db.stats()
        print("\n📊 Wikitongues Dataset Statistics")
        print("==================================")
        print(f"Total Videos:         {stats['total_videos']:,}")
        print(f"Total Languages:      {stats['total_languages']:,} distinct ISO 639-3 codes")
        print(f"Total Countries:      {stats['total_countries']}")
        print(f"Total Recording Time: {stats['total_duration_hours']:.1f} hours ({stats['total_duration_seconds']:,} seconds)")
        print(f"Subtitled Videos:     {stats['with_subtitles_count']} ({stats['with_subtitles_percentage']}%)")
        print("\nContent Types:")
        for ctype, count in stats["content_types"].items():
            print(f"  - {ctype:<20}: {count}")
        print("\nLicenses:")
        for lic, count in stats["licenses"].items():
            print(f"  - {lic:<20}: {count}")
        print()

    elif args.command == "query":
        q = db.query()
        if args.language:
            q.language(args.language)
        if args.country:
            q.country(args.country)
        if args.speaker:
            q.speaker(name=args.speaker)
        if args.type:
            q.content_type(args.type)
        if args.cc:
            q.creative_commons_only()
        if args.subtitles:
            q.with_subtitles()

        results = q.limit(args.limit).all()

        if args.json:
            print(results.to_json())
        else:
            _print_video_results(results, f"Query Results ({len(results)} found, showing up to {args.limit})")

    elif args.command == "search":
        results = db.search(args.query_str, limit=args.limit)
        if args.json:
            print(results.to_json())
        else:
            _print_video_results(results, f"Search Results for '{args.query_str}' ({len(results)} match(es))")

    elif args.command == "random":
        results = db.random(n=args.n, language=args.language, country=args.country)
        if args.json:
            print(results.to_json())
        else:
            _print_video_results(results, f"🎲 Random Pick ({len(results)} video(s))")

    elif args.command == "languages":
        langs = db.languages()[:args.limit]
        print(f"\n🌍 Top {len(langs)} Languages in Wikitongues")
        print(f"{'ISO':<6} {'BCP 47':<8} {'Name':<28} {'Videos':<8} {'Total Time'}")
        print("-" * 65)
        for item in langs:
            m = item['total_duration_seconds'] // 60
            s = item['total_duration_seconds'] % 60
            time_str = f"{m}m {s}s"
            print(f"{item['iso639_3']:<6} {item['bcp47']:<8} {item['name'][:26]:<28} {item['video_count']:<8} {time_str}")
        print()


def _print_video_results(results, title: str):
    print(f"\n🎬 {title}")
    print("=" * 80)
    if not results:
        print("No matching videos found.")
        print()
        return

    for idx, v in enumerate(results, 1):
        sp_str = ", ".join(v.speaker_names) if v.speaker_names else "Unknown"
        country_str = f"[{v.country_code}] {v.country_name}" if v.country_code else "Unknown"
        sub_str = "Subtitles: Yes" if v.transcription.has_subtitles else "Subtitles: No"

        print(f"#{idx:<2} | {v.primary_language.name} ({v.primary_language.iso639_3}) | {v.duration_formatted} | {country_str}")
        print(f"    Title:   {v.title}")
        print(f"    URL:     {v.url}")
        print(f"    Speaker: {sp_str} | License: {v.license} | {sub_str}")
        if v.primary_language.autonym:
            print(f"    Autonym: {v.primary_language.autonym}")
        if v.primary_language.dialect:
            print(f"    Dialect: {v.primary_language.dialect}")
        print("-" * 80)
    print(f"Total Duration: {results.total_duration_formatted}\n")


if __name__ == "__main__":
    main()
