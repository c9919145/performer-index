import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { getPerformerBySlug, globalRank, sortPerformers } from "../data/repository";
import { TYPE_LABELS } from "../types";
import { performers } from "../data/performers";
import {
  MAX_VIDEOS_PER_PERFORMER,
  formatDuration,
  formatViews,
  getVideosForPerformer,
} from "../data/videos";
import { AvatarPlaceholder } from "../components/Avatar";
import { FlagBadge } from "../components/Flag";
import { VideoThumbnailPlaceholder } from "../components/VideoThumbnail";

/**
 * Performer profile page.
 *
 * Uses the same visual language as the directory. All content shown is
 * fictional sample data; no real biographical facts are asserted. The
 * "related profiles" list is generated from the sample dataset.
 */
export function ProfilePage() {
  const { slug = "" } = useParams();
  const performer = useMemo(() => getPerformerBySlug(slug), [slug]);
  const rank = useMemo(
    () => (performer ? globalRank(performer.slug, "subs-year") : null),
    [performer],
  );
  const related = useMemo(() => {
    if (!performer) return [];
    return sortPerformers(
      performers.filter(
        (p) => p.country.code === performer.country.code && p.slug !== performer.slug,
      ),
      "subs-year",
    ).slice(0, 8);
  }, [performer]);
  const videos = useMemo(
    () => (performer ? getVideosForPerformer(performer.slug) : []),
    [performer],
  );

  if (!performer) {
    return (
      <main id="main" className="mx-auto max-w-page px-3 py-10">
        <nav aria-label="Breadcrumb" className="text-[13px] text-ink-soft">
          <Link to="/pornstars-index/usa" className="hover:text-accent">
            Pornstars index
          </Link>{" "}
          / <span>Not found</span>
        </nav>
        <div className="mt-4 rounded-sm border border-chrome-line bg-chrome px-4 py-10 text-center">
          <p className="text-base font-semibold text-ink">
            Performer not found
          </p>
          <p className="mt-1 text-[13px] text-ink-soft">
            This profile does not exist or has been removed.
          </p>
          <Link to="/pornstars-index/usa" className="xv-btn mt-3 inline-flex">
            ← Back to the directory
          </Link>
        </div>
      </main>
    );
  }

  const joined = new Date(performer.joinedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main id="main" className="mx-auto max-w-page px-3 py-3">
      <nav aria-label="Breadcrumb" className="py-2 text-[13px] text-ink-soft">
        <Link to="/pornstars-index/usa" className="hover:text-accent">
          Pornstars index
        </Link>{" "}
        /{" "}
        <Link
          to={`/pornstars-index/usa?country=${performer.country.token}`}
          className="hover:text-accent"
        >
          {performer.country.name} models
        </Link>{" "}
        / <span className="text-ink">{performer.name}</span>
      </nav>

      <div className="grid gap-5 rounded-sm border border-chrome-line p-4 md:grid-cols-[260px_1fr]">
        <div className="mx-auto w-full max-w-[260px]">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-sm bg-chrome">
            <AvatarPlaceholder name={performer.name} hue={performer.avatarHue} />
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-ink">{performer.name}</h1>
            <FlagBadge country={performer.country} />
            {rank !== null && (
              <span className="rounded-sm bg-chrome-dark px-2 py-0.5 text-[12px] font-bold text-white">
                #{rank} in {performer.country.name}
              </span>
            )}
          </div>

          <dl className="mt-3 grid max-w-lg grid-cols-2 gap-x-6 gap-y-1.5 text-[13px]">
            <dt className="text-ink-soft">Type</dt>
            <dd className="font-semibold text-ink">
              {TYPE_LABELS[performer.type]}
            </dd>
            <dt className="text-ink-soft">Country</dt>
            <dd className="font-semibold text-ink">{performer.country.name}</dd>
            <dt className="text-ink-soft">Videos</dt>
            <dd className="font-semibold text-ink">
              {performer.videoCount.toLocaleString("en-US")}
            </dd>
            <dt className="text-ink-soft">Subscribers (1 year)</dt>
            <dd className="font-semibold text-ink">
              {performer.subscribersYear.toLocaleString("en-US")}
            </dd>
            <dt className="text-ink-soft">Subscribers (ever)</dt>
            <dd className="font-semibold text-ink">
              {performer.subscribersEver.toLocaleString("en-US")}
            </dd>
            <dt className="text-ink-soft">Profile added</dt>
            <dd className="font-semibold text-ink">{joined}</dd>
          </dl>

          <p className="mt-3 max-w-2xl text-[13px] text-ink-soft">
            {performer.bio}
          </p>

          <p className="mt-2 inline-block rounded-sm bg-chrome px-2 py-1 text-[12px] text-ink-faint">
            Fictional sample profile — created for development purposes.
          </p>
        </div>
      </div>

      {videos.length > 0 && (
        <section aria-labelledby="videos-heading" className="mt-6">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="videos-heading" className="text-base font-bold text-ink">
              Videos
            </h2>
            <p className="text-[13px] text-ink-soft">
              Showing {videos.length.toLocaleString("en-US")} most-viewed of{" "}
              {performer.videoCount.toLocaleString("en-US")} total
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {videos.map((v) => (
              <article key={v.id} className="thumb-block">
                <VideoThumbnailPlaceholder
                  title={v.title}
                  hue={v.thumbnailHue}
                  durationLabel={formatDuration(v.durationSeconds)}
                />
                <h3
                  className="line-clamp-2 pt-1 text-[13px] font-normal leading-tight text-ink"
                  title={v.title}
                >
                  {v.title}
                </h3>
                <p className="pt-0.5 text-[12px] leading-tight text-ink-soft">
                  <span>{formatViews(v.views)} views</span>
                  <span aria-hidden="true"> · </span>
                  <time dateTime={new Date(v.publishedAt).toISOString()}>
                    {new Date(v.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </p>
              </article>
            ))}
          </div>

          {performer.videoCount > MAX_VIDEOS_PER_PERFORMER && (
            <p className="mt-3 text-[12px] text-ink-faint">
              Video metadata is fictional sample data; this build caps the list at{" "}
              {MAX_VIDEOS_PER_PERFORMER} entries per profile.
            </p>
          )}
        </section>
      )}

      <section aria-labelledby="related-heading" className="mt-6">
        <h2 id="related-heading" className="mb-3 text-base font-bold text-ink">
          More from {performer.country.name}
        </h2>
        {related.length === 0 ? (
          <p className="text-[13px] text-ink-soft">No related profiles.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
            {related.map((p) => (
              <div key={p.slug} className="thumb-block">
                <div className="thumb relative overflow-hidden rounded-t bg-chrome">
                  <Link to={`/pornstar/${p.slug}`} className="block">
                    <div className="aspect-[4/3] w-full">
                      <AvatarPlaceholder name={p.name} hue={p.avatarHue} />
                    </div>
                  </Link>
                  <span className="pointer-events-none absolute bottom-1 left-1">
                    <FlagBadge country={p.country} />
                  </span>
                </div>
                <p className="truncate pt-1 text-[13px] leading-tight">
                  <Link
                    to={`/pornstar/${p.slug}`}
                    className="text-ink hover:text-accent hover:underline"
                  >
                    {p.name}
                  </Link>
                </p>
                <p className="truncate text-[12px] leading-tight text-ink-soft">
                  {p.videoCount.toLocaleString("en-US")} videos
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="py-5">
        <Link to="/pornstars-index/usa" className="xv-btn inline-flex">
          ← Back to the directory
        </Link>
      </p>
    </main>
  );
}
