/**
 * Numbered pagination with ellipsis, matching the reference's style
 * (numbered pages + "..." + last page + Next). A mirrored "Previous" control
 * is included for accessibility and mobile use.
 */

function pageList(current: number, totalPages: number): Array<number | "…"> {
  const pages = new Set<number>([1, totalPages, current]);
  for (let d = 1; d <= 2; d++) {
    if (current - d >= 1) pages.add(current - d);
    if (current + d <= totalPages) pages.add(current + d);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const out: Array<number | "…"> = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export function Pagination({
  page,
  totalPages,
  onChange,
  label,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  label: string;
}) {
  if (totalPages <= 1) return null;
  const items = pageList(page, totalPages);

  return (
    <nav aria-label={label} className="pagination py-3">
      <ul className="flex flex-wrap items-center gap-1 text-[13px]">
        <li>
          <button
            type="button"
            className="xv-btn"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            aria-label="Previous page"
          >
            <span aria-hidden="true">‹</span> Prev
          </button>
        </li>
        {items.map((item, i) =>
          item === "…" ? (
            <li key={`gap-${i}`} className="px-1 text-ink-faint" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
                onClick={() => onChange(item)}
                className={`min-w-[30px] rounded-sm border px-2 py-1.5 font-semibold leading-none transition-colors ${
                  item === page
                    ? "border-chrome-dark bg-chrome-dark text-white"
                    : "border-chrome-line bg-white text-ink hover:border-accent hover:text-accent"
                }`}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            className="xv-btn"
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
            aria-label="Next page"
          >
            Next <span aria-hidden="true">›</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
