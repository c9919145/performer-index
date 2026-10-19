import type { Country, Performer, PerformerType } from "../types";
import { COUNTRIES } from "./countries";
import { BIO_SNIPPETS, NAME_FIRST, NAME_SECOND, NAME_SUFFIX } from "./names";

/**
 * Deterministic sample-data generator.
 *
 * Produces a stable, fictional dataset of performer profiles using a seeded
 * PRNG, so every dev/test run sees identical data. None of the generated
 * names or attributes correspond to real people. When authorized data is
 * available, replace `performers` with records loaded from the real data
 * store — the shape of `Performer` stays the same.
 */

/** mulberry32 – tiny seeded PRNG, good enough for sample data. */
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

const DATASET_SIZE = 1400;
const SEED = 20261019;

/** Roughly mirrors the reference's country distribution (US-heavy). */
const COUNTRY_WEIGHTS: Array<[string, number]> = [
  ["US", 0.62],
  ["CA", 0.04],
  ["GB", 0.05],
  ["BR", 0.05],
  ["MX", 0.03],
  ["CO", 0.02],
  ["DE", 0.03],
  ["FR", 0.02],
  ["ES", 0.02],
  ["IT", 0.02],
  ["NL", 0.015],
  ["SE", 0.015],
  ["RU", 0.02],
  ["UA", 0.02],
  ["PL", 0.01],
  ["JP", 0.02],
  ["AU", 0.015],
  ["AR", 0.015],
];

const TYPE_WEIGHTS: Array<[PerformerType, number]> = [
  ["porn-star", 0.5],
  ["amateur", 0.22],
  ["cam-girl", 0.18],
  ["erotic-model", 0.1],
];

function pickWeighted<T>(rng: () => number, table: Array<[T, number]>): T {
  const r = rng();
  let acc = 0;
  for (const [value, weight] of table) {
    acc += weight;
    if (r <= acc) return value;
  }
  return table[table.length - 1][0];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildDataset(): Performer[] {
  const rng = mulberry32(SEED);
  const now = Date.now();
  const DAY = 86_400_000;
  const usedSlugs = new Set<string>();
  const performers: Performer[] = [];

  for (let i = 0; i < DATASET_SIZE; i++) {
    const first = NAME_FIRST[Math.floor(rng() * NAME_FIRST.length)];
    const second = NAME_SECOND[Math.floor(rng() * NAME_SECOND.length)];
    const suffix = NAME_SUFFIX[Math.floor(rng() * NAME_SUFFIX.length)];
    let name = `${first} ${second}${suffix}`.trim();
    let slug = slugify(name);
    // Guarantee unique slugs
    let n = 2;
    while (usedSlugs.has(slug)) {
      slug = `${slugify(name)}-${n++}`;
    }
    usedSlugs.add(slug);
    name = name.replace(/\s+/g, " ");

    const country = countryPick(rng);
    const type = pickWeighted(rng, TYPE_WEIGHTS);

    // Log-ish distribution of video counts: many small, a few huge
    const videoCount = Math.max(
      1,
      Math.round(Math.pow(rng(), 2.2) * 2500 + rng() * 8),
    );

    // Subscriber metrics correlated with videoCount but noisy
    const base = Math.round(videoCount * (300 + rng() * 1400));
    const subscribersEver = Math.max(200, Math.round(base * (1 + rng())));
    const subscribersYear = Math.max(120, Math.round(base * (0.15 + rng() * 0.75)));
    const subscribers3Months = Math.max(
      40,
      Math.round(subscribersYear * (0.05 + rng() * 0.4)),
    );

    // Joined date within the last 6 years; ~12% within the last 3 months
    const joinedAt =
      now -
      Math.floor(
        (rng() < 0.12 ? rng() * 90 : 90 + rng() * (365 * 5)) * DAY,
      );

    performers.push({
      id: i + 1,
      slug,
      name,
      type,
      country,
      videoCount,
      subscribersYear,
      subscribersEver,
      subscribers3Months,
      joinedAt,
      avatarHue: Math.floor(rng() * 360),
      bio: BIO_SNIPPETS[Math.floor(rng() * BIO_SNIPPETS.length)],
    });
  }

  return performers;
}

function countryPick(rng: () => number): Country {
  const code = pickWeighted(
    rng,
    COUNTRY_WEIGHTS.map(([c, w]) => [c, w] as [string, number]),
  );
  return COUNTRIES.find((c) => c.code === code)!;
}

/** The full fictional sample dataset (generated once, deterministically). */
export const performers: Performer[] = buildDataset();
