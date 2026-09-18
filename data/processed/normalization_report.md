# 📊 Wikitongues Normalization Report

> **Generated on**: 2026-09-07 06:40:22 UTC
> **Scope**: All 863 videos processed and validated against SIL ISO 639-3 & Glottolog tables.

---

## 📈 Key Metrics Summary

| Metric | Value |
| :--- | :--- |
| **Processed Records** | `863` / `863` (100.0%) |
| **SIL Validation Rate** | **100%** (0 hallucinated codes) |
| **Unique Primary ISO 639-3 Codes** | `467` |
| **Unique BCP 47 Tags** | `541` |
| **Glottocode Coverage** | `862 / 863` (99.9% - only Atlaans conlang is null) |
| **Autonym Coverage** | `863 / 863` (100.0%) |
| **Dialect Resolution** | `296 / 863` (34.3%) |
| **Recorders Identified** | `481 / 863` (55.7%) |
| **Total Archival Duration** | `3234 min 30 sec` (`194070` s) |
| **Average Video Duration** | `3 min 44 sec` (`224.9` s) |
| **Has Subtitles / Captions** | `284` videos |
| **Has Embedded Transcripts / Translations** | `57` videos |

---

## 🔍 Null Semantics & Data Integrity Audit

Every `null` value across all 863 database records was audited against raw source metadata and classified as either a **True Semantic Null** (inherently non-existent or logically inapplicable) or a **Data Gap** (unparsed or omitted from source):

| Field | Null Count | Classification | Linguistic & Technical Rationale |
| :--- | :--- | :--- | :--- |
| `primary_language.glottocode` | `1` | **Vrai null sémantique** | Only `9Nl_ttQDYkQ` (Atlaans conlang `art-x-atlaans` / `mis`). Glottolog catalogs natural and historical auxiliary languages; conlangs do not have a Glottocode. |
| `provenance.country_code` / `country_name` | `3` | **Vrai null sémantique** | `TQWD-hkiRg4`, `vy__EegO_BY`, `UiFZZT6hb2Q`. All are `content_type: "meta"` (organizational Wikitongues announcements / book presentations) without specific speech community territory. |
| `primary_language.dialect` | `567` | **Vrai null sémantique** | Recordings representing standard or general language forms (e.g. Esperanto, Sakha, Soga, Walloon) where no sub-variety is distinguished. Zero titles mention "dialect" among these 567 records. |
| `additional_languages[].dialect` | `12` | **Vrai null sémantique** | Standard national languages (French, English, German, Russian, etc.) spoken in multilingual videos. |
| `transcription.native_text` | `826` | **Vrai null sémantique / Mix** | Includes sign languages (`sign_language`) which have no written form, and oral recordings where no transcription was provided to YouTube. |
| `provenance.recording_date` | `862` | **Trou dans la base (Source gap)** | Only 1 video (`dXYMO6zam90`) contains an explicit date (`16/03/2022`) in description. Wikitongues does not record field recording dates on YouTube. The upload date is 100% available in `upload_date`. |
| `provenance.recorded_by` | `382` | **Trou dans la base (Source gap)** | 481 recorders are identified (55.7%). The remaining 382 videos have zero recorder credits anywhere in their source metadata. |
| `provenance.region` / `city` | `487` / `522` | **Trou dans la base (Source gap)** | Most archival records specify only national provenance. Unspecified regional locations are absent from YouTube descriptions. |
| `speakers[].origin` | `383` | **Trou dans la base (Indistinguishable)** | 380 speakers have known country provenance. However, because speakers may belong to the diaspora, automatically equating origin with country of recording risks hallucination. |

---

## 📜 Content Types Distribution

| Content Type | Count | Share |
| :--- | :--- | :--- |
| `oral_history` | 773 | 89.6% |
| `conversation` | 38 | 4.4% |
| `sign_language` | 23 | 2.7% |
| `reading_or_song` | 13 | 1.5% |
| `meta` | 11 | 1.3% |
| `fellowship_doc` | 4 | 0.5% |
| `language_lesson` | 1 | 0.1% |

---

## ⚖️ License Breakdown

| License | Count | Share |
| :--- | :--- | :--- |
| `ALL_RIGHTS_RESERVED` | 332 | 38.5% |
| `CC-BY-NC-4.0` | 261 | 30.2% |
| `CC-BY-SA-4.0` | 260 | 30.1% |
| `PUBLIC_DOMAIN` | 10 | 1.2% |

---

## 🗺️ Geographical Provenance (ISO 3166-1 alpha-2)

| Country Code | Count | Share |
| :--- | :--- | :--- |
| `US` | 109 | 12.6% |
| `ID` | 47 | 5.4% |
| `IN` | 43 | 5.0% |
| `IT` | 39 | 4.5% |
| `GB` | 28 | 3.2% |
| `ES` | 27 | 3.1% |
| `GE` | 24 | 2.8% |
| `CN` | 18 | 2.1% |
| `FR` | 17 | 2.0% |
| `MX` | 15 | 1.7% |
| `RU` | 15 | 1.7% |
| `VU` | 15 | 1.7% |
| `DE` | 12 | 1.4% |
| `LR` | 12 | 1.4% |
| `BR` | 11 | 1.3% |
| `NL` | 11 | 1.3% |
| `AU` | 11 | 1.3% |
| `XK` | 11 | 1.3% |
| `ZA` | 10 | 1.2% |
| `PK` | 10 | 1.2% |
| `JP` | 10 | 1.2% |
| `NG` | 9 | 1.0% |
| `TR` | 9 | 1.0% |
| `UY` | 9 | 1.0% |
| `FI` | 8 | 0.9% |
| `RO` | 8 | 0.9% |
| `KE` | 8 | 0.9% |
| `PH` | 8 | 0.9% |
| `CH` | 8 | 0.9% |
| `MM` | 7 | 0.8% |
| `TW` | 7 | 0.8% |
| `ZM` | 7 | 0.8% |
| `NA` | 7 | 0.8% |
| `CA` | 7 | 0.8% |
| `EE` | 7 | 0.8% |
| `AL` | 7 | 0.8% |
| `UG` | 6 | 0.7% |
| `PL` | 6 | 0.7% |
| `SE` | 6 | 0.7% |
| `IE` | 6 | 0.7% |
| `MY` | 6 | 0.7% |
| `GT` | 5 | 0.6% |
| `IQ` | 5 | 0.6% |
| `AZ` | 5 | 0.6% |
| `SY` | 5 | 0.6% |
| `MA` | 5 | 0.6% |
| `GH` | 5 | 0.6% |
| `HR` | 5 | 0.6% |
| `PT` | 5 | 0.6% |
| `MZ` | 5 | 0.6% |
| `GR` | 5 | 0.6% |
| `CZ` | 5 | 0.6% |
| `PE` | 4 | 0.5% |
| `IR` | 4 | 0.5% |
| `UZ` | 4 | 0.5% |
| `RS` | 4 | 0.5% |
| `NP` | 4 | 0.5% |
| `SB` | 4 | 0.5% |
| `LT` | 4 | 0.5% |
| `FJ` | 4 | 0.5% |
| `KZ` | 3 | 0.3% |
| `BJ` | 3 | 0.3% |
| `GN` | 3 | 0.3% |
| `VN` | 3 | 0.3% |
| `PG` | 3 | 0.3% |
| `BE` | 3 | 0.3% |
| `AR` | 3 | 0.3% |
| `CD` | 3 | 0.3% |
| `TG` | 3 | 0.3% |
| `RW` | 3 | 0.3% |
| `NO` | 3 | 0.3% |
| `LA` | 3 | 0.3% |
| `AM` | 3 | 0.3% |
| `TH` | 3 | 0.3% |
| `MG` | 3 | 0.3% |
| `IM` | 2 | 0.2% |
| `UA` | 2 | 0.2% |
| `ZW` | 2 | 0.2% |
| `MT` | 2 | 0.2% |
| `ER` | 2 | 0.2% |
| `BD` | 2 | 0.2% |
| `KH` | 2 | 0.2% |
| `EG` | 2 | 0.2% |
| `LK` | 2 | 0.2% |
| `CO` | 2 | 0.2% |
| `HT` | 2 | 0.2% |
| `SN` | 2 | 0.2% |
| `JM` | 2 | 0.2% |
| `LV` | 2 | 0.2% |
| `TZ` | 2 | 0.2% |
| `PY` | 2 | 0.2% |
| `KR` | 2 | 0.2% |
| `PW` | 2 | 0.2% |
| `DZ` | 2 | 0.2% |
| `NC` | 2 | 0.2% |
| `AO` | 2 | 0.2% |
| `HU` | 2 | 0.2% |
| `IL` | 2 | 0.2% |
| `IS` | 2 | 0.2% |
| `JE` | 1 | 0.1% |
| `SV` | 1 | 0.1% |
| `CV` | 1 | 0.1% |
| `JO` | 1 | 0.1% |
| `MW` | 1 | 0.1% |
| `HK` | 1 | 0.1% |
| `CM` | 1 | 0.1% |
| `MU` | 1 | 0.1% |
| `CK` | 1 | 0.1% |
| `TM` | 1 | 0.1% |
| `CW` | 1 | 0.1% |
| `TO` | 1 | 0.1% |
| `KG` | 1 | 0.1% |
| `SL` | 1 | 0.1% |
| `BM` | 1 | 0.1% |
| `KM` | 1 | 0.1% |
| `DK` | 1 | 0.1% |
| `TN` | 1 | 0.1% |
| `EC` | 1 | 0.1% |
| `ET` | 1 | 0.1% |
| `NR` | 1 | 0.1% |
| `TV` | 1 | 0.1% |
| `BF` | 1 | 0.1% |
| `SG` | 1 | 0.1% |
| `SK` | 1 | 0.1% |
| `CL` | 1 | 0.1% |
| `SR` | 1 | 0.1% |
| `BA` | 1 | 0.1% |
| `CI` | 1 | 0.1% |
| `HN` | 1 | 0.1% |
| `MK` | 1 | 0.1% |
| `BY` | 1 | 0.1% |
| `SI` | 1 | 0.1% |
| `NE` | 1 | 0.1% |
| `LY` | 1 | 0.1% |
| `BG` | 1 | 0.1% |
| `NZ` | 1 | 0.1% |
| `PS` | 1 | 0.1% |
| `MN` | 1 | 0.1% |

---

## 🗣️ Speaker Roles Distribution

| Speaker Role | Count |
| :--- | :--- |
| `native` | 882 |
| `fellow_activist` | 27 |
| `learner` | 14 |
| `heritage` | 10 |

---

## 📋 Complete Inventory of Processed Videos (1 to 863)

| # | ID | Language (ISO / BCP) | Glottocode | Dialect / Variety | Content Type | License | Country |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| 1 | [nXBPa_wb3dM](https://www.youtube.com/watch?v=nXBPa_wb3dM) | Quechua (`que` / `qu`) | `quec1387` | Cusco Quechua | `fellowship_doc` | `ALL_RIGHTS_RESERVED` | PE |
| 2 | [lstcnY-UXbs](https://www.youtube.com/watch?v=lstcnY-UXbs) | Arbëreshë Albanian (`aae` / `sq-IT`) | `arbe1236` | Arbëresh | `fellowship_doc` | `ALL_RIGHTS_RESERVED` | IT |
| 3 | [HQcLp1qnjHU](https://www.youtube.com/watch?v=HQcLp1qnjHU) | Igbo (`ibo` / `ig`) | `nucl1417` | Standard Igbo (Igbo izugbe) | `oral_history` | `CC-BY-NC-4.0` | NG |
| 4 | [AC8kxj2geOA](https://www.youtube.com/watch?v=AC8kxj2geOA) | Kaqchikel (`cak` / `cak`) | `kaqc1270` | None | `conversation` | `CC-BY-SA-4.0` | GT |
| 5 | [9VEN0siUHqg](https://www.youtube.com/watch?v=9VEN0siUHqg) | Batak Mandailing (`btm` / `btm`) | `bata1291` | Mandailing | `oral_history` | `CC-BY-SA-4.0` | ID |
| 6 | [92jWmMoDFv0](https://www.youtube.com/watch?v=92jWmMoDFv0) | Friulian (`fur` / `fur`) | `friu1240` | None | `oral_history` | `CC-BY-SA-4.0` | IT |
| 7 | [7cMIidnH7xY](https://www.youtube.com/watch?v=7cMIidnH7xY) | Judeo-Persian (`jpr` / `jpr`) | `jude1257` | Judeo-Shirazi | `oral_history` | `CC-BY-SA-4.0` | US |
| 8 | [dXYMO6zam90](https://www.youtube.com/watch?v=dXYMO6zam90) | Occitan (post 1500) (`oci` / `oc`) | `occi1239` | Vivaro-Alpine | `conversation` | `CC-BY-SA-4.0` | FR |
| 9 | [jOEaF9XWII0](https://www.youtube.com/watch?v=jOEaF9XWII0) | Nigerian Pidgin (`pcm` / `pcm`) | `nige1257` | None | `oral_history` | `CC-BY-NC-4.0` | NG |
| 10 | [wQlK-V5eEFY](https://www.youtube.com/watch?v=wQlK-V5eEFY) | Soga (`xog` / `xog`) | `soga1242` | None | `oral_history` | `CC-BY-SA-4.0` | UG |
| 11 | [3waS1hmNVig](https://www.youtube.com/watch?v=3waS1hmNVig) | Western Tlacolula Valley Zapotec (`zab` / `zab`) | `sanj1284` | San Juan Del Río Zapotec | `oral_history` | `CC-BY-NC-4.0` | MX |
| 12 | [1vrhTY8cXIo](https://www.youtube.com/watch?v=1vrhTY8cXIo) | Turoyo (`tru` / `tru`) | `turo1239` | None | `oral_history` | `CC-BY-SA-4.0` | TR |
| 13 | [cMe_MKYNUtg](https://www.youtube.com/watch?v=cMe_MKYNUtg) | Burmese (`mya` / `my`) | `nucl1310` | None | `oral_history` | `CC-BY-SA-4.0` | MM |
| 14 | [fvbQyuYM-a0](https://www.youtube.com/watch?v=fvbQyuYM-a0) | Kazakh (`kaz` / `kk`) | `kaza1248` | None | `oral_history` | `CC-BY-SA-4.0` | KZ |
| 15 | [PeZHJcQYt3c](https://www.youtube.com/watch?v=PeZHJcQYt3c) | Jèrriais (`nrf` / `nrf`) | `jerr1238` | Jèrriais | `oral_history` | `PUBLIC_DOMAIN` | JE |
| 16 | [yr7gko_DaoI](https://www.youtube.com/watch?v=yr7gko_DaoI) | Chippewa (`ciw` / `ciw`) | `chip1241` | Southwestern Ojibwe | `oral_history` | `CC-BY-SA-4.0` | US |
| 17 | [He4b1T_sTVM](https://www.youtube.com/watch?v=He4b1T_sTVM) | Ladakhi (`lbj` / `lbj`) | `lada1244` | None | `oral_history` | `PUBLIC_DOMAIN` | IN |
| 18 | [9LaSurw6GZg](https://www.youtube.com/watch?v=9LaSurw6GZg) | Assyrian Neo-Aramaic (`aii` / `aii`) | `assy1241` | Iraqi Koine | `oral_history` | `CC-BY-SA-4.0` | US |
| 19 | [KSkvTeEipuc](https://www.youtube.com/watch?v=KSkvTeEipuc) | Fon (`fon` / `fon`) | `fonn1241` | None | `fellowship_doc` | `ALL_RIGHTS_RESERVED` | BJ |
| 20 | [i1j6Dymblf8](https://www.youtube.com/watch?v=i1j6Dymblf8) | Northern Frisian (`frr` / `frr`) | `nort2626` | Fering | `reading_or_song` | `CC-BY-SA-4.0` | DE |
| 21 | [D7FgPZhheZ0](https://www.youtube.com/watch?v=D7FgPZhheZ0) | Ekpeye (`ekp` / `ekp`) | `ekpe1253` | None | `fellowship_doc` | `CC-BY-SA-4.0` | NG |
| 22 | [wu03ULM9id4](https://www.youtube.com/watch?v=wu03ULM9id4) | Sinhala (`sin` / `si`) | `sinh1246` | None | `conversation` | `CC-BY-NC-4.0` | TW |
| 23 | [FxxC5L372VI](https://www.youtube.com/watch?v=FxxC5L372VI) | Wa (`wbm` / `wbm`) | `nucl1290` | None | `oral_history` | `CC-BY-NC-4.0` | CN |
| 24 | [TQWD-hkiRg4](https://www.youtube.com/watch?v=TQWD-hkiRg4) | English (`eng` / `en`) | `stan1293` | None | `meta` | `ALL_RIGHTS_RESERVED` | None |
| 25 | [6X3Re1sawRs](https://www.youtube.com/watch?v=6X3Re1sawRs) | Baatonum (`bba` / `bba`) | `baat1238` | None | `oral_history` | `CC-BY-SA-4.0` | BJ |
| 26 | [KGFew34cjgM](https://www.youtube.com/watch?v=KGFew34cjgM) | Wu Chinese (`wuu` / `wuu`) | `wuch1236` | Changshu Wu | `oral_history` | `CC-BY-NC-4.0` | CN |
| 27 | [ba0S4UzVkYM](https://www.youtube.com/watch?v=ba0S4UzVkYM) | Chaldean Neo-Aramaic (`cld` / `cld`) | `chal1275` | None | `oral_history` | `CC-BY-SA-4.0` | IQ |
| 28 | [aVkrLzgPz3A](https://www.youtube.com/watch?v=aVkrLzgPz3A) | Pular (`fuf` / `fuf`) | `pula1262` | Fuuta Jallon | `oral_history` | `PUBLIC_DOMAIN` | GN |
| 29 | [8iLevbjGlVI](https://www.youtube.com/watch?v=8iLevbjGlVI) | Batak Mandailing (`btm` / `btm`) | `bata1291` | Mandailing | `oral_history` | `CC-BY-SA-4.0` | ID |
| 30 | [-Toi0tco2Gk](https://www.youtube.com/watch?v=-Toi0tco2Gk) | Tsonga (`tso` / `ts`) | `tson1249` | None | `oral_history` | `CC-BY-SA-4.0` | ZA |
| 31 | [iGQ-bbRLMJc](https://www.youtube.com/watch?v=iGQ-bbRLMJc) | Igbo (`ibo` / `ig`) | `nucl1417` | Central Igbo | `oral_history` | `PUBLIC_DOMAIN` | FI |
| 32 | [vy__EegO_BY](https://www.youtube.com/watch?v=vy__EegO_BY) | English (`eng` / `en`) | `stan1293` | None | `meta` | `ALL_RIGHTS_RESERVED` | None |
| 33 | [N_UOLqmgQrQ](https://www.youtube.com/watch?v=N_UOLqmgQrQ) | Wymysorys (`wym` / `wym`) | `wymy1235` | None | `oral_history` | `CC-BY-SA-4.0` | PL |
| 34 | [Lf6AAjLz8Cg](https://www.youtube.com/watch?v=Lf6AAjLz8Cg) | Turoyo (`tru` / `tru`) | `turo1239` | Tur Abdin | `oral_history` | `ALL_RIGHTS_RESERVED` | TR |
| 35 | [GehQiDuETPM](https://www.youtube.com/watch?v=GehQiDuETPM) | Mandaic (`mid` / `mid`) | `nucl1706` | Neo-Mandaic | `oral_history` | `ALL_RIGHTS_RESERVED` | IR |
| 36 | [M2genaU2tj0](https://www.youtube.com/watch?v=M2genaU2tj0) | Neapolitan (`nap` / `nap-IT`) | `neap1235` | Andriese | `reading_or_song` | `ALL_RIGHTS_RESERVED` | IT |
| 37 | [1sEc3I9R_7s](https://www.youtube.com/watch?v=1sEc3I9R_7s) | Assyrian Neo-Aramaic (`aii` / `aii`) | `assy1241` | Christian Urmi (C. Urmi) | `oral_history` | `CC-BY-NC-4.0` | US |
| 38 | [UiFZZT6hb2Q](https://www.youtube.com/watch?v=UiFZZT6hb2Q) | English (`eng` / `en`) | `stan1293` | None | `meta` | `ALL_RIGHTS_RESERVED` | None |
| 39 | [A_A7zRbJpnU](https://www.youtube.com/watch?v=A_A7zRbJpnU) | Cia-Cia (`cia` / `cia`) | `ciac1237` | None | `oral_history` | `CC-BY-SA-4.0` | ID |
| 40 | [qUTzZe5JiIY](https://www.youtube.com/watch?v=qUTzZe5JiIY) | Gan Chinese (`gan` / `gan`) | `ganc1239` | Húkǒu huà (Changdu Gan) | `oral_history` | `CC-BY-SA-4.0` | CN |
| 41 | [wwwrEdwQ2fQ](https://www.youtube.com/watch?v=wwwrEdwQ2fQ) | Sanskrit (`san` / `sa`) | `sans1269` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IN |
| 42 | [ZT6gtYz4YD0](https://www.youtube.com/watch?v=ZT6gtYz4YD0) | Eastern Frisian (`frs` / `frs`) | `nort2628` | East Frisian Low Saxon | `oral_history` | `CC-BY-SA-4.0` | DE |
| 43 | [RawZDv0yIjQ](https://www.youtube.com/watch?v=RawZDv0yIjQ) | Lombard (`lmo` / `lmo`) | `lomb1257` | Western Lombard | `oral_history` | `CC-BY-SA-4.0` | IT |
| 44 | [3UzO9dhxWak](https://www.youtube.com/watch?v=3UzO9dhxWak) | Eastern Frisian (`frs` / `frs`) | `nort2628` | East Frisian Low Saxon | `oral_history` | `CC-BY-SA-4.0` | DE |
| 45 | [AVSn25LbLhc](https://www.youtube.com/watch?v=AVSn25LbLhc) | Amharic (`amh` / `am`) | `amha1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 46 | [A2eea72GoMI](https://www.youtube.com/watch?v=A2eea72GoMI) | Crimean Tatar (`crh` / `crh-RO`) | `crim1257` | Dobrujan Tatar | `reading_or_song` | `ALL_RIGHTS_RESERVED` | RO |
| 47 | [efJPrwwPmsM](https://www.youtube.com/watch?v=efJPrwwPmsM) | Gondi (`gon` / `gon`) | `nort3258` | Aheri Gondi | `oral_history` | `CC-BY-SA-4.0` | IN |
| 48 | [CQT4rdig8KY](https://www.youtube.com/watch?v=CQT4rdig8KY) | Enggano (`eno` / `eno`) | `engg1245` | None | `oral_history` | `CC-BY-NC-4.0` | GB |
| 49 | [K_AxZMICTsU](https://www.youtube.com/watch?v=K_AxZMICTsU) | Western Tlacolula Valley Zapotec (`zab` / `zab`) | `sanj1284` | San Lucas Quiaviní Zapotec | `oral_history` | `CC-BY-SA-4.0` | MX |
| 50 | [yaesWLLJIRg](https://www.youtube.com/watch?v=yaesWLLJIRg) | Torwali (`trw` / `trw`) | `torw1241` | Bahrain | `conversation` | `ALL_RIGHTS_RESERVED` | PK |
| 51 | [8lR3D9LVYIs](https://www.youtube.com/watch?v=8lR3D9LVYIs) | Occitan (`oci` / `oc-gascon`) | `occi1239` | Gascon | `oral_history` | `PUBLIC_DOMAIN` | FR |
| 52 | [j4G1BIZO2PY](https://www.youtube.com/watch?v=j4G1BIZO2PY) | Kildin Sami (`sjd` / `sjd`) | `kild1236` | Kola Sámi | `conversation` | `ALL_RIGHTS_RESERVED` | RU |
| 53 | [EXzApwbjjgE](https://www.youtube.com/watch?v=EXzApwbjjgE) | Purik (`prx` / `prx`) | `puri1258` | Purik | `conversation` | `CC-BY-NC-4.0` | IN |
| 54 | [OnGhQZ_PbWs](https://www.youtube.com/watch?v=OnGhQZ_PbWs) | Wu Chinese (`wuu` / `wuu-CN`) | `wuch1236` | Wenling Hua / Taizhou Wu | `oral_history` | `ALL_RIGHTS_RESERVED` | CN |
| 55 | [nQ93o5rZ9yA](https://www.youtube.com/watch?v=nQ93o5rZ9yA) | Tajik (`tgk` / `tg`) | `taji1245` | Mugat (Lyuli) | `oral_history` | `CC-BY-NC-4.0` | UZ |
| 56 | [0T2OnDntxOI](https://www.youtube.com/watch?v=0T2OnDntxOI) | Central Okinawan (`ryu` / `ryu`) | `cent2126` | Central Okinawan | `conversation` | `ALL_RIGHTS_RESERVED` | JP |
| 57 | [P4cgvW83mDQ](https://www.youtube.com/watch?v=P4cgvW83mDQ) | Tajik (`tgk` / `tg`) | `taji1245` | Mugat (Lyuli) | `oral_history` | `CC-BY-NC-4.0` | UZ |
| 58 | [rsPCCsw7UsQ](https://www.youtube.com/watch?v=rsPCCsw7UsQ) | Judeo-Iraqi Arabic (`yhd` / `yhd`) | `jude1256` | Baghdadi Judeo-Arabic | `oral_history` | `CC-BY-NC-4.0` | IQ |
| 59 | [5Gc--eO0ok8](https://www.youtube.com/watch?v=5Gc--eO0ok8) | Manchu (`mnc` / `mnc`) | `manc1252` | Manchu | `conversation` | `ALL_RIGHTS_RESERVED` | CN |
| 60 | [OjT3DSOZGCg](https://www.youtube.com/watch?v=OjT3DSOZGCg) | Korean (`kor` / `ko`) | `kore1280` | Koryo-mar | `oral_history` | `CC-BY-NC-4.0` | UZ |
| 61 | [QAK3clpBLNg](https://www.youtube.com/watch?v=QAK3clpBLNg) | Eastern Yiddish (`ydd` / `yi`) | `east2295` | Eastern Yiddish | `reading_or_song` | `CC-BY-NC-4.0` | UZ |
| 62 | [HuhNYr_p9g8](https://www.youtube.com/watch?v=HuhNYr_p9g8) | Louisiana Creole (`lou` / `lou`) | `loui1240` | Louisiana Creole | `oral_history` | `CC-BY-SA-4.0` | US |
| 63 | [rUE1bzIx3u8](https://www.youtube.com/watch?v=rUE1bzIx3u8) | Manx (`glv` / `gv`) | `manx1243` | Manx | `oral_history` | `ALL_RIGHTS_RESERVED` | IM |
| 64 | [M82TbP5Gan4](https://www.youtube.com/watch?v=M82TbP5Gan4) | Mazanderani (`mzn` / `mzn`) | `maza1291` | Mazanderani | `oral_history` | `CC-BY-NC-4.0` | IR |
| 65 | [FqAnl_8tMmI](https://www.youtube.com/watch?v=FqAnl_8tMmI) | Hakka Chinese (`hak` / `hak`) | `hakk1236` | Hakka | `oral_history` | `ALL_RIGHTS_RESERVED` | CN |
| 66 | [NNep7NOeaVI](https://www.youtube.com/watch?v=NNep7NOeaVI) | Mahasu Pahari (`bfz` / `bfz`) | `maha1287` | Rohruri | `oral_history` | `CC-BY-NC-4.0` | IN |
| 67 | [r8R0FbhpGuE](https://www.youtube.com/watch?v=r8R0FbhpGuE) | Min Nan Chinese (`nan` / `nan`) | `minn1248` | Median Hokkien | `oral_history` | `CC-BY-SA-4.0` | ID |
| 68 | [9Fa1TOfPuJ0](https://www.youtube.com/watch?v=9Fa1TOfPuJ0) | Dargwa (`dar` / `dar`) | `darg1241` | Kaitag | `oral_history` | `ALL_RIGHTS_RESERVED` | RU |
| 69 | [4S5ZOg05dVY](https://www.youtube.com/watch?v=4S5ZOg05dVY) | Karachay-Balkar (`krc` / `krc`) | `kara1464` | Karachay-Balkar | `oral_history` | `CC-BY-NC-4.0` | RU |
| 70 | [QnlFfV60Qeo](https://www.youtube.com/watch?v=QnlFfV60Qeo) | Pipil (`ppl` / `ppl`) | `pipi1250` | Pipil / Nawat | `oral_history` | `CC-BY-SA-4.0` | SV |
| 71 | [msL692DxAS4](https://www.youtube.com/watch?v=msL692DxAS4) | Eastern Yiddish (`ydd` / `yi`) | `east2295` | Eastern Yiddish | `oral_history` | `CC-BY-NC-4.0` | GB |
| 72 | [MiyopZEfuJI](https://www.youtube.com/watch?v=MiyopZEfuJI) | Ukrainian (`ukr` / `uk`) | `ukra1253` | Surzhyk | `oral_history` | `ALL_RIGHTS_RESERVED` | UA |
| 73 | [fiOglXiVbjo](https://www.youtube.com/watch?v=fiOglXiVbjo) | Low German (`nds` / `nds`) | `nort2627` | East Pomeranian | `oral_history` | `CC-BY-NC-4.0` | BR |
| 74 | [_7ZdE-msDOQ](https://www.youtube.com/watch?v=_7ZdE-msDOQ) | Low German (`nds` / `nds-NL`) | `nort2627` | Rouveen Low Saxon | `oral_history` | `ALL_RIGHTS_RESERVED` | NL |
| 75 | [eHN_bCg-JuQ](https://www.youtube.com/watch?v=eHN_bCg-JuQ) | Shona (`sna` / `sn`) | `shon1251` | Karanga Shona | `oral_history` | `CC-BY-NC-4.0` | ZW |
| 76 | [u3c9Ke5yDNk](https://www.youtube.com/watch?v=u3c9Ke5yDNk) | Kayan Mahakam (`xay` / `xay`) | `kaya1317` | Kayan Mahakam | `oral_history` | `ALL_RIGHTS_RESERVED` | ID |
| 77 | [qpfxFvpLAJ8](https://www.youtube.com/watch?v=qpfxFvpLAJ8) | Portuguese (`por` / `pt-BR`) | `port1283` | Brazilian Portuguese | `oral_history` | `CC-BY-NC-4.0` | BR |
| 78 | [ArS9-GVw8nc](https://www.youtube.com/watch?v=ArS9-GVw8nc) | Judeo-Tat (`jdt` / `jdt`) | `jude1257` | Judeo-Tat | `oral_history` | `ALL_RIGHTS_RESERVED` | AZ |
| 79 | [9EpGjIsie44](https://www.youtube.com/watch?v=9EpGjIsie44) | Javanese (`jav` / `jv`) | `java1254` | Surabaya Javanese (Suroboyoan) | `conversation` | `CC-BY-NC-4.0` | ID |
| 80 | [_oCwNGxY5Co](https://www.youtube.com/watch?v=_oCwNGxY5Co) | Sirmauri (`srx` / `srx`) | `sirm1239` | Giripari | `oral_history` | `CC-BY-NC-4.0` | IN |
| 81 | [ZgaPLvMBeFo](https://www.youtube.com/watch?v=ZgaPLvMBeFo) | Kupang Malay (`mkn` / `mkn`) | `kupa1239` | Kupang Malay | `oral_history` | `CC-BY-SA-4.0` | ID |
| 82 | [N4RMhrlk60E](https://www.youtube.com/watch?v=N4RMhrlk60E) | Basque (`eus` / `eu`) | `basq1248` | Biscayan (Bizkaiera) | `oral_history` | `CC-BY-NC-4.0` | US |
| 83 | [pAUaSmVQ1Sg](https://www.youtube.com/watch?v=pAUaSmVQ1Sg) | Low German (`nds` / `nds-NL`) | `nort2627` | Twents Low Saxon | `oral_history` | `ALL_RIGHTS_RESERVED` | NL |
| 84 | [FvuH1eaV8Xw](https://www.youtube.com/watch?v=FvuH1eaV8Xw) | Yoruba (`yor` / `yo`) | `yoru1245` | Yoruba | `oral_history` | `CC-BY-NC-4.0` | NG |
| 85 | [M0KK_ogkLDw](https://www.youtube.com/watch?v=M0KK_ogkLDw) | Turoyo (`tru` / `tru`) | `turo1239` | Turoyo Aramaic | `reading_or_song` | `CC-BY-NC-4.0` | SY |
| 86 | [Jfqg5yEV2to](https://www.youtube.com/watch?v=Jfqg5yEV2to) | Kekchí (`kek` / `kek`) | `kekc1242` | Qʼeqchiʼ | `oral_history` | `CC-BY-SA-4.0` | GT |
| 87 | [e-rY2zkCNtU](https://www.youtube.com/watch?v=e-rY2zkCNtU) | Min Nan Chinese (`nan` / `nan`) | `minn1241` | Pontianak Teochew | `oral_history` | `CC-BY-NC-4.0` | ID |
| 88 | [lgVhTfdkWAw](https://www.youtube.com/watch?v=lgVhTfdkWAw) | Yaaku (`muu` / `muu`) | `yaak1241` | Mukogodo | `oral_history` | `CC-BY-NC-4.0` | KE |
| 89 | [mN7592r79vM](https://www.youtube.com/watch?v=mN7592r79vM) | Georgian (`kat` / `ka`) | `nucl1302` | Standard Georgian | `oral_history` | `CC-BY-NC-4.0` | GE |
| 90 | [zOb8s6GAj5E](https://www.youtube.com/watch?v=zOb8s6GAj5E) | Wu Chinese (`wuu` / `wuu`) | `wuch1236` | Hangzhou Chinese | `oral_history` | `CC-BY-NC-4.0` | CN |
| 91 | [YyYrWgfaRwk](https://www.youtube.com/watch?v=YyYrWgfaRwk) | Yoruba (`yor` / `yo`) | `yoru1245` | Standard Yoruba | `oral_history` | `CC-BY-NC-4.0` | NG |
| 92 | [5UQPNAEDa4Y](https://www.youtube.com/watch?v=5UQPNAEDa4Y) | Mambwe-Lungu (`mgr` / `mgr`) | `mamb1294` | Lungu | `reading_or_song` | `CC-BY-NC-4.0` | ZM |
| 93 | [35f7h4GsURo](https://www.youtube.com/watch?v=35f7h4GsURo) | Ladino (`lad` / `lad`) | `ladi1251` | Ladino | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 94 | [TCLzMvpaB8M](https://www.youtube.com/watch?v=TCLzMvpaB8M) | Maltese (`mlt` / `mt`) | `malt1254` | Standard Maltese | `oral_history` | `CC-BY-NC-4.0` | MT |
| 95 | [kKg2gaNzBK4](https://www.youtube.com/watch?v=kKg2gaNzBK4) | Piemontese (`pms` / `pms`) | `piem1238` | High Piedmontese | `oral_history` | `CC-BY-NC-4.0` | IT |
| 96 | [ilGopSRCea0](https://www.youtube.com/watch?v=ilGopSRCea0) | Tigrinya (`tir` / `ti`) | `tigr1271` | Tigrinya | `conversation` | `CC-BY-NC-4.0` | ER |
| 97 | [E3qV-_Ba4PU](https://www.youtube.com/watch?v=E3qV-_Ba4PU) | Ladino (`lad` / `lad`) | `ladi1251` | Ladino | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 98 | [ZvdvKBvPH9M](https://www.youtube.com/watch?v=ZvdvKBvPH9M) | Gujarati (`guj` / `gu`) | `guja1252` | Lisaan ud-Da'wat | `oral_history` | `CC-BY-NC-4.0` | IN |
| 99 | [wIlOPJLhks4](https://www.youtube.com/watch?v=wIlOPJLhks4) | Swedish (`swe` / `sv`) | `swed1254` | Central Swedish | `oral_history` | `CC-BY-SA-4.0` | SE |
| 100 | [TlMUj5JDMWE](https://www.youtube.com/watch?v=TlMUj5JDMWE) | Fanti (`fat` / `fat`) | `fant1241` | Fante | `oral_history` | `CC-BY-SA-4.0` | US |
| 101 | [4nJ1AjNeYys](https://www.youtube.com/watch?v=4nJ1AjNeYys) | Bengali (`ben` / `bn`) | `beng1280` | Standard Bengali | `oral_history` | `ALL_RIGHTS_RESERVED` | BD |
| 102 | [jZgofxN6rmk](https://www.youtube.com/watch?v=jZgofxN6rmk) | Khmer (`khm` / `km`) | `cent1989` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | KH |
| 103 | [fbOOrqY7b_o](https://www.youtube.com/watch?v=fbOOrqY7b_o) | Neapolitan (`nap` / `nap`) | `neap1235` | Materano | `oral_history` | `ALL_RIGHTS_RESERVED` | IT |
| 104 | [WlqTafVa5pU](https://www.youtube.com/watch?v=WlqTafVa5pU) | Sanhaja of Srair (`sjs` / `sjs`) | `sanh1239` | Ketama | `oral_history` | `ALL_RIGHTS_RESERVED` | MA |
| 105 | [8GsglYcXhyg](https://www.youtube.com/watch?v=8GsglYcXhyg) | Veps (`vep` / `vep`) | `veps1250` | Karelian Veps | `oral_history` | `ALL_RIGHTS_RESERVED` | RU |
| 106 | [5F5m6W95U_M](https://www.youtube.com/watch?v=5F5m6W95U_M) | Egyptian Arabic (`arz` / `arz`) | `egyp1253` | Judeo-Egyptian Arabic | `oral_history` | `ALL_RIGHTS_RESERVED` | EG |
| 107 | [gTt6LkoZ1z4](https://www.youtube.com/watch?v=gTt6LkoZ1z4) | Kabuverdianu (`kea` / `kea`) | `kabu1256` | Cape Verdean Creole | `oral_history` | `ALL_RIGHTS_RESERVED` | CV |
| 108 | [pjtSNq2yXVE](https://www.youtube.com/watch?v=pjtSNq2yXVE) | Luo (Kenya and Tanzania) (`luo` / `luo`) | `luok1236` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | KE |
| 109 | [mORCaQbggIo](https://www.youtube.com/watch?v=mORCaQbggIo) | Central Kurdish (`ckb` / `ckb`) | `cent1972` | Sorani | `oral_history` | `ALL_RIGHTS_RESERVED` | IQ |
| 110 | [Zk376vSlUyA](https://www.youtube.com/watch?v=Zk376vSlUyA) | Malayalam (`mal` / `ml`) | `mala1464` | Judeo-Malayalam | `oral_history` | `ALL_RIGHTS_RESERVED` | IN |
| 111 | [nMEKd_KSf30](https://www.youtube.com/watch?v=nMEKd_KSf30) | Sinhala (`sin` / `si`) | `sinh1246` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | LK |
| 112 | [1xGw9kQjHWI](https://www.youtube.com/watch?v=1xGw9kQjHWI) | Mamuju (`mqx` / `mqx`) | `mamu1255` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ID |
| 113 | [e9y_WshNAyE](https://www.youtube.com/watch?v=e9y_WshNAyE) | French (`fra` / `fr-gallo`) | `stan1290` | Gallo | `oral_history` | `ALL_RIGHTS_RESERVED` | FR |
| 114 | [rSTBr8QbCtg](https://www.youtube.com/watch?v=rSTBr8QbCtg) | Khoekhoe (`naq` / `naq`) | `nama1264` | Nama | `oral_history` | `ALL_RIGHTS_RESERVED` | NA |
| 115 | [vfXBjv-uMZM](https://www.youtube.com/watch?v=vfXBjv-uMZM) | Irish (`gle` / `ga`) | `iris1253` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 116 | [oY8ihozIYng](https://www.youtube.com/watch?v=oY8ihozIYng) | Classical Syriac (`syc` / `syc`) | `clas1252` | Syriac | `reading_or_song` | `ALL_RIGHTS_RESERVED` | JO |
| 117 | [GohjqZQHDlM](https://www.youtube.com/watch?v=GohjqZQHDlM) | Sasak (`sas` / `sas`) | `sasa1249` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ID |
| 118 | [vFbZR5shzCk](https://www.youtube.com/watch?v=vFbZR5shzCk) | Turkana (`tuv` / `tuv`) | `turk1308` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | KE |
| 119 | [-lVudWbCaik](https://www.youtube.com/watch?v=-lVudWbCaik) | Vietnamese (`vie` / `vi`) | `viet1252` | Hue Vietnamese | `conversation` | `ALL_RIGHTS_RESERVED` | VN |
| 120 | [I-xiEyYtAwo](https://www.youtube.com/watch?v=I-xiEyYtAwo) | Jèrriais (`nrf` / `nrf-FR`) | `jeru1240` | Cauchois (Norman) | `oral_history` | `ALL_RIGHTS_RESERVED` | FR |
| 121 | [lRujenUdJng](https://www.youtube.com/watch?v=lRujenUdJng) | Mesopotamian Arabic (`acm` / `acm`) | `meso1252` | Iraqi Arabic | `oral_history` | `ALL_RIGHTS_RESERVED` | IQ |
| 122 | [Ddydi1lcvGU](https://www.youtube.com/watch?v=Ddydi1lcvGU) | Central Kurdish (`ckb` / `ckb`) | `cent1972` | Sorani | `oral_history` | `ALL_RIGHTS_RESERVED` | IQ |
| 123 | [Bzlwr2_8ljg](https://www.youtube.com/watch?v=Bzlwr2_8ljg) | Lombard (`lmo` / `lmo`) | `lomb1257` | Bresciano | `oral_history` | `ALL_RIGHTS_RESERVED` | IT |
| 124 | [yBSatcQrbVw](https://www.youtube.com/watch?v=yBSatcQrbVw) | Brazilian Sign Language (`bzs` / `bzs`) | `braz1236` | None | `sign_language` | `ALL_RIGHTS_RESERVED` | BR |
| 125 | [JQR2KOO7-No](https://www.youtube.com/watch?v=JQR2KOO7-No) | Ila (`ilb` / `ilb`) | `ilaa1246` | None | `reading_or_song` | `ALL_RIGHTS_RESERVED` | ZM |
| 126 | [1nCw24V3nV8](https://www.youtube.com/watch?v=1nCw24V3nV8) | Yakut (`sah` / `sah`) | `yaku1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | RU |
| 127 | [5yx8o4JOQRA](https://www.youtube.com/watch?v=5yx8o4JOQRA) | Huli (`hui` / `hui`) | `huli1244` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | PG |
| 128 | [7q4G38S-Wm4](https://www.youtube.com/watch?v=7q4G38S-Wm4) | Vlaams (`vls` / `vls`) | `vlaa1240` | Westhoek West Flemish | `oral_history` | `ALL_RIGHTS_RESERVED` | BE |
| 129 | [B56nxfnSV4U](https://www.youtube.com/watch?v=B56nxfnSV4U) | Yue Chinese (`yue` / `yue`) | `yuec1235` | Guangxi Cantonese | `conversation` | `ALL_RIGHTS_RESERVED` | CN |
| 130 | [MMfozbb4w74](https://www.youtube.com/watch?v=MMfozbb4w74) | Lombard (`lmo` / `lmo`) | `lomb1257` | Bresciano | `oral_history` | `ALL_RIGHTS_RESERVED` | IT |
| 131 | [hs6qyMcOwjY](https://www.youtube.com/watch?v=hs6qyMcOwjY) | Indonesian (`ind` / `id`) | `indo1316` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ID |
| 132 | [mDycRy0tZXs](https://www.youtube.com/watch?v=mDycRy0tZXs) | Uradhi (`urf` / `urf`) | `urad1238` | Injinoo Ikya | `oral_history` | `ALL_RIGHTS_RESERVED` | AU |
| 133 | [olM7YMyxd5I](https://www.youtube.com/watch?v=olM7YMyxd5I) | Pannonian Rusyn (`rsk` / `rsk`) | `pann1239` | Pannonian | `oral_history` | `ALL_RIGHTS_RESERVED` | RS |
| 134 | [QMNBUmWBZ-o](https://www.youtube.com/watch?v=QMNBUmWBZ-o) | Kurux (`kru` / `kru`) | `kuru1300` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IN |
| 135 | [qlJ7A9kbH40](https://www.youtube.com/watch?v=qlJ7A9kbH40) | Bahau (`bhv` / `bhv`) | `baha1258` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ID |
| 136 | [A9BO3Sv1MEE](https://www.youtube.com/watch?v=A9BO3Sv1MEE) | Esperanto (`epo` / `eo`) | `espe1235` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | BR |
| 137 | [8sP3R7aCAno](https://www.youtube.com/watch?v=8sP3R7aCAno) | Dimli (`diq` / `diq`) | `diml1238` | Southern Zazaki | `oral_history` | `ALL_RIGHTS_RESERVED` | TR |
| 138 | [etUt37dgA4o](https://www.youtube.com/watch?v=etUt37dgA4o) | Masai (`mas` / `mas`) | `masa1300` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | KE |
| 139 | [8vZwNYjN1CE](https://www.youtube.com/watch?v=8vZwNYjN1CE) | Bhojpuri (`bho` / `bho`) | `bhoj1244` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IN |
| 140 | [yyFsmiNXqXg](https://www.youtube.com/watch?v=yyFsmiNXqXg) | Nyanja (`nya` / `ny`) | `nyan1308` | Chichewa | `reading_or_song` | `ALL_RIGHTS_RESERVED` | MW |
| 141 | [98uqtsvCWwU](https://www.youtube.com/watch?v=98uqtsvCWwU) | Minangkabau (`min` / `min`) | `mina1268` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ID |
| 142 | [V1hLSrjKNas](https://www.youtube.com/watch?v=V1hLSrjKNas) | Bassa (`bsq` / `bsq`) | `bass1259` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | LR |
| 143 | [3ghwdhXaLoo](https://www.youtube.com/watch?v=3ghwdhXaLoo) | Nyunga (`nys` / `nys`) | `nyun1247` | Nyungar | `oral_history` | `ALL_RIGHTS_RESERVED` | AU |
| 144 | [NI9lRDW_x2E](https://www.youtube.com/watch?v=NI9lRDW_x2E) | Spanish (`spa` / `es-419`) | `stan1288` | Caribbean Spanish / Costeño | `oral_history` | `ALL_RIGHTS_RESERVED` | CO |
| 145 | [DoQdMWN5C8A](https://www.youtube.com/watch?v=DoQdMWN5C8A) | Twi (`twi` / `tw`) | `twii1234` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GH |
| 146 | [3428HkaqA94](https://www.youtube.com/watch?v=3428HkaqA94) | Yue Chinese (`yue` / `yue-HK`) | `yuec1235` | Hong Kong Cantonese | `oral_history` | `ALL_RIGHTS_RESERVED` | HK |
| 147 | [RObSwrdDnN8](https://www.youtube.com/watch?v=RObSwrdDnN8) | Fon (`fon` / `fon`) | `fonn1241` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | BJ |
| 148 | [1fuNjOEhNvI](https://www.youtube.com/watch?v=1fuNjOEhNvI) | Irish (`gle` / `ga`) | `iris1253` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IE |
| 149 | [4f2IQ219Xg4](https://www.youtube.com/watch?v=4f2IQ219Xg4) | Central Asmat (`cns` / `cns`) | `cent2117` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ID |
| 150 | [pDDrFE3CaTc](https://www.youtube.com/watch?v=pDDrFE3CaTc) | Yidiny (`yii` / `yii`) | `yidi1249` | Gunggay | `oral_history` | `ALL_RIGHTS_RESERVED` | AU |
| 151 | [dgT6xExNcns](https://www.youtube.com/watch?v=dgT6xExNcns) | Igbo (`ibo` / `ig`) | `nucl1417` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | NG |
| 152 | [SMgN7tClSM8](https://www.youtube.com/watch?v=SMgN7tClSM8) | Hiligaynon (`hil` / `hil`) | `hili1240` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | PH |
| 153 | [zhQNFQCcMxI](https://www.youtube.com/watch?v=zhQNFQCcMxI) | Kalkutung (`ktg` / `ktg`) | `kalk1246` | Kalkatungu | `oral_history` | `ALL_RIGHTS_RESERVED` | AU |
| 154 | [tUWWNDUV2Tg](https://www.youtube.com/watch?v=tUWWNDUV2Tg) | North Levantine Arabic (`apc` / `apc`) | `nort3139` | Aleppo Arabic | `oral_history` | `ALL_RIGHTS_RESERVED` | SY |
| 155 | [k19I3vyu0WU](https://www.youtube.com/watch?v=k19I3vyu0WU) | Santiago del Estero Quichua (`qus` / `qus`) | `sant1432` | Santiagueño Quichua | `oral_history` | `ALL_RIGHTS_RESERVED` | AR |
| 156 | [Mfd16z-ucWY](https://www.youtube.com/watch?v=Mfd16z-ucWY) | Egyptian Arabic (`arz` / `arz`) | `egyp1253` | None | `meta` | `ALL_RIGHTS_RESERVED` | US |
| 157 | [ld_92xGvyng](https://www.youtube.com/watch?v=ld_92xGvyng) | French (`fra` / `fr`) | `stan1290` | None | `meta` | `ALL_RIGHTS_RESERVED` | US |
| 158 | [XhRzY5ApkBc](https://www.youtube.com/watch?v=XhRzY5ApkBc) | Spanish (`spa` / `es`) | `stan1288` | None | `meta` | `ALL_RIGHTS_RESERVED` | US |
| 159 | [x7cFUScyj4g](https://www.youtube.com/watch?v=x7cFUScyj4g) | Korean (`kor` / `ko`) | `kore1280` | None | `meta` | `ALL_RIGHTS_RESERVED` | US |
| 160 | [dm1e9mJ2BJQ](https://www.youtube.com/watch?v=dm1e9mJ2BJQ) | English (`eng` / `en`) | `stan1293` | None | `meta` | `ALL_RIGHTS_RESERVED` | US |
| 161 | [xAw_7w-hQwU](https://www.youtube.com/watch?v=xAw_7w-hQwU) | Hunde (`hke` / `hke`) | `hund1239` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | CD |
| 162 | [g92Og21FC6Y](https://www.youtube.com/watch?v=g92Og21FC6Y) | Walloon (`wln` / `wa`) | `wall1255` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | BE |
| 163 | [m8IQRKl7UT0](https://www.youtube.com/watch?v=m8IQRKl7UT0) | Minangkabau (`min` / `min`) | `mina1268` | Sijunjung Simaung | `oral_history` | `CC-BY-SA-4.0` | ID |
| 164 | [csUZolJETdI](https://www.youtube.com/watch?v=csUZolJETdI) | Siwi (`siz` / `siz`) | `siwi1239` | Siwa Oasis | `oral_history` | `ALL_RIGHTS_RESERVED` | EG |
| 165 | [IM-g4Kh0G8w](https://www.youtube.com/watch?v=IM-g4Kh0G8w) | Torres Strait Creole (`tcs` / `tcs`) | `torr1261` | Yumplatok | `oral_history` | `ALL_RIGHTS_RESERVED` | AU |
| 166 | [4NwcTJ8_ZWY](https://www.youtube.com/watch?v=4NwcTJ8_ZWY) | Rohingya (`rhg` / `rhg`) | `rohi1238` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | MM |
| 167 | [klhzWSo4MTQ](https://www.youtube.com/watch?v=klhzWSo4MTQ) | Neapolitan (`nap` / `nap`) | `neap1235` | Abruzzese | `conversation` | `ALL_RIGHTS_RESERVED` | IT |
| 168 | [eVUBHDW5ccY](https://www.youtube.com/watch?v=eVUBHDW5ccY) | Minangkabau (`min` / `min`) | `mina1268` | Lintau | `oral_history` | `CC-BY-SA-4.0` | ID |
| 169 | [mygnGGT679A](https://www.youtube.com/watch?v=mygnGGT679A) | Catalan (`cat` / `ca-ES-valencia`) | `stan1289` | Valencian | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 170 | [ym-Wmc3aJAo](https://www.youtube.com/watch?v=ym-Wmc3aJAo) | Ewondo (`ewo` / `ewo`) | `ewon1239` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | CM |
| 171 | [xPixyaLG86Y](https://www.youtube.com/watch?v=xPixyaLG86Y) | Bavarian (`bar` / `bar`) | `bava1246` | Banat Swabian | `oral_history` | `ALL_RIGHTS_RESERVED` | RO |
| 172 | [j7N_qP2mt3o](https://www.youtube.com/watch?v=j7N_qP2mt3o) | Murrinh-Patha (`mwf` / `mwf`) | `murr1258` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | AU |
| 173 | [VyuK6ggrZCc](https://www.youtube.com/watch?v=VyuK6ggrZCc) | Tigrinya (`tir` / `ti`) | `tigr1271` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ER |
| 174 | [2b_aZQDIr1k](https://www.youtube.com/watch?v=2b_aZQDIr1k) | Galician (`glg` / `gl`) | `gali1258` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 175 | [OLf2L_0XvRM](https://www.youtube.com/watch?v=OLf2L_0XvRM) | Morisyen (`mfe` / `mfe`) | `mori1278` | Mauritian Creole | `oral_history` | `ALL_RIGHTS_RESERVED` | MU |
| 176 | [SfmhsM67L_U](https://www.youtube.com/watch?v=SfmhsM67L_U) | Bandjalang (`bdy` / `bdy`) | `midd1357` | Yugambeh | `oral_history` | `ALL_RIGHTS_RESERVED` | AU |
| 177 | [pfi1mvVB0iU](https://www.youtube.com/watch?v=pfi1mvVB0iU) | Wakhi (`wbl` / `wbl`) | `wakh1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | PK |
| 178 | [0CoY1psR5bs](https://www.youtube.com/watch?v=0CoY1psR5bs) | Minangkabau (`min` / `min`) | `mina1268` | Koto Marapak | `oral_history` | `CC-BY-SA-4.0` | ID |
| 179 | [rsmIHIUXAa8](https://www.youtube.com/watch?v=rsmIHIUXAa8) | Spanish (`spa` / `es-419`) | `stan1288` | Rioplatense Spanish | `oral_history` | `ALL_RIGHTS_RESERVED` | BR |
| 180 | [jlPhkYBIUZs](https://www.youtube.com/watch?v=jlPhkYBIUZs) | Yankunytjatjara (`kdd` / `kdd`) | `yank1247` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | AU |
| 181 | [JeRb7Ud1kSU](https://www.youtube.com/watch?v=JeRb7Ud1kSU) | Russian (`rus` / `ru`) | `russ1263` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | RU |
| 182 | [Q5r3K3O_9no](https://www.youtube.com/watch?v=Q5r3K3O_9no) | Kabiyè (`kbp` / `kbp`) | `kabi1261` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | TG |
| 183 | [GPjY_W_Lq0M](https://www.youtube.com/watch?v=GPjY_W_Lq0M) | Haitian (`hat` / `ht`) | `hait1244` | None | `conversation` | `ALL_RIGHTS_RESERVED` | HT |
| 184 | [sJ06GMMcGVM](https://www.youtube.com/watch?v=sJ06GMMcGVM) | Minangkabau (`min` / `min`) | `mina1268` | Sijunjung-Simaung | `oral_history` | `CC-BY-SA-4.0` | ID |
| 185 | [iFUPTM1rX28](https://www.youtube.com/watch?v=iFUPTM1rX28) | Tachelhit (`shi` / `shi`) | `tach1250` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | MA |
| 186 | [uOYnyIX_8Gw](https://www.youtube.com/watch?v=uOYnyIX_8Gw) | French (`fra` / `fr`) | `stan1290` | Tourangeau | `oral_history` | `ALL_RIGHTS_RESERVED` | FR |
| 187 | [GPaZb-MzzpQ](https://www.youtube.com/watch?v=GPaZb-MzzpQ) | Occitan (post 1500) (`oci` / `oc-FR-nice`) | `occi1239` | Nissart Occitan | `oral_history` | `ALL_RIGHTS_RESERVED` | FR |
| 188 | [S7nctC7ckbU](https://www.youtube.com/watch?v=S7nctC7ckbU) | Kannada (`kan` / `kn`) | `nucl1305` | Bijapur Kannada | `oral_history` | `ALL_RIGHTS_RESERVED` | IN |
| 189 | [Cy3FzYLmUQc](https://www.youtube.com/watch?v=Cy3FzYLmUQc) | Pulaar (`fuc` / `fuc`) | `pula1263` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | SN |
| 190 | [xNlyppTb0Xw](https://www.youtube.com/watch?v=xNlyppTb0Xw) | English (`eng` / `en`) | `stan1293` | None | `meta` | `ALL_RIGHTS_RESERVED` | CA |
| 191 | [d5gC7zVKnkY](https://www.youtube.com/watch?v=d5gC7zVKnkY) | Tuvinian (`tyv` / `tyv`) | `tuvi1240` | Tuvan | `oral_history` | `ALL_RIGHTS_RESERVED` | RU |
| 192 | [4PSRh2q4AYo](https://www.youtube.com/watch?v=4PSRh2q4AYo) | Nepali (individual language) (`npi` / `ne`) | `nepa1254` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | NP |
| 193 | [CNFK7h0G5a4](https://www.youtube.com/watch?v=CNFK7h0G5a4) | Croatia Sign Language (`csq` / `csq`) | `croa1242` | None | `sign_language` | `ALL_RIGHTS_RESERVED` | HR |
| 194 | [hgJeqdSw4aI](https://www.youtube.com/watch?v=hgJeqdSw4aI) | Sacapulteco (`quv` / `quv`) | `saca1238` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GT |
| 195 | [F9OpKOhJs-c](https://www.youtube.com/watch?v=F9OpKOhJs-c) | Rarotongan (`rar` / `rar`) | `raro1241` | Cook Islands Māori | `oral_history` | `ALL_RIGHTS_RESERVED` | CK |
| 196 | [k7Earnq8sHw](https://www.youtube.com/watch?v=k7Earnq8sHw) | Jamaican Creole English (`jam` / `jam`) | `jama1262` | Jamaican Patois | `oral_history` | `ALL_RIGHTS_RESERVED` | JM |
| 197 | [NmmrJbZvWmc](https://www.youtube.com/watch?v=NmmrJbZvWmc) | Turkmen (`tuk` / `tk`) | `turk1304` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | TM |
| 198 | [u0cJXVvo5I4](https://www.youtube.com/watch?v=u0cJXVvo5I4) | Campidanese Sardinian (`sro` / `sro`) | `camp1261` | Occidental Campidanese | `oral_history` | `ALL_RIGHTS_RESERVED` | IT |
| 199 | [Opv58piY_bs](https://www.youtube.com/watch?v=Opv58piY_bs) | Sekpele (`lip` / `lip`) | `sekp1241` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GH |
| 200 | [yIO-F3l4b7w](https://www.youtube.com/watch?v=yIO-F3l4b7w) | Finnish (`fin` / `fi`) | `finn1318` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | FI |
| 201 | [C9M-Sep16Dg](https://www.youtube.com/watch?v=C9M-Sep16Dg) | English (`eng` / `en`) | `stan1293` | None | `meta` | `ALL_RIGHTS_RESERVED` | US |
| 202 | [uRC9W6v4NuU](https://www.youtube.com/watch?v=uRC9W6v4NuU) | Kurukh (`kru` / `kru`) | `kuru1301` | None | `oral_history` | `CC-BY-NC-4.0` | IN |
| 203 | [Y76c6UqN0dc](https://www.youtube.com/watch?v=Y76c6UqN0dc) | Liberian English (`lir` / `lir`) | `libe1240` | None | `oral_history` | `CC-BY-NC-4.0` | LR |
| 204 | [0MtwwhL5G0g](https://www.youtube.com/watch?v=0MtwwhL5G0g) | Latvian Sign Language (`lsl` / `lsl`) | `latv1245` | None | `sign_language` | `CC-BY-SA-4.0` | LV |
| 205 | [361y-JDT_bs](https://www.youtube.com/watch?v=361y-JDT_bs) | Torwali (`trw` / `trw`) | `torw1241` | None | `oral_history` | `CC-BY-NC-4.0` | PK |
| 206 | [nFC974Eua-U](https://www.youtube.com/watch?v=nFC974Eua-U) | Rohingya (`rhg` / `rhg`) | `rohi1238` | None | `oral_history` | `CC-BY-NC-4.0` | MM |
| 207 | [itdBLyLCiU0](https://www.youtube.com/watch?v=itdBLyLCiU0) | Bavarian (`bar` / `bar-RO`) | `bava1246` | Zipser German | `oral_history` | `CC-BY-SA-4.0` | RO |
| 208 | [EMITnQ-w-04](https://www.youtube.com/watch?v=EMITnQ-w-04) | Rwandan Sign Language (`rsn` / `rsn`) | `rwan1246` | None | `sign_language` | `CC-BY-NC-4.0` | RW |
| 209 | [hrxUsCrOQ-c](https://www.youtube.com/watch?v=hrxUsCrOQ-c) | Western Panjabi (`pnb` / `pnb`) | `west2386` | Majhi Punjabi | `oral_history` | `CC-BY-NC-4.0` | PK |
| 210 | [PWVzPFUgHEo](https://www.youtube.com/watch?v=PWVzPFUgHEo) | Nepali (individual language) (`npi` / `ne`) | `nepa1254` | None | `oral_history` | `CC-BY-NC-4.0` | NP |
| 211 | [rEqO7tkF_04](https://www.youtube.com/watch?v=rEqO7tkF_04) | Balantak (`blz` / `blz`) | `bala1315` | None | `oral_history` | `CC-BY-NC-4.0` | ID |
| 212 | [VPnXITN30VU](https://www.youtube.com/watch?v=VPnXITN30VU) | Croatia Sign Language (`csq` / `csq`) | `croa1242` | None | `sign_language` | `CC-BY-NC-4.0` | HR |
| 213 | [kDyUnJ0p8JE](https://www.youtube.com/watch?v=kDyUnJ0p8JE) | Assamese (`asm` / `as`) | `assa1263` | None | `oral_history` | `CC-BY-NC-4.0` | IN |
| 214 | [RtvgMwWEjSo](https://www.youtube.com/watch?v=RtvgMwWEjSo) | Amis (`ami` / `ami`) | `amis1246` | None | `oral_history` | `CC-BY-NC-4.0` | TW |
| 215 | [Gt0jbL8p8AM](https://www.youtube.com/watch?v=Gt0jbL8p8AM) | Soli (`sby` / `sby`) | `soli1239` | None | `oral_history` | `CC-BY-NC-4.0` | ZM |
| 216 | [QMypNaOcn1E](https://www.youtube.com/watch?v=QMypNaOcn1E) | Zambian Sign Language (`zsl` / `zsl`) | `zamb1239` | None | `sign_language` | `CC-BY-NC-4.0` | ZM |
| 217 | [OWoKDqJQt1c](https://www.youtube.com/watch?v=OWoKDqJQt1c) | Eastern Balochi (`bgp` / `bgp`) | `east2304` | Eastern Balochi | `oral_history` | `CC-BY-SA-4.0` | PK |
| 218 | [IA4PxlO9OOU](https://www.youtube.com/watch?v=IA4PxlO9OOU) | Mezquital Otomi (`ote` / `ote`) | `mezq1235` | Mezquital Otomi | `oral_history` | `CC-BY-SA-4.0` | MX |
| 219 | [zNwcnycMMwY](https://www.youtube.com/watch?v=zNwcnycMMwY) | Neapolitan (`nap` / `nap`) | `neap1235` | Abruzzese | `oral_history` | `CC-BY-NC-4.0` | IT |
| 220 | [KW7axC1WJZI](https://www.youtube.com/watch?v=KW7axC1WJZI) | Tày (`tyz` / `tyz`) | `tayy1238` | None | `oral_history` | `CC-BY-NC-4.0` | VN |
| 221 | [5Ae2e2mmMMU](https://www.youtube.com/watch?v=5Ae2e2mmMMU) | Emilian (`egl` / `egl`) | `emil1241` | None | `oral_history` | `CC-BY-NC-4.0` | IT |
| 222 | [PeqeZ9MysUI](https://www.youtube.com/watch?v=PeqeZ9MysUI) | Basque (`eus` / `eu`) | `basq1248` | None | `oral_history` | `CC-BY-SA-4.0` | ES |
| 223 | [hd5MB1W5Rg8](https://www.youtube.com/watch?v=hd5MB1W5Rg8) | Northern Sami (`sme` / `se`) | `nort2671` | None | `conversation` | `CC-BY-SA-4.0` | NO |
| 224 | [K7QRD82tlls](https://www.youtube.com/watch?v=K7QRD82tlls) | Papiamento (`pap` / `pap`) | `papi1253` | None | `oral_history` | `CC-BY-NC-4.0` | CW |
| 225 | [NORD_cH_kMY](https://www.youtube.com/watch?v=NORD_cH_kMY) | Car Nicobarese (`caq` / `caq`) | `carn1240` | None | `oral_history` | `CC-BY-NC-4.0` | IN |
| 226 | [aQNZL4zrDaY](https://www.youtube.com/watch?v=aQNZL4zrDaY) | Pedi (`nso` / `nso`) | `pedi1238` | Northern Sotho | `oral_history` | `CC-BY-SA-4.0` | ZA |
| 227 | [bY_TcgYvcLk](https://www.youtube.com/watch?v=bY_TcgYvcLk) | Dutch (`nld` / `nl`) | `dutc1256` | None | `oral_history` | `CC-BY-NC-4.0` | NL |
| 228 | [lebFgTHooNE](https://www.youtube.com/watch?v=lebFgTHooNE) | Lao (`lao` / `lo`) | `laoo1244` | None | `oral_history` | `CC-BY-NC-4.0` | LA |
| 229 | [YGaGz7t8Ov4](https://www.youtube.com/watch?v=YGaGz7t8Ov4) | Hindi (`hin` / `hi`) | `hind1269` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 230 | [dyg_z_ywVzA](https://www.youtube.com/watch?v=dyg_z_ywVzA) | Wu Chinese (`wuu` / `wuu`) | `wuch1236` | None | `oral_history` | `CC-BY-NC-4.0` | CN |
| 231 | [BOtJvy4ybc4](https://www.youtube.com/watch?v=BOtJvy4ybc4) | Keapara (`khz` / `khz`) | `keap1239` | Kalo | `oral_history` | `CC-BY-NC-4.0` | PG |
| 232 | [jxNQZklmQCY](https://www.youtube.com/watch?v=jxNQZklmQCY) | Lacandon (`lac` / `lac`) | `laca1243` | None | `oral_history` | `CC-BY-SA-4.0` | MX |
| 233 | [cJ4yFQ_C3f0](https://www.youtube.com/watch?v=cJ4yFQ_C3f0) | Corsican (`cos` / `co`) | `cors1241` | None | `oral_history` | `CC-BY-NC-4.0` | FR |
| 234 | [Ho2vOSl9v0E](https://www.youtube.com/watch?v=Ho2vOSl9v0E) | Western Panjabi (`pnb` / `pnb`) | `west2386` | Dinga Punjabi | `oral_history` | `CC-BY-NC-4.0` | PK |
| 235 | [_DSEp-UKmzA](https://www.youtube.com/watch?v=_DSEp-UKmzA) | Rwandan Sign Language (`rsn` / `rsn`) | `rwan1246` | None | `sign_language` | `CC-BY-NC-4.0` | RW |
| 236 | [icBfqfPlKjU](https://www.youtube.com/watch?v=icBfqfPlKjU) | Niuafo'ou (`num` / `num`) | `niua1240` | None | `oral_history` | `CC-BY-SA-4.0` | TO |
| 237 | [dtxuztEDsms](https://www.youtube.com/watch?v=dtxuztEDsms) | Nsenga (`nse` / `nse`) | `nsen1242` | None | `conversation` | `CC-BY-NC-4.0` | ZM |
| 238 | [dsUH7my4fTs](https://www.youtube.com/watch?v=dsUH7my4fTs) | Sukuma (`suk` / `suk`) | `suku1261` | None | `oral_history` | `CC-BY-NC-4.0` | TZ |
| 239 | [gBM-kh4k-PY](https://www.youtube.com/watch?v=gBM-kh4k-PY) | Chamacoco (`ceg` / `ceg`) | `cham1315` | None | `oral_history` | `CC-BY-SA-4.0` | PY |
| 240 | [O7GpkfCPZ4k](https://www.youtube.com/watch?v=O7GpkfCPZ4k) | Tulu (`tcy` / `tcy`) | `tulu1258` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 241 | [o5m5OwJ65cM](https://www.youtube.com/watch?v=o5m5OwJ65cM) | Huastec (`hus` / `hus`) | `huas1242` | None | `oral_history` | `CC-BY-SA-4.0` | MX |
| 242 | [76qruGReJeM](https://www.youtube.com/watch?v=76qruGReJeM) | Maltese Sign Language (`mdl` / `mdl`) | `malt1238` | None | `sign_language` | `CC-BY-SA-4.0` | MT |
| 243 | [e_dh1q75LSo](https://www.youtube.com/watch?v=e_dh1q75LSo) | Ukrainian (`ukr` / `uk`) | `ukra1253` | None | `oral_history` | `CC-BY-SA-4.0` | UA |
| 244 | [KDoOg1XL-j4](https://www.youtube.com/watch?v=KDoOg1XL-j4) | Lega-Shabunda (`lea` / `lea`) | `lega1249` | Lega-Shabunda | `oral_history` | `CC-BY-SA-4.0` | CD |
| 245 | [hMQxZzrmKiI](https://www.youtube.com/watch?v=hMQxZzrmKiI) | Kirghiz (`kir` / `ky`) | `kirg1245` | None | `oral_history` | `CC-BY-SA-4.0` | KG |
| 246 | [pfaUytO5zg8](https://www.youtube.com/watch?v=pfaUytO5zg8) | Garhwali (`gbm` / `gbm`) | `garh1243` | None | `oral_history` | `CC-BY-NC-4.0` | IN |
| 247 | [Ji5HuAPQquo](https://www.youtube.com/watch?v=Ji5HuAPQquo) | Balti (`bft` / `bft`) | `balt1258` | None | `oral_history` | `CC-BY-SA-4.0` | PK |
| 248 | [wWns5Q6-ShY](https://www.youtube.com/watch?v=wWns5Q6-ShY) | Even (`eve` / `eve`) | `even1260` | None | `oral_history` | `CC-BY-NC-4.0` | RU |
| 249 | [LUsMwdkXpYY](https://www.youtube.com/watch?v=LUsMwdkXpYY) | Sapo (`krn` / `krn`) | `sapo1251` | None | `oral_history` | `CC-BY-NC-4.0` | LR |
| 250 | [dZdCsqX_nEY](https://www.youtube.com/watch?v=dZdCsqX_nEY) | Croatian (`hrv` / `hr`) | `croa1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | HR |
| 251 | [cQB3BFVAHF0](https://www.youtube.com/watch?v=cQB3BFVAHF0) | Krio (`kri` / `kri`) | `krio1253` | None | `oral_history` | `CC-BY-NC-4.0` | SL |
| 252 | [MChNEkV_wt8](https://www.youtube.com/watch?v=MChNEkV_wt8) | Portuguese (`por` / `pt-PT`) | `port1283` | European Portuguese | `oral_history` | `CC-BY-SA-4.0` | PT |
| 253 | [_z62HlBXJJ8](https://www.youtube.com/watch?v=_z62HlBXJJ8) | Pular (`fuf` / `fuf`) | `pula1262` | None | `oral_history` | `CC-BY-SA-4.0` | GN |
| 254 | [BCEO_U7713M](https://www.youtube.com/watch?v=BCEO_U7713M) | Indian Sign Language (`ins` / `ins`) | `indi1237` | None | `sign_language` | `CC-BY-NC-4.0` | IN |
| 255 | [BTdYsYaoRn0](https://www.youtube.com/watch?v=BTdYsYaoRn0) | Jejueo (`jje` / `jje`) | `jeju1234` | None | `oral_history` | `CC-BY-NC-4.0` | KR |
| 256 | [PGqlzdlO_rM](https://www.youtube.com/watch?v=PGqlzdlO_rM) | Armenian (`hye` / `hy`) | `nucl1235` | Artsakh (Karabakh) Armenian | `oral_history` | `CC-BY-SA-4.0` | AM |
| 257 | [tTBDXjKZB08](https://www.youtube.com/watch?v=tTBDXjKZB08) | English (`eng` / `en-BM`) | `stan1293` | Bermudian English | `oral_history` | `CC-BY-NC-4.0` | BM |
| 258 | [C380uSo4Ils](https://www.youtube.com/watch?v=C380uSo4Ils) | Kamba (Kenya) (`kam` / `kam`) | `kamb1297` | None | `oral_history` | `CC-BY-NC-4.0` | KE |
| 259 | [z2GFNc-X6mA](https://www.youtube.com/watch?v=z2GFNc-X6mA) | Babuza (`bzg` / `bzg`) | `babu1240` | Taokas | `oral_history` | `CC-BY-NC-4.0` | TW |
| 260 | [zeApE-aD3fI](https://www.youtube.com/watch?v=zeApE-aD3fI) | Kazakh (`kaz` / `kk`) | `kaza1248` | None | `oral_history` | `CC-BY-SA-4.0` | KZ |
| 261 | [NG-rV0oGZ9s](https://www.youtube.com/watch?v=NG-rV0oGZ9s) | Balinese (`ban` / `ban`) | `bali1278` | None | `oral_history` | `CC-BY-SA-4.0` | ID |
| 262 | [ak9Zqiddtt8](https://www.youtube.com/watch?v=ak9Zqiddtt8) | Punan Bah-Biau (`pna` / `pna`) | `puna1275` | None | `oral_history` | `CC-BY-NC-4.0` | MY |
| 263 | [nJU_XnQzzHk](https://www.youtube.com/watch?v=nJU_XnQzzHk) | Southwestern Tlaxiaco Mixtec (`meh` / `meh`) | `sout3000` | Nuyoo Mixtec | `oral_history` | `CC-BY-SA-4.0` | MX |
| 264 | [ZjPiQYvtnLA](https://www.youtube.com/watch?v=ZjPiQYvtnLA) | Juǀʼhoan (`ktz` / `ktz`) | `juho1239` | None | `oral_history` | `CC-BY-SA-4.0` | NA |
| 265 | [nnBQMqgEJB0](https://www.youtube.com/watch?v=nnBQMqgEJB0) | Hindi (`hin` / `hi`) | `hind1269` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 266 | [bzHIfJ6H9Vw](https://www.youtube.com/watch?v=bzHIfJ6H9Vw) | Telugu (`tel` / `te`) | `telu1262` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 267 | [yLyMILKtFHo](https://www.youtube.com/watch?v=yLyMILKtFHo) | Grebo (`grb` / `grb`) | `greb1256` | None | `oral_history` | `CC-BY-NC-4.0` | LR |
| 268 | [LVCtvZ19tv8](https://www.youtube.com/watch?v=LVCtvZ19tv8) | Pampanga (`pam` / `pam`) | `pamp1243` | None | `oral_history` | `CC-BY-NC-4.0` | PH |
| 269 | [Gdr_yKrlf4I](https://www.youtube.com/watch?v=Gdr_yKrlf4I) | Dutch (`nld` / `nl-BE`) | `dutc1256` | Oilsjters (Aalst Dutch) | `oral_history` | `CC-BY-SA-4.0` | BE |
| 270 | [5cidz5Y3KFQ](https://www.youtube.com/watch?v=5cidz5Y3KFQ) | Gan Chinese (`gan` / `gan`) | `ganc1239` | None | `oral_history` | `CC-BY-NC-4.0` | CN |
| 271 | [CproO8ZhtF8](https://www.youtube.com/watch?v=CproO8ZhtF8) | German (`deu` / `de`) | `stan1295` | None | `oral_history` | `CC-BY-NC-4.0` | DE |
| 272 | [LTsoLZtf4Dw](https://www.youtube.com/watch?v=LTsoLZtf4Dw) | Low German (`nds` / `nds-NL`) | `nort2627` | West-Veluws | `conversation` | `CC-BY-NC-4.0` | NL |
| 273 | [vkVHspUH9U4](https://www.youtube.com/watch?v=vkVHspUH9U4) | Khoibu Naga (`nkb` / `nkb`) | `khoi1251` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 274 | [IX7cRsZD1Ks](https://www.youtube.com/watch?v=IX7cRsZD1Ks) | Lombard (`lmo` / `lmo`) | `lomb1257` | None | `oral_history` | `CC-BY-NC-4.0` | IT |
| 275 | [quGhsKtq88A](https://www.youtube.com/watch?v=quGhsKtq88A) | Kumaoni (`kfy` / `kfy`) | `kuma1273` | None | `oral_history` | `CC-BY-NC-4.0` | IN |
| 276 | [VTCLy0kejbg](https://www.youtube.com/watch?v=VTCLy0kejbg) | Polish (`pol` / `pl`) | `poli1260` | None | `oral_history` | `CC-BY-SA-4.0` | PL |
| 277 | [GyxYnfM_y5M](https://www.youtube.com/watch?v=GyxYnfM_y5M) | Adyghe (`ady` / `ady`) | `adyg1241` | Circassian | `oral_history` | `CC-BY-SA-4.0` | TR |
| 278 | [wziUoXmcCVc](https://www.youtube.com/watch?v=wziUoXmcCVc) | Ga (`gaa` / `gaa`) | `gaaa1244` | None | `oral_history` | `CC-BY-SA-4.0` | GH |
| 279 | [Ty3IAWxANi4](https://www.youtube.com/watch?v=Ty3IAWxANi4) | Uighur (`uig` / `ug`) | `uigh1240` | None | `conversation` | `CC-BY-NC-4.0` | CN |
| 280 | [Ex0SVHRSEe4](https://www.youtube.com/watch?v=Ex0SVHRSEe4) | Võro (`vro` / `vro`) | `sout2679` | None | `oral_history` | `CC-BY-NC-4.0` | EE |
| 281 | [ReWdgF-fdrE](https://www.youtube.com/watch?v=ReWdgF-fdrE) | Võro (`vro` / `vro`) | `sout2679` | None | `oral_history` | `CC-BY-SA-4.0` | EE |
| 282 | [ibq-hS-G1JQ](https://www.youtube.com/watch?v=ibq-hS-G1JQ) | Esperanto (`epo` / `eo`) | `espe1235` | None | `oral_history` | `CC-BY-NC-4.0` | US |
| 283 | [XFAXrpmuITQ](https://www.youtube.com/watch?v=XFAXrpmuITQ) | Võro (`vro` / `vro`) | `sout2679` | None | `oral_history` | `CC-BY-SA-4.0` | EE |
| 284 | [XVVrouF3bzE](https://www.youtube.com/watch?v=XVVrouF3bzE) | Võro (`vro` / `vro`) | `sout2679` | None | `oral_history` | `CC-BY-SA-4.0` | EE |
| 285 | [0t189tY4hEM](https://www.youtube.com/watch?v=0t189tY4hEM) | Italian (`ita` / `it`) | `ital1282` | None | `oral_history` | `CC-BY-NC-4.0` | IT |
| 286 | [yNLgivKN5z4](https://www.youtube.com/watch?v=yNLgivKN5z4) | Võro (`vro` / `vro`) | `sout2679` | None | `oral_history` | `CC-BY-SA-4.0` | EE |
| 287 | [XBhFAFqVT2w](https://www.youtube.com/watch?v=XBhFAFqVT2w) | Thai (`tha` / `th`) | `thai1261` | None | `oral_history` | `CC-BY-SA-4.0` | TH |
| 288 | [BT7Pgimrq4g](https://www.youtube.com/watch?v=BT7Pgimrq4g) | Võro (`vro` / `vro`) | `sout2679` | None | `oral_history` | `CC-BY-SA-4.0` | EE |
| 289 | [7ZFaAtiiVIk](https://www.youtube.com/watch?v=7ZFaAtiiVIk) | Mwali Comorian (`wlc` / `wlc`) | `mwal1237` | None | `oral_history` | `CC-BY-NC-4.0` | KM |
| 290 | [X7Yvsw2dnDE](https://www.youtube.com/watch?v=X7Yvsw2dnDE) | Võro (`vro` / `vro`) | `sout2679` | None | `oral_history` | `CC-BY-SA-4.0` | EE |
| 291 | [4NTFvW2nUzw](https://www.youtube.com/watch?v=4NTFvW2nUzw) | Nyindu (`nyg` / `nyg`) | `nyin1248` | None | `oral_history` | `CC-BY-NC-4.0` | CD |
| 292 | [bT99iXQa7DM](https://www.youtube.com/watch?v=bT99iXQa7DM) | Northern Kurdish (`kmr` / `kmr`) | `nort2641` | Kurmanji | `oral_history` | `CC-BY-SA-4.0` | SY |
| 293 | [dgxGqecUCwU](https://www.youtube.com/watch?v=dgxGqecUCwU) | Yonaguni (`yoi` / `yoi`) | `yona1241` | None | `oral_history` | `CC-BY-NC-4.0` | JP |
| 294 | [dpfq9Ehf5JI](https://www.youtube.com/watch?v=dpfq9Ehf5JI) | Kazakh (`kaz` / `kk`) | `kaza1248` | None | `oral_history` | `CC-BY-SA-4.0` | KZ |
| 295 | [mVo1WW5vfXM](https://www.youtube.com/watch?v=mVo1WW5vfXM) | Assamese (`asm` / `as`) | `assa1263` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 296 | [kAUsuyOVd_Q](https://www.youtube.com/watch?v=kAUsuyOVd_Q) | Central Bikol (`bcl` / `bcl`) | `cent2087` | Bicolano | `oral_history` | `CC-BY-SA-4.0` | PH |
| 297 | [r0FS2UF3qCo](https://www.youtube.com/watch?v=r0FS2UF3qCo) | Finland-Swedish Sign Language (`fss` / `fss`) | `finl1235` | None | `sign_language` | `CC-BY-SA-4.0` | FI |
| 298 | [x9NkreemeO0](https://www.youtube.com/watch?v=x9NkreemeO0) | Lombard (`lmo` / `lmo`) | `lomb1257` | None | `oral_history` | `CC-BY-SA-4.0` | IT |
| 299 | [xfVWIUdCGgI](https://www.youtube.com/watch?v=xfVWIUdCGgI) | Danish Sign Language (`dsl` / `dsl`) | `dani1246` | None | `sign_language` | `CC-BY-NC-4.0` | DK |
| 300 | [AYwEA-FLS_s](https://www.youtube.com/watch?v=AYwEA-FLS_s) | Karbi (`mjw` / `mjw`) | `karb1241` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 301 | [SuNKWIMUjQo](https://www.youtube.com/watch?v=SuNKWIMUjQo) | Marwari (India) (`rwr` / `rwr`) | `marw1260` | Marwari | `oral_history` | `CC-BY-SA-4.0` | IN |
| 302 | [cfO536EExPw](https://www.youtube.com/watch?v=cfO536EExPw) | Iloko (`ilo` / `ilo`) | `ilok1237` | Ilocano | `oral_history` | `CC-BY-SA-4.0` | PH |
| 303 | [3fOoyoDpBFw](https://www.youtube.com/watch?v=3fOoyoDpBFw) | Tunisian Arabic (`aeb` / `aeb`) | `tuni1259` | None | `oral_history` | `CC-BY-SA-4.0` | TN |
| 304 | [V3KNAMr3u4Q](https://www.youtube.com/watch?v=V3KNAMr3u4Q) | Sindhi (`snd` / `sd`) | `sind1272` | None | `oral_history` | `CC-BY-NC-4.0` | PK |
| 305 | [AqGXY9fohac](https://www.youtube.com/watch?v=AqGXY9fohac) | Bemba (Zambia) (`bem` / `bem`) | `bemb1257` | None | `oral_history` | `CC-BY-SA-4.0` | ZM |
| 306 | [8iE0R8b3tq4](https://www.youtube.com/watch?v=8iE0R8b3tq4) | Ambonese Malay (`abs` / `abs`) | `ambo1250` | Aru variety | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 307 | [w-PP0r8ohF8](https://www.youtube.com/watch?v=w-PP0r8ohF8) | Norwegian Bokmål (`nob` / `nb-US`) | `norw1259` | American Norwegian | `oral_history` | `CC-BY-NC-4.0` | US |
| 308 | [oOr8uPY5PNQ](https://www.youtube.com/watch?v=oOr8uPY5PNQ) | Kryts (`kry` / `kry`) | `kryt1240` | Jek | `oral_history` | `CC-BY-SA-4.0` | AZ |
| 309 | [oRWL2htbGK0](https://www.youtube.com/watch?v=oRWL2htbGK0) | Kannada (`kan` / `kn`) | `nucl1305` | Kundagannada | `oral_history` | `CC-BY-SA-4.0` | IN |
| 310 | [VCxeM27OAlQ](https://www.youtube.com/watch?v=VCxeM27OAlQ) | Tobian (`tox` / `tox`) | `tobi1238` | None | `oral_history` | `CC-BY-SA-4.0` | PW |
| 311 | [AtBWbZmCceU](https://www.youtube.com/watch?v=AtBWbZmCceU) | Herero (`her` / `hz`) | `here1253` | None | `oral_history` | `CC-BY-SA-4.0` | NA |
| 312 | [EC5Ae63LasY](https://www.youtube.com/watch?v=EC5Ae63LasY) | Achinese (`ace` / `ace`) | `achi1257` | None | `conversation` | `CC-BY-SA-4.0` | ID |
| 313 | [hfxJCEIChIk](https://www.youtube.com/watch?v=hfxJCEIChIk) | Afrikaans (`afr` / `af`) | `afri1274` | None | `oral_history` | `CC-BY-SA-4.0` | ZA |
| 314 | [UlRd8RkVdfo](https://www.youtube.com/watch?v=UlRd8RkVdfo) | Malayalam (`mal` / `ml`) | `mala1464` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 315 | [IdYu9RBWv0o](https://www.youtube.com/watch?v=IdYu9RBWv0o) | Benyadu' (`byd` / `byd`) | `beny1237` | None | `oral_history` | `CC-BY-SA-4.0` | ID |
| 316 | [82RTpFpp3OA](https://www.youtube.com/watch?v=82RTpFpp3OA) | Chicahuaxtla Triqui (`trs` / `trs`) | `chic1273` | San Andrés Chicahuaxtla | `oral_history` | `CC-BY-SA-4.0` | MX |
| 317 | [eA92yZCjXA8](https://www.youtube.com/watch?v=eA92yZCjXA8) | Paipai (`ppi` / `ppi`) | `paip1241` | None | `oral_history` | `CC-BY-SA-4.0` | MX |
| 318 | [6NCIYV3Q4d4](https://www.youtube.com/watch?v=6NCIYV3Q4d4) | Breton (`bre` / `br`) | `bret1244` | None | `oral_history` | `CC-BY-SA-4.0` | FR |
| 319 | [tzUaooThBzI](https://www.youtube.com/watch?v=tzUaooThBzI) | Santali (`sat` / `sat`) | `sant1410` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 320 | [6htms5vFurs](https://www.youtube.com/watch?v=6htms5vFurs) | Bekati' (`bei` / `bei`) | `beka1241` | Beahe | `oral_history` | `CC-BY-SA-4.0` | ID |
| 321 | [PRVPB9OA0s4](https://www.youtube.com/watch?v=PRVPB9OA0s4) | Dagbani (`dag` / `dag`) | `dagb1246` | None | `oral_history` | `CC-BY-SA-4.0` | GH |
| 322 | [xhLQcnmX54g](https://www.youtube.com/watch?v=xhLQcnmX54g) | Bekati' (`bei` / `bei`) | `beka1241` | None | `oral_history` | `CC-BY-SA-4.0` | ID |
| 323 | [wpNIOUjOa8c](https://www.youtube.com/watch?v=wpNIOUjOa8c) | Yoruba (`yor` / `yo`) | `yoru1245` | None | `oral_history` | `CC-BY-SA-4.0` | NG |
| 324 | [9S8lDVmQSCQ](https://www.youtube.com/watch?v=9S8lDVmQSCQ) | Low German (`nds` / `nds-NL-gronings`) | `nort2627` | Gronings | `oral_history` | `CC-BY-SA-4.0` | NL |
| 325 | [0PKycEkSsF8](https://www.youtube.com/watch?v=0PKycEkSsF8) | English (`eng` / `en`) | `stan1293` | None | `meta` | `ALL_RIGHTS_RESERVED` | US |
| 326 | [-Mh9bFzUYzQ](https://www.youtube.com/watch?v=-Mh9bFzUYzQ) | Malay (individual language) (`zlm` / `ms`) | `mala1479` | None | `oral_history` | `CC-BY-SA-4.0` | MY |
| 327 | [A9l639zi6Ik](https://www.youtube.com/watch?v=A9l639zi6Ik) | Dan (`dnj` / `dnj`) | `nucl1770` | None | `oral_history` | `CC-BY-SA-4.0` | LR |
| 328 | [WKxxsUnObj8](https://www.youtube.com/watch?v=WKxxsUnObj8) | Sadri (`sck` / `sck`) | `sadr1248` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 329 | [gymwIdhFlWM](https://www.youtube.com/watch?v=gymwIdhFlWM) | Yucateco (`yua` / `yua`) | `yuca1254` | Yucatecan Maya | `oral_history` | `CC-BY-SA-4.0` | MX |
| 330 | [pjWd-n1tVeQ](https://www.youtube.com/watch?v=pjWd-n1tVeQ) | Barwe (`bwg` / `bwg`) | `barw1243` | None | `oral_history` | `CC-BY-SA-4.0` | MZ |
| 331 | [oVRij25QNlQ](https://www.youtube.com/watch?v=oVRij25QNlQ) | Nias (`nia` / `nia`) | `nias1242` | None | `oral_history` | `CC-BY-SA-4.0` | ID |
| 332 | [AEcRxyWrFBw](https://www.youtube.com/watch?v=AEcRxyWrFBw) | Extremaduran (`ext` / `ext`) | `extr1243` | None | `oral_history` | `CC-BY-SA-4.0` | ES |
| 333 | [g2L_YR5P5KE](https://www.youtube.com/watch?v=g2L_YR5P5KE) | Nyanja (`nya` / `ny`) | `nyan1308` | None | `oral_history` | `CC-BY-SA-4.0` | ZM |
| 334 | [K2iYeGTwcU8](https://www.youtube.com/watch?v=K2iYeGTwcU8) | Cusco Quechua (`quz` / `quz`) | `cusc1236` | None | `oral_history` | `CC-BY-SA-4.0` | PE |
| 335 | [tkMujSf5Djo](https://www.youtube.com/watch?v=tkMujSf5Djo) | Wolof (`wol` / `wo`) | `nucl1347` | None | `oral_history` | `CC-BY-SA-4.0` | SN |
| 336 | [808KeQLlP0I](https://www.youtube.com/watch?v=808KeQLlP0I) | Eastern Krahn (`kqo` / `kqo`) | `east2414` | Konobo | `oral_history` | `CC-BY-SA-4.0` | LR |
| 337 | [MODU1yhBb-8](https://www.youtube.com/watch?v=MODU1yhBb-8) | Ligurian (`lij` / `lij`) | `ligu1248` | None | `oral_history` | `CC-BY-SA-4.0` | IT |
| 338 | [AYgWSuv00pc](https://www.youtube.com/watch?v=AYgWSuv00pc) | Ganda (`lug` / `lg`) | `gand1255` | None | `oral_history` | `CC-BY-NC-4.0` | UG |
| 339 | [HWYnyZEOVeE](https://www.youtube.com/watch?v=HWYnyZEOVeE) | Lemerig (`lrz` / `lrz`) | `leme1238` | None | `oral_history` | `CC-BY-SA-4.0` | VU |
| 340 | [4ZGmauJA23c](https://www.youtube.com/watch?v=4ZGmauJA23c) | Algerian Arabic (`arq` / `arq`) | `alge1239` | None | `oral_history` | `CC-BY-SA-4.0` | DZ |
| 341 | [7vwcbBfETXA](https://www.youtube.com/watch?v=7vwcbBfETXA) | Hakka Chinese (`hak` / `hak`) | `hakk1236` | None | `oral_history` | `CC-BY-SA-4.0` | CN |
| 342 | [5as9jMrmjpU](https://www.youtube.com/watch?v=5as9jMrmjpU) | Logudorese Sardinian (`src` / `src`) | `logu1236` | None | `oral_history` | `CC-BY-SA-4.0` | IT |
| 343 | [03KULxOT31E](https://www.youtube.com/watch?v=03KULxOT31E) | Burmese (`mya` / `my`) | `nucl1310` | None | `oral_history` | `CC-BY-SA-4.0` | MM |
| 344 | [IT7iuHWerbQ](https://www.youtube.com/watch?v=IT7iuHWerbQ) | Bavarian (`bar` / `bar-DE`) | `bava1246` | None | `oral_history` | `CC-BY-SA-4.0` | DE |
| 345 | [ysQrLUOGhkE](https://www.youtube.com/watch?v=ysQrLUOGhkE) | Kenyan Sign Language (`xki` / `xki`) | `keny1241` | None | `sign_language` | `ALL_RIGHTS_RESERVED` | KE |
| 346 | [DHH91F52IYc](https://www.youtube.com/watch?v=DHH91F52IYc) | Tunica (`tun` / `tun`) | `tuni1252` | None | `conversation` | `CC-BY-NC-4.0` | US |
| 347 | [SdfMpBDPVis](https://www.youtube.com/watch?v=SdfMpBDPVis) | S'gaw Karen (`ksw` / `ksw`) | `sgaw1245` | None | `oral_history` | `CC-BY-NC-4.0` | MM |
| 348 | [cAyhRppr5QM](https://www.youtube.com/watch?v=cAyhRppr5QM) | Highland Totonac (`tos` / `tos`) | `high1243` | None | `oral_history` | `CC-BY-NC-4.0` | MX |
| 349 | [qnlqAuPiigY](https://www.youtube.com/watch?v=qnlqAuPiigY) | Ibibio (`ibb` / `ibb`) | `ibib1240` | None | `oral_history` | `CC-BY-SA-4.0` | NG |
| 350 | [_GDuaW95qUQ](https://www.youtube.com/watch?v=_GDuaW95qUQ) | Afrikaans (`afr` / `af`) | `afri1274` | None | `oral_history` | `CC-BY-NC-4.0` | ZA |
| 351 | [DJ0NRqv5r7g](https://www.youtube.com/watch?v=DJ0NRqv5r7g) | Plateau Malagasy (`plt` / `plt`) | `plat1254` | Merina / Plateau Malagasy | `oral_history` | `CC-BY-NC-4.0` | MG |
| 352 | [b6eEK15bgAE](https://www.youtube.com/watch?v=b6eEK15bgAE) | North Azerbaijani (`azj` / `az`) | `nort2697` | Northern Azerbaijani | `oral_history` | `ALL_RIGHTS_RESERVED` | AZ |
| 353 | [v1WsoWZFZZ4](https://www.youtube.com/watch?v=v1WsoWZFZZ4) | Silesian (`szl` / `szl`) | `sile1254` | None | `oral_history` | `CC-BY-SA-4.0` | PL |
| 354 | [XSXBcko8wNQ](https://www.youtube.com/watch?v=XSXBcko8wNQ) | Gwich'in (`gwi` / `gwi`) | `gwic1235` | None | `oral_history` | `CC-BY-SA-4.0` | CA |
| 355 | [0KDTO6q3tdM](https://www.youtube.com/watch?v=0KDTO6q3tdM) | Dutch (`nld` / `nl-NL-hetbildt`) | `dutc1256` | Bildts | `oral_history` | `CC-BY-SA-4.0` | NL |
| 356 | [kQIy1RLuwNo](https://www.youtube.com/watch?v=kQIy1RLuwNo) | Chiga (`cgg` / `cgg`) | `chig1238` | None | `oral_history` | `CC-BY-SA-4.0` | UG |
| 357 | [b_DtKXDXLFY](https://www.youtube.com/watch?v=b_DtKXDXLFY) | Otavalo Highland Quichua (`qvi` / `qvi`) | `imba1240` | None | `oral_history` | `CC-BY-NC-4.0` | EC |
| 358 | [KSkO2sJlMxc](https://www.youtube.com/watch?v=KSkO2sJlMxc) | Musi (`mui` / `mui`) | `musi1241` | Palembang Malay | `oral_history` | `CC-BY-SA-4.0` | ID |
| 359 | [JLKQVIvtfZ8](https://www.youtube.com/watch?v=JLKQVIvtfZ8) | Asturian (`ast` / `ast`) | `astu1245` | None | `oral_history` | `CC-BY-SA-4.0` | ES |
| 360 | [h8rq3IQI-z0](https://www.youtube.com/watch?v=h8rq3IQI-z0) | Gwere (`gwr` / `gwr`) | `gwer1238` | None | `oral_history` | `CC-BY-NC-4.0` | UG |
| 361 | [chsL-GSpTBc](https://www.youtube.com/watch?v=chsL-GSpTBc) | Lehali (`tql` / `tql`) | `leha1243` | None | `oral_history` | `CC-BY-SA-4.0` | VU |
| 362 | [TdrrTxT99PA](https://www.youtube.com/watch?v=TdrrTxT99PA) | Mano (`mev` / `mev`) | `mann1248` | None | `oral_history` | `CC-BY-SA-4.0` | LR |
| 363 | [ou02UU2iLY4](https://www.youtube.com/watch?v=ou02UU2iLY4) | Batak Toba (`bbc` / `bbc`) | `bata1299` | None | `oral_history` | `CC-BY-SA-4.0` | ID |
| 364 | [8OBVOJxBU7E](https://www.youtube.com/watch?v=8OBVOJxBU7E) | Yue Chinese (`yue` / `yue-taishan`) | `yuec1235` | Taishanese (Siyi Yue) | `oral_history` | `CC-BY-SA-4.0` | CN |
| 365 | [wpqaGLWxZUY](https://www.youtube.com/watch?v=wpqaGLWxZUY) | Bekati' (`bei` / `bei`) | `beka1241` | Bedineh | `conversation` | `CC-BY-SA-4.0` | ID |
| 366 | [lGPQI5bOfqU](https://www.youtube.com/watch?v=lGPQI5bOfqU) | Gonja (`gjn` / `gjn`) | `gonj1241` | None | `oral_history` | `CC-BY-SA-4.0` | GH |
| 367 | [8D0rOCam_hQ](https://www.youtube.com/watch?v=8D0rOCam_hQ) | Fataleka (`far` / `far`) | `fata1245` | None | `oral_history` | `CC-BY-SA-4.0` | SB |
| 368 | [nbbdx1UmjXE](https://www.youtube.com/watch?v=nbbdx1UmjXE) | Bhojpuri (`bho` / `bho`) | `bhoj1244` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 369 | [cxiGMkEZvKQ](https://www.youtube.com/watch?v=cxiGMkEZvKQ) | Cocama-Cocamilla (`cod` / `cod`) | `coca1259` | None | `oral_history` | `CC-BY-NC-4.0` | PE |
| 370 | [Vp8g0znA-tU](https://www.youtube.com/watch?v=Vp8g0znA-tU) | Kashmiri (`kas` / `ks`) | `kash1277` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 371 | [CJkijDWHQeQ](https://www.youtube.com/watch?v=CJkijDWHQeQ) | Kabyle (`kab` / `kab`) | `kaby1243` | None | `oral_history` | `CC-BY-SA-4.0` | DZ |
| 372 | [TF4fO7Yv8Z8](https://www.youtube.com/watch?v=TF4fO7Yv8Z8) | Navajo (`nav` / `nv`) | `nava1243` | None | `oral_history` | `CC-BY-NC-4.0` | US |
| 373 | [QUSLdT-YkHY](https://www.youtube.com/watch?v=QUSLdT-YkHY) | To'abaita (`mlu` / `mlu`) | `toab1237` | None | `oral_history` | `CC-BY-SA-4.0` | SB |
| 374 | [98mMMwkyPzU](https://www.youtube.com/watch?v=98mMMwkyPzU) | Iranian Persian (`pes` / `fa`) | `iran1263` | None | `oral_history` | `CC-BY-SA-4.0` | IR |
| 375 | [5_-yVH92IY0](https://www.youtube.com/watch?v=5_-yVH92IY0) | French (`fra` / `fr-CA`) | `stan1290` | Canadian French | `oral_history` | `CC-BY-SA-4.0` | CA |
| 376 | [AYLkkOp5gW8](https://www.youtube.com/watch?v=AYLkkOp5gW8) | Lo-Toga (`lht` / `lht`) | `loto1240` | None | `oral_history` | `CC-BY-SA-4.0` | VU |
| 377 | [gs-Hs_ZarnE](https://www.youtube.com/watch?v=gs-Hs_ZarnE) | Zeeuws (`zea` / `zea`) | `zeeu1238` | Zeelandic | `conversation` | `CC-BY-NC-4.0` | NL |
| 378 | [usLABtKtRho](https://www.youtube.com/watch?v=usLABtKtRho) | Tosk Albanian (`als` / `sq`) | `tosk1239` | Tosk Albanian | `oral_history` | `ALL_RIGHTS_RESERVED` | GR |
| 379 | [vtbwPtyPmbQ](https://www.youtube.com/watch?v=vtbwPtyPmbQ) | Amharic (`amh` / `am`) | `amha1245` | None | `oral_history` | `CC-BY-NC-4.0` | ET |
| 380 | [ivcyiIgDY_E](https://www.youtube.com/watch?v=ivcyiIgDY_E) | Bavarian (`bar` / `bar-DE`) | `bava1246` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GB |
| 381 | [rF7X9yCZTl8](https://www.youtube.com/watch?v=rF7X9yCZTl8) | Tarifit (`rif` / `rif`) | `tari1263` | Riffian | `oral_history` | `CC-BY-SA-4.0` | MA |
| 382 | [B-UiHe5DIt4](https://www.youtube.com/watch?v=B-UiHe5DIt4) | Nauru (`nau` / `na`) | `naur1243` | None | `oral_history` | `CC-BY-SA-4.0` | NR |
| 383 | [dhRoN1V1rQI](https://www.youtube.com/watch?v=dhRoN1V1rQI) | Shipibo-Conibo (`shp` / `shp`) | `ship1254` | None | `oral_history` | `CC-BY-NC-4.0` | PE |
| 384 | [hoyuxNukrbY](https://www.youtube.com/watch?v=hoyuxNukrbY) | Namibian Sign Language (`nbs` / `nbs`) | `nami1249` | None | `sign_language` | `CC-BY-SA-4.0` | NA |
| 385 | [4j9xBWlMUqA](https://www.youtube.com/watch?v=4j9xBWlMUqA) | Iraqw (`irk` / `irk`) | `iraq1246` | None | `conversation` | `CC-BY-SA-4.0` | TZ |
| 386 | [1seeNWS-8Fc](https://www.youtube.com/watch?v=1seeNWS-8Fc) | Tatar (`tat` / `tt`) | `tata1255` | None | `oral_history` | `CC-BY-NC-4.0` | RU |
| 387 | [raX_B10ytWI](https://www.youtube.com/watch?v=raX_B10ytWI) | Tok Pisin (`tpi` / `tpi`) | `tokp1240` | None | `oral_history` | `CC-BY-SA-4.0` | PG |
| 388 | [1TEQACUZMp0](https://www.youtube.com/watch?v=1TEQACUZMp0) | Osing (`osi` / `osi`) | `osin1237` | None | `oral_history` | `CC-BY-SA-4.0` | ID |
| 389 | [aZGyISJ3djo](https://www.youtube.com/watch?v=aZGyISJ3djo) | Western Frisian (`fry` / `fy`) | `west2354` | None | `oral_history` | `CC-BY-SA-4.0` | NL |
| 390 | [BfHinOzTkK4](https://www.youtube.com/watch?v=BfHinOzTkK4) | Tachelhit (`shi` / `shi`) | `tach1250` | None | `oral_history` | `CC-BY-SA-4.0` | MA |
| 391 | [vVys2adt-zA](https://www.youtube.com/watch?v=vVys2adt-zA) | Swiss German (`gsw` / `gsw`) | `swis1247` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | UY |
| 392 | [jzgaOtKpCd0](https://www.youtube.com/watch?v=jzgaOtKpCd0) | Tuvalu (`tvl` / `tvl`) | `tuva1244` | None | `oral_history` | `CC-BY-SA-4.0` | TV |
| 393 | [n43kwuSOj2E](https://www.youtube.com/watch?v=n43kwuSOj2E) | Moroccan Arabic (`ary` / `ary`) | `moro1292` | None | `oral_history` | `CC-BY-SA-4.0` | MA |
| 394 | [CSkxXFxg8z4](https://www.youtube.com/watch?v=CSkxXFxg8z4) | Bengali (`ben` / `bn`) | `beng1280` | None | `oral_history` | `CC-BY-NC-4.0` | IN |
| 395 | [ttp2NTXqkl8](https://www.youtube.com/watch?v=ttp2NTXqkl8) | Sicilian (`scn` / `scn`) | `sici1248` | None | `oral_history` | `CC-BY-SA-4.0` | IT |
| 396 | [glqy1koOinI](https://www.youtube.com/watch?v=glqy1koOinI) | Kuanyama (`kua` / `kj`) | `kwan1273` | Oshiwambo | `oral_history` | `CC-BY-SA-4.0` | NA |
| 397 | [QA_5uU6DE20](https://www.youtube.com/watch?v=QA_5uU6DE20) | Asturian (`ast` / `ast-ES-leon`) | `astu1245` | Leonese | `oral_history` | `CC-BY-SA-4.0` | ES |
| 398 | [bhp5qYy8uCo](https://www.youtube.com/watch?v=bhp5qYy8uCo) | Ossetian (`oss` / `os`) | `osse1245` | Iron Ossetian | `oral_history` | `CC-BY-NC-4.0` | RU |
| 399 | [yMf1aVKqsSQ](https://www.youtube.com/watch?v=yMf1aVKqsSQ) | Swiss German (`gsw` / `gsw-FR`) | `swis1247` | Alsatian | `oral_history` | `CC-BY-SA-4.0` | FR |
| 400 | [elpkRzfMFCE](https://www.youtube.com/watch?v=elpkRzfMFCE) | Dutch Sign Language (`dse` / `dse`) | `dutc1253` | None | `sign_language` | `CC-BY-SA-4.0` | NL |
| 401 | [x5nIUaB98dQ](https://www.youtube.com/watch?v=x5nIUaB98dQ) | Liberia Kpelle (`xpe` / `xpe`) | `libe1247` | None | `oral_history` | `CC-BY-SA-4.0` | LR |
| 402 | [NMBVCEq8TLU](https://www.youtube.com/watch?v=NMBVCEq8TLU) | Louisiana Creole (`lou` / `lou`) | `loui1240` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 403 | [XdPkJUX5q6A](https://www.youtube.com/watch?v=XdPkJUX5q6A) | Javanese (`jav` / `jv`) | `java1254` | None | `conversation` | `CC-BY-SA-4.0` | ID |
| 404 | [N7T85Q0ez1o](https://www.youtube.com/watch?v=N7T85Q0ez1o) | Sundanese (`sun` / `su-ID-banten`) | `sund1252` | Bantenese | `oral_history` | `CC-BY-SA-4.0` | ID |
| 405 | [QLLyXc24Vcc](https://www.youtube.com/watch?v=QLLyXc24Vcc) | Mossi (`mos` / `mos`) | `moss1236` | None | `oral_history` | `CC-BY-SA-4.0` | BF |
| 406 | [yOrLAkSNe5c](https://www.youtube.com/watch?v=yOrLAkSNe5c) | French (`fra` / `fr-CA-chiac`) | `stan1290` | Chiac (Acadian French) | `conversation` | `CC-BY-SA-4.0` | CA |
| 407 | [32tIfTcXopo](https://www.youtube.com/watch?v=32tIfTcXopo) | West Ambae (`nnd` / `nnd`) | `west2513` | None | `oral_history` | `CC-BY-SA-4.0` | VU |
| 408 | [cHTNty8YeT0](https://www.youtube.com/watch?v=cHTNty8YeT0) | Western Tlacolula Valley Zapotec (`zab` / `zab`) | `sanj1284` | San Lucas Quiaviní Zapotec | `oral_history` | `CC-BY-NC-4.0` | MX |
| 409 | [6OTT7m8MgAI](https://www.youtube.com/watch?v=6OTT7m8MgAI) | Eastern Maninkakan (`emk` / `emk`) | `east2426` | Mandingo | `oral_history` | `CC-BY-SA-4.0` | LR |
| 410 | [-UCw1Q9ni2E](https://www.youtube.com/watch?v=-UCw1Q9ni2E) | Numèè (`kdk` / `kdk`) | `nume1242` | Booráá (Isle of Pines) | `oral_history` | `CC-BY-NC-4.0` | NC |
| 411 | [CDeE2dZyb0M](https://www.youtube.com/watch?v=CDeE2dZyb0M) | North Levantine Arabic (`apc` / `apc`) | `nort3139` | Syrian Arabic | `oral_history` | `CC-BY-SA-4.0` | SY |
| 412 | [xpDBaE9TSe8](https://www.youtube.com/watch?v=xpDBaE9TSe8) | Eastern Tamang (`taj` / `taj`) | `east2347` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 413 | [vjK-2lc0KQU](https://www.youtube.com/watch?v=vjK-2lc0KQU) | Zou (`zom` / `zom`) | `zouu1235` | None | `oral_history` | `CC-BY-SA-4.0` | MM |
| 414 | [IyBNVrLQ2-A](https://www.youtube.com/watch?v=IyBNVrLQ2-A) | Breton (`bre` / `br`) | `bret1244` | None | `oral_history` | `CC-BY-NC-4.0` | FR |
| 415 | [rzkKRTvwGG8](https://www.youtube.com/watch?v=rzkKRTvwGG8) | Natügu (`ntu` / `ntu`) | `natu1246` | None | `oral_history` | `CC-BY-SA-4.0` | SB |
| 416 | [uh9hePNiPfg](https://www.youtube.com/watch?v=uh9hePNiPfg) | Macedo-Romanian (`rup` / `rup`) | `arom1237` | Aromanian | `oral_history` | `CC-BY-NC-4.0` | RO |
| 417 | [xF_CJUadatY](https://www.youtube.com/watch?v=xF_CJUadatY) | Yue Chinese (`yue` / `yue`) | `yuec1235` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 418 | [mNyEuC2GxGk](https://www.youtube.com/watch?v=mNyEuC2GxGk) | Manx (`glv` / `gv`) | `manx1243` | None | `oral_history` | `CC-BY-SA-4.0` | IM |
| 419 | [xe6ebodfmKU](https://www.youtube.com/watch?v=xe6ebodfmKU) | Nepal Bhasa (`new` / `new`) | `newa1246` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 420 | [kAenLJSfNWM](https://www.youtube.com/watch?v=kAenLJSfNWM) | French (`fra` / `fr-CA-quebec`) | `stan1290` | Québec French | `oral_history` | `CC-BY-SA-4.0` | CA |
| 421 | [8ieQ9HfbqwY](https://www.youtube.com/watch?v=8ieQ9HfbqwY) | Sundanese (`sun` / `su`) | `sund1252` | None | `oral_history` | `CC-BY-SA-4.0` | ID |
| 422 | [Nop4WnhX-k4](https://www.youtube.com/watch?v=Nop4WnhX-k4) | Gheg Albanian (`aln` / `aln`) | `gheg1238` | Gheg Albanian | `oral_history` | `CC-BY-NC-4.0` | XK |
| 423 | [pUfu40JELyM](https://www.youtube.com/watch?v=pUfu40JELyM) | Karankawa (`zkk` / `zkk`) | `kara1289` | None | `oral_history` | `CC-BY-NC-4.0` | US |
| 424 | [reNXOCf-9z0](https://www.youtube.com/watch?v=reNXOCf-9z0) | Motlav (`mlv` / `mlv`) | `motl1237` | Mwotlap | `oral_history` | `CC-BY-SA-4.0` | VU |
| 425 | [uPa84Ro8SrU](https://www.youtube.com/watch?v=uPa84Ro8SrU) | Nume (`tgs` / `tgs`) | `nume1241` | None | `oral_history` | `CC-BY-SA-4.0` | VU |
| 426 | [MnghW2JB9j4](https://www.youtube.com/watch?v=MnghW2JB9j4) | Loma (Liberia) (`lom` / `lom`) | `loma1260` | None | `oral_history` | `CC-BY-SA-4.0` | LR |
| 427 | [4sgX-jvskfI](https://www.youtube.com/watch?v=4sgX-jvskfI) | Tamil (`tam` / `ta-LK`) | `tami1289` | Sri Lankan Tamil | `oral_history` | `CC-BY-NC-4.0` | LK |
| 428 | [tvNW5-lnx0g](https://www.youtube.com/watch?v=tvNW5-lnx0g) | Neapolitan (`nap` / `nap`) | `neap1235` | Abruzzese | `oral_history` | `CC-BY-SA-4.0` | IT |
| 429 | [IVFfgzvSLXI](https://www.youtube.com/watch?v=IVFfgzvSLXI) | Dutch (`nld` / `nl-NL-brabants`) | `dutc1256` | Brabantian | `oral_history` | `CC-BY-SA-4.0` | NL |
| 430 | [k-uKyuTveuA](https://www.youtube.com/watch?v=k-uKyuTveuA) | K'iche' (`quc` / `quc`) | `kich1262` | None | `oral_history` | `CC-BY-NC-4.0` | GT |
| 431 | [WaTpyPIBGOc](https://www.youtube.com/watch?v=WaTpyPIBGOc) | Sicilian (`scn` / `scn`) | `sici1248` | None | `oral_history` | `CC-BY-SA-4.0` | IT |
| 432 | [OJvsp6XNUzQ](https://www.youtube.com/watch?v=OJvsp6XNUzQ) | Malay (individual language) (`zlm` / `ms`) | `mala1479` | None | `oral_history` | `CC-BY-SA-4.0` | MY |
| 433 | [Kxdd3bUVnuI](https://www.youtube.com/watch?v=Kxdd3bUVnuI) | Vurës (`msn` / `msn`) | `vure1239` | None | `oral_history` | `CC-BY-SA-4.0` | VU |
| 434 | [vUeMj9_XrJA](https://www.youtube.com/watch?v=vUeMj9_XrJA) | Macedo-Romanian (`rup` / `rup`) | `arom1237` | Aromanian | `oral_history` | `ALL_RIGHTS_RESERVED` | AL |
| 435 | [J0Yx_sLr6Vo](https://www.youtube.com/watch?v=J0Yx_sLr6Vo) | Haitian (`hat` / `ht`) | `hait1244` | None | `oral_history` | `CC-BY-NC-4.0` | HT |
| 436 | [c47B6Y5fbss](https://www.youtube.com/watch?v=c47B6Y5fbss) | Basque (`eus` / `eu`) | `basq1248` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 437 | [AYoVFf6ZRyA](https://www.youtube.com/watch?v=AYoVFf6ZRyA) | Yoruba (`yor` / `yo`) | `yoru1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 438 | [gs3rmilVQLM](https://www.youtube.com/watch?v=gs3rmilVQLM) | Javanese (`jav` / `jv`) | `java1254` | None | `oral_history` | `CC-BY-NC-4.0` | ID |
| 439 | [YdgWeFznE2M](https://www.youtube.com/watch?v=YdgWeFznE2M) | Afrikaans (`afr` / `af`) | `afri1274` | None | `oral_history` | `CC-BY-SA-4.0` | ZA |
| 440 | [ZKcvZmtar9g](https://www.youtube.com/watch?v=ZKcvZmtar9g) | Irish (`gle` / `ga`) | `iris1253` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 441 | [WmoSv7Cl1-M](https://www.youtube.com/watch?v=WmoSv7Cl1-M) | Bavarian (`bar` / `bar-SI`) | `bava1246` | Gottscheerish | `conversation` | `CC-BY-NC-4.0` | US |
| 442 | [JrcogiyJGCk](https://www.youtube.com/watch?v=JrcogiyJGCk) | Spanish Sign Language (`ssp` / `ssp`) | `span1263` | None | `sign_language` | `CC-BY-SA-4.0` | ES |
| 443 | [3FGc0zaIg2k](https://www.youtube.com/watch?v=3FGc0zaIg2k) | English (`eng` / `en-GB-scotland`) | `stan1293` | Scottish English | `oral_history` | `ALL_RIGHTS_RESERVED` | GB |
| 444 | [a7rbopMACEo](https://www.youtube.com/watch?v=a7rbopMACEo) | Kimbundu (`kmb` / `kmb`) | `kimb1241` | None | `oral_history` | `CC-BY-SA-4.0` | AO |
| 445 | [5imsaweRZWQ](https://www.youtube.com/watch?v=5imsaweRZWQ) | East Ambae (`omb` / `omb`) | `east2443` | North Ambae | `oral_history` | `CC-BY-SA-4.0` | VU |
| 446 | [wjn_ayKh1G0](https://www.youtube.com/watch?v=wjn_ayKh1G0) | Namakura (`nmk` / `nmk`) | `nama1268` | None | `oral_history` | `CC-BY-SA-4.0` | VU |
| 447 | [TVMfOk6x8VI](https://www.youtube.com/watch?v=TVMfOk6x8VI) | Eastern Maninkakan (`emk` / `emk`) | `east2426` | Mandingo | `oral_history` | `CC-BY-SA-4.0` | LR |
| 448 | [FiBkz0nnhtk](https://www.youtube.com/watch?v=FiBkz0nnhtk) | Portuguese (`por` / `pt-BR`) | `port1283` | Brazilian Portuguese | `oral_history` | `ALL_RIGHTS_RESERVED` | UY |
| 449 | [WUrJB96-BuE](https://www.youtube.com/watch?v=WUrJB96-BuE) | Musi (`mui` / `mui`) | `musi1241` | Palembangnese | `conversation` | `CC-BY-SA-4.0` | ID |
| 450 | [fG0X7P1WFZk](https://www.youtube.com/watch?v=fG0X7P1WFZk) | Filipino (`fil` / `fil`) | `fili1244` | None | `oral_history` | `CC-BY-SA-4.0` | PH |
| 451 | [LZoRgfFdXXQ](https://www.youtube.com/watch?v=LZoRgfFdXXQ) | Mandarin Chinese (`cmn` / `cmn`) | `mand1415` | Henan Mandarin | `oral_history` | `CC-BY-SA-4.0` | CN |
| 452 | [ftqet7jH91g](https://www.youtube.com/watch?v=ftqet7jH91g) | North Azerbaijani (`azj` / `az`) | `nort2697` | None | `oral_history` | `CC-BY-SA-4.0` | GE |
| 453 | [O2eX3XuzWBM](https://www.youtube.com/watch?v=O2eX3XuzWBM) | Yoruba (`yor` / `yo`) | `yoru1245` | None | `conversation` | `CC-BY-NC-4.0` | NG |
| 454 | [30d4TyH_9Ts](https://www.youtube.com/watch?v=30d4TyH_9Ts) | Georgian (`kat` / `ka`) | `nucl1302` | None | `oral_history` | `CC-BY-NC-4.0` | GE |
| 455 | [ok7DGXbk8Mk](https://www.youtube.com/watch?v=ok7DGXbk8Mk) | Guerrero Amuzgo (`amu` / `amu`) | `guer1243` | None | `oral_history` | `CC-BY-NC-4.0` | MX |
| 456 | [8jAAPdvTld0](https://www.youtube.com/watch?v=8jAAPdvTld0) | Mingrelian (`xmf` / `xmf`) | `ming1252` | None | `oral_history` | `CC-BY-NC-4.0` | GE |
| 457 | [-128MZD3rKU](https://www.youtube.com/watch?v=-128MZD3rKU) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 458 | [U9NivlodX8c](https://www.youtube.com/watch?v=U9NivlodX8c) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 459 | [A1QY9Ul5_iM](https://www.youtube.com/watch?v=A1QY9Ul5_iM) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 460 | [F4xgvj4kSnU](https://www.youtube.com/watch?v=F4xgvj4kSnU) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 461 | [f7Msppvklb0](https://www.youtube.com/watch?v=f7Msppvklb0) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 462 | [CwGK0BmHbmY](https://www.youtube.com/watch?v=CwGK0BmHbmY) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 463 | [t6a5LmxqW6c](https://www.youtube.com/watch?v=t6a5LmxqW6c) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 464 | [aXeID-fJdt8](https://www.youtube.com/watch?v=aXeID-fJdt8) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 465 | [w1Bugj3Ws7w](https://www.youtube.com/watch?v=w1Bugj3Ws7w) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 466 | [CbiVj4rV3dY](https://www.youtube.com/watch?v=CbiVj4rV3dY) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 467 | [yE9HBsnhEc8](https://www.youtube.com/watch?v=yE9HBsnhEc8) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 468 | [enXPLO5kT3U](https://www.youtube.com/watch?v=enXPLO5kT3U) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 469 | [UZNsPtr9Ekg](https://www.youtube.com/watch?v=UZNsPtr9Ekg) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 470 | [3jpoUySC6sk](https://www.youtube.com/watch?v=3jpoUySC6sk) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 471 | [Z2lYJyGr0vc](https://www.youtube.com/watch?v=Z2lYJyGr0vc) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 472 | [S-It8jeuq-w](https://www.youtube.com/watch?v=S-It8jeuq-w) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 473 | [nYLSU5faTIM](https://www.youtube.com/watch?v=nYLSU5faTIM) | Russian (`rus` / `ru`) | `russ1263` | None | `oral_history` | `CC-BY-NC-4.0` | RU |
| 474 | [M34j7R6biR0](https://www.youtube.com/watch?v=M34j7R6biR0) | Mingrelian (`xmf` / `xmf`) | `ming1252` | None | `oral_history` | `CC-BY-NC-4.0` | GE |
| 475 | [NAhK_HlNNJM](https://www.youtube.com/watch?v=NAhK_HlNNJM) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 476 | [kc8rKa11EzI](https://www.youtube.com/watch?v=kc8rKa11EzI) | Georgian (`kat` / `ka`) | `nucl1302` | None | `conversation` | `CC-BY-NC-4.0` | GE |
| 477 | [pS5Adkwaf-U](https://www.youtube.com/watch?v=pS5Adkwaf-U) | Ladino (`lad` / `lad`) | `ladi1251` | None | `oral_history` | `CC-BY-NC-4.0` | TR |
| 478 | [9ZV7Rb2bAIc](https://www.youtube.com/watch?v=9ZV7Rb2bAIc) | Kven Finnish (`fkv` / `fkv`) | `kven1236` | None | `oral_history` | `CC-BY-NC-4.0` | NO |
| 479 | [qW0GpWnioTQ](https://www.youtube.com/watch?v=qW0GpWnioTQ) | Irish Sign Language (`isg` / `isg`) | `iris1235` | None | `sign_language` | `CC-BY-NC-4.0` | IE |
| 480 | [KncKzJEIUko](https://www.youtube.com/watch?v=KncKzJEIUko) | Macedo-Romanian (`rup` / `rup`) | `arom1237` | Vlach | `oral_history` | `CC-BY-NC-4.0` | AL |
| 481 | [vwWzzl2oZTk](https://www.youtube.com/watch?v=vwWzzl2oZTk) | Macedo-Romanian (`rup` / `rup`) | `arom1237` | Vlach | `oral_history` | `ALL_RIGHTS_RESERVED` | SG |
| 482 | [wuP_E0oFZkY](https://www.youtube.com/watch?v=wuP_E0oFZkY) | Lozi (`loz` / `loz`) | `lozi1239` | None | `oral_history` | `CC-BY-SA-4.0` | NA |
| 483 | [EBLGBob9ZFA](https://www.youtube.com/watch?v=EBLGBob9ZFA) | Malaccan Creole Portuguese (`mcm` / `mcm`) | `mala1533` | Kristang | `conversation` | `CC-BY-NC-4.0` | US |
| 484 | [YqFbV7vFIK8](https://www.youtube.com/watch?v=YqFbV7vFIK8) | Limburgan (`lim` / `li`) | `limb1263` | None | `oral_history` | `CC-BY-SA-4.0` | SK |
| 485 | [ykypP-uOqq0](https://www.youtube.com/watch?v=ykypP-uOqq0) | Russian Sign Language (`rsl` / `rsl`) | `russ1255` | None | `sign_language` | `CC-BY-NC-4.0` | RU |
| 486 | [BT4Kbgs0llE](https://www.youtube.com/watch?v=BT4Kbgs0llE) | Subiya (`sbs` / `sbs`) | `subi1246` | None | `conversation` | `CC-BY-SA-4.0` | NA |
| 487 | [mfRie6DsS44](https://www.youtube.com/watch?v=mfRie6DsS44) | Swabian (`swg` / `swg`) | `swab1242` | Danube Swabian | `conversation` | `CC-BY-SA-4.0` | HU |
| 488 | [VihQkH66RoA](https://www.youtube.com/watch?v=VihQkH66RoA) | Catalan (`cat` / `ca`) | `stan1289` | None | `conversation` | `CC-BY-SA-4.0` | ES |
| 489 | [pBksbW_fXKo](https://www.youtube.com/watch?v=pBksbW_fXKo) | Maori (`mri` / `mi`) | `maor1246` | None | `oral_history` | `CC-BY-NC-4.0` | AU |
| 490 | [stVATHE414E](https://www.youtube.com/watch?v=stVATHE414E) | Northern Hindko (`hno` / `hno`) | `nort2662` | None | `conversation` | `CC-BY-SA-4.0` | IT |
| 491 | [xHQKFgYEw3w](https://www.youtube.com/watch?v=xHQKFgYEw3w) | Crow (`cro` / `cro`) | `crow1244` | None | `oral_history` | `CC-BY-SA-4.0` | US |
| 492 | [_N4HGvswrjE](https://www.youtube.com/watch?v=_N4HGvswrjE) | Venetian (`vec` / `vec`) | `vene1258` | Veronese | `oral_history` | `ALL_RIGHTS_RESERVED` | IT |
| 493 | [X1me0E0OGqU](https://www.youtube.com/watch?v=X1me0E0OGqU) | English (`eng` / `en`) | `stan1293` | Scottish English | `oral_history` | `ALL_RIGHTS_RESERVED` | GB |
| 494 | [i_B6BJFumno](https://www.youtube.com/watch?v=i_B6BJFumno) | Amharic (`amh` / `am`) | `amha1245` | None | `oral_history` | `CC-BY-NC-4.0` | US |
| 495 | [hPozChGO_LA](https://www.youtube.com/watch?v=hPozChGO_LA) | Serbian (`srp` / `sr`) | `serb1264` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | AL |
| 496 | [6TiSKGRjYLs](https://www.youtube.com/watch?v=6TiSKGRjYLs) | Romanian (`ron` / `ro`) | `roma1327` | None | `oral_history` | `CC-BY-SA-4.0` | RO |
| 497 | [oGVRFnENVlI](https://www.youtube.com/watch?v=oGVRFnENVlI) | Banjar (`bjn` / `bjn`) | `banj1239` | None | `oral_history` | `CC-BY-SA-4.0` | ID |
| 498 | [tpltPC_ckqw](https://www.youtube.com/watch?v=tpltPC_ckqw) | Swiss-Italian Sign Language (`slf` / `slf`) | `swis1235` | None | `sign_language` | `CC-BY-NC-4.0` | CH |
| 499 | [JssdxmMLYHs](https://www.youtube.com/watch?v=JssdxmMLYHs) | Vai (`vai` / `vai`) | `vaii1241` | None | `conversation` | `CC-BY-SA-4.0` | LR |
| 500 | [8xdzebPGPHI](https://www.youtube.com/watch?v=8xdzebPGPHI) | Iban (`iba` / `iba`) | `iban1264` | None | `oral_history` | `CC-BY-SA-4.0` | MY |
| 501 | [uv_6J0heNVc](https://www.youtube.com/watch?v=uv_6J0heNVc) | Samoan (`smo` / `sm`) | `samo1305` | None | `oral_history` | `CC-BY-NC-4.0` | AU |
| 502 | [GVkbhzm3VJE](https://www.youtube.com/watch?v=GVkbhzm3VJE) | Neapolitan (`nap` / `nap`) | `neap1235` | None | `oral_history` | `CC-BY-SA-4.0` | IT |
| 503 | [hHAm7Gpp8zI](https://www.youtube.com/watch?v=hHAm7Gpp8zI) | French (`fra` / `fr`) | `stan1290` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | CH |
| 504 | [0cj-CL9sRR0](https://www.youtube.com/watch?v=0cj-CL9sRR0) | German (`deu` / `de-RO`) | `stan1295` | Transylvanian Saxon | `oral_history` | `CC-BY-SA-4.0` | DE |
| 505 | [ys7MtFK3ReI](https://www.youtube.com/watch?v=ys7MtFK3ReI) | Miyako (`mvi` / `mvi`) | `miya1259` | None | `oral_history` | `CC-BY-SA-4.0` | US |
| 506 | [whHnH3a-olo](https://www.youtube.com/watch?v=whHnH3a-olo) | Croatian (`hrv` / `hr`) | `croa1245` | None | `conversation` | `CC-BY-NC-4.0` | HR |
| 507 | [stQwzNjm-WI](https://www.youtube.com/watch?v=stQwzNjm-WI) | Mandinka (`mnk` / `mnk`) | `mand1436` | None | `oral_history` | `CC-BY-SA-4.0` | TW |
| 508 | [YEij6a6wt0Y](https://www.youtube.com/watch?v=YEij6a6wt0Y) | Odia (`ory` / `or`) | `oriy1255` | Baleswari Odia | `oral_history` | `CC-BY-SA-4.0` | IN |
| 509 | [jeSxC2RNSkk](https://www.youtube.com/watch?v=jeSxC2RNSkk) | Irish (`gle` / `ga`) | `iris1253` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 510 | [VV0bmwKLHX0](https://www.youtube.com/watch?v=VV0bmwKLHX0) | Wyandot (`wyn` / `wyn`) | `petu1234` | None | `oral_history` | `CC-BY-SA-4.0` | US |
| 511 | [-8ZNc02x-U0](https://www.youtube.com/watch?v=-8ZNc02x-U0) | Lule Sami (`smj` / `smj`) | `lule1254` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | SE |
| 512 | [UibNKykq4do](https://www.youtube.com/watch?v=UibNKykq4do) | Portuguese (`por` / `pt-BR`) | `port1283` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | BR |
| 513 | [yjBhhSKuBd8](https://www.youtube.com/watch?v=yjBhhSKuBd8) | Tlingit (`tli` / `tli`) | `tlin1245` | None | `conversation` | `CC-BY-SA-4.0` | US |
| 514 | [2bhYs6APqtU](https://www.youtube.com/watch?v=2bhYs6APqtU) | Portuguese (`por` / `pt-BR`) | `port1283` | None | `conversation` | `CC-BY-SA-4.0` | BR |
| 515 | [wAipXzYNztM](https://www.youtube.com/watch?v=wAipXzYNztM) | Haitian (`hat` / `ht`) | `hait1244` | None | `oral_history` | `CC-BY-SA-4.0` | US |
| 516 | [vHWpv_3NmBs](https://www.youtube.com/watch?v=vHWpv_3NmBs) | Pontic (`pnt` / `pnt`) | `pont1253` | None | `conversation` | `CC-BY-NC-4.0` | GR |
| 517 | [p45O8FiMED4](https://www.youtube.com/watch?v=p45O8FiMED4) | Dotyali (`dty` / `dty`) | `doty1234` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 518 | [6u8gvwDevxE](https://www.youtube.com/watch?v=6u8gvwDevxE) | Spanish (`spa` / `es-AR`) | `stan1288` | Rioplatense Spanish | `oral_history` | `ALL_RIGHTS_RESERVED` | UY |
| 519 | [905hv_a4URY](https://www.youtube.com/watch?v=905hv_a4URY) | Breton (`bre` / `br`) | `bret1244` | None | `oral_history` | `CC-BY-NC-4.0` | ES |
| 520 | [lM7P_th3I6E](https://www.youtube.com/watch?v=lM7P_th3I6E) | Tamil (`tam` / `ta`) | `tami1289` | None | `oral_history` | `CC-BY-SA-4.0` | MY |
| 521 | [QLFOGwmPei0](https://www.youtube.com/watch?v=QLFOGwmPei0) | Mirandese (`mwl` / `mwl`) | `mira1251` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | PT |
| 522 | [SVu7sUmEJgY](https://www.youtube.com/watch?v=SVu7sUmEJgY) | English (`eng` / `en`) | `stan1293` | Scottish English | `reading_or_song` | `ALL_RIGHTS_RESERVED` | GB |
| 523 | [89yLb3goapY](https://www.youtube.com/watch?v=89yLb3goapY) | Danish (`dan` / `da`) | `dani1285` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | AL |
| 524 | [jshv9n3xAO4](https://www.youtube.com/watch?v=jshv9n3xAO4) | German (`deu` / `de-US`) | `stan1295` | Texas German | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 525 | [HXg_tCZfuWg](https://www.youtube.com/watch?v=HXg_tCZfuWg) | Tsonga (`tso` / `ts`) | `tson1249` | None | `oral_history` | `CC-BY-NC-4.0` | JP |
| 526 | [a9XYhuJhJY8](https://www.youtube.com/watch?v=a9XYhuJhJY8) | Chukot (`ckt` / `ckt`) | `chuk1273` | None | `oral_history` | `CC-BY-SA-4.0` | RO |
| 527 | [xj26oHydbyE](https://www.youtube.com/watch?v=xj26oHydbyE) | Yue Chinese (`yue` / `yue`) | `yuec1235` | Cantonese | `oral_history` | `CC-BY-NC-4.0` | XK |
| 528 | [kysjEWRwL98](https://www.youtube.com/watch?v=kysjEWRwL98) | Romagnol (`rgn` / `rgn`) | `roma1328` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | UY |
| 529 | [QKV3eHkFAZY](https://www.youtube.com/watch?v=QKV3eHkFAZY) | Korean (`kor` / `ko`) | `kore1280` | None | `oral_history` | `CC-BY-NC-4.0` | GB |
| 530 | [xYUS0HFhkW0](https://www.youtube.com/watch?v=xYUS0HFhkW0) | Bulgarian (`bul` / `bg-GR`) | `bulg1262` | Pomak | `oral_history` | `CC-BY-NC-4.0` | GR |
| 531 | [cZItz2uKXUo](https://www.youtube.com/watch?v=cZItz2uKXUo) | Venetian (`vec` / `vec`) | `vene1258` | Triestine | `oral_history` | `CC-BY-SA-4.0` | IT |
| 532 | [bwx4tkODJm8](https://www.youtube.com/watch?v=bwx4tkODJm8) | Palauan (`pau` / `pau`) | `pala1344` | None | `oral_history` | `CC-BY-NC-4.0` | PW |
| 533 | [yorpVTOyeSE](https://www.youtube.com/watch?v=yorpVTOyeSE) | Nepali (individual language) (`npi` / `ne`) | `nepa1254` | None | `conversation` | `ALL_RIGHTS_RESERVED` | NP |
| 534 | [c05NPQFxnlc](https://www.youtube.com/watch?v=c05NPQFxnlc) | Bhojpuri (`bho` / `bho`) | `bhoj1244` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 535 | [xMmfbZIIclw](https://www.youtube.com/watch?v=xMmfbZIIclw) | Portuguese (`por` / `pt-AO`) | `port1283` | Angolan Portuguese | `oral_history` | `CC-BY-NC-4.0` | AO |
| 536 | [5Uo-B9GaciQ](https://www.youtube.com/watch?v=5Uo-B9GaciQ) | Mirandese (`mwl` / `mwl`) | `mira1251` | None | `conversation` | `ALL_RIGHTS_RESERVED` | PT |
| 537 | [sPeI8MR9fCU](https://www.youtube.com/watch?v=sPeI8MR9fCU) | Spanish (`spa` / `es`) | `stan1288` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 538 | [bY8HBFwRE-w](https://www.youtube.com/watch?v=bY8HBFwRE-w) | Macedo-Romanian (`rup` / `rup`) | `arom1237` | Aromanian | `oral_history` | `ALL_RIGHTS_RESERVED` | AL |
| 539 | [_jJyzGnFfSE](https://www.youtube.com/watch?v=_jJyzGnFfSE) | Lombard (`lmo` / `lmo`) | `lomb1257` | None | `oral_history` | `CC-BY-NC-4.0` | IT |
| 540 | [QUoTxiFdOmY](https://www.youtube.com/watch?v=QUoTxiFdOmY) | Zarma (`dje` / `dje`) | `zarm1239` | None | `conversation` | `ALL_RIGHTS_RESERVED` | US |
| 541 | [NSczRqnBvFU](https://www.youtube.com/watch?v=NSczRqnBvFU) | Gheg Albanian (`aln` / `aln`) | `gheg1238` | None | `oral_history` | `CC-BY-NC-4.0` | AL |
| 542 | [k3x-2IhJwjo](https://www.youtube.com/watch?v=k3x-2IhJwjo) | Central Okinawan (`ryu` / `ryu`) | `cent2126` | None | `language_lesson` | `CC-BY-NC-4.0` | JP |
| 543 | [p1YqLLFxl4k](https://www.youtube.com/watch?v=p1YqLLFxl4k) | Khmu (`kjg` / `kjg`) | `khmu1256` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | LA |
| 544 | [I2sFAUpUhI0](https://www.youtube.com/watch?v=I2sFAUpUhI0) | Tibetan (`bod` / `bo`) | `tibe1272` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 545 | [qxXq9iP-CGw](https://www.youtube.com/watch?v=qxXq9iP-CGw) | Tunisian Arabic (`aeb` / `aeb`) | `tuni1259` | None | `oral_history` | `CC-BY-SA-4.0` | IT |
| 546 | [sNDAfGlc-4c](https://www.youtube.com/watch?v=sNDAfGlc-4c) | Guambiano (`gum` / `gum`) | `guam1248` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | CO |
| 547 | [ISFBfGJWiU8](https://www.youtube.com/watch?v=ISFBfGJWiU8) | Nepali (individual language) (`npi` / `ne`) | `nepa1254` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 548 | [SMy4jzw2W08](https://www.youtube.com/watch?v=SMy4jzw2W08) | Hungarian (`hun` / `hu-RO`) | `hung1274` | Csángó | `oral_history` | `CC-BY-NC-4.0` | RO |
| 549 | [Ui1fZPJ_Wr4](https://www.youtube.com/watch?v=Ui1fZPJ_Wr4) | Tonga (Tonga Islands) (`ton` / `to`) | `tong1325` | None | `conversation` | `CC-BY-NC-4.0` | AU |
| 550 | [MRjC-OyprJU](https://www.youtube.com/watch?v=MRjC-OyprJU) | Hebrew (`heb` / `he`) | `hebr1245` | None | `conversation` | `ALL_RIGHTS_RESERVED` | IL |
| 551 | [Mwgy2kuoBBU](https://www.youtube.com/watch?v=Mwgy2kuoBBU) | Swiss German (`gsw` / `gsw-CH`) | `swis1247` | None | `oral_history` | `CC-BY-NC-4.0` | CH |
| 552 | [xMaydZp_J30](https://www.youtube.com/watch?v=xMaydZp_J30) | Ladino (`lad` / `lad`) | `ladi1251` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GR |
| 553 | [z8eTwjQCCuA](https://www.youtube.com/watch?v=z8eTwjQCCuA) | Yucateco (`yua` / `yua`) | `yuca1254` | None | `oral_history` | `CC-BY-NC-4.0` | MX |
| 554 | [tFoIGW7FLUk](https://www.youtube.com/watch?v=tFoIGW7FLUk) | Jamaican Creole English (`jam` / `jam`) | `jama1262` | None | `conversation` | `CC-BY-NC-4.0` | US |
| 555 | [1w_SXQUCfsw](https://www.youtube.com/watch?v=1w_SXQUCfsw) | Eastern Yiddish (`ydd` / `yi`) | `east2295` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 556 | [wGVjEJfE2e8](https://www.youtube.com/watch?v=wGVjEJfE2e8) | Chavacano (`cbk` / `cbk`) | `chav1241` | None | `conversation` | `CC-BY-NC-4.0` | GB |
| 557 | [-UlCJviJ8MQ](https://www.youtube.com/watch?v=-UlCJviJ8MQ) | Portuguese (`por` / `pt-BR`) | `port1283` | None | `conversation` | `CC-BY-NC-4.0` | JP |
| 558 | [pmwUGyC-Hh0](https://www.youtube.com/watch?v=pmwUGyC-Hh0) | Malayalam (`mal` / `mal`) | `mala1464` | Beary Bashe | `oral_history` | `CC-BY-NC-4.0` | IN |
| 559 | [TPWT57Wuwac](https://www.youtube.com/watch?v=TPWT57Wuwac) | Tem (`kdh` / `kdh`) | `temm1241` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | TG |
| 560 | [oMeQ8llXq6o](https://www.youtube.com/watch?v=oMeQ8llXq6o) | Bakhtiari (`bqi` / `bqi`) | `bakh1245` | None | `oral_history` | `CC-BY-SA-4.0` | IT |
| 561 | [Bozt5oUv74w](https://www.youtube.com/watch?v=Bozt5oUv74w) | Nepal Bhasa (`new` / `new`) | `newa1246` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 562 | [VkeAbRwP-lY](https://www.youtube.com/watch?v=VkeAbRwP-lY) | Tajik (`tgk` / `tg`) | `taji1245` | None | `oral_history` | `CC-BY-NC-4.0` | US |
| 563 | [j48ZhSpCczs](https://www.youtube.com/watch?v=j48ZhSpCczs) | Dari (`prs` / `prs`) | `dari1249` | None | `oral_history` | `CC-BY-NC-4.0` | US |
| 564 | [5u4r0SUv10g](https://www.youtube.com/watch?v=5u4r0SUv10g) | Northern Uzbek (`uzn` / `uz`) | `nort2690` | None | `oral_history` | `CC-BY-NC-4.0` | US |
| 565 | [dHCf9k3u2IQ](https://www.youtube.com/watch?v=dHCf9k3u2IQ) | Sicilian (`scn` / `scn`) | `sici1248` | None | `conversation` | `CC-BY-NC-4.0` | IT |
| 566 | [192WARvBmLg](https://www.youtube.com/watch?v=192WARvBmLg) | Guyanese Creole English (`gyn` / `gyn`) | `creo1235` | None | `conversation` | `CC-BY-NC-4.0` | US |
| 567 | [1_dH403pqRU](https://www.youtube.com/watch?v=1_dH403pqRU) | German (`deu` / `de-US`) | `stan1295` | Texas German | `oral_history` | `CC-BY-NC-4.0` | US |
| 568 | [rUfeztn-xz0](https://www.youtube.com/watch?v=rUfeztn-xz0) | Portuguese (`por` / `pt-BR`) | `port1283` | None | `conversation` | `CC-BY-NC-4.0` | US |
| 569 | [qSTFLIgHQ5A](https://www.youtube.com/watch?v=qSTFLIgHQ5A) | Swedish (`swe` / `sv`) | `swed1254` | None | `conversation` | `ALL_RIGHTS_RESERVED` | GB |
| 570 | [MehharK-ZmA](https://www.youtube.com/watch?v=MehharK-ZmA) | Mirandese (`mwl` / `mwl`) | `mira1251` | None | `conversation` | `ALL_RIGHTS_RESERVED` | PT |
| 571 | [16uK2Gbyk2k](https://www.youtube.com/watch?v=16uK2Gbyk2k) | Haitian (`hat` / `ht`) | `hait1244` | None | `oral_history` | `CC-BY-NC-4.0` | US |
| 572 | [M1YFrwaQL1I](https://www.youtube.com/watch?v=M1YFrwaQL1I) | Hebrew (`heb` / `he`) | `hebr1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 573 | [UOZOR4sBEEY](https://www.youtube.com/watch?v=UOZOR4sBEEY) | Dari (`prs` / `prs`) | `dari1249` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | SE |
| 574 | [7l8wsBlSCpQ](https://www.youtube.com/watch?v=7l8wsBlSCpQ) | Halh Mongolian (`khk` / `mn`) | `halh1238` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | JP |
| 575 | [iXUwLs4kNvc](https://www.youtube.com/watch?v=iXUwLs4kNvc) | Igbo (`ibo` / `ig`) | `nucl1417` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 576 | [2IzpOFfd4Zs](https://www.youtube.com/watch?v=2IzpOFfd4Zs) | Kildin Sami (`sjd` / `sjd`) | `kild1236` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | RU |
| 577 | [MQasAsvyqfE](https://www.youtube.com/watch?v=MQasAsvyqfE) | Burmese (`mya` / `my`) | `nucl1310` | None | `oral_history` | `CC-BY-NC-4.0` | MM |
| 578 | [YTgDOQuuvdc](https://www.youtube.com/watch?v=YTgDOQuuvdc) | Bago-Kusuntu (`bqg` / `bqg`) | `bago1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | TG |
| 579 | [o9_h--Obpvw](https://www.youtube.com/watch?v=o9_h--Obpvw) | Filipino (`fil` / `fil`) | `fili1244` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | PH |
| 580 | [ofWA7ERRwzs](https://www.youtube.com/watch?v=ofWA7ERRwzs) | English (`eng` / `en-GB`) | `stan1293` | Cumbrian English | `oral_history` | `ALL_RIGHTS_RESERVED` | GB |
| 581 | [DcPu6zLpZoQ](https://www.youtube.com/watch?v=DcPu6zLpZoQ) | Mapudungun (`arn` / `arn`) | `mapu1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | CL |
| 582 | [Ms9kzKnXHA4](https://www.youtube.com/watch?v=Ms9kzKnXHA4) | French (`fra` / `fr-gallo`) | `gall1275` | Gallo | `oral_history` | `CC-BY-NC-4.0` | FR |
| 583 | [zUDEten_j9o](https://www.youtube.com/watch?v=zUDEten_j9o) | Twi (`twi` / `tw`) | `twii1234` | Asante Twi | `oral_history` | `CC-BY-SA-4.0` | IT |
| 584 | [G1ZIzrAxWbA](https://www.youtube.com/watch?v=G1ZIzrAxWbA) | Russian (`rus` / `ru`) | `russ1263` | None | `conversation` | `ALL_RIGHTS_RESERVED` | XK |
| 585 | [f5ah6REtNmg](https://www.youtube.com/watch?v=f5ah6REtNmg) | Spanish (`spa` / `es`) | `stan1288` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 586 | [MEe25QALOn0](https://www.youtube.com/watch?v=MEe25QALOn0) | Tojolabal (`toj` / `toj`) | `tojo1241` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | MX |
| 587 | [-kFzjAR-05M](https://www.youtube.com/watch?v=-kFzjAR-05M) | Guadeloupean Creole French (`gcf` / `gcf-MQ`) | `guad1242` | Martinican Creole | `oral_history` | `CC-BY-NC-4.0` | US |
| 588 | [YKURmilQeTk](https://www.youtube.com/watch?v=YKURmilQeTk) | Gheg Albanian (`aln` / `aln`) | `gheg1238` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | XK |
| 589 | [UyldsoCWcSE](https://www.youtube.com/watch?v=UyldsoCWcSE) | Cornish (`cor` / `kw`) | `corn1251` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GB |
| 590 | [hG5rMFqZ-XQ](https://www.youtube.com/watch?v=hG5rMFqZ-XQ) | Eastern Yiddish (`ydd` / `yi`) | `east2295` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 591 | [a0TKySIPH0E](https://www.youtube.com/watch?v=a0TKySIPH0E) | Haryanvi (`bgc` / `bgc`) | `hary1238` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 592 | [vistydJ8zRM](https://www.youtube.com/watch?v=vistydJ8zRM) | Buginese (`bug` / `bug`) | `bugi1244` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ID |
| 593 | [9pBU2VGlvB8](https://www.youtube.com/watch?v=9pBU2VGlvB8) | Spanish (`spa` / `es-UY`) | `stan1288` | Uruguayan Spanish | `oral_history` | `ALL_RIGHTS_RESERVED` | UY |
| 594 | [oxs3msgKZ_I](https://www.youtube.com/watch?v=oxs3msgKZ_I) | English (`eng` / `en-GB`) | `stan1293` | Scottish English | `reading_or_song` | `ALL_RIGHTS_RESERVED` | GB |
| 595 | [wFpaLd1Ddtk](https://www.youtube.com/watch?v=wFpaLd1Ddtk) | Lao (`lao` / `lo`) | `laoo1244` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | LA |
| 596 | [VnVR__nf0HI](https://www.youtube.com/watch?v=VnVR__nf0HI) | Sranan Tongo (`srn` / `srn`) | `sran1240` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | SR |
| 597 | [T8cLcztsDXY](https://www.youtube.com/watch?v=T8cLcztsDXY) | Plateau Malagasy (`plt` / `mg`) | `plat1254` | None | `oral_history` | `CC-BY-NC-4.0` | MG |
| 598 | [29euYj0k1Kk](https://www.youtube.com/watch?v=29euYj0k1Kk) | Breton (`bre` / `br`) | `bret1244` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | FR |
| 599 | [TmWrYi9qZrs](https://www.youtube.com/watch?v=TmWrYi9qZrs) | Wu Chinese (`wuu` / `wuu-CN`) | `wuch1236` | Linhainese | `oral_history` | `CC-BY-NC-4.0` | CN |
| 600 | [jOlXLLU2fgg](https://www.youtube.com/watch?v=jOlXLLU2fgg) | Kazakh (`kaz` / `kk`) | `kaza1248` | None | `conversation` | `ALL_RIGHTS_RESERVED` | CZ |
| 601 | [SZyN7kXmwLU](https://www.youtube.com/watch?v=SZyN7kXmwLU) | Bazigar (`bfr` / `bfr`) | `bazi1237` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 602 | [RJVqf4vz-rQ](https://www.youtube.com/watch?v=RJVqf4vz-rQ) | Portuguese (`por` / `pt-BR`) | `port1283` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | BR |
| 603 | [wjwQkOzzSAg](https://www.youtube.com/watch?v=wjwQkOzzSAg) | Northern Sami (`sme` / `se`) | `nort2671` | None | `oral_history` | `CC-BY-NC-4.0` | DE |
| 604 | [Hh0nDkWeI5w](https://www.youtube.com/watch?v=Hh0nDkWeI5w) | Bosnian (`bos` / `bs`) | `bosn1245` | None | `oral_history` | `CC-BY-NC-4.0` | BA |
| 605 | [WMXxcrFjY1o](https://www.youtube.com/watch?v=WMXxcrFjY1o) | Batak Toba (`bbc` / `bbc`) | `bata1289` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ID |
| 606 | [ozo3HCJVJEA](https://www.youtube.com/watch?v=ozo3HCJVJEA) | Saraiki (`skr` / `skr`) | `sera1259` | None | `oral_history` | `CC-BY-SA-4.0` | IN |
| 607 | [Iw-dUwsWyzs](https://www.youtube.com/watch?v=Iw-dUwsWyzs) | Spanish (`spa` / `es-UY`) | `stan1288` | Uruguayan Spanish | `oral_history` | `ALL_RIGHTS_RESERVED` | UY |
| 608 | [38mq_FwgCNs](https://www.youtube.com/watch?v=38mq_FwgCNs) | Finnish (`fin` / `fi`) | `finn1318` | None | `conversation` | `ALL_RIGHTS_RESERVED` | FI |
| 609 | [YbIyO-cMwhw](https://www.youtube.com/watch?v=YbIyO-cMwhw) | Eastern Tamang (`taj` / `taj`) | `east2347` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 610 | [5bYNuCOdd_Q](https://www.youtube.com/watch?v=5bYNuCOdd_Q) | Bengali (`ben` / `bn`) | `beng1280` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | BD |
| 611 | [7EJud2CMRyo](https://www.youtube.com/watch?v=7EJud2CMRyo) | Adamawa Fulfulde (`fub` / `ff`) | `adam1253` | None | `conversation` | `ALL_RIGHTS_RESERVED` | TW |
| 612 | [22HBqPN8Oco](https://www.youtube.com/watch?v=22HBqPN8Oco) | English (`eng` / `en`) | `stan1293` | None | `conversation` | `CC-BY-SA-4.0` | US |
| 613 | [oMDajMXC3fs](https://www.youtube.com/watch?v=oMDajMXC3fs) | Dutch (`nld` / `nl`) | `dutc1256` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | UY |
| 614 | [LmS0eUGBIrE](https://www.youtube.com/watch?v=LmS0eUGBIrE) | English (`eng` / `en-GB`) | `stan1293` | Scottish English | `oral_history` | `ALL_RIGHTS_RESERVED` | GB |
| 615 | [rJYH4xad_fE](https://www.youtube.com/watch?v=rJYH4xad_fE) | Panjabi (`pan` / `pa`) | `panj1256` | Puadhi Punjabi | `oral_history` | `CC-BY-SA-4.0` | IN |
| 616 | [m4l6NewVbes](https://www.youtube.com/watch?v=m4l6NewVbes) | Arbëreshë Albanian (`aae` / `sq-IT`) | `arbe1236` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IT |
| 617 | [gaUt3gTwwzU](https://www.youtube.com/watch?v=gaUt3gTwwzU) | Wu Chinese (`wuu` / `wuu-CN`) | `wuch1236` | Shanghainese | `oral_history` | `ALL_RIGHTS_RESERVED` | CN |
| 618 | [4iB0W72Bv0Y](https://www.youtube.com/watch?v=4iB0W72Bv0Y) | German (`deu` / `de-CH`) | `stan1295` | Swiss Standard German | `oral_history` | `ALL_RIGHTS_RESERVED` | CH |
| 619 | [hCwfqiqDLWw](https://www.youtube.com/watch?v=hCwfqiqDLWw) | Portuguese (`por` / `pt`) | `port1283` | None | `conversation` | `CC-BY-NC-4.0` | FR |
| 620 | [6gyKLNQH44I](https://www.youtube.com/watch?v=6gyKLNQH44I) | Venetian (`vec` / `vec`) | `vene1258` | None | `oral_history` | `CC-BY-NC-4.0` | CH |
| 621 | [iLtnCoAi5R4](https://www.youtube.com/watch?v=iLtnCoAi5R4) | Portuguese (`por` / `pt-BR`) | `port1283` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | UY |
| 622 | [SvlLbX3oyAk](https://www.youtube.com/watch?v=SvlLbX3oyAk) | Icelandic (`isl` / `is`) | `icel1247` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IS |
| 623 | [DIrFYr6WQi4](https://www.youtube.com/watch?v=DIrFYr6WQi4) | English (`eng` / `en-GB`) | `stan1293` | Scottish English | `reading_or_song` | `ALL_RIGHTS_RESERVED` | GB |
| 624 | [tZOsIs1wIBg](https://www.youtube.com/watch?v=tZOsIs1wIBg) | Wolof (`wol` / `wo`) | `nucl1347` | None | `conversation` | `ALL_RIGHTS_RESERVED` | CA |
| 625 | [zLaE0SmZdMo](https://www.youtube.com/watch?v=zLaE0SmZdMo) | Sea Island Creole English (`gul` / `gul-US`) | `gull1241` | Afro-Seminole Creole | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 626 | [9xl5oi4tEVw](https://www.youtube.com/watch?v=9xl5oi4tEVw) | Serbian (`srp` / `sr`) | `serb1264` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | RS |
| 627 | [1_2f6rnIybA](https://www.youtube.com/watch?v=1_2f6rnIybA) | Spanish (`spa` / `es-UY`) | `stan1288` | Uruguayan Spanish | `oral_history` | `ALL_RIGHTS_RESERVED` | UY |
| 628 | [3PZd-DmY_dE](https://www.youtube.com/watch?v=3PZd-DmY_dE) | Bengkala Sign Language (`bqy` / `bqy`) | `beng1239` | None | `sign_language` | `CC-BY-NC-4.0` | ID |
| 629 | [eyPtlVS09RQ](https://www.youtube.com/watch?v=eyPtlVS09RQ) | Cebaara Senoufo (`sef` / `sef`) | `ceba1235` | None | `conversation` | `ALL_RIGHTS_RESERVED` | CI |
| 630 | [fZmLy_Acth8](https://www.youtube.com/watch?v=fZmLy_Acth8) | Manggarai (`mqy` / `mqy`) | `mang1405` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ID |
| 631 | [i9WbGqPeY8k](https://www.youtube.com/watch?v=i9WbGqPeY8k) | Hungarian (`hun` / `hu`) | `hung1274` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | HU |
| 632 | [8v2n3lBibWk](https://www.youtube.com/watch?v=8v2n3lBibWk) | Dela-Oenale (`row` / `row`) | `dela1251` | None | `oral_history` | `CC-BY-NC-4.0` | ID |
| 633 | [5TiS3AkpeI0](https://www.youtube.com/watch?v=5TiS3AkpeI0) | Swabian (`swg` / `swg`) | `swab1242` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | DE |
| 634 | [1P6ygw-VKKo](https://www.youtube.com/watch?v=1P6ygw-VKKo) | Kinyarwanda (`kin` / `rw`) | `kiny1244` | None | `oral_history` | `CC-BY-NC-4.0` | RW |
| 635 | [oMbvC_siQyc](https://www.youtube.com/watch?v=oMbvC_siQyc) | Pennsylvania German (`pdc` / `pdc`) | `penn1240` | None | `conversation` | `ALL_RIGHTS_RESERVED` | US |
| 636 | [5ax900reMWM](https://www.youtube.com/watch?v=5ax900reMWM) | Hebrew (`heb` / `he`) | `hebr1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IL |
| 637 | [w_FJ_D1BVkI](https://www.youtube.com/watch?v=w_FJ_D1BVkI) | Piemontese (`pms` / `pms`) | `piem1238` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IT |
| 638 | [DGnbG3OhC5E](https://www.youtube.com/watch?v=DGnbG3OhC5E) | Crow (`cro` / `cro`) | `crow1244` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 639 | [_WN-6t58HdM](https://www.youtube.com/watch?v=_WN-6t58HdM) | Garifuna (`cab` / `cab`) | `gari1256` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | HN |
| 640 | [pI1feWHeUq4](https://www.youtube.com/watch?v=pI1feWHeUq4) | Ainu (Japan) (`ain` / `ain`) | `ainu1240` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | JP |
| 641 | [8n-c4DIqBuw](https://www.youtube.com/watch?v=8n-c4DIqBuw) | Minangkabau (`min` / `min`) | `mina1268` | None | `oral_history` | `CC-BY-NC-4.0` | ID |
| 642 | [Er4liSo00nA](https://www.youtube.com/watch?v=Er4liSo00nA) | Indonesian (`ind` / `id`) | `indo1316` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ID |
| 643 | [N_WS0_9PZgw](https://www.youtube.com/watch?v=N_WS0_9PZgw) | Arbëreshë Albanian (`aae` / `sq-IT`) | `arbe1236` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IT |
| 644 | [A2brIzxJvkM](https://www.youtube.com/watch?v=A2brIzxJvkM) | Friulian (`fur` / `fur`) | `friu1240` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IT |
| 645 | [ux9UuNoCruo](https://www.youtube.com/watch?v=ux9UuNoCruo) | Bavarian (`bar` / `bar`) | `bava1246` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GB |
| 646 | [Y-WNHB4FEZA](https://www.youtube.com/watch?v=Y-WNHB4FEZA) | Laz (`lzz` / `lzz`) | `lazz1240` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | TR |
| 647 | [Sra5evn--8c](https://www.youtube.com/watch?v=Sra5evn--8c) | Ladin (`lld` / `lld`) | `ladi1250` | Solandro | `oral_history` | `ALL_RIGHTS_RESERVED` | IT |
| 648 | [t5mO8vWRPo8](https://www.youtube.com/watch?v=t5mO8vWRPo8) | Mingrelian (`xmf` / `xmf`) | `ming1252` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GE |
| 649 | [xJat2lF9Aio](https://www.youtube.com/watch?v=xJat2lF9Aio) | Croatian (`hrv` / `hr`) | `croa1245` | None | `oral_history` | `CC-BY-NC-4.0` | HR |
| 650 | [HHjmbeH7iM8](https://www.youtube.com/watch?v=HHjmbeH7iM8) | Macedonian (`mkd` / `mk`) | `mace1250` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | MK |
| 651 | [Ph5MuSHtgS0](https://www.youtube.com/watch?v=Ph5MuSHtgS0) | Upper Sorbian (`hsb` / `hsb`) | `uppe1395` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | DE |
| 652 | [MfS4oDLBpp0](https://www.youtube.com/watch?v=MfS4oDLBpp0) | Belarusian (`bel` / `be`) | `bela1254` | None | `oral_history` | `CC-BY-NC-4.0` | BY |
| 653 | [LAnWWcSrTFU](https://www.youtube.com/watch?v=LAnWWcSrTFU) | Romansh (`roh` / `rm`) | `roma1326` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | CH |
| 654 | [3Ptre1OzsJ4](https://www.youtube.com/watch?v=3Ptre1OzsJ4) | Tosk Albanian (`als` / `als`) | `tosk1239` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | AL |
| 655 | [qH9Qp747MTA](https://www.youtube.com/watch?v=qH9Qp747MTA) | Latin (`lat` / `la`) | `lati1261` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IT |
| 656 | [y3RQlAZSNfk](https://www.youtube.com/watch?v=y3RQlAZSNfk) | Banjar (`bjn` / `bjn`) | `banj1239` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ID |
| 657 | [w8iwYaa41uo](https://www.youtube.com/watch?v=w8iwYaa41uo) | Giryama (`nyf` / `nyf`) | `giry1241` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | KE |
| 658 | [uizL1thcRXg](https://www.youtube.com/watch?v=uizL1thcRXg) | Swiss-French Sign Language (`ssr` / `ssr`) | `swis1241` | None | `sign_language` | `ALL_RIGHTS_RESERVED` | CH |
| 659 | [SSOxL2VRIeE](https://www.youtube.com/watch?v=SSOxL2VRIeE) | Batak Toba (`bbc` / `bbc`) | `bata1289` | None | `oral_history` | `CC-BY-NC-4.0` | ID |
| 660 | [RTr00PeXZ6I](https://www.youtube.com/watch?v=RTr00PeXZ6I) | Catalan (`cat` / `ca`) | `stan1289` | None | `conversation` | `ALL_RIGHTS_RESERVED` | IS |
| 661 | [q_EJdzfnPSg](https://www.youtube.com/watch?v=q_EJdzfnPSg) | Lithuanian (`lit` / `lt`) | `lith1251` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | LT |
| 662 | [vydhTL5SoIs](https://www.youtube.com/watch?v=vydhTL5SoIs) | Aymara (`aym` / `ay`) | `nucl1667` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | PH |
| 663 | [nQmB8u7aBZs](https://www.youtube.com/watch?v=nQmB8u7aBZs) | Slovenian (`slv` / `sl`) | `slov1268` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | SI |
| 664 | [eg0bYuuHzkI](https://www.youtube.com/watch?v=eg0bYuuHzkI) | Javanese (`jav` / `jv`) | `java1254` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ID |
| 665 | [-gnJtZFyzZA](https://www.youtube.com/watch?v=-gnJtZFyzZA) | Mirandese (`mwl` / `mwl`) | `mira1251` | None | `conversation` | `ALL_RIGHTS_RESERVED` | PT |
| 666 | [lxQjwbUiM9w](https://www.youtube.com/watch?v=lxQjwbUiM9w) | Lojban (`jbo` / `jbo`) | `lojb1234` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 667 | [qfKmOf3d0fc](https://www.youtube.com/watch?v=qfKmOf3d0fc) | Kochila Tharu (`thq` / `thq`) | `koch1247` | Kochila Tharu | `oral_history` | `ALL_RIGHTS_RESERVED` | NP |
| 668 | [H8t_snz8B5A](https://www.youtube.com/watch?v=H8t_snz8B5A) | Plateau Malagasy (`plt` / `mg`) | `plat1254` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | MG |
| 669 | [P2PYuwhtwro](https://www.youtube.com/watch?v=P2PYuwhtwro) | Cimbrian (`cim` / `cim`) | `cimb1238` | None | `conversation` | `ALL_RIGHTS_RESERVED` | IT |
| 670 | [eLX1KG3FnBg](https://www.youtube.com/watch?v=eLX1KG3FnBg) | Paraguayan Guaraní (`gug` / `gn`) | `para1311` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | PY |
| 671 | [321JX9QiME0](https://www.youtube.com/watch?v=321JX9QiME0) | Tsakonian (`tsd` / `tsd`) | `tsak1248` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GR |
| 672 | [JFp2hDgjIyM](https://www.youtube.com/watch?v=JFp2hDgjIyM) | Avaric (`ava` / `av`) | `avar1256` | None | `oral_history` | `CC-BY-NC-4.0` | RU |
| 673 | [EqvGJERHbOY](https://www.youtube.com/watch?v=EqvGJERHbOY) | Georgian (`kat` / `ka`) | `nucl1302` | None | `oral_history` | `CC-BY-NC-4.0` | CZ |
| 674 | [KBEQH7Ad7H8](https://www.youtube.com/watch?v=KBEQH7Ad7H8) | Russian (`rus` / `ru`) | `russ1263` | None | `conversation` | `CC-BY-NC-4.0` | CZ |
| 675 | [cYWddQLxdu4](https://www.youtube.com/watch?v=cYWddQLxdu4) | Chechen (`che` / `ce`) | `chec1245` | None | `oral_history` | `CC-BY-NC-4.0` | US |
| 676 | [b8WMfsLoUAo](https://www.youtube.com/watch?v=b8WMfsLoUAo) | Romagnol (`rgn` / `rgn`) | `roma1328` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IT |
| 677 | [mfprxIS-ANg](https://www.youtube.com/watch?v=mfprxIS-ANg) | German (`deu` / `de`) | `stan1295` | None | `oral_history` | `CC-BY-NC-4.0` | DE |
| 678 | [z_cAYz0Q5DI](https://www.youtube.com/watch?v=z_cAYz0Q5DI) | Vietnamese (`vie` / `vi`) | `viet1252` | None | `oral_history` | `CC-BY-NC-4.0` | VN |
| 679 | [Vbpr0ryoroA](https://www.youtube.com/watch?v=Vbpr0ryoroA) | Estonian (`est` / `et`) | `esto1258` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | XK |
| 680 | [SrLPH5590RU](https://www.youtube.com/watch?v=SrLPH5590RU) | Lakota (`lkt` / `lkt`) | `lako1247` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 681 | [Q6ici_SMBvM](https://www.youtube.com/watch?v=Q6ici_SMBvM) | Portuguese (`por` / `pt`) | `port1283` | None | `conversation` | `CC-BY-NC-4.0` | US |
| 682 | [8HAidhktzjU](https://www.youtube.com/watch?v=8HAidhktzjU) | Turkish (`tur` / `tr`) | `nucl1301` | None | `oral_history` | `CC-BY-NC-4.0` | TR |
| 683 | [1fBDgdfX4vk](https://www.youtube.com/watch?v=1fBDgdfX4vk) | Portuguese (`por` / `pt-BR`) | `port1283` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | BR |
| 684 | [ZrfoXAsPHD4](https://www.youtube.com/watch?v=ZrfoXAsPHD4) | Kalaallisut (`kal` / `kl`) | `kala1399` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 685 | [9Nl_ttQDYkQ](https://www.youtube.com/watch?v=9Nl_ttQDYkQ) | Uncoded languages (`mis` / `art-x-atlaans`) | - | None | `oral_history` | `CC-BY-NC-4.0` | ZA |
| 686 | [mCghaYzVDxw](https://www.youtube.com/watch?v=mCghaYzVDxw) | Hausa (`hau` / `ha`) | `haus1257` | None | `conversation` | `CC-BY-NC-4.0` | NE |
| 687 | [8i4EEb5QMgU](https://www.youtube.com/watch?v=8i4EEb5QMgU) | Latvian (`lav` / `lv`) | `latv1249` | None | `conversation` | `CC-BY-NC-4.0` | CZ |
| 688 | [kb3Xs56iCg8](https://www.youtube.com/watch?v=kb3Xs56iCg8) | North Azerbaijani (`azj` / `az`) | `nort2697` | None | `conversation` | `CC-BY-NC-4.0` | CZ |
| 689 | [vkheU0nXKKY](https://www.youtube.com/watch?v=vkheU0nXKKY) | Esperanto (`epo` / `eo`) | `espe1235` | None | `oral_history` | `CC-BY-NC-4.0` | CA |
| 690 | [fO0ZyO_Yk9I](https://www.youtube.com/watch?v=fO0ZyO_Yk9I) | Dimli (individual language) (`diq` / `diq`) | `diml1238` | None | `oral_history` | `CC-BY-NC-4.0` | TR |
| 691 | [buuGVrfI2jo](https://www.youtube.com/watch?v=buuGVrfI2jo) | Northeastern Thai (`tts` / `tts`) | `nort2741` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | TH |
| 692 | [fQOCFYGadcQ](https://www.youtube.com/watch?v=fQOCFYGadcQ) | Welsh (`cym` / `cy`) | `wels1247` | None | `oral_history` | `CC-BY-NC-4.0` | GB |
| 693 | [buK4KwQ2QcE](https://www.youtube.com/watch?v=buK4KwQ2QcE) | Scottish Gaelic (`gla` / `gd`) | `scot1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GB |
| 694 | [kho_Esw789Y](https://www.youtube.com/watch?v=kho_Esw789Y) | English (`eng` / `en-FJ`) | `stan1293` | Fiji English | `oral_history` | `ALL_RIGHTS_RESERVED` | FJ |
| 695 | [753D2NuKgKU](https://www.youtube.com/watch?v=753D2NuKgKU) | Kannada (`kan` / `kn`) | `nucl1305` | None | `oral_history` | `CC-BY-NC-4.0` | IN |
| 696 | [z3ou0vZj_80](https://www.youtube.com/watch?v=z3ou0vZj_80) | Mekeo (`mek` / `mek`) | `meke1243` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | FJ |
| 697 | [yiVuJhiTyrE](https://www.youtube.com/watch?v=yiVuJhiTyrE) | Fijian (`fij` / `fj`) | `fiji1243` | Kadavu Fijian | `oral_history` | `CC-BY-NC-4.0` | FJ |
| 698 | [rK43HXX2fS0](https://www.youtube.com/watch?v=rK43HXX2fS0) | Swahili (individual language) (`swh` / `sw`) | `swah1253` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | UG |
| 699 | [JUa_phPM77s](https://www.youtube.com/watch?v=JUa_phPM77s) | Welsh (`cym` / `cy`) | `wels1247` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GB |
| 700 | [_lTVSjRv10k](https://www.youtube.com/watch?v=_lTVSjRv10k) | Acoli (`ach` / `ach`) | `acol1236` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | UG |
| 701 | [qJVY25bli80](https://www.youtube.com/watch?v=qJVY25bli80) | Catalan (`cat` / `ca`) | `stan1289` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 702 | [M5alRFKK43Y](https://www.youtube.com/watch?v=M5alRFKK43Y) | Indonesian (`ind` / `id`) | `indo1316` | None | `oral_history` | `CC-BY-NC-4.0` | ID |
| 703 | [Z5B7eKSJHBQ](https://www.youtube.com/watch?v=Z5B7eKSJHBQ) | Gheg Albanian (`aln` / `aln`) | `gheg1238` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | XK |
| 704 | [dxtFwV5Es7k](https://www.youtube.com/watch?v=dxtFwV5Es7k) | Luo (Kenya and Tanzania) (`luo` / `luo`) | `luok1236` | None | `conversation` | `CC-BY-NC-4.0` | GB |
| 705 | [-TEtqv0RTew](https://www.youtube.com/watch?v=-TEtqv0RTew) | Danish (`dan` / `da`) | `dani1285` | None | `conversation` | `CC-BY-NC-4.0` | GB |
| 706 | [PaZqV91ybbM](https://www.youtube.com/watch?v=PaZqV91ybbM) | Swedish (`swe` / `sv`) | `swed1254` | Halländska | `oral_history` | `CC-BY-NC-4.0` | SE |
| 707 | [IvwbztWHe0I](https://www.youtube.com/watch?v=IvwbztWHe0I) | Ambonese Malay (`abs` / `abs`) | `ambo1250` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ID |
| 708 | [dDQLdHkhPTE](https://www.youtube.com/watch?v=dDQLdHkhPTE) | Macedo-Romanian (`rup` / `rup`) | `arom1237` | Aromanian | `oral_history` | `CC-BY-NC-4.0` | RO |
| 709 | [j6voxaLLoDw](https://www.youtube.com/watch?v=j6voxaLLoDw) | Sa (`sax` / `sax`) | `saaa1241` | None | `conversation` | `CC-BY-NC-4.0` | VU |
| 710 | [8IvBOcstwCU](https://www.youtube.com/watch?v=8IvBOcstwCU) | Eastern Huasteca Nahuatl (`nhe` / `nhe`) | `east2538` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 711 | [-7Ch2p6xPAM](https://www.youtube.com/watch?v=-7Ch2p6xPAM) | Nafusi (`jbn` / `jbn`) | `nafu1238` | Zuwara Berber | `oral_history` | `CC-BY-NC-4.0` | LY |
| 712 | [lhufdY1uT3k](https://www.youtube.com/watch?v=lhufdY1uT3k) | Argentine Sign Language (`aed` / `aed`) | `arge1236` | None | `sign_language` | `ALL_RIGHTS_RESERVED` | AR |
| 713 | [6QWwVtNHmuM](https://www.youtube.com/watch?v=6QWwVtNHmuM) | Cherokee (`chr` / `chr`) | `cher1273` | None | `oral_history` | `CC-BY-NC-4.0` | US |
| 714 | [Ribtybmtb3k](https://www.youtube.com/watch?v=Ribtybmtb3k) | Somali (`som` / `so`) | `soma1255` | None | `conversation` | `ALL_RIGHTS_RESERVED` | ES |
| 715 | [fvtbdq3WiyU](https://www.youtube.com/watch?v=fvtbdq3WiyU) | Welsh (`cym` / `cy`) | `wels1247` | None | `oral_history` | `CC-BY-NC-4.0` | GB |
| 716 | [9UaAyI-uI30](https://www.youtube.com/watch?v=9UaAyI-uI30) | Cornish (`cor` / `kw`) | `corn1251` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GB |
| 717 | [SGTGWJf4dWw](https://www.youtube.com/watch?v=SGTGWJf4dWw) | Yugoslavian Sign Language (`ysl` / `ysl`) | `yugo1238` | Kosovar Sign Language | `sign_language` | `ALL_RIGHTS_RESERVED` | XK |
| 718 | [rTLBhwuaq_M](https://www.youtube.com/watch?v=rTLBhwuaq_M) | Russian (`rus` / `ru`) | `russ1263` | None | `conversation` | `CC-BY-NC-4.0` | ES |
| 719 | [gH8m9Ubcbi0](https://www.youtube.com/watch?v=gH8m9Ubcbi0) | Spanish (`spa` / `es`) | `stan1288` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 720 | [9pBaJojzNOI](https://www.youtube.com/watch?v=9pBaJojzNOI) | Polish (`pol` / `pl`) | `poli1260` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | PL |
| 721 | [rPokZgAdXSo](https://www.youtube.com/watch?v=rPokZgAdXSo) | Scottish Gaelic (`gla` / `gd`) | `scot1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GB |
| 722 | [30CWWm0BcNs](https://www.youtube.com/watch?v=30CWWm0BcNs) | Spanish (`spa` / `es`) | `stan1288` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 723 | [pCfEViYa110](https://www.youtube.com/watch?v=pCfEViYa110) | Dehu (`dhv` / `dhv`) | `dehu1237` | None | `oral_history` | `CC-BY-NC-4.0` | NC |
| 724 | [p85oX1cewf4](https://www.youtube.com/watch?v=p85oX1cewf4) | Galician (`glg` / `gl`) | `gali1258` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 725 | [G5WqvFD-ELo](https://www.youtube.com/watch?v=G5WqvFD-ELo) | Mandarin Chinese (`cmn` / `zh`) | `mand1415` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | JP |
| 726 | [1JWnPIXkXeA](https://www.youtube.com/watch?v=1JWnPIXkXeA) | Lombard (`lmo` / `lmo`) | `lomb1257` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IT |
| 727 | [9on81ZtUf5A](https://www.youtube.com/watch?v=9on81ZtUf5A) | Levantine Arabic (`apc` / `apc`) | `nort3139` | Syrian Arabic | `oral_history` | `ALL_RIGHTS_RESERVED` | SY |
| 728 | [o6FUP_2RmcI](https://www.youtube.com/watch?v=o6FUP_2RmcI) | Swedish (`swe` / `sv`) | `swed1254` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | SE |
| 729 | [1uIg0COZE5A](https://www.youtube.com/watch?v=1uIg0COZE5A) | Fulah (`ful` / `ff`) | `fula1264` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GN |
| 730 | [rEJb7j61-es](https://www.youtube.com/watch?v=rEJb7j61-es) | Turkish (`tur` / `tr`) | `nucl1301` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | TR |
| 731 | [-NrSATT7Y7M](https://www.youtube.com/watch?v=-NrSATT7Y7M) | Bislama (`bis` / `bi`) | `bisl1239` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | VU |
| 732 | [cyhc6ddqdhc](https://www.youtube.com/watch?v=cyhc6ddqdhc) | Limburgan (`lim` / `li`) | `limb1263` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | NL |
| 733 | [o4R1-TLkxBs](https://www.youtube.com/watch?v=o4R1-TLkxBs) | Japanese (`jpn` / `ja`) | `nucl1643` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | JP |
| 734 | [zLTgmdLaQJ4](https://www.youtube.com/watch?v=zLTgmdLaQJ4) | Balkan Romani (`rmn` / `rmn`) | `balk1252` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | XK |
| 735 | [2asptk633iA](https://www.youtube.com/watch?v=2asptk633iA) | Serbian (`srp` / `sr`) | `serb1264` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | RS |
| 736 | [Rm9fBd0k1LY](https://www.youtube.com/watch?v=Rm9fBd0k1LY) | Lau (`llu` / `llu`) | `lauu1247` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | SB |
| 737 | [fMRTimDnx4A](https://www.youtube.com/watch?v=fMRTimDnx4A) | Tamil (`tam` / `ta`) | `tami1289` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IN |
| 738 | [zyup0YLKCvw](https://www.youtube.com/watch?v=zyup0YLKCvw) | Swahili (individual language) (`swh` / `sw`) | `swah1253` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | MZ |
| 739 | [osuIdwM0urk](https://www.youtube.com/watch?v=osuIdwM0urk) | Urdu (`urd` / `ur`) | `urdu1245` | None | `conversation` | `ALL_RIGHTS_RESERVED` | PK |
| 740 | [pFXjD9J-JE0](https://www.youtube.com/watch?v=pFXjD9J-JE0) | Fijian (`fij` / `fj`) | `fiji1243` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | FJ |
| 741 | [GZcV67w2o1g](https://www.youtube.com/watch?v=GZcV67w2o1g) | Marwari (India) (`rwr` / `rwr`) | `marw1260` | None | `conversation` | `ALL_RIGHTS_RESERVED` | IN |
| 742 | [9D2ZymNG4rE](https://www.youtube.com/watch?v=9D2ZymNG4rE) | Sena (`seh` / `seh`) | `nucl1396` | None | `conversation` | `ALL_RIGHTS_RESERVED` | MZ |
| 743 | [yIlm9CoOhPc](https://www.youtube.com/watch?v=yIlm9CoOhPc) | Esperanto (`epo` / `eo`) | `espe1235` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | TW |
| 744 | [sQXzn-H0kjY](https://www.youtube.com/watch?v=sQXzn-H0kjY) | Bosnian (`bos` / `bs`) | `bosn1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | XK |
| 745 | [CW8z9FeyOZ0](https://www.youtube.com/watch?v=CW8z9FeyOZ0) | Balkan Gagauz Turkish (`bgx` / `bgx`) | `balk1254` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | XK |
| 746 | [EP5QqODoeHw](https://www.youtube.com/watch?v=EP5QqODoeHw) | Scottish Gaelic (`gla` / `gd`) | `scot1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GB |
| 747 | [le3cBRlWSE8](https://www.youtube.com/watch?v=le3cBRlWSE8) | Scots (`sco` / `sco`) | `scot1243` | Doric Scots | `conversation` | `ALL_RIGHTS_RESERVED` | GB |
| 748 | [m0EwquC6wBU](https://www.youtube.com/watch?v=m0EwquC6wBU) | Scots (`sco` / `sco`) | `scot1243` | Shetlandic | `oral_history` | `ALL_RIGHTS_RESERVED` | GB |
| 749 | [8xVxOJCBPSw](https://www.youtube.com/watch?v=8xVxOJCBPSw) | Scottish Gaelic (`gla` / `gd`) | `scot1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GB |
| 750 | [9p-xnXddSy8](https://www.youtube.com/watch?v=9p-xnXddSy8) | Mapudungun (`arn` / `arn`) | `mapu1245` | None | `conversation` | `ALL_RIGHTS_RESERVED` | FR |
| 751 | [hwQbxuwXGhc](https://www.youtube.com/watch?v=hwQbxuwXGhc) | Scottish Gaelic (`gla` / `gd`) | `scot1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GB |
| 752 | [57m0PfhE68c](https://www.youtube.com/watch?v=57m0PfhE68c) | Bulgarian (`bul` / `bg`) | `bulg1262` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | BG |
| 753 | [674za6Yr3Po](https://www.youtube.com/watch?v=674za6Yr3Po) | Irish (`gle` / `ga`) | `iris1253` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IE |
| 754 | [mrnxCBfLHFQ](https://www.youtube.com/watch?v=mrnxCBfLHFQ) | Tsonga (`tso` / `ts`) | `tson1249` | Changana | `oral_history` | `ALL_RIGHTS_RESERVED` | MZ |
| 755 | [0GsYpjHWDis](https://www.youtube.com/watch?v=0GsYpjHWDis) | Spanish (`spa` / `es-AR`) | `stan1288` | Argentine Spanish | `conversation` | `ALL_RIGHTS_RESERVED` | AR |
| 756 | [PpNr0MgTAbY](https://www.youtube.com/watch?v=PpNr0MgTAbY) | Chuwabu (`chw` / `chw`) | `chuw1238` | None | `conversation` | `ALL_RIGHTS_RESERVED` | MZ |
| 757 | [Uq2x_P34bTQ](https://www.youtube.com/watch?v=Uq2x_P34bTQ) | Bengali (`ben` / `bn`) | `beng1280` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 758 | [E-ohZtbkyxI](https://www.youtube.com/watch?v=E-ohZtbkyxI) | Swedish (`swe` / `sv`) | `swed1254` | None | `conversation` | `CC-BY-NC-4.0` | LT |
| 759 | [72L2JsuGcH0](https://www.youtube.com/watch?v=72L2JsuGcH0) | Levantine Arabic (`apc` / `apc-LB`) | `nort3139` | Lebanese Arabic | `oral_history` | `ALL_RIGHTS_RESERVED` | LT |
| 760 | [8RyDKy_HUj0](https://www.youtube.com/watch?v=8RyDKy_HUj0) | Tsonga (`tso` / `ts`) | `tson1249` | Changana | `oral_history` | `ALL_RIGHTS_RESERVED` | JP |
| 761 | [IahmVXN7xEQ](https://www.youtube.com/watch?v=IahmVXN7xEQ) | Konkani (individual language) (`knn` / `knn`) | `konk1267` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 762 | [Kz6bU7RqIjc](https://www.youtube.com/watch?v=Kz6bU7RqIjc) | North Azerbaijani (`azj` / `az`) | `nort2697` | None | `conversation` | `CC-BY-NC-4.0` | AZ |
| 763 | [gygesoisNhw](https://www.youtube.com/watch?v=gygesoisNhw) | Gheg Albanian (`aln` / `aln`) | `gheg1238` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | XK |
| 764 | [CG0OnKUqziA](https://www.youtube.com/watch?v=CG0OnKUqziA) | Afrikaans (`afr` / `af`) | `afri1274` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ZA |
| 765 | [E-hVDqrQq6M](https://www.youtube.com/watch?v=E-hVDqrQq6M) | Telugu (`tel` / `te`) | `telu1262` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 766 | [DCNH-f-CC98](https://www.youtube.com/watch?v=DCNH-f-CC98) | English (`eng` / `en`) | `stan1293` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 767 | [-oarxcgzsXY](https://www.youtube.com/watch?v=-oarxcgzsXY) | North Efate (`llp` / `llp`) | `nort2836` | Nafasana | `oral_history` | `ALL_RIGHTS_RESERVED` | VU |
| 768 | [pqPtJM4ZRQE](https://www.youtube.com/watch?v=pqPtJM4ZRQE) | North Efate (`llp` / `llp`) | `nort2836` | Nakanamanga | `oral_history` | `ALL_RIGHTS_RESERVED` | VU |
| 769 | [RHJOlCbQbbU](https://www.youtube.com/watch?v=RHJOlCbQbbU) | Lingarak (`lgk` / `lgk`) | `ling1265` | Neverver | `conversation` | `ALL_RIGHTS_RESERVED` | VU |
| 770 | [H3g87x0nL1M](https://www.youtube.com/watch?v=H3g87x0nL1M) | Latvian (`lav` / `lv`) | `latv1249` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | LV |
| 771 | [mD24h-bbdMU](https://www.youtube.com/watch?v=mD24h-bbdMU) | Polish (`pol` / `pl`) | `poli1260` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | PL |
| 772 | [fMTSDqjcvEk](https://www.youtube.com/watch?v=fMTSDqjcvEk) | North Azerbaijani (`azj` / `az`) | `nort2697` | None | `oral_history` | `CC-BY-NC-4.0` | AZ |
| 773 | [_nZiBMOqcUU](https://www.youtube.com/watch?v=_nZiBMOqcUU) | Daakaka (`bpa` / `bpa`) | `daka1243` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | VU |
| 774 | [zXM5DJNZhFI](https://www.youtube.com/watch?v=zXM5DJNZhFI) | Urdu (`urd` / `ur`) | `urdu1245` | None | `conversation` | `CC-BY-NC-4.0` | NO |
| 775 | [Flo8cPtcg6o](https://www.youtube.com/watch?v=Flo8cPtcg6o) | Swiss German (`gsw` / `gsw-CH`) | `swis1247` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | CH |
| 776 | [4dfcO_bsB90](https://www.youtube.com/watch?v=4dfcO_bsB90) | Swedish (`swe` / `sv`) | `swed1254` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | SE |
| 777 | [P2vfi0HAaCU](https://www.youtube.com/watch?v=P2vfi0HAaCU) | Levantine Arabic (`apc` / `apc-SY`) | `nort3139` | Syrian Arabic | `oral_history` | `CC-BY-NC-4.0` | LT |
| 778 | [OFHx0-4wU38](https://www.youtube.com/watch?v=OFHx0-4wU38) | Maori (`mri` / `mi`) | `maor1246` | None | `conversation` | `ALL_RIGHTS_RESERVED` | NZ |
| 779 | [boFQzRB3OuQ](https://www.youtube.com/watch?v=boFQzRB3OuQ) | Occitan (post 1500) (`oci` / `oc-aran`) | `occi1239` | Aranese | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 780 | [DmvDD9kJipE](https://www.youtube.com/watch?v=DmvDD9kJipE) | Jamaican Creole English (`jam` / `jam`) | `jama1262` | None | `conversation` | `ALL_RIGHTS_RESERVED` | JM |
| 781 | [z_f7kpXW0tQ](https://www.youtube.com/watch?v=z_f7kpXW0tQ) | Korean (`kor` / `ko`) | `kore1280` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | KR |
| 782 | [nFLhxxsN7gQ](https://www.youtube.com/watch?v=nFLhxxsN7gQ) | Cebuano (`ceb` / `ceb`) | `cebu1242` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | PH |
| 783 | [mcqxSaoqQ3A](https://www.youtube.com/watch?v=mcqxSaoqQ3A) | Occitan (post 1500) (`oci` / `oc-aran`) | `occi1239` | Aranese | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 784 | [KwAvCpU-z-w](https://www.youtube.com/watch?v=KwAvCpU-z-w) | Spanish (`spa` / `es`) | `stan1288` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 785 | [UP3FhvITMX8](https://www.youtube.com/watch?v=UP3FhvITMX8) | English (`eng` / `en`) | `stan1293` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 786 | [eYwvcqHcKW8](https://www.youtube.com/watch?v=eYwvcqHcKW8) | Spanish (`spa` / `es`) | `stan1288` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 787 | [ZMfuNUWBlYE](https://www.youtube.com/watch?v=ZMfuNUWBlYE) | English (`eng` / `en`) | `stan1293` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 788 | [Oz0hBgB5ixs](https://www.youtube.com/watch?v=Oz0hBgB5ixs) | Min Nan Chinese (`nan` / `nan-MY`) | `minn1241` | Penang Hokkien | `oral_history` | `ALL_RIGHTS_RESERVED` | MY |
| 789 | [hVhqmUHKnqI](https://www.youtube.com/watch?v=hVhqmUHKnqI) | English (`eng` / `en`) | `stan1293` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 790 | [L2ST-UU6Ns8](https://www.youtube.com/watch?v=L2ST-UU6Ns8) | Thai (`tha` / `th`) | `thai1261` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | TH |
| 791 | [Ynx3JxV5U6I](https://www.youtube.com/watch?v=Ynx3JxV5U6I) | Esperanto (`epo` / `eo`) | `espe1235` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 792 | [tqftb3zad1o](https://www.youtube.com/watch?v=tqftb3zad1o) | English (`eng` / `en`) | `stan1293` | None | `conversation` | `ALL_RIGHTS_RESERVED` | US |
| 793 | [wdiVss0X6V0](https://www.youtube.com/watch?v=wdiVss0X6V0) | Catalan (`cat` / `ca-FR`) | `stan1289` | Northern Catalan | `oral_history` | `ALL_RIGHTS_RESERVED` | FR |
| 794 | [_IXEev5Z7ao](https://www.youtube.com/watch?v=_IXEev5Z7ao) | Occitan (post 1500) (`oci` / `oc-aran`) | `occi1239` | Aranese | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 795 | [suK34prc56o](https://www.youtube.com/watch?v=suK34prc56o) | Basque (`eus` / `eu`) | `basq1248` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 796 | [N0GY23080G0](https://www.youtube.com/watch?v=N0GY23080G0) | Yue Chinese (`yue` / `yue`) | `yuec1235` | Cantonese | `oral_history` | `ALL_RIGHTS_RESERVED` | CN |
| 797 | [r6xt8HZy1-k](https://www.youtube.com/watch?v=r6xt8HZy1-k) | Finnish (`fin` / `fi`) | `finn1318` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | FI |
| 798 | [2iu0f8GKFgQ](https://www.youtube.com/watch?v=2iu0f8GKFgQ) | English (`eng` / `en-ZA`) | `stan1293` | South African English | `oral_history` | `ALL_RIGHTS_RESERVED` | ZA |
| 799 | [jjiXgRO8qDw](https://www.youtube.com/watch?v=jjiXgRO8qDw) | Italian (`ita` / `it`) | `ital1282` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IT |
| 800 | [ZtXr7bckLyc](https://www.youtube.com/watch?v=ZtXr7bckLyc) | Shona (`sna` / `sn`) | `shon1251` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ZW |
| 801 | [B-qxGhkRojc](https://www.youtube.com/watch?v=B-qxGhkRojc) | Mandarin Chinese (`cmn` / `zh`) | `mand1415` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 802 | [pru-95YczT4](https://www.youtube.com/watch?v=pru-95YczT4) | Urdu (`urd` / `ur`) | `urdu1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | PK |
| 803 | [PUYoRT2EA5Q](https://www.youtube.com/watch?v=PUYoRT2EA5Q) | Cherokee (`chr` / `chr`) | `cher1273` | None | `conversation` | `ALL_RIGHTS_RESERVED` | US |
| 804 | [pdYpvY6Efos](https://www.youtube.com/watch?v=pdYpvY6Efos) | Occitan (post 1500) (`oci` / `oc-aran`) | `occi1239` | Aranese | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 805 | [Yxrq9zhgla8](https://www.youtube.com/watch?v=Yxrq9zhgla8) | Iranian Persian (`pes` / `fa`) | `west2369` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IR |
| 806 | [gV7XWdt72Vo](https://www.youtube.com/watch?v=gV7XWdt72Vo) | Galician (`glg` / `gl`) | `gali1258` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 807 | [z1Jfor9KJdE](https://www.youtube.com/watch?v=z1Jfor9KJdE) | Luxembourgish (`ltz` / `lb`) | `luxe1241` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | FR |
| 808 | [1tgBuR2dWh4](https://www.youtube.com/watch?v=1tgBuR2dWh4) | Zulu (`zul` / `zu`) | `zulu1248` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ZA |
| 809 | [T_8snLihxWs](https://www.youtube.com/watch?v=T_8snLihxWs) | Afrikaans (`afr` / `af`) | `afri1274` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ZA |
| 810 | [BIV7gCJRY0k](https://www.youtube.com/watch?v=BIV7gCJRY0k) | Serbian (`srp` / `sr`) | `serb1264` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | RS |
| 811 | [iCd5W4gwJsI](https://www.youtube.com/watch?v=iCd5W4gwJsI) | Sea Island Creole English (`gul` / `gul-US`) | `gull1241` | Gullah | `conversation` | `ALL_RIGHTS_RESERVED` | US |
| 812 | [AUtRgfFUCl8](https://www.youtube.com/watch?v=AUtRgfFUCl8) | Armenian (`hye` / `hy`) | `nucl1235` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | AM |
| 813 | [R4VeecQEbA0](https://www.youtube.com/watch?v=R4VeecQEbA0) | English (`eng` / `en`) | `stan1293` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 814 | [At6KGp45FdM](https://www.youtube.com/watch?v=At6KGp45FdM) | Armenian (`hye` / `hy`) | `nucl1235` | None | `conversation` | `ALL_RIGHTS_RESERVED` | AM |
| 815 | [L1jLUZXXYUc](https://www.youtube.com/watch?v=L1jLUZXXYUc) | English (`eng` / `en`) | `stan1293` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 816 | [lXR8P4dOmAU](https://www.youtube.com/watch?v=lXR8P4dOmAU) | English (`eng` / `en`) | `stan1293` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 817 | [1R5dPw4sYrE](https://www.youtube.com/watch?v=1R5dPw4sYrE) | Cajun French (`frc` / `frc`) | `caju1236` | Louisiana French | `conversation` | `ALL_RIGHTS_RESERVED` | US |
| 818 | [NM0DpalXJ8s](https://www.youtube.com/watch?v=NM0DpalXJ8s) | English (`eng` / `en`) | `stan1293` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 819 | [G0n970JRNII](https://www.youtube.com/watch?v=G0n970JRNII) | Cajun French (`frc` / `frc`) | `caju1236` | Louisiana French | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 820 | [Vg4cGwY-q2c](https://www.youtube.com/watch?v=Vg4cGwY-q2c) | Cajun French (`frc` / `frc`) | `caju1236` | Louisiana French | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 821 | [SWn1t4o0QC0](https://www.youtube.com/watch?v=SWn1t4o0QC0) | Kikuyu (`kik` / `ki`) | `kiku1240` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | KE |
| 822 | [0iVQwo-1hHM](https://www.youtube.com/watch?v=0iVQwo-1hHM) | English (`eng` / `en`) | `stan1293` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 823 | [3Ve8Gf5rAhA](https://www.youtube.com/watch?v=3Ve8Gf5rAhA) | English (`eng` / `en`) | `stan1293` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 824 | [9OkYYixgCes](https://www.youtube.com/watch?v=9OkYYixgCes) | German (`deu` / `de`) | `stan1295` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | DE |
| 825 | [Ki4W4QVm2Hk](https://www.youtube.com/watch?v=Ki4W4QVm2Hk) | Yue Chinese (`yue` / `yue`) | `yuec1235` | Cantonese | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 826 | [GaN884-JfB8](https://www.youtube.com/watch?v=GaN884-JfB8) | Polish (`pol` / `pl`) | `poli1260` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | PL |
| 827 | [nN4fDhAcGTM](https://www.youtube.com/watch?v=nN4fDhAcGTM) | Catalan (`cat` / `ca`) | `stan1289` | Mallorquí | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 828 | [M6ZdYNFo6gM](https://www.youtube.com/watch?v=M6ZdYNFo6gM) | Catalan (`cat` / `ca`) | `stan1289` | Mallorquí | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 829 | [xSaGl8fiiYk](https://www.youtube.com/watch?v=xSaGl8fiiYk) | Central Khmer (`khm` / `km`) | `cent1989` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | KH |
| 830 | [jBDZOm0HXO4](https://www.youtube.com/watch?v=jBDZOm0HXO4) | Portuguese (`por` / `pt-BR`) | `port1283` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | BR |
| 831 | [nqOtvem2dxs](https://www.youtube.com/watch?v=nqOtvem2dxs) | Levantine Arabic (`apc` / `apc-PS`) | `nort3139` | Palestinian Arabic | `conversation` | `ALL_RIGHTS_RESERVED` | PS |
| 832 | [M2xmsclh3UA](https://www.youtube.com/watch?v=M2xmsclh3UA) | Mandarin Chinese (`cmn` / `zh-TW`) | `mand1415` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | TW |
| 833 | [fk3Cq0mR6_4](https://www.youtube.com/watch?v=fk3Cq0mR6_4) | Norwegian Bokmål (`nob` / `nb`) | `norw1259` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 834 | [WQ4W-UqaaMo](https://www.youtube.com/watch?v=WQ4W-UqaaMo) | Central Nahuatl (`nhn` / `nhn`) | `cent2132` | None | `conversation` | `ALL_RIGHTS_RESERVED` | MX |
| 835 | [w9MvPytHDvk](https://www.youtube.com/watch?v=w9MvPytHDvk) | Lakota (`lkt` / `lkt`) | `lako1247` | None | `reading_or_song` | `ALL_RIGHTS_RESERVED` | US |
| 836 | [FxrCNf8utsE](https://www.youtube.com/watch?v=FxrCNf8utsE) | Finnish (`fin` / `fi`) | `finn1318` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 837 | [RCZF42aj2Po](https://www.youtube.com/watch?v=RCZF42aj2Po) | English (`eng` / `en`) | `stan1293` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 838 | [DbArjSCZvOQ](https://www.youtube.com/watch?v=DbArjSCZvOQ) | Mandarin Chinese (`cmn` / `zh`) | `mand1415` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 839 | [iWRrLD7H98s](https://www.youtube.com/watch?v=iWRrLD7H98s) | Portuguese (`por` / `pt-BR`) | `port1283` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | BR |
| 840 | [VgzHAbJjteQ](https://www.youtube.com/watch?v=VgzHAbJjteQ) | French (`fra` / `fr`) | `stan1290` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | FR |
| 841 | [vO87PpdQKV4](https://www.youtube.com/watch?v=vO87PpdQKV4) | Hebrew (`heb` / `he`) | `hebr1245` | None | `conversation` | `ALL_RIGHTS_RESERVED` | US |
| 842 | [cC50MO--CGQ](https://www.youtube.com/watch?v=cC50MO--CGQ) | Papantla Totonac (`top` / `top`) | `papa1238` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 843 | [CouHEysgsPo](https://www.youtube.com/watch?v=CouHEysgsPo) | German (`deu` / `de`) | `stan1295` | Hessian | `oral_history` | `ALL_RIGHTS_RESERVED` | DE |
| 844 | [P2jdy8NC-JU](https://www.youtube.com/watch?v=P2jdy8NC-JU) | Russian (`rus` / `ru`) | `russ1263` | None | `conversation` | `ALL_RIGHTS_RESERVED` | RU |
| 845 | [7zQSfU5HkUc](https://www.youtube.com/watch?v=7zQSfU5HkUc) | K'iche' (`quc` / `quc`) | `kich1262` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | GT |
| 846 | [4SR39iWfZdk](https://www.youtube.com/watch?v=4SR39iWfZdk) | Spanish (`spa` / `es`) | `stan1288` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 847 | [v2jD_SU9KZo](https://www.youtube.com/watch?v=v2jD_SU9KZo) | Aragonese (`arg` / `an`) | `arag1245` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | ES |
| 848 | [dpYIjR9C7G8](https://www.youtube.com/watch?v=dpYIjR9C7G8) | Cajun French (`frc` / `frc`) | `caju1236` | Louisiana French | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 849 | [I1VBzO_qOW4](https://www.youtube.com/watch?v=I1VBzO_qOW4) | Cajun French (`frc` / `frc`) | `caju1236` | Louisiana French | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 850 | [cDmQKPnee3s](https://www.youtube.com/watch?v=cDmQKPnee3s) | Cajun French (`frc` / `frc`) | `caju1236` | Louisiana French | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 851 | [OCMlX7MQHoU](https://www.youtube.com/watch?v=OCMlX7MQHoU) | Irish (`gle` / `ga`) | `iris1253` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IE |
| 852 | [KOIkaNWIj1k](https://www.youtube.com/watch?v=KOIkaNWIj1k) | Irish (`gle` / `ga`) | `iris1253` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | IE |
| 853 | [iwqT7jhBV8o](https://www.youtube.com/watch?v=iwqT7jhBV8o) | Irish (`gle` / `ga`) | `iris1253` | Munster Irish | `oral_history` | `ALL_RIGHTS_RESERVED` | IE |
| 854 | [BCs_nIJFEEg](https://www.youtube.com/watch?v=BCs_nIJFEEg) | Eastern Yiddish (`ydd` / `yi`) | `east2295` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 855 | [cvTeOdMGqAA](https://www.youtube.com/watch?v=cvTeOdMGqAA) | Eastern Yiddish (`ydd` / `yi`) | `east2295` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 856 | [Nouueq2Kkjw](https://www.youtube.com/watch?v=Nouueq2Kkjw) | Halh Mongolian (`khk` / `mn`) | `halh1238` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | MN |
| 857 | [z_JNfYC13uw](https://www.youtube.com/watch?v=z_JNfYC13uw) | Finnish (`fin` / `fi`) | `finn1318` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | FI |
| 858 | [jHVUpBr1Zes](https://www.youtube.com/watch?v=jHVUpBr1Zes) | Finnish (`fin` / `fi`) | `finn1318` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | FI |
| 859 | [9EpGvDIm71o](https://www.youtube.com/watch?v=9EpGvDIm71o) | Finnish (`fin` / `fi`) | `finn1318` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | FI |
| 860 | [m3yCiw1QLCQ](https://www.youtube.com/watch?v=m3yCiw1QLCQ) | Esperanto (`epo` / `eo`) | `espe1235` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 861 | [Zo9T3yxIFx0](https://www.youtube.com/watch?v=Zo9T3yxIFx0) | Esperanto (`epo` / `eo`) | `espe1235` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 862 | [Bo-ufiP9Lzg](https://www.youtube.com/watch?v=Bo-ufiP9Lzg) | Esperanto (`epo` / `eo`) | `espe1235` | None | `oral_history` | `ALL_RIGHTS_RESERVED` | US |
| 863 | [224yG7_SRsw](https://www.youtube.com/watch?v=224yG7_SRsw) | Mandarin Chinese (`cmn` / `cmn-CN`) | `mand1415` | Northeastern Mandarin | `oral_history` | `ALL_RIGHTS_RESERVED` | CN |
