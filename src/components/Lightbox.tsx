
"use client";

import type { Photo } from "@/data/photos";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type LightboxProps = {
  photos: Photo[];
  selectedIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

type Direction = "next" | "previous";

const SWIPE_THRESHOLD = 50;
const ANIMATION_DURATION = 280;

export default function Lightbox({
  photos,
  selectedIndex,
  onClose,
  onNext,
  onPrevious,
}: LightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const previousIndexRef = useRef(selectedIndex);
  const animationFrameRef = useRef<number | null>(null);

  const [direction, setDirection] = useState<Direction>("next");
  const [isAnimating, setIsAnimating] = useState(false);

  const selectedPhoto = photos[selectedIndex];

  useEffect(() => {
    closeButtonRef.current?.focus();

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Animate whenever the selected photo changes.
  useEffect(() => {
    if (previousIndexRef.current === selectedIndex) return;

    previousIndexRef.current = selectedIndex;
    setIsAnimating(true);

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      animationFrameRef.current = requestAnimationFrame(() => {
        setIsAnimating(false);
        animationFrameRef.current = null;
      });
    });
  }, [selectedIndex]);

  const getFocusableElements = useCallback(() => {
    const elements = lightboxRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    return Array.from(elements ?? []).filter(
      (element) =>
        !element.hidden &&
        element.getAttribute("aria-hidden") !== "true" &&
        element.getClientRects().length > 0,
    );
  }, []);

  // Keep keyboard focus inside the lightbox.
  useEffect(() => {
    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const elements = getFocusableElements();

      if (elements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (!lightboxRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTabKey);

    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }, [getFocusableElements]);

  // Handle keyboard shortcuts.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setDirection("next");
        onNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setDirection("previous");
        onPrevious();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onNext, onPrevious]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;

    if (!start) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (
      Math.abs(deltaX) < SWIPE_THRESHOLD ||
      Math.abs(deltaX) <= Math.abs(deltaY)
    ) {
      return;
    }

    if (deltaX < 0) {
      setDirection("next");
      onNext();
    } else {
      setDirection("previous");
      onPrevious();
    }
  };

  if (!selectedPhoto) return null;

  return (
    <div
      ref={lightboxRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-3 sm:p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close image"
        className="absolute top-3 right-3 z-20 flex size-11 items-center justify-center rounded-full border border-border bg-surface/80 text-3xl text-foreground transition-colors hover:bg-surface-hover hover:text-accent sm:top-5 sm:right-5"
      >
        &times;
      </button>

      {/* Image Viewer */}
      <div
        className="relative h-[78dvh] w-full max-w-5xl touch-pan-y select-none sm:h-[85vh]"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          touchStartRef.current = null;
        }}
      >
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => {
            setDirection("previous");
            onPrevious();
          }}
          aria-label="Previous photo"
          className="absolute top-1/2 left-1 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/80 text-3xl text-foreground transition-colors hover:bg-surface-hover hover:text-accent sm:left-4 sm:size-12"
        >
          ‹
        </button>

        {/* Animated Photo */}
        <div
          key={selectedPhoto.id}
          className="absolute inset-0"
          style={{
            animation: `lightbox-slide-in ${ANIMATION_DURATION}ms ease-out both`,
            ["--slide-direction" as string]:
              direction === "next" ? "1" : "-1",
          }}
        >
          <Image
            src={selectedPhoto.src}
            alt={selectedPhoto.title}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 90vw"
            className="pointer-events-none object-contain"
          />
        </div>

        {/* Photo Information */}
        <div
          className={`absolute right-0 bottom-0 left-0 z-10 border-t border-border bg-surface/90 px-12 py-3 text-center transition-opacity duration-200 ${
            isAnimating ? "opacity-70" : "opacity-100"
          }`}
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-sm font-medium text-foreground sm:text-base">
            {selectedPhoto.title}
          </p>

          <p className="mt-1 text-xs text-muted">
            {selectedIndex + 1} / {photos.length}
          </p>

          <p className="mt-1 text-[10px] text-muted sm:hidden">
            Swipe to navigate
          </p>
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => {
            setDirection("next");
            onNext();
          }}
          aria-label="Next photo"
          className="absolute top-1/2 right-1 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/80 text-3xl text-foreground transition-colors hover:bg-surface-hover hover:text-accent sm:right-4 sm:size-12"
        >
          ›
        </button>
      </div>

      <style jsx>{`
        @keyframes lightbox-slide-in {
          from {
            opacity: 0;
            transform: translateX(calc(var(--slide-direction) * 24px));
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes lightbox-slide-in {
            from,
            to {
              opacity: 1;
              transform: none;
            }
          }
        }
      `}</style>
    </div>
  );
}
