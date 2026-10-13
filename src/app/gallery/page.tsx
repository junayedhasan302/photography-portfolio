"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { photos } from "@/data/photos";
import Lightbox from "@/components/Lightbox";

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const photoButtonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const previousPhotoId = useRef<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Close the lightbox.

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
    if (selectedIndex === null || filteredPhotos.length === 0) return;

    setSelectedIndex((selectedIndex + 1) % filteredPhotos.length);
  };

  // Navigate to the previous photo.
  const showPreviousPhoto = () => {
    if (selectedIndex === null || filteredPhotos.length === 0) return;

    setSelectedIndex(
      (selectedIndex - 1 + filteredPhotos.length) % filteredPhotos.length,
    );
  };

  // Handle keyboard navigation while the lightbox is open.
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextPhoto();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPreviousPhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, filteredPhotos]);

  // Reset search, category, and lightbox.
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    closeLightbox();
  };

  return (
    <main className="min-h-screen bg-[#10110f] px-5 py-12 text-[#f4f0e8] sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Back to Home */}
        <Link
          href="/"
          className="text-sm text-white/60 transition hover:text-white"
        >
          ← Back to Home
        </Link>

        {/* Page Heading */}
        <div className="mt-10 mb-10">
          <p className="mb-3 text-xs tracking-[0.3em] text-[#b9a887] uppercase">
            My Photography
          </p>

          <h1 className="text-4xl font-light sm:text-5xl">All Photographs</h1>

          <p className="mt-4 text-sm text-white/50">
            A collection of {filteredPhotos.length} moments captured through my
            lens.
          </p>
        </div>

        {/* Photo Search */}
        <div className="mb-6 max-w-md">
          <label
            htmlFor="photo-search"
            className="mb-2 block text-sm text-white/60"
          >
            Search photographs
          </label>

          <input
            id="photo-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by photo name..."
            className="w-full border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#b9a887]"
          />

          {/* Clear Search */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-2 text-xs text-[#b9a887] transition hover:text-white"
            >
              Clear search ×
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                closeLightbox();
                setSelectedCategory(category);
              }}
              aria-pressed={selectedCategory === category}
              className={`border px-4 py-2 text-sm transition ${
                selectedCategory === category
                  ? "border-[#b9a887] bg-[#b9a887] text-black"
                  : "border-white/15 text-white/60 hover:border-white/40 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Results Count */}
        <p className="mb-5 text-xs text-white/40">
          Showing {filteredPhotos.length} of {photos.length} photographs
        </p>

        {/* Reset All Filters */}
        {(searchQuery || selectedCategory !== "All") && (
          <button
            type="button"
            onClick={resetFilters}
            className="mb-6 text-sm text-[#b9a887] transition hover:text-white"
          >
            Reset all filters ↺
          </button>
        )}

        {/* Photography Grid */}
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPhotos.map((photo) => (
              <article key={photo.id} className="group">
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
                  className="block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9a887]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-3">
                    <h2 className="text-base font-medium">{photo.title}</h2>

                    <p className="mt-1 text-xs text-white/50">
                      {photo.category}
                    </p>
                  </div>
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-white/50">
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
  );
}
