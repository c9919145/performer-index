const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/**
 * A-Z quick filter strip. The reference links alphabet browsing to a separate
 * A-Z page; here it is surfaced inline so alphabetical filtering works
 * directly on the directory while keeping the same visual language.
 */
export function AlphabetNav({
  value,
  available,
  onChange,
}: {
  value: string | null;
  available: Set<string>;
  onChange: (letter: string | null) => void;
}) {
  return (
    <nav aria-label="Filter by first letter" className="pb-3">
      <ul className="flex flex-wrap items-center gap-1 text-[12px]">
        <li>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-pressed={value === null}
            className={`min-w-[26px] rounded-sm border px-1.5 py-1 font-semibold uppercase leading-none transition-colors ${
              value === null
                ? "border-accent bg-accent text-white"
                : "border-chrome-line bg-white text-ink hover:border-accent hover:text-accent"
            }`}
          >
            All
          </button>
        </li>
        {LETTERS.map((l) => {
          const enabled = available.has(l);
          const active = value === l;
          return (
            <li key={l}>
              <button
                type="button"
                disabled={!enabled}
                onClick={() => onChange(active ? null : l)}
                aria-pressed={active}
                aria-label={`Names starting with ${l}`}
                className={`min-w-[26px] rounded-sm border px-1.5 py-1 font-semibold uppercase leading-none transition-colors ${
                  active
                    ? "border-accent bg-accent text-white"
                    : enabled
                      ? "border-chrome-line bg-white text-ink hover:border-accent hover:text-accent"
                      : "border-chrome-line bg-chrome text-ink-faint cursor-not-allowed"
                }`}
              >
                {l}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
