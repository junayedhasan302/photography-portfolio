"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/data/photos";
import Lightbox from "@/components/Lightbox";

type AlbumGalleryProps = {
  photos: Photo[];
};

export default function AlbumGallery({ photos }: AlbumGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const photoButtonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const previousPhotoId = useRef<number | null>(null);

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

  // Navigate to the next photo.
  const showNextPhoto = () => {
    if (selectedIndex === null || photos.length === 0) return;

    setSelectedIndex((selectedIndex + 1) % photos.length);
  };

  // Navigate to the previous photo.
  const showPreviousPhoto = () => {
    if (selectedIndex === null || photos.length === 0) return;

    setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
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
  }, [selectedIndex, photos]);

  return (
    <>
      {/* Album Photo Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => (
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
                onClick={() => {
                  previousPhotoId.current = photo.id;
                  setSelectedIndex(index);
                }}
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
                  <p className="mt-1 text-xs text-white/50">{photo.category}</p>
                </div>
              </button>
            </article>
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-white/50">
          No photographs have been added to this album yet.
        </p>
      )}

      {/* Reusable Lightbox */}
      {selectedIndex !== null && (
        <Lightbox
          photos={photos}
          selectedIndex={selectedIndex}
          onClose={closeLightbox}
          onNext={showNextPhoto}
          onPrevious={showPreviousPhoto}
        />
      )}
    </>
  );
}
