import type { Video } from "../types";
import { performers } from "./performers";

/**
 * Deterministic sample-data generator for video metadata.
 *
 * Mirrors the approach in `performers.ts`: a seeded PRNG produces a stable,
 * fictional set of video records, so every dev/test run sees identical data.
 * No media files are referenced and no external URLs are produced — titles are
 * assembled from invented word fragments and thumbnails are rendered locally.
 *
 * When authorized data is available, replace `videos` / `getVideosForPerformer`
 * with records loaded from the real data store; the `Video` shape stays the same.
 */

/** mulberry32 – same tiny seeded PRNG used for the performer dataset. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEED = 20261020;
const DAY = 86_400_000;

/**
 * Max videos generated per performer. Profiles can have thousands of videos by
 * `videoCount` (a ranking metric), but rendering — and generating — that many
 * tiles would be absurd for a sample build, so the list is capped. The profile
 * page shows the capped list alongside the performer's true `videoCount`.
 */
export const MAX_VIDEOS_PER_PERFORMER = 24;

/**
 * Floor for the generated list, so even the smallest profile shows a populated
 * grid rather than a single tile.
 */
export const MIN_VIDEOS_PER_PERFORMER = 6;

const TITLE_OPENERS = [
  "First",
  "Late Night",
  "Backstage",
  "Summer",
  "Private",
  "Morning",
  "Weekend",
  "Studio",
  "Rooftop",
  "Midnight",
  "Golden Hour",
  "Downtown",
  "Neon",
  "Quiet",
  "Electric",
  "Velvet",
  "Paper",
  "Coastal",
  "Crimson",
  "Silver",
];

const TITLE_NOUNS = [
  "Session",
  "Interview",
  "Feature",
  "Story",
  "Showcase",
  "Reel",
  "Debut",
  "Special",
  "Moment",
  "Diary",
  "Scene",
  "Chapter",
  "Portrait",
  "Encore",
  "Take",
];

const TITLE_TAILS = [
  "Part One",
  "Part Two",
  "Uncut",
  "Behind the Scenes",
  "Director's Cut",
  "Extended",
  "Full Length",
  "Preview",
];

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** Formats seconds as `H:MM:SS` when an hour or longer, else `M:SS`. */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

/** Compact view counts, e.g. 1234 -> "1.2K", 1_450_000 -> "1.5M". */
export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return String(views);
}

function buildVideos(): Video[] {
  const rng = mulberry32(SEED);
  const now = Date.now();
  const videos: Video[] = [];

  for (const performer of performers) {
    // Longer-tenured, more prolific profiles get more entries. The floor is
    // deliberately well above 1 so every profile shows a populated grid rather
    // than a single lonely tile; the ceiling keeps generation and rendering
    // bounded. Both bounds are inclusive.
    const share = Math.min(1, performer.videoCount / 400);
    const count = Math.min(
      MAX_VIDEOS_PER_PERFORMER,
      Math.max(MIN_VIDEOS_PER_PERFORMER, Math.round(4 + rng() * MAX_VIDEOS_PER_PERFORMER * share)),
    );

    for (let i = 0; i < count; i++) {
      const title = `${pick(rng, TITLE_OPENERS)} ${pick(rng, TITLE_NOUNS)}${
        rng() < 0.45 ? " " + pick(rng, TITLE_TAILS) : ""
      }`;

      videos.push({
        id: `${performer.slug}-v${i + 1}`,
        performerSlug: performer.slug,
        title,
        // ~1 min to ~1 h 20 m, skewed short.
        durationSeconds: Math.round(60 + Math.pow(rng(), 1.7) * 4_700),
        views: Math.round(Math.pow(rng(), 1.8) * 4_000_000 + rng() * 500),
        publishedAt: now - Math.floor(rng() * 365 * 5 * DAY),
        thumbnailHue: Math.floor(rng() * 360),
      });
    }
  }

  return videos;
}

/** The full fictional video dataset (generated once, deterministically). */
export const videos: Video[] = buildVideos();

/**
 * Videos indexed by performer slug.
 *
 * `getVideosForPerformer` is called on every profile render, so a linear scan
 * of the whole dataset per call would be O(videos) repeated work. Build the
 * index lazily on first use (module init cost stays out of the critical path)
 * and sort each bucket once, descending by views.
 */
let videosByPerformer: Map<string, Video[]> | null = null;

function ensureIndex(): Map<string, Video[]> {
  if (videosByPerformer) return videosByPerformer;
  const index = new Map<string, Video[]>();
  for (const video of videos) {
    const bucket = index.get(video.performerSlug);
    if (bucket) bucket.push(video);
    else index.set(video.performerSlug, [video]);
  }
  for (const bucket of index.values()) {
    bucket.sort((a, b) => b.views - a.views);
  }
  videosByPerformer = index;
  return index;
}

/**
 * Videos for a performer, most-viewed first. Returns an empty array for an
 * unknown slug so callers don't need to null-check. Served from a prebuilt
 * index after the first call.
 */
export function getVideosForPerformer(slug: string): Video[] {
  return ensureIndex().get(slug) ?? [];
}
