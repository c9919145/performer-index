import { useState } from "react";
import { Link } from "react-router-dom";
import type { Performer } from "../types";
import { AvatarPlaceholder } from "./Avatar";
import { FlagBadge } from "./Flag";

/**
 * Performer card used in the directory grid, mirroring the reference's
 * thumb-block: fixed-ratio image, country flag badge, rank + name, and the
 * video count underneath.
 *
 * Images are locally generated placeholders at a stable aspect ratio, so
 * there are no network requests and no layout shift. Swap `AvatarPlaceholder`
 * for a real <img loading="lazy" width height> once authorized images exist.
 */
export function PerformerCard({
  performer,
  rank,
}: {
  performer: Performer;
  rank: number | null;
}) {
  const [failed] = useState(false);

  return (
    <div className="thumb-block rounded-b" id={`profile-${performer.slug}`}>
      <div className="thumb-inside">
        <div className="thumb relative overflow-hidden rounded-t bg-chrome">
          <Link
            to={`/pornstar/${performer.slug}`}
            className="block"
            aria-label={`Open profile of ${performer.name}`}
          >
            <div className="aspect-[4/3] w-full">
              {failed ? (
                <div className="flex h-full w-full items-center justify-center bg-chrome text-xs text-ink-faint">
                  Image unavailable
                </div>
              ) : (
                <AvatarPlaceholder
                  name={performer.name}
                  hue={performer.avatarHue}
                  className="transition-transform duration-200 hover:scale-[1.04]"
                />
              )}
            </div>
          </Link>
          <span className="pointer-events-none absolute bottom-1 left-1">
            <FlagBadge country={performer.country} />
          </span>
        </div>
        <div className="thumb-under px-0.5 pt-1">
          <p className="profile-name truncate text-[13px] leading-tight">
            {rank !== null && (
              <strong className="font-bold text-ink">#{rank}&nbsp;</strong>
            )}
            <Link
              to={`/pornstar/${performer.slug}`}
              className="text-ink hover:text-accent hover:underline"
            >
              {performer.name}
            </Link>
          </p>
          <p className="profile-counts truncate text-[12px] leading-tight text-ink-soft">
            {performer.videoCount.toLocaleString("en-US")} videos
          </p>
        </div>
      </div>
    </div>
  );
}
