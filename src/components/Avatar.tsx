/**
 * Placeholder avatar for fictional profiles.
 *
 * Renders a deterministic gradient + initials entirely in-page (no network
 * requests, no layout shift, no external assets). When authorized profile
 * images are available, swap this component for a real <img> with the same
 * fixed aspect ratio.
 */

const PALETTE = [
  ["#f97316", "#b91c1c"],
  ["#8b5cf6", "#4c1d95"],
  ["#0ea5e9", "#075985"],
  ["#10b981", "#064e3b"],
  ["#ec4899", "#831843"],
  ["#eab308", "#854d0e"],
  ["#14b8a6", "#134e4a"],
  ["#6366f1", "#312e81"],
  ["#ef4444", "#7f1d1d"],
  ["#84cc16", "#365314"],
];

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "?";
  const second = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + second).toUpperCase();
}

export function AvatarPlaceholder({
  name,
  hue,
  className = "",
}: {
  name: string;
  hue: number;
  className?: string;
}) {
  const [from, to] = PALETTE[hue % PALETTE.length];
  const id = `av-${hue % PALETTE.length}`;
  return (
    <svg
      viewBox="0 0 120 90"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={`${name} placeholder avatar`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="120" height="90" fill={`url(#${id})`} />
      {/* soft abstract shapes so tiles don't look flat */}
      <circle cx={20 + (hue % 7) * 12} cy={20} r="26" fill="#ffffff" opacity="0.08" />
      <circle cx={90 - (hue % 5) * 10} cy={75} r="34" fill="#000000" opacity="0.10" />
      <text
        x="60"
        y="52"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="30"
        fontWeight="700"
        fill="#ffffff"
        opacity="0.92"
      >
        {initialsOf(name)}
      </text>
    </svg>
  );
}
