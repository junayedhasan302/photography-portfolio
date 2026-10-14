
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: (x?: number, y?: number) => void;
};

type ThemeProviderProps = {
  children: ReactNode;
  initialTheme: Theme;
};

type ViewTransitionHandle = {
  skipTransition: () => void;
  finished: Promise<void>;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (
    callback: () => void,
  ) => ViewTransitionHandle;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function saveTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;

  try {
    document.cookie = `portfolio-theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
    localStorage.setItem("portfolio-theme", theme);
  } catch {
    // Keep the selected theme for the current session.
  }
}

export default function ThemeProvider({
  children,
  initialTheme,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const themeRef = useRef<Theme>(initialTheme);
  const transitionRef = useRef<ViewTransitionHandle | null>(null);

  useEffect(() => {
    try {
      const cookieTheme = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("portfolio-theme="))
        ?.split("=")[1];

      const localTheme = localStorage.getItem("portfolio-theme");

      const savedTheme: Theme =
        cookieTheme === "light" || cookieTheme === "dark"
          ? cookieTheme
          : localTheme === "light" || localTheme === "dark"
            ? localTheme
            : initialTheme;

      themeRef.current = savedTheme;
      saveTheme(savedTheme);
      setTheme(savedTheme);
    } catch {
      themeRef.current = initialTheme;
      document.documentElement.dataset.theme = initialTheme;
      setTheme(initialTheme);
    }
  }, [initialTheme]);

  const toggleTheme = useCallback((x?: number, y?: number) => {
    const nextTheme: Theme =
      themeRef.current === "dark" ? "light" : "dark";

    // Update the reference immediately for rapid clicks.
    themeRef.current = nextTheme;

    const root = document.documentElement;
    const viewDocument = document as ViewTransitionDocument;

    // Use the center of the clicked button as the reveal origin.
    const centerX = x ?? window.innerWidth / 2;
    const centerY = y ?? window.innerHeight / 2;

    // Calculate a radius large enough to reach every viewport corner.
    const radius = Math.ceil(
      Math.max(
        Math.hypot(centerX, centerY),
        Math.hypot(window.innerWidth - centerX, centerY),
        Math.hypot(centerX, window.innerHeight - centerY),
        Math.hypot(
          window.innerWidth - centerX,
          window.innerHeight - centerY,
        ),
      ),
    );

    root.style.setProperty("--theme-x", `${centerX}px`);
    root.style.setProperty("--theme-y", `${centerY}px`);
    root.style.setProperty("--theme-radius", `${radius}px`);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const startViewTransition = viewDocument.startViewTransition;

    // Skip any previous animation instead of waiting for it to finish.
    if (transitionRef.current) {
      transitionRef.current.skipTransition();
      transitionRef.current = null;
    }

    // Fall back to an immediate theme change when animation is unavailable.
    if (reduceMotion || !startViewTransition) {
      saveTheme(nextTheme);
      setTheme(nextTheme);
      return;
    }

    const transition = startViewTransition.call(
      viewDocument,
      () => {
        // Always apply the latest requested theme.
        const latestTheme = themeRef.current;

        saveTheme(latestTheme);
        setTheme(latestTheme);
      },
    );

    transitionRef.current = transition;

    // Clear the reference when this transition finishes.
    void transition.finished
      .catch(() => {
        // A skipped transition is expected during rapid clicks.
      })
      .finally(() => {
        if (transitionRef.current === transition) {
          transitionRef.current = null;
        }
      });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
