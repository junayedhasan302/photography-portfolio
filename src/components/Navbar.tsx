
"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDark = theme === "dark";

  const navText = isDark
    ? "text-white/70 hover:text-white"
    : "text-neutral-600 hover:text-black";

  const mobileNavText = isDark
    ? "border-white/10 text-white/80 hover:bg-white/5 hover:text-white"
    : "border-black/10 text-neutral-700 hover:bg-black/5 hover:text-black";

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        isDark
          ? "border-white/10 bg-[#0c0c0c]/90"
          : "border-black/10 bg-[#faf9f6]/90"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 sm:gap-4 sm:px-8 sm:py-5 lg:px-12"
      >
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMenu}
          className={`shrink-0 text-sm font-semibold tracking-[0.2em] sm:text-base ${
            isDark ? "text-white" : "text-neutral-900"
          }`}
        >
          JUNAYED<span className="text-accent">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 text-xs sm:flex sm:text-sm lg:gap-6">
          <Link href="/#work" className={`transition-colors ${navText}`}>
            Work
          </Link>

          <Link href="/#albums" className={`transition-colors ${navText}`}>
            Albums
          </Link>

          <Link href="/#about" className={`transition-colors ${navText}`}>
            About
          </Link>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();

              toggleTheme(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
              );
            }}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            title={`Switch to ${isDark ? "light" : "dark"} theme`}
            className={`flex size-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
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
                <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l-1.42-1.42m11.3-11.3 1.42-1.42" />
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

          {/* Desktop Contact */}
          <Link
            href="/#contact"
            className={`hidden whitespace-nowrap border px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:inline-flex ${
              isDark
                ? "border-white/25 text-white hover:bg-white hover:text-black"
                : "border-black/20 text-neutral-900 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            Contact
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className={`flex size-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:hidden ${
              isDark
                ? "border-white/20 text-white hover:bg-white/10"
                : "border-black/15 text-neutral-800 hover:bg-black/5"
            }`}
          >
            {isMenuOpen ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="size-5"
                aria-hidden="true"
              >
                <path d="m6 6 12 12M18 6 6 18" />
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
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className={`border-t px-5 pb-5 sm:hidden ${
            isDark ? "border-white/10" : "border-black/10"
          }`}
        >
          <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl">
            <div className="flex flex-col">
              {[
                { label: "Work", href: "/#work" },
                { label: "Albums", href: "/#albums" },
                { label: "About", href: "/#about" },
                { label: "Contact", href: "/#contact" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className={`border-b px-3 py-3.5 text-sm transition-colors last:border-b-0 ${mobileNavText}`}
                >
                  {item.label}
                  <span className="float-right" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
