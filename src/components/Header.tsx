import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

/**
 * Site header: brand, location/version controls, search field and account
 * buttons — matching the reference's top row. The search submits to the
 * directory route with the query preserved in the URL.
 */
export function Header() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [term, setTerm] = useState(params.get("q") ?? "");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/pornstars-index/usa?q=${encodeURIComponent(q)}` : "/pornstars-index/usa");
    setMobileSearchOpen(false);
  }

  return (
    <div className="border-b border-chrome-line bg-white">
      <header className="mx-auto flex max-w-page items-center gap-3 px-3 py-2">
        {/* Hamburger – visible on mobile only, mirrors the reference */}
        <button
          type="button"
          className="btn-clear -ml-1 flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-sm md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMobileSearchOpen((v) => !v)}
        >
          <span className="block h-0.5 w-5 bg-ink" />
          <span className="block h-0.5 w-5 bg-ink" />
          <span className="block h-0.5 w-5 bg-ink" />
        </button>

        <Link
          to="/pornstars-index/usa"
          className="flex shrink-0 items-baseline gap-1 text-2xl font-bold tracking-tight"
          aria-label="Performer Index home"
        >
          <span className="text-accent">PERFORMER</span>
          <span className="text-ink">INDEX</span>
        </Link>

        <button
          type="button"
          className="xv-btn ml-1 hidden xl:inline-flex"
          title="Change language"
        >
          Language: <span aria-hidden="true">EN</span>
        </button>
        <button
          type="button"
          className="xv-btn hidden xl:inline-flex"
          title="Your location"
        >
          Your location: USA
        </button>
        <button
          type="button"
          className="xv-btn hidden xl:inline-flex"
          title="Version"
        >
          Straight
        </button>

        {/* Search */}
        <form
          onSubmit={onSubmit}
          role="search"
          className={`ml-auto w-full max-w-[420px] md:w-auto ${mobileSearchOpen ? "block" : "hidden md:block"}`}
        >
          <label htmlFor="site-search" className="sr-only">
            Search performers
          </label>
          <div className="flex">
            <input
              id="site-search"
              type="text"
              name="k"
              maxLength={2048}
              placeholder="Search performers"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="h-9 w-full min-w-0 rounded-l border border-chrome-line px-3 text-sm text-ink placeholder:text-ink-faint focus:border-accent md:w-[240px] lg:w-[320px]"
            />
            <button
              type="submit"
              title="Search"
              className="flex h-9 w-10 items-center justify-center rounded-r border border-l-0 border-chrome-line bg-chrome-dark text-white transition-colors hover:bg-accent"
              aria-label="Search"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M8.5 3a5.5 5.5 0 014.23 9.02l3.62 3.63-1.06 1.06-3.63-3.62A5.5 5.5 0 118.5 3zm0 1.5a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </button>
          </div>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
          <a
            href="#login"
            className="xv-btn hidden sm:inline-flex"
            onClick={(e) => e.preventDefault()}
          >
            Login
          </a>
          <a
            href="#join"
            className="xv-btn xv-btn-dark hidden sm:inline-flex"
            onClick={(e) => e.preventDefault()}
          >
            Join for FREE
          </a>
          <a
            href="#premium"
            className="xv-btn hidden border-accent text-accent hover:bg-accent hover:text-white xl:inline-flex"
            onClick={(e) => e.preventDefault()}
          >
            Premium
          </a>
        </div>
      </header>
    </div>
  );
}
