# Performer Index — USA directory recreation

A working recreation of a performer-directory index page (structure and
behavior modelled on an adult-site "pornstars index" listing page), built with
an original implementation.

> **Content note.** This project ships with **fictional sample data only**.
> Names are generated from invented word fragments and profile images are
> locally generated placeholder avatars. No real performer names, photographs,
> CDN assets or site code from any third-party site are included. The data
> layer is structured so authorized profile data can be dropped in later.

## What was reproduced

Reference anatomy studied from the live page:

| Reference element | Implementation |
| --- | --- |
| Header: logo, language/location/version buttons, search + submit, Login / Join for FREE / Premium | `src/components/Header.tsx` |
| Primary nav strip (Best Videos, Categories, … Pornstars) | `src/components/MainNav.tsx` |
| Filter bar: bold count label + geo / model-type / ranking dropdowns | `src/components/FilterBar.tsx` |
| Grey note strip about ranking basis | `src/pages/DirectoryPage.tsx` |
| Alphabetical navigation | `src/components/AlphabetNav.tsx` |
| Dense card grid: 4:3 thumb, flag badge, `#rank name`, `N videos` | `src/components/PerformerCard.tsx` |
| Pagination above **and** below the grid (numbered + ellipsis + Next) | `src/components/Pagination.tsx` |
| Footer link row + slogan | `src/components/Footer.tsx` |
| Profile page with breadcrumb and back navigation | `src/pages/ProfilePage.tsx` |

## Requirements

- Node.js 18+ (developed on Node 24)
- npm 9+

## Setup

```bash
npm install
npm run dev        # http://localhost:5173/pornstars-index/usa
```

## Tech stack

- **React 18** + **TypeScript** (strict) + **Vite 5**
- **Tailwind CSS 4** via the `@tailwindcss/vite` plugin. Design tokens live in
  `src/index.css` inside an `@theme { … }` block — there is no
  `tailwind.config.js` or `postcss.config.js`.
- **react-router-dom 7** for the two routes
- **Vitest 2** + Testing Library + jsdom for automated tests

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc --noEmit`) and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the automated test suite (Vitest + Testing Library) |
| `npm run test:watch` | Tests in watch mode |

## Routes

| Route | Description |
| --- | --- |
| `/pornstars-index/usa` | USA performer directory (default) |
| `/pornstars-index/worldwide` | Worldwide directory |
| `/pornstars-index/:country` | Directory scoped to a country token |
| `/pornstar/:slug` | Performer profile page |

## Functional behavior

All directory state lives in the URL query string, so filters survive
pagination, refresh and sharing:

- `q` — free-text name search (case-insensitive substring)
- `country` — geo scope: `usa`, `worldwide`, `north_america`, or a country token
- `type` — `porn-star`, `amateur`, `cam-girl`, `erotic-model`
- `ranking` — `subs-year` (default), `subs-3mo`, `subs-ever`, `newest`, `a-z`
- `letter` — A–Z first-letter filter
- `page` — 1-based page number

Every control (search, geo/type/ranking dropdowns, alphabet strip, pagination)
performs real queries against the dataset through `src/data/repository.ts`.
There is a clear-filters action and an empty state with a recovery action.

## Architecture

```
src/
  types.ts              Domain types + filter/ranking option tables
  data/
    countries.ts        Country list + geographic scopes
    names.ts            Invented name pools for the sample dataset
    performers.ts       Deterministic fictional dataset (seeded PRNG, 1,400 profiles)
    repository.ts       Query layer: filter, sort, paginate, lookups
  components/           Header, MainNav, FilterBar, AlphabetNav, Dropdown,
                        PerformerCard, Pagination, Avatar, Flag, Footer
  pages/                DirectoryPage, ProfilePage
  App.tsx               Shell + router
  test/                 Test setup + UI integration tests
```

Profile data is fully separated from the UI. To move to a real backend
(PostgreSQL for production, SQLite for local development), reimplement
`queryDirectory()` and `getPerformerBySlug()` in `src/data/repository.ts` with
the same signatures — no component changes are required. The `Performer`
interface in `src/types.ts` is the data contract.

### Suggested SQL schema (for a real backend)

```sql
CREATE TABLE countries (
  code   CHAR(2) PRIMARY KEY,
  name   TEXT NOT NULL,
  token  TEXT NOT NULL UNIQUE
);

CREATE TABLE performers (
  id                 BIGSERIAL PRIMARY KEY,
  slug               TEXT NOT NULL UNIQUE,
  name               TEXT NOT NULL,
  type               TEXT NOT NULL,
  country_code       CHAR(2) NOT NULL REFERENCES countries(code),
  video_count        INTEGER NOT NULL DEFAULT 0,
  subscribers_year   BIGINT  NOT NULL DEFAULT 0,
  subscribers_ever   BIGINT  NOT NULL DEFAULT 0,
  subscribers_3mo    BIGINT  NOT NULL DEFAULT 0,
  joined_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  image_url          TEXT
);
CREATE INDEX performers_country_idx  ON performers (country_code);
CREATE INDEX performers_type_idx     ON performers (type);
CREATE INDEX performers_year_idx     ON performers (subscribers_year DESC);
CREATE INDEX performers_name_idx     ON performers (lower(name));
```

## Accessibility & performance

- Semantic landmarks (`header`, `nav`, `main`, `footer`) and a skip link.
- All controls are real buttons/links with labels; dropdowns expose
  `aria-haspopup` / `aria-expanded` and close on Escape or outside click.
- `aria-current="page"` on the active pagination item; `aria-pressed` on
  alphabet toggles; `aria-live="polite"` on the results region.
- Visible focus rings on every interactive element.
- Fixed aspect-ratio placeholders (4:3) prevent layout shift; no network
  image requests in the sample build. Replacing placeholders with real images
  should keep explicit `width`/`height` and `loading="lazy"`.
- Pagination keeps the DOM small even with a large directory.

## Responsive behavior

Grid columns adapt: 2 (mobile) → 3 (small) → 4 (medium) → 6 (large) → 8
(extra-large). Header controls collapse on narrow viewports (search collapses
behind a toggle; account buttons hide progressively). The primary nav wraps
onto additional lines on phones so no links are clipped, and uses a single row
from the `sm` breakpoint up. No viewport produces page-level horizontal
scrolling.

## Deviations from the reference

- The reference links alphabetical browsing to a separate A–Z page. This app
  keeps the user in place with an inline A–Z strip that applies a `letter`
  filter to the current directory — a deliberate usability enhancement.
- All content is fictional sample data. The directory contains 1,400 generated
  profiles (`src/data/performers.ts`); the USA scope currently matches ~869 of
  them. The count label reflects the active geo scope.
- Placeholder avatars are inline SVG, so there are no third-party image
  requests and no image-load failures in the sample build. `PerformerCard`
  retains an "Image unavailable" branch for when authorized <img> assets are
  introduced.

## Testing

`npm test` covers the data layer (filtering, sorting, pagination, lookups,
empty states) and the UI (heading label, 100-card page size, pagination
controls, empty state, alphabet filtering via clicks, profile navigation,
breadcrumb, not-found state).

## Deployment

The build output is a static SPA (`dist/`). Because the app uses client-side
routing, a history-API fallback is required so unknown paths (for example a
directly opened `/pornstar/:slug`) serve `index.html` instead of 404.

This repo already ships the fallback config for each host — no manual setup:

| File | Host | What it does |
| --- | --- | --- |
| `public/_redirects` | Netlify / Cloudflare Pages | `/* /index.html 200` (copied into `dist/` by Vite) |
| `netlify.toml` | Netlify | build `npm run build`, publish `dist` |
| `vercel.json` | Vercel | build `npm run build`, output `dist`, rewrite all routes |
| `nginx.conf.example` | nginx / any web server | `try_files` snippet to copy into your server block |
| `.github/workflows/pages.yml` | GitHub Pages | build with subpath base, run tests, publish `dist/` via Actions |

Build and deploy:

```bash
npm run build          # -> dist/
```

- **Netlify:** connect the repo (config is detected) or run `netlify deploy --prod --dir dist`.
- **Vercel:** connect the repo (config is detected) or run `vercel --prod`.
- **Cloudflare Pages:** build command `npm run build`, output dir `dist`; the
  bundled `_redirects` provides the SPA fallback.
- **Any web server:** copy `dist/` to your document root and apply the
  `nginx.conf.example` snippet.

To sanity-check the fallback locally, serve `dist/` and open a deep path — for
example `npm run preview`, then visit `/pornstar/any-slug`: it must return the
app (HTTP 200) rather than a 404.

If deployment credentials are available and deployment is authorized, run the
commands above against the target platform; no environment variables are
required for the sample build.

### GitHub Pages

This project is **deployed** to GitHub Pages at:

**https://c9919145.github.io/performer-index/**

It is a **project site**, served from the `/<repo>/` subpath rather than the
domain root. That matters for two reasons, both already handled:

1. **Asset URLs.** The Pages workflow sets `VITE_BASE=/performer-index/`, so
   Vite prefixes every asset URL with the subpath. `vite.config.ts` reads
   `VITE_BASE` (defaulting to `/`) — local dev is unaffected.
2. **Client-side routing.** `src/main.tsx` derives React Router's `basename`
   from `import.meta.env.BASE_URL`. Without it, `useNavigate()` treats paths as
   root-relative and navigation escapes the subpath, producing 404s on search
   and links. This bug does **not** reproduce at base `/`, so it must be tested
   against a subpath build (see below).

The workflow (`.github/workflows/pages.yml`) runs on every push to `main`:
install → build with the subpath base → `npm test` → copy `index.html` to
`404.html` for the deep-link fallback → publish via `actions/deploy-pages`.

GitHub Pages has no rewrite rules, so the SPA fallback is the `404.html` copy:
Pages serves it for unmatched paths, which loads the app and lets the router
resolve the route client-side.

To set this up on a fresh fork: push to `main`, then enable Pages with
**Source: GitHub Actions** (Settings → Pages, or
`gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow`). Adjust
`VITE_BASE` in the workflow if your repository name differs.

**Verifying a subpath build locally.** Because the subpath is where routing
bugs hide, test the real deploy artifact rather than the dev server:

```bash
VITE_BASE=/performer-index/ npm run build
cp dist/index.html dist/404.html
mkdir -p /tmp/subpath/performer-index && cp -R dist/* /tmp/subpath/performer-index/
# serve /tmp/subpath and map unknown paths to 404.html, then open
# http://localhost:PORT/performer-index/pornstars-index/usa
# and confirm search keeps /performer-index/ in the URL.
```

### Docker

A multi-stage `Dockerfile` builds the app and serves the static output with
nginx (SPA fallback + cache headers configured in `docker/nginx.conf`).

```bash
docker build -t performer-index .
docker run --rm -p 8080:80 performer-index
# open http://localhost:8080/pornstars-index/usa
```

The image is `nginx:1.27-alpine` at runtime, exposes port `80`, and declares a
`HEALTHCHECK`. `docker/nginx.conf` long-caches hashed `/assets/` while always
revalidating `index.html`.

### Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request: `npm ci`,
`npm run build`, `npm test`, then uploads `dist/` as a build artifact.

Note: CI does **not** use `actions/setup-node`'s `cache: npm`, because the
cache requires a committed `package-lock.json` and fails hard when one is
absent. The install step regenerates a lockfile when needed; on a networked
machine you can commit one and re-enable caching.
