import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type { DirectoryQuery, RankingMode, PerformerType } from "../types";
import {
  availableLetters,
  filterPerformers,
  queryDirectory,
} from "../data/repository";
import { FilterBar } from "../components/FilterBar";
import { AlphabetNav } from "../components/AlphabetNav";
import { PerformerCard } from "../components/PerformerCard";
import { Pagination } from "../components/Pagination";

/**
 * The USA performer directory page.
 *
 * All filter/search/sort/pagination state lives in the URL query string, so
 * it survives paging, refresh and sharing, and every control operates on the
 * real dataset via the repository layer.
 */
export function DirectoryPage() {
  const [params, setParams] = useSearchParams();
  const { country: pathCountry } = useParams<{ country: string }>();
  const pathToken = pathCountry ?? "usa";

  const query: DirectoryQuery = useMemo(
    () => ({
      q: params.get("q") ?? "",
      countryToken: params.get("country") ?? pathToken,
      type: (params.get("type") as PerformerType | "all") ?? "all",
      ranking: (params.get("ranking") as RankingMode) ?? "subs-year",
      letter: params.get("letter"),
      page: Number(params.get("page") ?? "1") || 1,
    }),
    [params, pathToken],
  );

  const result = useMemo(() => queryDirectory(query), [query]);
  const letters = useMemo(
    () =>
      availableLetters({
        q: query.q,
        countryToken: query.countryToken,
        type: query.type,
        ranking: query.ranking,
      }),
    [query.q, query.countryToken, query.type, query.ranking],
  );
  const searchCount = useMemo(
    () => filterPerformers({ ...query, letter: null, page: 1 }).length,
    [query],
  );

  function patch(next: Partial<DirectoryQuery>) {
    const merged = { ...query, ...next };
    const p = new URLSearchParams();
    if (merged.q) p.set("q", merged.q);
    if (merged.countryToken !== pathToken) p.set("country", merged.countryToken);
    if (merged.type !== "all") p.set("type", merged.type);
    if (merged.ranking !== "subs-year") p.set("ranking", merged.ranking);
    if (merged.letter) p.set("letter", merged.letter);
    if (merged.page > 1) p.set("page", String(merged.page));
    setParams(p, { replace: false });
    // Return focus/scroll to top of results for keyboard and screen reader users
    document.getElementById("directory-results")?.scrollIntoView?.({
      behavior: "auto",
      block: "start",
    });
  }

  const rankOf = new Map<string, number>();
  result.items.forEach((p, i) => rankOf.set(p.slug, (result.page - 1) * 100 + i + 1));

  return (
    <main id="main" className="mx-auto max-w-page px-3">
      <FilterBar
        query={query}
        total={searchCount}
        onChange={patch}
      />

      <h5 className="rounded-sm bg-chrome px-3 py-2 text-[13px] text-ink-soft">
        {query.ranking === "a-z"
          ? "This list is sorted alphabetically by performer name."
          : "The rankings on this page are based on American visitors and American models."}
      </h5>

      <AlphabetNav
        value={query.letter}
        available={letters}
        onChange={(letter) => patch({ letter, page: 1 })}
      />

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        onChange={(page) => patch({ page })}
        label="Top pagination"
      />

      <div id="directory-results" aria-live="polite">
        {result.items.length === 0 ? (
          <div className="rounded-sm border border-chrome-line bg-chrome px-4 py-10 text-center">
            <p className="text-base font-semibold text-ink">
              No performers found
            </p>
            <p className="mt-1 text-[13px] text-ink-soft">
              {query.q
                ? `Nothing matches “${query.q}”. `
                : "Try removing some filters. "}
              You can also clear all filters to start over.
            </p>
            <button
              type="button"
              className="xv-btn mt-3"
              onClick={() =>
                patch({ q: "", type: "all", ranking: "subs-year", letter: null, page: 1 })
              }
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mozaique grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {result.items.map((p) => (
              <PerformerCard
                key={p.slug}
                performer={p}
                rank={query.ranking === "a-z" ? null : rankOf.get(p.slug) ?? null}
              />
            ))}
          </div>
        )}
      </div>

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        onChange={(page) => patch({ page })}
        label="Bottom pagination"
      />
    </main>
  );
}
