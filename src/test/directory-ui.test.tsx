import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "../App";
import { performers } from "../data/performers";
import { filterPerformers } from "../data/repository";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("directory page", () => {
  it("renders the geo-scoped heading label and a full page of cards", () => {
    renderAt("/pornstars-index/usa");
    const usaTotal = filterPerformers({
      q: "",
      countryToken: "usa",
      type: "all",
      ranking: "subs-year",
      letter: null,
      page: 1,
    }).length;
    expect(
      screen.getByText(
        `Top ${usaTotal.toLocaleString("en-US")} performers, models, and cam girls`,
      ),
    ).toBeInTheDocument();
    expect(document.querySelectorAll(".thumb-block").length).toBe(100);
  });

  it("uses the :country path segment as the directory scope", () => {
    renderAt("/pornstars-index/worldwide");
    const worldwideTotal = filterPerformers({
      q: "",
      countryToken: "worldwide",
      type: "all",
      ranking: "subs-year",
      letter: null,
      page: 1,
    }).length;
    expect(
      screen.getByText(
        `Top ${worldwideTotal.toLocaleString("en-US")} performers, models, and cam girls`,
      ),
    ).toBeInTheDocument();
  });

  it("shows rank, name and video count on cards", () => {
    renderAt("/pornstars-index/usa");
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(document.querySelector(".profile-counts")).toBeInTheDocument();
  });

  it("renders pagination with next/prev controls", () => {
    renderAt("/pornstars-index/usa");
    const navs = screen.getAllByRole("navigation", { name: /pagination/i });
    expect(navs.length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("button", { name: /next page/i }).length,
    ).toBeGreaterThan(0);
  });

  it("shows an empty state when search has no matches", () => {
    renderAt("/pornstars-index/usa?q=zzz-no-such-name-zzz");
    expect(screen.getByText(/No performers found/i)).toBeInTheDocument();
  });

  it("alphabet filter narrows results via URL", () => {
    renderAt("/pornstars-index/usa?letter=Q");
    const names = document.querySelectorAll(".profile-name a");
    expect(names.length).toBeGreaterThan(0);
    names.forEach((n) =>
      expect(n.textContent?.trim().startsWith("Q")).toBe(true),
    );
  });

  it("updates results when clicking a letter in the alphabet nav", async () => {
    const user = userEvent.setup();
    renderAt("/pornstars-index/usa");
    await user.click(
      screen.getByRole("button", { name: "Names starting with Z" }),
    );
    const names = document.querySelectorAll(".profile-name a");
    expect(names.length).toBeGreaterThan(0);
    names.forEach((n) =>
      expect(n.textContent?.trim().startsWith("Z")).toBe(true),
    );
  });
});

describe("profile page", () => {
  it("renders profile details for a known performer", () => {
    const p = performers.find((x) => x.country.code === "US")!;
    renderAt(`/pornstar/${p.slug}`);
    expect(
      screen.getByRole("heading", { level: 1, name: p.name }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Fictional sample profile — created for development purposes.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /breadcrumb/i }),
    ).toBeInTheDocument();
  });

  it("shows a not-found state for unknown slugs", () => {
    renderAt("/pornstar/no-such-performer-zzz");
    expect(screen.getByText(/Performer not found/i)).toBeInTheDocument();
  });
});

describe("navigation", () => {
  it("card links open the profile page and offer a way back", async () => {
    const user = userEvent.setup();
    renderAt("/pornstars-index/usa?letter=Q");
    const firstName = document.querySelector(".profile-name a") as HTMLElement;
    const label = firstName.textContent!;
    await user.click(firstName);
    expect(
      screen.getByRole("heading", { level: 1, name: label }),
    ).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(within(main).getByRole("link", { name: /back to the directory/i })).toBeInTheDocument();
  });
});
