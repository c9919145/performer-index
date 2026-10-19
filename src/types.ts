/**
 * Domain types for the performer directory.
 *
 * The data layer is deliberately separated from the UI so that the sample
 * dataset used in development can later be swapped for an authorized,
 * production dataset (e.g. loaded from PostgreSQL/SQLite or an API) without
 * touching any components.
 */

export type PerformerType =
  | "porn-star"
  | "amateur"
  | "cam-girl"
  | "erotic-model";

export type RankingMode =
  | "subs-year" // subscribers gained over the last year (default)
  | "subs-ever" // subscribers all time
  | "subs-3mo" // subscribers over 3 months
  | "newest" // recently added profiles
  | "a-z"; // alphabetical

export interface Country {
  /** ISO 3166-1 alpha-2 code */
  code: string;
  /** Human readable name */
  name: string;
  /** URL token used in directory paths, e.g. "usa" */
  token: string;
}

export interface Performer {
  id: number;
  /** URL-safe identifier used in profile links */
  slug: string;
  name: string;
  type: PerformerType;
  country: Country;
  /** Total published videos */
  videoCount: number;
  /** Subscriber counts, used by the ranking filters */
  subscribersYear: number;
  subscribersEver: number;
  subscribers3Months: number;
  /** Epoch ms of profile creation, used by the "New Profiles" ranking */
  joinedAt: number;
  /** Deterministic hue used to render the placeholder avatar */
  avatarHue: number;
  /** Short fictional blurb shown on the profile page */
  bio: string;
}

/**
 * A single video entry attached to a performer profile.
 *
 * Fictional sample data: these are metadata records only. There is no media
 * file and no external URL — `thumbnailHue` feeds a locally rendered
 * placeholder tile, exactly like `Performer.avatarHue`.
 */
export interface Video {
  /** Stable identifier, unique per dataset */
  id: string;
  /** Slug of the owning performer */
  performerSlug: string;
  /** Fictional video title */
  title: string;
  /** Duration in seconds */
  durationSeconds: number;
  /** View count, used to order the profile's video list */
  views: number;
  /** Epoch ms of publication */
  publishedAt: number;
  /** Deterministic hue used to render the placeholder thumbnail */
  thumbnailHue: number;
}

export interface DirectoryQuery {
  /** Free-text search on performer name */
  q: string;
  /** Country token, "worldwide" for all countries */
  countryToken: string;
  /** Performer type filter, "all" for every type */
  type: PerformerType | "all";
  ranking: RankingMode;
  /** Uppercase letter A-Z, or null for all */
  letter: string | null;
  /** 1-based page number */
  page: number;
}

export interface DirectoryPage {
  items: Performer[];
  /** Total number of matching performers (across all pages) */
  total: number;
  /** Total number of pages for the current query */
  totalPages: number;
  /** Current 1-based page, clamped to the valid range */
  page: number;
}

export const PER_PAGE = 100;

export const TYPE_LABELS: Record<PerformerType, string> = {
  "porn-star": "Porn actress",
  amateur: "Amateur",
  "cam-girl": "Cam girl",
  "erotic-model": "Erotic model",
};

export const TYPE_FILTERS: Array<{
  value: PerformerType | "all";
  label: string;
}> = [
  { value: "all", label: "All model types" },
  { value: "porn-star", label: "Porn actresses" },
  { value: "amateur", label: "Amateurs" },
  { value: "cam-girl", label: "Cam girls" },
  { value: "erotic-model", label: "Erotic models" },
];

export const RANKING_FILTERS: Array<{ value: RankingMode; label: string }> = [
  { value: "subs-year", label: "Subscribers (1 year)" },
  { value: "subs-3mo", label: "Subscribers (3 months)" },
  { value: "subs-ever", label: "Subscribers (ever)" },
  { value: "newest", label: "New profiles" },
  { value: "a-z", label: "A-Z list" },
];
