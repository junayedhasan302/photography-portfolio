
"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const navText = isDark
    ? "text-white/70 hover:text-white"
    : "text-neutral-600 hover:text-black";

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        isDark
          ? "border-white/10 bg-[#0c0c0c]/90"
          : "border-black/10 bg-[#faf9f6]/90"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className={`shrink-0 text-sm font-semibold tracking-[0.2em] sm:text-base ${
            isDark ? "text-white" : "text-neutral-900"
          }`}
        >
          JUNAYED<span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden items-center gap-5 text-xs sm:flex sm:text-sm">
            <Link href="/#work" className={`transition ${navText}`}>
              Work
            </Link>

            <Link href="/#albums" className={`transition ${navText}`}>
              Albums
            </Link>

            <Link href="/#about" className={`transition ${navText}`}>
              About
            </Link>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            title={`Switch to ${isDark ? "light" : "dark"} theme`}
            className={`flex size-10 items-center justify-center rounded-full border transition ${
              isDark
                ? "border-white/20 text-white hover:bg-white/10"
                : "border-black/15 text-neutral-800 hover:bg-black/5"
            }`}
          >
            {isDark ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="size-5"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="size-5"
                aria-hidden="true"
              >
                <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
              </svg>
            )}
          </button>

          <Link
            href="/#contact"
            className={`whitespace-nowrap border px-3 py-2 text-xs transition sm:px-4 sm:text-sm ${
              isDark
                ? "border-white/25 text-white hover:bg-white hover:text-black"
                : "border-black/20 text-neutral-900 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
