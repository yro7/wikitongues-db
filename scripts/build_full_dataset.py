# -*- coding: utf-8 -*-
"""
Build and validate the complete Wikitongues normalized dataset (all 863 videos).
Assembles 18 agent-verified batches, performs strict validation against SIL and Glottolog tables,
writes data/processed/wikitongues_normalized.jsonl and data/processed/normalization_report.md.
"""

import json
from dataclasses import asdict
from pathlib import Path
import sys

# Ensure project root is in sys.path
repo_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(repo_root))

from src.normalizer.validator import DatasetValidator
from src.normalizer.reporter import NormalizationReporter

import scripts.batches.batch_01 as b01
import scripts.batches.batch_02 as b02
import scripts.batches.batch_03 as b03
import scripts.batches.batch_04 as b04
import scripts.batches.batch_05 as b05
import scripts.batches.batch_06 as b06
import scripts.batches.batch_07 as b07
import scripts.batches.batch_08 as b08
import scripts.batches.batch_09 as b09
import scripts.batches.batch_10 as b10
import scripts.batches.batch_11 as b11
import scripts.batches.batch_12 as b12
import scripts.batches.batch_13 as b13
import scripts.batches.batch_14 as b14
import scripts.batches.batch_15 as b15
import scripts.batches.batch_16 as b16
import scripts.batches.batch_17 as b17
import scripts.batches.batch_18 as b18


def build_and_validate():
    raw_path = repo_root / "data" / "raw" / "wikitongues_youtube_raw.jsonl"
    ref_dir = repo_root / "data" / "references"
    processed_dir = repo_root / "data" / "processed"
    processed_dir.mkdir(parents=True, exist_ok=True)
    out_jsonl = processed_dir / "wikitongues_normalized.jsonl"
    out_report = processed_dir / "normalization_report.md"

    print("=" * 60)
    print("🚀 Wikitongues Full Dataset Assembly & Strict Semantic Audit")
    print("=" * 60)

    # 1. Load raw entries
    with open(raw_path, "r", encoding="utf-8") as f:
        raw_entries = [json.loads(line) for line in f if line.strip()]

    total_raw = len(raw_entries)
    print(f"📦 Total raw videos loaded: {total_raw}")

    # 2. Assemble batches
    batch_loaders = [
        (1, b01.get_batch_1),
        (2, b02.get_batch_2),
        (3, b03.get_batch_3),
        (4, b04.get_batch_4),
        (5, b05.get_batch_5),
        (6, b06.get_batch_6),
        (7, b07.get_batch_7),
        (8, b08.get_batch_8),
        (9, b09.get_batch_9),
        (10, b10.get_batch_10),
        (11, b11.get_batch_11),
        (12, b12.get_batch_12),
        (13, b13.get_batch_13),
        (14, b14.get_batch_14),
        (15, b15.get_batch_15),
        (16, b16.get_batch_16),
        (17, b17.get_batch_17),
        (18, b18.get_batch_18),
    ]

    all_video_objects = []
    for batch_num, loader in batch_loaders:
        batch_vids = loader(raw_entries)
        print(f"  • Batch {batch_num:02d}: {len(batch_vids)} records loaded")
        all_video_objects.extend(batch_vids)

    print(f"\n✨ Total records assembled: {len(all_video_objects)} / {total_raw}")
    assert len(all_video_objects) == total_raw, f"Count mismatch! {len(all_video_objects)} vs {total_raw}"

    # 3. Strict validation against SIL ISO 639-3 and Glottolog
    print("\n🔍 Running strict dataset validation against reference tables...")
    validator = DatasetValidator(ref_dir)
    records_dict = []
    total_errors = 0

    for idx, (v_obj, raw_entry) in enumerate(zip(all_video_objects, raw_entries)):
        # Check ID alignment
        if v_obj.id != raw_entry["video_id"]:
            print(f"❌ ID MISMATCH at index {idx} (video #{idx+1}): object.id={v_obj.id}, raw.id={raw_entry['video_id']}")
            total_errors += 1

        d = asdict(v_obj)
        errs = validator.validate_record(d)
        if errs:
            print(f"❌ VALIDATION ERROR at index {idx} (video #{idx+1}, ID {v_obj.id}): {errs}")
            total_errors += len(errs)

        records_dict.append(d)

    if total_errors > 0:
        print(f"\n❌ Validation failed with {total_errors} errors. Aborting output generation.")
        sys.exit(1)

    print(f"✅ All {len(records_dict)} records validated with 0 errors (100% SIL & Glottolog compliance)!\n")

    # 4. Write data/processed/wikitongues_normalized.jsonl
    print(f"💾 Writing verified dataset to {out_jsonl}...")
    with open(out_jsonl, "w", encoding="utf-8") as f:
        for rec in records_dict:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")
    print(f"✅ Successfully wrote {len(records_dict)} lines to {out_jsonl}")

    # 5. Generate normalization report
    print(f"📊 Generating normalization report to {out_report}...")
    report_md = NormalizationReporter.generate_report(records_dict, total_raw_count=total_raw)
    with open(out_report, "w", encoding="utf-8") as f:
        f.write(report_md)
    print(f"✅ Successfully wrote report to {out_report}")

    # 6. Summary metrics
    unique_iso = {r["primary_language"]["iso639_3"] for r in records_dict}
    unique_glotto = {r["primary_language"].get("glottocode") for r in records_dict if r["primary_language"].get("glottocode")}
    total_dur = sum(r.get("duration_seconds", 0) for r in records_dict)

    print("\n" + "=" * 60)
    print("🎉 DATASET BUILD COMPLETE")
    print("=" * 60)
    print(f"• Total Processed Videos: {len(records_dict)} / {total_raw} (100%)")
    print(f"• Unique Primary ISO 639-3 Languages: {len(unique_iso)}")
    print(f"• Glottocodes Resolved: {len(unique_glotto)} / {len(records_dict)} ({len(unique_glotto)/len(records_dict)*100:.1f}%)")
    print(f"• Total Archival Duration: {total_dur // 3600}h {(total_dur % 3600) // 60}m {total_dur % 60}s")
    print(f"• Output Dataset: {out_jsonl}")
    print(f"• Normalization Report: {out_report}")
    print("=" * 60)


if __name__ == "__main__":
    build_and_validate()
