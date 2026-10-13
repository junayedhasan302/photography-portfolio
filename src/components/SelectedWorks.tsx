
import Image from "next/image";
import Link from "next/link";
import { featuredPhotos } from "@/data/photos";

export default function SelectedWorks() {
  return (
    <section
      id="work"
      className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-xs tracking-[0.3em] text-accent uppercase">
            A Few Favorites
          </p>

          <h2 className="text-3xl font-light sm:text-4xl">
            Selected Works
          </h2>
        </div>

        <p className="hidden text-sm text-muted sm:block">
          Moments worth remembering.
        </p>

        <Link
          href="/gallery"
          className="shrink-0 text-sm text-accent transition hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          View All Photos ↗
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featuredPhotos.map((photo, index) => (
          <article
            key={photo.id}
            className={index === 0 ? "sm:col-span-2 lg:col-span-2" : ""}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-surface">
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                sizes={
                  index === 0
                    ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
                    : "(max-width: 640px) 100vw, 50vw"
                }
                className="object-cover transition duration-700 hover:scale-105"
              />
            </div>

            <div className="mt-4">
              <h3 className="text-base font-medium">{photo.title}</h3>

              <p className="mt-1 text-xs text-muted">{photo.category}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
