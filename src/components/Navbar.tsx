
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

const navigationItems = [
  { label: "Work", href: "/#work", id: "work" },
  { label: "Albums", href: "/#albums", id: "albums" },
  { label: "About", href: "/#about", id: "about" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const isDark = theme === "dark";

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = navigationItems
        .map((item) => document.getElementById(item.id))
        .filter((section): section is HTMLElement => section !== null);

      let currentSection = "";

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 160) {
          currentSection = section.id;
        }
      }

      setActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navText = isDark
    ? "text-white/65 hover:text-[#d0c1a1]"
    : "text-neutral-600 hover:text-[#80683f]";

  const mobileNavText = isDark
    ? "border-white/10 text-white/80 hover:bg-white/5 hover:text-[#d0c1a1]"
    : "border-[#d8d0c0] text-neutral-700 hover:bg-[#80683f]/5 hover:text-[#80683f]";

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
        isDark
          ? `border-white/10 bg-[#0c0c0c]/95 ${
              isScrolled ? "shadow-lg shadow-black/10" : ""
            }`
          : `border-[#d8d0c0] bg-[#faf9f6]/95 ${
              isScrolled ? "shadow-lg shadow-[#80683f]/5" : ""
            }`
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3.5 sm:gap-6 sm:px-8 sm:py-4 lg:px-12"
      >
        {/* Brand: replace this text with your logo later */}
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="Junayed Photography home"
          className={`group flex shrink-0 flex-col ${
            isDark ? "text-white" : "text-neutral-900"
          }`}
        >
          <span className="font-serif text-lg font-medium tracking-[0.16em] sm:text-xl">
            JUNAYED<span className="text-accent">.</span>
          </span>

          <span
            className={`mt-0.5 text-[9px] uppercase tracking-[0.24em] ${
              isDark ? "text-white/45" : "text-neutral-500"
            }`}
          >
            Photography
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 sm:flex lg:gap-9">
          {navigationItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={isActive ? "location" : undefined}
                className={`group relative py-2 font-serif text-sm tracking-wide transition-colors duration-200 ${
                  isActive
                    ? isDark
                      ? "text-[#d0c1a1]"
                      : "text-[#80683f]"
                    : navText
                }`}
              >
                {item.label}

                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-px h-px origin-left bg-accent transition-transform duration-300 ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
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
                ? "border-white/20 text-white hover:border-[#b9a887]/60 hover:bg-white/5"
                : "border-[#d8d0c0] text-neutral-800 hover:border-[#80683f]/60 hover:bg-[#80683f]/5"
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
            className={`hidden items-center gap-2 border px-4 py-2 font-serif text-sm tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:inline-flex ${
              isDark
                ? "border-[#b9a887]/50 text-[#d0c1a1] hover:bg-[#b9a887] hover:text-[#0c0c0c]"
                : "border-[#80683f]/45 text-[#624e2d] hover:bg-[#80683f] hover:text-white"
            }`}
          >
            Contact
            <span aria-hidden="true">↗</span>
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
                : "border-[#d8d0c0] text-neutral-800 hover:bg-[#80683f]/5"
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
            isDark ? "border-white/10" : "border-[#d8d0c0]"
          }`}
        >
          <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl">
            <div className="flex flex-col">
              {[
                ...navigationItems,
                { label: "Contact", href: "/#contact", id: "contact" },
              ].map((item, index) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center justify-between border-b px-3 py-4 font-serif text-sm tracking-wide transition-colors last:border-b-0 ${mobileNavText}`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`text-[10px] tracking-widest ${
                        isDark ? "text-white/35" : "text-neutral-400"
                      }`}
                    >
                      0{index + 1}
                    </span>
                    {item.label}
                  </span>

                  <span className="text-accent" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              ))}
            </div>

            <p
              className={`mt-5 font-serif text-xs italic ${
                isDark ? "text-white/40" : "text-neutral-500"
              }`}
            >
              Stories, preserved in a frame.
            </p>
          </nav>
        </div>
      )}
    </header>
  );
}
