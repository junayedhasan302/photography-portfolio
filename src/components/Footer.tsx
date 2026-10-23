
import {
  SiFacebook,
  SiInstagram,
  SiPexels,
  SiGithub,
} from "react-icons/si";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 sm:py-12 md:flex-row md:items-center md:justify-between md:gap-6 lg:px-12">
        {/* Contact and social links */}
        <div className="min-w-0">
          <p className="text-sm leading-6 text-muted sm:text-base">
            Have a story to share? Let&apos;s connect.
          </p>

          <a
            href="mailto:junayedhasan302@gmail.com"
            className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm text-accent transition-colors hover:text-accent-hover focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Get in touch
            <span aria-hidden="true">↗</span>
          </a>

          {/* Social media icons */}
          <nav
            aria-label="Social media"
            className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <a
              href="https://www.facebook.com/junayed.hasan.302/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook (opens in a new tab)"
              title="Facebook"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <SiFacebook aria-hidden="true" className="size-5" />
            </a>

            <a
              href="https://www.instagram.com/jhjunayed/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram (opens in a new tab)"
              title="Instagram"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <SiInstagram aria-hidden="true" className="size-5" />
            </a>

            <a
              href="https://www.pexels.com/@junayed-hasan-2156679708/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pexels (opens in a new tab)"
              title="Pexels"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <SiPexels aria-hidden="true" className="size-5" />
            </a>

            <a
              href="https://github.com/junayedhasan302"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (opens in a new tab)"
              title="GitHub"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <SiGithub aria-hidden="true" className="size-5" />
            </a>
          </nav>
        </div>

        {/* Copyright */}
        <p className="text-xs leading-6 tracking-wide text-muted md:shrink-0 md:text-right">
          © {new Date().getFullYear()} Junayed Hasan Photography
        </p>
      </div>
    </footer>
  );
}
