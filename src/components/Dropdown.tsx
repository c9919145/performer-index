import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Small accessible dropdown used by the filter bar.
 * Closes on outside click and Escape; toggles with aria-expanded.
 */
export function Dropdown({
  label,
  children,
}: {
  label: string;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        className="xv-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <svg viewBox="0 0 10 6" className="h-1.5 w-2.5" fill="currentColor" aria-hidden="true">
          <path d="M0 0l5 6 5-6z" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-[calc(100%+4px)] z-30 min-w-[220px] rounded-sm border border-chrome-line bg-white py-1 shadow-lg"
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  active,
  onSelect,
  children,
}: {
  active: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className={`block w-full px-3 py-1.5 text-left text-[13px] transition-colors hover:bg-chrome hover:text-accent ${
        active ? "font-semibold text-accent" : "text-ink"
      }`}
    >
      {children}
    </button>
  );
}
