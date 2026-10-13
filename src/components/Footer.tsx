
export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between sm:px-8 lg:px-12">
        <div>
          <p className="text-sm text-muted">
            Have a story to share? Let&apos;s connect.
          </p>

          <a
            href="mailto:junayedhasan302@gmail.com"
            className="mt-3 inline-block text-sm text-accent transition hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Get in touch ↗
          </a>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted">
            <a
              href="https://www.facebook.com/junayed.hasan.302/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Facebook ↗
            </a>

            <a
              href="https://www.instagram.com/jhjunayed/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Instagram ↗
            </a>

            <a
              href="https://www.pexels.com/@junayed-hasan-2156679708/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Pexels ↗
            </a>

            <a
              href="https://github.com/junayedhasan302"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <p className="text-xs tracking-wide text-muted">
          © {new Date().getFullYear()} Junayed Hasan Photography
        </p>
      </div>
    </footer>
  );
}
