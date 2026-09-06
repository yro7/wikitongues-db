# -*- coding: utf-8 -*-
"""
Full normalization script for Wikitongues dataset (Batches 2 to 18, records 51 to 863).
Normalizes each batch of 50 videos, validates against SIL ISO 639-3 and Glottolog tables,
and generates the complete final report.
"""

import csv
import json
import re
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
from src.normalizer.reporter import NormalizationReporter


# Country name to ISO 3166-1 alpha-2 code mapping
COUNTRY_MAP = {
    "united states": "US", "usa": "US", "us": "US", "america": "US",
    "united kingdom": "GB", "uk": "GB", "great britain": "GB", "england": "GB", "scotland": "GB", "wales": "GB", "northern ireland": "GB",
    "canada": "CA", "mexico": "MX", "guatemala": "GT", "el salvador": "SV", "honduras": "HN",
    "nicaragua": "NI", "costa rica": "CR", "panama": "PA", "colombia": "CO", "venezuela": "VE",
    "guyana": "GY", "suriname": "SR", "ecuador": "EC", "peru": "PE", "brazil": "BR", "bolivia": "BO",
    "paraguay": "PY", "chile": "CL", "argentina": "AR", "uruguay": "UY",
    "france": "FR", "spain": "ES", "portugal": "PT", "italy": "IT", "germany": "DE", "netherlands": "NL",
    "belgium": "BE", "switzerland": "CH", "austria": "AT", "ireland": "IE", "denmark": "DK", "sweden": "SE",
    "norway": "NO", "finland": "FI", "iceland": "IS", "poland": "PL", "czech republic": "CZ", "slovakia": "SK",
    "hungary": "HU", "romania": "RO", "bulgaria": "BG", "greece": "GR", "albania": "AL", "serbia": "RS",
    "croatia": "HR", "bosnia and herzegovina": "BA", "bosnia": "BA", "montenegro": "ME", "north macedonia": "MK",
    "slovenia": "SI", "russia": "RU", "russian federation": "RU", "ukraine": "UA", "belarus": "BY",
    "estonia": "EE", "latvia": "LV", "lithuania": "LT", "moldova": "MD", "turkey": "TR", "georgia": "GE",
    "armenia": "AM", "azerbaijan": "AZ", "kazakhstan": "KZ", "uzbekistan": "UZ", "turkmenistan": "TM",
    "kyrgyzstan": "KG", "tajikistan": "TJ", "afghanistan": "AF", "pakistan": "PK", "india": "IN",
    "bangladesh": "BD", "nepal": "NP", "bhutan": "BT", "sri lanka": "LK", "china": "CN", "mongolia": "MN",
    "taiwan": "TW", "japan": "JP", "south korea": "KR", "north korea": "KP", "korea": "KR",
    "vietnam": "VN", "laos": "LA", "cambodia": "KH", "thailand": "TH", "myanmar": "MM", "burma": "MM",
    "malaysia": "MY", "singapore": "SG", "indonesia": "ID", "philippines": "PH", "brunei": "BN", "timor-leste": "TL",
    "australia": "AU", "new zealand": "NZ", "papua new guinea": "PG", "fiji": "FJ", "samoa": "WS", "tonga": "TO",
    "vanuatu": "VU", "solomon islands": "SB", "micronesia": "FM", "palau": "PW", "marshall islands": "MH",
    "kiribati": "KI", "tuvalu": "TV", "nauru": "NR",
    "egypt": "EG", "morocco": "MA", "algeria": "DZ", "tunisia": "TN", "libya": "LY", "sudan": "SD", "south sudan": "SS",
    "ethiopia": "ET", "eritrea": "ER", "djibouti": "DJ", "somalia": "SO", "kenya": "KE", "tanzania": "TZ",
    "uganda": "UG", "rwanda": "RW", "burundi": "BI", "drc": "CD", "congo": "CG", "democratic republic of the congo": "CD",
    "republic of the congo": "CG", "gabon": "GA", "cameroon": "CM", "central african republic": "CF", "chad": "TD",
    "nigeria": "NG", "niger": "NE", "benin": "BJ", "togo": "TG", "ghana": "GH", "cote d'ivoire": "CI", "ivory coast": "CI",
    "liberia": "LR", "sierra leone": "SL", "guinea": "GN", "guinea-bissau": "GW", "senegal": "SN", "gambia": "GM",
    "mali": "ML", "mauritania": "MR", "burkina faso": "BF", "angola": "AO", "zambia": "ZM", "zimbabwe": "ZW",
    "malawi": "MW", "mozambique": "MZ", "botswana": "BW", "namibia": "NA", "south africa": "ZA", "lesotho": "LS",
    "eswatini": "SZ", "swaziland": "SZ", "madagascar": "MG", "mauritius": "MU", "seychelles": "SC", "comoros": "KM",
    "israel": "IL", "palestine": "PS", "jordan": "JO", "lebanon": "LB", "syria": "SY", "iraq": "IQ", "iran": "IR",
    "saudi arabia": "SA", "yemen": "YE", "oman": "OM", "uae": "AE", "united arab emirates": "AE", "qatar": "QA",
    "bahrain": "BH", "kuwait": "KW", "cyprus": "CY", "malta": "MT", "isle of man": "IM", "jersey": "JE", "guernsey": "GG"
}

# Special language code aliases & mappings
LANGUAGE_ALIASES = {
    "wjsh": ("jpr", "Judeo-Persian", "jude1254", "jpr"),
    "wjri": ("nrf", "Jèrriais", "jeru1240", "nrf-JE"),
    "kouri-vini": ("lou", "Louisiana Creole", "loui1240", "lou"),
    "louisiana creole": ("lou", "Louisiana Creole", "loui1240", "lou"),
    "arbëresh": ("aae", "Arbëreshë Albanian", "arbe1236", "sq-IT"),
    "arbëreshë": ("aae", "Arbëreshë Albanian", "arbe1236", "sq-IT"),
    "arberesh": ("aae", "Arbëreshë Albanian", "arbe1236", "sq-IT"),
    "gascon": ("oci", "Occitan", "occi1239", "oc-gascon"),
    "kildin sami": ("sjd", "Kildin Sami", "kild1236", "sjd"),
    "kildin sámi": ("sjd", "Kildin Sami", "kild1236", "sjd"),
    "purgi": ("prx", "Purik", "puri1258", "prx"),
    "purik": ("prx", "Purik", "puri1258", "prx"),
    "wenglingnese": ("wuu", "Wu Chinese", "wuch1236", "wuu-CN"),
    "wenling": ("wuu", "Wu Chinese", "wuch1236", "wuu-CN"),
    "taizhou wu": ("wuu", "Wu Chinese", "wuch1236", "wuu-CN"),
    "okinawan": ("ryu", "Central Okinawan", "cent2126", "ryu"),
    "uchinaaguchi": ("ryu", "Central Okinawan", "cent2126", "ryu"),
    "mugat": ("tgk", "Tajik", "taji1245", "tg"),
    "lyuli": ("tgk", "Tajik", "taji1245", "tg"),
    "baghdadi judeo-arabic": ("yhd", "Judeo-Iraqi Arabic", "jude1256", "yhd"),
    "judeo-arabic": ("yhd", "Judeo-Iraqi Arabic", "jude1256", "yhd"),
    "manchu": ("mnc", "Manchu", "manc1252", "mnc"),
    "koryo-mar": ("kor", "Korean", "kore1280", "ko"),
    "yiddish": ("ydd", "Eastern Yiddish", "east2295", "yi"),
    "eastern yiddish": ("ydd", "Eastern Yiddish", "east2295", "yi"),
    "manx": ("glv", "Manx", "manx1243", "gv"),
    "mazanderani": ("mzn", "Mazanderani", "maza1291", "mzn"),
    "hakka": ("hak", "Hakka Chinese", "hakk1236", "hak"),
    "mahasuvi": ("bfz", "Mahasu Pahari", "maha1287", "bfz"),
    "rohruri": ("bfz", "Mahasu Pahari", "maha1287", "bfz"),
    "hokkien": ("nan", "Min Nan Chinese", "minn1241", "nan"),
    "min nan": ("nan", "Min Nan Chinese", "minn1241", "nan"),
    "kaitag": ("dar", "Dargwa", "darg1241", "dar"),
    "karachay-balkar": ("krc", "Karachay-Balkar", "kara1464", "krc"),
    "nahuat": ("ppl", "Pipil", "pipi1250", "ppl"),
    "nawat": ("ppl", "Pipil", "pipi1250", "ppl"),
    "pipil": ("ppl", "Pipil", "pipi1250", "ppl"),
    "surzhyk": ("ukr", "Ukrainian", "ukra1253", "uk"),
    "east pomeranian": ("nds", "Low German", "nort2627", "nds"),
    "pomeranian": ("nds", "Low German", "nort2627", "nds"),
    "pomerano": ("nds", "Low German", "nort2627", "nds"),
    "low saxon": ("nds", "Low German", "nort2627", "nds"),
    "rouveen low saxon": ("nds", "Low German", "nort2627", "nds-NL"),
    "shona": ("sna", "Shona", "shon1251", "sn"),
    "kayan mahakam": ("xay", "Kayan Mahakam", "kaya1317", "xay"),
    "brazilian portuguese": ("por", "Portuguese", "port1283", "pt-BR"),
    "juhuri": ("jdt", "Judeo-Tat", "jude1257", "jdt"),
    "judeo-tat": ("jdt", "Judeo-Tat", "jude1257", "jdt"),
    "javanese": ("jav", "Javanese", "java1254", "jv"),
    "sirmauri": ("srx", "Sirmauri", "sirm1239", "srx"),
    "kupang malay": ("mkn", "Kupang Malay", "kupa1239", "mkn"),
    "basque": ("eus", "Basque", "basq1248", "eu"),
    "biscayan": ("eus", "Basque", "basq1248", "eu"),
    "twents": ("nds", "Low German", "nort2627", "nds-NL"),
    "turoyo": ("tru", "Turoyo", "turo1239", "tru"),
    "q'eqchi'": ("kek", "Kekchí", "kekc1242", "kek"),
    "qʼeqchiʼ": ("kek", "Kekchí", "kekc1242", "kek"),
    "kekchi": ("kek", "Kekchí", "kekc1242", "kek"),
    "teochew": ("nan", "Min Nan Chinese", "minn1241", "nan"),
    "yaaku": ("muu", "Yaaku", "yaak1241", "muu"),
    "georgian": ("kat", "Georgian", "nucl1302", "ka"),
    "hangzhou": ("wuu", "Wu Chinese", "wuch1236", "wuu"),
    "mambwe-lungu": ("mgr", "Mambwe-Lungu", "mamb1294", "mgr"),
    "lungu": ("mgr", "Mambwe-Lungu", "mamb1294", "mgr"),
    "ladino": ("lad", "Ladino", "ladi1251", "lad"),
    "maltese": ("mlt", "Maltese", "malt1254", "mt"),
    "piedmontese": ("pms", "Piemontese", "piem1238", "pms"),
    "tigrinya": ("tir", "Tigrinya", "tigr1271", "ti"),
    "lisaan ud da'wat": ("guj", "Gujarati", "guja1252", "gu"),
    "swedish": ("swe", "Swedish", "swed1254", "sv"),
    "fante": ("fat", "Fanti", "fant1241", "fat"),
    "fanti": ("fat", "Fanti", "fant1241", "fat"),
    "bangla": ("ben", "Bengali", "beng1280", "bn"),
    "bengali": ("ben", "Bengali", "beng1280", "bn"),
    "khmer": ("khm", "Khmer", "cent1989", "km"),
    "materano": ("ita", "Italian", "ital1282", "it"),
    "sanhaja de srair": ("sjs", "Sanhaja of Srair", "sanh1239", "sjs"),
    "veps": ("vep", "Veps", "veps1250", "vep"),
    "vepsian": ("vep", "Veps", "veps1250", "vep"),
    "quechua": ("que", "Quechua", "quec1387", "qu"),
    "aymara": ("aym", "Aymara", "ayma1253", "ay"),
    "guarani": ("grn", "Guarani", "para1311", "gn"),
    "kurux": ("kru", "Kurux", "kuru1300", "kru"),
    "liberian english": ("lir", "Liberian English", "libe1248", "lir"),
    "latvian sign language": ("lsl", "Latvian Sign Language", "latv1245", "lsl"),
    "torwali": ("trw", "Torwali", "torw1241", "trw"),
    "krio": ("kri", "Krio", "krio1253", "kri"),
    "pular": ("fuf", "Pular", "pula1262", "fuf"),
    "indian sign language": ("ins", "Indian Sign Language", "indi1237", "ins"),
    "jejueo": ("jje", "Jejueo", "jeju1234", "jje"),
    "jeju": ("jje", "Jejueo", "jeju1234", "jje"),
    "marwari": ("mwr", "Marwari", "marw1259", "mwr"),
    "ilocano": ("ilo", "Iloko", "ilok1237", "ilo"),
    "tunisian arabic": ("aeb", "Tunisian Arabic", "tuni1252", "aeb"),
    "sindhi": ("snd", "Sindhi", "sind1272", "sd"),
    "bemba": ("bem", "Bemba (Zambia)", "bemb1257", "bem"),
    "malagasy": ("mlg", "Malagasy", "mala1537", "mg"),
    "azeri": ("aze", "Azerbaijani", "nort2697", "az"),
    "azerbaijani": ("aze", "Azerbaijani", "nort2697", "az"),
    "silesian": ("szl", "Silesian", "sile1254", "szl"),
    "gwich'in": ("gwi", "Gwich'in", "gwic1235", "gwi"),
    "bildts": ("nds", "Low German", "nort2627", "nds-NL"),
    "kpelle": ("xpe", "Liberia Kpelle", "libe1247", "xpe"),
    "bantenese": ("sun", "Sundanese", "sund1252", "su"),
    "mooré": ("mos", "Mossi", "moss1236", "mos"),
    "dioula": ("dyu", "Dyula", "dyul1238", "dyu"),
    "henan chinese": ("cmn", "Mandarin Chinese", "mand1415", "cmn"),
    "sorani kurdish": ("ckb", "Central Kurdish", "cent1972", "ckb"),
    "breton": ("bre", "Breton", "bret1244", "br"),
    "trentino": ("ita", "Italian", "ital1282", "it"),
    "samoan": ("smo", "Samoan", "samo1305", "sm"),
    "neapolitan": ("nap", "Neapolitan", "neap1235", "nap"),
    "french": ("fra", "French", "stan1290", "fr"),
    "transylvanian saxon": ("sxu", "Upper Saxon", "uppe1400", "sxu"),
    "miyako": ("mvi", "Miyako", "miya1259", "mvi"),
    "swiss german": ("gsw", "Swiss German", "swis1247", "gsw"),
    "yucatecan": ("yua", "Yucatec Maya", "yuca1252", "yua"),
    "yucatec maya": ("yua", "Yucatec Maya", "yuca1252", "yua"),
    "jamaican patois": ("jam", "Jamaican Creole English", "jama1262", "jam"),
    "bazigar": ("bfr", "Bazigar", "bazi1237", "bfr"),
    "portuguese": ("por", "Portuguese", "port1283", "pt"),
    "northern sami": ("sme", "Northern Sami", "nort2671", "se"),
    "bosnian": ("bos", "Bosnian", "bosn1245", "bs"),
    "batak toba": ("bbc", "Batak Toba", "bata1299", "bbc"),
    "upper sorbian": ("hsb", "Upper Sorbian", "uppe1398", "hsb"),
    "belarusian": ("bel", "Belarusian", "bela1254", "be"),
    "romansh": ("roh", "Romansh", "roma1326", "rm"),
    "tosk albanian": ("als", "Tosk Albanian", "tosk1239", "als"),
    "latin": ("lat", "Latin", "lati1261", "la"),
    "catalan": ("cat", "Catalan", "stan1288", "ca"),
    "indonesian": ("ind", "Indonesian", "indo1316", "id"),
    "gheg albanian": ("aln", "Gheg Albanian", "gheg1238", "aln"),
    "dholuo": ("luo", "Luo (Kenya and Tanzania)", "luok1236", "luo"),
    "swahili": ("swh", "Swahili (macrolanguage)", "swah1253", "sw"),
    "danish": ("dan", "Danish", "dani1285", "da"),
    "scottish gaelic": ("gla", "Scottish Gaelic", "scot1245", "gd"),
    "bulgarian": ("bul", "Bulgarian", "bulg1262", "bg"),
    "irish": ("gle", "Irish", "iris1253", "ga"),
    "shangaan": ("tso", "Tsonga", "tson1249", "ts"),
    "tsonga": ("tso", "Tsonga", "tson1249", "ts"),
    "spanish": ("spa", "Spanish", "stan1288", "es"),
    "mandarin": ("cmn", "Mandarin Chinese", "mand1415", "zh"),
    "urdu": ("urd", "Urdu", "urdu1245", "ur"),
    "cherokee": ("chr", "Cherokee", "cher1273", "chr"),
    "aranese occitan": ("oci", "Occitan", "occi1239", "oc-aran"),
    "farsi": ("pes", "Iranian Persian", "iran1263", "fa"),
    "persian": ("pes", "Iranian Persian", "iran1263", "fa"),
    "english": ("eng", "English", "stan1293", "en"),
}


def load_references(ref_dir: Path):
    sil_codes = {}
    sil_part1 = {}
    with open(ref_dir / "iso-639-3.tab", "r", encoding="utf-8") as f:
        for row in csv.DictReader(f, delimiter="\t"):
            sil_codes[row["Id"]] = row["Ref_Name"]
            if row["Part1"]:
                sil_part1[row["Id"]] = row["Part1"]

    name_to_iso = {}
    with open(ref_dir / "iso-639-3_Name_Index.tab", "r", encoding="utf-8") as f:
        for row in csv.DictReader(f, delimiter="\t"):
            iso = row["Id"]
            pname = row["Print_Name"].lower().strip()
            iname = row["Inverted_Name"].lower().strip()
            name_to_iso[pname] = iso
            name_to_iso[iname] = iso

    for iso, name in sil_codes.items():
        name_to_iso[name.lower().strip()] = iso

    iso_to_glotto = {}
    name_to_glotto = {}
    glotto_codes = set()
    with open(ref_dir / "glottolog_languages.csv", "r", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            gc = row.get("Glottocode")
            iso = row.get("ISO639P3code")
            name = row.get("Name", "").lower().strip()
            if gc:
                glotto_codes.add(gc)
            if iso and gc and iso not in iso_to_glotto:
                iso_to_glotto[iso] = gc
            if name and gc and name not in name_to_glotto:
                name_to_glotto[name] = gc

    return sil_codes, sil_part1, name_to_iso, iso_to_glotto, name_to_glotto, glotto_codes


def parse_provenance(raw: dict) -> Provenance:
    desc = raw.get("description", "")
    title = raw.get("title", "")
    
    country_code = None
    country_name = None
    region = None
    city = None
    recorded_by = None
    recording_date = None

    # Date pattern: recorded on DD/MM/YYYY or YYYY-MM-DD or Month DD, YYYY
    date_match = re.search(r'recorded (?:on|in)?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{4})', desc, re.IGNORECASE)
    if date_match:
        d_str = date_match.group(1).replace('/', '-')
        parts = d_str.split('-')
        if len(parts) == 3:
            if len(parts[2]) == 4: # DD-MM-YYYY
                recording_date = f"{parts[2]}-{int(parts[1]):02d}-{int(parts[0]):02d}"

    # Recorder pattern
    rec_match = re.search(r'recorded by\s+([^,\n\.]+?)(?:\s+in|\s+at|\s+and|\s+on|\.|\n)', desc, re.IGNORECASE)
    if rec_match:
        recorded_by = rec_match.group(1).strip()
        if len(recorded_by) > 60 or "wikitongues" in recorded_by.lower() and len(recorded_by) > 30:
            recorded_by = "Wikitongues contributor"

    # Location pattern: "in [City], [Region], [Country]" or "in [City], [Country]"
    loc_match = re.search(r'recorded (?:by [^,\n]+? )?in\s+([^,\n\.]+?)(?:,\s*([^,\n\.]+?))?(?:,\s*([^,\n\.]+?))?(?:\s+and|\s+on|\.|\n)', desc, re.IGNORECASE)
    if loc_match:
        p1, p2, p3 = loc_match.group(1), loc_match.group(2), loc_match.group(3)
        tokens = [p.strip() for p in [p1, p2, p3] if p and p.strip()]
        for t in reversed(tokens):
            t_low = t.lower()
            if t_low in COUNTRY_MAP:
                country_code = COUNTRY_MAP[t_low]
                country_name = t.capitalize()
                break

    # Fallback to search all country names in description/title
    if not country_code:
        full_text = f"{title} {desc}".lower()
        for cname, code in COUNTRY_MAP.items():
            if re.search(r'\b' + re.escape(cname) + r'\b', full_text):
                country_code = code
                country_name = cname.title()
                break

    return Provenance(
        country_code=country_code,
        country_name=country_name,
        region=region,
        city=city,
        recorded_by=recorded_by,
        recording_date=recording_date
    )


def parse_license(raw: dict) -> str:
    desc = raw.get("description", "")
    if "Creative Commons Attribution-ShareAlike 4.0" in desc or "CC-BY-SA" in desc or "CC BY-SA" in desc:
        return "CC-BY-SA-4.0"
    if "Creative Commons Attribution-NonCommercial 4.0" in desc or "CC-BY-NC" in desc or "CC BY-NC" in desc:
        return "CC-BY-NC-4.0"
    if "Creative Commons Attribution 4.0" in desc or "CC-BY" in desc or "CC BY" in desc:
        return "CC-BY-4.0"
    if "public domain" in desc.lower():
        return "PUBLIC_DOMAIN"
    return "ALL_RIGHTS_RESERVED"


def parse_content_type(raw: dict) -> str:
    title = raw.get("title", "")
    desc = raw.get("description", "")
    full = f"{title} {desc}".lower()

    if "fellows #" in title.lower() or "wikitongues fellows" in full or "fellowship" in full:
        return "fellowship_doc"
    if "sign language" in full or "signing" in title.lower():
        return "sign_language"
    if "singing" in title.lower() or "prayer" in title.lower() or "song" in full or "poem" in full or "reciting" in full:
        return "reading_or_song"
    if "lesson" in full or "tutorial" in full or "how to speak" in full:
        return "language_lesson"
    if "conversation" in title.lower() or " and " in title.split("|")[0] and "speaking" in title.lower():
        return "conversation"
    if "how are you feeling" in title.lower() or "wikitongues together" in full or "fundrais" in full:
        return "meta"
    return "oral_history"


def parse_speakers(raw: dict) -> list[Speaker]:
    title = raw.get("title", "")
    desc = raw.get("description", "")
    
    # Pattern: [Speaker] speaking [Language]
    # e.g. "Adolphus speaking Liberian English", "Lilita and Ivars speaking Latvian Sign Language"
    speakers = []
    
    m = re.search(r'([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)?)(?:\s+and\s+([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)?))?\s+speaking\b', title)
    if m:
        s1 = m.group(1).strip()
        s2 = m.group(2).strip() if m.group(2) else None
        
        role = "native"
        if "fellow" in desc.lower() or "activist" in desc.lower():
            role = "fellow_activist"
        elif "heritage" in desc.lower() or "diaspora" in desc.lower():
            role = "heritage"
        elif "learning" in desc.lower() or "learner" in desc.lower():
            role = "learner"

        if s1 and s1.lower() not in ["the", "listen", "a", "an"]:
            speakers.append(Speaker(name=s1, role=role))
        if s2 and s2.lower() not in ["the", "listen", "a", "an"]:
            speakers.append(Speaker(name=s2, role=role))

    if not speakers:
        speakers.append(Speaker(name="Unknown", role="native"))
        
    return speakers


def resolve_language(raw: dict, sil_codes, sil_part1, name_to_iso, iso_to_glotto, name_to_glotto, glotto_codes):
    title = raw.get("title", "")
    desc = raw.get("description", "")
    tags = raw.get("tags", [])
    
    # 1. Check wikitongues URL in description
    url_m = re.search(r'wikitongues\.org/lang[a-z]*/([a-z0-9_-]+)', desc, re.IGNORECASE)
    if url_m:
        code = url_m.group(1).lower()
        if code in LANGUAGE_ALIASES:
            iso, name, gc, bcp = LANGUAGE_ALIASES[code]
            return iso, name, gc, bcp, None, None
        if code in sil_codes:
            iso = code
            name = sil_codes[iso]
            bcp = sil_part1.get(iso, iso)
            gc = iso_to_glotto.get(iso)
            return iso, name, gc, bcp, None, None

    # 2. Check title / tags / description against explicit known aliases
    full_text = f"{title} {' '.join(tags)} {desc[:400]}".lower()
    for alias, (iso, name, gc, bcp) in LANGUAGE_ALIASES.items():
        if re.search(r'\b' + re.escape(alias) + r'\b', full_text):
            return iso, name, gc, bcp, None, None

    # 3. Extract language name from title patterns:
    # "WIKITONGUES: [Speaker] speaking [Language]"
    # "The [Language] language, casually spoken"
    # "Listen to the [Language] language of..."
    patterns = [
        r'speaking\s+([A-Za-z\s\'-]+?)(?:\s+and\s+([A-Za-z\s\'-]+?))?(?:\||\.|$)',
        r'The\s+([A-Za-z\s\'-]+?)\s+language',
        r'Listen to the\s+([A-Za-z\s\'-]+?)\s+language',
        r'in the\s+([A-Za-z\s\'-]+?)\s+language'
    ]
    
    for pat in patterns:
        m = re.search(pat, title, re.IGNORECASE)
        if m:
            candidate = m.group(1).strip().lower()
            if candidate in name_to_iso:
                iso = name_to_iso[candidate]
                name = sil_codes[iso]
                bcp = sil_part1.get(iso, iso)
                gc = iso_to_glotto.get(iso)
                return iso, name, gc, bcp, None, None

    # 4. Check tags against name_to_iso
    for tag in tags:
        t_low = tag.lower().replace(" language", "").replace(" spoken", "").strip()
        if t_low in name_to_iso:
            iso = name_to_iso[t_low]
            name = sil_codes[iso]
            bcp = sil_part1.get(iso, iso)
            gc = iso_to_glotto.get(iso)
            return iso, name, gc, bcp, None, None

    # 5. Default fallback to English if meta or unknown
    return "eng", "English", "stan1293", "en", None, None


def normalize_record(raw: dict, sil_codes, sil_part1, name_to_iso, iso_to_glotto, name_to_glotto, glotto_codes) -> WikitonguesVideo:
    vid_id = raw["video_id"]
    url = f"https://www.youtube.com/watch?v={vid_id}"
    duration = raw.get("duration", 0)
    
    raw_date = str(raw.get("upload_date", "20200101"))
    if len(raw_date) == 8 and raw_date.isdigit():
        upload_date = f"{raw_date[:4]}-{raw_date[4:6]}-{raw_date[6:]}"
    else:
        upload_date = "2020-01-01"

    lic = parse_license(raw)
    ctype = parse_content_type(raw)
    speakers = parse_speakers(raw)
    prov = parse_provenance(raw)

    iso, name, gc, bcp, autonym, dialect = resolve_language(
        raw, sil_codes, sil_part1, name_to_iso, iso_to_glotto, name_to_glotto, glotto_codes
    )

    # Subtitles
    subs = raw.get("subtitles_available", [])
    trans = Transcription(
        has_subtitles=bool(subs),
        available_subtitles=subs if isinstance(subs, list) else []
    )

    primary_lang = PrimaryLanguage(
        iso639_3=iso,
        bcp47=bcp,
        name=name,
        glottocode=gc,
        autonym=autonym,
        dialect=dialect
    )

    raw_meta = RawMetadata(
        title=raw.get("title", ""),
        tags=raw.get("tags", [])
    )

    return WikitonguesVideo(
        id=vid_id,
        url=url,
        duration_seconds=duration,
        upload_date=upload_date,
        license=lic,
        content_type=ctype,
        primary_language=primary_lang,
        additional_languages=[],
        speakers=speakers,
        provenance=prov,
        transcription=trans,
        raw_metadata=raw_meta
    )


def process_all_batches():
    repo_root = Path(__file__).resolve().parent.parent
    ref_dir = repo_root / "data" / "references"
    raw_path = repo_root / "data" / "raw" / "wikitongues_youtube_raw.jsonl"
    processed_dir = repo_root / "data" / "processed"
    processed_dir.mkdir(parents=True, exist_ok=True)
    out_jsonl = processed_dir / "wikitongues_normalized.jsonl"
    report_md = processed_dir / "normalization_report.md"

    print("Loading references...")
    sil_codes, sil_part1, name_to_iso, iso_to_glotto, name_to_glotto, glotto_codes = load_references(ref_dir)
    validator = DatasetValidator(ref_dir)

    # Read existing 50 normalized records
    existing_records = []
    if out_jsonl.exists():
        with open(out_jsonl, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    existing_records.append(json.loads(line.strip()))
    print(f"Loaded {len(existing_records)} existing records from {out_jsonl.name}.")

    with open(raw_path, "r", encoding="utf-8") as f:
        all_raw = [json.loads(line) for line in f]

    total_count = len(all_raw)
    print(f"Total raw records: {total_count}")

    # Process batch by batch
    # Batch 1 was 0..50
    # Batch 2: 50..100, ..., Batch 18: 850..863
    all_normalized_dicts = list(existing_records[:50])

    batch_num = 2
    for start_idx in range(50, total_count, 50):
        end_idx = min(start_idx + 50, total_count)
        batch_raw = all_raw[start_idx:end_idx]
        print(f"\n--- Processing Batch {batch_num} (Records {start_idx+1} to {end_idx}) ---")
        
        batch_records = []
        for idx, raw in enumerate(batch_raw, start_idx + 1):
            rec = normalize_record(
                raw, sil_codes, sil_part1, name_to_iso, iso_to_glotto, name_to_glotto, glotto_codes
            )
            d = rec.to_dict()
            errs = validator.validate_record(d)
            if errs:
                print(f"Validation error in record #{idx} ({rec.id}): {errs}")
            batch_records.append(d)

        # Validate all records in batch
        batch_errors = 0
        for i, r in enumerate(batch_records, start_idx + 1):
            e = validator.validate_record(r)
            if e:
                batch_errors += 1
                print(f"Batch {batch_num} Record #{i} failed: {e}")

        if batch_errors == 0:
            print(f"✅ Batch {batch_num} ({len(batch_records)} records) successfully validated with 0 errors.")
        else:
            print(f"❌ Batch {batch_num} had {batch_errors} errors!")

        all_normalized_dicts.extend(batch_records)
        batch_num += 1

    print(f"\nTotal normalized records: {len(all_normalized_dicts)} / {total_count}")

    # Write all records to wikitongues_normalized.jsonl
    with open(out_jsonl, "w", encoding="utf-8") as f:
        for r in all_normalized_dicts:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"Written {len(all_normalized_dicts)} records to {out_jsonl}.")

    # Generate normalization report
    print("Generating comprehensive report...")
    report_content = NormalizationReporter.generate_report(all_normalized_dicts, total_raw_count=total_count)
    with open(report_md, "w", encoding="utf-8") as f:
        f.write(report_content)
    print(f"Report written to {report_md}.")


if __name__ == "__main__":
    process_all_batches()
