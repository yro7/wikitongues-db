/**
 * YouTube Data API v3 Client
 *
 * Provides quota-efficient discovery and detailed metadata retrieval for
 * YouTube channel videos.
 */

export const WIKITONGUES_CHANNEL_ID = 'UCBgWgQyEb5eTzvh4lLcuipQ';

export interface RawVideoRecord {
  video_id: string;
  url: string;
  title: string;
  description: string;
  upload_date: string;
  timestamp: number;
  duration: number;
  view_count: number;
  like_count: number;
  tags: string[];
  channel_id: string;
  channel_title: string;
  subtitles_available: string[];
  automatic_captions_available: string[];
  thumbnail_url: string | null;
  extracted_at: string;
}

/**
 * Parses an ISO 8601 duration string (e.g. "PT19M42S", "PT1H2M3S") into total seconds.
 */
export function parseIso8601Duration(durationStr: string): number {
  if (!durationStr) return 0;
  const match = durationStr.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (!match) return 0;

  const days = parseInt(match[1] || '0', 10);
  const hours = parseInt(match[2] || '0', 10);
  const minutes = parseInt(match[3] || '0', 10);
  const seconds = parseInt(match[4] || '0', 10);

  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

/**
 * Retrieves the Uploads playlist ID for a channel.
 * Cost: 1 quota unit.
 */
export async function getUploadsPlaylistId(
  channelId: string = WIKITONGUES_CHANNEL_ID,
  apiKey: string
): Promise<string> {
  const url = new URL('https://www.googleapis.com/youtube/v3/channels');
  url.searchParams.set('id', channelId);
  url.searchParams.set('part', 'contentDetails');
  url.searchParams.set('key', apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API error (channels.list): HTTP ${res.status} - ${text}`);
  }

  const data: any = await res.json();
  const items = data.items || [];
  if (items.length === 0) {
    throw new Error(`Channel not found: ${channelId}`);
  }

  const uploads = items[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploads) {
    throw new Error(`Uploads playlist not found for channel: ${channelId}`);
  }

  return uploads;
}

export interface PlaylistFetchOptions {
  limit?: number;
  onPageFetched?: (count: number, totalEstimated?: number) => void;
}

/**
 * Fetches all video IDs from a playlist using pagination.
 * Cost: 1 quota unit per page of 50 items.
 */
export async function fetchPlaylistVideoIds(
  playlistId: string,
  apiKey: string,
  options: PlaylistFetchOptions = {}
): Promise<string[]> {
  const videoIds: string[] = [];
  let pageToken: string | undefined = undefined;

  do {
    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.set('playlistId', playlistId);
    url.searchParams.set('part', 'contentDetails');
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('key', apiKey);
    if (pageToken) {
      url.searchParams.set('pageToken', pageToken);
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`YouTube API error (playlistItems.list): HTTP ${res.status} - ${text}`);
    }

    const data: any = await res.json();
    const items = data.items || [];
    for (const item of items) {
      const vid = item?.contentDetails?.videoId;
      if (vid) {
        videoIds.push(vid);
        if (options.limit && videoIds.length >= options.limit) {
          return videoIds;
        }
      }
    }

    if (options.onPageFetched) {
      options.onPageFetched(videoIds.length, data.pageInfo?.totalResults);
    }

    pageToken = data.nextPageToken;
  } while (pageToken);

  return videoIds;
}

/**
 * Batches video IDs into chunks of size 50 and queries `videos.list`.
 * Cost: 1 quota unit per 50 videos.
 */
export async function fetchVideosDetails(
  videoIds: string[],
  apiKey: string,
  onBatchProgress?: (processed: number, total: number) => void
): Promise<RawVideoRecord[]> {
  const results: RawVideoRecord[] = [];
  const BATCH_SIZE = 50;

  for (let i = 0; i < videoIds.length; i += BATCH_SIZE) {
    const batch = videoIds.slice(i, i + BATCH_SIZE);
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.set('id', batch.join(','));
    url.searchParams.set('part', 'snippet,contentDetails,statistics,status');
    url.searchParams.set('key', apiKey);

    const res = await fetch(url.toString());
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`YouTube API error (videos.list): HTTP ${res.status} - ${text}`);
    }

    const data: any = await res.json();
    const items = data.items || [];

    for (const item of items) {
      const snippet = item.snippet || {};
      const contentDetails = item.contentDetails || {};
      const statistics = item.statistics || {};

      const publishedAt = snippet.publishedAt ? new Date(snippet.publishedAt) : new Date();
      const uploadDateStr = publishedAt.toISOString().slice(0, 10).replace(/-/g, '');
      const timestamp = Math.floor(publishedAt.getTime() / 1000);

      const thumbs = snippet.thumbnails || {};
      const bestThumb =
        thumbs.maxres?.url ||
        thumbs.standard?.url ||
        thumbs.high?.url ||
        thumbs.medium?.url ||
        thumbs.default?.url ||
        null;

      results.push({
        video_id: item.id,
        url: `https://www.youtube.com/watch?v=${item.id}`,
        title: (snippet.title || '').trim(),
        description: snippet.description || '',
        upload_date: uploadDateStr,
        timestamp,
        duration: parseIso8601Duration(contentDetails.duration || ''),
        view_count: parseInt(statistics.viewCount || '0', 10),
        like_count: parseInt(statistics.likeCount || '0', 10),
        tags: snippet.tags || [],
        channel_id: snippet.channelId || WIKITONGUES_CHANNEL_ID,
        channel_title: snippet.channelTitle || 'Wikitongues',
        subtitles_available: [],
        automatic_captions_available: [],
        thumbnail_url: bestThumb,
        extracted_at: new Date().toISOString(),
      });
    }

    if (onBatchProgress) {
      onBatchProgress(Math.min(i + BATCH_SIZE, videoIds.length), videoIds.length);
    }
  }

  return results;
}
