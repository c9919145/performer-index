const LINKS = [
  "Terms of service",
  "Privacy policy",
  "Cookie preferences",
  "Advertising",
  "Content removal",
  "RSS Deletes",
  "More...",
];

/** Footer link row + slogan, matching the reference's bottom section. */
export function Footer() {
  return (
    <div className="mt-8 border-t border-chrome-line bg-white">
      <footer className="mx-auto max-w-page px-3 py-4">
        <div className="botLinks text-center text-[12px] leading-relaxed text-ink-soft">
          {LINKS.map((label, i) => (
            <span key={label}>
              {i > 0 && <span className="text-ink-faint"> - </span>}
              <a
                href="#"
                className="hover:text-accent hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                {label}
              </a>
            </span>
          ))}
        </div>
        <p className="slogan mt-3 text-center text-[12px] text-ink-faint">
          PerformerIndex — a demonstration performer directory. All profiles
          shown are fictional samples.
        </p>
      </footer>
    </div>
  );
}
