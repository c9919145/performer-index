/**
 * Placeholder video thumbnail for fictional video entries.
 *
 * Like `AvatarPlaceholder`, this renders a deterministic gradient plus a play
 * glyph entirely in-page — no network requests, no external assets, no layout
 * shift. The wrapper keeps a fixed 16:9 box so grids stay stable. When
 * authorized thumbnails are available, swap this for a real <img> that keeps
 * the same aspect ratio plus explicit width/height and loading="lazy".
 */

const PALETTE = [
  ["#0f172a", "#334155"],
  ["#1e1b4b", "#4c1d95"],
  ["#082f49", "#0369a1"],
  ["#052e16", "#15803d"],
  ["#3b0764", "#7e22ce"],
  ["#450a0a", "#b91c1c"],
  ["#422006", "#b45309"],
  ["#042f2e", "#0f766e"],
];

export function VideoThumbnailPlaceholder({
  title,
  hue,
  durationLabel,
  className = "",
}: {
  title: string;
  hue: number;
  /** Formatted duration, rendered as a badge like the reference's tiles. */
  durationLabel?: string;
  className?: string;
}) {
  const [from, to] = PALETTE[hue % PALETTE.length];
  const id = `vt-${hue % PALETTE.length}`;
  const angle = hue % 90;

  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-chrome ${className}`}>
      <svg
        viewBox="0 0 160 90"
        className="h-full w-full"
        role="img"
        aria-label={`${title} placeholder thumbnail`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <rect width="160" height="90" fill={`url(#${id})`} />
        {/* subtle diagonal band + shapes so tiles don't read as flat blocks */}
        <rect
          x={-40 + angle}
          y="-30"
          width="40"
          height="160"
          fill="#ffffff"
          opacity="0.05"
          transform="rotate(20 80 45)"
        />
        <circle cx={30 + (hue % 6) * 16} cy="18" r="22" fill="#ffffff" opacity="0.06" />
        <circle cx={130 - (hue % 5) * 12} cy="76" r="28" fill="#000000" opacity="0.12" />

        {/* play glyph */}
        <circle cx="80" cy="45" r="17" fill="#000000" opacity="0.35" />
        <circle cx="80" cy="45" r="17" fill="none" stroke="#ffffff" strokeOpacity="0.55" />
        <path d="M74 36 L92 45 L74 54 Z" fill="#ffffff" opacity="0.9" />
      </svg>

      {durationLabel && (
        <span className="pointer-events-none absolute bottom-1 right-1 rounded-sm bg-black/75 px-1 py-px text-[11px] font-semibold leading-tight text-white">
          {durationLabel}
        </span>
      )}
    </div>
  );
}
