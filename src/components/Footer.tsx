
export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 lg:px-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-white/60">
            Have a story to share? Let&apos;s connect.
          </p>

          <a
            href="mailto:junayedhasan302@gmail.com"
            className="mt-3 inline-block text-sm text-[#b9a887] transition hover:text-white"
          >
            Get in touch ↗
          </a>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/50">
            <a
              href="https://www.facebook.com/junayed.hasan.302/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Facebook ↗
            </a>

            <a
              href="https://www.instagram.com/jhjunayed/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Instagram ↗
            </a>

            <a
              href="https://www.pexels.com/@junayed-hasan-2156679708/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Pexels ↗
            </a>

            <a
              href="https://github.com/junayedhasan302"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <p className="text-xs tracking-wide text-white/40">
          © {new Date().getFullYear()} Junayed Hasan Photography
        </p>
      </div>
    </footer>
  );
}
