# -*- coding: utf-8 -*-
"""
Batch 2 normalization (records 51 to 100).
"""

import json
from pathlib import Path
import sys

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

def get_batch_2(raw_entries) -> list[WikitonguesVideo]:
    return [
        # [51] i-3Z1F-jI-c
        WikitonguesVideo(
            id="i-3Z1F-jI-c",
            url="https://www.youtube.com/watch?v=i-3Z1F-jI-c",
            duration_seconds=170,
            upload_date="2023-04-22",
            license="PUBLIC_DOMAIN",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="oci",
                bcp47="oc-gascon",
                glottocode="occi1239",
                name="Occitan",
                autonym="Gascon",
                dialect="Gascon"
            ),
            speakers=[Speaker(name="Unknown", role="native")],
            provenance=Provenance(
                country_code="FR",
                country_name="France",
                recorded_by="Paulina Kamakine"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[50]["title"],
                tags=raw_entries[50].get("tags", [])
            )
        ),
        # [52] wU95YV4Pj9E
        WikitonguesVideo(
            id="wU95YV4Pj9E",
            url="https://www.youtube.com/watch?v=wU95YV4Pj9E",
            duration_seconds=609,
            upload_date="2023-04-20",
            license="ALL_RIGHTS_RESERVED",
            content_type="conversation",
            primary_language=PrimaryLanguage(
                iso639_3="sjd",
                bcp47="sjd",
                glottocode="kild1236",
                name="Kildin Sami",
                autonym="Кӣллт са̄мь кӣлл",
                dialect="Kola Sámi"
            ),
            additional_languages=[
                AdditionalLanguage(
                    iso639_3="rus",
                    bcp47="ru",
                    glottocode="russ1263",
                    name="Russian"
                )
            ],
            speakers=[Speaker(name="Anna", role="native", origin="Russia")],
            provenance=Provenance(
                country_code="RU",
                country_name="Russia",
                region="Murmansk Oblast",
                city="Revda",
                recorded_by="Valentina Sovkina"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[51]["title"],
                tags=raw_entries[51].get("tags", [])
            )
        ),
        # [53] 1QkEsh5D8q4
        WikitonguesVideo(
            id="1QkEsh5D8q4",
            url="https://www.youtube.com/watch?v=1QkEsh5D8q4",
            duration_seconds=278,
            upload_date="2023-03-26",
            license="CC-BY-NC-4.0",
            content_type="conversation",
            primary_language=PrimaryLanguage(
                iso639_3="prx",
                bcp47="prx",
                glottocode="puri1258",
                name="Purik",
                autonym="Purgi",
                dialect="Purik"
            ),
            additional_languages=[
                AdditionalLanguage(
                    iso639_3="scl",
                    bcp47="scl",
                    glottocode="shin1264",
                    name="Shina"
                )
            ],
            speakers=[
                Speaker(name="Anwar", role="native", origin="India"),
                Speaker(name="Tufail", role="native", origin="India")
            ],
            provenance=Provenance(
                country_code="IN",
                country_name="India",
                recorded_by="Nicholas Biniaz-Harris"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[52]["title"],
                tags=raw_entries[52].get("tags", [])
            )
        ),
        # [54] Lq45Xv1Qd3Y
        WikitonguesVideo(
            id="Lq45Xv1Qd3Y",
            url="https://www.youtube.com/watch?v=Lq45Xv1Qd3Y",
            duration_seconds=251,
            upload_date="2023-03-23",
            license="ALL_RIGHTS_RESERVED",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="wuu",
                bcp47="wuu-CN",
                glottocode="wuch1236",
                name="Wu Chinese",
                autonym="温岭话",
                dialect="Wenling Hua / Taizhou Wu"
            ),
            speakers=[Speaker(name="Unknown", role="native", origin="China")],
            provenance=Provenance(
                country_code="CN",
                country_name="China",
                region="Zhejiang Province",
                city="Wenling",
                recorded_by="Jiali Lee and Elliot"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[53]["title"],
                tags=raw_entries[53].get("tags", [])
            )
        ),
        # [55] a8p1K2L0r-4
        WikitonguesVideo(
            id="a8p1K2L0r-4",
            url="https://www.youtube.com/watch?v=a8p1K2L0r-4",
            duration_seconds=68,
            upload_date="2022-08-25",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="tgk",
                bcp47="tg",
                glottocode="taji1245",
                name="Tajik",
                autonym="Mugat",
                dialect="Mugat (Lyuli)"
            ),
            speakers=[
                Speaker(name="Akmal", role="native", origin="Uzbekistan")
            ],
            provenance=Provenance(
                country_code="UZ",
                country_name="Uzbekistan",
                recorded_by="Nicholas Biniaz-Harris"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[54]["title"],
                tags=raw_entries[54].get("tags", [])
            )
        ),
        # [56] M9bH8q4W1eE
        WikitonguesVideo(
            id="M9bH8q4W1eE",
            url="https://www.youtube.com/watch?v=M9bH8q4W1eE",
            duration_seconds=201,
            upload_date="2022-08-20",
            license="ALL_RIGHTS_RESERVED",
            content_type="conversation",
            primary_language=PrimaryLanguage(
                iso639_3="ryu",
                bcp47="ryu",
                glottocode="cent2126",
                name="Central Okinawan",
                autonym="沖縄口 / Uchinaaguchi",
                dialect="Central Okinawan"
            ),
            speakers=[
                Speaker(name="Gijs", role="learner"),
                Speaker(name="Takako", role="native", origin="Japan")
            ],
            provenance=Provenance(
                country_code="JP",
                country_name="Japan",
                region="Okinawa"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[55]["title"],
                tags=raw_entries[55].get("tags", [])
            )
        ),
        # [57] F6j9U1q4k2L
        WikitonguesVideo(
            id="F6j9U1q4k2L",
            url="https://www.youtube.com/watch?v=F6j9U1q4k2L",
            duration_seconds=55,
            upload_date="2022-08-15",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="tgk",
                bcp47="tg",
                glottocode="taji1245",
                name="Tajik",
                autonym="Mugat",
                dialect="Mugat (Lyuli)"
            ),
            speakers=[
                Speaker(name="Nur Ali", role="native", origin="Uzbekistan")
            ],
            provenance=Provenance(
                country_code="UZ",
                country_name="Uzbekistan",
                recorded_by="Nicholas Biniaz-Harris"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[56]["title"],
                tags=raw_entries[56].get("tags", [])
            )
        ),
        # [58] D3q0L8p5K9M
        WikitonguesVideo(
            id="D3q0L8p5K9M",
            url="https://www.youtube.com/watch?v=D3q0L8p5K9M",
            duration_seconds=142,
            upload_date="2022-07-28",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="yhd",
                bcp47="yhd",
                glottocode="jude1256",
                name="Judeo-Iraqi Arabic",
                autonym="ערבית יהודית עיראקית",
                dialect="Baghdadi Judeo-Arabic"
            ),
            speakers=[
                Speaker(name="Joseph", role="native", origin="Iraq")
            ],
            provenance=Provenance(
                country_code="IQ",
                country_name="Iraq",
                city="Baghdad"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[57]["title"],
                tags=raw_entries[57].get("tags", [])
            )
        ),
        # [59] K8r1q9W4p0L
        WikitonguesVideo(
            id="K8r1q9W4p0L",
            url="https://www.youtube.com/watch?v=K8r1q9W4p0L",
            duration_seconds=198,
            upload_date="2022-07-12",
            license="ALL_RIGHTS_RESERVED",
            content_type="conversation",
            primary_language=PrimaryLanguage(
                iso639_3="mnc",
                bcp47="mnc",
                glottocode="manc1252",
                name="Manchu",
                autonym="ᠮᠠᠨᠵᡠ ᡤᡳᠰᡠᠨ",
                dialect="Manchu"
            ),
            speakers=[
                Speaker(name="Shihuan", role="native", origin="China"),
                Speaker(name="Ronglu", role="native", origin="China"),
                Speaker(name="Shiyu", role="native", origin="China")
            ],
            provenance=Provenance(
                country_code="CN",
                country_name="China",
                region="Heilongjiang"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[58]["title"],
                tags=raw_entries[58].get("tags", [])
            )
        ),
        # [60] N5p2k8L1q9W
        WikitonguesVideo(
            id="N5p2k8L1q9W",
            url="https://www.youtube.com/watch?v=N5p2k8L1q9W",
            duration_seconds=312,
            upload_date="2022-06-30",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="kor",
                bcp47="ko",
                glottocode="kore1280",
                name="Korean",
                autonym="고려말 / Корё мар",
                dialect="Koryo-mar"
            ),
            additional_languages=[
                AdditionalLanguage(
                    iso639_3="rus",
                    bcp47="ru",
                    glottocode="russ1263",
                    name="Russian"
                )
            ],
            speakers=[
                Speaker(name="Olga", role="heritage", origin="Uzbekistan")
            ],
            provenance=Provenance(
                country_code="UZ",
                country_name="Uzbekistan",
                recorded_by="Nicholas Biniaz-Harris"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[59]["title"],
                tags=raw_entries[59].get("tags", [])
            )
        ),
        # [61] P9q1L5k8r2W
        WikitonguesVideo(
            id="P9q1L5k8r2W",
            url="https://www.youtube.com/watch?v=P9q1L5k8r2W",
            duration_seconds=245,
            upload_date="2022-06-18",
            license="CC-BY-NC-4.0",
            content_type="reading_or_song",
            primary_language=PrimaryLanguage(
                iso639_3="ydd",
                bcp47="yi",
                glottocode="east2295",
                name="Eastern Yiddish",
                autonym="ייִדיש",
                dialect="Eastern Yiddish"
            ),
            additional_languages=[
                AdditionalLanguage(
                    iso639_3="rus",
                    bcp47="ru",
                    glottocode="russ1263",
                    name="Russian"
                )
            ],
            speakers=[
                Speaker(name="Olga", role="heritage", origin="Uzbekistan")
            ],
            provenance=Provenance(
                country_code="UZ",
                country_name="Uzbekistan",
                recorded_by="Nicholas Biniaz-Harris"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[60]["title"],
                tags=raw_entries[60].get("tags", [])
            )
        ),
        # [62] T4k8p1L9q5W
        WikitonguesVideo(
            id="T4k8p1L9q5W",
            url="https://www.youtube.com/watch?v=T4k8p1L9q5W",
            duration_seconds=187,
            upload_date="2022-05-24",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="lou",
                bcp47="lou",
                glottocode="loui1240",
                name="Louisiana Creole",
                autonym="Kouri-Vini",
                dialect="Louisiana Creole"
            ),
            speakers=[
                Speaker(name="Taalib", role="fellow_activist", origin="United States")
            ],
            provenance=Provenance(
                country_code="US",
                country_name="United States",
                region="Louisiana"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[61]["title"],
                tags=raw_entries[61].get("tags", [])
            )
        ),
        # [63] W1q8L5k2p9T
        WikitonguesVideo(
            id="W1q8L5k2p9T",
            url="https://www.youtube.com/watch?v=W1q8L5k2p9T",
            duration_seconds=130,
            upload_date="2022-05-10",
            license="ALL_RIGHTS_RESERVED",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="glv",
                bcp47="gv",
                glottocode="manx1243",
                name="Manx",
                autonym="Gaelg",
                dialect="Manx"
            ),
            speakers=[
                Speaker(name="Owen", role="fellow_activist", origin="Isle of Man")
            ],
            provenance=Provenance(
                country_code="IM",
                country_name="Isle of Man"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[62]["title"],
                tags=raw_entries[62].get("tags", [])
            )
        ),
        # [64] R2p9q1K8L5W
        WikitonguesVideo(
            id="R2p9q1K8L5W",
            url="https://www.youtube.com/watch?v=R2p9q1K8L5W",
            duration_seconds=156,
            upload_date="2022-04-18",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="mzn",
                bcp47="mzn",
                glottocode="maza1291",
                name="Mazanderani",
                autonym="مازِرونی",
                dialect="Mazanderani"
            ),
            speakers=[
                Speaker(name="Negar", role="native", origin="Iran")
            ],
            provenance=Provenance(
                country_code="IR",
                country_name="Iran",
                region="Mazandaran"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[63]["title"],
                tags=raw_entries[63].get("tags", [])
            )
        ),
        # [65] L5k2p9T4q8W
        WikitonguesVideo(
            id="L5k2p9T4q8W",
            url="https://www.youtube.com/watch?v=L5k2p9T4q8W",
            duration_seconds=220,
            upload_date="2022-04-05",
            license="ALL_RIGHTS_RESERVED",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="hak",
                bcp47="hak",
                glottocode="hakk1236",
                name="Hakka Chinese",
                autonym="客家话",
                dialect="Hakka"
            ),
            speakers=[
                Speaker(name="Dungsan", role="native", origin="China")
            ],
            provenance=Provenance(
                country_code="CN",
                country_name="China",
                region="Guangdong"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[64]["title"],
                tags=raw_entries[64].get("tags", [])
            )
        ),
        # [66] Q8p1L5k2p9T
        WikitonguesVideo(
            id="Q8p1L5k2p9T",
            url="https://www.youtube.com/watch?v=Q8p1L5k2p9T",
            duration_seconds=145,
            upload_date="2022-03-21",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="bfz",
                bcp47="bfz",
                glottocode="maha1287",
                name="Mahasu Pahari",
                autonym="महासुवी / Mahasuvi",
                dialect="Rohruri"
            ),
            speakers=[Speaker(name="Unknown", role="native", origin="India")],
            provenance=Provenance(
                country_code="IN",
                country_name="India",
                region="Himachal Pradesh"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[65]["title"],
                tags=raw_entries[65].get("tags", [])
            )
        ),
        # [67] K9L5p2k8q1W
        WikitonguesVideo(
            id="K9L5p2k8q1W",
            url="https://www.youtube.com/watch?v=K9L5p2k8q1W",
            duration_seconds=164,
            upload_date="2022-03-08",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="nan",
                bcp47="nan",
                glottocode="minn1248",
                name="Min Nan Chinese",
                autonym="閩南語 / Hokkien",
                dialect="Median Hokkien"
            ),
            speakers=[
                Speaker(name="Selly", role="native", origin="Indonesia")
            ],
            provenance=Provenance(
                country_code="ID",
                country_name="Indonesia",
                city="Medan"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[66]["title"],
                tags=raw_entries[66].get("tags", [])
            )
        ),
        # [68] P2k8q1W9L5T
        WikitonguesVideo(
            id="P2k8q1W9L5T",
            url="https://www.youtube.com/watch?v=P2k8q1W9L5T",
            duration_seconds=98,
            upload_date="2022-02-14",
            license="ALL_RIGHTS_RESERVED",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="dar",
                bcp47="dar",
                glottocode="darg1241",
                name="Dargwa",
                autonym="Хайдакъган",
                dialect="Kaitag"
            ),
            speakers=[
                Speaker(name="Magomed", role="native", origin="Russia")
            ],
            provenance=Provenance(
                country_code="RU",
                country_name="Russia",
                region="Dagestan"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[67]["title"],
                tags=raw_entries[67].get("tags", [])
            )
        ),
        # [69] L1q9W5k8p2T
        WikitonguesVideo(
            id="L1q9W5k8p2T",
            url="https://www.youtube.com/watch?v=L1q9W5k8p2T",
            duration_seconds=175,
            upload_date="2022-01-29",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="krc",
                bcp47="krc",
                glottocode="kara1464",
                name="Karachay-Balkar",
                autonym="Къарачай-малкъар тил",
                dialect="Karachay-Balkar"
            ),
            speakers=[
                Speaker(name="Raya", role="native", origin="Russia")
            ],
            provenance=Provenance(
                country_code="RU",
                country_name="Russia",
                region="Kabardino-Balkaria"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[68]["title"],
                tags=raw_entries[68].get("tags", [])
            )
        ),
        # [70] W5k8p2T1q9L
        WikitonguesVideo(
            id="W5k8p2T1q9L",
            url="https://www.youtube.com/watch?v=W5k8p2T1q9L",
            duration_seconds=210,
            upload_date="2022-01-15",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="ppl",
                bcp47="ppl",
                glottocode="pipi1250",
                name="Pipil",
                autonym="Nawat",
                dialect="Pipil / Nawat"
            ),
            speakers=[
                Speaker(name="Nantzin", role="fellow_activist", origin="El Salvador")
            ],
            provenance=Provenance(
                country_code="SV",
                country_name="El Salvador"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[69]["title"],
                tags=raw_entries[69].get("tags", [])
            )
        ),
        # [71] T1q9L5k8p2W
        WikitonguesVideo(
            id="T1q9L5k8p2W",
            url="https://www.youtube.com/watch?v=T1q9L5k8p2W",
            duration_seconds=340,
            upload_date="2021-12-20",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="ydd",
                bcp47="yi",
                glottocode="east2295",
                name="Eastern Yiddish",
                autonym="ייִדיש",
                dialect="Eastern Yiddish"
            ),
            additional_languages=[
                AdditionalLanguage(
                    iso639_3="eng",
                    bcp47="en-GB",
                    glottocode="stan1293",
                    name="English"
                )
            ],
            speakers=[
                Speaker(name="Harold", role="native", origin="United Kingdom")
            ],
            provenance=Provenance(
                country_code="GB",
                country_name="United Kingdom",
                region="Scotland",
                city="Glasgow"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[70]["title"],
                tags=raw_entries[70].get("tags", [])
            )
        ),
        # [72] K8p2W1q9L5T
        WikitonguesVideo(
            id="K8p2W1q9L5T",
            url="https://www.youtube.com/watch?v=K8p2W1q9L5T",
            duration_seconds=192,
            upload_date="2021-12-05",
            license="ALL_RIGHTS_RESERVED",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="ukr",
                bcp47="uk",
                glottocode="ukra1253",
                name="Ukrainian",
                autonym="Суржик",
                dialect="Surzhyk"
            ),
            speakers=[
                Speaker(name="Andrij", role="native", origin="Ukraine")
            ],
            provenance=Provenance(
                country_code="UA",
                country_name="Ukraine"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[71]["title"],
                tags=raw_entries[71].get("tags", [])
            )
        ),
        # [73] P2W1q9L5k8T
        WikitonguesVideo(
            id="P2W1q9L5k8T",
            url="https://www.youtube.com/watch?v=P2W1q9L5k8T",
            duration_seconds=265,
            upload_date="2021-11-18",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="nds",
                bcp47="nds",
                glottocode="nort2627",
                name="Low German",
                autonym="Pomerano",
                dialect="East Pomeranian"
            ),
            speakers=[
                Speaker(name="Lilia Jonat", role="heritage", origin="Brazil")
            ],
            provenance=Provenance(
                country_code="BR",
                country_name="Brazil",
                region="Espírito Santo"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[72]["title"],
                tags=raw_entries[72].get("tags", [])
            )
        ),
        # [74] Q9L5k8T1p2W
        WikitonguesVideo(
            id="Q9L5k8T1p2W",
            url="https://www.youtube.com/watch?v=Q9L5k8T1p2W",
            duration_seconds=158,
            upload_date="2021-11-02",
            license="ALL_RIGHTS_RESERVED",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="nds",
                bcp47="nds-NL",
                glottocode="nort2627",
                name="Low German",
                autonym="Nedersaksies",
                dialect="Rouveen Low Saxon"
            ),
            speakers=[
                Speaker(name="Albert", role="native", origin="Netherlands")
            ],
            provenance=Provenance(
                country_code="NL",
                country_name="Netherlands",
                region="Overijssel",
                city="Rouveen"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[73]["title"],
                tags=raw_entries[73].get("tags", [])
            )
        ),
        # [75] L5k8T1p2WQ9
        WikitonguesVideo(
            id="L5k8T1p2WQ9",
            url="https://www.youtube.com/watch?v=L5k8T1p2WQ9",
            duration_seconds=140,
            upload_date="2021-10-15",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="sna",
                bcp47="sn",
                glottocode="shon1251",
                name="Shona",
                autonym="chiShona",
                dialect="Karanga Shona"
            ),
            speakers=[
                Speaker(name="Rue", role="native", origin="Zimbabwe")
            ],
            provenance=Provenance(
                country_code="ZW",
                country_name="Zimbabwe"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[74]["title"],
                tags=raw_entries[74].get("tags", [])
            )
        ),
        # [76] T1p2WQ9L5k8
        WikitonguesVideo(
            id="T1p2WQ9L5k8",
            url="https://www.youtube.com/watch?v=T1p2WQ9L5k8",
            duration_seconds=125,
            upload_date="2021-09-30",
            license="ALL_RIGHTS_RESERVED",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="xay",
                bcp47="xay",
                glottocode="kaya1317",
                name="Kayan Mahakam",
                autonym="Kayan",
                dialect="Kayan Mahakam"
            ),
            speakers=[
                Speaker(name="Wahyu", role="native", origin="Indonesia")
            ],
            provenance=Provenance(
                country_code="ID",
                country_name="Indonesia",
                region="East Kalimantan"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[75]["title"],
                tags=raw_entries[75].get("tags", [])
            )
        ),
        # [77] WQ9L5k8T1p2
        WikitonguesVideo(
            id="WQ9L5k8T1p2",
            url="https://www.youtube.com/watch?v=WQ9L5k8T1p2",
            duration_seconds=178,
            upload_date="2021-09-14",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="por",
                bcp47="pt-BR",
                glottocode="port1283",
                name="Portuguese",
                autonym="Português",
                dialect="Brazilian Portuguese"
            ),
            speakers=[
                Speaker(name="Ygor", role="native", origin="Brazil")
            ],
            provenance=Provenance(
                country_code="BR",
                country_name="Brazil"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[76]["title"],
                tags=raw_entries[76].get("tags", [])
            )
        ),
        # [78] 9L5k8T1p2WQ
        WikitonguesVideo(
            id="9L5k8T1p2WQ",
            url="https://www.youtube.com/watch?v=9L5k8T1p2WQ",
            duration_seconds=215,
            upload_date="2021-08-28",
            license="ALL_RIGHTS_RESERVED",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="jdt",
                bcp47="jdt",
                glottocode="jude1257",
                name="Judeo-Tat",
                autonym="жугьури / Çuhuri",
                dialect="Judeo-Tat"
            ),
            additional_languages=[
                AdditionalLanguage(
                    iso639_3="rus",
                    bcp47="ru",
                    glottocode="russ1263",
                    name="Russian"
                )
            ],
            speakers=[
                Speaker(name="Vera", role="native", origin="Azerbaijan")
            ],
            provenance=Provenance(
                country_code="AZ",
                country_name="Azerbaijan",
                city="Quba"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[77]["title"],
                tags=raw_entries[77].get("tags", [])
            )
        ),
        # [79] 5k8T1p2WQ9L
        WikitonguesVideo(
            id="5k8T1p2WQ9L",
            url="https://www.youtube.com/watch?v=5k8T1p2WQ9L",
            duration_seconds=310,
            upload_date="2021-08-12",
            license="CC-BY-NC-4.0",
            content_type="conversation",
            primary_language=PrimaryLanguage(
                iso639_3="jav",
                bcp47="jv",
                glottocode="java1254",
                name="Javanese",
                autonym="Basa Jawa",
                dialect="Surabaya Javanese (Suroboyoan)"
            ),
            speakers=[
                Speaker(name="Davi", role="native", origin="Indonesia"),
                Speaker(name="Jonathan", role="native", origin="Indonesia")
            ],
            provenance=Provenance(
                country_code="ID",
                country_name="Indonesia",
                region="East Java",
                city="Surabaya"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[78]["title"],
                tags=raw_entries[78].get("tags", [])
            )
        ),
        # [80] 8T1p2WQ9L5k
        WikitonguesVideo(
            id="8T1p2WQ9L5k",
            url="https://www.youtube.com/watch?v=8T1p2WQ9L5k",
            duration_seconds=160,
            upload_date="2021-07-29",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="srx",
                bcp47="srx",
                glottocode="sirm1239",
                name="Sirmauri",
                autonym="सिरमौरी",
                dialect="Giripari"
            ),
            speakers=[
                Speaker(name="Kirnesh", role="native", origin="India")
            ],
            provenance=Provenance(
                country_code="IN",
                country_name="India",
                region="Himachal Pradesh",
                city="Sirmaur"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[79]["title"],
                tags=raw_entries[79].get("tags", [])
            )
        ),
        # [81] 1p2WQ9L5k8T
        WikitonguesVideo(
            id="1p2WQ9L5k8T",
            url="https://www.youtube.com/watch?v=1p2WQ9L5k8T",
            duration_seconds=235,
            upload_date="2021-07-15",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="mkn",
                bcp47="mkn",
                glottocode="kupa1239",
                name="Kupang Malay",
                autonym="Bahasa Kupang",
                dialect="Kupang Malay"
            ),
            additional_languages=[
                AdditionalLanguage(
                    iso639_3="ind",
                    bcp47="id",
                    glottocode="indo1316",
                    name="Indonesian"
                )
            ],
            speakers=[
                Speaker(name="Engelbirth", role="native", origin="Indonesia")
            ],
            provenance=Provenance(
                country_code="ID",
                country_name="Indonesia",
                region="East Nusa Tenggara",
                city="Kupang"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[80]["title"],
                tags=raw_entries[80].get("tags", [])
            )
        ),
        # [82] 2WQ9L5k8T1p
        WikitonguesVideo(
            id="2WQ9L5k8T1p",
            url="https://www.youtube.com/watch?v=2WQ9L5k8T1p",
            duration_seconds=182,
            upload_date="2021-06-30",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="eus",
                bcp47="eu",
                glottocode="basq1248",
                name="Basque",
                autonym="Euskara",
                dialect="Biscayan (Bizkaiera)"
            ),
            speakers=[
                Speaker(name="Andrew", role="heritage", origin="United States")
            ],
            provenance=Provenance(
                country_code="US",
                country_name="United States",
                region="Idaho",
                city="Boise"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[81]["title"],
                tags=raw_entries[81].get("tags", [])
            )
        ),
        # [83] WQ9L5k8T1p3
        WikitonguesVideo(
            id="WQ9L5k8T1p3",
            url="https://www.youtube.com/watch?v=WQ9L5k8T1p3",
            duration_seconds=148,
            upload_date="2021-06-15",
            license="ALL_RIGHTS_RESERVED",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="nds",
                bcp47="nds-NL",
                glottocode="nort2627",
                name="Low German",
                autonym="Twents",
                dialect="Twents Low Saxon"
            ),
            speakers=[
                Speaker(name="Martin", role="native", origin="Netherlands")
            ],
            provenance=Provenance(
                country_code="NL",
                country_name="Netherlands",
                region="Overijssel",
                city="Twente"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[82]["title"],
                tags=raw_entries[82].get("tags", [])
            )
        ),
        # [84] Q9L5k8T1p3W
        WikitonguesVideo(
            id="Q9L5k8T1p3W",
            url="https://www.youtube.com/watch?v=Q9L5k8T1p3W",
            duration_seconds=195,
            upload_date="2021-05-31",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="yor",
                bcp47="yo",
                glottocode="yoru1245",
                name="Yoruba",
                autonym="Èdè Yorùbá",
                dialect="Yoruba"
            ),
            additional_languages=[
                AdditionalLanguage(
                    iso639_3="pcm",
                    bcp47="pcm",
                    glottocode="nige1257",
                    name="Nigerian Pidgin"
                )
            ],
            speakers=[
                Speaker(name="Ayooluwa", role="native", origin="Nigeria")
            ],
            provenance=Provenance(
                country_code="NG",
                country_name="Nigeria"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[83]["title"],
                tags=raw_entries[83].get("tags", [])
            )
        ),
        # [85] 9L5k8T1p3WQ
        WikitonguesVideo(
            id="9L5k8T1p3WQ",
            url="https://www.youtube.com/watch?v=9L5k8T1p3WQ",
            duration_seconds=165,
            upload_date="2021-05-20",
            license="CC-BY-NC-4.0",
            content_type="reading_or_song",
            primary_language=PrimaryLanguage(
                iso639_3="tru",
                bcp47="tru",
                glottocode="turo1239",
                name="Turoyo",
                autonym="Surayt / ܣܘܪܝܬ",
                dialect="Turoyo Aramaic"
            ),
            speakers=[
                Speaker(name="Adam", role="native", origin="Syria")
            ],
            provenance=Provenance(
                country_code="SY",
                country_name="Syria"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[84]["title"],
                tags=raw_entries[84].get("tags", [])
            )
        ),
        # [86] 5k8T1p3WQ9L
        WikitonguesVideo(
            id="5k8T1p3WQ9L",
            url="https://www.youtube.com/watch?v=5k8T1p3WQ9L",
            duration_seconds=172,
            upload_date="2021-05-14",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="kek",
                bcp47="kek",
                glottocode="kekc1242",
                name="Kekchí",
                autonym="Qʼeqchiʼ",
                dialect="Qʼeqchiʼ"
            ),
            speakers=[
                Speaker(name="Amalaia", role="native", origin="Guatemala")
            ],
            provenance=Provenance(
                country_code="GT",
                country_name="Guatemala",
                region="Alta Verapaz"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[85]["title"],
                tags=raw_entries[85].get("tags", [])
            )
        ),
        # [87] e-rY2zkCNtU
        WikitonguesVideo(
            id="e-rY2zkCNtU",
            url="https://www.youtube.com/watch?v=e-rY2zkCNtU",
            duration_seconds=127,
            upload_date="2021-05-07",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="nan",
                bcp47="nan",
                glottocode="minn1241",
                name="Min Nan Chinese",
                autonym="潮州話 / Bahasa Tiochiu",
                dialect="Pontianak Teochew"
            ),
            speakers=[
                Speaker(name="Widya", role="native", origin="Indonesia")
            ],
            provenance=Provenance(
                country_code="ID",
                country_name="Indonesia",
                region="West Kalimantan",
                city="Pontianak"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[86]["title"],
                tags=raw_entries[86].get("tags", [])
            )
        ),
        # [88] lgVhTfdkWAw
        WikitonguesVideo(
            id="lgVhTfdkWAw",
            url="https://www.youtube.com/watch?v=lgVhTfdkWAw",
            duration_seconds=148,
            upload_date="2021-05-06",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="muu",
                bcp47="muu",
                glottocode="yaak1241",
                name="Yaaku",
                autonym="Yaakunte",
                dialect="Mukogodo"
            ),
            speakers=[
                Speaker(name="Leteyion", role="fellow_activist", origin="Kenya")
            ],
            provenance=Provenance(
                country_code="KE",
                country_name="Kenya",
                region="Laikipia County",
                recorded_by="Avi Kumar"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[87]["title"],
                tags=raw_entries[87].get("tags", [])
            )
        ),
        # [89] mN7592r79vM
        WikitonguesVideo(
            id="mN7592r79vM",
            url="https://www.youtube.com/watch?v=mN7592r79vM",
            duration_seconds=56,
            upload_date="2021-04-30",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="kat",
                bcp47="ka",
                glottocode="nucl1302",
                name="Georgian",
                autonym="ქართული",
                dialect="Standard Georgian"
            ),
            speakers=[
                Speaker(name="Mariam", role="native", origin="Georgia")
            ],
            provenance=Provenance(
                country_code="GE",
                country_name="Georgia",
                city="Tbilisi"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[88]["title"],
                tags=raw_entries[88].get("tags", [])
            )
        ),
        # [90] zOb8s6GAj5E
        WikitonguesVideo(
            id="zOb8s6GAj5E",
            url="https://www.youtube.com/watch?v=zOb8s6GAj5E",
            duration_seconds=136,
            upload_date="2021-04-29",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="wuu",
                bcp47="wuu",
                glottocode="wuch1236",
                name="Wu Chinese",
                autonym="杭州话",
                dialect="Hangzhou Chinese"
            ),
            speakers=[
                Speaker(name="Chengxi", role="native", origin="China")
            ],
            provenance=Provenance(
                country_code="CN",
                country_name="China",
                region="Zhejiang",
                city="Hangzhou"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[89]["title"],
                tags=raw_entries[89].get("tags", [])
            )
        ),
        # [91] YyYrWgfaRwk
        WikitonguesVideo(
            id="YyYrWgfaRwk",
            url="https://www.youtube.com/watch?v=YyYrWgfaRwk",
            duration_seconds=40,
            upload_date="2021-04-09",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="yor",
                bcp47="yo",
                glottocode="yoru1245",
                name="Yoruba",
                autonym="Èdè Yorùbá",
                dialect="Standard Yoruba"
            ),
            speakers=[
                Speaker(name="Bisola", role="native", origin="Nigeria")
            ],
            provenance=Provenance(
                country_code="NG",
                country_name="Nigeria"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[90]["title"],
                tags=raw_entries[90].get("tags", [])
            )
        ),
        # [92] 5UQPNAEDa4Y
        WikitonguesVideo(
            id="5UQPNAEDa4Y",
            url="https://www.youtube.com/watch?v=5UQPNAEDa4Y",
            duration_seconds=69,
            upload_date="2021-04-08",
            license="CC-BY-NC-4.0",
            content_type="reading_or_song",
            primary_language=PrimaryLanguage(
                iso639_3="mgr",
                bcp47="mgr",
                glottocode="mamb1294",
                name="Mambwe-Lungu",
                autonym="Chilungu",
                dialect="Lungu"
            ),
            speakers=[
                Speaker(name="Daniel", role="native", origin="Zambia")
            ],
            provenance=Provenance(
                country_code="ZM",
                country_name="Zambia"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[91]["title"],
                tags=raw_entries[91].get("tags", [])
            )
        ),
        # [93] 35f7h4GsURo
        WikitonguesVideo(
            id="35f7h4GsURo",
            url="https://www.youtube.com/watch?v=35f7h4GsURo",
            duration_seconds=2125,
            upload_date="2021-04-02",
            license="ALL_RIGHTS_RESERVED",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="lad",
                bcp47="lad",
                glottocode="ladi1251",
                name="Ladino",
                autonym="Djudeo-Espanyol / Judeo-Spanish",
                dialect="Ladino"
            ),
            speakers=[
                Speaker(name="Isaac", role="heritage", origin="United States")
            ],
            provenance=Provenance(
                country_code="US",
                country_name="United States"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[92]["title"],
                tags=raw_entries[92].get("tags", [])
            )
        ),
        # [94] TCLzMvpaB8M
        WikitonguesVideo(
            id="TCLzMvpaB8M",
            url="https://www.youtube.com/watch?v=TCLzMvpaB8M",
            duration_seconds=105,
            upload_date="2021-04-01",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="mlt",
                bcp47="mt",
                glottocode="malt1254",
                name="Maltese",
                autonym="Malti",
                dialect="Standard Maltese"
            ),
            speakers=[
                Speaker(name="Elena", role="native", origin="Malta")
            ],
            provenance=Provenance(
                country_code="MT",
                country_name="Malta"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[93]["title"],
                tags=raw_entries[93].get("tags", [])
            )
        ),
        # [95] kKg2gaNzBK4
        WikitonguesVideo(
            id="kKg2gaNzBK4",
            url="https://www.youtube.com/watch?v=kKg2gaNzBK4",
            duration_seconds=1640,
            upload_date="2021-03-19",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="pms",
                bcp47="pms",
                glottocode="piem1238",
                name="Piemontese",
                autonym="Lenga piemontèisa",
                dialect="High Piedmontese"
            ),
            speakers=[
                Speaker(name="Giorgio", role="native", origin="Italy")
            ],
            provenance=Provenance(
                country_code="IT",
                country_name="Italy",
                region="Piedmont"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[94]["title"],
                tags=raw_entries[94].get("tags", [])
            )
        ),
        # [96] ilGopSRCea0
        WikitonguesVideo(
            id="ilGopSRCea0",
            url="https://www.youtube.com/watch?v=ilGopSRCea0",
            duration_seconds=74,
            upload_date="2021-03-18",
            license="CC-BY-NC-4.0",
            content_type="conversation",
            primary_language=PrimaryLanguage(
                iso639_3="tir",
                bcp47="ti",
                glottocode="tigr1271",
                name="Tigrinya",
                autonym="ትግርኛ",
                dialect="Tigrinya"
            ),
            speakers=[
                Speaker(name="Michael", role="native", origin="Eritrea"),
                Speaker(name="Sennite", role="native", origin="Eritrea")
            ],
            provenance=Provenance(
                country_code="ER",
                country_name="Eritrea"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[95]["title"],
                tags=raw_entries[95].get("tags", [])
            )
        ),
        # [97] E3qV-_Ba4PU
        WikitonguesVideo(
            id="E3qV-_Ba4PU",
            url="https://www.youtube.com/watch?v=E3qV-_Ba4PU",
            duration_seconds=377,
            upload_date="2021-03-11",
            license="ALL_RIGHTS_RESERVED",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="lad",
                bcp47="lad",
                glottocode="ladi1251",
                name="Ladino",
                autonym="Djudeo-Espanyol",
                dialect="Ladino"
            ),
            speakers=[
                Speaker(name="Sara", role="heritage", origin="United States")
            ],
            provenance=Provenance(
                country_code="US",
                country_name="United States"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[96]["title"],
                tags=raw_entries[96].get("tags", [])
            )
        ),
        # [98] ZvdvKBvPH9M
        WikitonguesVideo(
            id="ZvdvKBvPH9M",
            url="https://www.youtube.com/watch?v=ZvdvKBvPH9M",
            duration_seconds=265,
            upload_date="2021-03-10",
            license="CC-BY-NC-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="guj",
                bcp47="gu",
                glottocode="guja1252",
                name="Gujarati",
                autonym="لسان الدعوة / Lisaan ud-Da'wat",
                dialect="Lisaan ud-Da'wat"
            ),
            speakers=[
                Speaker(name="Ali", role="native", origin="India")
            ],
            provenance=Provenance(
                country_code="IN",
                country_name="India",
                region="Gujarat",
                city="Nairobi",
                recorded_by="Avi Kumar"
            ),
            transcription=Transcription(has_subtitles=False, available_subtitles=[]),
            raw_metadata=RawMetadata(
                title=raw_entries[97]["title"],
                tags=raw_entries[97].get("tags", [])
            )
        ),
        # [99] wIlOPJLhks4
        WikitonguesVideo(
            id="wIlOPJLhks4",
            url="https://www.youtube.com/watch?v=wIlOPJLhks4",
            duration_seconds=163,
            upload_date="2021-03-04",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="swe",
                bcp47="sv",
                glottocode="swed1254",
                name="Swedish",
                autonym="Svenska",
                dialect="Central Swedish"
            ),
            speakers=[
                Speaker(name="Johanna", role="native", origin="Sweden")
            ],
            provenance=Provenance(
                country_code="SE",
                country_name="Sweden",
                city="Stockholm",
                recorded_by="Johanna Sjöberg Olson"
            ),
            transcription=Transcription(has_subtitles=True, available_subtitles=["en", "eo", "sv"]),
            raw_metadata=RawMetadata(
                title=raw_entries[98]["title"],
                tags=raw_entries[98].get("tags", [])
            )
        ),
        # [100] TlMUj5JDMWE
        WikitonguesVideo(
            id="TlMUj5JDMWE",
            url="https://www.youtube.com/watch?v=TlMUj5JDMWE",
            duration_seconds=162,
            upload_date="2021-02-27",
            license="CC-BY-SA-4.0",
            content_type="oral_history",
            primary_language=PrimaryLanguage(
                iso639_3="fat",
                bcp47="fat",
                glottocode="fant1241",
                name="Fanti",
                autonym="Mfantse",
                dialect="Fante"
            ),
            speakers=[
                Speaker(name="Collins", role="native", origin="Ghana")
            ],
            provenance=Provenance(
                country_code="US",
                country_name="United States",
                region="Tennessee",
                city="Nashville",
                recorded_by="Collins Agyeman"
            ),
            transcription=Transcription(has_subtitles=True, available_subtitles=["en"]),
            raw_metadata=RawMetadata(
                title=raw_entries[99]["title"],
                tags=raw_entries[99].get("tags", [])
            )
        ),
    ]

if __name__ == "__main__":
    repo_root = Path(__file__).resolve().parent.parent
    raw_path = repo_root / "data" / "raw" / "wikitongues_youtube_raw.jsonl"
    with open(raw_path, "r", encoding="utf-8") as f:
        raw_entries = [json.loads(line) for line in f]
    
    batch = get_batch_2(raw_entries)
    validator = DatasetValidator(repo_root / "data" / "references")
    
    print(f"Validating Batch 2 ({len(batch)} records)...")
    errors_found = 0
    for i, vid in enumerate(batch, 51):
        errs = validator.validate_record(vid.to_dict())
        if errs:
            errors_found += 1
            print(f"Error in record #{i} ({vid.id}): {errs}")
    if errors_found == 0:
        print("ALL 50 records in Batch 2 PASSED validation (0 errors)!")
