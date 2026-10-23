
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
import { flushSync } from "react-dom";

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

function getSavedTheme(fallback: Theme): Theme {
  try {
    const cookieTheme = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("portfolio-theme="))
      ?.split("=")[1];

    const localTheme = localStorage.getItem("portfolio-theme");

    if (cookieTheme === "light" || cookieTheme === "dark") {
      return cookieTheme;
    }

    if (localTheme === "light" || localTheme === "dark") {
      return localTheme;
    }
  } catch {
    // Use the provided fallback when browser storage is unavailable.
  }

  return fallback;
}

export default function ThemeProvider({
  children,
  initialTheme,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const themeRef = useRef<Theme>(initialTheme);
  const transitionRef = useRef<ViewTransitionHandle | null>(null);

  // Restore the saved theme after mounting.
  useEffect(() => {
    const savedTheme = getSavedTheme(initialTheme);

    themeRef.current = savedTheme;
    saveTheme(savedTheme);
    setTheme(savedTheme);

    return () => {
      const activeTransition = transitionRef.current;

      transitionRef.current = null;
      activeTransition?.skipTransition();
    };
  }, [initialTheme]);

  const toggleTheme = useCallback((x?: number, y?: number) => {
    // Count every click using the latest requested theme.
    const nextTheme: Theme =
      themeRef.current === "dark" ? "light" : "dark";

    themeRef.current = nextTheme;

    const root = document.documentElement;
    const viewDocument = document as ViewTransitionDocument;
    const startViewTransition = viewDocument.startViewTransition;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Cancel an active reveal before starting another one.
    const previousTransition = transitionRef.current;

    if (previousTransition) {
      transitionRef.current = null;
      previousTransition.skipTransition();
    }

    // Without animation, apply the theme immediately.
    if (reduceMotion || !startViewTransition) {
      saveTheme(nextTheme);
      setTheme(nextTheme);
      return;
    }

    // Use the clicked button's center as the reveal origin.
    const centerX = x ?? window.innerWidth / 2;
    const centerY = y ?? window.innerHeight / 2;

    // Calculate a radius that covers all viewport corners.
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

    try {
      const transition = startViewTransition.call(
        viewDocument,
        () => {
          // Commit React's DOM update inside the transition callback.
          // Read the latest value so rapid clicks are not lost.
          const latestTheme = themeRef.current;

          flushSync(() => {
            saveTheme(latestTheme);
            setTheme(latestTheme);
          });
        },
      );

      transitionRef.current = transition;

      // Release only this transition's reference when it settles.
      void transition.finished
        .catch(() => {
          // Skipping a transition during rapid clicks is expected.
        })
        .finally(() => {
          if (transitionRef.current === transition) {
            transitionRef.current = null;
          }
        });
    } catch {
      // Keep the theme functional if the browser rejects animation.
      saveTheme(themeRef.current);
      setTheme(themeRef.current);
    }
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
