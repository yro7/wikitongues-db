/**
 * Excluded YouTube Recordings Registry.
 *
 * Authoritative list of raw YouTube video IDs deliberately omitted from the
 * normalized dataset because they cannot satisfy CLASSIFICATION_RULES.md §3.1.1
 * (mandatory ISO 639-3, Glottolog, and BCP-47 anchor standards) or are
 * non-linguistic / empty video placeholders.
 */

export const EXCLUDED_VIDEO_IDS = new Map<string, string>([
  ['9Nl_ttQDYkQ', 'Atlaans: conlang — ISO 639-3 `mis`, no Glottocode, private-use BCP-47 tag'],
  ['fGOqANPCndc', 'Empty livestream placeholder — 0s duration, no linguistic content'],
]);
