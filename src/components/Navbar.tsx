
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-white/10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.2em] sm:text-base"
        >
          JUNAYED<span className="text-[#b9a887]">.</span>
        </Link>

        <div className="flex items-center gap-4 text-xs text-white/70 sm:gap-7 sm:text-sm">
          <Link href="#work" className="transition hover:text-white">
            Work
          </Link>

          <Link href="#albums" className="transition hover:text-white">
            Albums
          </Link>

          <Link
            href="#about"
            className="hidden transition hover:text-white sm:block"
          >
            About
          </Link>

          <Link
            href="#contact"
            className="border border-white/25 px-3 py-2 transition hover:bg-white hover:text-black sm:px-4"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
