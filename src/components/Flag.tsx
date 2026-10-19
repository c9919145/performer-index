import type { Country } from "../types";

/**
 * Tiny inline SVG flags for the countries in the sample dataset.
 *
 * Drawn from scratch as simple stripe/shape abstractions — no external flag
 * image assets are loaded. Countries without a dedicated drawing fall back to
 * a neutral globe tile so the badge always renders at a stable size.
 */

function Uc(name: string) {
  return name
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

function FlagUS() {
  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-full w-full">
      <rect width="24" height="16" fill="#b22234" />
      {[1, 3, 5].map((i) => (
        <rect key={i} y={i * 2.46} width="24" height="1.23" fill="#fff" />
      ))}
      <rect width="10" height="8.6" fill="#3c3b6e" />
    </svg>
  );
}

function FlagCA() {
  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-full w-full">
      <rect width="24" height="16" fill="#fff" />
      <rect width="6" height="16" fill="#d52b1e" />
      <rect x="18" width="6" height="16" fill="#d52b1e" />
      <path d="M12 3l1 2.2 1.8-.9-.6 2.2 2-.5-1.5 1.7 1.9 1.2-2.3.4.4 1.6-1.9-.9-.4 2h-1.2l-.4-2-1.9.9.4-1.6-2.3-.4 1.9-1.2L8.8 6l2 .5-.6-2.2 1.8.9z" fill="#d52b1e" />
    </svg>
  );
}

function HorizontalTriband({
  top,
  bottom,
}: {
  top: string;
  bottom: string;
}) {
  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-full w-full">
      <rect width="24" height="16" fill={top} />
      <rect y="8" width="24" height="8" fill={bottom} />
    </svg>
  );
}

function VerticalTriband({
  left,
  right,
}: {
  left: string;
  right: string;
}) {
  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-full w-full">
      <rect width="24" height="16" fill="#fff" />
      <rect width="8" height="16" fill={left} />
      <rect x="16" width="8" height="16" fill={right} />
    </svg>
  );
}

function FlagGB() {
  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-full w-full">
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#fff" strokeWidth="3.2" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#c8102e" strokeWidth="1.6" />
      <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5" />
      <path d="M12 0v16M0 8h24" stroke="#c8102e" strokeWidth="3" />
    </svg>
  );
}

function FlagJP() {
  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-full w-full">
      <rect width="24" height="16" fill="#fff" />
      <circle cx="12" cy="8" r="4.4" fill="#bc002d" />
    </svg>
  );
}

function FlagBR() {
  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-full w-full">
      <rect width="24" height="16" fill="#009b3a" />
      <path d="M12 1.6L22 8l-10 6.4L2 8z" fill="#fedf00" />
      <circle cx="12" cy="8" r="3" fill="#002776" />
    </svg>
  );
}

function FlagUA() {
  return <HorizontalTriband top="#0057b7" bottom="#ffd700" />;
}

function FlagPL() {
  return <HorizontalTriband top="#fff" bottom="#dc143c" />;
}

function FlagNL() {
  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-full w-full">
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="5.34" fill="#ae1c28" />
      <rect y="10.66" width="24" height="5.34" fill="#21468b" />
    </svg>
  );
}

function FlagDE() {
  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-full w-full">
      <rect width="24" height="16" fill="#000" />
      <rect y="5.34" width="24" height="5.33" fill="#dd0000" />
      <rect y="10.67" width="24" height="5.33" fill="#ffce00" />
    </svg>
  );
}

function FlagGeneric({ code }: { code: string }) {
  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-full w-full">
      <rect width="24" height="16" fill="#e8e8e8" />
      <text
        x="12"
        y="11"
        textAnchor="middle"
        fontSize="7"
        fill="#888"
        fontFamily="Arial, sans-serif"
      >
        {code}
      </text>
    </svg>
  );
}

const DRAWINGS: Record<string, () => JSX.Element> = {
  US: FlagUS,
  CA: FlagCA,
  GB: FlagGB,
  JP: FlagJP,
  BR: FlagBR,
  UA: FlagUA,
  PL: FlagPL,
  NL: FlagNL,
  DE: FlagDE,
  FR: () => <VerticalTriband left="#002395" right="#ed2939" />,
  IT: () => <VerticalTriband left="#009246" right="#ce2b37" />,
  ES: () => (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-full w-full">
      <rect width="24" height="16" fill="#c60b1e" />
      <rect y="4" width="24" height="8" fill="#ffc400" />
    </svg>
  ),
  RU: () => (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-full w-full">
      <rect width="24" height="16" fill="#fff" />
      <rect y="5.34" width="24" height="5.33" fill="#0039a6" />
      <rect y="10.67" width="24" height="5.33" fill="#d52b1e" />
    </svg>
  ),
  SE: () => (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-full w-full">
      <rect width="24" height="16" fill="#006aa7" />
      <rect x="7" width="3" height="16" fill="#fecc00" />
      <rect y="6.5" width="24" height="3" fill="#fecc00" />
    </svg>
  ),
  AU: () => (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-full w-full">
      <rect width="24" height="16" fill="#00008b" />
      <circle cx="17" cy="9" r="2" fill="#fff" />
      <circle cx="13" cy="4" r="1" fill="#fff" />
      <circle cx="20" cy="4" r="1" fill="#fff" />
    </svg>
  ),
};

export function FlagBadge({ country }: { country: Country }) {
  const Drawing = DRAWINGS[country.code];
  return (
    <span
      className="inline-block h-4 w-6 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black/15"
      title={country.name}
      aria-label={country.name}
      role="img"
    >
      {Drawing ? <Drawing /> : <FlagGeneric code={country.code} />}
    </span>
  );
}

export { Uc as flagEmoji };
