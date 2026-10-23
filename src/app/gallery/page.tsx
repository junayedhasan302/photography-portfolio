
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { photos } from "@/data/photos";
import Lightbox from "@/components/Lightbox";
import Navbar from "@/components/Navbar";

type GalleryView = "grid" | "original";

type PhotoDimensions = {
  width: number;
  height: number;
};

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const photoButtonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const previousPhotoId = useRef<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<GalleryView>("grid");
  const [photoDimensions, setPhotoDimensions] = useState<
    Record<number, PhotoDimensions>
  >({});

  // Get all unique categories dynamically.
  const categories = [
    "All",
    ...Array.from(new Set(photos.map((photo) => photo.category))),
  ];

  // Filter photos by category and search query.
  const filteredPhotos = photos.filter((photo) => {
    const matchesCategory =
      selectedCategory === "All" || photo.category === selectedCategory;

    const matchesSearch = photo.title
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Store each image's actual dimensions.
  const handleImageLoad = (
    photoId: number,
    image: HTMLImageElement,
  ) => {
    const { naturalWidth, naturalHeight } = image;

    if (!naturalWidth || !naturalHeight) return;

    setPhotoDimensions((current) => {
      const existing = current[photoId];

      if (
        existing?.width === naturalWidth &&
        existing?.height === naturalHeight
      ) {
        return current;
      }

      return {
        ...current,
        [photoId]: {
          width: naturalWidth,
          height: naturalHeight,
        },
      };
    });
  };

  // Close the lightbox and restore focus to the selected photo.
  const closeLightbox = () => {
    setSelectedIndex(null);

    requestAnimationFrame(() => {
      const photoId = previousPhotoId.current;

      if (photoId !== null) {
        photoButtonRefs.current.get(photoId)?.focus();
      }
    });
  };

  // Open a photo in the lightbox.
  const openLightbox = (photoId: number) => {
    const index = filteredPhotos.findIndex((photo) => photo.id === photoId);

    if (index === -1) return;

    previousPhotoId.current = filteredPhotos[index].id;
    setSelectedIndex(index);
  };

  // Navigate to the next photo.
  const showNextPhoto = () => {
    setSelectedIndex((current) => {
      if (current === null || filteredPhotos.length === 0) return current;

      return (current + 1) % filteredPhotos.length;
    });
  };

  // Navigate to the previous photo.
  const showPreviousPhoto = () => {
    setSelectedIndex((current) => {
      if (current === null || filteredPhotos.length === 0) return current;

      return (current - 1 + filteredPhotos.length) % filteredPhotos.length;
    });
  };

  // Reset search, category, and lightbox.
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    closeLightbox();
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background px-5 py-12 text-foreground sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Back to Home */}
          <Link
            href="/"
            className="text-sm text-muted transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            ← Back to Home
          </Link>

          {/* Page Heading */}
          <div className="mt-10 mb-10">
            <p className="mb-3 text-[10px] tracking-[0.3em] text-accent uppercase sm:text-xs">
              My Photography
            </p>

            <h1 className="text-4xl font-light tracking-tight sm:text-5xl">
              All Photographs
            </h1>

            <p className="mt-4 text-sm leading-7 text-muted">
              A collection of {filteredPhotos.length} moments captured through
              my lens.
            </p>
          </div>

          {/* Photo Search */}
          <div className="mb-6 max-w-md">
            <label
              htmlFor="photo-search"
              className="mb-2 block text-sm text-muted"
            >
              Search photographs
            </label>

            <input
              id="photo-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by photo name..."
              className="w-full rounded-sm border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/30"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs text-accent transition hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Clear search ×
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div
            className="mb-8 flex flex-wrap gap-3"
            aria-label="Filter by photo category"
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  closeLightbox();
                  setSelectedCategory(category);
                }}
                aria-pressed={selectedCategory === category}
                className={`rounded-sm border px-4 py-2 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
                  selectedCategory === category
                    ? "border-accent bg-accent text-background"
                    : "border-border text-muted hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count and View Toggle */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted" aria-live="polite">
              Showing {filteredPhotos.length} of {photos.length} photographs
            </p>

            <div
              role="group"
              aria-label="Gallery layout"
              className="inline-flex w-fit items-center rounded-sm border border-border p-1"
            >
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
                className={`rounded-sm px-3 py-2 text-xs transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:text-sm ${
                  viewMode === "grid"
                    ? "bg-accent text-background"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <span aria-hidden="true">▦ </span>
                Default Grid
              </button>

              <button
                type="button"
                onClick={() => setViewMode("original")}
                aria-pressed={viewMode === "original"}
                className={`rounded-sm px-3 py-2 text-xs transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:text-sm ${
                  viewMode === "original"
                    ? "bg-accent text-background"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <span aria-hidden="true">▥ </span>
                Original Ratio
              </button>
            </div>
          </div>

          {/* Reset All Filters */}
          {(searchQuery || selectedCategory !== "All") && (
            <button
              type="button"
              onClick={resetFilters}
              className="mb-6 text-sm text-accent transition hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Reset all filters ↺
            </button>
          )}

          {/* Photography Gallery */}
          {filteredPhotos.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
                  : "columns-1 gap-x-5 sm:columns-2 lg:columns-3"
              }
            >
              {filteredPhotos.map((photo) => {
                const dimensions = photoDimensions[photo.id];

                return (
                  <article
                    key={photo.id}
                    className={`group min-w-0 ${
                      viewMode === "original"
                        ? "mb-8 break-inside-avoid"
                        : ""
                    }`}
                  >
                    <button
                      ref={(element) => {
                        if (element) {
                          photoButtonRefs.current.set(photo.id, element);
                        } else {
                          photoButtonRefs.current.delete(photo.id);
                        }
                      }}
                      type="button"
                      onClick={() => openLightbox(photo.id)}
                      aria-label={`View ${photo.title}`}
                      className="block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                      <div
                        className={
                          viewMode === "grid"
                            ? "relative aspect-[4/3] overflow-hidden rounded-sm bg-surface-hover"
                            : "overflow-hidden rounded-sm bg-surface-hover"
                        }
                      >
                        <Image
                          src={photo.src}
                          alt={photo.title}
                          width={dimensions?.width ?? 1200}
                          height={dimensions?.height ?? 900}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          onLoad={(event) =>
                            handleImageLoad(photo.id, event.currentTarget)
                          }
                          className={
                            viewMode === "grid"
                              ? "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                              : "h-auto w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
                          }
                        />
                      </div>

                      <div className="mt-3">
                        <h2 className="text-base font-medium tracking-tight">
                          {photo.title}
                        </h2>

                        <p className="mt-1 text-xs text-muted">
                          {photo.category}
                        </p>
                      </div>
                    </button>

                    <Link
                      href={`/photos/${photo.id}`}
                      className="mt-3 inline-flex items-center gap-2 text-xs text-accent transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                      View Details
                      <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-muted">
              No photographs found. Try another search or category.
            </p>
          )}

          {/* Reusable Lightbox */}
          {selectedIndex !== null && (
            <Lightbox
              photos={filteredPhotos}
              selectedIndex={selectedIndex}
              onClose={closeLightbox}
              onNext={showNextPhoto}
              onPrevious={showPreviousPhoto}
            />
          )}
        </div>
      </main>
    </>
  );
}
