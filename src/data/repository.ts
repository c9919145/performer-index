import type {
  DirectoryPage,
  DirectoryQuery,
  Performer,
  RankingMode,
} from "../types";
import { PER_PAGE } from "../types";
import { countryByToken, matchesGeoScope } from "./countries";
import { performers } from "./performers";

/**
 * Query layer for the performer directory.
 *
 * All search / filter / sort / pagination logic operates on the actual
 * dataset, not on UI state. To move to a real backend (PostgreSQL, SQLite or
 * an HTTP API), reimplement `queryDirectory` and `getPerformerBySlug` with
 * the same signatures — the UI does not need to change.
 */

const LETTER_RE = /^[A-Z]$/;

export function filterPerformers(q: DirectoryQuery): Performer[] {
  const country = countryByToken(q.countryToken);
  const geoToken = country ? country.token : "worldwide";
  const needle = q.q.trim().toLowerCase();
  const letter = q.letter && LETTER_RE.test(q.letter) ? q.letter : null;

  const filtered = performers.filter((p) => {
    if (!matchesGeoScope(p.country, geoToken)) return false;
    if (q.type !== "all" && p.type !== q.type) return false;
    if (letter && !p.name.toUpperCase().startsWith(letter)) return false;
    if (needle && !p.name.toLowerCase().includes(needle)) return false;
    return true;
  });

  return sortPerformers(filtered, q.ranking);
}

export function sortPerformers(
  list: Performer[],
  ranking: RankingMode,
): Performer[] {
  const sorted = [...list];
  switch (ranking) {
    case "subs-year":
      sorted.sort((a, b) => b.subscribersYear - a.subscribersYear);
      break;
    case "subs-ever":
      sorted.sort((a, b) => b.subscribersEver - a.subscribersEver);
      break;
    case "subs-3mo":
      sorted.sort((a, b) => b.subscribers3Months - a.subscribers3Months);
      break;
    case "newest":
      sorted.sort((a, b) => b.joinedAt - a.joinedAt);
      break;
    case "a-z":
      sorted.sort((a, b) =>
        a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
      );
      break;
  }
  return sorted;
}

/** Rank of a performer within the full dataset for a given ranking mode. */
export function globalRank(slug: string, ranking: RankingMode): number | null {
  const sorted = sortPerformers(performers, ranking);
  const idx = sorted.findIndex((p) => p.slug === slug);
  return idx === -1 ? null : idx + 1;
}

export function queryDirectory(q: DirectoryQuery): DirectoryPage {
  const filtered = filterPerformers(q);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const page = Math.min(Math.max(1, q.page), totalPages);
  const start = (page - 1) * PER_PAGE;
  return {
    items: filtered.slice(start, start + PER_PAGE),
    total,
    totalPages,
    page,
  };
}

export function getPerformerBySlug(slug: string): Performer | undefined {
  return performers.find((p) => p.slug === slug);
}

/** Letters that have at least one match for the given query minus letter. */
export function availableLetters(
  q: Omit<DirectoryQuery, "letter" | "page">,
): Set<string> {
  const base: DirectoryQuery = { ...q, letter: null, page: 1 };
  const set = new Set<string>();
  for (const p of filterPerformers(base)) {
    const l = p.name[0].toUpperCase();
    if (LETTER_RE.test(l)) set.add(l);
  }
  return set;
}

/** Total count of profiles in the directory (for the heading label). */
export function totalProfiles(): number {
  return performers.length;
}
