/**
 * In-memory Inverted Index engine for Wikitongues Database.
 * Provides O(1) indexed lookups by ID, ISO 639-3, BCP 47, Glottocode (incl. parent language of dialects), Country, Speaker, License, etc.
 */

import { Video } from './models';
import { normalizeText } from './resolver';

export class DatasetIndex {
  public readonly videos: Video[];
  public readonly byId: Map<string, Video> = new Map();
  public readonly byIso: Map<string, Video[]> = new Map();
  public readonly byIsoPrimary: Map<string, Video[]> = new Map();
  public readonly byBcp47: Map<string, Video[]> = new Map();
  public readonly byGlottocode: Map<string, Video[]> = new Map();
  public readonly byCountryCode: Map<string, Video[]> = new Map();
  public readonly byCountryName: Map<string, Video[]> = new Map();
  public readonly bySpeakerRole: Map<string, Video[]> = new Map();
  public readonly bySpeakerName: Map<string, Video[]> = new Map();
  public readonly byContentType: Map<string, Video[]> = new Map();
  public readonly byLicense: Map<string, Video[]> = new Map();
  public readonly withSubtitles: Video[] = [];

  constructor(videos: Video[]) {
    this.videos = videos;
    this.buildIndices();
  }

  private appendToMap(map: Map<string, Video[]>, key: string, video: Video): void {
    const list = map.get(key);
    if (!list) {
      map.set(key, [video]);
    } else {
      list.push(video);
    }
  }

  private buildIndices(): void {
    for (const video of this.videos) {
      // 1. ID Index
      if (video.id) {
        this.byId.set(video.id, video);
      }

      // 2. ISO 639-3 Primary & All
      const plIso = video.primaryLanguage.iso639_3;
      if (plIso) {
        this.appendToMap(this.byIsoPrimary, plIso, video);
        this.appendToMap(this.byIso, plIso, video);
      }

      for (const addLang of video.additionalLanguages) {
        const aIso = addLang.iso639_3;
        if (aIso && aIso !== plIso) {
          this.appendToMap(this.byIso, aIso, video);
        }
      }

      // 3. BCP 47 Index
      for (const lang of video.allLanguages) {
        const bcp = lang.bcp47.toLowerCase().trim();
        if (bcp) {
          this.appendToMap(this.byBcp47, bcp, video);
          if (bcp.includes('-')) {
            const prefix = bcp.split('-')[0];
            this.appendToMap(this.byBcp47, prefix, video);
          }
        }
      }

      // 4. Glottocode Index (dialect nodes are also indexed under their parent language node)
      for (const lang of video.allLanguages) {
        this.appendToMap(this.byGlottocode, lang.glottocode, video);
        const parent = lang.standards.glottolog.parentLanguageId;
        if (parent) {
          this.appendToMap(this.byGlottocode, parent, video);
        }
      }

      // 5. Country Index (code & name)
      const cc = (video.provenance.countryCode || '').toUpperCase().trim();
      if (cc) {
        this.appendToMap(this.byCountryCode, cc, video);
        this.appendToMap(this.byCountryCode, cc.toLowerCase(), video);
      }

      const cname = video.provenance.countryName;
      if (cname) {
        const normCname = normalizeText(cname);
        this.appendToMap(this.byCountryName, normCname, video);
      }

      // 6. Speaker Index
      for (const sp of video.speakers) {
        if (sp.role) {
          this.appendToMap(this.bySpeakerRole, sp.role.toLowerCase(), video);
        }
        if (sp.name && sp.name.toLowerCase() !== 'unknown') {
          const normSp = normalizeText(sp.name);
          this.appendToMap(this.bySpeakerName, normSp, video);
        }
      }

      // 7. Content Type Index
      if (video.contentType) {
        this.appendToMap(this.byContentType, video.contentType.toLowerCase(), video);
      }

      // 8. License Index
      if (video.license) {
        this.appendToMap(this.byLicense, video.license, video);
      }

      // 9. Subtitles Index
      if (video.transcription.hasSubtitles) {
        this.withSubtitles.push(video);
      }
    }
  }
}
