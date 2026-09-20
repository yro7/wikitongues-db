/**
 * VTT and Subtitles Parser
 *
 * Cleans WebVTT / SRT subtitle transcripts:
 * - Strips headers, cue indices, and timestamp markers (-->)
 * - Removes inline styling tags (<c>, <b>, <i>, <v>, etc.) and inline timestamps
 * - Decodes HTML entities (&amp;, &#39;, etc.)
 * - Deduplicates rolling lines
 * - Produces clean prose paragraphs
 */

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

const BOILERPLATE_PATTERNS = [
  /amara\.org/i,
  /subtitles by/i,
  /this video is licensed/i,
  /help us caption/i,
  /creative commons attribution/i,
  /https?:\/\/\S+/i,
];

function isBoilerplateLine(line: string): boolean {
  return BOILERPLATE_PATTERNS.some((pattern) => pattern.test(line));
}

/**
 * Parses raw VTT or SRT content into clean, normalized plain text.
 */
export function parseVttToCleanText(vttContent: string): string {
  if (!vttContent || !vttContent.trim()) {
    return '';
  }

  const rawLines = vttContent.split(/\r?\n/);
  const cleanedLines: string[] = [];

  let inHeader = true;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    // Check for start of WebVTT
    if (inHeader) {
      if (
        line.startsWith('WEBVTT') ||
        line.startsWith('Kind:') ||
        line.startsWith('Language:') ||
        line.startsWith('NOTE') ||
        line.startsWith('STYLE') ||
        line.startsWith('REGION')
      ) {
        continue;
      }
      if (line === '') {
        // Empty line after header indicates end of header section
        inHeader = false;
        continue;
      }
      inHeader = false;
    }

    // Skip timestamp lines (e.g. 00:00:00.140 --> 00:00:02.090)
    if (line.includes('-->')) {
      continue;
    }

    // Skip standalone cue numbers / indices (numeric only lines preceding timestamps)
    if (/^\d+$/.test(line)) {
      // Look ahead to check if next line is a timestamp
      const nextLine = (rawLines[i + 1] || '').trim();
      if (nextLine.includes('-->')) {
        continue;
      }
    }

    // Strip inline formatting tags and inline karaoke timestamps
    let text = line
      .replace(/<[^>]+>/g, '') // remove <c>, </c>, <00:00:00.000>, etc.
      .trim();

    text = decodeHtmlEntities(text);

    if (!text) continue;

    // Filter out boilerplate lines (e.g. Amara credits, URLs, licensing)
    if (isBoilerplateLine(text)) {
      continue;
    }

    // Strip any stray URLs inside lines
    text = text.replace(/https?:\/\/\S+/gi, '').trim();
    if (!text) continue;

    // Deduplicate rolling identical consecutive lines
    const lastLine = cleanedLines[cleanedLines.length - 1];
    if (lastLine === text) {
      continue;
    }

    cleanedLines.push(text);
  }

  // Join lines with natural sentence flow
  return cleanedLines.join(' ').replace(/\s+/g, ' ').trim();
}
