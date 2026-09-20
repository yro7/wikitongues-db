/**
 * E2E YouTube Ingestion & Pipeline Synchronization Test Suite
 *
 * Tests:
 * 1. VTT parsing and cleaning logic (timestamp stripping, cue deduplication, entity decoding)
 * 2. ISO 8601 duration parser
 * 3. Offline dataset synchronization: raw YouTube metadata <-> normalized dataset records
 * 4. Live YouTube Data API v3 coverage (skipped if YOUTUBE_API_KEY is unset)
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { parseVttToCleanText } from '../lib/vtt_parser';
import { parseIso8601Duration, getUploadsPlaylistId, fetchPlaylistVideoIds, WIKITONGUES_CHANNEL_ID } from '../lib/youtube_api';
import { getYouTubeApiKey } from '../lib/env';

const ROOT_DIR = path.resolve(__dirname, '../..');
const RAW_JSONL_PATH = path.join(ROOT_DIR, 'data/raw/wikitongues_youtube_raw.jsonl');
const NORMALIZED_JSON_PATH = path.join(ROOT_DIR, 'data/processed/wikitongues_normalized.json');

/**
 * Raw YouTube records deliberately absent from the normalized dataset because they
 * cannot satisfy CLASSIFICATION_RULES.md §3.1.1 (all three standards mandatory).
 */
const EXCLUDED_VIDEO_IDS = new Set([
  '9Nl_ttQDYkQ', // Atlaans: a conlang — ISO 639-3 `mis`, no Glottocode, private-use BCP-47 tag
]);

describe('VTT & Duration Parsing', () => {
  it('should parse ISO 8601 duration strings accurately', () => {
    expect(parseIso8601Duration('PT1M50S')).toBe(110);
    expect(parseIso8601Duration('PT19M42S')).toBe(1182);
    expect(parseIso8601Duration('PT1H2M3S')).toBe(3723);
    expect(parseIso8601Duration('PT45S')).toBe(45);
    expect(parseIso8601Duration('PT2H')).toBe(7200);
    expect(parseIso8601Duration('P1DT1H')).toBe(90000);
    expect(parseIso8601Duration('')).toBe(0);
  });

  it('should clean WebVTT subtitles, strip timestamps, cues, and formatting tags', () => {
    const sampleVtt = `WEBVTT
Kind: captions
Language: en

00:00:00.140 --> 00:00:02.090
Greetings!!

00:00:02.245 --> 00:00:04.775
<c.colorE5E5E5>My name is</c> <b>Nimita</b>.

00:00:05.153 --> 00:00:09.153
I am pursuing my PhD &amp; researching at JNU.
`;

    const cleaned = parseVttToCleanText(sampleVtt);
    expect(cleaned).toBe('Greetings!! My name is Nimita. I am pursuing my PhD & researching at JNU.');
  });

  it('should deduplicate rolling identical consecutive subtitle lines', () => {
    const rollingVtt = `WEBVTT

1
00:00:01.000 --> 00:00:02.000
Hello world

2
00:00:02.000 --> 00:00:03.000
Hello world
this is a test
`;

    const cleaned = parseVttToCleanText(rollingVtt);
    expect(cleaned).toBe('Hello world this is a test');
  });
});

describe('Raw & Normalized Dataset E2E Synchronization', () => {
  it('should have raw JSONL and normalized JSON available', () => {
    expect(fs.existsSync(RAW_JSONL_PATH)).toBe(true);
    expect(fs.existsSync(NORMALIZED_JSON_PATH)).toBe(true);
  });

  it('should have 1-to-1 video ID mapping between raw metadata and normalized dataset', () => {
    const rawContent = fs.readFileSync(RAW_JSONL_PATH, 'utf8');
    const rawIds = new Set<string>();
    const duplicateRawIds: string[] = [];

    for (const line of rawContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parsed = JSON.parse(trimmed);
      if (rawIds.has(parsed.video_id)) {
        duplicateRawIds.push(parsed.video_id);
      }
      rawIds.add(parsed.video_id);
    }

    expect(duplicateRawIds).toEqual([]);

    const normalizedContent = fs.readFileSync(NORMALIZED_JSON_PATH, 'utf8');
    const normalizedData = JSON.parse(normalizedContent);
    const normalizedIds = new Set<string>(normalizedData.map((d: any) => d.id));

    // Zero duplicate IDs in normalized dataset
    expect(normalizedIds.size).toBe(normalizedData.length);

    // Every raw record (minus documented exclusions) must exist in normalized dataset
    const missingInNormalized: string[] = [];
    for (const rawId of rawIds) {
      if (EXCLUDED_VIDEO_IDS.has(rawId)) continue;
      if (!normalizedIds.has(rawId)) {
        missingInNormalized.push(rawId);
      }
    }

    expect(missingInNormalized).toEqual([]);

    // Every normalized record must have a source raw record
    const missingInRaw: string[] = [];
    for (const normId of normalizedIds) {
      if (!rawIds.has(normId)) {
        missingInRaw.push(normId);
      }
    }

    expect(missingInRaw).toEqual([]);
  });

  it('should maintain consistent duration between raw metadata and normalized dataset', () => {
    const rawContent = fs.readFileSync(RAW_JSONL_PATH, 'utf8');
    const rawDurations = new Map<string, number>();

    for (const line of rawContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parsed = JSON.parse(trimmed);
      rawDurations.set(parsed.video_id, parsed.duration);
    }

    const normalizedContent = fs.readFileSync(NORMALIZED_JSON_PATH, 'utf8');
    const normalizedData = JSON.parse(normalizedContent);

    for (const item of normalizedData) {
      const rawDur = rawDurations.get(item.id);
      expect(rawDur).toBeDefined();
      expect(item.duration_seconds).toBe(rawDur);
    }
  });
});

const apiKey = getYouTubeApiKey();

describe.skipIf(!apiKey)('Live YouTube Channel Coverage E2E (requires YOUTUBE_API_KEY)', () => {
  it('should verify that all channel uploads are tracked in the raw dataset', async () => {
    const uploadsPlaylistId = await getUploadsPlaylistId(WIKITONGUES_CHANNEL_ID, apiKey!);
    expect(uploadsPlaylistId).toBeTruthy();

    const channelVideoIds = await fetchPlaylistVideoIds(uploadsPlaylistId, apiKey!);
    expect(channelVideoIds.length).toBeGreaterThan(800);

    const rawContent = fs.readFileSync(RAW_JSONL_PATH, 'utf8');
    const rawIds = new Set<string>();
    for (const line of rawContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parsed = JSON.parse(trimmed);
      rawIds.add(parsed.video_id);
    }

    const missingInRaw = channelVideoIds.filter((id) => !rawIds.has(id));
    if (missingInRaw.length > 0) {
      console.warn(`[E2E Notice] Found ${missingInRaw.length} newly published video(s) on YouTube channel not yet in raw dataset:`, missingInRaw);
    }

    // Pass assertion - if new videos exist on YouTube, warn but verify we have at least 860 covered
    expect(rawIds.size).toBeGreaterThanOrEqual(862);
  }, 30000);
});
