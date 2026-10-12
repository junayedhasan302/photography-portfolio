"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { photos } from "@/data/photos";

export default function GalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#10110f] px-5 py-12 text-[#f4f0e8] sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="text-sm text-white/60 transition hover:text-white"
        >
          ← Back to Home
        </Link>

        <div className="mt-10 mb-10">
          <p className="mb-3 text-xs tracking-[0.3em] text-[#b9a887] uppercase">
            My Photography
          </p>

          <h1 className="text-4xl font-light sm:text-5xl">All Photographs</h1>

          <p className="mt-4 text-sm text-white/50">
            A collection of {photos.length} moments captured through my lens.
          </p>
        </div>

        {/* Photography Grid */}
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <article
              key={photo.id}
              className="group cursor-pointer"
              onClick={() => {
                setSelectedPhoto(photo.src);
                setSelectedIndex(
                  photos.findIndex((item) => item.id === photo.id),
                );
              }}
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

        {/* Lightbox */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-5 right-5 z-10 text-4xl text-white transition hover:text-[#b9a887]"
              aria-label="Close image"
            >
              &times;
            </button>

            <div
              className="relative h-[80vh] w-full max-w-5xl"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Previous  */}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();

                  if (selectedIndex !== null) {
                    const previousIndex =
                      (selectedIndex - 1 + photos.length) % photos.length;

                    setSelectedIndex(previousIndex);
                    setSelectedPhoto(photos[previousIndex].src);
                  }
                }}
                className="absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-black/50 px-4 py-3 text-2xl text-white transition hover:bg-black/80 sm:left-4"
                aria-label="Previous photo"
              >
                ‹
              </button>
              <Image
                src={selectedPhoto}
                alt="Selected photograph"
                fill
                sizes="100vw"
                className="object-contain"
              />
              {/* Next  */}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();

                  if (selectedIndex !== null) {
                    const nextIndex = (selectedIndex + 1) % photos.length;

                    setSelectedIndex(nextIndex);
                    setSelectedPhoto(photos[nextIndex].src);
                  }
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
