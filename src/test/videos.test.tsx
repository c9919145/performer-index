import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "../App";
import { performers } from "../data/performers";
import {
  MAX_VIDEOS_PER_PERFORMER,
  MIN_VIDEOS_PER_PERFORMER,
  formatDuration,
  formatViews,
  getVideosForPerformer,
  videos,
} from "../data/videos";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("video data layer", () => {
  it("generates a deterministic, non-empty dataset", () => {
    expect(videos.length).toBeGreaterThan(0);
    // Every record belongs to a real performer slug.
    const slugs = new Set(performers.map((p) => p.slug));
    expect(videos.every((v) => slugs.has(v.performerSlug))).toBe(true);
  });

  it("assigns unique ids", () => {
    const ids = new Set(videos.map((v) => v.id));
    expect(ids.size).toBe(videos.length);
  });

  it("gives every performer at least one video", () => {
    for (const p of performers) {
      expect(getVideosForPerformer(p.slug).length).toBeGreaterThan(0);
    }
  });

  it("caps the list per performer", () => {
    for (const p of performers) {
      expect(getVideosForPerformer(p.slug).length).toBeLessThanOrEqual(
        MAX_VIDEOS_PER_PERFORMER,
      );
    }
  });

  it("gives every performer a populated grid (at least the floor)", () => {
    for (const p of performers) {
      expect(getVideosForPerformer(p.slug).length).toBeGreaterThanOrEqual(
        MIN_VIDEOS_PER_PERFORMER,
      );
    }
  });

  it("orders a performer's videos by views, highest first", () => {
    const list = getVideosForPerformer(performers[0].slug);
    const sorted = [...list].sort((a, b) => b.views - a.views);
    expect(list.map((v) => v.id)).toEqual(sorted.map((v) => v.id));
  });

  it("returns an empty array for an unknown slug", () => {
    expect(getVideosForPerformer("no-such-performer-zzz")).toEqual([]);
  });

  it("keeps view ordering stable across repeated lookups", () => {
    // The lookup is backed by a shared index built lazily on first call.
    // Repeating the lookup must not disturb the sort order.
    const slug = performers[1].slug;
    const first = getVideosForPerformer(slug).map((v) => v.id);
    for (let i = 0; i < 5; i++) getVideosForPerformer(slug);
    expect(getVideosForPerformer(slug).map((v) => v.id)).toEqual(first);
    const views = getVideosForPerformer(slug).map((v) => v.views);
    expect(views).toEqual([...views].sort((a, b) => b - a));
  });

  it("does not return the same array instance for different performers", () => {
    const a = getVideosForPerformer(performers[0].slug);
    const b = getVideosForPerformer(performers[2].slug);
    expect(a).not.toBe(b);
    expect(a.every((v) => v.performerSlug === performers[0].slug)).toBe(true);
    expect(b.every((v) => v.performerSlug === performers[2].slug)).toBe(true);
  });

  it("produces positive durations, views and timestamps", () => {
    for (const v of videos) {
      expect(v.durationSeconds).toBeGreaterThan(0);
      expect(v.views).toBeGreaterThan(0);
      expect(Number.isFinite(v.publishedAt)).toBe(true);
    }
  });
});

describe("formatDuration", () => {
  it("formats under an hour as M:SS with zero padding", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(9)).toBe("0:09");
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(600)).toBe("10:00");
    expect(formatDuration(3599)).toBe("59:59");
  });

  it("formats an hour or more as H:MM:SS", () => {
    expect(formatDuration(3600)).toBe("1:00:00");
    expect(formatDuration(3725)).toBe("1:02:05");
  });

  it("clamps negatives to zero", () => {
    expect(formatDuration(-5)).toBe("0:00");
  });
});

describe("formatViews", () => {
  it("formats counts with K/M suffixes", () => {
    expect(formatViews(999)).toBe("999");
    expect(formatViews(1000)).toBe("1.0K");
    expect(formatViews(1234)).toBe("1.2K");
    // (1_450_000 / 1e6).toFixed(1) is "1.4" in IEEE-754, not "1.5":
    // toFixed rounds the binary approximation, not the decimal literal.
    expect(formatViews(1_450_000)).toBe((1_450_000 / 1_000_000).toFixed(1) + "M");
    expect(formatViews(2_000_000)).toBe("2.0M");
    expect(formatViews(12_300_000)).toBe("12.3M");
  });
});

describe("profile page videos section", () => {
  it("renders a videos heading and one tile per generated video", () => {
    const p = performers[0];
    renderAt(`/pornstar/${p.slug}`);
    const heading = screen.getByRole("heading", { level: 2, name: /^videos$/i });
    expect(heading).toBeInTheDocument();
    const expected = getVideosForPerformer(p.slug);
    // Scope to the videos section: ".thumb-block" is also used by the
    // "More from <country>" section further down the page.
    const section = heading.closest("section")!;
    const tiles = section.querySelectorAll(".thumb-block");
    expect(tiles.length).toBe(expected.length);
  });

  it("shows the capped-of-total count line", () => {
    const p = performers[0];
    renderAt(`/pornstar/${p.slug}`);
    expect(
      screen.getByText(/most-viewed of/i),
    ).toBeInTheDocument();
  });

  it("renders duration badges and view counts", () => {
    const p = performers[0];
    renderAt(`/pornstar/${p.slug}`);
    const list = getVideosForPerformer(p.slug);
    expect(screen.getByText(formatDuration(list[0].durationSeconds))).toBeInTheDocument();
    expect(screen.getByText(`${formatViews(list[0].views)} views`)).toBeInTheDocument();
  });

  it("exposes each video title as a level-3 heading", () => {
    const p = performers[0];
    renderAt(`/pornstar/${p.slug}`);
    const list = getVideosForPerformer(p.slug);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.length).toBe(list.length);
    expect(headings[0].textContent?.trim()).toBe(list[0].title);
  });

  it("omits the section entirely for an unknown profile", () => {
    renderAt("/pornstar/no-such-performer-zzz");
    expect(screen.queryByRole("heading", { level: 2, name: /^videos$/i })).toBeNull();
  });
});
