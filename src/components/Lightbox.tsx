import type { Photo } from "@/data/photos";
import Image from "next/image";
import { useEffect, useRef } from "react";

type LightboxProps = {
  photos: Photo[];
  selectedIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

export default function Lightbox({
  photos,
  selectedIndex,
  onClose,
  onNext,
  onPrevious,
}: LightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);
  const selectedPhoto = photos[selectedIndex];

  if (!selectedPhoto) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close image"
        className="absolute top-5 right-5 z-20 text-4xl text-white hover:text-[#b9a887]"
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
          onClick={onPrevious}
          aria-label="Previous photo"
          className="absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-black/50 px-4 py-3 text-2xl text-white hover:bg-black/80 sm:left-4"
        >
          ‹
        </button>

        {/* Selected Photo */}
        <Image
          src={selectedPhoto.src}
          alt={selectedPhoto.title}
          fill
          sizes="100vw"
          className="object-contain"
        />

        {/* Photo Information */}
        <div className="absolute right-0 bottom-0 left-0 z-10 bg-black/60 px-4 py-3 text-center">
          <p className="text-sm font-medium text-white">
            {selectedPhoto.title}
          </p>

          <p className="mt-1 text-xs text-white/60">
            {selectedIndex + 1} / {photos.length}
          </p>
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={onNext}
          aria-label="Next photo"
          className="absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-black/50 px-4 py-3 text-2xl text-white hover:bg-black/80 sm:right-4"
        >
          ›
        </button>
      </div>
    </div>
  );
}
