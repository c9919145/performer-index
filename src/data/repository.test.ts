import { describe, expect, it } from "vitest";
import {
  availableLetters,
  filterPerformers,
  getPerformerBySlug,
  queryDirectory,
  sortPerformers,
  totalProfiles,
} from "./repository";
import { performers } from "./performers";
import type { DirectoryQuery } from "../types";
import { PER_PAGE } from "../types";

const base: DirectoryQuery = {
  q: "",
  countryToken: "usa",
  type: "all",
  ranking: "subs-year",
  letter: null,
  page: 1,
};

describe("dataset", () => {
  it("generates the expected number of fictional profiles", () => {
    expect(totalProfiles()).toBe(1400);
    expect(performers.length).toBe(1400);
  });

  it("has unique slugs", () => {
    const slugs = new Set(performers.map((p) => p.slug));
    expect(slugs.size).toBe(performers.length);
  });
});

describe("filtering", () => {
  it("restricts to USA by default", () => {
    const result = filterPerformers(base);
    expect(result.length).toBeGreaterThan(0);
    for (const p of result) expect(p.country.code).toBe("US");
  });

  it("worldwide includes every country", () => {
    const result = filterPerformers({ ...base, countryToken: "worldwide" });
    const countries = new Set(result.map((p) => p.country.code));
    expect(countries.size).toBeGreaterThan(1);
  });

  it("filters by performer type", () => {
    const result = filterPerformers({ ...base, type: "cam-girl" });
    for (const p of result) expect(p.type).toBe("cam-girl");
    expect(result.length).toBeGreaterThan(0);
  });

  it("searches by name (case-insensitive substring)", () => {
    const probe = performers.find((p) => p.country.code === "US")!;
    const needle = probe.name.split(" ")[0];
    const result = filterPerformers({ ...base, q: needle.toLowerCase() });
    expect(result.length).toBeGreaterThan(0);
    for (const p of result)
      expect(p.name.toLowerCase()).toContain(needle.toLowerCase());
  });

  it("filters by first letter", () => {
    const result = filterPerformers({ ...base, letter: "A" });
    for (const p of result) expect(p.name.startsWith("A")).toBe(true);
  });

  it("returns empty for a query with no matches", () => {
    const result = filterPerformers({ ...base, q: "zzz-no-such-name-zzz" });
    expect(result).toEqual([]);
  });
});

describe("sorting", () => {
  it("sorts by yearly subscribers descending", () => {
    const result = filterPerformers({ ...base, countryToken: "worldwide" });
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].subscribersYear).toBeGreaterThanOrEqual(
        result[i].subscribersYear,
      );
    }
  });

  it("sorts a-z case-insensitively", () => {
    const result = sortPerformers(performers, "a-z");
    for (let i = 1; i < result.length; i++) {
      expect(
        result[i - 1].name.localeCompare(result[i].name, "en", {
          sensitivity: "base",
        }),
      ).toBeLessThanOrEqual(0);
    }
  });

  it("sorts newest first", () => {
    const result = filterPerformers({ ...base, ranking: "newest" });
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].joinedAt).toBeGreaterThanOrEqual(result[i].joinedAt);
    }
  });
});

describe("pagination", () => {
  it("returns at most PER_PAGE items", () => {
    const page = queryDirectory(base);
    expect(page.items.length).toBeLessThanOrEqual(PER_PAGE);
    expect(page.total).toBeGreaterThan(PER_PAGE);
    expect(page.totalPages).toBe(Math.ceil(page.total / PER_PAGE));
  });

  it("pages do not overlap", () => {
    const p1 = queryDirectory({ ...base, page: 1 });
    const p2 = queryDirectory({ ...base, page: 2 });
    const s1 = new Set(p1.items.map((p) => p.slug));
    for (const p of p2.items) expect(s1.has(p.slug)).toBe(false);
  });

  it("clamps out-of-range pages", () => {
    const page = queryDirectory({ ...base, page: 99999 });
    expect(page.page).toBe(page.totalPages);
    const low = queryDirectory({ ...base, page: -3 });
    expect(low.page).toBe(1);
  });
});

describe("lookups", () => {
  it("finds performers by slug", () => {
    const p = performers[10];
    expect(getPerformerBySlug(p.slug)?.id).toBe(p.id);
  });

  it("returns undefined for unknown slug", () => {
    expect(getPerformerBySlug("no-such-performer")).toBeUndefined();
  });

  it("reports available letters for the current filters", () => {
    const letters = availableLetters({
      q: "",
      countryToken: "usa",
      type: "all",
      ranking: "subs-year",
    });
    expect(letters.size).toBeGreaterThan(5);
    expect(letters.has("A")).toBe(true);
  });
});
