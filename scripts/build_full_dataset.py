# -*- coding: utf-8 -*-
"""
Full dataset validation and report generation script.
Validates all 863 normalized records in data/processed/wikitongues_normalized.jsonl
against SIL ISO 639-3 and Glottolog tables, verifies raw metadata 1-to-1 alignment,
exports to data/processed/wikitongues_normalized.json, and generates data/processed/normalization_report.md.
"""

import json
from pathlib import Path
import sys

repo_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(repo_root))

from src.normalizer.validator import DatasetValidator
from src.normalizer.reporter import NormalizationReporter


def validate_and_report():
    raw_path = repo_root / "data" / "raw" / "wikitongues_youtube_raw.jsonl"
    ref_dir = repo_root / "data" / "references"
    processed_dir = repo_root / "data" / "processed"
    processed_dir.mkdir(parents=True, exist_ok=True)
    in_jsonl = processed_dir / "wikitongues_normalized.jsonl"
    out_json = processed_dir / "wikitongues_normalized.json"
    out_report = processed_dir / "normalization_report.md"

    print("=" * 60)
    print("🚀 Wikitongues Full Dataset Strict Semantic Audit & Build")
    print("=" * 60)

    # 1. Load raw entries for 1-to-1 alignment verification
    with open(raw_path, "r", encoding="utf-8") as f:
        raw_entries = [json.loads(line) for line in f if line.strip()]
    total_raw = len(raw_entries)
    print(f"📦 Total raw videos: {total_raw}")

    # 2. Load normalized entries
    if not in_jsonl.exists():
        print(f"❌ Error: {in_jsonl} not found!")
        sys.exit(1)

    with open(in_jsonl, "r", encoding="utf-8") as f:
        normalized_records = [json.loads(line) for line in f if line.strip()]
    print(f"📄 Total normalized records loaded: {len(normalized_records)}")

    assert len(normalized_records) == total_raw, f"Count mismatch! {len(normalized_records)} vs {total_raw}"

    # 3. Strict validation against SIL ISO 639-3 and Glottolog
    print("\n🔍 Running strict dataset validation against reference tables...")
    validator = DatasetValidator(ref_dir)
    total_errors = 0

    for idx, (norm_rec, raw_entry) in enumerate(zip(normalized_records, raw_entries)):
        if norm_rec["id"] != raw_entry["video_id"]:
            print(f"❌ ID MISMATCH at index {idx} (video #{idx+1}): norm.id={norm_rec['id']}, raw.id={raw_entry['video_id']}")
            total_errors += 1

        errs = validator.validate_record(norm_rec)
        if errs:
            print(f"❌ VALIDATION ERROR at index {idx} (video #{idx+1}, ID {norm_rec['id']}): {errs}")
            total_errors += len(errs)

    if total_errors > 0:
        print(f"\n❌ Validation failed with {total_errors} errors. Aborting report generation.")
        sys.exit(1)

    print(f"✅ All {len(normalized_records)} records validated with 0 errors (100% SIL & Glottolog compliance)!\n")

    # 4. Sync JSON export
    print(f"💾 Exporting normalized array to {out_json}...")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(normalized_records, f, indent=2, ensure_ascii=False)
    print(f"✅ Successfully wrote {len(normalized_records)} records to {out_json}")

    # 5. Generate normalization report
    print(f"📊 Generating normalization report to {out_report}...")
    report_md = NormalizationReporter.generate_report(normalized_records, total_raw_count=total_raw)
    with open(out_report, "w", encoding="utf-8") as f:
        f.write(report_md)
    print(f"✅ Successfully wrote report to {out_report}")

    # 6. Summary metrics
    unique_iso = {r["primary_language"]["iso639_3"] for r in normalized_records}
    unique_glotto = {r["primary_language"].get("glottocode") for r in normalized_records if r["primary_language"].get("glottocode")}
    total_dur = sum(r.get("duration_seconds", 0) for r in normalized_records)

    print("\n" + "=" * 60)
    print("🎉 DATASET VALIDATION & SYNC COMPLETE")
    print("=" * 60)
    print(f"• Total Processed Videos: {len(normalized_records)} / {total_raw} (100%)")
    print(f"• Unique Primary ISO 639-3 Languages: {len(unique_iso)}")
    print(f"• Glottocodes Resolved: {len(unique_glotto)} / {len(normalized_records)} ({len(unique_glotto)/len(normalized_records)*100:.1f}%)")
    print(f"• Total Archival Duration: {total_dur // 3600}h {(total_dur % 3600) // 60}m {total_dur % 60}s")
    print(f"• Normalized JSONL: {in_jsonl}")
    print(f"• Normalized JSON:  {out_json}")
    print(f"• Normalization Report: {out_report}")
    print("=" * 60)


if __name__ == "__main__":
    validate_and_report()
