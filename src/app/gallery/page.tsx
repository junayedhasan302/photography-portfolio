"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { photos } from "@/data/photos";

export default function GalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Get all unique categories dynamically.
  const categories = [
    "All",
    ...Array.from(new Set(photos.map((photo) => photo.category))),
  ];

  // Filter photos based on the selected category.

  const filteredPhotos = photos.filter((photo) => {
    const matchesCategory =
      selectedCategory === "All" || photo.category === selectedCategory;

    const matchesSearch = photo.title
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Close the lightbox and reset its state.
  const closeLightbox = () => {
    setSelectedPhoto(null);
    setSelectedIndex(null);
  };

  // Open a photo in the lightbox.
  const openLightbox = (photoId: number) => {
    const index = filteredPhotos.findIndex((photo) => photo.id === photoId);

    if (index === -1) return;

    setSelectedIndex(index);
    setSelectedPhoto(filteredPhotos[index].src);
  };

  // Navigate between photos using the keyboard.
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowRight") {
        const nextIndex = (selectedIndex + 1) % filteredPhotos.length;

        setSelectedIndex(nextIndex);
        setSelectedPhoto(filteredPhotos[nextIndex].src);
      }

      if (event.key === "ArrowLeft") {
        const previousIndex =
          (selectedIndex - 1 + filteredPhotos.length) % filteredPhotos.length;

        setSelectedIndex(previousIndex);
        setSelectedPhoto(filteredPhotos[previousIndex].src);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, filteredPhotos]);

  return (
    <main className="min-h-screen bg-[#10110f] px-5 py-12 text-[#f4f0e8] sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-7xl">
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
        </div>

        {/* Clear Search INput */}
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="mt-2 text-xs text-[#b9a887] transition hover:text-white"
          >
            Clear search ×
          </button>
        )}

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

        {/* Photography Grid */}
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPhotos.map((photo) => (
              <article
                key={photo.id}
                className="group cursor-pointer"
                onClick={() => openLightbox(photo.id)}
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
                  <p className="mt-1 text-xs text-white/50">{photo.category}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-white/50">
            No photographs found in this category.
          </p>
        )}

        {/* Lightbox */}
        {selectedPhoto !== null && selectedIndex !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-5 right-5 z-20 text-4xl text-white transition hover:text-[#b9a887]"
              aria-label="Close image"
            >
              &times;
            </button>

            {/* Image Container */}
            <div
              className="relative h-[80vh] w-full max-w-5xl"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Previous Button */}
              <button
                type="button"
                onClick={() => {
                  const previousIndex =
                    (selectedIndex - 1 + filteredPhotos.length) %
                    filteredPhotos.length;

                  setSelectedIndex(previousIndex);
                  setSelectedPhoto(filteredPhotos[previousIndex].src);
                }}
                className="absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-black/50 px-4 py-3 text-2xl text-white transition hover:bg-black/80 sm:left-4"
                aria-label="Previous photo"
              >
                ‹
              </button>

              {/* Selected Photo */}
              <Image
                src={selectedPhoto}
                alt={filteredPhotos[selectedIndex].title}
                fill
                sizes="100vw"
                className="object-contain"
              />

              {/* Photo Information */}
              <div className="absolute right-0 bottom-0 left-0 z-10 bg-black/60 px-4 py-3 text-center">
                <p className="text-sm font-medium text-white">
                  {filteredPhotos[selectedIndex].title}
                </p>

                <p className="mt-1 text-xs text-white/60">
                  {selectedIndex + 1} / {filteredPhotos.length}
                </p>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => {
                  const nextIndex = (selectedIndex + 1) % filteredPhotos.length;

                  setSelectedIndex(nextIndex);
                  setSelectedPhoto(filteredPhotos[nextIndex].src);
                }}
                className="absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-black/50 px-4 py-3 text-2xl text-white transition hover:bg-black/80 sm:right-4"
                aria-label="Next photo"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
