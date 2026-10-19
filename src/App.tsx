import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { MainNav } from "./components/MainNav";
import { Footer } from "./components/Footer";
import { DirectoryPage } from "./pages/DirectoryPage";
import { ProfilePage } from "./pages/ProfilePage";

/** Resets scroll position on route change. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * App shell + routes.
 *
 * Route paths mirror the reference's URL structure:
 *   /pornstars-index/:country  -> directory
 *   /pornstar/:slug            -> profile
 */
export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-sm focus:bg-chrome-dark focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <MainNav />
      <div className="flex-1 pb-6">
        <Routes>
          <Route path="/pornstars-index/:country" element={<DirectoryPage />} />
          <Route path="/pornstar/:slug" element={<ProfilePage />} />
          <Route
            path="/pornstars-index"
            element={<Navigate to="/pornstars-index/usa" replace />}
          />
          <Route path="/" element={<Navigate to="/pornstars-index/usa" replace />} />
          <Route path="*" element={<Navigate to="/pornstars-index/usa" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
