# -*- coding: utf-8 -*-
"""
Batch normalization script for Wikitongues dataset.
Extracts, structures, validates, and reports on the first 50 video records.
"""

import json
from pathlib import Path
import sys

# Ensure src is in python path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.normalizer.schemas import (
    WikitonguesVideo,
    PrimaryLanguage,
    AdditionalLanguage,
    Speaker,
    Provenance,
    Transcription,
    RawMetadata
)
from src.normalizer.validator import DatasetValidator
from src.normalizer.reporter import NormalizationReporter


def run_normalization():
    root_dir = Path(__file__).resolve().parent.parent
    raw_path = root_dir / "data" / "raw" / "wikitongues_youtube_raw.jsonl"
    processed_dir = root_dir / "data" / "processed"
    processed_dir.mkdir(parents=True, exist_ok=True)
    
    out_jsonl = processed_dir / "wikitongues_normalized.jsonl"
    report_md = processed_dir / "normalization_report.md"
    references_dir = root_dir / "data" / "references"
    
    # Load raw records
    raw_entries = []
    with open(raw_path, "r", encoding="utf-8") as f:
        for i in range(50):
            line = f.readline()
            if not line:
                break
            raw_entries.append(json.loads(line))
            
    # Cognitive expert normalization records
    records: list[WikitonguesVideo] = [
        # [1] nXBPa_wb3dM
        WikitonguesVideo(
            id="nXBPa_wb3dM",
            url="https://www.youtube.com/watch?v=nXBPa_wb3dM",
            duration_seconds=1182,
            upload_date="2026-07-01",
            license="ALL_RIGHTS_RESERVED",
            content_type="fellowship_doc",
            primary_language=PrimaryLanguage(
                iso639_3="que",
                bcp47="qu",
                glottocode="quec1387",
                name="Quechua",
                autonym="Qhichwa",
                dialect="Cusco Quechua"
            ),
            speakers=[
                Speaker(name="Nicaela León Coico", role="fellow_activist", origin="Peru")
            ],
            provenance=Provenance(
                country_code="PE",
                country_name="Peru"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[0]["title"],
                tags=raw_entries[0].get("tags", [])
            )
        ),
        # [2] lstcnY-UXbs
        WikitonguesVideo(
            id="lstcnY-UXbs",
            url="https://www.youtube.com/watch?v=lstcnY-UXbs",
            duration_seconds=1293,
            upload_date="2026-06-01",
            license="ALL_RIGHTS_RESERVED",
            content_type="fellowship_doc",
            primary_language=PrimaryLanguage(
                iso639_3="aae",
                bcp47="sq-IT",
                glottocode="arbe1236",
                name="Arbëreshë Albanian",
                autonym="Arbërisht",
                dialect="Arbëresh"
            ),
            speakers=[
                Speaker(name="Martin Di Maggio", role="fellow_activist", origin="United Kingdom")
            ],
            provenance=Provenance(
                country_code="IT",
                country_name="Italy"
            ),
            transcription=Transcription(has_subtitles=True, available_subtitles=["en"]),
            raw_metadata=RawMetadata(
                title=raw_entries[1]["title"],
                tags=raw_entries[1].get("tags", [])
            )
        ),
        # [3] HQcLp1qnjHU
        WikitonguesVideo(
            id="HQcLp1qnjHU",
            url="https://www.youtube.com/watch?v=HQcLp1qnjHU",
            duration_seconds=88,
            upload_date="2026-04-29",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="ibo",
                bcp47="ig",
                glottocode="nucl1417",
                name="Igbo",
                autonym="Asụsụ Igbo",
                dialect="Standard Igbo (Igbo izugbe)"
            ),
            speakers=[
                Speaker(name="Lucy", role="native", origin="Nigeria")
            ],
            provenance=Provenance(
                country_code="NG",
                country_name="Nigeria"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[2]["title"],
                tags=raw_entries[2].get("tags", [])
            )
        ),
        # [4] AC8kxj2geOA
        WikitonguesVideo(
            id="AC8kxj2geOA",
            url="https://www.youtube.com/watch?v=AC8kxj2geOA",
            duration_seconds=1018,
            upload_date="2026-04-02",
            license="CC-BY-SA-4.0",
            content_type="conversation",
            primary_language=PrimaryLanguage(
                iso639_3="cak",
                bcp47="cak",
                glottocode="kaqc1270",
                name="Kaqchikel",
                autonym="Kaqchikel"
            ),
            speakers=[
                Speaker(name="Maryori", role="native", origin="Guatemala"),
                Speaker(name="Odilia", role="native", origin="Guatemala")
            ],
            provenance=Provenance(
                country_code="GT",
                country_name="Guatemala"
            ),
            transcription=Transcription(has_subtitles=True, available_subtitles=["en"]),
            raw_metadata=RawMetadata(
                title=raw_entries[3]["title"],
                tags=raw_entries[3].get("tags", [])
            )
        ),
        # [5] B4yY4X1uWpI
        WikitonguesVideo(
            id="B4yY4X1uWpI",
            url="https://www.youtube.com/watch?v=B4yY4X1uWpI",
            duration_seconds=119,
            upload_date="2026-01-20",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="btm",
                bcp47="btm",
                glottocode="bata1291",
                name="Batak Mandailing",
                autonym="Hata Mandailing",
                dialect="Mandailing"
            ),
            speakers=[
                Speaker(name="Suhyar", role="native", origin="Indonesia")
            ],
            provenance=Provenance(
                country_code="ID",
                country_name="Indonesia"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[4]["title"],
                tags=raw_entries[4].get("tags", [])
            )
        ),
        # [6] 92jWmMoDFv0
        WikitonguesVideo(
            id="92jWmMoDFv0",
            url="https://www.youtube.com/watch?v=92jWmMoDFv0",
            duration_seconds=542,
            upload_date="2026-01-13",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="fur",
                bcp47="fur",
                glottocode="friu1240",
                name="Friulian",
                autonym="Furlan"
            ),
            speakers=[
                Speaker(name="Marco", role="native", origin="Italy")
            ],
            provenance=Provenance(
                country_code="IT",
                country_name="Italy",
                region="Friuli"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[5]["title"],
                tags=raw_entries[5].get("tags", [])
            )
        ),
        # [7] 7cMIidnH7xY
        WikitonguesVideo(
            id="7cMIidnH7xY",
            url="https://www.youtube.com/watch?v=7cMIidnH7xY",
            duration_seconds=1171,
            upload_date="2026-01-06",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="jpr",
                bcp47="jpr",
                glottocode="jude1257",
                name="Judeo-Persian",
                autonym="Jidi",
                dialect="Judeo-Shirazi"
            ),
            speakers=[
                Speaker(name="Dr. Elie Alyeshmerni", role="native", origin="Iran")
            ],
            provenance=Provenance(
                country_code="US",
                country_name="United States",
                region="California",
                city="Los Angeles",
                recorded_by="Haideh Herbert-Aynehchi"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[6]["title"],
                tags=raw_entries[6].get("tags", [])
            )
        ),
        # [8] dXYMO6zam90
        WikitonguesVideo(
            id="dXYMO6zam90",
            url="https://www.youtube.com/watch?v=dXYMO6zam90",
            duration_seconds=532,
            upload_date="2025-12-30",
            license="CC-BY-SA-4.0",
            content_type="conversation",
            primary_language=PrimaryLanguage(
                iso639_3="oci",
                bcp47="oc",
                glottocode="occi1239",
                name="Occitan (post 1500)",
                autonym="Lenga d'òc",
                dialect="Vivaro-Alpine"
            ),
            speakers=[
                Speaker(name="Gerard", role="native", origin="France"),
                Speaker(name="Patrick", role="native", origin="France")
            ],
            provenance=Provenance(
                country_code="FR",
                country_name="France",
                region="Auvergne-Rhône-Alpes",
                city="Annonay",
                recording_date="2022-03-16"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[7]["title"],
                tags=raw_entries[7].get("tags", [])
            )
        ),
        # [9] jOEaF9XWII0
        WikitonguesVideo(
            id="jOEaF9XWII0",
            url="https://www.youtube.com/watch?v=jOEaF9XWII0",
            duration_seconds=168,
            upload_date="2025-12-21",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="pcm",
                bcp47="pcm",
                glottocode="nige1257",
                name="Nigerian Pidgin",
                autonym="Naijá"
            ),
            speakers=[
                Speaker(name="Timilehin", role="native", origin="Nigeria")
            ],
            provenance=Provenance(
                country_code="NG",
                country_name="Nigeria"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[8]["title"],
                tags=raw_entries[8].get("tags", [])
            )
        ),
        # [10] wQlK-V5eEFY
        WikitonguesVideo(
            id="wQlK-V5eEFY",
            url="https://www.youtube.com/watch?v=wQlK-V5eEFY",
            duration_seconds=228,
            upload_date="2025-12-16",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="xog",
                bcp47="xog",
                glottocode="soga1242",
                name="Soga",
                autonym="Lusoga"
            ),
            speakers=[
                Speaker(name="Phillip", role="native", origin="Uganda")
            ],
            provenance=Provenance(
                country_code="UG",
                country_name="Uganda",
                region="Busoga"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[9]["title"],
                tags=raw_entries[9].get("tags", [])
            )
        ),
        # [11] 3waS1hmNVig
        WikitonguesVideo(
            id="3waS1hmNVig",
            url="https://www.youtube.com/watch?v=3waS1hmNVig",
            duration_seconds=564,
            upload_date="2025-12-09",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="zab",
                bcp47="zab",
                glottocode="sanj1284",
                name="Western Tlacolula Valley Zapotec",
                autonym="Dizhsa",
                dialect="San Juan Del Río Zapotec"
            ),
            speakers=[
                Speaker(name="Adalberto", role="native", origin="Mexico")
            ],
            provenance=Provenance(
                country_code="MX",
                country_name="Mexico",
                region="Oaxaca",
                city="San Juan Del Río"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[10]["title"],
                tags=raw_entries[10].get("tags", [])
            )
        ),
        # [12] 1vrhTY8cXIo
        WikitonguesVideo(
            id="1vrhTY8cXIo",
            url="https://www.youtube.com/watch?v=1vrhTY8cXIo",
            duration_seconds=132,
            upload_date="2025-12-02",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="tru",
                bcp47="tru",
                glottocode="turo1239",
                name="Turoyo",
                autonym="Surayt (ܣܘܪܝܬ)"
            ),
            speakers=[
                Speaker(name="Romrama", role="native")
            ],
            provenance=Provenance(
                country_code="TR",
                country_name="Turkey",
                region="Tur Abdin"
            ),
            transcription=Transcription(has_subtitles=True, available_subtitles=["en"]),
            raw_metadata=RawMetadata(
                title=raw_entries[11]["title"],
                tags=raw_entries[11].get("tags", [])
            )
        ),
        # [13] cMe_MKYNUtg
        WikitonguesVideo(
            id="cMe_MKYNUtg",
            url="https://www.youtube.com/watch?v=cMe_MKYNUtg",
            duration_seconds=166,
            upload_date="2025-11-25",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="mya",
                bcp47="my",
                glottocode="nucl1310",
                name="Burmese",
                autonym="မြန်မာဘာသာစကား"
            ),
            speakers=[
                Speaker(name="Win", role="native", origin="Myanmar")
            ],
            provenance=Provenance(
                country_code="MM",
                country_name="Myanmar"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[12]["title"],
                tags=raw_entries[12].get("tags", [])
            )
        ),
        # [14] fvbQyuYM-a0
        WikitonguesVideo(
            id="fvbQyuYM-a0",
            url="https://www.youtube.com/watch?v=fvbQyuYM-a0",
            duration_seconds=131,
            upload_date="2025-11-17",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="kaz",
                bcp47="kk",
                glottocode="kaza1248",
                name="Kazakh",
                autonym="Qazaqsha (Қазақша)"
            ),
            speakers=[
                Speaker(name="Buğra", role="native", origin="Kazakhstan")
            ],
            provenance=Provenance(
                country_code="KZ",
                country_name="Kazakhstan"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[13]["title"],
                tags=raw_entries[13].get("tags", [])
            )
        ),
        # [15] PeZHJcQYt3c
        WikitonguesVideo(
            id="PeZHJcQYt3c",
            url="https://www.youtube.com/watch?v=PeZHJcQYt3c",
            duration_seconds=254,
            upload_date="2025-11-10",
            license="PUBLIC_DOMAIN",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="nrf",
                bcp47="nrf",
                glottocode="jerr1238",
                name="Jèrriais",
                autonym="Jèrriais",
                dialect="Jèrriais"
            ),
            speakers=[
                Speaker(name="Geraint", role="native", origin="Jersey")
            ],
            provenance=Provenance(
                country_code="JE",
                country_name="Jersey"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[14]["title"],
                tags=raw_entries[14].get("tags", [])
            )
        ),
        # [16] yr7gko_DaoI
        WikitonguesVideo(
            id="yr7gko_DaoI",
            url="https://www.youtube.com/watch?v=yr7gko_DaoI",
            duration_seconds=75,
            upload_date="2025-11-03",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="ciw",
                bcp47="ciw",
                glottocode="chip1241",
                name="Chippewa",
                autonym="Anishinaabemowin",
                dialect="Southwestern Ojibwe"
            ),
            speakers=[
                Speaker(name="Casey", role="native", origin="United States")
            ],
            provenance=Provenance(
                country_code="US",
                country_name="United States",
                region="Great Lakes"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[15]["title"],
                tags=raw_entries[15].get("tags", [])
            )
        ),
        # [17] He4b1T_sTVM
        WikitonguesVideo(
            id="He4b1T_sTVM",
            url="https://www.youtube.com/watch?v=He4b1T_sTVM",
            duration_seconds=185,
            upload_date="2025-07-30",
            license="PUBLIC_DOMAIN",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="lbj",
                bcp47="lbj",
                glottocode="lada1244",
                name="Ladakhi",
                autonym="ལ་དྭགས་སྐད"
            ),
            speakers=[
                Speaker(name="Kunzang", role="native", origin="India")
            ],
            provenance=Provenance(
                country_code="IN",
                country_name="India",
                region="Ladakh"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[16]["title"],
                tags=raw_entries[16].get("tags", [])
            )
        ),
        # [18] 9LaSurw6GZg
        WikitonguesVideo(
            id="9LaSurw6GZg",
            url="https://www.youtube.com/watch?v=9LaSurw6GZg",
            duration_seconds=222,
            upload_date="2025-07-09",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="aii",
                bcp47="aii",
                glottocode="assy1241",
                name="Assyrian Neo-Aramaic",
                autonym="Suret (ܣܘܪܝܬ)",
                dialect="Iraqi Koine"
            ),
            speakers=[
                Speaker(name="Ashuriena", role="native", origin="Iraq")
            ],
            provenance=Provenance(
                country_code="US",
                country_name="United States",
                region="California"
            ),
            transcription=Transcription(has_subtitles=True, available_subtitles=["en"]),
            raw_metadata=RawMetadata(
                title=raw_entries[17]["title"],
                tags=raw_entries[17].get("tags", [])
            )
        ),
        # [19] KSkvTeEipuc
        WikitonguesVideo(
            id="KSkvTeEipuc",
            url="https://www.youtube.com/watch?v=KSkvTeEipuc",
            duration_seconds=867,
            upload_date="2025-05-09",
            license="ALL_RIGHTS_RESERVED",
            content_type="fellowship_doc",
            primary_language=PrimaryLanguage(
                iso639_3="fon",
                bcp47="fon",
                glottocode="fonn1241",
                name="Fon",
                autonym="Fongbé"
            ),
            speakers=[
                Speaker(name="Mahuton Possoupe", role="fellow_activist", origin="Benin")
            ],
            provenance=Provenance(
                country_code="BJ",
                country_name="Benin"
            ),
            transcription=Transcription(has_subtitles=True, available_subtitles=["en"]),
            raw_metadata=RawMetadata(
                title=raw_entries[18]["title"],
                tags=raw_entries[18].get("tags", [])
            )
        ),
        # [20] i1j6Dymblf8
        WikitonguesVideo(
            id="i1j6Dymblf8",
            url="https://www.youtube.com/watch?v=i1j6Dymblf8",
            duration_seconds=167,
            upload_date="2025-04-15",
            license="CC-BY-SA-4.0",
            content_type="reading_or_song",
            primary_language=PrimaryLanguage(
                iso639_3="frr",
                bcp47="frr",
                glottocode="nort2626",
                name="Northern Frisian",
                autonym="Fering",
                dialect="Fering"
            ),
            speakers=[
                Speaker(name="Andreas", role="native", origin="Germany")
            ],
            provenance=Provenance(
                country_code="DE",
                country_name="Germany",
                region="Föhr, North Frisia"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[19]["title"],
                tags=raw_entries[19].get("tags", [])
            )
        ),
        # [21] D7FgPZhheZ0
        WikitonguesVideo(
            id="D7FgPZhheZ0",
            url="https://www.youtube.com/watch?v=D7FgPZhheZ0",
            duration_seconds=1330,
            upload_date="2025-03-26",
            license="CC-BY-SA-4.0",
            content_type="fellowship_doc",
            primary_language=PrimaryLanguage(
                iso639_3="ekp",
                bcp47="ekp",
                glottocode="ekpe1253",
                name="Ekpeye",
                autonym="Ekpeye"
            ),
            speakers=[
                Speaker(name="High Chief Robinson Olimini", role="native", origin="Nigeria"),
                Speaker(name="Franca Umasoye Igwe", role="fellow_activist", origin="Nigeria")
            ],
            provenance=Provenance(
                country_code="NG",
                country_name="Nigeria",
                region="Rivers State"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[20]["title"],
                tags=raw_entries[20].get("tags", [])
            )
        ),
        # [22] wu03ULM9id4
        WikitonguesVideo(
            id="wu03ULM9id4",
            url="https://www.youtube.com/watch?v=wu03ULM9id4",
            duration_seconds=344,
            upload_date="2025-03-18",
            license="CC-BY-NC-4.0",
            content_type="conversation",
            primary_language=PrimaryLanguage(
                iso639_3="sin",
                bcp47="si",
                glottocode="sinh1246",
                name="Sinhala",
                autonym="සිංහල"
            ),
            speakers=[
                Speaker(name="Prihesh", role="native", origin="Sri Lanka"),
                Speaker(name="Melissa", role="native", origin="Sri Lanka")
            ],
            provenance=Provenance(
                country_code="TW",
                country_name="Taiwan",
                city="Taipei",
                recorded_by="RightsCon 2025"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[21]["title"],
                tags=raw_entries[21].get("tags", [])
            )
        ),
        # [23] FxxC5L372VI
        WikitonguesVideo(
            id="FxxC5L372VI",
            url="https://www.youtube.com/watch?v=FxxC5L372VI",
            duration_seconds=104,
            upload_date="2025-03-10",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="wbm",
                bcp47="wbm",
                glottocode="nucl1290",
                name="Wa",
                autonym="Wa"
            ),
            speakers=[
                Speaker(name="Liying", role="native", origin="China")
            ],
            provenance=Provenance(
                country_code="CN",
                country_name="China",
                region="Yunnan",
                city="Dali"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[22]["title"],
                tags=raw_entries[22].get("tags", [])
            )
        ),
        # [24] TQWD-hkiRg4
        WikitonguesVideo(
            id="TQWD-hkiRg4",
            url="https://www.youtube.com/watch?v=TQWD-hkiRg4",
            duration_seconds=471,
            upload_date="2025-02-20",
            license="ALL_RIGHTS_RESERVED",
            content_type="meta",
            primary_language=PrimaryLanguage(
                iso639_3="eng",
                bcp47="en",
                glottocode="stan1293",
                name="English"
            ),
            additional_languages=[
                AdditionalLanguage(
                    iso639_3="haw",
                    bcp47="haw",
                    glottocode="hawa1245",
                    name="Hawaiian"
                )
            ],
            speakers=[
                Speaker(name="Victor D.O. Santos", role="fellow_activist")
            ],
            provenance=Provenance(
                recorded_by="Victor D.O. Santos"
            ),
            transcription=Transcription(has_subtitles=True, available_subtitles=["en"]),
            raw_metadata=RawMetadata(
                title=raw_entries[23]["title"],
                tags=raw_entries[23].get("tags", [])
            )
        ),
        # [25] 6X3Re1sawRs
        WikitonguesVideo(
            id="6X3Re1sawRs",
            url="https://www.youtube.com/watch?v=6X3Re1sawRs",
            duration_seconds=188,
            upload_date="2025-02-13",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="bba",
                bcp47="bba",
                glottocode="baat1238",
                name="Baatonum",
                autonym="Baatɔnum"
            ),
            speakers=[
                Speaker(name="Abdulrahman", role="native")
            ],
            provenance=Provenance(
                country_code="BJ",
                country_name="Benin"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[24]["title"],
                tags=raw_entries[24].get("tags", [])
            )
        ),
        # [26] KGFew34cjgM
        WikitonguesVideo(
            id="KGFew34cjgM",
            url="https://www.youtube.com/watch?v=KGFew34cjgM",
            duration_seconds=122,
            upload_date="2025-02-04",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="wuu",
                bcp47="wuu",
                glottocode="wuch1236",
                name="Wu Chinese",
                autonym="常熟话",
                dialect="Changshu Wu"
            ),
            speakers=[
                Speaker(name="Meijuan", role="native", origin="China")
            ],
            provenance=Provenance(
                country_code="CN",
                country_name="China",
                region="Jiangsu",
                city="Changshu",
                recorded_by="Ruoyang"
            ),
            transcription=Transcription(has_subtitles=True, available_subtitles=["zh-Hans", "en"]),
            raw_metadata=RawMetadata(
                title=raw_entries[25]["title"],
                tags=raw_entries[25].get("tags", [])
            )
        ),
        # [27] ba0S4UzVkYM
        WikitonguesVideo(
            id="ba0S4UzVkYM",
            url="https://www.youtube.com/watch?v=ba0S4UzVkYM",
            duration_seconds=218,
            upload_date="2025-01-24",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="cld",
                bcp47="cld",
                glottocode="chal1275",
                name="Chaldean Neo-Aramaic",
                autonym="Sureth (ܣܘܪܝܬ)"
            ),
            speakers=[
                Speaker(name="Mahir", role="native", origin="Iraq")
            ],
            provenance=Provenance(
                country_code="IQ",
                country_name="Iraq",
                region="Kurdistan",
                city="Mosul",
                recorded_by="Mahir"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[26]["title"],
                tags=raw_entries[26].get("tags", [])
            )
        ),
        # [28] aVkrLzgPz3A
        WikitonguesVideo(
            id="aVkrLzgPz3A",
            url="https://www.youtube.com/watch?v=aVkrLzgPz3A",
            duration_seconds=260,
            upload_date="2025-01-15",
            license="PUBLIC_DOMAIN",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="fuf",
                bcp47="fuf",
                glottocode="pula1262",
                name="Pular",
                autonym="Pular",
                dialect="Fuuta Jallon"
            ),
            speakers=[
                Speaker(name="Abdoul", role="native", origin="Guinea")
            ],
            provenance=Provenance(
                country_code="GN",
                country_name="Guinea",
                city="Conakry",
                recorded_by="Abdoul"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[27]["title"],
                tags=raw_entries[27].get("tags", [])
            )
        ),
        # [29] 8iLevbjGlVI
        WikitonguesVideo(
            id="8iLevbjGlVI",
            url="https://www.youtube.com/watch?v=8iLevbjGlVI",
            duration_seconds=436,
            upload_date="2025-01-06",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="btm",
                bcp47="btm",
                glottocode="bata1291",
                name="Batak Mandailing",
                autonym="Hata Mandailing",
                dialect="Mandailing"
            ),
            speakers=[
                Speaker(name="Abdullah", role="native", origin="Indonesia")
            ],
            provenance=Provenance(
                country_code="ID",
                country_name="Indonesia",
                region="Sumatera Utara",
                recorded_by="Ikbal"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[28]["title"],
                tags=raw_entries[28].get("tags", [])
            )
        ),
        # [30] -Toi0tco2Gk
        WikitonguesVideo(
            id="-Toi0tco2Gk",
            url="https://www.youtube.com/watch?v=-Toi0tco2Gk",
            duration_seconds=72,
            upload_date="2024-12-17",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="tso",
                bcp47="ts",
                glottocode="tson1249",
                name="Tsonga",
                autonym="Xitsonga"
            ),
            speakers=[
                Speaker(name="Unknown", role="native")
            ],
            provenance=Provenance(
                country_code="ZA",
                country_name="South Africa"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[29]["title"],
                tags=raw_entries[29].get("tags", [])
            )
        ),
        # [31] iGQ-bbRLMJc
        WikitonguesVideo(
            id="iGQ-bbRLMJc",
            url="https://www.youtube.com/watch?v=iGQ-bbRLMJc",
            duration_seconds=143,
            upload_date="2024-12-09",
            license="PUBLIC_DOMAIN",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="ibo",
                bcp47="ig",
                glottocode="nucl1417",
                name="Igbo",
                autonym="Asụsụ Igbo",
                dialect="Central Igbo"
            ),
            speakers=[
                Speaker(name="Tochi", role="native", origin="Nigeria")
            ],
            provenance=Provenance(
                country_code="FI",
                country_name="Finland",
                city="Helsinki"
            ),
            transcription=Transcription(has_subtitles=True, available_subtitles=["en"]),
            raw_metadata=RawMetadata(
                title=raw_entries[30]["title"],
                tags=raw_entries[30].get("tags", [])
            )
        ),
        # [32] vy__EegO_BY
        WikitonguesVideo(
            id="vy__EegO_BY",
            url="https://www.youtube.com/watch?v=vy__EegO_BY",
            duration_seconds=838,
            upload_date="2024-12-04",
            license="ALL_RIGHTS_RESERVED",
            content_type="meta",
            primary_language=PrimaryLanguage(
                iso639_3="eng",
                bcp47="en",
                glottocode="stan1293",
                name="English"
            ),
            speakers=[
                Speaker(name="Kristen", role="fellow_activist")
            ],
            provenance=Provenance(
                recorded_by="Wikitongues"
            ),
            transcription=Transcription(has_subtitles=True, available_subtitles=["en", "live_chat"]),
            raw_metadata=RawMetadata(
                title=raw_entries[31]["title"],
                tags=raw_entries[31].get("tags", [])
            )
        ),
        # [33] N_UOLqmgQrQ
        WikitonguesVideo(
            id="N_UOLqmgQrQ",
            url="https://www.youtube.com/watch?v=N_UOLqmgQrQ",
            duration_seconds=109,
            upload_date="2024-12-02",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="wym",
                bcp47="wym",
                glottocode="wymy1235",
                name="Wymysorys",
                autonym="Wymysiöeryś"
            ),
            speakers=[
                Speaker(name="Unknown", role="native", origin="Poland")
            ],
            provenance=Provenance(
                country_code="PL",
                country_name="Poland",
                city="Wilamowice"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[32]["title"],
                tags=raw_entries[32].get("tags", [])
            )
        ),
        # [34] Lf6AAjLz8Cg
        WikitonguesVideo(
            id="Lf6AAjLz8Cg",
            url="https://www.youtube.com/watch?v=Lf6AAjLz8Cg",
            duration_seconds=87,
            upload_date="2024-11-25",
            license="ALL_RIGHTS_RESERVED",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="tru",
                bcp47="tru",
                glottocode="turo1239",
                name="Turoyo",
                autonym="Ṭuroyo (Surayt / ܣܘܪܝܬ)",
                dialect="Tur Abdin"
            ),
            speakers=[
                Speaker(name="Unknown", role="native")
            ],
            provenance=Provenance(
                country_code="TR",
                country_name="Turkey",
                region="Tur Abdin"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[33]["title"],
                tags=raw_entries[33].get("tags", [])
            )
        ),
        # [35] GehQiDuETPM
        WikitonguesVideo(
            id="GehQiDuETPM",
            url="https://www.youtube.com/watch?v=GehQiDuETPM",
            duration_seconds=128,
            upload_date="2024-11-18",
            license="ALL_RIGHTS_RESERVED",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="mid",
                bcp47="mid",
                glottocode="nucl1706",
                name="Mandaic",
                autonym="Ratna (Mandāyī)",
                dialect="Neo-Mandaic"
            ),
            additional_languages=[
                AdditionalLanguage(
                    iso639_3="myz",
                    bcp47="myz",
                    glottocode="mand1417",
                    name="Classical Mandaic"
                )
            ],
            speakers=[
                Speaker(name="Hussam", role="native", origin="Iran")
            ],
            provenance=Provenance(
                country_code="IR",
                country_name="Iran"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[34]["title"],
                tags=raw_entries[34].get("tags", [])
            )
        ),
        # [36] M2genaU2tj0
        WikitonguesVideo(
            id="M2genaU2tj0",
            url="https://www.youtube.com/watch?v=M2genaU2tj0",
            duration_seconds=199,
            upload_date="2024-11-16",
            license="ALL_RIGHTS_RESERVED",
            content_type="reading_or_song",
            primary_language=PrimaryLanguage(
                iso639_3="nap",
                bcp47="nap-IT",
                glottocode="neap1235",
                name="Neapolitan",
                autonym="Nnapulitano",
                dialect="Andriese"
            ),
            additional_languages=[
                AdditionalLanguage(
                    iso639_3="eng",
                    bcp47="en",
                    glottocode="stan1293",
                    name="English"
                )
            ],
            speakers=[
                Speaker(name="Giandomenico", role="native", origin="Italy")
            ],
            provenance=Provenance(
                country_code="IT",
                country_name="Italy",
                region="Apulia",
                city="Andria"
            ),
            transcription=Transcription(has_subtitles=True, available_subtitles=["en"]),
            raw_metadata=RawMetadata(
                title=raw_entries[35]["title"],
                tags=raw_entries[35].get("tags", [])
            )
        ),
        # [37] 1sEc3I9R_7s
        WikitonguesVideo(
            id="1sEc3I9R_7s",
            url="https://www.youtube.com/watch?v=1sEc3I9R_7s",
            duration_seconds=212,
            upload_date="2024-11-11",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="aii",
                bcp47="aii",
                glottocode="assy1241",
                name="Assyrian Neo-Aramaic",
                autonym="Suret (ܣܘܪܝܬ)",
                dialect="Christian Urmi (C. Urmi)"
            ),
            speakers=[
                Speaker(name="Karmella", role="native", origin="Iran")
            ],
            provenance=Provenance(
                country_code="US",
                country_name="United States",
                region="California",
                recorded_by="Karmella"
            ),
            transcription=Transcription(
                has_subtitles=False,
                available_subtitles=[],
                english_translation="Hello, my name is Karmella, and I am an Assyrian from Urmia living in California. Today, I went on one of my morning walks, and I felt very refreshed after coming back to my house. I used to work in the field of science and I am able to speak three languages, including English, Farsi, and the Urmia dialect of Assyrian Neo-Aramaic. Assyrian Neo-Aramaic is the language of the indigenous Assyrian people, who have traditionally lived in what is now Iraq, Iran, Syria, and Turkey. Although these countries forced Assyrians to assimilate and abandon their language, they were never able to do so, and these communities were able to continue speaking their native language at home. Most of these dialects have survived today, although they are incredibly endangered. I am very proud to be a speaker of Assyrian Neo-Aramaic, the Urmia dialect. It is a language with a very rich and beautiful heritage, that spans back all the way to ancient times, and has survived many challenges in order to continuously survive. I am hopeful that in the future, many young Assyrians will learn to speak the language so that it will continue to survive into the future. I also hope that many initiatives will be taken to document the language so that those young Assyrians can have as many resources as possible to learn their native dialect, including that of Urmia. Thank you very much."
            ),
            raw_metadata=RawMetadata(
                title=raw_entries[36]["title"],
                tags=raw_entries[36].get("tags", [])
            )
        ),
        # [38] UiFZZT6hb2Q
        WikitonguesVideo(
            id="UiFZZT6hb2Q",
            url="https://www.youtube.com/watch?v=UiFZZT6hb2Q",
            duration_seconds=84,
            upload_date="2024-11-08",
            license="ALL_RIGHTS_RESERVED",
            content_type="meta",
            primary_language=PrimaryLanguage(
                iso639_3="eng",
                bcp47="en",
                glottocode="stan1293",
                name="English"
            ),
            speakers=[
                Speaker(name="Wikitongues Team", role="fellow_activist")
            ],
            provenance=Provenance(
                recorded_by="Wikitongues"
            ),
            transcription=Transcription(has_subtitles=True, available_subtitles=["en"]),
            raw_metadata=RawMetadata(
                title=raw_entries[37]["title"],
                tags=raw_entries[37].get("tags", [])
            )
        ),
        # [39] A_A7zRbJpnU
        WikitonguesVideo(
            id="A_A7zRbJpnU",
            url="https://www.youtube.com/watch?v=A_A7zRbJpnU",
            duration_seconds=198,
            upload_date="2024-11-07",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="cia",
                bcp47="cia",
                glottocode="ciac1237",
                name="Cia-Cia",
                autonym="Bahasa Cia-Cia (바하사 찌아찌아)"
            ),
            speakers=[
                Speaker(name="Ari", role="native", origin="Indonesia")
            ],
            provenance=Provenance(
                country_code="ID",
                country_name="Indonesia",
                region="Southeast Sulawesi",
                city="Baubau"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[38]["title"],
                tags=raw_entries[38].get("tags", [])
            )
        ),
        # [40] qUTzZe5JiIY
        WikitonguesVideo(
            id="qUTzZe5JiIY",
            url="https://www.youtube.com/watch?v=qUTzZe5JiIY",
            duration_seconds=437,
            upload_date="2024-11-04",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="gan",
                bcp47="gan",
                glottocode="ganc1239",
                name="Gan Chinese",
                autonym="湖口話",
                dialect="Húkǒu huà (Changdu Gan)"
            ),
            speakers=[
                Speaker(name="蔡懷志 (Huai-Chih Tsai)", role="heritage", origin="China")
            ],
            provenance=Provenance(
                country_code="CN",
                country_name="China",
                region="Jiangxi",
                city="Hukou"
            ),
            transcription=Transcription(
                has_subtitles=False,
                available_subtitles=[],
                native_text="各位朋友，你們好，晚上好。我的名字叫蔡懷志，現在在一間英國的大學讀語言學的本科（生）。今天想跟你們介紹的一個方言呢，是一個叫湖口話的方言。湖口話呢是一個在江西省北部的湖口縣，以及周邊村落，也講的一個方言。雖然湖口縣是隸屬在九江市下的，但是湖口話是屬於贛語昌都片的。可是九江話呢，是屬於官話，江淮官話的分支。所以呢，湖口跟九江的方言是屬於互相聽不懂的一個狀態。這是一個很有趣的一個語言，因為湖口跟九江是比較近的，但是語言呢是真的不通。我的親戚，媽媽那邊的親戚呢也說湖口話這個方言到九江聽不懂，幾乎是聽不通的。\n\n但是呢，今天就想跟觀眾朋友講一個小故事，一個向人生哲理方面的小故事，它的名字叫《爛梨粑》。說是有一個人，他買了一箱梨，但是夏天溫度比較熱，天氣比較熱，就怕梨幾乎要爛。所以這個人是怎麼做呢，就想啊，每天吃個梨。就想趁著梨全爛之前全吃掉。他是怎麼樣做法呢，每天從這個箱子；買了一箱梨後啊，從這個箱子呢，揀一個幾乎要爛的梨吃。不揀好的，揀爛的，幾乎要爛的梨。就一日吃一個梨，一日吃一個梨，每日吃一個幾乎要爛的梨。吃完後，這個人就發現他是真的是傻。吃完梨，全吃的是幾乎爛的，吃不到一個好的。傻不？\n\n有另外一個人啊，見到這個人是幾傻，這麼傻，吃梨支持幾乎爛的，不吃好的。就有感而發，寫一副對聯。上聯寫著，寫著什麼呢，寫著「放著好的吃爛的」。下聯寫著「吃了爛的爛好的」。橫批就寫，「永遠吃爛的」。所以呀，這是什麼咯，放著好的吃爛的，吃了爛的爛好的，永遠吃爛的。這是什麼意思咯，這是說，如果一個人每日只想不開心的事，這個人就日日不開心，天天抑鬱，天天糟心，就不陽光。但是，如果這個人呢，就不揀爛的吃，揀好的吃，就管他爛不爛，爛了買一盒，又不是沒錢。啊，吃好的，想好的東西，日日開心，日日陽光，人生呢就永遠燦爛。喔，這個爛梨粑的故事是跟人生的道理呀，是有關連的。所以朋友們吶，這個道理懂不咯，這個故事有意思不咯，呵呵。\n\n雖然呢，我湖口話講的不是太好，因為我不是湖口土生土長的。而是我媽媽，我奶奶，以及那邊的親戚呢，講湖口話講得比較多。所以我日日，幾乎是日日聽著湖口話長大。所以湖口話我是聽得懂，但是我講湖口話就不是講得太好。就是比較受到國家的，所謂國家的主要語言普通話的影響受得較大。但是普通話的這個分佈呢，不像···不是。湖口話的分佈呢，就不像普通話的大。湖口話是一個方言，是一個，是一個比較···不是強勢的一個方言，弱勢的一個方言。也是呢，人們就應該保護這個方言，不應該讓他消失。因為啊，湖口話的使用頻率呢，是一代一代減少。後生人呢，就不願意，甚至是不會，講這個湖口話。老的人呢就會講，後生人就講普通話，不講普通話。這個現狀呢，就不是太好，應該講這個語言保育起來，那才是好的事，那才是盡好的事。所以呢今天就跟大家講這個湖口方言，湖口話，講到這裡。希望下一次跟大家，朋友們呢，講一些另外的語言。謝謝。"
            ),
            raw_metadata=RawMetadata(
                title=raw_entries[39]["title"],
                tags=raw_entries[39].get("tags", [])
            )
        ),
        # [41] wwwrEdwQ2fQ
        WikitonguesVideo(
            id="wwwrEdwQ2fQ",
            url="https://www.youtube.com/watch?v=wwwrEdwQ2fQ",
            duration_seconds=148,
            upload_date="2024-10-28",
            license="ALL_RIGHTS_RESERVED",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="san",
                bcp47="sa",
                glottocode="sans1269",
                name="Sanskrit",
                autonym="संस्कृतम्"
            ),
            additional_languages=[
                AdditionalLanguage(
                    iso639_3="eng",
                    bcp47="en",
                    glottocode="stan1293",
                    name="English"
                )
            ],
            speakers=[
                Speaker(name="Adamya", role="learner", origin="India")
            ],
            provenance=Provenance(
                country_code="IN",
                country_name="India"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[40]["title"],
                tags=raw_entries[40].get("tags", [])
            )
        ),
        # [42] ZT6gtYz4YD0
        WikitonguesVideo(
            id="ZT6gtYz4YD0",
            url="https://www.youtube.com/watch?v=ZT6gtYz4YD0",
            duration_seconds=306,
            upload_date="2024-04-09",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="frs",
                bcp47="frs",
                glottocode="nort2628",
                name="Eastern Frisian",
                autonym="Oostfräisk",
                dialect="East Frisian Low Saxon"
            ),
            speakers=[
                Speaker(name="Onno Dirk (Oen Diirk Feldman)", role="native", origin="Germany")
            ],
            provenance=Provenance(
                country_code="DE",
                country_name="Germany",
                region="Lower Saxony",
                city="Westoverledingen",
                recorded_by="Onno Dirk"
            ),
            transcription=Transcription(has_subtitles=True, available_subtitles=["en", "de"]),
            raw_metadata=RawMetadata(
                title=raw_entries[41]["title"],
                tags=raw_entries[41].get("tags", [])
            )
        ),
        # [43] RawZDv0yIjQ
        WikitonguesVideo(
            id="RawZDv0yIjQ",
            url="https://www.youtube.com/watch?v=RawZDv0yIjQ",
            duration_seconds=817,
            upload_date="2024-04-04",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="lmo",
                bcp47="lmo",
                glottocode="lomb1257",
                name="Lombard",
                autonym="Lombard (Lumbaart)",
                dialect="Western Lombard"
            ),
            speakers=[
                Speaker(name="Guido Negretti", role="native", origin="Italy"),
                Speaker(name="Ezio Negretti", role="native", origin="Italy"),
                Speaker(name="Eva Leonardi Negretti", role="native", origin="Italy")
            ],
            provenance=Provenance(
                country_code="IT",
                country_name="Italy",
                region="Lombardy",
                recorded_by="Guido Negretti, Ezio Negretti, Eva Leonardi Negretti"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[42]["title"],
                tags=raw_entries[42].get("tags", [])
            )
        ),
        # [44] 3UzO9dhxWak
        WikitonguesVideo(
            id="3UzO9dhxWak",
            url="https://www.youtube.com/watch?v=3UzO9dhxWak",
            duration_seconds=197,
            upload_date="2024-03-28",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="frs",
                bcp47="frs",
                glottocode="nort2628",
                name="Eastern Frisian",
                autonym="Oostfräisk",
                dialect="East Frisian Low Saxon"
            ),
            speakers=[
                Speaker(name="Tido Specht (Tîd Specht)", role="native", origin="Germany")
            ],
            provenance=Provenance(
                country_code="DE",
                country_name="Germany",
                region="Lower Saxony",
                city="Aurich",
                recorded_by="Tido Specht"
            ),
            transcription=Transcription(has_subtitles=True, available_subtitles=["en", "de"]),
            raw_metadata=RawMetadata(
                title=raw_entries[43]["title"],
                tags=raw_entries[43].get("tags", [])
            )
        ),
        # [45] AVSn25LbLhc
        WikitonguesVideo(
            id="AVSn25LbLhc",
            url="https://www.youtube.com/watch?v=AVSn25LbLhc",
            duration_seconds=136,
            upload_date="2024-03-26",
            license="ALL_RIGHTS_RESERVED",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="amh",
                bcp47="am",
                glottocode="amha1245",
                name="Amharic",
                autonym="አማርኛ"
            ),
            speakers=[
                Speaker(name="Amlaku B. Eshetie", role="native", origin="Ethiopia")
            ],
            provenance=Provenance(
                country_code="US",
                country_name="United States",
                region="Colorado",
                recorded_by="Amlaku B. Eshetie"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[44]["title"],
                tags=raw_entries[44].get("tags", [])
            )
        ),
        # [46] A2eea72GoMI
        WikitonguesVideo(
            id="A2eea72GoMI",
            url="https://www.youtube.com/watch?v=A2eea72GoMI",
            duration_seconds=170,
            upload_date="2024-03-22",
            license="ALL_RIGHTS_RESERVED",
            content_type="reading_or_song",
            primary_language=PrimaryLanguage(
                iso639_3="crh",
                bcp47="crh-RO",
                glottocode="crim1257",
                name="Crimean Tatar",
                autonym="qırımtatar tili (tatarşa)",
                dialect="Dobrujan Tatar"
            ),
            speakers=[
                Speaker(name="Berkant Gemil", role="native", origin="Romania")
            ],
            provenance=Provenance(
                country_code="RO",
                country_name="Romania",
                region="Dobruja",
                recorded_by="Berkant Gemil"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[45]["title"],
                tags=raw_entries[45].get("tags", [])
            )
        ),
        # [47] efJPrwwPmsM
        WikitonguesVideo(
            id="efJPrwwPmsM",
            url="https://www.youtube.com/watch?v=efJPrwwPmsM",
            duration_seconds=209,
            upload_date="2024-02-29",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="gon",
                bcp47="gon",
                glottocode="nort3258",
                name="Gondi",
                autonym="Gōndi (गोंडी / Kōītur)",
                dialect="Aheri Gondi"
            ),
            speakers=[
                Speaker(name="Shamrao Uik", role="native", origin="India")
            ],
            provenance=Provenance(
                country_code="IN",
                country_name="India",
                recorded_by="Shamrao Uik, Rohini Lakshané"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[46]["title"],
                tags=raw_entries[46].get("tags", [])
            )
        ),
        # [48] CQT4rdig8KY
        WikitonguesVideo(
            id="CQT4rdig8KY",
            url="https://www.youtube.com/watch?v=CQT4rdig8KY",
            duration_seconds=164,
            upload_date="2024-02-27",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="eno",
                bcp47="eno",
                glottocode="engg1245",
                name="Enggano",
                autonym="Enggano"
            ),
            speakers=[
                Speaker(name="Engga Zakaria", role="native", origin="Indonesia"),
                Speaker(name="Milson Kaitora", role="native", origin="Indonesia")
            ],
            provenance=Provenance(
                country_code="GB",
                country_name="United Kingdom",
                city="Oxford",
                recorded_by="Daniel Krauße, Milson Kaitora, Engga Zakaria"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[47]["title"],
                tags=raw_entries[47].get("tags", [])
            )
        ),
        # [49] K_AxZMICTsU
        WikitonguesVideo(
            id="K_AxZMICTsU",
            url="https://www.youtube.com/watch?v=K_AxZMICTsU",
            duration_seconds=692,
            upload_date="2023-05-05",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="zab",
                bcp47="zab",
                glottocode="sanj1284",
                name="Western Tlacolula Valley Zapotec",
                autonym="Dizhsa",
                dialect="San Lucas Quiaviní Zapotec"
            ),
            speakers=[
                Speaker(name="Rodrigo García", role="native", origin="Mexico")
            ],
            provenance=Provenance(
                country_code="MX",
                country_name="Mexico",
                region="Oaxaca",
                city="San Lucas Quiaviní",
                recorded_by="Nicholas Biniaz-Harris"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[48]["title"],
                tags=raw_entries[48].get("tags", [])
            )
        ),
        # [50] yaesWLLJIRg
        WikitonguesVideo(
            id="yaesWLLJIRg",
            url="https://www.youtube.com/watch?v=yaesWLLJIRg",
            duration_seconds=235,
            upload_date="2023-05-03",
            license="ALL_RIGHTS_RESERVED",
            content_type="conversation",
            primary_language=PrimaryLanguage(
                iso639_3="trw",
                bcp47="trw",
                glottocode="torw1241",
                name="Torwali",
                autonym="توروالی",
                dialect="Bahrain"
            ),
            speakers=[
                Speaker(name="Inam", role="native", origin="Pakistan"),
                Speaker(name="Zubair Torwali", role="fellow_activist", origin="Pakistan")
            ],
            provenance=Provenance(
                country_code="PK",
                country_name="Pakistan",
                region="Swat District",
                city="Bahrain"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[49]["title"],
                tags=raw_entries[49].get("tags", [])
            )
        ),
    ]

    print(f"Total structured records: {len(records)}")
    
    # Run strict validation
    validator = DatasetValidator(references_dir)
    has_errors = False
    for idx, r in enumerate(records, 1):
        r_dict = r.to_dict()
        errs = validator.validate_record(r_dict)
        if errs:
            has_errors = True
            print(f"❌ Record #{idx} ({r.id}) errors:")
            for err in errs:
                print(f"   - {err}")
                
    if has_errors:
        print("Aborting due to validation errors.")
        sys.exit(1)
        
    print("✅ All 50 records successfully passed strict SIL & Glottolog validation (0 errors, 0 hallucinations)!")
    
    # Write JSONL
    with open(out_jsonl, "w", encoding="utf-8") as f:
        for r in records:
            f.write(r.to_json() + "\n")
    print(f"💾 Written normalized JSONL records to {out_jsonl}")
    
    # Generate and write report
    dicts = [r.to_dict() for r in records]
    report_content = NormalizationReporter.generate_report(dicts, total_raw_count=len(raw_entries))
    with open(report_md, "w", encoding="utf-8") as f:
        f.write(report_content)
    print(f"📄 Generated normalization report at {report_md}")


if __name__ == "__main__":
    run_normalization()
