import type { DirectoryQuery, RankingMode, PerformerType } from "../types";
import { RANKING_FILTERS, TYPE_FILTERS } from "../types";
import { GEO_FILTERS } from "../data/countries";
import { Dropdown, DropdownItem } from "./Dropdown";

/**
 * The reference's "ordered-label-list" filter bar:
 * a bold count label plus three dropdown filters (geo scope, model type,
 * ranking). Every selection writes to the URL-driven query state so filters
 * survive pagination and are shareable.
 */
export function FilterBar({
  query,
  total,
  onChange,
}: {
  query: DirectoryQuery;
  total: number;
  onChange: (patch: Partial<DirectoryQuery>) => void;
}) {
  const geo =
    GEO_FILTERS.find((g) => g.token === query.countryToken)?.label ??
    "Worldwide Models";
  const type =
    TYPE_FILTERS.find((t) => t.value === query.type)?.label ??
    "All model types";
  const ranking =
    RANKING_FILTERS.find((r) => r.value === query.ranking)?.label ?? "Ranking";

  const hasFilters =
    query.q !== "" ||
    query.type !== "all" ||
    query.ranking !== "subs-year" ||
    query.letter !== null ||
    query.countryToken !== "usa";

  return (
    <div className="ordered-label-list">
      <ul className="flex flex-wrap items-center gap-2 py-3">
        <li>
          <strong className="inline-flex items-center rounded-sm border border-chrome-line bg-chrome px-2.5 py-1.5 text-[13px] font-bold leading-none text-ink">
            Top {total.toLocaleString("en-US")} performers, models, and cam girls
          </strong>
        </li>
        <li className="ml-auto flex flex-wrap items-center gap-2">
          <Dropdown label={`${geo} ▾`}>
            {(close) => (
              <>
                {GEO_FILTERS.map((g) => (
                  <DropdownItem
                    key={g.token}
                    active={g.token === query.countryToken}
                    onSelect={() => {
                      onChange({ countryToken: g.token, page: 1 });
                      close();
                    }}
                  >
                    {g.label}
                  </DropdownItem>
                ))}
              </>
            )}
          </Dropdown>

          <Dropdown label={`${type} ▾`}>
            {(close) => (
              <>
                {TYPE_FILTERS.map((t) => (
                  <DropdownItem
                    key={t.value}
                    active={t.value === query.type}
                    onSelect={() => {
                      onChange({ type: t.value as PerformerType | "all", page: 1 });
                      close();
                    }}
                  >
                    {t.label}
                  </DropdownItem>
                ))}
              </>
            )}
          </Dropdown>

          <Dropdown label={`${ranking} ▾`}>
            {(close) => (
              <>
                {RANKING_FILTERS.map((r) => (
                  <DropdownItem
                    key={r.value}
                    active={r.value === query.ranking}
                    onSelect={() => {
                      onChange({ ranking: r.value as RankingMode, page: 1 });
                      close();
                    }}
                  >
                    {r.label}
                  </DropdownItem>
                ))}
              </>
            )}
          </Dropdown>

          {hasFilters && (
            <button
              type="button"
              className="xv-btn text-ink-soft"
              onClick={() =>
                onChange({
                  q: "",
                  type: "all",
                  ranking: "subs-year",
                  letter: null,
                  countryToken: "usa",
                  page: 1,
                })
              }
            >
              Clear filters ✕
            </button>
          )}
        </li>
      </ul>
    </div>
  );
}
