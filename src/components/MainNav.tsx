import { NavLink } from "react-router-dom";

const ITEMS: Array<{ label: string; to?: string; external?: boolean }> = [
  { label: "Best Videos" },
  { label: "Categories" },
  { label: "Channels" },
  { label: "Pornstars", to: "/pornstars-index/usa" },
  { label: "Live Cams" },
  { label: "Dating" },
  { label: "Profiles" },
];

/**
 * Primary navigation strip below the header. Only "Pornstars" is routed
 * (it is the page this app implements); the other entries are decorative
 * placeholders that mirror the reference's nav composition.
 */
export function MainNav() {
  return (
    <div className="border-b border-chrome-line bg-white">
      <nav
        aria-label="Primary"
        className="mx-auto max-w-page px-3"
      >
        <ul className="flex flex-wrap items-stretch text-[13px] sm:flex-nowrap">
          {ITEMS.map((item) => {
            const active = item.to === "/pornstars-index/usa";
            const cls =
              "flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 transition-colors hover:text-accent";
            return (
              <li key={item.label}>
                {item.to ? (
                  <NavLink
                    to={item.to}
                    className={`${cls} ${active ? "border-b-2 border-accent font-semibold text-accent" : "text-ink"}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <a
                    href="#"
                    className={`${cls} text-ink-soft`}
                    aria-disabled="true"
                    onClick={(e) => e.preventDefault()}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
