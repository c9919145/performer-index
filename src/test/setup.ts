import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom does not implement window scrolling. The app resets scroll on route
// change, so stub it to keep test output free of "Not implemented" noise.
window.scrollTo = vi.fn();
