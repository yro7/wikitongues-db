/**
 * Full-Text Search Engine with multi-field scoring and relevance ranking for Wikitongues records.
 */

import { Video } from './models';
import { normalizeText, LanguageResolver } from './resolver';
import { VideoCollection } from './collection';

export class SearchEngine {
  public readonly videos: readonly Video[];
  public readonly resolver?: LanguageResolver;

  constructor(videos: readonly Video[], resolver?: LanguageResolver) {
    this.videos = videos;
    this.resolver = resolver;
  }

  /**
   * Execute full-text search across all video metadata and rank results by score.
   */
  public search(
    query: string,
    limit?: number,
    minScore: number = 1.0
  ): VideoCollection {
    if (!query || !query.trim()) {
      return new VideoCollection([]);
    }

    const rawQuery = query.trim();
    const normQuery = normalizeText(rawQuery);
    const queryTokens = normQuery.split(/[\s,\-\./]+/).filter(Boolean);

    if (queryTokens.length === 0) {
      return new VideoCollection([]);
    }

    const candidateIsos = this.resolver
      ? this.resolver.resolve(rawQuery)
      : new Set<string>();

    const scoredResults: Array<{ score: number; video: Video }> = [];

    for (const video of this.videos) {
      const score = this.scoreVideo(
        video,
        rawQuery,
        normQuery,
        queryTokens,
        candidateIsos
      );
      if (score >= minScore) {
        scoredResults.push({ score, video });
      }
    }

    // Sort by score descending
    scoredResults.sort((a, b) => b.score - a.score);

    const filtered =
      limit !== undefined ? scoredResults.slice(0, limit) : scoredResults;

    return new VideoCollection(filtered.map((item) => item.video));
  }

  private scoreVideo(
    video: Video,
    rawQuery: string,
    normQuery: string,
    tokens: string[],
    candidateIsos: Set<string>
  ): number {
    let score = 0.0;

    // 1. Resolver candidate ISO match (exact linguistic match bonus)
    if (
      candidateIsos.size > 0 &&
      (candidateIsos.has(video.primaryLanguage.iso639_3.toLowerCase()) ||
        video.additionalLanguages.some((al) =>
          candidateIsos.has(al.iso639_3.toLowerCase())
        ))
    ) {
      score += 20.0;
    }

    // 2. Primary Language Fields
    const pl = video.primaryLanguage;
    const plNameNorm = normalizeText(pl.name);
    const plIso = pl.iso639_3.toLowerCase();
    const plBcp = pl.bcp47.toLowerCase();
    const plAuto = normalizeText(pl.autonym);
    const plDial = normalizeText(pl.dialect);

    if (normQuery === plNameNorm || normQuery === plIso || normQuery === plBcp) {
      score += 15.0;
    } else if (plNameNorm.includes(normQuery)) {
      score += 10.0;
    }

    if (
      plAuto &&
      (plAuto.includes(normQuery) ||
        (pl.autonym || '').toLowerCase().includes(rawQuery.toLowerCase()))
    ) {
      score += 12.0;
    }

    if (plDial && plDial.includes(normQuery)) {
      score += 10.0;
    }

    for (const token of tokens) {
      if (token.length > 2) {
        if (plNameNorm.includes(token)) score += 4.0;
        if (plDial.includes(token)) score += 3.0;
        if (plAuto.includes(token)) score += 3.0;
      }
    }

    // 3. Additional Languages
    for (const al of video.additionalLanguages) {
      const alName = normalizeText(al.name);
      const alIso = al.iso639_3.toLowerCase();
      if (normQuery === alName || normQuery === alIso) {
        score += 8.0;
      } else if (alName.includes(normQuery)) {
        score += 5.0;
      }
      for (const token of tokens) {
        if (token.length > 2 && alName.includes(token)) {
          score += 2.0;
        }
      }
    }

    // 4. Title Matching
    const titleNorm = normalizeText(video.title);
    if (titleNorm.includes(normQuery)) {
      score += 15.0;
    }
    let titleMatchedTokens = 0;
    for (const token of tokens) {
      if (token.length > 2 && titleNorm.includes(token)) {
        score += 6.0;
        titleMatchedTokens++;
      }
    }
    if (tokens.length > 1 && titleMatchedTokens === tokens.length) {
      score += 10.0;
    }

    // 5. Speaker Names & Roles
    for (const sp of video.speakers) {
      const spNorm = normalizeText(sp.name);
      if (spNorm && spNorm !== 'unknown') {
        if (normQuery === spNorm) {
          score += 10.0;
        } else if (spNorm.includes(normQuery)) {
          score += 6.0;
        }
        for (const token of tokens) {
          if (token.length > 2 && spNorm.includes(token)) {
            score += 3.0;
          }
        }
      }
      if (sp.role && normQuery === sp.role.toLowerCase()) {
        score += 4.0;
      }
    }

    // 6. Provenance (Country, Region, City)
    const cc = (video.countryCode || '').toLowerCase();
    const cname = normalizeText(video.countryName);
    const city = normalizeText(video.provenance.city);
    const region = normalizeText(video.provenance.region);

    if (normQuery === cc || normQuery === cname) {
      score += 8.0;
    } else if (
      (cname && cname.includes(normQuery)) ||
      (city && city.includes(normQuery)) ||
      (region && region.includes(normQuery))
    ) {
      score += 5.0;
    }
    for (const token of tokens) {
      if (token.length > 2) {
        if (cname && cname.includes(token)) score += 2.5;
        if (region && region.includes(token)) score += 2.0;
        if (city && city.includes(token)) score += 2.0;
      }
    }

    // 7. Tags & Content Type (Deduplicated per token)
    if (normQuery === video.contentType.toLowerCase()) {
      score += 4.0;
    }
    const allTagsCombined = video.tags.map(normalizeText).join(' ');
    if (normQuery && allTagsCombined.includes(normQuery)) {
      score += 4.0;
    }
    for (const token of tokens) {
      if (token.length > 2 && allTagsCombined.includes(token)) {
        score += 1.5;
      }
    }

    // 8. Token coverage bonus
    let matchedTokens = 0;
    const allText = `${titleNorm} ${plNameNorm} ${plDial} ${cname} ${video.tags
      .map(normalizeText)
      .join(' ')}`;
    for (const token of tokens) {
      if (allText.includes(token)) {
        matchedTokens++;
      }
    }
    if (tokens.length > 0 && matchedTokens === tokens.length) {
      score += 5.0;
    }

    return score;
  }
}
